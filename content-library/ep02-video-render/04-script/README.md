---
stage: 04-script
platform: bilibili
status: approved
source_workflow: /04-script-draft
upstream_inputs:
  - 02-plan/README.md (status: approved)
  - 02-plan/tutorial.final.md (status: approved)
  - 03-plan-bilibili/README.md (status: approved)
  - shared/docs/remotion-spec.md
---

# ep02 视频脚本：《代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程》

**总时长预估**：10 分 45 秒
**口播字数预估**：约 2800 字
**视觉隐喻**：数字渲染生产线——声明式代码/数据 → Frame 传送带 → 编译成帧 → 合成 MP4
**反噱头纪律**：不以"多少行代码/百倍效率"为卖点；SSR `window` 问题定位为"选这条路要付的税"，非致命噱头。

---

## 第一段：【@IntroScene】开头黄金钩子（0:00–0:30，30s）

**[画面]**
调用 `@IntroScene`。参数：
- `title` = "代码即视频（Video-as-Code）"
- `subtitle` = "【AI 视频自动化生产线】第 2 期：渲染引擎篇"
- `background` = "particles"

- **[子镜头时间线]**：
  - 0s：粒子背景渐显
  - 0.5s：主标题弹性放大入场（spring_scale）
  - 5s：副标题淡入
  - 15s："数字渲染生产线"隐喻动画启动（代码/数据 → 帧传送带 → MP4）
  - 25s：隐喻动画全貌展开（zoom_out_reveal）

**[口播]**
用 PR、AE 一帧帧剪视频？停。你有没有想过，写代码就是在写视频？一段声明式的代码加一份数据，交给渲染器编译成帧，直接合成高清 MP4。这不是科幻，这叫 Video-as-Code。今天这期我把这套范式讲透——它不止 Remotion，它是一类思路，至少六条路线。选哪条、为什么选、怎么避坑、怎么让 AI 全程接管，一期全讲清。

---

## 第二段-A：【@ConceptScene】传统痛点 + Video-as-Code 三特性（0:30–1:05，35s）

**[画面]**
调用 `@ConceptScene`。参数：
- `eyebrow` = "核心概念：范式与痛点"
- `title` = "传统剪辑 = 轨道 + 绝对时间轴 → 低 ROI 体力活"
- `items` = [
  - {label: "VERSION", title: "可版本控制", desc: "视频就是文本（代码/JSON/YAML），能 diff、能 review、能 git 回滚", icon: "📝"},
  - {label: "BATCH", title: "可参数化批量复用", desc: "同一套模板换一份数据，批量产出几十期结构一致的视频", icon: "🔁"},
  - {label: "AI", title: "AI 友好", desc: "让 AI 拖时间轴很难，让 AI 写代码/改数据/调 CSS 是它最擅长的事", icon: "🤖"}
]
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s：eyebrow + title 入场
  - 15s：三特性卡片依次 stagger 入场
  - 20s：高亮"可版本控制"
  - 25s：高亮"可参数化批量复用"
  - 30s：高亮"AI 友好"

**[口播]**
传统剪辑的心智模型是什么？轨道加绝对时间轴。在时间线上拖素材、对齐音频、手打字幕。对技术教程这种高频更新的内容来说，这是一场低 ROI 的体力活——每改一处都得回到时间轴上重摆。Video-as-Code 换了一套模型。视频变成代码和数据，渲染器编译成帧。这带来三个传统剪辑给不了的工程特性。第一，可版本控制——代码能 diff、能 review、能 git 回滚。第二，可参数化批量复用——同一模板换一份数据，几十期结构一致的视频批量产出。第三，AI 友好——让 AI 拖时间轴很难，让 AI 写代码、改数据、调 CSS，这是它最擅长的事。

---

## 第二段-B：【@ConceptScene】帧即状态（Frame as State）（1:05–1:30，25s）

**[画面]**
调用 `@ConceptScene`。参数：
- `eyebrow` = "一句话本质"
- `title` = "帧即状态（Frame as State）"
- `items` = [
  - {label: "INPUT", title: "声明式代码/数据", desc: "用代码或数据把画面描述出来", icon: "📄"},
  - {label: "COMPILE", title: "渲染器编译成帧", desc: "给定时间点，渲染器算出该时刻画面长什么样", icon: "⚙️"},
  - {label: "OUTPUT", title: "合成视频", desc: "帧序列合成高清 MP4，全流程可自动化", icon: "🎬"}
]
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s："帧即状态"大字入场
  - 10s：三步骤卡片依次入场
  - 20s：箭头依次连接三步骤（INPUT → COMPILE → OUTPUT）

**[口播]**
一句话讲本质：帧即状态。Video-as-Code 把"时间轴"变成了"代码和数据的函数"。给定一个时间点，渲染器算出该时刻画面长什么样。输入是声明式的代码或数据，经过渲染器编译成帧，帧序列合成视频。整条链路都是代码控制的，所以才能被 AI 端到端接管。

---

## 第二段-C：【@TableScene】六条技术路线（1:30–2:30，60s）

**[画面]**
调用 `@TableScene`。参数：
- `eyebrow` = "不止 Remotion"
- `title` = "Video-as-Code 六条技术路线"
- `columns` = ["路线", "代表项目", "描述方式", "典型场景"]
- `rows` = [
  - ["DOM / React 渲染", "Remotion", "React 组件 + CSS/SVG", "前端栈、复杂排版、模板复用"],
  - ["TS 声明式动画", "Motion Canvas / Revideo", "生成器函数", "代码演示、时序动画"],
  - ["程序化数学动画", "Manim", "Python 几何/公式", "数学/算法可视化"],
  - ["像素/合成脚本", "MoviePy", "NumPy + FFmpeg", "纯 Python、简单拼接"],
  - ["Canvas/游戏引擎", "PixiJS / Cocos2d", "Canvas 逐帧绘制", "粒子、游戏化动画"],
  - ["命令式合成", "FFmpeg + 脚本", "filtergraph 拼接", "批量转码、字幕烧录"]
]
- `highlight_row` = 0

