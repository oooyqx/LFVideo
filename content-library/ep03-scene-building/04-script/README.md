---
stage: 04-script
platform: bilibili
status: approved
source_workflow: /04-script-draft
---

# ep03 视频脚本：用 Vibe Coding 构建特色鲜明的 Remotion 渲染场景

> 本脚本基于 `02-plan/tutorial.final.md` 内容真相源撰写，逐条覆盖末尾「必讲要点覆盖清单」。

---

## 第一段：【@IntroScene → @ConceptScene → @CalloutScene】开场（目标 35s）

- **[画面]**
  - **[镜头 1.1]** `@IntroScene`（8s）。Props title="用 Vibe Coding 构建特色鲜明的 Remotion 渲染场景", subtitle="EP03 · 渲染场景搭建"
    - visual_beats: [{at_seconds:0, action:"主标题渐入"}, {at_seconds:4, action:"副标题淡入"}]
  - **[镜头 1.2]** `@ConceptScene`（15s）。Props eyebrow="关键认知", title="特色在画面分层，不在写更花哨的组件", items=[{label:"分层", title:"背景层", desc:"定调子：渐变、网格、视频", icon:"🎨"}, {label:"分层", title:"内容层", desc:"讲东西：卡片、表格、图表", icon:"📊"}, {label:"分层", title:"叠层", desc:"辅助理解：标题、字幕、高亮", icon:"🏷️"}, {label:"分层", title:"角色层", desc:"人格化：主持人、数字人", icon:"🧑"}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"四张卡片依次 stagger 入场"}]
  - **[镜头 1.3]** `@CalloutScene`（12s）。Props callout_type="tip", title="核心判断", text="理解了分层架构，就能指挥 AI 搭出有空间感、有辨识度的场景"
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:4, action:"大字渐入"}]

- **[口播]** 怎么构建特色鲜明的 Remotion 渲染场景？特色不在"让 AI 写更花哨的组件"，而在画面分层。背景、内容、叠层、主持人各自独立成层，按需组合——理解了分层，就能指挥 AI 搭出有空间感、有辨识度的场景。

---

## 第二段：【@ConceptScene → @CalloutScene】画面分层原理（目标 40s）

- **[画面]**
  - **[镜头 2.1]** `@ConceptScene`（20s）。Props eyebrow="通用认知", title="视频场景 = 从底到顶叠图层", items=[{label:"第 1 层", title:"背景层", desc:"定调子，不承载信息——渐变、网格、视频", icon:"🌅"}, {label:"第 2 层", title:"内容层", desc:"讲东西，承载信息——卡片、表格、图表、终端", icon:"📐"}, {label:"第 3 层", title:"叠层", desc:"辅助理解——标题、字幕、角标、高亮", icon:"🔖"}, {label:"第 4 层", title:"角色层", desc:"人格化——主持人、数字人", icon:"🧑"}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"第1层卡片入场"}, {at_seconds:7, action:"第2层卡片入场"}, {at_seconds:11, action:"第3层卡片入场"}, {at_seconds:15, action:"第4层卡片入场"}]
  - **[镜头 2.2]** `@CalloutScene`（10s）。Props callout_type="tip", title="为什么分层", text="改一层不动其他层", items=["换数据只改内容层，背景和主持人不用重做", "AI 填配置时只管自己那层，不会互相干扰"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"两条要点依次入场"}]
  - **[镜头 2.3]** `@QuoteScene`（10s）。Props text="你只需要决定要哪几层、每层什么风格——剩下交给 AI"
    - visual_beats: [{at_seconds:0, action:"引号装饰淡入"}, {at_seconds:3, action:"大字渐入"}]

- **[口播]** 视频场景的本质都一样——从底到顶叠图层，每层独立渲染、独立控制。背景层定调子，不承载信息。内容层讲东西，承载信息。叠层辅助理解，标题、字幕、高亮。角色层人格化，主持人和数字人。为什么分层？改一层不动其他层。换数据只改内容层，背景和主持人不用重做。AI 填配置时只管自己那层，不会互相干扰。你只需要决定要哪几层、每层什么风格——剩下交给 AI。但分层只是原理，具体怎么落地？我们将以本视频为例，讲解视频分层构建。

---

## 第三段：【@StatScene → @TableScene】背景层（目标 25s）

- **[画面]**
  - **[镜头 3.1]** `@StatScene`（8s）。Props stat="多种方式", label="背景层构建"
    - visual_beats: [{at_seconds:0, action:"数字弹入"}, {at_seconds:2, action:"标签淡入"}]
  - **[镜头 3.2]** `@TableScene`（17s）。Props title="背景层构建方式", headers=["方式", "效果", "适合什么调子"], rows=[["渐变（编程）", "随时间缓慢变色的漂移流动渐变", "温暖、柔和"], ["科技网格（特效）", "暗色科技感网格，随时间缓慢平移", "硬核、技术"], ["浮动粒子（特效）", "科技感浮动微光粒子", "开场、未来感"], ["视频轮播（视频）", "随机轮播背景视频，叠在渐变上", "有素材、丰富"], ["垫图+遮罩（图片）", "静态图片加暗化遮罩，图太亮就压暗", "自定义氛围"], ["透明", "不画底，让下层透出", "主持人占满画面"]], enter="rise"
    - visual_beats: [{at_seconds:0, action:"表头淡入"}, {at_seconds:3, action:"六行依次 stagger 入场"}]

