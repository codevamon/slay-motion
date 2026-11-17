import {Easing} from "remotion";

/**
 * Candidate for shared feed progress modulation.
 * Active feed uses constant velocity for continuous stream feel;
 * this curve is available if a global ease layer is needed later.
 */
export const editorialEase = Easing.bezier(0.45, 0.0, 0.55, 1.0);

/** Alias from Phase 01.2 spec. */
export const smoothTravel = editorialEase;
