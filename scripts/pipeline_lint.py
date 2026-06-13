#!/usr/bin/env python3
"""Pipeline drift guardrails for content-library episodes.

Each episode under ``content-library/<epNN-slug>/`` is produced stage by stage
(01-topic -> 02-plan -> ... -> 13-archive). Every stage writes a ``README.md``
with YAML frontmatter (``stage`` / ``status`` / ``upstream_inputs``) and a
trailing ```json``` contract block. Stage 04 (the script) is the frozen single
source of truth (SSOT): its ``title`` / ``sections[]`` / ``anti_hype_forbidden``
must be honoured verbatim by downstream stages.

This linter catches the ways the pipeline silently drifts after stage 04:

1. schema    - the trailing JSON block must validate against the matching
               ``shared/schemas/<stage>.schema.json`` (when one exists).
2. provenance- every ``upstream_inputs`` entry records ``(status: X)``; X must
               match the upstream stage's ACTUAL frontmatter status.
3. gating    - an ``approved`` / ``reviewed`` stage may only consume upstreams
               that are ``approved`` or ``suspended``.
4. consistency- assembly stages must keep the same scene/section count as the
               04 contract (catches dropped sections / re-invented structure).
5. anti-hype - a stage's H1 title must not contain any phrase 04 banned in
               ``anti_hype_forbidden`` (catches re-introduced clickbait).

Usage::

    python scripts/pipeline_lint.py                       # lint every episode
    python scripts/pipeline_lint.py content-library/ep02-video-render

Exit code is non-zero when any error (not warning) is found.
"""
from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_DIR = REPO_ROOT / "shared" / "schemas"

# Statuses that make an upstream safe to build on.
SAFE_UPSTREAM = {"approved", "suspended"}
# Statuses that hold a stage to the gating rule above.
STRICT_CONSUMER = {"approved", "reviewed"}
# Statuses whose stages are excluded from all checks (dead / intentionally idle).
EXCLUDED = {"superseded", "-"}

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
JSON_BLOCK_RE = re.compile(r"```json\s*\n(.*?)\n```", re.S)
H1_RE = re.compile(r"^#\s+(.*)$", re.M)
# "04-script/README.md (status: approved)" / "05-b-roll/assets/ (status: suspended — note)"
UPSTREAM_RE = re.compile(r"^\s*(?P<path>\S+)\s*\(status:\s*(?P<status>[A-Za-z\-]+)")


@dataclass
class Stage:
    number: int
    dirname: str
    readme: Path
    stage: str
    status: str
    upstream: list[str]
    frontmatter: dict
    contract: dict | None
    h1: str | None


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def note(self, msg: str) -> None:
        self.notes.append(msg)


def _extract_upstream(frontmatter_text: str) -> list[str]:
    """Read ``upstream_inputs`` list items straight from the raw frontmatter.

    The entries look like ``- 04-script/README.md (status: approved)``; the
    inner ``status:`` colon makes YAML mis-parse each item into a dict, so we
    read the raw ``- `` lines under the ``upstream_inputs:`` key instead.
    """
    entries: list[str] = []
    in_block = False
    for line in frontmatter_text.splitlines():
        if re.match(r"^\s*upstream_inputs\s*:", line):
            in_block = True
            continue
        if in_block:
            item = re.match(r"^\s*-\s+(.*)$", line)
            if item:
                entries.append(item.group(1).strip())
            elif line.strip() and not line.startswith((" ", "\t", "-")):
                break
    return entries


def _parse_readme(path: Path) -> tuple[dict, list[str], dict | None, str | None]:
    text = path.read_text(encoding="utf-8")
    fm_match = FRONTMATTER_RE.match(text)
    fm_text = fm_match.group(1) if fm_match else ""
    frontmatter = yaml.safe_load(fm_text) if fm_text else {}
    if not isinstance(frontmatter, dict):
        frontmatter = {}
    upstream = _extract_upstream(fm_text)

    contract = None
    json_blocks = JSON_BLOCK_RE.findall(text)
    if json_blocks:
        # The contract is the last fenced json block in the document.
        try:
            contract = json.loads(json_blocks[-1])
        except json.JSONDecodeError:
            contract = None

    h1_match = H1_RE.search(text)
    h1 = h1_match.group(1).strip() if h1_match else None
    return frontmatter, upstream, contract, h1


def load_stages(episode_dir: Path) -> list[Stage]:
    stages: list[Stage] = []
    for child in sorted(episode_dir.iterdir()):
        if not child.is_dir():
            continue
        readme = child / "README.md"
        if not readme.exists():
            continue
        num_match = re.match(r"(\d+)", child.name)
        if not num_match:
            continue
        fm, upstream, contract, h1 = _parse_readme(readme)
        stages.append(
            Stage(
                number=int(num_match.group(1)),
                dirname=child.name,
                readme=readme,
                stage=str(fm.get("stage", "")),
                status=str(fm.get("status", "")),
                upstream=upstream,
                frontmatter=fm,
                contract=contract,
                h1=h1,
            )
        )
    return stages


def _resolve_upstream_status(episode_dir: Path, rel_path: str) -> str | None:
    """Map an upstream_inputs path to the actual status of its stage README."""
    target = (episode_dir / rel_path).resolve()
    candidates: list[Path] = []
    if target.suffix == ".md":
        candidates.append(target)
    else:
        # A directory reference such as "06-tts/assets/" -> the stage folder.
        stage_dir = target
        while stage_dir != episode_dir.resolve() and stage_dir.parent != stage_dir:
            if stage_dir.parent.resolve() == episode_dir.resolve():
                break
            stage_dir = stage_dir.parent
        candidates.append(stage_dir / "README.md")
    for cand in candidates:
        if cand.exists():
            fm, _, _, _ = _parse_readme(cand)
            status = fm.get("status")
            if status:
                return str(status)
    return None