- **[口播]** 背景层是内容的平台。你可以通过 AI 编程将视频、图片、特效等多种方式叠加构建。最终目标就是构建出有你满意的动态场景。比如本视频的背景用的就是 3D 场景视频。背景层搞定了，内容层呢？EP02 讲过配置按 type 自动分发，这里重点讲怎么选场景。

---

## 第四段：【@StatScene → @TableScene → @ChatScene → @CalloutScene】内容层（目标 55s）

- **[画面]**
  - **[镜头 4.1]** `@StatScene`（5s）。Props stat="16种场景", label="内容层"
    - visual_beats: [{at_seconds:0, action:"数字弹入"}, {at_seconds:2, action:"标签淡入"}]
  - **[镜头 4.2]** `@TableScene`（20s）。Props title="16 种现成场景", headers=["场景", "什么时候用"], rows=[["开场 / 收尾", "片头大字报 / 片尾 CTA"], ["概念卡 / 要点清单 / 流程图", "概念拆解 / 平铺要点 / A→B→C 流程"], ["架构图", "分层节点 + 连接关系"], ["表格 / 对比卡", "多方案矩阵对比 / 两方对照"], ["时间线", "按时间/版本推进的事件"], ["图表 / 核心数字", "量化数据 / 单个硬指标"], ["终端 / 截图场景", "命令+输出演示 / 截图叠光标"], ["提示框 / 金句 / 章节分隔", "避坑提示 / 金句收束 / 段落过渡"], ["对话窗口", "模拟用户与 AI 的聊天交互"]], enter="rise"
    - visual_beats: [{at_seconds:0, action:"表头淡入"}, {at_seconds:3, action:"九行依次 stagger 入场"}]
  - **[镜头 4.3]** `@ChatScene`（15s）。Props title="怎么选场景", messages=[{role:"user", text:"这段讲三层架构，用哪个场景？"}, {role:"assistant", text:"用 architecture_scene，我帮你填好节点和连接关系。"}]
    - visual_beats: [{at_seconds:0, action:"聊天窗口淡入"}, {at_seconds:3, action:"用户消息入场"}, {at_seconds:7, action:"AI 消息入场"}]
  - **[镜头 4.4]** `@CalloutScene`（15s）。Props callout_type="warning", title="关键纪律", text="别让 AI 从零发明场景", items=["先看现成的能不能用", "不能用再用 AI 扩展：告诉 AI 需求 → AI 写组件 → 你验收"]
    - visual_beats: [{at_seconds:0, action:"警告框淡入"}, {at_seconds:3, action:"两条要点依次入场"}]

- **[口播]** 内容层承载信息。当前我们构建了 16 个模板场景，按内容语义对号入座——讲流程用流程图，讲对比用对比卡，讲架构用架构图。你现在看到的这个表格就是其中一种。不需要记组件名，你说"这段讲三层架构"，AI 自动选场景、填字段。想加自己的场景？告诉 AI 需求，AI 写组件、注册、填配置，你验收。关键纪律：别让 AI 从零发明场景——先看现成的能不能用，不能再扩展。内容层搞定了，但画面还是平的。想要空间感？下一层。

---

## 第五段：【@ConceptScene → @CalloutScene】全息屏与主持人（目标 20s）

- **[画面]**
  - **[镜头 5.1]** `@ConceptScene`（10s）。Props eyebrow="可选层", title="全息屏 = 背景中预留的三维空间区域", items=[{label:"实现", title:"矩阵变换", desc:"给四角坐标和背景图，引擎自动算透视变换", icon:"📐"}, {label:"定位", title:"非必须", desc:"背景加内容已经够用，全息屏和主持人都是锦上添花", icon:"💡"}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:3, action:"第一张卡片入场"}, {at_seconds:6, action:"第二张卡片入场"}]
  - **[镜头 5.2]** `@CalloutScene`（10s）。Props callout_type="tip", title="非必须", text="全息屏和主持人都是锦上添花", items=["背景层 + 内容层已经够用", "有素材再加全息屏，有模型再加主持人"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"两条要点依次入场"}]

- **[口播]** 全息屏是我们在背景中预留的一块有三维空间感的区域，通过矩阵变换实现。你给四角坐标和背景图，引擎自动算透视变换。这块不是必须的——包括主持人也一样，背景加内容已经够用，这些是锦上添花。但如果你要用主持人，怎么搭？

---

## 第六段：【@ConceptScene → @TableScene → @CalloutScene】VRM 主持人（目标 55s）

