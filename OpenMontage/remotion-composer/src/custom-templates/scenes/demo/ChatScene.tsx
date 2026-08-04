import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {z} from 'zod';
import {useTheme} from '../../theme/ThemeContext';
import {textStyles} from '../../theme/textStyles';
import {withAlpha, lighten} from '../../theme/util';
import {Animated} from '../../animation';
import {proportionalTiming} from '../../animation/presence';
import {TRANSITION_IDS} from '../../animation/types';

export const chatMessageSchema = z.object({
	role: z.enum(['user', 'assistant']),
	text: z.string(),
	code: z.string().optional(),
	atSec: z.number().optional(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatSchema = z.object({
	title: z.string().optional(),
	messages: z.array(chatMessageSchema),
	enter: z.enum(TRANSITION_IDS).optional(),
});
export type ChatProps = z.infer<typeof chatSchema>;

export const ChatScene: React.FC<ChatProps> = ({
	title = 'AI Chat',
	messages,
	enter = 'slide-right',
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const theme = useTheme();
	const {colors, fonts, FONT_SIZE, SPACING, RADIUS} = theme;
	const t = textStyles(theme);

	const accent = colors.accent[0];
	const userAccent = colors.accent[2] ?? colors.accent[1] ?? accent;

	const auto = proportionalTiming(durationInFrames, messages.length);
	const startFrame = auto.start;
	const stagger = auto.stagger;

	const windowOpacity = spring({frame, fps, config: {damping: 25, stiffness: 100}});
	const titleBarBg = withAlpha(colors.bg.from, 0.9);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: '80px',
				fontFamily: fonts.family,
			}}
		>
			<div
				style={{
					width: '82%',
					maxWidth: 1500,
					maxHeight: '82%',
					opacity: windowOpacity,
					transform: `scale(${interpolate(windowOpacity, [0, 1], [0.97, 1])})`,
					borderRadius: RADIUS.lg,
					overflow: 'hidden',
					boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2) inset, 0 0 32px -8px ${withAlpha(accent, 0.4)}`,
					background: withAlpha(colors.bg.to, 0.5),
					border: `1.5px solid ${withAlpha(accent, 0.3)}`,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* Title bar */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						padding: '14px 18px',
						background: titleBarBg,
						borderBottom: `1px solid ${colors.line}`,
						flexShrink: 0,
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
						{title}
					</div>
				</div>

				{/* Chat messages area */}
				<div
					style={{
						padding: `${SPACING.lg}px ${SPACING.xl}px`,
						display: 'flex',
						flexDirection: 'column',
						gap: SPACING.md,
						overflow: 'hidden',
						flex: 1,
					}}
				>
					{messages.map((msg, i) => {
						const isUser = msg.role === 'user';
						const color = isUser ? userAccent : accent;
						const delay =
							msg.atSec != null
								? Math.max(0, Math.round(msg.atSec * fps))
								: startFrame + i * stagger;

						return (
							<Animated
								key={`msg-${i}`}
								enter={enter}
								delay={delay}
								distance={40}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: isUser ? 'flex-end' : 'flex-start',
									}}
								>
									<div
										style={{
											maxWidth: isUser ? '70%' : '80%',
											display: 'flex',
											flexDirection: 'column',
											gap: SPACING.xs,
										}}
									>
										{!isUser && (
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: SPACING.sm,
												}}
											>
												<div
													style={{
														width: 32,
														height: 32,
														borderRadius: RADIUS.md,
														background: withAlpha(accent, 0.25),
														border: `1.5px solid ${withAlpha(lighten(accent, 0.3), 0.7)}`,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: 18,
														fontWeight: 900,
														color: lighten(accent, 0.2),
													}}
												>
													AI
												</div>
												<span
													style={{
														...t.caption,
														color: lighten(accent, 0.15),
														fontWeight: 700,
													}}
												>
													Assistant
												</span>
											</div>
										)}
										<div
											style={{
												background: withAlpha(colors.bg.to, isUser ? 0.3 : 0.4),
												border: `1.5px solid ${withAlpha(color, 0.25)}`,
												borderRadius: `${RADIUS.lg}px ${
													isUser ? `${RADIUS.sm}px` : `${RADIUS.lg}px`
												} ${RADIUS.lg}px ${
													isUser ? `${RADIUS.lg}px` : `${RADIUS.sm}px`
												}`,
												backdropFilter: 'blur(10px)',
												WebkitBackdropFilter: 'blur(10px)',
												padding: `${SPACING.md}px ${SPACING.lg}px`,
												boxShadow: `0 8px 24px -8px rgba(0,0,0,0.4)`,
											}}
										>
											<div
												style={{
													...t.body,
													fontSize: FONT_SIZE.body,
													lineHeight: 1.6,
													color: colors.text.primary,
													whiteSpace: 'pre-wrap',
												}}
											>
												{msg.text}
											</div>
											{msg.code && (
												<div
													style={{
														marginTop: SPACING.sm,
														padding: `${SPACING.sm}px ${SPACING.md}px`,
														background: withAlpha(colors.bg.from, 0.6),
														borderRadius: RADIUS.md,
														border: `1px solid ${withAlpha(color, 0.2)}`,
														fontFamily: fonts.mono,
														fontSize: FONT_SIZE.caption,
														color: colors.text.secondary,
														whiteSpace: 'pre-wrap',
														lineHeight: 1.5,
													}}
												>
													{msg.code}
												</div>
											)}
										</div>
										{isUser && (
											<div
												style={{
													textAlign: 'right',
													...t.caption,
													color: colors.text.muted,
													paddingRight: SPACING.xs,
												}}
											>
												You
											</div>
										)}
									</div>
								</div>
							</Animated>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
