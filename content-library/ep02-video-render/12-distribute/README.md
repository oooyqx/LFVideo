---
stage: 12-distribute-adapt
status: suspended
source_workflow: /12-distribute-adapt
upstream_inputs:
  - 04-script/README.md (status: approved)
  - 07-assembly/README.md (status: approved)
---

> ⏸️ **本阶段已挂起（suspended）**：当前专注视频本体（04→07 渲染主线），其他平台分发暂不推进。
> 文案已按当前 04 重写、可随时启用；恢复时把状态改回 `draft` 并在 `PIPELINE.md` 同步即可。

# ep02 多平台分发方案：《代码即视频（Video-as-Code）：把一条视频做成可编译、可复用、可被 AI 接管的工程》

> 本文案严格对齐 04 脚本（SSOT）的叙事：**代码即视频（Video-as-Code）+ 流程即代码（Pipeline-as-Code）**，主线是「声明式代码/数据 → Frame 传送带 → 编译成帧 → 合成 MP4」的数字渲染生产线。
> 反噱头纪律（来自 04）：不以"多少行代码/效率多少倍"为卖点；SSR `window` 问题定位为"选这条路要付的**工程税**"，不是致命噱头。

---

## 1. B站 / YouTube 发布方案

### 标题

**主标题**：《代码即视频：把一条视频做成可编译、可复用、能被 AI 接管的工程》

**备用标题**：《Video-as-Code 实战：用 Remotion 把 React 组件编译成成片，以及这条路要付的"税"》

### 简介描述栏

```
传统剪辑的心智模型是"轨道 + 绝对时间轴"。这期换一种思路：把视频当代码写——声明式的数据和组件，编译成帧，再合成 MP4。

这不是"哪个工具最火用哪个"，而是一次完整的工程化拆解：从"帧即状态"的本质，到六条技术路线的判断层矩阵，再到为什么我们最终选了 Remotion，以及这条路真正要付的工程税。

🔍 核心看点：
• 帧即状态：INPUT → COMPILE → OUTPUT，视频是被"编译"出来的
• 六条技术路线横评：代码即视频 ≠ Remotion，它是一类范式
• 判断层矩阵：六个方案对号入座，讲清各自的边界与翻车场景
• 选型：Remotion 胜出的四个理由，以及如实交代的代价
• 流程即代码：选题→策划→脚本→组装的七阶段流水线 + 最小编排器
• 工程税：SSR 预渲染没有 window，用 typeof 守卫 + 一条 MDC 规则把"踩坑"变成"自动规避"

🛠️ 配套资源：
• 完整 Remotion 工程：github.com/yourname/ai-ide-workflows
• 防 SSR 报错的 MDC 规则模板：.cursor/rules/remotion-ssr.mdc

⏱️ Timeline：
00:00 你以为在写代码，其实在写视频
01:30 代码即视频的六条技术路线
02:30 判断层矩阵：六个方案对号入座
03:50 为什么是 Remotion（四理由 + 对照 + 代价）
05:30 流程即代码：七阶段流水线与编排器
08:00 实操避坑：数据驱动复用，而不是让 AI 从零手写
08:55 SSR 工程税：typeof 守卫 + MDC 规则
09:45 render 出片与下期预告

下期：Whisper 毫秒级字幕卡点

#Remotion #ReactVideo #视频自动化 #前端工程化 #Cursor #AI编程
```

### 分区 + 标签

- **主分区**：科技 → 计算机技术
- **话题标签**：`Remotion`、`React`、`视频自动化`、`代码即视频`、`前端工程化`、`Cursor`、`AI编程`、`声明式渲染`
- **创作类型**：自制

### 置顶评论

```
📦 资源汇总：
• 本期 Remotion 工程代码：github.com/xxx（在简介）
• 防 SSR 报错的 MDC 规则模板：评论区第一条回复

💬 你会用"轨道 + 时间轴"还是"代码 + 编译"来做下一条视频？聊聊你的取舍。
```