- **[画面]**
  - **[镜头 6.1]** `@ConceptScene`（15s）。Props eyebrow="VRM 主持人", title="渲染一次全身，按场景自动裁切", items=[{label:"概念", title:"讲概念→半身", desc:"主持人半身出镜", icon:"🗣️"}, {label:"表格", title:"展示表格→角落", desc:"主持人缩到角落", icon:"📐"}, {label:"开场", title:"开场→全身", desc:"主持人全身站旁边", icon:"🧑"}]
    - visual_beats: [{at_seconds:0, action:"标题淡入"}, {at_seconds:4, action:"第二张卡片入场"}, {at_seconds:8, action:"第三张卡片入场"}]
  - **[镜头 6.2]** `@TableScene`（15s）。Props title="两种模式", headers=["模式", "画面效果", "适合什么"], rows=[["角落模式", "主持人贴角落，内容不透明", "内容为主、主持人辅助"], ["占满模式", "主持人占满画面，内容透明浮在上层", "主持人为主、内容辅助"]], enter="rise"
    - visual_beats: [{at_seconds:0, action:"表头淡入"}, {at_seconds:3, action:"两行依次 stagger 入场"}]
  - **[镜头 6.3]** `@CalloutScene`（12s）。Props callout_type="info", title="口型同步", text="用字幕的逐字时间戳驱动口型", items=["每个字对应一个口型形状，不需要读音频波形", "字幕说'你好'，嘴就按'你'和'好'的口型动——帧级确定"]
    - visual_beats: [{at_seconds:0, action:"提示框淡入"}, {at_seconds:3, action:"两条要点依次入场"}]
  - **[镜头 6.4]** `@QuoteScene`（13s）。Props text="人选模型和动画，AI 填配置，引擎自动切镜头 + 驱动口型"
    - visual_beats: [{at_seconds:0, action:"引号装饰淡入"}, {at_seconds:3, action:"大字渐入"}]

- **[口播]** 主持人不是每帧重渲染 3D。引擎渲染一次全身，按场景类型自动裁切——讲概念半身出镜，展示表格缩到角落，开场全身站旁边。本视频就用了主持人，你现在看到的角落模式就是。AI 只填场景类型，镜头自动切好。口型同步用字幕的逐字时间戳驱动，每个字对应一个口型形状，不需要读音频波形。字幕说"你好"，嘴就按"你"和"好"的口型动——帧级确定。两种模式：角落模式贴角落，内容不透明，适合内容为主。占满模式占满画面，内容透明浮在上层，适合主持人为主。选好 VRM 模型和动画，告诉 AI 用哪种模式。AI 填配置，引擎自动切镜头加驱动口型。三层都讲完了，怎么组合？

---

## 第七段：【@FlowScene → @SplitLayout】三层叠加 + 指挥 AI（目标 35s）

- **[画面]**
  - **[镜头 7.1]** `@FlowScene`（20s）。Props eyebrow="指挥 AI 搭场景", title="六步路径", steps=[{label:"决定要哪几层", desc:"背景+内容是最小集；全息屏和主持人是可选增强", icon:"🎯"}, {label:"选背景构建方式", desc:"多种方式对号入座", icon:"🎨"}, {label:"填场景配置", desc:"16 种现成场景按语义选", icon:"📋"}, {label:"加主持人", desc:"加 avatar 配置块，选模式", icon:"🧑"}, {label:"加全息屏", desc:"给房间素材和屏幕坐标", icon:"🖥️"}, {label:"扩展新场景", desc:"让 AI 写组件，你验收", icon:"🔧"}], orientation="horizontal"
    - visual_beats: [{at_seconds:0, action:"第一步卡片入场"}, {at_seconds:3, action:"第二步卡片入场"}, {at_seconds:6, action:"第三步卡片入场"}, {at_seconds:9, action:"第四步卡片入场"}, {at_seconds:12, action:"第五步卡片入场"}, {at_seconds:15, action:"第六步卡片入场"}]
  - **[镜头 7.2]** `@SplitLayout`（15s）。Props title="适合 vs 不适合", leftLabel="✅ 适合", leftValue="模板化讲解 + 数据图表 + 有主持人的教学片", rightLabel="❌ 不适合", rightValue="实拍真人、写实数字人（恐怖谷）、高自由度影视特效"
    - visual_beats: [{at_seconds:0, action:"左右卡片同时淡入"}, {at_seconds:6, action:"左侧高亮"}]

- **[口播]** 本视频就是三层叠加的结果——背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。三层各自独立配置，互不干扰，引擎从底到顶渲染。指挥 AI 搭场景：第一步，决定要哪几层——背景加内容是最小集，全息屏和主持人可选。第二步，选背景构建方式。第三步，按语义让 AI 填场景配置。第四步，需要主持人？加 avatar 配置块。第五步，需要全息屏？给房间素材和屏幕坐标。第六步，现成场景不够？让 AI 扩展，你验收。适合的场景：模板化讲解、数据图表、有主持人的教学片。不适合的：实拍真人，该拍就拍。写实数字人，恐怖谷。高自由度影视特效，交专业工具。

---

## 第八段：【@FlowScene → @OutroScene】总结 + CTA（目标 30s）

- **[画面]**
  - **[镜头 8.1]** `@FlowScene`（15s）。Props eyebrow="三层回顾", title="", steps=[{label:"分层原理", desc:"背景→内容→叠层→角色", icon:"📚"}, {label:"三层实例", desc:"背景层→全息屏→VRM 主持人", icon:"🏗️"}, {label:"指挥 AI", desc:"选层→选风格→填场景→验收", icon:"🎯"}], orientation="horizontal"
    - visual_beats: [{at_seconds:0, action:"三步卡片依次入场（首尾呼应第一段）"}]
  - **[镜头 8.2]** `@OutroScene`（15s）。Props headline="不吹AI，真落地，真开源", cta="关注 · 一起用 AI 构建能落地、可复现的工作流"
    - visual_beats: [{at_seconds:0, action:"品牌卡淡入"}, {at_seconds:5, action:"CTA 按钮脉冲"}]

