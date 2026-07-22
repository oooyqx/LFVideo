---
description: 字幕生成 - 从 07 props JSON 的 captions[] 转换为 SRT/VTT 外挂字幕文件，人工校对后交付平台上传。
---

<!-- AUTO-GENERATED from shared/workflows/08-subtitle-gen.md. Do not edit here; edit the source and run `python scripts/sync_workflows.py`. -->

# 字幕生成 Workflow (08-subtitle-gen)

将 07 组装阶段已生成的 `captions[]`（来自 06-tts 精确时间戳）转换为 SRT/VTT 外挂字幕文件，人工校对后交付上传。本阶段**不做语音转录**——文本和时间戳在 06-tts 已精确产出，08 只做格式转换和校对。

> **与 07 的分工**：07 负责画面内嵌字幕（CaptionOverlay 烧录在画面里，字体/位置/动画由 Remotion 控制）；08 负责外挂字幕（SRT/VTT 上传到 B站/YouTube/抖音，字体/位置由平台播放器控制）。两者数据源相同（06-tts manifest），输出格式不同，互不覆盖。

---

## 前置依赖

本工作流假设已完成 `/07-video-assembly`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/07-assembly/README.md`
- 已生成的 props JSON（`OpenMontage/remotion-composer/public/demo-props/<slug>.json`），其中 `captions[]` 已由 07 从 06-tts manifest 分页嵌入

如果缺少上述输入，先提示用户回到 `/07-video-assembly`。

---

## 步骤

### 1. 从 props JSON 提取 captions

读取 07 产出的 props JSON，提取 `captions[]`（已是分页后的 `{startMs, endMs, words[]}` 格式）：

```python
import json
props = json.loads(Path("OpenMontage/remotion-composer/public/demo-props/<slug>.json").read_text("utf-8"))
captions = props["captions"]  # [{startMs, endMs, words: [{word, startMs, endMs}]}]
```

> **Fallback：Whisper 转录**（仅当本期使用真人录音、无 06-tts manifest 时）
>
> 如果 props JSON 的 `captions[]` 为空（说明 06 未产出 TTS manifest，如真人录音场景），才需要从成片音频用 Whisper 转录：
> ```bash
> ffmpeg -i OpenMontage/remotion-composer/out/<slug>.mp4 -vn -acodec pcm_s16le -ar 16000 audio_for_whisper.wav
> ```
> ```python
> transcriber.run({"audio_path": "audio_for_whisper.wav", "language": "zh", "model": "large-v3", "word_timestamps": True})
> ```
> Whisper 转录后需额外做术语校对（见步骤 3），因为语音识别可能出错。

### 2. 转换为 SRT/VTT 格式

使用 `subtitle_gen.py` 将 `captions[]` 转为标准字幕格式：

```python
from tools.subtitle.subtitle_gen import captions_to_srt, captions_to_vtt

srt_text = captions_to_srt(captions)
vtt_text = captions_to_vtt(captions)
```

输出格式说明：
- **SRT**：通用字幕格式（B站、YouTube 均支持上传）
- **VTT**：Web 标准格式（部分平台优先支持）

> SRT/VTT 是纯文本+时间戳格式，字体/大小/颜色/位置由**平台播放器**控制，创作者只提供文字和时间轴。

### 3. 人工校对

逐条检查并修正：
- **断句合理性**：确保每条字幕在语义完整处断句，避免词语被截断
- **标点符号**：外挂字幕通常不加句末标点（平台规范），保留必要的分隔符
- **时间轴对齐**：检查字幕出现/消失时间是否与口播同步（06-tts 时间戳通常已精确，一般无需调整）
- **术语确认**：TTS 路径下文本来自 04 脚本，术语准确；Whisper fallback 路径需重点校对技术术语

### 4. 落盘归档

字幕存放路径：
```
content-library/<epNN-slug>/08-subtitle/
├── README.md
├── assets/
│   ├── <slug>.srt              # SRT 字幕
│   └── <slug>.vtt              # VTT 字幕
```

`README.md` 格式：
```markdown
---
stage: 08-subtitle-gen
status: draft
source_workflow: /08-subtitle-gen
---

# epNN 字幕生成记录

## 数据源
- [x] 从 07 props JSON captions[] 转换（TTS 路径）
- [ ] Whisper 转录（真人录音 fallback）

## 校对状态
- 断句调整：XX 处
- 标点处理：XX 处
- 总字幕条数：XXX 条

## 平台上传
- [ ] B站（SRT）
- [ ] YouTube（SRT/VTT）
- [ ] 抖音（SRT）
```

- 更新 `PIPELINE.md`：该期 08 列置 `draft`

### 5. 自我检查

- SRT/VTT 文件是否可正常加载播放？
- 字幕时间轴是否与口播同步（06-tts 路径误差 < 0.1s，Whisper 路径 < 0.3s）？
- 断句是否在语义完整处，无词语被截断？
- 外挂字幕是否与画面内嵌字幕（如 07 已烧录）内容一致？

### 6. 交付与下一步

提示用户：
> 外挂字幕就绪后（看板标 `approved`），可进入 `/09-bgm-mix` 添加背景音乐与混音。

> **平台字幕样式说明**：SRT/VTT 上传后，字体/大小/颜色/位置由各平台播放器控制，创作者无法干预。如需精确控制字幕视觉，走 07 画面内嵌字幕路径（CaptionOverlay 烧录）。

---

## 关联文件

- 上游：`07-video-assembly.md`（提供 props JSON `captions[]`）
- 数据源：`06-tts/assets/manifest.json`（TTS 精确时间戳）
- 下游：`09-bgm-mix.md`
- 工具：`tools/subtitle/subtitle_gen.py`（格式转换）、`tools/subtitle/segmentation.py`（分页 SSOT）、`tools/analysis/transcriber.py`（仅 Whisper fallback 路径）
