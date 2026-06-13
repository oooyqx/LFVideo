---
stage: 06-tts-synthesis
status: approved
source_workflow: /06-tts-synthesis
upstream_inputs:
  - 04-script/README.md (status: approved)
  - shared/docs/remotion-spec.md
engine: cosyvoice3 / piper-tts
model: Fun-CosyVoice3-0.5B / zh_CN-huayan-medium
---

# ep02 TTS 语音合成

## 引擎选型

脚本支持两种 TTS 引擎，默认使用 CosyVoice 3：

| 引擎 | 模型 | 采样率 | 部署方式 | 中文自然度 |
|------|------|--------|---------|-----------|
| **CosyVoice 3**（默认） | `Fun-CosyVoice3-0.5B` | 24000 Hz | 远程 GPU 服务 | ★★★★★ |
| Piper TTS（fallback） | `zh_CN-huayan-medium` | 22050 Hz | 本地 CPU | ★★☆☆☆ |

### CosyVoice 3（推荐）

- **高自然度**：阿里通义语音团队开源模型，中文表现接近真人
- **多模式**：SFT 预训练音色 / 零样本克隆 / 自然语言控制
- **远程服务**：在 GPU 机器上部署 FastAPI 服务，本机通过 HTTP 调用

### Piper TTS（备选）

- **零成本**：无需 GPU、无需 API Key，完全本地推理
- **速度快**：16 段合成约 13 秒（CPU）
- **局限**：中文自然度机械，英文术语发音偏差

---

## 合成结果

| 段落 ID | 对应场景 | 字数 | 时长 | 文件 |
|---------|---------|------|------|------|
| S1_intro | 第一段·开头钩子 | 158 | 25.59s | `S1_intro.wav` |
| S2a_paradigm | 第二段A·范式与痛点 | 258 | 42.97s | `S2a_paradigm.wav` |
| S2b_frame_as_state | 第二段B·帧即状态 | 120 | 20.96s | `S2b_frame_as_state.wav` |
| S2c_six_routes | 第二段C·六条路线 | 314 | 44.33s | `S2c_six_routes.wav` |
| S3a_judgment_matrix | 第三段A·判断层矩阵 | 381 | 60.38s | `S3a_judgment_matrix.wav` |
| S3b_remotion_reasons | 第三段B·选型四理由 | 288 | 41.62s | `S3b_remotion_reasons.wav` |
| S3c_comparison | 第三段C·Remotion vs HyperFrames | 164 | 21.04s | `S3c_comparison.wav` |
| S3d_tradeoffs | 第三段D·选型代价 | 171 | 27.85s | `S3d_tradeoffs.wav` |
| S4a_pipeline | 第四段A·七阶段流水线 | 172 | 30.59s | `S4a_pipeline.wav` |
| S4b_three_piece | 第四段B·三件套 | 170 | 24.31s | `S4b_three_piece.wav` |
| S4c_orchestrator | 第四段C·编排器伪代码 | 199 | 24.14s | `S4c_orchestrator.wav` |
| S4d_ab_track | 第四段D·A/B轨机制 | 300 | 41.20s | `S4d_ab_track.wav` |
| S5a_data_driven | 第五段A·数据驱动 vs 手写 | 246 | 33.45s | `S5a_data_driven.wav` |
| S5b_ssr_guard | 第五段B·SSR守卫 | 336 | 43.05s | `S5b_ssr_guard.wav` |
| S5c_ai_render | 第五段C·AI出片 | 278 | 39.59s | `S5c_ai_render.wav` |
| S6_cta | 第六段·结尾CTA | 209 | 32.75s | `S6_cta.wav` |
| **合计** | **16 段** | **3764 字** | **553.82s（9分14秒）** | |

---

## 运行方式

