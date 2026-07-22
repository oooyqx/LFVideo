"""Single source of truth for caption segmentation.

Every consumer of caption text — the 06-tts builder (build_ep02_tts.py), the
07 props generator (tools/props_builder.py, called from each episode's
build_props.py), and the SRT/VTT generator
(tools/subtitle/subtitle_gen.py) — takes its punctuation sets, clause chunking,
speech-weight timing, and page grouping from this module. The Remotion
CaptionOverlay renders the pre-paged captions the 07 generator emits and does
not re-segment, so tuning a rule here changes every surface at once.

Two layers:

* ``chunk_text`` — splits one spoken sentence into clause-level chunks (the
  word-highlight units), merging fragments below ``MIN_CHUNK_CHARS``.
* ``paginate`` — groups timed words/chunks into on-screen pages, breaking at
  sentence ends, real speech pauses, and clause ends once a page is full, then
  merging pages that would flash by faster than ``min_duration_s``.
"""

from __future__ import annotations

from dataclasses import dataclass

# Punctuation that ends a sentence — a strong, almost-always-correct break point.
SENTENCE_END = frozenset(".!?…。！？")
# Punctuation that ends a clause — a softer break point, used once a page is
# already reasonably full so we don't strand a couple of words on their own.
CLAUSE_END = frozenset(",;:，、；：—―")
# A chunk shorter than this reads as a flash of text on screen; merge it with
# its neighbour instead of emitting it as its own caption unit.
MIN_CHUNK_CHARS = 5
# Neutral stops stripped from the END of a displayed page/cue — the page break
# itself marks the pause, so they read as clutter. Expressive marks (？！…)
# stay because they carry tone, not just rhythm.
TRAILING_STRIP = frozenset("。．.，、；：,;:—―")


def strip_trailing_punct(text: str) -> str:
    """Drop neutral trailing stops from a page/cue's displayed text."""
    while text and text[-1] in TRAILING_STRIP:
        text = text[:-1]
    return text.rstrip()


def strip_leading_punct(text: str) -> str:
    """Drop stray leading stops (e.g. the second half of a —— dash) from a page."""
    while text and text[0] in TRAILING_STRIP:
        text = text[1:]
    return text.lstrip()


def is_cjk_char(ch: str) -> bool:
    """True for CJK ideographs, kana, and Hangul (scripts written without spaces)."""
    code = ord(ch)
    return (
        0x3040 <= code <= 0x30FF  # Hiragana + Katakana
        or 0x3400 <= code <= 0x4DBF  # CJK Extension A
        or 0x4E00 <= code <= 0x9FFF  # CJK Unified Ideographs
        or 0xF900 <= code <= 0xFAFF  # CJK Compatibility Ideographs
        or 0xAC00 <= code <= 0xD7A3  # Hangul syllables
    )


def is_cjk_text(text: str) -> bool:
    """Heuristic: treat text as CJK if a meaningful fraction of glyphs are CJK."""
    glyphs = [c for c in text if not c.isspace()]
    if not glyphs:
        return False
    cjk = sum(1 for c in glyphs if is_cjk_char(c))
    return cjk / len(glyphs) >= 0.3


def visible_len(text: str) -> int:
    """Character count ignoring punctuation and whitespace."""
    return sum(
        1
        for ch in text
        if not (ch.isspace() or ch in SENTENCE_END or ch in CLAUSE_END)
    )


def speech_weight(text: str) -> float:
    """Approximate spoken duration weight of a chunk.

    One CJK glyph is roughly one syllable; a run of Latin/digit characters is
    one word spoken at roughly one syllable per ~3 characters. Punctuation and
    whitespace carry no weight. Splitting sentence time by raw ``len()`` makes
    ASCII-heavy chunks (URLs, identifiers) hog far more time than is actually
    spoken, drifting every following caption in the sentence.
    """
    weight = 0.0
    ascii_run = 0
    for ch in text:
        if is_cjk_char(ch):
            weight += 1.0
            ascii_run = 0
        elif ch.isalnum():
            ascii_run += 1
        else:
            if ascii_run:
                weight += max(1.0, ascii_run / 3.0)
            ascii_run = 0
    if ascii_run:
        weight += max(1.0, ascii_run / 3.0)
    return max(weight, 1.0)


