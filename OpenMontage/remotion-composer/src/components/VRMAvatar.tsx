import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  VRM,
  VRMLoaderPlugin,
  VRMUtils,
  VRMExpressionPresetName,
  VRMHumanBoneName,
} from "@pixiv/three-vrm";
import { pinyin } from "pinyin-pro";
import type { WordCaption } from "./CaptionOverlay";
import {
  AvatarPreset,
  AVATAR_PRESETS,
  computeAvatarLayout,
  lerpLayout,
} from "./avatarPresets";

// ---------------------------------------------------------------------------
// Audio-driven mouth (deterministic, derived from the caption word timeline)
// ---------------------------------------------------------------------------
// We do not read the waveform; instead the existing Whisper word-level captions
// ({ word, startMs, endMs }) drive the mouth so it is 100% frame-deterministic
// and stays in sync with the same data that drives the on-screen subtitles.
// Each character is mapped to a viseme via its Mandarin pinyin final (韵母),
// so the mouth shape approximates the actual vowel being spoken.

const VISEMES: VRMExpressionPresetName[] = [
  VRMExpressionPresetName.Aa,
  VRMExpressionPresetName.Ih,
  VRMExpressionPresetName.Ou,
  VRMExpressionPresetName.Ee,
  VRMExpressionPresetName.Oh,
];
const AA = 0;
const IH = 1;
const OU = 2;
const EE = 3;
const OH = 4;

// Map a toneless Mandarin final (韵母) to a viseme by its dominant vowel shape.
function visemeFromFinal(final: string): number {
  const f = final.toLowerCase();
  if (f === "ou" || f === "iou" || f === "iu") return OU;
  if (f.includes("a")) return AA;
  if (f.includes("o")) return OH;
  if (f.includes("u")) return OU;
  if (f.includes("e")) return EE;
  if (f.includes("i") || f.includes("v") || f.includes("\u00fc")) return IH;
  return AA;
}

const LATIN_VOWEL_VISEME: Record<string, number> = {
  a: AA,
  e: EE,
  i: IH,
  o: OH,
  u: OU,
};

// Peak jaw opening per viseme — open vowels (a) gape, rounded/closed ones (i/u)
// barely part the lips, so different finals look visibly different.
const VISEME_OPEN: number[] = [0.95, 0.5, 0.6, 0.72, 0.85];

// Cache char→viseme so the pinyin lookup runs once per unique character.
const visemeCache = new Map<string, number>();

// Map a character to a viseme: Han characters go through pinyin→final→vowel,
// Latin vowels map directly, everything else keeps the mouth at the open rest.
function visemeIndexForChar(ch: string): number {
  const cached = visemeCache.get(ch);
  if (cached !== undefined) return cached;

  const code = ch.codePointAt(0) ?? 0;
  let viseme = AA;
  if (code >= 0x4e00 && code <= 0x9fff) {
    const finals = pinyin(ch, {
      pattern: "final",
      toneType: "none",
      type: "array",
    });
    viseme = visemeFromFinal(finals[0] ?? "");
  } else {
    const lower = ch.toLowerCase();
    if (lower in LATIN_VOWEL_VISEME) viseme = LATIN_VOWEL_VISEME[lower];
  }

  visemeCache.set(ch, viseme);
  return viseme;
}

interface MouthState {
  viseme: VRMExpressionPresetName;
  open: number; // 0..1
}

function mouthStateAt(
  ms: number,
  captions: WordCaption[] | undefined
): MouthState {
  const closed: MouthState = { viseme: VRMExpressionPresetName.Aa, open: 0 };
  if (!captions || captions.length === 0) return closed;

  // Find the word currently being spoken.
  const word = captions.find((w) => ms >= w.startMs && ms < w.endMs);
  if (!word) return closed;

  const chars = Array.from(word.word.replace(/\s+/g, ""));
  if (chars.length === 0) return closed;

  const span = Math.max(1, word.endMs - word.startMs);
  const charDur = span / chars.length;
  const local = ms - word.startMs;
  const charIndex = Math.min(chars.length - 1, Math.floor(local / charDur));
  const within = (local - charIndex * charDur) / charDur; // 0..1 inside char

  // Smooth open/close bump per character → looks like articulating syllables.
  const vi = visemeIndexForChar(chars[charIndex]);
  const open = Math.sin(Math.PI * within) * VISEME_OPEN[vi];
  return { viseme: VISEMES[vi], open: Math.max(0, open) };
}

