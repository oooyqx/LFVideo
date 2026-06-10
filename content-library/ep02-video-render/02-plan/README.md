---
stage: 02-content-planning
status: approved
source_workflow: /02-content-planning
---

# ep02 内容策划方案（视频大纲与分镜落盘版）
## 系列定位：【AI 视频自动化生产线】第 2 期：渲染引擎篇

本文件由教学软文提炼生成，专用于指导下游的 **03 视听编排** 与 **04 脚本撰写**。分镜主线严格对齐 tutorial 现行结构：**范式与痛点 → 判断层矩阵 → 选型理由 → 流程即代码 → 实操与避坑**。

> 📁 **本期 02-plan 文件分工与生成/修改约定（重要，先读）**
> - **`tutorial.md` = 自动产物（AI 生成线）**：由 `/02-content-planning` 阶段4 生成，真相源="AI 生成了什么"。**请勿在此文件上做人工定稿**——它可能被重新生成覆盖。
> - **`tutorial.final.md` = 人工修订定稿（内容真相源）**：AI 把 `tutorial.md` 拷为底子并预填文末「必讲要点覆盖清单」；**人在此文件上修订成稿，改完把 frontmatter `status` 置为 `approved`**（人工定稿门，AI 不替人置 approved）。它是下游 04 口播"必须讲到什么"的唯一依据。
> - **`README.md`（本文件）= 分镜与校验线**：只定义分镜结构 + schema JSON；口播必讲要点以 `tutorial.final.md` 的清单为唯一真相源（见下方「必讲要点覆盖映射」）。
> - **同步规则**：`tutorial.md` 若重新生成/改动，**不自动同步**到 `tutorial.final.md`（避免覆盖人工定稿）；需要时由人工合并或重跑脚手架后重新定稿。
> - **进入 03/04 前提**：`tutorial.final.md` 必须 `status: approved`。

---

## 1. 标题与定位
- **定稿标题**：《代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程》
- **目标受众**：追求极致视频自动化的前端开发者、想把内容生产做成工程流水线的技术博主/团队。
- **视觉风格模式 (Visual Mode)**：`mixed`
- **核心视觉隐喻**：**“数字渲染生产线”**（声明式代码/数据像零件一样在 Frame 传送带上流过“状态映射器”，被渲染器编译成帧序列，最终合成高清 MP4）。
- **反噱头纪律**：标题与正文不以“多少行代码/百倍效率”为卖点；SSR `window` 问题定位为“选这条路要付的税”，非致命噱头。

---

## 2. 视频分镜结构（6 段式，对齐 tutorial 主线）

