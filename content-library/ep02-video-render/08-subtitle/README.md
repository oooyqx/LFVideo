---
stage: 08-subtitle-gen
status: draft
source_workflow: /08-subtitle-gen
upstream_inputs:
  - 07-assembly/README.md (status: draft)
  - 06-tts/assets/manifest.json (status: draft)
---

# ep02 字幕生成记录

## 数据源

- [x] 从 07 props JSON captions[] 转换（TTS 路径）
- [ ] Whisper 转录（真人录音 fallback）

## 生成方式

从 `ep02-shots.json` 的 `captions[]`（87 页，06-tts 精确时间戳）提取 word-level 时间轴，通过 `SubtitleGen` 重新分句为 SRT/VTT 外挂字幕。CJK 每行 18 字，最多 2 行，最短 1.2s，最长 6.0s。

## 校对状态

- 断句调整：待人工校对
- 标点处理：自动剥离尾部中性标点（。，、；：）
- 总字幕条数：87 条
- 总时长：371s（与 07 props 一致）

## 产物

- `assets/ep02.srt` —— SRT 字幕（B站、YouTube 通用）
- `assets/ep02.vtt` —— VTT 字幕（Web 标准）

## 平台上传

- [ ] B站（SRT）
- [ ] YouTube（SRT/VTT）
- [ ] 抖音（SRT）

## 重生成

```bash
python __gen_subs.py    # 从 ep02-shots.json 重新生成 SRT/VTT
```
