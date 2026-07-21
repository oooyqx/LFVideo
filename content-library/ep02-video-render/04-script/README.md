---
stage: 04-script
platform: bilibili
status: draft
source_workflow: /04-script-draft
upstream_inputs:
  - 02-plan/README.md (status: approved)
  - 02-plan/tutorial.final.md (status: approved)
---

# ep02 视频脚本：用 Vibe Coding 搭一套能自动出片的视频渲染引擎

> 画面（Remotion 模板场景映射 / Props / 镜头 shots）与口播一体：段 (section) 是叙事单位（一整段连续口播），镜头 (shot) 才是画面单位。任何 > 15s 的段都切成多个镜头，让画面随口播 ≤~15s 换一次。末尾 JSON 契约是下游 05/06/07 的唯一真相源（SSOT），07 组装按「一个 shot ↔ props JSON 里一个 cut」逐条映射。
>
> 本稿严格对齐人工定稿 `02-plan/tutorial.final.md`（六章 + 文末「必讲要点覆盖清单」），主线与讲述人设口径见 `shared/rules/project-context.md`《频道配置》。所有镜头映射到 `OpenMontage/remotion-composer` 现有的统一深色科技风（深色底 + 白字）模板场景（清单见 `SCENE_TYPES.md`）。

---

## 第一段：【@IntroScene → @FlowScene】开场（干货式钩子 + 关键认知 + 三步路线图，33s → 3 镜头）

- **[口播]** 如何用 Vibe Coding，快速搞定自动化视频渲染？先记住一个关键认知：AI 最能打的本事，是啃文本和代码。所以想让渲染自动化，思路就一条——把视频变成代码和数据，让 AI 按配置出片。修改文案或配置，快速自动重渲。这条低成本、高效率的自动化生产怎么落地？三步：先让 AI 找技术路径，再对着实际需求选型，最后落地出片。
- **[镜头 1.1]** `@IntroScene`（10s）选题问句点题 + 关键认知
  - Props: title="如何用 Vibe Coding 快速完成自动化视频渲染？", subtitle="把视频写成代码，让 AI 按配置自动出片｜不吹AI，真落地，真开源"
  - voice_slice: "如何用 Vibe Coding，快速搞定自动化视频渲染？先记住一个关键认知：AI 最能打的本事，是啃文本和代码。"
- **[镜头 1.2]** `@IntroScene`（12s）价值卡：改文案配置即改片
  - Props: title="修改文案或配置，快速自动重渲", subtitle="把视频变成代码和数据，让 AI 按配置出片"
  - voice_slice: "所以想让渲染自动化，思路就一条——把视频变成代码和数据，让 AI 按配置出片。修改文案或配置，快速自动重渲。"
- **[镜头 1.3]** `@FlowScene`（11s）三步路线图
  - Props: eyebrow="怎么落地 · 三步", title="找技术路径 → 技术选型 → 落地出片", orientation="horizontal", steps=[{icon:"🧭",label:"找技术路径",desc:"让 AI 把最优技术路线摆全"},{icon:"⚖️",label:"技术选型",desc:"对着实际需求全方位对比、结合约束选定"},{icon:"🚀",label:"落地出片",desc:"填配置、套组件、自动出片"}]
  - voice_slice: "这条低成本、高效率的自动化生产怎么落地？三步：先让 AI 找技术路径，再对着实际需求选型，最后落地出片。"

---

## 第二段：【@ConceptScene → @TableScene】找技术路径·让 AI 把路都摆出来（21s → 2 镜头）

- **[口播]** 我们直接问 AI：通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？它一口气摆了六条——Remotion 使用React前端网页渲染、Manim 画数学公式、MoviePy 和 FFmpeg 做拼接，还有 Motion Canvas、PixiJS 这些路径。六条路都摆出来了，可到底选哪条？
- **[镜头 2.1]** `@ConceptScene`（8s）抛问：让 AI 把最优技术路线摆全
  - Props: eyebrow="第一步 · 找技术路径", title="让 AI 把最优技术路线摆全", items=[{icon:"🧭",label:"PROMPT",title:"抛出问题",desc:"通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？"},{icon:"📚",label:"策略",title:"AI 铺信息",desc:"先把选项摆全，好坏评估留到下一步选型"}]
  - voice_slice: "我们直接问 AI：通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？"
- **[镜头 2.2]** `@TableScene`（13s）六条路线 × 代表工具 × 描述方式 × 适合干什么
  - Props: title="AI 罗列的六条技术路线", headers=["路线","代表工具","用什么描述画面","适合干什么"], rows=[["网页渲染","Remotion","React 组件 + CSS/SVG","前端栈、复杂排版、模板复用"],["代码动画","Motion Canvas / Revideo","写函数描述动画时序","代码演示、讲解类动画"],["公式动画","Manim","Python 描述几何/公式","数学、算法可视化"],["像素拼接","MoviePy","Python 操作像素 + FFmpeg","纯 Python、简单拼接"],["画布/游戏","PixiJS / Cocos","Canvas 上逐帧画","复杂粒子、游戏化动画"],["命令行合成","FFmpeg + 脚本","命令拼接","批量转码、字幕烧录"]], enter="rise"
  - voice_slice: "它一口气摆了六条——Remotion 使用React前端网页渲染、Manim 画数学公式、MoviePy 和 FFmpeg 做拼接，还有 Motion Canvas、PixiJS 这些路径。六条路都摆出来了，可到底选哪条？"
  - visual_beats: [{at_seconds:0,action:"表头淡入"},{at_seconds:3,action:"六行依次 stagger 入场"}]

---

## 第三段：【@TableScene → @SplitLayout → @ConceptScene → @SplitLayout → @CalloutScene → @QuoteScene】技术选型·让 AI 全方位对比，回到约束定 Remotion（64s → 6 镜头）

- **[口播]** 第二步，技术选型，也是最容易翻车的一步。直接问 AI 哪个好，它会把每个都夸一遍，你照样选不出来。值钱的是看清每条路什么时候不好使、会在哪一步出问题。所以反过来逼它：把每条路的核心优势、劣势，全摆到台面上，列成一张表。就拿 Remotion 来说：优势是前端 React 栈、排版能力强、模板还能跨期复用。劣势也不藏——组件顶层直接读浏览器对象，打包阶段当场崩；而且是 BUSL 授权，做大了要给钱。Motion Canvas 排版生态小，复杂网页排版吃力。Manim 学习曲线陡，普通 UI 不合适。MoviePy 文字排版繁琐，改了要重跑。PixiJS 文字对齐计算复杂。FFmpeg 做不了复杂动效。优劣摆齐了，再拿自己的约束去卡。我的约束就三条：固定模板、换数据批量出几十期；AI 改内容别老出错；跨期还得好维护。三条一卡，Remotion 胜出。你可能会问，直接拿 HTML 画页面不行吗？行。但你改一处，剩下几十期不会跟着变。Remotion 不一样，改一处全系列生效，AI 只能照着填数据，动不了结构。十期之后，照样管得住。代价也清楚：React 技术栈，加 BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。一句话：让 AI 把信息铺开，真正拍板的判断，留给人。
- **[镜头 3.1]** `@TableScene`（16s）全方位对比矩阵：6 方案 × 核心优势 × 劣势
  - Props: title="让 AI 全方位对比：核心优势 + 劣势", headers=["方案","核心优势","劣势"], rows=[["Remotion","前端 React 栈、复杂排版强、模板跨期复用、命令行易自动化","纯后台超长批处理弱；顶层读 window 打包崩；BUSL 授权"],["Motion Canvas / Revideo","代码声明动画、时序精确，适合代码演示","组件/排版生态小，复杂网页排版吃力，模板要自己攒"],["Manim","数学/公式/算法可视化专业","学习曲线陡、排版弱、渲染慢，普通 UI 不合适"],["MoviePy","纯 Python、简单拼接、音轨闪避","文字排版繁琐、改了要重跑，复杂动效弱"],["PixiJS / Cocos","游戏级复杂粒子动画","文字换行/对齐计算复杂，标准网页 UI 吃力"],["FFmpeg + 脚本","批量转码、字幕烧录、兜底合成","命令语法晦涩、难调试，做不了复杂动效"]], enter="rise"
  - voice_slice: "第二步，技术选型，也是最容易翻车的一步。直接问 AI 哪个好，它会把每个都夸一遍，你照样选不出来。值钱的是看清每条路什么时候不好使、会在哪一步出问题。所以反过来逼它：把每条路的核心优势、劣势，全摆到台面上，列成一张表。"
  - visual_beats: [{at_seconds:0,action:"表头淡入"},{at_seconds:4,action:"六行依次 stagger 入场"}]
