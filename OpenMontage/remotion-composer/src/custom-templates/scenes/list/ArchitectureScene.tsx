import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {AutoFit} from '../../primitives';
import {useTheme} from '../../theme/ThemeContext';
import {TechPanel, techIconChip} from '../../theme/surfaces';
import {textStyles, glowL2} from '../../theme/textStyles';
import {Animated} from '../../animation';
import {osc01, proportionalTiming} from '../../animation/presence';
import {TRANSITION_IDS, type TransitionId} from '../../animation/types';

export const archNodeSchema = z.object({
	id: z.string().optional(),
	label: z.string(),
	title: z.string().optional(),
	desc: z.string().optional(),
	icon: z.string().optional(),
	level: z.number(),
	atSec: z.number().optional(),
});
export type ArchNode = z.infer<typeof archNodeSchema>;

export const archEdgeSchema = z.object({
	from: z.union([z.string(), z.number()]),
	to: z.union([z.string(), z.number()]),
});
export type ArchEdge = z.infer<typeof archEdgeSchema>;

export const archSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string().optional(),
	nodes: z.array(archNodeSchema),
	edges: z.array(archEdgeSchema).optional(),
	enter: z.enum(TRANSITION_IDS).optional(),
});
export type ArchProps = z.infer<typeof archSchema>;

const ArchNodeCard: React.FC<{
	node: ArchNode;
	index: number;
	color: string;
	delay: number;
	enter: TransitionId;
	maxNodesInLevel: number;
	totalLevels: number;
}> = ({node, index, color, delay, enter, maxNodesInLevel, totalLevels}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const theme = useTheme();
	const {FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	const glow = osc01(frame, fps, 5, index * 0.4);

	// Density-based sizing: more nodes/levels = smaller cards
	const density = maxNodesInLevel <= 2 ? 0 : maxNodesInLevel <= 4 ? 1 : 2;
	const verticalPressure = totalLevels > 5 ? 1 : 0;

	const ICON = [104, 88, 72][density];
	const ICON_FONT = [52, 44, 36][density];
	const TITLE = [FONT_SIZE.display + 8, FONT_SIZE.title + 4, FONT_SIZE.title][density];
	const DESC = [FONT_SIZE.subtitle + 8, FONT_SIZE.subtitle + 2, FONT_SIZE.bodyLg + 4][density];
	const LABEL = [FONT_SIZE.bodyLg + 8, FONT_SIZE.bodyLg, FONT_SIZE.body + 2][density];
	const PAD = [SPACING.md + 12, SPACING.md + 8, SPACING.md][density];
	const MIN_W = [360, 280, 200][density];
	const MIN_H = verticalPressure ? 120 : 0;
	const MAX_W = [820, 640, 480][density];

	return (
		<Animated enter={enter} delay={delay} distance={40} style={{flex: 1, display: 'flex', maxWidth: MAX_W}}>
			<TechPanel
				accent={color}
				glow={glow}
				borderAlpha={0.33}
				blur={12}
				style={{
					flex: 1,
					padding: `${PAD}px ${PAD + 2}px`,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					textAlign: 'left',
					gap: SPACING.md + 4,
					minWidth: MIN_W,
					minHeight: MIN_H,
				}}
			>
				{node.icon && (
					<div
						style={{
							...techIconChip(theme, color, {size: ICON}),
							fontSize: ICON_FONT,
							flexShrink: 0,
						}}
					>
						{node.icon}
					</div>
				)}
				<div style={{flex: 1, zIndex: 1}}>
					{node.label && (
						<div style={{...t.eyebrow, fontSize: LABEL, marginBottom: SPACING.xs}}>
							{node.label}
						</div>
					)}
					<div
						style={{
							...t.cardTitle,
							fontSize: TITLE,
							marginBottom: node.desc ? SPACING.xs : 0,
							lineHeight: 1.2,
						}}
					>
						{node.title ?? node.label}
					</div>
					{node.desc && (
						<div style={{...t.bodyMuted, fontSize: DESC, lineHeight: 1.5}}>
							{node.desc}
						</div>
					)}
				</div>
			</TechPanel>
		</Animated>
	);
};

const Connector: React.FC<{color: string; progress: number; delay: number}> = ({
	color,
	progress,
	delay,
}) => (
	<Animated enter="pop" delay={delay} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		<div
			style={{
				fontSize: 36,
				fontWeight: 900,
				color,
				lineHeight: 1,
				textShadow: glowL2(color),
				opacity: interpolate(progress, [0, 0.4, 1], [0, 0.5, 0.7]),
			}}
		>
			↓
		</div>
	</Animated>
);

export const ArchitectureScene: React.FC<ArchProps> = ({
	nodes,
	edges = [],
	enter = 'rise-pop',
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, SPACING} = theme;

	const levels = Array.from(new Set(nodes.map((n) => n.level))).sort(
		(a, b) => a - b,
	);
	const nodesByLevel = levels.map((lvl) =>
		nodes.filter((n) => n.level === lvl),
	);
	const maxNodesInLevel = Math.max(...nodesByLevel.map((l) => l.length));
	const totalLevels = levels.length;

	const auto = proportionalTiming(durationInFrames, nodes.length);
	const startFrame = auto.start;
	const stagger = auto.stagger;

	const nodeIndexMap = new Map<string, number>();
	nodes.forEach((n, i) => nodeIndexMap.set(n.id ?? `node_${i}`, i));
	const nodeDelay = (node: ArchNode, i: number) =>
		node.atSec != null
			? Math.max(0, Math.round(node.atSec * fps))
			: startFrame + i * stagger;

	const connectorStart = Math.round(durationInFrames * 0.1);
	const connectorProgress = Math.min(1, Math.max(0, (frame - connectorStart) / 20));

	const levelGap = totalLevels <= 3 ? SPACING.lg : totalLevels <= 5 ? SPACING.md + 8 : SPACING.md;
	const nodeGap = maxNodesInLevel <= 2 ? SPACING.lg : maxNodesInLevel <= 4 ? SPACING.md : SPACING.sm + 4;

	return (
		<AutoFit
			paddingX={SPACING.md + 16}
			paddingY={SPACING.lg}
			maxScale={1.8}
			widthMode="fill"
		>
			<div
				style={{
					fontFamily: fonts.family,
					display: 'flex',
					flexDirection: 'column',
					gap: SPACING.lg,
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					marginTop: 40,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: levelGap,
						alignItems: 'stretch',
						justifyContent: 'center',
						flex: 1,
					}}
				>
					{nodesByLevel.map((levelNodes, levelIdx) => (
						<React.Fragment key={levelIdx}>
							{levelIdx > 0 && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										padding: `${levelGap / 4}px 0`,
									}}
								>
									<Connector
										color={colors.accent[levelIdx % colors.accent.length]}
										progress={connectorProgress}
										delay={connectorStart}
									/>
								</div>
							)}
							<div
								style={{
									display: 'flex',
									gap: nodeGap,
									justifyContent: 'center',
									alignItems: 'stretch',
									width: '100%',
								}}
							>
								{levelNodes.map((node) => {
									const globalIdx = nodeIndexMap.get(node.id ?? `node_${nodes.indexOf(node)}`) ?? 0;
									return (
										<ArchNodeCard
											key={node.id ?? `${levelIdx}-${levelNodes.indexOf(node)}`}
											node={node}
											index={globalIdx}
											color={colors.accent[globalIdx % colors.accent.length]}
											delay={nodeDelay(node, globalIdx)}
											enter={enter}
											maxNodesInLevel={maxNodesInLevel}
											totalLevels={totalLevels}
										/>
									);
								})}
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
		</AutoFit>
	);
};
