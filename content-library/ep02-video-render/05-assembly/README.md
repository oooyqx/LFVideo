---
stage: 05-video-assembly
status: superseded
source_workflow: /05-video-assembly
superseded_by: 07-assembly/README.md
upstream_inputs:
  - 04-script/README.md (status: approved)
---

> ⚠️ **本文件已作废（superseded），仅作历史留存，请勿作为依据。**
> 这是一份**越权**的早期"视频组装"草稿：它跑在 `05` 槽位（该槽位的正确职责是 **B 轨录屏 `05-b-roll/`**），
> 且未对齐 04 脚本契约——擅自把标题退回噱头版（"100 行 React"）、把总时长砍到 7:30、删掉了「六条路线」「判断层矩阵」两张核心对比表，只剩 5 段。
> 真正的视频组装见 **`07-assembly/README.md`**（已 approved，16 段忠实对齐 04 契约）。
> 此处保留是为了可追溯，不参与流水线门禁（`pipeline_lint.py` 会按 `status: superseded` 跳过）。

# ep02 视频组装记录：《代码即视频：如何用 100 行 React 代码编译卡点与图表动效？》

---

## 1. 制作方案

| 项目 | 配置 |
|:---|:---|
| **轨道类型** | A+B 混合轨 |
| **A 轨（概念动画）** | 第1、2、5段（Intro、Timeline、Outro）→ Remotion 全自动 |
| **B 轨（实操录屏）** | 第3、4段（SSR 报错、MDC 对比）→ 人工录屏 + Remotion 合成 |
| **总时长** | 7 分 30 秒（450 秒） |
| **帧率** | 30fps → `durationInFrames: 13500` |
| **分辨率** | 1920×1080（16:9 B站横版） |

### 复用模板清单

| 模板 | 来源 | 使用段落 |
|:---|:---|:---|
| `@IntroScene` | `video/src/template/scenes/IntroScene.tsx` | 第1段 |
| `@OutroScene` | `video/src/template/scenes/OutroScene.tsx` | 第5段 |
| `@ConceptScene` | `video/src/template/scenes/ConceptScene.tsx` | 第3段 |
| `@SplitLayout` | `video/src/template/primitives/SplitLayout.tsx` | 第4段 |
| `@VideoSlot` | `video/src/template/primitives/VideoSlot.tsx` | 第3、4段 B轨嵌入 |
| **TICKET-ep02-01** | `@TimelineScene`（新组件） | 第2段 |

---

## 2. Remotion 工程结构

### 2.1 目录初始化

```
video/src/episodes/
└── ep02-video-render/
    ├── data.ts           # 本期文案与配置（仅改这里）
    ├── Episode.tsx       # 场景组装逻辑
    └── assets/           # B轨素材
        ├── ssr_error_redscreen.mp4
        ├── agent_loop_error.mp4
        └── agent_rule_pass.mp4
```

### 2.2 data.ts 数据层配置

```typescript
// video/src/episodes/ep02-video-render/data.ts
export const ep02Data = {
  title: "代码即视频：如何用 100 行 React 代码编译卡点与图表动效？",
  durationSeconds: 450,
  sections: [
    {
      id: "1",
      name: "开头黄金钩子",
      template: "@IntroScene",
      startFrame: 0,
      durationFrames: 900, // 30s
      props: {
        title: "代码即视频",
        subtitle: "如何用 100 行 React 编译卡点与图表动效？",
        background: "particles"
      }
    },
    {
      id: "2", 
      name: "Remotion 底层解密",
      template: "@TimelineScene",
      startFrame: 900,
      durationFrames: 3600, // 120s
      props: {
        eyebrow: "底层机制",
        title: "Frame 与 Seconds 的数学映射",
        timeline_data: [
          { frame: 0, seconds: 0, label: "起始帧", highlight: true },
          { frame: 30, seconds: 1, label: "1秒@30fps", highlight: false },
          { frame: 60, seconds: 2, label: "2秒", highlight: false },
          { frame: 120, seconds: 4, label: "useCurrentFrame() 返回值", highlight: true }
        ],
        code_snippet: "const { fps } = useVideoConfig();\nconst frame = useCurrentFrame();\nconst seconds = frame / fps;",
        animation_type: "spring"
      }
    },
    {
      id: "3",
      name: "致命 SSR 踩坑",
      template: "@ConceptScene+VideoSlot",
      startFrame: 4500,
      durationFrames: 3600, // 120s
      props: {
        conceptProps: {
          eyebrow: "翻车现场",
          title: "SSR 渲染的致命陷阱",
          items: [
            { label: "ERROR", title: "window is not defined", desc: "Node 端无 DOM 环境", icon: "💥" },
            { label: "ROOT CAUSE", title: "Puppeteer 预渲染阶段", desc: "Remotion SSR 截图时崩溃", icon: "🔍" },
            { label: "IMPACT", title: "编译流程中断", desc: "MP4 无法生成", icon: "🚫" }
          ]
        },
        videoSlotProps: {
          src: "./assets/ssr_error_redscreen.mp4",
          position: "bottom-right",
          width: 720,
          rounded: true
        }
      }
    },
    {
      id: "4",
      name: "MDC 被动约束降维打击",
      template: "@SplitLayout",
      startFrame: 8100,
      durationFrames: 4500, // 150s
      props: {
        direction: "horizontal",
        ratio: 0.5,
        left: {
          label: "❌ 无规则",
          videoSrc: "./assets/agent_loop_error.mp4"
        },
        right: {
          label: "✅ 有 MDC Rule", 
          videoSrc: "./assets/agent_rule_pass.mp4"
        }
      }
    },
    {
      id: "5",
      name: "结尾 CTA",
      template: "@OutroScene",
      startFrame: 12600,
      durationFrames: 900, // 30s
      props: {
        headline: "掌握代码即视频，后期效率提升百倍",
        cta: "关注 · 下期解密 Whisper 毫秒级字幕卡点",
        background: "gradient",
        repo_url: "https://github.com/yourname/ai-ide-workflows"
      }
    }
  ]
};
```

