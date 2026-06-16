# 用 Vibe Coding 搭一套能自动出片的视频渲染引擎

## 《Vibe Coding 造一条自动化视频生产线》EP02 · 视频渲染

> 📌 本期教学软文，下游 04 脚本以此为口播内容真相源。对齐 `CONTENTLIB.md`、`shared/docs/remotion-spec.md`、`OpenMontage/remotion-composer/SCENE_TYPES.md`、`_decisions/why-remotion-over-hyperframes.md`。技术结论标 `verified` / `paper_spec`，未本机验证一律 `paper_spec`。

---

## 一、开场

这一期，用 Vibe Coding 解决自动化视频生产线最核心的一环——**视频自动渲染**。

先抓住一个关键认知：**AI 最强的本事是处理文本和代码。** 所以想让视频渲染自动化，最聪明的做法就是把视频变成**文本 / 代码 / 数据**来驱动——改数据就改片，这正是 AI 最能稳定接手的活。没有前后端基础也不挡路：全程用大白话指挥 AI（这就是 Vibe Coding），我只说要什么、判断对不对。

整件事分三步：

1. **找技术路径**：让 AI 把"用代码/数据渲染成视频"的现成路线全列出来；
2. **技术选型**：和 AI 对话，对着自己的约束选定 Remotion；
3. **技术落地**：让 AI 驱动 Remotion 按配置自动出片。

---

## 二、找技术路径：让 AI 把能落地的路都列出来

问 AI："我想把视频做成代码/配置自动出片，有哪些现成路线？各自用什么描述画面？" 这些路线内核都一样——**用代码/数据描述画面 → 程序编译成帧 → 合成视频**，区别只在用什么语言、什么引擎：

| 路线 | 代表工具 | 用什么描述画面 | 适合干什么 |
| :--- | :--- | :--- | :--- |
| 网页（React + CSS）渲染 | **Remotion** | React 组件 + CSS/SVG，无头浏览器逐帧截图 | 前端栈、复杂排版、模板复用 |
| 代码声明动画 | Motion Canvas / Revideo | 写函数描述动画时序 | 代码演示、讲解类动画 |
| 数学公式动画 | Manim | Python 描述几何/公式 | 数学、算法可视化 |
| 像素脚本拼接 | MoviePy | Python 操作像素 + FFmpeg | 纯 Python、简单拼接 |
| 画布/游戏引擎 | PixiJS / Cocos | 在 Canvas 上逐帧画 | 复杂粒子、游戏化动画 |
| 命令行合成 | FFmpeg + 脚本 | 命令拼接 | 批量转码、轻量字幕烧录 |

---

## 三、技术选型：和 AI 对话选定 Remotion

### 1. 逼 AI 说清每条路的"不适用 + 坑"

AI 默认给一份四平八稳、个个说好话的百科对比，没用。能帮你做决定的是每条路**什么时候不好使、在哪一步翻车**。所以追问："每个方案分别在什么情况下不适用？有哪些已知坑？"

| 方案 | 适合 | 不适合 | 已知坑 |
| :--- | :--- | :--- | :--- |
| **Remotion** | 前端栈、复杂排版、跨期复用模板 | 纯后台超长批处理 | 组件顶层直接读浏览器对象会在打包阶段崩；BUSL 授权（规模化要付费） |
| Motion Canvas / Revideo | 代码演示、精确时序动画 | 复杂网页级排版 | 组件/排版生态小，模板要自己攒 |
| Manim | 数学/公式/算法可视化 | 普通 UI、网页排版 | 学习曲线陡、排版弱、渲染慢 |
| MoviePy | 纯 Python、简单拼接、音轨闪避 | 自适应排版、复杂文字动效 | 文字排版繁琐、多层画布吃内存、改了要重跑 |
| PixiJS / Cocos | 游戏类复杂粒子动画 | 标准网页 UI、文字对齐 | 文字换行/对齐计算复杂 |
| FFmpeg + 脚本 | 批量转码、字幕烧录、兜底合成 | 复杂动效、交互排版 | 命令语法晦涩、难调试 |

> 验收标准与证据状态见 `02-plan/README.md` 校验块。

### 2. 对着自己的约束让 AI 对号入座

回到我的需求：**一期一个固定模板、换数据批量出几十期；让 AI 改内容不容易出错；跨期好维护。** 这几条约束下 Remotion 胜出（决策记录见 `_decisions/why-remotion-over-hyperframes.md`，`verified`）：

1. **固定模板、换数据复用**：React 组件 + 数据分离，改一处主题，全系列生效。
2. **让 AI 接手最稳**：每期只让 AI 填数据、套现成组件，不让它自由发挥结构。
3. **一行命令出片**：`npx remotion render` 是纯命令行，方便接自动化、上云。
4. **网页生态现成**：CSS、动效、图表库随手拿。

和"复制粘贴 HTML"那种土办法的对照：

| 比什么 | ✅ Remotion | ❌ 复制粘贴 HTML |
| :--- | :--- | :--- |
| 模板复用 | 改一处全系列生效 | 每期复制改，越改越乱 |
| 让 AI 接手 | 结构稳，只填数据 | 结构容易跑偏 |
| 长期维护 | 十期后还能管 | 十期后难维护 |
| 授权 | BUSL（规模化付费） | 更宽松 |

