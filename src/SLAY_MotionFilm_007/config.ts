/**
 * SLAY-MotionFilm-007 — refined.
 * Exact centered featured stops + contain image framing + delayed neighbor reveal.
 * Layout, overlap, Lenis rhythm, and loop preserved from approved 006.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-007";

export const CARD_ASPECT_RATIO = 16 / 9;

/** ~16% vertical bounding-box overlap — preserved from 006. */
export const CARD_VERTICAL_STEP_RATIO = 0.84;

/**
 * Cream fill behind object-fit:contain.
 * Source images are ~1.60 AR inside a 16:9 frame → side letterboxing.
 * Matches SLAY card cream (not black).
 */
export const CARD_IMAGE_FILL = "#FBF6F0";

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
   * Reveal during the featured card's own approach — not while it is still
   * the "next" neighbor of a previous settle.
   *
   * At previous settle, next card top ≈ 0.677·H → still below revealStart → opacity 0.
   * Quick 12% fade as it rises; finishes before geometric center (~0.24·H).
   */
  revealStartY: 0.64,
  revealEndY: 0.52,
  /** Subtle rise — kept brief. */
  revealTranslatePx: 35,
  /**
   * Brief settle after each Lenis impulse (~6 frames).
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
  /** Exact vertical center for featured-card framing. */
  const featuredCardTop = (FEED_CONFIG.height - cardHeight) / 2;

  return {
    cardWidth,
    cardHeight,
    horizontalPadding,
    leftX,
    centerX,
    rightX,
    verticalStepPx,
    overlapRatio,
    featuredCardTop,
  };
};
