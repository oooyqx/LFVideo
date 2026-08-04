<!-- AUTO-GENERATED from shared/workflows/02-content-planning.md. Do not edit here; edit the source and run `python scripts/sync_workflows.py`. -->

# 02 内容策划：写 tutorial.final.md

> 本工作流已简化：不再走五阶段逐段确认门，AI 直接从大纲确认到落盘 tutorial.final.md。
> 角色定义见 `shared/roles/content/strategist(内容策划师).md`。

## 前置输入

- **黄金样例**：`content-library/ep02-video-render/02-plan/tutorial.final.md`（`approved`，作为风格基线）
- **决策记录**：`content-library/_decisions/` 下的技术选型与架构决策
- **项目代码**：当期涉及的实际代码（AI 读取理解，不翻译源码给观众）
- **组件规范**：`shared/docs/remotion-spec.md`（约束画面描述，防止写出无法生成的空想效果）

## 流程

### 步骤 1：技术调研与选型对比

1. 读取当期主题相关的 `_decisions/` 决策记录和项目代码
2. 让 AI 罗列技术路线 / 方案对比，人结合约束做减法
3. 确定本期要讲的技术路线和核心认知

### 步骤 2：列大纲 → 用户确认

1. AI 按黄金样例的结构（开场钩子 → 正文段 → 总结 + 必讲要点清单）列出章节大纲
2. **大纲必须经用户确认**后才动笔写正文
3. 大纲阶段重点确认：主线是否清晰、人机分工是否如实、技术细节是否过度

### 步骤 3：写 tutorial.final.md

1. 按确认的大纲，参照黄金样例风格写完整正文
2. 文末附「必讲要点覆盖清单」（逐条勾选格式，供 04 脚本自查）
3. 落盘到 `content-library/<epNN-slug>/02-plan/tutorial.final.md`

## 写作三原则（AI 写 tutorial 时的硬性约束）

### 原则 1：技术细节分级——观众不需要理解 AI 的实现方式

- **写**：观众需要理解的原理和效果（"画面分层 = 从底到顶叠图层"、"透视贴图让平面 UI 有空间感"）
- **不写**：AI 处理的实现细节（矩阵运算、schema 校验机制、viseme 映射表、注册表分发逻辑）
- **判据**：这句话念出来，观众能用来做决策吗？不能就砍

### 原则 2：通用认知先导——先教心智模型，再讲项目实现

- 讲项目实现前，先用大白话教一个可迁移的通用认知（"任何视频场景都是从底到顶叠图层"）
- 通用认知让观众能把方法迁移到自己的场景，而不是只会用这个项目
- 项目实现是"我们怎么落地这个认知"的实例，不是认知本身

### 原则 3：落脚到"指挥 AI"——终点是用户能动手，不是引擎多强

- tutorial 的终点不是展示技术能力，而是"理解了原理，你就能指挥 AI 搭自己的场景"
- 每层/每个能力都落脚到：人决定什么、AI 填什么、人怎么验收
- 人机分工如实写：人做的活如实说（量坐标、选模型、决定要哪几层），不夸大 AI 的自主性

## 落盘契约

### tutorial.final.md 格式

```yaml
---
stage: 02-content-planning
kind: human-final
---
```

正文结构（参照黄金样例）：
1. **开场钩子**：选题式问句 + 关键认知 + 路线图
2. **正文段**：每段结论先行 → 痛点/误区 → 怎么做 → 好处 → 依据 → 段尾因果过渡
3. **总结**：浓缩成行动指令 + 下期指针
4. **必讲要点覆盖清单**：按章节分组，逐条 `- [ ]` 格式

### 技术结论标记

- `verified`：已在本机验证
- `paper_spec`：未实跑，录制前须核对

## 关联文件

- 黄金样例：`content-library/ep02-video-render/02-plan/tutorial.final.md`
- 上游：用户大纲确认（无工作流） · 下游：`04-script-draft.md`
- 角色定义：`shared/roles/content/strategist(内容策划师).md`
- 组件规范：`shared/docs/remotion-spec.md`
