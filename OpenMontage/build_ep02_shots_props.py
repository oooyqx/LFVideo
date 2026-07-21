#!/usr/bin/env python3
"""Build ep02 Remotion ``Explainer`` props from the **shot-level** 04 SSOT.

This is the 07-video-assembly mapping for the refactored ep02 04-script: the
SSOT now decomposes each section into ``shots[]`` (see
shared/schemas/04-script.schema.json), and stage 07 maps **one shot -> one
Explainer cut**. Structure (shot order, per-shot duration, the section voice a
shot covers) AND the renderable per-shot ``props`` come straight from the SSOT
JSON contract; ``SHOT_OVERRIDES`` here only layers stage-05/07 concerns on top
(e.g. wiring real B-roll footage into a cut's ``source``).

Scene-template -> Explainer ``cut.type`` mapping. Every type is a first-class
template-library scene (see remotion-composer/src/custom-templates/registry.ts):

    @IntroScene    -> intro_scene     @ConceptScene  -> concept_scene
    @TableScene    -> table_scene     @TerminalScene -> code_scene
    @OutroScene    -> outro_scene     @SplitLayout   -> comparison_scene
    @FlowScene     -> flow_scene      @BulletScene   -> bullet_scene
    @QuoteScene    -> quote_scene     @CalloutScene  -> callout_scene

Cut timing is driven by each shot's ``duration_seconds`` (06-tts narration is
not yet produced for this cut; once it is, swap in real segment durations from
``06-tts/assets/manifest.json``).

Usage:
    python build_ep02_shots_props.py        # writes public/demo-props/ep02-shots.json
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from tools.subtitle.segmentation import (  # noqa: E402
    paginate,
    strip_leading_punct,
    strip_trailing_punct,
)

REPO_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_MD = REPO_ROOT / "content-library" / "ep02-video-render" / "04-script" / "README.md"
TTS_MANIFEST = REPO_ROOT / "content-library" / "ep02-video-render" / "06-tts" / "assets" / "manifest.json"
COMPOSER_DIR = Path(__file__).resolve().parent / "remotion-composer"
PUBLIC_DIR = COMPOSER_DIR / "public"
OUTPUT_JSON = PUBLIC_DIR / "demo-props" / "ep02-shots.json"

# Unity room render as the bottom layer; the UI page is perspective-warped into
# the in-scene display. Drop the shot into public/UnityBG.png and this turns on
# automatically. The host + captions are flat overlays (not warped).
UNITY_BG_IMAGE = "UnityBG.png"
# Screen quad corners (1920x1080 px) the UI page is warped into. Exact edge of
# the in-scene display (no expansion — the real render has no chroma fringe).
UNITY_BG_QUAD = {
    "tl": [13, 142],
    "tr": [1194, 275],
    "br": [1194, 791],
    "bl": [13, 919],
}

FPS = 30
THEME = "flat-motion-graphics"

# Digital host as a full-frame background layer (Mixamo clip drives the body);
# the Remotion UI floats on top with transparent scene backgrounds. The clip
# plays at 0.6x and the host is parked on the right, vertically centred.
AVATAR = {
    "enabled": True,
    "layer": "background",
    "clip": "avatars/Sitting.fbx",
    "clipSpeed": 0.6,
    "bgModelX": 2.10,
    "bgModelY": -1.35,
    "bgCameraZ": 5.90,
    "bgModelYawDeg": 50,
    # 2D placement (CSS, pixel-exact): 1.43x size, nudged down 50px.
    "bgScale": 1.43,
    "bgOffsetYpx": 50,
}

TEMPLATE_TO_TYPE = {
    "@IntroScene": "intro_scene",
    "@ConceptScene": "concept_scene",
    "@TableScene": "table_scene",
    "@TerminalScene": "code_scene",
    "@OutroScene": "outro_scene",
    "@SplitLayout": "comparison_scene",
    "@FlowScene": "flow_scene",
    "@BulletScene": "bullet_scene",
    "@QuoteScene": "quote_scene",
    "@CalloutScene": "callout_scene",
}


# Stage-05/07 cut overrides layered on top of the SSOT-embedded shot props.
# Reserved for concerns that don't belong in the 04 script SSOT — e.g. wiring
# real B-roll footage: dropping `type` (override it to None) and setting
# `source` makes the cut a raw media clip that the Explainer media fallback
# plays full-frame instead of the synthetic scene. Provenance sidecars for the
# clips live in content-library/ep02-video-render/05-b-roll/assets/.
SHOT_OVERRIDES: dict[str, dict[str, Any]] = {}

# ep02 authored look: 'holo' background on every template scene except the
# ones that manage their own full-bleed layout.
NO_HOLO_TYPES = {"comparison_scene", "quote_scene", "code_scene"}


def load_ssot_sections() -> list[dict[str, Any]]:
    txt = SCRIPT_MD.read_text(encoding="utf-8")
    block = re.findall(r"```json\s*\n(.*?)\n```", txt, re.S)[-1]
    return json.loads(block)["sections"]


def load_tts_manifest() -> dict[str, Any] | None:
    """Per-shot real durations + lip-sync captions from 06-tts, if synthesised."""
    if not TTS_MANIFEST.exists():
        return None
    data = json.loads(TTS_MANIFEST.read_text(encoding="utf-8"))
    if data.get("provider_status") != "synthesized":
        return None
    return data


def build_cuts(
    sections: list[dict[str, Any]],
    tts: dict[str, Any] | None,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], float]:
    # When 06-tts has been synthesised it is the timing source of truth: each
    # shot's on-screen cut runs exactly as long as its narration segment, and
    # the captions (absolute ms) drive both the burned-in subtitles and the
    # host's lip-sync.
    tts_dur: dict[str, float] = {}
    tts_caps: dict[str, list[dict[str, Any]]] = {}
    if tts:
        for s in tts["shots"]:
            tts_dur[s["id"]] = float(s["duration_seconds"])
            tts_caps[s["id"]] = s.get("captions") or []

    cuts: list[dict[str, Any]] = []
    captions: list[dict[str, Any]] = []
    cursor = 0.0
    for sec in sections:
        shots = sec.get("shots") or []
        if not shots:
            raise SystemExit(f"section {sec.get('id')} has no shots[]; expected shot-level SSOT")
        for shot in shots:
            sid = shot["id"]
            template = shot["scene_template"]
            ctype = TEMPLATE_TO_TYPE.get(template)
            if ctype is None:
                raise SystemExit(f"shot {sid}: unknown scene_template {template}")
            content = dict(shot.get("props") or {})
            if not content:
                raise SystemExit(f"shot {sid}: SSOT shot has no props")
            # FlowScene's step schema keys the card heading as `label`; the SSOT
            # authors it as `title` (consistent with other scenes). Map it here so
            # the renderer's zod parse succeeds and the cards actually render.
            if ctype == "flow_scene" and isinstance(content.get("steps"), list):
                content["steps"] = [
                    {**s, "label": s["title"], "title": None}
                    if isinstance(s, dict) and "title" in s and "label" not in s
                    else s
                    for s in content["steps"]
                ]
                content["steps"] = [
                    {k: v for k, v in s.items() if v is not None} for s in content["steps"]
                ]
            if ctype not in NO_HOLO_TYPES:
                content.setdefault("background", "holo")
            content.update(SHOT_OVERRIDES.get(sid, {}))
            # TTS segment durations are the timeline truth; keep them exact
            # (no frame quantization) so cut boundaries stay glued to the
            # narration/caption milliseconds.
            dur = tts_dur.get(sid, float(shot["duration_seconds"]))
            cut = {
                "id": f"shot-{sid}",
                "type": ctype,
                "source": "",
                "in_seconds": round(cursor, 3),
                "out_seconds": round(cursor + dur, 3),
                **content,
            }
            cut = {k: v for k, v in cut.items() if v is not None}
            cuts.append(cut)
            # Manifest captions are shot-relative ms; the composition wants
            # absolute timeline ms, so offset by the cut's start.
            offset_ms = int(round(cursor * 1000))
            for cap in tts_caps.get(sid, []):
                captions.append({
                    **cap,
                    "startMs": cap["startMs"] + offset_ms,
                    "endMs": cap["endMs"] + offset_ms,
                })
            cursor += dur
    return cuts, captions, cursor


def paginate_captions(captions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Group flat WordCaptions into pre-paged captions for the CaptionOverlay.

    Pagination lives here (tools/subtitle/segmentation is the single source of
    truth) so the renderer never re-segments; each page carries its word-level
    timings for the in-page highlight and the host lip-sync.
    """
    words = [
        {"word": c["word"], "start": c["startMs"] / 1000.0, "end": c["endMs"] / 1000.0}
        for c in captions
    ]
    # edge-tts sentence boundaries can overlap the next sentence by ~50ms;
    # clamp so the word stream (and thus the pages) is strictly monotonic.
    for cur, nxt in zip(words, words[1:]):
        if cur["end"] > nxt["start"]:
            cur["end"] = nxt["start"]
    pages = []
    for group in paginate(words):
        page_words = [
            {
                "word": w["word"],
                "startMs": round(w["start"] * 1000),
                "endMs": round(w["end"] * 1000),
            }
            for w in group
        ]
        # Broadcast-subtitle convention: neutral stops at the edges of a page
        # are dropped — the page change itself marks the pause.
        page_words[0]["word"] = strip_leading_punct(page_words[0]["word"])
        page_words[-1]["word"] = strip_trailing_punct(page_words[-1]["word"])
        pages.append({
            "startMs": round(group[0]["start"] * 1000),
            "endMs": round(group[-1]["end"] * 1000),
            "words": page_words,
        })
    return pages


