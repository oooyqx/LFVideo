import React from 'react';
import {
	AbsoluteFill,
	Img,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {useTheme, TemplateThemeProvider, buildTemplateTheme} from '../../theme/ThemeContext';
import {withAlpha} from '../../theme/util';
import {glowBlob, TechPanel} from '../../theme/surfaces';
import {glowL1} from '../../theme/textStyles';
import {osc01} from '../../animation/presence';
import {Background, HolographicWash, GradeLayers, ScanlineOverlay} from '../../background/Background';
import {VRMAvatar} from '../../../components/VRMAvatar';
import {loadFont as loadMogra} from '@remotion/google-fonts/Mogra';

const {fontFamily: mograFont} = loadMogra();
import {quadMatrix3d} from '../../../components/screenWarp';
import {SafeVideoBackground} from '../../../components/SafeVideoBackground';

// ── Schema ──────────────────────────────────────────────────────────────
export const coverSchema = z.object({
	keywords: z.array(
		z.object({
			text: z.string(),
			color: z.string(),
			glow: z.string().optional(),
			outline: z.string().optional(),
			fontSize: z.number().optional(),
		}),
	),
	slogan: z.string().optional(),
	episodeLabel: z.string().optional(),
	unityBackground: z.object({
		enabled: z.boolean().optional(),
		image: z.string().optional(),
		screenQuad: z.object({
			tl: z.tuple([z.number(), z.number()]),
			tr: z.tuple([z.number(), z.number()]),
			br: z.tuple([z.number(), z.number()]),
			bl: z.tuple([z.number(), z.number()]),
		}).optional(),
		screenOpacity: z.number().optional(),
		screenTint: z.string().optional(),
	}).optional(),
	avatar: z
		.object({
			enabled: z.boolean().optional(),
			clipUrl: z.string().optional(),
			clipSpeed: z.number().optional(),
			bgCameraZ: z.number().optional(),
			bgModelX: z.number().optional(),
			bgModelY: z.number().optional(),
			bgModelYawDeg: z.number().optional(),
			bgScale: z.number().optional(),
			bgOffsetXpx: z.number().optional(),
			bgOffsetYpx: z.number().optional(),
			bgOriginXPct: z.number().optional(),
			bgOriginYPct: z.number().optional(),
		})
		.optional(),
});
export type CoverProps = z.infer<typeof coverSchema>;

// ── Component ───────────────────────────────────────────────────────────
// CoverScene: multi-platform cover with video carousel + holographic wash + VRM avatar.

const SLOGAN_ITEMS = ['不吹AI', '真落地', '真开源'];
const GIT_URL = 'github.com/ooooyx/LFVideo';

const CoverSceneInner: React.FC<CoverProps> = ({
	keywords,
	slogan = '不吹AI，真落地，真开源',
	episodeLabel = 'EP02',
	unityBackground,
	avatar,
}) => {
	const {width, height, fps} = useVideoConfig();
	const frame = useCurrentFrame();
	const theme = useTheme();
	const {colors, fonts, GLOW} = theme;
	const isPortrait = height > width;
	const isSquare = Math.abs(width - height) < 10;
	const isLandscape = width >= height;

	const breath = osc01(frame, fps, 5);

	const kwGlow = (kw: {color: string; glow?: string}) =>
		glowL1(kw.glow || kw.color);

	const kw0 = keywords[0];
	const kw1 = keywords[1];
	const kw2 = keywords[2];

	const warp = !!(unityBackground?.enabled && unityBackground.image && unityBackground.screenQuad);
	const screenOpacity = unityBackground?.screenOpacity ?? 0.4;
	const screenTint = unityBackground?.screenTint ?? '#0b2a52';
	const warpTransform = warp ? quadMatrix3d(width, height, unityBackground!.screenQuad!) : '';

	const hostScale = avatar?.bgScale ?? 1;
	const hostOffsetX = avatar?.bgOffsetXpx ?? 0;
	const hostOffsetY = avatar?.bgOffsetYpx ?? 0;
	const hostOriginX = avatar?.bgOriginXPct ?? 70;
	const hostOriginY = avatar?.bgOriginYPct ?? 57;

	return (
		<AbsoluteFill
			style={{
				background: '#000',
				fontFamily: fonts.family,
				overflow: 'hidden',
			}}
		>
			{/* Layer 0: UnityBG room video (base layer for warp) */}
			{warp && unityBackground?.image && (
				<SafeVideoBackground
					src={staticFile(unityBackground.image)}
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			)}

			{/* Layer 0.5: Video background warped into screen quad */}
			{warp ? (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width,
						height,
						transformOrigin: '0 0',
						backfaceVisibility: 'hidden',
						transform: warpTransform,
						overflow: 'hidden',
					}}
				>
					<AbsoluteFill
						style={{
							background: withAlpha(screenTint, 0.1),
							overflow: 'hidden',
						}}
					>
						<AbsoluteFill style={{opacity: 0.1}}>
							<Background variant="video" />
						</AbsoluteFill>
						<HolographicWash intensity={0.1} />
					</AbsoluteFill>
				</div>
			) : (
				<Background variant="video" />
			)}

			{/* Layer 1: Holographic wash (only when not warped) */}
			{!warp && <HolographicWash zIndex={1} />}

			{/* Layer 2: VRM Avatar */}
			{avatar?.enabled && (
				<AbsoluteFill
					style={{
						transformOrigin: `${hostOriginX}% ${hostOriginY}%`,
						transform: `translate(${hostOffsetX}px, ${hostOffsetY}px) scale(${hostScale})`,
						zIndex: 2,
					}}
				>
					<VRMAvatar
						background
						clipUrl={avatar.clipUrl}
						clipSpeed={avatar.clipSpeed}
						bgCameraZ={avatar.bgCameraZ}
						bgModelX={avatar.bgModelX}
						bgModelY={avatar.bgModelY}
						bgModelYawDeg={avatar.bgModelYawDeg}
					/>
				</AbsoluteFill>
			)}

			{/* Layer 3: Color grade */}
			<GradeLayers baseZIndex={3} />

			{/* Layer 4: Scanline overlay */}
			<ScanlineOverlay color={colors.accent[0]} />

			{/* Layer 5: Darkening mask — lighter, only edges */}
			<AbsoluteFill
				style={{
					zIndex: 5,
					background: isPortrait
						? 'linear-gradient(180deg, rgba(2,6,23,0.06) 0%, rgba(2,6,23,0.14) 60%, rgba(2,6,23,0.22) 100%)'
						: 'linear-gradient(135deg, rgba(2,6,23,0.34) 0%, rgba(2,6,23,0.22) 30%, rgba(2,6,23,0.10) 60%, transparent 100%)',
				}}
			/>

			{/* Layer 6: Glow blob behind text */}
			<div
				style={{
					...glowBlob(kw0?.color || colors.accent[0], {
						width: isLandscape ? 800 : 700,
						height: isLandscape ? 600 : 400,
						intensity: 0.16 + breath * 0.06,
						blur: 120,
					}),
					zIndex: 6,
					left: isPortrait ? '50%' : '15%',
					top: isPortrait ? '20%' : '40%',
					transform: isPortrait ? 'translate(-50%, -50%)' : 'translateY(-50%)',
				}}
			/>

			{/* Layer 6b: Vibe Coding — top center, black extrusion */}
			<div
				style={{
					position: 'absolute',
					zIndex: 8,
					top: isPortrait ? '2%' : '3%',
					right: isPortrait ? '50%' : '3%',
					transform: isPortrait ? 'translateX(50%)' : 'none',
				}}
			>
				<span
					style={{
						color: '#FFFFFF',
						fontSize: 120,
						fontWeight: 400,
						letterSpacing: '0.05em',
						fontFamily: mograFont,
						textShadow: [
							'2px 2px 0 #000000',
							'4px 4px 0 #000000',
							'6px 6px 0 #000000',
							'8px 8px 0 #000000',
							'10px 10px 0 #000000',
							'12px 12px 0 #000000',
							'14px 14px 0 #000000',
							'16px 16px 0 #000000',
							'18px 18px 30px rgba(0,0,0,0.8)',
						].join(', '),
						display: 'inline-block',
					}}
				>
					{'Vibe Coding'}
				</span>
			</div>

			{/* Layer 7-9: All three keywords warped together via matrix3d */}
			{warp ? (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width,
						height,
						transformOrigin: '0 0',
						backfaceVisibility: 'hidden',
						transform: warpTransform,
						overflow: 'hidden',
						zIndex: 9,
					}}
				>
					<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', gap: 50}}>
						{/* kw0 — white with purple extrusion */}
						<span
							style={{
								color: '#FFFFFF',
								fontSize: isLandscape ? 200 : isSquare ? 160 : 140,
								fontWeight: 900,
								lineHeight: 0.95,
								letterSpacing: '0.02em',
								textShadow: [
									'2px 2px 0 #A78BFA',
									'4px 4px 0 #8B5CF6',
									'6px 6px 0 #7C3AED',
									'8px 8px 0 #6D28D9',
									'10px 10px 0 #5B21B6',
									'12px 12px 20px rgba(0,0,0,0.6)',
								].join(', '),
								display: 'inline-block',
							}}
						>
							{kw0?.text || '构建'}
						</span>
						{/* kw1 — white with cyan extrusion */}
						<span
							style={{
								color: '#FFFFFF',
								fontSize: isLandscape ? 200 : isSquare ? 160 : 140,
								fontWeight: 900,
								lineHeight: 1.15,
								letterSpacing: '0.04em',
								marginTop: -50,
								textShadow: [
									'2px 2px 0 #22D3EE',
									'4px 4px 0 #06B6D4',
									'6px 6px 0 #0891B2',
									'8px 8px 0 #0E7490',
									'10px 10px 0 #155E75',
									'12px 12px 20px rgba(0,0,0,0.6)',
								].join(', '),
								display: 'inline-block',
							}}
						>
							{kw1?.text || '自动化视频生产线'}
						</span>
						{/* kw2 — white with amber extrusion */}
						<span
							style={{
								color: '#FFFFFF',
								fontSize: isLandscape ? 160 : isSquare ? 128 : 112,
								fontWeight: 900,
								lineHeight: 1.0,
								letterSpacing: '0.08em',
								textShadow: [
									'2px 2px 0 #FBBF24',
									'4px 4px 0 #F59E0B',
									'6px 6px 0 #D97706',
									'8px 8px 0 #B45309',
									'10px 10px 0 #92400E',
									'12px 12px 20px rgba(0,0,0,0.6)',
								].join(', '),
								whiteSpace: 'nowrap',
								opacity: 0.92,
								display: 'flex',
								alignItems: 'center',
								gap: 24,
							}}
						>
							<span style={{display: 'inline-block', width: 120, height: 6, background: '#FBBF24', borderRadius: 3, boxShadow: '0 0 20px #FBBF24, 0 0 40px rgba(251,191,36,0.5)'}} />
							<span>{kw2?.text || '视频渲染篇'}</span>
							<span style={{display: 'inline-block', width: 120, height: 6, background: '#FBBF24', borderRadius: 3, boxShadow: '0 0 20px #FBBF24, 0 0 40px rgba(251,191,36,0.5)'}} />
						</span>
					</AbsoluteFill>
				</div>
			) : (
				/* Fallback when no warp: render all three without matrix3d */
				<AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', gap: 50, zIndex: 9}}>
					<span
						style={{
							color: '#FFFFFF',
							fontSize: isLandscape ? 640 : isSquare ? 512 : 448,
							fontWeight: 900,
							lineHeight: 0.95,
							letterSpacing: '0.02em',
							textShadow: [
								'2px 2px 0 #A78BFA',
								'4px 4px 0 #8B5CF6',
								'6px 6px 0 #7C3AED',
								'8px 8px 0 #6D28D9',
								'10px 10px 0 #5B21B6',
								'12px 12px 20px rgba(0,0,0,0.6)',
							].join(', '),
							display: 'inline-block',
						}}
					>
						{kw0?.text || '构建'}
					</span>
					<span
						style={{
							color: '#FFFFFF',
							fontSize: isLandscape ? 200 : isSquare ? 160 : 140,
							fontWeight: 900,
							lineHeight: 1.15,
							letterSpacing: '0.04em',
							textShadow: [
								'2px 2px 0 #22D3EE',
								'4px 4px 0 #06B6D4',
								'6px 6px 0 #0891B2',
								'8px 8px 0 #0E7490',
								'10px 10px 0 #155E75',
								'12px 12px 20px rgba(0,0,0,0.6)',
							].join(', '),
							display: 'inline-block',
						}}
					>
						{kw1?.text || '自动化视频生产线'}
					</span>
					<span
						style={{
							color: '#FFFFFF',
							fontSize: isLandscape ? 320 : isSquare ? 256 : 224,
							fontWeight: 900,
							lineHeight: 1.0,
							letterSpacing: '0.08em',
							textShadow: [
								'2px 2px 0 #FBBF24',
								'4px 4px 0 #F59E0B',
								'6px 6px 0 #D97706',
								'8px 8px 0 #B45309',
								'10px 10px 0 #92400E',
								'12px 12px 20px rgba(0,0,0,0.6)',
							].join(', '),
							whiteSpace: 'nowrap',
						}}
					>
						{kw2?.text || '视频渲染篇'}
					</span>
				</AbsoluteFill>
			)}

			{/* Layer 10: Slogan — three TechPanel boxes on the right side */}
			{slogan && (
				<div
					style={{
						position: 'absolute',
						zIndex: 10,
						right: isPortrait ? '50%' : 'calc(3% + 250px)',
						top: isPortrait ? '45%' : '50%',
						transform: isPortrait ? 'translateX(50%)' : 'translateY(-50%)',
						display: 'flex',
						flexDirection: 'column',
						gap: 30,
					}}
				>
					{SLOGAN_ITEMS.map((item, i) => (
						<TechPanel
							key={`slogan-${i}`}
							accent={colors.accent[i % 2]}
							glow={breath * 0.5}
							style={{
								padding: '20px 52px',
								fontSize: isLandscape ? 69 : 52,
								fontWeight: 900,
								color: colors.text.primary,
								letterSpacing: '0.15em',
								textShadow: ['2px 2px 0 #000', '4px 4px 0 #000', '6px 6px 0 #000', '8px 8px 12px rgba(0,0,0,0.8)'].join(', '),
								textAlign: 'center',
								minWidth: 260,
							}}
						>
							{item}
						</TechPanel>
					))}
				</div>
			)}

			{/* Layer 11: Episode label — top right */}
			<div
				style={{
					position: 'absolute',
					zIndex: 11,
					top: isPortrait ? '2%' : '3%',
					left: isPortrait ? '5%' : '3%',
					color: '#FFFFFF',
					fontSize: isPortrait ? 28 : 36,
					fontWeight: 400,
					letterSpacing: '0.25em',
					textTransform: 'uppercase',
					fontFamily: mograFont,
					textShadow: [
						'0 0 10px rgba(167,139,250,0.9)',
						'0 0 20px rgba(167,139,250,0.6)',
						'0 0 30px rgba(167,139,250,0.4)',
					].join(', '),
					borderBottom: '4px solid rgba(167,139,250,1)',
					paddingBottom: '4px',
				}}
			>
				{episodeLabel}
			</div>

			{/* Layer 12: Git repo URL — bottom center */}
			<div
				style={{
					position: 'absolute',
					zIndex: 12,
					bottom: isPortrait ? '3%' : '2%',
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					alignItems: 'center',
					gap: 16,
				}}
			>
				<span
					style={{
						color: colors.accent[0],
						fontSize: 60,
						fontWeight: 800,
					}}
				>
					{'</>'}
				</span>
				<span
					style={{
						color: '#FFFFFF',
						fontSize: isLandscape ? 54 : 42,
						fontWeight: 400,
						letterSpacing: '0.1em',
						fontFamily: mograFont,
						textShadow: [
							'2px 2px 0 #000000',
							'4px 4px 0 #000000',
							'6px 6px 0 #000000',
							'8px 8px 0 #000000',
							'10px 10px 0 #000000',
							'12px 12px 20px rgba(0,0,0,0.8)',
						].join(', '),
					}}
				>
					{GIT_URL}
				</span>
				<span
					style={{
						color: colors.accent[1],
						fontSize: 60,
						fontWeight: 800,
						textShadow: ['2px 2px 0 #000', '4px 4px 0 #000', '6px 6px 12px rgba(0,0,0,0.8)'].join(', '),
					}}
				>
					{'</>'}
				</span>
			</div>
		</AbsoluteFill>
	);
};

export const CoverScene: React.FC<CoverProps> = (props) => {
	const theme = buildTemplateTheme('flat-motion-graphics');
	return (
		<TemplateThemeProvider theme={theme}>
			<CoverSceneInner {...props} />
		</TemplateThemeProvider>
	);
};
