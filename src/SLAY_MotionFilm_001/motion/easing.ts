import {Easing} from "remotion";

/**
 * Lenis-like scroll impulse — decisive accel, soft settle.
 * Applied only to virtual scrollY, never per-card.
 */
export const smoothScrollEase = Easing.bezier(0.76, 0.0, 0.24, 1.0);

/** Softer alternative if smoothScrollEase feels too stoppy. */
export const gentleScrollEase = Easing.bezier(0.45, 0.0, 0.55, 1.0);

/** Active curve for Phase 01.3 impulses. */
export const scrollEase = smoothScrollEase;
