---
stage: 06-tts-synthesis
status: draft
source_workflow: /06-tts-synthesis
upstream_inputs:
  - 04-script/README.md (status: draft)
---

# ep02 TTS 语音合成记录

逐镜提取 04 脚本各镜头 `voice_slice` 文本，用 **edge-tts**（zh-CN 神经声、免 API Key）逐镜合成，实测每镜时长作为时间真相源回填到 07 时间轴。合成时捕获引擎的 `SentenceBoundary` 时间戳，按字符占比切到子句，生成**绝对毫秒级字幕**（`WordCaption`），同时驱动烧字幕与主持口型（lip-sync）。生成脚本：`OpenMontage/build_ep02_tts.py`。

> ⚠️ 状态 `draft`：04 脚本按新 `tutorial.final.md` 六章结构重排为 **9 段 36 镜**（新增 §4 Remotion 原理、§8 场景适配；SSR/数字人/结尾顺延为 §6/§7/§9）。本阶段音频**尚未重新合成**——重跑 `build_ep02_tts.py` 后本表与 manifest 将以实测时长更新；在此之前 07 用脚本里的 storyboard 估时（见 04 SSOT 各 shot `duration_seconds`）。

## 配置

- 语言：zh-CN
- 引擎：**edge-tts**（Microsoft 在线神经 TTS，免 Key；离线/换厂商可改 `tools/audio/*`）
- 默认声音：`zh-CN-XiaoxiaoNeural`（女声，与当前 VRoid 形象匹配；换声：`python build_ep02_tts.py --voice <id>`）
- 命名规范：`assets/<镜头号>.mp3`（如 `1.1.mp3`）+ 合成总轨 `ep02-narration.mp3`

## 段落清单（storyboard 估时，待 edge-tts 实测覆盖）

| 段 | 主题 | 画面类型 | 镜头数 | 估时 |
|----|------|----|-------|------|
| S1 | 开场钩子：一句话点题 + 数据驱动认知 + 三步路线 | 自动渲染 | 3 | 30s |
| S2 | 找技术路径：把选型丢给 AI，摆出六条路线、同一内核 | 自动渲染 | 4 | 50s |
| S3 | 技术选型：看清每条路的坑，对约束做减法定 Remotion | 自动渲染 | 6 | 90s |
| S4 | **（新）Remotion 怎么工作 + 为什么 AI 能驱动** | 自动渲染 | 4 | 53s |
| S5 | 技术落地：配置→Explainer 分发→现成组件，TS 兜底 | 自动渲染 | 6 | 90s |
| S6 | SSR 坑与守卫，把规矩固化成 MDC 规则 | 自动渲染+录屏 | 3 | 35s |
| S7 | 数字人选型：陪衬定位，选 3D 风格化 VRM | 自动渲染 | 4 | 60s |
| S8 | **（新）场景适配：适合纯自动渲染 / 搭配透明叠层 / 不适合** | 自动渲染 | 4 | 53s |
| S9 | 结尾 CTA：三步收束 + 下期预告 | 自动渲染 | 2 | 20s |

**合计（storyboard 估时）：约 481 秒（约 8 分 1 秒），36 镜。**

## 产物（重生成后）

- `assets/<镜头号>.mp3` —— 36 段逐镜 narration 音频。
- `remotion-composer/public/audio/ep02-narration.mp3` —— 合成总轨（07 的 `audio.narration`）。
- `assets/manifest.json` —— 机器可读清单：`provider: edge-tts`、每镜 `start_seconds`/实测 `duration_seconds`/`audio_file`，以及绝对毫秒 `captions[]`。07 组装（`build_ep02_shots_props.py`）读取它把镜头时长换成实测时长、把 captions 注入 Explainer props（烧字幕 + 主持口型）。

## 重生成

```bash
python OpenMontage/build_ep02_tts.py            # 合成音频 + 写 manifest（36 镜）
python OpenMontage/build_ep02_shots_props.py    # 回填时长/字幕/音轨到 ep02-shots.json
```
