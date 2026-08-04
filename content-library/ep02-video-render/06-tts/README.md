---
stage: 06-tts-synthesis
status: draft
source_workflow: /06-tts-synthesis
upstream_inputs:
  - 04-script/README.md (status: draft)
---

# ep02 TTS 语音合成记录

逐镜提取 04 脚本各镜头 `voice_slice` 文本，用 **edge-tts**（zh-CN 神经声、免 API Key）逐镜合成，实测每镜时长作为时间真相源回填到 07 时间轴。合成时捕获引擎的 `SentenceBoundary` 时间戳，按字符占比切到子句，生成**绝对毫秒级字幕**（`WordCaption`），同时驱动烧字幕与主持口型（lip-sync）。生成脚本：`OpenMontage/build_ep02_tts.py`。

> 本期 04 脚本已按新 `tutorial.final.md`（VRM 移除后）重写为 **7 段 25 镜**，TTS 已基于新脚本重新合成。

## 配置

- 语言：zh-CN
- 引擎：**edge-tts**（Microsoft 在线神经 TTS，免 Key；离线/换厂商可改 `tools/audio/*`）
- 默认声音：`zh-CN-XiaoxiaoNeural`（女声；换声：`python build_ep02_tts.py --voice <id>`）
- 命名规范：`assets/<镜头号>.mp3`（如 `1.1.mp3`）+ 合成总轨 `ep02-narration.mp3`

## 段落清单

| 段 | 主题 | 画面类型 | 镜头数 | 实测时长 |
|----|------|----|-------|------|
| S1 | 开场：系列定位 + 关键认知 + 三步路线 | 自动渲染 | 3 | 37s |
| S2 | 找技术路径：AI 罗列六条路线 + 共同内核 | 自动渲染 | 3 | 43s |
| S3 | 技术选型：全方位对比 + 约束选定 + 代价 | 自动渲染 | 6 | 76s |
| S4 | Remotion 怎么工作 + 为什么 AI 能驱动 | 自动渲染 | 4 | 46s |
| S5 | 配置分发 + 模板场景 + 填数据不造组件 | 自动渲染 | 4 | 61s |
| S6 | 场景适配：适合 / 搭配 / 不适合 | 自动渲染 | 4 | 50s |
| S7 | 总结 + CTA | 自动渲染 | 2 | 23s |

**合计（实测）：336 秒（约 5 分 36 秒），22 个有配音镜头 + 4 个纯画面镜头（空 voice_slice 跳过）。**

## 产物

- `assets/<镜头号>.mp3` —— 22 段逐镜 narration 音频（4 个纯画面镜头无音频）。
- `remotion-composer/public/audio/ep02-narration.mp3` —— 合成总轨（07 的 `audio.narration`）。
- `assets/manifest.json` —— 机器可读清单：`provider: edge-tts`、每镜 `start_seconds`/实测 `duration_seconds`/`audio_file`，以及绝对毫秒 `captions[]`。07 组装（`build_props.py`）读取它把镜头时长换成实测时长、把 captions 注入 Explainer props（烧字幕 + 主持口型）。

## 重生成

```bash
python OpenMontage/build_ep02_tts.py            # 合成音频 + 写 manifest
python content-library/ep02-video-render/07-assembly/build_props.py    # 回填时长/字幕/音轨到 ep02-shots.json
```