### 第一段：开头黄金钩子（目标：30 秒）
- **核心论点**：传统剪辑是“轨道 + 绝对时间轴”的低 ROI 体力活；Video-as-Code 把一条视频变成**声明式代码/数据**，由渲染器编译成帧——因此可版本控制、可参数化批量复用、可被 AI 端到端接管。
- **叙事节奏 (Beat Type)**：`statement`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@IntroScene` 科技感大字报渐入，配“数字渲染生产线”隐喻动画（代码/数据 → 帧传送带 → MP4）。

### 第二段：范式本质·帧即状态·不止 React（目标：2 分钟）
- **核心论点**：一句话本质是**帧即状态（Frame as State）**——给定时间点，渲染器算出该刻画面。且“代码即视频 ≠ Remotion”，它是一类范式，有 6 条路线（React/DOM、TS 声明式动画、程序化数学动画、像素合成、Canvas/游戏引擎、命令式合成），共享同一内核：用代码/数据描述 → 编译成帧 → 合成视频。
- **叙事节奏 (Beat Type)**：`transformation`
- **视觉焦点 (Visual Priority)**：`mixed`
- **画面视觉**：`@ConceptScene` 用 2D 卡片讲“帧即状态”心智模型；再切到六条路线的概念卡片阵列（路线 × 代表项目 × 典型场景）。

### 第三段：判断层矩阵与选型理由（目标：3 分钟）
- **核心论点**：以“边界与验收”为护城河，把 6 个开源方案摆进判断层矩阵（适用/不适用/已知坑/验收标准/证据状态）；在“固定模板 + 内容批量替换 + AI 端到端接管 + 跨期可维护”的约束下，**Remotion 胜出**（数据驱动模板、TS 类型安全、AI 友好、CLI 原生），并用 `Remotion ✅ vs HyperFrames ❌` 对照点明“要付的税”（需懂 React / BUSL 授权 / SSR 环境坑）。
- **叙事节奏 (Beat Type)**：`comparison`
- **视觉焦点 (Visual Priority)**：`chart`
- **画面视觉**：`@TableScene` 渲染判断层矩阵（逐行 stagger 入场、高亮当前讲解行）；穿插 `@SplitLayout` 做 `Remotion vs HyperFrames` 左右对照。

### 第四段：流程即代码（Dogfooding，目标：2.5 分钟）
- **核心论点**：既然画面能用代码控制，制作视频的**内容工作流本身也做成代码**——角色=`system_prompt`、工作流=`user_prompt`、产物 frontmatter=状态机；七阶段流水线（01→07）+ 一个 `python-frontmatter` 最小编排器即可驱动；本期录屏跑的是一段可复现的提示词链。这才是频道真正的护城河。
- **叙事节奏 (Beat Type)**：`transformation`
- **视觉焦点 (Visual Priority)**：`code`
- **画面视觉**：`@TimelineScene` 横向展开“01 选题 → 07 归档”七阶段流水线（逐阶段点亮）；切入代码框展示编排器伪代码与提示词链。

### 第五段：核心实操与避坑（目标：2.5 分钟）
- **核心论点**：去掉“多少行代码”执念，强调工程结构——**首选数据驱动现成组件**（只改 data 复用 `@ComparisonCard` ✅，而非从零手写 `ComparisonScene.tsx` ❌）；唯一要守的纪律是别在模块顶层碰 `window/document`，用 `.cursor/rules/remotion-ssr.mdc` 把这笔“税”一次性封死；最后给验收标准与渲染命令。
- **叙事节奏 (Beat Type)**：`demonstration`
- **视觉焦点 (Visual Priority)**：`code`
- **画面视觉**：`@SplitLayout` 左右对照——左“从零手写/顶层读 window 崩溃 ❌”，右“数据驱动 + SSR 守卫一次通过 ✅”；末尾 `@TerminalScene` 演示 `npx remotion render` 出片。

### 第六段：结尾 CTA
- **核心论点**：掌握“代码即视频 + 流程即代码”，内容生产从手工活变成可维护的工程流水线。关注我，下期解密 Whisper 毫秒级字幕与卡点。
- **叙事节奏 (Beat Type)**：`conclusion`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@OutroScene` 展示开源仓库地址与关注引导。

---

## 必讲要点覆盖映射

> 本 README 只定义**分镜结构**；口播"必须讲到哪些要点"以人工定稿 **`tutorial.final.md`** 文末的「必讲要点覆盖清单」为**唯一真相源**（按章节列出，标注对应本文件段号）。
> 下游 `/04-script-draft` **必读 `tutorial.final.md`**，并逐条核对该清单，确保每条必讲要点在口播里都有对应表达（避免只凭本大纲展开而漏掉 tutorial 细节）。
> 分工：`tutorial.md` = AI 自动产物；`tutorial.final.md` = 人工修订定稿（`status: approved` 后方可进入 03/04）。

---

## 3. 待验证假设清单 (assumptions_to_verify)

1. **假设 1**：在模块顶层用 `typeof window !== 'undefined'` 守卫，是否能 100% 规避 Remotion 在 Node 端打包/求值阶段的 `window is not defined` 报错。
   - **验证方法与判断标准**：在组件最外层写一处 `window` 读取并套守卫，运行 `npx remotion render`，控制台零报错且正常输出 MP4。
