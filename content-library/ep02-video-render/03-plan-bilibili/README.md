---
stage: 03-video-planning-bilibili
status: draft
source_workflow: /03-video-planning-bilibili
upstream_inputs:
  - 02-plan/README.md (status: draft)
  - 02-plan/tutorial.final.md (status: draft)
  - shared/docs/remotion-spec.md
---

> ⚠️ **重做版（对齐三段主线）**：本分镜已按 `tutorial.final.md` 的「教人用 Vibe Coding」三段主线重写——开场 → 找技术路径 → 技术选型 → 技术落地 → 总结。旧的「两步/选路线·搭引擎」框架已弃用（流程即代码/角色编排归 EP05/EP06）。上游 `tutorial.final.md` 当前为 `draft`，本稿随其一同待人工复核后再置 `approved`。

# ep02 B站视听编排蓝图

> **本期主线**：站在"教人用 Vibe Coding"的角度讲三步——① 找技术路径（让 AI 罗列现成路线）；② 技术选型（对约束选定 Remotion）；③ 技术落地（驱动 Remotion 按配置出片）。每个 section 的 Props 文案/数据均对齐 `tutorial.final.md`。

---

## 1. 视频规格

- **平台**：Bilibili
- **画幅**：16:9（1920×1080）
- **帧率**：30fps
- **A/B 轨比例**：约 30/70（A 轨 Remotion 组件 / B 轨 IDE 与终端录屏）
- **总时长预估**：约 5 分 50 秒
- **视觉模式**：`mixed`
- **反噱头纪律**：标题与正文不以"多少行代码/百倍效率"为卖点；SSR `window` 坑定位为"选这条路要付的税"。
- **数字主持人纪律**：`VRMAvatar` 仅作陪衬串场，坚决不做对口型数字人、不做 AI 生成的假界面。

---

## 2. 场景分镜与组件映射

> 帧号按 30fps 计算（`frame = 秒 × 30`）。凡 `duration_seconds > 15` 的 scene 均配套约每 10–15 秒一个可见变化的 `animation_cues` 或拆 `sub_shots`，杜绝长镜头静止（见 `remotion-spec.md` §1.5）。

### 第一段：开场钩子（0:00–0:30，30s）

> 对应 `outline_sections[0]`（开场钩子），beat=`statement`，visual=`text`

- **组件**：`@IntroScene`
- **Props**：主标题"用 Vibe Coding 搭一套能自动出片的视频渲染引擎"+ 系列副标 + 三步路线图（找路径 / 选型 / 落地）。
- **承载必讲要点**：痛点（传统剪辑改一处要回时间轴重排）→ 结果先行（写成配置、改一行就重渲）→ 人设（没基础、全程 Vibe Coding）→ 三步路线图。
- **防静止**：30s 内 5 个变化点（约每 6s）。

### 第二段：找技术路径——让 AI 把路都摆出来（0:30–1:20，50s）

> 对应 `outline_sections[1]`，beat=`transformation`，visual=`mixed`

- **组件**：`@ConceptScene`（讲共同内核）→ 卡片阵列（六条路线）。
- **Props**：一句话内核"用代码/数据描述画面 → 程序编译成帧 → 合成视频"；六条路线卡片（Remotion / Motion Canvas·Revideo / Manim / MoviePy / PixiJS·Cocos / FFmpeg，各配"用什么描述画面 + 适合干什么"）。
- **承载必讲要点**：让 AI 摆出多条路线、点明共同内核。
- **拆分**：先内核（15s）后六路线阵列（35s，sub_shots 逐张入场）。

### 第三段：技术选型——逼 AI 给"不适用+坑"，回到约束定 Remotion（1:20–3:25，约 125s）

> 对应 `outline_sections[2]`，beat=`comparison`，visual=`chart`

- **组件**：`@TableScene`（判断层矩阵）→ `@ConceptScene`（回到自己的约束）→ `@SplitLayout`（Remotion vs 复制粘贴 HTML）。
- **Props**：
  - 判断层矩阵：方案 / 适合 / 不适合 / 已知坑（六条路线，重点高亮"坑"列）。
  - 约束卡片：固定模板换数据批量 / 让 AI 接手最稳 / 一行命令出片 / 网页生态现成。
  - 左右对照：模板复用、让 AI 接手、长期维护、授权四维 `Remotion ✅ vs 复制粘贴 HTML ❌`；代价（React 栈 + BUSL）如实标注。
