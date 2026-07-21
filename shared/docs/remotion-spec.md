# Remotion 视频模板与分镜规范 (Remotion Specification)

> ⚠️ **真相源对齐（必读，2026-06 更新）**：原"目标态规范"组件（`@IntroScene/@OutroScene/@ConceptScene/@SplitLayout/@VideoSlot/@AnimatedBackground`）**已落地**——原计划的 `video/` 工程已并入 `OpenMontage/remotion-composer`，这些组件现存于 `OpenMontage/remotion-composer/src/custom-templates/`（`scenes/`、`primitives/`、`theme/`，`verified` 存在）。
> **当前实际落地（两套组件，按用途取用）**：通用组件在 `remotion-composer/src/components/`（`ComparisonCard/TerminalScene/ScreenshotScene/charts/CaptionOverlay/HeroTitle/StatCard...`）；模板场景与原语在 `remotion-composer/src/custom-templates/`（场景 `IntroScene/OutroScene/ConceptScene/TimelineScene/TableScene`，原语 `SplitLayout/VideoSlot/AnimatedBackground/Subtitle/TitleFrame`，及 `theme/tokens`）。详见 §1.9。
> 因此在 **02 策划 / 04 脚本** 中引用组件时按 §1.9 对照即可（组件存在为 `verified`）；但 `render` 命令、`<CompositionId>` 与具体 props 仍须录制前核对（确认已在 `Root`/`index` 注册），未实跑的命令仍标 `paper_spec`。

本规范定义了 Remotion 工程中可调用的 UI 组件、场景与动画能力。
在进行 **02 内容策划**与 **04 脚本撰写**时，必须**严格遵守本规范的设计原则与防静止红线进行画面设计**，并按 §1.9 映射到实际组件，确保画面可渲染，杜绝幻想不切实际的特效。

---

## 1. 核心设计原则

1. **Remotion 原生组件优先**：
   - 所有“概念解释”、“理论模型”、“金字塔图”等，优先使用已有的组件（如 `@ConceptScene` 或 `@SplitLayout`）以 2D 卡片、Emoji、纯文字排版展现。
   - **绝对禁止**幻想着写出：*“一匹 3D 马在代码荒野狂奔”、“金字塔模型从土里破土而出”* 等复杂特效。这些必须降维设计为 `@ConceptScene` 里的 2D 卡片加对应的 Emoji。
2. **录屏外部资产占位显式标注**：
   - 凡是 Remotion 代码无法生成的画面（如：真实 IDE 界面/报错弹窗截图、人声口播 mp4、执行渲染命令的终端录屏），必须在脚本中用 **`[录屏占位：请用户提供 screen_error.png/mp4]`** 的格式显式标出，提醒用户后期补充。
3. **画面必须持续有节奏（防静止 / Anti-Deadtime）**：
   - **红线**：同一镜头的画面静止时间**不得超过 15 秒**（30fps 下约 450 帧无任何状态变化）。一大段口播绝不允许只配一个一动不动的静止画面。
   - **镜头才是画面单位**：叙事段（section）是一整段连续口播，但上屏的是**镜头（shot）**。凡是一个 section 的口播时长超过 15 秒，必须把它切成多个镜头（在 04 契约填 `sections[].shots[]`，每个 shot = 一个组件实例 + props + 覆盖的口播 `voice_slice` + `duration_seconds`），让画面随口播持续推进。镜头内部的细节动作（stagger / 高亮 / Zoom）才用该 shot 的 `visual_beats` 表达。详见下方「§1.5 画面节奏与防静止」。

---

## 1.5 画面节奏与防静止 (Anti-Deadtime)

> 目的：避免"长口播 + 一个静止画面"。画面要跟着口播的语义节拍走，每 ≤15 秒就有一次可见的视觉变化。

**判定**：以"单镜头连续无可见变化的时长"为准。超过 **15 秒（≈450 帧 @30fps）** 即判为"画面死时间"，必须拆解。

**拆解手法（按成本从低到高，优先用低成本的）**：
1. **组件内动画节拍**：数据点/卡片 `stagger` 依次入场、文字逐行高亮、`highlight_cell` 切换、数字滚动、进度条推进。
2. **Zoom / 局部聚焦**：对当前讲到的区域做 Zoom-in、平移、聚焦高亮（自动渲染组件内或录屏 `zoom_crop_directives`）。
3. **组件 / 布局切换**：到下一个语义点就换 `@ConceptScene` 的下一组卡片，或用 `@SplitLayout` 左右切换焦点。
4. **录屏切入**：讲实操时切到 `@VideoSlot` 录屏片段，并随讲解 Zoom 到对应位置。
5. **真正的分镜拆分**：把一个长 scene 拆成多个 storyboard 子镜头（每个子镜头一个组件实例 + 一段口播）。

