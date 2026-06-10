# 把一条视频写成可编译、可复用、可被 AI 接管的工程：Video-as-Code 渲染引擎实战

## 【AI 视频自动化生产线】第 2 期：渲染引擎篇 · 企业级落地指南
> 🔁 本稿为「按 main 上已优化的 `strategist` 角色 + `02-content-planning` 工作流」重新生成的草稿（rerun），用于与人工打磨的 `tutorial copy.md` 对比，检验反向优化是否真的把"好结构"固化进了提示词。
> 真相源对齐：`CONTENTLIB.md`（TAD-01 混合架构）、`shared/docs/remotion-spec.md`（§1.9 组件对照）、`_decisions/why-remotion-over-hyperframes.md`（数据驱动模板）。所有技术结论标注 `verified` / `paper_spec` 与验收标准。

---

## 阶段 1 产物·《标题解析报告》（节选）

- **范式归类**：选题属于 **Video-as-Code（代码即视频）** 范式，而非"某个库的用法"。该范式下至少有 6 条技术路线（见阶段 3 矩阵）。
- **反噱头校验**：上游候选标题《如何用 **100 行** React 代码编译卡点与图表动效？》把卖点压在"代码行数"上 —— 触发反噱头规则。建议改为以"**工程结构 / 可复用 / 可被 AI 接管**"为核心的表述（已采用本稿标题）。
- **受众**：有前端或 Python 基础、在用 AI IDE（Cursor/Windsurf）的内容开发者。
- **核心技术名词**：Video-as-Code、Remotion、无头 Chrome 渲染、固定模板+内容替换、角色/工作流流水线。

---

## 一、核心概念：Video-as-Code 是一类范式（不是一个库）

传统剪辑（PR / 剪映）的心智模型是**轨道 + 绝对时间轴**：手工在时间线上摆素材。**Video-as-Code 换了模型**：一条视频是一段**声明式代码 / 数据**，由渲染器**编译**成帧序列再合成。

它带来三个传统剪辑给不了的工程特性：
1. **可版本控制**：视频即文本，可 diff / review / git 回滚。
2. **可参数化批量复用**：同一套模板换一份数据即可批量产出 —— 这正是本项目「固定模板 + 内容替换」的根。
3. **AI 友好**：让 AI 拖时间轴难，让 AI 写代码 / 改数据 / 调 CSS 是它最擅长的 —— 视频生产因此第一次能被 AI 端到端接管。

> 一句话本质：**Video-as-Code 把"时间轴"变成"代码/数据的函数"**——给定时间点，渲染器算出该时刻的画面。
> （"帧 → 状态"的具体映射写法属实现细节，下沉到 §五，不在概念层堆公式。）

**别把范式等同于 React/Remotion**：内核都是「用代码/数据描述 → 编译成帧 → 合成」，区别只在描述语言与渲染引擎。理解范式，选型才有支点（见 §二）。

---

## 二、开源落地方案对比（判断层矩阵）

> 护城河原则（见 `dev-log.md` 对「判断层」的重定义）：判断层 = **边界与验收**，每个方案必须回答「什么前提成立 / 哪步翻车 / 怎么算跑通」，并标证据状态。广度要求 ≥4–6 条路线。

| 方案 | 语言/栈 | 核心机制 | 适用 | 不适用 | 已知坑 | 验收标准 | 证据状态 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Remotion** | React/TS | Node 端打包/求值 Composition，无头 Chrome 逐帧截图，FFmpeg 合成 | 前端栈、复杂 CSS/SVG、类型安全跨期复用 | 零前端、纯后台批处理 | 顶层读 `window/document` 在 Node 求值崩溃；BUSL 授权 | `render` 正常出 MP4、无 `ReferenceError` | `verified`（本项目在用） |
| **Motion Canvas / Revideo** | TS | 生成器函数声明动画时序，Canvas 渲染 | 代码演示、精确时序 | 网页级 Flex/Grid 排版生态较弱 | 组件生态小，模板需自建 | 脚本渲染出预期动画并参数化导出 | `paper_spec` |
| **Manim** | Python | 程序化几何/公式动画 | 数学/算法可视化 | 一般 UI、录屏混排 | 学习曲线陡、排版弱、渲染慢 | 公式/几何动画正确导出 | `paper_spec` |
| **MoviePy** | Python | NumPy 像素矩阵 + FFmpeg | 纯 Python、简单拼接 | 弹性排版、复杂文字动效 | 文本布局繁琐、内存大、无热更新 | 脚本输出拼接视频 | `paper_spec` |
| **PixiJS / Cocos2d** | JS | Canvas 逐帧绘制 | 游戏类复杂粒子 | 标准网页 UI、文本对齐 | 文本换行/DOM 对齐复杂 | Canvas 正确导出帧序列 | `paper_spec` |
| **FFmpeg + 脚本** | Shell | filtergraph / 命令拼接 | 批量转码、字幕烧录、兜底 | 复杂动效、交互排版 | filtergraph 语法晦涩 | 命令产出目标格式视频 | `paper_spec` |

