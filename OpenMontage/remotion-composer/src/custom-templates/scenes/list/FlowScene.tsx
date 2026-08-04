import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {AutoFit} from '../../primitives';
import {useTheme} from '../../theme/ThemeContext';
import {withAlpha} from '../../theme/util';
import {TechPanel, techIconChip} from '../../theme/surfaces';
import {textStyles, glowL2} from '../../theme/textStyles';
import {Animated} from '../../animation';
import {osc01, proportionalTiming} from '../../animation/presence';
import {TRANSITION_IDS, type TransitionId} from '../../animation/types';

export const flowStepSchema = z.object({
	label: z.string(),
	desc: z.string(),
	icon: z.string(),
	// 该步骤入场时机（秒，相对本 cut 起点）。填则踩语音节奏；不填回退到均匀 stagger。
	atSec: z.number().optional(),
});
export type FlowStep = z.infer<typeof flowStepSchema>;

export const flowSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string().optional(),
	steps: z.array(flowStepSchema),
	orientation: z.enum(['horizontal', 'vertical']).optional(),
	enter: z.enum(TRANSITION_IDS).optional(),
});
export type FlowProps = z.infer<typeof flowSchema>;

const Connector: React.FC<{vertical: boolean; color: string; delay: number}> = ({
	vertical,
	color,
	delay,
}) => (
	<Animated enter="pop" delay={delay} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<div
			style={{
				fontSize: 44,
				fontWeight: 900,
				color,
				transform: vertical ? 'rotate(90deg)' : 'none',
				lineHeight: 1,
				textShadow: glowL2(color),
			}}
		>
			→
		</div>
	</Animated>
);

const StepCard: React.FC<{
	step: FlowStep;
	index: number;
	color: string;
	delay: number;
	enter: TransitionId;
	vertical: boolean;
	tier: 0 | 1 | 2;
}> = ({step, index, color, delay, enter, vertical, tier}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const theme = useTheme();
	const {FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	const ICON = [76, 68, 60][tier];
	const ICON_FONT = [38, 34, 30][tier];
	const TITLE = [FONT_SIZE.subtitle, FONT_SIZE.bodyLg, FONT_SIZE.body][tier];
	const DESC = [FONT_SIZE.body, FONT_SIZE.body - 2, FONT_SIZE.min][tier];
	const PAD = [SPACING.lg, SPACING.md + 4, SPACING.md][tier];

	const glow = osc01(frame, fps, 5, index * 0.4);

	return (
		<Animated enter={enter} delay={delay} distance={50} style={{flex: 1, display: 'flex'}}>
			<TechPanel
				accent={color}
				glow={glow}
				borderAlpha={0.33}
				blur={12}
				style={{
					flex: 1,
					minWidth: vertical ? 560 : 220,
					minHeight: vertical ? 0 : [440, 360, 280][tier],
					padding: `${PAD}px`,
					display: 'flex',
					flexDirection: vertical ? 'row' : 'column',
					alignItems: vertical ? 'center' : 'flex-start',
					gap: SPACING.md,
					textAlign: 'left',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: -8,
						right: SPACING.md,
						fontSize: 72,
						fontWeight: 900,
						color: withAlpha(color, 0.18),
						lineHeight: 1,
					}}
				>
					{index + 1}
				</div>
				<div style={{...techIconChip(theme, color, {size: ICON}), fontSize: ICON_FONT}}>
					{step.icon}
				</div>
				<div style={{flex: 1, zIndex: 1}}>
					<div
						style={{
							...t.cardTitle,
							fontSize: TITLE,
							marginBottom: SPACING.xs,
							lineHeight: 1.2,
						}}
					>
						{step.label}
					</div>
					<div style={{...t.bodyMuted, fontSize: DESC}}>{step.desc}</div>
				</div>
			</TechPanel>
		</Animated>
	);
};

export const FlowScene: React.FC<FlowProps> = ({
	steps,
	orientation = 'horizontal',
	enter = 'rise-pop',
}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const {colors, fonts, SPACING} = useTheme();

	const vertical = orientation === 'vertical';
	const tier: 0 | 1 | 2 = steps.length <= 3 ? 0 : steps.length <= 4 ? 1 : 2;
	// 步骤少时增大间距，让内容在竖向铺开。
	const stepGap = [SPACING.lg, SPACING.md, SPACING.sm][tier];
	// 比例化：首步 5% 处开始，全部步骤在 40% 处完成入场。
	const auto = proportionalTiming(durationInFrames, steps.length);
	const startFrame = auto.start;
	const stagger = auto.stagger;

	// atSec 优先（踩语音节奏），否则回退到均匀 stagger。
	const stepDelay = (step: FlowStep, i: number) =>
		step.atSec != null
			? Math.max(0, Math.round(step.atSec * fps))
			: startFrame + i * stagger;

	return (
		<AutoFit
			paddingX={SPACING.gutter}
			paddingY={SPACING.xl}
			maxScale={vertical ? 1.2 : 1.5}
			widthMode={vertical ? 'fill' : 'content'}
		>
			<div
				style={{
					fontFamily: fonts.family,
					display: 'flex',
					flexDirection: vertical ? 'column' : 'row',
					alignItems: vertical ? 'stretch' : 'stretch',
					justifyContent: 'center',
					gap: stepGap,
					height: '100%',
				}}
			>
				{steps.map((step, i) => {
					const delay = stepDelay(step, i);
					// 连接符接在本步与下一步之间：取两者中点，跟随实际节奏。
					const nextDelay =
						i < steps.length - 1 ? stepDelay(steps[i + 1], i + 1) : delay;
					return (
						<React.Fragment key={step.label}>
							<StepCard
								step={step}
								index={i}
								color={colors.accent[i % colors.accent.length]}
								delay={delay}
								enter={enter}
								vertical={vertical}
								tier={tier}
							/>
							{i < steps.length - 1 && (
								<Connector
									vertical={vertical}
									color={colors.accent[(i + 1) % colors.accent.length]}
									delay={Math.round((delay + nextDelay) / 2)}
								/>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</AutoFit>
	);
};
