import {type CSSProperties} from 'react';
import {type TemplateTheme} from './ThemeContext';
import {lighten} from './util';

// ───────────────────────────────────────────────────────────────────────────
// 文字角色 SSOT：标题 / 卡片标题 / 正文 / 副文 / 角标 / eyebrow。
// 颜色统一走主题（全白字体系，见 palettes.ts 的 TECH_TEXT），字号/字重/行高
// 在此集中定义。场景一律 spread 这些角色，再按需覆盖局部（如 eyebrow 用 accent）。
// 改这里即可让全部场景的同类文字同步变化。
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

export function textStyles(theme: TemplateTheme): TextStyles {
	const {colors, FONT_SIZE} = theme;
	const accent = colors.accent[0];
	// 统一文字阴影：accent 近距发光 + 黑色投影，让全息深色底上的白字有立体感。
	const shadow = `0 0 16px ${accent}40, 0 2px 8px rgba(0,0,0,0.5)`;
	const shadowStrong = `0 0 24px ${accent}55, 0 0 48px ${accent}25, 0 4px 12px rgba(0,0,0,0.6)`;
	return {
		displayTitle: {
			fontSize: FONT_SIZE.display,
			fontWeight: 900,
			color: colors.text.primary,
			lineHeight: 1.2,
			letterSpacing: -1,
			textShadow: shadowStrong,
		},
		sceneTitle: {
			fontSize: FONT_SIZE.title,
			fontWeight: 900,
			color: colors.text.primary,
			lineHeight: 1.2,
			letterSpacing: -1,
			textShadow: shadowStrong,
		},
		cardTitle: {
			fontSize: FONT_SIZE.subtitle,
			fontWeight: 800,
			color: colors.text.primary,
			lineHeight: 1.3,
			letterSpacing: -0.5,
			textShadow: shadow,
		},
		body: {
			fontSize: FONT_SIZE.body,
			color: colors.text.primary,
			lineHeight: 1.6,
			textShadow: shadow,
		},
		bodyMuted: {
			fontSize: FONT_SIZE.body,
			color: colors.text.secondary,
			lineHeight: 1.6,
			textShadow: shadow,
		},
		caption: {
			fontSize: FONT_SIZE.caption,
			color: colors.text.muted,
			lineHeight: 1.4,
			textShadow: `0 1px 4px rgba(0,0,0,0.5)`,
		},
		eyebrow: {
			fontSize: FONT_SIZE.caption,
			fontWeight: 800,
			letterSpacing: 4,
			textTransform: 'uppercase',
			// 提亮到近白 + 暗色投影，保证叠在亮背景（窗外/墙面）上也可读。
			color: lighten(colors.accent[0], 0.35),
			textShadow: `0 0 12px ${accent}60, 0 2px 6px rgba(0,0,0,0.8)`,
		},
	};
}