- **[镜头 3.2]** `@SplitLayout`（10s）聚焦赢家 Remotion：优势 vs 劣势
  - Props: title="只看赢家 Remotion：优势 vs 劣势", leftLabel="优势 ✅", leftValue="前端 React 栈、复杂排版强、模板还能跨期复用", rightLabel="劣势 ⚠️", rightValue="顶层读 window 打包崩；纯后台超长批处理弱；BUSL 授权做大了要付费", enter="rise"
  - voice_slice: "就拿 Remotion 来说：优势是前端 React 栈、排版能力强、模板还能跨期复用。劣势也不藏——组件顶层直接读浏览器对象，打包阶段当场崩；而且是 BUSL 授权，做大了要给钱。"
  - visual_beats: [{at_seconds:0,action:"左栏「优势」淡入"},{at_seconds:5,action:"右栏「劣势」入场"}]
- **[镜头 3.3]** `@ConceptScene`（10s）回到实际约束做减法
  - Props: eyebrow="结合我的工程约束", title="三条约束一卡，Remotion 胜出", items=[{icon:"🧩",label:"复用",title:"固定模板换数据",desc:"改一处主题，全系列生效"},{icon:"🤖",label:"不出错",title:"让 AI 改内容不容易错",desc:"只填数据、套现成组件"},{icon:"🛠️",label:"维护",title:"跨期好维护",desc:"十期后还管得住"}]
  - voice_slice: "优劣摆齐了，再拿自己的约束去卡。我的约束就三条：固定模板、换数据批量出几十期；AI 改内容别老出错；跨期还得好维护。三条一卡，Remotion 胜出。"
- **[镜头 3.4]** `@SplitLayout`（12s）Remotion vs 直接使用 HTML 绘制页面
  - Props: title="Remotion vs 直接使用 HTML 绘制页面", leftLabel="Remotion ✅", leftValue="改一处全系列生效；AI 只填数据不乱改结构；十期后还好维护", rightLabel="直接使用 HTML ❌", rightValue="每期复制改，越改越乱，结构容易跑偏", enter="rise"
  - voice_slice: "你可能会问，直接拿 HTML 画页面不行吗？行。但你改一处，剩下几十期不会跟着变。Remotion 不一样，改一处全系列生效，AI 只能照着填数据，动不了结构。十期之后，照样管得住。"
- **[镜头 3.5]** `@CalloutScene`（8s）代价摆清楚
  - Props: callout_type="warning", title="代价也清楚", text="React 技术栈 + BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。"
  - voice_slice: "代价也清楚：React 技术栈，加 BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。"
- **[镜头 3.6]** `@QuoteScene`（8s）金句：让 AI 铺信息，拍板留给人
  - Props: text="让 AI 把信息铺开，真正拍板的判断，留给人。"
  - voice_slice: "一句话：让 AI 把信息铺开，真正拍板的判断，留给人。"

---

## 第四段：【@FlowScene → @BulletScene → @QuoteScene】技术落地·Remotion 怎么工作，为什么 AI 能轻松驱动（38s → 3 镜头）

- **[口播]** 路线定了 Remotion。它怎么工作？用 React 写页面和动画，引擎逐帧截图，再合成视频。你写的就是一个网页——网页上能画的，它就能渲成片。而且从页面到成品全自动，不用你盯着，也不用手动剪。那它为什么这么好被 AI 驱动？四条原因。第一，写的就是网页——React 加 CSS 是 AI 语料里最厚的一块，最熟也最不容易错。第二，内容和模板分开，改数据就改片，正好撞在它改文本的强项上。第三，字段用 TypeScript 定死，填错漏填当场报红，乱来的空间压到最小。第四，出片全自动，截图、合成全交给引擎，天生适合批量。一条心法：把视频写成数据，AI 只负责填空，不乱跑。原理通了，接着搭引擎。
- **[镜头 4.1]** `@FlowScene`（16s）Remotion 大致怎么工作
  - Props: title="Remotion 大致怎么工作", orientation="horizontal", steps=[{icon:"⚛️",label:"React 写页面和动画",desc:"网页长什么样、怎么动都用 React + CSS 描述"},{icon:"📸",label:"引擎逐帧截图",desc:"从头到尾逐帧截图再合成视频"},{icon:"🤖",label:"全自动出片",desc:"不用人盯、不用手剪，天然可批量"}]
  - voice_slice: "路线定了 Remotion。它怎么工作？用 React 写页面和动画，引擎逐帧截图，再合成视频。你写的就是一个网页——网页上能画的，它就能渲成片。而且从页面到成品全自动，不用你盯着，也不用手动剪。"
- **[镜头 4.2]** `@BulletScene`（16s）为什么 AI 好驱动的四条
  - Props: eyebrow="为什么 AI 特别好驱动", title="四条原因", ordered=true, items=["写的就是网页：React + CSS 是 AI 语料里最厚的一块，最熟最不容易错","改数据就改片：内容和模板分开，正中 AI 改文本之长","类型兜底：字段用 TypeScript 定死，填错漏填当场报红","出片全自动：逐帧截图、合成全交给引擎，天然可批量"]
  - voice_slice: "那它为什么这么好被 AI 驱动？四条原因。第一，写的就是网页——React 加 CSS 是 AI 语料里最厚的一块，最熟也最不容易错。第二，内容和模板分开，改数据就改片，正好撞在它改文本的强项上。第三，字段用 TypeScript 定死，填错漏填当场报红，乱来的空间压到最小。第四，出片全自动，截图、合成全交给引擎，天生适合批量。"
- **[镜头 4.3]** `@QuoteScene`（6s）金句
  - Props: text="把视频写成数据，AI 只负责填空，不乱跑。"
  - voice_slice: "一条心法：把视频写成数据，AI 只负责填空，不乱跑。原理通了，接着搭引擎。"

---

## 第五段：【@FlowScene → @BulletScene → @TerminalScene → @SplitLayout → @CalloutScene】技术落地·引擎按 type 分发 + 配置即内容（70s → 5 镜头）

- **[口播]** 选型定了，进落地。引擎不用你自己写，你要做的，是把配置和现成组件对上号。这台引擎叫 remotion-composer。你写一份配置，讲清这段画面是什么；主程序 Explainer 读配置里的 type 字段，自动挑对应组件去渲。现成的模板场景有一整套——开场、收尾、概念、要点、流程、表格、左右对比、图表、核心数字、提示避坑、金句、章节分隔，还有合成终端和截图叠层。全是深色科技底加白字，改一处主题，全片跟着变。所以做内容，其实就是挑组件、填字段。想要一张对比卡？你就说左边传统剪辑、右边代码即视频，AI 吐出来的，就是一段 type 写 comparison 的配置，齐活。这里有条铁律：不许 AI 发明新组件，只让它照现成的填数据。让它从零手写，既在重复造轮子，又把「换数据就复用」的好处弄没了。而且每个字段都用 TypeScript 定死，AI 填错、漏填，当场报红，想乱发挥都没空间。至于在现成组件上再扩一套自有品牌风格，那是更大的话题，以后单独开一期。这期，先用现成的把片子跑通。
- **[镜头 5.1]** `@FlowScene`（16s）一份配置 → Explainer 按 type 分发 → 对应组件
  - Props: title="一份配置 → Explainer 按 type 分发 → 组件", orientation="horizontal", steps=[{icon:"🧾",label:"写一份配置",desc:"说清这段画面是什么、叠什么"},{icon:"🔀",label:"Explainer 读 type",desc:"按 type 字段自动分发"},{icon:"🧱",label:"对应组件渲染",desc:"comparison→对比卡，terminal→合成终端…"}]
  - voice_slice: "选型定了，进落地。引擎不用你自己写，你要做的，是把配置和现成组件对上号。这台引擎叫 remotion-composer。你写一份配置，讲清这段画面是什么；主程序 Explainer 读配置里的 type 字段，自动挑对应组件去渲。"
