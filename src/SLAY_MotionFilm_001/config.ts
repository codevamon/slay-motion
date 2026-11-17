/**
 * SLAY-MotionFilm-001 — Phase 01.4 config.
 * Virtual scroll timing/easing preserved from Phase 01.3.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-001";

export const CARD_ASPECT_RATIO = 16 / 9;

export const FEED_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 540,
  loopDurationSeconds: 18,
  backgroundColor: "#F6C5D9",
  /** Horizontal padding (6% of width) for left/right card edges. */
  paddingPercent: 6,
  cornerRadiusPercent: 0,
  /** Uniform card width as % of canvas. */
  cardSizePercent: 52,
  /**
   * Document vertical step as multiplier of the shared 16:9 card height.
   * 1.12 → ~12% gap between cards (no dense pile).
   */
  verticalStep: 1.12,
  /** Viewport top margin when framing a focused card. */
  viewTopMargin: 0.1,
  /** Reveal zone: card top edge as fraction of viewport height. */
  revealStartY: 0.9,
  revealEndY: 0.68,
  /** Fade-up distance in px during reveal. */
  revealTranslatePx: 60,
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

  return {
    cardWidth,
    cardHeight,
    horizontalPadding,
    leftX,
    centerX,
    rightX,
    verticalStepPx,
  };
};