**对比结论**：以"前端栈复杂排版 + 类型安全跨期复用 + AI 友好"为筛选条件，**Remotion** 最优；Motion Canvas/Revideo 最接近备选；其余按场景兜底。理由展开见 §三。

---

## 三、技术路线选型理由：我们为什么选 React / Remotion

> 选型不是"哪个火选哪个"，而是回到本频道约束：**固定模板 + 内容批量替换 + AI 端到端接管 + 跨期可维护**（见 `_decisions/why-remotion-over-hyperframes.md`）。

1. **数据驱动模板 + 类型安全跨期复用（决定性）**：`data.ts → Episode.tsx → template/` 四层天生适合"模板与数据分离"；TS 保证每期换数据不出格式错。HyperFrames 的 HTML 模板无类型检查，10 期后难维护。
2. **AI Agent 友好**：每期只让 AI"填数据 + 微调 CSS"，幻觉空间最小。
3. **模板/数据分离已验证**：本项目已跑通该链路（`verified`）。
4. **CLI 原生、易自动化**：`npx remotion render` 可 `subprocess`、可上云，为"IDE 交互 → 后台 API"留口子。
5. **网页生态红利**：CSS/SVG/Flexbox/动效库随手可用，信息密度高。

**选这条路要付的税（已知边界）**：需懂 React；BUSL 规模化商用付费；**环境坑**——顶层读 `window/document` 会在 Node 求值阶段崩溃。这是 SSR 类环境的常规约束，**不是 Remotion 缺陷**，一条规则即可规避（写法见 §五），不当主卖点。

| 维度 | Remotion | HyperFrames | 结论 |
| :--- | :--- | :--- | :--- |
| 模板复用/类型安全 | TS 跨期安全 | HTML 复制粘贴 | ✅ Remotion |
| AI 友好度 | 需懂 React | 直接写 HTML | ⚠️ 各有利弊 |
| 长期维护 | 改一处全期生效 | 10 期后困难 | ✅ Remotion |
| 授权 | BUSL | Apache 2.0 | ⚠️ HyperFrames 更宽松 |

> 证据状态：决策结论 `verified`（`why-remotion-over-hyperframes.md`，2026-06-01 确认推进 Remotion A 轨）。

---

## 四、流程即代码：本项目的角色定义与工作流（Dogfooding）

> 比"用一条规则修一个 bug"更值得讲的是：**我们把整条内容生产线本身也做成了 Video-as-Code** —— 流程被写成可版本控制、可被 AI 接管的代码与状态机。

### 1. 三件套
| 资产 | 仓库位置 | 在"流程即代码"里的角色 | 类比 |
| :--- | :--- | :--- | :--- |
| 角色（Roles） | `shared/roles/` | 思考视角与边界 | LLM `system_prompt` |
| 工作流（Workflows） | `.windsurf/workflows/01→07` | 每阶段标准步骤与交互协议 | LLM `user_prompt` 模板 |
| 状态（State） | 产物 frontmatter `stage`/`status` + `PIPELINE.md` | 文件即状态机，唯一进度真相源 | 编排器 |

### 2. 七阶段流水线
01 选题→02 策划→03 B站视听→04 脚本→05 组装→06 分发→07 归档；每阶段同一纪律：**读角色 → 按输出格式干活 → 不越界 → 关键节点停下确认 → 落盘改 frontmatter 状态**。

### 3. 为什么能被 AI 接管 / API 化
- 角色=system_prompt、工作流=user_prompt 模板，天然解耦可喂 LLM。
- frontmatter 状态机：一个读 `status: approved` 触发下一阶段的小脚本即可当编排器。
- 真正难点是多模态物理限制：A 轨可全自动，B 轨真实录屏须人上传 → 流程设计"挂起等待"。