- **[镜头 5.2]** `@BulletScene`（14s）现成模板场景清单
  - Props: eyebrow="现成模板场景（统一深色科技风 + 白字）", title="照着填就能用", items=["开场 / 章节分隔 / 片尾 CTA","概念卡 / 要点清单 / 流程图","表格 / 左右对比","图表 / 核心数字","提示避坑框 / 金句大字","合成终端 / 截图叠层（不用真录屏）"]
  - voice_slice: "现成的模板场景有一整套——开场、收尾、概念、要点、流程、表格、左右对比、图表、核心数字、提示避坑、金句、章节分隔，还有合成终端和截图叠层。全是深色科技底加白字，改一处主题，全片跟着变。"
- **[镜头 5.3]** `@TerminalScene`（15s）一份 comparison_scene 配置：AI 只填字段
  - Props: terminalTitle="让 AI 只填字段、不造组件", prompt="jsonc", steps=[{cmd:"{ 'type': 'comparison_scene',"},{cmd:"  'leftLabel': '传统剪辑', 'leftValue': '拖时间轴，改一处全手工重排',"},{cmd:"  'rightLabel': '代码即视频', 'rightValue': '改一行配置，重新编译出片' }"},{out:"// Explainer 自动渲成对比卡，无需新建组件"}]
  - voice_slice: "所以做内容，其实就是挑组件、填字段。想要一张对比卡？你就说左边传统剪辑、右边代码即视频，AI 吐出来的，就是一段 type 写 comparison 的配置，齐活。"
- **[镜头 5.4]** `@SplitLayout`（15s）造轮子 vs 填数据
  - Props: title="心法：填数据，别造轮子", leftLabel="让 AI 从零手写组件 ❌", leftValue="重复造轮子，丢掉「换数据就复用」的好处", rightLabel="只填数据、复用现成组件 ✅", rightValue="TypeScript 字段定死、填错即报红，结构稳、可复用", enter="rise"
  - voice_slice: "这里有条铁律：不许 AI 发明新组件，只让它照现成的填数据。让它从零手写，既在重复造轮子，又把「换数据就复用」的好处弄没了。而且每个字段都用 TypeScript 定死，AI 填错、漏填，当场报红，想乱发挥都没空间。"
- **[镜头 5.5]** `@CalloutScene`（10s）自有风格组件库一句带过
  - Props: callout_type="tip", title="自有风格组件库", text="想要更强品牌辨识度，可在现成组件上再扩一套——更大的话题，后续单独开一期，这期先用现成的把片子跑通。"
  - voice_slice: "至于在现成组件上再扩一套自有品牌风格，那是更大的话题，以后单独开一期。这期，先用现成的把片子跑通。"

---

## 第六段：【@ConceptScene → @TableScene → @ConceptScene → @BulletScene】技术落地·数字人选型与落地（54s → 4 镜头）

- **[口播]** 视频要不要一个出镜形象来串场？先把定位钉死：数字人只是陪衬，不是主角，真正的干货，永远是屏幕上的真实操作。定位定了，套一样的方法论——让 AI 把每种形象的核心优势、劣势全方位摆出来。真人出镜最可信、有温度，但你得露脸，也没法编程批量复用。写实数字人对口型像真主播，可它太容易掉进恐怖谷，一掉进去，可信度就崩了。二次元或者 3D 风格化角色走 VRM，风格统一、能编程、渲一次到处用，还不踩恐怖谷。劣势是要建模与动作绑定，但可以交给 AI 和现成方案。优劣摆全，再拿约束去卡——不露脸、要能编程批量复用、避开恐怖谷。选定 3D 风格化角色 VRMAvatar，并且定死一条：只做陪衬，坚决不做对口型。落地照样交给 AI：整体渲一次，再按场景裁——角落、半身、全身。
- **[镜头 6.1]** `@ConceptScene`（13s）先定位：数字人只做陪衬、不是主角
  - Props: eyebrow="数字人 · 先定位", title="陪衬、串场，不是主角", items=[{icon:"🎭",label:"定位",title:"只做陪衬",desc:"真正的干货，永远是屏幕上的真实操作"},{icon:"🧭",label:"方法",title:"套同一套选型",desc:"先定位，再让 AI 全方位对比核心优势与劣势"}]
  - voice_slice: "视频要不要一个出镜形象来串场？先把定位钉死：数字人只是陪衬，不是主角，真正的干货，永远是屏幕上的真实操作。"
- **[镜头 6.2]** `@TableScene`（18s）形象选型·全方位对比：真人 / 写实对口型 / 二次元 VRM
  - Props: title="让 AI 全方位对比形象选型", headers=["形象方案","核心优势","劣势"], rows=[["真人出镜","最可信、有温度","要露脸、不可编程复用、隐私成本"],["写实数字人 / 对口型","像真主播","易掉恐怖谷、可信度反崩；口型是重活"],["二次元 / 3D 风格化（VRM）","风格统一、可编程、渲一次到处用","要建模与动作绑定，可交给 AI"]], highlightCell="3-1", enter="rise"
  - voice_slice: "定位定了，套一样的方法论——让 AI 把每种形象的核心优势、劣势全方位摆出来。真人出镜最可信、有温度，但你得露脸，也没法编程批量复用。写实数字人对口型像真主播，可它太容易掉进恐怖谷，一掉进去，可信度就崩了。二次元或者 3D 风格化角色走 VRM，风格统一、能编程、渲一次到处用，还不踩恐怖谷。劣势是要建模与动作绑定，但可以交给 AI 和现成方案。"
  - visual_beats: [{at_seconds:0,action:"表头淡入"},{at_seconds:4,action:"三行依次 stagger 入场，高亮 VRM 行"}]
- **[镜头 6.3]** `@ConceptScene`（15s）结合约束选定
  - Props: eyebrow="结合约束选定", title="选定 VRM 3D 角色", items=[{icon:"🙈",label:"约束",title:"不露脸 · 可批量 · 避恐怖谷",desc:"三条约束卡下来，选 VRMAvatar"},{icon:"🚫",label:"定死",title:"坚决不做对口型",desc:"可信度只靠真实录屏"}]
  - voice_slice: "优劣摆全，再拿约束去卡——不露脸、要能编程批量复用、避开恐怖谷。选定 3D 风格化角色 VRMAvatar，并且定死一条：只做陪衬，坚决不做对口型。"
- **[镜头 6.4]** `@BulletScene`（8s）AI 落地：渲一次、按场景取景
  - Props: eyebrow="AI 落地", title="渲一次、按场景取景", items=["整体渲一次，再按场景裁角落 / 半身 / 全身（取景预设）","不用每个场景重搭形象，落地交给 AI"]
  - voice_slice: "落地照样交给 AI：整体渲一次，再按场景裁——角落、半身、全身。"

---

## 第七段：【@ConceptScene → @SplitLayout → @CalloutScene → @QuoteScene】场景适配·适合 / 搭配 / 不适合（52s → 4 镜头）

