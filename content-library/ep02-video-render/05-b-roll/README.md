---
stage: 05-b-roll-recording
status: draft
source_workflow: /05-b-roll-recording
upstream_inputs:
  - 04-script/README.md (status: draft)
---

# ep02 录屏素材清单

按 04 脚本 SSOT 的各镜头 `scene_template`/`track` 标注提取。本期只有 **镜头 5.4（SSR 落地踩坑）** 走真实录屏；其余镜头全是自动渲染概念/数据动画（Remotion 模板场景全自动），无录屏需求。

> ⚠️ 04 脚本已按新 `tutorial.final.md` 六章结构重排为 8 段 33 镜，SSR 坑合并为单镜 **5.4**（原 §6 两镜）。下表已对齐新编号。

## 录屏任务清单

| # | 录屏 id | 对应镜头 | 录屏内容 | 时长 | 自动渲染兜底 | 状态 |
|---|---------|---------|---------|------|---------|------|
| 1 | `b-ssr-crash-fix` | 5.4 | 终端真实执行：顶层读 `window` → `ReferenceError: window is not defined`（exit 1）→ 加 `typeof window` 守卫 → 重跑通过（exit 0） | ~23s | `@TerminalScene`（5.4 合成终端） | ✅ 已录制并接入 07 |

## 说明

- 素材由 `OpenMontage/tools/capture/scripted_terminal_recorder.py` 产出：命令**真实执行**（stdout/stderr/exit code 均为真），仅回放呈现为合成，符合 F-06 红线；执行审计见 `assets/b-ssr-crash-fix.mp4.provenance.json`。
- 接入方式：`OpenMontage/build_ep02_shots_props.py` 的 `SHOT_OVERRIDES["5.4"]` 把 cut 的 `source` 指向 `public/broll/b-ssr-crash-fix.mp4`，Explainer 走 media fallback 全屏播放；删除 override 重新生成即可回退到 `@TerminalScene` 自动渲染兜底。
- 素材需同时存在两处：`assets/`（存档 + provenance）与 `OpenMontage/remotion-composer/public/broll/`（渲染时经 staticFile 读取）。

## 素材路径

```
content-library/ep02-video-render/05-b-roll/
├── README.md        # 本清单
└── assets/
    ├── b-ssr-crash-fix.mp4                  # scripted_terminal_recorder 真实录制
    └── b-ssr-crash-fix.mp4.provenance.json  # 执行审计边车（真实 transcript）
```
