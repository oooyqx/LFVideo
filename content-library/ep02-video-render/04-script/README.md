---
stage: 04-script
platform: bilibili
status: draft
source_workflow: /04-script-draft
---

# ep02 视频脚本：用 Vibe Coding 搭一套能自动出片的视频渲染引擎

> 本脚本基于 `02-plan/tutorial.final.md`（status: approved）内容真相源撰写，逐条覆盖末尾「必讲要点覆盖清单」。VRM 数字人选型已迁至 EP03，本期不涉及。

---

## 第一段：【@IntroScene → @ArchitectureScene → @CalloutScene → @FlowScene】开场（目标 43s）

- **[画面]**
  - **[镜头 1.1]** `@IntroScene`（8s）。Props title="用 Vibe Coding 搭一套能自动出片的视频渲染引擎", subtitle="EP02 · 视频渲染"
    - visual_beats: [{at_seconds:0, action:"主标题渐入"}, {at_seconds:4, action:"副标题淡入"}]
  - **[镜头 1.2]** `@ArchitectureScene`（18s）。Props eyebrow="全景", title="视频生产线全貌", nodes=[{level:0, label:"输入", title:"选题", desc:"AI 罗列选题、人拍板", icon:"🎯"}, {level:1, label:"脚本", title:"脚本+分镜", desc:"AI 写脚本、人审稿", icon:"📝"}, {level:2, label:"配音", title:"TTS 合成", desc:"文本转语音", icon:"🎙️"}, {level:2, label:"渲染", title:"Remotion 出片", desc:"配置→组件→帧→视频", icon:"🎬"}, {level:2, label:"字幕", title:"字幕生成", desc:"语音时间戳→SRT", icon:"💬"}, {level:3, label:"输出", title:"成片", desc:"多平台分发", icon:""}], edges=[{from:0, to:1}, {from:1, to:2}, {from:1, to:3}, {from:1, to:4}, {from:2, to:5}, {from:3, to:5}, {from:4, to:5}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"L0→L1 节点入场"}, {at_seconds:7, action:"L2 三个节点依次 stagger"}, {at_seconds:12, action:"L3 输出节点入场 + 连线高亮"}]
  - **[镜头 1.3]** `@CalloutScene`（7s）。Props callout_type="tip", title="关键认知", text="AI 最强的是处理文本和代码，所以渲染最好用文本和数据来驱动"
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"大字渐入"}]
  - **[镜头 1.4]** `@FlowScene`（6s）。Props eyebrow="本期三步", title="", steps=[{label:"找技术路径", desc:"让 AI 罗列现成路线", icon:"🔍"}, {label:"技术选型", desc:"对着约束拍板", icon:"⚖️"}, {label:"技术落地", desc:"AI 驱动自动出片", icon:"🚀"}], orientation="horizontal"
    - visual_beats: [{at_seconds:0, action:"三步卡片依次入场"}]

- **[口播]** 怎么用 Vibe Coding，把选题、脚本、配音、渲染、字幕这条视频生产线全部自动化？这一期只讲最核心的一环：视频自动渲染。整条线从选题到成片：选题 AI 列、人定，脚本 AI 写、人审，配音和字幕自动生成，渲染交给 Remotion 按配置出片。AI 最强的本事是处理文本和代码，所以渲染最好也用文本和数据来驱动。整件事分三步：找技术路径、技术选型、技术落地。

---

## 第二段：【@ChatScene → @StatScene → @TableScene → @CalloutScene】找技术路径（目标 50s）

- **[画面]**
  - **[镜头 2.1]** `@ChatScene`（12s）。Props title="找技术路径", messages=[{role:"user", text:"我想把视频做成代码配置自动出片，有哪些现成路线？各自用什么描述画面？"}, {role:"assistant", text:"六条现成路线：Remotion、Motion Canvas、Manim、MoviePy、PixiJS、FFmpeg。内核都一样——代码描述画面 → 编译成帧 → 合成视频。详见下表。"}]
    - visual_beats: [{at_seconds:0, action:"聊天窗口淡入"}, {at_seconds:3, action:"用户消息入场"}, {at_seconds:7, action:"AI 消息入场"}]
  - **[镜头 2.2]** `@StatScene`（4s）。Props stat="6现成路线", label=""
    - visual_beats: [{at_seconds:0, action:"数字弹入"}, {at_seconds:2, action:"标签淡入"}]
  - **[镜头 2.3]** `@TableScene`（22s）。Props title="六条现成路线", headers=["路线", "代表工具", "用什么描述画面", "适合干什么"], rows=[["网页渲染", "Remotion", "React 组件 + CSS/SVG", "前端栈、复杂排版、模板复用"], ["代码声明动画", "Motion Canvas / Revideo", "函数描述动画时序", "代码演示、讲解类动画"], ["数学公式动画", "Manim", "Python 描述几何/公式", "数学、算法可视化"], ["像素脚本拼接", "MoviePy", "Python 操作像素 + FFmpeg", "纯 Python、简单拼接"], ["画布/游戏引擎", "PixiJS / Cocos", "Canvas 上逐帧画", "复杂粒子、游戏化动画"], ["命令行合成", "FFmpeg + 脚本", "命令拼接", "批量转码、轻量字幕烧录"]], highlightCell="1-1", enter="rise"
    - visual_beats: [{at_seconds:0, action:"表头淡入"}, {at_seconds:3, action:"六行依次 stagger 入场"}, {at_seconds:18, action:"高亮 Remotion 行"}]
  - **[镜头 2.4]** `@CalloutScene`（11s）。Props callout_type="tip", title="共同内核", text="代码描述画面 → 编译成帧 → 合成视频", items=["六路同源：区别只在用什么语言、什么引擎"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:4, action:"要点入场"}]

- **[口播]** 第一步，找技术路径。把问题丢给 AI：我想把视频做成代码配置自动出片，有哪些现成路线？AI 列出来六条现成路线。Remotion 用 React 组件描述画面，Motion Canvas 用函数描述动画时序，Manim 用 Python 描述几何公式，MoviePy 用 Python 操作像素，PixiJS 在画布上逐帧画，FFmpeg 用命令拼接。它们内核都一样：用代码或数据描述画面，程序编译成帧，再合成视频。区别只在用什么语言、什么引擎。

---

## 第三段：【@TableScene → @ConceptScene → @CalloutScene → @SplitLayout】技术选型（目标 60s）

