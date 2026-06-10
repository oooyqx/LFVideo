---
stage: 03-video-planning-bilibili
status: approved
source_workflow: /03-video-planning-bilibili
upstream_inputs:
  - 02-plan/README.md (status: approved)
  - 02-plan/tutorial.final.md (status: approved)
  - shared/docs/remotion-spec.md
---

# ep02 B站视听编排蓝图

> **定稿标题**：《代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程》

---

## 1. 视频规格

- **平台**：Bilibili
- **画幅**：16:9（1920×1080）
- **帧率**：30fps
- **A/B 轨比例**：30/70（A 轨 Remotion 组件 / B 轨 IDE 录屏）
- **总时长预估**：约 10 分 40 秒
- **视觉模式**：`mixed`
- **核心视觉隐喻**：**数字渲染生产线**——声明式代码/数据像零件在 Frame 传送带上流过"状态映射器"，被渲染器编译成帧序列，合成 MP4。
- **反噱头纪律**：标题与正文不以"多少行代码/百倍效率"为卖点。

---

## 2. 场景分镜与组件映射

### 第一段：开头黄金钩子（0:00–0:30，30s）

> 对应 outline_sections[0]，beat_type=`statement`，visual_priority=`text`

- **组件**：`@IntroScene`
- **Props**：
  ```json
  {
    "title": "代码即视频（Video-as-Code）",
    "subtitle": "【AI 视频自动化生产线】第 2 期：渲染引擎篇",
    "background": "particles"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(background_particles, duration=30f)` — 粒子背景渐显
  - `frame=15`: `spring_scale(title, from=0.85, to=1.0)` — 主标题弹性入场
  - `frame=150` (~5s): `fade_in(subtitle, duration=20f)` — 副标题淡入
  - `frame=450` (~15s): `animate_metaphor("代码→帧传送带→MP4")` — "数字渲染生产线"隐喻动画启动
  - `frame=750` (~25s): `zoom_out_reveal(full_pipeline)` — 隐喻动画全貌展开
- **防静止**：30s 内有 5 个可见变化点（约每 6s），合规。
- **必讲要点承载**：设置整期主题钩子，为后续 VaC 概念展开做铺垫。

---

### 第二段-A：传统痛点 + Video-as-Code 三特性（0:30–1:05，35s）

> 对应 outline_sections[1] 前半，beat_type=`transformation`，visual_priority=`mixed`

- **组件**：`@ConceptScene`
- **Props**（对齐 tutorial.final.md §一）：
  ```json
  {
    "eyebrow": "核心概念：范式与痛点",
    "title": "传统剪辑 = 轨道 + 绝对时间轴 → 低 ROI 体力活",
    "items": [
      {
        "label": "VERSION",
        "title": "可版本控制",
        "desc": "视频就是文本（代码/JSON/YAML），能 diff、能 review、能 git 回滚",
        "icon": "📝"
      },
      {
        "label": "BATCH",
        "title": "可参数化批量复用",
        "desc": "同一套模板换一份数据，批量产出几十期结构一致的视频",
        "icon": "🔁"
      },
      {
        "label": "AI",
        "title": "AI 友好",
        "desc": "让 AI 拖时间轴很难，让 AI 写代码/改数据/调 CSS 是它最擅长的事",
        "icon": "🤖"
      }
    ],
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=20f)` — 标题区入场
  - `frame=450` (~15s): `stagger_fade(items, stagger=15f)` — 三特性卡片依次入场
  - `frame=600` (~20s): `highlight(items[0], glow_color="#00D26A")` — 高亮"可版本控制"
  - `frame=750` (~25s): `highlight(items[1])` — 高亮"可参数化批量复用"
  - `frame=900` (~30s): `highlight(items[2])` — 高亮"AI 友好"
- **防静止**：35s 内 5 个可见变化，约每 7s 一次，合规。
- **必讲要点承载**：
  - [x] 传统剪辑 = 轨道+绝对时间轴，低 ROI 体力活
  - [x] Video-as-Code 三特性：可版本控制 / 可参数化批量复用 / AI 友好

---

### 第二段-B：帧即状态（Frame as State）（1:05–1:30，25s）

> 对应 outline_sections[1] 中间，心智模型核心概念

- **组件**：`@ConceptScene`
- **Props**（对齐 tutorial.final.md §一 "一句话本质"）：
  ```json
  {
    "eyebrow": "一句话本质",
    "title": "帧即状态（Frame as State）",
    "items": [
      {
        "label": "INPUT",
        "title": "声明式代码/数据",
        "desc": "用代码或数据把画面描述出来",
        "icon": "📄"
      },
      {
        "label": "COMPILE",
        "title": "渲染器编译成帧",
        "desc": "给定时间点，渲染器算出该时刻画面长什么样",
        "icon": "⚙️"
      },
      {
        "label": "OUTPUT",
        "title": "合成视频",
        "desc": "帧序列合成高清 MP4，全流程可自动化",
        "icon": "🎬"
      }
    ],
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(title, duration=20f)` — "帧即状态"大字入场
  - `frame=300` (~10s): `stagger_fade(items, stagger=10f)` — 三步骤依次入场
  - `frame=600` (~20s): `connect_arrows(items, animated=true)` — 箭头依次连接三步骤
- **防静止**：25s 内 3 个可见变化，约每 10s，合规。
- **必讲要点承载**：
  - [x] 帧即状态（Frame as State）——画面是"代码/数据的函数"

---

### 第二段-C：六条技术路线（1:30–2:30，60s）

> 对应 outline_sections[1] 后半，"代码即视频 ≠ Remotion"

- **组件**：`@TableScene`
- **Props**（对齐 tutorial.final.md §一 路线表）：
  ```json
  {
    "eyebrow": "不止 Remotion",
    "title": "Video-as-Code 六条技术路线",
    "columns": ["路线", "代表项目", "描述方式", "典型场景"],
    "rows": [
      ["DOM / React 渲染", "Remotion", "React 组件 + CSS/SVG", "前端栈、复杂排版、模板复用"],
      ["TS 声明式动画", "Motion Canvas / Revideo", "生成器函数", "代码演示、时序动画"],
      ["程序化数学动画", "Manim", "Python 几何/公式", "数学/算法可视化"],
      ["像素/合成脚本", "MoviePy", "NumPy + FFmpeg", "纯 Python、简单拼接"],
      ["Canvas/游戏引擎", "PixiJS / Cocos2d", "Canvas 逐帧绘制", "粒子、游戏化动画"],
      ["命令式合成", "FFmpeg + 脚本", "filtergraph 拼接", "批量转码、字幕烧录"]
    ],
    "highlight_row": 0
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=20f)` — 标题入场
  - `frame=300` (~10s): `stagger_row(rows[0], duration=15f)` — 第 1 行（Remotion）入场并高亮
  - `frame=600` (~20s): `stagger_row(rows[1])` — 第 2 行入场
  - `frame=750` (~25s): `stagger_row(rows[2])` — 第 3 行入场
  - `frame=900` (~30s): `stagger_row(rows[3])` — 第 4 行入场
  - `frame=1050` (~35s): `stagger_row(rows[4])` — 第 5 行入场
  - `frame=1200` (~40s): `stagger_row(rows[5])` — 第 6 行入场
  - `frame=1500` (~50s): `highlight_summary("共享同一内核：代码/数据描述 → 编译成帧 → 合成视频")` — 总结高亮
- **防静止**：60s 内 8 个可见变化，约每 7-8s，合规。
- **必讲要点承载**：
  - [x] "代码即视频 ≠ Remotion"：它是一类范式，至少 6 条技术路线

---

### 第三段-A：判断层矩阵（2:30–3:50，80s）

> 对应 outline_sections[2] 前半，beat_type=`comparison`，visual_priority=`chart`

