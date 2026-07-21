---
stage: 02-content-planning
status: approved
source_workflow: /02-content-planning
---

# ep02 内容策划方案（视频大纲与分镜落盘版）
## 系列定位：【AI 视频自动化生产线】第 2 期：渲染引擎篇

本文件由教学软文提炼生成，专用于指导下游的 **04 分镜口播稿**（已合并原 03 视听编排 + 04 脚本撰写为一份「画面+口播」一体产物）。分镜主线严格对齐 `tutorial.final.md` 的六章结构：**开场（钩子） → 找技术路径（AI 罗列现成路线） → 技术选型（不适用+坑对比/为什么 Remotion） → 技术落地（Remotion 怎么工作·为何 AI 能驱动 / 配置分发·配置即内容 / 数字人选型） → 场景适配（适合纯自动渲染 / 搭配透明叠层 / 不适合） → 总结+EP03 预告**。流程即代码/角色编排已按分期移出本期（归 EP05/EP06）。

> 📁 **本期 02-plan 文件分工与生成/修改约定（重要，先读）**
> - **`tutorial.md` = 自动产物（AI 生成线）**：由 `/02-content-planning` 阶段4 生成，真相源="AI 生成了什么"。**请勿在此文件上做人工定稿**——它可能被重新生成覆盖。
> - **`tutorial.final.md` = 人工修订定稿（内容真相源）**：AI 把 `tutorial.md` 拷为底子并预填文末「必讲要点覆盖清单」；**人在此文件上修订成稿，改完把 frontmatter `status` 置为 `approved`**（人工定稿门，AI 不替人置 approved）。它是下游 04 口播"必须讲到什么"的唯一依据。
> - **`README.md`（本文件）= 分镜与校验线**：只定义分镜结构 + schema JSON；口播必讲要点以 `tutorial.final.md` 的清单为唯一真相源（见下方「必讲要点覆盖映射」）。
> - **同步规则**：`tutorial.md` 若重新生成/改动，**不自动同步**到 `tutorial.final.md`（避免覆盖人工定稿）；需要时由人工合并或重跑脚手架后重新定稿。
> - **进入 03/04 前提**：`tutorial.final.md` 必须 `status: approved`。

---

## 1. 标题与定位
- **定稿标题**：《用 Vibe Coding 搭一套能自动出片的视频渲染引擎》
- **目标受众**：追求极致视频自动化的前端开发者、想把内容生产做成工程流水线的技术博主/团队。
- **视觉风格模式 (Visual Mode)**：`mixed`
- **核心视觉隐喻**：**“数字渲染生产线”**（声明式代码/数据像零件一样在 Frame 传送带上流过“状态映射器”，被渲染器编译成帧序列，最终合成高清 MP4）。
- **反噱头纪律**：标题与正文不以“多少行代码/百倍效率”为卖点；SSR `window` 问题定位为“选这条路要付的税”，非致命噱头。

---

## 2. 视频分镜结构（对齐 tutorial「教人用 Vibe Coding」三段主线）