- **[画面]**
  - **[镜头 3.1]** `@TableScene`（20s）。Props title="全方位对比：核心优势 + 劣势", headers=["方案", "核心优势", "劣势"], rows=[["Remotion", "前端 React 栈、复杂排版强、模板跨期复用、命令行易自动化", "不擅纯后台超长批处理；打包读浏览器对象会崩；BUSL 授权"], ["Motion Canvas / Revideo", "代码声明动画、时序精确", "组件排版生态小，复杂网页排版吃力"], ["Manim", "数学/公式/算法可视化专业", "学习曲线陡、排版弱、渲染慢"], ["MoviePy", "纯 Python、简单拼接", "文字排版繁琐、多层画布吃内存"], ["PixiJS / Cocos", "游戏级复杂粒子动画", "文字对齐计算复杂"], ["FFmpeg + 脚本", "批量转码、字幕烧录", "语法晦涩、做不了复杂动效"]], highlightCell="1-1", enter="rise"
    - visual_beats: [{at_seconds:0, action:"表头淡入"}, {at_seconds:3, action:"六行依次 stagger，高亮 Remotion 行"}, {at_seconds:15, action:"Zoom 聚焦劣势列"}]
  - **[镜头 3.2]** `@ConceptScene`（15s）。Props eyebrow="约束 → 选定", title="Remotion 胜出", items=[{label:"约束一", title:"固定模板换数据复用", desc:"React 组件 + 数据分离，改一处全系列生效", icon:"🔄"}, {label:"约束二", title:"让 AI 接手最稳", desc:"只填数据套现成组件，不让它自由发挥结构", icon:"🤖"}, {label:"约束三", title:"网页生态现成", desc:"CSS、动效、图表库随手拿", icon:"📦"}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:5, action:"第二张卡片入场"}, {at_seconds:10, action:"第三张卡片入场"}]
  - **[镜头 3.3]** `@CalloutScene`（10s）。Props callout_type="info", title="代价如实说", text="React 栈 + BUSL 授权", items=["BUSL：规模化要付费，个人和小团队免费够用", "React 栈：AI 语料最厚的领域，不构成门槛"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"两条要点依次入场"}]
  - **[镜头 3.4]** `@SplitLayout`（15s）。Props title="Remotion vs 直接用 HTML", leftLabel="Remotion", leftValue="模板复用、类型约束、十期后还能管", rightLabel="HTML 绘制页面", rightValue="每期复制改、越改越乱、无类型兜底"
    - visual_beats: [{at_seconds:0, action:"左右卡片同时淡入"}, {at_seconds:8, action:"左侧高亮"}]

- **[口播]** 路摆出来了，但选哪条得人来判断。AI 默认给一份四平八稳的百科对比，个个说好话，帮不了决策。真正能帮你拍板的，是把每条路的核心优势和劣势都摆到台面上。所以追问一句：每个方案的核心优势是什么？劣势和不适用的场景又在哪？AI 给出答案后，回到自己的需求：固定模板换数据批量复用、让 AI 改内容不容易出错、跨期好维护。这几条约束卡下来，Remotion 胜出。模板换数据复用，React 组件加数据分离，改一处主题全系列生效。让 AI 接手最稳，每期只填数据套现成组件，不让它自由发挥结构。网页生态现成，CSS、动效、图表库随手拿。代价也有：React 栈加 BUSL 授权，规模化要付费。但这不构成门槛，个人和小团队免费够用。和直接用 HTML 绘制页面比，Remotion 的模板复用和类型约束是 HTML 给不了的——十期之后还能管，不会越改越乱。

---

## 第四段：【@FlowScene → @StatScene → @BulletScene → @QuoteScene】技术落地·Remotion 怎么工作（目标 55s）

- **[画面]**
  - **[镜头 4.1]** `@FlowScene`（15s）。Props eyebrow="Remotion 工作原理", title="用 React 写页面 → 引擎逐帧截图 → 合成视频", steps=[{label:"React 描述每帧", desc:"组件 + CSS 写画面和动画", icon:"⚛️"}, {label:"无头浏览器截图", desc:"引擎逐帧渲染成图片", icon:"📸"}, {label:"FFmpeg 合成", desc:"帧序列拼成 MP4", icon:"🎞️"}], orientation="horizontal"
    - visual_beats: [{at_seconds:0, action:"第一步卡片入场"}, {at_seconds:5, action:"第二步卡片入场"}, {at_seconds:10, action:"第三步卡片入场"}]
  - **[镜头 4.2]** `@StatScene`（4s）。Props stat="4条理由", label=""
    - visual_beats: [{at_seconds:0, action:"数字弹入"}, {at_seconds:2, action:"标签淡入"}]
  - **[镜头 4.3]** `@BulletScene`（15s）。Props eyebrow="为什么 AI 能轻松驱动", title="理由一、二", items=["写的就是网页：React/CSS 是 AI 语料最厚的领域", "改数据就改片：内容模板分离，AI 改数据就出不同的片"], ordered=true
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"两条依次 stagger 入场"}]
  - **[镜头 4.4]** `@BulletScene`（15s）。Props eyebrow="为什么 AI 能轻松驱动", title="理由三、四", items=["类型兜底：TypeScript 定死字段，填错漏填立刻报错", "出片全自动：逐帧截图合成不用人盯着"], ordered=true
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"两条依次 stagger 入场"}]
  - **[镜头 4.5]** `@QuoteScene`（5s）。Props text="把视频写成数据，AI 只填空、不乱跑"
    - visual_beats: [{at_seconds:0, action:"引号装饰淡入"}, {at_seconds:3, action:"大字渐入"}]

- **[口播]** 路线定了，看 Remotion 大致怎么干活。一句话：用 React 写页面和动画，引擎逐帧截图再合成视频。这套流程对 AI 特别友好。为什么？四条理由。写的就是网页，React 加 CSS，这正是 AI 训练语料里最厚的一块，写起来最熟、最不容易错。改数据就改片，内容和模板分离，AI 改数据就能出不同的片。类型兜底，字段格式用 TypeScript 定死，填错漏填立刻报错，乱发挥的空间被压到最小。出片全自动，写好页面和数据，逐帧截图合成成片全由引擎自动完成，不用人盯着。把视频写成数据，AI 只填空、不乱跑。

---

## 第五段：【@ArchitectureScene → @TerminalScene → @StatScene → @BulletScene → @SplitLayout → @CalloutScene】技术落地·配置分发与配置即内容（目标 65s）

