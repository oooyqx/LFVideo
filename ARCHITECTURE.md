# AI IDE Workflows 项目架构设计 (Project Architecture)

本项目采用 **“全收敛单运行时 (Fully Converged Single-Runtime)”** 架构体系。我们将精品教程的视觉组件（如 Timeline、Table）完全融入 OpenMontage 内部，并将 OpenMontage 内置渲染器升级至最新的 React 19 / Remotion 4.0.470 协议，从而达到极简的数据闭环与工业级全自动声画同步。

---

## 1. 物理目录拓扑 (Physical Directory Topology)

```
ai-ide-workflows/ (项目根目录)
├── AGENTS.md                  # AI 编码工具统一入口 + 指令层级声明 (L1-L5)
├── shared/                     # 跨 IDE 共享资源 (Single Source of Truth)
│   ├── roles/                  # 12 个角色定义 (选题/策划/导演/工程/审查等)
│   ├── workflows/              # 9 阶段工作流真相源 (IDE 无关，纯 ASCII 文件名)
│   ├── rules/                  # 项目常驻规则真相源 (IDE 无关)
│   ├── docs/                   # 组件规格、指令层级说明等
│   └── schemas/                # L0.5 严苛双核校验的 JSON Schema
├── .devin/workflows/           # [生成] Devin 工作流副本（由 sync 脚本物化，勿手改）
├── .windsurf/workflows/        # [生成] Windsurf 原生 Workflows 副本（/<slug> 调用）
├── .windsurf/rules/            # [生成] Windsurf 规则副本（trigger: always_on）
├── .cursor/commands/           # [生成] Cursor slash 命令副本（/<slug> 调用）
├── .cursor/rules/              # [生成] Cursor 规则副本（*.mdc）
├── scripts/
│   ├── sync_workflows.py       # 把 shared/workflows 物化到各 IDE 目录（--check 防漂移）
│   ├── sync_rules.py           # 把 shared/rules 物化到各 IDE 规则目录（--check 防漂移）
│   └── pipeline_lint.py        # 内容流水线漂移校验
├── content-library/            # 内容库 (按 epNN 分类，纯净不含 React 模板代码)
│   └── ep02-video-render/      # EP02 视频生产文件 (01-topic ~ 07-assembly)
└── OpenMontage/                # [单运行时核心] Python 生产流水线与 React 19 渲染双引擎
    ├── tools/                  # 屏幕录制、音轨合成、AI 语音字幕工具 (Python)
    ├── docs/ARCHITECTURE.md    # OpenMontage 子工程独立架构文档
    └── remotion-composer/      # React 19 / Remotion 4.0.470 全功能渲染器
        ├── src/
        │   ├── Explainer.tsx           # 主合成：读 JSON cuts → 按 type 分发场景 → warp 透视动画
        │   └── custom-templates/       # 自定义场景库 + 主题体系 (SSOT)
        │       ├── registry.ts         # 14 种场景注册表 (type → component + zod schema)
        │       ├── scene-types.json    # 跨语言场景清单 (与 registry 启动期一致性守卫)
        │       ├── theme/              # 主题 SSOT：palettes / textStyles / surfaces / tokens
        │       └── scenes/             # 14 个场景组件 (opener/list/data/emphasis/demo)
        └── preview/            # Vite 驱动的场景预览工具 (独立于 Remotion Studio)
```

---

## 2. 单运行时收敛设计 (Converged Single Runtime)

通过将外部独立视频工程并入 OpenMontage，我们消除了两个运行时（React 18 vs React 19）的版本代差，获得了统一的高效生产力：

| 维度 | `OpenMontage/remotion-composer/` (升级合并后) |
|:---|:---|
| **React 版本** | **React 19.2.6** (全线升级) |
| **Remotion 版本** | **4.0.470** (全线升级) |
| **组件特性** | 14 种自定义场景 (opener/list/data/emphasis/demo) + 通用 Explainer 模板 (图表、ProgressBar) 共存 |
| **主题体系** | 全息科技底 (holo) — 深色背景 + 白字 + accent 霓虹辉光，统一由 `custom-templates/theme/` SSOT 驱动 |
| **主打场景** | 全片自动化渲染卡点、口播配音合成、GitHub 开源精品 React 模板库 |

