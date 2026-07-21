import React from 'react';
import {OffthreadVideo, useCurrentFrame, spring, useVideoConfig, interpolate} from 'remotion';
import {useTheme} from '../theme/ThemeContext';

type Corner =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'
	| 'left'
	| 'right'
	| 'fill';

interface Props {
	src: string;
	position?: Corner;
	// 画中画宽度（px），fill 模式忽略
	width?: number;
	margin?: number;
	rounded?: boolean;
	startFrame?: number;
}

const positionStyle = (
	position: Corner,
	width: number,
	margin: number
): React.CSSProperties => {
	const aspect = 16 / 9;
	const height = width / aspect;
	switch (position) {
		case 'fill':
			return {inset: 0, width: '100%', height: '100%'};
		case 'left':
			return {left: margin, top: '50%', transform: 'translateY(-50%)', width, height};
		case 'right':
			return {right: margin, top: '50%', transform: 'translateY(-50%)', width, height};
		case 'top-left':
			return {top: margin, left: margin, width, height};
		case 'top-right':
			return {top: margin, right: margin, width, height};
		case 'bottom-left':
			return {bottom: margin, left: margin, width, height};
		case 'bottom-right':
		default:
			return {bottom: margin, right: margin, width, height};
	}
};

// AI 口播视频嵌入位：把 mp4 放到画布任意角落或某一侧，支持入场动画。
export const VideoSlot: React.FC<Props> = ({
	src,
	position = 'bottom-right',
	width = 420,
	margin = 60,
	rounded = true,
	startFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {colors, RADIUS} = useTheme();
	const progress = spring({
		fps,
		frame: frame - startFrame,
		config: {damping: 18, stiffness: 120},
	});
	const opacity = interpolate(progress, [0, 1], [0, 1]);
	const scale = interpolate(progress, [0, 1], [0.92, 1]);
	const isFill = position === 'fill';

	const pos = positionStyle(position, width, margin);
	const baseTransform = pos.transform ?? '';

	return (
		<div
			style={{
				position: 'absolute',
				...pos,
				transform: `${baseTransform} scale(${scale})`.trim(),
				opacity,
				borderRadius: isFill ? 0 : rounded ? RADIUS.lg : 0,
				overflow: 'hidden',
				border: isFill ? 'none' : `3px solid ${colors.accent[0]}AA`,
				boxShadow: isFill ? 'none' : '0 12px 40px rgba(0,0,0,0.4)',
			}}
		>
			<OffthreadVideo
				src={src}
				style={{width: '100%', height: '100%', objectFit: 'cover'}}
			/>
		</div>
	);
};
