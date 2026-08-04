import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useTheme} from '../theme/ThemeContext';
import {accentUnderline} from '../theme/surfaces';
import {textStyles, glowL1} from '../theme/textStyles';
import {
	clamp01,
	lerp,
	easeOutCubic,
	computeBalancedLines,
	Scramble,
} from './textfx-utils';

export interface HoloTitleProps {
	title: string;
	/** 上方小标注（eyebrow），走 textStyles.eyebrow（accent、大写、宽字距）。 */
	eyebrow?: string;
	/** 对齐：右上角章节标题用 right，片头主标题用 center。默认 center。 */
	align?: 'left' | 'center' | 'right';
	/** 字号档：场景标题 title / 全屏主标题 display。默认 display。 */
	size?: 'title' | 'display';
	/** 入场起始帧（相对本 Sequence）。 */
	startFrame?: number;
	/** 标题最大宽度（px），超出则平衡换行（上行稍宽）。 */
	maxWidth?: number;
	/** accent 发光下划线的目标宽度（px）。 */
	underlineWidth?: number;
	/** 下划线与标题之间的额外间距（px），默认 0。 */
	underlineOffset?: number;
	/** 自定义字体（覆盖主题默认）。 */
	fontFamily?: string;
	/** 自定义文字阴影（覆盖默认 glowL1）。 */
	textShadow?: string;
	/** 是否在出场时投影成形（长阴影坍缩）。默认 true。 */
	exit?: boolean;
}

const EXIT_FRAMES = 16;

/**
 * 全息标题 SSOT —— 片头主标题与右上角章节标题的同源实现。
 *  - 入场：乱码解码（Scramble / Decode，#72），时长走 GLOW.decodeFrames。
 *  - 文字：统一字体 + 900 字重 + 白字 + accent 全息辉光（holoTextShadow）。
 *  - 下划线：accent 渐变光条（accentUnderline），随解码进度展开、带辉光。
 *  - 出场（可选）：投影成形（长阴影坍缩 + 淡出）。
 * 改这里即可让所有标题的动效/字体/辉光同步变化。
 */
export const HoloTitle: React.FC<HoloTitleProps> = ({
	title,
	eyebrow,
	align = 'center',
	size = 'display',
	startFrame = 0,
	maxWidth = 1400,
	underlineWidth = 160,
	underlineOffset = 0,
	fontFamily,
	textShadow,
	exit = true,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, FONT_SIZE, SPACING, fonts, GLOW} = theme;
	const t = textStyles(theme);

	const fontSize = size === 'display' ? FONT_SIZE.display : FONT_SIZE.title;
	const cssFont = `900 ${fontSize}px ${fontFamily ?? fonts.family}`;
	const lines = React.useMemo(
		() => computeBalancedLines(title, cssFont, maxWidth),
		[title, cssFont, maxWidth],
	);

	// ---- 入场：乱码解码 ----
	const tIn = clamp01((frame - startFrame) / GLOW.decodeFrames);
	const decodeProgress = easeOutCubic(tIn);
	const enterOpacity = Math.min(1, tIn * 2);
	const isEntering = tIn > 0 && tIn < 1;

	// ---- 出场：投影成形（长阴影坍缩）----
	const tOut = exit
		? clamp01((frame - (durationInFrames - EXIT_FRAMES)) / EXIT_FRAMES)
		: 0;
	const exitPresence = 1 - easeOutCubic(tOut); // 1→0
	const exitOpacity = clamp01((1 - tOut) * 2);
	const shadowLen = Math.round(lerp(4, 28, tOut));
	const exitShadow = Array.from(
		{length: shadowLen},
		(_, k) => `${k + 1}px ${k + 1}px 0 rgba(0,0,0,0.35)`,
	).join(', ');

	const opacity = enterOpacity * exitOpacity;
	const lineWidth =
		interpolate(decodeProgress, [0, 1], [0, underlineWidth]) * exitPresence;

	const items: 'flex-start' | 'center' | 'flex-end' =
		align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: items,
				textAlign: align,
				opacity,
				fontFamily: fonts.family,
			}}
		>
			{eyebrow && (
				<div style={{...t.eyebrow, marginBottom: SPACING.xs}}>{eyebrow}</div>
			)}
			<div
				style={{
					fontSize,
					fontWeight: 900,
					color: colors.text.primary,
					lineHeight: 1.15,
					letterSpacing: size === 'display' ? -1.5 : -1,
					marginBottom: SPACING.sm + underlineOffset,
					textShadow: tOut > 0 ? exitShadow : (textShadow ?? glowL1(colors.accent[0])),
				}}
			>
				{lines.map((ln, i) => (
					<div key={i} style={{whiteSpace: 'nowrap'}}>
						{isEntering ? (
							<Scramble
								text={ln}
								progress={decodeProgress}
								frame={frame}
								seed={i * 100 + 42}
								scrambleColor={colors.accent[1]}
							/>
						) : (
							ln
						)}
					</div>
				))}
			</div>
			<div style={accentUnderline(theme, {width: lineWidth})} />
		</div>
	);
};
