import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceGrotesk";

// Resolve asset path — handle URLs, absolute paths (Windows/Unix), and public/ relative paths
function resolveAsset(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  // Strip any file:// prefix
  const clean = src.replace(/^file:\/\/\/?/, "");
  // Absolute paths (Unix: /foo, Windows: C:\foo or C:/foo) — convert to file:// URI
  // staticFile() only accepts relative paths within public/, so absolute paths must bypass it
  if (clean.startsWith("/") || /^[A-Za-z]:[\\/]/.test(clean)) {
    return `file:///${clean.replace(/\\/g, "/")}`;
  }
  return staticFile(clean);
}
import { TextCard } from "./components/TextCard";
import { StatCard } from "./components/StatCard";
import { CalloutBox } from "./components/CalloutBox";
import { BarChart } from "./components/charts/BarChart";
import { LineChart } from "./components/charts/LineChart";
import { PieChart } from "./components/charts/PieChart";
import { KPIGrid } from "./components/charts/KPIGrid";
import { ProgressBar } from "./components/ProgressBar";
import {
  CaptionOverlay,
  CaptionsInput,
  WordCaption,
  isPagedCaptions,
} from "./components/CaptionOverlay";
import { VRMAvatar, AvatarTimelineEntry } from "./components/VRMAvatar";
import { quadMatrix3d, animatedQuadMatrix3d, UnityBackgroundConfig } from "./components/screenWarp";
import {
  AvatarOverride,
  AvatarSceneConfig,
  resolveAvatarPreset,
} from "./components/avatarPresets";
import { SectionTitle } from "./components/SectionTitle";
import { StatReveal } from "./components/StatReveal";
import { HeroTitle } from "./components/HeroTitle";
import { AnimeScene } from "./components/AnimeScene";
import type { CameraMotion } from "./components/AnimeScene";
import { ScreenshotScene } from "./components/ScreenshotScene";
import type { ScreenshotStep } from "./components/ScreenshotScene";
import { ProviderChip } from "./components/ProviderChip";
import type { ParticleType } from "./components/ParticleOverlay";
import { resolveTheme, type ThemeConfig, DEFAULT_THEME } from "./Root";
import {
  IntroScene,
  OutroScene,
  ConceptScene,
  TimelineScene,
  TableScene,
  ComparisonScene,
  CodeScene,
  SceneTitle,
  Background,
  TemplateThemeProvider,
  buildTemplateTheme,
  PALETTES,
  TEMPLATE_SCENES,
} from "./custom-templates";
import type { BackgroundVariant, CodeStep, TransitionId } from "./custom-templates";

// Load Space Grotesk font for cinematic typography
const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// ---------------------------------------------------------------------------
// Color helpers (used by the warped-screen tint path)
// ---------------------------------------------------------------------------

// Parse hex color to RGB components
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// hex -> rgba() string with the given alpha
function hexToRgba(hex: string, a: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}


// ---------------------------------------------------------------------------
// Types — aligned with edit_decisions artifact schema
// ---------------------------------------------------------------------------

interface Cut {
  id: string;
  source: string;
  in_seconds: number;
  out_seconds: number;
  layer?: string;
  type?: string;
  // Component-specific props
  eyebrow?: string;
  text?: string;
  stat?: string;
  subtitle?: string;
  callout_type?: "info" | "warning" | "tip" | "quote";
  title?: string;
  // Video source trim — seek to this point in the source before playback.
  // Defaults to 0 (play from beginning). Use this instead of in_seconds for source trimming.
  source_in_seconds?: number;
  // Comparison props
  leftLabel?: string;
  rightLabel?: string;
  leftValue?: string;
  rightValue?: string;
  // Chart props
  chartData?: any[];
  chartSeries?: any[];
  chartColors?: string[];
  chartAnimation?: string;
  donut?: boolean;
  centerLabel?: string;
  centerValue?: string;
  showGrid?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  showMarkers?: boolean;
  xLabel?: string;
  yLabel?: string;
  columns?: 2 | 3 | 4;
  // Progress bar props
  progress?: number;
  progressLabel?: string;
  progressColor?: string;
  progressAnimation?: string;
  progressSegments?: any[];
  // Hero title props (when used as scene, not overlay)
  heroSubtitle?: string;
  // Styling overrides
  backgroundColor?: string;
  backgroundImage?: string; // AI-generated or stock image rendered behind the component
  backgroundVideo?: string; // Video clip rendered behind the component (takes priority over backgroundImage)
  backgroundVideoStart?: number; // Seek position in seconds for background video (default 0)
  backgroundOverlay?: number; // Opacity of dark overlay on backgroundImage/backgroundVideo (0-1, default 0.55)
  color?: string;
  accentColor?: string;
  fontSize?: number;
  // Animation & transitions
  animation?: string;
  transition_in?: string;
  transition_out?: string;
  transform?: {
    animation?: string;
    scale?: number;
    position?: string | { x: number; y: number };
  };
  // Anime scene props (type: "anime_scene")
  images?: string[];
  particles?: ParticleType;
  particleColor?: string;
  particleCount?: number;
  particleIntensity?: number;
  vignette?: boolean;
  lightingFrom?: string;
  lightingTo?: string;
  // Code/terminal scene props (type: "code_scene" | "terminal_scene")
  steps?: CodeStep[];
  terminalTitle?: string;
  prompt?: string;
  // Screenshot scene props (type: "screenshot_scene")
  screenshotSteps?: ScreenshotStep[];
  screenshotSize?: { width: number; height: number };
  cursorStartAt?: [number, number];
  // Custom templates props
  headline?: string;
  cta?: string;
  background?: any;
  events?: any[];
  headers?: string[];
  rows?: any[];
  items?: any[];
  highlightCell?: string;
  /** Optional element-entrance transition for scenes that support it. */
  enter?: TransitionId;
  /** Per-cut digital-host treatment: a preset name or inline override. */
  avatar?: string | AvatarOverride;
}

