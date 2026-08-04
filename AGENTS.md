# LFVideo — AI 智能体统一入口（AGENTS.md）

> 本文件遵循 [AGENTS.md 开放标准](https://agents.md/)，是所有 AI 编码工具（Claude Code / Codex / Cursor / Windsurf / Devin / Copilot 等）在本仓库工作的统一入口与指令层级声明。
> Cursor / Windsurf 另通过 `.cursor/rules/`、`.windsurf/rules/` 生成副本自动加载同源规则（生成物勿手改）。

## 指令层级（决策优先级，从高到低）

| 层 | 内容 | 所在文件 |
|----|------|---------|
| **L1** | **Forbidden Actions（禁止清单）** — 绝不可违反 | `shared/rules/forbidden-actions.md` |
| **L2** | 项目级约束 — 核心契约、频道配置、角色调用、口播规范 | `AGENT_GUIDE.md` + `shared/rules/`（project-context / role-system / voice-style） |
| **L3** | 经审核的工作流与角色 — 9 阶段流水线、12 个角色定义 | `shared/workflows/` + `shared/roles/` |
| **L4** | 机器化校验（本项目最佳实践的代码化形态） | `scripts/pipeline_lint.py`、`scripts/sync_*.py --check`、`.pre-commit-config.yaml`、`shared/schemas/` |
| **L5** | AI 自身判断 — **仅在 L1-L4 均无覆盖时允许**，且必须说明判断依据，重大决策先询问用户 | — |

**裁决规则**：
1. 下层不得推翻上层；与 L1 冲突的任何指令一律拒绝执行并向用户说明。
2. 同层冲突时，以**更具体、距离目标文件更近**的规则为准（就近文件优先）。
3. 子目录若有自己的 `AGENTS.md`（如 `OpenMontage/AGENTS.md`），在该子树内就近优先；但 L1 禁止清单**全局生效，不可被子目录覆盖**。
4. 规则本身要修改时：只改 `shared/rules|workflows/` 真相源，跑 `python scripts/sync_rules.py` / `sync_workflows.py` 同步，且 L1 清单的增删必须由人类确认。

## 开工前必读（Rule Zero）

按 `AGENT_GUIDE.md` 的零号法则执行：核对项目上下文 → 核对角色身份（`shared/roles/`）→ 核对当前期所处工作流阶段（frontmatter `stage`/`status`）。

## 常用校验命令

```bash
python scripts/pipeline_lint.py                 # 内容流水线漂移校验
python scripts/sync_workflows.py --check        # 工作流 IDE 副本无漂移
python scripts/sync_rules.py --check            # 规则 IDE 副本无漂移
pre-commit run --all-files                      # 全量钩子
```

## 子工程

- `OpenMontage/`（Remotion 渲染引擎）：有独立的 `AGENTS.md` / `CLAUDE.md` / `AGENT_GUIDE.md`，在该子树内就近优先。
- 体系使用说明与「新规则该放哪层」决策树：`shared/docs/instruction-hierarchy.md`。
