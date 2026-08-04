import React from 'react';
import {z} from 'zod';
import {useTheme} from '../../theme/ThemeContext';
import {glowL4} from '../../theme/textStyles';
import {BarChart, LineChart, PieChart, KPIGrid} from '../../../components/charts';

export const CHART_KINDS = ['bar', 'line', 'pie', 'kpi'] as const;
export type ChartKind = (typeof CHART_KINDS)[number];

const barDatumSchema = z.object({label: z.string(), value: z.number()});
const pieDatumSchema = z.object({
	label: z.string(),
	value: z.number(),
	color: z.string().optional(),
});
const lineSeriesSchema = z.object({
	label: z.string(),
	data: z.array(z.object({x: z.number(), y: z.number()})),
	color: z.string().optional(),
});
const kpiMetricSchema = z.object({
	label: z.string(),
	value: z.number(),
	prefix: z.string().optional(),
	suffix: z.string().optional(),
	change: z.number().optional(),
	icon: z.string().optional(),
});

export const chartSchema = z.object({
	kind: z.enum(CHART_KINDS),
	data: z.array(
		z.union([barDatumSchema, pieDatumSchema, lineSeriesSchema, kpiMetricSchema]),
	),
	title: z.string().optional(),
	donut: z.boolean().optional(),
	showValues: z.boolean().optional(),
});
export type ChartProps = z.infer<typeof chartSchema>;

type BarDatum = z.infer<typeof barDatumSchema>;
type PieDatum = z.infer<typeof pieDatumSchema>;
type LineSeries = z.infer<typeof lineSeriesSchema>;
type KpiMetric = z.infer<typeof kpiMetricSchema>;

// 主题驱动的图表场景：复用已验证的 components/charts，注入当前主题的
// accent / 文本 / 网格色，并透明叠在独立的 Background 层之上。
export const ChartScene: React.FC<ChartProps> = ({
	kind,
	data,
	title,
	donut,
	showValues = true,
}) => {
	const {colors, fonts} = useTheme();
	const accent = colors.accent[0];
	const glow = glowL4(accent);
	const svgFilter = `drop-shadow(0 0 ${8}px ${accent}33)`;

	const common = {
		title,
		colors: colors.accent,
		fontFamily: fonts.family,
		textColor: colors.text.primary,
		backgroundColor: 'transparent',
		gridColor: colors.line,
	};

	const wrap = (el: React.ReactNode) => (
		<div style={{textShadow: glow, filter: svgFilter}}>
			{el}
		</div>
	);

	switch (kind) {
		case 'bar':
			return wrap(<BarChart {...common} data={data as BarDatum[]} showValues={showValues} />);
		case 'line':
			return wrap(<LineChart {...common} series={data as LineSeries[]} />);
		case 'pie':
			return wrap(<PieChart {...common} data={data as PieDatum[]} donut={donut} />);
		case 'kpi':
			return wrap(<KPIGrid {...common} metrics={data as KpiMetric[]} />);
		default:
			return null;
	}
};
