// ---------------------------------------------------------------------------
// Avatar framing presets (2D post-crop model)
// ---------------------------------------------------------------------------
// The VRM host is rendered ONCE in a fixed "canonical" full-body framing. Every
// on-screen treatment (corner head, side bust, full body, presenter) is then a
// pure 2D crop + placement of that single render — no per-scene camera changes,
// no reloading the model. A preset therefore describes:
//   - `crop`:   which normalized rectangle of the canonical render to show
//   - `anchor` + `screenWidth` + `margin`: where/how big to place it on screen
//   - `opacity`: 1, or 0 for `hidden`
//
// Scenes reference presets by name. Resolution precedence (high → low) is:
//   cut.avatar  >  avatar.byType[cut.type]  >  AVATAR_BY_TYPE[cut.type]  >
//   avatar.default  >  DEFAULT_PRESET
// so the AI usually only picks a scene type and gets a sensible host treatment
// for free, while still being able to override per cut.

export type AvatarAnchor =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left";

export interface AvatarCrop {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Optional clipped "badge" frame drawn around a placed avatar. */
export interface AvatarFrame {
  shape: "circle" | "rounded";
  /** Corner radius in px for `rounded` (ignored for `circle`). */
  radius?: number;
  /** Ring border shorthand, e.g. "4px solid rgba(255,179,71,0.9)". */
  border?: string;
  /** Fill behind the (transparent) cutout so it reads as a solid badge. */
  background?: string;
  /** Drop shadow shorthand, e.g. "0 10px 30px rgba(0,0,0,0.4)". */
  shadow?: string;
  /** Scale the crop to COVER the frame (centered). Defaults to true. */
  cover?: boolean;
}

export interface AvatarPreset {
  /** Semantic label; also documents intent. */
  mode: "hidden" | "corner" | "bust" | "full" | "presenter";
  /** Normalized crop over the canonical full-body render (0..1). */
  crop: AvatarCrop;
  /** Where the placed avatar is anchored on the composition. */
  anchor: AvatarAnchor;
  /** Placed width as a fraction of composition width. */
  screenWidth: number;
  /** Gap in px from the anchored edges (used by corner placements). */
  margin: number;
  /** 1 normally; 0 for hidden. */
  opacity: number;
  /** Optional clipped badge frame (circle / rounded-rect). */
  frame?: AvatarFrame;
}

/** Per-cut override: a preset name, or a partial preset (with optional `preset`). */
export type AvatarOverride = { preset?: string } & Partial<
  Omit<AvatarPreset, "crop">
> & { crop?: Partial<AvatarCrop> };

// Crop rectangles are expressed over the canonical render (see CANON_* in
// VRMAvatar). They are calibrated against that framing; if the canonical camera
// changes, re-tune these.
const CROP_HEAD: AvatarCrop = { x: 0.16, y: 0.04, w: 0.68, h: 0.32 };
// Tighter head crop for badge frames so the face fills the circle / card.
const CROP_HEADSHOT: AvatarCrop = { x: 0.24, y: 0.035, w: 0.52, h: 0.46 };
const CROP_BUST: AvatarCrop = { x: 0.08, y: 0.03, w: 0.84, h: 0.62 };
const CROP_FULL: AvatarCrop = { x: 0.0, y: 0.0, w: 1.0, h: 1.0 };
const CROP_PRESENTER: AvatarCrop = { x: 0.05, y: 0.02, w: 0.9, h: 0.7 };

export const AVATAR_PRESETS: Record<string, AvatarPreset> = {
  hidden: {
    mode: "hidden",
    crop: CROP_FULL,
    anchor: "bottom-right",
    screenWidth: 0.3,
    margin: 0,
    opacity: 0,
  },
  "corner-bust": {
    mode: "corner",
    crop: CROP_HEAD,
    anchor: "bottom-right",
    screenWidth: 0.17,
    margin: 24,
    opacity: 1,
  },
  "corner-bust-left": {
    mode: "corner",
    crop: CROP_HEAD,
    anchor: "bottom-left",
    screenWidth: 0.17,
    margin: 24,
    opacity: 1,
  },
  "bust-right": {
    mode: "bust",
    crop: CROP_BUST,
    anchor: "bottom-right",
    screenWidth: 0.32,
    margin: 0,
    opacity: 1,
  },
  "bust-left": {
    mode: "bust",
    crop: CROP_BUST,
    anchor: "bottom-left",
    screenWidth: 0.32,
    margin: 0,
    opacity: 1,
  },
  "full-right": {
    mode: "full",
    crop: CROP_FULL,
    anchor: "bottom-right",
    screenWidth: 0.24,
    margin: 0,
    opacity: 1,
  },
  "full-left": {
    mode: "full",
    crop: CROP_FULL,
    anchor: "bottom-left",
    screenWidth: 0.24,
    margin: 0,
    opacity: 1,
  },
  presenter: {
    mode: "presenter",
    crop: CROP_PRESENTER,
    anchor: "bottom-center",
    screenWidth: 0.42,
    margin: 0,
    opacity: 1,
  },
  // Clipped badge frames anchored top-right (opt-in via cut.avatar).
  "corner-circle-tr": {
    mode: "corner",
    crop: CROP_HEADSHOT,
    anchor: "top-right",
    screenWidth: 0.135,
    margin: 28,
    opacity: 1,
    frame: {
      shape: "circle",
      border: "4px solid rgba(255,179,71,0.92)",
      background: "rgba(40,26,44,0.72)",
      shadow: "0 10px 30px rgba(0,0,0,0.4)",
    },
  },
  "corner-rounded-tr": {
    mode: "corner",
    crop: CROP_HEADSHOT,
    anchor: "top-right",
    screenWidth: 0.155,
    margin: 28,
    opacity: 1,
    frame: {
      shape: "rounded",
      radius: 28,
      border: "3px solid rgba(255,179,71,0.88)",
      background: "rgba(40,26,44,0.72)",
      shadow: "0 10px 30px rgba(0,0,0,0.4)",
    },
  },
};

export const DEFAULT_PRESET = "bust-right";

// Built-in "scene type → preset" defaults. Applies to every episode unless the
// props override it via `avatar.byType` or a per-cut `avatar`.
export const AVATAR_BY_TYPE: Record<string, string> = {
  // Host-led beats (full body to the side so centered titles stay readable)
  intro_scene: "full-right",
  outro_scene: "full-right",
  hero_title: "full-left",
  text_card: "full-left",
  stat_card: "full-left",
  // Talking-head explanation
  concept_scene: "bust-right",
  timeline_scene: "bust-right",
  callout: "bust-right",
  // Dense, full-screen information → shrink the host into a corner
  table_scene: "corner-bust",
  terminal_scene: "corner-bust",
  screenshot_scene: "corner-bust",
  comparison: "corner-bust",
  line_chart: "corner-bust",
  bar_chart: "corner-bust",
  pie_chart: "corner-bust",
  kpi_grid: "corner-bust",
  progress_bar: "corner-bust",
};

function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(o) as (keyof T)[]).forEach((k) => {
    if (o[k] !== undefined) out[k] = o[k];
  });
  return out;
}