interface Overlay {
  type: "section_title" | "stat_reveal" | "hero_title" | "provider_chip";
  in_seconds: number;
  out_seconds: number;
  text?: string;
  subtitle?: string;
  accentColor?: string;
  position?: string;
  // provider_chip
  providers?: string[];
  cycleSeconds?: number;
  label?: string;
}

interface AudioLayer {
  src: string;
  volume?: number;
}

interface AudioConfig {
  narration?: AudioLayer;
  music?: AudioLayer & {
    fadeInSeconds?: number;
    fadeOutSeconds?: number;
    /** Start playback from this offset in seconds (skip quiet intros).
     *  Use the audio_energy tool to find the optimal offset. */
    offsetSeconds?: number;
    /** Loop the music if it's shorter than the video duration. */
    loop?: boolean;
  };
}

interface AvatarConfig extends AvatarSceneConfig {
  /** Show the VRM digital host. */
  enabled?: boolean;
  /** Fallback preset when a cut has no `avatar` and its type has no mapping. */
  default?: string;
  /** Optional per-episode "scene type → preset" overrides of the built-ins. */
  byType?: Record<string, string>;
  /**
   * "overlay" (default): host is a cropped corner/bust placed over the UI.
   * "background": host fills the whole canvas as a bottom layer and the UI
   * floats on top with transparent scene backgrounds.
   */
  layer?: "overlay" | "background";
  /** Mixamo FBX clip (public/ relative path) driving the host's body. */
  clip?: string;
  /** Playback speed multiplier for the Mixamo clip (1 = original). */
  clipSpeed?: number;
  /** Background-mode framing overrides. */
  bgModelX?: number;
  bgModelY?: number;
  bgCameraZ?: number;
  /** Yaw in degrees about the vertical axis (positive = clockwise viewed from above). */
  bgModelYawDeg?: number;
  /** 2D placement of the background host overlay (CSS, pixel-exact). Scale is
      about the origin (% of frame); offsets are in composition pixels. */
  bgScale?: number;
  bgOffsetXpx?: number;
  bgOffsetYpx?: number;
  bgOriginXPct?: number;
  bgOriginYPct?: number;
}

export interface ExplainerProps {
  [key: string]: unknown;
  cuts: Cut[];
  overlays?: Overlay[];
  // Pre-paged pages (07 generator output) or legacy flat WordCaption[].
  captions?: CaptionsInput;
  // Caption entrance animation: 'spring' (default) | 'scramble' | 'rgb-tear'.
  captionAnimation?: 'spring' | 'scramble' | 'rgb-tear';
  audio?: AudioConfig;
  avatar?: AvatarConfig;
  /** Live Unity WebGL build rendered as the bottom-most background layer. */
  unityBackground?: UnityBackgroundConfig;
}

// ---------------------------------------------------------------------------
// Image Extensions
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif", ".webp"];
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

