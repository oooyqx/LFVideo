---
stage: 06-tts-synthesis
status: draft
source_workflow: /06-tts-synthesis
upstream_inputs:
  - 04-script/README.md (status: approved)
---

# ep03 TTS 语音合成记录

逐镜提取 04 脚本各镜头 `voice_slice` 文本，用 TTS 引擎逐镜合成，实测每镜时长作为时间真相源回填到 07 时间轴。合成时捕获引擎的时间戳，生成绝对毫秒级字幕（WordCaption），同时驱动烧字幕与主持口型（lip-sync）。生成脚本：`OpenMontage/build_ep03_tts.py`。

## 配置

- 语言：zh-CN
- 引擎：edge-tts（免费）或 doubao（付费，需 API Key）
- 默认声音：`zh-CN-XiaoxiaoNeural`（女声）
- 命名规范：`assets/<镜头号>.mp3`（如 `1.1.mp3`）+ 合成总轨 `ep03-narration.mp3`

## 发音预检

- 多音字：无
- 英文术语：Remotion（按英文读法）、VRM（逐字母 V-R-M）、AI（按英文读法）
- 数字写法：16 种（阿拉伯数字，引擎可正确朗读）

## 重生成

```bash
python OpenMontage/build_ep03_tts.py                                    # edge-tts
python OpenMontage/build_ep03_tts.py --engine doubao                    # doubao
python content-library/ep03-scene-building/07-assembly/build_props.py   # 回填时长/字幕/音轨到 ep03-shots.json
```