export interface AvatarSceneConfig {
  enabled?: boolean;
  default?: string;
  byType?: Record<string, string>;
}

/** Resolve the effective preset for one cut, merging any inline overrides. */
export function resolveAvatarPreset(
  cutType: string | undefined,
  cutAvatar: string | AvatarOverride | undefined,
  config: AvatarSceneConfig | undefined
): AvatarPreset {
  let name: string | undefined;
  let override: AvatarOverride | undefined;

  if (typeof cutAvatar === "string") {
    name = cutAvatar;
  } else if (cutAvatar && typeof cutAvatar === "object") {
    name = cutAvatar.preset;
    override = cutAvatar;
  }

  if (!name && cutType) name = config?.byType?.[cutType] ?? AVATAR_BY_TYPE[cutType];
  if (!name) name = config?.default ?? DEFAULT_PRESET;

  const base = AVATAR_PRESETS[name] ?? AVATAR_PRESETS[DEFAULT_PRESET];

  if (!override) return base;
  const { crop: cropOverride, preset: _preset, ...rest } = override;
  return {
    ...base,
    ...stripUndefined(rest),
    crop: { ...base.crop, ...(cropOverride ? stripUndefined(cropOverride) : {}) },
  };
}

// ---------------------------------------------------------------------------
// Layout maths — turn a preset into absolute CSS placement + inner-canvas
// transform that shows `crop` of the canonical canvas inside the viewport.
// ---------------------------------------------------------------------------
export interface AvatarLayout {
  left: number;
  top: number;
  width: number;
  height: number;
  /** scale applied to the canonical canvas inside the viewport */
  scale: number;
  /** translate (px) applied to the canonical canvas inside the viewport */
  tx: number;
  ty: number;
  opacity: number;
  // Frame styling (passthrough, not interpolated): undefined = plain window.
  clipRadius?: string;
  border?: string;
  background?: string;
  shadow?: string;
}

