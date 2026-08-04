import React from 'react';
import {
	IntroScene,
	OutroScene,
	SectionScene,
	ConceptScene,
	TimelineScene,
	BulletScene,
	FlowScene,
	ArchitectureScene,
	TableScene,
	ComparisonScene,
	ChartScene,
	StatScene,
	CalloutScene,
	QuoteScene,
	CodeScene,
	ChatScene,
	CoverScene,
} from '../src/custom-templates/scenes';

export interface SceneMeta {
	// 与 scenes/ 目录下的文件名（去扩展名）一一对应。
	file: string;
	// 在 registry.ts 中登记的场景类型。
	type: string;
	label: string;
	component: React.ComponentType<Record<string, unknown>>;
	durationInFrames: number;
	sampleProps: Record<string, unknown>;
}

const cast = (c: unknown) => c as React.ComponentType<Record<string, unknown>>;

// 每个场景的示例 props 取自真实 demo 数据（public/demo-props），
// 覆盖该场景的全部字段，方便直接看到完整动效。
export const SCENE_META: SceneMeta[] = [
	{
		file: 'IntroScene',
		type: 'intro_scene',
		label: '片头 · 标题入场',
		component: cast(IntroScene),
		durationInFrames: 150,
		sampleProps: {
			title: '用 Vibe Coding 搭一套自动出片的渲染引擎',
			subtitle: '把视频写成代码，让 AI 按配置自动出片',
		},
	},
	{
		file: 'OutroScene',
		type: 'outro_scene',
		label: '片尾 · 总结收束',
		component: cast(OutroScene),
		durationInFrames: 150,
		sampleProps: {
			headline: '三步搭好你的自动出片引擎，没基础也能复制',
			cta: '找路径 · 选型 · 落地',
		},
	},
	{
		file: 'ConceptScene',
		type: 'concept_scene',
		label: '概念 · 多卡片要点',
		component: cast(ConceptScene),
		durationInFrames: 240,
		sampleProps: {
			eyebrow: '找技术路径',
			title: '把选择题丢给 AI：有哪些现成路子？',
			items: [
				{
					label: 'NOT',
					title: '不埋头啃文档',
					desc: '不自己从零调研，直接把选择题交给 AI',
					icon: '🙅',
				},
				{
					label: 'ASK',
					title: '一句话需求',
					desc: '想把视频写成代码自动出片，有哪些现成路子？',
					icon: '💬',
				},
				{
					label: 'PICK',
					title: '按需求做减法',
					desc: '对照真实需求，筛掉不合适的方案',
					icon: '✅',
				},
			],
		},
	},
	{
		file: 'TimelineScene',
		type: 'timeline_scene',
		label: '时间线 · 阶段演进',
		component: cast(TimelineScene),
		durationInFrames: 240,
		sampleProps: {
			eyebrow: '演进路线',
			title: '渲染引擎的演进',
			events: [
				{year: '2018', title: '手工剪辑', desc: '拖时间轴，改一处全手工重排', icon: '🎬'},
				{year: '2021', title: '模板化', desc: '固定模板批量套数据', icon: '🧩'},
				{year: '2024', title: '代码即视频', desc: '用 Remotion 把视频写成代码', icon: '⚡'},
			],
		},
	},
	{
		file: 'TableScene',
		type: 'table_scene',
		label: '表格 · 多方案对比',
		component: cast(TableScene),
		durationInFrames: 260,
		sampleProps: {
			eyebrow: '判断层 = 边界，非中立百科',
			title: '选型最容易翻车：看清每条路何时不好使',
			headers: ['方案', '适用场景', '已知坑'],
			rows: [
				['Remotion', '前端栈、复杂排版、跨期复用', '顶层读 window 崩；BUSL 授权'],
				['Motion Canvas', '代码演示、精确时序', '生态小、模板自建'],
				['Manim', '数学 / 公式可视化', '排版弱、渲染慢'],
				['MoviePy', '简单拼接、音轨闪避', '自适应排版繁琐、吃内存'],
				['FFmpeg', '批量转码、字幕烧录', '命令晦涩、难调试'],
			],
			highlightCell: '1-1',
		},
	},
	{
		file: 'ComparisonScene',
		type: 'comparison_scene',
		label: '对比 · 左右两栏',
		component: cast(ComparisonScene),
		durationInFrames: 180,
		sampleProps: {
			title: '对着需求做减法',
			leftLabel: '我的三条需求',
			leftValue: '批量换数据 · AI 改不易错 · 跨期好维护',
			rightLabel: '✅ Remotion 命中',
			rightValue: '三条全中，Remotion 赢',
		},
	},
	{
		file: 'CodeScene',
		type: 'code_scene',
		label: '代码 · 终端打字',
		component: cast(CodeScene),
		durationInFrames: 360,
		sampleProps: {
			terminalTitle: 'comparison 配置：照现成组件填数据',
			prompt: '$',
			steps: [
				{kind: 'cmd', text: 'cat comparison.json'},
				{kind: 'out', text: '{'},
				{kind: 'out', text: '  "type": "comparison",'},
				{kind: 'out', text: '  "title": "传统剪辑 vs 代码即视频",'},
				{kind: 'out', text: '  "leftLabel": "传统剪辑",'},
				{kind: 'out', text: '  "leftValue": "拖时间轴，改一处全手工重排",'},
				{kind: 'out', text: '  "rightLabel": "代码即视频",'},
				{kind: 'out', text: '  "rightValue": "改一行配置，全片自动重排"'},
				{kind: 'out', text: '}'},
				{kind: 'pill', text: '✓ 配置完成'},
			],
		},
	},
	{
		file: 'SectionScene',
		type: 'section_scene',
		label: '章节 · 分隔过渡',
		component: cast(SectionScene),
		durationInFrames: 150,
		sampleProps: {
			eyebrow: 'Part',
			index: '02',
			title: '选型：看清每条路何时不好使',
		},
	},
	{
		file: 'BulletScene',
		type: 'bullet_scene',
		label: '要点 · 轻量清单',
		component: cast(BulletScene),
		durationInFrames: 220,
		sampleProps: {
			eyebrow: '落地清单',
			title: '三步搭好自动出片引擎',
			ordered: true,
			items: [
				{text: '找路径：把选择题交给 AI，列出现成方案', icon: '🧭'},
				{text: '做选型：对着真实需求做减法，筛掉不合适的', icon: '⚖️'},
				{text: '落地：照现成组件填数据，改一行配置全片重排', icon: '🚀'},
			],
		},
	},
	{
		file: 'FlowScene',
		type: 'flow_scene',
		label: '流程 · A→B→C',
		component: cast(FlowScene),
		durationInFrames: 240,
		sampleProps: {
			eyebrow: '出片流水线',
			title: '从脚本到成片，全自动跑通',
			steps: [
				{label: '写脚本', desc: '把分镜写成结构化 JSON 配置', icon: '📝'},
				{label: '套组件', desc: '按 type 映射到现成场景组件', icon: '🧩'},
				{label: '自动渲染', desc: 'Remotion 逐帧渲染导出成片', icon: '🎞️'},
			],
		},
	},
	{
		file: 'ChartScene',
		type: 'chart_scene',
		label: '图表 · 柱/线/饼/KPI',
		component: cast(ChartScene),
		durationInFrames: 200,
		sampleProps: {
			kind: 'bar',
			title: '各方案上手成本（越低越好）',
			data: [
				{label: 'Remotion', value: 7},
				{label: 'Motion Canvas', value: 5},
				{label: 'Manim', value: 8},
				{label: 'MoviePy', value: 4},
				{label: 'FFmpeg', value: 9},
			],
		},
	},
	{
		file: 'StatScene',
		type: 'stat_scene',
		label: '数字 · 核心指标',
		component: cast(StatScene),
		durationInFrames: 150,
		sampleProps: {
			label: '改一处配置',
			stat: '0 手工重排',
			subtitle: '改一行 JSON，全片自动按新数据重排',
		},
	},
	{
		file: 'CalloutScene',
		type: 'callout_scene',
		label: '提示 · 避坑框',
		component: cast(CalloutScene),
		durationInFrames: 200,
		sampleProps: {
			callout_type: 'warning',
			title: '选型最容易翻车',
			text: 'Remotion 顶层读 window 会直接崩，且采用 BUSL 授权，商用前务必确认。',
			items: [
				'顶层 window 访问要包在组件内',
				'BUSL 授权：团队 / 商用需付费',
			],
		},
	},
	{
		file: 'QuoteScene',
		type: 'quote_scene',
		label: '金句 · 大字报',
		component: cast(QuoteScene),
		durationInFrames: 180,
		sampleProps: {
			text: '把视频写成代码，让 AI 按配置自动出片。',
			attribution: 'Vibe Coding 渲染引擎',
		},
	},
	{
		file: 'ChatScene',
		type: 'chat_scene',
		label: '对话 · AI 交互窗口',
		component: cast(ChatScene),
		durationInFrames: 300,
		sampleProps: {
			title: '与 AI 对话',
			messages: [
				{role: 'user', text: '帮我用 Remotion 做一个开场动画，标题用渐变色'},
				{role: 'assistant', text: '好的，我来创建一个 IntroScene 组件，标题用 accent 渐变文字。', code: 'export const IntroScene = ({title}) => (\n  <HoloTitle text={title} />\n);'},
				{role: 'user', text: '再加一个副标题'},
				{role: 'assistant', text: '已添加 subtitle 字段，效果如下。'},
			],
		},
	},
	{
		file: 'CoverScene',
		type: 'cover_scene',
		label: '封面 · 多平台缩略图',
		component: cast(CoverScene),
		durationInFrames: 150,
		sampleProps: {
			keywords: [
				{text: '构建', color: '#A78BFA'},
				{text: '自动化视频生产线', color: '#22D3EE'},
				{text: '视频渲染篇', color: '#FBBF24'},
			],
			slogan: '不吹AI · 真落地 · 真开源',
			episodeLabel: 'EP.02',
		},
	},
	{
		file: 'ArchitectureScene',
		type: 'architecture_scene',
		label: '架构图 · 单期生产管线',
		component: cast(ArchitectureScene),
		durationInFrames: 180,
		sampleProps: {
			eyebrow: 'EP02 · 整体管线',
			title: '自动化视频生产线',
			nodes: [
				{id: 'input', label: '输入', title: '选题', desc: 'AI 罗列选题池', icon: '🎯', level: 0},
				{id: 'plan', label: '策划', title: '内容策划', desc: '技术调研 + 分镜大纲', icon: '📋', level: 1},
				{id: 'script', label: '脚本', title: '分镜口播稿', desc: 'AI 写分镜口播稿', icon: '📝', level: 1},
				{id: 'tts', label: '配音', title: 'TTS 合成', desc: '文本转语音', icon: '🎙️', level: 2},
				{id: 'broll', label: '录屏', title: '录屏素材', desc: 'IDE 操作录制', icon: '🖥️', level: 2},
				{id: 'scene', label: '组件', title: '场景组件', desc: 'Remotion 模板', icon: '🧩', level: 2},
				{id: 'render', label: '渲染', title: '渲染合成', desc: 'Remotion 自动出片', icon: '🎬', level: 3},
				{id: 'subtitle', label: '字幕', title: '字幕生成', desc: 'AI 生成 SRT', icon: '💬', level: 4},
				{id: 'cover', label: '封面', title: '多平台封面', desc: '多平台缩略图', icon: '🖼️', level: 4},
			],
			edges: [
				{from: 'input', to: 'plan'},
				{from: 'input', to: 'script'},
				{from: 'plan', to: 'tts'},
				{from: 'plan', to: 'broll'},
				{from: 'script', to: 'scene'},
				{from: 'tts', to: 'render'},
				{from: 'broll', to: 'render'},
				{from: 'scene', to: 'render'},
				{from: 'render', to: 'subtitle'},
				{from: 'render', to: 'cover'},
			],
		},
	},
	{
		file: 'ArchitectureSceneRoadmap',
		type: 'architecture_scene',
		label: '架构图 · 频道路线图',
		component: cast(ArchitectureScene),
		durationInFrames: 180,
		sampleProps: {
			eyebrow: '系列总览',
			title: 'Vibe Coding 造一条自动化视频生产线',
			nodes: [
				{id: 'ep02', label: 'EP02 渲染引擎', desc: '选型与落地', icon: '🎬', level: 0},
				{id: 'ep03', label: 'EP03 场景搭建', desc: '多场景叠加 + 全息屏', icon: '🧩', level: 1},
				{id: 'ep04', label: 'EP04 字幕匹配', desc: 'TTS 时间戳 vs WhisperX', icon: '💬', level: 2},
				{id: 'ep05', label: 'EP05 语音混音', desc: '多引擎 TTS + BGM', icon: '🎙️', level: 2},
				{id: 'ep06', label: 'EP06 工作流', desc: '9 阶段状态机 + Schema', icon: '⚙️', level: 3},
				{id: 'ep07', label: 'EP07 角色编排', desc: 'Prompt 管道串联', icon: '🤖', level: 3},
				{id: 'ep01', label: 'EP01 总览', desc: '系列锚点 · 技术选型复盘', icon: '🗺️', level: 4},
			],
			edges: [
				{from: 'ep02', to: 'ep03'},
				{from: 'ep03', to: 'ep04'},
				{from: 'ep03', to: 'ep05'},
				{from: 'ep04', to: 'ep06'},
				{from: 'ep05', to: 'ep06'},
				{from: 'ep06', to: 'ep07'},
				{from: 'ep07', to: 'ep01'},
			],
		},
	},
];

export const SCENE_BY_FILE: Record<string, SceneMeta> = Object.fromEntries(
	SCENE_META.map((m) => [m.file, m]),
);
