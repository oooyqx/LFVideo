"""Unit + smoke tests for scripts/pipeline_lint.py."""
from __future__ import annotations

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent))

import pipeline_lint as P  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent


def _write_stage(ep: Path, dirname: str, frontmatter: str, body: str = "# Title\n") -> None:
    stage = ep / dirname
    stage.mkdir(parents=True, exist_ok=True)
    (stage / "README.md").write_text(f"---\n{frontmatter}\n---\n\n{body}", encoding="utf-8")


def _script_block(sections: int, forbidden: list[str] | None = None) -> str:
    secs = ",\n".join(
        f'{{"id":"{i}","track":"A","voice":"v","visual_instructions":"x","duration_hint_seconds":10}}'
        for i in range(sections)
    )
    extra = f'"anti_hype_forbidden": {forbidden!r},\n  ' if forbidden else ""
    extra = extra.replace("'", '"')
    return (
        "# ep 脚本\n\n```json\n{\n  "
        + extra
        + f'"title":"t","sections":[{secs}],'
        '"judgment_layer_coverage":{"highlights_pitfall":true,'
        '"explains_boundary":true,"acceptance_standard":true}\n}\n```\n'
    )


def _lint(ep: Path) -> P.Report:
    report = P.Report()
    P.lint_episode(ep, report)
    return report


def test_provenance_mismatch_is_error(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(ep, "04-script", "stage: 04-script\nstatus: approved", _script_block(3))
    _write_stage(
        ep,
        "06-tts",
        "stage: 06-tts-synthesis\nstatus: approved\nupstream_inputs:\n  - 04-script/README.md (status: draft)",
    )
    report = _lint(ep)
    assert any("provenance" in e and "04-script" in e for e in report.errors)


def test_provenance_match_is_clean(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(ep, "04-script", "stage: 04-script\nstatus: approved", _script_block(3))
    _write_stage(
        ep,
        "06-tts",
        "stage: 06-tts-synthesis\nstatus: approved\nupstream_inputs:\n  - 04-script/README.md (status: approved)",
    )
    report = _lint(ep)
    assert not report.errors


def test_gating_blocks_approved_on_draft_upstream(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(ep, "04-script", "stage: 04-script\nstatus: draft", _script_block(3))
    _write_stage(
        ep,
        "07-assembly",
        "stage: 07-video-assembly\nstatus: approved\nupstream_inputs:\n  - 04-script/README.md (status: draft)",
    )
    report = _lint(ep)
    assert any("gating" in e for e in report.errors)


def test_assembly_scene_count_drift_is_error(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(ep, "04-script", "stage: 04-script\nstatus: approved", _script_block(16))
    body = '# ep 组装\n\n```json\n{"stage":"07-video-assembly","total_scenes":5}\n```\n'
    _write_stage(
        ep,
        "07-assembly",
        "stage: 07-video-assembly\nstatus: approved\nupstream_inputs:\n  - 04-script/README.md (status: approved)",
        body,
    )
    report = _lint(ep)
    assert any("consistency" in e and "5 scenes" in e for e in report.errors)


def test_anti_hype_title_is_flagged(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(
        ep, "04-script", "stage: 04-script\nstatus: approved",
        _script_block(3, forbidden=["100 行"]),
    )
    _write_stage(
        ep,
        "06-distribute",
        "stage: 06-distribute-adapt\nstatus: approved\nupstream_inputs:\n  - 04-script/README.md (status: approved)",
        "# 如何用 100 行 React 编译视频\n",
    )
    report = _lint(ep)
    assert any("anti-hype" in e and "100 行" in e for e in report.errors)


def test_superseded_stage_is_skipped(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(
        ep, "04-script", "stage: 04-script\nstatus: approved",
        _script_block(16, forbidden=["100 行"]),
    )
    body = '# 如何用 100 行 React\n\n```json\n{"scenes":[1,2,3]}\n```\n'
    _write_stage(ep, "05-assembly", "stage: 05-video-assembly\nstatus: superseded", body)
    report = _lint(ep)
    assert not report.errors
    assert any("skipped" in n for n in report.notes)


def test_draft_violation_warns_but_does_not_error(tmp_path: Path) -> None:
    ep = tmp_path / "ep99-test"
    _write_stage(
        ep, "04-script", "stage: 04-script\nstatus: approved",
        _script_block(3, forbidden=["100 行"]),
    )
    _write_stage(
        ep,
        "06-distribute",
        "stage: 06-distribute-adapt\nstatus: draft\nupstream_inputs:\n  - 04-script/README.md (status: approved)",
        "# 如何用 100 行 React 编译视频\n",
    )
    report = _lint(ep)
    assert not report.errors
    assert any("anti-hype" in w for w in report.warnings)


def test_real_ep02_has_no_errors() -> None:
    """The production chain for ep02 must lint clean after the guardrail fixes."""
    ep = REPO_ROOT / "content-library" / "ep02-video-render"
    if not ep.exists():
        pytest.skip("ep02 content not present")
    report = _lint(ep)
    assert report.errors == [], "\n".join(report.errors)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-q"]))
