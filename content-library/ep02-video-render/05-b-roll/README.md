---
stage: 05-b-roll-recording
status: suspended
source_workflow: /05-b-roll-recording
upstream_inputs:
  - 04-script/README.md (status: approved)
---

# ep02 B 轨录屏（05-b-roll）

> 状态：**suspended（挂起）** —— 本期采用 **A 轨兜底**：04 脚本中所有标注 `[B 轨]` 的录屏镜头都给出了对应的 `[A 轨兜底]` Remotion 画面（如 `@TerminalScene` + 代码 Props），因此 B 轨录屏暂不录制，整片由 Remotion 全自动渲染。

这是流水线 `05` 槽位的**正确**产物位置（职责 = B 轨录屏素材，对应 workflow `/05-b-roll-recording`）。
若后续要补真实录屏，把素材放到 `05-b-roll/assets/` 并把本阶段状态改为 `approved`，下游 `07-assembly` 会用录屏替换对应的 A 轨兜底镜头。

> 注：历史上曾有人在本槽位放过一份越权的「视频组装」草稿（见 `../05-assembly/`，已标记 `superseded`）。视频组装的唯一阶段是 `07-assembly`，不在 05。

## 需要的 B 轨镜头（来自 04 脚本的 `[B 轨]` 标记）

| clip_id | 内容 | A 轨兜底 |
|:---|:---|:---|
| `ssr-error-demo` | SSR `window is not defined` 报错红屏 | `@TerminalScene` 渲染报错文本 |
| `terminal-render` | `npx remotion render` 终端渲染过程 | `@TerminalScene` 渲染进度条 |

```json
{
  "stage": "05-b-roll-recording",
  "episode": "ep02-video-render",
  "status": "suspended",
  "reason": "A-track fallback covers every [B 轨] shot; no screen recording required this episode",
  "assets_dir": "05-b-roll/assets/",
  "assets_present": false,
  "fallback_track": "A"
}
```
