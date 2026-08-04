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
import math
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_DIR = REPO_ROOT / "shared" / "schemas"

sys.path.insert(0, str(REPO_ROOT / "OpenMontage"))
from tools.subtitle.segmentation import (  # noqa: E402
    TRAILING_STRIP,
    PaginationOptions,
    is_cjk_text,
)

# Generated Remotion props live here; their cut.type must hit a renderable type.
COMPOSER_DIR = REPO_ROOT / "OpenMontage" / "remotion-composer"
SCENE_TYPES_JSON = COMPOSER_DIR / "src" / "custom-templates" / "scene-types.json"
DEMO_PROPS_DIR = COMPOSER_DIR / "public" / "demo-props"

# Non-template cut types the Explainer dispatcher renders directly (the template
# scene types come from scene-types.json — the registry SSOT). A cut with no
# ``type`` is a raw media clip and must instead carry a ``source``.
BUILTIN_CUT_TYPES = {
    "text_card",
    "hero_title",
    "stat_card",
    "callout",
    "comparison",  # legacy alias, still dispatched -> ComparisonScene
    "terminal_scene",  # legacy alias, still dispatched -> CodeScene
    "bar_chart",
    "line_chart",
    "pie_chart",
    "kpi_grid",
    "progress_bar",
    "anime_scene",
    "screenshot_scene",
}

# A single static picture may not stay on screen longer than this (see
# shared/docs/remotion-spec.md §1.5). Sections longer than this must be cut
# into shots[] rather than carrying one component for the whole paragraph.
DEADTIME_LIMIT_SECONDS = 15

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


def _stage_doc(stage_dir: Path) -> Path | None:
    """Return the canonical doc for a stage folder.

    The convention is ``README.md``; some stages keep their doc under a
    stage-numbered filename instead (e.g. ``05-assembly/05-b-roll.md``), so we
    fall back to a ``NN-*.md`` file when ``README.md`` is absent.
    """
    readme = stage_dir / "README.md"
    if readme.exists():
        return readme
    numbered = sorted(p for p in stage_dir.glob("*.md") if re.match(r"\d+-", p.name))
    return numbered[0] if numbered else None


def load_stages(episode_dir: Path) -> list[Stage]:
    stages: list[Stage] = []
    for child in sorted(episode_dir.iterdir()):
        if not child.is_dir():
            continue
        readme = _stage_doc(child)
        if readme is None:
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
        doc = _stage_doc(stage_dir)
        candidates.append(doc if doc is not None else stage_dir / "README.md")
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


def _script_unit_count(contract: dict) -> int | None:
    """The renderable scene count the 04 SSOT defines.

    A section is cut into ``shots[]`` (one renderable scene each); a section
    with no shots counts as a single scene. Stage 07 maps one scene per shot,
    so this — not the raw section count — is what assembly must match.
    """
    if not isinstance(contract, dict):
        return None
    sections = contract.get("sections")
    if not isinstance(sections, list):
        return _contract_section_count(contract)
    total = 0
    for sec in sections:
        shots = sec.get("shots") if isinstance(sec, dict) else None
        total += len(shots) if isinstance(shots, list) and shots else 1
    return total


def _check_anti_deadtime(stage: "Stage", tag: str, report: Report, promote) -> None:
    """Hard-enforce shared/docs/remotion-spec.md §1.5 on the 04 script.

    Any section longer than ``DEADTIME_LIMIT_SECONDS`` must be cut into enough
    ``shots[]`` that no single picture stays on screen past the limit. Legacy
    ``visual_beats``/``sub_shots`` (descriptive, non-renderable annotations)
    only earn a migration warning; a long section with neither is real
    deadtime and fails once the stage is approved/reviewed.
    """
    contract = stage.contract
    if not isinstance(contract, dict):
        return
    sections = contract.get("sections")
    if not isinstance(sections, list):
        return
    for sec in sections:
        if not isinstance(sec, dict):
            continue
        dur = sec.get("duration_hint_seconds")
        if not isinstance(dur, (int, float)) or dur <= DEADTIME_LIMIT_SECONDS:
            continue
        sid = sec.get("id", "?")
        min_shots = math.ceil(dur / DEADTIME_LIMIT_SECONDS)
        shots = sec.get("shots")
        if isinstance(shots, list) and shots:
            if len(shots) < min_shots:
                promote(
                    f"{tag} anti-deadtime: section '{sid}' is {dur}s but has only "
                    f"{len(shots)} shot(s); needs >= {min_shots} "
                    f"(one shot per <= {DEADTIME_LIMIT_SECONDS}s)"
                )
            shot_durs = [
                s.get("duration_seconds")
                for s in shots
                if isinstance(s, dict)
            ]
            if shot_durs and all(isinstance(d, (int, float)) for d in shot_durs):
                total = sum(shot_durs)
                if abs(total - dur) > max(5, 0.25 * dur):
                    report.warn(
                        f"{tag} anti-deadtime: section '{sid}' shot durations sum "
                        f"to {total}s but section duration_hint is {dur}s"
                    )
        elif sec.get("visual_beats") or sec.get("sub_shots"):
            report.warn(
                f"{tag} anti-deadtime: section '{sid}' is {dur}s and relies on "
                f"legacy visual_beats/sub_shots annotations (not renderable); "
                f"migrate to shots[] with >= {min_shots} shots for real fast-cut"
            )
        else:
            promote(
                f"{tag} anti-deadtime: section '{sid}' is {dur}s with a single "
                f"static picture (no shots[], no visual_beats); cut into "
                f">= {min_shots} shots"
            )


