import React from 'react';
import {
	AbsoluteFill,
	Img,
	OffthreadVideo,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {Palette} from '../theme/palettes';
import {withAlpha} from '../theme/util';
import {VideoCarousel} from './VideoCarousel';

// 背景层的独立配色（全息蓝）。背景已是独立图层，颜色不再跟随场景主题，
// 而由这里统一驱动，便于后续叠加前端背景特效塑造「全息投影」观感。
// 第一版只调大致色相：深蓝→亮蓝渐变 + 青蓝辉光 + 偏亮的网格线。
export const HOLOGRAPHIC: Palette = {
	bg: {from: '#041B3D', to: '#0B5BAA'},
	text: {primary: '#EAF6FF', secondary: '#A9CCEA', muted: '#6F92B5'},
	accent: ['#36D0FF', '#5FE6FF', '#2A8CF0', '#9CEFFF'],
	line: 'rgba(120,205,255,0.18)',
	surface: 'rgba(120,205,255,0.06)',
	codeBg: '#041222',
};

// 单一独立背景层。模板场景一律全透明，背景全部由这里统一渲染：
//   gradient / grid / particles —— 主题色驱动的程序化背景
//   video                       —— 随机轮播背景视频（灰度→透明 + 交叉淡入淡出），叠在 mesh 渐变上
//   transparent                —— 不画任何底（让下层数字人/房间透出）
// 另：image/video props（单张图/单个视频底，带可调暗化遮罩）优先级高于 variant。
export type BackgroundVariant =
	| 'gradient'
	| 'grid'
	| 'particles'
	| 'video'
	| 'transparent';

export interface BackgroundProps {
	variant?: BackgroundVariant;
	/** 已解析为可用 URL 的图片地址。优先级高于 variant。 */
	image?: string;
	/** 已解析为可用 URL 的视频地址。优先级最高。 */
	video?: string;
	videoStartFrom?: number;
	/** 图片/视频上的暗化遮罩透明度（0-1）。 */
	overlayOpacity?: number;
}

const MeshGradientBg: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const x1 = Math.sin(frame * 0.004) * 150 + 200;
	const y1 = Math.cos(frame * 0.005) * 150 + 300;
	const x2 = Math.cos(frame * 0.003) * 150 + 1500;
	const y2 = Math.sin(frame * 0.004) * 150 + 800;
	const x3 = Math.sin(frame * 0.003) * 200 + 960;
	const y3 = Math.cos(frame * 0.006) * 150 + 540;

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(135deg, ${colors.bg.from} 0%, ${colors.bg.to} 100%)`,
				overflow: 'hidden',
			}}
		>
			<div style={blob(x1, y1, 800, `${colors.accent[0]}22`, 100, drift(frame, fps, 25, false))} />
			<div style={blob(x2, y2, 800, `${colors.accent[1]}18`, 120, drift(frame, fps, 30, true))} />
			<div style={blob(x3, y3, 1000, `${colors.accent[2] ?? colors.accent[0]}12`, 140, drift(frame, fps, 35, false))} />
		</AbsoluteFill>
	);
};

// frame 驱动的缓慢漂移（取代 CSS `@keyframes bg-drift-slow ... infinite`，
// 后者在 Remotion 逐帧渲染下不会推进）。scale/位移用半余弦在 0↔1 往返，旋转线性累加。
function drift(frame: number, fps: number, durSec: number, reverse: boolean): string {
	const dir = reverse ? -1 : 1;
	const cycle = (frame / fps / durSec) * dir;
	const w = (1 - Math.cos(cycle * Math.PI * 2)) / 2; // 0→1→0
	const scale = 1 + 0.1 * w;
	const tx = 40 * w;
	const ty = -60 * w;
	const rot = cycle * 360;
	return `scale(${scale}) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
}

function blob(
	cx: number,
	cy: number,
	size: number,
	color: string,
	blur: number,
	transform: string
): React.CSSProperties {
	return {
		position: 'absolute',
		left: cx - size / 2,
		top: cy - size / 2,
		width: size,
		height: size,
		borderRadius: '50%',
		background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
		filter: `blur(${blur}px)`,
		transform,
	};
}

