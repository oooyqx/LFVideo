---
stage: 07-video-assembly
status: draft
source_workflow: /07-video-assembly
upstream_inputs:
  - 04-script/README.md (status: draft)
  - 05-b-roll/README.md (status: suspended)
  - 06-tts/assets/manifest.json (status: draft)
---

# ep02 视频组装记录（镜头级 SSOT → Remotion 预览）

端到端验证 shot 镜头层：04 SSOT 的 **25 个镜头一镜一 cut** 映射到 Remotion `Explainer` 合成。TTS 实测时长驱动时间轴，narration 音频与字幕已注入。

> ⚠️ 本期遵循 `AGENT_GUIDE.md` 第 4 条：**没有明确渲染命令不主动出片**，所有效果验证在 Remotion 预览（`npx remotion studio` / `<Player>`）完成。

## 引擎与映射

- 引擎：`OpenMontage/remotion-composer`（Remotion 4，`Explainer` 按 `cut.type` 分发场景组件）。
- 生成器：`content-library/ep02-video-render/07-assembly/build_props.py` —— 读取 04 SSOT + 06 TTS manifest，自动生成 props。
- 产物 props：`OpenMontage/remotion-composer/public/demo-props/ep02-shots.json`（26 cut，371s = 11143 帧 @30fps，TTS 实测时长驱动）。

### scene_template → Explainer cut.type

| 04 `scene_template` | Explainer `cut.type` | 组件 |
|---|---|---|
| `@IntroScene` | `intro_scene` | IntroScene |
| `@ConceptScene` | `concept_scene` | ConceptScene |
| `@TableScene` | `table_scene` | TableScene |
| `@TerminalScene` | `code_scene` | CodeScene（合成终端）|
| `@SplitLayout` | `comparison_scene` | ComparisonScene |
| `@FlowScene` | `flow_scene` | FlowScene |
| `@BulletScene` | `bullet_scene` | BulletScene |
| `@QuoteScene` | `quote_scene` | QuoteScene |
| `@CalloutScene` | `callout_scene` | CalloutScene |
| `@OutroScene` | `outro_scene` | OutroScene |

cut 数按类型：`concept_scene×7, bullet_scene×4, comparison_scene×4, flow_scene×3, table_scene×2, callout_scene×2, quote_scene×2, intro_scene×1, outro_scene×1` = **26**。

## 复现（预览）

```bash
# 1) 由 04 SSOT + 06 TTS manifest 生成 Remotion props
python content-library/ep02-video-render/07-assembly/build_props.py

# 2) Remotion 预览（默认验证方式，不出片）
cd OpenMontage/remotion-composer
npx remotion studio        # 打开 ep02-shots 合成逐镜核对
```

> 出片渲染（`npx remotion render … ep02-shots out/ep02-shots.mp4`）仅在用户明确下达渲染命令时执行。

## 产物

- props：`OpenMontage/remotion-composer/public/demo-props/ep02-shots.json`（26 cut，TTS 实测时长驱动，narration 音频 + 字幕已注入）。
- narration：`OpenMontage/remotion-composer/public/audio/ep02-narration.mp3`（336s 合成总轨）。
