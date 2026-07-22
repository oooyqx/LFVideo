#!/usr/bin/env python3
"""Generate ep02-shots.json captions from 04-script/README.md voice text.

Reads the JSON contract from 04-script/README.md, builds cuts + captions,
and writes the preview props JSON for Remotion Studio.

Usage:
    python scripts/gen_ep02_captions.py
"""

import json
import re
import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent  # LFVideo root
SCRIPT_MD = REPO_ROOT / "content-library" / "ep02-video-render" / "04-script" / "README.md"
OUTPUT_JSON = REPO_ROOT / "OpenMontage" / "remotion-composer" / "public" / "demo-props" / "ep02-shots.json"

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
# CJK character counting (for proportional timing)
# ---------------------------------------------------------------------------
def cjk_char_count(text: str) -> int:
    """Count CJK + ASCII chars (excluding whitespace/punctuation for timing)."""
    count = 0
    for ch in text:
        if '\u4e00' <= ch <= '\u9fff':
            count += 1
        elif ch.isalnum():
            count += 1
    return count

# ---------------------------------------------------------------------------
# Split voice_slice into word-level segments
# ---------------------------------------------------------------------------
def split_to_words(text: str) -> list[str]:
    """Split Chinese text into natural phrase segments for word-by-word caption."""
    # Split on punctuation and commas, keep content
    # For CJK, split on: ，。、！？——；： and also ——
    parts = re.split(r'[，。、！？；：—\-\-]+', text)
    parts = [p.strip() for p in parts if p.strip()]
    
    # Further split long segments at natural boundaries
    result = []
    for part in parts:
        if len(part) > 12:
            # Try to split at natural boundaries
            sub_parts = re.split(r'[的是了在和与就也都还把让被给对从向为以到用把]', part)
            sub_parts = [p.strip() for p in sub_parts if p.strip()]
            if len(sub_parts) > 1:
                # Reconstruct with the delimiter
                idx = 0
                for sp in sub_parts:
                    end_idx = part.find(sp, idx) + len(sp)
                    segment = part[idx:end_idx]
                    if segment.strip():
                        result.append(segment.strip())
                    idx = end_idx
            else:
                result.append(part)
        else:
            result.append(part)
    
    # If segments are still too long (>15 chars), split by char pairs
    final = []
    for seg in result:
        if len(seg) > 15:
            # Split into ~7-char chunks
            for i in range(0, len(seg), 7):
                chunk = seg[i:i+7]
                if chunk:
                    final.append(chunk)
        else:
            final.append(seg)
    
    return final if final else [text]

# ---------------------------------------------------------------------------
# Build captions from voice_slice + shot timing
# ---------------------------------------------------------------------------
MAX_CHARS_PER_PAGE = 40  # 20 chars × 2 lines (matches CaptionOverlay maxCharsCjk * maxLines)

def build_captions(sections: list) -> list:
    """Build paged captions from sections, splitting long voice_slices into multiple pages."""
    captions = []
    
    for sec in sections:
        sec_start_ms = int(sec["_abs_start_ms"])
        for shot in sec["shots"]:
            shot_start_ms = sec_start_ms + int(shot["_rel_start_ms"])
            shot_end_ms = shot_start_ms + int(shot["duration_seconds"] * 1000)
            voice_slice = shot.get("voice_slice", "")
            if not voice_slice:
                continue
            
            words = split_to_words(voice_slice)
            total_chars = sum(cjk_char_count(w) for w in words)
            if total_chars == 0:
                continue
            
            duration_ms = shot_end_ms - shot_start_ms
            
            # Assign proportional timestamps to each word
            word_captions = []
            current_ms = shot_start_ms
            for i, w in enumerate(words):
                word_chars = cjk_char_count(w)
                word_duration = int(duration_ms * word_chars / total_chars)
                word_end = current_ms + word_duration if i < len(words) - 1 else shot_end_ms
                word_captions.append({
                    "word": w,
                    "startMs": current_ms,
                    "endMs": word_end,
                })
                current_ms = word_end
            
            # Split word_captions into pages by char limit
            pages = []
            buf = []
            buf_chars = 0
            for wc in word_captions:
                wc_chars = cjk_char_count(wc["word"])
                if buf and buf_chars + wc_chars > MAX_CHARS_PER_PAGE:
                    pages.append(buf)
                    buf = []
                    buf_chars = 0
                buf.append(wc)
                buf_chars += wc_chars
            if buf:
                pages.append(buf)
            
            for page_words in pages:
                captions.append({
                    "startMs": page_words[0]["startMs"],
                    "endMs": page_words[-1]["endMs"],
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