- **[子镜头时间线]**：
  - 0s：标题入场
  - 10s：第 1 行（Remotion）入场并高亮
  - 20s：第 2 行入场
  - 25s：第 3 行入场
  - 30s：第 4 行入场
  - 35s：第 5 行入场
  - 40s：第 6 行入场
  - 50s：总结高亮——"共享同一内核：代码/数据描述 → 编译成帧 → 合成视频"

**[口播]**
代码即视频不等于 Remotion。它是一类范式，实现的工具不止一种。看这张表。第一条路线，DOM 加 React 渲染，Remotion 是代表，React 组件加 CSS 就能做复杂排版。第二条，Motion Canvas，TypeScript 声明式动画，适合代码演示和时序编排。第三条，Manim，Python 写几何和公式动画，数学可视化神器。第四条，MoviePy，NumPy 加 FFmpeg，纯 Python 做简单拼接。第五条，PixiJS 这类游戏引擎，Canvas 逐帧绘制做粒子效果。第六条，FFmpeg 加脚本，命令式合成做批量转码。六条路线，内核一样——用代码描述画面、编译成帧、合成视频。区别只在描述层用什么语言、渲染层用什么引擎。

---

## 第三段-A：【@TableScene】判断层矩阵（2:30–3:50，80s）

**[画面]**
调用 `@TableScene`。参数：
- `eyebrow` = "判断层 = 边界，非中立百科"
- `title` = "六个方案的适用/不适用/已知坑"
- `columns` = ["方案", "适用场景", "不适用场景", "已知坑"]
- `rows` = [
  - ["Remotion", "前端栈、复杂 CSS/SVG、跨期模板复用", "零前端基础、纯后台超长批处理", "顶层读 window/document 崩溃；BUSL 授权"],
  - ["Motion Canvas / Revideo", "代码演示、精确时序编排", "复杂 Flex/Grid 排版", "生态较小，模板需自建"],
  - ["Manim", "数学/算法/公式可视化", "一般 UI、网页排版、录屏混排", "学习曲线陡、排版弱、渲染慢"],
  - ["MoviePy", "纯 Python、简单拼接/裁剪", "弹性排版、复杂文字动效", "文本布局繁琐、多层内存大"],
  - ["PixiJS / Cocos2d", "游戏类复杂粒子动画", "标准网页 UI、文本对齐", "文本换行与 DOM 对齐复杂"],
  - ["FFmpeg + 脚本", "批量转码、轻量字幕烧录", "复杂动效、交互式排版", "filtergraph 晦涩、调试困难"]
]
- `highlight_row` = 0
- `summary_text` = "本项目主线：Remotion（A 轨成片）+ MoviePy/FFmpeg（B 轨拼接闪避）"

- **[子镜头时间线]**：
  - 0s：标题入场
  - 10s：Remotion 行入场高亮
  - 20s：Motion Canvas 行入场
  - 25s：Manim 行入场
  - 35s：MoviePy 行入场
  - 40s：PixiJS 行入场
  - 45s：FFmpeg 行入场
  - 55s：对号入座高亮（Remotion + MoviePy + FFmpeg 三行联动）
  - 70s：总结"Remotion(A轨)+MoviePy/FFmpeg(B轨)"淡入

**[口播]**
范式理解了，接下来要做选择题。判断层不是中立百科式综述，它是边界——每个方案必须回答"什么前提下成立，哪步会翻车"。看这个矩阵。Remotion，前端栈复杂排版没问题，跨期模板复用没问题，但零前端基础的项目别碰，而且模块顶层读 window 会崩、商业用途要 BUSL 授权。Motion Canvas，时序动画很强，但网页级 Flex 排版不如 React 生态。Manim，数学可视化天花板，但学习曲线陡、排版弱、渲染慢。MoviePy，纯 Python 简单拼接够用，但复杂文字动效很痛苦。PixiJS 做游戏级粒子效果，但文本对齐是灾难。FFmpeg 做批量转码和字幕烧录，但 filtergraph 语法人类基本看不懂。怎么对号入座？我们这个频道要做的是"一期一个模板、字幕代码卡片高复用"的硬核技术视频，所以主线是 Remotion 做 A 轨成片，MoviePy 加 FFmpeg 做 B 轨拼接闪避。

---

## 第三段-B：【@ConceptScene】Remotion 胜出四理由（3:50–4:30，40s）

**[画面]**
调用 `@ConceptScene`。参数：
- `eyebrow` = "核心约束：固定模板 + AI 接管 + 跨期可维护"
- `title` = "为什么选 Remotion？"
- `items` = [
  - {label: "DECISIVE", title: "数据驱动模板，类型安全跨期复用", desc: "data.ts → Episode.tsx → template/ 四层结构，TS 保证换数据时格式不出错，改一处主题全期生效", icon: "🏗️"},
  - {label: "AI+CLI", title: "AI Agent 友好 + CLI 原生自动化", desc: "AI 只填数据+微调 CSS，幻觉最小；npx remotion render 纯命令行可 subprocess", icon: "🤖"},
  - {label: "WEB", title: "网页生态红利", desc: "完整 CSS/SVG/Flexbox/动效库随手可用，信息密度与排版自由度远超像素/Canvas 方案", icon: "🌐"}
]
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s："核心约束"字幕入场
  - 5s："为什么选 Remotion"弹入
  - 15s：三卡片依次 stagger 入场
  - 25s：强调"数据驱动模板"（badge="决定性"）
  - 35s：脉冲强调后两项

**[口播]**
选型不是"哪个最火选哪个"，要回到核心约束。我们频道要的是：固定模板加内容批量替换，让 AI 端到端接管，而且跨期可维护。在这个约束下，Remotion 胜出有四个硬理由。第一，也是决定性的——数据驱动模板，类型安全跨期复用。Remotion 的 data.ts 到 Episode 到 template 四层结构，天生适合模板与数据分离。TypeScript 保证每期换数据时格式不出错。第二，AI 友好，每期只让 AI 填数据和微调 CSS，幻觉空间最小。第三，CLI 原生，npx remotion render 一行命令就能出片。第四，网页生态红利，CSS、SVG、Flexbox、所有前端动效库随手可用。

