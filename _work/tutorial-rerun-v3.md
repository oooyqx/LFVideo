# 代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程

## 【AI 视频自动化生产线】第 2 期：渲染引擎篇 · 企业级落地指南

> 📌 **本稿性质**：按更新后的 `strategist(内容策划师)` 角色 + `02-content-planning` 工作流（含新增「每节有料 / 过渡与对照 / 密度自查」三条质量细则）**完整重跑一遍**的产物（v3）。对齐三处真相源：`CONTENTLIB.md`（TAD-01 混合架构）、`shared/docs/remotion-spec.md`（组件清单与 §1.9 映射）、`_decisions/why-remotion-over-hyperframes.md`（数据驱动模板决策）。所有技术结论显式标注证据状态（`verified` / `paper_spec`）与验收标准，未经本机渲染验证的一律 `paper_spec`。

---

## 一、核心概念：范式与痛点

传统剪辑（Premiere / FCPX / 剪映）的心智模型是**轨道 + 绝对时间轴**：在时间线上拖素材、对齐音频、手打字幕。对高频更新的技术教程、工具演示类视频来说，这是一场低 ROI 的体力活——每改一处都得回到时间轴上重新手工摆放。

**Video-as-Code（代码即视频）换了一套心智模型**：一条视频不再是"摆出来的画面堆叠"，而是一段**声明式的代码 / 数据**，由渲染器**编译**成帧序列再合成视频。它带来三个传统剪辑给不了的工程特性：

1. **可版本控制**：视频就是文本（代码 / JSON / YAML），能 diff、能 review、能 git 回滚。
2. **可参数化批量复用**：同一套模板换一份数据，就能批量产出几十期结构一致的视频——这正是本项目「固定模板 + 内容替换」的根。
3. **AI 友好**：让 AI 拖时间轴很难，让 AI 写代码 / 改数据 / 调 CSS 是它最擅长的事——视频生产因此第一次能被 AI 端到端接管。

> 一句话本质：**帧即状态（Frame as State）**——Video-as-Code 把"时间轴"变成了"代码/数据的函数"，给定一个时间点，渲染器算出该时刻画面长什么样。（这里只点心智模型；具体"帧 → 状态"的插值写法属实现细节，下沉到 §五 实操再展开，概念层不堆公式。）

### Video-as-Code 不等于 React —— 它是一类范式，有多条技术路线

把"代码即视频"和"Remotion"划等号是常见误解。本质相同（用代码描述、编译成帧），但落地路线差异很大：

| 路线 | 代表项目 | 描述方式 | 典型场景 |
| :--- | :--- | :--- | :--- |
| **DOM / React 渲染** | Remotion | React 组件 + CSS/SVG，无头 Chrome 截图 | 前端栈、复杂排版、模板复用 |
| **TS 声明式动画** | Motion Canvas / Revideo | 生成器函数描述动画时序 | 代码演示、技术讲解动画 |
| **程序化数学动画** | Manim | Python 描述几何/公式动画 | 数学/算法可视化 |
| **像素 / 合成脚本** | MoviePy | NumPy 像素矩阵 + FFmpeg | 纯 Python、简单拼接 |
| **Canvas / 游戏引擎** | PixiJS / Cocos2d-HTML5 | Canvas 上下文逐帧绘制 | 复杂粒子、游戏化动画 |
| **命令式合成** | FFmpeg + 脚本 | filtergraph / 命令拼接 | 批量转码、轻量字幕烧录 |

> 承上启下：六条路线共享同一个内核——**用代码/数据描述 → 编译成帧 → 合成视频**，区别只在"描述层用什么语言、渲染层用什么引擎"。理解了范式，选型才有判断的支点。下一节就把这六条路线摆到判断层矩阵里，看各自的边界在哪。

---

## 二、开源落地方案对比（判断层矩阵）

> 护城河原则（见 `dev-log.md` 对「判断层」的重定义）：**判断层 = 边界与验收 / 避坑指南**，不是中立百科式综述。每个方案必须回答「什么前提下成立 / 哪步会翻车 / 怎么算跑通」，并标注证据状态。

