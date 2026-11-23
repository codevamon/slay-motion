/**
 * SLAY-MotionFilm-009 — Phase 09.
 * Identical to approved 008 + subtle card-level parallax during scroll impulses.
 * Holds, scroll timeline, assets, and loop are unchanged from 008.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-009";

/**
 * Scroll-driven parallax (009 only).
 * offset = clamp(scrollVelocity × depth × strength, ±maxOffset)
 * Zero velocity (holds) ⇒ zero offset — no separate envelope or settle.
 * depthFactors keyed by asset index (stable across loop repeats).
 */
export const PARALLAX_CONFIG = {
  enabled: true,
  /** Scales px/frame scroll velocity into a small positional offset. */
  strength: 0.28,
  /** Hard cap so peak motion stays subtle (~12px). */
  maxOffset: 12,
  /** Mild alternating depths — avoid extreme adjacent swings. */
  depthFactors: [
    -0.32, 0.22, -0.18, 0.28, -0.24, 0.2, -0.3, 0.25, -0.16, 0.27,
  ],
} as const;

/** ~16% vertical bounding-box overlap — preserved from 006/007. */
export const CARD_VERTICAL_STEP_RATIO = 0.84;

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  /** Preserved from 007: 20 period gestures × 2.0s = 40s. */
  durationInFrames: 1200,
  loopDurationSeconds: 40,
  backgroundColor: "#F6C5D9",
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  /** Approved card width — height comes from each image's intrinsic AR. */
  cardSizePercent: 52,
  verticalStep: CARD_VERTICAL_STEP_RATIO,
  viewTopMargin: 0.1,
  /**
   * Reveal thresholds — exact approved 007 refined values.
   * Neighbor at previous settle stays subdued; fade during own approach.
   */
  revealStartY: 0.64,
  revealEndY: 0.52,
  revealTranslatePx: 35,
  settleSec: 0.2,
  gestureIntervalSec: 2.0,
} as const;

export const WIDTH = FEED_CONFIG.width;
export const HEIGHT = FEED_CONFIG.height;
export const FPS = FEED_CONFIG.fps;
export const DURATION_IN_FRAMES = FEED_CONFIG.durationInFrames;
export const BACKGROUND = FEED_CONFIG.backgroundColor;

/** Shared horizontal metrics; height is per-image via getCardHeightForAsset. */
export const getCardMetrics = (canvasWidth: number = FEED_CONFIG.width) => {
  const cardWidth = canvasWidth * (FEED_CONFIG.cardSizePercent / 100);
  const horizontalPadding = canvasWidth * (FEED_CONFIG.paddingPercent / 100);
  const leftX = horizontalPadding;
  const centerX = (canvasWidth - cardWidth) / 2;
  const rightX = canvasWidth - horizontalPadding - cardWidth;

  return {
    cardWidth,
    horizontalPadding,
    leftX,
    centerX,
    rightX,
    overlapRatio: 1 - FEED_CONFIG.verticalStep,
  };
};

/** Height that matches the source image aspect at the approved card width. */
export const getCardHeightForAsset = (
  nativeWidth: number,
  nativeHeight: number,
  canvasWidth: number = FEED_CONFIG.width,
) => {
  const cardWidth = canvasWidth * (FEED_CONFIG.cardSizePercent / 100);
  const aspectRatio = nativeWidth / nativeHeight;
  return cardWidth / aspectRatio;
};

export const getVerticalStepForHeight = (cardHeight: number) =>
  cardHeight * FEED_CONFIG.verticalStep;