---

## 第三段-C：【@SplitLayout + @ComparisonCard】Remotion ✅ vs HyperFrames ❌ 对照（4:30–5:05，35s）

**[画面]**
调用 `@SplitLayout`：
- `direction` = "horizontal"
- `ratio` = 0.5
- 左侧 `@ComparisonCard`：
  - `title` = "Remotion ✅"
  - `points` = ["模板复用/类型安全：TS 约束、跨期安全", "AI 友好度：结构稳定、AI 只填数据", "长期维护：改一处全期生效"]
  - `status` = "success"
- 右侧 `@ComparisonCard`：
  - `title` = "HyperFrames ❌"
  - `points` = ["HTML 无类型检查", "直接写 HTML，结构易漂移", "10 期后维护困难"]
  - `status` = "error"

- **[子镜头时间线]**：
  - 0s：分屏从中间展开（center-out wipe）
  - 10s：左侧 Remotion 三条逐条入场
  - 20s：右侧 HyperFrames 三条逐条入场
  - 30s：左侧微放大强调（胜出方 1.03x）

**[口播]**
一个对照就能看清区别。左边 Remotion，TypeScript 约束，跨期类型安全，AI 只填数据不碰结构，改一处主题全期生效。右边 HyperFrames，HTML 无类型检查，直接写 HTML 结构容易漂移，十期以后维护是灾难。授权上 HyperFrames 是 Apache 更宽松，但在"模板复用加 AI 接管"这个维度上，Remotion 完胜。

---

## 第三段-D：【@ConceptScene】选型代价（5:05–5:30，25s）

**[画面]**
调用 `@ConceptScene`。参数：
- `eyebrow` = "如实交代"
- `title` = "选型代价（都能兜住）"
- `items` = [
  - {label: "REACT", title: "基于 React 技术栈", desc: "不用担心——本项目让 AI 写组件、填数据，人只把控架构与内容取舍", icon: "⚛️"},
  - {label: "BUSL", title: "BUSL 商业授权", desc: "规模化商用需付费，当前规模无影响", icon: "📜"},
  - {label: "SSR", title: "SSR 环境约束", desc: "Node 端求值读 window 会崩——用一条 MDC 规则交给 AI 自动规避，落地见第五段", icon: "🛡️"}
]
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s：标题入场
  - 10s：三项代价卡片依次入场
  - 20s：覆盖"AI 兜住"绿色标记

**[口播]**
代价也如实交代。第一，Remotion 基于 React 技术栈——但不用担心，本项目就是让 AI 来写组件和填数据，人把控架构就行，前端基础不是门槛。第二，BUSL 商业授权，规模化商用需要付费，我们当前规模没影响。第三，SSR 环境约束，Node 端求值时读 window 会崩。这个坑怎么解？后面第五段详细讲，一条 MDC 规则就能让 AI 自动规避，一次性封死。

---

## 第四段-A：【@TimelineScene】七阶段流水线（5:30–6:10，40s）

**[画面]**
调用 `@TimelineScene`。参数：
- `eyebrow` = "流程即代码（Process-as-Code）"
- `title` = "七阶段流水线（01 → 07）"
- `stages` = [
  - {id: "01", label: "选题分析", role: "选题分析师", status: "approved"},
  - {id: "02", label: "内容策划", role: "内容策划师", status: "approved"},
  - {id: "03", label: "B站视听策划", role: "视觉策划师", status: "current"},
  - {id: "04", label: "脚本撰写", role: "文案撰稿人", status: "pending"},
  - {id: "05", label: "视频组装", role: "视频工程师", status: "pending"},
  - {id: "06", label: "分发适配", role: "分发助手", status: "pending"},
  - {id: "07", label: "资源归档", role: "归档", status: "pending"}
]

- **[子镜头时间线]**：
  - 0s：标题入场
  - 10s："01 选题"点亮
  - 15s："02 策划"点亮
  - 20s："03 视听"高亮为当前
  - 25s：04–07 快速依次点亮
  - 35s：全貌展示流水线连接（zoom_out）

**[口播]**
视频的画面能用代码控制，那制作视频的工作流本身，能不能也做成代码？我们的答案是——能。这才是频道真正的护城河。看这条线。01 选题分析，02 内容策划，03 视听编排，04 脚本撰写，05 视频组装，06 分发适配，07 资源归档。七个阶段，每个阶段都有对应的角色定义和工作流文件，真实存在于我们的仓库里。这就是流程即代码——Process-as-Code。

---

## 第四段-B：【@ConceptScene】三件套（6:10–6:35，25s）

**[画面]**
调用 `@ConceptScene`。参数：
- `eyebrow` = "三件套"
- `title` = "角色 × 工作流 × 状态机"
- `items` = [
  - {label: "ROLE", title: "角色 = system_prompt", desc: "思考视角与边界（shared/roles/）", icon: "🎭"},
  - {label: "WORKFLOW", title: "工作流 = user_prompt", desc: "每阶段标准步骤（.windsurf/workflows/01→07）", icon: "📋"},
  - {label: "STATE", title: "frontmatter = 状态机", desc: "文件即数据的唯一进度真相源（stage/status + PIPELINE.md）", icon: "🔄"}
]
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s：标题入场
  - 10s：三件套卡片依次 stagger 入场
  - 20s：箭头连接三件套

**[口播]**
怎么做到的？三件套。角色等于 system prompt——定义每个岗位的视角、能力和边界。工作流等于 user prompt——每个阶段的标准步骤和交互协议。产物文件的 frontmatter 等于状态机——stage 和 status 字段就是进度的唯一真相源。每个阶段遵守同一套纪律：读角色、按步骤干活、不越界、关键节点停下等人确认、改完状态落盘。

---

## 第四段-C：【@TerminalScene】编排器伪代码（6:35–7:10，35s）

