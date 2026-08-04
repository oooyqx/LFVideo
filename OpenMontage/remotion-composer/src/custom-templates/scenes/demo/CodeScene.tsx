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
import {glowL2, glowL3, glowL4} from '../../theme/textStyles';

// 模板库版「合成终端 / 代码」场景：主题驱动配色、等宽字体、全透明外底。
// 取代旧 components/TerminalScene 的硬编码风格。step 协议保持兼容：
//   cmd  逐字打字（带提示符）   out  整行渐显
//   pause 静默停留             pill 右上角浮标
export const codeStepSchema = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('cmd'),
		text: z.string(),
		typeSpeed: z.number().optional(),
		holdSeconds: z.number().optional(),
	}),
	z.object({
		kind: z.literal('out'),
		text: z.string(),
		holdSeconds: z.number().optional(),
	}),
	z.object({kind: z.literal('pause'), seconds: z.number()}),
	z.object({
		kind: z.literal('pill'),
		text: z.string(),
		color: z.string().optional(),
		durationSeconds: z.number().optional(),
	}),
]);
export type CodeStep = z.infer<typeof codeStepSchema>;

export const codeSchema = z.object({
	terminalTitle: z.string().optional(),
	prompt: z.string().optional(),
	steps: z.array(codeStepSchema),
});
export type CodeProps = z.infer<typeof codeSchema>;

interface RenderedLine {
	text: string;
	isCmd: boolean;
	startFrame: number;
	endFrame: number;
}

interface RenderedPill {
	text: string;
	color: string;
	startFrame: number;
	endFrame: number;
}

