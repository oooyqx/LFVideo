---
title: 视频组装
slug: 07-video-assembly
stage: "07"
description: 视频组装 - 调用视频工程师角色，用 Remotion 把脚本组装成可渲染成片。
---

# 视频组装 Workflow (07-video-assembly)

基于上游定稿脚本（04）、录屏素材（05）、TTS 语音音频（06），调用 `视频工程师` 角色，用 Remotion（`OpenMontage/remotion-composer` 工程）把脚本组装成片：自动渲染的概念动画全自动生成，录屏画面套模板合成。

---

## 前置依赖

本工作流假设已完成 `/04-script-draft`、`/05-b-roll-recording`、`/06-tts-synthesis`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`
- 每段含 **自动渲染 / 录屏画面标识** 与分镜画面
- 录屏素材已就绪：`content-library/<epNN-slug>/05-b-roll/assets/`
- TTS 口播音频已就绪：`content-library/<epNN-slug>/06-tts/assets/`

如果缺少上述输入，先提示用户回到对应上游阶段。

---

## 工程结构（已落地于 `OpenMontage/remotion-composer`）

```
OpenMontage/remotion-composer/
├── src/
│   ├── Explainer.tsx      # 单一通用渲染器：按 cut.type 分发到各场景组件（跨期复用）
│   ├── components/        # 场景组件库（IntroScene / ConceptScene / TableScene / …，少改动）
│   ├── custom-templates/  # 自定义模板场景
│   ├── Root.tsx           # 注册所有期的 <Composition>（每期新增一条）
│   └── index.tsx          # Remotion 入口
├── public/demo-props/     # 每期一个 props JSON（频繁新增）：<slug>.json（cut 列表 = 镜头列表）
└── out/                   # 渲染成片输出目录
```

**核心分界**：`Explainer.tsx` + `components/` 是印刷机（跨期复用，按 `cut.type` 分发场景），`public/demo-props/<slug>.json` 是每期换的稿件。**新增一期 = 生成一份 `<slug>.json` + 在 `Root.tsx` 注册一条 `<Composition>`，原则上不碰渲染器与组件库。**

> `scene_template`（04 里的 `@XxxScene`）→ `Explainer` 的 `cut.type` 映射表见 `shared/docs/remotion-spec.md`；引擎未提供的 `@SplitLayout` 等会落到最接近的 cut（如 `comparison_scene`）。

---

## 步骤

### 1. 加载角色定义

读取 `shared/roles/execution/motion-engineer(视频工程师).md`（若无则加载默认视频组装心智），理解：
- 尽量复用组件，不重复造轮子。
- 保证自动渲染画面与录屏画面拼装时的时间轴绝对对齐。

### 2. 生成每期 Remotion props JSON（`public/demo-props/<slug>.json`）

把 04 SSOT 映射成 `Explainer` 可读的 `cuts[]` props，写入 `OpenMontage/remotion-composer/public/demo-props/<slug>.json`（可参考 `OpenMontage/build_ep02_shots_props.py` 那样的生成器，或直接写 JSON）：
- 读取 `04-script/README.md` 末尾的 JSON 契约块——**它是唯一真源（SSOT）**。
- 将每一段**逐条映射**为一个 `cut`，映射单位是**镜头 (shot)**：
  - 若某 section 含 `shots[]`，则为**每个 shot 生成一个 cut**（cut 顺序＝shot 顺序）；`cut.type` 由该 shot 的 `scene_template` 按 `remotion-spec.md` 映射表换算，`props` / `duration_seconds` / `visual_beats` 取自该 shot；该 section 的 `voice` 仍整段对齐到这串 cut 的时间区间上（按 `voice_slice` / `duration_seconds` 切分时间轴）。
  - 若某 section 没有 `shots[]`（短的单镜头段），则退化为整段一个 cut，照搬 section 级 `scene_template` / `props` / `duration_hint_seconds` / `visual_beats`。
  - `voice` 口播一律**逐字搬运**；`cuts[]` 的总数应等于「所有 section 的 shots 数之和（无 shots 的 section 计 1）」——`scripts/pipeline_lint.py` 会用这个数校验组装一致性。
- **禁止改写**：不得增删、合并、拆分段落或镜头，不得改写标题或口播，不得自创 04 里没有的内容线。本阶段只做"映射"，不做"创作/提炼"。
- 若发现 04 确有问题需要改动，回到 `/04-script-draft` 修订并重新 approve，再回来组装——不要在本阶段就地改稿（否则下游全部漂移）。

### 3. 配置人工录屏素材（若有）

如果脚本中包含录屏/口播素材：
- 将录好的口播音频（`voice.wav`）和录屏视频（`screen.mp4`）放在 `OpenMontage/remotion-composer/public/` 下（如 `public/assets/<slug>/`）。
- 在 `<slug>.json` 里对应 cut 的 `props`（如 `videoSrc`）指向该素材并对齐时间区间；录屏素材缺失时该 cut 自动走自动渲染兜底 `cut.type`。

### 4. 复用渲染器（`Explainer` 按 cut.type 分发）

本工程用**单一** `Explainer` 组件按 `cut.type` 分发到场景组件（`<IntroScene>`、`<TableScene>`、`<ConceptScene>`、`<OutroScene>` 等），**不再为每期写 `Episode.tsx`**。
- 若 04 用到的 `scene_template` 已有对应 `cut.type` → 直接复用，无需改渲染器。
- 若确需新场景类型 → 在 `components/` 新增组件并接入 `Explainer` 的分发（属模板库改动，谨慎，跨期共用）。

### 5. 在 Root.tsx 中注册 Composition

- 打开 `OpenMontage/remotion-composer/src/Root.tsx`。
- import 该期 props 并新增一条 `<Composition>`（复用 `Explainer` 组件，时长由 `calculateMetadata` 按 `cuts` 末尾自动算）：
  ```tsx
  import epNNProps from "../public/demo-props/epNN-slug.json";
  // …
  <Composition
    id="epNN-slug"
    component={Explainer}
    durationInFrames={30 * 60}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={epNNProps as unknown as ExplainerProps}
    calculateMetadata={calculateMetadata}
  />
  ```

### 6. 本地预览与调试
- 在 `OpenMontage/remotion-composer/` 下启动 Remotion Studio 调试：
  - 运行命令：`npm run start`（= `npx remotion studio`），打开该期 `id` 的合成逐镜核对。
  - 观察画面切换是否流畅、字幕有无超长和错位、配乐音量是否合适。

### 7. 渲染成片（仅在用户明确下达渲染命令时）
- 遵守 `AGENT_GUIDE.md` 第 4 条：**无明确渲染指令不主动出片**，效果验证一律在预览完成。
- 用户要求出片时，在 `OpenMontage/remotion-composer/` 下运行：
  ```bash
  # 渲染指定期的合成到 out/（半分辨率快验加 --scale=0.5，全高清去掉）
  npx remotion render src/index.tsx epNN-slug out/epNN-slug.mp4
  ```

### 8. 自我检查（不输出，仅约束）

- 自动渲染画面是否真正零/少录屏？人工录屏素材是否已列清？
- 是否复用了模板库，而非每期从零造场景？
- 是否覆盖脚本的"操作层 + 判断层"？判断层是否如实呈现了边界、坑和验收标准？
- 文字是否存在 < 24px 的违规？

### 9. 落盘归档

前置：`content-library/<epNN-slug>/04-script/README.md` 已 `approved`。
- 组装记录写入：`content-library/<epNN-slug>/07-assembly/README.md`（`stage: 07-video-assembly` / `status: draft`）
- 记录内容：Remotion 资源路径、场景编排表、渲染命令、成片输出路径（`OpenMontage/remotion-composer/out/<slug>.mp4`）
- 成片 MP4 留在 `OpenMontage/remotion-composer/out/`；07-assembly/README.md 只记录链接，不复制大文件。
- 更新 `PIPELINE.md`：该期 07 列置 `draft`

### 10. 交付与下一步
输出交付清单（成片 MP4 + 源工程路径 + 字幕），并提示：
> 成片满意（看板标 `approved`）后可执行 `/08-subtitle-gen` 生成字幕，再经 `/09-bgm-mix`、`/10-cover-gen`、`/11-qa-review` 完成后期，最后 `/12-distribute-adapt` 做多平台分发。

---

## 关联文件

- 角色：`shared/roles/execution/motion-engineer(视频工程师).md`
- 上游：`04-script-draft.md`、`05-b-roll-recording.md`、`06-tts-synthesis.md`
- 下游：`08-subtitle-gen.md`
