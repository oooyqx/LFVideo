# 项目上下文记录

> 跨设备 / 跨会话的「首要真相源」。新环境上把本文件交给 AI 阅读即可恢复上下文。
> 配套文档：内容路线见 [Content Plan (内容计划).md](./Content%20Plan%20(%E5%86%85%E5%AE%B9%E8%AE%A1%E5%88%92).md)；架构细节见 [ARCHITECTURE.md](./ARCHITECTURE.md)；协作铁律见 [AGENT_GUIDE.md](./AGENT_GUIDE.md)。
> 最后更新：2026.06.15

---

## 项目状态摘要

| 项 | 值 |
|----|---|
| 仓库 | `DomeButlerBang/LFVideo` |
| 性质 | 硬核技术教程**内容频道**项目（视频 + GitHub 配套资源） |
| 核心打法 | 用 AI IDE 把能力编排成**可复用的自动化工作流**；并以频道自身的「视频生产线」作为头号实战样板（Dogfooding） |
| 当前阶段 | 系列《Vibe Coding 造一条自动化视频生产线》生产中；同步完善流水线自动化能力与成片质量 |
| 当前期 | `ep02-video-render`（推进到 08 字幕 `draft`，详见 [content-library/PIPELINE.md](./content-library/PIPELINE.md)） |
| 下一步 | 收尾 ep02（字幕/组装质量），按 ep02→03→04→05→06 顺序边做边迭代工作流与成片质量；ep01 总览最后制作 |

---

## 核心定位

> **「用 AI IDE 编排可复用工作流，去解决真实场景问题——并把整条流水线本身做成最好的证据。」**

- 不停留在 Cursor/Windsurf/Devin 的单点功能试用，而是把它们编排成**能交付真实成果的工作流**。
- **正向选题**：只挑 AI 真能做成的场景，把「怎么做才能稳、能复用」讲透；不做以黑某功能为目的的选题。
- **头号样板就是本仓库自己**：本频道用一套「角色 × 工作流 × 状态机」驱动的视频生产线（`OpenMontage` + Remotion）来生产关于「如何用 AI IDE 搭这种流水线」的内容——**以行证言（Dogfooding）**。

---

## 内容方法论（操作层 + 判断层）

每期回答一个问题：**这件事 AI IDE 能做成吗？怎么做才能稳、能复用？**

1. **操作层**：具体步骤、Prompt、配置、命令，观众照着能复现。
2. **判断层（边界与验收 / 避坑）**：什么前提下成立、哪一步 AI 易掉链子需要人接管、怎么验收结果。

> 判断层**不是**「吐槽 AI 做不好」，而是「用好它的边界说明」。即便 100% 成功的场景，也必须如实交代边界与坑。这是与「炫技/软广号」的根本区别。
> 写作纪律：**反 FUD / 反噱头**——强调工程结构与可复现性，不夸大常规环境坑，不以代码行数当卖点（脚本 Schema 内置 `anti_hype_forbidden` 噱头黑名单做机器拦截）。

---

## 系统架构（单运行时核心）

整套生产线采用 **「全收敛单运行时（Fully Converged Single-Runtime）」**：以 `OpenMontage/` 为核心，Python 工具箱负责素材/音频/字幕，React 19 + Remotion 渲染器负责成片，两端用 YAML/JSON 配置串联。详见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

### 1. OpenMontage —— 视频「编译器」内核（vendored，AGPLv3）

| 层 | 位置 | 职责 |
|----|------|------|
| Python 工具箱 | `OpenMontage/tools/`（`analysis/ audio/ avatar/ capture/ character/ enhancement/ graphics/ publishers/ subtitle/ video/`，100+ 模块） | 转录、混音、录屏、代码美化、图表、超分、拼剪等原子能力 |
| 调度/校验库 | `OpenMontage/lib/`（`pipeline_loader.py`、`verify_scene_pacing.py`、`scoring.py`、`checkpoint.py` 等） | 管道加载、声画节奏校验、断点续跑 |
| 管道定义 | `OpenMontage/pipeline_defs/*.yaml`（13 条：`animated-explainer`、`talking-head`、`hybrid`、`screen-demo`、`cinematic`、`clip-factory`…） | 「流程即代码」的可执行管道 |
| 契约/技能 | `OpenMontage/schemas/`、`OpenMontage/skills/` + `.agents|.claude|.cursor/skills/` | 工件/检查点 Schema 与 Agent 技能库 |
| 渲染编译器 | `OpenMontage/remotion-composer/`（React 19.2 / Remotion 4.0.47x） | 把 cuts/overlays 配置编译为成片 |

### 2. remotion-composer —— React 渲染层

