"""
06-TTS 合成脚本：使用 Piper TTS (zh_CN-huayan-medium) 将 04 脚本口播文本合成为 WAV 音频。
用法：python synthesize.py
前置：pip install piper-tts (需 onnxruntime + espeak-ng bundled)
"""

import os
import wave
import json
import time
import urllib.request
from pathlib import Path

# --- 配置 ---
SCRIPT_DIR = Path(__file__).parent
MODELS_DIR = SCRIPT_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)
MODEL_PATH = MODELS_DIR / "zh_CN-huayan-medium.onnx"
MODEL_CONFIG_PATH = MODELS_DIR / "zh_CN-huayan-medium.onnx.json"
ASSETS_DIR = SCRIPT_DIR / "assets"
ASSETS_DIR.mkdir(exist_ok=True)

# Hugging Face 下载地址
_HF_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/zh/zh_CN/huayan/medium"
_MODEL_URL = f"{_HF_BASE}/zh_CN-huayan-medium.onnx"
_CONFIG_URL = f"{_HF_BASE}/zh_CN-huayan-medium.onnx.json"


def ensure_model():
    """检查模型文件是否存在，缺失则自动从 Hugging Face 下载。"""
    for path, url, label in [
        (MODEL_PATH, _MODEL_URL, "模型 (.onnx)"),
        (MODEL_CONFIG_PATH, _CONFIG_URL, "配置 (.onnx.json)"),
    ]:
        if path.exists():
            continue
        print(f"[下载] {label} 不存在，正在从 Hugging Face 下载...")
        print(f"  URL: {url}")
        print(f"  目标: {path}")
        try:
            urllib.request.urlretrieve(url, str(path))
            size_mb = path.stat().st_size / (1024 * 1024)
            print(f"  完成 ({size_mb:.1f} MB)")
        except Exception as e:
            if path.exists():
                path.unlink()
            raise RuntimeError(
                f"下载失败: {e}\n"
                f"请手动下载:\n"
                f"  {url}\n"
                f"  保存到: {path}"
            ) from e

