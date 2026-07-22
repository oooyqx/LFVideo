#!/usr/bin/env python3
"""Generate ep02-shots.json captions from 04-script/README.md voice text.

Reads the JSON contract from 04-script/README.md, builds cuts + captions,
and writes the preview props JSON for Remotion Studio.

Caption chunking, pagination, and punctuation stripping are delegated to
``tools/subtitle/segmentation.py`` (the single source of truth), so the
preview pipeline and the production pipeline (build_ep02_shots_props.py)
share identical segmentation rules.

Usage:
    python scripts/gen_ep02_captions.py
"""

import json
import re
import sys
from pathlib import Path

# Add OpenMontage/ to sys.path so we can import tools.subtitle.segmentation
OPEN_MONTAGE = Path(__file__).resolve().parent.parent.parent  # OpenMontage/
sys.path.insert(0, str(OPEN_MONTAGE))

from tools.subtitle.segmentation import (
    PaginationOptions,
    chunk_text,
    paginate,
    speech_weight,
    strip_leading_punct,
    strip_trailing_punct,
)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = OPEN_MONTAGE.parent  # LFVideo root
SCRIPT_MD = REPO_ROOT / "content-library" / "ep02-video-render" / "04-script" / "README.md"
OUTPUT_JSON = OPEN_MONTAGE / "remotion-composer" / "public" / "demo-props" / "ep02-shots.json"

# ---------------------------------------------------------------------------
# Scene template → Remotion type mapping
# ---------------------------------------------------------------------------
TEMPLATE_TO_TYPE = {
    "@IntroScene": "intro_scene",
    "@OutroScene": "outro_scene",
    "@ConceptScene": "concept_scene",
    "@BulletScene": "bullet_scene",
    "@FlowScene": "flow_scene",
    "@TableScene": "table_scene",
    "@SplitLayout": "comparison_scene",
    "@CalloutScene": "callout_scene",
    "@QuoteScene": "quote_scene",
    "@TerminalScene": "code_scene",
}

# ---------------------------------------------------------------------------
# Build captions from voice_slice + shot timing (delegates to segmentation.py)
# ---------------------------------------------------------------------------
# Shared pagination options — same as production pipeline (build_ep02_shots_props.py)
PAGINATION_OPTS = PaginationOptions(max_chars_cjk=36, max_lines=1)

def build_captions(sections: list) -> list:
    """Build paged captions from sections using segmentation.py as SSOT."""
    captions = []

    for sec in sections:
        sec_start_ms = int(sec["_abs_start_ms"])
        for shot in sec["shots"]:
            shot_start_ms = sec_start_ms + int(shot["_rel_start_ms"])
            shot_end_ms = shot_start_ms + int(shot["duration_seconds"] * 1000)
            voice_slice = shot.get("voice_slice", "")
            if not voice_slice:
                continue

            # SSOT chunking: splits into clause-level chunks, keeps punctuation
            chunks = chunk_text(voice_slice)
            if not chunks:
                continue

            # Assign proportional timestamps using speech_weight (SSOT)
            total_weight = sum(speech_weight(c) for c in chunks)
            if total_weight == 0:
                continue

            duration_s = (shot_end_ms - shot_start_ms) / 1000.0
            shot_start_s = shot_start_ms / 1000.0

            words = []
            current_s = shot_start_s
            for i, c in enumerate(chunks):
                w = speech_weight(c)
                chunk_dur = duration_s * w / total_weight if i < len(chunks) - 1 else (shot_end_ms / 1000.0 - current_s)
                chunk_end = current_s + chunk_dur if i < len(chunks) - 1 else shot_end_ms / 1000.0
                words.append({"word": c, "start": current_s, "end": chunk_end})
                current_s = chunk_end

            # SSOT pagination: groups words into pages by char/time budget
            groups = paginate(words, PAGINATION_OPTS)

            for group in groups:
                page_words = [
                    {
                        "word": w["word"],
                        "startMs": round(w["start"] * 1000),
                        "endMs": round(w["end"] * 1000),
                    }
                    for w in group
                ]
                # Broadcast-subtitle convention: strip neutral stops at page edges
                page_words[0]["word"] = strip_leading_punct(page_words[0]["word"])
                page_words[-1]["word"] = strip_trailing_punct(page_words[-1]["word"])
                captions.append({
                    "startMs": round(group[0]["start"] * 1000),
                    "endMs": round(group[-1]["end"] * 1000),
                    "words": page_words,
                })

    return captions

