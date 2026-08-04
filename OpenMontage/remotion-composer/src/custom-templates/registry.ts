import type React from 'react';
import {z} from 'zod';
import {IntroScene, introSchema} from './scenes/opener/IntroScene';
import {OutroScene, outroSchema} from './scenes/opener/OutroScene';
import {SectionScene, sectionSchema} from './scenes/opener/SectionScene';
import {ConceptScene, conceptSchema} from './scenes/list/ConceptScene';
import {TimelineScene, timelineSchema} from './scenes/list/TimelineScene';
import {BulletScene, bulletSchema} from './scenes/list/BulletScene';
import {FlowScene, flowSchema} from './scenes/list/FlowScene';
import {ArchitectureScene, archSchema} from './scenes/list/ArchitectureScene';
import {TableScene, tableSchema} from './scenes/data/TableScene';
import {ComparisonScene, comparisonSchema} from './scenes/data/ComparisonScene';
import {ChartScene, chartSchema} from './scenes/data/ChartScene';
import {StatScene, statSchema} from './scenes/data/StatScene';
import {CalloutScene, calloutSchema} from './scenes/emphasis/CalloutScene';
import {QuoteScene, quoteSchema} from './scenes/emphasis/QuoteScene';
import {CodeScene, codeSchema} from './scenes/demo/CodeScene';
import {ChatScene, chatSchema} from './scenes/demo/ChatScene';
import {CoverScene, coverSchema} from './scenes/cover/CoverScene';
import sceneTypesManifest from './scene-types.json';

// 模板库的单一注册表：每个场景把「类型名 → 组件 + co-located zod schema」登记在此。
// 新增模板只改这一处 + 对应 scene 文件。Explainer 从这里取组件分发，
// pipeline_lint / SCENE_TYPES.md 从 scene-types.json 取同一份事实。
export interface SceneDefinition {
	type: string;
	schema: z.ZodObject<z.ZodRawShape>;
	// props 已由各自 schema 约束，这里用宽松组件类型避免在注册表里枚举每种 props。
	component: React.FC<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const TEMPLATE_SCENES: Record<string, SceneDefinition> = {
	intro_scene: {type: 'intro_scene', schema: introSchema, component: IntroScene},
	outro_scene: {type: 'outro_scene', schema: outroSchema, component: OutroScene},
	concept_scene: {type: 'concept_scene', schema: conceptSchema, component: ConceptScene},
	timeline_scene: {type: 'timeline_scene', schema: timelineSchema, component: TimelineScene},
	table_scene: {type: 'table_scene', schema: tableSchema, component: TableScene},
	comparison_scene: {type: 'comparison_scene', schema: comparisonSchema, component: ComparisonScene},
	code_scene: {type: 'code_scene', schema: codeSchema, component: CodeScene},
	section_scene: {type: 'section_scene', schema: sectionSchema, component: SectionScene},
	bullet_scene: {type: 'bullet_scene', schema: bulletSchema, component: BulletScene},
	flow_scene: {type: 'flow_scene', schema: flowSchema, component: FlowScene},
	architecture_scene: {type: 'architecture_scene', schema: archSchema, component: ArchitectureScene},
	chart_scene: {type: 'chart_scene', schema: chartSchema, component: ChartScene},
	stat_scene: {type: 'stat_scene', schema: statSchema, component: StatScene},
	callout_scene: {type: 'callout_scene', schema: calloutSchema, component: CalloutScene},
	quote_scene: {type: 'quote_scene', schema: quoteSchema, component: QuoteScene},
	cover_scene: {type: 'cover_scene', schema: coverSchema, component: CoverScene},
	chat_scene: {type: 'chat_scene', schema: chatSchema, component: ChatScene},
};

export const TEMPLATE_SCENE_TYPES: string[] = Object.keys(TEMPLATE_SCENES);

interface ManifestScene {
	type: string;
	template: string;
	description: string;
	required: string[];
	optional: string[];
}

// 启动期一致性守卫：scene-types.json（跨语言 SSOT）必须与 zod schema 的字段完全吻合，
// 否则文档 / lint 会与真实组件漂移。任一不一致直接抛错，本地与 CI 都能立刻发现。
function assertManifestMatchesSchemas(): void {
	const manifest = sceneTypesManifest as {scenes: ManifestScene[]};
	const manifestTypes = manifest.scenes.map((s) => s.type).sort();
	const registryTypes = [...TEMPLATE_SCENE_TYPES].sort();
	if (JSON.stringify(manifestTypes) !== JSON.stringify(registryTypes)) {
		throw new Error(
			`[registry] scene-types.json types ${JSON.stringify(manifestTypes)} != registry types ${JSON.stringify(registryTypes)}`
		);
	}
	for (const entry of manifest.scenes) {
		const def = TEMPLATE_SCENES[entry.type];
		const shape = def.schema.shape as unknown as Record<
			string,
			{safeParse: (v: unknown) => {success: boolean}}
		>;
		const shapeKeys = Object.keys(shape).sort();
		const declared = [...entry.required, ...entry.optional].sort();
		if (JSON.stringify(shapeKeys) !== JSON.stringify(declared)) {
			throw new Error(
				`[registry] '${entry.type}' fields drift: schema ${JSON.stringify(shapeKeys)} != manifest ${JSON.stringify(declared)}`
			);
		}
		for (const key of entry.required) {
			if (shape[key].safeParse(undefined).success) {
				throw new Error(`[registry] '${entry.type}.${key}' is declared required but schema accepts undefined`);
			}
		}
		for (const key of entry.optional) {
			if (!shape[key].safeParse(undefined).success) {
				throw new Error(`[registry] '${entry.type}.${key}' is declared optional but schema rejects undefined`);
			}
		}
	}
}

assertManifestMatchesSchemas();