# 04 脚本口播文本（按段落 ID 对应）
# 从 04-script/README.md 提取的完整 [口播] 内容
NARRATION_SEGMENTS = {
    "S1_intro": (
        "用PR、AE一帧帧剪视频？停。你有没有想过，写代码就是在写视频？"
        "一段声明式的代码加一份数据，交给渲染器编译成帧，直接合成高清MP4。"
        "这不是科幻，这叫Video-as-Code。"
        "今天这期我把这套范式讲透——它不止Remotion，它是一类思路，至少六条路线。"
        "选哪条、为什么选、怎么避坑、怎么让AI全程接管，一期全讲清。"
    ),
    "S2a_paradigm": (
        "传统剪辑的心智模型是什么？轨道加绝对时间轴。"
        "在时间线上拖素材、对齐音频、手打字幕。"
        "对技术教程这种高频更新的内容来说，这是一场低ROI的体力活——每改一处都得回到时间轴上重摆。"
        "Video-as-Code换了一套模型。视频变成代码和数据，渲染器编译成帧。"
        "这带来三个传统剪辑给不了的工程特性。"
        "第一，可版本控制——代码能diff、能review、能git回滚。"
        "第二，可参数化批量复用——同一模板换一份数据，几十期结构一致的视频批量产出。"
        "第三，AI友好——让AI拖时间轴很难，让AI写代码、改数据、调CSS，这是它最擅长的事。"
    ),
    "S2b_frame_as_state": (
        "一句话讲本质：帧即状态。"
        "Video-as-Code把时间轴变成了代码和数据的函数。"
        "给定一个时间点，渲染器算出该时刻画面长什么样。"
        "输入是声明式的代码或数据，经过渲染器编译成帧，帧序列合成视频。"
        "整条链路都是代码控制的，所以才能被AI端到端接管。"
    ),
    "S2c_six_routes": (
        "代码即视频不等于Remotion。它是一类范式，实现的工具不止一种。看这张表。"
        "第一条路线，DOM加React渲染，Remotion是代表，React组件加CSS就能做复杂排版。"
        "第二条，Motion Canvas，TypeScript声明式动画，适合代码演示和时序编排。"
        "第三条，Manim，Python写几何和公式动画，数学可视化神器。"
        "第四条，MoviePy，NumPy加FFmpeg，纯Python做简单拼接。"
        "第五条，PixiJS这类游戏引擎，Canvas逐帧绘制做粒子效果。"
        "第六条，FFmpeg加脚本，命令式合成做批量转码。"
        "六条路线，内核一样——用代码描述画面、编译成帧、合成视频。"
        "区别只在描述层用什么语言、渲染层用什么引擎。"
    ),
    "S3a_judgment_matrix": (
        "范式理解了，接下来要做选择题。"
        "判断层不是中立百科式综述，它是边界——每个方案必须回答什么前提下成立，哪步会翻车。"
        "看这个矩阵。"
        "Remotion，前端栈复杂排版没问题，跨期模板复用没问题，但零前端基础的项目别碰，而且模块顶层读window会崩、商业用途要BUSL授权。"
        "Motion Canvas，时序动画很强，但网页级Flex排版不如React生态。"
        "Manim，数学可视化天花板，但学习曲线陡、排版弱、渲染慢。"
        "MoviePy，纯Python简单拼接够用，但复杂文字动效很痛苦。"
        "PixiJS做游戏级粒子效果，但文本对齐是灾难。"
        "FFmpeg做批量转码和字幕烧录，但filtergraph语法人类基本看不懂。"
        "怎么对号入座？"
        "我们这个频道要做的是一期一个模板、字幕代码卡片高复用的硬核技术视频，"
        "所以主线是Remotion做A轨成片，MoviePy加FFmpeg做B轨拼接闪避。"
    ),
    "S3b_remotion_reasons": (
        "选型不是哪个最火选哪个，要回到核心约束。"
        "我们频道要的是：固定模板加内容批量替换，让AI端到端接管，而且跨期可维护。"
        "在这个约束下，Remotion胜出有四个硬理由。"
        "第一，也是决定性的——数据驱动模板，类型安全跨期复用。"
        "Remotion的data.ts到Episode到template四层结构，天生适合模板与数据分离。"
        "TypeScript保证每期换数据时格式不出错。"
        "第二，AI友好，每期只让AI填数据和微调CSS，幻觉空间最小。"
        "第三，CLI原生，npx remotion render一行命令就能出片。"
        "第四，网页生态红利，CSS、SVG、Flexbox、所有前端动效库随手可用。"
    ),
    "S3c_comparison": (
        "一个对照就能看清区别。"
        "左边Remotion，TypeScript约束，跨期类型安全，AI只填数据不碰结构，改一处主题全期生效。"
        "右边HyperFrames，HTML无类型检查，直接写HTML结构容易漂移，十期以后维护是灾难。"
        "授权上HyperFrames是Apache更宽松，但在模板复用加AI接管这个维度上，Remotion完胜。"
    ),
    "S3d_tradeoffs": (
        "代价也如实交代。"
        "第一，Remotion基于React技术栈——但不用担心，本项目就是让AI来写组件和填数据，人把控架构就行，前端基础不是门槛。"
        "第二，BUSL商业授权，规模化商用需要付费，我们当前规模没影响。"
        "第三，SSR环境约束，Node端求值时读window会崩。"
        "这个坑怎么解？后面第五段详细讲，一条MDC规则就能让AI自动规避，一次性封死。"
    ),
    "S4a_pipeline": (
        "视频的画面能用代码控制，那制作视频的工作流本身，能不能也做成代码？"
        "我们的答案是——能。这才是频道真正的护城河。"
        "看这条线。01选题分析，02内容策划，03视听编排，04脚本撰写，05视频组装，06分发适配，07资源归档。"
        "七个阶段，每个阶段都有对应的角色定义和工作流文件，真实存在于我们的仓库里。"
        "这就是流程即代码——Process-as-Code。"
    ),
    "S4b_three_piece": (
        "怎么做到的？三件套。"
        "角色等于system prompt——定义每个岗位的视角、能力和边界。"
        "工作流等于user prompt——每个阶段的标准步骤和交互协议。"
        "产物文件的frontmatter等于状态机——stage和status字段就是进度的唯一真相源。"
        "每个阶段遵守同一套纪律：读角色、按步骤干活、不越界、关键节点停下等人确认、改完状态落盘。"
    ),
    "S4c_orchestrator": (
        "把这三件套摆出来，一个最小编排器就能驱动整条线。"
        "看这段Python伪代码。"
        "扫描所有产物的frontmatter，找到status是approved的阶段，读取对应的角色文件作为system prompt，读取工作流作为user prompt，喂给LLM，自动推进下一阶段。"
        "python-frontmatter这个库真实存在，这段代码不是PPT——虽然目前还是paper spec，但架构已经跑通了。"
    ),
    "S4d_ab_track": (
        "真正的难点是多模态物理限制。"
        "A轨——概念动画——可以全自动，AI生成数据，Remotion组件渲染，不用人碰。"
        "B轨——真实IDE录屏——我们有个规矩叫TAD-01，强制真人录制，禁止AIGC伪界面。"
        "所以流程里要设计挂起等待机制，B轨没到位就先挂着。"
        "正因为流程是代码，本期录屏要真实跑通的也是一段可复现的提示词链。"
        "Prompt第一条：基于remotion-composer现有的ComparisonCard组件，生成对比卡片的数据配置，只产出数据，不要新建组件。"
        "Prompt第二条：为Cursor在.cursor/rules下编写一份MDC规则，约束Remotion组件自动加上window的安全守卫。"
    ),
    "S5a_data_driven": (
        "到了实操。第一个原则——首选数据驱动现成组件，不要从零手写。"
        "看左边，反面示例，为这一期从零写一个ComparisonScene.tsx，手写布局、手写样式、手写动画。"
        "这违反了固定模板加内容替换的原则，而且完全忽略了仓库里现成的ComparisonCard组件。"
        "看右边，正确做法。你只产出一个data对象——left方案、right方案，各自的title、points、status——然后丢给ComparisonCard渲染。"
        "数据和模板分离，下一期只换数据就行。这才是数据驱动模板的正确用法。"
    ),
    "S5b_ssr_guard": (
        "第二个避坑点——SSR环境约束。"
        "Remotion渲染分两个阶段。第一阶段，Node端打包并求值Composition列表，这一步拿时长、拿尺寸、做任务拆分。"
        "第二阶段，无头Chrome逐帧截图再合成。"
        "崩溃点在第一步——你的代码在模块顶层读了window.innerWidth，Node环境没有window对象，直接报ReferenceError。"
        "这不是逐帧SSR的问题，这是模块求值阶段的问题——知道区别，你才知道往哪查bug。"
        "怎么修？加typeof window守卫。"
        "然后把这条写进.cursor/rules/remotion-ssr.mdc文件，globs指向remotion-composer的src目录，"
        "以后AI生成组件就自动带守卫。一次性把这个约束封死，不用人盯。"
    ),
    "S5c_ai_render": (
        "到了最后一步——产出数据、套组件、渲染出片。这一步人不用逐行写代码。"
        "把活拆成AI能稳定接手的形状。"
        "第一步，让AI填数据和套现成组件。人给出每段要对比什么要展示什么，AI按数据驱动范式产出data，复用ComparisonCard、charts等组件，不从零造轮子。"
        "第二步，用规则替AI兜底边界。SSR守卫写进MDC规则，AI生成组件时自动带。"
        "第三步，渲染命令交给AI或脚本代跑。"
        "cd到remotion-composer目录，npx remotion studio可视化调试，npx remotion render直接出片。"
        "纯命令行，可以上CI，人只看产物。"
    ),
    "S6_cta": (
        "代码即视频加流程即代码，把内容生产从手工活变成可维护的工程流水线。"
        "代码即视频的范式，Remotion只是其中一条路线，但它在数据驱动和AI接管这个维度上目前最优。"
        "而流程即代码——角色等于prompt、工作流等于步骤、frontmatter等于状态机——这套自家流水线本身就是最好的Dogfooding证据。"
        "开源仓库在简介，自取。"
        "下期，我们攻克字幕与卡点——Whisper毫秒级时间戳怎么自动驱动弹跳字幕。关注，别错过。"
    ),
}


