---
title: 录屏素材采集
slug: 05-b-roll-recording
stage: "05"
description: 录屏素材采集 - 按 04 分镜口播稿契约的 zoom_crop_directives 录制 IDE/终端操作演示，产出可直接嵌入 Remotion @VideoSlot 的录屏素材。
---

# 录屏素材采集 Workflow (05-b-roll-recording)

按 04 分镜口播稿契约中标注 `@VideoSlot` 的场景，录制真实 IDE / 终端操作演示。录屏素材在 07-video-assembly 阶段嵌入 `@VideoSlot` 组件；若录屏缺失，07 阶段将自动降级使用自动渲染兜底方案（`fallback_a_track`）。

---

## 前置依赖

本工作流假设已完成 `/04-script-draft`，已具备：
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`（末尾 JSON 契约含 `zoom_crop_directives` 与各 section 的 `@VideoSlot` / 自动渲染兜底；自 03+04 合并后，视听蓝图已并入此处）

如果缺少上述输入，先提示用户回到对应上游阶段。

---

## 步骤

### 1. 提取录屏清单

从 `04-script/README.md` 末尾的 JSON 契约块中提取所有 `@VideoSlot` 场景：
- 场景编号（如 S5a、S5b、S5c）
- `zoom_crop_directives`：录屏时的裁剪/缩放指令
- `src` 占位描述：录屏内容说明
- `fallback_a_track`：自动渲染兜底方案（用于判断优先级）

输出录屏任务清单表：

| # | 场景 | 录屏内容 | zoom_crop | 预估时长 | 优先级 |
|---|------|---------|-----------|---------|--------|
| 1 | S5a-left | IDE录屏—AI从零手写组件 | `crop: editor_only` | 25s | 高（有自动渲染兜底但实录更真实） |
| ... | ... | ... | ... | ... | ... |

### 2. 准备录屏环境

- 打开目标项目工程（如 `OpenMontage/remotion-composer`）
- 调整 IDE 主题为深色（统一视觉风格）
- 字体大小设为 ≥16px（确保 1080p 下可读）
- 关闭无关 Tab、通知和系统弹窗
- 如使用 OpenMontage 工具，可调用 `screen_capture_selector.py` 选择最佳录屏方案

### 3. 优先尝试自动化采集（无需真人在场）

先对照下表判断每条任务能否由 `OpenMontage/tools/capture/` 的自动化工具产出，能自动化的不再排真人录制：

| 画面类型 | 工具 | 真实性保障（F-06/TAD-01） |
|---------|------|--------------------------|
| GitHub / 文档页面截图或滚动录制 | `github_page_capture`（`screenshot` / `scroll_record`） | 无头浏览器渲染真实 URL，产物带 `.provenance.json` 源地址边车 |
| 终端/CLI 操作演示（含真实报错复现） | `scripted_terminal_recorder` | 命令**真实执行**、输出真实捕获，仅执行者从人变为脚本；完整 transcript 落盘可审计；禁止手写假输出 |
| AI 对话过程展示 | `chat_replay_recorder` | 只回放**真实发生过的对话导出件**（缺 `provenance.source` 拒执行）；画面常驻「对话回放 · 真实记录」角标；允许裁剪、禁止改写内容 |

- 三个工具均产出 1920×1080 / 30fps MP4（或 PNG），命名仍按 `b-<scene_id>.mp4` 落 `assets/`，`.provenance.json` 边车一并归档。
- 依赖：`pip install playwright && python -m playwright install chromium`（另需 ffmpeg 转 MP4）。
- **红线不变**：凡需要真实 IDE GUI 操作、无法由上述工具真实产出的画面，仍按 F-06 标 `[录屏占位：请提供 xxx.png/mp4]` 交真人，或降级自动渲染兜底。

### 4. 逐条录制（仅剩余真人任务）

对每条录屏任务：

1. **设置裁剪区域**：按 `zoom_crop_directives` 配置屏幕录制区域
   - `crop: editor_only` → 仅录代码编辑区
   - `crop: terminal_only` → 仅录终端区域
   - `crop: full_ide` → 录完整 IDE 窗口
2. **执行操作**：按脚本 `[画面]` 描述执行真实操作
3. **录制**：使用 OBS / OpenMontage `screen_recorder.py` / `cap_recorder.py` 录制
4. **命名规范**：`b-<scene_id>.mp4`（如 `b-s5a-left.mp4`、`b-s5b-right.mp4`）

### 5. 素材后处理

- 裁剪首尾空白（保留操作核心部分）
- 统一分辨率：1920×1080（或按 zoom_crop 裁剪后的目标分辨率）
- 统一帧率：30fps
- 可选：使用 `video_trimmer.py` 或 `silence_cutter.py` 去除静默段

### 6. 落盘归档

素材存放路径：
```
content-library/<epNN-slug>/05-b-roll/
├── README.md          # 录屏清单与状态
├── assets/
│   ├── b-s5a-left.mp4
│   ├── b-s5a-right.mp4
│   ├── b-s5b-left.mp4
│   ├── b-s5b-right.mp4
│   └── b-s5c.mp4
```

`README.md` 格式：
```markdown
---
stage: 05-b-roll-recording
status: draft
source_workflow: /05-b-roll-recording
---

# epNN 录屏素材清单

| 文件名 | 对应场景 | 时长 | 分辨率 | 状态 |
|--------|---------|------|--------|------|
| b-s5a-left.mp4 | S5a 左侧（从零手写） | 25s | 1920×1080 | ✅ 已录 |
| ... | ... | ... | ... | ... |

> 未录制的场景将在 07 组装阶段使用自动渲染兜底方案（`fallback_a_track`）渲染。
```

- 更新 `PIPELINE.md`：该期 05 列置 `draft`

### 7. 自我检查

- ❌ 所有 `@VideoSlot` 场景是否都有对应录屏（或明确标注使用自动渲染兜底）？
- ❌ 自动化采集的素材是否都有 `.provenance.json` 边车（来源可审计）？
- ❌ 录屏分辨率/帧率是否统一？
- ❌ 录屏内容是否与脚本 `[画面]` 描述一致？
- ❌ 文件命名是否符合 `b-<scene_id>.mp4` 规范？

### 8. 交付与下一步

提示用户：
> 录屏素材就绪后（看板标 `approved`），可并行执行 `/06-tts-synthesis` 生成口播音频，然后进入 `/07-video-assembly` 组装成片。

---

## 关联文件

- 上游：`04-script-draft.md`（已合并原 03 视听蓝图）
- 下游：`07-video-assembly.md`
- OpenMontage 工具：`tools/capture/screen_recorder.py`、`tools/capture/cap_recorder.py`、`tools/capture/screen_capture_selector.py`、`tools/capture/github_page_capture.py`、`tools/capture/scripted_terminal_recorder.py`、`tools/capture/chat_replay_recorder.py`
