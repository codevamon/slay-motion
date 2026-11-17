import {Easing} from "remotion";

/**
 * Cubic-bezier motion system for SLAY editorial feed.
 * Starting hypotheses refined for flick velocity + soft settle.
 * Avoid bounce / overshoot (absent from reference Smooth preset).
 */

/** Primary flick travel — Smooth-like, decisive, short tail. */
export const editorialEase = Easing.bezier(0.76, 0.0, 0.24, 1.0);

/** Card opacity entrance — soft arrival without sluggishness. */
export const editorialEnter = Easing.bezier(0.22, 1.0, 0.36, 1.0);

/** Reserved for exit fades if needed later. */
export const editorialExit = Easing.bezier(0.64, 0.0, 0.78, 0.0);

/** Alias used by Feed Scroll flick segments. */
export const smoothFlick = editorialEase;