# Chinese voice-over timing range: 4-5 chars/sec (voice-style.md §二).
# We use a wider advisory band (3.5-5.5) so only gross mismatches are flagged.
CHARS_PER_SEC_FAST = 5.5
CHARS_PER_SEC_SLOW = 3.5


def _cjk_char_count(text: str) -> int:
    """Count non-whitespace characters for voice timing estimation.

    For CJK voice-over, each character is roughly one syllable; whitespace
    and punctuation are excluded from the timing estimate.
    """
    return len(re.sub(r"[\s\u3000]+", "", text))


def _check_voice_slice_integrity(
    stage: "Stage", tag: str, report: Report, promote
) -> None:
    """Verify voice_slice concatenation and duration<->char-count consistency.

    Two checks per section (script-director §双区一致性, L4 machine guard):
    1. **Concatenation** (hard): all ``voice_slice`` joined (whitespace-stripped)
       must equal the section ``voice`` — no missing, extra, or reordered text.
    2. **Duration <-> char count** (advisory): each shot's ``duration_seconds``
       should fall within the 3.5-5.5 chars/sec band.  Outside the band is a
       warning (not error) because actual timing is set by TTS audio, not the
       script estimate.
    """
    contract = stage.contract
    if not isinstance(contract, dict):
        return
    sections = contract.get("sections")
    if not isinstance(sections, list):
        return
    for sec in sections:
        if not isinstance(sec, dict):
            continue
        sid = sec.get("id", "?")
        voice = sec.get("voice")
        shots = sec.get("shots")
        if not isinstance(shots, list) or not shots:
            continue

        # --- Check 1: voice_slice concatenation completeness ---
        if isinstance(voice, str):
            slices = [
                s.get("voice_slice") for s in shots
                if isinstance(s, dict) and isinstance(s.get("voice_slice"), str)
            ]
            if slices and all(s for s in slices):
                joined = "".join(re.sub(r"\s+", "", s) for s in slices)
                expected = re.sub(r"\s+", "", voice)
                if joined != expected:
                    # Find first divergence for a helpful message
                    diff_pos = next(
                        (i for i in range(min(len(joined), len(expected)))
                         if joined[i] != expected[i]),
                        min(len(joined), len(expected)),
                    )
                    ctx = 20
                    j_snip = joined[max(0, diff_pos - ctx):diff_pos + ctx]
                    e_snip = expected[max(0, diff_pos - ctx):diff_pos + ctx]
                    promote(
                        f"{tag} voice-slice: section '{sid}' concatenated "
                        f"voice_slice does not reconstruct section voice. "
                        f"First divergence at char {diff_pos}:\n"
                        f"  slices: …{j_snip}…\n"
                        f"  voice:  …{e_snip}…"
                    )
            elif len(slices) < len(shots):
                promote(
                    f"{tag} voice-slice: section '{sid}' has {len(shots)} "
                    f"shot(s) but only {len(slices)} have voice_slice text"
                )

        # --- Check 2: per-shot duration <-> char count (advisory) ---
        for shot in shots:
            if not isinstance(shot, dict):
                continue
            shot_id = shot.get("id", "?")
            slice_text = shot.get("voice_slice")
            dur = shot.get("duration_seconds")
            if not isinstance(slice_text, str) or not slice_text:
                continue
            if not isinstance(dur, (int, float)):
                continue

            char_count = _cjk_char_count(slice_text)
            if char_count == 0:
                continue
            fast_dur = char_count / CHARS_PER_SEC_FAST
            slow_dur = char_count / CHARS_PER_SEC_SLOW
            if dur < fast_dur or dur > slow_dur:
                report.warn(
                    f"{tag} voice-slice: section '{sid}' shot '{shot_id}' "
                    f"duration {dur}s vs {char_count} chars "
                    f"(expected {fast_dur:.1f}-{slow_dur:.1f}s at 3.5-5.5 ch/s)"
                )


