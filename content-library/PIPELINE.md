# 内容流水线看板 (PIPELINE)

> 全流水线单一状态源（SSOT for status）。每一期一行，每个阶段一列；工作流每完成一个阶段就在此更新对应单元格。行内标题与各阶段真实状态以对应 `content-library/<epNN-slug>/<stage>/README.md` frontmatter 的 `status` 为准，本表是它们的汇总视图。

## 状态图例

| 记号 | 含义 |
|------|------|
| `—` | 未开始 |
| `draft` | 已产出草稿，待人工验收 |
| `approved` | 人工已验收，可进入下一阶段（AI 不得单方置为 approved） |
| `blocked` | 被上游/外部依赖阻塞 |

## 阶段列说明

`01` 选题 · `02` 策划（AI 直接产出 tutorial.final.md） · `04` 脚本 · `05` 录屏 · `06` 配音 · `07` 组装 · `08` 字幕 · `09` 混音 · `10` 封面

## 看板

| 期号 (slug) | 标题 | 01 | 02 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|-------------|------|----|----|----|----|----|----|----|----|----|
| ep02-video-render | 渲染引擎选型与落地：找路径→对比选型→Remotion 配置驱动自动出片 | approved | approved | approved | — | approved | approved | draft | — | — |
| ep03-scene-building | 渲染场景搭建：视频背景+多场景叠加+变换矩阵全息屏+VRM 主持人迁移 | — | — | — | — | — | — | — | — | — |

## 新增一期

1. 创建 `content-library/<epNN-slug>/` 目录骨架（`02-plan`、`04-script`、`05-b-roll` 等子目录）。
2. 在上表新增一行，`01` 起逐列随阶段推进更新状态。
3. 换频道/换期的可配置默认值改 `shared/rules/project-context.md`《频道配置》，不改工作流模板。
