---
description: 脚本撰写 - 调用文案撰稿人角色，把策划案和技术验证结果写成完整视频脚本（分轨台词）及多平台分发改写稿。
---

# 脚本撰写 Workflow (04-script-draft)

基于上游产出的**故事大纲（02）**与**视听编排蓝图（03）**，调用 `文案撰稿人` 角色撰写完美对齐真实代码的完整视频脚本（口播稿 + 画面指示），并按需派生知乎版、小红书版。

---

## 前置依赖

本工作流假设已完成 `/03-video-planning-bilibili`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/03-plan-bilibili/README.md`（含 Remotion 组件映射与 Props 规格）
- 处于 `approved` 状态的 `content-library/<epNN-slug>/02-plan/README.md`（故事大纲与分镜，用于对齐画面与段落结构）
- **【必读·内容真相源】处于 `approved` 状态的 `content-library/<epNN-slug>/02-plan/tutorial.final.md`（人工修订定稿）**：口播台词的内容与深度以此为准；文件末尾的「必讲要点覆盖清单」是本阶段口播必须逐条覆盖的硬性清单。若该文件缺失或仍为 `draft`（人工未定稿），先提示用户回到 02 完成人工定稿，**不要仅凭 README 大纲就开写**（会漏掉 tutorial 里的细节料）。
- **必须读取并理解组件说明书**：`shared/docs/remotion-spec.md`（约束脚本画面的编写，防止写出无法生成的空想效果）

如果缺少上述输入，先提示用户回到上游工作流。

---

## 步骤

### 1. 加载角色定义与组件规范

- 读取 `shared/roles/content/copywriter(文案撰稿人).md`，理解"文案撰稿人"的：
  - 身份定位、输出格式、文风守则（短句、口语化、具体数字、无 AI 味）与边界。
- **读取并遵循** `shared/docs/remotion-spec.md`：
  - 脚本中的 `[画面]` 描述必须**严格优先映射到 Remotion 的内置组件代号上**（如：`@IntroScene`, `@ConceptScene`, `@SplitLayout`）。
  - 如果要表达复杂概念，应设计成 `@ConceptScene` 中的 2D 卡片 + 恰当的 Emoji 图标。
  - 涉及 Remotion 绝对无法自动生成的画面（例如 Cursor 报错弹窗、真实 IDE 的复杂编写过程），必须用 `@VideoSlot` 并清晰打上 `[B 轨占位替换提醒：请用户在此补充 xxx 录屏/截图]` 标记。

### 2. 确认定稿标题与验证输入

从 `02-plan/README.md` 获取：
- 定稿标题
- 视觉隐喻与画面 A/B 轨划分
- 演示路径

从 `02-plan/README.md` 的 Demo 实操设计段落获取：
- AI 的报错原因与避坑卡点（台词里的“痛点/卡点”）
- 解决卡点所需配置的 Rules 规则。

从 `02-plan/tutorial.final.md`（人工定稿）获取**口播内容真相源**：
- 通读全文，按其章节深度撰写口播；
- **逐条对照文件末尾的「必讲要点覆盖清单」**，确保每一条必讲要点都在脚本口播里有对应表达（公式/伪代码/对照表/选型理由等不得遗漏）。

### 3. 撰写 B 站视频脚本

基于 `02-plan/README.md` 中声明的视觉模版和大纲，调用 `copywriter(文案撰稿人).md` 撰写脚本：

#### 3.1 撰写 B站 深度视频脚本（写入 `04-script/README.md`）
* **体量要求**：长 5-10 分钟，口播 1500 - 2500 字。
* **内容深度**：详细对比 MDC 机制与 Workflows 机制，深刻解析 Agent 原地死循环的上下文底细。把新声明的模板组件（如 `@TableScene`、`@TimelineScene`）参数填充完整。

#### 3.2 脚本内格式模板

脚本必须分 `[画面]` 和 `[口播]` 两轨；当一段口播估算时长 > 15 秒（中文约每秒 4–5 字，即 > ~75 字）时，`[画面]` 必须额外给出 **[子镜头时间线]**，逐拍写出画面在第几秒发生什么变化，避免长口播配单一静止画面（详见 `shared/docs/remotion-spec.md` §1.5 防静止规范）：

```markdown
---
stage: 04-script
platform: bilibili
status: draft
source_workflow: /04-script-draft
---

# epNN 视频脚本：[这里写定稿标题]

---

## 第一段：【模版代号】开头黄金钩子（目标时长）
- **[画面]** 调用 `@IntroScene`。参数 title="...", subtitle="..."
- **[口播]** 兄弟们，你还觉得 Cursor Rules 就是在 `.mdc` 里写几句话吗？...

