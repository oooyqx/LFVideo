import React from 'react';
import {
	AbsoluteFill,
	Video,
	OffthreadVideo,
	Sequence,
	getRemotionEnvironment,
	interpolate,
	random,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import manifest from '../../../public/video-background/manifest.json';

// 背景层的「视频随机轮播」模式。
//
// 设计要点：
//  - 亮度叠加：用 CSS `mix-blend-mode: screen` 让亮处自然叠加到下层，
//    暗处自动透明，配合 `brightness` + `contrast` 增强对比度。
//  - 随机轮播：用 Remotion 的确定性随机 `random()` 打乱顺序，导出可复现。
//  - 交叉淡入淡出：双槽位系统，切换视频时上一段淡出、下一段同时淡入。
//  - 帧驱动：所有时间都来自 `useCurrentFrame()`，无 rAF / CSS keyframes。
//
// 视频清单来自 `public/video-background/manifest.json`（由
// `scripts/gen_video_bg_manifest.py` 扫描目录生成）。

export interface VideoCarouselProps {
	/** 视频文件名列表（相对 public/video-background/）。默认读 manifest.json。 */
	videos?: string[];
	/** 每段视频停留时长（秒，含淡入淡出）。 */
	clipDurationSec?: number;
	/** 交叉淡入淡出时长（秒）。 */
	fadeSec?: number;
	/** CSS brightness 滤镜值（1 = 原始亮度）。 */
	brightness?: number;
	/** CSS contrast 滤镜值（1 = 原始对比度）。 */
	contrast?: number;
	/** 随机种子（换一个可得到不同的轮播顺序，仍然确定性）。 */
	seed?: string;
	/** 视频铺满方式。 */
	objectFit?: 'cover' | 'contain';
}

const MANIFEST_VIDEOS: string[] = (manifest as {videos?: string[]}).videos ?? [];

// 确定性 Fisher–Yates（用 remotion 的可复现随机源播种）。
function shuffle(arr: string[], seed: string): string[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(random(`${seed}-${i}`) * (i + 1));
		const tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a;
}

const Clip: React.FC<{
	src: string;
	opacity: number;
	brightness: number;
	contrast: number;
	objectFit: 'cover' | 'contain';
}> = ({src, opacity, brightness, contrast, objectFit}) => {
	// 双引擎：预览用 Video（实时流畅），渲染用 OffthreadVideo（逐帧精确、不跳帧）。
	const VideoComp = getRemotionEnvironment().isRendering ? OffthreadVideo : Video;
	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'screen'}}>
			<VideoComp
				src={src}
				muted
				onError={() => {}}
				delayRenderTimeoutInMilliseconds={60000}
				delayRenderRetries={3}
				style={{
					width: '100%',
					height: '100%',
					objectFit,
					filter: `brightness(${brightness}) contrast(${contrast})`,
				}}
			/>
		</AbsoluteFill>
	);
};

export const VideoCarousel: React.FC<VideoCarouselProps> = ({
	videos,
	clipDurationSec = 6,
	fadeSec = 1,
	brightness = 1.5,
	contrast = 1.3,
	seed = 'video-bg',
	objectFit = 'cover',
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const list = videos ?? MANIFEST_VIDEOS;
	if (list.length === 0) {
		return null;
	}

	const order = shuffle(list, seed);
	const n = order.length;
	const clipF = Math.max(1, Math.round(clipDurationSec * fps));
	const fadeF = Math.max(1, Math.min(Math.round(fadeSec * fps), Math.floor(clipF / 2)));
	const srcOf = (j: number) => staticFile(`video-background/${order[((j % n) + n) % n]}`);

	const totalClips = Math.ceil(durationInFrames / clipF) + 2;

	const renderSlotClip = (j: number): React.ReactNode => {
		const seqFrom = j * clipF;
		const seqDuration = clipF + fadeF;
		const localFrame = frame - seqFrom;
		if (localFrame < 0 || localFrame >= seqDuration) return null;

		let opacity: number;
		if (j === 0) {
			opacity = localFrame >= clipF
				? interpolate(localFrame, [clipF, clipF + fadeF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
				: 1;
		} else if (localFrame < fadeF) {
			opacity = interpolate(localFrame, [0, fadeF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		} else if (localFrame < clipF) {
			opacity = 1;
		} else {
			opacity = interpolate(localFrame, [clipF, clipF + fadeF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
		}

		if (opacity <= 0) return null;

		return (
			<Sequence key={j} from={seqFrom} durationInFrames={seqDuration} layout="none">
				<Clip src={srcOf(j)} opacity={opacity} brightness={brightness} contrast={contrast} objectFit={objectFit} />
			</Sequence>
		);
	};

	const evenClips: number[] = [];
	const oddClips: number[] = [];
	for (let j = 0; j < totalClips; j++) {
		if (j % 2 === 0) evenClips.push(j);
		else oddClips.push(j);
	}

	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{evenClips.map(renderSlotClip)}
			{oddClips.map(renderSlotClip)}
		</AbsoluteFill>
	);
};
