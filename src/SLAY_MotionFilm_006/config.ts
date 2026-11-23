/**
 * SLAY-MotionFilm-006 — Phase 06.
 * Editorial overlap (~16%) + uniform Lenis rhythm across full visual period.
 *
 * DURATION NOTE:
 * LCM(10,4)=20 card-steps at approved ~2.0s/gesture requires 40s.
 * 18s cannot close the period without the 005 end-acceleration.
 * Composition extended to 40s / 1200 frames — documented, not silent.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-006";

export const CARD_ASPECT_RATIO = 16 / 9;

/** ~16% vertical bounding-box overlap (was 1.12 = 12% gap in 005). */
export const CARD_VERTICAL_STEP_RATIO = 0.84;

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  /** 20 period gestures × 2.0s = 40s. Frames 0..1199; boundary at 1200. */
  durationInFrames: 1200,
  loopDurationSeconds: 40,
  backgroundColor: "#F6C5D9",
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  cardSizePercent: 52,
  verticalStep: CARD_VERTICAL_STEP_RATIO,
  viewTopMargin: 0.1,
  /**
   * Faster, more confident reveal than 002 (0.72→0.34).
   * Still starts inside the viewport (unlike 001's 0.90→0.68).
   */
  revealStartY: 0.76,
  revealEndY: 0.52,
  /** Subtle rise — between 001 (60) and 002 (75). */
  revealTranslatePx: 55,
  /**
   * Brief settle after each Lenis-like impulse (3–6 frames target).
   * Preserved from approved 004/005.
   */
  settleSec: 0.17,
  /** Uniform gesture interval matching 005 mid-section (~2.0s). */
  gestureIntervalSec: 2.0,
} as const;

export const WIDTH = FEED_CONFIG.width;
export const HEIGHT = FEED_CONFIG.height;
export const FPS = FEED_CONFIG.fps;
export const DURATION_IN_FRAMES = FEED_CONFIG.durationInFrames;
export const BACKGROUND = FEED_CONFIG.backgroundColor;

export const getCardMetrics = (canvasWidth: number = FEED_CONFIG.width) => {
  const cardWidth = canvasWidth * (FEED_CONFIG.cardSizePercent / 100);
  const cardHeight = cardWidth / CARD_ASPECT_RATIO;
  const horizontalPadding = canvasWidth * (FEED_CONFIG.paddingPercent / 100);
  const leftX = horizontalPadding;
  const centerX = (canvasWidth - cardWidth) / 2;
  const rightX = canvasWidth - horizontalPadding - cardWidth;
  const verticalStepPx = cardHeight * FEED_CONFIG.verticalStep;
  const overlapRatio = 1 - FEED_CONFIG.verticalStep;

  return {
    cardWidth,
    cardHeight,
    horizontalPadding,
    leftX,
    centerX,
    rightX,
    verticalStepPx,
    overlapRatio,
  };
};
