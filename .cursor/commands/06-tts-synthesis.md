<!-- AUTO-GENERATED from shared/workflows/06-tts-synthesis.md. Do not edit here; edit the source and run `python scripts/sync_workflows.py`. -->

# TTS语音合成 Workflow (06-tts-synthesis)

将 04 脚本中的 `[口播]` 文本逐段合成为语音音频文件，供 07-video-assembly 阶段使用。支持 OpenMontage 的 `tts_selector` 自动选择最优 TTS 引擎，也可人工录音替代。

---

## 前置依赖

本工作流假设已完成 `/04-script-draft`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`
- 每段含 `[口播]` 文本

如果缺少上述输入，先提示用户回到 `/04-script-draft`。

> **注意**：本阶段与 `/05-b-roll-recording` **可并行执行**，互不依赖。

---

## 步骤

### 1. 提取口播文本

从 `04-script/README.md` 逐段提取 `[口播]` 文本：
- 按场景编号拆分（如 S1、S2a、S3b...）
- 每段生成独立文本片段
- 记录预估时长（中文约 4-5 字/秒）

### 2. 发音预检（中文口播必做，合成前逐句扫描）

对提取出的口播文本逐句做三遍扫描，把发音风险在合成前消掉（而不是合成后靠试听返工）：

1. **多音字消歧**：需要句子级语境判断（如「一行代码」念 háng、「运行」念 xíng）；对有风险的词用拼音标注或 SSML `<phoneme>` 固化，汇总进本期 `06-tts/phonemes.json`（字幕文本不变，只改读音）。
2. **英文术语读法**：连字符名（`remotion-composer`）、首字母缩写（API/MCP 是逐字母还是拼读）、带版本号名称（GPT-4）逐个确认；有歧义的在口播文本内联标注读法或改写成中文（如「tldraw 命令行工具」）。有公认中文读法的品牌（Qwen→千问）加 phoneme 条目；习惯英文读法的（Claude/GitHub/Docker）不动，不过度翻译。
3. **数字/日期写法**：优先保留阿拉伯数字（`2025年`、`18个月`、`90%`、`128GB` 主流引擎都能正确朗读）；只对真歧义形式改写：短横线日期 `2025-01-15`→`2025年1月15日`，多点版本号 `v1.2.3`→`v一点二点三`，无单位长数字改用「万/亿」表达。

预检产出：更新后的口播文本片段 + `phonemes.json`（如有新增条目）；在 `06-tts/README.md` 记一行汇总（新增多音字 N 条 / 英文术语标注 M 处，零问题写「无」）。

### 3. 选择 TTS 引擎

按口播语言选择引擎（默认优先级见 `shared/rules/project-context.md`《频道配置 · TTS 默认引擎》；通过 OpenMontage `tts_selector.py`）：

| 引擎 | 优势 | 适用场景 | 工具文件 |
|------|------|---------|---------|
| **豆包 TTS** | 中文效果最佳、情感自然 | 中文技术视频首选 | `tools/audio/doubao_tts.py` |
| **OpenAI TTS** | 多语言、音质稳定 | 英文或中英混合 | `tools/audio/openai_tts.py` |
| **ElevenLabs** | 超自然、克隆声音 | 高端定制化 | `tools/audio/elevenlabs_tts.py` |
| **Google TTS** | 免费、稳定 | 低成本原型 | `tools/audio/google_tts.py` |
| **Piper** | 本地离线、零成本 | 离线环境 | `tools/audio/piper_tts.py` |

推荐配置：
```python
# 通过 tts_selector 自动选择（preferred_provider 取频道配置里对应语言的默认引擎）
tts_selector.run({
    "text": "段落口播文本...",
    "language": "zh-CN",
    "preferred_provider": "<频道配置默认引擎>",  # 如中文默认豆包，见 project-context
    "voice_id": "<voice_id>",        # 特定音色 ID
    "output_path": "voice-s01.wav"
})
```

### 4. 逐段合成

对每段口播文本：
1. 调用选定 TTS 引擎生成音频
2. 输出格式：WAV（44.1kHz / 16bit）或 MP3（192kbps）
3. 命名规范：`voice-<scene_id>.wav`（如 `voice-s01.wav`、`voice-s02a.wav`）

### 5. 质量检查

逐段试听检查：
- **发音准确性**：技术术语（Remotion、Cursor、SSR 等）发音是否正确
- **节奏感**：是否有自然停顿和换气感
- **情感匹配**：关键段落（痛点、解决方案、结论）情感是否到位
- **时长对齐**：实际时长与脚本预估是否接近

如发现问题：
- 术语发音错误 → 用拼音标注或 SSML 标签修正
- 节奏太快/太慢 → 调整 `speed` 参数或插入 SSML `<break>` 标签
- 情感不足 → 切换 voice_id 或引擎

### 6. 可选：人工录音替代

如果用户选择人工录音而非 TTS：
- 录音规格：44.1kHz / 16bit WAV，单声道
- 降噪处理：使用 `audio_mixer.py` 的 normalize 功能
- 命名规范同上

### 7. 落盘归档

音频存放路径：
```
content-library/<epNN-slug>/06-tts/
├── README.md          # TTS 配置与素材清单
├── assets/
│   ├── voice-s01.wav
│   ├── voice-s02a.wav
│   ├── voice-s02b.wav
│   └── ...
```

`README.md` 格式：
```markdown
---
stage: 06-tts-synthesis
status: draft
source_workflow: /06-tts-synthesis
---

# epNN TTS 语音合成记录

## 配置
- TTS 引擎：<本期实际使用的引擎>
- 音色 ID：xxx
- 采样率：44.1kHz / 16bit WAV

## 素材清单

| 文件名 | 对应场景 | 口播文本摘要 | 时长 | 状态 |
|--------|---------|------------|------|------|
| voice-s01.wav | S1 开头钩子 | "兄弟们..." | 12s | ✅ |
| ... | ... | ... | ... | ... |

## 总时长
- 合计：XXX 秒（约 X 分 X 秒）
```

- 更新 `PIPELINE.md`：该期 06 列置 `draft`

### 8. 自我检查

- ❌ 发音预检是否完成（多音字 / 英文术语 / 数字写法三遍扫描，结果记入 README）？
- ❌ 所有 `[口播]` 段是否都有对应音频文件？
- ❌ 音频格式/采样率是否统一？
- ❌ 技术术语发音是否准确？
- ❌ 总时长是否在 5-10 分钟目标范围内？
- ❌ 是否有爆音、底噪、截断等瑕疵？

### 9. 交付与下一步

提示用户：
> TTS 语音就绪后（看板标 `approved`），结合录屏素材（05），可进入 `/07-video-assembly` 组装成片。

---

## 关联文件

- 上游：`04-script-draft.md`
- 下游：`07-video-assembly.md`
- OpenMontage 工具：`tools/audio/tts_selector.py`、`tools/audio/doubao_tts.py`、`tools/audio/openai_tts.py`、`tools/audio/elevenlabs_tts.py`、`tools/audio/google_tts.py`、`tools/audio/piper_tts.py`