- 主合成 `src/Explainer.tsx` 按 `cut.type` / `overlay.type` 分发场景组件（详见 [SCENE_TYPES.md](./OpenMontage/remotion-composer/SCENE_TYPES.md)）：
  - **场景**：`text_card`、`hero_title`、`stat_card`、`callout`、`comparison`、`bar_chart`/`line_chart`/`pie_chart`/`kpi_grid`、`progress_bar`、`anime_scene`、`terminal_scene`、`screenshot_scene`，以及直接播放的 `OffthreadVideo`/`Img`。
  - **合成录屏**：`terminal_scene`（终端模拟）与 `screenshot_scene`（截图 + 脚本化光标/打字/气泡叠加）可在 15–30s 的聚焦演示里免去真实录屏。
  - **VRM 数字主持人**：`src/components/VRMAvatar.tsx` 全身渲染一次、各场景按 2D crop 预设取景（corner/bust/full/presenter）；口型由 Whisper 字级字幕 + 拼音韵母驱动，帧确定。
- 自适应自愈：媒体组件做 `src` 空校验与降级占位，避免预览红屏。
- 渲染规范：**1080p（1920×1080 @ 30fps）**，见 [shared/docs/remotion-spec.md](./shared/docs/remotion-spec.md)。

### 3. 混合生产线（TAD-01）

技术教程必须 100% 真实，因此采用 **「人录真实 IDE 录屏 + OpenMontage 组件编译器」** 的混合折中：

```
[人工] 高保真 IDE 录屏 (Raw MP4) ─┐
                                  ▼
[Agent] WhisperX 字级转录 + 智能混音 ─► remotion-composer（载入场景组件 + 主题皮肤）─► 成片 MP4
[Agent] YAML/JSON 配置生成 ───────────┘
```

- 自动渲染（概念/解说）：脚本 → Remotion 组件 → 直接渲染，近全自动。
- 录屏（实操演示）：真实录屏 + 真人/TTS 口播，Remotion 只做片头/转场/字幕/多尺寸。
- 明确排除会摧毁可信度的能力：数字人对口型 `talking_head`/`lip_sync`、AI 绘界面 `flux_image`、卡通角色动画（见 [ep02 CONTENTLIB](./content-library/ep02-video-render/CONTENTLIB.md)）。

---

## 内容生产状态机（13 阶段 + 校验门）

每期都走同一条标准化流水线，工作流真相源在 `shared/workflows/<slug>.md`（IDE 无关，由 `scripts/sync_workflows.py` 物化到 `.devin/workflows/`、`.windsurf/workflows/`、`.cursor/commands/` 供各 IDE 以 `/<slug>` 调用），产物落 `content-library/epNN-slug/` 的对应阶段目录：

```
01 选题 → 02 策划 → 03 B站视听 → 04 脚本(SSOT) → 05 录屏采集⏸ → 06 TTS
   → 07 组装 → 08 字幕 → 09 BGM⏸ → 10 封面⏸ → 11 质检⏸ → 12 分发⏸ → 13 归档⏸
```