- **[口播]** 画面分层原理：视频场景就是从底到顶叠图层——背景、内容、叠层、角色。可迁移的通用认知，不限于 Remotion。本视频就是实例：背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。核心判断：特色在分层组合，不在写更花哨的组件。人决定要哪几层、选风格、给素材，AI 填配置、写扩展。会讲需求、会判断验收，就能指挥 AI 搭场景。下期 EP04 字幕匹配：TTS 时间戳 vs WhisperX 转录——两条路怎么选，弹跳字幕怎么做。

---

## 必讲要点覆盖核对

### 一、开场
- [x] 点题：构建特色鲜明的 Remotion 渲染场景
- [x] 关键认知：特色在画面分层，不在写更花哨的组件
- [x] 三步路线图：分层原理 → 三层实例 → 指挥 AI 搭场景

### 二、画面分层原理
- [x] 通用四层模型：背景 → 内容 → 叠层 → 角色
- [x] 为什么分层：改一层不动其他层 / AI 只管自己那层
- [x] 你只需要决定：要哪几层、每层什么风格

### 三、背景层
- [x] 多种构建方式：视频 / 图片 / 特效 / 编程
- [x] 目标：构建特色动态场景作为内容承载的平台
- [x] 本视频实例：3D 场景视频

### 四、内容层
- [x] 16 种现成场景
- [x] 按内容语义选场景（流程→流程图、对比→对比卡、架构→架构图）
- [x] AI 自动选场景 + 填字段
- [x] 扩展新场景：告诉 AI 需求 → AI 写组件 → 你验收
- [x] 关键纪律：别让 AI 从零发明场景

### 五、全息屏与主持人
- [x] 概念：背景中预留的三维空间区域，矩阵变换实现
- [x] 非必须：背景加内容已经够用，全息屏和主持人是锦上添花

### 六、VRM 主持人
- [x] 渲染一次全身画面，按场景自动裁切/摆位
- [x] 自动镜头切换：概念→半身、表格→角落、开场→全身
- [x] 口型同步：逐字时间戳驱动，不读音频波形
- [x] 两种模式：角落 vs 占满画面
- [x] 人选模型和动画，AI 填配置

### 七、完整配置 + 指挥 AI
- [x] 本视频实例：背景 3D 场景视频 + 内容场景模板 + 角落模式主持人
- [x] 搭场景路径：选层 → 选背景构建方式 → 填场景 → 加主持人/全息屏 → 扩展新场景
- [x] ✅ 适合：模板化讲解 + 数据图表 + 有主持人的教学片
- [x] ❌ 不适合：实拍真人、写实数字人（恐怖谷）、高自由度影视特效

### 八、总结 + 结尾 CTA
- [x] 分层原理回顾
- [x] 三层实例回顾
- [x] 核心判断：特色在分层组合，不在写更花哨的组件
- [x] "没编程基础也能复制"的落点
- [x] 关注引导 + 下期预告（EP04 字幕匹配：TTS 时间戳 vs WhisperX）

---