- **[口播]** 引擎跑通了，更值钱的判断是：什么场景该用它？让它独占整屏、纯模板自动出片，适合的是那种换数据就能批量复用的内容——概念讲解、要点流程、图表对比、开场收尾。命令和报错，用合成终端兜底，不用真去录屏。第二种，搭配着用。主体是真人口播、或者真实录屏的时候，Remotion 别独占整屏，把它渲成透明背景的悬浮叠层贴上去——数据卡、字幕高亮、局部标注，都行。还有三类，别硬上。真实的物理世界，该拍就拍。写实对口型数字人，恐怖谷加可信度崩，这项目直接排除。影视级特效和超长批处理，交给专业工具和 FFmpeg。一句口诀：主体是真实画面，就退居叠层；主体是讲解和数据，就独占整屏。
- **[镜头 7.1]** `@ConceptScene`（16s）适合独占整屏自动出片的三类
  - Props: eyebrow="用在哪 · 独占整屏自动出片", title="模板化、换数据批量复用", items=[{icon:"🧠",label:"讲解",title:"概念 / 要点 / 流程",desc:"concept / bullet / flow"},{icon:"📊",label:"数据",title:"图表 / 对比 / 核心数字",desc:"chart / table / comparison / stat"},{icon:"💻",label:"演示",title:"合成终端兜底",desc:"命令 / 报错不用真录屏"}]
  - voice_slice: "引擎跑通了，更值钱的判断是：什么场景该用它？让它独占整屏、纯模板自动出片，适合的是那种换数据就能批量复用的内容——概念讲解、要点流程、图表对比、开场收尾。命令和报错，用合成终端兜底，不用真去录屏。"
- **[镜头 7.2]** `@SplitLayout`（14s）独占整屏 vs 退居叠层
  - Props: title="主体不同，站位不同", leftLabel="讲解 / 数据为主 → 独占整屏", leftValue="文本、数据就能说清的内容，Remotion 全屏出片", rightLabel="真人 / 录屏为主 → 退居叠层", rightValue="渲透明背景悬浮层：数据卡 / 字幕 / 角标 / Zoom 标注", enter="rise"
  - voice_slice: "第二种，搭配着用。主体是真人口播、或者真实录屏的时候，Remotion 别独占整屏，把它渲成透明背景的悬浮叠层贴上去——数据卡、字幕高亮、局部标注，都行。"
- **[镜头 7.3]** `@CalloutScene`（14s）这三类别硬上
  - Props: callout_type="warning", title="这三类别硬上", text="实拍人物产品该拍就拍；写实对口型数字人（恐怖谷）本项目排除；影视级特效 / 逐帧手绘交专业工具；纯后台超长批处理用 FFmpeg 更划算。"
  - voice_slice: "还有三类，别硬上。真实的物理世界，该拍就拍。写实对口型数字人，恐怖谷加可信度崩，这项目直接排除。影视级特效和超长批处理，交给专业工具和 FFmpeg。"
- **[镜头 7.4]** `@QuoteScene`（8s）口诀
  - Props: text="主体是真实画面就退居叠层，主体是讲解和数据就独占整屏。"
  - voice_slice: "一句口诀：主体是真实画面，就退居叠层；主体是讲解和数据，就独占整屏。"

---

## 第八段：【@FlowScene → @OutroScene】结尾 CTA（19s → 2 镜头）

- **[口播]** 回顾一下，整期就三步：让 AI 把技术路径全列出来，你做全方位对比、结合约束选型，再让 AI 填配置、套组件、自动出片。这套流程不吃编程基础——会讲需求、会验收，你就能复制。这个频道就一条原则：不吹 AI，真落地，真开源。觉得有用，点个关注。下期 EP03 讲字幕匹配：用 Whisper 拿到字级时间戳，自动驱动 CaptionOverlay，让字幕踩着话音一个字一个字往外蹦。
- **[镜头 8.1]** `@FlowScene`（8s）三步法回顾（首尾呼应）
  - Props: eyebrow="整期回顾 · 三步法", title="AI 罗列 → 人全方位对比·结合约束 → AI 填配置出片", orientation="horizontal", steps=[{icon:"🧭",label:"找技术路径",desc:"AI 把最优技术路线全列出来"},{icon:"⚖️",label:"技术选型",desc:"人做全方位对比、结合约束选定"},{icon:"🚀",label:"落地出片",desc:"AI 填配置、套组件、自动出片"}]
  - voice_slice: "回顾一下，整期就三步：让 AI 把技术路径全列出来，你做全方位对比、结合约束选型，再让 AI 填配置、套组件、自动出片。这套流程不吃编程基础——会讲需求、会验收，你就能复制。"
- **[镜头 8.2]** `@OutroScene`（11s）品牌收束卡 + 关注引导 + EP03 预告
  - Props: headline="不吹AI，真落地，真开源", cta="关注 · 下期 EP03：Whisper 字级时间戳驱动字幕"
  - voice_slice: "这个频道就一条原则：不吹 AI，真落地，真开源。觉得有用，点个关注。下期 EP03 讲字幕匹配：用 Whisper 拿到字级时间戳，自动驱动 CaptionOverlay，让字幕踩着话音一个字一个字往外蹦。"

---

## 必讲要点覆盖清单（逐条核对 tutorial.final.md 文末清单）

- ✅ 开场：选题式问句点题「自动化视频渲染」/ 关键认知钩子（AI 强在文本代码）/ 人设以价值前置表达点一次（不吃编程基础：讲需求→AI 实现→人判断验收）/ 三步路线图 → 段一
- ⚠️ 找技术路径：AI 罗列六条路线（口播分组压缩，画面表格承载全量 6 行）→ 段二；「点明共同内核（描述→编译成帧→合成）」该必讲要点经人工决定裁掉（2026-07-21，用户指示），不入口播、镜头同步删除
- ✅ 技术选型：让 AI 全方位对比「核心优势 + 劣势」（6 方案全量，不是只摆 4 行）/ 结合约束选 Remotion / vs 直接使用 HTML 绘制页面（4 维度对照）/ 授权口径如实说 BUSL → 段三
- ✅ 技术落地·原理：用 React 写页面和动画 → 引擎逐帧截图自动合成、无需人工干预 / 为何 AI 好驱动四条（写的就是网页 / 改数据就改片 / 类型兜底 / 出片全自动）→ 段四
- ✅ 技术落地·配置分发：一份配置 → Explainer 按 type 分发 / 现成模板场景统一主题（含 screenshot_scene）/ 配置即内容（填字段别造组件）/ TS 类型兜底 / 自有风格组件库一句带过 → 段五
- ✅ 技术落地·数字人：定位陪衬 → 三种形象全方位对比（核心优势 / 劣势，含 VRM 劣势不回避）→ 结合约束选定 VRM、定死不做对口型 → AI 落地（取景）→ 段六
- ✅ 场景适配：适合纯自动渲染 / 可搭配透明叠层（标 paper_spec）/ 不适合四类 / 口诀 → 段七
- ✅ 总结 + 结尾 CTA：三步法回顾（首尾呼应 @FlowScene）+ 「不吃编程基础，会讲需求、会判断就能复制」（价值前置表达）/ 频道定位语口播念一次（与品牌卡同帧）/ 关注 + EP03 预告 → 段八

---

## 结构化契约块 (JSON — 下游 05/06/07 唯一真相源)

