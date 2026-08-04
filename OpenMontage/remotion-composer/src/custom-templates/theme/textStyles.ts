import {type CSSProperties} from 'react';
import {type TemplateTheme} from './ThemeContext';
import {lighten, withAlpha} from './util';
import {GLOW} from './tokens';

// ───────────────────────────────────────────────────────────────────────────
// 文字角色 SSOT：标题 / 卡片标题 / 正文 / 副文 / 角标 / eyebrow。
// 颜色统一走主题（全白字体系，见 palettes.ts 的 TECH_TEXT），字号/字重/行高
// 在此集中定义。场景一律 spread 这些角色，再按需覆盖局部（如 eyebrow 用 accent）。
// 改这里即可让全部场景的同类文字同步变化。
//
// 辉光 4 级体系（值来自 GLOW.textL1-L4，改 tokens.ts 即可全片同步）：
//   L1 最强 → displayTitle / sceneTitle（accent 双层弥散 + 强暗投影）
//   L2 强   → cardTitle / eyebrow（accent 单层弥散 + 中暗投影）
//   L3 中   → body / bodyMuted（accent 轻弥散 + 弱暗投影）
//   L4 弱   → caption（accent 微辉光 + 极弱暗投影）
// ───────────────────────────────────────────────────────────────────────────

export interface TextStyles {
	/** 片头 / 章节级超大标题。 */
	displayTitle: CSSProperties;
	/** 场景主标题。 */
	sceneTitle: CSSProperties;
	/** 卡片 / 条目标题。 */
	cardTitle: CSSProperties;
	/** 正文（白，主层级）。 */
	body: CSSProperties;
	/** 副文（次层级，淡白）。 */
	bodyMuted: CSSProperties;
	/** 角标 / 说明小字（最弱层级）。 */
	caption: CSSProperties;
	/** eyebrow 小标注（大写、加宽字距）。默认 accent[0]，可覆盖 color。 */
	eyebrow: CSSProperties;
}

/** L1 最强辉光：双层 accent 弥散 + 强暗投影。供标题/金句用。 */
export function glowL1(accent: string): string {
	const g = GLOW.textL1;
	return [
		`0 0 ${g.blur}px ${withAlpha(accent, g.alpha)}`,
		`0 0 ${g.outerBlur}px ${withAlpha(accent, g.outerAlpha)}`,
		`0 ${g.shadowBlur / 3}px ${g.shadowBlur}px rgba(0,0,0,${g.shadowAlpha})`,
	].join(', ');
}

/** L2 强辉光：单层 accent 弥散 + 中暗投影。供卡片标题/eyebrow/章节序号用。 */
export function glowL2(accent: string): string {
	const g = GLOW.textL2;
	return [
		`0 0 ${g.blur}px ${withAlpha(accent, g.alpha)}`,
		`0 2px ${g.shadowBlur}px rgba(0,0,0,${g.shadowAlpha})`,
	].join(', ');
}

/** L3 中辉光：轻 accent 弥散 + 弱暗投影。供正文/副文用。 */
export function glowL3(accent: string): string {
	const g = GLOW.textL3;
	return [
		`0 0 ${g.blur}px ${withAlpha(accent, g.alpha)}`,
		`0 2px ${g.shadowBlur}px rgba(0,0,0,${g.shadowAlpha})`,
	].join(', ');
}

/** L4 弱辉光：微 accent 辉光 + 极弱暗投影。供角标/小字用。 */
export function glowL4(accent: string): string {
	const g = GLOW.textL4;
	return [
		`0 0 ${g.blur}px ${withAlpha(accent, g.alpha)}`,
		`0 1px ${g.shadowBlur}px rgba(0,0,0,${g.shadowAlpha})`,
	].join(', ');
}

/**
 * 3D 挤出阴影（CoverScene 风格）：多层偏移堆叠产生立体厚度，
 * 末层加黑色弥散投影。step 按字号比例计算（fontSize × 1.2%），
 * palette 为挤出渐变色（默认紫色，同 CoverScene）。
 */
export function extrudeShadow(layers: number, fontSize: number, palette?: string[]): string {
	const defaultPalette = ['#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'];
	const colors = palette ?? defaultPalette;
	const step = fontSize * 0.016;
	const shadows: string[] = [];
	for (let i = 0; i < layers; i++) {
		const offset = ((i + 1) * step).toFixed(1);
		const colorIdx = Math.min(Math.floor((i / layers) * colors.length), colors.length - 1);
		shadows.push(`${offset}px ${offset}px 0 ${colors[colorIdx]}`);
	}
	const lastOffset = ((layers + 1) * step).toFixed(1);
	shadows.push(`${lastOffset}px ${lastOffset}px ${(fontSize * 0.4).toFixed(0)}px rgba(0,0,0,0.8)`);
	return shadows.join(', ');
}

export function textStyles(theme: TemplateTheme): TextStyles {
	const {colors, FONT_SIZE} = theme;
	const accent = colors.accent[0];
	return {
		displayTitle: {
			fontSize: FONT_SIZE.display,
			fontWeight: 900,
			color: colors.text.primary,
			lineHeight: 1.2,
			letterSpacing: -1,
			textShadow: glowL1(accent),
		},
		sceneTitle: {
			fontSize: FONT_SIZE.title,
			fontWeight: 900,
			color: colors.text.primary,
			lineHeight: 1.2,
			letterSpacing: -1,
			textShadow: glowL1(accent),
		},
		cardTitle: {
			fontSize: FONT_SIZE.subtitle,
			fontWeight: 800,
			color: colors.text.primary,
			lineHeight: 1.3,
			letterSpacing: -0.5,
			textShadow: glowL2(accent),
		},
		body: {
			fontSize: FONT_SIZE.body,
			color: colors.text.primary,
			lineHeight: 1.6,
			textShadow: glowL3(accent),
		},
		bodyMuted: {
			fontSize: FONT_SIZE.body,
			color: colors.text.secondary,
			lineHeight: 1.6,
			textShadow: glowL3(accent),
		},
		caption: {
			fontSize: FONT_SIZE.caption,
			color: colors.text.muted,
			lineHeight: 1.4,
			textShadow: glowL4(accent),
		},
		eyebrow: {
			fontSize: FONT_SIZE.caption,
			fontWeight: 800,
			letterSpacing: 4,
			textTransform: 'uppercase',
			color: '#FFFFFF',
			textShadow: glowL2(accent),
		},
	};
}
