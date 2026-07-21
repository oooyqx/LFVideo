---
stage: 07-video-assembly
status: draft
source_workflow: /07-video-assembly
upstream_inputs:
  - 04-script/README.md (status: draft)
  - 05-b-roll/README.md (status: draft)
  - 06-tts/assets/manifest.json (status: draft)
---

# ep02 视频组装记录（镜头级 SSOT → Remotion 预览）

端到端验证 shot 镜头层：04 SSOT 的 **36 个镜头一镜一 cut** 映射到 Remotion `Explainer` 合成。画面随镜头 ~每 8–18s 换一次，彻底消除「一大段口播绑死单一画面」。

> ⚠️ 本期遵循 `AGENT_GUIDE.md` 第 4 条：**没有明确渲染命令不主动出片**，所有效果验证在 Remotion 预览（`npx remotion studio` / `<Player>`）完成。下方「复现」里的 `npx remotion render` 仅供用户需要出片时手动执行。

## 引擎与映射

- 引擎：`OpenMontage/remotion-composer`（Remotion 4，`Explainer` 按 `cut.type` 分发场景组件；新增 7 个模板场景已接入 registry 通用分发）。
- 生成器：`OpenMontage/build_ep02_shots_props.py` —— 读取 04 SSOT，结构（镜头顺序 / 每镜时长 / 覆盖的口播）全部来自 SSOT，仅每镜的画面可渲染细节（标题/卡片/表格行/终端代码/对比项/流程步骤/要点/金句/提示）在生成器的 `SHOT_CONTENT` 里补全（即 07 视频工程师的工作）。
- 产物 props：`OpenMontage/remotion-composer/public/demo-props/ep02-shots.json`（36 个 cut，481s = 14430 帧 @30fps）。

### scene_template → Explainer cut.type

引擎无 `@SplitLayout` cut，左右分屏/对比镜头落到 `comparison_scene`（`@ComparisonCard`）：

| 04 `scene_template` | Explainer `cut.type` | 组件 |
|---|---|---|
| `@IntroScene` | `intro_scene` | IntroScene |
| `@ConceptScene` | `concept_scene` | ConceptScene |
| `@TableScene` | `table_scene` | TableScene |
| `@TerminalScene` | `code_scene` | CodeScene（合成终端，无需真录屏）|
| `@SplitLayout` | `comparison_scene` | ComparisonScene |
| `@FlowScene` | `flow_scene` | FlowScene（新）|
| `@BulletScene` | `bullet_scene` | BulletScene（新）|
| `@QuoteScene` | `quote_scene` | QuoteScene（新）|
| `@CalloutScene` | `callout_scene` | CalloutScene（新）|
| `@OutroScene` | `outro_scene` | OutroScene |

cut 数按类型：`intro_scene×3, concept_scene×11, table_scene×5, comparison_scene×5, code_scene×5, flow_scene×1, bullet_scene×1, quote_scene×2, callout_scene×1, outro_scene×2` = **36**，等于 SSOT 全部镜头数（`pipeline_lint.py` 的组装一致性即用此数校验）。

## 镜头编排表（cut = shot）

| cut | 段 | type | 起→止 (s) | 时长 |
|-----|----|------|----------|------|
| shot-1.1 | S1 | intro_scene | 0–10 | 10 |
| shot-1.2 | S1 | intro_scene | 10–22 | 12 |
| shot-1.3 | S1 | intro_scene | 22–30 | 8 |
| shot-2.1 | S2 | concept_scene | 30–43 | 13 |
| shot-2.2 | S2 | concept_scene | 43–57 | 14 |
| shot-2.3 | S2 | concept_scene | 57–72 | 15 |
| shot-2.4 | S2 | concept_scene | 72–80 | 8 |
| shot-3.1 | S3 | table_scene | 80–95 | 15 |
| shot-3.2 | S3 | table_scene | 95–113 | 18 |
| shot-3.3 | S3 | table_scene | 113–128 | 15 |
| shot-3.4 | S3 | comparison_scene | 128–146 | 18 |
| shot-3.5 | S3 | comparison_scene | 146–162 | 16 |
| shot-3.6 | S3 | comparison_scene | 162–170 | 8 |
| shot-4.1 | S4 | flow_scene | 170–185 | 15 |
| shot-4.2 | S4 | code_scene | 185–200 | 15 |
| shot-4.3 | S4 | bullet_scene | 200–215 | 15 |
| shot-4.4 | S4 | quote_scene | 215–223 | 8 |
| shot-5.1 | S5 | concept_scene | 223–236 | 13 |
| shot-5.2 | S5 | concept_scene | 236–253 | 17 |
| shot-5.3 | S5 | code_scene | 253–268 | 15 |
| shot-5.4 | S5 | code_scene | 268–283 | 15 |
| shot-5.5 | S5 | comparison_scene | 283–301 | 18 |
| shot-5.6 | S5 | concept_scene | 301–313 | 12 |
| shot-6.1 | S6 | code_scene (自动渲染兜底) | 313–327 | 14 |
| shot-6.2 | S6 | code_scene (自动渲染兜底) | 327–339 | 12 |
| shot-6.3 | S6 | concept_scene | 339–348 | 9 |
| shot-7.1 | S7 | concept_scene | 348–363 | 15 |
| shot-7.2 | S7 | table_scene | 363–380 | 17 |
| shot-7.3 | S7 | table_scene | 380–395 | 15 |
| shot-7.4 | S7 | concept_scene | 395–408 | 13 |
| shot-8.1 | S8 | concept_scene | 408–423 | 15 |
| shot-8.2 | S8 | comparison_scene | 423–438 | 15 |
| shot-8.3 | S8 | callout_scene | 438–453 | 15 |
| shot-8.4 | S8 | quote_scene | 453–461 | 8 |
| shot-9.1 | S9 | outro_scene | 461–473 | 12 |
| shot-9.2 | S9 | outro_scene | 473–481 | 8 |

关键验证：第 3、5 段（各 90s）拆成 6 个镜头跨多个组件接力（S3：表格×3 → 对比×3；S5：概念×2 → 终端×2 → 对比 → 概念）；新增 §4（flow→code→bullet→quote）、§8（concept→comparison→callout→quote）覆盖 7 个新模板场景，画面不再有 >18s 的静止。

## 复现（预览）

```bash
# 1) 由 04 SSOT 生成 Remotion props（一镜一 cut）
python OpenMontage/build_ep02_shots_props.py

# 2) Remotion 预览（默认验证方式，不出片）
cd OpenMontage/remotion-composer
npx remotion studio        # 打开 ep02-shots 合成逐镜核对
```

> 出片渲染（`npx remotion render … ep02-shots out/ep02-shots.mp4`）仅在用户明确下达渲染命令时执行（AGENT_GUIDE 第 4 条）。

## 产物

- props：`OpenMontage/remotion-composer/public/demo-props/ep02-shots.json`（36 cut，视觉轨；narration 待 06 补真音后用 `audio` 块注入）。
- 当前为预览验证版：未叠 narration（06 待补真音）、时间轴用 04 SSOT storyboard 估时。

## 待办

- 06 补真音后：时间轴改由 06 实测时长驱动（`build_ep02_shots_props.py` 自动读 `manifest.json`），并注入 narration 音频与字幕。
- 05 真人补录 `b-ssr-crash`/`b-ssr-fix` 后：把 6.1/6.2 两镜从 `code_scene` 兜底换成视频 cut。
- 用户下达渲染命令后再出片（半分辨率快验：`--scale=0.5`；全高清去掉 `--scale`）。
