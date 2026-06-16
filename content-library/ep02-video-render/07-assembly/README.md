---
stage: 07-video-assembly
status: draft
source_workflow: /07-video-assembly
upstream_inputs:
  - 04-script/README.md (status: draft) — 契约块 sections[] 即组装真相源
  - 06-tts/assets/ (status: draft) — 13 段 WAV + manifest.json（实测时长驱动时间轴，--audio-dir 拼接成整轨）
  - 05-b-roll/README.md (status: suspended — A轨兜底)
  - OpenMontage/align_episode.py — 组装脚本（产 props JSON）
  - OpenMontage/remotion-composer/src/Root.tsx — Explainer composition（渲染入口）
---

# ep02 视频组装方案

> ⚠️ **重做版（对齐真实管线）**：本期不手写 `data.ts`/`Episode.tsx`。真实组装是一条脚本管线——
> **`align_episode.py` 读 04 契约块 + 06 音频 → 生成一份 props JSON → 喂给现成的 `Explainer` composition 渲染**。
> 组装方案逐条映射 04 契约块的 **13 段 `sections[]`**（id 1–13，禁止增删/合并/改写/重排）。旧的 16 场景（`帧即状态/七阶段流水线/三件套/编排器伪代码`，含 `@TimelineScene`）已删除，归 EP05/EP06。

## 真实组装管线（一句话）

```
04-script/README.md (末尾 json 契约块: sections[])  ─┐
                                                    ├─► align_episode.py ─► public/demo-props/ep02-video-render.json ─► <Explainer> ─► mp4
06-tts/assets/ (manifest.json 驱动时间轴; --audio-dir 拼 13 段成整轨)  ─┘
```

- **渲染的 composition 是 `Explainer`**（`remotion-composer/src/Root.tsx`），它本身不含内容，全靠传入的 props JSON 驱动。
- **Remotion 真正吃的文件 = `OpenMontage/remotion-composer/public/demo-props/ep02-video-render.json`**，由 `align_episode.py` 生成，不是手写的。
- 场景组件（`custom-templates/scenes`、`components/`）是**预先存在的引擎**，本期不新增、不按期生产。

---

## 制作概要

| 维度 | 值 |
|------|---|
| **组装脚本** | `OpenMontage/align_episode.py`（`--script` 默认指向 04-script/README.md；`--audio-dir` 传 06-tts/assets 读 manifest 实测时长 + 拼接 13 段成整轨；`--audio` 传单个整轨走 WhisperX 字级对齐） |
| **渲染 composition** | `Explainer`（`remotion-composer/src/Root.tsx`） |
| **props 产物** | `remotion-composer/public/demo-props/ep02-video-render.json` |
| **轨道** | A 轨为主（概念动画全自动），B 轨挂起（A 轨兜底） |
| **时长** | **≈363.90s（6 分 04 秒）** = 06-TTS 13 段实测时长累加（Piper 样片；真实渲染时长以 `align_episode.py` 对 06 WAV 的 WhisperX 对齐结果为准） |
| **分辨率** | 1920×1080 @ 30fps |
| **align_episode 已支持的场景 type** | `intro_scene` / `concept_scene` / `table_scene` / `terminal_scene` / `screenshot_scene` / `outro_scene` / `timeline_scene` + `text_card`（兜底） |
| **新增组件** | 无 |

---

## 13 段映射表（04 `scene_template` → align_episode 输出 type）

> `align_episode.py` 用 `section["scene_template"]` 里的 `@XxxScene` 字符串匹配，落到下面的 `cut.type`；每段画面 props 由 `SCENE_CONTENT[id]`（逐条转写自 04 `[画面]`）提供。全 13 段均有专属映射，**不再落 `text_card` 兜底**（见下方"已知差距"）。