| 方案 | 语言/栈 | 核心机制 | 适用场景 | 不适用场景 | 已知坑 | 验收标准 | 证据状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Remotion** | React/TS | Node 端打包并求值 Composition，无头 Chrome 逐帧截图，FFmpeg 合成 | 前端栈、复杂 CSS/SVG、类型安全的跨期模板复用 | 零前端基础、纯后台超长批处理 | 模块顶层读 `window/document` 会在 Node 求值阶段崩溃；BUSL 商业授权 | 终端 `render` 正常出 MP4，无 `ReferenceError` | `verified`（本项目在用） |
| **Motion Canvas / Revideo** | TS | 生成器函数声明动画时序，Canvas 渲染 | 代码演示、需精确时序编排 | 复杂网页级 Flex/Grid 排版生态不如 React | 组件/排版生态较小，复用模板需自建 | 描述脚本能渲染出预期动画并参数化导出 | `paper_spec` |
| **Manim** | Python | 程序化描述几何/公式，逐帧渲染 | 数学/算法/公式可视化 | 一般 UI、网页排版、录屏混排 | 学习曲线陡，排版能力弱，渲染慢 | 公式/几何动画正确导出 | `paper_spec` |
| **MoviePy** | Python | NumPy 像素矩阵 + Imageio/FFmpeg | 纯 Python、简单拼接/裁剪、音轨闪避 | 自适应弹性排版、复杂文字动效 | 文本布局繁琐、多层画布内存大、无热更新 | 脚本跑完输出拼接视频 | `verified`（B 轨拼接在用） |
| **PixiJS / Cocos2d-HTML5** | JS | Canvas 上下文逐帧绘制 | 游戏类复杂粒子动画 | 标准网页 UI、文本对齐 | 文本换行与 DOM 对齐计算复杂 | Canvas 正确导出帧序列 | `paper_spec` |
| **FFmpeg + 脚本** | Shell/任意 | filtergraph / 命令拼接 | 批量转码、轻量字幕烧录、合成兜底 | 复杂动效、交互式排版 | filtergraph 语法晦涩、调试困难 | 命令产出目标格式视频 | `verified`（后台合成在用） |

**怎么对号入座**：做"一期一个模板、字幕/代码卡片高复用"的硬核技术视频，看第 1 行（Remotion）；把录好的屏幕片段拼起来加 BGM 闪避，看第 4 行（MoviePy）；纯算法/数学缓动炫技，看第 2 行（Motion Canvas）。本项目主线落在 **Remotion（A 轨成片）+ MoviePy/FFmpeg（B 轨拼接闪避）** 的组合上。

**对比结论**：以"前端栈复杂排版 + 类型安全跨期复用 + AI 友好"为筛选条件，**Remotion** 是当前最优解；Motion Canvas/Revideo 是最接近的备选（更偏时序动画），其余按场景兜底。选型理由展开见 §三。

---

## 三、技术路线选型理由（为什么选 React / Remotion）

承上一节矩阵，这一节把"为什么是这套组合"讲透。选型不是"哪个最火选哪个"，而是回到本频道的核心约束：**固定模板 + 内容批量替换，让 AI 端到端接管，且跨期可维护**（见 `_decisions/why-remotion-over-hyperframes.md`，2026-06-01 已确认推进 Remotion A 轨）。在这个约束下，Remotion 胜出有四个硬理由：

1. **数据驱动模板，类型安全跨期复用（决定性）**：Remotion 的 `data.ts → Episode.tsx → template/` 四层结构（theme/primitives/scenes/episodes）天生适合"模板与数据分离"。TypeScript 保证每期换数据时格式不出错，改一处主题样式全期生效。
2. **AI Agent 友好**：每期不让 AI 自由发挥结构，只让它"填数据 + 微调 CSS"——这是 AI 最稳的活，幻觉空间最小。
3. **CLI 原生、易自动化**：`npx remotion render` 是纯命令行，可 `subprocess`、可上云，为后续"IDE 交互 → 后台 API 自动化"留好了口子。
4. **网页生态红利**：完整 CSS/SVG/Flexbox/动效库随手可用，信息密度和排版自由度远高于像素/Canvas 方案。

