---
stage: 02-content-planning
status: approved
source_workflow: /02-content-planning
---

# ep02 内容策划方案（视频大纲与分镜落盘版）
## 系列定位：【AI 视频自动化生产线】第 2 期：渲染引擎篇

本文件由教学软文 `@content-library/ep02-video-auto/02-plan/tutorial.md` 提炼生成，专用于指导下游的 **03 视听编排** 与 **04 脚本撰写**。

---

## 1. 标题与定位
- **定稿标题**：《代码即视频：如何用 100 行 React 代码编译卡点与图表动效？》
- **目标受众**：追求极致视频自动化的前端开发者、想深入掌握 Remotion 的技术博主。
- **视觉风格模式 (Visual Mode)**：`mixed`
- **核心视觉隐喻**：**“数字渲染生产线”**（代码像乐高积木一样，在 Frame（时间帧）传送带上流过状态映射器，最终合成为高清晰度的 MP4 视频包）。

---

## 2. 视频分镜结构（5 段式）

### 第一段：开头黄金钩子（目标：30秒）
- **核心论点**：告别机械式的剪辑操作，拥抱 Web 技术栈。用代码像写网页一样写视频。
- **叙事节奏 (Beat Type)**：`statement`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@IntroScene` 黑色科技感背景渐入，动态展示代码如何被一帧帧渲染为精美 MP4 的生产线动画。

### 第二段：Remotion 底层解密（目标：2分钟）
- **核心论点**：视频的本质是 Frame 与 Seconds 的插值。讲解 Remotion 核心机制。
- **叙事节奏 (Beat Type)**：`transformation`
- **视觉焦点 (Visual Priority)**：`chart`
- **画面视觉**：`@TimelineScene` 动态分解：`useCurrentFrame()` 与 `fps` 如何映射为当前秒数，如何利用 CSS Grid 轻松排版。

### 第三段：致命 SSR 踩坑（目标：2分钟）
- **核心论点**：实播 AI 的翻车瞬间——在 React 顶层直接读取 `window.innerWidth` 导致 Puppeteer 截图阶段 SSR 报 `window is not defined` 崩溃。
- **叙事节奏 (Beat Type)**：`demonstration`
- **视觉焦点 (Visual Priority)**：`screen`
- **画面视觉**：全屏展示 Node CLI 执行编译，触发崩溃红屏，暴露 AI IDE 在环境感知上的硬肋。

### 第四段：MDC 被动约束降维打击（目标：2.5分钟）
- **核心论点**：不用手改一行防守代码！编写一条简单的 MDC Rule，让 Cursor 在编写 Remotion 组件时永远自动避开 SSR 报错。
- **叙事节奏 (Beat Type)**：`comparison`
- **视觉焦点 (Visual Priority)**：`code`
- **画面视觉**：`@SplitLayout` 左右分屏演示。左边无规则下 Cursor 频出 window error，右边加入 MDC rule 后 Cursor 自动写出安全检测守卫一次编译成功。

### 第五段：结尾 CTA
- **核心论点**：掌握视频代码化，你的后期效率将提升百倍。关注我，下期解密字级字幕卡点！
- **叙事节奏 (Beat Type)**：`conclusion`
- **视觉焦点 (Visual Priority)**：`text`
- **画面视觉**：`@OutroScene`。展示开源仓库地址与关注。

---

## 3. 待验证假设清单 (assumptions_to_verify)

1. **假设 1**：在 Remotion SSR 预渲染阶段，在 `useEffect` 外直接使用 `typeof window === 'undefined'` 守卫是否能 100% 避免 Node 端渲染编译报错。
   - **验证方法与判断标准**：在 React 组件最外层写一个 `window` 读取逻辑并使用该守卫，运行 `npx remotion render`，检查控制台是否无报错并正常输出。
2. **假设 2**：在 Remotion 中使用 `spring` 弹簧插值物理动效，在高频率快节奏帧率（如 60fps）下，插值曲线是否能完美平滑过渡而不出现掉帧抖动。
   - **验证方法与判断标准**：配置 60fps 的 Composition，设置插值 `[0, 1] -> [100, 0]`，渲染出片后逐帧拖动视频画面，检查弹性边框缩放是否完全线性顺滑。

---

## 4. 结构化校验块 (JSON Schema Block)

```json
{
  "final_title": "代码即视频：如何用 100 行 React 代码编译卡点与图表动效？",
  "ab_ratio": "30/70",
  "visual_mode": "mixed",
  "visual_metaphor": "数字渲染生产线",
  "tech_stack": [
    "Remotion",
    "React",
    "TypeScript"
  ],
  "comparison_matrix": [
    {
      "tech_dimension": "视频代码化",
      "options": [
        {
          "name": "Remotion",
          "suitability": "前端技术栈、复杂动效排版",
          "unsuitability": "零前端基础用户、纯后台大批量超长处理",
          "known_pitfalls": "SSR 阶段 window 未定义报错",
          "acceptance_criteria": "终端执行 render 正常输出 MP4",
          "evidence_status": "verified"
        },
        {
          "name": "MoviePy",
          "suitability": "纯 Python 环境、简单拼接",
          "unsuitability": "自适应 CSS 弹性布局、复杂文字动效",
          "known_pitfalls": "多层画布堆叠时内存开销大且无可视化热更新",
          "acceptance_criteria": "脚本跑完输出拼接后的视频",
          "evidence_status": "paper_spec"
        }
      ]
    }
  ],
  "assumptions_to_verify": [
    {
      "assumption": "在顶层直接使用 typeof window === 'undefined' 守卫是否能 100% 避免 Node SSR 编译报错",
      "verification_method": "在 React 外层写 window 测量并套用守卫，运行 render CLI，检查控制台是否完全无报错输出"
    },
    {
      "assumption": "spring 物理插值在 60fps 下是否能保持平滑不出现掉帧抖动",
      "verification_method": "配置 60fps Composition，渲染出片后逐帧分析缩放形变，验证连续位移无突变"
    }
  ],
  "demo_design": {
    "project_context": "React 18 / TypeScript 5 / Remotion 4.0",
    "prompt_sequence": [
      "编写一个 Remotion ComparisonScene 对比卡片场景组件，包含左右分栏卡片布局，使用 spring 插值完成卡片缩放弹射动效。注意：必须确保在 Remotion SSR 预渲染阶段不会因为读取 window 或 document 而导致崩溃。",
      "为 Cursor 编写一份配置在 .cursor/rules 目录下的 mdc 规则文件，约束智能体在编写 Remotion React 视频组件时自动添加 SSR 浏览器全局对象守卫。"
    ],
    "pitfalls_to_expose": [
      "AI 顶层读取 window.innerWidth 导致 SSR 截图时 ReferenceError 崩溃红屏"
    ]
  },
  "outline_sections": [
    {
      "section_name": "开头黄金钩子",
      "key_point": "放弃机械拖拽，用 React 状态定义视频的爽感与未来趋势",
      "beat_type": "statement",
      "visual_priority": "text",
      "scene_template": "@IntroScene"
    },
    {
      "section_name": "Remotion 底层解密",
      "key_point": "视频本质是 Frame 与 Seconds 的插值，讲解渲染与缩放机制",
      "beat_type": "transformation",
      "visual_priority": "chart",
      "scene_template": "@TimelineScene"
    },
    {
      "section_name": "致命 SSR 踩坑",
      "key_point": "直播演示 Cursor 顶层直接读取 window.innerWidth 导致编译崩溃红屏的灾难",
      "beat_type": "demonstration",
      "visual_priority": "screen",
      "scene_template": "@ConceptScene"
    },
    {
      "section_name": "MDC 被动约束降维打击",
      "key_point": "通过 mdc 约束，无需手写一行代码，Cursor 自动补全安全守卫一次通过",
      "beat_type": "comparison",
      "visual_priority": "code",
      "scene_template": "@SplitLayout"
    },
    {
      "section_name": "结尾 CTA",
      "key_point": "掌握代码即视频，极速出片。关注博主，下期详解 Whisper 毫秒级字幕卡点",
      "beat_type": "conclusion",
      "visual_priority": "text",
      "scene_template": "@OutroScene"
    }
  ]
}
```