- **组件**：`@TableScene`
- **Props**（对齐 tutorial.final.md §二 矩阵）：
  ```json
  {
    "eyebrow": "判断层 = 边界，非中立百科",
    "title": "六个方案的适用/不适用/已知坑",
    "columns": ["方案", "适用场景", "不适用场景", "已知坑"],
    "rows": [
      ["Remotion", "前端栈、复杂 CSS/SVG、跨期模板复用", "零前端基础、纯后台超长批处理", "顶层读 window/document 崩溃；BUSL 授权"],
      ["Motion Canvas / Revideo", "代码演示、精确时序编排", "复杂 Flex/Grid 排版", "生态较小，模板需自建"],
      ["Manim", "数学/算法/公式可视化", "一般 UI、网页排版、录屏混排", "学习曲线陡、排版弱、渲染慢"],
      ["MoviePy", "纯 Python、简单拼接/裁剪", "弹性排版、复杂文字动效", "文本布局繁琐、多层内存大"],
      ["PixiJS / Cocos2d", "游戏类复杂粒子动画", "标准网页 UI、文本对齐", "文本换行与 DOM 对齐复杂"],
      ["FFmpeg + 脚本", "批量转码、轻量字幕烧录", "复杂动效、交互式排版", "filtergraph 晦涩、调试困难"]
    ],
    "highlight_row": 0,
    "summary_text": "本项目主线：Remotion（A 轨成片）+ MoviePy/FFmpeg（B 轨拼接闪避）"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=20f)`
  - `frame=300` (~10s): `stagger_row(rows[0], highlight=true)` — Remotion 行入场高亮
  - `frame=600` (~20s): `stagger_row(rows[1])` — Motion Canvas 行
  - `frame=750` (~25s): `stagger_row(rows[2])` — Manim 行
  - `frame=1050` (~35s): `stagger_row(rows[3])` — MoviePy 行
  - `frame=1200` (~40s): `stagger_row(rows[4])` — PixiJS 行
  - `frame=1350` (~45s): `stagger_row(rows[5])` — FFmpeg 行
  - `frame=1650` (~55s): `highlight(rows[0]+rows[3]+rows[5], annotation="本项目主线")` — 对号入座高亮
  - `frame=2100` (~70s): `fade_in(summary_text)` — 总结"Remotion(A轨)+MoviePy/FFmpeg(B轨)"
- **防静止**：80s 内 9 个可见变化，约每 9s，合规。
- **必讲要点承载**：
  - [x] 判断层 = 边界（适用/不适用/已知坑），非中立百科
  - [x] 6 方案矩阵
  - [x] "怎么对号入座"：本项目主线 = Remotion(A轨) + MoviePy/FFmpeg(B轨)

---

### 第三段-B：Remotion 胜出四理由（3:50–4:30，40s）

> 对应 outline_sections[2] 中段（tutorial.final.md §三 四理由）

- **组件**：`@ConceptScene`
- **Props**（对齐 tutorial.final.md §三，四理由合并为三卡片）：
  ```json
  {
    "eyebrow": "核心约束：固定模板 + AI 接管 + 跨期可维护",
    "title": "为什么选 Remotion？",
    "items": [
      {
        "label": "DECISIVE",
        "title": "数据驱动模板，类型安全跨期复用",
        "desc": "data.ts → Episode.tsx → template/ 四层结构，TS 保证换数据时格式不出错，改一处主题全期生效",
        "icon": "🏗️"
      },
      {
        "label": "AI+CLI",
        "title": "AI Agent 友好 + CLI 原生自动化",
        "desc": "AI 只填数据+微调 CSS，幻觉最小；npx remotion render 纯命令行可 subprocess",
        "icon": "🤖"
      },
      {
        "label": "WEB",
        "title": "网页生态红利",
        "desc": "完整 CSS/SVG/Flexbox/动效库随手可用，信息密度与排版自由度远超像素/Canvas 方案",
        "icon": "🌐"
      }
    ],
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow, duration=15f)` — "核心约束"字幕入场
  - `frame=150` (~5s): `spring_scale(title)` — "为什么选 Remotion"弹入
  - `frame=450` (~15s): `stagger_fade(items, stagger=15f)` — 三卡片依次入场
  - `frame=750` (~25s): `highlight(items[0], badge="决定性")` — 强调"数据驱动模板"
  - `frame=1050` (~35s): `pulse(items[1]+items[2])` — 脉冲强调后两项
- **防静止**：40s 内 5 个可见变化，约每 8s，合规。
- **必讲要点承载**：
  - [x] 选型回到核心约束：固定模板 + 内容批量替换 + AI 端到端接管 + 跨期可维护
  - [x] Remotion 胜出四理由：数据驱动模板(决定性)/AI友好/CLI原生/网页生态

---

### 第三段-C：Remotion ✅ vs HyperFrames ❌ 对照（4:30–5:05，35s）

> 对应 outline_sections[2] 对照表

- **组件**：`@SplitLayout` + `@ComparisonCard`
- **Props**（对齐 tutorial.final.md §三 对照表）：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "component": "@ComparisonCard",
      "props": {
        "title": "Remotion ✅",
        "points": [
          "模板复用/类型安全：TS 约束、跨期安全",
          "AI 友好度：结构稳定、AI 只填数据",
          "长期维护：改一处全期生效"
        ],
        "status": "success"
      }
    },
    "right": {
      "component": "@ComparisonCard",
      "props": {
        "title": "HyperFrames ❌",
        "points": [
          "HTML 无类型检查",
          "直接写 HTML，结构易漂移",
          "10 期后维护困难"
        ],
        "status": "error"
      }
    }
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `wipe_reveal(split_layout, direction="center-out", duration=20f)` — 分屏展开
  - `frame=300` (~10s): `stagger_fade(left.points, stagger=10f)` — 左侧逐条入场
  - `frame=600` (~20s): `stagger_fade(right.points, stagger=10f)` — 右侧逐条入场
  - `frame=900` (~30s): `scale_up(left, factor=1.03)` — 左侧（胜出方）微放大强调
- **防静止**：35s 内 4 个可见变化，约每 9s，合规。
- **必讲要点承载**：
  - [x] `Remotion ✅ vs HyperFrames ❌` 对照（类型安全/维护/授权）

---

### 第三段-D：选型代价（5:05–5:30，25s）

> 对应 outline_sections[2] 尾段（tutorial.final.md §三 "选型代价"）

- **组件**：`@ConceptScene`
- **Props**（对齐 tutorial.final.md §三 代价段）：
  ```json
  {
    "eyebrow": "如实交代",
    "title": "选型代价（都能兜住）",
    "items": [
      {
        "label": "REACT",
        "title": "基于 React 技术栈",
        "desc": "不用担心——本项目让 AI 写组件、填数据，人只把控架构与内容取舍",
        "icon": "⚛️"
      },
      {
        "label": "BUSL",
        "title": "BUSL 商业授权",
        "desc": "规模化商用需付费，当前规模无影响",
        "icon": "📜"
      },
      {
        "label": "SSR",
        "title": "SSR 环境约束",
        "desc": "Node 端求值读 window 会崩——用一条 MDC 规则交给 AI 自动规避，落地见 §五",
        "icon": "🛡️"
      }
    ],
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=15f)` — 标题入场
  - `frame=300` (~10s): `stagger_fade(items, stagger=10f)` — 三项代价卡片入场
  - `frame=600` (~20s): `badge_overlay(items, text="AI 兜住", color="green")` — 覆盖"AI 兜住"标记
- **防静止**：25s 内 3 个可见变化，约每 10s，合规。
- **必讲要点承载**：
  - [x] 选型代价：BUSL 授权 + SSR 环境约束（都交给 AI/规则兜住，前端基础不是门槛）

---

### 第四段-A：七阶段流水线（5:30–6:10，40s）

> 对应 outline_sections[3]，beat_type=`transformation`，visual_priority=`code`

