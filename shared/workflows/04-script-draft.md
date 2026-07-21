---
title: 分镜口播稿
slug: 04-script-draft
stage: "04"
description: 分镜口播稿 - 调用分镜口播导演角色，直接把 02 故事大纲 + tutorial.final.md（内容真相源）一次性写成「画面（Remotion 组件映射/Props/动画/录屏 zoom 指令）+ 口播台词」一体的分镜口播稿，并按需派生知乎/小红书改写稿。合并了原 03 视听策划与 04 脚本两阶段。
---

# 分镜口播稿 Workflow (04-script-draft)

基于上游 **02-plan 故事大纲 + tutorial.final.md（内容真相源）**，调用 `分镜口播导演` 角色，**一次性**产出「画面 + 口播」一体的分镜口播稿——同一份文档里既给 Remotion 组件映射 / Props / 动画 Cue / 录屏 zoom 指令，又给逐段口播台词，逐段对齐、互为约束。

> 📌 **本阶段合并了原「03 视听策划」与「04 脚本撰写」两道工序**。从此不再有独立的 `03-plan-bilibili` 产物与单独评审：画面与口播由同一角色同步产出，下游 05 录屏 / 06 TTS / 07 组装直接读本阶段末尾的 JSON 契约。

---

## 前置依赖