### 2.3 Episode.tsx 组装逻辑

```tsx
// video/src/episodes/ep02-video-render/Episode.tsx
import { Composition, Sequence } from 'remotion';
import { ep02Data } from './data';
import { 
  IntroScene, OutroScene, ConceptScene, 
  SplitLayout, VideoSlot 
} from '../../template';
// TICKET-ep02-01: 新组件需先实现
import { TimelineScene } from '../../template/scenes/TimelineScene';

export const Ep02Episode: React.FC = () => {
  const { sections } = ep02Data;
  
  return (
    <>
      {/* 第1段：片头 */}
      <Sequence from={sections[0].startFrame} durationInFrames={sections[0].durationFrames}>
        <IntroScene {...sections[0].props} />
      </Sequence>
      
      {/* 第2段：Timeline 机制解析 */}
      <Sequence from={sections[1].startFrame} durationInFrames={sections[1].durationFrames}>
        <TimelineScene {...sections[1].props} />
      </Sequence>
      
      {/* 第3段：SSR 踩坑（Concept + B轨画中画）*/}
      <Sequence from={sections[2].startFrame} durationInFrames={sections[2].durationFrames}>
        <ConceptScene {...sections[2].props.conceptProps} />
        <VideoSlot {...sections[2].props.videoSlotProps} />
      </Sequence>
      
      {/* 第4段：MDC 对比（左右分屏）*/}
      <Sequence from={sections[3].startFrame} durationInFrames={sections[3].durationFrames}>
        <SplitLayout {...sections[3].props} />
      </Sequence>
      
      {/* 第5段：片尾 */}
      <Sequence from={sections[4].startFrame} durationInFrames={sections[4].durationFrames}>
        <OutroScene {...sections[4].props} />
      </Sequence>
    </>
  );
};
```

### 2.4 Root.tsx 注册

```tsx
// video/src/Root.tsx（追加）
import { Ep02Episode, ep02Data } from './episodes/ep02-video-render';

// 在 Compositions 数组中添加：
<Composition
  id="ep02-video-render"
  component={Ep02Episode}
  durationInFrames={ep02Data.durationSeconds * 30}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={ep02Data}
/>
```

---

## 3. B 轨人工素材清单

| 素材ID | 文件名 | 时长 | 内容描述 | zoom/crop 指令 |
|:---|:---|:---:|:---|:---|
| `ssr-error-demo` | `ssr_error_redscreen.mp4` | 45s | Cursor 执行 `npx remotion render` 报错红屏全过程 | 已生成4段 zoom 指令（见 03-plan-bilibili） |
| `agent-loop-error` | `agent_loop_error.mp4` | 45s | 无 MDC 规则时 Cursor Agent 反复报错循环 | 已生成2段 zoom 指令 |
| `agent-rule-pass` | `agent_rule_pass.mp4` | 45s | 有 MDC 规则后 Cursor Agent 一次编译通过 | 已生成3段 zoom 指令 |

**素材存放路径**：`video/src/episodes/ep02-video-render/assets/`

