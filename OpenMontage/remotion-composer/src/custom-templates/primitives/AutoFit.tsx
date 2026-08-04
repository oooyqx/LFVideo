import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {CAPTION_SAFE_ZONE} from '../theme/tokens';

interface Props {
	children: React.ReactNode;
	// 安全边距（基于满帧设计稿）。内容会被缩放到 (宽-2*paddingX, 高-2*paddingY) 内。
	paddingX?: number;
	paddingY?: number;
	// 允许的最大缩放。默认 1（只缩小不放大）。
	// 设为 >1 时启用「内容少则放大撑满」（fit-to-fill），上限即此值。
	maxScale?: number;
	// 内容在垂直方向的对齐方式（内容比安全区矮时）。
	align?: 'center' | 'flex-start' | 'flex-end';
	// 内容宽度策略：
	// 'fill'（默认）= 内容拉满安全区宽（适合整宽堆叠的卡片列，如 Concept）；
	// 'content' = 内容按自身自然宽度排布，再由缩放整体撑满/收缩（适合 Comparison/Table）。
	widthMode?: 'fill' | 'content';
	// 设为 true 时跳过字幕安全区扣除（用于全屏标题卡等不需要避让字幕的场景）。
	fullBleed?: boolean;
}

/**
 * 自适应缩放包裹器：把任意内容测量出自然尺寸后，等比缩放到「满帧安全区」之内，
 * 保证内容数量/文案长度变化时不溢出、不裁切，而不需要逐场景手调间距字号。
 *
 * 用法：把场景根从 <AbsoluteFill> 换成 <AutoFit>，子节点按正常文档流排版
 * （高度 auto），AutoFit 负责居中与按内容高度/宽度整体缩放。
 */
export const AutoFit: React.FC<Props> = ({
	children,
	paddingX = 0,
	paddingY = 0,
	maxScale = 1,
	align = 'center',
	widthMode = 'fill',
	fullBleed = false,
}) => {
	const {width, height} = useVideoConfig();
	const innerRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	const availW = Math.max(1, width - paddingX * 2);
	const availH = Math.max(1, height - paddingY * 2 - (fullBleed ? 0 : CAPTION_SAFE_ZONE));

	useLayoutEffect(() => {
		const inner = innerRef.current;
		if (!inner) return;
		const measure = () => {
			// transform:scale 不影响布局尺寸，offset*/scroll* 始终为缩放前的自然尺寸。
			const cw = Math.max(inner.offsetWidth, inner.scrollWidth);
			const ch = Math.max(inner.offsetHeight, inner.scrollHeight);
			if (!cw || !ch) return;
			const next = Math.min(maxScale, availW / cw, availH / ch);
			setScale(next > 0 && Number.isFinite(next) ? next : maxScale);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(inner);
		return () => ro.disconnect();
	}, [availW, availH, maxScale]);

	return (
		<AbsoluteFill
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				ref={innerRef}
				style={{
					width: widthMode === 'fill' ? availW : 'auto',
					maxWidth: widthMode === 'content' ? availW : undefined,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: align,
					transform: `scale(${scale})`,
					transformOrigin: 'center center',
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
