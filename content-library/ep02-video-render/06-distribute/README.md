---
stage: 06-distribute-adapt
status: superseded
source_workflow: /06-distribute-adapt
superseded_by: 12-distribute/README.md
upstream_inputs:
  - 04-script/README.md (status: approved)
---

> ⚠️ **本文件已作废（superseded），仅作历史留存，请勿发布。**
> 它产出于 04 脚本**改写之前**的旧叙事（"100 行 React / SSR 报错 / MDC 解法"），
> 与当前 04 的内容模型（《代码即视频 Video-as-Code》：六条技术路线 + 判断层矩阵 + Remotion 选型 + 七阶段流水线）**完全不是同一条视频**。
> 此外，"分发改写"在当前流水线看板里是 **12 阶段**，本文件落在 `06` 槽位属于历史编号遗留（06 槽位现为 TTS）。
> 已按当前 04 重写并迁移到正确槽位：**`12-distribute/README.md`**（status: draft）。本文件不参与门禁（`pipeline_lint.py` 按 `status: superseded` 跳过）。

# ep02 多平台分发方案：《代码即视频：如何用 100 行 React 代码编译卡点与图表动效？》

---

## 1. B站 / YouTube 发布方案

### 标题

**主标题**：《代码即视频：我用 100 行 React 编译动效，结果卡在 SSR 报错》

**备用标题**：《Remotion 实测：AI 写 React 视频代码，window is not defined 怎么解？》

### 简介描述栏

```
用代码写视频，是程序员的终极浪漫。但这事有个大坑。

本期用 Remotion 把 React 组件编译成 4K MP4，实测 AI IDE 在 SSR 预渲染阶段的硬边界。

🔍 核心看点：
• Remotion 底层机制：Frame 与 Seconds 的数学映射
• 致命踩坑：window is not defined 报错现场还原
• 解法：一条 MDC Rule 让 Cursor 自动避开 SSR 陷阱

🛠️ 配套资源：
• 完整代码：github.com/yourname/ai-ide-workflows
• MDC 规则模板：.cursor/rules/remotion-ssr.mdc

⏱️ Timeline：
00:00 代码即视频的原理
02:30 SSR 报错翻车现场
04:30 MDC 被动约束解法
07:00 成片输出与下期预告

下期：Whisper 毫秒级字幕卡点

#Remotion #React #视频自动化 #Cursor #AI编程
```

### 分区 + 标签

- **主分区**：科技 → 计算机技术
- **话题标签**：`Remotion`、`React`、`视频自动化`、`Cursor`、`AI编程`、`前端工程化`、`SSR报错`、`MDC规则`
- **创作类型**：自制

### 置顶评论

```
📦 资源汇总：
• 本期 Remotion 工程代码：github.com/xxx（在简介）
• MDC Rule 防 SSR 报错模板：评论区第一条回复

💬 你踩过 window is not defined 的坑吗？评论区说说场景。
```

---

## 2. 小红书图文方案

### 标题

**主标题**：😭 用代码写视频，编译时疯狂报错 window is not defined

**备用标题**：💡 一条规则让 AI 自动避开 Remotion SSR 深坑

### 正文

```
程序员的浪漫：写 React 代码 → 编译成 4K 视频。

但别急着浪漫，有个坑 90% 的人都会踩。

💥 坑点：Remotion SSR 预渲染阶段，Node 环境没有 window
AI 写的代码在浏览器预览正常，一编译就红屏报错

✅ 解法：不用改代码，写一条 MDC 被动约束规则
让 Cursor 自动生成 typeof window 守卫

📊 效果对比：
左：无规则 → Cursor 反复循环报错
右：有 MDC → 一次编译通过，直接出片

🛠️ 完整模板放 GitHub 了，简介自取

下期讲 Whisper 字幕卡点，蹲住。

#Remotion #React #视频自动化 #Cursor #AI编程 #前端踩坑 #效率工具
```

### 卡片配图方案（9张）

| 序号 | 卡片内容 | 视觉元素 |
|:---|:---|:---|
| 1 | 标题卡：代码即视频 | 代码编辑器背景 + 视频播放 icon |
| 2 | 痛点引入：90%人会踩的坑 | 💥 emoji + 报错截图 |
| 3 | 坑点解析：SSR 阶段无 window | 流程图：Browser vs Node |
| 4 | 报错现场：红屏截图 | 终端 ReferenceError 高亮 |
| 5 | 传统解法：手动加守卫 | ❌ 打叉标记（不推荐） |
| 6 | 进阶解法：MDC 被动约束 | ✅ 打勾 + 规则代码片段 |
| 7 | 效果对比：左右分屏 | 左侧循环报错 / 右侧一次通过 |
| 8 | 时间收益：代码写视频的效率 | 数字对比表 |
| 9 | CTA：GitHub 资源 + 下期预告 | 二维码 + 关注引导 |

### 话题标签

