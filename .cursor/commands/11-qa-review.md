<!-- AUTO-GENERATED from shared/workflows/11-qa-review.md. Do not edit here; edit the source and run `python scripts/sync_workflows.py`. -->

# 成片质检 Workflow (11-qa-review)

在分发前对成片进行系统化质量检测（QA），包括自动化检测（画面质量、音频响度、字幕溢出、防静止）和人工复核（内容准确性、品牌一致性），确保发布前零低级错误。

---

## 前置依赖

本工作流假设已完成 `/10-cover-gen`，已具备：
- 混音成片 MP4（含 BGM 和口播）
- 字幕文件 SRT/VTT
- 各平台封面图
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`（用于内容核对）

如果缺少上述输入，先提示用户回到对应上游阶段。

---

## 步骤

### 1. 画面质量检测

使用 `visual_qa.py` 自动检测：

```python
visual_qa.run({
    "video_path": "OpenMontage/remotion-composer/out/<slug>-mixed.mp4",
    "checks": [
        "resolution",        # 分辨率 ≥ 1080p
        "black_frames",      # 检测黑帧/空白帧
        "text_readability",  # 文字大小 ≥ 24px
        "color_contrast"     # 文字与背景对比度
    ]
})
```

检查项：
- **分辨率**：≥ 1920×1080
- **帧率**：30fps 稳定
- **黑帧/空白帧**：不得出现非预期黑帧
- **文字可读性**：画面中文字 ≥ 24px
- **色彩对比度**：文字与背景对比度 ≥ 4.5:1（WCAG AA）

### 2. 防静止合规检测

使用 `video_understand.py` + `scene_detect.py` 检测：

```python
video_understand.run({
    "video_path": "OpenMontage/remotion-composer/out/<slug>-mixed.mp4",
    "analysis_type": "motion_detection",
    "static_threshold_seconds": 15   # 静止超过 15s 即告警
})
```

检查项：
- **静止帧检测**：是否存在连续 > 15s 无画面变化的段落？
- **动画密度**：每 10-15s 是否至少有一次可见动画变化？
- 如发现违规 → 标记时间点，建议回到 07 阶段补充动画

### 3. 音频质量检测

使用 `audio_energy.py` 检测：

```python
audio_energy.run({
    "audio_path": "OpenMontage/remotion-composer/out/<slug>-mixed.mp4",
    "checks": ["loudness", "clipping", "silence", "balance"]
})
```

检查项：
- **响度标准**：整体 -14 ± 1 LUFS
- **爆音/削波**：任何位置 dBFS > -1 即告警
- **静默段**：非预期静默 > 3s 即告警
- **口播清晰度**：BGM ducking 后人声是否清晰
- **左右声道平衡**：立体声是否平衡

### 4. 字幕校验

检查项：
- **SRT/VTT 格式**：文件是否能正常解析
- **时间轴同步**：字幕与口播的偏差 < 0.3s
- **每行字数**：≤ 20 中文字符
- **行数**：≤ 2 行
- **术语一致性**：技术术语拼写是否与脚本一致

### 5. 内容准确性复核（人工）

对照 04 脚本和 tutorial.final.md 检查：
- **必讲要点覆盖**：本期全部必讲要点是否都在成片中出现？（要点清单与条数以该期 `04-script` 末尾「必讲要点覆盖清单」为准）
- **数据准确性**：对比表格数据、代码示例是否与 tutorial.final.md 一致？
- **录屏匹配**：录屏内容是否与脚本描述一致？（或自动渲染兜底是否正确渲染？）

### 6. 封面复核

- 各平台封面文字是否与最终定稿标题一致？
- 封面是否在移动端可读？
- 尺寸是否正确（16:9 / 9:16 / 1:1）？

### 7. 生成质检报告

汇总所有检测结果，生成质检报告：

```markdown
---
stage: 11-qa-review
status: draft
source_workflow: /11-qa-review
---

# epNN 成片质检报告

## 自动检测结果

| 检测项 | 结果 | 详情 |
|--------|------|------|
| 分辨率 | ✅ PASS | 1920×1080 @ 30fps |
| 黑帧检测 | ✅ PASS | 0 处黑帧 |
| 文字可读性 | ✅ PASS | 最小字号 28px |
| 防静止 | ⚠️ WARN | 02:15-02:32 静止 17s（建议补动画） |
| 响度 | ✅ PASS | -13.8 LUFS |
| 爆音 | ✅ PASS | 0 处削波 |
| 字幕同步 | ✅ PASS | 最大偏差 0.2s |

## 人工复核

| 检测项 | 结果 | 备注 |
|--------|------|------|
| 必讲要点覆盖 | ✅ 21/21 | |
| 数据准确性 | ✅ PASS | |
| 录屏/自动渲染兜底 | ✅ PASS | S5c 使用自动渲染兜底 |
| 封面 | ✅ PASS | 3 个平台封面已确认 |

## 结论
- [x] 质检通过，可进入分发
- [ ] 需返工（标注具体问题和对应阶段）
```

### 8. 落盘归档

```
content-library/<epNN-slug>/11-qa/
├── README.md    # 质检报告
```

- 更新 `PIPELINE.md`：该期 11 列置 `draft`

### 9. 处理不合格项

如存在不合格项：
- **画面问题** → 返回 `/07-video-assembly`
- **音频问题** → 返回 `/09-bgm-mix`
- **字幕问题** → 返回 `/08-subtitle-gen`
- **封面问题** → 返回 `/10-cover-gen`

标注具体问题和修复建议，通知用户后等待修复。

### 10. 交付与下一步

全部检测通过后，提示用户：
> 质检通过（看板标 `approved`）后，可进入 `/12-distribute-adapt` 做多平台分发适配。

---

## 关联文件

- 上游：`10-cover-gen.md`
- 下游：`12-distribute-adapt.md`
- OpenMontage 工具：`tools/analysis/visual_qa.py`、`tools/analysis/video_understand.py`、`tools/analysis/scene_detect.py`、`tools/analysis/audio_energy.py`、`tools/analysis/composition_validator.py`