def synthesize_all():
    """使用 Piper TTS 合成所有口播段落"""
    ensure_model()

    from piper import PiperVoice

    print(f"Loading model: {MODEL_PATH}")
    voice = PiperVoice.load(str(MODEL_PATH))
    print(f"Model loaded. Sample rate: {voice.config.sample_rate} Hz")

    results = []
    total_duration = 0.0

    for seg_id, text in NARRATION_SEGMENTS.items():
        output_path = ASSETS_DIR / f"{seg_id}.wav"
        print(f"\n--- Synthesizing: {seg_id} ---")
        print(f"  Text length: {len(text)} chars")

        start_time = time.time()

        with wave.open(str(output_path), "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(voice.config.sample_rate)
            voice.synthesize_wav(text, wf)

        elapsed = time.time() - start_time
        file_size = output_path.stat().st_size

        # Calculate duration from WAV
        with wave.open(str(output_path), "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            duration = frames / rate

        total_duration += duration
        results.append({
            "segment_id": seg_id,
            "output_file": str(output_path.name),
            "text_chars": len(text),
            "duration_seconds": round(duration, 2),
            "file_size_bytes": file_size,
            "synthesis_time_seconds": round(elapsed, 2),
        })
        print(f"  Duration: {duration:.2f}s | Size: {file_size} bytes | Synth time: {elapsed:.2f}s")

    # Write manifest
    manifest = {
        "engine": "piper-tts",
        "model": "zh_CN-huayan-medium",
        "sample_rate": voice.config.sample_rate,
        "total_duration_seconds": round(total_duration, 2),
        "total_segments": len(results),
        "segments": results,
    }
    manifest_path = ASSETS_DIR / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"DONE! {len(results)} segments synthesized.")
    print(f"Total audio duration: {total_duration:.2f}s ({total_duration/60:.1f} min)")
    print(f"Manifest: {manifest_path}")
    print(f"Assets dir: {ASSETS_DIR}")


if __name__ == "__main__":
    synthesize_all()