### 第一段：开场钩子（目标：30 秒）
- **核心论点**：本期用 Vibe Coding 解决自动化视频生产线最核心的一环——视频自动渲染。关键认知：AI 最强的是处理文本和代码，所以渲染最好用文本/代码/数据驱动，改数据就改片。我没有前后端基础，全程用大白话指挥 AI（讲需求、AI 写、人判断）。本期分三步：① 找技术路径；② 技术选型；③ 技术落地。
- **叙事节奏 (Beat Type)**：`statement`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@IntroScene` 大字报渐入主副标题；配"改数据→重新编译出片"的隐喻动画，末尾给出"找路径 / 选型 / 落地"三步路线图。

### 第二段：找技术路径——让 AI 把路都摆出来（目标：50 秒）
- **核心论点**：把"有哪些用代码/数据渲染成视频的现成路线"丢给 AI，让它罗列 Remotion / Motion Canvas·Revideo / Manim / MoviePy / PixiJS·Cocos / FFmpeg，点明它们内核都一样——用代码/数据描述画面 → 程序编译成帧 → 合成视频。此处只列不评。
- **叙事节奏 (Beat Type)**：`transformation`
- **视觉焦点 (Visual Priority)**：`mixed`
- **画面视觉**：`@ConceptScene` 用一句话讲清共同内核；切到六条路线的卡片阵列（路线 × 代表工具 × 适合干什么）。

### 第三段：技术选型——逼 AI 给"不适用 + 坑"，回到约束定 Remotion（目标：90 秒）
- **核心论点**：AI 默认给四平八稳的"百科式"好话对比，没用；真正帮你决策的是每条路"什么时候不好使、会在哪翻车"。所以追问"不适用场景 + 已知坑"，人盯着"坑"那一列做减法。再把自己的约束讲清楚（一期一个固定模板、换数据批量出几十期 / 让 AI 改内容不易错 / 跨期好维护），Remotion 胜出；并和"复制粘贴 HTML"土办法对照，代价（React 栈 + BUSL 授权）如实说、不渲染成门槛。
- **叙事节奏 (Beat Type)**：`comparison`
- **视觉焦点 (Visual Priority)**：`chart`
- **画面视觉**：`@TableScene` 渲染"方案 / 适合 / 不适合 / 已知坑"判断层矩阵（逐行 stagger 入场、高亮当前行、重点高亮"坑"列）；穿插 `@SplitLayout` 做 `Remotion ✅ vs 复制粘贴 HTML ❌` 左右对照。

### 第四段：技术落地·Remotion 怎么工作，为什么 AI 能轻松驱动（目标：53 秒）
- **核心论点**：路线定了 Remotion，先一分钟讲清它大致怎么干活——用 React 写「每一帧长什么样」，引擎逐帧截图再用 FFmpeg 合成视频；组件里用 `useCurrentFrame()` 拿帧号，动画是「帧号→数值」的 `interpolate` 插值，秒和帧靠 30fps 打通（第 3 秒 = 第 90 帧）。再点明为什么 AI 好驱动：全是 React/CSS（语料最厚）、声明式（只描述长什么样）、数据驱动（改数据就改片，正中 AI 改文本之长）、TypeScript 字段焊死（填错即编译报红）。
- **叙事节奏 (Beat Type)**：`demonstration`
- **视觉焦点 (Visual Priority)**：`code`
- **画面视觉**：`@FlowScene` 三步管线（React 描述每帧 → 无头浏览器逐帧截图 → FFmpeg 合成 MP4）；`@TerminalScene` 展示 `useCurrentFrame`+`interpolate`+30fps 换算；`@BulletScene` 列「为什么 AI 好驱动」四条；`@QuoteScene` 收一句「把视频写成数据，AI 只填空、不乱跑」。

### 第五段：技术落地·配置分发 + 配置即内容（目标：90 秒）
- **核心论点**：搭引擎也不靠手写，靠和 AI 把"配置"和"现成组件"对上。仓库渲染引擎 `OpenMontage/remotion-composer` 的干活方式：写一份配置说清"这段是什么画面、上面叠什么"，主程序 `Explainer` 按 `type` 字段自动分发到对应组件（`comparison`/`terminal_scene`/`screenshot_scene`/`charts`/`ConceptScene`·`SplitLayout`…）。做内容 = 挑组件、填字段；让 AI 填数据、别造组件，TypeScript 字段类型兜底，填错即编译报错。（另：现成组件之上可扩"自有风格组件库"，是更大话题、后续单独一期，本期一句带过。）
- **叙事节奏 (Beat Type)**：`demonstration`
- **视觉焦点 (Visual Priority)**：`code`
- **画面视觉**：`@ConceptScene`/图示讲"配置 → Explainer 按 type 分发 → 组件"的流向；`@TerminalScene` 展示一份 `comparison` 配置 JSON；`@SplitLayout` 左"让 AI 从零手写组件 ❌"右"只填数据复用现成组件 ✅"。

### 第六段：技术落地·数字人选型与落地（目标：60 秒）
- **核心论点**：数字人也走和选渲染引擎同一套方法论——定位说死「陪衬、不是主角」；让 AI 把可选形象摆出来、说清坑（真人出镜：可信但要露脸、不可编程复用；写实/对口型：易掉恐怖谷、可信度反崩；二次元/3D 风格化角色 VRM：风格统一、可编程、渲一次到处用）；对着自己的约束（不露脸、可编程批量复用、避恐怖谷）选定 3D 角色 `VRMAvatar`、定死不做对口型；再让 AI 落地——渲一次按场景取景、修脚站稳（大腿上反向抵消髋部摆动）。
- **叙事节奏 (Beat Type)**：`comparison`
- **视觉焦点 (Visual Priority)**：`chart`
- **画面视觉**：`@TableScene` 渲染「形象方案 / 适合 / 坑·代价」选型矩阵（真人·写实·二次元三行 stagger 入场、高亮选定的 VRM 行）；切到主持人"脚踩稳"取景示意（角落/半身/全身预设）作落地呈现。

### 第七段：场景适配——适合 / 搭配 / 不适合（目标：53 秒）
- **核心论点**：比把引擎跑通更值钱的判断是「什么场景该用、什么场景别硬上」。① 适合纯自动渲染出片：概念讲解、要点流程、数据图表/对比/核心指标、开场/章节/片尾、合成终端演示命令报错——画面用文本/数据就能说清、换数据批量复用。② 搭配着用：主体是真人口播/真实录屏时，Remotion 渲透明背景悬浮叠层（数据卡/字幕/角标/箭头/Zoom 标注），退居叠层不独占整屏。③ 不适合：实拍人物产品 Vlog、写实对口型数字人（恐怖谷、可信度反崩，本项目排除）、影视级特效/逐帧手绘、纯后台超长批处理（FFmpeg 更划算）。一句话：主体真实→退居叠层，主体讲解/数据→独占整屏。
- **叙事节奏 (Beat Type)**：`comparison`
- **视觉焦点 (Visual Priority)**：`mixed`
- **画面视觉**：`@ConceptScene` 列适合纯自动渲染的四类；`@SplitLayout` 做「独占整屏 vs 退居叠层」对照；`@CalloutScene`(warning) 列不适合的四类；`@QuoteScene` 收口诀。

### 第八段：结尾 CTA
- **核心论点**：整期三步——找技术路径（AI 罗列）、技术选型（人对约束拍板）、技术落地（填配置、套组件、规则兜底、AI 跑渲染）；没有编程基础也能复制。关注我，下期 EP03 字幕匹配：用 Whisper 字级时间戳驱动 `CaptionOverlay`，让字幕踩着话音跳。
- **叙事节奏 (Beat Type)**：`conclusion`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@OutroScene` 展示开源仓库地址与关注引导，回扣"三步法 + 没基础也能复制"。

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
---

