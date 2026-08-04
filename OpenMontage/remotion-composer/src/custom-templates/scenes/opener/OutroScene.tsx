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
import {textStyles, extrudeShadow} from '../../theme/textStyles';
import {HoloTitle} from '../../primitives/HoloTitle';
import {osc01} from '../../animation/presence';
import {ScanlineOverlay} from '../../background/Background';
import {loadFont as loadMogra} from '@remotion/google-fonts/Mogra';

const {fontFamily: mograFont} = loadMogra();

export const outroSchema = z.object({
	headline: z.string(),
	cta: z.string().optional(),
	gitUrl: z.string().optional(),
});
export type OutroProps = z.infer<typeof outroSchema>;

const GIT_URL_DEFAULT = 'github.com/ooooyx/LFVideo';

export const OutroScene: React.FC<OutroProps> = ({
	headline,
	cta = '关注 · 一起验证 AI IDE 的真实能力',
	gitUrl,
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
			<ScanlineOverlay color={colors.accent[0]} />

			<div style={{zIndex: 1, padding: '0 80px', maxWidth: 1400, marginBottom: SPACING.xl}}>
				<HoloTitle
					title={headline}
					align="center"
					size="display"
					maxWidth={1600}
					underlineWidth={280}
					underlineOffset={30}
					fontFamily={mograFont}
					textShadow={extrudeShadow(8, FONT_SIZE.display)}
				/>
			</div>
			<div
				style={{
					fontSize: 44,
					fontWeight: 600,
					color: '#FFFFFF',
					fontFamily: mograFont,
					padding: `${SPACING.sm + 4}px ${SPACING.xl}px`,
					borderRadius: RADIUS.pill,
					background: `linear-gradient(135deg, ${colors.accent[0]} 0%, ${colors.accent[1]} 100%)`,
					transform: `scale(${btnScale})`,
					boxShadow: btnShadow,
					letterSpacing: 3,
					textShadow: extrudeShadow(5, 44),
					zIndex: 1,
					border: '1.5px solid rgba(255,255,255,0.45)',
				}}
			>
				{cta}
			</div>
			{(gitUrl ?? GIT_URL_DEFAULT) && (
				<div
					style={{
						position: 'absolute',
						top: 40,
						left: '50%',
						transform: 'translateX(-50%)',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						zIndex: 1,
					}}
				>
					<span style={{color: colors.accent[0], fontSize: 36, fontWeight: 800}}>
						{'</>'}
					</span>
					<span
						style={{
							color: '#FFFFFF',
							fontSize: 32,
							fontWeight: 400,
							letterSpacing: '0.1em',
							fontFamily: mograFont,
							textShadow: extrudeShadow(4, 32),
						}}
					>
						{gitUrl ?? GIT_URL_DEFAULT}
					</span>
					<span style={{color: colors.accent[1], fontSize: 36, fontWeight: 800}}>
						{'</>'}
					</span>
				</div>
			)}
		</AbsoluteFill>
	);
};