- **[画面]**
  - **[镜头 5.1]** `@ArchitectureScene`（15s）。Props eyebrow="引擎怎么干活", title="一份配置 → Explainer 按 type 分发", nodes=[{level:0, label:"输入", title:"写一份配置", desc:"说清这段是什么画面、叠什么", icon:"📄"}, {level:1, label:"分发", title:"Explainer", desc:"按 type 字段自动匹配", icon:"🔀"}, {level:2, label:"场景", title:"intro_scene", desc:"开场大字报", icon:"🎬"}, {level:2, label:"场景", title:"table_scene", desc:"通用表格", icon:"📊"}, {level:2, label:"场景", title:"code_scene", desc:"合成终端", icon:"💻"}, {level:2, label:"场景", title:"chart_scene", desc:"图表", icon:"📈"}], edges=[{from:0, to:1}, {from:1, to:2}, {from:1, to:3}, {from:1, to:4}, {from:1, to:5}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"L0→L1 节点入场"}, {at_seconds:6, action:"L2 四个场景节点依次 stagger"}, {at_seconds:12, action:"连线高亮"}]
  - **[镜头 5.2]** `@TerminalScene`（15s）。Props terminalTitle="comparison_scene 配置示例", prompt=">", steps=[{kind:"cmd", text:"type: comparison_scene"}, {kind:"cmd", text:"title: 传统剪辑 vs 代码即视频"}, {kind:"cmd", text:"leftLabel: 传统剪辑"}, {kind:"cmd", text:"leftValue: 拖时间轴，改一处全手工重排"}, {kind:"cmd", text:"rightLabel: 代码即视频"}, {kind:"cmd", text:"rightValue: 改一行配置，重新编译出片"}]
    - visual_beats: [{at_seconds:0, action:"终端窗口淡入"}, {at_seconds:2, action:"命令逐行打出"}]
  - **[镜头 5.3]** `@StatScene`（4s）。Props stat="10+ 场景模板", label=""
    - visual_beats: [{at_seconds:0, action:"数字弹入"}, {at_seconds:2, action:"标签淡入"}]
  - **[镜头 5.4]** `@BulletScene`（15s）。Props eyebrow="现成模板场景", title="做内容 = 挑组件、填字段", items=["开场收尾大字报、概念卡列表、要点清单", "流程图、通用表格、左右对比、图表", "核心数字、提示避坑框、金句、章节分隔", "合成终端演示命令报错，无需真录屏"], ordered=false
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"四条依次 stagger"}]
  - **[镜头 5.5]** `@SplitLayout`（8s）。Props title="让 AI 填数据，别造组件", leftLabel="✅ 只填配置", leftValue="挑现成组件、填字段", rightLabel="❌ 从零手写", rightValue="重复造轮子，复用好处没了"
    - visual_beats: [{at_seconds:0, action:"左右卡片淡入"}, {at_seconds:4, action:"左侧高亮"}]
  - **[镜头 5.6]** `@CalloutScene`（7s）。Props callout_type="tip", title="后续单独开一期", text="自有风格组件库", items=["在现成组件上扩品牌化模板", "本期先用现成组件跑通"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"要点入场"}]

- **[口播]** 引擎怎么干活？规则很直白：写一份配置，说清这段是什么画面、上面叠什么，主程序 Explainer 就按配置里的 type 字段自动找到对应组件去渲染。要个对比卡，就说做个对比卡，AI 产出的就是这份配置。十几种场景模板都现成。从开场片头到数据图表、从对比卡到合成终端，这些模板共用一套深色科技风主题，改一处全系列生效。做内容就是挑组件、填字段。每个 type 的字段都用 TypeScript 定死了格式，填错漏填编译时立刻报错。想在现成组件上扩一套自有风格组件库也行，那是更大的话题，后续单独开一期。

---

## 第六段：【@BulletScene → @SplitLayout → @CalloutScene】场景适配（目标 50s）

- **[画面]**
  - **[镜头 6.1]** `@BulletScene`（15s）。Props eyebrow="适合纯自动渲染", title="画面用文本数据就能说清", items=["概念讲解 / 认知框架", "数据图表 / 对比 / 核心指标", "开场片头 / 章节分隔 / 片尾 CTA", "合成终端演示命令报错，无需真录屏"], ordered=false
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"四条依次 stagger"}]
  - **[镜头 6.2]** `@SplitLayout`（13s）。Props title="主体真实 → 退居叠层", leftLabel="独占整屏", leftValue="主体是讲解/数据时，Remotion 全屏渲染", rightLabel="退居叠层", rightValue="主体是录屏/口播时，渲透明背景叠层贴上去"
    - visual_beats: [{at_seconds:0, action:"左右卡片同时淡入"}, {at_seconds:6, action:"右侧高亮"}]
  - **[镜头 6.3]** `@CalloutScene`（12s）。Props callout_type="warning", title="不适合，别硬上", text="这些场景该用专业工具", items=["实拍人物产品——该拍就拍", "写实对口型数字人——恐怖谷、可信度崩", "影视级特效 / 逐帧手绘——交专业工具", "纯后台超长批处理——FFmpeg 更划算"]
    - visual_beats: [{at_seconds:0, action:"警告框淡入"}, {at_seconds:3, action:"四条依次入场"}]
  - **[镜头 6.4]** `@QuoteScene`（5s）。Props text="主体真实→退居叠层，主体讲解→独占整屏"
    - visual_beats: [{at_seconds:0, action:"引号装饰淡入"}, {at_seconds:3, action:"大字渐入"}]

- **[口播]** 引擎跑通了，更值钱的判断是什么场景该用、什么场景别硬上。适合纯自动渲染的：概念讲解、数据图表、开场片头、章节分隔、合成终端演示命令报错——画面用文本和数据就能说清，换数据批量复用。可以搭配着用的：主体是真人口播或真实录屏时，Remotion 渲成透明背景的悬浮叠层贴上去，数据卡、字幕、角标、箭头标注。不适合的：实拍人物产品、写实对口型数字人、影视级特效、纯后台超长批处理——该拍就拍，该用专业工具就用专业工具。主体是真实画面时退居叠层，主体是讲解数据时独占整屏。

---

## 第七段：【@FlowScene → @OutroScene】总结 + CTA（目标 30s）