一个对照就能看清它和"复制粘贴 HTML"路线的差别：

| 维度 | ✅ Remotion（数据驱动模板） | ❌ HyperFrames（HTML 复制粘贴） | 结论 |
| :--- | :--- | :--- | :--- |
| 模板复用/类型安全 | TS 约束、跨期安全 | HTML 无类型检查 | ✅ Remotion |
| AI 友好度 | 需懂 React，但只填数据 | 直接写 HTML，结构易漂移 | ⚠️ 各有利弊 |
| 长期维护 | 改一处全期生效 | 10 期后维护困难 | ✅ Remotion |
| 授权 | BUSL（规模化付费） | Apache 2.0 | ⚠️ HyperFrames 更宽松 |

**选这条路要付的税（已知边界与坑）**：
- **需要懂 React**：纯零前端团队上手有成本。
- **BUSL 商业授权**：规模化商用需付费。
- **环境坑**：在模块顶层读 `window/document` 会在 Node 打包/求值阶段崩溃（`window is not defined`）。这是 SSR 类环境的**常规约束，不是 Remotion 的缺陷**，一条规则即可规避——它是"要付的税"，不是噱头卖点，落地写法见 §五。

> 证据状态：决策结论 `verified`（`_decisions/why-remotion-over-hyperframes.md`）。

---

## 四、流程即代码：角色定义与工作流（Dogfooding）

既然视频的画面可以用代码控制，那么**制作这条视频的"内容工作流"本身，能不能也做成代码（Process-as-Code）？** 本项目的答案是肯定的——这才是频道真正的护城河（以行证言）。

### 1. 三件套：角色 = 视角，工作流 = 步骤，文件 = 状态机

| 资产 | 在仓库中的位置 | 在"流程即代码"里的角色 | 类比 |
| :--- | :--- | :--- | :--- |
| **角色（Roles）** | `shared/roles/` | 思考视角与边界（身份/能力/输出格式/不做什么） | LLM 的 `system_prompt` |
| **工作流（Workflows）** | `.windsurf/workflows/01→07` | 每个阶段的标准步骤与交互协议 | LLM 的 `user_prompt` 模板 |
| **状态（State）** | 产物 frontmatter `stage`/`status` + `PIPELINE.md` | 文件即数据的状态机，唯一进度真相源 | 编排器（Orchestrator） |

### 2. 七阶段流水线（角色 × 工作流映射）

| 阶段 | 工作流 | 主责角色 | 产物 |
| :--- | :--- | :--- | :--- |
| 01 选题分析 | `/01-topic-research` | 选题分析师 | 选题判断、标题候选、受众分析 |
| 02 内容策划 | `/02-content-planning` | 内容策划师 | 教学软文（本文）+ 分镜大纲 + 校验 JSON |
| 03 B站视听策划 | `/03-video-planning-bilibili` | 视觉策划师 | 组件映射、Props、动画 Cue、Zoom 指令 |
| 04 脚本撰写 | `/04-script-draft` | 文案撰稿人 | 分轨台词脚本 + 多平台改写 |
| 05 视频组装 | `/05-video-assembly` | 视频工程师 | Remotion 可渲染成片 |
| 06 分发适配 | `/06-distribute-adapt` | 分发助手 | 各平台标题/描述/标签/切片 |
| 07 资源归档 | `/07-github-archive` | （执行/归档） | 清理临时文件、开源 README、同步仓库 |

每个阶段都遵守同一套纪律：**读取角色文件 → 按其输出格式工作 → 不越界 → 关键节点停下等人确认 → 落盘并改 frontmatter 状态**。

### 3. 为什么这套"流程即代码"能被 AI 接管 / API 化