**拆解的首选手法 = 镜头切分（shots）**：上述 1–5 是可用手法，但「给一个长镜头贴文字节拍」是治标；根治是把过长的 section 拆成多个可渲染的 shot（手法 5）。`visual_beats` 是 `{at_seconds, action}` 的**描述性字符串**，没有组件/props/口播切片，驱动不了真正的快切；它只适合描述**单个组件内部**的微动效。

**落地约定**：
- 在 **04 分镜口播稿**（已合并原 03 视听策划）：任何 `duration_hint_seconds > 15` 的 section，必须在 JSON 契约块该 section 填 `shots[]`，且镜头数 `≥ ceil(时长/15)`；每个 shot 含 `scene_template` + `props` + `voice_slice` + `duration_seconds`，shot 内可选填 `visual_beats` 作为组件内微动效。
- **硬校验**：`scripts/pipeline_lint.py` 在该期 04 被置 `approved`/`reviewed` 后，对 `> 15s` 却未切足 `shots[]` 的 section **硬报错**；仅用旧的 `visual_beats`/`sub_shots` 文字注解会被警告「请迁移到 shots[]」。下游 07 按「一个 shot ↔ props JSON 里一个 cut」逐条映射（section 无 shots 时退化为整段一个 cut）。
- 经验值：中文口播约每秒 4–5 字，15 秒 ≈ 60–75 字。**口播超过 ~75 字仍只配一个静止画面 = 不合格**，必须切成多个镜头。

---

## 1.9 规范组件名 ↔ 实际组件对照表（录制前必核对 props）

实际组件分布在 `OpenMontage/remotion-composer/src/` 下两处：通用组件在 `components/`，模板场景/原语在 `custom-templates/`（均以各自 `index.ts` 导出为准）。**原"目标态"同名组件现已实现**，对照如下（props 以实际组件为准）：

| 规范组件名 | 实际组件位置 | 备注 |
| :--- | :--- | :--- |
| `@IntroScene` | `custom-templates/scenes/IntroScene` | 开场大字报（已实现；亦可用 `components/HeroTitle`） |
| `@OutroScene` | `custom-templates/scenes/OutroScene` | 片尾 CTA（已实现；亦可用 `components/EndTag`） |
| `@ConceptScene` | `custom-templates/scenes/ConceptScene` | 概念卡片（已实现；亦可用 `components/TextCard/StatCard/CalloutBox` 组合） |
| `@SplitLayout` | `custom-templates/primitives/SplitLayout` | 左右分屏（已实现） |
| `@VideoSlot` | `custom-templates/primitives/VideoSlot` | 录屏外部资产嵌入（已实现；截图变焦另有 `components/ScreenshotScene`） |
| `@AnimatedBackground` | `custom-templates/primitives/AnimatedBackground` | 背景/粒子（已实现；另有 `components/ParticleOverlay`） |
| （图表） | `components/charts/`、`StatReveal`、`ProgressBar` | 标题承诺的“图表动效” |
| （字幕） | `components/CaptionOverlay`、`custom-templates/primitives/Subtitle` | 逐字高亮叠层 / 字幕 |
| （终端） | `components/TerminalScene` | 命令/报错演示 |
| （对比卡） | `components/ComparisonCard` | 左右对比 |
| （时间线/表格） | `custom-templates/scenes/TimelineScene`、`TableScene` | 新增模板场景 |

> `components/` 完整清单：`AnimeScene` `CalloutBox` `CaptionOverlay` `ComparisonCard` `EndTag` `HeroTitle` `ParticleOverlay` `ProductReveal` `ProgressBar` `ProviderChip` `ScreenshotScene` `SectionTitle` `StatCard` `StatReveal` `TerminalScene` `TextCard` `charts/`。
> `custom-templates/` 清单：场景 `IntroScene` `OutroScene` `ConceptScene` `TimelineScene` `TableScene`；原语 `SplitLayout` `VideoSlot` `AnimatedBackground` `Subtitle` `TitleFrame`；主题 `theme/tokens`、`theme/fonts`。
> 注：仓库内不再有独立 `video/` 目录——模板四层（theme/primitives/scenes/episodes）已并入 `remotion-composer/src/custom-templates/`。组件存在为 `verified`；具体 render 命令与 `<CompositionId>` 仍以录制前实跑为准。

---

## 2. 现成可用组件库清单（名称以 §1.9 映射为准）

