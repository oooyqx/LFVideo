# video-background

随机轮播的**背景视频**放这里。它们会被用作 Remotion 模板的「整体背景层」（即被 warp 透视贴进房间屏幕的那一层），由 `<Background variant="video" />` 渲染。

## 怎么用

1. 把视频文件（`.mp4` / `.webm` / `.mov`）丢进本文件夹。
2. 重新生成清单：

   ```bash
   python scripts/gen_video_bg_manifest.py
   ```

   这会扫描本目录、把文件名写进 `manifest.json`（`VideoCarousel` 读取它来轮播）。
3. 任意 cut 用视频背景：在 `content-library/ep02-video-render/07-assembly/build_props.py` 把该 cut 的 `"background"` 设为 `"video"`，或在 Studio 的 `BackgroundShowcase` 合成里查看 `video` 段。

## 渲染特性（见 `src/custom-templates/background/VideoCarousel.tsx`）

- **灰度 → 透明**：用 SVG `feColorMatrix` 把每个像素的亮度(luminance)解析为 alpha——越亮越不透明、越暗越透明，原始颜色保留。所以「黑底亮色」的特效视频会作为发光叠层融进全息蓝底。需要反相（亮处透明）时给组件传 `invert`。
- **随机轮播**：用确定性随机（`remotion` 的 `random()` 播种）打乱顺序，保证导出可复现。
- **交叉淡入淡出**：切换视频时上一段淡出、下一段淡入。

## 关于体积 / git

测试用的小视频已纳入版本控制。若放入大体积视频，建议改用 git-lfs 或不提交（把对应文件加进 `.gitignore`），避免仓库膨胀。