- **组件**：`@TimelineScene`
- **Props**（对齐 tutorial.final.md §四 七阶段表）：
  ```json
  {
    "eyebrow": "流程即代码（Process-as-Code）",
    "title": "七阶段流水线（01 → 07）",
    "stages": [
      {"id": "01", "label": "选题分析", "role": "选题分析师", "status": "approved"},
      {"id": "02", "label": "内容策划", "role": "内容策划师", "status": "approved"},
      {"id": "03", "label": "B站视听策划", "role": "视觉策划师", "status": "current"},
      {"id": "04", "label": "脚本撰写", "role": "文案撰稿人", "status": "pending"},
      {"id": "05", "label": "视频组装", "role": "视频工程师", "status": "pending"},
      {"id": "06", "label": "分发适配", "role": "分发助手", "status": "pending"},
      {"id": "07", "label": "资源归档", "role": "归档", "status": "pending"}
    ]
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=15f)` — 标题入场
  - `frame=300` (~10s): `point_light(stages[0], glow=true)` — "01 选题"点亮
  - `frame=450` (~15s): `point_light(stages[1])` — "02 策划"点亮
  - `frame=600` (~20s): `point_light(stages[2], highlight="current")` — "03 视听"高亮为当前
  - `frame=750` (~25s): `rapid_sequence(stages[3..6])` — 04–07 快速依次点亮
  - `frame=1050` (~35s): `zoom_out(full_pipeline, show_connections=true)` — 全貌展示流水线连接
- **防静止**：40s 内 6 个可见变化，约每 7s，合规。
- **必讲要点承载**：
  - [x] 七阶段流水线（01→07）映射

---

### 第四段-B：三件套（6:10–6:35，25s）

> 对应 tutorial.final.md §四.1 三件套表

- **组件**：`@ConceptScene`
- **Props**（对齐 tutorial.final.md §四.1）：
  ```json
  {
    "eyebrow": "三件套",
    "title": "角色 × 工作流 × 状态机",
    "items": [
      {
        "label": "ROLE",
        "title": "角色 = system_prompt",
        "desc": "思考视角与边界（shared/roles/）",
        "icon": "🎭"
      },
      {
        "label": "WORKFLOW",
        "title": "工作流 = user_prompt",
        "desc": "每阶段标准步骤（.windsurf/workflows/01→07）",
        "icon": "📋"
      },
      {
        "label": "STATE",
        "title": "frontmatter = 状态机",
        "desc": "文件即数据的唯一进度真相源（stage/status + PIPELINE.md）",
        "icon": "🔄"
      }
    ],
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(eyebrow+title, duration=15f)` — 标题入场
  - `frame=300` (~10s): `stagger_fade(items, stagger=10f)` — 三件套卡片依次入场
  - `frame=600` (~20s): `connect_arrows(items, bidirectional=false)` — 箭头连接三件套
- **防静止**：25s 内 3 个可见变化，约每 10s，合规。
- **必讲要点承载**：
  - [x] 三件套：角色=system_prompt / 工作流=user_prompt / frontmatter=状态机

---

### 第四段-C：编排器伪代码（6:35–7:10，35s）

> 对应 tutorial.final.md §四.3 编排器伪代码

