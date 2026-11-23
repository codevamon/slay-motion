/**
 * SLAY-MotionFilm-005 — Phase 05.
 * Final assets + period-correct seamless loop geometry.
 * Motion settings preserved from approved 004 (Lenis impulses, reveals, framing).
 */

export const COMPOSITION_ID = "SLAY-MotionFilm-005";

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
   * Faster, more confident reveal than 002 (0.72→0.34).
   * Still starts inside the viewport (unlike 001's 0.90→0.68).
   */
  revealStartY: 0.76,
  revealEndY: 0.52,
  /** Subtle rise — between 001 (60) and 002 (75). */
  revealTranslatePx: 55,
  /**
   * Brief settle after each Lenis-like impulse (3–6 frames target).
   * 001 used 0.3s / 9f; 002 used 0.1s / 3f. 003 uses ~0.17s / 5f.
   */
  settleSec: 0.17,
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
