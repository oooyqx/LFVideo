import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Scramble,
  RGBTearText,
  clamp01,
  easeOutCubic,
} from "../custom-templates/primitives/textfx-utils";

// Word-level caption for TikTok-style highlight display
export interface WordCaption {
  word: string;
  startMs: number;
  endMs: number;
}

// Pre-paged caption: one on-screen page with its word-level timings. Produced
// by the 07 props generator via tools/subtitle/segmentation.py — the single
// source of truth for segmentation — so the renderer never re-segments.
export interface CaptionPageInput {
  startMs: number;
  endMs: number;
  words: WordCaption[];
}

export type CaptionsInput = WordCaption[] | CaptionPageInput[];

export function isPagedCaptions(items: CaptionsInput): items is CaptionPageInput[] {
  return items.length > 0 && Array.isArray((items[0] as CaptionPageInput).words);
}

/** Caption entrance animation mode. */
export type CaptionAnimation = "spring" | "scramble" | "rgb-tear";

interface CaptionOverlayProps {
  words: CaptionsInput;
  // Hard cap on words per page (Latin scripts); CJK is governed by chars.
  wordsPerPage?: number;
  // Max characters per page before forcing a break (Latin / CJK).
  maxCharsLatin?: number;
  maxCharsCjk?: number;
  // Silence gap (ms) between words that triggers a natural break.
  pauseThresholdMs?: number;
  // Max on-screen duration (ms) for a single page.
  maxDurationMs?: number;
  // Min on-screen duration (ms); shorter pages merge into a neighbour.
  minDurationMs?: number;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  // Entrance animation mode: 'spring' (default) | 'scramble' | 'rgb-tear'.
  animation?: CaptionAnimation;
}

interface CaptionPage {
  words: WordCaption[];
  startMs: number;
  endMs: number;
}

// Punctuation that ends a sentence (strong break) / clause (soft break).
// Legacy fallback only: pre-paged captions are segmented upstream by
// tools/subtitle/segmentation.py (the single source of truth). Keep these
// sets in sync with that module for compositions still passing flat words.
const SENTENCE_END = new Set([".", "!", "?", "…", "。", "！", "？"]);
const CLAUSE_END = new Set([",", ";", ":", "，", "、", "；", "：", "—", "―"]);

// Neutral trailing stops dropped from the end of a displayed page — the page
// change itself marks the pause (broadcast-subtitle convention). Expressive
// marks (？！…) stay. Mirrors segmentation.py TRAILING_STRIP.
const TRAILING_STRIP_RE = /[。．.，、；：,;:—―]+\s*$/;
const LEADING_STRIP_RE = /^\s*[。．.，、；：,;:—―]+/;
function stripEdgePunct(text: string, isFirst: boolean, isLast: boolean): string {
  let t = text;
  if (isFirst) t = t.replace(LEADING_STRIP_RE, "").trimStart();
  if (isLast) t = t.replace(TRAILING_STRIP_RE, "").trimEnd();
  return t;
}

function isCJKText(text: string): boolean {
  const glyphs = [...text].filter((c) => !/\s/.test(c));
  if (glyphs.length === 0) return false;
  const cjk = glyphs.filter((c) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7a3]/.test(c)).length;
  return cjk / glyphs.length >= 0.3;
}

interface PageBreakOptions {
  wordsPerPage: number;
  maxCharsLatin: number;
  maxCharsCjk: number;
  pauseThresholdMs: number;
  maxDurationMs: number;
  minDurationMs: number;
  maxLines: number;
}