**[画面]**
调用 `@TerminalScene`。参数：
- `title` = "python-frontmatter 最小编排器"
- `language` = "python"
- `code` = `import frontmatter, glob\n\nfor path in glob.glob("content-library/**/README.md", recursive=True):\n    post = frontmatter.load(path)\n    if post.get("status") == "approved":\n        stage = post["stage"]\n        role = load_role(stage)       # 角色 = system_prompt\n        steps = load_workflow(stage)  # 工作流 = user_prompt\n        run_agent(system=role, user=steps)`

- **[子镜头时间线]**：
  - 0s：代码逐行打字入场
  - 10s：高亮 if 条件行（annotation="状态机读到'已确认'"）
  - 20s：高亮 role 行（annotation="角色 = system_prompt"）
  - 30s：高亮 run_agent 行（annotation="喂给 LLM 自动推进"）

**[口播]**
把这三件套摆出来，一个最小编排器就能驱动整条线。看这段 Python 伪代码。扫描所有产物的 frontmatter，找到 status 是 approved 的阶段，读取对应的角色文件作为 system prompt，读取工作流作为 user prompt，喂给 LLM，自动推进下一阶段。python-frontmatter 这个库真实存在，这段代码不是 PPT——虽然目前还是 paper spec，但架构已经跑通了。

---

## 第四段-D：【@SplitLayout】A 轨 vs B 轨 + 提示词链（7:10–8:00，50s）

**[画面]**
调用 `@SplitLayout`：
- `direction` = "horizontal"
- `ratio` = 0.5
- 左侧文字卡片：
  - `label` = "A 轨（可全自动）"
  - `text` = "概念动画由 Remotion 组件渲染\nAI 端到端生成数据 + 套模板\n无需人工干预"
- 右侧文字卡片：
  - `label` = "B 轨（须真人录屏）"
  - `text` = "真实 IDE 录屏\nTAD-01 强制真人录制\n设计「挂起等待」机制"

后半切换至提示词链展示。

- **[子镜头时间线]**：
  - 0s：分屏展开（center-out wipe）
  - 10s：A 轨高亮（badge="全自动", green）
  - 20s：B 轨高亮（badge="真人录制", orange）
  - 30s：切换到终端场景展示提示词链
  - 35s：Prompt-1 打字入场——"基于 @ComparisonCard 组件，生成对比数据配置…"
  - 45s：Prompt-2 打字入场——"为 .cursor/rules/ 编写 MDC 规则约束…"

**[口播]**
真正的难点是多模态物理限制。A 轨——概念动画——可以全自动，AI 生成数据，Remotion 组件渲染，不用人碰。B 轨——真实 IDE 录屏——我们有个规矩叫 TAD-01，强制真人录制，禁止 AIGC 伪界面。所以流程里要设计"挂起等待"机制，B 轨没到位就先挂着。正因为流程是代码，本期录屏要真实跑通的也是一段可复现的提示词链。Prompt 第一条：基于 remotion-composer 现有的 ComparisonCard 组件，生成对比卡片的数据配置，只产出数据，不要新建组件。Prompt 第二条：为 Cursor 在 .cursor/rules 下编写一份 MDC 规则，约束 Remotion 组件自动加上 window 的安全守卫。

---

## 第五段-A：【@SplitLayout】数据驱动 vs 从零手写（8:00–8:55，55s）

**[B 轨]**
调用 `@SplitLayout`：
- 左侧 `@VideoSlot`：
  - `label` = "❌ 从零手写 ComparisonScene.tsx"
  - `[B 轨占位替换提醒：请用户在此补充 IDE 录屏 — AI 从零手写组件的反面演示]`
- 右侧 `@VideoSlot`：
  - `label` = "✅ 只传数据，复用 @ComparisonCard"
  - `[B 轨占位替换提醒：请用户在此补充 IDE 录屏 — 只写 data 喂入 @ComparisonCard]`

**[A 轨兜底]**（B 轨录屏缺失时使用）
调用 `@SplitLayout`：
- 左侧 `@TerminalScene`：
  - `title` = "反面：为这期从零手写组件"
  - `language` = "tsx"
  - `code` = `// ❌ 反面示例\n// 违反「固定模板 + 内容替换」\nexport const ComparisonScene: React.FC = () => {\n  // 从零手写布局、样式、动画…\n  // 忽略仓库现成的 @ComparisonCard\n  return <div className="custom-layout">...</div>;\n};`
- 右侧 `@TerminalScene`：
  - `title` = "正确：只传数据复用 @ComparisonCard"
  - `language` = "tsx"
  - `code` = `// ✅ 正确示例\nconst comparison = {\n  left:  { title: 'MoviePy', points: ['纯 Python', '简单拼接'], status: 'error' },\n  right: { title: 'Remotion', points: ['TS 类型安全', '模板复用'], status: 'success' },\n};\n// <ComparisonCard {...comparison} />`

- **[子镜头时间线]**：
  - 0s：分屏入场（left-to-right wipe）
  - 10s：左侧红标 ❌ 入场
  - 15s：右侧绿标 ✅ 入场
  - 25s：B 轨录屏淡入（或 A 轨代码展示）
  - 40s：高亮右侧数据结构 `const comparison = {...}`
  - 50s：正确方放大强调

**[口播]**
到了实操。第一个原则——首选数据驱动现成组件，不要从零手写。看左边，反面示例，为这一期从零写一个 ComparisonScene.tsx，手写布局、手写样式、手写动画。这违反了"固定模板加内容替换"的原则，而且完全忽略了仓库里现成的 ComparisonCard 组件。看右边，正确做法。你只产出一个 data 对象——left 方案、right 方案，各自的 title、points、status——然后丢给 ComparisonCard 渲染。数据和模板分离，下一期只换数据就行。这才是数据驱动模板的正确用法。

---

## 第五段-B：【@SplitLayout】SSR 守卫避坑（8:55–9:45，50s）

**[B 轨]**
调用 `@SplitLayout`：
- 左侧 `@VideoSlot`：
  - `label` = "❌ 顶层读 window 崩溃"
  - `[B 轨占位替换提醒：请用户在此补充 IDE 录屏 — window.innerWidth 触发 ReferenceError]`