把"角色 = system_prompt、工作流 = user_prompt、frontmatter = 状态机"摆出来，一个最小编排器就能驱动整条线（伪代码）：

```python
import frontmatter, glob

# 状态机：扫描所有产物的 frontmatter，找到待推进的阶段
for path in glob.glob("content-library/**/README.md", recursive=True):
    post = frontmatter.load(path)
    if post.get("status") == "approved":        # 状态机读到"已确认"
        stage = post["stage"]                    # 如 02-content-planning
        role = load_role(stage)                  # 角色 = system_prompt
        steps = load_workflow(stage)             # 工作流 = user_prompt 模板
        run_agent(system=role, user=steps)       # 喂给 LLM，自动推进下一阶段
```

- **真正的难点是多模态物理限制**：A 轨（概念动画）可全自动，B 轨（真实 IDE 录屏，TAD-01 强制真人录制、禁止 AIGC 伪界面）必须人上传——所以流程里要设计"挂起等待"机制。
- 证据状态：本套角色/工作流文件**真实存在于本仓库**（`verified`）；"一个 Python 编排器即可端到端跑通"为 `paper_spec`，需后续做最小调度脚本验证。

### 4. 落到本期的提示词链（Prompt Chain）

正因为流程是代码，本期录屏要真实跑通的也是一段**可复现的提示词链**，而非临场即兴：

```text
Prompt-1（数据驱动，复用现成组件）：
基于 remotion-composer 现有的 @ComparisonCard 组件，生成"对比卡片"的数据配置，
左卡=方案A、右卡=方案B。只产出数据，不要新建组件。

Prompt-2（用规则把环境坑一次性封死）：
为 Cursor 在 .cursor/rules/ 下编写一份 mdc 规则，约束我编写 Remotion 组件时
自动加上 window/document/navigator 的安全守卫（写法见 §五）。
```

---

## 五、核心实操与避坑

> 取向：去掉"多少行代码"的执念，强调**工程结构**——优先用现成组件传数据，其次才是手写；公式/守卫/命令都落在这一节。

### 1. 帧即状态：最小可运行的插值组件

承第一节的"帧即状态"心智模型——在 Remotion 中，一切动效的本质都是**帧数（Current Frame）到属性状态值的数学映射** `y = f(Frame, Props)`。下面是这条公式可照抄的最小写法：

```typescript
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const FadeIn: React.FC = () => {
  const frame = useCurrentFrame();             // 当前第几帧（0,1,2...）
  const { fps } = useVideoConfig();            // 帧率（如 30）
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  return <div style={{ opacity }}>代码即视频！</div>;
};
```

吃透这条公式，后面所有动效（`spring` 弹簧、位移、缩放）都只是它的变体。但实操里更推荐的不是"自己写组件"，而是下面这种"只传数据"的做法。

### 2. 首选：数据驱动现成组件（符合"固定模板 + 内容替换"）

A 轨组件已封装在 `OpenMontage/remotion-composer/src/` 下两处——通用组件在 `components/`，模板场景/原语在 `custom-templates/`（`verified` 存在，名称以 `remotion-spec.md` §1.9 映射为准）：

| 组件 | 实际位置 | 用途 | 本期用法 |
| :--- | :--- | :--- | :--- |
| `@ComparisonCard` | `components/` | 横向对比卡片 | 方案/路线对比 |
| `@TerminalScene` | `components/` | 终端模拟器 | 展示 `render` 命令与输出 |
| `@ScreenshotScene` | `components/` | 截图自适应变焦 | 嵌入 IDE 截图并 Zoom |
| `charts/` | `components/` | 图表卡片 | 标题里的「图表动效」归宿 |
| `@CaptionOverlay` | `components/` | 字幕高亮叠层 | 为下期「卡点」预留接口 |
| `@ConceptScene` / `@SplitLayout` | `custom-templates/` | 概念卡片 / 左右分屏 | 范式与选型的对比展示 |

