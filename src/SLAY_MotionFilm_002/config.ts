/**
 * SLAY-MotionFilm-002 — Phase 02 refinements (reveal + scroll continuity).
 * Layout/assets identical to approved 001. Reveal thresholds + scroll holds differ.
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-002";

export const CARD_ASPECT_RATIO = 16 / 9;

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
  verticalStep: 1.12,
  viewTopMargin: 0.1,
  /**
   * Reveal deeper inside the viewport so opacity changes while the card is visible.
   * 001 used 0.90 → 0.68 (mostly off-screen).
   */
  revealStartY: 0.72,
  revealEndY: 0.34,
  /** Fade-up distance in px (001 used 60). */
  revealTranslatePx: 75,
  /**
   * Explicit settle after each impulse.
   * 001 used 0.3s (9 frames). Reduced ~67% → 0.1s (3 frames).
   */
  settleSec: 0.1,
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