| # | 04 段 | scene_template (04) | → align_episode `cut.type` | 音轨段 | 06 实测区间 |
|---|------|--------------------|---------------------------|--------|-----------|
| 1 | 1 | `@IntroScene` | `intro_scene` | S01_open | 0:00–0:39 |
| 2 | 2 | `@ConceptScene` | `concept_scene` | S02_routes_intro | 0:39–0:57 |
| 3 | 3 | `@ConceptScene` | `concept_scene` | S03_six_routes | 0:57–1:30 |
| 4 | 4 | `@TableScene` | `table_scene` | S04_pitfalls | 1:30–2:20 |
| 5 | 5 | `@ConceptScene` | `concept_scene` | S05_why_remotion | 2:20–2:46 |
| 6 | 6 | `@SplitLayout` | `table_scene` | S06_vs_html | 2:46–3:11 |
| 7 | 7 | `@ConceptScene` | `table_scene`（type→组件派发表） | S07_dispatch | 3:11–3:38 |
| 8 | 8 | `@TerminalScene` | `terminal_scene` | S08_config | 3:38–3:56 |
| 9 | 9 | `@SplitLayout` | `table_scene` | S09_fill_vs_build | 3:56–4:23 |
| 10 | 10 | `@ScreenshotScene` | `screenshot_scene` | S10_avatar | 4:23–4:51 |
| 11 | 11 | `@SplitLayout` | `table_scene` | S11_ssr | 4:51–5:25 |
| 12 | 12 | `@TerminalScene` | `terminal_scene` | S12_render | 5:25–5:44 |
| 13 | 13 | `@OutroScene` | `outro_scene` | S13_cta | 5:44–6:04 |

> 上表 13 行与 04 脚本 `sections[]` 的 13 段（id 1–13）**一一对应**，不增删、不合并、不改写。`align_episode.py` 按段顺序累加帧时间轴（30fps 取整），并为每段把 `voice` 切成字级字幕（`captions[]`）。

---

## props JSON 结构（align_episode.py 实际产物）

`align_episode.py` 写出的 `public/demo-props/ep02-video-render.json` 形如：

```jsonc
{
  "theme": "flat-motion-graphics",
  "cuts": [
    {
      "id": "scene-1",
      "type": "intro_scene",          // 由 @IntroScene 映射而来
      "in_seconds": 0.0,
      "out_seconds": 39.28,
      // ...该 type 对应的 props 字段（title/subtitle/items/rows/...）
    }
    // ... 共 13 个 cut，对应 04 的 13 段
  ],
  "overlays": [
    { "type": "provider_chip", "in_seconds": 1.0, "out_seconds": 362.9,
      "providers": ["remotion", "react", "whisperx"] }
  ],
  "captions": [
    { "word": "做", "startMs": 0, "endMs": 240 }
    // ... 字级字幕，覆盖全片
  ],
  "audio": { "narration": { "src": "ep02-narration.wav", "volume": 1 } }  // --audio-dir 拼接产物（或 --audio 单轨）
}
```

- `cut.in_seconds/out_seconds`：按 06 manifest 实测时长累加、30fps 取整后的区间。
- `captions`：每段 `voice` 逐字切分；带 `--audio` 时由 WhisperX 实测，否则按标点停顿模拟。
- `audio.narration`：`--audio-dir` 用 ffmpeg 把 06 的 13 段 WAV 拼成 `public/ep02-narration.wav` 并引用；也可用 `--audio` 传单个整轨。

---

## 运行 / 渲染命令

> **渲染按需、预览优先（团队约定，见 `AGENT_GUIDE.md` 铁律二·4）**：出整片很耗时，**默认不要自动 `remotion render`**。日常迭代只跑「生成 props」+ `npx remotion studio` 在浏览器里预览核对；**只有人类明确给出渲染命令时**才导出 mp4。

```bash
# 1) 生成 props + 嵌入 13 段整轨（按 06 manifest 实测时长；改 04 后必重跑）
cd OpenMontage
python align_episode.py --audio-dir ../content-library/ep02-video-render/06-tts/assets

# 1') 仅生成 props（不动音频，仍用 06 manifest 的实测时长）
python align_episode.py

# 1'') 用单个整轨走 WhisperX 字级对齐（需 transcriber 环境）
python align_episode.py --audio ../path/to/combined.wav

# 2) 预览（默认；吃 props JSON，已注册为专用 composition）
cd remotion-composer
npx remotion studio

# 3) 出片：仅在人类明确要求时执行
npx remotion render ep02-video-render ../renders/ep02-rendered.mp4
```

