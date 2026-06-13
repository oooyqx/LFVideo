---
description: 视频组装 - 调用视频工程师角色，用 Remotion 把脚本组装成可渲染成片。
---

# 视频组装 Workflow (07-video-assembly)

基于上游定稿脚本（04）、B 轨录屏素材（05）、TTS 语音音频（06），调用 `视频工程师` 角色，用 Remotion（`video/` 工程）把脚本组装成片：A 轨概念动画全自动，B 轨套模板合成录屏素材。

---

## 前置依赖

本工作流假设已完成 `/04-script-draft`、`/05-b-roll-recording`、`/06-tts-synthesis`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`
- 每段含 **A/B 轨标识** 与分镜画面
- （B 轨）录屏素材已就绪：`content-library/<epNN-slug>/05-b-roll/assets/`
- TTS 口播音频已就绪：`content-library/<epNN-slug>/06-tts/assets/`

如果缺少上述输入，先提示用户回到对应上游阶段。

---

## 模板库结构（已落地于 `video/src`）

```
video/src/
├── template/        # 模板库（少改动）：theme / primitives / scenes，统一由 template/index.ts 出口
├── episodes/        # 每期内容（频繁新增）
│   └── epNN-slug/   # 每期一个文件夹：data.ts（文案）+ Episode.tsx（组装）
└── Root.tsx         # 注册所有 episode 的 Composition
```

**核心分界**：`template/` 是印刷机（跨期复用），`episodes/` 是每期换的稿件。新增一期 = 复制 `epNN-slug/` + 改 `data.ts`，原则上不碰模板库。

---

## 步骤

### 1. 加载角色定义

读取 `shared/roles/execution/motion-engineer(视频工程师).md`（若无则加载默认视频组装心智），理解：
- 尽量复用组件，不重复造轮子。
- 保证 A/B 轨拼装时的时间轴绝对对齐。

### 2. 初始化每期 Remotion 数据层 (data.ts)

在 `video/src/episodes/epNN-slug/` 目录下创建 `data.ts`：
- 读取 `04-script/README.md` 末尾的 JSON 契约块——**它是唯一真源（SSOT）**。
- 将每一段**逐条映射**为 Remotion 的 JSON 数据格式：`sections[]` 与 `data.ts` 的场景**一一对应**，`voice` 口播**逐字搬运**，`scene_template` / `duration_hint_seconds` / `visual_beats` 照搬。
- **禁止改写**：不得增删、合并、拆分段落，不得改写标题或口播，不得自创 04 里没有的内容线。本阶段只做"映射"，不做"创作/提炼"。
- 若发现 04 确有问题需要改动，回到 `/04-script-draft` 修订并重新 approve，再回来组装——不要在本阶段就地改稿（否则下游全部漂移）。

### 3. 配置 B 轨人工录制素材（若有）

如果脚本中包含 B 轨录屏/口播：
- 将录好的口播音频（`voice.wav`）和录屏视频（`screen.mp4`）放在 `video/src/episodes/epNN-slug/assets/` 中。
- 在 `data.ts` 里对齐其时间区间。

### 4. 组装每期视频页面 (Episode.tsx)

- 复制现有模板的 `Episode.tsx`。
- 引入 `data.ts` 的文案与配置。
- 拼装场景组件（如 `<IntroScene>`，`<TimelineScene>`，`<TableScene>`，`<ConceptScene>`，`<OutroScene>`）。

### 5. 在 Root.tsx 中注册 Composition

- 打开 `video/src/Root.tsx`。
- 新增一期 `<Composition>` 注册：
  ```tsx
  <Composition
    id="epNN-slug"
    component={epNNEpisode}
    durationInFrames={Math.floor(voiceDuration * 30)} // 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={epNNProps}
  />
  ```

### 6. 本地预览与调试
- 启动开发服务器调试：
  - 运行命令：`npm run studio`
  - 观察画面切换是否流畅、字幕有无超长和错位、配乐音量是否合适。

### 7. 一键渲染成片
- 确认预览无误后，运行渲染命令产出 MP4 视频文件：
  ```bash
  # 16:9 横版主成片
  npm run render
  ```

### 8. 自我检查（不输出，仅约束）

- A 轨是否真正零/少录屏？B 轨人工素材是否已列清？
- 是否复用了模板库，而非每期从零造场景？
- 是否覆盖脚本的"操作层 + 判断层"？判断层是否如实呈现了边界、坑和验收标准？
- 文字是否存在 < 24px 的违规？

### 9. 落盘归档

前置：`content-library/<epNN-slug>/04-script/README.md` 已 `approved`。
- 组装记录写入：`content-library/<epNN-slug>/07-assembly/README.md`（`stage: 07-video-assembly` / `status: draft`）
- 记录内容：Remotion 资源路径、场景编排表、渲染命令、成片输出路径（`video/out/<slug>.mp4`）
- 成片 MP4 留在 `video/out/`；07-assembly/README.md 只记录链接，不复制大文件。
- 更新 `PIPELINE.md`：该期 07 列置 `draft`

### 10. 交付与下一步
输出交付清单（成片 MP4 + 源工程路径 + 字幕），并提示：
> 成片满意（看板标 `approved`）后可执行 `/08-subtitle-gen` 生成字幕，再经 `/09-bgm-mix`、`/10-cover-gen`、`/11-qa-review` 完成后期，最后 `/12-distribute-adapt` 做多平台分发。

---

## 关联文件

- 角色：`shared/roles/execution/motion-engineer(视频工程师).md`
- 上游：`04-script-draft (脚本撰写).md`、`05-b-roll-recording (B轨录屏).md`、`06-tts-synthesis (TTS语音合成).md`
- 下游：`08-subtitle-gen (字幕生成).md`
