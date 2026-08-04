import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useTheme} from '../../theme/ThemeContext';
import {withAlpha} from '../../theme/util';
import {glowBlob, accentUnderline} from '../../theme/surfaces';
import {textStyles, glowL2, extrudeShadow} from '../../theme/textStyles';
import {osc01} from '../../animation/presence';
import {ScanlineOverlay} from '../../background/Background';
import {loadFont as loadMogra} from '@remotion/google-fonts/Mogra';

const {fontFamily: mograFont} = loadMogra();

export const quoteSchema = z.object({
	text: z.string(),
	attribution: z.string().optional(),
});
export type QuoteProps = z.infer<typeof quoteSchema>;

export const QuoteScene: React.FC<QuoteProps> = ({text, attribution}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	const color = colors.accent[0];
	const enter = spring({fps, frame, config: {damping: 20, stiffness: 90}});
	const opacity = interpolate(enter, [0, 1], [0, 1]);
	const translateY = interpolate(enter, [0, 1], [28, 0]);
	const markScale = spring({fps, frame, config: {damping: 11, stiffness: 110}, from: 0.6, to: 1});
	const attrStart = Math.round(durationInFrames * 0.08);
	const attrProgress = spring({frame: frame - attrStart, fps, config: {damping: 20}});
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp'},
	);

	const big = text.length <= 28;
	const breath = osc01(frame, fps, 5);

	const chars = Array.from(text);
	const charStart = Math.round(durationInFrames * 0.06);
	const charStagger = Math.max(1, Math.round(fps * 0.03));

	return (
		<AbsoluteFill
			style={{
				fontFamily: fonts.family,
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				padding: `0 ${SPACING.gutter}px`,
				opacity: opacity * fadeOut,
			}}
		>
			<div
				style={glowBlob(color, {
					width: 760,
					height: 360,
					blur: 90,
					intensity: 0.12 + breath * 0.08,
				})}
			/>
			<ScanlineOverlay color={color} />

			<div
				style={{
					display: 'flex',
					gap: 10,
					marginBottom: SPACING.sm,
					transform: `scale(${markScale})`,
					zIndex: 1,
				}}
			>
				<div
					style={{
						width: 6,
						height: 52,
						borderRadius: 3,
						background: `linear-gradient(180deg, ${color}, ${withAlpha(color, 0.3)})`,
						boxShadow: `0 0 16px ${withAlpha(color, 0.6)}, 0 0 32px ${withAlpha(color, 0.3)}`,
						transform: 'rotate(-8deg)',
					}}
				/>
				<div
					style={{
						width: 6,
						height: 52,
						borderRadius: 3,
						background: `linear-gradient(180deg, ${color}, ${withAlpha(color, 0.3)})`,
						boxShadow: `0 0 16px ${withAlpha(color, 0.6)}, 0 0 32px ${withAlpha(color, 0.3)}`,
						transform: 'rotate(8deg)',
					}}
				/>
			</div>

			<div
				style={{
					...(big ? t.displayTitle : t.sceneTitle),
					fontWeight: 800,
					maxWidth: 1500,
					lineHeight: 1.3,
					color: '#ffffff',
					fontFamily: mograFont,
					letterSpacing: '0.02em',
					transform: `translateY(${translateY}px)`,
					textShadow: extrudeShadow(6, big ? FONT_SIZE.display : FONT_SIZE.title),
					zIndex: 1,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
				}}
			>
				{chars.map((ch, i) => {
					const charDelay = charStart + i * charStagger;
					const charEnter = spring({
						fps,
						frame: frame - charDelay,
						config: {damping: 18, stiffness: 120},
					});
					const charOpacity = interpolate(charEnter, [0, 1], [0, 1]);
					const charY = interpolate(charEnter, [0, 1], [20, 0]);
					const isSpace = ch === ' ';
					return (
						<span
							key={i}
							style={{
								opacity: charOpacity,
								transform: `translateY(${charY}px)`,
								display: isSpace ? 'inline' : 'inline-block',
								whiteSpace: 'pre',
							}}
						>
							{ch}
						</span>
					);
				})}
			</div>

			{attribution && (
				<div
					style={{
						marginTop: SPACING.lg,
						display: 'flex',
						alignItems: 'center',
						gap: SPACING.sm,
						opacity: attrProgress,
						zIndex: 1,
					}}
				>
					<div style={accentUnderline(theme, {width: 48, height: 2, glow: 0.8})} />
					<div
						style={{
							...t.bodyMuted,
							fontSize: FONT_SIZE.subtitle,
							fontWeight: 600,
							color: '#FFFFFF',
							fontFamily: mograFont,
							letterSpacing: 1,
							textShadow: extrudeShadow(5, FONT_SIZE.subtitle),
						}}
					>
						{attribution}
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};