本工作流假设已完成 `/02-content-planning`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/02-plan/README.md`（故事大纲 `outline_sections` 与分镜结构，用于对齐段落与画面意图）
- **【必读·内容真相源】处于 `approved` 状态的 `content-library/<epNN-slug>/02-plan/tutorial.final.md`（人工修订定稿）**：口播台词的内容与深度、以及画面 Props 承载的数据均以此为准；文件末尾的「必讲要点覆盖清单」是本阶段必须逐条覆盖的硬性清单。若该文件缺失或仍为 `draft`（人工未定稿），先提示用户回到 02 完成人工定稿，**不要仅凭 README 大纲就开写**（会漏掉 tutorial 里的细节料）。
- **必须读取并遵循组件说明书**：`shared/docs/remotion-spec.md`（约束画面编写，防止写出无法生成的空想效果）

如果缺少上述输入，先提示用户回到上游工作流。

> ❗ **关键前提**：`tutorial.final.md` 必须已被人工修订并置 `status: approved`，否则缺少「必讲要点」真相源，禁止继续。

---

## 步骤

### 1. 加载角色定义与组件规范

- 读取 `shared/roles/content/script-director(分镜口播导演).md`，理解其两套子标准：
  - **视觉/Props 子标准**：严谨工程术语、组件覆盖、防静止、干货式钩子（结论先行 + 实质画面，不靠演示噱头）、受众对齐、自动渲染兜底。
  - **口播风格守则·干货紧凑版**：结论先行、干货紧凑、短句口语、情绪克制、对照前提与人设一致、无 AI 味。
- **读取并遵循** `shared/docs/remotion-spec.md`：
  - `[画面]` 描述必须**严格优先映射到 Remotion 内置组件代号**（如 `@IntroScene`, `@ConceptScene`, `@TableScene`, `@TimelineScene`, `@SplitLayout`）。
  - 复杂概念应设计成 `@ConceptScene` 的 2D 卡片 + 恰当 Emoji 图标。
  - Remotion 绝对无法自动生成的画面（真实 IDE 报错弹窗、复杂编写过程）必须用 `@VideoSlot` 并打上 `[录屏占位替换提醒：请用户在此补充 xxx 录屏/截图]`。
  - **录屏兜底**：含录屏的场景，脚本中必须同时给出 `[录屏画面]`（`@VideoSlot` + `zoom_crop_directives`）和 `[自动渲染兜底]`（对应 Remotion 组件渲染，如 `@TerminalScene` + 代码 Props），确保录屏缺失时有可渲染的自动渲染替代画面。

### 2. 加载上游资产与内容真相源

从 `02-plan/README.md` 获取：
- 定稿标题、`outline_sections`（段落与抽象视觉描述）、视觉隐喻与画面自动渲染/录屏划分、演示路径 `demo_design`。
- Demo 实操设计：AI 的报错原因与避坑卡点（口播里的「痛点/卡点」）、解决卡点所需的 Rules 规则。

从 `02-plan/tutorial.final.md`（人工定稿）获取**内容真相源**：
- 通读全文，按其章节深度撰写口播；Props 数据（对比矩阵/选型理由/实操示例）须对齐其实际内容。
- **逐条对照文件末尾的「必讲要点覆盖清单」**，确保每一条都在脚本里有对应表达（公式/伪代码/对照表/选型理由等不得遗漏）。

### 3. 逐段一体编排 + 撰稿（写入 `04-script/README.md`）

按 `02-plan/README.md` 声明的视觉模版和大纲，对每个 section **同时**产出画面与口播：

> 🎬 **段 (section) 是叙事单位，镜头 (shot) 才是画面单位**。一个 section = 大纲里的一个叙事节拍 + 一整段连续口播；真正上屏的是**镜头**。一段 90 秒的口播不能配一个组件硬撑全场，必须按语义/标点把这段口播切成多个**镜头 `shots[]`**，每个镜头 = 一个组件实例 + 它的 Props + 它覆盖的那截口播 (`voice_slice`) + 自己的时长 (`duration_seconds`)，让画面每 ≤~12 秒就换一次。**`scene_template`/`props` 优先写在 shot 上**；只有当整段 ≤15 秒、确属单镜头时，才允许写在 section 级。多组件接力（如 讲流向 `@ConceptScene` → 展示配置 `@TerminalScene` → 对照 `@SplitLayout`）天然就是多个 shot，**严禁把多个组件塞进一个 section 的 `scene_template` 字段或 `visual_instructions` 散文里**。

* **体量要求**：长 5-10 分钟，口播 1500 - 2500 字。
* **内容深度**：按 `tutorial.final.md` 的两步主线展开——先用大白话讲「怎么选这条技术路线」，再讲「怎么把本期能力搭出来」（主线与讲述人设口径见 `shared/rules/project-context.md`《频道配置》）；把声明的模板组件（如 `@TableScene`、`@TimelineScene`）Props 参数填充完整。
* **镜头切分（防静止的根治手法）**：任何 `duration_hint_seconds > 15` 的 section 必须切成 `≥ ceil(时长/15)` 个 shot；shot 内部组件还需要 stagger/高亮/Zoom 这类微动效时，才用该 shot 的 `visual_beats`（它只描述**单个组件内**的细节动画，不承担切镜职责）。
* **组件映射决策**：现有组件可表达 → 复用并标注组件名与 Props；无法表达 → 声明 `Template Ticket`（含物理路径建议、Props 接口、动画规范）。选哪一个场景按 `shared/docs/remotion-spec.md` §2.1.5「场景选型决策表」的语义信号映射与四条选型硬规则执行（结构映射优先 / 相邻镜头去重 / 首尾呼应 / props 字段名对照 scene-types.json）。
* **列表型组件逐条踩点（`atSec`）**：`@ConceptScene` / `@BulletScene` / `@FlowScene` / `@TimelineScene` 内含多个 item/step/event，画面默认是均匀错峰（uniform stagger），无法贴合不均匀的口播节奏。当某一条要**精确踩在某句口播上**时，给该条 props 加 `atSec`（数字，单位秒，**相对本镜头/shot 起点**，与 `voice_slice` 同一时间轴）——含义是「该条在镜头开始后第 atSec 秒入场」。不写 `atSec` 的条目自动回退到均匀 stagger，无需逐条都填。注意 `atSec` 不要超过该镜头 `duration_seconds`，否则该条永不出现。
* **录屏 zoom 指令**：对含录屏的场景生成 `zoom_crop_directives`（clip_id / 时间戳 / 缩放倍数 / 焦点坐标）。

#### 3.1 脚本内格式模板

脚本必须分 `[画面]` 和 `[口播]` 两轨；当一段口播估算时长 > 15 秒（中文约每秒 4–5 字，即 > ~75 字）时，`[画面]` 必须把这段拆成多个 **[镜头 shot]**——每个镜头写明组件、Props、覆盖的那截口播与时长，让画面跟着口播切换（详见 `shared/docs/remotion-spec.md` §1.5 防静止规范）。短的单镜头段（≤15s）可直接在 section 行写组件，不必拆 shot：

```markdown
---
stage: 04-script
platform: bilibili
status: draft
source_workflow: /04-script-draft
---

# epNN 视频脚本：[这里写定稿标题]

---

## 第一段：【@IntroScene】开场（干货式钩子 + 点题，目标时长）
- **[画面]** 调用 `@IntroScene`。Props title="...", subtitle="..."
  - **[子镜头时间线]**（干货式钩子，实质画面）：0s 首屏呈现本期核心成果/「配置→出片」的真实画面 → 4s 一句话点题落到主标题 → 12s 关键认知卡浮出 → 20s 三步路线图依次锁定
