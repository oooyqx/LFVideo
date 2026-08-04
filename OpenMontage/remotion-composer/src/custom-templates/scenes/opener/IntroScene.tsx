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
import {withAlpha, lighten} from '../../theme/util';
import {glowBlob} from '../../theme/surfaces';
import {textStyles, glowL2, extrudeShadow} from '../../theme/textStyles';
import {HoloTitle} from '../../primitives/HoloTitle';
import {osc01} from '../../animation/presence';
import {ScanlineOverlay} from '../../background/Background';
import {loadFont as loadMogra} from '@remotion/google-fonts/Mogra';

const {fontFamily: mograFont} = loadMogra();

export const introSchema = z.object({
	title: z.string(),
	subtitle: z.string().optional(),
	gitUrl: z.string().optional(),
});
export type IntroProps = z.infer<typeof introSchema>;

const GIT_URL_DEFAULT = 'github.com/ooooyx/LFVideo';

export const IntroScene: React.FC<IntroProps> = ({title, subtitle, gitUrl}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, FONT_SIZE, SPACING} = theme;
	const t = textStyles(theme);

	const enter = spring({fps, frame, config: {damping: 20, stiffness: 90}});
	const opacity = interpolate(enter, [0, 1], [0, 1]);
	const scale = interpolate(enter, [0, 1], [0.94, 1]);

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 15, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp'}
	);

	const subStart = Math.round(durationInFrames * 0.08);
	const subEnd = Math.round(durationInFrames * 0.38);
	const subT = interpolate(frame, [subStart, subEnd], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const subEase = 1 - Math.pow(1 - subT, 3);
	const subOpacity = subEase;
	const subTranslateY = (1 - subEase) * 20;

	const breath = osc01(frame, fps, 5);

	return (
		<AbsoluteFill
			style={{
				fontFamily: fonts.family,
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				opacity: opacity * fadeOut,
				transform: `scale(${scale})`,
			}}
		>
			<div style={glowBlob(colors.accent[0], {width: 1200, height: 500, intensity: 0.12 + breath * 0.06, blur: 120})} />
			<ScanlineOverlay color={colors.accent[0]} />

			<div style={{zIndex: 1, padding: `0 ${SPACING.gutter}px`, width: '100%', maxWidth: 1700, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<HoloTitle
					title={title}
					align="center"
					size="display"
					maxWidth={1600}
					underlineWidth={280}
					underlineOffset={30}
					fontFamily={mograFont}
					textShadow={extrudeShadow(8, FONT_SIZE.display)}
				/>
			</div>
			{subtitle && (
				<div
					style={{
						...t.bodyMuted,
						fontSize: 44,
						fontWeight: 600,
						color: '#FFFFFF',
						letterSpacing: 3,
						textTransform: 'uppercase',
						opacity: subOpacity,
						transform: `translateY(${subTranslateY}px)`,
						marginTop: SPACING.xl + 50,
						textShadow: extrudeShadow(5, 44),
						zIndex: 1,
						padding: `0 ${SPACING.gutter}px`,
					}}
				>
					{subtitle}
				</div>
			)}
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
						opacity: subOpacity,
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