- **承载必讲要点**：逼 AI 给"不适用+坑"、人盯坑做减法；选型理由→为什么 Remotion；vs 复制粘贴 HTML；代价如实说。
- **B 轨**：IDE 里和 AI 对话"追问每条路的坑"的录屏（`b-ide-route-pitfalls`）。

### 第四段：技术落地——配置分发 + 配置即内容（3:25–4:35，约 70s）

> 对应 `outline_sections[3]`，beat=`demonstration`，visual=`code`

- **组件**：`@ConceptScene`（配置→Explainer 按 type 分发→组件 的流向）→ `@TerminalScene`（一份 `comparison` 配置 JSON）→ `@SplitLayout`（造组件 ❌ vs 填数据 ✅）。
- **Props**：
  - 流向图：`一份配置(cut/overlay) → Explainer 按 type 分发 → 现成组件(comparison/terminal_scene/screenshot_scene/charts/ConceptScene·SplitLayout)`。
  - 配置示例：`{"type":"comparison","title":"传统剪辑 vs 代码即视频", ...}`。
  - 左右对照：左"让 AI 从零手写 ComparisonScene.tsx ❌"、右"只填数据复用现成组件 ✅"，标注"TS 字段类型兜底，填错即编译报错"。
- **承载必讲要点**：引擎按 type 分发；组件清单；配置即内容、让 AI 填字段别造组件、类型兜底；自有风格组件库可在现成组件上扩、后续单独一期（一句带过）。
- **B 轨**：IDE 里"只写一份配置喂给现成组件"的录屏（`b-ide-config-fill`）。

### 第五段：技术落地——数字主持人 + 避坑 + 一行出片（4:35–5:35，约 60s）

> 对应 `outline_sections[4]`，beat=`demonstration`，visual=`code`

- **组件**：`@ScreenshotScene`/取景示意（主持人基础版）→ `@SplitLayout`（SSR 崩 vs 守卫，A 轨 `@TerminalScene` 兜底）→ `@TerminalScene`（出片命令）。
- **Props**：
  - 主持人：取景预设 + "脚踩稳"（在大腿上反向抵消髋部摆动）+ 反对口型边界。
  - SSR 对照：左 `const w = window.innerWidth` 打包阶段 `ReferenceError`、右 `typeof window !== 'undefined'` 守卫 + `.cursor/rules/remotion-ssr.mdc`。
  - 出片：`npx remotion render`（含模拟渲染进度）。
- **承载必讲要点**：主持人陪衬定位/脚站稳/不做对口型；顶层读 window 打包崩→MDC 规则一次写死；出片一行命令交给 AI/终端。
- **B 轨**：SSR 报错→加守卫一次通过录屏（`b-ide-ssr-crash` / `b-ide-ssr-fix`）、终端渲染录屏（`b-term-render`）。

### 第六段：结尾 CTA（5:35–5:50，15s）

> 对应 `outline_sections[5]`，beat=`conclusion`，visual=`text`

- **组件**：`@OutroScene`
- **Props**：三步法回顾 + "没编程基础也能复制" + 关注引导 + 下期预告（EP03 字幕匹配：Whisper 字级时间戳驱动 `CaptionOverlay`）。

---

## 3. 组件扩展工单 (Template Tickets)

无新组件需求——本期全部复用 `OpenMontage/remotion-composer` 现有组件（`@IntroScene`/`@ConceptScene`/`@TableScene`/`@SplitLayout`/`@TerminalScene`/`@ScreenshotScene`/`@OutroScene`），与"配置即内容、不造新组件"的主线一致。

---

## 4. 结构化校验块 (JSON Schema Block)