- **[口播]** （结论先行、不客套）这期把视频写成代码、让 AI 按配置自动出片；先记住一个关键认知：AI 最强的是啃文本和代码，所以渲染就该用数据驱动。

## 第二段：选路线·对比矩阵（目标时长 40s，本段 >15s → 切成多个镜头）
- **[口播]**（整段，下游 TTS 唯一真源）我没挨个去试，是让 AI 把这几条技术路线摆出来、再让它说清各自的适用场景与关键约束，最后对着我自己的工程约束做减法——这一步的判断，还得人来。
- **[镜头 2.1]** `@TableScene`（≈22s）。Props columns=["技术路线","适用场景","局限条件","关键约束"], rows=[["Remotion","前端栈、复杂网页排版、跨期模板复用","纯后台超长视频批处理","打包时读浏览器对象会崩；BUSL 商业授权"],["Manim","数学/公式/算法可视化","常规 UI、网页排版","排版弱、渲染慢"]], highlightColumn="3"
  - voice_slice：「我没挨个去试…说清各自的适用场景与关键约束」
  - 镜头内微动效：0s 表头淡入 → 3s 第 1 行 stagger → 7s 第 2 行入场并高亮 → 18s Zoom 聚焦「关键约束」列
- **[镜头 2.2]** `@SplitLayout`（≈18s）。左「按工程约束做减法的三条标准」右「胜出：Remotion」
  - voice_slice：「最后对着我自己的工程约束做减法——这一步的判断，还得人来」
