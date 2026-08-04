#!/usr/bin/env python3
"""Engine for building Remotion Explainer props from a 04-script SSOT.

This module contains the cross-episode (shared) logic for mapping a shot-level
04-script JSON contract into Remotion ``Explainer`` props (cuts + captions).

Each episode provides its own ``build_props.py`` (in
``content-library/<epNN>/07-assembly/``) with episode-specific configuration
(paths, avatar, unity background, shot overrides) and calls
``build_props()`` from this module.

Usage from an episode script::

    from tools.props_builder import build_props, EpisodeConfig

    config = EpisodeConfig(
        script_md=Path(".../04-script/README.md"),
        tts_manifest=Path(".../06-tts/assets/manifest.json"),
        output_json=Path(".../public/demo-props/epNN-shots.json"),
        avatar={...},
        shot_overrides={...},
    )
    build_props(config)
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

# Ensure we can import tools.subtitle.segmentation
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tools.subtitle.segmentation import (  # noqa: E402
    paginate,
    strip_leading_punct,
    strip_trailing_punct,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
FPS = 30

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
    "@ChatScene": "chat_scene",
    "@ArchitectureScene": "architecture_scene",
    "@ChartScene": "chart_scene",
    "@StatScene": "stat_scene",
    "@TimelineScene": "timeline_scene",
    "@SectionScene": "section_scene",
}

# ---------------------------------------------------------------------------
# Episode configuration dataclass
# ---------------------------------------------------------------------------
@dataclass
class EpisodeConfig:
    """Per-episode configuration for props generation.

    Attributes:
        script_md: Path to the 04-script README.md (SSOT).
        tts_manifest: Path to the 06-tts manifest.json (optional, may not exist).
        output_json: Path to the output props JSON (public/demo-props/<slug>.json).
        avatar: Avatar configuration dict (or None to skip).
        unity_background: Unity background configuration dict (or None to skip).
        shot_overrides: Per-shot overrides {shot_id: {key: value}}.
        theme: Theme string for the composition.
    """

    script_md: Path
    tts_manifest: Path
    output_json: Path
    avatar: dict[str, Any] | None = None
    unity_background: dict[str, Any] | None = None
    shot_overrides: dict[str, dict[str, Any]] = field(default_factory=dict)
    theme: str = "flat-motion-graphics"


# ---------------------------------------------------------------------------
# SSOT loading
# ---------------------------------------------------------------------------
def load_ssot_sections(script_md: Path) -> list[dict[str, Any]]:
    """Extract and parse the JSON contract block from 04-script README.md."""
    txt = script_md.read_text(encoding="utf-8")
    block = re.findall(r"```json\s*\n(.*?)\n```", txt, re.S)[-1]
    return json.loads(block)["sections"]


def load_tts_manifest(tts_manifest: Path) -> dict[str, Any] | None:
    """Load 06-tts manifest if it exists and is synthesised."""
    if not tts_manifest.exists():
        return None
    data = json.loads(tts_manifest.read_text(encoding="utf-8"))
    if data.get("provider_status") != "synthesized":
        return None
    return data


# ---------------------------------------------------------------------------
# Build cuts + captions
# ---------------------------------------------------------------------------
def build_cuts(
    sections: list[dict[str, Any]],
    tts: dict[str, Any] | None,
    shot_overrides: dict[str, dict[str, Any]],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], float]:
    """Map SSOT shots to Explainer cuts + flat word captions.

    Returns (cuts, captions, total_duration_seconds).
    """
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
            raise SystemExit(
                f"section {sec.get('id')} has no shots[]; expected shot-level SSOT"
            )
        for shot in shots:
            sid = shot["id"]
            template = shot["scene_template"]
            ctype = TEMPLATE_TO_TYPE.get(template)
            if ctype is None:
                raise SystemExit(f"shot {sid}: unknown scene_template {template}")
            content = dict(shot.get("props") or {})
            if not content:
                raise SystemExit(f"shot {sid}: SSOT shot has no props")
            # FlowScene step schema: map 'title' -> 'label'
            if ctype == "flow_scene" and isinstance(content.get("steps"), list):
                content["steps"] = [
                    {**s, "label": s["title"], "title": None}
                    if isinstance(s, dict) and "title" in s and "label" not in s
                    else s
                    for s in content["steps"]
                ]
                content["steps"] = [
                    {k: v for k, v in s.items() if v is not None}
                    for s in content["steps"]
                ]
            content.setdefault("background", "video")
            content.update(shot_overrides.get(sid, {}))
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
            offset_ms = int(round(cursor * 1000))
            for cap in tts_caps.get(sid, []):
                captions.append({
                    **cap,
                    "startMs": cap["startMs"] + offset_ms,
                    "endMs": cap["endMs"] + offset_ms,
                })
            # Fallback: no TTS — generate estimated captions from voice_slice
            # Split by punctuation into natural phrases (matching TTS caption style)
            if not tts:
                voice_text = shot.get("voice_slice") or shot.get("voice") or ""
                voice_text = voice_text.strip()
                if voice_text:
                    tokens = re.split(r'([，。；！？、,;!?])', voice_text)
                    phrases: list[str] = []
                    buf = ""
                    for tok in tokens:
                        if not tok:
                            continue
                        if re.fullmatch(r'[，。；！？、,;!?]', tok):
                            buf += tok
                            phrases.append(buf)
                            buf = ""
                        else:
                            buf += tok
                    if buf.strip():
                        phrases.append(buf)
                    if phrases:
                        dur_ms = int(round(dur * 1000))
                        per_phrase = dur_ms / len(phrases)
                        for pi, phrase in enumerate(phrases):
                            captions.append({
                                "word": phrase,
                                "startMs": offset_ms + int(round(pi * per_phrase)),
                                "endMs": offset_ms + int(round((pi + 1) * per_phrase)),
                            })
            cursor += dur
    return cuts, captions, cursor


# ---------------------------------------------------------------------------
# Caption pagination (delegates to segmentation.py SSOT)
# ---------------------------------------------------------------------------
def paginate_captions(captions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Group flat WordCaptions into pre-paged captions for CaptionOverlay."""
    words = [
        {"word": c["word"], "start": c["startMs"] / 1000.0, "end": c["endMs"] / 1000.0}
        for c in captions
    ]
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
        page_words[0]["word"] = strip_leading_punct(page_words[0]["word"])
        page_words[-1]["word"] = strip_trailing_punct(page_words[-1]["word"])
        pages.append({
            "startMs": round(group[0]["start"] * 1000),
            "endMs": round(group[-1]["end"] * 1000),
            "words": page_words,
        })
    return pages


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------
def build_props(config: EpisodeConfig) -> None:
    """Generate the Remotion props JSON from the episode configuration."""
    sections = load_ssot_sections(config.script_md)
    tts = load_tts_manifest(config.tts_manifest)
    cuts, captions, total = build_cuts(
        sections, tts, config.shot_overrides
    )
    caption_pages = paginate_captions(captions)

    payload: dict[str, Any] = {
        "theme": config.theme,
        "cuts": cuts,
        "overlays": [],
        "captions": caption_pages,
    }
    if config.avatar is not None:
        payload["avatar"] = config.avatar
    if config.unity_background is not None:
        payload["unityBackground"] = config.unity_background
    if tts and tts.get("narration_audio"):
        payload["audio"] = {"narration": {"src": tts["narration_audio"], "volume": 1}}

    config.output_json.parent.mkdir(parents=True, exist_ok=True)
    config.output_json.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print("=" * 60)
    print(f"Wrote {config.output_json}")
    print(
        f"Cuts: {len(cuts)} | Duration: {total:.2f}s "
        f"({int(round(total * FPS))} frames @ {FPS}fps)"
    )
    print(
        f"Captions: {len(captions)} words / {len(caption_pages)} pages | "
        f"TTS: {'on' if tts else 'off (storyboard timing)'}"
    )
    by_type: dict[str, int] = {}
    for c in cuts:
        t = c.get("type") or "(media)"
        by_type[t] = by_type.get(t, 0) + 1
    print("By type:", ", ".join(f"{k}={v}" for k, v in sorted(by_type.items())))
    print("=" * 60)
