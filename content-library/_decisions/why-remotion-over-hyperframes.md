# 为什么放弃 HyperFrames，使用 Remotion

## 对比

| 维度 | Remotion | HyperFrames |
|------|----------|-------------|
| **模板库构建** | TypeScript 类型约束，组件封装，跨期复用安全 | HTML 模板无类型检查，复制粘贴维护 |
| **AI Agent 友好度** | 需懂 React | 直接写 HTML |
| **长期维护** | 重构安全，改模板一处全期生效 | 10 期后维护困难 |
| **许可证** | BUSL（规模化付费）| Apache 2.0 |

## 决策理由

本项目核心是**固定模板 + 内容批量替换**，不是让 Agent 从零自由发挥每期结构。

Remotion 的 4 层架构（theme/primitives/scenes/episodes）更适合这种"数据驱动模板"的内容生产模式：

- 模板与数据分离已验证（`data.ts` → `Episode.tsx` → `template/`）
- TypeScript 保证数据格式不出错
- 改主题/样式一处生效，所有期自动更新

HyperFrames 更适合每期结构差异大、需要 Agent 自由布局的场景。本项目每期都是"Intro → Concept → Outro"的固定三段式，Remotion 的模板库是正确选择。

## 状态

已确认，继续推进 Remotion 自动渲染

---

*决策日期: 2026-06-01*