```

---

### 4. 自我检查（不输出，仅约束）

**口播侧（voice 字段）：**
- ❌ **对话式技术播客风·干货紧凑版（口播质量第一标准）**：是否「先干货、再口语」？逐段核对——(a) 结论先行、删干净书面连接词与铺垫水词、短句优先；(b) 信息密度够不够，有无一句话带过/注水；(c) 只在最难懂处用了恰当生活类比（不滥用）；(d) 情绪克制——全片少量、主要在开场、无夸张煽情；(e) 真正的关键点收了一句 ≤15 字金句（不必每段都塞）。任一条不达标即判不合格（详见 `script-director` 角色《口播风格守则》）。
- ❌ **干货式钩子**：开场前 3-5 秒的口播是否用**一句结论先行的干货**点透本期（本期能拿到什么 / 反直觉的关键认知 / 核心结论）、情绪克制不煽情；**是否避免演示噱头、综艺式悬念与夸张表演**；钩子是否只在开场（正文不反复抛钩子、不自问自答铺垫）？
- ❌ **对照前提与人设一致**：方案对照是否被写成「手写/手动 vs 自动/AI」，或拿「省人力、少敲键盘」当卖点？频道讲述人设下两条路都是 AI 写代码，对照轴必须落在工程化复用 / 强类型约束 / 可维护性 / 稳定性等真实差异上，不得用劳动量轴（如「手写拼接、每期复制粘贴」）暗示对手要靠人肉硬干。
- ❌ **主线与人设（与软文同调）**：开场是否结果先行？技术段是否体现「人讲需求/看坑/定规则 + AI 写和填」的分工？结尾落点是否符合 `project-context.md`《频道配置 · 内容主线与讲述人设》？
- ❌ **去抽象腔**：是否出现「范式 / 换一套心智模型 / 帧即状态」等抽象标签当讲法？有则改成大白话。
- ❌ 是否删除了所有「在数字化浪潮中、赋能、打造」等恶俗 AI 味句式？口播是否短句优先、极具换气感？
- ❌ **自然度红线**（见 `voice-style.md`《自然度红线》）：有无为凑短句比例造出的伪短句（「路摆全了」「三条一卡」）？拟人隐喻是否 ≤1 处？指录话术（「你看 X 这行」）是否 ≤1 次且画面同步？每句能否过「真人对着镜头会不会这么说」？
- ❌ **报站不叠用**：段尾过渡和下一段开头是否只报了一次步骤名？（❌「这就到第二步。/ 第二步技术选型，…」）
- ❌ **术语白话化**：内部流水线术语（A 轨 / B-roll / SSOT / props / 分镜号…）是否零直接入口播？首次出现是否已白话化？（`pipeline_lint.py` 会对 voice 字段做术语扫描）

**视觉侧（[画面] / Props / 录屏指令）：**
- ❌ **组件覆盖度**：每个 section 是否都映射到具体组件或 Template Ticket？（禁止留下未解决的抽象描述）
- ❌ **受众对齐与术语专业化**：是否出现面向传统剪辑师的痛点对比（传统剪辑/拖时间轴/手动对字幕）？选型表述是否使用严谨工程术语做全方位对比（核心优势/适用场景 + 局限条件/关键约束），而非单摆缺点、只堆坑或「报菜名/复制粘贴土办法」式片面表达？（口语化只允许出现在 `[口播]`，视觉/Props 字段用工程术语）
- ❌ **防静止（硬性·镜头级）**：任一 `duration_hint_seconds > 15` 的 section 是否切成了 `≥ ceil(时长/15)` 个 `shots[]`（每个 shot 一个组件 + Props + `voice_slice` + `duration_seconds`）？只写 section 级 `visual_beats`/`sub_shots` 文字注解而不拆 shot = 不合格（`pipeline_lint.py` 在该期 04 置 `approved`/`reviewed` 时会硬报错）。shot 内的 `visual_beats` 仅用于单组件内部微动效，不算切镜（见 `shared/docs/remotion-spec.md` §1.5）。
- ❌ **录屏兜底完整性**：含录屏的场景，脚本是否同时给出了 `[录屏画面]`（含 `zoom_crop_directives`）和 `[自动渲染兜底]` 画面指示？缺一即判不合格。
- ❌ **列表型组件踩点**：`@ConceptScene` / `@BulletScene` / `@FlowScene` / `@TimelineScene` 的某一条若在口播里有明确「念到这条才出现」的对应句，是否给该条 props 标了 `atSec`（相对镜头起点的秒，不超过 `duration_seconds`）？只有「同时一起出现」或节奏无关时才允许省略 `atSec` 走均匀 stagger。
- ❌ **语义-场景匹配**：口播含「N 步/流程/对比/清单/大数字」等结构信号的镜头，是否都用了对应的结构化场景（见 remotion-spec §2.1.5 决策表）？有没有用 `@IntroScene`/`@OutroScene`/`@QuoteScene` 纯文字硬扛结构化信息？
- ❌ **相邻镜头去重**：相邻/同段镜头是否用同一场景重放了几乎相同的 props（如同一张表连播两屏）？「全景→聚焦」是否改用不同场景递进（矩阵 → 聚焦赢家 SplitLayout/高亮）？
- ❌ **首尾呼应**：开场给出的结构骨架（如三步法）在结尾回顾时是否用同一结构场景复现？
- ❌ **props 字段名对照 schema**：每个镜头的 props 字段名是否逐字段对照过 `scene-types.json` 的 required/optional？（错名不报错，会静默回退成纯文字——如 FlowScene step 用 `label` 不是 `title`。）
- ❌ 脚本是否将声明的新模版组件（如 `@TableScene` 等）Props 参数和数据 Schema 100% 填充完整？

**通用：**
- ❌ **必讲要点覆盖**：`tutorial.final.md` 末尾「必讲要点覆盖清单」里的每一条，是否都能在本脚本（口播或画面承载）里找到对应？逐条核对，任一条无对应即判不合格，需补写。**但标 `(内部)` 的条目相反：默认不入口播**，只能收敛为一句结果或交给画面；口播里出现 dev-log 级实现细节（修 bug 的具体手法）即判不合格，除非它本身是本期教学目标。
- ❌ **单期范围纪律**：是否把跨期话题展开成段？应只一句带过（跨期分工以当期 `Content Plan (内容计划).md` 与 `content-library/PIPELINE.md` 为准，不写死期号）。
- ❌ 脚本是否完整产出了 B 站深度版？

### 5. 多平台其他改写（按需）

如用户需要，基于主脚本派生：
- **知乎版**：`04-script/zhihu.md`（深度文字版）
- **小红书版**：`04-script/xiaohongshu.md`（图文卡片九张版）

### 6. 落盘归档与校验

- 创建目录：`content-library/<epNN-slug>/04-script/`，将脚本写入 `04-script/README.md`。
- **MANDATORY**：脚本末尾必须追加符合 `shared/schemas/04-script.schema.json` 规范的 ` ```json ` 结构化块。
- **该 JSON 块是下游全部阶段（录屏/TTS/组装/字幕/分发）的唯一真源（SSOT），一旦 approve 即冻结**：其中 `title`、`sections[].id`/`voice`/`duration_hint_seconds`、以及 `anti_hype_forbidden`（噱头黑名单）是下游**不得改写**的硬契约；`video_spec`、`sections[].shots[]`（含每个 shot 的 `scene_template`/`props`/`voice_slice`/`duration_seconds`）/`scene_template`/`props`/`visual_beats`、`zoom_crop_directives` 由本阶段一并产出，供 05/07 直接读取——**07 组装按「一个 shot ↔ props JSON 里一个 cut」逐条映射**（section 无 shots 时退化为整段一个 cut）。下游只能逐条映射，不能增删段落/镜头、重写标题/口播或重新引入噱头。示例：
  ```json
  {
    "title": "定稿视频标题",
    "platform": "bilibili",
    "anti_hype_forbidden": ["100 行", "百倍"],
    "video_spec": { "aspect_ratio": "16:9", "resolution": "1920x1080", "fps": 30 },
    "sections": [
      {
        "id": "1",
        "track": "A",
        "scene_template": "@IntroScene",
        "props": { "title": "定稿标题", "subtitle": "副文案" },
        "voice": "口播第一段...",
        "visual_instructions": "指示调用 @IntroScene",
        "duration_hint_seconds": 15
      },
      {
        "id": "2",
        "track": "A",
        "voice": "口播第二段（较长，>15s，下游 TTS 逐字搬运整段）...",
        "visual_instructions": "切成两个镜头：先 @TableScene 摆矩阵，再 @SplitLayout 收结论",
        "duration_hint_seconds": 40,
        "shots": [
          {
            "id": "2.1",
            "scene_template": "@TableScene",
            "props": { "columns": ["技术路线","适用场景","局限条件","关键约束"], "rows": [] },
            "voice_slice": "口播第二段的前半截...",
            "duration_seconds": 22,
            "visual_beats": [
              { "at_seconds": 0, "action": "表头淡入" },
              { "at_seconds": 7, "action": "第 2 行入场并 highlight_cell(2,3)" }
            ]
          },
          {
            "id": "2.2",
            "scene_template": "@SplitLayout",
            "props": { "left": "工程约束三条", "right": "胜出：Remotion" },
            "voice_slice": "口播第二段的后半截...",
            "duration_seconds": 18
          }
        ]
      }
    ],
    "zoom_crop_directives": [
      {
        "clip_id": "demo-config-render",
        "timestamp_start": "0:00",
        "timestamp_end": "0:30",
        "zoom_level": 1.5,
        "focal_point": { "x": 0.5, "y": 0.3 }
      }
    ],
    "judgment_layer_coverage": {
      "highlights_pitfall": true,
      "explains_boundary": true,
      "acceptance_standard": true
    }
  }
  ```
