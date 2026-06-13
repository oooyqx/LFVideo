---
stage: 08-subtitle-gen
status: draft
source_workflow: /08-subtitle-gen
upstream_inputs:
  - 06-tts/assets/*.wav (status: approved)
  - 07-assembly/README.md (status: approved)
whisper_model: base
---

# ep02 字幕生成（Whisper 本地转录）

## 配置

| 维度 | 值 |
|------|---|
| **Whisper 模型** | `base`（139MB，CPU 推理） |
| **语言** | zh（中文） |
| **输入** | 06-tts/assets/ 下 16 个 WAV 文件 |
| **输出格式** | SRT + VTT |
| **每行最大字数** | 20 字 |

---

## 转录结果

| 指标 | 值 |
|------|---|
| 总字幕条数 | 233 条 |
| 总时长 | 553.82s（9分14秒） |
| 转录耗时 | ~30s（CPU） |
| 输出文件 | `ep02-video-render.srt` + `.vtt` |

### 按段落分布

| 段落 | 字幕条数 |
|------|---------|
| S1_intro | 10 |
| S2a_paradigm | 23 |
| S2b_frame_as_state | 4 |
| S2c_six_routes | 21 |
| S3a_judgment_matrix | 31 |
| S3b_remotion_reasons | 18 |
| S3c_comparison | 10 |
| S3d_tradeoffs | 16 |
| S4a_pipeline | 14 |
| S4b_three_piece | 1 |
| S4c_orchestrator | 11 |
| S4d_ab_track | 17 |
| S5a_data_driven | 14 |
| S5b_ssr_guard | 17 |
| S5c_ai_render | 18 |
| S6_cta | 8 |

---

## 已知问题（base 模型局限）

1. **繁简混用**：Whisper base 对 Piper TTS 合成语音输出繁体字（如"視頻"→应为"视频"）
2. **英文术语误识别**：Remotion → "瑞莫森"/"热摸森"，SSR → 连读不清
3. **整体识别率**：base 模型中文 WER 较高，适合验证时间轴流程，文本内容需校对

### 升级路径

- **模型升级**：`base` → `large-v3`（3GB，中文识别精度大幅提升）
- **后处理**：可结合 04-script 口播原文做强制对齐（forced alignment），时间轴用 Whisper，文本用脚本原文
- **繁简转换**：后处理加 `opencc` 统一转简体

---

## 运行方式

```bash
# 前置
pip install openai-whisper

# 生成字幕（自动下载 base 模型）
cd content-library/ep02-video-render/08-subtitle
python generate_srt.py
```

---

## 校对状态

- 术语修正：**待人工校对**（建议结合 04-script 口播原文替换）
- 时间轴：**基本准确**（Whisper 时间戳与 TTS 合成时长吻合）
- 断句：每条 ≤ 20 字，双行上限

---

## 落盘目录

```
content-library/ep02-video-render/08-subtitle/
├── README.md              # 本文件
├── generate_srt.py        # 字幕生成脚本
└── assets/
    ├── ep02-video-render.srt       # SRT 字幕（233 条）
    ├── ep02-video-render.vtt       # VTT 字幕
    └── subtitle_manifest.json      # 转录元数据
```

---

## 下一步

1. **人工校对**：结合 04-script 口播原文修正识别错误（或用 forced alignment 自动替换文本）
2. **繁简转换**：对 SRT 执行 `opencc -i srt -o srt -c t2s.json`
3. **弹跳字幕**（可选）：升级到 `large-v3` 获取 word-level 时间戳后，可生成 Remotion `@CaptionBurn` 弹跳字幕 JSON

```json
{
  "stage": "08-subtitle-gen",
  "episode": "ep02-video-render",
  "whisper_model": "base",
  "language": "zh",
  "total_entries": 233,
  "total_duration_seconds": 553.82,
  "output_files": ["ep02-video-render.srt", "ep02-video-render.vtt"],
  "quality_notes": [
    "base 模型中文识别率有限，适合验证流程",
    "时间轴准确度可接受",
    "文本需人工校对或 forced alignment 替换",
    "升级 large-v3 可大幅改善识别质量"
  ]
}
```