# Internal pipeline jargon that must never be read out to the audience
# (voice-style.md《术语白话化》). Industry-standard names (React, FFmpeg,
# TypeScript) are fine and not listed here.
VOICE_JARGON = (
    "A 轨", "A轨", "B 轨", "B轨", "B-roll", "b-roll", "SSOT", "分镜号",
)


def _check_voice_jargon(stage: "Stage", tag: str, report: Report, promote) -> None:
    """Scan 04 voice text for internal jargon the audience can't know."""
    contract = stage.contract
    if not isinstance(contract, dict):
        return
    sections = contract.get("sections")
    if not isinstance(sections, list):
        return
    for sec in sections:
        if not isinstance(sec, dict):
            continue
        sid = sec.get("id", "?")
        texts = [("voice", sec.get("voice"))]
        shots = sec.get("shots")
        if isinstance(shots, list):
            for shot in shots:
                if isinstance(shot, dict):
                    texts.append(
                        (f"shot {shot.get('id', '?')} voice_slice",
                         shot.get("voice_slice"))
                    )
        for label, text in texts:
            if not isinstance(text, str):
                continue
            for term in VOICE_JARGON:
                if term in text:
                    promote(
                        f"{tag} voice-jargon: section '{sid}' {label} contains "
                        f"internal term '{term}' — rephrase for the audience "
                        f"(voice-style.md《术语白话化》)"
                    )


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
        script_section_count = _script_unit_count(script_stage.contract)

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
                    f"{script_section_count} renderable scenes/shots "
                    f"(structure drifted from SSOT)"
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

        # 6. anti-deadtime (04 script only): long sections must be cut into shots
        if stage.stage.startswith("04") and isinstance(stage.contract, dict):
            _check_anti_deadtime(stage, tag, report, promote)
            # 7. voice jargon scan: internal pipeline terms must not be read out
            _check_voice_jargon(stage, tag, report, promote)
            # 8. voice_slice integrity: concatenation + duration<->char-count
            _check_voice_slice_integrity(stage, tag, report, promote)


def _load_template_scene_manifest(
    scene_types_json: Path,
) -> tuple[set[str], dict[str, list[str]]]:
    """Return (template scene types, type -> required fields) from the SSOT."""
    data = json.loads(scene_types_json.read_text(encoding="utf-8"))
    types: set[str] = set()
    required: dict[str, list[str]] = {}
    for scene in data.get("scenes", []):
        t = scene["type"]
        types.add(t)
        required[t] = list(scene.get("required", []))
    return types, required