```bash
cd content-library/ep02-video-render/06-tts

# === CosyVoice 3（默认，需远程 GPU 服务） ===
python synthesize.py --engine cosyvoice3 --cosyvoice-url http://YOUR_GPU_SERVER:9880

# 也可通过环境变量配置
export COSYVOICE_URL=http://YOUR_GPU_SERVER:9880
python synthesize.py

# 可选参数：
#   --cosyvoice-mode sft|zero_shot|instruct2  推理模式（默认 sft）
#   --cosyvoice-spk "中文女"                   SFT 模式说话人 ID
#   --cosyvoice-instruct "用轻快的语气"        instruct2 模式指令
#   --cosyvoice-prompt-wav ref.wav             零样本克隆参考音频

# === Piper TTS（备选，本地运行） ===
pip install piper-tts
python synthesize.py --engine piper
```

产出在 `assets/` 目录，含 16 个 WAV 文件 + `manifest.json`。

---

## 术语发音说明（Piper 无 SSML，记录备忘）

以下术语在 Piper TTS 中文模型下发音存在偏差，**升级到豆包/OpenAI 时需加 SSML 修正**：

| 术语 | Piper 实际表现 | 升级时 SSML 方案 |
|------|--------------|----------------|
| Remotion | 可辨识但音调偏 | `<phoneme ph="rɪˈmoʊʃən">` |
| SSR | 连读偏快 | `<say-as interpret-as="characters">` |
| Cursor | 基本正确 | - |
| MDC | 连读 | `<say-as interpret-as="characters">` |
| React | 基本正确 | - |
| ComparisonCard | 拆词不稳定 | 读作"Comparison Card" |
| npx remotion render | 整体偏快 | 按词拆读 |
| typeof window | 基本正确 | - |

---

## 落盘目录结构

```
content-library/ep02-video-render/06-tts/
├── README.md           # 本文件（执行记录）
├── synthesize.py       # 合成脚本（可复现）
├── models/
│   ├── zh_CN-huayan-medium.onnx       # Piper 中文模型（63MB）
│   └── zh_CN-huayan-medium.onnx.json  # 模型配置
└── assets/
    ├── manifest.json   # 合成清单（segment_id / duration / file_size）
    ├── S1_intro.wav
    ├── S2a_paradigm.wav
    ├── S2b_frame_as_state.wav
    ├── S2c_six_routes.wav
    ├── S3a_judgment_matrix.wav
    ├── S3b_remotion_reasons.wav
    ├── S3c_comparison.wav
    ├── S3d_tradeoffs.wav
    ├── S4a_pipeline.wav
    ├── S4b_three_piece.wav
    ├── S4c_orchestrator.wav
    ├── S4d_ab_track.wav
    ├── S5a_data_driven.wav
    ├── S5b_ssr_guard.wav
    ├── S5c_ai_render.wav
    └── S6_cta.wav
```

---

## 下一步

1. **部署 CosyVoice 3 服务**：在 GPU 机器上部署并启动 FastAPI 服务
2. **重新合成**：用 CosyVoice 3 重新合成 16 段口播（替换 Piper 产出）
3. **试听审核**：人工试听各段 WAV，确认口播节奏和自然度
4. **推进 07 组装**：将 `assets/*.wav` 作为口播音轨输入 07 视频组装阶段
5. **Whisper 对齐**（08 字幕阶段）：对 WAV 文件做 Whisper 时间戳提取，生成逐字字幕

```json
{
  "stage": "06-tts-synthesis",
  "platform": "bilibili",
  "engines": ["cosyvoice3", "piper-tts"],
  "default_engine": "cosyvoice3",
  "total_segments": 16,
  "total_text_chars": 3764,
  "cosyvoice3_config": {
    "model": "Fun-CosyVoice3-0.5B",
    "sample_rate_hz": 24000,
    "modes": ["sft", "zero_shot", "instruct2"]
  },
  "piper_config": {
    "model": "zh_CN-huayan-medium",
    "sample_rate_hz": 22050
  }
}
```