export function computeAvatarLayout(
  preset: AvatarPreset,
  compW: number,
  compH: number,
  canonW: number,
  canonH: number
): AvatarLayout {
  const cropPxW = preset.crop.w * canonW;
  const cropPxH = preset.crop.h * canonH;

  const frame = preset.frame;
  const isCircle = frame?.shape === "circle";
  const cover = frame ? frame.cover !== false : false;

  const width = preset.screenWidth * compW;
  // A circle badge needs a square window; otherwise derive height from the crop.
  const height = isCircle ? width : width * (cropPxH / cropPxW);

  const m = preset.margin;
  let left: number;
  let top: number;
  switch (preset.anchor) {
    case "bottom-left":
      left = m;
      top = compH - height - m;
      break;
    case "bottom-center":
      left = (compW - width) / 2;
      top = compH - height;
      break;
    case "top-right":
      left = compW - width - m;
      top = m;
      break;
    case "top-left":
      left = m;
      top = m;
      break;
    case "bottom-right":
    default:
      left = compW - width - m;
      top = compH - height - m;
      break;
  }

  let scale: number;
  let tx: number;
  let ty: number;
  if (cover) {
    // Scale so the crop fills the window, then center it (object-fit: cover).
    scale = Math.max(width / cropPxW, height / cropPxH);
    tx = -preset.crop.x * canonW * scale + (width - cropPxW * scale) / 2;
    ty = -preset.crop.y * canonH * scale + (height - cropPxH * scale) / 2;
  } else {
    scale = width / cropPxW;
    tx = -preset.crop.x * canonW * scale;
    ty = -preset.crop.y * canonH * scale;
  }

  const clipRadius = frame
    ? frame.shape === "circle"
      ? "50%"
      : `${frame.radius ?? 20}px`
    : undefined;

  return {
    left,
    top,
    width,
    height,
    scale,
    tx,
    ty,
    opacity: preset.opacity,
    clipRadius,
    border: frame?.border,
    background: frame?.background,
    shadow: frame?.shadow,
  };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpLayout(a: AvatarLayout, b: AvatarLayout, t: number): AvatarLayout {
  return {
    left: lerp(a.left, b.left, t),
    top: lerp(a.top, b.top, t),
    width: lerp(a.width, b.width, t),
    height: lerp(a.height, b.height, t),
    scale: lerp(a.scale, b.scale, t),
    tx: lerp(a.tx, b.tx, t),
    ty: lerp(a.ty, b.ty, t),
    opacity: lerp(a.opacity, b.opacity, t),
    // Frame styling is discrete — snap to the incoming (target) preset.
    clipRadius: b.clipRadius,
    border: b.border,
    background: b.background,
    shadow: b.shadow,
  };
}
