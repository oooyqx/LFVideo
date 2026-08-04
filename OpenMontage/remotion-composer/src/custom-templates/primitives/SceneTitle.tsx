import React from 'react';
import {useTheme} from '../theme/ThemeContext';
import {HoloTitle} from './HoloTitle';

interface Props {
	title: string;
	eyebrow?: string; // 上方小标注
	startFrame?: number;
	/** 标题最大宽度（px）。超出则平衡换成两行（上行稍宽）。 */
	maxWidth?: number;
}

/**
 * 屏幕左上角的「章节标题」层 —— 仅负责定位，视觉与动效全部委托给共享的
 * `HoloTitle`（解码入场 + 统一字体 + accent 发光下划线 + 投影出场）。
 * 在最终效果里由 Explainer 放在透视矩阵之外，因此不随场景变换。
 */
export const SceneTitle: React.FC<Props> = ({
	title,
	eyebrow,
	startFrame = 0,
	maxWidth = 1600,
}) => {
	const {SPACING} = useTheme();
	return (
		<div
			style={{
				position: 'absolute',
				top: SPACING.lg,
				left: SPACING.xl,
				maxWidth,
				pointerEvents: 'none',
			}}
		>
			<HoloTitle
				title={title}
				eyebrow={eyebrow}
				align="left"
				size="title"
				startFrame={startFrame}
				maxWidth={maxWidth}
				underlineWidth={120}
			/>
		</div>
	);
};
