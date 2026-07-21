// 调色板：模板库的颜色单一事实源。每个 palette 由「主题名」索引，
// 与 Root.tsx 的 THEMES 同名，于是「一个主题名」即可统一驱动全片。

export interface Palette {
	bg: {from: string; to: string};
	text: {primary: string; secondary: string; muted: string};
	// 至少 4 个强调色，按卡片顺序循环取用。
	accent: string[];
	line: string;
	surface: string;
	// 终端 / 代码场景的暗底（与正文卡区分开）。
	codeBg: string;
}

export interface Fonts {
	family: string;
	mono: string;
}

// 中文优先字体栈，Latin 字形走前置的西文字体、CJK 自动回退。
const CJK = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';
const MONO = '"SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, monospace';

// 统一文字色：全部主题白字（科技风），三档层级仅靠不透明度区分，
// 与背景的深浅无关。改这里即可全片调整正文配色。
const TECH_TEXT = {
	primary: '#FFFFFF',
	secondary: '#DDE6F0',
	muted: '#A8B2C4',
} as const;
// 深色科技底上统一的网格/表面色（白色低透明度）。
const TECH_LINE = 'rgba(255,255,255,0.30)';
const TECH_SURFACE = 'rgba(255,255,255,0.10)';

// 全部 5 套主题统一为「深色科技底 + 白字」，仅 accent / 字体保留各自调性。
export const PALETTES: Record<string, Palette> = {
	'warm-glass': {
		bg: {from: '#1A1320', to: '#2E2233'},
		text: {...TECH_TEXT},
		accent: ['#FFB347', '#FF7EB6', '#7FD8C0', '#C9A6E8'],
		line: TECH_LINE,
		surface: TECH_SURFACE,
		codeBg: '#160E1C',
	},
	'flat-motion-graphics': {
		bg: {from: '#0F172A', to: '#1E293B'},
		text: {...TECH_TEXT},
		accent: ['#A78BFA', '#F472B6', '#22D3EE', '#FBBF24'],
		line: TECH_LINE,
		surface: TECH_SURFACE,
		codeBg: '#0B1120',
	},
	'clean-professional': {
		// 由浅底改为深色专业蓝底，accent 提亮以在深底上保持对比。
		bg: {from: '#0C1322', to: '#172338'},
		text: {...TECH_TEXT},
		accent: ['#60A5FA', '#FBBF24', '#34D399', '#C4B5FD'],
		line: TECH_LINE,
		surface: TECH_SURFACE,
		codeBg: '#0B1120',
	},
	'minimalist-diagram': {
		// 由浅底改为深色极简底，原本过暗的 navy/near-black accent 换成亮色。
		bg: {from: '#0E1118', to: '#1A1F2E'},
		text: {...TECH_TEXT},
		accent: ['#E94560', '#4F9DF7', '#E2E8F0', '#9CA3AF'],
		line: TECH_LINE,
		surface: TECH_SURFACE,
		codeBg: '#11141C',
	},
	'anime-ghibli': {
		bg: {from: '#0A0A1A', to: '#1A2332'},
		text: {...TECH_TEXT},
		accent: ['#FFB347', '#FF6B9D', '#A8E6CF', '#B79BD8'],
		line: TECH_LINE,
		surface: TECH_SURFACE,
		codeBg: '#0A0F1A',
	},
};

export const FONTS: Record<string, Fonts> = {
	'warm-glass': {family: CJK, mono: MONO},
	'flat-motion-graphics': {family: `"Space Grotesk", ${CJK}`, mono: `"Fira Code", ${MONO}`},
	'clean-professional': {family: `"Inter", ${CJK}`, mono: `"JetBrains Mono", ${MONO}`},
	'minimalist-diagram': {family: `"IBM Plex Sans", ${CJK}`, mono: `"IBM Plex Mono", ${MONO}`},
	'anime-ghibli': {family: `"Noto Serif JP", ${CJK}`, mono: `"Fira Code", ${MONO}`},
};

export const DEFAULT_THEME_NAME = 'warm-glass';

export function resolvePalette(themeName?: string): Palette {
	return (themeName && PALETTES[themeName]) || PALETTES[DEFAULT_THEME_NAME];
}

export function resolveFonts(themeName?: string): Fonts {
	return (themeName && FONTS[themeName]) || FONTS[DEFAULT_THEME_NAME];
}