- **组件**：`@TerminalScene`
- **Props**（对齐 tutorial.final.md §四 编排器代码）：
  ```json
  {
    "title": "python-frontmatter 最小编排器",
    "language": "python",
    "code": "import frontmatter, glob\n\nfor path in glob.glob(\"content-library/**/README.md\", recursive=True):\n    post = frontmatter.load(path)\n    if post.get(\"status\") == \"approved\":\n        stage = post[\"stage\"]\n        role = load_role(stage)       # 角色 = system_prompt\n        steps = load_workflow(stage)  # 工作流 = user_prompt\n        run_agent(system=role, user=steps)"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `typewriter(code, speed=3chars/frame)` — 代码逐行打字入场
  - `frame=300` (~10s): `highlight_line(line=5, annotation="状态机读到'已确认'")` — 高亮 if 条件行
  - `frame=600` (~20s): `highlight_line(line=7, annotation="角色 = system_prompt")` — 高亮 role 行
  - `frame=900` (~30s): `highlight_line(line=8, annotation="喂给 LLM 自动推进")` — 高亮 run_agent 行
- **防静止**：35s 内 4 个可见变化，约每 9s，合规。
- **必讲要点承载**：
  - [x] `python-frontmatter` 最小编排器伪代码（如何端到端驱动）

---

### 第四段-D：A 轨 vs B 轨 + 提示词链（7:10–8:00，50s）

> 对应 tutorial.final.md §四.4 多模态限制 + §四.4 提示词链

- **组件**：`@SplitLayout`
- **Props**（对齐 tutorial.final.md §四 A/B 轨描述）：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "label": "A 轨（可全自动）",
      "content_type": "text_card",
      "text": "概念动画由 Remotion 组件渲染\nAI 端到端生成数据 + 套模板\n无需人工干预"
    },
    "right": {
      "label": "B 轨（须真人录屏）",
      "content_type": "text_card",
      "text": "真实 IDE 录屏\nTAD-01 强制真人录制\n设计「挂起等待」机制"
    }
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `wipe_reveal(split_layout, direction="center-out")` — 分屏展开
  - `frame=300` (~10s): `highlight(left, badge="全自动", color="green")` — A 轨高亮
  - `frame=600` (~20s): `highlight(right, badge="真人录制", color="orange")` — B 轨高亮
  - `frame=900` (~30s): `transition_to(terminal_scene)` — 切换到提示词链展示
  - `frame=1050` (~35s): `typewriter(prompt_1, "基于 @ComparisonCard 组件，生成对比数据配置…")` — Prompt-1 入场
  - `frame=1350` (~45s): `typewriter(prompt_2, "为 .cursor/rules/ 编写 MDC 规则约束…")` — Prompt-2 入场
- **防静止**：50s 内 6 个可见变化，约每 8s，合规。
- **必讲要点承载**：
  - [x] A 轨可全自动、B 轨须真人录屏 → "挂起等待"机制
  - [x] 本期可复现的提示词链（数据驱动 @ComparisonCard + MDC 守卫规则）

---

### 第五段-A：数据驱动 vs 从零手写（8:00–8:55，55s）

> 对应 outline_sections[4]，beat_type=`demonstration`，visual_priority=`code`

- **组件**：`@SplitLayout`
- **Props（B 轨优先 / A 轨兜底）**（对齐 tutorial.final.md §五.1 代码对比）：
  **B 轨版（IDE 录屏可用时）**：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "label": "❌ 从零手写 ComparisonScene.tsx",
      "component": "@VideoSlot",
      "video_props": {
        "src": "[B 轨占位：IDE 录屏 — AI 从零手写组件的反面演示]",
        "position": "fill"
      }
    },
    "right": {
      "label": "✅ 只传数据，复用 @ComparisonCard",
      "component": "@VideoSlot",
      "video_props": {
        "src": "[B 轨占位：IDE 录屏 — 只写 data 喂入 @ComparisonCard]",
        "position": "fill"
      }
    }
  }
  ```
  **A 轨兜底版（B 轨录屏缺失时）**：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "label": "❌ 从零手写",
      "component": "@TerminalScene",
      "props": {
        "title": "反面：为这期从零手写组件",
        "language": "tsx",
        "code": "// ❌ 反面示例\n// 违反「固定模板 + 内容替换」\nexport const ComparisonScene: React.FC = () => {\n  // 从零手写布局、样式、动画…\n  // 忽略仓库现成的 @ComparisonCard\n  return <div className=\"custom-layout\">...</div>;\n};"
      }
    },
    "right": {
      "label": "✅ 数据驱动",
      "component": "@TerminalScene",
      "props": {
        "title": "正确：只传数据复用 @ComparisonCard",
        "language": "tsx",
        "code": "// ✅ 正确示例\nconst comparison = {\n  left:  { title: 'MoviePy', points: ['纯 Python', '简单拼接'], status: 'error' },\n  right: { title: 'Remotion', points: ['TS 类型安全', '模板复用'], status: 'success' },\n};\n// <ComparisonCard {...comparison} />"
      }
    }
  }
  ```
- **B 轨指令**：
  ```json
  {
    "clip_id": "b-ide-data-driven",
    "description": "IDE 录屏：演示数据驱动复用 @ComparisonCard（右侧 ✅ 正确示范）",
    "zoom_crop_directives": [
      {
        "timestamp_start": "0:00",
        "timestamp_end": "0:15",
        "zoom_level": 1.0,
        "focal_point": {"x": 0.5, "y": 0.5},
        "description": "全貌：打开 data 配置文件"
      },
      {
        "timestamp_start": "0:15",
        "timestamp_end": "0:30",
        "zoom_level": 1.3,
        "focal_point": {"x": 0.4, "y": 0.4},
        "description": "聚焦：data 对象 left/right 结构"
      },
      {
        "timestamp_start": "0:30",
        "timestamp_end": "0:45",
        "zoom_level": 1.2,
        "focal_point": {"x": 0.5, "y": 0.6},
        "description": "展示：<ComparisonCard {...comparison} /> 渲染结果"
      }
    ]
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `wipe_reveal(split_layout, direction="left-to-right")` — 分屏入场
  - `frame=300` (~10s): `fade_in(left.label, color="#FF4444")` — 左侧红标 ❌
  - `frame=450` (~15s): `fade_in(right.label, color="#00D26A")` — 右侧绿标 ✅
  - `frame=750` (~25s): `fade_in(b_track_video)` — B 轨录屏淡入
  - `frame=1200` (~40s): `highlight_code(right, line="const comparison = {...}")` — 高亮数据结构
  - `frame=1500` (~50s): `scale_up(right, factor=1.03)` — 正确方放大强调
- **防静止**：55s 内 6 个可见变化，约每 9s，合规。
- **必讲要点承载**：
  - [x] 首选数据驱动现成组件：`@ComparisonCard` 传数据 ✅ vs 从零手写 ❌

---

### 第五段-B：SSR 守卫避坑（8:55–9:45，50s）

> 对应 tutorial.final.md §五.2 SSR 守卫

- **组件**：`@SplitLayout`
- **Props（B 轨优先 / A 轨兜底）**（对齐 tutorial.final.md §五.2 代码对比）：
  **B 轨版（IDE 录屏可用时）**：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "label": "❌ 顶层读 window 崩溃",
      "component": "@VideoSlot",
      "video_props": {
        "src": "[B 轨占位：IDE 录屏 — window.innerWidth 触发 ReferenceError]",
        "position": "fill"
      }
    },
    "right": {
      "label": "✅ typeof window 守卫 + MDC 规则封死",
      "component": "@VideoSlot",
      "video_props": {
        "src": "[B 轨占位：IDE 录屏 — 加入守卫后一次性通过]",
        "position": "fill"
      }
    }
  }
  ```
  **A 轨兜底版（B 轨录屏缺失时）**：
  ```json
  {
    "direction": "horizontal",
    "ratio": 0.5,
    "left": {
      "label": "❌ 顶层读 window 崩溃",
      "component": "@TerminalScene",
      "props": {
        "title": "ReferenceError: window is not defined",
        "language": "tsx",
        "code": "// ❌ Node 端无 DOM 环境\n// Remotion SSR 截图时组件在 Node.js 执行\nconst w = window.innerWidth;  // 💥 崩溃\n\n// 终端输出：\n// ReferenceError: window is not defined\n// npx remotion render → 红屏"
      }
    },
    "right": {
      "label": "✅ typeof window 守卫",
      "component": "@TerminalScene",
      "props": {
        "title": "typeof window 守卫 + MDC 规则",
        "language": "tsx",
        "code": "// ✅ 类型安全守卫\nconst getWidth = () =>\n  typeof window !== 'undefined'\n    ? window.innerWidth\n    : 1920;  // SSR 时用默认值\n\n// .cursor/rules/remotion-ssr.mdc:\n// \"任何 Remotion 组件不得在顶层读 window/document\""
      }
    }
  }
  ```
- **B 轨指令**：
  ```json
  {
    "clip_id": "b-ide-ssr-guard",
    "description": "IDE 录屏：SSR window 崩溃 → typeof 守卫 → .cursor/rules/remotion-ssr.mdc 写入",
    "zoom_crop_directives": [
      {
        "timestamp_start": "0:00",
        "timestamp_end": "0:10",
        "zoom_level": 1.0,
        "focal_point": {"x": 0.5, "y": 0.5},
        "description": "展示：含 window.innerWidth 的组件代码"
      },
      {
        "timestamp_start": "0:10",
        "timestamp_end": "0:20",
        "zoom_level": 1.4,
        "focal_point": {"x": 0.5, "y": 0.7},
        "description": "聚焦终端：npx remotion render → ReferenceError 红屏"
      },
      {
        "timestamp_start": "0:20",
        "timestamp_end": "0:30",
        "zoom_level": 1.3,
        "focal_point": {"x": 0.3, "y": 0.3},
        "description": "聚焦代码：改为 typeof window !== 'undefined' 守卫"
      },
      {
        "timestamp_start": "0:30",
        "timestamp_end": "0:40",
        "zoom_level": 1.2,
        "focal_point": {"x": 0.5, "y": 0.4},
        "description": "展示 .cursor/rules/remotion-ssr.mdc 文件内容"
      }
    ]
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `wipe_reveal(split_layout)` — 分屏入场
  - `frame=300` (~10s): `fade_in(left_video)` — 左侧崩溃录屏淡入
  - `frame=600` (~20s): `shake(left, intensity=3px)` — 左侧震动强调错误
  - `frame=900` (~30s): `fade_in(right_video)` — 右侧修复录屏淡入
  - `frame=1200` (~40s): `highlight(right, badge="一次通过", color="green")` — 修复标记
- **防静止**：50s 内 5 个可见变化，约每 10s，合规。
- **必讲要点承载**：
  - [x] SSR 守卫：顶层读 `window` ❌ vs `typeof window !== 'undefined'` 守卫 ✅（交给规则/AI 自动带）

---

### 第五段-C：交给 AI + render 出片（9:45–10:30，45s）

> 对应 tutorial.final.md §五.3 交给 AI 做好

- **组件**：`@ConceptScene`（前半）→ `@TerminalScene`（后半）
- **Props（前半 @ConceptScene）**（对齐 tutorial.final.md §五.3）：
  ```json
  {
    "eyebrow": "这一步怎么交给 AI 做好",
    "title": "人把控架构，AI 干活",
    "items": [
      {
        "label": "DATA",
        "title": "AI 填数据、套现成组件",
        "desc": "人给出每段要展示什么，AI 按范式产出 data，复用 @ComparisonCard/charts/ 等",
        "icon": "📊"
      },
      {
        "label": "RULE",
        "title": "用规则替 AI 兜底边界",
        "desc": "SSR 守卫写进 .cursor/rules/remotion-ssr.mdc，AI 生成组件时自动带",
        "icon": "🛡️"
      },
      {
        "label": "RUN",
        "title": "渲染命令交给 AI/脚本代跑",
        "desc": "npx remotion render — 纯命令行，可 CI，人只看产物",
        "icon": "▶️"
      }
    ],
    "background": "gradient"
  }
  ```
- **Props（后半 @TerminalScene — A 轨渲染，同时也是 B 轨缺失时的兜底）**：
  ```json
  {
    "title": "npx remotion render 出片",
    "language": "bash",
    "code": "cd OpenMontage/remotion-composer\nnpx remotion studio                  # 可视化调试\nnpx remotion render src/index.ts \\\n  <CompositionId> out/ep02.mp4       # 渲染出片\n\n# 输出：\n# ℹ Rendering frames 0-1350...\n# ℹ 100% ██████████ 1350/1350 frames\n# ✓ Video saved to out/ep02.mp4 (10:45, 30fps)"
  }
  ```
  > **A 轨兜底说明**：当 B 轨终端录屏 (`b-terminal-render`) 缺失时，直接使用上述 `@TerminalScene` 渲染，含模拟进度输出；`animation_cues` 中的 `progress_bar` 动画提供视觉节奏。
- **B 轨指令（有录屏时优先使用）**：
  ```json
  {
    "clip_id": "b-terminal-render",
    "description": "终端录屏：npx remotion render 执行并输出 MP4",
    "zoom_crop_directives": [
      {
        "timestamp_start": "0:00",
        "timestamp_end": "0:10",
        "zoom_level": 1.0,
        "focal_point": {"x": 0.5, "y": 0.5},
        "description": "输入命令 npx remotion render"
      },
      {
        "timestamp_start": "0:10",
        "timestamp_end": "0:20",
        "zoom_level": 1.3,
        "focal_point": {"x": 0.5, "y": 0.6},
        "description": "聚焦渲染进度条和帧计数"
      }
    ]
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(concept_scene)` — 概念卡片入场
  - `frame=300` (~10s): `stagger_fade(items, stagger=10f)` — 三步骤卡片入场
  - `frame=600` (~20s): `transition_to(terminal_scene)` — 切换到终端
  - `frame=750` (~25s): `typewriter(code, speed=2chars/frame)` — 命令逐行打字
  - `frame=1050` (~35s): `fade_in(b_track_video)` — B 轨终端录屏淡入
  - `frame=1200` (~40s): `progress_bar(0→100%, duration=5s)` — 渲染进度动画
- **防静止**：45s 内 6 个可见变化，约每 7s，合规。
- **必讲要点承载**：
  - [x] 这一步怎么交给 AI 做好：填数据 / 套现成组件 / 命令代跑

---

### 第六段：结尾 CTA（10:30–10:45，15s）

> 对应 outline_sections[5]，beat_type=`conclusion`，visual_priority=`text`

- **组件**：`@OutroScene`
- **Props**（对齐 tutorial.final.md §六 总结）：
  ```json
  {
    "headline": "代码即视频 + 流程即代码 = 把内容生产做成可维护的工程流水线",
    "cta": "关注 · 下期解密 Whisper 毫秒级字幕与卡点",
    "background": "gradient"
  }
  ```
- **动画 Cue 表**：
  - `frame=0`: `fade_in(headline, duration=15f)` — 总结文案入场
  - `frame=150` (~5s): `typewriter(cta, speed=2f/char)` — CTA 打字机效果
  - `frame=300` (~10s): `pulse(cta, color="#00D26A")` — CTA 脉冲强调
- **防静止**：15s 内 3 个可见变化，约每 5s，合规。
- **必讲要点承载**：
  - [x] 代码即视频 + 流程即代码 = 把内容生产做成工程流水线
  - [x] 关注引导 + 下期预告（Whisper 毫秒级字幕/卡点）

---

## 3. 组件扩展工单 (Template Tickets)

**无新组件工单**。本期所有场景均可由现有组件库覆盖（参见 `remotion-spec.md` §1.9 对照表）：

| 使用的组件 | 实际位置 | 使用场景 |
|:---|:---|:---|
| `@IntroScene` | `custom-templates/scenes/IntroScene` | S1 开场 |
| `@OutroScene` | `custom-templates/scenes/OutroScene` | S6 结尾 CTA |
| `@ConceptScene` | `custom-templates/scenes/ConceptScene` | S2a/S2b/S3b/S3d/S4b/S5c 概念卡片 |
| `@TableScene` | `custom-templates/scenes/TableScene` | S2c/S3a 对照表/矩阵 |
| `@TimelineScene` | `custom-templates/scenes/TimelineScene` | S4a 七阶段流水线 |
| `@SplitLayout` | `custom-templates/primitives/SplitLayout` | S3c/S4d/S5a/S5b 左右分屏 |
| `@ComparisonCard` | `components/ComparisonCard` | S3c Remotion vs HyperFrames |
| `@TerminalScene` | `components/TerminalScene` | S4c/S5c 代码/命令展示 |
| `@VideoSlot` | `custom-templates/primitives/VideoSlot` | S5a/S5b B 轨录屏嵌入 |

---

## 4. 必讲要点覆盖度自检

> 逐条核对 `tutorial.final.md` 末尾「必讲要点覆盖清单」，确认每个要点都有对应 scene/组件承载。

### 一、范式与痛点 → 第二段（S2a/S2b/S2c）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 传统剪辑 = 轨道+绝对时间轴，低 ROI 体力活 | S2a `@ConceptScene` eyebrow+title | ✅ |
| Video-as-Code 三特性：可版本控制 / 可参数化批量复用 / AI 友好 | S2a `@ConceptScene` 三卡片 | ✅ |
| 一句话本质：**帧即状态（Frame as State）** | S2b `@ConceptScene` 专场 | ✅ |
| "代码即视频 ≠ Remotion"：至少 6 条技术路线 | S2c `@TableScene` 六行表 | ✅ |

### 二、判断层矩阵 → 第三段（S3a）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 判断层 = 边界（适用/不适用/已知坑），非中立百科 | S3a `@TableScene` eyebrow | ✅ |
| 6 方案矩阵 | S3a `@TableScene` 六行 | ✅ |
| "怎么对号入座"：本项目主线 = Remotion(A轨) + MoviePy/FFmpeg(B轨) | S3a `@TableScene` highlight + summary | ✅ |

### 三、选型理由 → 第三段（S3b/S3c/S3d）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 核心约束：固定模板 + 内容批量替换 + AI 端到端接管 + 跨期可维护 | S3b `@ConceptScene` eyebrow | ✅ |
| Remotion 胜出四理由 | S3b `@ConceptScene` 三卡片（合并展示） | ✅ |
| `Remotion ✅ vs HyperFrames ❌` 对照 | S3c `@SplitLayout(@ComparisonCard)` | ✅ |
| 选型代价：BUSL 授权 + SSR 环境约束 | S3d `@ConceptScene` 三卡片 | ✅ |

### 四、流程即代码（Dogfooding）→ 第四段（S4a/S4b/S4c/S4d）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 三件套：角色=system_prompt / 工作流=user_prompt / frontmatter=状态机 | S4b `@ConceptScene` 三卡片 | ✅ |
| 七阶段流水线（01→07）映射 | S4a `@TimelineScene` | ✅ |
| `python-frontmatter` 最小编排器伪代码 | S4c `@TerminalScene` | ✅ |
| A 轨可全自动、B 轨须真人录屏 → "挂起等待"机制 | S4d `@SplitLayout` | ✅ |
| 本期可复现的提示词链 | S4d 后半提示词展示 | ✅ |

### 五、核心实操与避坑 → 第五段（S5a/S5b/S5c）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 首选数据驱动 @ComparisonCard ✅ vs 从零手写 ❌ | S5a `@SplitLayout` | ✅ |
| SSR 守卫：顶层读 `window` ❌ vs `typeof window` 守卫 ✅ | S5b `@SplitLayout` + B-track | ✅ |
| 交给 AI 做好：填数据 / 套组件 / 命令代跑 | S5c `@ConceptScene` + `@TerminalScene` | ✅ |

### 结尾 CTA → 第六段（S6）

| 要点 | 承载场景 | 状态 |
|:---|:---|:---|
| 代码即视频 + 流程即代码 = 工程流水线 | S6 `@OutroScene` headline | ✅ |
| 关注引导 + 下期预告（Whisper 毫秒级字幕/卡点） | S6 `@OutroScene` cta | ✅ |

**覆盖结果：21/21 要点全部有对应 scene/组件承载，无遗漏。**

---

## 5. 结构化校验块 (JSON Schema Block)

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
      "section_ref": "开头黄金钩子",
      "scene_template": "@IntroScene",
      "props": {
        "title": "代码即视频（Video-as-Code）",
        "subtitle": "【AI 视频自动化生产线】第 2 期：渲染引擎篇",
        "background": "particles"
      },
      "duration_seconds": 30,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(background_particles)"},
        {"frame": 15, "action": "spring_scale(title)"},
        {"frame": 150, "action": "fade_in(subtitle)"},
        {"frame": 450, "action": "animate_metaphor(代码→帧传送带→MP4)"},
        {"frame": 750, "action": "zoom_out_reveal(full_pipeline)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题弹性入场 + 粒子背景渐显"},
        {"start_seconds": 15, "action": "数字渲染生产线隐喻动画启动（代码→帧传送带→MP4）"}
      ]
    },
    {
      "section_ref": "范式本质·帧即状态·不止 React",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "核心概念：范式与痛点",
        "title": "传统剪辑 = 轨道 + 绝对时间轴 → 低 ROI 体力活",
        "items": [
          {"label": "VERSION", "title": "可版本控制", "desc": "视频就是文本，能 diff、能 review、能 git 回滚", "icon": "📝"},
          {"label": "BATCH", "title": "可参数化批量复用", "desc": "同一套模板换一份数据，批量产出几十期", "icon": "🔁"},
          {"label": "AI", "title": "AI 友好", "desc": "让 AI 写代码/改数据/调 CSS 是它最擅长的事", "icon": "🤖"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 35,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 450, "action": "stagger_fade(items, stagger=15f)"},
        {"frame": 600, "action": "highlight(items[0])"},
        {"frame": 750, "action": "highlight(items[1])"},
        {"frame": 900, "action": "highlight(items[2])"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题区入场：传统剪辑痛点"},
        {"start_seconds": 15, "action": "三特性卡片依次入场"},
        {"start_seconds": 25, "action": "逐卡片高亮强调"}
      ]
    },
    {
      "section_ref": "范式本质·帧即状态·不止 React",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "一句话本质",
        "title": "帧即状态（Frame as State）",
        "items": [
          {"label": "INPUT", "title": "声明式代码/数据", "desc": "用代码或数据把画面描述出来", "icon": "📄"},
          {"label": "COMPILE", "title": "渲染器编译成帧", "desc": "给定时间点，渲染器算出该时刻画面", "icon": "⚙️"},
          {"label": "OUTPUT", "title": "合成视频", "desc": "帧序列合成 MP4，全流程可自动化", "icon": "🎬"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(title)"},
        {"frame": 300, "action": "stagger_fade(items, stagger=10f)"},
        {"frame": 600, "action": "connect_arrows(items)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "帧即状态大字入场"},
        {"start_seconds": 10, "action": "三步骤卡片入场 + 箭头连接"}
      ]
    },
    {
      "section_ref": "范式本质·帧即状态·不止 React",
      "scene_template": "@TableScene",
      "props": {
        "eyebrow": "不止 Remotion",
        "title": "Video-as-Code 六条技术路线",
        "columns": ["路线", "代表项目", "描述方式", "典型场景"],
        "rows": [
          ["DOM/React 渲染", "Remotion", "React 组件+CSS/SVG", "前端栈、复杂排版"],
          ["TS 声明式动画", "Motion Canvas / Revideo", "生成器函数", "代码演示、时序动画"],
          ["程序化数学动画", "Manim", "Python 几何/公式", "数学/算法可视化"],
          ["像素/合成脚本", "MoviePy", "NumPy+FFmpeg", "简单拼接、音轨闪避"],
          ["Canvas/游戏引擎", "PixiJS / Cocos2d", "Canvas 逐帧绘制", "粒子、游戏化动画"],
          ["命令式合成", "FFmpeg+脚本", "filtergraph", "批量转码、字幕烧录"]
        ],
        "highlight_row": 0
      },
      "duration_seconds": 60,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 300, "action": "stagger_row(rows[0], highlight=true)"},
        {"frame": 600, "action": "stagger_row(rows[1])"},
        {"frame": 750, "action": "stagger_row(rows[2])"},
        {"frame": 900, "action": "stagger_row(rows[3])"},
        {"frame": 1050, "action": "stagger_row(rows[4])"},
        {"frame": 1200, "action": "stagger_row(rows[5])"},
        {"frame": 1500, "action": "highlight_summary(共享内核：代码描述→编译成帧→合成视频)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 10, "action": "Remotion 行入场高亮"},
        {"start_seconds": 20, "action": "Motion Canvas / Manim 行入场"},
        {"start_seconds": 30, "action": "MoviePy / PixiJS 行入场"},
        {"start_seconds": 40, "action": "FFmpeg 行入场"},
        {"start_seconds": 50, "action": "总结高亮：共享同一内核"}
      ]
    },
    {
      "section_ref": "判断层矩阵与选型理由",
      "scene_template": "@TableScene",
      "props": {
        "eyebrow": "判断层 = 边界，非中立百科",
        "title": "六个方案的适用/不适用/已知坑",
        "columns": ["方案", "适用场景", "不适用场景", "已知坑"],
        "rows": [
          ["Remotion", "前端栈、复杂CSS/SVG、跨期模板复用", "零前端基础、纯后台批处理", "顶层读window崩溃；BUSL授权"],
          ["Motion Canvas", "代码演示、精确时序编排", "复杂Flex/Grid排版", "生态较小，模板需自建"],
          ["Manim", "数学/算法/公式可视化", "一般UI、网页排版", "学习曲线陡、渲染慢"],
          ["MoviePy", "纯Python、简单拼接/裁剪", "弹性排版、复杂文字动效", "文本布局繁琐、内存大"],
          ["PixiJS / Cocos2d", "游戏类粒子动画", "标准网页UI", "文本换行计算复杂"],
          ["FFmpeg+脚本", "批量转码、轻量字幕", "复杂动效、交互排版", "filtergraph晦涩"]
        ],
        "highlight_row": 0,
        "summary_text": "本项目主线：Remotion(A轨) + MoviePy/FFmpeg(B轨)"
      },
      "duration_seconds": 80,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 300, "action": "stagger_row(rows[0], highlight=true)"},
        {"frame": 600, "action": "stagger_row(rows[1])"},
        {"frame": 750, "action": "stagger_row(rows[2])"},
        {"frame": 1050, "action": "stagger_row(rows[3])"},
        {"frame": 1200, "action": "stagger_row(rows[4])"},
        {"frame": 1350, "action": "stagger_row(rows[5])"},
        {"frame": 1650, "action": "highlight(rows[0]+rows[3]+rows[5], annotation=对号入座)"},
        {"frame": 2100, "action": "fade_in(summary_text)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 10, "action": "Remotion 行高亮入场"},
        {"start_seconds": 20, "action": "Motion Canvas / Manim 行入场"},
        {"start_seconds": 35, "action": "MoviePy / PixiJS / FFmpeg 行入场"},
        {"start_seconds": 55, "action": "对号入座：三行高亮"},
        {"start_seconds": 70, "action": "总结：Remotion(A轨)+MoviePy/FFmpeg(B轨)"}
      ]
    },
    {
      "section_ref": "判断层矩阵与选型理由",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "核心约束：固定模板 + AI 接管 + 跨期可维护",
        "title": "为什么选 Remotion？",
        "items": [
          {"label": "DECISIVE", "title": "数据驱动模板，类型安全跨期复用", "desc": "data.ts→Episode.tsx→template/ 四层结构，TS 保证换数据格式不出错", "icon": "🏗️"},
          {"label": "AI+CLI", "title": "AI Agent 友好 + CLI 原生自动化", "desc": "AI 只填数据+微调 CSS，幻觉最小；npx remotion render 可 subprocess", "icon": "🤖"},
          {"label": "WEB", "title": "网页生态红利", "desc": "完整 CSS/SVG/Flexbox/动效库，信息密度与排版自由度远超 Canvas 方案", "icon": "🌐"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 40,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow)"},
        {"frame": 150, "action": "spring_scale(title)"},
        {"frame": 450, "action": "stagger_fade(items, stagger=15f)"},
        {"frame": 750, "action": "highlight(items[0], badge=决定性)"},
        {"frame": 1050, "action": "pulse(items[1]+items[2])"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "核心约束字幕 + 标题入场"},
        {"start_seconds": 15, "action": "三卡片依次入场"},
        {"start_seconds": 25, "action": "数据驱动模板高亮为决定性理由"},
        {"start_seconds": 35, "action": "AI友好+网页生态脉冲强调"}
      ]
    },
    {
      "section_ref": "判断层矩阵与选型理由",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"component": "@ComparisonCard", "title": "Remotion ✅", "points": ["TS 约束、跨期安全", "结构稳定、AI 只填数据", "改一处全期生效"], "status": "success"},
        "right": {"component": "@ComparisonCard", "title": "HyperFrames ❌", "points": ["HTML 无类型检查", "结构易漂移", "10 期后维护困难"], "status": "error"}
      },
      "duration_seconds": 35,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout, center-out)"},
        {"frame": 300, "action": "stagger_fade(left.points)"},
        {"frame": 600, "action": "stagger_fade(right.points)"},
        {"frame": 900, "action": "scale_up(left, factor=1.03)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏展开"},
        {"start_seconds": 10, "action": "Remotion 优势逐条入场"},
        {"start_seconds": 20, "action": "HyperFrames 劣势逐条入场"},
        {"start_seconds": 30, "action": "Remotion 侧放大强调"}
      ]
    },
    {
      "section_ref": "判断层矩阵与选型理由",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "如实交代",
        "title": "选型代价（都能兜住）",
        "items": [
          {"label": "REACT", "title": "基于 React 技术栈", "desc": "让 AI 写组件填数据，人只把控架构与取舍", "icon": "⚛️"},
          {"label": "BUSL", "title": "BUSL 商业授权", "desc": "规模化商用需付费，当前规模无影响", "icon": "📜"},
          {"label": "SSR", "title": "SSR 环境约束", "desc": "用 MDC 规则交给 AI 自动规避，见第五段", "icon": "🛡️"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 300, "action": "stagger_fade(items)"},
        {"frame": 600, "action": "badge_overlay(items, text=AI兜住)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 10, "action": "三项代价卡片入场"},
        {"start_seconds": 20, "action": "覆盖 AI 兜住 标记"}
      ]
    },
    {
      "section_ref": "流程即代码（Dogfooding）",
      "scene_template": "@TimelineScene",
      "props": {
        "eyebrow": "流程即代码（Process-as-Code）",
        "title": "七阶段流水线（01 → 07）",
        "stages": [
          {"id": "01", "label": "选题分析", "role": "选题分析师"},
          {"id": "02", "label": "内容策划", "role": "内容策划师"},
          {"id": "03", "label": "B站视听策划", "role": "视觉策划师"},
          {"id": "04", "label": "脚本撰写", "role": "文案撰稿人"},
          {"id": "05", "label": "视频组装", "role": "视频工程师"},
          {"id": "06", "label": "分发适配", "role": "分发助手"},
          {"id": "07", "label": "资源归档", "role": "归档"}
        ]
      },
      "duration_seconds": 40,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 300, "action": "point_light(stages[0])"},
        {"frame": 450, "action": "point_light(stages[1])"},
        {"frame": 600, "action": "point_light(stages[2], highlight=current)"},
        {"frame": 750, "action": "rapid_sequence(stages[3..6])"},
        {"frame": 1050, "action": "zoom_out(full_pipeline)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 10, "action": "01-02 阶段逐个点亮"},
        {"start_seconds": 20, "action": "03 高亮为当前阶段"},
        {"start_seconds": 25, "action": "04-07 快速点亮"},
        {"start_seconds": 35, "action": "全貌展示流水线连接"}
      ]
    },
    {
      "section_ref": "流程即代码（Dogfooding）",
      "scene_template": "@ConceptScene",
      "props": {
        "eyebrow": "三件套",
        "title": "角色 × 工作流 × 状态机",
        "items": [
          {"label": "ROLE", "title": "角色 = system_prompt", "desc": "思考视角与边界（shared/roles/）", "icon": "🎭"},
          {"label": "WORKFLOW", "title": "工作流 = user_prompt", "desc": "标准步骤（.windsurf/workflows/01→07）", "icon": "📋"},
          {"label": "STATE", "title": "frontmatter = 状态机", "desc": "唯一进度真相源（stage/status + PIPELINE.md）", "icon": "🔄"}
        ],
        "background": "gradient"
      },
      "duration_seconds": 25,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(eyebrow+title)"},
        {"frame": 300, "action": "stagger_fade(items)"},
        {"frame": 600, "action": "connect_arrows(items)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "标题入场"},
        {"start_seconds": 10, "action": "三件套卡片入场"},
        {"start_seconds": 20, "action": "箭头连接三件套"}
      ]
    },
    {
      "section_ref": "流程即代码（Dogfooding）",
      "scene_template": "@TerminalScene",
      "props": {
        "title": "python-frontmatter 最小编排器",
        "language": "python",
        "code": "import frontmatter, glob\n\nfor path in glob.glob(\"content-library/**/README.md\", recursive=True):\n    post = frontmatter.load(path)\n    if post.get(\"status\") == \"approved\":\n        stage = post[\"stage\"]\n        role = load_role(stage)\n        steps = load_workflow(stage)\n        run_agent(system=role, user=steps)"
      },
      "duration_seconds": 35,
      "animation_cues": [
        {"frame": 0, "action": "typewriter(code)"},
        {"frame": 300, "action": "highlight_line(5, annotation=状态机读到已确认)"},
        {"frame": 600, "action": "highlight_line(7, annotation=角色=system_prompt)"},
        {"frame": 900, "action": "highlight_line(8, annotation=喂给LLM自动推进)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "代码逐行打字入场"},
        {"start_seconds": 10, "action": "高亮 if approved 条件行"},
        {"start_seconds": 20, "action": "高亮 load_role 行"},
        {"start_seconds": 30, "action": "高亮 run_agent 行"}
      ]
    },
    {
      "section_ref": "流程即代码（Dogfooding）",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "A 轨（可全自动）", "text": "概念动画由 Remotion 组件渲染，AI 端到端生成"},
        "right": {"label": "B 轨（须真人录屏）", "text": "真实 IDE 录屏，TAD-01 强制真人录制，设计挂起等待机制"}
      },
      "duration_seconds": 50,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 300, "action": "highlight(left, badge=全自动)"},
        {"frame": 600, "action": "highlight(right, badge=真人录制)"},
        {"frame": 900, "action": "transition_to(prompt_display)"},
        {"frame": 1050, "action": "typewriter(prompt_1: 基于@ComparisonCard生成对比数据)"},
        {"frame": 1350, "action": "typewriter(prompt_2: 为.cursor/rules/编写MDC规则)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏展开：A轨 vs B轨"},
        {"start_seconds": 10, "action": "A轨高亮：全自动"},
        {"start_seconds": 20, "action": "B轨高亮：真人录制"},
        {"start_seconds": 30, "action": "切换到提示词链展示"},
        {"start_seconds": 35, "action": "Prompt-1 入场（数据驱动@ComparisonCard）"},
        {"start_seconds": 45, "action": "Prompt-2 入场（MDC守卫规则）"}
      ]
    },
    {
      "section_ref": "核心实操与避坑",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "❌ 从零手写 ComparisonScene.tsx", "component": "@VideoSlot", "src": "[B轨占位：IDE录屏—AI从零手写组件]"},
        "right": {"label": "✅ 只传数据复用 @ComparisonCard", "component": "@VideoSlot", "src": "[B轨占位：IDE录屏—只写data喂入ComparisonCard]"},
        "fallback_a_track": {
          "left": {"component": "@TerminalScene", "language": "tsx", "code": "// ❌ 反面示例\nexport const ComparisonScene: React.FC = () => {\n  // 从零手写布局、样式、动画\n  return <div className=\"custom-layout\">...</div>;\n};"},
          "right": {"component": "@TerminalScene", "language": "tsx", "code": "// ✅ 正确示例\nconst comparison = {\n  left: { title: 'MoviePy', status: 'error' },\n  right: { title: 'Remotion', status: 'success' }\n};\n// <ComparisonCard {...comparison} />"}
        }
      },
      "duration_seconds": 55,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 300, "action": "fade_in(left.label, color=red)"},
        {"frame": 450, "action": "fade_in(right.label, color=green)"},
        {"frame": 750, "action": "fade_in(b_track_video)"},
        {"frame": 1200, "action": "highlight_code(right, const comparison={...})"},
        {"frame": 1500, "action": "scale_up(right, factor=1.03)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏入场"},
        {"start_seconds": 10, "action": "❌ 红标入场"},
        {"start_seconds": 15, "action": "✅ 绿标入场"},
        {"start_seconds": 25, "action": "B轨录屏淡入"},
        {"start_seconds": 40, "action": "高亮数据结构"},
        {"start_seconds": 50, "action": "正确方放大强调"}
      ]
    },
    {
      "section_ref": "核心实操与避坑",
      "scene_template": "@SplitLayout",
      "props": {
        "direction": "horizontal",
        "ratio": 0.5,
        "left": {"label": "❌ 顶层读 window 崩溃", "component": "@VideoSlot", "src": "[B轨占位：IDE录屏—window.innerWidth触发ReferenceError]"},
        "right": {"label": "✅ typeof window 守卫 + MDC 规则封死", "component": "@VideoSlot", "src": "[B轨占位：IDE录屏—加入守卫后一次性通过]"},
        "fallback_a_track": {
          "left": {"component": "@TerminalScene", "language": "tsx", "code": "// ❌ Node 端无 DOM\nconst w = window.innerWidth; // 💥 崩溃\n// ReferenceError: window is not defined"},
          "right": {"component": "@TerminalScene", "language": "tsx", "code": "// ✅ typeof 守卫\nconst getWidth = () =>\n  typeof window !== 'undefined'\n    ? window.innerWidth : 1920;\n// + .cursor/rules/remotion-ssr.mdc"}
        }
      },
      "duration_seconds": 50,
      "animation_cues": [
        {"frame": 0, "action": "wipe_reveal(split_layout)"},
        {"frame": 300, "action": "fade_in(left_video)"},
        {"frame": 600, "action": "shake(left, intensity=3px)"},
        {"frame": 900, "action": "fade_in(right_video)"},
        {"frame": 1200, "action": "highlight(right, badge=一次通过)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "分屏入场"},
        {"start_seconds": 10, "action": "左侧崩溃录屏淡入"},
        {"start_seconds": 20, "action": "左侧震动强调错误"},
        {"start_seconds": 30, "action": "右侧修复录屏淡入"},
        {"start_seconds": 40, "action": "一次通过标记"}
      ]
    },
    {
      "section_ref": "核心实操与避坑",
      "scene_template": "@TerminalScene",
      "props": {
        "title": "交给 AI + npx remotion render 出片",
        "language": "bash",
        "code": "cd OpenMontage/remotion-composer\nnpx remotion studio                  # 可视化调试\nnpx remotion render src/index.ts \\\n  <CompositionId> out/ep02.mp4       # 渲染出片\n\n# 输出：\n# ℹ Rendering frames 0-1350...\n# ℹ 100% ██████████ 1350/1350\n# ✓ Video saved to out/ep02.mp4",
        "fallback_note": "B轨终端录屏缺失时，直接使用本 @TerminalScene 渲染（含模拟进度输出）"
      },
      "duration_seconds": 45,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(concept_cards: 填数据/套组件/命令代跑)"},
        {"frame": 300, "action": "stagger_fade(concept_items)"},
        {"frame": 600, "action": "transition_to(terminal_scene)"},
        {"frame": 750, "action": "typewriter(code)"},
        {"frame": 1050, "action": "fade_in(b_track_terminal)"},
        {"frame": 1200, "action": "progress_bar(render_progress, 0→100%)"}
      ],
      "sub_shots": [
        {"start_seconds": 0, "action": "交给AI做好概念卡入场"},
        {"start_seconds": 10, "action": "三步骤卡片入场"},
        {"start_seconds": 20, "action": "切换到终端"},
        {"start_seconds": 25, "action": "命令逐行打字"},
        {"start_seconds": 35, "action": "B轨终端录屏淡入"},
        {"start_seconds": 40, "action": "渲染进度动画"}
      ]
    },
    {
      "section_ref": "结尾 CTA",
      "scene_template": "@OutroScene",
      "props": {
        "headline": "代码即视频 + 流程即代码 = 把内容生产做成可维护的工程流水线",
        "cta": "关注 · 下期解密 Whisper 毫秒级字幕与卡点",
        "background": "gradient"
      },
      "duration_seconds": 15,
      "animation_cues": [
        {"frame": 0, "action": "fade_in(headline)"},
        {"frame": 150, "action": "typewriter(cta)"},
        {"frame": 300, "action": "pulse(cta)"}
      ]
    }
  ],
  "zoom_crop_directives": [
    {
      "clip_id": "b-ide-data-driven",
      "timestamp_start": "0:00",
      "timestamp_end": "0:15",
      "zoom_level": 1.0,
      "focal_point": {"x": 0.5, "y": 0.5}
    },
    {
      "clip_id": "b-ide-data-driven",
      "timestamp_start": "0:15",
      "timestamp_end": "0:30",
      "zoom_level": 1.3,
      "focal_point": {"x": 0.4, "y": 0.4}
    },
    {
      "clip_id": "b-ide-data-driven",
      "timestamp_start": "0:30",
      "timestamp_end": "0:45",
      "zoom_level": 1.2,
      "focal_point": {"x": 0.5, "y": 0.6}
    },
    {
      "clip_id": "b-ide-ssr-crash",
      "timestamp_start": "0:00",
      "timestamp_end": "0:10",
      "zoom_level": 1.0,
      "focal_point": {"x": 0.5, "y": 0.5}
    },
    {
      "clip_id": "b-ide-ssr-crash",
      "timestamp_start": "0:10",
      "timestamp_end": "0:20",
      "zoom_level": 1.4,
      "focal_point": {"x": 0.5, "y": 0.7}
    },
    {
      "clip_id": "b-ide-ssr-fix",
      "timestamp_start": "0:00",
      "timestamp_end": "0:10",
      "zoom_level": 1.3,
      "focal_point": {"x": 0.3, "y": 0.3}
    },
    {
      "clip_id": "b-ide-ssr-fix",
      "timestamp_start": "0:10",
      "timestamp_end": "0:20",
      "zoom_level": 1.2,
      "focal_point": {"x": 0.5, "y": 0.4}
    },
    {
      "clip_id": "b-terminal-render",
      "timestamp_start": "0:00",
      "timestamp_end": "0:10",
      "zoom_level": 1.0,
      "focal_point": {"x": 0.5, "y": 0.5}
    },
    {
      "clip_id": "b-terminal-render",
      "timestamp_start": "0:10",
      "timestamp_end": "0:20",
      "zoom_level": 1.3,
      "focal_point": {"x": 0.5, "y": 0.6}
    }
  ]
}
```