// ---------------------------------------------------------------------------
// Auto-animations (blink / breathing), all pure functions of time
// ---------------------------------------------------------------------------
function blinkAt(timeSec: number): number {
  const period = 4.2; // seconds between blinks
  const dur = 0.13; // blink duration
  const t = timeSec % period;
  if (t > dur) return 0;
  return Math.sin((Math.PI * t) / dur); // 0 → 1 → 0
}

function breathAt(timeSec: number): number {
  const period = 4.8;
  return Math.sin((2 * Math.PI * timeSec) / period); // -1..1
}

// ---------------------------------------------------------------------------
// VRM model — loads the .vrm and drives it from the current Remotion frame
// ---------------------------------------------------------------------------
interface VRMModelProps {
  captions?: WordCaption[];
  /** vertical offset to frame the upper body in the panel */
  modelY?: number;
  /** horizontal offset; positive shifts the host toward the right edge */
  modelX?: number;
}

const VRMModel: React.FC<VRMModelProps> = ({
  captions,
  modelY = -0.95,
  modelX = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // R3F render is on-demand (frameloop="never") while Remotion renders, so we
  // must explicitly advance/render once the model has mounted and been posed —
  // otherwise the late (async-loaded) model is never drawn into the framebuffer.
  const advance = useThree((s) => s.advance);

  const [vrm, setVrm] = useState<VRM | null>(null);
  const [handle] = useState(() => delayRender("Loading host-avatar.vrm"));
  const continued = useRef(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    let disposed = false;
    loader.load(
      staticFile("avatars/host-avatar.vrm"),
      (gltf) => {
        if (disposed) return;
        const loaded = gltf.userData.vrm as VRM;
        // Make VRM0 models face +Z (toward the camera).
        VRMUtils.rotateVRM0(loaded);
        loaded.update(1 / 30);
        loaded.scene.traverse((obj) => {
          obj.frustumCulled = false;
        });
        loaded.scene.updateMatrixWorld(true);
        setVrm(loaded);
      },
      undefined,
      (err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to load VRM:", err);
        continueRender(handle);
        continued.current = true;
      }
    );
    return () => {
      disposed = true;
    };
  }, [handle]);


  // Drive the avatar purely from the current frame (no useFrame / wall clock).
  useLayoutEffect(() => {
    if (!vrm) return;
    const timeSec = frame / fps;
    const ms = timeSec * 1000;

    const breath = breathAt(timeSec);
    const mouth = mouthStateAt(ms, captions);

    // Smoothed talking envelope. The raw per-character mouth-open snaps up and
    // down on every syllable (and to 0 in the gaps between words), so driving
    // the head nod from it directly makes the head jerk. Average it over a
    // ~0.5s window to get a slow envelope that tracks speech cadence instead.
    let talk = 0;
    for (let k = -4; k <= 4; k++) {
      talk += mouthStateAt(ms + (k * 2000) / fps, captions).open;
    }
    talk /= 9;

    // Slow, mutually-incommensurate phases so the idle never visibly loops.
    const swayP = (2 * Math.PI * timeSec) / 6.5; // weight-shift phase
    const sway = Math.sin(swayP);
    const sway2 = Math.sin((2 * Math.PI * timeSec) / 11); // slower drift

    const em = vrm.expressionManager;
    if (em) {
      // Reset mouth visemes, then apply the active one.
      for (const v of VISEMES) em.setValue(v, 0);
      em.setValue(mouth.viseme, mouth.open);

      // Blink.
      em.setValue(VRMExpressionPresetName.Blink, blinkAt(timeSec));

      // Resting smile that breathes slightly so the face is never frozen.
      em.setValue(
        VRMExpressionPresetName.Happy,
        0.12 + Math.sin((2 * Math.PI * timeSec) / 13) * 0.05
      );
    }

    const h = vrm.humanoid;

    // Weight shift through the hips with a soft counter-rotation in the spine
    // (contrapposto) so the idle never looks rigid.
    const hips = h.getNormalizedBoneNode(VRMHumanBoneName.Hips);
    if (hips) {
      hips.rotation.y = sway * 0.05 + sway2 * 0.03;
      hips.rotation.z = sway * 0.02;
      hips.position.x = sway * 0.012;
    }
    const spine = h.getNormalizedBoneNode(VRMHumanBoneName.Spine);
    if (spine) {
      spine.rotation.y = -sway * 0.035;
      spine.rotation.z = -sway * 0.015;
    }

    const lUpper = h.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
    const rUpper = h.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm);
    const lLower = h.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerArm);
    const rLower = h.getNormalizedBoneNode(VRMHumanBoneName.RightLowerArm);
    const lHand = h.getNormalizedBoneNode(VRMHumanBoneName.LeftHand);
    const rHand = h.getNormalizedBoneNode(VRMHumanBoneName.RightHand);

    // Default idle: arms lowered from the T-pose into a natural rest, with a
    // slow, sway-driven swing so they never look frozen.
    if (lUpper) {
      lUpper.rotation.z = -1.2 - breath * 0.02;
      lUpper.rotation.y = -0.05 + sway * 0.03;
      lUpper.rotation.x = Math.sin(swayP + 0.5) * 0.02;
    }
    if (rUpper) {
      rUpper.rotation.z = 1.2 + breath * 0.02;
      rUpper.rotation.y = 0.05 + sway * 0.03;
      rUpper.rotation.x = Math.sin(swayP + 0.9) * 0.02;
    }
    if (lLower) lLower.rotation.z = -0.2 + Math.sin(swayP + 1.1) * 0.015;
    if (rLower) rLower.rotation.z = 0.2 + Math.sin(swayP + 1.4) * 0.015;
    if (lHand) lHand.rotation.z = Math.sin(swayP + 1.6) * 0.03;
    if (rHand) rHand.rotation.z = -Math.sin(swayP + 1.9) * 0.03;

    // Breathing on the chest.
    const chest =
      h.getNormalizedBoneNode(VRMHumanBoneName.Chest) ??
      h.getNormalizedBoneNode(VRMHumanBoneName.Spine);
    if (chest) {
      chest.rotation.x = breath * 0.025;
    }

    // Layered head motion + a gentle nod while speaking; the neck follows. The
    // nod uses the smoothed talk envelope and a slow sine so it eases up and
    // down with the cadence of speech rather than twitching per syllable.
    const neck = h.getNormalizedBoneNode(VRMHumanBoneName.Neck);
    if (neck) {
      neck.rotation.y = sway2 * 0.03;
      neck.rotation.x = talk * 0.022;
    }
    const head = h.getNormalizedBoneNode(VRMHumanBoneName.Head);
    if (head) {
      head.rotation.z =
        Math.sin((2 * Math.PI * timeSec) / 7) * 0.025 - sway * 0.02;
      head.rotation.y =
        Math.sin((2 * Math.PI * timeSec) / 9) * 0.04 + sway2 * 0.04;
      head.rotation.x =
        Math.sin((2 * Math.PI * timeSec) / 5.5) * 0.02 +
        Math.sin((2 * Math.PI * timeSec) / 3.2) * talk * 0.03;
    }

    // Apply expression morphs + skeleton update for this frame. Keep spring
    // bones at rest so hair does not introduce non-deterministic jitter.
    vrm.update(1 / fps);
    vrm.springBoneManager?.reset();
    vrm.scene.updateMatrixWorld(true);

    // Force an on-demand render now that the model is posed for this frame,
    // then release the frame for capture.
    advance(performance.now());
    if (!continued.current) {
      continueRender(handle);
      continued.current = true;
    }
  }, [vrm, frame, fps, captions, advance, handle]);

  return (
    <>
      {vrm && <primitive object={vrm.scene} position={[modelX, modelY, 0]} />}
    </>
  );
};

