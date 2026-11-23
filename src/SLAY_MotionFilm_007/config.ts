/**
 * SLAY-MotionFilm-007 — Phase 07.
 * Faster fade-up + explicit featured-card framing.
 * Layout, overlap, Lenis rhythm, and loop preserved from approved 006.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-007";

export const CARD_ASPECT_RATIO = 16 / 9;

/** ~16% vertical bounding-box overlap — preserved from 006. */
export const CARD_VERTICAL_STEP_RATIO = 0.84;

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  /** Preserved from 006: 20 period gestures × 2.0s = 40s. */
  durationInFrames: 1200,
  loopDurationSeconds: 40,
  backgroundColor: "#F6C5D9",
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  cardSizePercent: 52,
  verticalStep: CARD_VERTICAL_STEP_RATIO,
  viewTopMargin: 0.1,
  /**
   * Featured-card framing: top edge at 24% of viewport
   * (within the approved 20–30% band; full card stays inside).
   * Equals geometric center for current 16:9 card size.
   */
  featuredCardTopRatio: 0.24,
  /**
   * Phase 07 — faster, more confident reveal.
   * Was 0.76→0.52 (24% of viewport). Now 0.80→0.68 (12%).
   * Opacity hits 1 well before the featured settle.
   */
  revealStartY: 0.8,
  revealEndY: 0.68,
  /** Subtle rise — reduced from 55px. */
  revealTranslatePx: 35,
  /**
   * Brief settle after each Lenis impulse (~6 frames).
   * Within the 4–8 frame hold target; was 0.17s / 5f in 006.
   */
  settleSec: 0.2,
  /** Uniform gesture interval — preserved from 006. */
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