> 证据状态：角色/工作流文件**真实存在于本仓库**（`verified`）；"一个 Python 编排器即可端到端跑通"为 `paper_spec`，需最小调度脚本验证。

### 4. 本期可复现的提示词链
```text
Prompt-1（数据驱动，复用现成组件）：
基于 remotion-composer 现有 @ComparisonCard 组件，生成"对比卡片"的数据配置（左=方案A、右=方案B）。只产出数据，不要新建组件。

Prompt-2（用规则把环境坑封死）：
为 Cursor 在 .cursor/rules/ 下编写一份 mdc 规则，约束编写 Remotion 组件时自动加 window/document 安全守卫（写法见 §五）。
```

---

## 五、核心实操与避坑

### 1. 首选：数据驱动现成组件（"固定模板 + 内容替换"）
A 轨组件在 `OpenMontage/remotion-composer/src/components/`（`verified` 存在）。按 `remotion-spec.md` §1.9 映射：

| 实际组件 | 用途 | 本期用法 |
| :--- | :--- | :--- |
| `ComparisonCard` | 横向对比卡片 | 方案/路线对比 |
| `TerminalScene` | 终端模拟器 | 展示 `render` 命令与输出 |
| `ScreenshotScene` | 截图自适应变焦 | 嵌入 IDE 截图并 Zoom |
| `charts/` `StatReveal` | 图表 | 标题里「图表动效」的归宿 |
| `CaptionOverlay` | 字幕高亮叠层 | 为下期「卡点」预留 |

```ts
// 只产出数据，复用类型化组件 —— 这才是"数据驱动模板"
const comparison = {
  left:  { title: '方案 A', points: ['...'], status: 'error' },
  right: { title: '方案 B', points: ['...'], status: 'success' },
};
// <ComparisonCard {...comparison} />
```

### 2. 避坑：把环境坑一次性封死（§三那笔"税"）
```tsx
// ❌ Node 打包/求值阶段 ReferenceError: window is not defined
const w = window.innerWidth;
// ✅ 守卫
const getWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1920);
// ✅ DOM 依赖库用挂载门控
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```
写进 `.cursor/rules/remotion-ssr.mdc`（`globs` 指向 `OpenMontage/remotion-composer/src/**`）。

> 技术精度：Remotion 在 **Node 端打包/求值 Composition**（取时长尺寸、拆任务），逐帧绘制在**无头 Chrome**。崩溃点是"求值阶段在 Node 读浏览器全局对象"，不是"逐帧 SSR"。

### 3. 验收标准与待验证假设
| # | 假设/命令 | 验收标准 | 证据状态 |
| :--- | :--- | :--- | :--- |
| 1 | `typeof window` 守卫能否 100% 规避 Node 端报错 | 套守卫后 `render` 零报错出片 | `paper_spec`（录制前实测） |
| 2 | `ComparisonCard` 传数据替代手写组件 | 仅改 data 即渲染左右对比卡 | `paper_spec` |
| 3 | `charts/` 承接「图表动效」 | 喂数据渲染带入场动画图表 | `paper_spec` |

```bash
cd OpenMontage/remotion-composer
npx remotion studio
npx remotion render src/index.ts <CompositionId> out/demo.mp4   # <CompositionId> 录制前对齐
```
> ⚠️ 仓库无独立 `video/` 工程，A 轨组件在 `remotion-composer`；`remotion-spec.md` 的 `video/src/template/` 组件名属**目标态**，命令标 `paper_spec`。

---

## 六、下游交付提示（给 03/04）
按 `remotion-spec.md` 防静止红线（单镜头静止 ≤15 秒）预埋节拍：概念段用卡片 stagger 展开多路线；选型段用 `ComparisonCard`；流程段用 `charts/`/拓扑图 + `[B轨占位：pipeline_demo.mp4]`；实操段 `TerminalScene` + `[B轨占位：ide_record.mp4]`（禁 AIGC 伪界面）。README 5 段式分镜须据本主线重新提取。

## 七、总结
- Video-as-Code 是**范式**不是某库；多路线共享同一内核。
- 选型回到约束 → React/Remotion，并坦诚其税（懂 React/BUSL/环境守卫）。
- 流程即代码：角色=system prompt、工作流=user prompt、frontmatter=状态机，是最好的 Dogfooding。
- 工程优先于行数；现成组件传数据优先于从零手写；环境坑一条规则封死。
- 据实标注：每条结论带证据状态与验收标准，未实测一律 `paper_spec`。
