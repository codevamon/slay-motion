import {Easing} from "remotion";

/** 001 reference curve — early snap, long settle (kept for comparison). */
export const smoothScrollEase = Easing.bezier(0.76, 0.0, 0.24, 1.0);

/**
 * Lenis-like impulse: quick response, sustained travel, progressive deceleration.
 * Active scroll ease for MotionFilm-003.
 */
export const lenisLikeEase = Easing.bezier(0.22, 0.7, 0.2, 1.0);

export const scrollEase = lenisLikeEase;

/**
 * Faster reveal than 002 — responsive ease-out, opacity settles quickly.
 */
export const revealEase = Easing.bezier(0.22, 1.0, 0.36, 1.0);
