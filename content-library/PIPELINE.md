# Pipeline 看板

> 全局生产进度：所有期 × 13 阶段的人工审核状态。每推进一阶段，更新本表。

## 状态说明

- `-` 未开始
- `draft` 已产出，待审核
- `reviewed` 审核中
- `approved` 通过，可进下一阶段
- `suspended` 暂时挂起（阶段定义已就绪，当前不执行）

## 进度表

| 期 | 01 选题 | 02 策划 | 03 B站视听 | 04 脚本 | 05 B轨录屏 ⏸ | 06 TTS | 07 组装 | 08 字幕 | 09 BGM ⏸ | 10 封面 ⏸ | 11 质检 ⏸ | 12 分发 ⏸ | 13 归档 ⏸ | 备注 |
|----|---------|---------|------------|---------|----------|--------|---------|--------|-------|--------|--------|--------|--------|------|
| **系列一：AI 视频自动化** | | | | | | | | | | | | | | |
| ep01-video-agent-overview | approved | approved | approved | approved | - | - | approved | - | - | - | - | approved | approved | 总体构建：IDE 智能体 + Python 工具 + React 编译器 (已完结) |
| ep02-video-render | approved | approved | approved | draft | suspended | - | draft | - | suspended | suspended | suspended | suspended | suspended | 渲染引擎：代码即视频 + 流程即代码 (本期) |
| ep03-video-subtitle | - | - | - | - | - | - | - | - | - | - | - | - | - | 字幕卡点：Whisper 毫秒级时间戳驱动 React 弹跳字幕 |
| ep04-video-orchestrator | - | - | - | - | - | - | - | - | - | - | - | - | - | 智能体编排：YAML 管道与 Markdown 导演规则指挥 Agent |
| **系列二：PPT 演示文稿自动化** | | | | | | | | | | | | | | |
| ep05-ppt-marp-overview | - | - | - | - | - | - | - | - | - | - | - | - | - | Marp 总体构建：为什么 Markdown 是 AI IDE 唯一解？ |
| ep06-ppt-css-theme | - | - | - | - | - | - | - | - | - | - | - | - | - | 深度排版主题：用 CSS Themes 与 Tailwind 对齐 PPT 排版 |
| ep07-ppt-slidev-react | - | - | - | - | - | - | - | - | - | - | - | - | - | 交互式 React 幻灯片：使用 Slidev 注入动态代码终端 |

## 审核门规则（L0.5 单核校验门）

> ⏸️ **判断层评审门已挂起（暂停使用）**：第二核"判断层评审 (CHAI 质量门)"已暂时从流程中移除。当前阶段在看板变更为 `approved` 的前置条件仅为 **Schema 校验通过 + 人工确认**，无需调用 `shared/roles/meta/judgment-layer(判断层评审).md`。恢复方法：删除本提示，并取消下方第 3 条注释块的注释，把标题改回"双核校验门"。

每阶段在看板变更为 `approved`（允许进入下一阶段）的前置条件是：**Schema 校验通过 + 人工确认**。

1. **工作流产出**：各阶段工作流执行完毕，在产出 README.md 尾部附加 ` ```json ` 结构块，初始状态置为 `draft`。
2. **第一核：Schema 机器校验**：
   - 验证末尾的 JSON 结构块是否完全符合对应阶段的 JSON Schema 契约（`shared/schemas/`）。
   - 若校验失败，不可更新看板，直接退回重构。
<!-- 第二核已挂起，恢复时取消本块注释
3. **第二核：判断层人工/AI 评审 (CHAI 质量门)**：
   - 调用 `shared/roles/meta/judgment-layer(判断层评审).md` 角色。
   - 深入审计“操作层 + 判断层 + 展现 AI 极限”三个维度。
   - 漏洞评估：不能含有任何 `[CRITICAL]` 级别的漏洞（如口播 AI 味、无避坑等）。
   - 决策：若获得 `PASS` 判定，则更新看板该阶段状态为 `approved`；若获得 `REVISE` 判定，退回修改（最多2轮）。
-->
3. **人工确认放行**：Schema 校验通过后，由人工核对产物质量；确认无误即可将看板该阶段状态置为 `approved`。
4. **断点续跑规则**：看板是整个频道的“状态机快照”。当 pipeline 重启时，AI 和人直接读取看板，定位到第一个状态为 `-` 或 `draft` 的阶段进行续跑，无需从头开始。

## 自动化成熟度

- **当前: L0.5 单核校验（判断层评审已挂起）** — 暂时仅保留 JSON Schema 契约校验 + 人工确认；CHAI 判断层评审门已挂起，待恢复后回归"双核校验"。看板手动更新，校验块手工辅助检验。
- **L1 半自动 (规划中)** — 选题(01)/策划(02) 自动提炼实操并执行 Schema 自动校验。
- **L2 全自动 (规划中)** — 全链路多角色 Agent 自动校验、评审并流转。