function buildPages(words: WordCaption[], opts: PageBreakOptions): CaptionPage[] {
  if (words.length === 0) return [];
  const cjk = isCJKText(words.map((w) => w.word).join(""));
  const join = (items: WordCaption[]) =>
    cjk
      ? items.map((w) => w.word.trim()).join("")
      : items.map((w) => w.word.trim()).join(" ");
  const charLimit = (cjk ? opts.maxCharsCjk : opts.maxCharsLatin) * Math.max(opts.maxLines, 1);

  const pages: CaptionPage[] = [];
  let buf: WordCaption[] = [];
  const flush = () => {
    if (buf.length === 0) return;
    pages.push({
      words: buf,
      startMs: buf[0].startMs,
      endMs: buf[buf.length - 1].endMs,
    });
    buf = [];
  };

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const wtext = w.word.trim();

    if (buf.length > 0) {
      const overWords = !cjk && buf.length >= opts.wordsPerPage;
      const overChars = join([...buf, w]).length > charLimit;
      const overTime = w.endMs - buf[0].startMs > opts.maxDurationMs;
      if (overWords || overChars || overTime) flush();
    }

    buf.push(w);
    if (i === words.length - 1) break;

    const trailing = wtext.slice(-1);
    const gap = words[i + 1].startMs - w.endMs;
    if (SENTENCE_END.has(trailing)) {
      flush();
    } else if (gap >= opts.pauseThresholdMs && buf.length >= 2) {
      flush();
    } else if (CLAUSE_END.has(trailing) && join(buf).length >= charLimit * 0.6) {
      flush();
    }
  }
  flush();

  // Merge pages that would flash by into the previous page when the combined
  // page still fits the char/time budget and no real speech pause separates
  // them — a lone "齐活。" blinking for half a second reads as a glitch.
  const merged: CaptionPage[] = [];
  for (const page of pages) {
    const prev = merged[merged.length - 1];
    const dur = page.endMs - page.startMs;
    if (prev && dur < opts.minDurationMs) {
      const gap = page.startMs - prev.endMs;
      const fitsChars = join([...prev.words, ...page.words]).length <= charLimit;
      const fitsTime = page.endMs - prev.startMs <= opts.maxDurationMs;
      if (gap < opts.pauseThresholdMs && fitsChars && fitsTime) {
        prev.words = [...prev.words, ...page.words];
        prev.endMs = page.endMs;
        continue;
      }
    }
    merged.push(page);
  }
  return merged;
}

