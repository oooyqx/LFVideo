import React from 'react';

// ---- Math helpers (ported from theme-glitch showcaseKit) ----
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number): number => t * t * t;

/** Deterministic PRNG ∈ [0,1) */
export const rand = (seed: number): number => {
	const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return s - Math.floor(s);
};

/** Two-dimensional seeded random */
export const rand2 = (a: number, b: number): number => rand(a * 73.13 + b * 19.97);

/** 1D smooth noise ∈ [-1,1] */
export const noise1 = (x: number): number => {
	const i = Math.floor(x);
	const f = x - i;
	const u = f * f * (3 - 2 * f);
	const a = rand(i) * 2 - 1;
	const b = rand(i + 1) * 2 - 1;
	return a + (b - a) * u;
};

// ---- 平衡换行：用 canvas 精确测量，做「两行宽度尽量接近、上行稍宽」的换行 ----
export function computeBalancedLines(
	text: string,
	cssFont: string,
	maxWidth: number,
): string[] {
	if (typeof document === 'undefined') return [text];
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return [text];
	ctx.font = cssFont;
	const measure = (s: string) => ctx.measureText(s).width;

	if (measure(text) <= maxWidth) return [text];

	let best: {i: number; score: number} | null = null;
	for (let i = 1; i < text.length; i++) {
		const wTop = measure(text.slice(0, i));
		const wBottom = measure(text.slice(i));
		if (wTop > maxWidth || wBottom > maxWidth) continue;
		const diff = wTop - wBottom;
		// 上行稍宽(diff>=0)优先；下行更宽时重罚，避免「头轻脚重」。
		const score = diff >= 0 ? diff : -diff * 3;
		if (best === null || score < best.score) best = {i, score};
	}
	if (!best) {
		const mid = Math.ceil(text.length / 2);
		return [text.slice(0, mid), text.slice(mid)];
	}
	return [text.slice(0, best.i), text.slice(best.i)];
}

// ---- Scramble/Decode component (effect #72) ----
const GLYPHS = 'アカサタナ01XΞΨ#%&@王金木水火土π∑∆◇▦';

export const randGlyph = (seed: number): string =>
	GLYPHS[Math.floor(rand2(Math.floor(seed), 7.3) * GLYPHS.length)] ?? '#';

export const Scramble: React.FC<{
	text: string;
	progress: number; // 0→1 decode progress
	frame: number;
	seed: number;
	scrambleColor?: string;
}> = ({text, progress, frame, seed, scrambleColor = '#ff4d6d'}) => {
	const chars = Array.from(text);
	const N = chars.length;
	return (
		<>
			{chars.map((ch, i) => {
				const lock = (i / Math.max(N, 1)) * 0.85;
				const locked = progress > lock + 0.12;
				return (
					<span key={i} style={{color: locked ? 'inherit' : scrambleColor}}>
						{locked ? ch : randGlyph(frame * 0.5 + i * 31 + seed)}
					</span>
				);
			})}
		</>
	);
};

// ---- RGB Tear / Chromatic Aberration (effect #95) ----
// Renders text with red/cyan textShadow offset + horizontal jitter that
// decreases as entrance progresses.  Use `progress` 0→1 for entrance,
// 1→0 for exit.
export const RGBTearText: React.FC<{
	text: string;
	progress: number;
	frame: number;
	seed?: number;
	style?: React.CSSProperties;
}> = ({text, progress, frame, seed = 1, style}) => {
	const p = clamp01(progress);
	const o = (1 - p) * 18 + (rand2(Math.floor(frame / 2), seed) - 0.5) * (1 - p) * 30;
	const sx = (rand2(Math.floor(frame / 3), seed + 1) - 0.5) * (1 - p) * 30;
	return (
		<span
			style={{
				display: 'inline-block',
				whiteSpace: 'pre-wrap',
				opacity: Math.min(1, p * 3),
				transform: `translateX(${sx}px)`,
				textShadow: `${o}px 0 #ff003c, ${-o}px 0 #00f0ff`,
				...style,
			}}
		>
			{text}
		</span>
	);
};

// ---- PerChar component for per-character animation ----
export const PerChar: React.FC<{
	text: string;
	charStyle: (i: number, N: number) => React.CSSProperties;
}> = ({text, charStyle}) => {
	const chars = Array.from(text);
	const N = chars.length;
	return (
		<>
			{chars.map((ch, i) => (
				<span key={i} style={{display: 'inline-block', whiteSpace: 'pre'}}>
					<span style={{display: 'inline-block', ...charStyle(i, N)}}>
						{ch === ' ' ? '\u00A0' : ch}
					</span>
				</span>
			))}
		</>
	);
};