## 第二段：【模版代号】硬核对比矩阵（目标时长）
- **[画面]** 调用新声明的 `@TableScene` 模版。参数 headers=["指标", "Cursor", "Windsurf"], rows=[["格式", ".mdc", ".md"], ["多步", "❌不支持", "✅原生"]], highlightCell="2-3"
  - **[子镜头时间线]**（本段口播 >15s，必填）：0s 表头淡入 → 3s 第 1 行 stagger 入场 → 7s 第 2 行入场并高亮 → 12s Zoom 聚焦差异格 → 18s 缩表 + 浮出结论卡
- **[口播]** 看这里！这是我们首次独家整理的两大 AI IDE 硬核对比表...
```

---

### 4. 自我检查（不输出，仅约束）

- ❌ 脚本是否完整产出了 B 站深度版？
- ❌ **必讲要点覆盖**：`tutorial.final.md` 末尾「必讲要点覆盖清单」里的每一条，是否都能在本脚本口播里找到对应句？逐条核对，任一条无对应即判不合格，需补写。
- ❌ 脚本中是否将策划案声明的新模版组件（如 `@TableScene` 等）参数和数据 Schema 100% 填充完整？
- ❌ 是否删除了所有“在数字化浪潮中、赋能、打造、全方位”等恶俗 AI 味句式？
- ❌ 口播是否短句优先，极具换气感？
- ❌ **防静止**：是否存在任一段口播 > 15 秒（约 75 字）却只配单一静止画面？若有，必须为该段补 **[子镜头时间线]** 或拆分分镜（见 `shared/docs/remotion-spec.md` §1.5）。

### 5. 多平台其他改写（按需）

如用户需要，基于主脚本派生：
- **知乎版**：`04-script/zhihu.md`（深度文字版）
- **小红书版**：`04-script/xiaohongshu.md`（图文卡片九张版）

### 6. 落盘归档与校验

- 创建目录：`content-library/<epNN-slug>/04-script/`
- 将脚本写入：`04-script/README.md`。
- **MANDATORY**: 脚本末尾必须追加符合 `shared/schemas/04-script.schema.json` 规范的 ` ```json ` 结构化块，示例如下：
  ```json
  {
    "title": "定稿视频标题",
    "sections": [
      {
        "id": "1",
        "track": "A",
        "voice": "口播第一段...",
        "visual_instructions": "指示调用 @IntroScene",
        "duration_hint_seconds": 15
      },
      {
        "id": "2",
        "track": "A",
        "voice": "口播第二段（较长，>15s）...",
        "visual_instructions": "调用 @TableScene 并按节拍推进",
        "duration_hint_seconds": 20,
        "visual_beats": [
          { "at_seconds": 0, "action": "表头淡入" },
          { "at_seconds": 3, "action": "第 1 行 stagger 入场" },
          { "at_seconds": 7, "action": "第 2 行入场并 highlight_cell(2,3)" },
          { "at_seconds": 12, "action": "Zoom 聚焦差异格" },
          { "at_seconds": 18, "action": "缩表并浮出结论卡" }
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
- 阶段状态头部 frontmatter 置 `status: draft`（待人工评审通过后方可改为 `approved`）。
- 执行 Schema 校验。后续自动化校验命令：
  ```bash
  # 校验定稿 script 是否符合 04-script 规范
  npx ajv validate -s shared/schemas/04-script.schema.json -d content-library/<epNN-slug>/04-script/README.md
  ```
- 更新 `content-library/PIPELINE.md` 看板：该期 04 脚本列置为 `draft`。

### 7. ~~触发判断层评审门 (Review Gate)~~ ⏸️ 已挂起（暂停使用）

> ⚠️ **判断层评审门已挂起**：判断层评审（CHAI 质量门）已暂时从流程中移除，本阶段无需调用 `/meta/judgment-layer(判断层评审)`。
> 完成 Schema 校验并自查无误后，可直接将 `content-library/PIPELINE.md` 看板中该期 04 脚本列置为 `approved`，然后执行 `/05-video-assembly` 进入视频渲染拼装阶段。
> 恢复方法：删除本节的"已挂起"标记与本提示，并取消下方注释块的注释即可还原评审门。

<!-- 判断层评审门（已挂起，恢复时取消本块注释）
提示用户：
> “脚本已落盘归档至 `04-script/README.md` 并生成了结构化校验块。
> 请通过调用 `/meta/judgment-layer(判断层评审)` 对本产物进行首轮 CHAI 规则质量评审。
> 评审通过且看板标为 `approved` 后，可执行 `/05-video-assembly` 进入视频渲染拼装阶段。”
-->


---

## 关联文件

- 角色：`shared/roles/content/copywriter(文案撰稿人).md`
- 上游：`03-video-planning-bilibili (B站视听策划).md`
- 下游：`05-video-assembly (视频组装).md`