export const CodeScene: React.FC<CodeProps> = ({
	terminalTitle = 'Terminal',
	steps,
	prompt = '$',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {colors, fonts, RADIUS} = useTheme();

	const accent = colors.accent[2] ?? colors.accent[0];

	const lines: RenderedLine[] = [];
	const pills: RenderedPill[] = [];
	let cursorFrame = 0;

	for (const step of steps) {
		if (step.kind === 'cmd') {
			const speed = step.typeSpeed ?? 0.035;
			const typeFrames = Math.ceil(step.text.length * speed * fps);
			const hold = Math.ceil((step.holdSeconds ?? 0.3) * fps);
			lines.push({text: step.text, isCmd: true, startFrame: cursorFrame, endFrame: cursorFrame + typeFrames});
			cursorFrame += typeFrames + hold;
		} else if (step.kind === 'out') {
			const revealFrames = Math.max(2, Math.ceil(0.08 * fps));
			const hold = Math.ceil((step.holdSeconds ?? 0.15) * fps);
			lines.push({text: step.text, isCmd: false, startFrame: cursorFrame, endFrame: cursorFrame + revealFrames});
			cursorFrame += revealFrames + hold;
		} else if (step.kind === 'pause') {
			cursorFrame += Math.ceil(step.seconds * fps);
		} else {
			const dur = Math.ceil((step.durationSeconds ?? 2.2) * fps);
			pills.push({text: step.text, color: step.color ?? accent, startFrame: cursorFrame, endFrame: cursorFrame + dur});
		}
	}

	const visibleLines = lines.filter((l) => frame >= l.startFrame);
	const MAX_VISIBLE = 18;
	const scrollStart = Math.max(0, visibleLines.length - MAX_VISIBLE);
	const renderedLines = visibleLines.slice(scrollStart);

	const blinkPhase = Math.floor(frame / (fps * 0.55)) % 2 === 0;
	const windowOpacity = spring({frame, fps, config: {damping: 25, stiffness: 100}});

	const titleBarBg = withAlpha(colors.bg.from, 0.9);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: '80px',
				fontFamily: fonts.mono,
			}}
		>
			<div
				style={{
					width: '85%',
					maxWidth: 1600,
					height: '80%',
					opacity: windowOpacity,
					transform: `scale(${interpolate(windowOpacity, [0, 1], [0.97, 1])})`,
					borderRadius: RADIUS.lg,
					overflow: 'hidden',
					boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2) inset, 0 0 32px -8px ${withAlpha(accent, 0.4)}`,
					background: colors.codeBg,
					border: `1.5px solid ${withAlpha(accent, 0.3)}`,
					position: 'relative',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						padding: '14px 18px',
						background: titleBarBg,
						borderBottom: `1px solid ${colors.line}`,
					}}
				>
					<div style={{width: 12, height: 12, borderRadius: '50%', background: '#FF5F56'}} />
					<div style={{width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E'}} />
					<div style={{width: 12, height: 12, borderRadius: '50%', background: '#27C93F'}} />
					<div
						style={{
							flex: 1,
							textAlign: 'center',
							color: colors.text.muted,
							fontSize: 16,
							fontFamily: fonts.family,
						}}
					>
						{terminalTitle}
					</div>
				</div>

				<div
					style={{
						padding: '32px 40px',
						fontSize: 26,
						lineHeight: 1.55,
						color: colors.text.primary,
						height: 'calc(100% - 46px)',
						overflow: 'hidden',
					}}
				>
					{renderedLines.map((line, idx) => {
						if (line.isCmd) {
							const progress = interpolate(
								frame,
								[line.startFrame, line.endFrame],
								[0, line.text.length],
								{extrapolateRight: 'clamp'}
							);
							const typed = line.text.slice(0, Math.floor(progress));
							const isLatest = idx === renderedLines.length - 1;
							const isActive = frame <= line.endFrame + fps * 0.2;
							return (
								<div key={`${line.startFrame}-${idx}`} style={{display: 'flex', alignItems: 'baseline'}}>
									<span style={{color: accent, marginRight: 12, fontWeight: 600, textShadow: glowL2(accent)}}>{prompt}</span>
									<span style={{color: colors.text.primary, textShadow: glowL3(accent)}}>{typed}</span>
									{isLatest && isActive && blinkPhase && (
										<span
											style={{
												display: 'inline-block',
												width: 12,
												height: 26,
												background: colors.text.primary,
												marginLeft: 2,
												transform: 'translateY(4px)',
											}}
										/>
									)}
								</div>
							);
						}
						const alpha = interpolate(
							frame,
							[line.startFrame, line.endFrame],
							[0, 1],
							{extrapolateRight: 'clamp'}
						);
						return (
							<div
								key={`${line.startFrame}-${idx}`}
								style={{color: colors.text.secondary, opacity: alpha, paddingLeft: 4, whiteSpace: 'pre-wrap', textShadow: glowL4(accent)}}
							>
								{line.text}
							</div>
						);
					})}
				</div>

				{pills
					.filter((p) => frame >= p.startFrame && frame <= p.endFrame)
					.map((pill, idx) => {
						const lifeProgress = (frame - pill.startFrame) / Math.max(1, pill.endFrame - pill.startFrame);
						const inAlpha = spring({
							frame: frame - pill.startFrame,
							fps,
							config: {damping: 14, stiffness: 180},
							durationInFrames: Math.ceil(fps * 0.35),
						});
						const outAlpha =
							lifeProgress > 0.82
								? interpolate(lifeProgress, [0.82, 1], [1, 0], {extrapolateRight: 'clamp'})
								: 1;
						const alpha = Math.min(inAlpha, outAlpha);
						const translateY = interpolate(inAlpha, [0, 1], [14, 0]);
						return (
							<div
								key={`${pill.startFrame}-${idx}`}
								style={{
									position: 'absolute',
									top: 28 + idx * 62,
									right: 32,
									padding: '12px 20px',
									background: pill.color,
									color: colors.codeBg,
									borderRadius: RADIUS.pill,
									fontFamily: fonts.family,
									fontWeight: 700,
									fontSize: 20,
									letterSpacing: 0.2,
									opacity: alpha,
									transform: `translateY(${translateY}px)`,
									boxShadow: `0 10px 30px ${pill.color}40`,
								}}
							>
								{pill.text}
							</div>
						);
					})}
			</div>
		</AbsoluteFill>
	);
};