### 收敛决策的核心优势
1. **100% 自动卡点**：直接利用 OpenMontage 内置的语音逆向对齐（TTS + WhisperX word-level 时间戳），React 场景自动根据音频长度适配帧数，彻底解决**长场景死时间、画音不同步**等质量硬伤。
2. **14 种场景即插即用**：`registry.ts` 注册了 14 种场景类型（intro / outro / section / concept / timeline / bullet / flow / table / comparison / chart / stat / callout / quote / code），JSON 配置里写 `type` 字段即可分发，zod schema 做启动期校验。
3. **极速调试 (DX)**：在 `OpenMontage/remotion-composer/` 目录下运行 `npm start` 即可启动 Remotion Studio；`npm run preview` 启动独立的 Vite 场景预览工具（逐个检视每种场景的动效与样式）。

---

## 3. 全自动流水线数据流 (Automated Pipeline Data Flow)

```
[1. 口播脚本 Markdown]
         │
         ▼
[2. OpenMontage TTS 语音生成] ──► 生成 scene_N.mp3 分段音轨
         │
         ▼
[3. WhisperX 时间戳提取]      ──► 提取精确到单词/字级的 millisecond 标记
         │
         ▼
[4. Verify Scene Pacing]      ──► 自动匹配口播时间与 React 动作物理时长，报错拦截静死屏
         │
         ▼
[5. Remotion 自动渲染]        ──► npx remotion render Explainer --props .remotion_props.json
         │
         ▼
     [ 1080p MP4 完片 ]
```

---

## 4. 单一事实源原则 (Single Source of Truth)

### 4.1 内容流水线 SSOT

- **角色定义**：所有角色（如 `script-director`, `strategist`）仅在 `shared/roles/` 维护一份 Markdown 文件。
- **工作流定义**：9 阶段工作流仅在 `shared/workflows/<slug>.md` 维护一份（IDE 无关，纯 ASCII 文件名，中文名在 frontmatter `title`）。各 IDE 实际调用的副本由 `scripts/sync_workflows.py` **生成**，不手改：
  - **Devin**：`.devin/workflows/<slug>.md`
  - **Windsurf**：`.windsurf/workflows/<slug>.md`（原生 Workflows，`/<slug>` 调用）
  - **Cursor**：`.cursor/commands/<slug>.md`（slash 命令，`/<slug>` 调用）
  - 改完真相源后跑 `python scripts/sync_workflows.py`；`--check` 模式（已接入 pre-commit）保证生成副本永不漂移。
- **规则定义（rules）**：项目常驻规则（项目上下文、角色调用规则、禁止清单、口播风格）仅在 `shared/rules/<slug>.md` 维护一份（IDE 无关）。各 IDE 加载的副本由 `scripts/sync_rules.py` **生成**，不手改：
  - **Cursor**：`.cursor/rules/<slug>.mdc`（frontmatter 转为 `description/globs/alwaysApply`）。
  - **Windsurf**：`.windsurf/rules/<slug>.md`（frontmatter 转为 `trigger: always_on` 或 `glob`）。
  - **Devin**：通过 `AGENT_GUIDE.md`（Rule Zero）加载，无 `.devin/rules/` 目标。
  - 改完真相源后跑 `python scripts/sync_rules.py`；`--check`（已接入 pre-commit）保证生成副本永不漂移。
- **指令层级**：`AGENTS.md` 声明 L1-L5 优先级（禁止清单 > 项目约束 > 工作流/角色 > 机器校验 > AI 判断），所有 IDE 遵循同一裁决规则。

### 4.2 渲染引擎 SSOT