`#Remotion` `#React` `#视频自动化` `#Cursor` `#AI编程` `#前端踩坑` `#效率工具` `#程序员`

---

## 3. 知乎文章方案

### 标题

《Remotion 实测：用 React 写视频的工程边界与 SSR 避坑实践》

### 文章结构

**引子**（200字）：
视频自动化是 2024-2025 的技术热点。Remotion 提出"代码即视频"的范式，但工程落地并非一帆风顺。本文基于真实踩坑记录，剖析 SSR 预渲染阶段的边界问题与被动约束解法。

**操作层：Remotion 基础机制**（600字）：
• Frame 与 Seconds 的映射关系
• useCurrentFrame() 与 useVideoConfig() 的配合
• React 组件如何映射为视频帧序列

**操作层：SSR 报错复现**（600字）：
• 问题代码示例：顶层读取 window.innerWidth
• 报错现场：npx remotion render 红屏
• 根因分析：Puppeteer 预渲染阶段的 Node.js 环境

**判断层：边界与解法对比**（800字）：
• 传统解法：手动 typeof window 守卫（人与 AI 拉锯）
• 进阶解法：MDC 被动约束规则（规则替人盯 AI）
• 验收标准：render 命令零报错输出 MP4

**判断层：AI IDE 的硬边界**（400字）：
• 环境感知盲区：AI 不知道代码要在 SSR + CSR 双环境运行
• 被动约束的价值：不依赖人的记忆，规则强制生效
• MDC vs Workflows：不同层级的干预手段

**结语**（200字）：
代码即视频的愿景很美好，但工程落地的细节决定成败。一套好的约束规则，能让 AI 从"容易犯错"变成"自动正确"。

### 话题标签

`Remotion`、`React`、`视频自动化`、`Cursor`、`AI编程`、`前端工程化`、`SSR`、`MDC规则`

---

## 4. 短视频切片策略（预留）

> 本期为 ep02，暂不出产抖音竖版切片（ep03 后启动）。
> 
> 以下为 B站/小红书可用的高光片段标记，供手动剪辑参考：

| 切片类型 | 时间区间 | 用途 | Hook 文案 |
|:---|:---|:---:|:---|
| 反预期开场 | 00:00-00:30 | 小红书 | "写100行代码就能出4K视频？是的，但有个大坑..." |
| 高光踩坑 | 02:30-03:00 | 小红书 | "AI写的代码预览正常，一编译就红屏？" |
| 解法揭秘 | 04:30-05:00 | 小红书 | "不用改代码，一条规则让AI自动避坑" |
| 对比冲击 | 05:30-06:00 | 小红书 | "左边循环报错，右边一次通过，差距就在这一条规则" |

---

## 5. 跨平台一致性检查

| 检查项 | 状态 | 说明 |
|:---|:---:|:---|
| 核心观点一致性 | ✅ | 所有平台均强调"SSR 报错是 AI 环境感知盲区" |
| 判断层立场 | ✅ | 未将 AI 包装成"万能"，如实呈现踩坑过程 |
| 标题党控制 | ✅ | 标题含反预期元素，但未透支结论 |
| MDC 规则模板 | ✅ | 所有平台均指向 GitHub 资源 |
| 下期预告 | ✅ | 统一预告"Whisper 字幕卡点" |

---

## 6. 结构化校验块 (JSON Schema Block)

```json
{
  "distribute_spec": {
    "episode_slug": "ep02-video-render",
    "status": "draft",
    "platforms": ["bilibili", "xiaohongshu", "zhihu"]
  },
  "bilibili": {
    "title": "代码即视频：我用 100 行 React 编译动效，结果卡在 SSR 报错",
    "tags": ["Remotion", "React", "视频自动化", "Cursor", "AI编程", "前端工程化", "SSR报错", "MDC规则"],
    "has_timeline": true,
    "top_comment_ready": true
  },
  "xiaohongshu": {
    "title": "😭 用代码写视频，编译时疯狂报错 window is not defined",
    "card_count": 9,
    "tags": ["Remotion", "React", "视频自动化", "Cursor", "AI编程", "前端踩坑", "效率工具", "程序员"],
    "highlight_cards": ["报错现场", "MDC解法", "效果对比"]
  },
  "zhihu": {
    "title": "Remotion 实测：用 React 写视频的工程边界与 SSR 避坑实践",
    "word_count_estimate": 2800,
    "sections": ["引子", "操作层-基础机制", "操作层-报错复现", "判断层-解法对比", "判断层-AI边界", "结语"],
    "tags": ["Remotion", "React", "视频自动化", "Cursor", "AI编程", "前端工程化", "SSR", "MDC规则"]
  },
  "tiktok": {
    "enabled": false,
    "reason": "ep02 暂未达到抖音启动期（ep03后启动）"
  },
  "judgment_layer_check": {
    "consistent_messaging": true,
    "ai_limitations_preserved": true,
    "no_clickbait_override": true,
    "resource_links_valid": true
  }
}
```
