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
import {glowBlob} from '../../theme/surfaces';
import {textStyles} from '../../theme/textStyles';
import {HoloTitle} from '../../primitives/HoloTitle';
import {osc01} from '../../animation/presence';

export const outroSchema = z.object({
	headline: z.string(),
	cta: z.string().optional(),
});
export type OutroProps = z.infer<typeof outroSchema>;

export const OutroScene: React.FC<OutroProps> = ({
	headline,
	cta = '关注 · 一起验证 AI IDE 的真实能力',
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, FONT_SIZE, SPACING, RADIUS} = theme;
	const t = textStyles(theme);
	const enter = spring({fps, frame, config: {damping: 20, stiffness: 90}});
	const opacity = interpolate(enter, [0, 1], [0, 1]);
	const translateY = interpolate(enter, [0, 1], [30, 0]);

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp'},
	);

	const breath = osc01(frame, fps, 5);
	const scanShift = (frame / fps / 6) % 1;

	const pulse = (1 - Math.cos((frame / fps / 3.5) * Math.PI * 2)) / 2;
	const btnScale = 1 + 0.03 * pulse;
	const btnBlur = 30 + 5 * pulse;
	const btnSpread = -4 + 8 * pulse;
	const btnShadow = `0 8px ${btnBlur}px ${btnSpread}px ${withAlpha(colors.accent[0], 0.4 * (1 - pulse))}, 0 8px ${btnBlur}px ${btnSpread}px ${withAlpha(colors.accent[1], 0.6 * pulse)}`;

	return (
		<AbsoluteFill
			style={{
				fontFamily: fonts.family,
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				opacity: opacity * fadeOut,
				transform: `translateY(${translateY}px)`,
			}}
		>
			<div
				style={glowBlob(colors.accent[3] ?? colors.accent[1], {
					width: 600,
					height: 240,
					intensity: 0.10 + breath * 0.08,
					blur: 70,
				})}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					zIndex: 0,
					pointerEvents: 'none',
					backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha(
						colors.accent[0],
						0.05,
					)} 0px, ${withAlpha(colors.accent[0], 0.05)} 1px, transparent 1px, transparent 4px)`,
					backgroundPositionY: `${scanShift * 4}px`,
					maskImage:
						'radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%)',
					WebkitMaskImage:
						'radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%)',
				}}
			/>

			<div style={{zIndex: 1, padding: '0 80px', maxWidth: 1400, marginBottom: SPACING.xl}}>
				<HoloTitle
					title={headline}
					align="center"
					size="title"
					maxWidth={1280}
					underlineWidth={180}
				/>
			</div>
			<div
				style={{
					fontSize: FONT_SIZE.subtitle,
					fontWeight: 700,
					color: colors.text.primary,
					padding: `${SPACING.sm + 4}px ${SPACING.xl}px`,
					borderRadius: RADIUS.pill,
					background: `linear-gradient(135deg, ${colors.accent[0]} 0%, ${colors.accent[1]} 100%)`,
					transform: `scale(${btnScale})`,
					boxShadow: btnShadow,
					letterSpacing: 1.5,
					textShadow: `0 1px 4px rgba(0,0,0,0.4)`,
					zIndex: 1,
					border: '1.5px solid rgba(255,255,255,0.45)',
				}}
			>
				{cta}
			</div>
		</AbsoluteFill>
	);
};