代价如实说：React 技术栈 + BUSL 授权（规模化商用要付费）；还有个"打包时别碰浏览器对象"的小坑，一条规则就能让 AI 自动绕开（见下一节）。前端基础不用怕——本来就是 AI 写、我把方向。

---

## 四、技术落地：让 AI 驱动 Remotion 按配置出片

### 1. 引擎怎么干活：一份配置，按 type 自动分发

渲染引擎是 `OpenMontage/remotion-composer/`（React + Remotion，`verified`）。规则很直白：**你写一份配置，说清"这段是什么画面、上面叠什么"，主程序 `Explainer` 就按配置里的 `type` 字段，自动找到对应组件去渲染**（完整清单见 `SCENE_TYPES.md`）：

| 配置 `type` → 组件 | 做什么 |
| :--- | :--- |
| `comparison` → `ComparisonCard` | 左右对比卡 |
| `terminal_scene` → `TerminalScene` | 合成终端：命令+输出逐行打出，**不用真录屏** |
| `screenshot_scene` → `ScreenshotScene` | 一张截图叠光标/点击/打字，脚本化演示 |
| `bar_chart`/`line_chart`/`pie_chart`/`kpi_grid` → `charts/` | 各种图表动效 |
| `ConceptScene` / `SplitLayout` | 概念图解 / 左右分屏 |
| `section_title`/`stat_reveal`/`provider_chip`（叠层） | 小节标题 / 角标 / 模型名轮播 |
| `CaptionOverlay` | 字幕高亮（接口已留，**卡点见 EP03**） |

> 这些是引擎现成的通用组件，照着填就能用。想要更强的辨识度，还能让 AI 在它们之上按自己的视觉风格扩出一套**自有风格组件库**（统一配色、排版、动效的品牌化模板）。这是个更大的话题，**后续单独开一期讲**；本期先用现成组件把片子跑通。

### 2. 配置即内容：让 AI 填字段，别让它造组件

不让 AI 发明新组件，只让它照现成组件填一份配置。要个对比卡，就说"做个对比卡，左边传统剪辑、右边代码即视频"，AI 产出的就是这份配置：

```jsonc
// ✅ 只写配置：一个 comparison，Explainer 自动渲成对比卡
{
  "type": "comparison",
  "title": "传统剪辑 vs 代码即视频",
  "leftLabel": "传统剪辑",   "leftValue": "拖时间轴，改一处全手工重排",
  "rightLabel": "代码即视频", "rightValue": "改一行配置，重新编译出片"
}
// ❌ 反面：让 AI 为这一期从零手写一个新组件 ComparisonScene.tsx——
//    既重复造轮子，又把"换数据就复用"的好处弄没了。
```

为什么稳：每个 `type` 的字段都用 TypeScript 定死了格式，**AI 填错、漏填，编译时立刻报错**，乱发挥的空间被压到最小。

### 3. 3D 主持人只做陪衬

引擎里有个数字主持人 `VRMAvatar`（`src/components/VRMAvatar.tsx`，`verified`）。定位说死：**陪衬，不是主角。**

- **渲染一次、按场景取景**：整体渲一次，再按场景裁半身/全身，不用每场景重搭。
- **得站得稳**：之前待机只摆髋部，整条腿像钟摆一样甩；修法是在大腿上把髋部摆动反向抵消，让脚踩原地、上半身自然摆（`verified`，见 PR「plant VRM feet」）。
- **划清边界**：不做对口型数字人、不做 AI 生成的假界面——可信度靠真实录屏。口型、表情这些更重的能力留到以后单独一期（记进 `ideas/backlog.md`）。

### 4. 避坑 + 出片：把规则写死交给 AI

唯一反复踩的坑：**别在组件最外层直接读 `window` 这类浏览器对象**，否则 Remotion 在打包阶段（跑在 Node 里、还没进浏览器）就报错。

```tsx
// ❌ 打包阶段就崩：ReferenceError: window is not defined
const w = window.innerWidth;

// ✅ 加个判断再读
const getWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1920);
```

把这条写进 `.cursor/rules/remotion-ssr.mdc`（指向 `remotion-composer/src/**`），以后 AI 生成组件自动带判断，不用人盯。**重复的约束用规则固化交给 AI，别每次口头提醒。**

出片就一行命令，让 AI 在终端跑：

```bash
cd OpenMontage/remotion-composer
npx remotion studio                                   # 可视化调试
npx remotion render src/index.ts <CompositionId> out/demo.mp4
```

（`paper_spec`：`<CompositionId>` 录制前让 AI 跑一次 `studio` 核对注册名。）

---

## 五、总结

- **三步**：找路径（AI 罗列现成路线）→ 选型（AI 给"不适用+坑"，人对约束拍板）→ 落地（填配置、套组件、规则兜底、AI 跑渲染）。
- **为什么 Remotion**：模板换数据复用、AI 接手最稳、一行命令出片、网页生态现成；代价是 React 栈 + BUSL 授权，不构成门槛。
- **引擎核心**：一份配置 → `Explainer` 按 `type` 分发现成组件 → 出片；做内容 = 挑组件、填字段。
- **主持人只陪衬**：站得稳、按场景取景，不做对口型。
- **没编程基础也能复制**：会讲需求、看住坑、把重复规则固化给 AI 即可。

下期 **EP03「字幕匹配」**：用 Whisper 拿到字级时间戳，自动驱动 `CaptionOverlay`，让字幕踩着话音跳。