- **看板唯一真相**：[content-library/PIPELINE.md](./content-library/PIPELINE.md) 记录「所有期 × 13 阶段」状态（`- / draft / reviewed / approved / suspended / superseded`）。每推进一阶段必须更新；重启时定位到第一个 `-`/`draft` 续跑。
- **L0.5 单核校验门**：阶段置 `approved` 的前置 = **Schema 校验通过 + 人工确认**。
  - 机器校验 `scripts/pipeline_lint.py`：校验产物尾部 ` ```json ` 结构块是否符合 `shared/schemas/*.json`（01/02/03/04），并做跨阶段防漂移门禁（04 脚本为 SSOT、上游状态一致性、场景数一致、下游标题不触犯噱头黑名单）。
  - 第二核「判断层评审（CHAI 质量门）」当前**已挂起**，角色文件保留，恢复时去掉提示即可。
- **两库分离**：`ideas/`（脑暴，格式随意）vs `content-library/`（成品，按阶段落盘 + YAML frontmatter 标 `stage`/`status`）。

---

## 角色体系（shared/roles/）

> **角色 = 思考视角（system prompt）；工作流 = 步骤模板（user prompt）；frontmatter + 看板 = 状态机。** 三者组合即「可被 Agent 接管 / 易 API 化」的工作流。详见 [shared/roles/README](./shared/roles/README%20(%E8%A7%92%E8%89%B2%E4%BD%93%E7%B3%BB%E8%AF%B4%E6%98%8E).md)。

| 线 | 角色 | 状态 |
|----|------|------|
| 视频生产线（11） | 选题分析师 / 内容策划师 / 分镜口播导演（合并原视听策划师+文案撰稿人） / 屏幕录制导演 / 语音合成工程师 / 视频工程师 / 字幕编辑 / 音频混音师 / 封面设计师 / 质检工程师 / 分发助手 | ✅ 可用 |
| 实战内容线（4） | 产品经理 / 架构师 / 执行工程师 / 代码审查员 | 🚧 占位 |
| 通用判断层（1） | 判断层评审（CHAI 硬核质量门） | ⏸️ 已挂起 |

多 IDE 适配（single source of truth = `shared/`）：**角色**在 `shared/roles/`、**工作流**在 `shared/workflows/`、**常驻规则**在 `shared/rules/`（均 IDE 无关）；各 IDE 的可调用副本由 sync 脚本生成——工作流 `scripts/sync_workflows.py` → `.devin/workflows/ .windsurf/workflows/ .cursor/commands/`，规则 `scripts/sync_rules.py` → `.cursor/rules/*.mdc`、`.windsurf/rules/`（勿手改）。Devin 经 `AGENT_GUIDE.md` 加载规则，无 `.devin/rules/`。`OpenMontage/` 子工程另带 `.cursor/ .claude/ .agents/` 技能。

---

## 仓库结构

```text
LFVideo/
├── AGENT_GUIDE.md                 # AI 协作铁律（反污染 / 全量重写 / 反噱头）
├── ARCHITECTURE.md                # 单运行时架构设计
├── Project Context (项目上下文).md  # 本文件
├── Content Plan (内容计划).md       # 内容路线与策略
├── .devin/
│   ├── rules/                     # 常驻规则（项目上下文 / 角色体系）
│   └── workflows/                 # 13 阶段工作流（01 选题 … 13 归档）
├── shared/
│   ├── roles/                     # 角色库（content/ execution/ meta/）+ README
│   ├── schemas/                   # 阶段 JSON Schema（01/02/03/04）
│   └── docs/remotion-spec.md      # Remotion 目标态规范（1080p）
├── ideas/                         # 脑暴库（backlog / epNN 素材）
├── content-library/               # 成品库
│   ├── PIPELINE.md                # 看板：所有期 × 13 阶段（唯一进度真相）
│   ├── _decisions/                # 跨期决策 + dev-log
│   └── ep02-video-render/         # 本期（01-topic … 12-distribute + CONTENTLIB）
├── scripts/
│   ├── pipeline_lint.py           # L0.5 机器校验（Schema + 防漂移门禁）
│   └── devin-sync.ps1
└── OpenMontage/                   # 单运行时核心（vendored，AGPLv3）
    ├── tools/                     # Python 工具箱（100+ 模块）
    ├── lib/                       # 调度 / 校验 / 评分 / 断点续跑
    ├── pipeline_defs/             # 13 条 YAML 管道
    ├── schemas/ · skills/         # 工件契约 + Agent 技能库
    └── remotion-composer/         # React 19 / Remotion 渲染编译器
        ├── src/Explainer.tsx      # 主合成 + cut/overlay 调度
        ├── src/components/        # 场景组件（含 VRMAvatar）+ charts
        ├── src/custom-templates/  # theme / primitives / scenes / episodes
        └── public/                # avatars/*.vrm, demo-props
```

---

## 内容路线图（详见 [content-library/PIPELINE.md](./content-library/PIPELINE.md)）

系列：**《Vibe Coding 造一条自动化视频生产线》**（每期 3–10 分钟，边做边播）

| 期 | 标题 | 主题 |
|----|------|------|
| ep01-video-agent-overview | 总览 | 系列总览/总结（含技术选型复盘）；最后制作、置顶第 1 期 |
| ep02-video-render | 视频渲染 | 场景组件系统 + VRM 主持人（**本期**） |
| ep03-video-subtitle | 字幕匹配 | Whisper 字级时间戳驱动弹跳字幕 |
| ep04-video-audio | 音频混音 | 智能混音、气口与响度标准化 |
| ep05-video-pipeline | 工作流构建 | 13 阶段状态机 + Schema 校验门 |
| ep06-video-orchestrator | 角色编排 | 角色即 Prompt → 多智能体编排（YAML 管道） |

> 制作顺序：EP02 → EP06 五期"功能期"先做、迭代质量，EP01 总览/总结最后制作。

---

## 自动化成熟度

- **L0.5 单核校验（当前）**：Schema 契约校验 + 人工确认；看板手动更新；判断层评审挂起。
- **L1 半自动（规划）**：选题/策划自动提炼实操并自动跑 Schema 校验。
- **L2 全自动（规划）**：全链路多角色 Agent 自动校验、评审、流转。

---

## 重要原则（AI 助手请记住）

1. **用户说得不对或方向跑偏，立即提醒，不要顺着走。**
2. **看板（PIPELINE.md）是进度唯一真相**；`04 脚本`是跨阶段 SSOT，下游不得与之漂移。
3. 每期必须含**操作层 + 判断层**；判断层如实呈现边界与坑，不回避短板，也不夸大成「巨坑」。
4. **反噱头 / 反 FUD**：强调工程结构与可复现性，不虚构任何 AIGC 特效；Remotion 无法生成、需真实操作的画面用 `[录屏占位]` 显式标出。
5. **Dogfooding**：本仓库的生产线本身就是头号内容素材（角色 × 工作流 × 状态机 = 可 API 化的证据）。
6. 渲染统一 **1080p @ 30fps**；媒体组件必须做空校验与降级占位。
7. 文档变更面积 >30% 时**全量重写**，避免增量拼接造成脏数据污染（见 AGENT_GUIDE）。
8. GitHub 是内容的**配套资源仓库**，不是主产品；内容优先。

---