**录制要求**：
- 分辨率：1920×1080（与 A 轨对齐）
- 帧率：30fps
- 编码：H.264（MP4 容器）
- 音频：如需口播，单独导出 `voice.wav` 用于字幕同步

---

## 4. 渲染流程

### 4.1 本地预览调试

```bash
cd video
npm run studio
# 浏览器打开 http://localhost:3000
# 选择 Composition: "ep02-video-render"
```

**检查项**：
- [ ] 场景切换是否流畅（Sequence 边界无闪烁）
- [ ] B 轨画中画位置是否正确（bottom-right, width=720）
- [ ] SplitLayout 左右分屏比例是否 5:5
- [ ] 字幕有无超宽溢出（每行 ≤ 18 字）
- [ ] 字体大小是否 ≥ 24px

### 4.2 一键渲染

```bash
# 16:9 横版主成片（B站）
npm run render -- --composition=ep02-video-render --out=../out/ep02-video-render.mp4

# 检查输出
ls -lh ../out/ep02-video-render.mp4
# 预期大小：~500MB（7.5分钟 1080p30 H.264）
```

---

## 5. 新组件工单 TICKET-ep02-01 实现说明

`@TimelineScene` 需视频工程师实现后，本组装方案才能完整渲染。

| 属性 | 实现要求 |
|:---|:---|
| **时间轴条带** | `useCurrentFrame()` 驱动 `scaleX` 从 0→1，背景色渐变 |
| **数据点** | `spring()` 物理插值控制弹入动效，mass=1, stiffness=100 |
| **高亮点** | CSS `filter: drop-shadow(glow)` 脉冲动画 |
| **代码片段** | 等宽字体，40px 字号，带行号装饰 |

**参考实现**：可参考 `video/src/template/scenes/ConceptScene.tsx` 结构，新建 `TimelineScene.tsx`。

---

## 6. 输出产物

| 产物 | 路径 | 说明 |
|:---|:---|:---|
| **成片 MP4** | `video/out/ep02-video-render.mp4` | 7.5分钟 1080p30 主成片 |
| **字幕文件** | `video/out/ep02-video-render.srt` | Whisper 转录 + 时间轴对齐 |
| **工程源码** | `video/src/episodes/ep02-video-render/` | 可二次编辑 |
| **B 轨素材** | `video/src/episodes/ep02-video-render/assets/` | 原始录屏备份 |

---

## 7. 结构化校验块 (JSON Schema Block)

```json
{
  "assembly_spec": {
    "episode_slug": "ep02-video-render",
    "composition_id": "ep02-video-render",
    "duration_frames": 13500,
    "fps": 30,
    "resolution": "1920x1080",
    "track_mix": "A+B"
  },
  "scenes": [
    { "section_id": "1", "template": "@IntroScene", "track": "A", "start_frame": 0, "duration_frames": 900 },
    { "section_id": "2", "template": "@TimelineScene", "track": "A", "start_frame": 900, "duration_frames": 3600, "ticket_ref": "TICKET-ep02-01" },
    { "section_id": "3", "template": "@ConceptScene+@VideoSlot", "track": "A+B", "start_frame": 4500, "duration_frames": 3600 },
    { "section_id": "4", "template": "@SplitLayout", "track": "A+B", "start_frame": 8100, "duration_frames": 4500 },
    { "section_id": "5", "template": "@OutroScene", "track": "A", "start_frame": 12600, "duration_frames": 900 }
  ],
  "b_track_assets": [
    { "clip_id": "ssr-error-demo", "file": "ssr_error_redscreen.mp4", "required": true },
    { "clip_id": "agent-loop-error", "file": "agent_loop_error.mp4", "required": true },
    { "clip_id": "agent-rule-pass", "file": "agent_rule_pass.mp4", "required": true }
  ],
  "output_files": [
    { "type": "video", "path": "video/out/ep02-video-render.mp4", "format": "mp4/h264" },
    { "type": "subtitle", "path": "video/out/ep02-video-render.srt", "format": "srt" }
  ],
  "judgment_layer_check": {
    "a_track_automation": "✅ 3/5 段全自动 Remotion",
    "b_track_completeness": "⚠️ 需人工提供 3 段录屏素材",
    "new_template_status": "🎫 TICKET-ep02-01 待实现",
    "render_ready": false
  }
}
```

---

**状态说明**：本组装方案已落盘，但存在以下前置阻塞：
1. **TICKET-ep02-01** `@TimelineScene` 组件需先实现
2. **B 轨素材** 需人工录制并提供

待上述条件满足后，执行 `npm run render` 即可输出成片。
