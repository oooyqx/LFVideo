import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {AutoFit} from '../../primitives';
import {useTheme} from '../../theme/ThemeContext';
import {TechPanel, techIconChip} from '../../theme/surfaces';
import {textStyles} from '../../theme/textStyles';
import {lighten} from '../../theme/util';
import {Animated} from '../../animation';
import {osc01, proportionalTiming} from '../../animation/presence';
import {TRANSITION_IDS, type TransitionId} from '../../animation/types';

export const conceptItemSchema = z.object({
	label: z.string(),
	title: z.string(),
	desc: z.string(),
	icon: z.string(),
	// 该卡片入场时机（秒，相对本 cut 起点）。填则踩语音节奏；不填回退到均匀 stagger。
	atSec: z.number().optional(),
});
export type ConceptItem = z.infer<typeof conceptItemSchema>;

export const conceptSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string(),
	items: z.array(conceptItemSchema),
	enter: z.enum(TRANSITION_IDS).optional(),
});
export type ConceptProps = z.infer<typeof conceptSchema>;

const ItemCard: React.FC<{
	item: ConceptItem;
	color: string;
	delay: number;
	index: number;
	enter: TransitionId;
	tier: 0 | 1 | 2;
}> = ({item, color, delay, index, enter, tier}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const theme = useTheme();
	const {FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	// 方案 B：密度分档动态收紧字号/图标/间距（仍不低于 FONT_SIZE.min=24），
	// 让密集内容主动变紧凑、保持可读，而不是交给 AutoFit 把整块等比缩到很小。
	const ICON = [80, 72, 64][tier];
	const ICON_FONT = [40, 34, 30][tier];
	const TITLE = [FONT_SIZE.subtitle, FONT_SIZE.bodyLg, FONT_SIZE.body][tier];
	const DESC = [FONT_SIZE.body, FONT_SIZE.body - 2, FONT_SIZE.min][tier];
	const PAD_Y = [SPACING.md + 4, SPACING.md, SPACING.sm + 4][tier];
	const PAD_X = [SPACING.lg, SPACING.md + 4, SPACING.md][tier];
	const GAP = [SPACING.md, SPACING.sm + 4, SPACING.sm][tier];

	// frame 驱动的常驻辉光 / 图标浮动（取代 CSS `card-glow`/`icon-float ... infinite`）。
	const glow = osc01(frame, fps, 6, index * 0.5);
	const floatW = (1 - Math.cos(((frame / fps + index * 0.3) / 5) * Math.PI * 2)) / 2;
	const iconTransform = `translateY(${-6 * floatW}px) rotate(${4 * floatW}deg)`;

	return (
		<Animated enter={enter} delay={delay} distance={60}>
		<TechPanel
			accent={color}
			glow={glow}
			borderAlpha={0.13}
			blur={16}
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: GAP,
				minWidth: [560, 0, 0][tier],
				padding: `${PAD_Y}px ${PAD_X}px`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: -50,
					top: -50,
					width: 150,
					height: 150,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>

			<div
				style={{
					...techIconChip(theme, color, {size: ICON}),
					fontSize: ICON_FONT,
					transform: iconTransform,
				}}
			>
				{item.icon}
			</div>

			<div style={{flex: 1, zIndex: 1}}>
				<div
					style={{
						...t.eyebrow,
						color: lighten(color, 0.35),
						textShadow: `0 0 12px ${color}60, 0 2px 6px rgba(0,0,0,0.8)`,
						marginBottom: SPACING.xs - 2,
						opacity: 0.9,
					}}
				>
					{item.label}
				</div>
				<div
					style={{
						...t.cardTitle,
						fontSize: TITLE,
						marginBottom: SPACING.xs,
						lineHeight: 1.2,
					}}
				>
					{item.title}
				</div>
				<div style={{...t.bodyMuted, fontSize: DESC, lineHeight: 1.65}}>
					{item.desc}
				</div>
			</div>
		</TechPanel>
		</Animated>
	);
};

export const ConceptScene: React.FC<
	ConceptProps & {cardStart?: number; cardStagger?: number}
> = ({items, cardStart, cardStagger, enter = 'rise-pop'}) => {
	const {fps, durationInFrames} = useVideoConfig();
	// 比例化：首卡 5% 处开始，全部卡片在 40% 处完成入场。
	const auto = proportionalTiming(durationInFrames, items.length);
	const _cardStart = cardStart ?? auto.start;
	const _cardStagger = cardStagger ?? auto.stagger;
	const {colors, fonts, SPACING} = useTheme();

	// 密度分档（fit-to-fill + 方案 B）：条目多时换多列排布并配合字号/间距收紧，
	// 而不是被 AutoFit 一味等比缩小到字很小。
	// tier 0 (≤4 条)：单列、大字；tier 1 (5–9 条)：双列；tier 2 (>9 条)：三列、紧凑字。
	const tier: 0 | 1 | 2 = items.length <= 4 ? 0 : items.length <= 9 ? 1 : 2;
	const columns = [1, 2, 3][tier];
	const gridGap = [SPACING.md, SPACING.md, SPACING.sm][tier];

	return (
		<AutoFit
			paddingX={SPACING.gutter}
			paddingY={SPACING.xl}
			widthMode="content"
			maxScale={tier === 0 ? 1.6 : 1.25}
		>
			<div
				style={{
					fontFamily: fonts.family,
					display: 'grid',
					gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
					alignItems: 'start',
					gap: gridGap,
				}}
			>
				{items.map((item, i) => {
					// atSec 优先（踩语音节奏），否则回退到均匀 stagger。
					const delay =
						item.atSec != null
							? Math.max(0, Math.round(item.atSec * fps))
							: _cardStart + i * _cardStagger;
					return (
						<ItemCard
							key={item.title}
							item={item}
							color={colors.accent[i % colors.accent.length]}
							delay={delay}
							index={i}
							enter={enter}
							tier={tier}
						/>
					);
				})}
			</div>
		</AutoFit>
	);
};
