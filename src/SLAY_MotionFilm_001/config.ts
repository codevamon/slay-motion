/**
 * SLAY-MotionFilm-001 — centralized Feed Scroll configuration.
 * Values from Animos Feed Scroll reference / Phase 01.1–01.2 spec.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-001";

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 540,
  loopDurationSeconds: 18,
  backgroundColor: "#F6C5D9",
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  cardSizePercent: 52,
  spacingPercent: 70,
} as const;

/** Card center X as a fraction of canvas width (calibration starting points). */
export const HORIZONTAL_ANCHORS = {
  left: 0.34,
  center: 0.5,
  right: 0.66,
} as const;

export type AnchorName = keyof typeof HORIZONTAL_ANCHORS;

export const WIDTH = FEED_CONFIG.width;
export const HEIGHT = FEED_CONFIG.height;
export const FPS = FEED_CONFIG.fps;
export const DURATION_IN_FRAMES = FEED_CONFIG.durationInFrames;
export const BACKGROUND = FEED_CONFIG.backgroundColor;
