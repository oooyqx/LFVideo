import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {CaptionOverlay, CaptionAnimation, WordCaption} from './components/CaptionOverlay';

// 字幕动画目录（catalog）合成：把每种字幕入场动画逐个铺开，每个展示 6 秒，
// 并在画面上写明动画名称和用法。仅用于在 Studio 里查阅 / 对比，不参与 ep02 渲染。
// 想新增一种字幕动画：在 CaptionOverlay 加好 animation mode 后，往 DEMOS 里加一项即可。

export const CAPTION_SEGMENT_FRAMES = 180; // 6s @ 30fps

interface CaptionDemo {
	id: string;
	animation: CaptionAnimation;
	note: string;
}

const DEMOS: CaptionDemo[] = [
	{
		id: 'spring',
		animation: 'spring',
		note: '弹性上浮 + 淡入（默认，平稳专业）',
	},
	{
		id: 'scramble',
		animation: 'scramble',
		note: '乱码解码入场（与 HoloTitle 标题统一）',
	},
	{
		id: 'rgb-tear',
		animation: 'rgb-tear',
		note: 'RGB 撕裂 / 色差入场（赛博朋克风）',
	},
];

export const CAPTION_SHOWCASE_FRAMES = DEMOS.length * CAPTION_SEGMENT_FRAMES;

// 示例字幕词（模拟逐词高亮）
const DEMO_WORDS: WordCaption[] = [
	{word: '用', startMs: 0, endMs: 300},
	{word: 'AI', startMs: 300, endMs: 600},
	{word: 'IDE', startMs: 600, endMs: 900},
	{word: '构建', startMs: 900, endMs: 1300},
	{word: '工作流', startMs: 1300, endMs: 1800},
	{word: '解决', startMs: 1800, endMs: 2100},
	{word: '现实', startMs: 2100, endMs: 2400},
	{word: '场景', startMs: 2400, endMs: 2700},
	{word: '问题', startMs: 2700, endMs: 3000},
];

const Card: React.FC<{demo: CaptionDemo; index: number; total: number}> = ({
	demo,
	index,
	total,
}) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: 64,
				top: 64,
				maxWidth: 900,
				padding: '24px 32px',
				borderRadius: 16,
				background: 'rgba(4, 12, 28, 0.62)',
				border: '1px solid rgba(120,205,255,0.35)',
				boxShadow: '0 0 40px rgba(54,208,255,0.18)',
				backdropFilter: 'blur(6px)',
				fontFamily: '"Space Grotesk", system-ui, sans-serif',
				color: '#EAF6FF',
			}}
		>
			<div
				style={{
					fontSize: 18,
					letterSpacing: 2,
					color: '#5FE6FF',
					marginBottom: 6,
				}}
			>
				字幕动画目录 {index + 1} / {total}
			</div>
			<div style={{fontSize: 52, fontWeight: 700, lineHeight: 1.1}}>{demo.id}</div>
			<div style={{fontSize: 22, color: '#A9CCEA', margin: '8px 0 18px'}}>
				{demo.note}
			</div>
			<pre
				style={{
					margin: 0,
					padding: '16px 20px',
					borderRadius: 10,
					background: '#041222',
					border: '1px solid rgba(120,205,255,0.22)',
					fontFamily: '"Fira Code", ui-monospace, monospace',
					fontSize: 20,
					color: '#9CEFFF',
					whiteSpace: 'pre-wrap',
				}}
			>
				{`<CaptionOverlay\n  animation="${demo.animation}"\n  words={captions}\n/>`}
			</pre>
		</div>
	);
};

const Heading: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			bottom: 200,
			left: 0,
			right: 0,
			textAlign: 'center',
			fontFamily: '"Space Grotesk", system-ui, sans-serif',
			color: '#6F92B5',
			fontSize: 18,
		}}
	>
		每种动画展示 6 秒 · 逐词高亮由 word timing 驱动
	</div>
);

export const CaptionShowcase: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#02070F'}}>
			{DEMOS.map((demo, i) => (
				<Sequence
					key={demo.id}
					from={i * CAPTION_SEGMENT_FRAMES}
					durationInFrames={CAPTION_SEGMENT_FRAMES}
					name={`caption:${demo.id}`}
				>
					<AbsoluteFill
						style={{
							background:
								'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
						}}
					/>
					<CaptionOverlay
						words={DEMO_WORDS}
						fontSize={48}
						highlightColor="#A78BFA"
						backgroundColor="rgba(15, 23, 42, 0.75)"
						animation={demo.animation}
					/>
					<Card demo={demo} index={i} total={DEMOS.length} />
					<Heading />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