- **场景注册表**：`custom-templates/registry.ts` 是 14 种场景的单一注册表（type → component + zod schema）。`scene-types.json` 是跨语言清单，启动期 `assertManifestMatchesSchemas()` 守卫两者字段完全一致。
- **主题体系**：`custom-templates/theme/` 是视觉风格的 SSOT：
  - `palettes.ts` — 文字三档色 (primary/secondary/muted) + 网格/表面透明度
  - `textStyles.ts` — 7 种文字角色 (displayTitle ~ eyebrow) 的统一样式 + 阴影
  - `surfaces.tsx` — 面板/图标/胶囊/辉光等 UI 元件的统一样式
  - `tokens.ts` — 字号/间距/圆角/弹簧/辉光等设计令牌
  - `设计规范.md` — 面向人类的设计规范文档（与代码同步）
- **场景预览**：`preview/` 目录提供 Vite 驱动的独立预览工具（`npm run preview`），可逐个检视每种场景的动效与样式，不依赖 Remotion Studio。

---

## 5. React/Remotion 开发与渲染规范 (Robustness & Rendering Guidelines)

### 5.1 自适应自愈模式 (Self-Healing Design Pattern)
为了保证 Remotion Studio 预览界面的 100% 稳定性，防止在预览缺省、空配置、或临时资产时的崩溃：
- **媒体组件守卫 (Media Guard)**：所有的原生多媒体渲染组件（如 `<OffthreadVideo>`、`<Video>`、`<Audio>`）在渲染前**必须进行 `src` 空校验与有效性守卫**。
- **视频占位降级 (Video Fallback)**：当 `videoSrc` 或 `backgroundSrc` 为空/未配置时，必须降级渲染高对比度、暗色的 `div` 占位框（如 `[视频占位符: src 未配置]`），而非直接渲染空 `src` 的视频组件（空 `src` 会导致浏览器抛出 `MediaPlaybackError` 触发红屏崩溃）。
- **音频零渲染守卫 (Audio Guard)**：所有的背景音轨、口播音轨组件（如 `Soundtrack`）在 `src` 为空或无效时，应立即 `return null`。

### 5.2 渲染分辨率规范 (Rendering Resolution Standard)
- **目标分辨率**：本频道视频渲染和导出统一规范为 **1080p 高清（1920×1080 @ 30fps）**，无需渲染 4K。
- **核心考量**：1080p 在保证画质清晰度的前提下，能缩短数十倍的 Puppeteer 后台多核截图与 FFmpeg 合成时间，极大提高 AI 流水线自动迭代与成片效率。

### 5.3 场景分发机制 (Scene Dispatch)
- `Explainer.tsx` 的 `SceneRenderer` 按两级分发：先匹配 `SCENES` 数组中带 `guard` 的显式条目，未命中则回退到 `TEMPLATE_SCENES` 注册表（zod schema 校验后直接渲染）。
- 新增场景只需在 `registry.ts` 加一行 + 写场景组件文件，无需改 `Explainer.tsx`。
- `scene-types.json` 与 `registry.ts` 由 `assertManifestMatchesSchemas()` 启动期守卫，字段漂移直接抛错。

### 5.4 Warp 透视动画 (3D Perspective Warp)
- `Explainer.tsx` 支持 per-cut 3D 透视飞入动画：每个 cut 的内容平面从全屏平铺状态，经过 `warpHoldFrames`（默认 50% 时长）停留后，以 `warpRevealFrames`（默认 15% 时长）飞入 `screenQuad` 透视位置。
- 预览工具 (`FinalComposition.tsx`) 与主合成 (`Explainer.tsx`) 行为一致，预览即所得。

### 5.5 常用命令

| 命令 | 用途 |
|------|------|
| `npm start` | 启动 Remotion Studio (localhost:3000) |
| `npm run build` | 渲染 Explainer 合成为 MP4 |
| `npm run preview` | 启动 Vite 场景预览工具 (localhost:5173) |
| `npm run preview:build` | 构建场景预览静态站 |
| `python scripts/pipeline_lint.py` | 内容流水线漂移校验 |
| `python scripts/sync_workflows.py --check` | 工作流 IDE 副本无漂移 |
| `python scripts/sync_rules.py --check` | 规则 IDE 副本无漂移 |