下列组件已在 `remotion-composer/src/custom-templates/`（场景/原语/主题）与 `src/components/`（通用组件）下封装，可在数据源里配置（实际调用请按 §1.9 对照到具体路径）：

### 2.1 基础场景组件 (Scenes)

*   **`@IntroScene` (片头场景)**
    *   **作用**：大字报开场，15秒内抓人眼球。
    *   **参数**：
        *   `title`: 主标题（建议 900 粗体，字号大，如 `FONT_SIZE.display`）
        *   `subtitle`: 副标题（选填）
        *   `background`: 背景类型（可选 `'particles' | 'gradient' | 'grid'`）
*   **`@OutroScene` (片尾场景)**
    *   **作用**：结尾呼吁订阅 (CTA)。
    *   **参数**：
        *   `headline`: 主文案（如“关注我们，一起变强”）
        *   `cta`: 按钮内文案（默认“关注 · 一起验证 AI IDE 的真实能力”）
        *   `background`: 背景类型（默认 `'gradient'`）
*   **`@ConceptScene` (概念解释场景 - 核心！)**
    *   **作用**：最常用的概念拆解、认知框架、三层用法讲解。
    *   **参数**：
        *   `eyebrow`: 小标题（如“AI IDE 三层认知”）
        *   `title`: 大标题
        *   `background`: 背景类型（默认 `'gradient'`）
        *   `items`: 概念卡片数组（最大支持 3 个，超出会溢出），每个 Item 包含：
            *   `label`: 卡片分类（如 `EDITOR`）
            *   `title`: 卡片小标题（如 `编辑模式`）
            *   `desc`: 卡片具体描述（如 `手拿螺丝刀，你指哪它改哪`）
            *   `icon`: 卡片左侧图标（**必须使用 Emoji 字符**，如 🔧, 🐴, 缰）
            *   `atSec`（选填）: 该卡片入场时机（数字，单位**秒，相对本镜头/shot 起点**，与 `voice_slice` 同一时间轴），用于让卡片精确踩在某句口播上；**不填则回退到均匀错峰（uniform stagger）**，无需逐条都填。注意不要超过该镜头 `duration_seconds`，否则该条永不出现。

> 🕒 **列表型场景逐条踩点（`atSec`）通用约定**：上面的 `atSec` 字段同样适用于 `@BulletScene`（item）、`@FlowScene`（step）、`@TimelineScene`（event）——任意一条 item/step/event 都可加 `atSec` 让它踩准对应口播；不填即均匀 stagger。这与 `/04-script-draft` 工作流的「列表型组件逐条踩点」约定一致，脚本作者在需要逐条对齐语音节奏时填写。

### 2.1.5 场景选型决策表（语义 → 场景，硬约束）

> **完整场景清单与字段 SSOT**：`OpenMontage/remotion-composer/src/custom-templates/scene-types.json`（14 个场景，required/optional 字段与组件 zod schema 强一致，启动期守卫校验）。选场景时按下表把**口播语义信号**映射到场景，不要凭标题感觉选。

| 口播/内容语义信号 | 该用的场景 | 关键字段（以 scene-types.json 为准） |
| :--- | :--- | :--- |
| 「N 步 / 流程 / 先…再…最后…」 | `@FlowScene` | `steps[]`：每步 `label`（**不是 title**）+ `desc` + `icon`（Emoji） |
| 多方案矩阵对比（≥3 行 × ≥2 维度） | `@TableScene` | `headers` / `rows` / `highlightCell` |
| 两方 / 两面对照（A vs B、优势 vs 劣势） | `@SplitLayout` | `leftLabel/leftValue/rightLabel/rightValue` |
| 概念拆解、认知框架（≤3 张卡） | `@ConceptScene` | `items[]`：`label/title/desc/icon` |
| 平铺要点清单（可有序） | `@BulletScene` | `items[]`、`ordered`；条目 ≥5 自动切 2 列矩阵（2×3/2×4） |
| 按时间/版本推进的事件 | `@TimelineScene` | `events[]` |
| 单个核心大数字 | `@StatScene` | `stat` |
| 量化数据（跑分/占比） | `@ChartScene` | `kind` / `data` |
| 强调一句警示/铁律（可带小清单） | `@CalloutScene` | `text`、`items[]`（扁平字符串） |
| 金句收束 | `@QuoteScene` | `text` |
| 章节分隔 | `@SectionScene` | `title` / `index` |
| 开场点题 / 片尾 CTA / 命令与报错 | `@IntroScene` / `@OutroScene` / `@TerminalScene` | 见 §2.1 |

**选型硬规则（04 撰稿与自检必过）**：

