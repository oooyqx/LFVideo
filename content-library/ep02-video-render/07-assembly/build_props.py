#!/usr/bin/env python3
"""Build ep02 Remotion Explainer props from the 04-script SSOT.

Episode-specific configuration for ep02-video-render. The shared engine logic
lives in ``OpenMontage/tools/props_builder.py``; this script only declares
paths, avatar, unity background, and shot overrides, then calls
``build_props()``.

Usage:
    python content-library/ep02-video-render/07-assembly/build_props.py
"""

from __future__ import annotations

import sys
from pathlib import Path

# Add OpenMontage/ to sys.path so we can import tools.props_builder
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent  # LFVideo root
OPEN_MONTAGE = REPO_ROOT / "OpenMontage"
sys.path.insert(0, str(OPEN_MONTAGE))

from tools.props_builder import EpisodeConfig, build_props  # noqa: E402

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
EP_DIR = REPO_ROOT / "content-library" / "ep02-video-render"
SCRIPT_MD = EP_DIR / "04-script" / "README.md"
TTS_MANIFEST = EP_DIR / "06-tts" / "assets" / "manifest.json"
OUTPUT_JSON = OPEN_MONTAGE / "remotion-composer" / "public" / "demo-props" / "ep02-shots.json"

# ---------------------------------------------------------------------------
# Avatar configuration
# ---------------------------------------------------------------------------
AVATAR = {
    "enabled": True,
    "layer": "background",
    "clip": "avatars/Sitting.fbx",
    "clipSpeed": 0.6,
    "bgModelX": 2.10,
    "bgModelY": -1.35,
    "bgCameraZ": 5.90,
    "bgModelYawDeg": 50,
    "bgScale": 1.43,
    "bgOffsetYpx": 50,
}

# ---------------------------------------------------------------------------
# Unity background (warp room)
# ---------------------------------------------------------------------------
UNITY_BG_IMAGE = "UnityBG.png"
UNITY_BG_QUAD = {
    "tl": [13, 142],
    "tr": [1194, 275],
    "br": [1194, 791],
    "bl": [13, 919],
}

UNITY_BACKGROUND = {
    "enabled": True,
    "image": UNITY_BG_IMAGE,
    "screenQuad": UNITY_BG_QUAD,
    "screenOpacity": 0.4,
    "screenTint": "#0b2a52",
}

# ---------------------------------------------------------------------------
# Shot overrides (stage-05/07 concerns, not 04 SSOT content)
# ---------------------------------------------------------------------------
SHOT_OVERRIDES: dict[str, dict] = {}

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    config = EpisodeConfig(
        script_md=SCRIPT_MD,
        tts_manifest=TTS_MANIFEST,
        output_json=OUTPUT_JSON,
        avatar=AVATAR,
        unity_background=UNITY_BACKGROUND,
        shot_overrides=SHOT_OVERRIDES,
    )
    build_props(config)
