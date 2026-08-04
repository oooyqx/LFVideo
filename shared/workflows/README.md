---
title: 工作流真相源说明
slug: workflows-readme
---

# shared/workflows — 工作流单一真相源 (Single Source of Truth)

本目录是 9 阶段内容流水线工作流的**唯一真相源**，与 `shared/roles/`（角色真相源）对等，IDE 无关。
各 AI IDE 实际调用的工作流文件由脚本从这里**生成**，不要手改生成副本。

## 目录约定

| 位置 | 角色 | 是否手改 |
|------|------|----------|
| `shared/workflows/<slug>.md` | **真相源**（IDE 无关，含 frontmatter `title/slug/stage/description` + 步骤正文） | ✅ 只改这里 |
| `.devin/workflows/<slug>.md` | Devin 生成副本 | ❌ 自动生成 |
| `.windsurf/workflows/<slug>.md` | Windsurf 原生 Workflows 生成副本（`/<slug>` 调用） | ❌ 自动生成 |
| `.cursor/commands/<slug>.md` | Cursor slash 命令生成副本（`/<slug>` 调用） | ❌ 自动生成 |

文件名一律**纯 ASCII**（`04-script-draft.md`），中文名放在 frontmatter `title`，
这样 `/<slug>` 在各 IDE 都能正常作为 slash 命令调用。

## 改完后必须同步

```bash
python scripts/sync_workflows.py          # 重新生成所有 IDE 副本
python scripts/sync_workflows.py --check  # 只校验有无漂移（CI / pre-commit 用，漂移则退出码 1）
```

`.pre-commit-config.yaml` 已配置 `sync-workflows-check` 钩子，提交时自动拦截漂移。
启用：`pip install pre-commit && pre-commit install`。

## 新增一个目标 IDE

编辑 `scripts/sync_workflows.py` 顶部的 `TARGETS`，加一条目录 + frontmatter 规则即可，
例如 Claude Code：`"claude": {"dir": ".claude/commands", "frontmatter": []}`，再跑一次 sync。