function isImage(source: string): boolean {
  const lower = source.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isVideo(source: string): boolean {
  const lower = source.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

// ---------------------------------------------------------------------------
// Cinematic vignette overlay
// ---------------------------------------------------------------------------

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Enhanced Image Scene — spring physics, parallax, variety
// ---------------------------------------------------------------------------

const ImageScene: React.FC<{ src: string; animation?: string }> = ({
  src,
  animation,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Smooth spring fade-in
  const fadeIn = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });

  // Fade-out for crossfade effect
  const fadeOutStart = durationInFrames - 8;
  const fadeOut = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  const anim = animation || "zoom-in";

  // Progress with easing — smoother than linear
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (anim === "zoom-in") {
    scale = 1 + progress * 0.18;
  } else if (anim === "zoom-out") {
    scale = 1.18 - progress * 0.18;
  } else if (anim === "pan-left") {
    translateX = interpolate(progress, [0, 1], [40, -40]);
    scale = 1.15;
  } else if (anim === "pan-right") {
    translateX = interpolate(progress, [0, 1], [-40, 40]);
    scale = 1.15;
  } else if (anim === "ken-burns" || anim === "ken-burns-slow-zoom") {
    // Cinematic Ken Burns: gentle zoom + diagonal drift
    scale = 1 + progress * 0.22;
    translateX = interpolate(progress, [0, 1], [0, -25]);
    translateY = interpolate(progress, [0, 1], [0, -15]);
  } else if (anim === "parallax") {
    // Subtle parallax — foreground moves faster
    translateY = interpolate(progress, [0, 1], [15, -15]);
    scale = 1.1;
  }
  // "static" or "none" → just display

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0F172A" }}>
      <Img
        src={resolveAsset(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fadeIn * fadeOut,
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          willChange: "transform, opacity",
        }}
      />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Enhanced Video Scene
// ---------------------------------------------------------------------------

const VideoScene: React.FC<{ src: string; startFrom?: number }> = ({
  src,
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = spring({ frame, fps, config: { damping: 20 } });
  const fadeOutStart = durationInFrames - 8;
  const fadeOut = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0F172A" }}>
      <OffthreadVideo
        src={resolveAsset(src)}
        startFrom={Math.round(startFrom * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fadeIn * fadeOut,
        }}
        muted
      />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene renderer — maps cut type / source to the right component
// ---------------------------------------------------------------------------

// Background image layer — renders an AI-generated/stock image behind data components
const BackgroundImageLayer: React.FC<{
  src: string;
  overlayOpacity?: number;
  children: React.ReactNode;
}> = ({ src, overlayOpacity = 0.55, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Subtle ken-burns on the background
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bgScale = 1 + progress * 0.08;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background image with subtle zoom */}
      <Img
        src={resolveAsset(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${bgScale})`,
          willChange: "transform",
        }}
      />
      {/* Dark overlay for readability */}
      <AbsoluteFill
        style={{
          background: `rgba(15, 23, 42, ${overlayOpacity})`,
        }}
      />
      {/* Component content on top */}
      {children}
    </AbsoluteFill>
  );
};

// Background video layer — plays a looping video behind component content with dark overlay
const BackgroundVideoLayer: React.FC<{
  src: string;
  startFrom?: number;
  overlayOpacity?: number;
  children: React.ReactNode;
}> = ({ src, startFrom = 0, overlayOpacity = 0.55, children }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background video */}
      <OffthreadVideo
        src={resolveAsset(src)}
        startFrom={Math.round(startFrom * fps)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        muted
      />
      {/* Dark overlay for readability */}
      <AbsoluteFill
        style={{
          background: `rgba(15, 23, 42, ${overlayOpacity})`,
        }}
      />
      {/* Component content on top */}
      {children}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene registry
//
// Ordered list mapping a cut `type` (+ an optional `guard` on required props)
// to the element it renders. Adding a new scene template = add ONE entry here,
// instead of appending another branch to a long if-chain. Entries are matched
// top-to-bottom; the first whose `type` matches and whose `guard` passes wins.
// `render` receives the per-cut SceneContext (resolved colors + theme).
// By default the result is wrapped with the cut's background image/video layer;
// set `wrapBackground: false` for scenes that manage their own background.
// ---------------------------------------------------------------------------

interface SceneContext {
  cut: Cut;
  theme: ThemeConfig;
  bgColor: string;
  textColor: string;
  accent: string;
  /** When true, scenes drop their full-bleed backdrop so a layer below shows through. */
  transparentBg: boolean;
}

interface SceneEntry {
  type: string;
  guard?: (cut: Cut) => boolean;
  render: (ctx: SceneContext) => React.ReactElement;
  wrapBackground?: boolean;
}

const SCENES: SceneEntry[] = [
  {
    type: "text_card",
    guard: (c) => !!c.text,
    render: ({ cut, textColor, bgColor }) => (
      <TextCard text={cut.text!} fontSize={cut.fontSize} color={textColor} backgroundColor={bgColor} />
    ),
  },
  {
    type: "stat_card",
    guard: (c) => !!c.stat,
    render: ({ cut, accent, bgColor }) => (
      <StatCard stat={cut.stat!} subtitle={cut.subtitle} accentColor={accent} backgroundColor={bgColor} />
    ),
  },
  {
    type: "callout",
    guard: (c) => !!c.text,
    render: ({ cut, theme, accent, textColor, bgColor }) => (
      <CalloutBox
        text={cut.text!} type={cut.callout_type} title={cut.title}
        borderColor={accent} backgroundColor={cut.backgroundColor || theme.surfaceColor}
        textColor={textColor} containerBackgroundColor={bgColor}
      />
    ),
  },
  ...["comparison", "comparison_scene"].map((t) => ({
    type: t,
    guard: (c: Cut) => !!c.leftLabel && !!c.rightLabel && !!c.leftValue && !!c.rightValue,
    render: ({ cut }: SceneContext) => (
      <ComparisonScene
        title={cut.title}
        leftLabel={cut.leftLabel!} leftValue={cut.leftValue!}
        rightLabel={cut.rightLabel!} rightValue={cut.rightValue!}
        enter={cut.enter}
      />
    ),
  })),
  {
    type: "hero_title",
    guard: (c) => !!c.text,
    render: ({ cut }) => (
      <HeroTitle title={cut.text!} subtitle={cut.heroSubtitle || cut.subtitle} />
    ),
  },
  ...["terminal_scene", "code_scene"].map((t) => ({
    type: t,
    guard: (c: Cut) => !!c.steps,
    render: ({ cut }: SceneContext) => (
      <CodeScene
        terminalTitle={cut.terminalTitle}
        steps={cut.steps!}
        prompt={cut.prompt}
      />
    ),
  })),
  {
    type: "screenshot_scene",
    guard: (c) => !!c.backgroundImage && !!c.screenshotSteps,
    wrapBackground: false,
    render: ({ cut, accent }) => (
      <ScreenshotScene
        backgroundImage={cut.backgroundImage!}
        backgroundSize={cut.screenshotSize}
        steps={cut.screenshotSteps as ScreenshotStep[]}
        accentColor={accent}
        cursorStartAt={cut.cursorStartAt}
      />
    ),
  },
  {
    type: "bar_chart",
    guard: (c) => !!c.chartData,
    render: ({ cut, theme, bgColor }) => (
      <BarChart
        data={cut.chartData!} title={cut.title} colors={cut.chartColors || theme.chartColors}
        animationStyle={(cut.chartAnimation as any) || "grow-up"}
        showGrid={cut.showGrid} showValues={cut.showValues} backgroundColor={bgColor}
      />
    ),
  },
  {
    type: "line_chart",
    guard: (c) => !!c.chartSeries,
    render: ({ cut, theme, bgColor }) => (
      <LineChart
        series={cut.chartSeries!} title={cut.title} colors={cut.chartColors || theme.chartColors}
        animationStyle={(cut.chartAnimation as any) || "draw"}
        showGrid={cut.showGrid} showMarkers={cut.showMarkers} showLegend={cut.showLegend}
        xLabel={cut.xLabel} yLabel={cut.yLabel} backgroundColor={bgColor}
      />
    ),
  },
  {
    type: "pie_chart",
    guard: (c) => !!c.chartData,
    render: ({ cut, theme, bgColor }) => (
      <PieChart
        data={cut.chartData!} title={cut.title} colors={cut.chartColors || theme.chartColors}
        animationStyle={(cut.chartAnimation as any) || "expand"}
        donut={cut.donut} centerLabel={cut.centerLabel} centerValue={cut.centerValue}
        showLegend={cut.showLegend} backgroundColor={bgColor}
      />
    ),
  },
  {
    type: "kpi_grid",
    guard: (c) => !!c.chartData,
    render: ({ cut, theme, bgColor }) => (
      <KPIGrid
        metrics={cut.chartData!} title={cut.title} columns={cut.columns}
        colors={cut.chartColors || theme.chartColors} animationStyle={(cut.chartAnimation as any) || "count-up"}
        backgroundColor={bgColor}
      />
    ),
  },
  {
    type: "progress_bar",
    guard: (c) => c.progress !== undefined,
    render: ({ cut, theme, accent, textColor, bgColor }) => (
      <AbsoluteFill
        style={{
          background: bgColor || theme.surfaceColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "80px 120px",
        }}
      >
        {cut.title && (
          <div style={{
            position: "absolute", top: 120, fontSize: 48, fontWeight: 700,
            color: textColor, textAlign: "center", width: "100%",
          }}>
            {cut.title}
          </div>
        )}
        <ProgressBar
          progress={cut.progress!} label={cut.progressLabel}
          color={cut.progressColor || accent}
          animationStyle={(cut.progressAnimation as any) || "fill"}
          segments={cut.progressSegments} backgroundColor={cut.backgroundColor || theme.surfaceColor}
        />
      </AbsoluteFill>
    ),
  },
  {
    type: "intro_scene",
    guard: (c) => !!c.title,
    render: (ctx) => (
      <IntroScene title={ctx.cut.title!} subtitle={ctx.cut.subtitle} />
    ),
  },
  {
    type: "outro_scene",
    guard: (c) => !!c.headline,
    render: (ctx) => (
      <OutroScene headline={ctx.cut.headline!} cta={ctx.cut.cta} />
    ),
  },
  {
    type: "concept_scene",
    guard: (c) => !!c.title && !!c.items,
    render: (ctx) => (
      <ConceptScene eyebrow={ctx.cut.eyebrow} title={ctx.cut.title!} items={ctx.cut.items!} enter={ctx.cut.enter} />
    ),
  },
  {
    type: "timeline_scene",
    guard: (c) => !!c.title && !!c.events,
    render: (ctx) => (
      <TimelineScene eyebrow={ctx.cut.eyebrow} title={ctx.cut.title!} events={ctx.cut.events!} enter={ctx.cut.enter} />
    ),
  },
  {
    type: "table_scene",
    guard: (c) => !!c.title && !!c.headers && !!c.rows,
    render: (ctx) => (
      <TableScene eyebrow={ctx.cut.eyebrow} title={ctx.cut.title!} headers={ctx.cut.headers!} rows={ctx.cut.rows!} highlightCell={ctx.cut.highlightCell} enter={ctx.cut.enter} />
    ),
  },
  {
    type: "anime_scene",
    guard: (c) => !!c.images && c.images.length > 0,
    wrapBackground: false,
    render: ({ cut }) => (
      <AnimeScene
        images={cut.images!}
        animation={(cut.animation as CameraMotion) || "ken-burns"}
        particles={cut.particles}
        particleColor={cut.particleColor}
        particleCount={cut.particleCount}
        particleIntensity={cut.particleIntensity}
        backgroundColor={cut.backgroundColor}
        vignette={cut.vignette ?? true}
        lightingFrom={cut.lightingFrom}
        lightingTo={cut.lightingTo}
        sceneDurationSeconds={cut.out_seconds - cut.in_seconds}
      />
    ),
  },
];

const SceneRenderer: React.FC<{
  cut: Cut;
  theme: ThemeConfig;
  transparentBg?: boolean;
}> = ({ cut, theme, transparentBg = false }) => {
  // Wrap component with background video or image if specified
  const maybeWrapWithBg = (element: React.ReactElement) => {
    if (cut.backgroundVideo) {
      return (
        <BackgroundVideoLayer
          src={cut.backgroundVideo}
          startFrom={cut.backgroundVideoStart ?? 0}
          overlayOpacity={cut.backgroundOverlay ?? 0.55}
        >
          {element}
        </BackgroundVideoLayer>
      );
    }
    if (cut.backgroundImage) {
      return (
        <BackgroundImageLayer
          src={cut.backgroundImage}
          overlayOpacity={cut.backgroundOverlay ?? 0.55}
        >
          {element}
        </BackgroundImageLayer>
      );
    }
    return element;
  };

  // Resolve the scene element based on cut type, then wrap with backgroundImage if set
  // Use transparent bg so the animated gradient background shows through
  // When no explicit backgroundColor on the cut, inherit from theme
  const rawBg = (cut.backgroundImage || cut.backgroundVideo) ? "transparent" : (cut.backgroundColor || theme.surfaceColor);
  const bgColor = transparentBg
    ? "transparent"
    : (rawBg === theme.backgroundColor || rawBg === "#0F172A" || rawBg === "#0f172a") ? "transparent" : rawBg;
  const textColor = cut.color || theme.textColor;
  const accent = cut.accentColor || theme.accentColor;

  // Dispatch through the ordered scene registry (see SCENES above). The first
  // entry whose `type` matches and whose `guard` passes renders the scene.
  const sceneCtx: SceneContext = { cut, theme, bgColor, textColor, accent, transparentBg };
  const sceneEntry = SCENES.find(
    (s) => s.type === cut.type && (!s.guard || s.guard(cut))
  );
  if (sceneEntry) {
    const element = sceneEntry.render(sceneCtx);
    return sceneEntry.wrapBackground === false ? element : maybeWrapWithBg(element);
  }

  // Generic template-scene dispatch: any registered template type without an
  // explicit SCENES entry above is rendered straight from the SSOT registry by
  // validating the cut against its co-located zod schema. Adding a new template
  // scene therefore needs no per-type wiring here — only registry.ts + the JSON.
  if (cut.type && TEMPLATE_SCENES[cut.type]) {
    const def = TEMPLATE_SCENES[cut.type];
    const parsed = def.schema.safeParse(cut);
    if (parsed.success) {
      const TemplateComponent = def.component;
      return maybeWrapWithBg(<TemplateComponent {...parsed.data} />);
    }
  }

  // --- Media types (image / video fallback) ---
  const animation = cut.animation || cut.transform?.animation;

  if (cut.source && isImage(cut.source)) {
    return maybeWrapWithBg(<ImageScene src={cut.source} animation={animation} />);
  }

  if (cut.source && isVideo(cut.source)) {
    return maybeWrapWithBg(<VideoScene src={cut.source} startFrom={cut.source_in_seconds ?? 0} />);
  }

  // Final fallback — try as image if source exists, otherwise show text_card
  if (cut.source) {
    return maybeWrapWithBg(<ImageScene src={cut.source} animation={animation} />);
  }

  // No source, no type — render as text card with cut id as fallback
  return <TextCard text={cut.text || cut.id} color={textColor} backgroundColor={bgColor} />;
};

// ---------------------------------------------------------------------------
// Overlay renderer
// ---------------------------------------------------------------------------

const OverlayRenderer: React.FC<{ overlay: Overlay }> = ({ overlay }) => {
  if (overlay.type === "section_title") {
    return (
      <SectionTitle
        title={overlay.text}
        subtitle={overlay.subtitle}
        accentColor={overlay.accentColor}
        position={(overlay.position as any) || "top-left"}
      />
    );
  }
  if (overlay.type === "stat_reveal") {
    return (
      <StatReveal
        stat={overlay.text}
        label={overlay.subtitle}
        accentColor={overlay.accentColor}
        position={(overlay.position as any) || "bottom-right"}
      />
    );
  }
  if (overlay.type === "hero_title") {
    return <HeroTitle title={overlay.text} subtitle={overlay.subtitle} />;
  }
  if (overlay.type === "provider_chip" && overlay.providers) {
    return (
      <ProviderChip
        providers={overlay.providers as string[]}
        cycleSeconds={overlay.cycleSeconds}
        position={(overlay.position as any) || "bottom-right"}
        accentColor={overlay.accentColor}
        label={overlay.label}
      />
    );
  }
  return null;
};

// ---------------------------------------------------------------------------
// Main composition
// ---------------------------------------------------------------------------

export const Explainer: React.FC<ExplainerProps> = (props) => {
  const { cuts, overlays, captions, captionAnimation, audio, avatar, unityBackground } = props;
  // Lip-sync consumes flat word timings; flatten pre-paged captions.
  const captionWords: WordCaption[] | undefined =
    captions && isPagedCaptions(captions)
      ? captions.flatMap((p) => p.words)
      : captions;
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Resolve theme from props — playbook name, theme name, or custom themeConfig
  const theme = resolveTheme(props as Record<string, unknown>);

  // Unified template theme: the template library (custom-templates) reads its
  // colors/fonts via useTheme(); we drive it from the same theme name so the
  // independent background and all scenes share one palette. The palette set
  // mirrors Root.THEMES by name; unknown names fall back to the Root default.
  const requestedThemeName =
    (props.theme as string) || (props.playbook as string) || "";
  const templateTheme = buildTemplateTheme(
    requestedThemeName in PALETTES ? requestedThemeName : "flat-motion-graphics"
  );

  // Full-frame digital host as the bottom layer, with the UI floating on top.
  const bgAvatar = !!avatar?.enabled && avatar?.layer === "background";

  // When a Unity room shot + screen quad are supplied, the UI page is
  // perspective-warped into the screen; the host and captions stay as flat
  // overlays (the host is parked bottom-right, seated in the room).
  const screen = unityBackground;
  const warp = !!(screen?.enabled && screen.image && screen.screenQuad);
  // Backdrop translucency + tint for the warped UI (holographic look).
  const screenOpacity = screen?.screenOpacity ?? 0.15;
  const screenTint = screen?.screenTint ?? "#0b2a52";

  // Warp-reveal: when warpRevealFrames > 0, the whole UI plane flies from a
  // flat full-frame rectangle into the screen quad over the opening frames, so
  // the perspective transform is visible. warpHoldFrames keeps the plane flat
  // & full-frame first (so viewers read the content head-on) before the fly-in.
  // Otherwise the warp is static.
  // (Per-cut warp timing is computed below after currentCut is resolved.)
  const explicitWarpRevealFrames = screen?.warpRevealFrames ?? 0;
  const explicitWarpHoldFrames = screen?.warpHoldFrames ?? 0;
  // The screen backdrop (room/tint/gradient) and color-grade are ALWAYS pinned
  // to the final quad (static) so the lit-screen look stays constant; only the
  // scene content uses the animated transform and flies in from flat full-frame.
  const staticWarpTransform = warp
    ? quadMatrix3d(width, height, screen!.screenQuad!)
    : "";
  // contentWarpTransform is computed below after warpProgress is resolved.

  // Chapter titles are split out of the scene content and rendered as a flat
  // top-right overlay (NOT warped into the screen), so they stay readable and
  // fixed while the scene below is perspective-mapped / transformed.
  const TITLE_OVERLAY_TYPES = new Set([
    "concept_scene",
    "timeline_scene",
    "table_scene",
    "comparison",
    "comparison_scene",
  ]);
  const titleOverlay = (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 60 }}>
      {cuts.map((cut) => {
        if (!cut.title || !cut.type || !TITLE_OVERLAY_TYPES.has(cut.type)) {
          return null;
        }
        const from = Math.round(cut.in_seconds * fps);
        const duration = Math.round((cut.out_seconds - cut.in_seconds) * fps);
        return (
          <Sequence key={`title-${cut.id}`} from={from} durationInFrames={duration}>
            <SceneTitle title={cut.title} eyebrow={cut.eyebrow} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );

  // The background variant is derived from the current cut, or falls back to props.background
  const currentCut = cuts.find(c => (c.out_seconds || 0) * fps >= frame) || cuts[0];
  const bgVariant = (currentCut?.background || props.background as BackgroundVariant) || "gradient";
  const bgGradient = <Background variant={bgVariant as BackgroundVariant} />;

  // Per-cut warp: use the current cut's relative frame so each scene gets its
  // own fly-in animation (matching the preview's FinalComposition behavior).
  // When warpHoldFrames / warpRevealFrames are not explicitly set, auto-compute
  // them from the current cut's duration (hold=50%, reveal=15%).
  const currentCutStartFrame = Math.round((currentCut?.in_seconds ?? 0) * fps);
  const currentCutDuration = Math.round(
    ((currentCut?.out_seconds ?? 0) - (currentCut?.in_seconds ?? 0)) * fps
  );
  const cutRelativeFrame = frame - currentCutStartFrame;
  const warpRevealFrames =
    explicitWarpRevealFrames || Math.round(currentCutDuration * 0.15);
  const warpHoldFrames =
    explicitWarpHoldFrames || Math.round(currentCutDuration * 0.5);
  const warpProgress =
    warp && warpRevealFrames > 0
      ? 1 -
        Math.pow(
          1 -
            Math.max(
              0,
              Math.min(1, (cutRelativeFrame - warpHoldFrames) / warpRevealFrames)
            ),
          3
        )
      : 1;
  const contentWarpTransform = warp
    ? warpProgress >= 1
      ? staticWarpTransform
      : animatedQuadMatrix3d(width, height, screen!.screenQuad!, warpProgress)
    : "";

  // Scene content — the "elements" that fly in during the warp-reveal: visual
  // scenes, overlays and the overlay-mode host. In the warped path these hold
  // flat & full-frame first (readable) then animate into the screen quad.
  const sceneLayers = (
    <>
      {/* Layer 1: Visual scenes */}
      {cuts.map((cut) => {
        const from = Math.round(cut.in_seconds * fps);
        const duration = Math.round((cut.out_seconds - cut.in_seconds) * fps);

        return (
          <Sequence key={cut.id} from={from} durationInFrames={duration}>
            <SceneRenderer cut={cut} theme={theme} transparentBg={bgAvatar} />
          </Sequence>
        );
      })}

      {/* Layer 2: Overlays (section titles, stat reveals, hero titles) */}
      {overlays?.map((overlay, i) => {
        const from = Math.round(overlay.in_seconds * fps);
        const duration = Math.round(
          (overlay.out_seconds - overlay.in_seconds) * fps
        );

        return (
          <Sequence key={`overlay-${i}`} from={from} durationInFrames={duration}>
            <OverlayRenderer overlay={overlay} />
          </Sequence>
        );
      })}

      {/* Layer 2.5: Digital host (overlay mode) — scene-aware framing via per-cut presets */}
      {avatar?.enabled && !bgAvatar && (
        <VRMAvatar
          captions={captionWords}
          timeline={cuts.map<AvatarTimelineEntry>((cut) => ({
            from: Math.round(cut.in_seconds * fps),
            to: Math.round(cut.out_seconds * fps),
            preset: resolveAvatarPreset(cut.type, cut.avatar, avatar),
          }))}
        />
      )}
    </>
  );

  // Global warm color-grade + vignette — fuses the 3D host and the flat UI into
  // one graded image. In the warped path this stays pinned to the final quad
  // (static) so the screen's grade is constant while the scene flies in. Sits
  // above scenes + host, below captions so subtitles stay crisp.
  const gradeLayers = (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 55,
          background:
            "linear-gradient(180deg, rgba(255,180,120,0.06) 0%, rgba(150,90,170,0.07) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 56,
          background:
            "radial-gradient(ellipse 78% 72% at 50% 42%, transparent 55%, rgba(15,8,18,0.5) 100%)",
        }}
      />
    </>
  );

  // UI content shown ON the screen — scenes + overlays + grade. No host, no
  // captions, no page backdrop (that is `bgGradient`).
  const screenContent = (
    <>
      {sceneLayers}
      {gradeLayers}
    </>
  );

  // Full-frame digital host (background mode) — flat overlay, NOT warped. The
  // 3D framing parks her bottom-right; a 2D CSS scale/offset gives pixel-exact
  // final placement (scale about her on-screen center).
  const hostScale = avatar?.bgScale ?? 1;
  const hostOffsetX = avatar?.bgOffsetXpx ?? 0;
  const hostOffsetY = avatar?.bgOffsetYpx ?? 0;
  const hostOriginX = avatar?.bgOriginXPct ?? 70;
  const hostOriginY = avatar?.bgOriginYPct ?? 57;
  const hostEl = bgAvatar ? (
    <AbsoluteFill
      style={{
        transformOrigin: `${hostOriginX}% ${hostOriginY}%`,
        transform: `translate(${hostOffsetX}px, ${hostOffsetY}px) scale(${hostScale})`,
      }}
    >
      <VRMAvatar
        background
        clipUrl={avatar?.clip}
        clipSpeed={avatar?.clipSpeed}
        bgModelX={avatar?.bgModelX}
        bgModelY={avatar?.bgModelY}
        bgCameraZ={avatar?.bgCameraZ}
        bgModelYawDeg={avatar?.bgModelYawDeg}
        captions={captionWords}
      />
    </AbsoluteFill>
  ) : null;

  // Captions (word-by-word highlight) — flat overlay, never warped.
  const captionsEl =
    captions && captions.length > 0 ? (
      <CaptionOverlay
        words={captions}
        wordsPerPage={6}
        fontSize={42}
        highlightColor={theme.captionHighlightColor}
        backgroundColor={theme.captionBackgroundColor}
        animation={captionAnimation}
      />
    ) : null;

  const audioEls = (
    <>
      {/* Layer 4: Audio — narration */}
      {audio?.narration?.src && (
        <Audio src={resolveAsset(audio.narration.src)} volume={audio.narration.volume ?? 1} />
      )}

      {/* Layer 4: Audio — music with offset, fade in/out, and optional loop */}
      {audio?.music?.src && (
        <Audio
          src={resolveAsset(audio.music.src)}
          startFrom={Math.round((audio.music.offsetSeconds ?? 0) * fps)}
          loop={audio.music.loop ?? false}
          loopVolumeCurveBehavior="repeat"
          volume={(f) => {
            const baseVol = audio.music!.volume ?? 0.1;
            const fadeInDur = (audio.music!.fadeInSeconds ?? 2) * fps;
            const fadeOutDur = (audio.music!.fadeOutSeconds ?? 3) * fps;
            const totalFrames = durationInFrames;

            // Fade in
            const fadeIn = interpolate(f, [0, fadeInDur], [0, baseVol], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            // Fade out
            const fadeOut = interpolate(
              f,
              [totalFrames - fadeOutDur, totalFrames],
              [baseVol, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return Math.min(fadeIn, fadeOut);
          }}
        />
      )}
    </>
  );

  // Warped path: room shot behind, UI perspective-mapped into the screen quad;
  // host + captions are flat overlays on top.
  if (warp) {
    const warpLayerStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width,
      height,
      transformOrigin: "0 0",
      backfaceVisibility: "hidden",
    } as const;
    return (
      <TemplateThemeProvider theme={templateTheme}>
        <AbsoluteFill style={{ background: "#000", fontFamily: theme.headingFont || fontFamily }}>
          <Img
            src={resolveAsset(screen!.image!)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            from={-2417} />
          {/* Screen backdrop (tint + page gradient + holographic wash) — pinned
              to the final quad (static) so the lit-screen look stays constant. */}
          <div style={{ ...warpLayerStyle, transform: staticWarpTransform }}>
            <AbsoluteFill
              style={{ background: hexToRgba(screenTint, screenOpacity), overflow: "hidden" }}
            >
              <AbsoluteFill style={{ opacity: screenOpacity }}>{bgGradient}</AbsoluteFill>
              {/* Holographic blue wash over the backdrop (below the UI content). */}
              <AbsoluteFill
                style={{
                  pointerEvents: "none",
                  background:
                    "radial-gradient(ellipse 95% 85% at 50% 42%, rgba(70,170,240,0.40) 0%, rgba(20,90,180,0.34) 55%, rgba(8,30,72,0.40) 100%)",
                  mixBlendMode: "screen",
                }}
              />
            </AbsoluteFill>
          </div>
          {/* Scene content — the elements that hold flat & full-frame first
              (readable) then fly into the screen quad over the warp-reveal. */}
          <div style={{ ...warpLayerStyle, transform: contentWarpTransform, overflow: "hidden" }}>
            {sceneLayers}
          </div>
          {/* Color-grade + vignette — also pinned to the final quad (static) so
              the screen's grade is constant as the scene content flies in. */}
          <div style={{ ...warpLayerStyle, transform: staticWarpTransform }}>
            {gradeLayers}
          </div>
          {hostEl}
          {titleOverlay}
          {captionsEl}
          {audioEls}
        </AbsoluteFill>
      </TemplateThemeProvider>
    );
  }

  return (
    <TemplateThemeProvider theme={templateTheme}>
    <AbsoluteFill style={{ background: theme.backgroundColor, fontFamily: theme.headingFont || fontFamily }}>
      {bgGradient}
      {hostEl}
      {screenContent}
      {titleOverlay}
      {captionsEl}
      {audioEls}
    </AbsoluteFill>
    </TemplateThemeProvider>
  );
};