2. **假设 2**：仅向现成 `@ComparisonCard` 传数据（不新建组件），能否渲染出本期所需的左右对比卡片。
   - **验证方法与判断标准**：只编写 `data` 配置喂入 `@ComparisonCard`，在 `npx remotion studio` 中渲染出左右对比卡片且无类型/渲染报错。
3. **假设 3**：`charts/` 组件能否承接标题承诺的“图表动效”。
   - **验证方法与判断标准**：喂一组数据给 `charts/` 组件，渲染出带入场动画的图表且数值正确。
4. **假设 4（流程即代码）**：一个 `python-frontmatter` 最小编排器是否能扫描 frontmatter 状态机端到端推进流水线。
   - **验证方法与判断标准**：写最小调度脚本扫描 `status: approved` 的产物，自动加载对应角色/工作流并触发下一阶段（A 轨全自动，B 轨挂起等真人录屏）。

---

## 4. 结构化校验块 (JSON Schema Block)

```json
{
  "final_title": "代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程",
  "ab_ratio": "30/70",
  "visual_mode": "mixed",
  "visual_metaphor": "数字渲染生产线",
  "tech_stack": [
    "Remotion",
    "React",
    "TypeScript",
    "MoviePy",
    "FFmpeg"
  ],
  "comparison_matrix": [
    {
      "tech_dimension": "Video-as-Code 渲染路线",
      "options": [
        {
          "name": "Remotion (React/TS)",
          "suitability": "前端栈、复杂 CSS/SVG 排版、类型安全的跨期模板复用",
          "unsuitability": "零前端基础、纯后台超长批处理",
          "known_pitfalls": "模块顶层读 window/document 在 Node 求值阶段崩溃；BUSL 商业授权",
          "acceptance_criteria": "终端 render 正常出 MP4，无 ReferenceError",
          "evidence_status": "verified"
        },
        {
          "name": "Motion Canvas / Revideo (TS)",
          "suitability": "代码演示、需精确时序编排的动画",
          "unsuitability": "复杂网页级 Flex/Grid 排版（生态不如 React）",
          "known_pitfalls": "组件/排版生态较小，复用模板需自建",
          "acceptance_criteria": "描述脚本渲染出预期动画并可参数化导出",
          "evidence_status": "paper_spec"
        },
        {
          "name": "Manim (Python)",
          "suitability": "数学/算法/公式可视化",
          "unsuitability": "一般 UI、网页排版、录屏混排",
          "known_pitfalls": "学习曲线陡，排版能力弱，渲染慢",
          "acceptance_criteria": "公式/几何动画正确导出",
          "evidence_status": "paper_spec"
        },
        {
          "name": "MoviePy (Python)",
          "suitability": "纯 Python、简单拼接/裁剪、音轨闪避",
          "unsuitability": "自适应弹性排版、复杂文字动效",
          "known_pitfalls": "文本布局繁琐、多层画布内存大、无热更新",
          "acceptance_criteria": "脚本跑完输出拼接视频",
          "evidence_status": "verified"
        },
        {
          "name": "PixiJS / Cocos2d-HTML5 (JS)",
          "suitability": "游戏类复杂粒子动画",
          "unsuitability": "标准网页 UI、文本对齐",
          "known_pitfalls": "文本换行与 DOM 对齐计算复杂",
          "acceptance_criteria": "Canvas 正确导出帧序列",
          "evidence_status": "paper_spec"
        },
        {
          "name": "FFmpeg + 脚本 (Shell)",
          "suitability": "批量转码、轻量字幕烧录、合成兜底",
          "unsuitability": "复杂动效、交互式排版",
          "known_pitfalls": "filtergraph 语法晦涩、调试困难",
          "acceptance_criteria": "命令产出目标格式视频",
          "evidence_status": "verified"
        }
      ]
    }
  ],
  "assumptions_to_verify": [
    {
      "assumption": "模块顶层用 typeof window !== 'undefined' 守卫能否 100% 规避 Node 端打包/求值阶段的 window is not defined 报错",
      "verification_method": "在组件最外层写 window 读取并套守卫，运行 npx remotion render，控制台零报错且正常出片"
    },
    {
      "assumption": "仅向现成 @ComparisonCard 传数据（不新建组件）能否渲染出本期左右对比卡片",
      "verification_method": "只写 data 配置喂入 @ComparisonCard，在 remotion studio 渲染出左右对比卡片且无类型/渲染报错"
    },
    {
      "assumption": "charts/ 组件能否承接标题承诺的图表动效",
      "verification_method": "喂一组数据给 charts/ 组件，渲染出带入场动画的图表且数值正确"
    },
    {
      "assumption": "python-frontmatter 最小编排器能否扫描 frontmatter 状态机端到端推进流水线",
      "verification_method": "写最小调度脚本扫描 status: approved 的产物，自动加载对应角色/工作流触发下一阶段（B 轨挂起等真人录屏）"
    }
  ],
  "demo_design": {
    "project_context": "React 18 / TypeScript 5 / Remotion 4.0；A 轨组件位于 OpenMontage/remotion-composer（src/components 通用组件 + src/custom-templates 模板场景/原语，video/ 工程已并入）",
    "prompt_sequence": [
      "基于 remotion-composer 现有的 @ComparisonCard 组件，生成“对比卡片”的数据配置：左卡=方案A、右卡=方案B。只产出数据，不要新建组件。",
      "为 Cursor 在 .cursor/rules/ 下编写一份 mdc 规则（globs 指向 OpenMontage/remotion-composer/src/**），约束我编写 Remotion 组件时自动加上 window/document/navigator 的安全守卫。"
    ],
    "pitfalls_to_expose": [
      "AI 在模块/组件顶层读取 window.innerWidth，导致 Node 打包/求值阶段 ReferenceError: window is not defined 崩溃",
      "AI 为本期从零手写一个全新的 ComparisonScene.tsx，违反“固定模板 + 内容替换”，忽略仓库现成的 @ComparisonCard"
    ]
  },
  "outline_sections": [
    {
      "section_name": "开头黄金钩子",
      "key_point": "弃用时间轴拖拽，Video-as-Code 把视频变成声明式代码/数据：可版本控制、可批量复用、可被 AI 接管",
      "beat_type": "statement",
      "visual_priority": "text",
      "scene_template": "@IntroScene"
    },
    {
      "section_name": "范式本质·帧即状态·不止 React",
      "key_point": "一句话本质=帧即状态；代码即视频是一类范式有 6 条路线，共享“代码描述→编译成帧→合成视频”内核",
      "beat_type": "transformation",
      "visual_priority": "mixed",
      "scene_template": "@ConceptScene"
    },
    {
      "section_name": "判断层矩阵与选型理由",
      "key_point": "6 方案按边界/验收入矩阵；在固定模板+AI友好+跨期可维护约束下 Remotion 胜出，并点明要付的税",
      "beat_type": "comparison",
      "visual_priority": "chart",
      "scene_template": "@TableScene"
    },
    {
      "section_name": "流程即代码（Dogfooding）",
      "key_point": "角色=system_prompt/工作流=user_prompt/frontmatter=状态机，七阶段流水线+编排器伪代码+提示词链",
      "beat_type": "transformation",
      "visual_priority": "code",
      "scene_template": "@TimelineScene"
    },
    {
      "section_name": "核心实操与避坑",
      "key_point": "首选数据驱动现成 @ComparisonCard ✅ 而非从零手写 ❌；用 MDC 规则把 SSR window 守卫一次性封死",
      "beat_type": "demonstration",
      "visual_priority": "code",
      "scene_template": "@SplitLayout"
    },
    {
      "section_name": "结尾 CTA",
      "key_point": "代码即视频+流程即代码把内容生产做成工程流水线；关注博主，下期详解 Whisper 毫秒级字幕卡点",
      "beat_type": "conclusion",
      "visual_priority": "text",
      "scene_template": "@OutroScene"
    }
  ]
}
```
