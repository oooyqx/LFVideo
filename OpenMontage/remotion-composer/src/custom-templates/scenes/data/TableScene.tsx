import React from 'react';
import {
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {AutoFit} from '../../primitives';
import {useTheme} from '../../theme/ThemeContext';
import {withAlpha} from '../../theme/util';
import {TechPanel} from '../../theme/surfaces';
import {glowL2, glowL3, glowL4} from '../../theme/textStyles';
import {Animated} from '../../animation';
import {osc01, proportionalTiming} from '../../animation/presence';
import {TRANSITION_IDS} from '../../animation/types';

// 通用表格：列由 headers 决定，每行是与 headers 对齐的 cells[]（纯字符串）。
// 不再绑定任何业务字段名。highlightCell 用 "行-列"（均 1 起，行只数数据行）
// 标注需要强调的单元格，到点闪烁高亮。
export const tableSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string(),
	headers: z.array(z.string()),
	rows: z.array(z.array(z.string())),
	highlightCell: z.string().optional(),
	enter: z.enum(TRANSITION_IDS).optional(),
});
export type TableProps = z.infer<typeof tableSchema>;

const TableCell: React.FC<{
	content: string;
	isHeader?: boolean;
	highlighted?: boolean;
	highlightColor: string;
	align?: 'left' | 'center';
	colIndex: number;
	rowIndex: number;
	tier?: 0 | 1 | 2;
}> = ({
	content,
	isHeader = false,
	highlighted = false,
	highlightColor,
	align = 'left',
	colIndex,
	rowIndex,
	tier = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {colors, FONT_SIZE, SPACING, RADIUS} = useTheme();
	const headerBg = withAlpha(colors.bg.to, 0.7);

	// 方案 B：行数越多，单元格内边距/字号越紧凑（仍不低于 FONT_SIZE.min=24）。
	const PAD_Y = [SPACING.md, SPACING.sm, SPACING.xs + 4][tier];
	const PAD_X = [SPACING.lg, SPACING.md + 4, SPACING.md][tier];
	const HEADER_FONT = FONT_SIZE.body + [2, 0, 0][tier];
	const DATA_FONT = [FONT_SIZE.body - 1, FONT_SIZE.body - 2, FONT_SIZE.min][tier];

	// frame 驱动的高亮闪烁（取代 CSS `cell-blink ... infinite`，2s 一循环）。
	const blink = highlighted ? osc01(frame, fps, 2) : 0;
	const hlBorder = withAlpha(highlightColor, 0.33 + blink * (1 - 0.33));
	const hlShadow = `0 0 ${5 + 15 * blink}px ${withAlpha(highlightColor, 0.08 + blink * (0.27 - 0.08))}`;

	return (
		<div
			style={{
				flex: colIndex === 0 ? 1.2 : 1.5,
				padding: `${PAD_Y}px ${PAD_X}px`,
				fontSize: isHeader ? HEADER_FONT : DATA_FONT,
				fontWeight: isHeader ? 900 : colIndex === 0 ? 800 : 500,
				color: '#FFFFFF',
				textShadow: isHeader
					? glowL2(colors.accent[0])
					: colIndex === 0
						? glowL3(colors.accent[0])
						: glowL4(colors.accent[0]),
				display: 'flex',
				alignItems: 'center',
				justifyContent: align === 'center' ? 'center' : 'flex-start',
				background: isHeader
					? headerBg
					: highlighted
						? `${highlightColor}10`
						: 'transparent',
				border: highlighted
					? `2px solid ${hlBorder}`
					: `1.5px solid ${colors.line}`,
				borderRadius: highlighted ? RADIUS.md : 0,
				position: 'relative',
				overflow: 'hidden',
				boxShadow: highlighted ? hlShadow : 'none',
			}}
		>
			<span style={{zIndex: 1}}>{content}</span>
		</div>
	);
};

function parseHighlight(spec?: string): {row: number; col: number} | null {
	if (!spec) return null;
	const m = /^(\d+)-(\d+)$/.exec(spec.trim());
	if (!m) return null;
	return {row: parseInt(m[1], 10), col: parseInt(m[2], 10)};
}

export const TableScene: React.FC<
	TableProps & {startFrame?: number; rowStagger?: number}
> = ({headers, rows, highlightCell, startFrame, rowStagger, enter = 'rise'}) => {
	const frame = useCurrentFrame();
	const {fps, height, durationInFrames} = useVideoConfig();
	// 比例化：首行 5% 处开始，全部行在 40% 处完成入场。
	const auto = proportionalTiming(durationInFrames, rows.length + 1);
	const _startFrame = startFrame ?? auto.start;
	const _rowStagger = rowStagger ?? auto.stagger;
	const theme = useTheme();
	const {colors, fonts, SPACING, SPRING} = theme;

	// 密度分档（方案 B）：≤4 行为 tier 0（8行以内 tier 1，更多 tier 2，
	// 逐档收紧字号/内边距，而不是交给 AutoFit 把整表等比缩到很小。
	const tier: 0 | 1 | 2 = rows.length <= 4 ? 0 : rows.length <= 8 ? 1 : 2;

	// 行高随行数自适应：行少时把行撑高，填满竖向安全区；行多时收紧（仍由 AutoFit 兜底缩放）。
	// 这样无论几行，表格都占满约 90% 的竖向安全区，而不是挤在中间留大片空白。
	const availH = height - SPACING.xl * 2;
	const rowMinHeight = Math.max(
		tier === 2 ? 48 : 56,
		Math.min(190, (availH * 0.9) / (rows.length + 1)),
	);
	const hl = parseHighlight(highlightCell);
	const highlightActive = frame > Math.round(durationInFrames * 0.45);

	const headerProgress = spring({fps, frame: frame - _startFrame, config: SPRING.snappy});
	const headerOpacity = interpolate(headerProgress, [0, 1], [0, 1]);
	const headerScaleY = interpolate(headerProgress, [0, 1], [0.8, 1]);

	const headerRowBg = withAlpha(colors.bg.to, 0.8);

	return (
		<AutoFit paddingX={SPACING.gutter} paddingY={SPACING.xl}>
			<TechPanel
				accent={colors.accent[0]}
				borderAlpha={0.28}
				fill={0.3}
				blur={16}
				style={{
					fontFamily: fonts.family,
					display: 'flex',
					flexDirection: 'column',
					marginTop: 80,
				}}
			>
				<div
					style={{
						display: 'flex',
						minHeight: rowMinHeight,
						background: headerRowBg,
						borderBottom: `2px solid ${colors.line}`,
						opacity: headerOpacity,
						transform: `scaleY(${headerScaleY})`,
						transformOrigin: 'top',
					}}
				>
					{headers.map((header, colIndex) => (
						<TableCell
							key={header}
							content={header}
							isHeader
							colIndex={colIndex}
							rowIndex={0}
							align={colIndex === 0 ? 'left' : 'center'}
							highlightColor={colors.accent[1]}
							tier={tier}
						/>
					))}
				</div>

				{rows.map((row, rowIndex) => {
					const rowStart = _startFrame + (rowIndex + 1) * _rowStagger;

					return (
						<Animated
							key={`${rowIndex}-${row[0] ?? ''}`}
							enter={enter}
							delay={rowStart}
							distance={30}
							style={{
								display: 'flex',
								minHeight: rowMinHeight,
								borderBottom:
									rowIndex === rows.length - 1
										? 'none'
										: `1.5px solid ${colors.line}`,
								background:
									rowIndex % 2 === 1 ? withAlpha(colors.text.primary, 0.015) : 'transparent',
							}}
						>
							{headers.map((_, colIndex) => {
								const cellHighlighted =
									highlightActive &&
									hl !== null &&
									hl.row === rowIndex + 1 &&
									hl.col === colIndex + 1;
								return (
									<TableCell
										key={colIndex}
										content={row[colIndex] ?? ''}
										colIndex={colIndex}
										rowIndex={rowIndex + 1}
										align={colIndex === 0 ? 'left' : 'center'}
										highlighted={cellHighlighted}
										highlightColor={colors.accent[colIndex % colors.accent.length]}
										tier={tier}
									/>
								);
							})}
						</Animated>
					);
				})}
			</TechPanel>
		</AutoFit>
	);
};
