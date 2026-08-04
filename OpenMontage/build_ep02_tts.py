#!/usr/bin/env python3
"""06-tts synthesis for ep02: real narration + lip-sync captions.

Reads the shot-level 04 SSOT (one ``voice_slice`` per shot), synthesises each
slice with edge-tts or Doubao TTS, measures the real segment duration, and
captures sentence boundary timings. From those it builds **frame-anchored,
absolute-ms word captions** (the same ``WordCaption`` shape the Explainer /
VRMAvatar lip-sync consumes) and a single concatenated narration track.

Outputs:
  - content-library/ep02-video-render/06-tts/assets/<shot>.mp3   (per-shot audio)
  - remotion-composer/public/audio/ep02-narration.mp3            (concatenated)
  - content-library/ep02-video-render/06-tts/assets/manifest.json (timing + captions)

The 07 props generator (content-library/ep02-video-render/07-assembly/build_props.py) reads the manifest: it swaps
the storyboard estimate for the measured per-shot duration (06-tts is the timing
source of truth) and wires the captions + narration into the Explainer props so
the host actually lip-syncs.

Usage:
    python build_ep02_tts.py                          # edge-tts default voice
    python build_ep02_tts.py --voice zh-CN-YunxiNeural # edge-tts custom voice
    python build_ep02_tts.py --engine doubao           # doubao TTS (reads .env)
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import edge_tts

sys.path.insert(0, str(Path(__file__).resolve().parent))
from dotenv import load_dotenv  # noqa: E402
load_dotenv(Path(__file__).resolve().parent / ".env")
from tools.subtitle.segmentation import chunk_text, speech_weight  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_MD = REPO_ROOT / "content-library" / "ep02-video-render" / "04-script" / "README.md"
ASSETS = REPO_ROOT / "content-library" / "ep02-video-render" / "06-tts" / "assets"
COMPOSER_DIR = Path(__file__).resolve().parent / "remotion-composer"
NARRATION_OUT = COMPOSER_DIR / "public" / "audio" / "ep02-narration.mp3"
NARRATION_REL = "audio/ep02-narration.mp3"
MANIFEST = ASSETS / "manifest.json"

FPS = 30
DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural"
DOUBAO_SUBMIT_URL = "https://openspeech.bytedance.com/api/v3/tts/submit"
DOUBAO_QUERY_URL = "https://openspeech.bytedance.com/api/v3/tts/query"
DOUBAO_RESOURCE_ID = "seed-tts-2.0"


def load_shots() -> list[tuple[str, str, str]]:
    txt = SCRIPT_MD.read_text(encoding="utf-8")
    block = re.findall(r"```json\s*\n(.*?)\n```", txt, re.S)[-1]
    sections = json.loads(block)["sections"]
    out: list[tuple[str, str, str]] = []
    for sec in sections:
        for shot in sec.get("shots") or []:
            voice = (shot.get("voice_slice") or "").strip()
            out.append((str(sec["id"]), str(shot["id"]), voice))
    return out


async def _synth(text: str, voice: str, mp3_path: Path) -> list[tuple[float, float, str]]:
    comm = edge_tts.Communicate(text, voice)
    audio = b""
    boundaries: list[tuple[float, float, str]] = []
    async for ch in comm.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] in ("SentenceBoundary", "WordBoundary"):
            boundaries.append((ch["offset"] / 1e7, ch["duration"] / 1e7, ch["text"]))
    if not audio:
        raise RuntimeError(f"edge-tts returned no audio for: {text[:30]!r}")
    mp3_path.write_bytes(audio)
    return boundaries


def synth(text: str, voice: str, mp3_path: Path, retries: int = 3) -> list[tuple[float, float, str]]:
    last: Exception | None = None
    for attempt in range(retries):
        try:
            return asyncio.run(_synth(text, voice, mp3_path))
        except Exception as exc:  # network hiccups -> retry
            last = exc
            print(f"  retry {attempt + 1}/{retries} ({exc})")
    raise SystemExit(f"TTS failed after {retries} tries: {last}")


def _doubao_headers(api_key: str, request_id: str) -> dict[str, str]:
    return {
        "X-Api-Key": api_key,
        "X-Api-Resource-Id": DOUBAO_RESOURCE_ID,
        "X-Api-Request-Id": request_id,
        "Content-Type": "application/json",
    }


def synth_doubao(text: str, voice: str, mp3_path: Path, retries: int = 3) -> list[tuple[float, float, str]]:
    import requests as req
    import uuid as _uuid

    api_key = os.environ.get("DOUBAO_SPEECH_API_KEY")
    if not api_key:
        raise SystemExit("DOUBAO_SPEECH_API_KEY not set in OpenMontage/.env")

    last: Exception | None = None
    for attempt in range(retries):
        try:
            req_id = str(_uuid.uuid4())
            headers = _doubao_headers(api_key, req_id)
            body = {
                "user": {"uid": "openmontage"},
                "unique_id": req_id,
                "req_params": {
                    "text": text,
                    "speaker": voice,
                    "audio_params": {
                        "format": "mp3",
                        "sample_rate": 24000,
                        "speech_rate": 0,
                        "enable_timestamp": True,
                    },
                    "additions": json.dumps({"disable_markdown_filter": False}, ensure_ascii=False),
                },
            }
            resp = req.post(DOUBAO_SUBMIT_URL, headers=headers, json=body, timeout=(10, 60))
            data = resp.json()
            if resp.status_code >= 400 or data.get("code") != 20000000:
                raise RuntimeError(f"Doubao submit error: {data.get('message', data.get('code'))}")
            task_id = data["data"]["task_id"]

            # Poll for completion
            for _ in range(60):
                time.sleep(2)
                qheaders = _doubao_headers(api_key, str(_uuid.uuid4()))
                qresp = req.post(DOUBAO_QUERY_URL, headers=qheaders, json={"task_id": task_id}, timeout=(10, 60))
                qdata = qresp.json()
                status = qdata.get("data", {}).get("task_status")
                if status == 2:
                    audio_url = qdata["data"]["audio_url"]
                    audio_resp = req.get(audio_url, timeout=(10, 120))
                    mp3_path.write_bytes(audio_resp.content)
                    # Parse sentence boundaries from Doubao response
                    # Doubao returns startTime/endTime in SECONDS (not ms, not snake_case)
                    boundaries: list[tuple[float, float, str]] = []
                    for sent in qdata.get("data", {}).get("sentences", []):
                        start_s = float(sent.get("startTime", 0))
                        end_s = float(sent.get("endTime", start_s))
                        dur_s = end_s - start_s
                        boundaries.append((start_s, dur_s, sent.get("text", "")))
                    return boundaries
                elif status == 3:
                    raise RuntimeError(f"Doubao task failed: {qdata.get('message')}")
            raise TimeoutError("Doubao task did not finish within 120 seconds")
        except Exception as exc:
            last = exc
            print(f"  retry {attempt + 1}/{retries} ({exc})")
    raise SystemExit(f"Doubao TTS failed after {retries} tries: {last}")


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=nk=1:nw=1",
            str(path),
        ]
    )
    return float(out.decode().strip())


def build_captions(
    boundaries: list[tuple[float, float, str]],
    shot_dur_s: float,
    voice_slice: str,
) -> list[dict[str, Any]]:
    """Shot-relative-ms WordCaption list for one shot.

    Timestamps are relative to the shot's own start; the 07 props generator
    (build_props.py) offsets them onto the absolute timeline.

    Anchors to the engine's sentence boundaries (real speech timing); within each
    sentence, time is split across clause chunks proportional to their spoken
    weight (CJK syllables + ASCII words), not raw character count.
    Falls back to one caption spanning the whole shot if no boundaries fired.
    """
    caps: list[dict[str, Any]] = []
    if not boundaries:
        caps.append({
            "word": voice_slice,
            "startMs": 0,
            "endMs": round(shot_dur_s * 1000),
        })
        return caps
    for start_s, dur_s, text in boundaries:
        chunks = chunk_text(text) or [text]
        weights = [speech_weight(c) for c in chunks]
        total_weight = sum(weights) or 1.0
        cur = start_s
        for c, w in zip(chunks, weights):
            seg = dur_s * w / total_weight
            caps.append({
                "word": c.strip(),
                "startMs": round(cur * 1000),
                "endMs": round((cur + seg) * 1000),
            })
            cur += seg
    return caps


def concat_audio(files: list[Path], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    list_file = ASSETS / "_concat.txt"
    lines = [f"file '{p.as_posix()}'" for p in files]
    list_file.write_text("\n".join(lines) + "\n", encoding="utf-8")
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "concat", "-safe", "0",
            "-i", str(list_file),
            "-c:a", "libmp3lame", "-q:a", "2",
            str(out_path),
        ],
        check=True,
    )
    list_file.unlink(missing_ok=True)


def generate_silence(duration_s: float, out_path: Path) -> None:
    """Generate a silent MP3 of the given duration for unvoiced shots."""
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-f", "lavfi", "-i", f"anullsrc=r=24000:cl=mono",
            "-t", str(duration_s),
            "-c:a", "libmp3lame", "-q:a", "2",
            str(out_path),
        ],
        check=True,
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", default="edge-tts", choices=["edge-tts", "doubao"], help="TTS engine")
    ap.add_argument("--voice", default=None, help="voice id (default: engine-specific)")
    args = ap.parse_args()

    if args.engine == "doubao":
        voice = args.voice or os.environ.get("DOUBAO_SPEECH_VOICE_TYPE", "zh_female_xiaohe_uranus_bigtts")
        synth_fn = synth_doubao
        provider = "doubao"
    else:
        voice = args.voice or DEFAULT_VOICE
        synth_fn = synth
        provider = "edge-tts"

    ASSETS.mkdir(parents=True, exist_ok=True)
    shots = load_shots()
    print(f"Synthesising {len(shots)} shots with {provider} voice {voice} ...")

    manifest_shots: list[dict[str, Any]] = []
    audio_files: list[Path] = []
    cursor = 0.0
    # Load SSOT to get storyboard durations for silent shots
    ssot_txt = SCRIPT_MD.read_text(encoding="utf-8")
    ssot_block = re.findall(r"```json\s*\n(.*?)\n```", ssot_txt, re.S)[-1]
    ssot_sections = json.loads(ssot_block)["sections"]
    ssot_durations: dict[str, float] = {}
    for sec in ssot_sections:
        for shot in sec.get("shots") or []:
            ssot_durations[shot["id"]] = float(shot.get("duration_seconds", 4.0))

    for sec_id, sid, vtext in shots:
        if not vtext:
            silent_dur = ssot_durations.get(sid, 4.0)
            mp3 = ASSETS / f"{sid}.mp3"
            generate_silence(silent_dur, mp3)
            manifest_shots.append({
                "id": sid,
                "section_id": sec_id,
                "voice_slice": "",
                "audio_file": f"assets/{sid}.mp3",
                "start_seconds": round(cursor, 3),
                "duration_seconds": round(silent_dur, 3),
                "captions": [],
            })
            audio_files.append(mp3)
            print(f"  [silent] shot {sid}: {silent_dur:6.2f}s")
            cursor += silent_dur
            continue
        mp3 = ASSETS / f"{sid}.mp3"
        boundaries = synth_fn(vtext, voice, mp3)
        dur = ffprobe_duration(mp3)
        caps = build_captions(boundaries, dur, vtext)
        manifest_shots.append({
            "id": sid,
            "section_id": sec_id,
            "voice_slice": vtext,
            "audio_file": f"assets/{sid}.mp3",
            "start_seconds": round(cursor, 3),
            "duration_seconds": round(dur, 3),
            "captions": caps,
        })
        audio_files.append(mp3)
        print(f"  shot {sid}: {dur:6.2f}s  {len(caps)} caps")
        cursor += dur

    concat_audio(audio_files, NARRATION_OUT)

    manifest = {
        "episode": "ep02-video-render",
        "stage": "06-tts-synthesis",
        "fps": FPS,
        "language": "zh-CN",
        "provider": provider,
        "voice": voice,
        "provider_status": "synthesized",
        "duration_source": f"measured {provider} segment durations (timing source of truth)",
        "narration_audio": NARRATION_REL,
        "total_duration_seconds": round(cursor, 3),
        "shots": manifest_shots,
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")

    print("=" * 60)
    print(f"Wrote {MANIFEST.relative_to(REPO_ROOT)}")
    print(f"Wrote {NARRATION_OUT.relative_to(REPO_ROOT)}")
    print(f"Shots: {len(manifest_shots)} (voiced: {sum(1 for s in manifest_shots if s['voice_slice'])}, silent: {sum(1 for s in manifest_shots if not s['voice_slice'])}) | Narration: {cursor:.2f}s")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
