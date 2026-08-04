// 场景按用途分目录（便于扩展）：
//   opener/   片头 / 片尾 / 章节分隔
//   list/     多项罗列：概念卡 / 时间线 / 要点清单 / 流程图
//   data/     结构化数据：表格 / 对比 / 图表 / 核心数字
//   emphasis/ 单点强调：提示框 / 金句
//   demo/     实操演示：合成终端 / 代码
export * from './opener/IntroScene';
export * from './opener/OutroScene';
export * from './opener/SectionScene';
export * from './list/ConceptScene';
export * from './list/TimelineScene';
export * from './list/BulletScene';
export * from './list/FlowScene';
export * from './list/ArchitectureScene';
export * from './data/TableScene';
export * from './data/ComparisonScene';
export * from './data/ChartScene';
export * from './data/StatScene';
export * from './emphasis/CalloutScene';
export * from './emphasis/QuoteScene';
export * from './demo/CodeScene';
export * from './demo/ChatScene';
export * from './cover/CoverScene';
