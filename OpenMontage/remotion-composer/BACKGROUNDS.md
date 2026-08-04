# 背景系统（Background System）

模板场景一律**全透明**，画面底全部由独立的背景层 `Background` 统一渲染。配色不跟随场景主题，而是由一份独立的全息蓝调色板 `HOLOGRAPHIC` 驱动，便于把背景观感单独演进。

- 组件：`src/custom-templates/background/Background.tsx`
- 特效：`src/custom-templates/background/holographicEffects.tsx`
- 在线目录（每个特效演示 5 秒 + 调用方式）：Studio 里的 **`BackgroundShowcase`** 合成
  （源码 `src/BackgroundShowcase.tsx`）。

```bash
# 本地打开目录预览
npx remotion studio        # 选 BackgroundShowcase 合成
# 或渲染成 mp4
npx remotion render BackgroundShowcase out/backgrounds.mp4
```

---

## 1. 整层调用：`<Background variant=... />`

最常用法——直接选一个 variant，背景层自动把对应的全息特效组合好。

```tsx
import {Background} from './custom-templates';

<Background variant="holo" />
```

| variant | 组成 | 适用 |
| --- | --- | --- |
| `gradient`（默认） | 网格渐变底 + 斜向光束 + 扫描线 | 通用底，文字密的场景 |
| `grid` | 渐变底 + 透视网格地板 + 扫描线 | 表格 / 数据类 |
| `particles` | 渐变底 + 漂浮粒子 + 扫描线 | 轻量点缀 |
| `holo` | 网格地板 + 光束 + 丝线 + 扫描线（满配） | 开场 / 概念 / 结尾等想要强全息感的镜头 |
| `video` | 全息底 + **随机轮播背景视频**（灰度→透明 + 交叉淡入淡出）+ 扫描线 | 想用视频纹理做动态全息底 |
| `transparent` | 不画任何底（返回 `null`） | 让下层数字人 / 房间图直接透出 |

也支持图片 / 视频底（优先级高于 variant）：

```tsx
<Background image="/some.png" overlayOpacity={0.55} />
<Background video="/clip.mp4" videoStartFrom={0} />
```

### 在 ep02 数据流里怎么选
每个 cut 的 `background` 字段就是 variant 名。改 `content-library/ep02-video-render/07-assembly/build_props.py` 里
`SHOT_OVERRIDES[...]["background"]` 后重新生成 props：

```bash
python content-library/ep02-video-render/07-assembly/build_props.py
```

---

## 1.5 视频轮播底：`variant="video"` / `<VideoCarousel />`

把一组背景视频**随机轮播**作为背景层。关键特性：

- **灰度 → 透明**：用 SVG `feColorMatrix` 把每个像素的亮度(luminance)解析为 alpha——越亮越不透明、越暗越透明，原始颜色保留。所以「黑底亮色」的特效视频会作为发光叠层融进下层全息蓝底。需要反相（亮处透明）时传 `invert`。
- **随机轮播**：用 Remotion 的确定性随机 `random()` 打乱顺序，导出可复现。
- **交叉淡入淡出**：切换视频时上一段淡出、下一段淡入（重叠 `fadeSec`）。
- 帧驱动，无 `requestAnimationFrame` / CSS keyframes。

### 放视频 + 登记

```bash
# 1) 把 .mp4/.webm/.mov 丢进：
#    remotion-composer/public/video-background/
# 2) 重新生成清单（扫描目录写入 manifest.json）：
python scripts/gen_video_bg_manifest.py
```

清单为空时 `variant="video"` 自动退化成纯全息底（不报错）。

### 单独使用组件

```tsx
import {VideoCarousel} from './custom-templates';

<VideoCarousel clipDurationSec={6} fadeSec={1} invert={false} />
```

| 组件 | 可调 props |
| --- | --- |
| `<VideoCarousel />` | `videos?`（默认读 manifest.json）、`clipDurationSec`（默认 6）、`fadeSec`（默认 1）、`invert`（默认 false）、`seed`（换顺序）、`objectFit`（`cover`/`contain`） |

源码：`src/custom-templates/background/VideoCarousel.tsx`。

---

## 2. 单独特效组件

想自己拼，或在新场景里单独叠某个特效——直接用下面的组件。它们都**帧驱动、确定性**
（用 `useCurrentFrame()` / `osc01()`，不依赖 `requestAnimationFrame`，导出逐帧一致），
都接收一个 `colors: Palette`，颜色从 `accent[]` 取。

```tsx
import {
  Beams, Threads, RetroGrid, Scanlines, HOLOGRAPHIC,
} from './custom-templates';
import {AbsoluteFill} from 'remotion';

// 在自定义底色上叠两层特效
<AbsoluteFill style={{background: `linear-gradient(135deg, ${HOLOGRAPHIC.bg.from}, ${HOLOGRAPHIC.bg.to})`}}>
  <RetroGrid colors={HOLOGRAPHIC} />
  <Beams colors={HOLOGRAPHIC} count={6} />
  <Scanlines colors={HOLOGRAPHIC} />
</AbsoluteFill>
```

| 组件 | 作用 | 可调 props |
| --- | --- | --- |
| `<Beams colors count? />` | 斜向光束，缓慢飘移 / 明灭 | `count`（默认 6） |
| `<Threads colors count? />` | 水平正弦丝线，相位随帧推进 | `count`（默认 5） |
| `<RetroGrid colors speed? />` | 透视网格地板 + 地平辉光，向地平线推进 | `speed`（默认 0.8） |
| `<Scanlines colors />` | CRT 扫描线 + 缓慢竖向扫掠 | — |

> 全部用 `mixBlendMode: 'screen'` 叠加，所以叠在亮色底上更出彩；叠在暗底上偏含蓄。

---

## 3. 新增一个特效

1. 在 `holographicEffects.tsx` 里按同样接口写一个 `React.FC<{colors: Palette; ...}>`，
   用 `useCurrentFrame()` 驱动（不要用 CSS `@keyframes ... infinite`，Remotion 逐帧渲染不推进）。
2. 需要的话在某个 `Background` variant 里把它组合进去。
3. 往 `src/BackgroundShowcase.tsx` 的 `DEMOS` 数组加一项，目录里就会多出一段 5 秒演示。

---

## 4. 与 warp（房间屏幕）的关系

ep02 走 warp 路径时，整块 UI 以 `screenOpacity`（默认 `0.4`）半透明贴进房间屏幕四边形，
背景层就在这块半透明底里——这是「全息投影」通透感的来源，也是特效在成片里偏含蓄的原因。
想让特效在画面里更实，可调高 `unityBackground.screenOpacity`（如 `0.6`）。
