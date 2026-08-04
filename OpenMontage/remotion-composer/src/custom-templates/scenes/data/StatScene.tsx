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
import {glowBlob} from '../../theme/surfaces';
import {textStyles, extrudeShadow} from '../../theme/textStyles';
import {loadFont as loadMogra} from '@remotion/google-fonts/Mogra';

const {fontFamily: mograFont} = loadMogra();

export const statSchema = z.object({
	stat: z.string(),
	subtitle: z.string().optional(),
	label: z.string().optional(),
});
export type StatProps = z.infer<typeof statSchema>;

// 单个核心数字 / 硬指标。主题驱动配色，大号数字弹入 + 副标题错峰淡入。
export const StatScene: React.FC<StatProps> = ({stat, subtitle, label}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	const color = colors.accent[0];

	const scale = spring({frame, fps, config: {damping: 12, stiffness: 120}, from: 0.8, to: 1});
	const subStart = Math.round(durationInFrames * 0.06);
	const subProgress = spring({frame: frame - subStart, fps, config: {damping: 20}});
	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp'},
	);

	return (
		<AbsoluteFill
			style={{
				fontFamily: fonts.family,
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				opacity: fadeOut,
			}}
		>
			<div style={glowBlob(color, {width: 700, height: 320, intensity: 0.18})} />
			{label && (
				<div
					style={{
						fontSize: FONT_SIZE.subtitle,
						fontWeight: 700,
						letterSpacing: 4,
						textTransform: 'uppercase',
						color: '#FFFFFF',
						fontFamily: mograFont,
						marginBottom: SPACING.md,
						opacity: subProgress,
						textShadow: extrudeShadow(5, FONT_SIZE.subtitle),
						zIndex: 1,
					}}
				>
					{label}
				</div>
			)}
			<div
				style={{
					transform: `scale(${scale})`,
					fontSize: 200,
					fontWeight: 900,
					lineHeight: 1,
					letterSpacing: -4,
					color: '#FFFFFF',
					fontFamily: mograFont,
					textShadow: extrudeShadow(8, 200),
					zIndex: 1,
				}}
			>
				{stat}
			</div>
			{subtitle && (
				<div
					style={{
						...t.body,
						fontSize: FONT_SIZE.subtitle,
						fontWeight: 600,
						color: '#FFFFFF',
						fontFamily: mograFont,
						textShadow: extrudeShadow(5, FONT_SIZE.subtitle),
						marginTop: SPACING.lg,
						maxWidth: 1200,
						lineHeight: 1.4,
						opacity: subProgress,
						transform: `translateY(${interpolate(subProgress, [0, 1], [20, 0])}px)`,
						zIndex: 1,
					}}
				>
					{subtitle}
				</div>
			)}
		</AbsoluteFill>
	);
};