---

## 2. 小红书图文方案

### 标题

**主标题**：把视频当代码写：声明式数据 → 编译成片，我踩平的几个坑

**备用标题**：代码即视频不只是 Remotion——一张判断层矩阵讲清六条路线怎么选

### 正文

```
程序员的浪漫：不用 PR/AE 一帧帧剪，而是写代码 → 编译成 MP4。

但"代码即视频"不等于"装个 Remotion 就行"，这里面有取舍。

🧱 先换脑子：帧即状态。给定第 N 帧，组件按数据算出该长什么样，视频是被"编译"出来的，不是手摆出来的。

🗺️ 六条技术路线：Remotion、Motion Canvas、Manim、MoviePy、PixiJS、FFmpeg——它们共享同一个内核，但适用场景完全不同。

🎯 判断层矩阵：不做中立综述，直接对号入座——A 轨概念动画用 Remotion，B 轨实拍/合成用 MoviePy/FFmpeg。

🧩 实操原则：首选数据驱动现成组件，别让 AI 从零手写一整个场景。

⚠️ 要付的税：SSR 预渲染阶段没有 window，代码在浏览器预览正常、一编译就报错。解法不是改一次代码，而是写一条 MDC 规则让 Cursor 自动加 typeof 守卫。

🛠️ 完整工程和 MDC 模板放 GitHub 了，简介自取。

下期讲 Whisper 字幕卡点，蹲。

#Remotion #React #视频自动化 #代码即视频 #前端工程化 #Cursor #AI编程
```

### 卡片配图方案（9张）

| 序号 | 卡片内容 | 视觉元素 |
|:---|:---|:---|
| 1 | 标题卡：代码即视频 Video-as-Code | 代码编辑器 → 视频播放 icon |
| 2 | 心智模型对比：轨道时间轴 vs 代码编译 | 左右分屏对照 |
| 3 | 帧即状态：INPUT → COMPILE → OUTPUT | 三步骤箭头流程 |
| 4 | 六条技术路线一览 | 六行表格 + 内核高亮 |
| 5 | 判断层矩阵：六方案对号入座 | 矩阵 + ✅/⚠️ 标记 |
| 6 | 为什么选 Remotion（四理由） | 四卡片 + "数据驱动模板"决定性高亮 |
| 7 | **边界/避坑卡**：SSR 工程税 | ❌ window 崩溃 → ✅ typeof 守卫 + MDC 规则 |
| 8 | 流程即代码：七阶段流水线 | 时间线七节点 |
| 9 | CTA：GitHub 资源 + 下期预告 | 二维码 + 关注引导 |

> 第 7 张为差异化「边界/避坑指南」卡，如实呈现代价，不包装成"零成本"。

### 话题标签

`#Remotion` `#React` `#视频自动化` `#代码即视频` `#前端工程化` `#Cursor` `#AI编程` `#声明式渲染`

---

## 3. 知乎文章方案

### 标题

《代码即视频（Video-as-Code）：Remotion 选型、判断层边界与 SSR 工程税》

### 文章结构

**引子**（200字）：
视频自动化是当下的技术热点。"代码即视频"提出用声明式代码/数据编译出成片，但工程落地不是装个库就行，关键在于选型判断与边界处理。本文基于一条真实成片的制作过程，拆解从范式到落地的完整链路。

**操作层：帧即状态与编译模型**（600字）：
• 传统心智："轨道 + 绝对时间轴"；新心智："帧即状态"
• INPUT → COMPILE → OUTPUT：React 组件如何映射为帧序列
• 数据驱动复用 vs 从零手写：为什么首选喂 data 给现成组件

**操作层：六条技术路线横评**（600字）：
• Remotion / Motion Canvas / Manim / MoviePy / PixiJS / FFmpeg 的共同内核
• 代码即视频是一类范式，不等于某一个库