const PageRenderer: React.FC<{
  page: CaptionPage;
  fontSize: number;
  color: string;
  highlightColor: string;
  backgroundColor: string;
  fontFamily: string;
  animation: CaptionAnimation;
}> = ({ page, fontSize, color, highlightColor, backgroundColor, fontFamily, animation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentMs = page.startMs + (frame / fps) * 1000;
  // CJK scripts are written without spaces between glyphs.
  const cjk = isCJKText(page.words.map((w) => w.word).join(""));
  const wordSep = cjk ? "" : " ";

  // Entrance progress (0→1) over first ~15 frames
  const entranceFrames = 15;
  const entranceProgress = easeOutCubic(clamp01(frame / entranceFrames));

  // Spring entrance (default)
  const entrance = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  // Build the text content for glitch modes
  const pageText = page.words.map((w) => w.word.trim()).join(wordSep);

  // Wrapper style varies by animation mode
  const wrapperOpacity =
    animation === "scramble" ? Math.min(1, entranceProgress * 2)
    : animation === "rgb-tear" ? Math.min(1, entranceProgress * 3)
    : entrance;
  const wrapperTransform =
    animation === "spring"
      ? `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`
      : undefined;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 80,
      }}
    >
      <div
        style={{
          opacity: wrapperOpacity,
          transform: wrapperTransform,
          maxWidth: "80%",
          textAlign: "center",
        }}
      >        {animation === "scramble" ? (
          <span
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              color: "#FFFFFF",
              textShadow: `0 0 16px rgba(167,139,250,0.6), 0 0 32px rgba(167,139,250,0.35), 0 2px 6px rgba(0,0,0,0.6), 1px 0 0 #C4B5FD, -1px 0 0 #C4B5FD, 0 1px 0 #C4B5FD, 0 -1px 0 #C4B5FD`,
            }}
          >
            <Scramble
              text={pageText}
              progress={entranceProgress}
              frame={frame}
              seed={page.startMs}
              scrambleColor={highlightColor}
            />
          </span>
        ) : animation === "rgb-tear" ? (
          <RGBTearText
            text={pageText}
            progress={entranceProgress}
            frame={frame}
            seed={page.startMs}
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              lineHeight: 1.4,
              color: "#FFFFFF",
            }}
          />
        ) : (
          <span
            style={{
              fontSize,
              fontWeight: 700,
              fontFamily,
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              color: "#FFFFFF",
              textShadow: `0 0 16px rgba(167,139,250,0.6), 0 0 32px rgba(167,139,250,0.35), 0 2px 6px rgba(0,0,0,0.6), 1px 0 0 #C4B5FD, -1px 0 0 #C4B5FD, 0 1px 0 #C4B5FD, 0 -1px 0 #C4B5FD`,
            }}
          >
            {page.words.map((w, i) => {
              const isActive = w.startMs <= currentMs && w.endMs > currentMs;
              const isPast = w.endMs <= currentMs;
              return (
                <span
                  key={`${w.startMs}-${i}`}
                  style={{
                    color: isActive ? "#FFFFFF" : isPast ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                    transition: "none",
                    textShadow: isActive
                      ? `0 0 20px rgba(167,139,250,0.7), 0 0 40px rgba(167,139,250,0.4), 0 2px 6px rgba(0,0,0,0.6), 1px 0 0 #C4B5FD, -1px 0 0 #C4B5FD, 0 1px 0 #C4B5FD, 0 -1px 0 #C4B5FD`
                      : `0 0 12px rgba(167,139,250,0.3), 0 2px 6px rgba(0,0,0,0.6), 1px 0 0 #C4B5FD, -1px 0 0 #C4B5FD, 0 1px 0 #C4B5FD, 0 -1px 0 #C4B5FD`,
                  }}
                >
                  {stripEdgePunct(w.word, i === 0, i === page.words.length - 1)}
                  {i < page.words.length - 1 ? wordSep : ""}
                </span>
              );
            })}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  words,
  wordsPerPage = 6,
  maxCharsLatin = 42,
  maxCharsCjk = 20,
  pauseThresholdMs = 500,
  maxDurationMs = 6000,
  minDurationMs = 1200,
  fontSize = 42,
  color = "#F8FAFC",
  highlightColor = "#22D3EE",
  backgroundColor = "transparent",
  fontFamily = "Space Grotesk, Inter, system-ui, sans-serif",
  animation = "spring",
}) => {
  const { fps } = useVideoConfig();
  // Pre-paged captions (from the 07 props generator) render as-is; the legacy
  // flat WordCaption[] shape falls back to client-side pagination.
  const pages: CaptionPage[] = isPagedCaptions(words)
    ? words.map((p) => ({ words: p.words, startMs: p.startMs, endMs: p.endMs }))
    : buildPages(words, {
        wordsPerPage,
        maxCharsLatin,
        maxCharsCjk,
        pauseThresholdMs,
        maxDurationMs,
        minDurationMs,
        maxLines: 2,
      });

  return (
    <AbsoluteFill style={{zIndex: 100}}>
      {pages.map((page, i) => {
        const fromFrame = Math.round((page.startMs / 1000) * fps);
        const nextStart = pages[i + 1]?.startMs ?? page.endMs + 500;
        const duration = Math.max(
          1,
          Math.round(((nextStart - page.startMs) / 1000) * fps)
        );

        return (
          <Sequence
            key={i}
            from={fromFrame}
            durationInFrames={duration}
            style={{
              translate: "54.7px -60.8px"
            }}>
            <PageRenderer
              page={page}
              fontSize={fontSize}
              color={color}
              highlightColor={highlightColor}
              backgroundColor={backgroundColor}
              fontFamily={fontFamily}
              animation={animation}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
