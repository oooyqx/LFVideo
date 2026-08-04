---
stage: 09-bgm-mix
status: draft
source_workflow: /09-bgm-mix
---

# ep02 BGM与混音记录

## BGM 信息
- 来源：FFmpeg 合成（正弦波叠加 + 低通滤波）
- 类型：科技感环境音（220Hz + 330Hz + 440Hz 叠加，lowpass 800Hz）
- 时长：450 秒（7 分 30 秒，覆盖全片 441 秒）
- 许可：无版权限制（合成音频）

> 注：Pixabay 搜索返回 403，Freesound 无 API key，暂用 FFmpeg 合成 BGM。后续可替换为正式免版税音乐。

## 混音参数
- Ducking：sidechaincompress（threshold=0.02, ratio=9, attack=200ms, release=500ms）
- BGM 音量：口播时降至 0.45 倍（约 -7dB ducking）
- 标准化响度：loudnorm I=-14 LUFS（实测 -14.1 LUFS，在 ±1 范围内）
- 首尾淡入淡出：BGM 头 3s fade in，尾 5s fade out

## 音效
- 本期未添加 SFX（纯口播 + BGM）

## 成片路径
- `OpenMontage/remotion-composer/out/ep02-shots-mixed.mp4`（混音版，约 224 MB）
- `OpenMontage/remotion-composer/out/ep02-shots.mp4`（原版，无 BGM，约 242 MB）

## 产物文件
```
content-library/ep02-video-render/09-bgm/
├── README.md
├── assets/
│   ├── bgm.mp3              # 合成 BGM（450s）
│   ├── narration_audio.wav  # 从成片提取的口播音轨
│   ├── final_audio.wav      # 混音后音频（口播 + BGM + 响度标准化）
│   └── sfx/                  # 音效文件夹（本期为空）
```
