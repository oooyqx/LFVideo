---
stage: 10-cover-gen
status: draft
source_workflow: /10-cover-gen
---

# ep02 封面生成记录

## 封面方案
- 生成方式：成片截帧（frame_0001，开场 IntroScene 0s）+ 半透明遮罩 + 文字叠加
- 底图：深色科技底 + 白字，与频道统一风格一致
- 字体：微软雅黑 Bold（msyhbd.ttc）/ 微软雅黑（msyh.ttc）

## 封面文案
- 主标题：用 Vibe Coding
- 副标题：搭一套能自动出片的视频渲染引擎
- 钩子：把视频写成代码，让 AI 按配置自动出片
- 亮点：AI 找路径 → 人做选型 → 自动出片

## 封面清单

| 平台 | 尺寸 | 文件 | 状态 |
|------|------|------|------|
| B站/YouTube | 1920×1080 | cover-bilibili-1920x1080.png | ✅ |
| 抖音 | 1080×1920 | cover-douyin-1080x1920.png | ✅ |
| 小红书 | 1080×1080 | cover-xiaohongshu-1080x1080.png | ✅ |

## 产物文件
```
content-library/ep02-video-render/10-cover/
├── README.md
├── assets/
│   ├── cover-bilibili-1920x1080.png      # B站/YouTube 横版
│   ├── cover-douyin-1080x1920.png        # 抖音竖版
│   ├── cover-xiaohongshu-1080x1080.png   # 小红书方版
│   └── frames/                            # 截帧候选（10 帧）
```
