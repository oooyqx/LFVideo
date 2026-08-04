// Perspective-warp helpers: map the full composition rectangle onto an
// arbitrary quadrilateral (the green screen inside the Unity room shot) using a
// CSS matrix3d. Standard projective-transform construction.

export type Pt = [number, number];

export interface ScreenQuad {
  /** Corners in composition pixels. Order: top-left, top-right, bottom-right, bottom-left. */
  tl: Pt;
  tr: Pt;
  br: Pt;
  bl: Pt;
}

export interface UnityBackgroundConfig {
  enabled?: boolean;
  /** public/-relative path to the Unity room background image or video, e.g. "UnityBG.mp4". */
  image?: string;
  /** Green-screen quad the page is warped into. */
  screenQuad?: ScreenQuad;
  /**
   * Backdrop opacity of the warped UI (0..1). < 1 makes the page background
   * translucent so the in-scene display shows through — a holographic look.
   */
  screenOpacity?: number;
  /** Backdrop tint (hex) for the warped UI — e.g. a blue for a hologram feel. */
  screenTint?: string;
  /**
   * Warp-reveal duration (frames). When > 0, the UI plane animates from a flat,
   * camera-facing full-frame rectangle into the screen quad over the opening
   * frames — so the perspective transform is visible. 0 / unset = static warp.
   */
  warpRevealFrames?: number;
  /**
   * Flat-hold duration (frames) before the warp-reveal starts. The UI plane
   * stays flat & full-frame (progress 0) for this many frames so viewers can
   * read the content head-on, then flies into the screen quad over
   * warpRevealFrames. Only applies when warpRevealFrames > 0. 0 / unset = no
   * hold (fly-in begins immediately).
   */
  warpHoldFrames?: number;
}

function adj(m: number[]): number[] {
  return [
    m[4] * m[8] - m[5] * m[7],
    m[2] * m[7] - m[1] * m[8],
    m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8],
    m[0] * m[8] - m[2] * m[6],
    m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6],
    m[1] * m[6] - m[0] * m[7],
    m[0] * m[4] - m[1] * m[3],
  ];
}

function multmm(a: number[], b: number[]): number[] {
  const r = new Array<number>(9).fill(0);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let s = 0;
      for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j];
      r[3 * i + j] = s;
    }
  }
  return r;
}

function multmv(m: number[], v: number[]): number[] {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

function basisToPoints(
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
): number[] {
  const m = [x1, x2, x3, y1, y2, y3, 1, 1, 1];
  const v = multmv(adj(m), [x4, y4, 1]);
  return multmm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}

/**
 * Linearly interpolate the screen quad between the full-frame rectangle
 * (progress = 0, UI flat & facing camera) and the target quad (progress = 1,
 * UI seated in the room screen). Used for the warp-reveal "fly-in".
 */
export function lerpScreenQuad(
  w: number,
  h: number,
  q: ScreenQuad,
  progress: number
): ScreenQuad {
  const rect: ScreenQuad = {
    tl: [0, 0],
    tr: [w, 0],
    br: [w, h],
    bl: [0, h],
  };
  const L = (a: Pt, b: Pt): Pt => [
    a[0] + (b[0] - a[0]) * progress,
    a[1] + (b[1] - a[1]) * progress,
  ];
  return {
    tl: L(rect.tl, q.tl),
    tr: L(rect.tr, q.tr),
    br: L(rect.br, q.br),
    bl: L(rect.bl, q.bl),
  };
}

/**
 * matrix3d for an in-progress warp reveal: at progress=0 the plane fills the
 * frame flat; at progress=1 it lands in the target quad. Wraps quadMatrix3d.
 */
export function animatedQuadMatrix3d(
  w: number,
  h: number,
  q: ScreenQuad,
  progress: number
): string {
  return quadMatrix3d(w, h, lerpScreenQuad(w, h, q, progress));
}

/**
 * matrix3d that maps the rectangle (0,0)-(w,h) onto the given quad.
 * Apply with `transform-origin: 0 0` on an element sized w×h.
 */
export function quadMatrix3d(w: number, h: number, q: ScreenQuad): string {
  const s = basisToPoints(0, 0, w, 0, w, h, 0, h);
  const d = basisToPoints(
    q.tl[0], q.tl[1],
    q.tr[0], q.tr[1],
    q.br[0], q.br[1],
    q.bl[0], q.bl[1],
  );
  const t = multmm(d, adj(s));
  for (let i = 0; i < 9; i++) t[i] = t[i] / t[8];
  const m = [
    t[0], t[3], 0, t[6],
    t[1], t[4], 0, t[7],
    0, 0, 1, 0,
    t[2], t[5], 0, t[8],
  ];
  return `matrix3d(${m.join(",")})`;
}