- 阶段状态头部 frontmatter 置 `status: draft`（待人工评审通过后方可改为 `approved`）。
- 执行机器校验（Schema + 跨阶段防漂移）：
  ```bash
  # 校验本期全链路：Schema 契约 + provenance + 门禁 + 04↔组装一致性 + 噱头黑名单 + 防静止镜头拆分
  python scripts/pipeline_lint.py content-library/<epNN-slug>
  ```
- 更新 `content-library/PIPELINE.md` 看板：该期 04 脚本列置为 `draft`。

### 7. ~~触发判断层评审门 (Review Gate)~~ ⏸️ 已挂起（暂停使用）

> ⚠️ **判断层评审门已挂起**：判断层评审（CHAI 质量门）已暂时从流程中移除，本阶段无需调用 `/meta/judgment-layer(判断层评审)`。
> 完成 Schema 校验并自查无误后，可直接将 `content-library/PIPELINE.md` 看板中该期 04 脚本列置为 `approved`，然后执行 `/05-b-roll-recording`（录屏）与 `/06-tts-synthesis`（配音），再进入 `/07-video-assembly` 阶段。
> 恢复方法：删除本节的"已挂起"标记与本提示，并取消下方注释块的注释即可还原评审门。

<!-- 判断层评审门（已挂起，恢复时取消本块注释）
提示用户：
> “脚本已落盘归档至 `04-script/README.md` 并生成了结构化校验块。
> 请通过调用 `/meta/judgment-layer(判断层评审)` 对本产物进行首轮 CHAI 规则质量评审。
> 评审通过且看板标为 `approved` 后，可执行 `/05-b-roll-recording` 与 `/06-tts-synthesis`。”
-->


---

## 关联文件

- 角色：`shared/roles/content/script-director(分镜口播导演).md`
- 上游：`02-content-planning.md`
- 内容真相源：`content-library/<epNN-slug>/02-plan/tutorial.final.md`
- 下游：`05-b-roll-recording.md`、`06-tts-synthesis.md`