## 4. 结构化校验块 (JSON Schema Block)

```json
{
  "final_title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎",
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
  ],
  "demo_design": {
    "project_context": "React 18 / TypeScript 5 / Remotion 4.0；自动渲染组件位于 OpenMontage/remotion-composer（src/components 通用组件 + src/custom-templates 模板场景/原语，video/ 工程已并入）",
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
      "section_name": "开场钩子",
      "key_point": "本期用 Vibe Coding 解决视频自动渲染；AI 强在文本/代码→渲染用数据驱动；没基础也能复制；本期三步：找路径/选型/落地",
      "beat_type": "statement",
      "visual_priority": "text",
      "scene_template": "@IntroScene"
    },
    {
      "section_name": "找技术路径·让 AI 罗列现成路线",
      "key_point": "把选择题丢给 AI：Remotion/Motion Canvas·Revideo/Manim/MoviePy/PixiJS·Cocos/FFmpeg，内核都是“代码/数据描述→编译成帧→合成”；只列不评",
      "beat_type": "transformation",
      "visual_priority": "mixed",
      "scene_template": "@ConceptScene"
    },
    {
      "section_name": "技术选型·逼 AI 给不适用+坑，回到约束定 Remotion",
      "key_point": "追问每条路的不适用与已知坑、人盯坑做减法；按固定模板批量/AI友好/跨期维护约束选定 Remotion，vs 复制粘贴 HTML，代价如实说不渲染成门槛",
      "beat_type": "comparison",
      "visual_priority": "chart",
      "scene_template": "@TableScene"
    },
    {
      "section_name": "技术落地·Remotion 怎么工作与为何 AI 能驱动",
      "key_point": "用 React 写每帧→引擎逐帧截图→FFmpeg 合成；useCurrentFrame/interpolate 插值、秒与帧靠 30fps 打通；为何 AI 好驱动：React/CSS 语料厚·声明式·数据驱动·TS 类型兑底",
      "beat_type": "demonstration",
      "visual_priority": "code",
      "scene_template": "@FlowScene"
    },
    {
      "section_name": "技术落地①·配置分发与配置即内容",
      "key_point": "一份配置→Explainer 按 type 分发到现成组件；做内容=挑组件填字段，让 AI 填数据别造组件，TS 类型兜底；自有风格组件库留作后续单独一期",
      "beat_type": "demonstration",
      "visual_priority": "code",
      "scene_template": "@SplitLayout"
    },
    {
      "section_name": "技术落地②·数字人选型与落地",
      "key_point": "数字人走同款选型方法论：定位陪衬→AI 列真人/写实对口型/二次元(VRM)三种形象的适用与坑→对约束选定 VRM 3D 角色、定死不做对口型→AI 落地（取景预设、脚站稳）",
      "beat_type": "comparison",
      "visual_priority": "chart",
      "scene_template": "@TableScene"
    },
    {
      "section_name": "场景适配·适合/搭配/不适合",
      "key_point": "适合纯自动渲染出片（讲解/数据/包装/合成终端）；可搭配着用（真人口播/录屏为主时 Remotion 渲透明悬浮叠层）；不适合（实拍·对口型·影视特效·后台批处理）；口诀：主体真实→退居叠层，主体讲解→独占整屏",
      "beat_type": "comparison",
      "visual_priority": "mixed",
      "scene_template": "@ConceptScene"
    },
    {
      "section_name": "结尾 CTA",
      "key_point": "三步法回顾+没基础也能复制；下期 EP03 字幕匹配用 Whisper 字级时间戳驱动 CaptionOverlay",
      "beat_type": "conclusion",
      "visual_priority": "text",
      "scene_template": "@OutroScene"
    }
  ]
}
```
