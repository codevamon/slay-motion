/**
 * SLAY-MotionFilm-001 — centralized composition settings.
 *
 * VERIFIED from animos.app reference UI / canvas measurement:
 * - Background #f6c5d9
 * - Loop duration 18s
 * - Frame 16:9
 * - Feed Scroll settings (padding, card size, spacing, etc.)
 *
 * INFERRED / practical implementation choices:
 * - 1920×1080 render size (16:9, matching measured canvas ~1.78)
 * - 30 fps (animos exports 30 or 60; 30 is the practical Remotion default here)
 * - Canvas corner radius scaled from the visible rounded editor canvas
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-001";

/** Practical 16:9 matching verified canvas proportion (~1.7806). */
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Inferred: animos allows 30/60 export; 30fps chosen for Phase 01. */
export const FPS = 30;

/** Verified: Loop duration = 18s in editor. */
export const DURATION_SEC = 18;
export const DURATION_IN_FRAMES = FPS * DURATION_SEC;

/** Verified: #f6c5d9 from Feed Scroll colour control. */
export const BACKGROUND = "#f6c5d9";

/**
 * Inferred: rounded canvas in editor, cards themselves have corner rad 0%.
 * Scaled from ~40–48px on the measured 1631×916 canvas → ~48–56 on 1920.
 */
export const CANVAS_RADIUS = 52;

/** Verified Feed Scroll template parameters from reference sidebar. */
export const FEED = {
  padding: 0.06,
  cardCornerRadius: 0,
  cardSize: 0.52,
  spacing: 0.7,
  laneSpread: 1,
  flickLength: 0.55,
  fadeIn: 0.5,
  stagger: 0,
  /** Verified: Card ratio 16:9 */
  cardRatio: 16 / 9,
  /** Verified: Motion = Flicks */
  motion: "flicks" as const,
  /** Verified: Card enters by = Fade */
  enterBy: "fade" as const,
  /** Verified: Easing = Smooth (refined via cubic-bezier in motion/easing.ts) */
  easing: "smooth" as const,
  /** Verified: Shadow unchecked */
  shadow: false,
  /** Verified: Media · 12 slots */
  slotCount: 12,
} as const;