def main() -> int:
    sections = load_ssot_sections()
    tts = load_tts_manifest()
    cuts, captions, total = build_cuts(sections, tts)
    caption_pages = paginate_captions(captions)
    payload: dict[str, Any] = {
        "theme": THEME,
        "cuts": cuts,
        "overlays": [],
        "captions": caption_pages,
        "avatar": AVATAR,
    }
    # Warp room is ep02's authored look. Keep it enabled regardless of whether
    # the (uncommitted) artist asset happens to be on disk at generation time,
    # so regenerating props never silently turns the warp off. Drop the room
    # shot into public/UnityBG.png before rendering.
    payload["unityBackground"] = {
        "enabled": True,
        "image": UNITY_BG_IMAGE,
        "screenQuad": UNITY_BG_QUAD,
        # Translucent + blue-tinted UI backdrop (holographic look).
        "screenOpacity": 0.4,
        "screenTint": "#0b2a52",
    }
    if tts and tts.get("narration_audio"):
        payload["audio"] = {"narration": {"src": tts["narration_audio"], "volume": 1}}
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("=" * 60)
    print(f"Wrote {OUTPUT_JSON.relative_to(REPO_ROOT)}")
    print(f"Cuts: {len(cuts)} | Duration: {total:.2f}s ({int(round(total * FPS))} frames @ {FPS}fps)")
    print(f"Captions: {len(captions)} words / {len(caption_pages)} pages | TTS: {'on' if tts else 'off (storyboard timing)'}")
    by_type: dict[str, int] = {}
    for c in cuts:
        t = c.get("type") or "(media)"
        by_type[t] = by_type.get(t, 0) + 1
    print("By type:", ", ".join(f"{k}={v}" for k, v in sorted(by_type.items())))
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