```json
{
  "title": "用 Vibe Coding 搭一套能自动出片的视频渲染引擎",
  "platform": "bilibili",
  "estimated_duration_seconds": 351,
  "total_word_count": 2010,
  "anti_hype_forbidden": [
    "100 行",
    "百倍",
    "百倍效率",
    "一键出片",
    "躺赚",
    "最强",
    "碾压",
    "秒杀"
  ],
  "b_track_assets_required": [],
  "video_spec": {
    "aspect_ratio": "16:9",
    "resolution": "1920x1080",
    "fps": 30
  },
  "sections": [
    {
      "id": "1",
      "track": "A",
      "voice": "如何用 Vibe Coding，快速搞定自动化视频渲染？先记住一个关键认知：AI 最能打的本事，是啃文本和代码。所以想让渲染自动化，思路就一条——把视频变成代码和数据，让 AI 按配置出片。修改文案或配置，快速自动重渲。这条低成本、高效率的自动化生产怎么落地？三步：先让 AI 找技术路径，再对着实际需求选型，最后落地出片。",
      "visual_instructions": "@IntroScene ×2：选题问句点题 + 关键认知 → 价值卡（改文案配置即改片）；@FlowScene 三步骨架卡片（找技术路径→技术选型→落地出片）点亮。",
      "duration_hint_seconds": 33,
      "shots": [
        {
          "id": "1.1",
          "scene_template": "@IntroScene",
          "props": {
            "title": "如何用 Vibe Coding 快速完成自动化视频渲染？",
            "subtitle": "把视频写成代码，让 AI 按配置自动出片｜不吹AI，真落地，真开源"
          },
          "voice_slice": "如何用 Vibe Coding，快速搞定自动化视频渲染？先记住一个关键认知：AI 最能打的本事，是啃文本和代码。",
          "duration_seconds": 10
        },
        {
          "id": "1.2",
          "scene_template": "@IntroScene",
          "props": {
            "title": "修改文案或配置，快速自动重渲",
            "subtitle": "把视频变成代码和数据，让 AI 按配置出片"
          },
          "voice_slice": "所以想让渲染自动化，思路就一条——把视频变成代码和数据，让 AI 按配置出片。修改文案或配置，快速自动重渲。",
          "duration_seconds": 12
        },
        {
          "id": "1.3",
          "scene_template": "@FlowScene",
          "props": {
            "eyebrow": "怎么落地 · 三步",
            "title": "找技术路径 → 技术选型 → 落地出片",
            "orientation": "horizontal",
            "steps": [
              {"icon": "🧭", "label": "找技术路径", "desc": "让 AI 把最优技术路线摆全"},
              {"icon": "⚖️", "label": "技术选型", "desc": "对着实际需求全方位对比、结合约束选定"},
              {"icon": "🚀", "label": "落地出片", "desc": "填配置、套组件、自动出片"}
            ]
          },
          "voice_slice": "这条低成本、高效率的自动化生产怎么落地？三步：先让 AI 找技术路径，再对着实际需求选型，最后落地出片。",
          "duration_seconds": 11
        }
      ]
    },
    {
      "id": "2",
      "track": "A",
      "voice": "我们直接问 AI：通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？它一口气摆了六条——Remotion 使用React前端网页渲染、Manim 画数学公式、MoviePy 和 FFmpeg 做拼接，还有 Motion Canvas、PixiJS 这些路径。六条路都摆出来了，可到底选哪条？",
      "visual_instructions": "先 @ConceptScene 抛问，再 @TableScene 摆六条路线矩阵（画面承载全量清单）。",
      "duration_hint_seconds": 21,
      "shots": [
        {
          "id": "2.1",
          "scene_template": "@ConceptScene",
          "props": {
            "eyebrow": "第一步 · 找技术路径",
            "title": "让 AI 把最优技术路线摆全",
            "items": [
              {"icon": "🧭", "label": "PROMPT", "title": "抛出问题", "desc": "通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？"},
              {"icon": "📚", "label": "策略", "title": "AI 铺信息", "desc": "先把选项摆全，好坏评估留到下一步选型"}
            ]
          },
          "voice_slice": "我们直接问 AI：通过 AI 编程做自动化渲染视频，现在最优的技术路线有哪些？",
          "duration_seconds": 8
        },
        {
          "id": "2.2",
          "scene_template": "@TableScene",
          "props": {
            "title": "AI 罗列的六条技术路线",
            "headers": ["路线", "代表工具", "用什么描述画面", "适合干什么"],
            "rows": [
              ["网页渲染", "Remotion", "React 组件 + CSS/SVG", "前端栈、复杂排版、模板复用"],
              ["代码动画", "Motion Canvas / Revideo", "写函数描述动画时序", "代码演示、讲解类动画"],
              ["公式动画", "Manim", "Python 描述几何/公式", "数学、算法可视化"],
              ["像素拼接", "MoviePy", "Python 操作像素 + FFmpeg", "纯 Python、简单拼接"],
              ["画布/游戏", "PixiJS / Cocos", "Canvas 上逐帧画", "复杂粒子、游戏化动画"],
              ["命令行合成", "FFmpeg + 脚本", "命令拼接", "批量转码、字幕烧录"]
            ],
            "enter": "rise"
          },
          "voice_slice": "它一口气摆了六条——Remotion 使用React前端网页渲染、Manim 画数学公式、MoviePy 和 FFmpeg 做拼接，还有 Motion Canvas、PixiJS 这些路径。六条路都摆出来了，可到底选哪条？",
          "duration_seconds": 13,
          "visual_beats": [
            {"at_seconds": 0, "action": "表头淡入"},
            {"at_seconds": 3, "action": "六行依次 stagger 入场"}
          ]
        }
      ]
    },
    {
      "id": "3",
      "track": "A",
      "voice": "第二步，技术选型，也是最容易翻车的一步。直接问 AI 哪个好，它会把每个都夸一遍，你照样选不出来。值钱的是看清每条路什么时候不好使、会在哪一步出问题。所以反过来逼它：把每条路的核心优势、劣势，全摆到台面上，列成一张表。就拿 Remotion 来说：优势是前端 React 栈、排版能力强、模板还能跨期复用。劣势也不藏——组件顶层直接读浏览器对象，打包阶段当场崩；而且是 BUSL 授权，做大了要给钱。Motion Canvas 排版生态小，复杂网页排版吃力。Manim 学习曲线陡，普通 UI 不合适。MoviePy 文字排版繁琐，改了要重跑。PixiJS 文字对齐计算复杂。FFmpeg 做不了复杂动效。优劣摆齐了，再拿自己的约束去卡。我的约束就三条：固定模板、换数据批量出几十期；AI 改内容别老出错；跨期还得好维护。三条一卡，Remotion 胜出。你可能会问，直接拿 HTML 画页面不行吗？行。但你改一处，剩下几十期不会跟着变。Remotion 不一样，改一处全系列生效，AI 只能照着填数据，动不了结构。十期之后，照样管得住。代价也清楚：React 技术栈，加 BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。一句话：让 AI 把信息铺开，真正拍板的判断，留给人。",
      "visual_instructions": "@TableScene 全方位对比矩阵（6行）→ @SplitLayout 聚焦赢家 Remotion 优势/劣势 → @ConceptScene 三条约束 → @SplitLayout vs 直接使用 HTML 绘制页面 → @CalloutScene(warning) 代价 → @QuoteScene 金句。",
      "duration_hint_seconds": 64,
      "shots": [
        {
          "id": "3.1",
          "scene_template": "@TableScene",
          "props": {
            "title": "让 AI 全方位对比：核心优势 + 劣势",
            "headers": ["方案", "核心优势", "劣势"],
            "rows": [
              ["Remotion", "前端 React 栈、复杂排版强、模板跨期复用、命令行易自动化", "纯后台超长批处理弱；顶层读 window 打包崩；BUSL 授权"],
              ["Motion Canvas / Revideo", "代码声明动画、时序精确，适合代码演示", "组件/排版生态小，复杂网页排版吃力，模板要自己攒"],
              ["Manim", "数学/公式/算法可视化专业", "学习曲线陡、排版弱、渲染慢，普通 UI 不合适"],
              ["MoviePy", "纯 Python、简单拼接、音轨闪避", "文字排版繁琐、改了要重跑，复杂动效弱"],
              ["PixiJS / Cocos", "游戏级复杂粒子动画", "文字换行/对齐计算复杂，标准网页 UI 吃力"],
              ["FFmpeg + 脚本", "批量转码、字幕烧录、兜底合成", "命令语法晦涩、难调试，做不了复杂动效"]
            ],
            "enter": "rise"
          },
          "voice_slice": "第二步，技术选型，也是最容易翻车的一步。直接问 AI 哪个好，它会把每个都夸一遍，你照样选不出来。值钱的是看清每条路什么时候不好使、会在哪一步出问题。所以反过来逼它：把每条路的核心优势、劣势，全摆到台面上，列成一张表。",
          "duration_seconds": 16,
          "visual_beats": [
            {"at_seconds": 0, "action": "表头淡入"},
            {"at_seconds": 4, "action": "六行依次 stagger 入场"}
          ]
        },
        {
          "id": "3.2",
          "scene_template": "@SplitLayout",
          "props": {
            "title": "只看赢家 Remotion：优势 vs 劣势",
            "leftLabel": "优势 ✅",
            "leftValue": "前端 React 栈、复杂排版强、模板还能跨期复用",
            "rightLabel": "劣势 ⚠️",
            "rightValue": "顶层读 window 打包崩；纯后台超长批处理弱；BUSL 授权做大了要付费",
            "enter": "rise"
          },
          "voice_slice": "就拿 Remotion 来说：优势是前端 React 栈、排版能力强、模板还能跨期复用。劣势也不藏——组件顶层直接读浏览器对象，打包阶段当场崩；而且是 BUSL 授权，做大了要给钱。",
          "duration_seconds": 10,
          "visual_beats": [
            {"at_seconds": 0, "action": "左栏「优势」淡入"},
            {"at_seconds": 5, "action": "右栏「劣势」入场"}
          ]
        },
        {
          "id": "3.3",
          "scene_template": "@ConceptScene",
          "props": {
            "eyebrow": "结合我的工程约束",
            "title": "三条约束一卡，Remotion 胜出",
            "items": [
              {"icon": "🧩", "label": "复用", "title": "固定模板换数据", "desc": "改一处主题，全系列生效"},
              {"icon": "🤖", "label": "不出错", "title": "让 AI 改内容不容易错", "desc": "只填数据、套现成组件"},
              {"icon": "🛠️", "label": "维护", "title": "跨期好维护", "desc": "十期后还管得住"}
            ]
          },
          "voice_slice": "优劣摆齐了，再拿自己的约束去卡。我的约束就三条：固定模板、换数据批量出几十期；AI 改内容别老出错；跨期还得好维护。三条一卡，Remotion 胜出。",
          "duration_seconds": 10
        },
        {
          "id": "3.4",
          "scene_template": "@SplitLayout",
          "props": {
            "title": "Remotion vs 直接使用 HTML 绘制页面",
            "leftLabel": "Remotion ✅",
            "leftValue": "改一处全系列生效；AI 只填数据不乱改结构；十期后还好维护",
            "rightLabel": "直接使用 HTML ❌",
            "rightValue": "每期复制改，越改越乱，结构容易跑偏",
            "enter": "rise"
          },
          "voice_slice": "你可能会问，直接拿 HTML 画页面不行吗？行。但你改一处，剩下几十期不会跟着变。Remotion 不一样，改一处全系列生效，AI 只能照着填数据，动不了结构。十期之后，照样管得住。",
          "duration_seconds": 12
        },
        {
          "id": "3.5",
          "scene_template": "@CalloutScene",
          "props": {
            "callout_type": "warning",
            "title": "代价也清楚",
            "text": "React 技术栈 + BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。"
          },
          "voice_slice": "代价也清楚：React 技术栈，加 BUSL 授权，规模化商用要付费。但前端本来就是 AI 写、人把方向，不构成门槛。",
          "duration_seconds": 8
        },
        {
          "id": "3.6",
          "scene_template": "@QuoteScene",
          "props": {
            "text": "让 AI 把信息铺开，真正拍板的判断，留给人。"
          },
          "voice_slice": "一句话：让 AI 把信息铺开，真正拍板的判断，留给人。",
          "duration_seconds": 8
        }
      ]
    },
    {
      "id": "4",
      "track": "A",
      "voice": "路线定了 Remotion。它怎么工作？用 React 写页面和动画，引擎逐帧截图，再合成视频。你写的就是一个网页——网页上能画的，它就能渲成片。而且从页面到成品全自动，不用你盯着，也不用手动剪。那它为什么这么好被 AI 驱动？四条原因。第一，写的就是网页——React 加 CSS 是 AI 语料里最厚的一块，最熟也最不容易错。第二，内容和模板分开，改数据就改片，正好撞在它改文本的强项上。第三，字段用 TypeScript 定死，填错漏填当场报红，乱来的空间压到最小。第四，出片全自动，截图、合成全交给引擎，天生适合批量。一条心法：把视频写成数据，AI 只负责填空，不乱跑。原理通了，接着搭引擎。",
      "visual_instructions": "@FlowScene 用 React 写页面和动画 → 引擎逐帧截图合成 → 全自动出片 → @BulletScene 好驱动四条 → @QuoteScene 金句。",
      "duration_hint_seconds": 38,
      "shots": [
        {
          "id": "4.1",
          "scene_template": "@FlowScene",
          "props": {
            "title": "Remotion 大致怎么工作",
            "orientation": "horizontal",
            "steps": [
              {"icon": "⚛️", "label": "React 写页面和动画", "desc": "网页长什么样、怎么动都用 React + CSS 描述"},
              {"icon": "📸", "label": "引擎逐帧截图", "desc": "从头到尾逐帧截图再合成视频"},
              {"icon": "🤖", "label": "全自动出片", "desc": "不用人盯、不用手剪，天然可批量"}
            ]
          },
          "voice_slice": "路线定了 Remotion。它怎么工作？用 React 写页面和动画，引擎逐帧截图，再合成视频。你写的就是一个网页——网页上能画的，它就能渲成片。而且从页面到成品全自动，不用你盯着，也不用手动剪。",
          "duration_seconds": 16
        },
        {
          "id": "4.2",
          "scene_template": "@BulletScene",
          "props": {
            "eyebrow": "为什么 AI 特别好驱动",
            "title": "四条原因",
            "ordered": true,
            "items": [
              "写的就是网页：React + CSS 是 AI 语料里最厚的一块，最熟最不容易错",
              "改数据就改片：内容和模板分开，正中 AI 改文本之长",
              "类型兜底：字段用 TypeScript 定死，填错漏填当场报红",
              "出片全自动：逐帧截图、合成全交给引擎，天然可批量"
            ]
          },
          "voice_slice": "那它为什么这么好被 AI 驱动？四条原因。第一，写的就是网页——React 加 CSS 是 AI 语料里最厚的一块，最熟也最不容易错。第二，内容和模板分开，改数据就改片，正好撞在它改文本的强项上。第三，字段用 TypeScript 定死，填错漏填当场报红，乱来的空间压到最小。第四，出片全自动，截图、合成全交给引擎，天生适合批量。",
          "duration_seconds": 16
        },
        {
          "id": "4.3",
          "scene_template": "@QuoteScene",
          "props": {
            "text": "把视频写成数据，AI 只负责填空，不乱跑。"
          },
          "voice_slice": "一条心法：把视频写成数据，AI 只负责填空，不乱跑。原理通了，接着搭引擎。",
          "duration_seconds": 6
        }
      ]
    },
    {
      "id": "5",
      "track": "A",
      "voice": "选型定了，进落地。引擎不用你自己写，你要做的，是把配置和现成组件对上号。这台引擎叫 remotion-composer。你写一份配置，讲清这段画面是什么；主程序 Explainer 读配置里的 type 字段，自动挑对应组件去渲。现成的模板场景有一整套——开场、收尾、概念、要点、流程、表格、左右对比、图表、核心数字、提示避坑、金句、章节分隔，还有合成终端和截图叠层。全是深色科技底加白字，改一处主题，全片跟着变。所以做内容，其实就是挑组件、填字段。想要一张对比卡？你就说左边传统剪辑、右边代码即视频，AI 吐出来的，就是一段 type 写 comparison 的配置，齐活。这里有条铁律：不许 AI 发明新组件，只让它照现成的填数据。让它从零手写，既在重复造轮子，又把「换数据就复用」的好处弄没了。而且每个字段都用 TypeScript 定死，AI 填错、漏填，当场报红，想乱发挥都没空间。至于在现成组件上再扩一套自有品牌风格，那是更大的话题，以后单独开一期。这期，先用现成的把片子跑通。",
      "visual_instructions": "@FlowScene 分发流向 → @BulletScene 场景清单 → @TerminalScene 配置样例 → @SplitLayout 造轮子 vs 填数据 → @CalloutScene 自有组件库一句带过。",
      "duration_hint_seconds": 70,
      "shots": [
        {
          "id": "5.1",
          "scene_template": "@FlowScene",
          "props": {
            "title": "一份配置 → Explainer 按 type 分发 → 组件",
            "orientation": "horizontal",
            "steps": [
              {"icon": "🧾", "label": "写一份配置", "desc": "说清这段画面是什么、叠什么"},
              {"icon": "🔀", "label": "Explainer 读 type", "desc": "按 type 字段自动分发"},
              {"icon": "🧱", "label": "对应组件渲染", "desc": "comparison→对比卡，terminal→合成终端…"}
            ]
          },
          "voice_slice": "选型定了，进落地。引擎不用你自己写，你要做的，是把配置和现成组件对上号。这台引擎叫 remotion-composer。你写一份配置，讲清这段画面是什么；主程序 Explainer 读配置里的 type 字段，自动挑对应组件去渲。",
          "duration_seconds": 16
        },
        {
          "id": "5.2",
          "scene_template": "@BulletScene",
          "props": {
            "eyebrow": "现成模板场景（统一深色科技风 + 白字）",
            "title": "照着填就能用",
            "items": [
              "开场 / 章节分隔 / 片尾 CTA",
              "概念卡 / 要点清单 / 流程图",
              "表格 / 左右对比",
              "图表 / 核心数字",
              "提示避坑框 / 金句大字",
              "合成终端 / 截图叠层（不用真录屏）"
            ]
          },
          "voice_slice": "现成的模板场景有一整套——开场、收尾、概念、要点、流程、表格、左右对比、图表、核心数字、提示避坑、金句、章节分隔，还有合成终端和截图叠层。全是深色科技底加白字，改一处主题，全片跟着变。",
          "duration_seconds": 14
        },
        {
          "id": "5.3",
          "scene_template": "@TerminalScene",
          "props": {
            "terminalTitle": "让 AI 只填字段、不造组件",
            "prompt": "jsonc",
            "steps": [
              {"cmd": "{ 'type': 'comparison_scene',"},
              {"cmd": "  'leftLabel': '传统剪辑', 'leftValue': '拖时间轴，改一处全手工重排',"},
              {"cmd": "  'rightLabel': '代码即视频', 'rightValue': '改一行配置，重新编译出片' }"},
              {"out": "// Explainer 自动渲成对比卡，无需新建组件"}
            ]
          },
          "voice_slice": "所以做内容，其实就是挑组件、填字段。想要一张对比卡？你就说左边传统剪辑、右边代码即视频，AI 吐出来的，就是一段 type 写 comparison 的配置，齐活。",
          "duration_seconds": 15
        },
        {
          "id": "5.4",
          "scene_template": "@SplitLayout",
          "props": {
            "title": "心法：填数据，别造轮子",
            "leftLabel": "让 AI 从零手写组件 ❌",
            "leftValue": "重复造轮子，丢掉「换数据就复用」的好处",
            "rightLabel": "只填数据、复用现成组件 ✅",
            "rightValue": "TypeScript 字段定死、填错即报红，结构稳、可复用",
            "enter": "rise"
          },
          "voice_slice": "这里有条铁律：不许 AI 发明新组件，只让它照现成的填数据。让它从零手写，既在重复造轮子，又把「换数据就复用」的好处弄没了。而且每个字段都用 TypeScript 定死，AI 填错、漏填，当场报红，想乱发挥都没空间。",
          "duration_seconds": 15
        },
        {
          "id": "5.5",
          "scene_template": "@CalloutScene",
          "props": {
            "callout_type": "tip",
            "title": "自有风格组件库",
            "text": "想要更强品牌辨识度，可在现成组件上再扩一套——更大的话题，后续单独开一期，这期先用现成的把片子跑通。"
          },
          "voice_slice": "至于在现成组件上再扩一套自有品牌风格，那是更大的话题，以后单独开一期。这期，先用现成的把片子跑通。",
          "duration_seconds": 10
        }
      ]
    },
    {
      "id": "6",
      "track": "A",
      "voice": "视频要不要一个出镜形象来串场？先把定位钉死：数字人只是陪衬，不是主角，真正的干货，永远是屏幕上的真实操作。定位定了，套一样的方法论——让 AI 把每种形象的核心优势、劣势全方位摆出来。真人出镜最可信、有温度，但你得露脸，也没法编程批量复用。写实数字人对口型像真主播，可它太容易掉进恐怖谷，一掉进去，可信度就崩了。二次元或者 3D 风格化角色走 VRM，风格统一、能编程、渲一次到处用，还不踩恐怖谷。劣势是要建模与动作绑定，但可以交给 AI 和现成方案。优劣摆全，再拿约束去卡——不露脸、要能编程批量复用、避开恐怖谷。选定 3D 风格化角色 VRMAvatar，并且定死一条：只做陪衬，坚决不做对口型。落地照样交给 AI：整体渲一次，再按场景裁——角落、半身、全身。",
      "visual_instructions": "@ConceptScene 定位 → @TableScene 形象选型全方位对比（高亮 VRM）→ @ConceptScene 结合约束选定 → @BulletScene AI 落地取景。",
      "duration_hint_seconds": 54,
      "shots": [
        {
          "id": "6.1",
          "scene_template": "@ConceptScene",
          "props": {
            "eyebrow": "数字人 · 先定位",
            "title": "陪衬、串场，不是主角",
            "items": [
              {"icon": "🎭", "label": "定位", "title": "只做陪衬", "desc": "真正的干货，永远是屏幕上的真实操作"},
              {"icon": "🧭", "label": "方法", "title": "套同一套选型", "desc": "先定位，再让 AI 全方位对比核心优势与劣势"}
            ]
          },
          "voice_slice": "视频要不要一个出镜形象来串场？先把定位钉死：数字人只是陪衬，不是主角，真正的干货，永远是屏幕上的真实操作。",
          "duration_seconds": 13
        },
        {
          "id": "6.2",
          "scene_template": "@TableScene",
          "props": {
            "title": "让 AI 全方位对比形象选型",
            "headers": ["形象方案", "核心优势", "劣势"],
            "rows": [
              ["真人出镜", "最可信、有温度", "要露脸、不可编程复用、隐私成本"],
              ["写实数字人 / 对口型", "像真主播", "易掉恐怖谷、可信度反崩；口型是重活"],
              ["二次元 / 3D 风格化（VRM）", "风格统一、可编程、渲一次到处用", "要建模与动作绑定，可交给 AI"]
            ],
            "highlightCell": "3-1",
            "enter": "rise"
          },
          "voice_slice": "定位定了，套一样的方法论——让 AI 把每种形象的核心优势、劣势全方位摆出来。真人出镜最可信、有温度，但你得露脸，也没法编程批量复用。写实数字人对口型像真主播，可它太容易掉进恐怖谷，一掉进去，可信度就崩了。二次元或者 3D 风格化角色走 VRM，风格统一、能编程、渲一次到处用，还不踩恐怖谷。劣势是要建模与动作绑定，但可以交给 AI 和现成方案。",
          "duration_seconds": 18,
          "visual_beats": [
            {"at_seconds": 0, "action": "表头淡入"},
            {"at_seconds": 4, "action": "三行依次 stagger 入场，高亮 VRM 行"}
          ]
        },
        {
          "id": "6.3",
          "scene_template": "@ConceptScene",
          "props": {
            "eyebrow": "结合约束选定",
            "title": "选定 VRM 3D 角色",
            "items": [
              {"icon": "🙈", "label": "约束", "title": "不露脸 · 可批量 · 避恐怖谷", "desc": "三条约束卡下来，选 VRMAvatar"},
              {"icon": "🚫", "label": "定死", "title": "坚决不做对口型", "desc": "可信度只靠真实录屏"}
            ]
          },
          "voice_slice": "优劣摆全，再拿约束去卡——不露脸、要能编程批量复用、避开恐怖谷。选定 3D 风格化角色 VRMAvatar，并且定死一条：只做陪衬，坚决不做对口型。",
          "duration_seconds": 15
        },
        {
          "id": "6.4",
          "scene_template": "@BulletScene",
          "props": {
            "eyebrow": "AI 落地",
            "title": "渲一次、按场景取景",
            "items": [
              "整体渲一次，再按场景裁角落 / 半身 / 全身（取景预设）",
              "不用每个场景重搭形象，落地交给 AI"
            ]
          },
          "voice_slice": "落地照样交给 AI：整体渲一次，再按场景裁——角落、半身、全身。",
          "duration_seconds": 8
        }
      ]
    },
    {
      "id": "7",
      "track": "A",
      "voice": "引擎跑通了，更值钱的判断是：什么场景该用它？让它独占整屏、纯模板自动出片，适合的是那种换数据就能批量复用的内容——概念讲解、要点流程、图表对比、开场收尾。命令和报错，用合成终端兜底，不用真去录屏。第二种，搭配着用。主体是真人口播、或者真实录屏的时候，Remotion 别独占整屏，把它渲成透明背景的悬浮叠层贴上去——数据卡、字幕高亮、局部标注，都行。还有三类，别硬上。真实的物理世界，该拍就拍。写实对口型数字人，恐怖谷加可信度崩，这项目直接排除。影视级特效和超长批处理，交给专业工具和 FFmpeg。一句口诀：主体是真实画面，就退居叠层；主体是讲解和数据，就独占整屏。",
      "visual_instructions": "@ConceptScene 适合纯自动渲染 → @SplitLayout 独占整屏 vs 退居叠层 → @CalloutScene(warning) 不适合四类 → @QuoteScene 口诀。",
      "duration_hint_seconds": 52,
      "shots": [
        {
          "id": "7.1",
          "scene_template": "@ConceptScene",
          "props": {
            "eyebrow": "用在哪 · 独占整屏自动出片",
            "title": "模板化、换数据批量复用",
            "items": [
              {"icon": "🧠", "label": "讲解", "title": "概念 / 要点 / 流程", "desc": "concept / bullet / flow"},
              {"icon": "📊", "label": "数据", "title": "图表 / 对比 / 核心数字", "desc": "chart / table / comparison / stat"},
              {"icon": "💻", "label": "演示", "title": "合成终端兜底", "desc": "命令 / 报错不用真录屏"}
            ]
          },
          "voice_slice": "引擎跑通了，更值钱的判断是：什么场景该用它？让它独占整屏、纯模板自动出片，适合的是那种换数据就能批量复用的内容——概念讲解、要点流程、图表对比、开场收尾。命令和报错，用合成终端兜底，不用真去录屏。",
          "duration_seconds": 16
        },
        {
          "id": "7.2",
          "scene_template": "@SplitLayout",
          "props": {
            "title": "主体不同，站位不同",
            "leftLabel": "讲解 / 数据为主 → 独占整屏",
            "leftValue": "文本、数据就能说清的内容，Remotion 全屏出片",
            "rightLabel": "真人 / 录屏为主 → 退居叠层",
            "rightValue": "渲透明背景悬浮层：数据卡 / 字幕 / 角标 / Zoom 标注",
            "enter": "rise"
          },
          "voice_slice": "第二种，搭配着用。主体是真人口播、或者真实录屏的时候，Remotion 别独占整屏，把它渲成透明背景的悬浮叠层贴上去——数据卡、字幕高亮、局部标注，都行。",
          "duration_seconds": 14
        },
        {
          "id": "7.3",
          "scene_template": "@CalloutScene",
          "props": {
            "callout_type": "warning",
            "title": "这三类别硬上",
            "text": "实拍人物产品该拍就拍；写实对口型数字人（恐怖谷）本项目排除；影视级特效 / 逐帧手绘交专业工具；纯后台超长批处理用 FFmpeg 更划算。"
          },
          "voice_slice": "还有三类，别硬上。真实的物理世界，该拍就拍。写实对口型数字人，恐怖谷加可信度崩，这项目直接排除。影视级特效和超长批处理，交给专业工具和 FFmpeg。",
          "duration_seconds": 14
        },
        {
          "id": "7.4",
          "scene_template": "@QuoteScene",
          "props": {
            "text": "主体是真实画面就退居叠层，主体是讲解和数据就独占整屏。"
          },
          "voice_slice": "一句口诀：主体是真实画面，就退居叠层；主体是讲解和数据，就独占整屏。",
          "duration_seconds": 8
        }
      ]
    },
    {
      "id": "8",
      "track": "A",
      "voice": "回顾一下，整期就三步：让 AI 把技术路径全列出来，你做全方位对比、结合约束选型，再让 AI 填配置、套组件、自动出片。这套流程不吃编程基础——会讲需求、会验收，你就能复制。这个频道就一条原则：不吹 AI，真落地，真开源。觉得有用，点个关注。下期 EP03 讲字幕匹配：用 Whisper 拿到字级时间戳，自动驱动 CaptionOverlay，让字幕踩着话音一个字一个字往外蹦。",
      "visual_instructions": "@FlowScene 三步法回顾卡（首尾呼应）→ @OutroScene 关注引导 + EP03 预告。",
      "duration_hint_seconds": 19,
      "shots": [
        {
          "id": "8.1",
          "scene_template": "@FlowScene",
          "props": {
            "eyebrow": "整期回顾 · 三步法",
            "title": "AI 罗列 → 人全方位对比·结合约束 → AI 填配置出片",
            "orientation": "horizontal",
            "steps": [
              {"icon": "🧭", "label": "找技术路径", "desc": "AI 把最优技术路线全列出来"},
              {"icon": "⚖️", "label": "技术选型", "desc": "人做全方位对比、结合约束选定"},
              {"icon": "🚀", "label": "落地出片", "desc": "AI 填配置、套组件、自动出片"}
            ]
          },
          "voice_slice": "回顾一下，整期就三步：让 AI 把技术路径全列出来，你做全方位对比、结合约束选型，再让 AI 填配置、套组件、自动出片。这套流程不吃编程基础——会讲需求、会验收，你就能复制。",
          "duration_seconds": 8
        },
        {
          "id": "8.2",
          "scene_template": "@OutroScene",
          "props": {
            "headline": "不吹AI，真落地，真开源",
            "cta": "关注 · 下期 EP03：Whisper 字级时间戳驱动字幕"
          },
          "voice_slice": "这个频道就一条原则：不吹 AI，真落地，真开源。觉得有用，点个关注。下期 EP03 讲字幕匹配：用 Whisper 拿到字级时间戳，自动驱动 CaptionOverlay，让字幕踩着话音一个字一个字往外蹦。",
          "duration_seconds": 11
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