- **[画面]**
  - **[镜头 7.1]** `@FlowScene`（15s）。Props eyebrow="三步回顾", title="", steps=[{label:"找路径", desc:"AI 罗列现成路线", icon:"🔍"}, {label:"选型", desc:"人结合约束拍板", icon:"⚖️"}, {label:"落地", desc:"AI 填配置套组件跑渲染", icon:"🚀"}], orientation="horizontal"
    - visual_beats: [{at_seconds:0, action:"三步卡片依次入场（首尾呼应第一段）"}]
  - **[镜头 7.2]** `@OutroScene`（15s）。Props headline="不吹AI，真落地，真开源", cta="关注 · 一起用 AI 构建能落地、可复现的工作流"
    - visual_beats: [{at_seconds:0, action:"品牌卡淡入"}, {at_seconds:5, action:"CTA 按钮脉冲"}]

- **[口播]** 三步走完：找路径，AI 罗列现成路线；选型，人结合约束拍板；落地，AI 填配置套组件跑渲染。会讲需求、会判断验收，就能复制这套。下期渲染场景搭建：实战多场景叠加、全息屏效果，再把 VRM 主持人迁移进引擎。

---

## 必讲要点覆盖核对

### 一、开场（钩子）
- [x] 一句话点题：本期用 Vibe Coding 解决"视频自动渲染"这一核心环节
- [x] 关键认知钩子：AI 最强的是处理文本/代码 → 渲染最好用文本/代码/数据驱动
- [x] 三步路线图：找技术路径 → 技术选型 → 技术落地

### 二、找技术路径
- [x] 让 AI 罗列多条路线：Remotion / Motion Canvas·Revideo / Manim / MoviePy / PixiJS·Cocos / FFmpeg
- [x] 点明共同内核："代码/数据描述画面 → 编译成帧 → 合成视频"；此处只列不评

### 三、技术选型
- [x] 让 AI 做全方位对比：列清每条路的核心优势与劣势，人对着约束做减法
- [x] 回到自己的约束（固定模板批量复用 / 让 AI 接手 / 跨期维护）→ 为什么选 Remotion
- [x] Remotion vs 直接使用 HTML 绘制页面 的对照；授权口径如实说（React 栈 + BUSL 授权），不渲染成门槛

### 四、技术落地：Remotion 自动化视频渲染（AI 驱动）
- [x] Remotion 大致怎么工作：用 React 写页面及动画 → 引擎逐帧截图自动合成、无需人工干预
- [x] 为什么 AI 能轻松驱动：写的就是网页（React/CSS 语料厚）、改数据就改片、TypeScript 类型兜底（填错即报错）、出片全自动
- [x] 引擎怎么干活：一份配置 → `Explainer` 按 `type` 分发到组件；现成模板场景共用统一主题皮肤（科技风 + 白字，改一处全系列生效）
- [x] 组件清单（现状）：`intro/outro/concept/bullet/flow/table/comparison/chart/stat/callout/quote/section_scene` + `code_scene/screenshot_scene` 合成演示无需真录
- [x] 自有风格组件库：可在现成组件上扩品牌化模板，是更大话题、后续单独开一期（本期只一句带过）
- [x] 配置即内容：让 AI 填字段、别造组件；TypeScript 字段类型兜底，AI 乱发挥空间最小

### 五、用在哪：场景适配
- [x] 适合纯自动渲染：模板化讲解 / 数据图表 / 片头分隔片尾 / 合成终端演示
- [x] 可搭配着用：真人口播或录屏为主时，Remotion 渲透明背景叠层（数据卡/字幕/角标/Zoom 高亮/画中画边框）——透明导出标 `paper_spec`
- [x] 不适合：实拍物理世界 / 写实对口型数字人（恐怖谷）/ 影视级特效与逐帧手绘 / 纯后台超长批处理

### 六、总结 + 结尾 CTA
- [x] 三步法回顾 + "没编程基础也能复制"的落点
- [x] 关注引导 + 下期预告（EP03 渲染场景搭建：多场景叠加 + 全息屏 + VRM 主持人迁移）

---