- 右侧 `@VideoSlot`：
  - `label` = "✅ typeof window 守卫 + MDC 规则封死"
  - `[B 轨占位替换提醒：请用户在此补充 IDE 录屏 — 加入守卫后一次性通过]`

**[A 轨兜底]**（B 轨录屏缺失时使用）
调用 `@SplitLayout`：
- 左侧 `@TerminalScene`：
  - `title` = "ReferenceError: window is not defined"
  - `language` = "tsx"
  - `code` = `// ❌ Node 端无 DOM 环境\n// Remotion SSR 截图时组件在 Node.js 执行\nconst w = window.innerWidth;  // 💥 崩溃\n\n// 终端输出：\n// ReferenceError: window is not defined\n// npx remotion render → 红屏`
- 右侧 `@TerminalScene`：
  - `title` = "typeof window 守卫 + MDC 规则"
  - `language` = "tsx"
  - `code` = `// ✅ 类型安全守卫\nconst getWidth = () =>\n  typeof window !== 'undefined'\n    ? window.innerWidth\n    : 1920;  // SSR 时用默认值\n\n// .cursor/rules/remotion-ssr.mdc:\n// "任何 Remotion 组件不得在顶层读 window/document"`

- **[子镜头时间线]**：
  - 0s：分屏入场
  - 10s：左侧崩溃录屏/代码淡入
  - 20s：左侧震动强调错误（3px shake）
  - 30s：右侧修复录屏/代码淡入
  - 40s：右侧高亮（badge="一次通过", green）

**[口播]**
第二个避坑点——SSR 环境约束。Remotion 渲染分两个阶段。第一阶段，Node 端打包并求值 Composition 列表，这一步拿时长、拿尺寸、做任务拆分。第二阶段，无头 Chrome 逐帧截图再合成。崩溃点在第一步——你的代码在模块顶层读了 window.innerWidth，Node 环境没有 window 对象，直接报 ReferenceError。这不是逐帧 SSR 的问题，这是模块求值阶段的问题——知道区别，你才知道往哪查 bug。怎么修？加 typeof window 守卫。然后把这条写进 .cursor/rules/remotion-ssr.mdc 文件，globs 指向 remotion-composer 的 src 目录，以后 AI 生成组件就自动带守卫。一次性把这个约束封死，不用人盯。

---

## 第五段-C：【@ConceptScene + @TerminalScene】交给 AI + render 出片（9:45–10:30，45s）

**[画面]**（前半）
调用 `@ConceptScene`。参数：
- `eyebrow` = "这一步怎么交给 AI 做好"
- `title` = "人把控架构，AI 干活"
- `items` = [
  - {label: "DATA", title: "AI 填数据、套现成组件", desc: "人给出每段要展示什么，AI 按范式产出 data，复用 @ComparisonCard/charts/ 等", icon: "📊"},
  - {label: "RULE", title: "用规则替 AI 兜底边界", desc: "SSR 守卫写进 .cursor/rules/remotion-ssr.mdc，AI 生成组件时自动带", icon: "🛡️"},
  - {label: "RUN", title: "渲染命令交给 AI/脚本代跑", desc: "npx remotion render — 纯命令行，可 CI，人只看产物", icon: "▶️"}
]
- `background` = "gradient"

**[画面]**（后半，A 轨兜底版——B 轨终端录屏缺失时也使用此画面）
调用 `@TerminalScene`。参数：
- `title` = "npx remotion render 出片"
- `language` = "bash"
- `code` = `cd OpenMontage/remotion-composer\nnpx remotion studio                  # 可视化调试\nnpx remotion render src/index.ts \\\n  <CompositionId> out/ep02.mp4       # 渲染出片\n\n# 输出：\n# ℹ Rendering frames 0-1350...\n# ℹ 100% ██████████ 1350/1350 frames\n# ✓ Video saved to out/ep02.mp4 (10:45, 30fps)`

- `[B 轨占位替换提醒：如有终端真实录屏（b-terminal-render），优先使用录屏替换此 @TerminalScene]`

- **[子镜头时间线]**：
  - 0s：概念卡片入场
  - 10s：三步骤卡片依次入场
  - 20s：切换到终端
  - 25s：命令逐行打字
  - 35s：B 轨终端录屏淡入（或 A 轨模拟进度）
  - 40s：渲染进度条动画 0→100%

**[口播]**
到了最后一步——产出数据、套组件、渲染出片。这一步人不用逐行写代码。把活拆成 AI 能稳定接手的形状。第一步，让 AI 填数据和套现成组件。人给出每段要对比什么要展示什么，AI 按数据驱动范式产出 data，复用 ComparisonCard、charts 等组件，不从零造轮子。第二步，用规则替 AI 兜底边界。SSR 守卫写进 MDC 规则，AI 生成组件时自动带。第三步，渲染命令交给 AI 或脚本代跑。cd 到 remotion-composer 目录，npx remotion studio 可视化调试，npx remotion render 直接出片。纯命令行，可以上 CI，人只看产物。

---

## 第六段：【@OutroScene】结尾 CTA（10:30–10:45，15s）

**[画面]**
调用 `@OutroScene`。参数：
- `headline` = "代码即视频 + 流程即代码 = 把内容生产做成可维护的工程流水线"
- `cta` = "关注 · 下期解密 Whisper 毫秒级字幕与卡点"
- `background` = "gradient"

- **[子镜头时间线]**：
  - 0s：总结文案淡入
  - 5s：CTA 打字机效果逐字显现
  - 10s：CTA 脉冲强调（绿色）

**[口播]**
代码即视频加流程即代码，把内容生产从手工活变成可维护的工程流水线。代码即视频的范式，Remotion 只是其中一条路线，但它在数据驱动和 AI 接管这个维度上目前最优。而流程即代码——角色等于 prompt、工作流等于步骤、frontmatter 等于状态机——这套自家流水线本身就是最好的 Dogfooding 证据。开源仓库在简介，自取。下期，我们攻克字幕与卡点——Whisper 毫秒级时间戳怎么自动驱动弹跳字幕。关注，别错过。

---

## 6. 自我检查清单

