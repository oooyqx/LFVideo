---
title: Forbidden Actions（禁止清单）
slug: forbidden-actions
activation: always
description: 全项目最高优先级禁止清单（L1）。任何工具、任何角色、任何工作流均不得违反；与其他任何规则冲突时，以本清单为准。
---

# Forbidden Actions（禁止清单 · L1 最高优先级）

> 本清单是项目指令层级的**第 1 层（最高优先级）**，收编自 `AGENT_GUIDE.md` 铁律、各角色「职责边界」、`voice-style.md` 黑名单与各工作流红线（逐条标注来源）。
> 裁决规则：任何下层文件（项目约束 / 工作流 / 角色 / 最佳实践 / AI 判断）与本清单冲突时，**一律以本清单为准**；修改本清单必须由人类确认。
> 完整层级模型见根目录 `AGENTS.md`。

## A. 流程与真相源（SSOT）

- **F-01 禁止 AI 替人置 `approved`**：`tutorial.final.md`、各阶段 README 的 `status: approved` 是人工定稿门，AI 只能落盘 `draft`。（来源：`02-content-planning` 工作流）
- **F-02 禁止在 04 契约未 `approved` 前推进下游**：`tutorial.final.md` 未人工修订并置 approved 时，禁止继续 04；04 契约冻结后，下游（05-13）不得增删/合并/拆分段落或镜头、不得改写标题或口播、不得重新引入 `anti_hype_forbidden` 噱头词。（来源：`04-script-draft` / `07-video-assembly` 工作流）
- **F-03 禁止手改各 IDE 生成副本**：`.cursor/rules|commands/`、`.windsurf/rules|workflows/`、`.devin/workflows/` 均为生成物；只改 `shared/rules|workflows/`，再跑 `python scripts/sync_rules.py` / `sync_workflows.py`。（来源：`AGENT_GUIDE.md` Rule Zero / `shared/rules/README.md`）
- **F-04 禁止在通用工作流里写死频道/期号/平台具体值**：频道级偏好一律进 `shared/rules/project-context.md`《频道配置》。（来源：`project-context.md`）
- **F-05 禁止提交敏感信息**：API-Key、token、凭据等严禁进入任何提交与归档产物。（来源：`13-github-archive` 工作流）

## B. 画面与工程

- **F-06 禁止虚构 AIGC 画面**：凡 Remotion 无法生成、需真实 IDE 操作的画面，一律 `[录屏占位：请用户提供 xxx.png/mp4]` 显式标出，禁止凭空脑补特效。（来源：`AGENT_GUIDE.md` 铁律二 TAD-01）
- **F-07 禁止画面静止超 15 秒**：>15s 的口播段必须切多镜头 / `visual_beats`。（来源：`AGENT_GUIDE.md` 铁律二 Anti-Deadtime）
- **F-08 禁止未经用户明确指令跑出片渲染**（`npx remotion render` / `npm run build` 等）：效果验证一律走 Remotion 预览。（来源：`AGENT_GUIDE.md` 铁律二）
- **F-09 禁止让 AI 从零发明新场景组件**：只允许在 `SCENE_TYPES.md` 现成模板上填数据；缺组件走 Template Ticket，不留抽象描述。（来源：`04-script-draft` 工作流 / ep02 实践）
- **F-10 禁止把多个组件塞进一个 section 的 `scene_template`**：多组件接力必须拆成多个 shot。（来源：`04-script-draft` 工作流）

## C. 代码与文档卫生

- **F-11 禁止占位代码**：`// TODO`、`// 其余代码保持不变` 等一律禁止；产出必须完整可运行。（来源：`AGENT_GUIDE.md` 铁律三）
- **F-12 禁止无意义解释性注释**（除非用户明确要求）。（来源：`AGENT_GUIDE.md` 铁律三）
- **F-13 禁止对需结构性重构的文档做多次 `edit` 拼接**：变更面积 >30% 必须走「删除 + 全量重写」链路。（来源：`AGENT_GUIDE.md` 铁律一）

## D. 内容口径（口播/文案红线，细则见 `voice-style.md`）

- **F-14 禁止元叙述/过程旁白/心理独白入口播**（「这一步只摆路，先不评好坏」类）。（来源：`voice-style.md` AI 味黑名单）
- **F-15 禁止自谦式人设表达入口播**（「我没有前后端基础」类）；人设只可价值前置、开场点一次。（来源：`project-context.md`《讲述人设》）
- **F-16 禁止噱头/夸张卖点**：标题与口播不得使用当期 `anti_hype_forbidden` 黑名单词（「一键出片 / 百倍效率 / 碾压」等），对照轴不得写成「手写 vs 自动 / 省人力」。（来源：`01-topic-research` / `04-script-draft` / `voice-style.md`）
- **F-17 禁止 AI 味禁区词与念大纲式过渡**：「本质上 / 综上所述 / 接下来我们聊聊」等，全量黑名单见 `voice-style.md` 第三节。（来源：`voice-style.md`）
- **F-19 禁止「A 轨 / B 轨」等内部黑话进任何产出**：工作流、角色、脚本、口播、画面标注等一切产出内容均不得出现「A 轨 / B 轨」这类内部流水线术语，一律用大白话替代——「A 轨」→「自动渲染（画面）」、「B 轨」→「录屏（素材）」、「A/B 轨兜底 / fallback_a_track」→「自动渲染兜底」、「B 轨占位」→「录屏占位」。仅本清单与 `voice-style.md`《术语白话化》为定义/禁用而援引这些词时例外。（来源：`voice-style.md`《术语白话化》）

## E. 角色边界（各角色只做本职，越界必须显式换角色）

- **F-18 禁止跨角色越权产出**：每个 `shared/roles/` 角色文件的「边界 ❌」条目在该角色会话内具有 L1 效力（例：tts-engineer 不改口播文本、qa-engineer 不动 04 契约）；需要他职能力时，先声明切换角色。（来源：`role-system.md` + 各角色文件）

---

**新增禁令怎么加**：先确认它属于全局硬红线（而非某角色/某工作流的局部约束），在对应来源文件写明细则，再到本清单登记一条 F-xx 并标注来源；两处都改完跑 `python scripts/sync_rules.py`。
