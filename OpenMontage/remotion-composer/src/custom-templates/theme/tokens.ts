// 设计令牌：所有组件共享的视觉规则。修改这里，全片统一生效。

// ---- 字号阶梯（1920×1080 基准）----
// 规范：任何可见文字不得小于 MIN（见 motion-engineer 角色排版规范）
export const FONT_SIZE = {
	min: 24, // 硬下限，标注/角标也不得低于此
	caption: 24, // 角标、来源、序号
	body: 28, // 正文、描述
	bodyLg: 32, // 强调正文
	subtitle: 36, // 段落标题、卡片标题
	title: 48, // 场景标题
	display: 72, // 全屏主标题、片名
} as const;

// ---- 颜色 ----
// 颜色已迁移到 ./palettes.ts（按主题名索引）。这里仅保留 warm-glass 作为
// 默认调色板的兼容导出；组件应改用 useTheme().colors 读取当前主题颜色。
import {PALETTES} from './palettes';

export const COLORS = PALETTES['warm-glass'];

// ---- 间距 ----
export const SPACING = {
	xs: 8,
	sm: 16,
	md: 28,
	lg: 44,
	xl: 80,
	gutter: 140, // 全屏左右安全边距
} as const;

// ---- 圆角 ----
export const RADIUS = {
	sm: 12,
	md: 16,
	lg: 20,
	pill: 999,
} as const;

// ---- 动画默认参数 ----
export const SPRING = {
	gentle: {damping: 20, stiffness: 100, mass: 1},
	snappy: {damping: 18, stiffness: 120, mass: 0.8},
} as const;

// ---- 全息辉光（holographic glow）----
// 「全息投影感」的单一开关：文字 / 描边 / Icon / 强调光条的辉光强度。
// 改这里即可让全片的辉光同步增减；各场景一律读 useTheme().GLOW，禁止内联辉光。
export const GLOW = {
	// 标题文字辉光：accent 色弥散 + 暗色描边保可读。
	text: {blur: 18, alpha: 0.5},
	// 元素框（techPanel）描边的「常驻」辉光基线（呼吸辉光在此之上叠加）。
	border: {blur: 16, alpha: 0.34},
	// Icon / 序号方片的 accent 辉光。
	icon: {blur: 18, alpha: 0.45},
	// 强调光条（标题下划线 / 分隔条）的 accent 辉光。
	bar: {blur: 14, alpha: 0.6},
	// 标题解码入场时长（帧）。统一所有 HoloTitle 的入场节奏。
	decodeFrames: 20,
} as const;