- ✅ B 站深度版完整产出（16 场景，6 段式，约 2800 字，约 10 分 45 秒）
- ✅ **必讲要点覆盖核对**（逐条对齐 tutorial.final.md 覆盖清单，21/21 全覆盖，详见下方）
- ✅ 所有组件均为 remotion-spec.md §1.9 已有组件，无新组件工单
- ✅ 03 蓝图 16 个 scene_storyboard 全部在脚本中有对应段落
- ✅ 恶俗 AI 词汇检查：无"赋能、打造、革新、全方位、数字化浪潮"
- ✅ 口播短句优先，换气感强
- ✅ **A/B 轨兜底完整性**：S5a/S5b/S5c 含 B 轨 `@VideoSlot` 录屏指示 + A 轨 `@TerminalScene` 兜底代码
- ✅ **防静止**：所有口播 >75 字的段落均配有 [子镜头时间线]，无静止画面超 15s

### 必讲要点覆盖核对

| # | 要点 | 脚本对应段落 | 状态 |
|---|------|------------|------|
| 1 | 传统剪辑 = 轨道+绝对时间轴，低 ROI 体力活 | 第二段-A | ✅ |
| 2 | Video-as-Code 三特性：可版本控制/可参数化批量复用/AI 友好 | 第二段-A | ✅ |
| 3 | 帧即状态（Frame as State）——画面是"代码/数据的函数" | 第二段-B | ✅ |
| 4 | "代码即视频 ≠ Remotion"：至少 6 条技术路线 | 第二段-C | ✅ |
| 5 | 判断层 = 边界（适用/不适用/已知坑），非中立百科 | 第三段-A | ✅ |
| 6 | 6 方案矩阵 | 第三段-A | ✅ |
| 7 | "怎么对号入座"：本项目主线 = Remotion(A轨) + MoviePy/FFmpeg(B轨) | 第三段-A | ✅ |
| 8 | 核心约束：固定模板 + 内容批量替换 + AI 端到端接管 + 跨期可维护 | 第三段-B | ✅ |
| 9 | Remotion 胜出四理由 | 第三段-B | ✅ |
| 10 | Remotion ✅ vs HyperFrames ❌ 对照 | 第三段-C | ✅ |
| 11 | 选型代价：BUSL 授权 + SSR 环境约束 | 第三段-D | ✅ |
| 12 | 三件套：角色=system_prompt / 工作流=user_prompt / frontmatter=状态机 | 第四段-B | ✅ |
| 13 | 七阶段流水线（01→07）映射 | 第四段-A | ✅ |
| 14 | python-frontmatter 最小编排器伪代码 | 第四段-C | ✅ |
| 15 | A 轨可全自动、B 轨须真人录屏 → "挂起等待"机制 | 第四段-D | ✅ |
| 16 | 本期可复现的提示词链 | 第四段-D | ✅ |
| 17 | 首选数据驱动 @ComparisonCard ✅ vs 从零手写 ❌ | 第五段-A | ✅ |
| 18 | SSR 守卫：顶层读 window ❌ vs typeof window 守卫 ✅ | 第五段-B | ✅ |
| 19 | 交给 AI 做好：填数据/套组件/命令代跑 | 第五段-C | ✅ |
| 20 | 代码即视频 + 流程即代码 = 工程流水线 | 第六段 | ✅ |
| 21 | 关注引导 + 下期预告（Whisper 毫秒级字幕/卡点） | 第六段 | ✅ |

---

## 7. 结构化校验块 (JSON Schema Block)