---

## 需人工提供的素材（B 轨）

> 来源 = `05-b-roll/README.md`（阶段 `05-b-roll-recording`，当前 `suspended`，本期暂缓）。逐条对应 04 `b_track_assets_required`，本期均以 A 轨（概念场景）兜底；补录后把 05 改回 `approved` 即可替换：

| 素材 ID | 消费段（04 段 / 音轨段） | 描述 | A 轨兜底方案 |
|---------|------|------|------------|
| b-ide-route-pitfalls | 4 / S04_pitfalls | IDE 录屏：和 AI 对话追问每条路的"不适用+坑" | `table_scene` 判断层矩阵（highlight 坑列） |
| b-ide-config-fill | 9 / S09_fill_vs_build | IDE 录屏：从零手写❌ vs 只填数据✅ | `table_scene` 左右代码对照 |
| b-ide-ssr-crash | 11 / S11_ssr | IDE 录屏：顶层读 window 触发 ReferenceError 红屏 | `table_scene` 崩溃代码 |
| b-ide-ssr-fix | 11 / S11_ssr | IDE 录屏：typeof 守卫 + 写入 .cursor/rules mdc 一次通过 | `table_scene` 守卫代码 |
| b-term-render | 12 / S12_render | 终端录屏：npx remotion render 出片（可选） | `text_card`/终端模拟进度 |

---

## 已解决的三件差距（原 render_ready=false 原因）

原本阻碍成片的三件事现均已在 `align_episode.py` 解决：

1. **`cut_props` 不再写死**：旧版对每个 `cut.type` 填固定占位文案；现由 `SCENE_CONTENT[id]` 驱动，13 段画面均逐条转写自 04 `sections[]` 的 `[画面]`（`visual_instructions` / `voice`）。
2. **`@TerminalScene` / `@ScreenshotScene` 已映射**：§8/§12 → `terminal_scene`（带 `steps[]` 逐行打字），§10 → `screenshot_scene`（`backgroundImage` + `screenshotSteps[]` callout）；§3/§7 因条目多显式覆盖为 `table_scene`。全 13 段零 `text_card` 兜底。
3. **13 段音频已支持**：`--audio-dir` 读 06 `manifest.json` 取每段实测时长驱动时间轴，并用 ffmpeg 把 13 段 WAV 拼成 `public/ep02-narration.wav` 嵌入 props；无 WhisperX 时字幕按中/英节奏模拟并缩放到实测时长窗口。

---

## 当前状态

- 组装方案已对齐**真实管线**（`align_episode.py → props JSON → Explainer`），废弃了此前虚构的 `src/episodes/ep02-video-render/data.ts`+`Episode.tsx` 设计。
- 13 段 `scene_template` 与 04 `sections[]` 一一对应；映射、props 结构、渲染命令均据 `align_episode.py` 与 `Root.tsx` 实际代码记录。
- **已可出 A 轨成片**：13 cut 全部落到专属场景组件，嵌入 13 段拼接旁白，`npx remotion render ep02-video-render` 可直接出片。B 轨 5 条均有 A 轨兜底，补录后可替换。

```json
{
  "stage": "07-video-assembly",
  "episode": "ep02-video-render",
  "total_scenes": 13,
  "reference_duration_seconds": 363.90,
  "assembler": "OpenMontage/align_episode.py",
  "render_composition": "Explainer",
  "props_output": "OpenMontage/remotion-composer/public/demo-props/ep02-video-render.json",
  "audio_source": "06-tts/assets (piper-tts, 13 segments, manifest-driven)",
  "narration_track": "OpenMontage/remotion-composer/public/ep02-narration.wav (13 段 ffmpeg 拼接)",
  "scene_template_to_type": {
    "@IntroScene": "intro_scene",
    "@ConceptScene": "concept_scene (§3/§7 显式覆盖 table_scene)",
    "@TableScene": "table_scene",
    "@SplitLayout": "table_scene",
    "@OutroScene": "outro_scene",
    "@TerminalScene": "terminal_scene",
    "@ScreenshotScene": "screenshot_scene"
  },
  "new_components_required": 0,
  "render_ready": true,
  "blocking_on": []
}
```