def chunk_text(text: str) -> list[str]:
    """Split a sentence into clause-level chunks, keeping trailing punctuation.

    Chunks below MIN_CHUNK_CHARS visible characters are merged into the next
    chunk (or the previous one at end of sentence) so no caption unit flashes
    by as a two/three-character fragment.
    """
    chunks: list[str] = []
    buf = ""
    for ch in text:
        buf += ch
        if ch in SENTENCE_END or ch in CLAUSE_END:
            chunks.append(buf)
            buf = ""
    if buf.strip():
        chunks.append(buf)
    chunks = [c for c in chunks if c.strip()]

    merged: list[str] = []
    for c in chunks:
        if merged and visible_len(merged[-1]) < MIN_CHUNK_CHARS:
            merged[-1] += c
        else:
            merged.append(c)
    if len(merged) >= 2 and visible_len(merged[-1]) < MIN_CHUNK_CHARS:
        merged[-2] += merged[-1]
        merged.pop()
    return merged


@dataclass
class PaginationOptions:
    """Tunable knobs that control how timed words group into pages/cues."""

    max_words: int = 8  # Latin scripts only; CJK is governed by chars
    max_chars: int = 42  # per line, Latin
    max_chars_cjk: int = 36  # per line, CJK
    max_lines: int = 1
    pause_threshold_s: float = 0.5
    max_duration_s: float = 6.0
    min_duration_s: float = 1.2


Word = dict  # {"word": str, "start": float, "end": float} (seconds)


def _join(tokens: list[str], cjk: bool) -> str:
    parts = [t for t in tokens if t]
    return "".join(parts) if cjk else " ".join(parts)


def _group_len(group: list[Word], cjk: bool) -> int:
    return len(_join([w["word"].strip() for w in group], cjk))


def split_words(words: list[Word], opts: PaginationOptions) -> list[list[Word]]:
    """Group a contiguous run of timed words into pages.

    Breaks (in priority order) at sentence-ending punctuation, silent pauses
    between words, and clause-ending punctuation once a page is ~60% full —
    always respecting the per-page char/word/duration budget.
    """
    if not words:
        return []
    cjk = is_cjk_text("".join(w["word"] for w in words))
    char_limit = (opts.max_chars_cjk if cjk else opts.max_chars) * max(opts.max_lines, 1)

    groups: list[list[Word]] = []
    buf: list[Word] = []
    for i, w in enumerate(words):
        text = w["word"].strip()
        if buf:
            over_words = (not cjk) and len(buf) >= opts.max_words
            over_chars = _group_len(buf + [w], cjk) > char_limit
            over_time = (w["end"] - buf[0]["start"]) > opts.max_duration_s
            if over_words or over_chars or over_time:
                groups.append(buf)
                buf = []
        buf.append(w)
        if i == len(words) - 1:
            break
        trailing = text[-1] if text else ""
        gap = words[i + 1]["start"] - w["end"]
        if trailing in SENTENCE_END:
            groups.append(buf)
            buf = []
        elif gap >= opts.pause_threshold_s and len(buf) >= 2:
            groups.append(buf)
            buf = []
        elif trailing in CLAUSE_END and _group_len(buf, cjk) >= char_limit * 0.6:
            groups.append(buf)
            buf = []
    if buf:
        groups.append(buf)
    return groups


def merge_short_groups(
    groups: list[list[Word]], opts: PaginationOptions
) -> list[list[Word]]:
    """Merge pages that would flash by into the previous page.

    Only merges when no real speech pause separates the pages and the combined
    page still fits the char/word/duration budget, so a good linguistic break
    is never undone.
    """
    merged: list[list[Word]] = []
    for group in groups:
        if merged:
            prev = merged[-1]
            dur = group[-1]["end"] - group[0]["start"]
            gap = group[0]["start"] - prev[-1]["end"]
            cjk = is_cjk_text(
                "".join(w["word"] for w in prev) + "".join(w["word"] for w in group)
            )
            char_limit = (
                opts.max_chars_cjk if cjk else opts.max_chars
            ) * max(opts.max_lines, 1)
            if (
                dur < opts.min_duration_s
                and gap < opts.pause_threshold_s
                and _group_len(prev + group, cjk) <= char_limit
                and (cjk or len(prev) + len(group) <= opts.max_words)
                and group[-1]["end"] - prev[0]["start"] <= opts.max_duration_s
            ):
                prev.extend(group)
                continue
        merged.append(list(group))
    return merged


def paginate(words: list[Word], opts: PaginationOptions | None = None) -> list[list[Word]]:
    """split_words + merge_short_groups in one call."""
    opts = opts or PaginationOptions()
    return merge_short_groups(split_words(words, opts), opts)