```json
{
  "title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎",
  "platform": "bilibili",
  "anti_hype_forbidden": ["一键出片", "百倍效率", "碾压", "秒出", "一行搞定"],
  "video_spec": { "aspect_ratio": "16:9", "resolution": "1920x1080", "fps": 30 },
  "estimated_duration_seconds": 338,
  "total_word_count": 1630,
  "sections": [
    {
      "id": "1",
      "track": "A",
      "voice": "怎么用 Vibe Coding，把选题、脚本、配音、渲染、字幕这条视频生产线全部自动化？这一期只讲最核心的一环：视频自动渲染。整条线从选题到成片：选题 AI 列、人定，脚本 AI 写、人审，配音和字幕自动生成，渲染交给 Remotion 按配置出片。AI 最强的本事是处理文本和代码，所以渲染最好也用文本和数据来驱动。整件事分三步：找技术路径、技术选型、技术落地。",
      "visual_instructions": "@IntroScene 开场大字报 → @ArchitectureScene 生产线全景 → @CalloutScene 关键认知 → @FlowScene 三步路线图",
      "duration_hint_seconds": 43,
      "shots": [
        {
          "id": "1.1",
          "scene_template": "@IntroScene",
          "props": { "title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎", "subtitle": "EP02 · 视频渲染" },
          "voice_slice": "怎么用 Vibe Coding，把选题、脚本、配音、渲染、字幕这条视频生产线全部自动化？",
          "duration_seconds": 8,
          "visual_beats": [
            { "at_seconds": 0, "action": "主标题渐入" },
            { "at_seconds": 4, "action": "副标题淡入" }
          ]
        },
        {
          "id": "1.2",
          "scene_template": "@ArchitectureScene",
          "props": { "eyebrow": "全景", "title": "视频生产线全貌", "nodes": [{ "level": 0, "label": "输入", "title": "选题", "desc": "AI 罗列选题、人拍板", "icon": "🎯" }, { "level": 1, "label": "脚本", "title": "脚本+分镜", "desc": "AI 写脚本、人审稿", "icon": "📝" }, { "level": 2, "label": "配音", "title": "TTS 合成", "desc": "文本转语音", "icon": "🎙️" }, { "level": 2, "label": "渲染", "title": "Remotion 出片", "desc": "配置→组件→帧→视频", "icon": "🎬" }, { "level": 2, "label": "字幕", "title": "字幕生成", "desc": "语音时间戳→SRT", "icon": "💬" }, { "level": 3, "label": "输出", "title": "成片", "desc": "多平台分发", "icon": "�" }], "edges": [{ "from": 0, "to": 1 }, { "from": 1, "to": 2 }, { "from": 1, "to": 3 }, { "from": 1, "to": 4 }, { "from": 2, "to": 5 }, { "from": 3, "to": 5 }, { "from": 4, "to": 5 }] },
          "voice_slice": "这一期只讲最核心的一环：视频自动渲染。整条线从选题到成片：选题 AI 列、人定，脚本 AI 写、人审，配音和字幕自动生成，渲染交给 Remotion 按配置出片。",
          "duration_seconds": 18,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "L0→L1 节点入场" },
            { "at_seconds": 7, "action": "L2 三个节点依次 stagger" },
            { "at_seconds": 12, "action": "L3 输出节点入场 + 连线高亮" }
          ]
        },
        {
          "id": "1.3",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "关键认知", "text": "AI 最强的是处理文本和代码，所以渲染最好用文本和数据来驱动" },
          "voice_slice": "AI 最强的本事是处理文本和代码，所以渲染最好也用文本和数据来驱动。",
          "duration_seconds": 7,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "大字渐入" }
          ]
        },
        {
          "id": "1.4",
          "scene_template": "@FlowScene",
          "props": { "eyebrow": "本期三步", "title": "", "steps": [{ "label": "找技术路径", "desc": "让 AI 罗列现成路线", "icon": "🔍" }, { "label": "技术选型", "desc": "对着约束拍板", "icon": "⚖️" }, { "label": "技术落地", "desc": "AI 驱动自动出片", "icon": "🚀" }], "orientation": "horizontal" },
          "voice_slice": "整件事分三步：找技术路径、技术选型、技术落地。",
          "duration_seconds": 6,
          "visual_beats": [
            { "at_seconds": 0, "action": "三步卡片依次入场" }
          ]
        }
      ]
    },
    {
      "id": "2",
      "track": "A",
      "voice": "第一步，找技术路径。把问题丢给 AI：我想把视频做成代码配置自动出片，有哪些现成路线？AI 列出来六条现成路线。Remotion 用 React 组件描述画面，Motion Canvas 用函数描述动画时序，Manim 用 Python 描述几何公式，MoviePy 用 Python 操作像素，PixiJS 在画布上逐帧画，FFmpeg 用命令拼接。它们内核都一样：用代码或数据描述画面，程序编译成帧，再合成视频。区别只在用什么语言、什么引擎。",
      "visual_instructions": "@ChatScene 提问 → @StatScene 六条路线 → @TableScene 六条路线矩阵 → @CalloutScene 共同内核",
      "duration_hint_seconds": 50,
      "shots": [
        {
          "id": "2.1",
          "scene_template": "@ChatScene",
          "props": { "title": "找技术路径", "messages": [{ "role": "user", "text": "我想把视频做成代码配置自动出片，有哪些现成路线？各自用什么描述画面？" }, { "role": "assistant", "text": "六条现成路线：Remotion、Motion Canvas、Manim、MoviePy、PixiJS、FFmpeg。内核都一样——代码描述画面 → 编译成帧 → 合成视频。详见下表。" }] },
          "voice_slice": "第一步，找技术路径。把问题丢给 AI：我想把视频做成代码配置自动出片，有哪些现成路线？",
          "duration_seconds": 12,
          "visual_beats": [
            { "at_seconds": 0, "action": "聊天窗口淡入" },
            { "at_seconds": 3, "action": "用户消息入场" },
            { "at_seconds": 7, "action": "AI 消息入场" }
          ]
        },
        {
          "id": "2.2",
          "scene_template": "@StatScene",
          "props": { "stat": "6现成路线", "label": "" },
          "voice_slice": "AI 列出来六条现成路线。",
          "duration_seconds": 4,
          "visual_beats": [
            { "at_seconds": 0, "action": "数字弹入" },
            { "at_seconds": 2, "action": "标签淡入" }
          ]
        },
        {
          "id": "2.3",
          "scene_template": "@TableScene",
          "props": { "title": "六条现成路线", "headers": ["路线", "代表工具", "用什么描述画面", "适合干什么"], "rows": [["网页渲染", "Remotion", "React 组件 + CSS/SVG", "前端栈、复杂排版、模板复用"], ["代码声明动画", "Motion Canvas / Revideo", "函数描述动画时序", "代码演示、讲解类动画"], ["数学公式动画", "Manim", "Python 描述几何/公式", "数学、算法可视化"], ["像素脚本拼接", "MoviePy", "Python 操作像素 + FFmpeg", "纯 Python、简单拼接"], ["画布/游戏引擎", "PixiJS / Cocos", "Canvas 上逐帧画", "复杂粒子、游戏化动画"], ["命令行合成", "FFmpeg + 脚本", "命令拼接", "批量转码、轻量字幕烧录"]], "highlightCell": "1-1", "enter": "rise" },
          "voice_slice": "Remotion 用 React 组件描述画面，Motion Canvas 用函数描述动画时序，Manim 用 Python 描述几何公式，MoviePy 用 Python 操作像素，PixiJS 在画布上逐帧画，FFmpeg 用命令拼接。",
          "duration_seconds": 22,
          "visual_beats": [
            { "at_seconds": 0, "action": "表头淡入" },
            { "at_seconds": 3, "action": "六行依次 stagger 入场" },
            { "at_seconds": 18, "action": "高亮 Remotion 行" }
          ]
        },
        {
          "id": "2.4",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "共同内核", "text": "代码描述画面 → 编译成帧 → 合成视频", "items": ["六路同源：区别只在用什么语言、什么引擎"] },
          "voice_slice": "它们内核都一样：用代码或数据描述画面，程序编译成帧，再合成视频。区别只在用什么语言、什么引擎。",
          "duration_seconds": 11,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 4, "action": "要点入场" }
          ]
        }
      ]
    },
    {
      "id": "3",
      "track": "A",
      "voice": "路摆出来了，但选哪条得人来判断。AI 默认给一份四平八稳的百科对比，个个说好话，帮不了决策。真正能帮你拍板的，是把每条路的核心优势和劣势都摆到台面上。所以追问一句：每个方案的核心优势是什么？劣势和不适用的场景又在哪？AI 给出答案后，回到自己的需求：固定模板换数据批量复用、让 AI 改内容不容易出错、跨期好维护。这几条约束卡下来，Remotion 胜出。模板换数据复用，React 组件加数据分离，改一处主题全系列生效。让 AI 接手最稳，每期只填数据套现成组件，不让它自由发挥结构。网页生态现成，CSS、动效、图表库随手拿。代价也有：React 栈加 BUSL 授权，规模化要付费。但这不构成门槛，个人和小团队免费够用。和直接用 HTML 绘制页面比，Remotion 的模板复用和类型约束是 HTML 给不了的——十期之后还能管，不会越改越乱。",
      "visual_instructions": "@TableScene 全方位对比矩阵 → @ConceptScene 约束选定 → @CalloutScene 代价如实说 → @SplitLayout Remotion vs HTML",
      "duration_hint_seconds": 60,
      "shots": [
        {
          "id": "3.1",
          "scene_template": "@TableScene",
          "props": { "title": "全方位对比：核心优势 + 劣势", "headers": ["方案", "核心优势", "劣势"], "rows": [["Remotion", "前端 React 栈、复杂排版强、模板跨期复用、命令行易自动化", "不擅纯后台超长批处理；打包读浏览器对象会崩；BUSL 授权"], ["Motion Canvas / Revideo", "代码声明动画、时序精确", "组件排版生态小，复杂网页排版吃力"], ["Manim", "数学/公式/算法可视化专业", "学习曲线陡、排版弱、渲染慢"], ["MoviePy", "纯 Python、简单拼接", "文字排版繁琐、多层画布吃内存"], ["PixiJS / Cocos", "游戏级复杂粒子动画", "文字对齐计算复杂"], ["FFmpeg + 脚本", "批量转码、字幕烧录", "语法晦涩、做不了复杂动效"]], "highlightCell": "1-1", "enter": "rise" },
          "voice_slice": "路摆出来了，但选哪条得人来判断。AI 默认给一份四平八稳的百科对比，个个说好话，帮不了决策。真正能帮你拍板的，是把每条路的核心优势和劣势都摆到台面上。所以追问一句：每个方案的核心优势是什么？劣势和不适用的场景又在哪？",
          "duration_seconds": 20,
          "visual_beats": [
            { "at_seconds": 0, "action": "表头淡入" },
            { "at_seconds": 3, "action": "六行依次 stagger，高亮 Remotion 行" },
            { "at_seconds": 15, "action": "Zoom 聚焦劣势列" }
          ]
        },
        {
          "id": "3.2",
          "scene_template": "@ConceptScene",
          "props": { "eyebrow": "约束 → 选定", "title": "Remotion 胜出", "items": [{ "label": "约束一", "title": "固定模板换数据复用", "desc": "React 组件 + 数据分离，改一处全系列生效", "icon": "🔄" }, { "label": "约束二", "title": "让 AI 接手最稳", "desc": "只填数据套现成组件，不让它自由发挥结构", "icon": "🤖" }, { "label": "约束三", "title": "网页生态现成", "desc": "CSS、动效、图表库随手拿", "icon": "📦" }] },
          "voice_slice": "AI 给出答案后，回到自己的需求：固定模板换数据批量复用、让 AI 改内容不容易出错、跨期好维护。这几条约束卡下来，Remotion 胜出。模板换数据复用，React 组件加数据分离，改一处主题全系列生效。让 AI 接手最稳，每期只填数据套现成组件，不让它自由发挥结构。网页生态现成，CSS、动效、图表库随手拿。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 5, "action": "第二张卡片入场" },
            { "at_seconds": 10, "action": "第三张卡片入场" }
          ]
        },
        {
          "id": "3.3",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "info", "title": "代价如实说", "text": "React 栈 + BUSL 授权", "items": ["BUSL：规模化要付费，个人和小团队免费够用", "React 栈：AI 语料最厚的领域，不构成门槛"] },
          "voice_slice": "代价也有：React 栈加 BUSL 授权，规模化要付费。但这不构成门槛，个人和小团队免费够用。",
          "duration_seconds": 10,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "两条要点依次入场" }
          ]
        },
        {
          "id": "3.4",
          "scene_template": "@SplitLayout",
          "props": { "title": "Remotion vs 直接用 HTML", "leftLabel": "Remotion", "leftValue": "模板复用、类型约束、十期后还能管", "rightLabel": "HTML 绘制页面", "rightValue": "每期复制改、越改越乱、无类型兜底" },
          "voice_slice": "和直接用 HTML 绘制页面比，Remotion 的模板复用和类型约束是 HTML 给不了的——十期之后还能管，不会越改越乱。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "左右卡片同时淡入" },
            { "at_seconds": 8, "action": "左侧高亮" }
          ]
        }
      ]
    },
    {
      "id": "4",
      "track": "A",
      "voice": "路线定了，看 Remotion 大致怎么干活。一句话：用 React 写页面和动画，引擎逐帧截图再合成视频。这套流程对 AI 特别友好。为什么？四条理由。写的就是网页，React 加 CSS，这正是 AI 训练语料里最厚的一块，写起来最熟、最不容易错。改数据就改片，内容和模板分离，AI 改数据就能出不同的片。类型兜底，字段格式用 TypeScript 定死，填错漏填立刻报错，乱发挥的空间被压到最小。出片全自动，写好页面和数据，逐帧截图合成成片全由引擎自动完成，不用人盯着。把视频写成数据，AI 只填空、不乱跑。",
      "visual_instructions": "@FlowScene 三步管线 → @StatScene 四条理由 → @BulletScene 四条理由 → @QuoteScene 金句收束",
      "duration_hint_seconds": 55,
      "shots": [
        {
          "id": "4.1",
          "scene_template": "@FlowScene",
          "props": { "eyebrow": "Remotion 工作原理", "title": "用 React 写页面 → 引擎逐帧截图 → 合成视频", "steps": [{ "label": "React 描述每帧", "desc": "组件 + CSS 写画面和动画", "icon": "⚛️" }, { "label": "无头浏览器截图", "desc": "引擎逐帧渲染成图片", "icon": "📸" }, { "label": "FFmpeg 合成", "desc": "帧序列拼成 MP4", "icon": "🎞️" }], "orientation": "horizontal" },
          "voice_slice": "路线定了，看 Remotion 大致怎么干活。一句话：用 React 写页面和动画，引擎逐帧截图再合成视频。这套流程对 AI 特别友好。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "第一步卡片入场" },
            { "at_seconds": 5, "action": "第二步卡片入场" },
            { "at_seconds": 10, "action": "第三步卡片入场" }
          ]
        },
        {
          "id": "4.2",
          "scene_template": "@StatScene",
          "props": { "stat": "4条理由", "label": "" },
          "voice_slice": "为什么？四条理由。",
          "duration_seconds": 4,
          "visual_beats": [
            { "at_seconds": 0, "action": "数字弹入" },
            { "at_seconds": 2, "action": "标签淡入" }
          ]
        },
        {
          "id": "4.3",
          "scene_template": "@BulletScene",
          "props": { "eyebrow": "为什么 AI 能轻松驱动", "title": "理由一、二", "items": ["写的就是网页：React/CSS 是 AI 语料最厚的领域", "改数据就改片：内容模板分离，AI 改数据就出不同的片"], "ordered": true },
          "voice_slice": "写的就是网页，React 加 CSS，这正是 AI 训练语料里最厚的一块，写起来最熟、最不容易错。改数据就改片，内容和模板分离，AI 改数据就能出不同的片。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "两条依次 stagger 入场" }
          ]
        },
        {
          "id": "4.4",
          "scene_template": "@BulletScene",
          "props": { "eyebrow": "为什么 AI 能轻松驱动", "title": "理由三、四", "items": ["类型兜底：TypeScript 定死字段，填错漏填立刻报错", "出片全自动：逐帧截图合成不用人盯着"], "ordered": true },
          "voice_slice": "类型兜底，字段格式用 TypeScript 定死，填错漏填立刻报错，乱发挥的空间被压到最小。出片全自动，写好页面和数据，逐帧截图合成成片全由引擎自动完成，不用人盯着。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "两条依次 stagger 入场" }
          ]
        },
        {
          "id": "4.5",
          "scene_template": "@QuoteScene",
          "props": { "text": "把视频写成数据，AI 只填空、不乱跑" },
          "voice_slice": "把视频写成数据，AI 只填空、不乱跑。",
          "duration_seconds": 5,
          "visual_beats": [
            { "at_seconds": 0, "action": "引号装饰淡入" },
            { "at_seconds": 2, "action": "大字渐入" }
          ]
        }
      ]
    },
    {
      "id": "5",
      "track": "A",
      "voice": "引擎怎么干活？规则很直白：写一份配置，说清这段是什么画面、上面叠什么，主程序 Explainer 就按配置里的 type 字段自动找到对应组件去渲染。要个对比卡，就说做个对比卡，AI 产出的就是这份配置。十几种场景模板都现成。从开场片头到数据图表、从对比卡到合成终端，这些模板共用一套深色科技风主题，改一处全系列生效。做内容就是挑组件、填字段。每个 type 的字段都用 TypeScript 定死了格式，填错漏填编译时立刻报错。想在现成组件上扩一套自有风格组件库也行，那是更大的话题，后续单独开一期。",
      "visual_instructions": "@ArchitectureScene 配置→Explainer→多组件分支 → @TerminalScene 配置 JSON 示例 → @StatScene 十几种模板 → @BulletScene 模板场景清单 → @SplitLayout 填数据 vs 造组件 → @CalloutScene 自有风格库预告",
      "duration_hint_seconds": 65,
      "shots": [
        {
          "id": "5.1",
          "scene_template": "@ArchitectureScene",
          "props": { "eyebrow": "引擎怎么干活", "title": "一份配置 → Explainer 按 type 分发", "nodes": [{ "level": 0, "label": "输入", "title": "写一份配置", "desc": "说清这段是什么画面、叠什么", "icon": "📄" }, { "level": 1, "label": "分发", "title": "Explainer", "desc": "按 type 字段自动匹配", "icon": "🔀" }, { "level": 2, "label": "场景", "title": "intro_scene", "desc": "开场大字报", "icon": "🎬" }, { "level": 2, "label": "场景", "title": "table_scene", "desc": "通用表格", "icon": "📊" }, { "level": 2, "label": "场景", "title": "code_scene", "desc": "合成终端", "icon": "💻" }, { "level": 2, "label": "场景", "title": "chart_scene", "desc": "图表", "icon": "📈" }], "edges": [{ "from": 0, "to": 1 }, { "from": 1, "to": 2 }, { "from": 1, "to": 3 }, { "from": 1, "to": 4 }, { "from": 1, "to": 5 }] },
          "voice_slice": "引擎怎么干活？规则很直白：写一份配置，说清这段是什么画面、上面叠什么，主程序 Explainer 就按配置里的 type 字段自动找到对应组件去渲染。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "L0→L1 节点入场" },
            { "at_seconds": 6, "action": "L2 四个场景节点依次 stagger" },
            { "at_seconds": 12, "action": "连线高亮" }
          ]
        },
        {
          "id": "5.2",
          "scene_template": "@TerminalScene",
          "props": { "terminalTitle": "comparison_scene 配置示例", "prompt": ">", "steps": [{ "kind": "cmd", "text": "type: comparison_scene" }, { "kind": "cmd", "text": "title: 传统剪辑 vs 代码即视频" }, { "kind": "cmd", "text": "leftLabel: 传统剪辑" }, { "kind": "cmd", "text": "leftValue: 拖时间轴，改一处全手工重排" }, { "kind": "cmd", "text": "rightLabel: 代码即视频" }, { "kind": "cmd", "text": "rightValue: 改一行配置，重新编译出片" }] },
          "voice_slice": "要个对比卡，就说做个对比卡，AI 产出的就是这份配置。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "终端窗口淡入" },
            { "at_seconds": 2, "action": "命令逐行打出" }
          ]
        },
        {
          "id": "5.3",
          "scene_template": "@StatScene",
          "props": { "stat": "10+ 场景模板", "label": "" },
          "voice_slice": "十几种场景模板都现成。",
          "duration_seconds": 4,
          "visual_beats": [
            { "at_seconds": 0, "action": "数字弹入" },
            { "at_seconds": 2, "action": "标签淡入" }
          ]
        },
        {
          "id": "5.4",
          "scene_template": "@BulletScene",
          "props": { "eyebrow": "现成模板场景", "title": "做内容 = 挑组件、填字段", "items": ["开场收尾大字报、概念卡列表、要点清单", "流程图、通用表格、左右对比、图表", "核心数字、提示避坑框、金句、章节分隔", "合成终端演示命令报错，无需真录屏"], "ordered": false },
          "voice_slice": "从开场片头到数据图表、从对比卡到合成终端，这些模板共用一套深色科技风主题，改一处全系列生效。做内容就是挑组件、填字段。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "四条依次 stagger" }
          ]
        },
        {
          "id": "5.5",
          "scene_template": "@SplitLayout",
          "props": { "title": "让 AI 填数据，别造组件", "leftLabel": "✅ 只填配置", "leftValue": "挑现成组件、填字段", "rightLabel": "❌ 从零手写", "rightValue": "重复造轮子，复用好处没了" },
          "voice_slice": "每个 type 的字段都用 TypeScript 定死了格式，填错漏填编译时立刻报错。",
          "duration_seconds": 8,
          "visual_beats": [
            { "at_seconds": 0, "action": "左右卡片淡入" },
            { "at_seconds": 8, "action": "左侧高亮" }
          ]
        },
        {
          "id": "5.6",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "后续单独开一期", "text": "自有风格组件库", "items": ["在现成组件上扩品牌化模板", "本期先用现成组件跑通"] },
          "voice_slice": "想在现成组件上扩一套自有风格组件库也行，那是更大的话题，后续单独开一期。",
          "duration_seconds": 7,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "要点入场" }
          ]
        }
      ]
    },
    {
      "id": "6",
      "track": "A",
      "voice": "引擎跑通了，更值钱的判断是什么场景该用、什么场景别硬上。适合纯自动渲染的：概念讲解、数据图表、开场片头、章节分隔、合成终端演示命令报错——画面用文本和数据就能说清，换数据批量复用。可以搭配着用的：主体是真人口播或真实录屏时，Remotion 渲成透明背景的悬浮叠层贴上去，数据卡、字幕、角标、箭头标注。不适合的：实拍人物产品、写实对口型数字人、影视级特效、纯后台超长批处理——该拍就拍，该用专业工具就用专业工具。主体是真实画面时退居叠层，主体是讲解数据时独占整屏。",
      "visual_instructions": "@BulletScene 适合纯自动渲染 → @SplitLayout 独占 vs 叠层 → @CalloutScene 不适合 → @QuoteScene 口诀",
      "duration_hint_seconds": 50,
      "shots": [
        {
          "id": "6.1",
          "scene_template": "@BulletScene",
          "props": { "eyebrow": "适合纯自动渲染", "title": "画面用文本数据就能说清", "items": ["概念讲解 / 认知框架", "数据图表 / 对比 / 核心指标", "开场片头 / 章节分隔 / 片尾 CTA", "合成终端演示命令报错，无需真录屏"], "ordered": false },
          "voice_slice": "引擎跑通了，更值钱的判断是什么场景该用、什么场景别硬上。适合纯自动渲染的：概念讲解、数据图表、开场片头、章节分隔、合成终端演示命令报错——画面用文本和数据就能说清，换数据批量复用。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "四条依次 stagger" }
          ]
        },
        {
          "id": "6.2",
          "scene_template": "@SplitLayout",
          "props": { "title": "主体真实 → 退居叠层", "leftLabel": "独占整屏", "leftValue": "主体是讲解/数据时，Remotion 全屏渲染", "rightLabel": "退居叠层", "rightValue": "主体是录屏/口播时，渲透明背景叠层贴上去" },
          "voice_slice": "可以搭配着用的：主体是真人口播或真实录屏时，Remotion 渲成透明背景的悬浮叠层贴上去，数据卡、字幕、角标、箭头标注。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "左右卡片同时淡入" },
            { "at_seconds": 8, "action": "右侧高亮" }
          ]
        },
        {
          "id": "6.3",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "warning", "title": "不适合，别硬上", "text": "这些场景该用专业工具", "items": ["实拍人物产品——该拍就拍", "写实对口型数字人——恐怖谷、可信度崩", "影视级特效 / 逐帧手绘——交专业工具", "纯后台超长批处理——FFmpeg 更划算"] },
          "voice_slice": "不适合的：实拍人物产品、写实对口型数字人、影视级特效、纯后台超长批处理——该拍就拍，该用专业工具就用专业工具。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "警告框淡入" },
            { "at_seconds": 3, "action": "四条依次入场" }
          ]
        },
        {
          "id": "6.4",
          "scene_template": "@QuoteScene",
          "props": { "text": "主体真实→退居叠层，主体讲解→独占整屏" },
          "voice_slice": "主体是真实画面时退居叠层，主体是讲解数据时独占整屏。",
          "duration_seconds": 5,
          "visual_beats": [
            { "at_seconds": 0, "action": "引号装饰淡入" },
            { "at_seconds": 2, "action": "大字渐入" }
          ]
        }
      ]
    },
    {
      "id": "7",
      "track": "A",
      "voice": "三步走完：找路径，AI 罗列现成路线；选型，人结合约束拍板；落地，AI 填配置套组件跑渲染。会讲需求、会判断验收，就能复制这套。下期渲染场景搭建：实战多场景叠加、全息屏效果，再把 VRM 主持人迁移进引擎。",
      "visual_instructions": "@FlowScene 三步回顾（首尾呼应） → @OutroScene 品牌收束卡 + CTA",
      "duration_hint_seconds": 30,
      "shots": [
        {
          "id": "7.1",
          "scene_template": "@FlowScene",
          "props": { "eyebrow": "三步回顾", "title": "", "steps": [{ "label": "找路径", "desc": "AI 罗列现成路线", "icon": "🔍" }, { "label": "选型", "desc": "人结合约束拍板", "icon": "⚖️" }, { "label": "落地", "desc": "AI 填配置套组件跑渲染", "icon": "🚀" }], "orientation": "horizontal" },
          "voice_slice": "三步走完：找路径，AI 罗列现成路线；选型，人结合约束拍板；落地，AI 填配置套组件跑渲染。会讲需求、会判断验收，就能复制这套。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "三步卡片依次入场（首尾呼应第一段）" }
          ]
        },
        {
          "id": "7.2",
          "scene_template": "@OutroScene",
          "props": { "headline": "不吹AI，真落地，真开源", "cta": "关注 · 一起用 AI 构建能落地、可复现的工作流" },
          "voice_slice": "下期渲染场景搭建：实战多场景叠加、全息屏效果，再把 VRM 主持人迁移进引擎。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "品牌卡淡入" },
            { "at_seconds": 5, "action": "CTA 按钮脉冲" }
          ]
        }
      ]
    }
  ],
  "judgment_layer_coverage": {
    "highlights_pitfall": true,
    "explains_boundary": true,
    "acceptance_standard": true
  }
}
```