# ---------------------------------------------------------------------------
# Build cuts from sections
# ---------------------------------------------------------------------------
def build_cuts(sections: list) -> list:
    """Build cuts array from sections with absolute timing."""
    cuts = []
    for sec in sections:
        sec_start = sec["_abs_start_ms"] / 1000.0
        for shot in sec["shots"]:
            shot_start = sec_start + shot["_rel_start_ms"] / 1000.0
            shot_end = shot_start + shot["duration_seconds"]
            
            template = shot["scene_template"]
            cut_type = TEMPLATE_TO_TYPE.get(template, template.replace("@", "").lower() + "_scene")
            
            cut = {
                "id": f"shot-{shot['id']}",
                "type": cut_type,
                "source": "",
                "in_seconds": round(shot_start, 3),
                "out_seconds": round(shot_end, 3),
                "background": "holo",
            }
            
            # Copy props
            props = shot.get("props", {})
            # Transform terminal steps format
            if cut_type == "code_scene" and "steps" in props:
                steps = []
                for s in props["steps"]:
                    if "cmd" in s:
                        steps.append({"kind": "cmd", "text": s["cmd"]})
                    elif "out" in s:
                        steps.append({"kind": "out", "text": s["out"]})
                    else:
                        steps.append(s)
                props = {**props, "steps": steps}
            
            cut.update(props)
            cuts.append(cut)
    
    return cuts

# ---------------------------------------------------------------------------
# Parse 04-script/README.md JSON contract
# ---------------------------------------------------------------------------
def parse_script_json() -> dict:
    """Extract the JSON contract block from the markdown file."""
    text = SCRIPT_MD.read_text(encoding="utf-8")
    # Find the JSON code block
    match = re.search(r'```json\s*\n(.*?)\n```', text, re.DOTALL)
    if not match:
        raise ValueError("Could not find JSON contract block in README.md")
    
    raw_json = match.group(1)
    # Remove trailing comma if present (from judgment_layer_coverage)
    data = json.loads(raw_json)
    return data

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    contract = parse_script_json()
    sections = contract["sections"]
    
    # Calculate absolute timing for each section
    cursor_ms = 0
    for sec in sections:
        sec["_abs_start_ms"] = cursor_ms
        sec_cursor = 0
        for shot in sec["shots"]:
            shot["_rel_start_ms"] = sec_cursor * 1000
            sec_cursor += shot["duration_seconds"]
        cursor_ms += sec_cursor * 1000
    
    total_duration = cursor_ms / 1000.0
    print(f"Total duration: {total_duration:.1f}s ({len(sections)} sections)")
    
    # Count shots
    total_shots = sum(len(sec["shots"]) for sec in sections)
    print(f"Total shots: {total_shots}")
    
    # Build cuts
    cuts = build_cuts(sections)
    print(f"Built {len(cuts)} cuts")
    
    # Build captions
    captions = build_captions(sections)
    print(f"Built {len(captions)} caption pages")
    
    # Read existing JSON to preserve avatar/audio/unityBackground settings
    existing = {}
    if OUTPUT_JSON.exists():
        existing = json.loads(OUTPUT_JSON.read_text(encoding="utf-8"))
    
    # Assemble final JSON
    output = {
        "theme": "flat-motion-graphics",
        "cuts": cuts,
        "overlays": [],
        "captions": captions,
    }
    
    # Preserve avatar config
    if "avatar" in existing:
        output["avatar"] = existing["avatar"]
    
    # Preserve unityBackground config
    if "unityBackground" in existing:
        output["unityBackground"] = existing["unityBackground"]
    
    # Set caption animation
    output["captionAnimation"] = "scramble"
    
    # Preserve audio config
    if "audio" in existing:
        output["audio"] = existing["audio"]
    
    # Write output
    OUTPUT_JSON.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"\nWritten to: {OUTPUT_JSON}")
    print(f"File size: {OUTPUT_JSON.stat().st_size} bytes")

if __name__ == "__main__":
    main()
