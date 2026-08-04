---
description: 封面生成 - 为各平台生成封面/缩略图（B站/抖音16:9、小红书1:1），遵循高点击率封面设计规范。
---

<!-- AUTO-GENERATED from shared/workflows/10-cover-gen.md. Do not edit here; edit the source and run `python scripts/sync_workflows.py`. -->

# 封面生成 Workflow (10-cover-gen)

为视频成片生成各平台所需的封面/缩略图，确保每张封面符合对应平台的尺寸规范和推荐算法偏好的视觉风格。

---

## 前置依赖

本工作流假设已完成 `/09-bgm-mix`，已具备：
- 混音就绪的 MP4 成片
- 处于 `approved` 状态的 `content-library/<epNN-slug>/04-script/README.md`（获取标题和核心钩子）

如果缺少上述输入，先提示用户回到对应上游阶段。

---

## 步骤

### 1. 确认封面需求

从脚本和分发方案中提取封面文案元素：
- **主标题**：视频核心卖点（如 "Cursor vs Windsurf 2026 终极对比"）
- **副标题/钩子**：痛点或结论（如 "你选的 AI IDE 可能已经落后了"）
- **关键数字/亮点**：如 "21 个必知要点"、"6 条决策路线"

### 2. 平台尺寸规范

| 平台 | 尺寸 | 宽高比 | 安全区 | 备注 |
|------|------|--------|--------|------|
| **B站** | 1920×1080 | 16:9 | 文字距边 ≥10% | 右下角避开时长标签 |
| **YouTube** | 1280×720 | 16:9 | 文字距边 ≥10% | 同 B站 |
| **抖音** | 1920×1080 | 16:9 | 文字距边 ≥10% | 技术教程横版，同 B站 |
| **小红书** | 1080×1080 | 1:1 | 底部 10% 避让标题栏 | 图文风格 |

### 3. 封面设计

#### 方案 A：从成片截帧 + 文字叠加

1. 使用 `frame_sampler.py` 从成片中抽取高信息量帧：
   ```python
   frame_sampler.run({
       "video_path": "OpenMontage/remotion-composer/out/<slug>-mixed.mp4",
       "strategy": "high_entropy",   # 选信息量最大的帧
       "count": 10
   })
   ```

2. 选取最佳帧作为底图，叠加文字：
   - 标题字号：≥72px（确保移动端可读）
   - 字体：思源黑体 Bold / Noto Sans SC Bold
   - 描边/阴影：确保在任何底图上可读
   - 颜色：高对比色（白字黑描边 / 黄字黑描边）

#### 方案 B：使用 OpenMontage showcase_card

```python
showcase_card.run({
    "title": "Cursor vs Windsurf 2026",
    "subtitle": "终极对比 · 21 个必知要点",
    "style": "tech_comparison",
    "dimensions": {"width": 1920, "height": 1080},
    "brand_color": "#4A90D9"
})
```

#### 方案 C：AI 生成 + 后处理

使用 `image_selector.py` 搜索素材库或 AI 生成底图，再叠加文字。

### 4. 多尺寸适配

基于主封面（16:9）派生其他尺寸：
- **1:1 方版**：居中裁剪，文字重排为上下结构（小红书）

### 5. 封面质量检查

- **移动端模拟**：缩小到手机屏幕大小（约 375×210 显示区），标题是否仍可读？
- **信息层级**：3 秒内能否看懂封面在说什么？
- **品牌一致性**：与系列其他视频封面风格是否统一？
- **安全区**：文字是否避开了平台 UI 遮挡区域？

### 6. 落盘归档

```
content-library/<epNN-slug>/10-cover/
├── README.md
├── assets/
│   ├── cover-bilibili-1920x1080.png    # B站/抖音/YouTube 横版
│   └── cover-xiaohongshu-1080x1080.png # 小红书方版
```

`README.md` 格式：
```markdown
---
stage: 10-cover-gen
status: draft
source_workflow: /10-cover-gen
---

# epNN 封面生成记录

## 封面方案
- 生成方式：截帧 + 文字叠加 / showcase_card / AI 生成
- 主标题：xxx
- 副标题：xxx

## 封面清单

| 平台 | 尺寸 | 文件 | 状态 |
|------|------|------|------|
| B站/抖音/YouTube | 1920×1080 | cover-bilibili-1920x1080.png | ✅ |
| 小红书 | 1080×1080 | cover-xiaohongshu-1080x1080.png | ✅ |
```

- 更新 `PIPELINE.md`：该期 10 列置 `draft`

### 7. 自我检查

- ❌ 每个目标平台是否都有对应尺寸的封面？
- ❌ 标题在手机端缩小后是否仍然可读？
- ❌ 文字是否避开了平台 UI 安全区？
- ❌ 封面风格是否与系列保持一致？
- ❌ 是否使用了高对比配色确保可读性？

### 8. 交付与下一步

提示用户：
> 封面就绪后（看板标 `approved`），成片即可发布到 B站、抖音等平台。GitHub 配套资源同步推送。

---

## 关联文件

- 上游：`09-bgm-mix.md`
- 下游：无（封面是流水线最后阶段，发布为人工动作）
- OpenMontage 工具：`tools/analysis/frame_sampler.py`、`tools/video/showcase_card.py`、`tools/graphics/image_selector.py`