def lint_remotion_props(
    report: Report,
    props_dir: Path = DEMO_PROPS_DIR,
    scene_types_json: Path = SCENE_TYPES_JSON,
) -> None:
    """Every ``cut.type`` in generated Remotion props must be renderable.

    The Explainer silently drops a cut whose ``type`` matches no dispatch case
    (or falls back to a raw media clip), so a typo'd / retired type vanishes
    from the video with no error. This pins generated props to the template
    registry (scene-types.json) plus the built-in dispatcher types, and checks
    that each template cut carries its schema-required fields.
    """
    if not scene_types_json.exists():
        report.note(f"remotion-props: {scene_types_json} not found, skipped")
        return
    if not props_dir.exists():
        report.note(f"remotion-props: {props_dir} not found, skipped")
        return

    template_types, template_required = _load_template_scene_manifest(scene_types_json)
    renderable = template_types | BUILTIN_CUT_TYPES

    for props_file in sorted(props_dir.glob("*.json")):
        try:
            shown = props_file.relative_to(REPO_ROOT)
        except ValueError:
            shown = props_file.name
        tag = f"[{shown}]"
        try:
            data = json.loads(props_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            report.error(f"{tag} props: invalid JSON ({exc})")
            continue
        cuts = data.get("cuts")
        if not isinstance(cuts, list):
            continue
        for cut in cuts:
            if not isinstance(cut, dict):
                continue
            cid = cut.get("id", "?")
            ctype = cut.get("type")
            if not ctype:
                if not cut.get("source"):
                    report.error(
                        f"{tag} props: cut '{cid}' has no type and no source "
                        f"(would render nothing)"
                    )
                continue
            if ctype not in renderable:
                report.error(
                    f"{tag} props: cut '{cid}' type '{ctype}' is not registered "
                    f"(not a template scene nor a built-in dispatcher type)"
                )
                continue
            missing = [f for f in template_required.get(ctype, []) if cut.get(f) in (None, "", [])]
            if missing:
                report.error(
                    f"{tag} props: cut '{cid}' ({ctype}) missing required "
                    f"field(s): {', '.join(missing)}"
                )


def lint_caption_pages(
    report: Report,
    props_dir: Path = DEMO_PROPS_DIR,
) -> None:
    """Generated caption pages must be readable and stay on the timeline.

    Catches the ways caption segmentation silently regresses (the rules live in
    OpenMontage/tools/subtitle/segmentation.py): pages flashing by faster than
    the minimum duration, pages overflowing the two-line char budget, pages
    running past the video's end (the double-offset failure mode), out-of-order
    timing, and neutral trailing stops the generator should have stripped.
    """
    if not props_dir.exists():
        return
    opts = PaginationOptions()

    for props_file in sorted(props_dir.glob("*.json")):
        try:
            data = json.loads(props_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue  # reported by lint_remotion_props
        captions = data.get("captions")
        cuts = data.get("cuts")
        if not captions or not isinstance(captions, list):
            continue
        try:
            shown = props_file.relative_to(REPO_ROOT)
        except ValueError:
            shown = props_file.name
        tag = f"[{shown}]"

        if not isinstance(captions[0], dict) or "words" not in captions[0]:
            report.warn(
                f"{tag} captions: flat WordCaption list (not pre-paged); the "
                f"renderer falls back to client-side pagination — regenerate "
                f"props with the 07 generator"
            )
            continue

        timeline_end_ms = None
        if isinstance(cuts, list) and cuts:
            timeline_end_ms = max(
                float(c.get("out_seconds", 0)) for c in cuts if isinstance(c, dict)
            ) * 1000

        prev_end = None
        for i, page in enumerate(captions):
            words = page.get("words") or []
            text = "".join(w.get("word", "").strip() for w in words)
            pid = f"page {i} ({text[:12]}…)" if len(text) > 12 else f"page {i} ({text})"
            start, end = page.get("startMs", 0), page.get("endMs", 0)
            dur = end - start
            if end < start:
                report.error(f"{tag} captions: {pid} endMs < startMs")
            if prev_end is not None and start < prev_end:
                report.error(f"{tag} captions: {pid} overlaps previous page")
            prev_end = end
            if timeline_end_ms is not None and end > timeline_end_ms + 50:
                report.error(
                    f"{tag} captions: {pid} ends at {end}ms, past the "
                    f"{timeline_end_ms:.0f}ms timeline (double offset?)"
                )
            gap_after = (
                captions[i + 1]["startMs"] - end if i + 1 < len(captions) else None
            )
            if dur < opts.min_duration_s * 1000 and (
                gap_after is None or gap_after < opts.pause_threshold_s * 1000
            ):
                report.error(
                    f"{tag} captions: {pid} flashes by ({dur}ms < "
                    f"{opts.min_duration_s * 1000:.0f}ms minimum)"
                )
            char_limit = (
                opts.max_chars_cjk if is_cjk_text(text) else opts.max_chars
            ) * opts.max_lines
            if len(text) > char_limit:
                report.error(
                    f"{tag} captions: {pid} is {len(text)} chars "
                    f"(> {char_limit} two-line budget)"
                )
            trailing = text[-1] if text else ""
            if trailing in TRAILING_STRIP:
                report.error(
                    f"{tag} captions: {pid} ends with '{trailing}' — neutral "
                    f"trailing stops must be stripped (broadcast convention)"
                )
            leading = text[0] if text else ""
            if leading in TRAILING_STRIP:
                report.error(
                    f"{tag} captions: {pid} starts with '{leading}' — stray "
                    f"leading stops must be stripped"
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

    # Generated Remotion props (cut.type must hit the template registry).
    lint_remotion_props(report)

    # Generated caption pages (readability + timeline bounds).
    lint_caption_pages(report)

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