```json
{
  "title": "代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程",
  "platform": "bilibili",
  "estimated_duration_seconds": 645,
  "total_word_count": 2800,
  "anti_hype_forbidden": ["100 行", "百倍", "千倍", "一键生成"],
  "sections": [
    {
      "id": "1",
      "section_ref": "开头黄金钩子",
      "track": "A",
      "scene_template": "@IntroScene",
      "voice": "用 PR、AE 一帧帧剪视频？停。你有没有想过，写代码就是在写视频？...",
      "visual_instructions": "粒子背景 + 标题弹性入场 + 数字渲染生产线隐喻动画",
      "duration_hint_seconds": 30
    },
    {
      "id": "2a",
      "section_ref": "传统痛点 + VaC 三特性",
      "track": "A",
      "scene_template": "@ConceptScene",
      "voice": "传统剪辑的心智模型是什么？轨道加绝对时间轴...",
      "visual_instructions": "eyebrow + title + 三特性卡片 stagger 入场 + 逐项高亮",
      "duration_hint_seconds": 35,
      "visual_beats": [
        {"at_seconds": 0, "action": "eyebrow + title 入场"},
        {"at_seconds": 15, "action": "三特性卡片 stagger 入场"},
        {"at_seconds": 20, "action": "高亮'可版本控制'"},
        {"at_seconds": 25, "action": "高亮'可参数化批量复用'"},
        {"at_seconds": 30, "action": "高亮'AI 友好'"}
      ]
    },
    {
      "id": "2b",
      "section_ref": "帧即状态",
      "track": "A",
      "scene_template": "@ConceptScene",
      "voice": "一句话讲本质：帧即状态...",
      "visual_instructions": "帧即状态大字 + INPUT→COMPILE→OUTPUT 三步骤 + 箭头连接",
      "duration_hint_seconds": 25
    },
    {
      "id": "2c",
      "section_ref": "六条技术路线",
      "track": "A",
      "scene_template": "@TableScene",
      "voice": "代码即视频不等于 Remotion。它是一类范式...",
      "visual_instructions": "六行表逐行 stagger 入场 + highlight_row[0] + 总结高亮",
      "duration_hint_seconds": 60,
      "visual_beats": [
        {"at_seconds": 0, "action": "标题入场"},
        {"at_seconds": 10, "action": "Remotion 行入场高亮"},
        {"at_seconds": 20, "action": "Motion Canvas 行"},
        {"at_seconds": 25, "action": "Manim 行"},
        {"at_seconds": 30, "action": "MoviePy 行"},
        {"at_seconds": 35, "action": "PixiJS 行"},
        {"at_seconds": 40, "action": "FFmpeg 行"},
        {"at_seconds": 50, "action": "总结高亮'共享同一内核'"}
      ]
    },
    {
      "id": "3a",
      "section_ref": "判断层矩阵",
      "track": "A",
      "scene_template": "@TableScene",
      "voice": "判断层不是中立百科式综述，它是边界...",
      "visual_instructions": "六方案矩阵逐行入场 + 对号入座高亮 + 总结",
      "duration_hint_seconds": 80,
      "visual_beats": [
        {"at_seconds": 0, "action": "标题入场"},
        {"at_seconds": 10, "action": "Remotion 行高亮"},
        {"at_seconds": 20, "action": "Motion Canvas 行"},
        {"at_seconds": 25, "action": "Manim 行"},
        {"at_seconds": 35, "action": "MoviePy 行"},
        {"at_seconds": 40, "action": "PixiJS 行"},
        {"at_seconds": 45, "action": "FFmpeg 行"},
        {"at_seconds": 55, "action": "对号入座三行联动"},
        {"at_seconds": 70, "action": "总结 Remotion(A)+MoviePy/FFmpeg(B)"}
      ]
    },
    {
      "id": "3b",
      "section_ref": "Remotion 胜出四理由",
      "track": "A",
      "scene_template": "@ConceptScene",
      "voice": "选型不是'哪个最火选哪个'，要回到核心约束...",
      "visual_instructions": "三卡片 stagger + 强调'数据驱动模板'为决定性",
      "duration_hint_seconds": 40,
      "visual_beats": [
        {"at_seconds": 0, "action": "核心约束字幕入场"},
        {"at_seconds": 5, "action": "标题弹入"},
        {"at_seconds": 15, "action": "三卡片 stagger 入场"},
        {"at_seconds": 25, "action": "badge='决定性'强调"},
        {"at_seconds": 35, "action": "脉冲后两项"}
      ]
    },
    {
      "id": "3c",
      "section_ref": "Remotion vs HyperFrames 对照",
      "track": "A",
      "scene_template": "@SplitLayout(@ComparisonCard)",
      "voice": "一个对照就能看清区别...",
      "visual_instructions": "分屏展开 + 左右逐条入场 + 左侧微放大",
      "duration_hint_seconds": 35
    },
    {
      "id": "3d",
      "section_ref": "选型代价",
      "track": "A",
      "scene_template": "@ConceptScene",
      "voice": "代价也如实交代...",
      "visual_instructions": "三项代价卡片 + 'AI 兜住'绿色标记覆盖",
      "duration_hint_seconds": 25
    },
    {
      "id": "4a",
      "section_ref": "七阶段流水线",
      "track": "A",
      "scene_template": "@TimelineScene",
      "voice": "视频的画面能用代码控制，那制作视频的工作流本身...",
      "visual_instructions": "七阶段逐个点亮 + 全貌展示",
      "duration_hint_seconds": 40,
      "visual_beats": [
        {"at_seconds": 0, "action": "标题入场"},
        {"at_seconds": 10, "action": "01 选题点亮"},
        {"at_seconds": 15, "action": "02 策划点亮"},
        {"at_seconds": 20, "action": "03 视听高亮 current"},
        {"at_seconds": 25, "action": "04-07 快速依次点亮"},
        {"at_seconds": 35, "action": "全貌 zoom_out"}
      ]
    },
    {
      "id": "4b",
      "section_ref": "三件套",
      "track": "A",
      "scene_template": "@ConceptScene",
      "voice": "怎么做到的？三件套...",
      "visual_instructions": "三件套卡片 stagger + 箭头连接",
      "duration_hint_seconds": 25
    },
    {
      "id": "4c",
      "section_ref": "编排器伪代码",
      "track": "A",
      "scene_template": "@TerminalScene",
      "voice": "把这三件套摆出来，一个最小编排器就能驱动整条线...",
      "visual_instructions": "代码逐行打字 + 关键行高亮标注",
      "duration_hint_seconds": 35
    },
    {
      "id": "4d",
      "section_ref": "A 轨 vs B 轨 + 提示词链",
      "track": "A",
      "scene_template": "@SplitLayout",
      "voice": "真正的难点是多模态物理限制...",
      "visual_instructions": "分屏 A/B 轨对比 + 切换至提示词链打字展示",
      "duration_hint_seconds": 50,
      "visual_beats": [
        {"at_seconds": 0, "action": "分屏展开"},
        {"at_seconds": 10, "action": "A 轨高亮 badge='全自动'"},
        {"at_seconds": 20, "action": "B 轨高亮 badge='真人录制'"},
        {"at_seconds": 30, "action": "切换到终端"},
        {"at_seconds": 35, "action": "Prompt-1 打字入场"},
        {"at_seconds": 45, "action": "Prompt-2 打字入场"}
      ]
    },
    {
      "id": "5a",
      "section_ref": "数据驱动 vs 从零手写",
      "track": "A+B",
      "scene_template": "@SplitLayout(@VideoSlot / @TerminalScene)",
      "voice": "到了实操。第一个原则——首选数据驱动现成组件...",
      "visual_instructions": "左 ❌ 从零手写 / 右 ✅ 数据驱动复用 + B 轨录屏或 A 轨代码兜底",
      "duration_hint_seconds": 55,
      "b_track_required": true,
      "b_track_notes": "IDE 录屏：AI 从零手写 vs 只写 data 喂 @ComparisonCard",
      "visual_beats": [
        {"at_seconds": 0, "action": "分屏入场"},
        {"at_seconds": 10, "action": "左侧红标 ❌"},
        {"at_seconds": 15, "action": "右侧绿标 ✅"},
        {"at_seconds": 25, "action": "B 轨录屏淡入或 A 轨代码展示"},
        {"at_seconds": 40, "action": "高亮右侧数据结构"},
        {"at_seconds": 50, "action": "正确方放大强调"}
      ]
    },
    {
      "id": "5b",
      "section_ref": "SSR 守卫避坑",
      "track": "A+B",
      "scene_template": "@SplitLayout(@VideoSlot / @TerminalScene)",
      "voice": "第二个避坑点——SSR 环境约束...",
      "visual_instructions": "左 ❌ 崩溃 / 右 ✅ typeof window 守卫 + MDC 规则",
      "duration_hint_seconds": 50,
      "b_track_required": true,
      "b_track_notes": "IDE 录屏：SSR window 崩溃 → typeof 守卫 → MDC 规则写入",
      "visual_beats": [
        {"at_seconds": 0, "action": "分屏入场"},
        {"at_seconds": 10, "action": "左侧崩溃代码淡入"},
        {"at_seconds": 20, "action": "左侧震动强调"},
        {"at_seconds": 30, "action": "右侧修复代码淡入"},
        {"at_seconds": 40, "action": "右侧高亮 badge='一次通过'"}
      ]
    },
    {
      "id": "5c",
      "section_ref": "交给 AI + render 出片",
      "track": "A+B",
      "scene_template": "@ConceptScene + @TerminalScene",
      "voice": "到了最后一步——产出数据、套组件、渲染出片...",
      "visual_instructions": "概念三步 + 终端 render 命令 + 进度条动画",
      "duration_hint_seconds": 45,
      "b_track_required": false,
      "b_track_notes": "可选：终端真实录屏 npx remotion render 执行出片",
      "visual_beats": [
        {"at_seconds": 0, "action": "概念卡片入场"},
        {"at_seconds": 10, "action": "三步骤卡片入场"},
        {"at_seconds": 20, "action": "切换到终端"},
        {"at_seconds": 25, "action": "命令逐行打字"},
        {"at_seconds": 35, "action": "B 轨录屏或 A 轨进度动画"},
        {"at_seconds": 40, "action": "渲染进度 0→100%"}
      ]
    },
    {
      "id": "6",
      "section_ref": "结尾 CTA",
      "track": "A",
      "scene_template": "@OutroScene",
      "voice": "代码即视频加流程即代码，把内容生产从手工活变成可维护的工程流水线...",
      "visual_instructions": "渐变背景 + 总结文案 + CTA 打字机 + 脉冲强调",
      "duration_hint_seconds": 15
    }
  ],
  "judgment_layer_coverage": {
    "highlights_pitfall": true,
    "explains_boundary": true,
    "acceptance_standard": true,
    "ai_limitations_exposed": true
  },
  "b_track_assets_required": [
    {
      "clip_id": "b-ide-data-driven",
      "description": "IDE 录屏：数据驱动复用 @ComparisonCard（正面 ✅）+ 从零手写（反面 ❌）",
      "zoom_crop_directives": [
        {"timestamp_start": "0:00", "timestamp_end": "0:15", "zoom_level": 1.0, "description": "全貌：打开 data 配置文件"},
        {"timestamp_start": "0:15", "timestamp_end": "0:30", "zoom_level": 1.3, "description": "聚焦：data 对象 left/right 结构"},
        {"timestamp_start": "0:30", "timestamp_end": "0:45", "zoom_level": 1.2, "description": "展示：<ComparisonCard /> 渲染结果"}
      ]
    },
    {
      "clip_id": "b-ide-ssr-guard",
      "description": "IDE 录屏：SSR window 崩溃 → typeof 守卫 → .cursor/rules/remotion-ssr.mdc",
      "zoom_crop_directives": [
        {"timestamp_start": "0:00", "timestamp_end": "0:10", "zoom_level": 1.0, "description": "展示含 window.innerWidth 的组件代码"},
        {"timestamp_start": "0:10", "timestamp_end": "0:20", "zoom_level": 1.4, "description": "聚焦终端：ReferenceError 红屏"},
        {"timestamp_start": "0:20", "timestamp_end": "0:30", "zoom_level": 1.3, "description": "聚焦代码：typeof window 守卫"},
        {"timestamp_start": "0:30", "timestamp_end": "0:40", "zoom_level": 1.2, "description": "展示 .cursor/rules/remotion-ssr.mdc"}
      ]
    },
    {
      "clip_id": "b-terminal-render",
      "description": "终端录屏：npx remotion render 执行并输出 MP4（可选，有 A 轨兜底）",
      "zoom_crop_directives": [
        {"timestamp_start": "0:00", "timestamp_end": "0:10", "zoom_level": 1.0, "description": "输入命令 npx remotion render"},
        {"timestamp_start": "0:10", "timestamp_end": "0:20", "zoom_level": 1.3, "description": "聚焦渲染进度条和帧计数"}
      ]
    }
  ],
  "coverage_checklist": {
    "total": 21,
    "covered": 21,
    "items": [
      {"id": 1, "point": "传统剪辑 = 轨道+绝对时间轴", "section": "2a"},
      {"id": 2, "point": "VaC 三特性", "section": "2a"},
      {"id": 3, "point": "帧即状态", "section": "2b"},
      {"id": 4, "point": "≠Remotion 六条路线", "section": "2c"},
      {"id": 5, "point": "判断层=边界", "section": "3a"},
      {"id": 6, "point": "6方案矩阵", "section": "3a"},
      {"id": 7, "point": "对号入座", "section": "3a"},
      {"id": 8, "point": "核心约束", "section": "3b"},
      {"id": 9, "point": "四理由", "section": "3b"},
      {"id": 10, "point": "Remotion vs HyperFrames", "section": "3c"},
      {"id": 11, "point": "选型代价", "section": "3d"},
      {"id": 12, "point": "三件套", "section": "4b"},
      {"id": 13, "point": "七阶段流水线", "section": "4a"},
      {"id": 14, "point": "编排器伪代码", "section": "4c"},
      {"id": 15, "point": "A轨全自动/B轨真人", "section": "4d"},
      {"id": 16, "point": "提示词链", "section": "4d"},
      {"id": 17, "point": "数据驱动vs从零手写", "section": "5a"},
      {"id": 18, "point": "SSR守卫", "section": "5b"},
      {"id": 19, "point": "交给AI做好", "section": "5c"},
      {"id": 20, "point": "代码即视频+流程即代码=工程流水线", "section": "6"},
      {"id": 21, "point": "关注+下期预告", "section": "6"}
    ]
  }
}
```