理想用法是只改数据、不碰组件——这才是"数据驱动模板"：

```ts
// ✅ 只产出数据，复用类型化组件
const comparison = {
  left:  { title: '方案 A', points: ['...'], status: 'error' },
  right: { title: '方案 B', points: ['...'], status: 'success' },
};
// <ComparisonCard {...comparison} />

// ❌ 反面：为这期从零手写一个全新的 ComparisonScene.tsx，
//    既违反"固定模板 + 内容替换"，又忽略了仓库里现成的 @ComparisonCard。
```

### 3. 避坑：把环境坑一次性封死（§三提到的"税"）

确需手写组件时，唯一要守的纪律是别在模块顶层碰浏览器全局对象：

```tsx
// ❌ Node 打包/求值阶段直接 ReferenceError: window is not defined
const w = window.innerWidth;

// ✅ 类型安全守卫
const getWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1920);

// ✅ 依赖 DOM 的库用挂载门控
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

把这条写进 `.cursor/rules/remotion-ssr.mdc`（`globs` 指向 `OpenMontage/remotion-composer/src/**`），Cursor 之后生成组件就会自动带守卫，一次性把这笔"税"交清。

> 技术精度：Remotion 在 **Node 端打包并求值 Composition 列表**（取时长/尺寸、做任务拆分），逐帧绘制发生在**无头 Chrome**里。崩溃点是"模块/组件求值阶段在 Node 读了浏览器全局对象"，不是"逐帧 SSR"——这决定了你该往哪查 bug。

### 4. 验收标准与渲染命令

| # | 假设 / 命令 | 验收标准 | 证据状态 |
| :--- | :--- | :--- | :--- |
| 1 | `typeof window === 'undefined'` 守卫能否 100% 规避 Node 端报错 | 外层写 `window` 读取并套守卫，`render` 控制台零报错且正常出片 | `paper_spec`（录制前实测） |
| 2 | `@ComparisonCard` 传数据能否替代手写组件 | 仅改 data 即渲染出左右对比卡片 | `paper_spec`（录制前实测） |
| 3 | `charts/` 组件能否承接「图表动效」 | 喂一组数据渲染出带入场动画的图表 | `paper_spec`（录制前实测） |

渲染命令（路径以 `remotion-composer` 为准，`<CompositionId>` 录制前对齐）：

```bash
cd OpenMontage/remotion-composer
npx remotion studio                                   # 可视化调试
npx remotion render src/index.ts <CompositionId> out/demo.mp4
```

> ⚠️ A 轨组件现集中在 `OpenMontage/remotion-composer/src/`：通用组件在 `components/`（`ComparisonCard/TerminalScene/charts/...`），模板场景/原语在 `custom-templates/`（原"目标态" `@IntroScene/@ConceptScene/@SplitLayout/@VideoSlot` 等已并入，`verified` 存在）。原计划的独立 `video/` 工程已合并进 composer。组件存在已 `verified`；但 `<CompositionId>` 与 render 命令仍须录制前核对注册，故命令仍标 `paper_spec`。

---

## 六、总结

- **Video-as-Code 是范式，不是某个库**：用代码/数据描述、编译成帧——多条路线（Remotion / Motion Canvas / Manim / MoviePy …）共享同一内核。
- **选型回到约束**：本频道要"固定模板 + 内容替换 + AI 接管 + 跨期可维护"，所以选 React/Remotion，并坦诚它的税（需懂 React、BUSL、环境守卫）。
- **流程即代码**：角色 = system prompt、工作流 = user prompt、frontmatter = 状态机——这套自家流水线本身就是最好的 Dogfooding 证据。
- **工程优先于行数**：优先用现成组件传数据，而非从零手写；环境坑用一条规则封死即可。
- **据实标注**：每条结论带证据状态与验收标准，未实测一律 `paper_spec`。

下一期我们将攻克**「字幕与卡点」**：向 Whisper 接口获取毫秒级时间戳 JSON，自动驱动 `@CaptionOverlay` 与卡点动效组件。
