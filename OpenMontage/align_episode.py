#!/usr/bin/env python3
"""OpenMontage - EP02 voiceover/subtitle aligner and Remotion props builder.

This script reads the **04 script contract block** (the frozen single source of
truth: ``sections[]``), turns each section into one Remotion ``Explainer`` cut,
and writes a unified props JSON ready for rendering the ``ep02-video-render``
composition.

What drives the on-screen content:

* ``cut.type`` comes from the section's ``scene_template`` (``@IntroScene`` /
  ``@ConceptScene`` / ``@TableScene`` / ``@SplitLayout`` / ``@TerminalScene`` /
  ``@ScreenshotScene`` / ``@OutroScene``) via ``TEMPLATE_TO_TYPE``.
* The scene props (titles / items / table rows / terminal steps / screenshot
  callouts) are transcribed 1:1 from each section's ``[画面]`` spec in the 04
  script and stored in ``SCENE_CONTENT`` keyed by the section ``id``. This
  replaces the old hard-coded per-type demo content, so the render matches the
  current EP02 narrative instead of a frozen, outdated one.
* Per-cut timing comes from the **06-tts** ``assets/manifest.json`` real Piper
  segment durations when available (so the composition length matches the
  narration), falling back to a simulated speaking cadence otherwise.

Usage::

    # default: timing from 06-tts manifest if present, no embedded audio
    python align_episode.py

    # full local render: also concatenate the 13 narration WAVs and embed them
    python align_episode.py --audio-dir ../content-library/ep02-video-render/06-tts/assets

    # single combined track via WhisperX word-level alignment (needs transcriber)
    python align_episode.py --audio ../path/to/combined.wav
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

# Try importing OpenMontage libraries if run in OpenMontage env
try:
    sys.path.append(str(Path(__file__).resolve().parent))
    from tools.analysis.transcriber import Transcriber
    HAS_TRANSCRIBER = True
except ImportError:
    HAS_TRANSCRIBER = False

FPS = 30

COMPOSER_DIR = Path(__file__).resolve().parent / "remotion-composer"
AVATAR_PLACEHOLDER_REL = "screenshots/ep02-avatar-preset.png"


# ---------------------------------------------------------------------------
# Caption simulation (used when no WhisperX-aligned audio is supplied)
# ---------------------------------------------------------------------------

def clean_voice_text(text: str) -> str:
    """Removes script formatting and keeps clean spoken characters/words."""
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"【.*?】", "", text)
    return text.strip()


def segment_text_to_words(text: str) -> list[str]:
    """Splits text into words (English) or individual characters (Chinese)."""
    clean = clean_voice_text(text)
    words = []
    pattern = re.compile(r"([A-Za-z0-9\-]+|[\u4e00-\u9fa5]|[\w]+|[.,!?;:，。！？、])")
    for match in pattern.finditer(clean):
        token = match.group(0).strip()
        if token:
            words.append(token)
    return words


def simulate_word_timestamps(words: list[str], start_time_sec: float = 0.0) -> list[dict[str, Any]]:
    """Simulates a realistic speaking cadence with punctuation pauses."""
    cues: list[dict[str, Any]] = []
    current_sec = start_time_sec

    punctuation_delays = {
        "，": 0.300, ",": 0.300, "；": 0.300, ";": 0.300, "、": 0.150,
        "。": 0.650, ".": 0.650, "！": 0.650, "!": 0.650, "？": 0.650,
        "?": 0.650, "：": 0.200, ":": 0.200,
    }

    for i, w in enumerate(words):
        if w in punctuation_delays:
            current_sec += punctuation_delays[w]
            if cues:
                cues[-1]["word"] += w
            continue

        next_w = words[i + 1] if i + 1 < len(words) else ""
        added_pause = punctuation_delays.get(next_w, 0.0)

        is_chinese = any("\u4e00" <= char <= "\u9fa5" for char in w)
        duration = 0.240 if is_chinese else (0.100 + len(w) * 0.015)

        cues.append({
            "word": w,
            "startMs": int(current_sec * 1000),
            "endMs": int((current_sec + duration) * 1000),
        })
        current_sec += duration + added_pause

    return cues


def scale_and_offset_cues(
    cues: list[dict[str, Any]], offset_sec: float, target_dur_sec: float | None
) -> list[dict[str, Any]]:
    """Scale simulated cues to fit ``target_dur_sec`` then shift by ``offset_sec``.

    Keeps the burned-in captions inside the real audio window of each segment
    when a manifest duration is available, otherwise leaves the simulated
    cadence untouched.
    """
    if not cues:
        return cues
    sim_dur_ms = cues[-1]["endMs"]
    scale = 1.0
    if target_dur_sec and sim_dur_ms > 0:
        scale = (target_dur_sec * 1000.0) / sim_dur_ms
    offset_ms = int(offset_sec * 1000)
    out: list[dict[str, Any]] = []
    for c in cues:
        out.append({
            "word": c["word"],
            "startMs": int(c["startMs"] * scale) + offset_ms,
            "endMs": int(c["endMs"] * scale) + offset_ms,
        })
    return out


# ---------------------------------------------------------------------------
# 04 scene_template -> Explainer cut.type
# ---------------------------------------------------------------------------

# Each 04 section declares a scene_template (e.g. "【@TerminalScene】..." or just
# "@TableScene"); we match the first known @XxxScene token to a registered
# Explainer cut.type. @SplitLayout (left/right code or comparison) is rendered
# with the polished TableScene as a two-column comparison fallback for the A-rail.
TEMPLATE_TO_TYPE: list[tuple[str, str]] = [
    ("@IntroScene", "intro_scene"),
    ("@OutroScene", "outro_scene"),
    ("@TerminalScene", "terminal_scene"),
    ("@ScreenshotScene", "screenshot_scene"),
    ("@TableScene", "table_scene"),
    ("@SplitLayout", "table_scene"),
    ("@TimelineScene", "timeline_scene"),
    ("@ConceptScene", "concept_scene"),
]


def map_template_to_type(template: str) -> str:
    for token, cut_type in TEMPLATE_TO_TYPE:
        if token in template:
            return cut_type
    return "text_card"


# ---------------------------------------------------------------------------
# On-screen content per 04 section id (transcribed from the 04 [画面] specs)
# ---------------------------------------------------------------------------

def _terminal_lines(code: str) -> list[dict[str, Any]]:
    """Render a code block as TerminalScene `out` steps (one per line)."""
    return [{"kind": "out", "text": line} for line in code.split("\n")]


SCENE_CONTENT: dict[str, dict[str, Any]] = {
    # 1 · @IntroScene — 开场钩子
    "1": {
        "title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎",
        "subtitle": "《Vibe Coding 造一条自动化视频生产线》EP02 · 视频渲染",
        "background": "particles",
    },
    # 2 · @ConceptScene — 找技术路径·让 AI 把路摆出来（共同内核）
    "2": {
        "eyebrow": "找技术路径",
        "title": "先让 AI 把「能把视频写成代码」的路都摆出来",
        "background": "gradient",
        "items": [
            {"label": "INPUT", "title": "用代码/数据描述画面", "desc": "把想要的画面用代码或数据讲清楚", "icon": "📝"},
            {"label": "COMPILE", "title": "程序编译成帧", "desc": "渲染器按时间点算出每一帧", "icon": "⚙️"},
            {"label": "OUTPUT", "title": "合成视频", "desc": "帧序列合成成片，全程可自动化", "icon": "🎬"},
        ],
    },
    # 3 · @ConceptScene（卡片阵列，6 张）— 六条技术路线.
    # 6 cards overflow ConceptScene's vertical stack, so the A-rail renders the
    # array as a 3-column TableScene (路线/代表/适合) for legibility.
    "3": {
        "type": "table_scene",
        "eyebrow": "找技术路径 · 同一内核：把画面编译成帧",
        "title": "AI 摆出的六条路线",
        "background": "grid",
        "headers": ["技术路线", "代表项目", "适合场景"],
        "rows": [
            {"feature": "网页渲染", "cursor": "Remotion", "windsurf": "前端栈、复杂排版、跨期复用", "win": "cursor"},
            {"feature": "时序动画", "cursor": "Motion Canvas / Revideo", "windsurf": "代码演示、精确时序", "win": "neutral"},
            {"feature": "数学动画", "cursor": "Manim", "windsurf": "数学 / 公式可视化", "win": "neutral"},
            {"feature": "像素合成", "cursor": "MoviePy", "windsurf": "纯 Python、简单拼接", "win": "neutral"},
            {"feature": "画布引擎", "cursor": "PixiJS / Cocos", "windsurf": "复杂粒子动画", "win": "neutral"},
            {"feature": "命令行", "cursor": "FFmpeg + 脚本", "windsurf": "批量转码、字幕烧录", "win": "neutral"},
        ],
    },
    # 4 · @TableScene — 逼 AI 给「不适用+坑」（判断层矩阵，highlight 坑列）
    "4": {
        "eyebrow": "技术选型 · 人盯着「坑」那列做减法",
        "title": "六个方案的适合 / 不适合 & 已知坑",
        "background": "gradient",
        "headers": ["方案", "适合场景", "不适合 & 已知的坑"],
        "rows": [
            {"feature": "Remotion", "cursor": "前端栈、复杂排版、跨期复用", "windsurf": "顶层读浏览器对象打包崩；BUSL 授权", "win": "cursor"},
            {"feature": "Motion Canvas", "cursor": "代码演示、精确时序", "windsurf": "生态小、模板要自攒", "win": "neutral"},
            {"feature": "Manim", "cursor": "数学 / 公式 / 算法", "windsurf": "学习陡、排版弱、渲染慢", "win": "neutral"},
            {"feature": "MoviePy", "cursor": "纯 Python、简单拼接", "windsurf": "文字排版繁琐、多层吃内存", "win": "neutral"},
            {"feature": "PixiJS / Cocos", "cursor": "游戏类粒子动画", "windsurf": "换行 / 对齐计算复杂", "win": "neutral"},
            {"feature": "FFmpeg + 脚本", "cursor": "批量转码、兜底合成", "windsurf": "命令晦涩、难调试", "win": "neutral"},
        ],
    },
    # 5 · @ConceptScene — 回到约束，为什么选 Remotion
    "5": {
        "eyebrow": "技术选型 · 回到我自己的约束",
        "title": "为什么是 Remotion",
        "background": "gradient",
        "items": [
            {"label": "模板", "title": "固定模板换数据就复用", "desc": "改一处主题，全系列生效", "icon": "🏗️"},
            {"label": "AI", "title": "让 AI 接手最稳", "desc": "只填数据、套现成组件，最不容易出错", "icon": "🤖"},
            {"label": "工具链", "title": "一行命令出片 + 网页生态", "desc": "npx remotion render；CSS / 动效 / 图表库随手拿", "icon": "▶️"},
        ],
    },
    # 6 · @SplitLayout — Remotion vs 复制粘贴 HTML
    "6": {
        "eyebrow": "技术选型 · Remotion vs 复制粘贴 HTML",
        "title": "模板复用 / 让 AI 接手 / 长期维护",
        "background": "gradient",
        "headers": ["维度", "✅ Remotion", "❌ 复制粘贴 HTML"],
        "rows": [
            {"feature": "模板复用", "cursor": "改一处全系列生效", "windsurf": "越改越乱", "win": "cursor"},
            {"feature": "让 AI 接手", "cursor": "结构稳，只填数据", "windsurf": "容易跑偏", "win": "cursor"},
            {"feature": "长期维护", "cursor": "十期后还能管", "windsurf": "维护是灾难", "win": "cursor"},
            {"feature": "如实代价", "cursor": "React 栈 + BUSL，规模化付费", "windsurf": "写得快、维护崩", "win": "neutral"},
        ],
    },
    # 7 · @ConceptScene — 一份配置， Explainer 按 type 分发到现成组件.
    # The point of the section is the type->component dispatch map, so the
    # A-rail renders it as a TableScene (type / 现成组件 / 用途).
    "7": {
        "type": "table_scene",
        "eyebrow": "技术落地 · 一份配置 按 type 分发",
        "title": "Explainer 把 type 派发给现成组件",
        "background": "gradient",
        "headers": ["配置 type", "现成组件", "用途"],
        "rows": [
            {"feature": "comparison", "cursor": "ComparisonCard", "windsurf": "左右两栏对比", "win": "neutral"},
            {"feature": "terminal_scene", "cursor": "合成终端", "windsurf": "逐行打字，不用真录屏", "win": "neutral"},
            {"feature": "screenshot_scene", "cursor": "截图 + 光标叠层", "windsurf": "点击 / 打字脚本化演示", "win": "neutral"},
            {"feature": "charts", "cursor": "柱 / 线 / 饼图、KPI", "windsurf": "数据驱动图表", "win": "neutral"},
            {"feature": "concept / split", "cursor": "ConceptScene / SplitLayout", "windsurf": "概念图解 / 左右分屏", "win": "neutral"},
        ],
    },
    # 8 · @TerminalScene — 配置即内容，让 AI 填字段
    "8": {
        "terminalTitle": "只写配置：一个 comparison",
        "prompt": "$",
        "steps": [
            {"kind": "cmd", "text": "cat scenes/comparison.jsonc"},
            *_terminal_lines(
                "{\n"
                '  "type": "comparison",\n'
                '  "title": "传统剪辑 vs 代码即视频",\n'
                '  "leftLabel": "传统剪辑",   "leftValue": "拖时间轴，改一处全手工重排",\n'
                '  "rightLabel": "代码即视频", "rightValue": "改一行配置，重新编译出片"\n'
                "}"
            ),
            {"kind": "pill", "text": "TS 给每个字段定死格式，填错即编译报错", "color": "#22D3EE"},
        ],
    },
    # 9 · @SplitLayout（两个 @TerminalScene）— 造组件 ❌ vs 填数据 ✅
    "9": {
        "eyebrow": "技术落地 · 配置即内容",
        "title": "❌ 从零手写组件  vs  ✅ 只填数据复用",
        "background": "gradient",
        "headers": ["维度", "❌ 从零手写组件", "✅ 只填数据"],
        "rows": [
            {"feature": "代码", "cursor": "export const ComparisonScene = () => {…}", "windsurf": "const data = { left, right }", "win": "windsurf"},
            {"feature": "复用性", "cursor": "重复造轮子，丢了「换数据就复用」", "windsurf": "套现成 @ComparisonCard，改数据即可", "win": "windsurf"},
            {"feature": "出错率", "cursor": "AI 乱发挥空间大", "windsurf": "TS 字段类型兜底，填错即报错", "win": "windsurf"},
        ],
    },
    # 10 · @ScreenshotScene — 数字主持人（基础版），三处 callout
    "10": {
        "backgroundImage": AVATAR_PLACEHOLDER_REL,
        "screenshotSize": {"width": 1920, "height": 1080},
        "cursorStartAt": [0.5, 0.08],
        "screenshotSteps": [
            {"kind": "pause", "seconds": 4},
            {"kind": "callout_balloon", "anchor": [0.6, 0.22], "position": "right",
             "text": "取景预设：整体渲一次，按场景裁半身 / 全身", "durationSeconds": 7},
            {"kind": "pause", "seconds": 6},
            {"kind": "callout_balloon", "anchor": [0.5, 0.62], "position": "left",
             "text": "脚踩稳：在大腿上把髋部摆动反向抵消，脚踩原地", "durationSeconds": 7},
            {"kind": "pause", "seconds": 6},
            {"kind": "callout_balloon", "anchor": [0.5, 0.42], "position": "right",
             "text": "边界：坚决不做对口型数字人、不做 AI 假界面", "durationSeconds": 6},
        ],
    },
    # 11 · @SplitLayout — SSR 避坑，把规则写死交给 AI
    "11": {
        "eyebrow": "技术落地 · SSR 避坑",
        "title": "❌ 打包阶段就崩  vs  ✅ 守卫 + 规则一次写死",
        "background": "gradient",
        "headers": ["对比", "❌ 顶层读 window", "✅ typeof 守卫 + 规则"],
        "rows": [
            {"feature": "代码", "cursor": "const w = window.innerWidth", "windsurf": "typeof window!=='undefined' ? … : 1920", "win": "windsurf"},
            {"feature": "结果", "cursor": "ReferenceError，渲染红屏", "windsurf": "浏览器才读，否则给默认值", "win": "windsurf"},
            {"feature": "根治", "cursor": "每次口头提醒 AI", "windsurf": ".cursor/rules/remotion-ssr.mdc 一次写死", "win": "windsurf"},
        ],
    },
    # 12 · @TerminalScene — 一行命令出片
    "12": {
        "terminalTitle": "npx remotion render 出片",
        "prompt": "$",
        "steps": [
            {"kind": "cmd", "text": "cd OpenMontage/remotion-composer"},
            {"kind": "cmd", "text": "npx remotion studio"},
            {"kind": "out", "text": "# 可视化调试，核对 Composition 注册名"},
            {"kind": "cmd", "text": "npx remotion render src/index.ts ep02-video-render out/ep02.mp4"},
            {"kind": "out", "text": "Rendering frames... ████████████ 100%"},
            {"kind": "pill", "text": "✓ out/ep02.mp4", "color": "#34D399"},
        ],
    },
    # 13 · @OutroScene — 结尾 CTA
    "13": {
        "headline": "整期三步：找技术路径 + 技术选型 + 技术落地",
        "cta": "关注 · 下期 EP03 字幕匹配：Whisper 让字幕踩着话音跳",
        "background": "gradient",
    },
}


def fallback_content(cut_type: str, voice_text: str) -> dict[str, Any]:
    """Best-effort props when a section id is missing from SCENE_CONTENT."""
    if cut_type == "text_card":
        return {"text": clean_voice_text(voice_text)[:100] + "…"}
    return {"text": clean_voice_text(voice_text)[:100] + "…"}


# ---------------------------------------------------------------------------
# 06-tts audio: per-segment durations + optional concatenated narration track
# ---------------------------------------------------------------------------

def load_tts_segments(audio_dir: Path) -> list[dict[str, Any]] | None:
    manifest = audio_dir / "manifest.json"
    if not manifest.exists():
        return None
    data = json.loads(manifest.read_text(encoding="utf-8"))
    segments = data.get("segments")
    if not isinstance(segments, list) or not segments:
        return None
    return segments


def concat_narration(audio_dir: Path, segments: list[dict[str, Any]], out_path: Path) -> bool:
    """Concatenate the per-segment WAVs into a single narration track via ffmpeg."""
    files = [audio_dir / s["output_file"] for s in segments]
    missing = [f for f in files if not f.exists()]
    if missing:
        print(f"  [skip audio concat] missing {len(missing)} segment wav(s), e.g. {missing[0].name}")
        return False
    out_path.parent.mkdir(parents=True, exist_ok=True)
    list_file = out_path.with_suffix(".concat.txt")
    list_file.write_text(
        "".join(f"file '{f.as_posix()}'\n" for f in files), encoding="utf-8"
    )
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
                "-ar", "22050", "-ac", "1", "-c:a", "pcm_s16le", str(out_path),
            ],
            check=True, capture_output=True, text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        detail = getattr(exc, "stderr", "") or str(exc)
        print(f"  [skip audio concat] ffmpeg failed: {detail.strip()[:200]}")
        return False
    finally:
        list_file.unlink(missing_ok=True)
    return True


def ensure_avatar_placeholder(composer_dir: Path) -> None:
    """Generate the @ScreenshotScene avatar-framing backdrop if it is missing.

    @ScreenshotScene needs a real backgroundImage to render. EP02 §10 is a
    schematic of the VRMAvatar framing presets (no real recording), so we draw
    a lightweight placeholder stage with ffmpeg and let the callouts label it.
    """
    target = composer_dir / "public" / AVATAR_PLACEHOLDER_REL
    if target.exists():
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    vf = (
        "drawbox=x=0:y=0:w=1920:h=1080:color=0x0F1629@1:t=fill,"
        "drawbox=x=735:y=120:w=450:h=820:color=0x172033:t=fill,"
        "drawbox=x=735:y=120:w=450:h=820:color=0x2B3A55:t=6,"
        "drawbox=x=885:y=210:w=150:h=150:color=0x3B4D6E:t=fill,"
        "drawbox=x=820:y=380:w=280:h=360:color=0x33425E:t=fill,"
        "drawbox=x=560:y=905:w=800:h=6:color=0x4A5C7A:t=fill"
    )
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "lavfi", "-i", "color=c=0x0B0F1A:s=1920x1080",
                "-vf", vf, "-frames:v", "1", str(target),
            ],
            check=True, capture_output=True, text=True,
        )
        print(f"  Generated screenshot placeholder: {target.relative_to(composer_dir)}")
    except (subprocess.CalledProcessError, FileNotFoundError) as exc:
        detail = getattr(exc, "stderr", "") or str(exc)
        print(f"  [warn] could not generate avatar placeholder: {detail.strip()[:200]}")


# ---------------------------------------------------------------------------
# Main alignment
# ---------------------------------------------------------------------------

def load_script_contract(script_path: Path) -> dict[str, Any]:
    content = script_path.read_text(encoding="utf-8")
    json_blocks = re.findall(r"```json\s*(.*?)\s*```", content, re.DOTALL)
    if not json_blocks:
        raise ValueError("Could not find a structured JSON block (```json) inside the script file.")
    for block in json_blocks:
        try:
            parsed = json.loads(block)
        except json.JSONDecodeError:
            continue
        if isinstance(parsed, dict) and "sections" in parsed and "title" in parsed:
            return parsed
    raise ValueError("Found JSON blocks, but none matched the schema containing 'title' and 'sections'.")


def align_episode(
    script_path: Path,
    audio_path: Path | None = None,
    audio_dir: Path | None = None,
) -> Path:
    print(f"Reading script: {script_path}")
    script_data = load_script_contract(script_path)
    print(f"Loaded Episode script: '{script_data['title']}'")
    sections = script_data["sections"]

    # 06-tts real segment durations (and ordered segment list for concat).
    tts_segments = load_tts_segments(audio_dir) if audio_dir else None
    if tts_segments is not None:
        print(f"Loaded 06-tts manifest: {len(tts_segments)} segments (real durations).")
        if len(tts_segments) != len(sections):
            print(
                f"  [warn] 06 segments ({len(tts_segments)}) != 04 sections "
                f"({len(sections)}); timing will pair by order where possible."
            )

    transcriber = Transcriber() if (audio_path and HAS_TRANSCRIBER) else None
    if transcriber:
        print(f"WhisperX transcriber available; aligning against {audio_path}.")

    final_cuts: list[dict[str, Any]] = []
    final_captions: list[dict[str, Any]] = []
    current_time_sec = 0.0
    needs_screenshot_placeholder = False

    for i, section in enumerate(sections):
        sec_id = str(section["id"])
        template = section.get("scene_template", "")
        voice_text = section["voice"]
        hint_sec = section.get("duration_hint_seconds", 30)

        cut_props = SCENE_CONTENT.get(sec_id)
        # cut.type comes from the 04 scene_template, unless the section's
        # transcribed content explicitly overrides it (e.g. a 6-card array
        # that renders better as a table).
        cut_type = map_template_to_type(template)
        if cut_props and cut_props.get("type"):
            cut_type = cut_props["type"]
        if cut_type == "screenshot_scene":
            needs_screenshot_placeholder = True

        print(f"\nProcessing Section {sec_id}: {template} -> {cut_type}")

        # Real duration from 06 manifest (paired by order), else hint.
        real_dur = None
        if tts_segments is not None and i < len(tts_segments):
            real_dur = float(tts_segments[i].get("duration_seconds") or 0) or None

        # Captions: WhisperX when a single combined track is supplied, else a
        # simulated cadence scaled to the segment's real duration window.
        words = segment_text_to_words(voice_text)
        if transcriber:
            tx = transcriber.execute({"input_path": str(audio_path), "model_size": "base", "language": "zh"})
            if tx.success:
                section_cues = [
                    {"word": wt["word"], "startMs": int(wt["start"] * 1000), "endMs": int(wt["end"] * 1000)}
                    for wt in tx.data.get("word_timestamps", [])
                ]
                real_dur = real_dur or tx.data.get("duration_seconds", hint_sec)
            else:
                print(f"  Transcriber failed: {tx.error}. Falling back to simulation.")
                section_cues = simulate_word_timestamps(words, 0.0)
        else:
            section_cues = simulate_word_timestamps(words, 0.0)

        sim_dur = section_cues[-1]["endMs"] / 1000.0 if section_cues else hint_sec
        dur_sec = real_dur if real_dur else sim_dur
        frames = max(1, int(round(dur_sec * FPS)))
        actual_dur_sec = frames / FPS

        # Scale simulated cues into the actual window and offset to master time.
        # (WhisperX cues are already absolute within the combined track.)
        if transcriber:
            final_captions.extend(section_cues)
        else:
            final_captions.extend(scale_and_offset_cues(section_cues, current_time_sec, actual_dur_sec))

        print(f"  Duration: {dur_sec:.2f}s -> {frames} frames ({actual_dur_sec:.2f}s)")

        if cut_props is None:
            print(f"  [warn] no SCENE_CONTENT for section {sec_id}; using text_card fallback.")
            cut_type = "text_card"
            cut_props = fallback_content(cut_type, voice_text)

        props_fields = {k: v for k, v in cut_props.items() if k != "type"}
        final_cuts.append({
            "id": f"scene-{sec_id}",
            "source": "",
            "type": cut_type,
            "in_seconds": round(current_time_sec, 3),
            "out_seconds": round(current_time_sec + actual_dur_sec, 3),
            **props_fields,
        })

        current_time_sec += actual_dur_sec

    # Ensure the @ScreenshotScene backdrop exists so the render doesn't break.
    if needs_screenshot_placeholder:
        ensure_avatar_placeholder(COMPOSER_DIR)

    props_payload: dict[str, Any] = {
        "theme": "flat-motion-graphics",
        "cuts": final_cuts,
        "overlays": [
            {
                "type": "provider_chip",
                "in_seconds": 1.0,
                "out_seconds": round(max(current_time_sec - 1.0, 1.0), 3),
                "providers": ["remotion", "react", "whisperx"],
            }
        ],
        "captions": final_captions,
    }

    # Audio: prefer the 13-segment 06-tts concat; fall back to a single track.
    audio_cfg: dict[str, Any] = {}
    if audio_dir and tts_segments is not None:
        narration_out = COMPOSER_DIR / "public" / "ep02-narration.wav"
        if concat_narration(audio_dir, tts_segments, narration_out):
            audio_cfg["narration"] = {"src": narration_out.name, "volume": 1}
            print(f"  Concatenated narration -> public/{narration_out.name}")
    elif audio_path and audio_path.exists():
        audio_cfg["narration"] = {"src": audio_path.name, "volume": 1}
    if audio_cfg:
        props_payload["audio"] = audio_cfg

    output_props_path = COMPOSER_DIR / "public" / "demo-props" / "ep02-video-render.json"
    output_props_path.parent.mkdir(parents=True, exist_ok=True)
    output_props_path.write_text(
        json.dumps(props_payload, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    total_frames = int(round(current_time_sec * FPS))
    print("\n" + "=" * 60)
    print("EPISODE AUTO-ALIGNMENT PIPELINE COMPLETED")
    print(f"Cuts: {len(final_cuts)} (1:1 with 04 sections)")
    print(f"Total Duration: {current_time_sec:.2f}s ({total_frames} frames @ {FPS}fps)")
    print(f"Captions aligned: {len(final_captions)} words/characters")
    print(f"Props File: {output_props_path.relative_to(COMPOSER_DIR.parent.parent)}")
    print("=" * 60)
    print("NEXT STEP TO RENDER:")
    print("  cd OpenMontage/remotion-composer")
    print("  npx remotion render src/index.ts ep02-video-render ../renders/ep02-rendered.mp4")
    print("=" * 60)

    return output_props_path


def main() -> int:
    parser = argparse.ArgumentParser(description="OpenMontage EP02 aligner / Remotion props builder")
    parser.add_argument(
        "--script", type=str,
        default="../content-library/ep02-video-render/04-script/README.md",
        help="Path to the script markdown file (its trailing ```json``` contract block is the SSOT)",
    )
    parser.add_argument(
        "--audio", type=str, default=None,
        help="Optional single combined narration track for WhisperX word-level alignment",
    )
    parser.add_argument(
        "--audio-dir", type=str, default=None,
        help="Optional 06-tts assets dir (manifest.json + 13 segment WAVs); drives real "
             "per-cut timing and concatenates an embedded narration track",
    )
    args = parser.parse_args()

    # Keep Chinese log output intact even when stdout is piped/redirected
    # (Windows consoles default to a legacy code page otherwise).
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
        except (AttributeError, ValueError):
            pass

    root_dir = Path(__file__).resolve().parent.parent

    def resolve(rel: str | None) -> Path | None:
        if not rel:
            return None
        p = Path(rel)
        if p.is_absolute():
            return p
        cand = root_dir / rel
        return cand if cand.exists() else Path(__file__).resolve().parent / rel

    script_path = resolve(args.script)
    if script_path is None or not script_path.exists():
        print(f"Error: Script file not found at {script_path}")
        return 1

    audio_path = resolve(args.audio)
    audio_dir = resolve(args.audio_dir)

    try:
        align_episode(script_path, audio_path, audio_dir)
    except Exception as exc:  # noqa: BLE001 - CLI boundary, surface full trace
        import traceback
        print(f"Alignment failed: {exc}")
        traceback.print_exc()
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