const GridBg: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const gridOffset = (frame * 0.4) % 60;
	const sweepX = interpolate(frame % 300, [0, 300], [-300, 2220]);
	const {r, g, b} = hexToRgb(colors.accent[0]);

	return (
		<AbsoluteFill>
			<MeshGradientBg colors={colors} />
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
					backgroundSize: '60px 60px',
					backgroundPosition: `${gridOffset}px ${gridOffset}px`,
					opacity: 0.8,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: sweepX,
					top: 0,
					width: '150px',
					height: '100%',
					background: `linear-gradient(90deg, transparent, rgba(${r}, ${g}, ${b}, 0.08), transparent)`,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

// 视频底：mesh 渐变打底，叠上随机轮播的背景视频（灰度→透明）。
// 视频清单为空时退化成纯 mesh 渐变底。
const VideoBg: React.FC<{colors: Palette}> = ({colors}) => (
	<AbsoluteFill style={{overflow: 'hidden'}}>
		<AbsoluteFill style={{opacity: 0.01}}>
			<MeshGradientBg colors={colors} />
		</AbsoluteFill>
		<VideoCarousel />
	</AbsoluteFill>
);

const PARTICLE_DEFS = Array.from({length: 32}, (_, i) => ({
	x: (i * 137.5) % 100,
	y: (i * 73.3) % 100,
	size: 4 + (i % 3) * 2,
	speed: 0.2 + (i % 4) * 0.1,
	driftRadius: 5 + (i % 5) * 2,
	driftSpeed: 0.01 + (i % 3) * 0.005,
	accentIndex: i,
}));

const ParticlesBg: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(135deg, ${colors.bg.from} 0%, ${colors.bg.to} 100%)`,
				overflow: 'hidden',
			}}
		>
			{PARTICLE_DEFS.map((p, i) => {
				const time = frame * p.driftSpeed;
				const curX = p.x + Math.sin(time) * p.driftRadius * 0.15;
				const curY = (p.y - frame * p.speed * 0.03 + 100) % 100;
				const color = colors.accent[p.accentIndex % colors.accent.length];
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: `${curX}%`,
							top: `${curY}%`,
							width: p.size,
							height: p.size,
							borderRadius: '50%',
							backgroundColor: color,
							opacity: 0.5,
							boxShadow: `0 0 ${p.size * 3}px ${color}, 0 0 ${p.size * 6}px ${color}aa`,
							transform: 'translate(-50%, -50%)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

const MediaBg: React.FC<{
	image?: string;
	video?: string;
	videoStartFrom?: number;
	overlayOpacity: number;
}> = ({image, video, videoStartFrom = 0, overlayOpacity}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scale = 1 + progress * 0.08;

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{video ? (
				<OffthreadVideo
					src={video}
					startFrom={Math.round(videoStartFrom * fps)}
					style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1}}
					muted
					onError={() => {}}
				/>
			) : image ? (
				<Img
					src={image}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${scale})`,
						willChange: 'transform',
						opacity: 0.1,
					}}
				/>
			) : null}
			{/* <AbsoluteFill style={{background: `rgba(8, 6, 12, ${overlayOpacity})`}} /> */}
		</AbsoluteFill>
	);
};

export const Background: React.FC<BackgroundProps> = ({
	variant = 'gradient',
	image,
	video,
	videoStartFrom,
	overlayOpacity = 0.15,
}) => {
	const colors = HOLOGRAPHIC;

	if (video || image) {
		return (
			<MediaBg
				image={image}
				video={video}
				videoStartFrom={videoStartFrom}
				overlayOpacity={overlayOpacity}
			/>
		);
	}
	if (variant === 'transparent') {
		return null;
	}
	if (variant === 'grid') {
		return <GridBg colors={colors} />;
	}
	if (variant === 'particles') {
		return (
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<ParticlesBg colors={colors} />
			</AbsoluteFill>
		);
	}
	if (variant === 'video') {
		return <VideoBg colors={colors} />;
	}
	// 默认 gradient：mesh 渐变底。
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<MeshGradientBg colors={colors} />
		</AbsoluteFill>
	);
};

function hexToRgb(hex: string): {r: number; g: number; b: number} {
	const clean = hex.replace('#', '');
	const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
	const bigint = parseInt(full, 16);
	return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
}

// ───────────────────────────────────────────────────────────────────────────
// 可复用叠加层：扫描线 / 全息蓝色罩 / 色调 grade。
// 从 IntroScene / OutroScene / QuoteScene / CoverScene / Explainer 中提取的
// 通用视觉层，统一放此处供所有场景复用。
// ───────────────────────────────────────────────────────────────────────────

export const ScanlineOverlay: React.FC<{
	color: string;
}> = ({color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scanShift = (frame / fps / 6) % 1;
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				zIndex: 0,
				pointerEvents: 'none',
				backgroundImage: `repeating-linear-gradient(0deg, ${withAlpha(
					color,
					0.05
				)} 0px, ${withAlpha(color, 0.05)} 1px, transparent 1px, transparent 4px)`,
				backgroundPositionY: `${scanShift * 4}px`,
				maskImage:
					'radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%)',
				WebkitMaskImage:
					'radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%)',
			}}
		/>
	);
};

export const HolographicWash: React.FC<{
	zIndex?: number;
	/** 强度倍率（0-1），用于在不改动其他调用处的前提下单独调浅这层蓝色洗染。 */
	intensity?: number;
}> = ({zIndex = 1, intensity = 1}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(ellipse 95% 85% at 50% 42%, rgba(70,170,240,${0.40 * intensity}) 0%, rgba(20,90,180,${0.34 * intensity}) 55%, rgba(8,30,72,${0.40 * intensity}) 100%)`,
			mixBlendMode: 'screen',
			zIndex,
			pointerEvents: 'none',
		}}
	/>
);

export const GradeLayers: React.FC<{
	baseZIndex?: number;
}> = ({baseZIndex = 3}) => (
	<>
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				zIndex: baseZIndex,
				background:
					'linear-gradient(180deg, rgba(255,180,120,0.06) 0%, rgba(150,90,170,0.07) 100%)',
				mixBlendMode: 'soft-light',
			}}
		/>
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				zIndex: baseZIndex + 1,
				background:
					'radial-gradient(ellipse 78% 72% at 50% 42%, transparent 55%, rgba(15,8,18,0.5) 100%)',
			}}
		/>
	</>
);
