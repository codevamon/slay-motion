/**
 * SLAY-MotionFilm-001 — Phase 01.3 virtual editorial page config.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-001";

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 540,
  loopDurationSeconds: 18,
  backgroundColor: "#F6C5D9",
  /** Horizontal padding (~6% of width). */
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  /** Card width as % of canvas width (48–52 range). */
  cardSizePercent: 50,
  /**
   * Vertical progression: nextY = prevY + prevHeight * verticalStep.
   * Calibrated for readable separation with zigzag (not conveyor pile).
   */
  verticalStep: 0.7,
  /** Left card: left edge as fraction of canvas width. */
  leftEdge: 0.09,
  /** Right card: right edge as fraction of canvas width. */
  rightEdge: 0.91,
  /** Viewport top margin when framing a focused card. */
  viewTopMargin: 0.1,
} as const;

export const WIDTH = FEED_CONFIG.width;
export const HEIGHT = FEED_CONFIG.height;
export const FPS = FEED_CONFIG.fps;
export const DURATION_IN_FRAMES = FEED_CONFIG.durationInFrames;
export const BACKGROUND = FEED_CONFIG.backgroundColor;