**判断层：选型矩阵与边界**（800字）：
• 判断层矩阵：六方案对号入座（A 轨 Remotion / B 轨 MoviePy·FFmpeg）
• Remotion 胜出的四个理由，与 Remotion vs HyperFrames 的对照
• 如实交代的选型代价：不回避这条路的成本

**判断层：SSR 工程税与被动约束**（400字）：
• 问题：SSR 预渲染阶段没有 window，预览正常、编译报错
• 解法：typeof window 守卫；进一步用一条 MDC 规则让 AI 自动规避
• 验收标准：`npx remotion render` 零报错输出 MP4

**结语**（200字）：
代码即视频加流程即代码，把内容生产从手工活变成可维护的工程流水线。工具不是重点，能讲清边界与验收的判断力才是。

### 话题标签

`Remotion`、`React`、`视频自动化`、`前端工程化`、`AI编程`

---

## 4. 短视频切片清单（9:16 竖版）

| 切片类型 | 时间区间 | 用途 | Hook 文案 |
|:---|:---|:---:|:---|
| 反预期开场 | 00:00–00:30 | 抖音 / 小红书 | "你以为你在写代码，其实你在写视频。" |
| 数据冲击 | 02:30–03:00 | 抖音 | "六个做视频的技术方案，一张矩阵讲清各自在哪翻车。" |
| 高光操作 | 08:00–08:55 | 抖音 / 小红书 | "别让 AI 从零手写场景——只喂数据给现成组件，这才是复用。" |
| 边界/避坑瞬间 | 08:55–09:45 | 小红书 | "一编译就报 window is not defined？一条规则让 AI 自动避开。" |

---

## 5. 跨平台一致性检查

| 检查项 | 状态 | 说明 |
|:---|:---:|:---|
| 与 04 脚本叙事一致 | ✅ | 主线为"代码即视频 + 流程即代码"，与 04 的 16 段结构对应 |
| 判断层立场保留 | ✅ | 保留判断层矩阵、选型代价、SSR 工程税的边界与验收 |
| 反噱头纪律 | ✅ | 不含"多少行代码/效率多少倍"卖点；SSR 定位为工程税 |
| 标题党控制 | ✅ | 标题信息量优先，钩子不透支结论 |
| 下期预告 | ✅ | 统一预告"Whisper 字幕卡点" |

---

## 6. 结构化校验块 (JSON Schema Block)

```json
{
  "distribute_spec": {
    "episode_slug": "ep02-video-render",
    "status": "draft",
    "aligned_to": "04-script/README.md",
    "platforms": ["bilibili", "xiaohongshu", "zhihu", "douyin"]
  },
  "bilibili": {
    "title": "代码即视频：把一条视频做成可编译、可复用、能被 AI 接管的工程",
    "tags": ["Remotion", "React", "视频自动化", "代码即视频", "前端工程化", "Cursor", "AI编程", "声明式渲染"],
    "has_timeline": true,
    "top_comment_ready": true
  },
  "xiaohongshu": {
    "title": "把视频当代码写：声明式数据 → 编译成片，我踩平的几个坑",
    "card_count": 9,
    "tags": ["Remotion", "React", "视频自动化", "代码即视频", "前端工程化", "Cursor", "AI编程"],
    "highlight_cards": ["判断层矩阵", "Remotion 选型", "SSR 工程税避坑"]
  },
  "zhihu": {
    "title": "代码即视频（Video-as-Code）：Remotion 选型、判断层边界与 SSR 工程税",
    "word_count_estimate": 2800,
    "sections": ["引子", "操作层-帧即状态", "操作层-六条路线", "判断层-选型矩阵", "判断层-SSR工程税", "结语"],
    "tags": ["Remotion", "React", "视频自动化", "前端工程化", "AI编程"]
  },
  "douyin": {
    "enabled": true,
    "clips": 4
  },
  "judgment_layer_check": {
    "consistent_messaging": true,
    "ai_limitations_preserved": true,
    "no_clickbait_override": true,
    "resource_links_valid": true
  }
}
```
