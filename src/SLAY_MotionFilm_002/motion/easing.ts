import {Easing} from "remotion";

/** Retained for reference — 001 scroll curve (not used as primary in 002). */
export const smoothScrollEase = Easing.bezier(0.76, 0.0, 0.24, 1.0);

/**
 * Balanced scroll impulse for 002 — less aggressive deceleration than 001.
 * Used as a gentle shaping layer; primary continuity comes from Hermite tangents.
 */
export const continuousScrollEase = Easing.bezier(0.45, 0.0, 0.55, 1.0);

export const scrollEase = continuousScrollEase;

/**
 * Reveal ease for 002 — more linear mid-progress so opacity stays readable on-screen.
 */
export const revealEase = Easing.bezier(0.42, 0.0, 0.58, 1.0);