// ---------------------------------------------------------------------------
// Public component — scene-aware host, rendered once and placed via 2D crop
// ---------------------------------------------------------------------------
// Canonical render: the host is always drawn full-body, centered, at this fixed
// camera. Every preset is a 2D crop + placement of THIS render (see
// avatarPresets.ts). Calibrate the crop rectangles against this framing.
const CANON_CAMERA_Z = 3.55;
const CANON_MODEL_Y = -0.82;
/** Canonical canvas aspect (width / height). Tall portrait for a full body. */
const CANON_ASPECT = 0.58;

/** One resolved cut on the avatar timeline. */
export interface AvatarTimelineEntry {
  from: number;
  to: number;
  preset: AvatarPreset;
}

export interface VRMAvatarProps {
  captions?: WordCaption[];
  /** Per-cut resolved presets, ordered by `from` (ascending). */
  timeline?: AvatarTimelineEntry[];
  /** Crossfade/move duration at each cut boundary, in frames. */
  transitionFrames?: number;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export const VRMAvatar: React.FC<VRMAvatarProps> = ({
  captions,
  timeline,
  transitionFrames = 9,
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const canonH = height;
  const canonW = Math.round(height * CANON_ASPECT);

  // Resolve the active cut and interpolate its placement from the previous one
  // so the host eases between framings at scene boundaries.
  const entries = timeline ?? [];
  let idx = -1;
  for (let i = 0; i < entries.length; i++) {
    if (frame >= entries[i].from) idx = i;
    else break;
  }

  const hiddenPreset = AVATAR_PRESETS.hidden;
  const activePreset = idx >= 0 ? entries[idx].preset : hiddenPreset;
  const target = computeAvatarLayout(activePreset, width, height, canonW, canonH);

  let layout = target;
  if (idx >= 0) {
    const prevPreset = idx > 0 ? entries[idx - 1].preset : hiddenPreset;
    const source = computeAvatarLayout(prevPreset, width, height, canonW, canonH);
    const t = Math.min(
      1,
      Math.max(0, (frame - entries[idx].from) / transitionFrames)
    );
    layout = lerpLayout(source, target, easeInOut(t));
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <div
        style={{
          position: "absolute",
          left: layout.left,
          top: layout.top,
          width: layout.width,
          height: layout.height,
          overflow: "hidden",
          opacity: layout.opacity,
          boxSizing: "border-box",
          borderRadius: layout.clipRadius,
          border: layout.border,
          background: layout.background,
          boxShadow: layout.shadow,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: canonW,
            height: canonH,
            transformOrigin: "top left",
            transform: `translate(${layout.tx}px, ${layout.ty}px) scale(${layout.scale})`,
          }}
        >
          <ThreeCanvas
            width={canonW}
            height={canonH}
            style={{ background: "transparent" }}
            gl={{ alpha: true, preserveDrawingBuffer: true }}
            camera={{
              fov: 30,
              near: 0.1,
              far: 20,
              position: [0, 0, CANON_CAMERA_Z],
            }}
          >
            <ambientLight intensity={1.1} />
            <directionalLight position={[1, 2, 2]} intensity={1.4} />
            <directionalLight position={[-1.5, 1, 1.5]} intensity={0.6} />
            <VRMModel captions={captions} modelX={0} modelY={CANON_MODEL_Y} />
          </ThreeCanvas>
        </div>
      </div>
    </AbsoluteFill>
  );
};
