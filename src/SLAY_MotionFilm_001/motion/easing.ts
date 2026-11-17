import {Easing} from "remotion";

/**
 * Lenis-like scroll impulse — approved in Phase 01.3.
 * Applied only to virtual scrollY.
 */
export const smoothScrollEase = Easing.bezier(0.76, 0.0, 0.24, 1.0);

export const gentleScrollEase = Easing.bezier(0.45, 0.0, 0.55, 1.0);

/** Active scroll impulse curve — do not change without creative approval. */
export const scrollEase = smoothScrollEase;

/**
 * Scroll-triggered card reveal (opacity + fade-up).
 * Soft arrival, no overshoot.
 */
export const revealEase = Easing.bezier(0.22, 1.0, 0.36, 1.0);