def _schema_for(stage_value: str) -> Path | None:
    schema = SCHEMA_DIR / f"{stage_value}.schema.json"
    return schema if schema.exists() else None


def _contract_section_count(contract: dict) -> int | None:
    if not isinstance(contract, dict):
        return None
    if isinstance(contract.get("sections"), list):
        return len(contract["sections"])
    if isinstance(contract.get("scenes"), list):
        return len(contract["scenes"])
    if isinstance(contract.get("total_scenes"), int):
        return contract["total_scenes"]
    return None


def lint_episode(episode_dir: Path, report: Report) -> None:
    stages = load_stages(episode_dir)
    ep = episode_dir.name

    script_stage = next(
        (s for s in stages if s.stage.startswith("04") and s.contract), None
    )
    forbidden = []
    script_section_count = None
    script_number = script_stage.number if script_stage else None
    if script_stage and isinstance(script_stage.contract, dict):
        forbidden = script_stage.contract.get("anti_hype_forbidden") or []
        script_section_count = _contract_section_count(script_stage.contract)

    for stage in stages:
        tag = f"[{ep}/{stage.dirname}]"
        if stage.status in EXCLUDED:
            report.note(f"{tag} skipped (status: {stage.status or 'unset'})")
            continue

        # Contract violations hard-fail once a stage is being promoted
        # (reviewed/approved); on a draft (pre-review WIP) they are warnings.
        promote = report.error if stage.status in STRICT_CONSUMER else report.warn

        # 1. schema validation
        schema_path = _schema_for(stage.stage)
        if schema_path and stage.contract is not None:
            try:
                import jsonschema

                schema = json.loads(schema_path.read_text(encoding="utf-8"))
                errs = sorted(
                    jsonschema.Draft202012Validator(schema).iter_errors(stage.contract),
                    key=lambda e: list(e.path),
                )
                for e in errs:
                    loc = "/".join(str(p) for p in e.path) or "<root>"
                    report.error(f"{tag} schema: {loc}: {e.message}")
            except ImportError:
                report.warn(f"{tag} schema: jsonschema not installed, skipped")
        elif schema_path and stage.contract is None:
            report.warn(f"{tag} schema: no trailing ```json``` contract block to validate")

        # 2 & 3. provenance + gating
        for entry in stage.upstream:
            m = UPSTREAM_RE.match(entry)
            if not m:
                continue
            rel_path, recorded = m.group("path"), m.group("status")
            actual = _resolve_upstream_status(episode_dir, rel_path)
            if actual is None:
                continue
            if actual != recorded:
                report.error(
                    f"{tag} provenance: upstream '{rel_path}' recorded as "
                    f"'{recorded}' but is actually '{actual}'"
                )
            if stage.status in STRICT_CONSUMER and actual not in SAFE_UPSTREAM:
                report.error(
                    f"{tag} gating: stage is '{stage.status}' but upstream "
                    f"'{rel_path}' is '{actual}' (must be approved/suspended)"
                )

        # 4. assembly <-> script consistency
        is_assembly = "assembly" in stage.stage or (
            stage.contract is not None
            and ("scenes" in stage.contract or "total_scenes" in stage.contract)
        )
        if is_assembly and script_section_count is not None:
            count = _contract_section_count(stage.contract or {})
            if count is not None and count != script_section_count:
                promote(
                    f"{tag} consistency: {count} scenes but 04 script defines "
                    f"{script_section_count} sections (structure drifted from SSOT)"
                )

        # 5. anti-hype title scan (only downstream of the 04 contract that set it)
        downstream = script_number is not None and stage.number > script_number
        if downstream and stage.h1 and forbidden:
            for phrase in forbidden:
                if phrase in stage.h1:
                    promote(
                        f"{tag} anti-hype: title contains banned phrase "
                        f"'{phrase}' (04 contract forbids it)"
                    )


def _has_numbered_stages(path: Path) -> bool:
    return any(c.is_dir() and re.match(r"\d+-", c.name) for c in path.iterdir())


def find_episodes(root: Path) -> list[Path]:
    # A single episode directory contains numbered stage folders (e.g. 04-script).
    if _has_numbered_stages(root):
        return [root]
    # Otherwise treat root as the content-library and collect episode folders.
    return sorted(
        p for p in root.iterdir() if p.is_dir() and _has_numbered_stages(p)
    )


def main(argv: list[str]) -> int:
    target = Path(argv[1]) if len(argv) > 1 else REPO_ROOT / "content-library"
    if not target.is_absolute():
        target = (REPO_ROOT / target).resolve()
    if not target.exists():
        print(f"path not found: {target}", file=sys.stderr)
        return 2

    episodes = find_episodes(target)
    if not episodes:
        print(f"no episodes found under {target}", file=sys.stderr)
        return 2

    report = Report()
    for episode in episodes:
        lint_episode(episode, report)

    for note in report.notes:
        print(f"note  {note}")
    for warn in report.warnings:
        print(f"WARN  {warn}")
    for err in report.errors:
        print(f"ERROR {err}")

    print(
        f"\n{len(episodes)} episode(s): "
        f"{len(report.errors)} error(s), {len(report.warnings)} warning(s)"
    )
    return 1 if report.errors else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
