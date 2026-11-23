import {PARALLAX_CONFIG} from "./config";
import {getScrollPosition, type ScrollStop} from "./scrollTimeline";

/**
 * Scroll-driven parallax for SLAY-MotionFilm-009.
 *
 * Diagnosis of the previous approach:
 * `sin(π · impulseProgress)` was a second animation curve. It peaked mid-impulse
 * and returned to zero on its own schedule, so cards appeared to keep moving
 * (or settle separately) while the master Lenis scroll was already decelerating.
 *
 * Fix: derive offset only from instantaneous master-scroll velocity.
 * When scroll velocity → 0 (holds / settle), offset → 0 with no extra easing.
 */

export type ScrollVelocityState = {
  scrollY: number;
  previousScrollY: number;
  /** px per frame — same units as getScrollPosition delta. */
  velocity: number;
};

/** Frame-deterministic velocity from the shared scroll timeline (no lag / smoothing). */
export const getScrollVelocity = (
  frame: number,
  stops: ScrollStop[],
): ScrollVelocityState => {
  const scrollY = getScrollPosition(frame, stops);
  const previousScrollY =
    frame <= 0 ? scrollY : getScrollPosition(frame - 1, stops);
  return {
    scrollY,
    previousScrollY,
    velocity: scrollY - previousScrollY,
  };
};

/** Stable depth from asset identity (consistent across loop cycles). */
export const getParallaxDepth = (assetIndex: number): number => {
  const factors = PARALLAX_CONFIG.depthFactors;
  const i = ((assetIndex % factors.length) + factors.length) % factors.length;
  return factors[i];
};

/**
 * Vertical parallax offset in px.
 * finalY = (documentY - scrollY) + offset
 *
 * offset ∝ scrollVelocity — locked to the master driver.
 */
export const getParallaxOffset = (
  assetIndex: number,
  scrollVelocity: number,
): number => {
  if (!PARALLAX_CONFIG.enabled || scrollVelocity === 0) {
    return 0;
  }

  const raw =
    scrollVelocity * getParallaxDepth(assetIndex) * PARALLAX_CONFIG.strength;
  const max = PARALLAX_CONFIG.maxOffset;
  return Math.max(-max, Math.min(max, raw));
};