<!-- MANDATORY: 符合 shared/schemas/03-plan-bilibili.schema.json -->
```json
{
  "video_spec": {
    "aspect_ratio": "16:9",
    "resolution": "1920x1080",
    "fps": 30
  },
  "scene_storyboards": [
    {
      "section_ref": "开场钩子",
      "scene_template": "@IntroScene",
      "props": {
        "title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎",
        "subtitle": "《Vibe Coding 造一条自动化视频生产线》EP02 · 视频渲染",
        "roadmap": ["① 找技术路径", "② 技术选型", "③ 技术落地"],
        "background": "particles"
      },
      "duration_seconds": 30,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(background_particles)"},
        {"frame": 15, "action": "spring_scale(title, 0.85→1.0)"},
        {"frame": 180, "action": "fade_in(pain_point: 传统剪辑改一处要回时间轴重排)"},
        {"frame": 450, "action": "fade_in(result: 写成配置，改一行就重渲)"},
        {"frame": 720, "action": "reveal(roadmap: 找路径 / 选型 / 落地)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "主副标题入场"},
        {"start_seconds": 6, "action": "痛点一句话淡入"},
        {"start_seconds": 15, "action": "结果先行（改一行就重渲）"},
        {"start_seconds": 24, "action": "三步路线图展开"}
      ]
    },
    {
      "section_ref": "找技术路径·让 AI 摆出多条路线",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "找技术路径",
        "title": "把视频写成代码，内核都一样",
        "items": [
          {"label": "STEP 1", "title": "用代码/数据描述画面", "desc": "组件、函数、公式或脚本", "icon": "✍️"},
          {"label": "STEP 2", "title": "程序编译成帧", "desc": "渲染器逐帧算出画面", "icon": "⚙️"},
          {"label": "STEP 3", "title": "合成视频", "desc": "帧序列拼成 MP4", "icon": "🎬"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 15,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 150, "action": "stagger_fade(items)"},
        {"frame": 360, "action": "connect_arrows(items)"}
      ]
    },
    {
      "section_ref": "找技术路径·让 AI 摆出多条路线",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "让 AI 把路都摆出来",
        "title": "六条把视频写成代码的路线",
        "items": [
          {"label": "Remotion", "title": "网页（React+CSS）渲染", "desc": "React 组件 + CSS/SVG，无头浏览器逐帧截图｜前端栈、复杂排版、模板复用", "icon": "⚛️"},
          {"label": "Motion Canvas / Revideo", "title": "代码声明动画", "desc": "写函数描述动画时序｜代码演示、讲解类动画", "icon": "📐"},
          {"label": "Manim", "title": "数学公式动画", "desc": "Python 描述几何/公式｜数学、算法可视化", "icon": "∑"},
          {"label": "MoviePy", "title": "像素脚本拼接", "desc": "Python 操作像素 + FFmpeg｜纯 Python、简单拼接", "icon": "🐍"},
          {"label": "PixiJS / Cocos", "title": "画布/游戏引擎", "desc": "Canvas 上逐帧画｜复杂粒子、游戏化动画", "icon": "🎮"},
          {"label": "FFmpeg + 脚本", "title": "命令行合成", "desc": "命令拼接｜批量转码、轻量字幕烧录", "icon": "🛠️"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 35,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 150, "action": "stagger_fade(items[0..2])"},
        {"frame": 600, "action": "stagger_fade(items[3..5])"},
        {"frame": 900, "action": "highlight(items[0]=Remotion, badge=本期主角)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 5, "action": "前三条路线卡片入场"},
        {"start_seconds": 20, "action": "后三条路线卡片入场"},
        {"start_seconds": 30, "action": "高亮 Remotion 为下文铺垫"}
      ]
    },
    {
      "section_ref": "技术选型·逼 AI 给不适用+坑",
      "scene_template": "@TableScene",
      "props": {
        "title": "别只听 AI 报菜名——逼它给「不适用 + 坑」",
        "columns": ["方案", "适合", "不适合", "已知的坑"],
        "rows": [
          ["Remotion", "前端栈、复杂排版、跨期复用模板", "纯后台超长批处理", "顶层读浏览器对象打包崩；BUSL 授权"],
          ["Motion Canvas / Revideo", "代码演示、精确时序动画", "复杂网页级排版", "组件/排版生态小，模板要自己攒"],
          ["Manim", "数学/公式/算法可视化", "普通 UI、网页排版", "学习曲线陡、排版弱、渲染慢"],
          ["MoviePy", "纯 Python、简单拼接、音轨闪避", "自适应排版、复杂文字动效", "文字排版繁琐、多层画布吃内存"],
          ["PixiJS / Cocos", "游戏类复杂粒子动画", "标准网页 UI、文字对齐", "文字换行/对齐计算复杂"],
          ["FFmpeg + 脚本", "批量转码、字幕烧录、兜底合成", "复杂动效、交互排版", "命令语法晦涩、难调试"]
        ],
        "highlight_column": 3
      },
      "duration_seconds": 55,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(title+header_row)"},
        {"frame": 150, "action": "stagger_rows_in(rows, 每行约 9f)"},
        {"frame": 750, "action": "highlight_column(已知的坑)"},
        {"frame": 1050, "action": "highlight_row(Remotion, annotation=坑可用规则绕开)"},
        {"frame": 1500, "action": "dim(其余行, focus=Remotion)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "表头入场"},
        {"start_seconds": 5, "action": "六行逐行 stagger 入场"},
        {"start_seconds": 25, "action": "整列高亮『已知的坑』"},
        {"start_seconds": 35, "action": "高亮 Remotion 行：坑可绕开"},
        {"start_seconds": 50, "action": "聚焦 Remotion，其余淡出"}
      ]
    },
    {
      "section_ref": "技术选型·回到约束为什么选 Remotion",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "回到自己的约束，让 AI 对号入座",
        "title": "为什么是 Remotion",
        "items": [
          {"label": "复用", "title": "固定模板换数据", "desc": "React 组件 + 数据分离，改一处主题全系列生效", "icon": "♻️"},
          {"label": "稳", "title": "让 AI 接手最稳", "desc": "只让 AI 填数据、套现成组件，不自由发挥结构", "icon": "🤖"},
          {"label": "出片", "title": "一行命令", "desc": "npx remotion render 纯命令行，方便接自动化", "icon": "⌨️"},
          {"label": "生态", "title": "网页生态现成", "desc": "CSS、动效、图表库随手取用", "icon": "🌐"}
        ],
        "footnote": "代价如实说：React 技术栈 + BUSL 商业授权（规模化要付费）。决策记录见 _decisions/why-remotion-over-hyperframes.md（verified）。",
        "background": "gradient"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 150, "action": "stagger_fade(items)"},
        {"frame": 600, "action": "fade_in(footnote: 代价 React 栈 + BUSL)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 5, "action": "四条约束卡片入场"},
        {"start_seconds": 20, "action": "代价脚注淡入"}
      ]
    },
    {
      "section_ref": "技术选型·Remotion vs 复制粘贴 HTML",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "✅ Remotion", "rows": ["模板复用：改一处全系列生效", "让 AI 接手：结构稳，只填数据", "长期维护：十期后还能管", "授权：BUSL（规模化要付费）"]},
        "right": {"label": "❌ 复制粘贴 HTML", "rows": ["模板复用：每期复制改，越改越乱", "让 AI 接手：结构容易跑偏", "长期维护：十期后维护困难", "授权：更宽松"]}
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 150, "action": "stagger_in(left.rows)"},
        {"frame": 450, "action": "stagger_in(right.rows)"},
        {"frame": 690, "action": "highlight(left, badge=胜出)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏入场"},
        {"start_seconds": 5, "action": "左列（Remotion）逐条入场"},
        {"start_seconds": 15, "action": "右列（复制粘贴）逐条入场"},
        {"start_seconds": 23, "action": "左侧高亮胜出"}
      ]
    },
    {
      "section_ref": "技术落地①·配置分发",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "技术落地",
        "title": "一份配置，自动分发成画面",
        "flow": "一份配置(cut/overlay) → Explainer 按 type 分发 → 现成组件",
        "items": [
          {"label": "comparison", "title": "ComparisonCard", "desc": "左右对比卡", "icon": "↔️"},
          {"label": "terminal_scene", "title": "TerminalScene", "desc": "合成终端：命令+输出逐行打出，不用真录屏", "icon": "🖥️"},
          {"label": "screenshot_scene", "title": "ScreenshotScene", "desc": "丢一张截图，脚本化叠光标/点击/打字", "icon": "🖱️"},
          {"label": "*_chart", "title": "charts/", "desc": "bar/line/pie/kpi 图表动效", "icon": "📊"},
          {"label": "ConceptScene / SplitLayout", "title": "概念图解 / 左右分屏", "desc": "概念与对照", "icon": "🧩"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 150, "action": "draw_flow(配置 → Explainer → 组件)"},
        {"frame": 450, "action": "stagger_fade(items, type→组件 连线)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 5, "action": "配置→Explainer→组件 流向动画"},
        {"start_seconds": 15, "action": "type→组件 清单逐条连线"}
      ]
    },
    {
      "section_ref": "技术落地①·配置即内容",
      "scene_template": "@TerminalScene",
      "props": {
        "title": "配置即内容：让 AI 填字段，别造组件",
        "language": "jsonc",
        "code": "// ✅ 只写配置：一个 comparison，Explainer 自动渲成对比卡\n{\n  \"type\": \"comparison\",\n  \"title\": \"传统剪辑 vs 代码即视频\",\n  \"leftLabel\": \"传统剪辑\",   \"leftValue\": \"拖时间轴，改一处全手工重排\",\n  \"rightLabel\": \"代码即视频\", \"rightValue\": \"改一行配置，重新编译出片\"\n}",
        "annotation": "TypeScript 给每个 type 的字段定好格式，AI 填错/漏填编译时立刻报错"
      },
      "duration_seconds": 20,
      "animation_cues": [
        {"frame": 0, "action": "typewriter(code)"},
        {"frame": 360, "action": "highlight_line(type=comparison)"},
        {"frame": 480, "action": "fade_in(annotation: 类型兜底，填错即报错)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "配置逐行打字"},
        {"start_seconds": 12, "action": "高亮 type 字段"},
        {"start_seconds": 16, "action": "类型兜底注解淡入"}
      ]
    },
    {
      "section_ref": "技术落地①·配置即内容",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "❌ 让 AI 从零手写 ComparisonScene.tsx", "component": "@VideoSlot", "src": "[B轨占位：IDE 录屏—AI 从零造新组件]", "note": "重复造轮子，丢掉『换数据就复用』"},
        "right": {"label": "✅ 只填数据复用现成 comparison", "component": "@VideoSlot", "src": "[B轨占位：IDE 录屏—只写一份配置喂给现成组件]", "note": "TS 字段类型兜底，AI 乱发挥空间最小"}
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 150, "action": "fade_in(left_video: 从零手写)"},
        {"frame": 450, "action": "fade_in(right_video: 只填数据)"},
        {"frame": 690, "action": "highlight(right, badge=推荐)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏入场"},
        {"start_seconds": 5, "action": "左侧『从零手写』录屏淡入"},
        {"start_seconds": 15, "action": "右侧『只填数据』录屏淡入"},
        {"start_seconds": 23, "action": "右侧高亮推荐"}
      ]
    },
    {
      "section_ref": "技术落地②·数字主持人基础版",
      "scene_template": "@ScreenshotScene",
      "props": {
        "title": "给视频配个 3D 主持人（基础版）：站得稳就行",
        "image": "[A轨占位：VRMAvatar 取景预设截图—半身/全身景别]",
        "callouts": [
          "渲染一次、按场景裁出半身/全身等景别",
          "站得稳：在大腿上反向抵消髋部摆动，让脚踩在原地（verified：本期已修，见 PR『plant VRM feet』）",
          "划清边界：只做陪衬串场，坚决不做对口型数字人 / AI 假界面"
        ]
      },
      "duration_seconds": 22,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(avatar_screenshot)"},
        {"frame": 150, "action": "callout(取景预设, 半身/全身)"},
        {"frame": 360, "action": "callout(脚踩稳, before/after 对比)"},
        {"frame": 540, "action": "callout(反对口型边界)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "主持人取景截图入场"},
        {"start_seconds": 5, "action": "取景预设标注"},
        {"start_seconds": 12, "action": "脚踩稳修复前后对比"},
        {"start_seconds": 18, "action": "反对口型边界标注"}
      ]
    },
    {
      "section_ref": "技术落地②·SSR 避坑",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "❌ 顶层读 window 打包阶段崩", "component": "@VideoSlot", "src": "[B轨占位：IDE 录屏—window.innerWidth 触发 ReferenceError]", "fallback_a_track": {"component": "@TerminalScene", "language": "tsx", "code": "// ❌ Node 端无 DOM\nconst w = window.innerWidth;\n// ReferenceError: window is not defined"}},
        "right": {"label": "✅ typeof 守卫 + MDC 规则封死", "component": "@VideoSlot", "src": "[B轨占位：IDE 录屏—加守卫后一次性通过]", "fallback_a_track": {"component": "@TerminalScene", "language": "tsx", "code": "// ✅ typeof 守卫\nconst getWidth = () =>\n  typeof window !== 'undefined'\n    ? window.innerWidth : 1920;\n// + .cursor/rules/remotion-ssr.mdc 一次写死交给 AI"}}
      },
      "duration_seconds": 35,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 180, "action": "fade_in(left_video)"},
        {"frame": 360, "action": "shake(left, intensity=3px, on=ReferenceError)"},
        {"frame": 600, "action": "fade_in(right_video)"},
        {"frame": 870, "action": "highlight(right, badge=一次通过)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏入场"},
        {"start_seconds": 6, "action": "左侧崩溃录屏淡入"},
        {"start_seconds": 12, "action": "左侧震动强调报错"},
        {"start_seconds": 20, "action": "右侧守卫+MDC 录屏淡入"},
        {"start_seconds": 29, "action": "右侧一次通过标记"}
      ]
    },
    {
      "section_ref": "技术落地②·一行出片",
      "scene_template": "@TerminalScene",
      "props": {
        "title": "出片就是一行命令，交给 AI / 终端跑",
        "language": "bash",
        "code": "cd OpenMontage/remotion-composer\nnpx remotion studio                  # 可视化调试\nnpx remotion render src/index.ts \\\n  <CompositionId> out/ep02.mp4\n\n# ℹ Rendering frames 0-1750...\n# ℹ 100% ██████████ 1750/1750\n# ✓ Video saved to out/ep02.mp4",
        "fallback_note": "B 轨终端录屏缺失时直接用本 @TerminalScene 渲染（含模拟进度）；<CompositionId> 录制前让 AI 跑一次 studio 核对（paper_spec）"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "typewriter(code)"},
        {"frame": 360, "action": "fade_in(b_track_terminal)"},
        {"frame": 540, "action": "progress_bar(render_progress, 0→100%)"},
        {"frame": 690, "action": "check(Video saved)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "命令逐行打字"},
        {"start_seconds": 12, "action": "B 轨终端录屏淡入"},
        {"start_seconds": 18, "action": "渲染进度动画"},
        {"start_seconds": 23, "action": "出片完成勾选"}
      ]
    },
    {
      "section_ref": "结尾 CTA",
      "scene_template": "@OutroScene",
      "props": {
        "headline": "三步法：找技术路径 + 技术选型 + 技术落地，没编程基础也能复制",
        "cta": "关注 · 下期 EP03 字幕匹配：Whisper 字级时间戳驱动 CaptionOverlay，让字幕踩着话音跳",
        "background": "gradient"
      },
      "duration_seconds": 15,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(headline)"},
        {"frame": 150, "action": "typewriter(cta)"},
        {"frame": 330, "action": "pulse(cta)"}
      ]
    }
  ],
  "zoom_crop_directives": [
    {
      "clip_id": "b-ide-route-pitfalls",
      "timestamp_start": "0:00",
      "timestamp_end": "0:20",
      "zoom_level": 1.3,
      "focal_point": {"x": 0.5, "y": 0.4}
    },
    {
      "clip_id": "b-ide-config-fill",
      "timestamp_start": "0:00",
      "timestamp_end": "0:15",
      "zoom_level": 1.0,
      "focal_point": {"x": 0.5, "y": 0.5}
    },
    {
      "clip_id": "b-ide-config-fill",
      "timestamp_start": "0:15",
      "timestamp_end": "0:25",
      "zoom_level": 1.4,
      "focal_point": {"x": 0.45, "y": 0.4}
    },
    {
      "clip_id": "b-ide-ssr-crash",
      "timestamp_start": "0:00",
      "timestamp_end": "0:12",
      "zoom_level": 1.5,
      "focal_point": {"x": 0.5, "y": 0.3}
    },
    {
      "clip_id": "b-ide-ssr-fix",
      "timestamp_start": "0:00",
      "timestamp_end": "0:15",
      "zoom_level": 1.4,
      "focal_point": {"x": 0.5, "y": 0.35}
    },
    {
      "clip_id": "b-term-render",
      "timestamp_start": "0:00",
      "timestamp_end": "0:12",
      "zoom_level": 1.2,
      "focal_point": {"x": 0.5, "y": 0.6}
    }
  ],
  "template_tickets": []
}
```