```json
{
  "title": "用 Vibe Coding 构建特色鲜明的 Remotion 渲染场景",
  "platform": "bilibili",
  "anti_hype_forbidden": ["一键出片", "百倍效率", "碾压", "秒出", "一行搞定"],
  "video_spec": { "aspect_ratio": "16:9", "resolution": "1920x1080", "fps": 30 },
  "estimated_duration_seconds": 365,
  "total_word_count": 1750,
  "sections": [
    {
      "id": "1",
      "track": "A",
      "voice": "怎么构建特色鲜明的 Remotion 渲染场景？特色不在\"让 AI 写更花哨的组件\"，而在画面分层。背景、内容、叠层、主持人各自独立成层，按需组合——理解了分层，就能指挥 AI 搭出有空间感、有辨识度的场景。",
      "visual_instructions": "@IntroScene 开场大字报 → @ConceptScene 四层模型 → @CalloutScene 核心判断",
      "duration_hint_seconds": 35,
      "shots": [
        {
          "id": "1.1",
          "scene_template": "@IntroScene",
          "props": { "title": "用 Vibe Coding 构建特色鲜明的 Remotion 渲染场景", "subtitle": "EP03 · 渲染场景搭建" },
          "voice_slice": "怎么构建特色鲜明的 Remotion 渲染场景？",
          "duration_seconds": 8,
          "visual_beats": [
            { "at_seconds": 0, "action": "主标题渐入" },
            { "at_seconds": 4, "action": "副标题淡入" }
          ]
        },
        {
          "id": "1.2",
          "scene_template": "@ConceptScene",
          "props": { "eyebrow": "关键认知", "title": "特色在画面分层，不在写更花哨的组件", "items": [{ "label": "分层", "title": "背景层", "desc": "定调子：渐变、网格、视频", "icon": "🎨" }, { "label": "分层", "title": "内容层", "desc": "讲东西：卡片、表格、图表", "icon": "📊" }, { "label": "分层", "title": "叠层", "desc": "辅助理解：标题、字幕、高亮", "icon": "🏷️" }, { "label": "分层", "title": "角色层", "desc": "人格化：主持人、数字人", "icon": "🧑" }] },
          "voice_slice": "特色不在\"让 AI 写更花哨的组件\"，而在画面分层。背景、内容、叠层、主持人各自独立成层，按需组合——理解了分层，就能指挥 AI 搭出有空间感、有辨识度的场景。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "四张卡片依次 stagger 入场" }
          ]
        },
        {
          "id": "1.3",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "核心判断", "text": "理解了分层架构，就能指挥 AI 搭出有空间感、有辨识度的场景" },
          "voice_slice": "理解了分层，就能指挥 AI 搭出有空间感、有辨识度的场景。",
          "duration_seconds": 12,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 4, "action": "大字渐入" }
          ]
        }
      ]
    },
    {
      "id": "2",
      "track": "A",
      "voice": "视频场景的本质都一样——从底到顶叠图层，每层独立渲染、独立控制。背景层定调子，不承载信息。内容层讲东西，承载信息。叠层辅助理解，标题、字幕、高亮。角色层人格化，主持人和数字人。为什么分层？改一层不动其他层。换数据只改内容层，背景和主持人不用重做。AI 填配置时只管自己那层，不会互相干扰。你只需要决定要哪几层、每层什么风格——剩下交给 AI。但分层只是原理，具体怎么落地？我们将以本视频为例，讲解视频分层构建。",
      "visual_instructions": "@ConceptScene 通用四层模型 → @CalloutScene 为什么分层 → @QuoteScene 你只需要决定",
      "duration_hint_seconds": 40,
      "shots": [
        {
          "id": "2.1",
          "scene_template": "@ConceptScene",
          "props": { "eyebrow": "通用认知", "title": "视频场景 = 从底到顶叠图层", "items": [{ "label": "第 1 层", "title": "背景层", "desc": "定调子，不承载信息——渐变、网格、视频", "icon": "🌅" }, { "label": "第 2 层", "title": "内容层", "desc": "讲东西，承载信息——卡片、表格、图表、终端", "icon": "📐" }, { "label": "第 3 层", "title": "叠层", "desc": "辅助理解——标题、字幕、角标、高亮", "icon": "🔖" }, { "label": "第 4 层", "title": "角色层", "desc": "人格化——主持人、数字人", "icon": "🧑" }] },
          "voice_slice": "视频场景的本质都一样——从底到顶叠图层，每层独立渲染、独立控制。背景层定调子，不承载信息。内容层讲东西，承载信息。叠层辅助理解，标题、字幕、高亮。角色层人格化，主持人和数字人。",
          "duration_seconds": 20,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "第1层卡片入场" },
            { "at_seconds": 7, "action": "第2层卡片入场" },
            { "at_seconds": 11, "action": "第3层卡片入场" },
            { "at_seconds": 15, "action": "第4层卡片入场" }
          ]
        },
        {
          "id": "2.2",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "为什么分层", "text": "改一层不动其他层", "items": ["换数据只改内容层，背景和主持人不用重做", "AI 填配置时只管自己那层，不会互相干扰"] },
          "voice_slice": "为什么分层？改一层不动其他层。换数据只改内容层，背景和主持人不用重做。AI 填配置时只管自己那层，不会互相干扰。",
          "duration_seconds": 10,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "两条要点依次入场" }
          ]
        },
        {
          "id": "2.3",
          "scene_template": "@QuoteScene",
          "props": { "text": "你只需要决定要哪几层、每层什么风格——剩下交给 AI" },
          "voice_slice": "你只需要决定要哪几层、每层什么风格——剩下交给 AI。但分层只是原理，具体怎么落地？我们将以本视频为例，讲解视频分层构建。",
          "duration_seconds": 10,
          "visual_beats": [
            { "at_seconds": 0, "action": "引号装饰淡入" },
            { "at_seconds": 3, "action": "大字渐入" }
          ]
        }
      ]
    },
    {
      "id": "3",
      "track": "A",
      "voice": "背景层是内容的平台。你可以通过 AI 编程将视频、图片、特效等多种方式叠加构建。最终目标就是构建出有你满意的动态场景。比如本视频的背景用的就是 3D 场景视频。背景层搞定了，内容层呢？EP02 讲过配置按 type 自动分发，这里重点讲怎么选场景.",
      "visual_instructions": "@StatScene 多种方式 → @TableScene 构建方式",
      "duration_hint_seconds": 25,
      "shots": [
        {
          "id": "3.1",
          "scene_template": "@StatScene",
          "props": { "stat": "多种方式", "label": "背景层构建" },
          "voice_slice": "背景层是内容的平台。你可以通过 AI 编程将视频、图片、特效等多种方式叠加构建。",
          "duration_seconds": 8,
          "visual_beats": [
            { "at_seconds": 0, "action": "数字弹入" },
            { "at_seconds": 2, "action": "标签淡入" }
          ]
        },
        {
          "id": "3.2",
          "scene_template": "@TableScene",
          "props": { "title": "背景层构建方式", "headers": ["方式", "效果", "适合什么调子"], "rows": [["渐变（编程）", "随时间缓慢变色的漂移流动渐变", "温暖、柔和"], ["科技网格（特效）", "暗色科技感网格，随时间缓慢平移", "硬核、技术"], ["浮动粒子（特效）", "科技感浮动微光粒子", "开场、未来感"], ["视频轮播（视频）", "随机轮播背景视频，叠在渐变上", "有素材、丰富"], ["垫图+遮罩（图片）", "静态图片加暗化遮罩，图太亮就压暗", "自定义氛围"], ["透明", "不画底，让下层透出", "主持人占满画面"]], "enter": "rise" },
          "voice_slice": "最终目标就是构建出有你满意的动态场景。比如本视频的背景用的就是 3D 场景视频。背景层搞定了，内容层呢？EP02 讲过配置按 type 自动分发，这里重点讲怎么选场景.",
          "duration_seconds": 17,
          "visual_beats": [
            { "at_seconds": 0, "action": "表头淡入" },
            { "at_seconds": 3, "action": "六行依次 stagger 入场" }
          ]
        }
      ]
    },
    {
      "id": "4",
      "track": "A",
      "voice": "内容层承载信息。当前我们构建了 16 个模板场景，按内容语义对号入座——讲流程用流程图，讲对比用对比卡，讲架构用架构图。你现在看到的这个表格就是其中一种。不需要记组件名，你说\"这段讲三层架构\"，AI 自动选场景、填字段。想加自己的场景？告诉 AI 需求，AI 写组件、注册、填配置，你验收。关键纪律：别让 AI 从零发明场景——先看现成的能不能用，不能再扩展。内容层搞定了，但画面还是平的。想要空间感？下一层.",
      "visual_instructions": "@StatScene 16种场景 → @TableScene 场景清单 → @ChatScene 怎么选 → @CalloutScene 关键纪律",
      "duration_hint_seconds": 55,
      "shots": [
        {
          "id": "4.1",
          "scene_template": "@StatScene",
          "props": { "stat": "16种场景", "label": "内容层" },
          "voice_slice": "内容层承载信息。当前我们构建了 16 个模板场景，",
          "duration_seconds": 5,
          "visual_beats": [
            { "at_seconds": 0, "action": "数字弹入" },
            { "at_seconds": 2, "action": "标签淡入" }
          ]
        },
        {
          "id": "4.2",
          "scene_template": "@TableScene",
          "props": { "title": "16 种现成场景", "headers": ["场景", "什么时候用"], "rows": [["开场 / 收尾", "片头大字报 / 片尾 CTA"], ["概念卡 / 要点清单 / 流程图", "概念拆解 / 平铺要点 / A→B→C 流程"], ["架构图", "分层节点 + 连接关系"], ["表格 / 对比卡", "多方案矩阵对比 / 两方对照"], ["时间线", "按时间/版本推进的事件"], ["图表 / 核心数字", "量化数据 / 单个硬指标"], ["终端 / 截图场景", "命令+输出演示 / 截图叠光标"], ["提示框 / 金句 / 章节分隔", "避坑提示 / 金句收束 / 段落过渡"], ["对话窗口", "模拟用户与 AI 的聊天交互"]], "enter": "rise" },
          "voice_slice": "按内容语义对号入座——讲流程用流程图，讲对比用对比卡，讲架构用架构图。你现在看到的这个表格就是其中一种。",
          "duration_seconds": 20,
          "visual_beats": [
            { "at_seconds": 0, "action": "表头淡入" },
            { "at_seconds": 3, "action": "九行依次 stagger 入场" }
          ]
        },
        {
          "id": "4.3",
          "scene_template": "@ChatScene",
          "props": { "title": "怎么选场景", "messages": [{ "role": "user", "text": "这段讲三层架构，用哪个场景？" }, { "role": "assistant", "text": "用 architecture_scene，我帮你填好节点和连接关系。" }] },
          "voice_slice": "不需要记组件名，你说\"这段讲三层架构\"，AI 自动选场景、填字段。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "聊天窗口淡入" },
            { "at_seconds": 3, "action": "用户消息入场" },
            { "at_seconds": 7, "action": "AI 消息入场" }
          ]
        },
        {
          "id": "4.4",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "warning", "title": "关键纪律", "text": "别让 AI 从零发明场景", "items": ["先看现成的能不能用", "不能用再用 AI 扩展：告诉 AI 需求 → AI 写组件 → 你验收"] },
          "voice_slice": "想加自己的场景？告诉 AI 需求，AI 写组件、注册、填配置，你验收。关键纪律：别让 AI 从零发明场景——先看现成的能不能用，不能再扩展。内容层搞定了，但画面还是平的。想要空间感？下一层。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "警告框淡入" },
            { "at_seconds": 3, "action": "两条要点依次入场" }
          ]
        }
      ]
    },
    {
      "id": "5",
      "track": "A",
      "voice": "全息屏是我们在背景中预留的一块有三维空间感的区域，通过矩阵变换实现。你给四角坐标和背景图，引擎自动算透视变换。这块不是必须的——包括主持人也一样，背景加内容已经够用，这些是锦上添花。但如果你要用主持人，怎么搭？",
      "visual_instructions": "@ConceptScene 全息屏概念 → @CalloutScene 非必须",
      "duration_hint_seconds": 20,
      "shots": [
        {
          "id": "5.1",
          "scene_template": "@ConceptScene",
          "props": { "eyebrow": "可选层", "title": "全息屏 = 背景中预留的三维空间区域", "items": [{ "label": "实现", "title": "矩阵变换", "desc": "给四角坐标和背景图，引擎自动算透视变换", "icon": "📐" }, { "label": "定位", "title": "非必须", "desc": "背景加内容已经够用，全息屏和主持人都是锦上添花", "icon": "💡" }] },
          "voice_slice": "全息屏是我们在背景中预留的一块有三维空间感的区域，通过矩阵变换实现。你给四角坐标和背景图，引擎自动算透视变换。",
          "duration_seconds": 10,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 3, "action": "第一张卡片入场" },
            { "at_seconds": 6, "action": "第二张卡片入场" }
          ]
        },
        {
          "id": "5.2",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "tip", "title": "非必须", "text": "全息屏和主持人都是锦上添花", "items": ["背景层 + 内容层已经够用", "有素材再加全息屏，有模型再加主持人"] },
          "voice_slice": "这块不是必须的——包括主持人也一样，背景加内容已经够用，这些是锦上添花。但如果你要用主持人，怎么搭？",
          "duration_seconds": 10,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "两条要点依次入场" }
          ]
        }
      ]
    },
    {
      "id": "6",
      "track": "A",
      "voice": "主持人不是每帧重渲染 3D。引擎渲染一次全身，按场景类型自动裁切——讲概念半身出镜，展示表格缩到角落，开场全身站旁边。本视频就用了主持人，你现在看到的角落模式就是。AI 只填场景类型，镜头自动切好。口型同步用字幕的逐字时间戳驱动，每个字对应一个口型形状，不需要读音频波形。字幕说\"你好\"，嘴就按\"你\"和\"好\"的口型动——帧级确定。两种模式：角落模式贴角落，内容不透明，适合内容为主。占满模式占满画面，内容透明浮在上层，适合主持人为主。选好 VRM 模型和动画，告诉 AI 用哪种模式。AI 填配置，引擎自动切镜头加驱动口型。三层都讲完了，怎么组合？",
      "visual_instructions": "@ConceptScene 自动镜头切换 → @TableScene 两种模式 → @CalloutScene 口型同步 → @QuoteScene 人选模型AI填配置",
      "duration_hint_seconds": 55,
      "shots": [
        {
          "id": "6.1",
          "scene_template": "@ConceptScene",
          "props": { "eyebrow": "VRM 主持人", "title": "渲染一次全身，按场景自动裁切", "items": [{ "label": "概念", "title": "讲概念→半身", "desc": "主持人半身出镜", "icon": "🗣️" }, { "label": "表格", "title": "展示表格→角落", "desc": "主持人缩到角落", "icon": "📐" }, { "label": "开场", "title": "开场→全身", "desc": "主持人全身站旁边", "icon": "🧑" }] },
          "voice_slice": "主持人不是每帧重渲染 3D。引擎渲染一次全身，按场景类型自动裁切——讲概念半身出镜，展示表格缩到角落，开场全身站旁边。本视频就用了主持人，你现在看到的角落模式就是。AI 只填场景类型，镜头自动切好。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "标题淡入" },
            { "at_seconds": 4, "action": "第二张卡片入场" },
            { "at_seconds": 8, "action": "第三张卡片入场" }
          ]
        },
        {
          "id": "6.2",
          "scene_template": "@TableScene",
          "props": { "title": "两种模式", "headers": ["模式", "画面效果", "适合什么"], "rows": [["角落模式", "主持人贴角落，内容不透明", "内容为主、主持人辅助"], ["占满模式", "主持人占满画面，内容透明浮在上层", "主持人为主、内容辅助"]], "enter": "rise" },
          "voice_slice": "两种模式：角落模式贴角落，内容不透明，适合内容为主。占满模式占满画面，内容透明浮在上层，适合主持人为主。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "表头淡入" },
            { "at_seconds": 3, "action": "两行依次 stagger 入场" }
          ]
        },
        {
          "id": "6.3",
          "scene_template": "@CalloutScene",
          "props": { "callout_type": "info", "title": "口型同步", "text": "用字幕的逐字时间戳驱动口型", "items": ["每个字对应一个口型形状，不需要读音频波形", "字幕说'你好'，嘴就按'你'和'好'的口型动——帧级确定"] },
          "voice_slice": "口型同步用字幕的逐字时间戳驱动，每个字对应一个口型形状，不需要读音频波形。字幕说\"你好\"，嘴就按\"你\"和\"好\"的口型动——帧级确定。",
          "duration_seconds": 12,
          "visual_beats": [
            { "at_seconds": 0, "action": "提示框淡入" },
            { "at_seconds": 3, "action": "两条要点依次入场" }
          ]
        },
        {
          "id": "6.4",
          "scene_template": "@QuoteScene",
          "props": { "text": "人选模型和动画，AI 填配置，引擎自动切镜头 + 驱动口型" },
          "voice_slice": "选好 VRM 模型和动画，告诉 AI 用哪种模式。AI 填配置，引擎自动切镜头加驱动口型。三层都讲完了，怎么组合？",
          "duration_seconds": 13,
          "visual_beats": [
            { "at_seconds": 0, "action": "引号装饰淡入" },
            { "at_seconds": 3, "action": "大字渐入" }
          ]
        }
      ]
    },
    {
      "id": "7",
      "track": "A",
      "voice": "本视频就是三层叠加的结果——背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。三层各自独立配置，互不干扰，引擎从底到顶渲染。指挥 AI 搭场景：第一步，决定要哪几层——背景加内容是最小集，全息屏和主持人可选。第二步，选背景构建方式。第三步，按语义让 AI 填场景配置。第四步，需要主持人？加 avatar 配置块。第五步，需要全息屏？给房间素材和屏幕坐标。第六步，现成场景不够？让 AI 扩展，你验收。适合的场景：模板化讲解、数据图表、有主持人的教学片。不适合的：实拍真人，该拍就拍。写实数字人，恐怖谷。高自由度影视特效，交专业工具。",
      "visual_instructions": "@FlowScene 六步路径 → @SplitLayout 适合 vs 不适合",
      "duration_hint_seconds": 35,
      "shots": [
        {
          "id": "7.1",
          "scene_template": "@FlowScene",
          "props": { "eyebrow": "指挥 AI 搭场景", "title": "六步路径", "steps": [{ "label": "决定要哪几层", "desc": "背景+内容是最小集；全息屏和主持人是可选增强", "icon": "🎯" }, { "label": "选背景构建方式", "desc": "多种方式对号入座", "icon": "🎨" }, { "label": "填场景配置", "desc": "16 种现成场景按语义选", "icon": "📋" }, { "label": "加主持人", "desc": "加 avatar 配置块，选模式", "icon": "🧑" }, { "label": "加全息屏", "desc": "给房间素材和屏幕坐标", "icon": "🖥️" }, { "label": "扩展新场景", "desc": "让 AI 写组件，你验收", "icon": "🔧" }], "orientation": "horizontal" },
          "voice_slice": "本视频就是三层叠加的结果——背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。三层各自独立配置，互不干扰，引擎从底到顶渲染。指挥 AI 搭场景：第一步，决定要哪几层——背景加内容是最小集，全息屏和主持人可选。第二步，选背景构建方式。第三步，按语义让 AI 填场景配置。第四步，需要主持人？加 avatar 配置块。第五步，需要全息屏？给房间素材和屏幕坐标。第六步，现成场景不够？让 AI 扩展，你验收。",
          "duration_seconds": 20,
          "visual_beats": [
            { "at_seconds": 0, "action": "第一步卡片入场" },
            { "at_seconds": 3, "action": "第二步卡片入场" },
            { "at_seconds": 6, "action": "第三步卡片入场" },
            { "at_seconds": 9, "action": "第四步卡片入场" },
            { "at_seconds": 12, "action": "第五步卡片入场" },
            { "at_seconds": 15, "action": "第六步卡片入场" }
          ]
        },
        {
          "id": "7.2",
          "scene_template": "@SplitLayout",
          "props": { "title": "适合 vs 不适合", "leftLabel": "✅ 适合", "leftValue": "模板化讲解 + 数据图表 + 有主持人的教学片", "rightLabel": "❌ 不适合", "rightValue": "实拍真人、写实数字人（恐怖谷）、高自由度影视特效" },
          "voice_slice": "适合的场景：模板化讲解、数据图表、有主持人的教学片。不适合的：实拍真人，该拍就拍。写实数字人，恐怖谷。高自由度影视特效，交专业工具。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "左右卡片同时淡入" },
            { "at_seconds": 6, "action": "左侧高亮" }
          ]
        }
      ]
    },
    {
      "id": "8",
      "track": "A",
      "voice": "画面分层原理：视频场景就是从底到顶叠图层——背景、内容、叠层、角色。可迁移的通用认知，不限于 Remotion。本视频就是实例：背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。核心判断：特色在分层组合，不在写更花哨的组件。人决定要哪几层、选风格、给素材，AI 填配置、写扩展。会讲需求、会判断验收，就能指挥 AI 搭场景。下期 EP04 字幕匹配：TTS 时间戳 vs WhisperX 转录——两条路怎么选，弹跳字幕怎么做。",
      "visual_instructions": "@FlowScene 三层回顾（首尾呼应） → @OutroScene 品牌收束卡 + CTA",
      "duration_hint_seconds": 30,
      "shots": [
        {
          "id": "8.1",
          "scene_template": "@FlowScene",
          "props": { "eyebrow": "三层回顾", "title": "", "steps": [{ "label": "分层原理", "desc": "背景→内容→叠层→角色", "icon": "📚" }, { "label": "三层实例", "desc": "背景层→全息屏→VRM 主持人", "icon": "🏗️" }, { "label": "指挥 AI", "desc": "选层→选风格→填场景→验收", "icon": "🎯" }], "orientation": "horizontal" },
          "voice_slice": "画面分层原理：视频场景就是从底到顶叠图层——背景、内容、叠层、角色。可迁移的通用认知，不限于 Remotion。本视频就是实例：背景层用 3D 场景视频，内容层用场景模板，加一个角落模式的主持人。核心判断：特色在分层组合，不在写更花哨的组件。人决定要哪几层、选风格、给素材，AI 填配置、写扩展。会讲需求、会判断验收，就能指挥 AI 搭场景。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "三步卡片依次入场（首尾呼应第一段）" }
          ]
        },
        {
          "id": "8.2",
          "scene_template": "@OutroScene",
          "props": { "headline": "不吹AI，真落地，真开源", "cta": "关注 · 一起用 AI 构建能落地、可复现的工作流" },
          "voice_slice": "下期 EP04 字幕匹配：TTS 时间戳 vs WhisperX 转录——两条路怎么选，弹跳字幕怎么做。",
          "duration_seconds": 15,
          "visual_beats": [
            { "at_seconds": 0, "action": "品牌卡淡入" },
            { "at_seconds": 5, "action": "CTA 按钮脉冲" }
          ]
        }
      ]
    }
  ],
  "zoom_crop_directives": []
}
```