1. **结构映射优先**：口播里出现「三步 / 流程 / 对比 / 清单 / 大数字」等结构信号时，画面**必须**用上表对应的结构化场景承载；禁止用 `@IntroScene`/`@OutroScene`/`@QuoteScene` 一行纯文字硬扛结构化信息（教训：ep02 开场「三步骨架」曾配成纯文字 IntroScene，返工改 FlowScene）。
2. **相邻镜头去重**：相邻或同段镜头**禁止用同一场景重放几乎相同的 props**。语义是「先全景 → 再聚焦」时，用不同场景递进表达（如 `@TableScene` 全景矩阵 → `@SplitLayout` 聚焦赢家优势/劣势），而不是把整表再播一遍（教训：ep02 3.1/3.2 曾连播两张相同对比表，返工去重）。
3. **首尾呼应**：开场给出的结构骨架（如三步法），结尾回顾时用**同一结构场景**复现一遍（如都用 `@FlowScene` 同一套三步卡），形成记忆锚点。
4. **props 字段名逐字段核对 schema**：字段名写错不会报错，而是**静默校验失败、整卡回退成纯文字**（教训：FlowScene step 的标题字段是 `label`，写成 `title` 导致全部流程卡悄悄退化）。落盘前对照 scene-types.json 的 required/optional 逐字段核对。

### 2.2 基础布局组件 (Primitives)

*   **`@SplitLayout` (分屏组件)**
    *   **作用**：画面一分为二（如：左边讲理论，右边放录屏；或者左边 Agent 原地打转，右边 Rules 约束运行）。
    *   **参数**：
        *   `direction`: 分屏方向（`'horizontal'` 左右分，`'vertical'` 上下分，默认 `'horizontal'`）
        *   `ratio`: 左/上侧占比（0-1，默认 `0.5` 对半开）
        *   `left`: 左/上侧渲染的 React 节点（可放入 `@VideoSlot` 或文本）
        *   `right`: 右/下侧渲染的 React 节点
*   **`@VideoSlot` (视频插槽/画中画)**
    *   **作用**：嵌入外部录制的 mp4/png 资产（如口播视频、实操录屏、静态截图）。支持淡入与缩放动画。
    *   **参数**：
        *   `src`: 资源路径（如 `./assets/screen_recording.mp4`）
        *   `position`: 位置（`'fill'` 填满分屏，`'left'` / `'right'` 居侧，`'top-left'` 等四角，默认 `'bottom-right'`）
        *   `width`: 画中画宽度（单位 px，在 `fill` 模式下被忽略，默认 `420`）
        *   `rounded`: 是否有圆角（默认 `true`）
*   **`@AnimatedBackground` (动态背景)**
    *   **可选 Variant**：
        *   `'gradient'`: 随时间缓慢变色的漂移流动渐变背景（暗色系，不刺眼）。
        *   `'grid'`: 暗色科技感静态网格，随时间缓慢对角平移。
        *   `'particles'`: 科技感浮动微光粒子背景，适合开场。

---

## 3. 在 02 策划与 04 脚本中的落地指令

1. **画面描述必须使用组件代号**：
   在编写脚本 `@/content-library/<epNN-slug>/04-script/video.md` 中的 `[画面]` 时，必须以以下格式指明调用的组件和具体参数：
   ```markdown
   - **[画面]** 引入 `@ConceptScene`。参数 eyebrow="人 ↔ AI 分工", title="两步出片", items=[1. "选路线/🧭 AI 全方位对比多条路线、人结合约束综合权衡", 2. "搭引擎/🛠️ AI 填配置、复用现成组件", 3. "兜底/🚧 把注意点写成规则固化给 AI"]
   ```
2. **无法自动渲染的画面必须标注替换提醒**：
   ```markdown
   - **[画面]** 引入 `@SplitLayout`。左侧 `@VideoSlot(position="fill", src="ssr-crash.mp4")` [录屏替换提醒：请用户在此补充 Node 打包阶段读 window 报错的录屏]，右侧 `@VideoSlot(position="fill", src="ssr-pass.mp4")` [录屏替换提醒：请用户在此补充加 SSR 守卫规则后一次性渲出片的录屏]
   ```

---

## 4. 如何节约 Token？

- 当 Cascade 扮演 **02内容策划师** 或 **04文案撰稿人** 时，工作流会强制通过 `@read_file` 读取本文件 `@/shared/docs/remotion-spec.md`。
- **这极大地节约了 Token**：AI 脑中拥有了精准的组件蓝图，不再需要你在 prompt 里重复解释“我们有哪些组件，怎么写才不会报错”，大幅降低了每次聊天的上下文体积。
