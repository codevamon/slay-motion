import {DURATION_IN_FRAMES, FPS, FEED} from "./config";
import {CARD_SLOTS} from "./assets";

/**
 * Structured timeline specification from reference analysis.
 *
 * VERIFIED:
 * - Total duration 18.0s
 * - Continuous Feed Scroll (Flicks), cards rising, new cards covering above
 * - Entry: from bottom (fade)
 * - Exit: through top
 * - No camera rotation / 3D
 *
 * INFERRED:
 * - 12 flick steps → ~1.5s per flick (18 / 12)
 * - Slot order from observed card identities across extracted frames
 * - Exact pixel rest positions derived from Feed Scroll maths, not manual keys
 */

export type TimelineBeat = {
  slotIndex: number;
  cardId: string;
  label: string;
  /** Approximate time the card becomes the foreground focus */
  focusSec: number;
  startFrame: number;
  endFrame: number;
  entry: "bottom-fade";
  exit: "top";
  lane: "left" | "right";
  notes: string;
};

const FLICK_SEC = DURATION_IN_FRAMES / FPS / FEED.slotCount;

export const TIMELINE: TimelineBeat[] = CARD_SLOTS.map((card, i) => {
  const focusSec = i * FLICK_SEC;
  return {
    slotIndex: i,
    cardId: card.id,
    label: card.label,
    focusSec: Number(focusSec.toFixed(2)),
    startFrame: Math.round(focusSec * FPS),
    endFrame: Math.round((focusSec + FLICK_SEC) * FPS),
    entry: "bottom-fade",
    exit: "top",
    lane: i % 2 === 0 ? "left" : "right",
    notes:
      i === 0
        ? "Opens near top — BARCELONA visible at loop boundary"
        : "Flick upward; covers previous card",
  };
});

export const TIMELINE_META = {
  durationFrames: DURATION_IN_FRAMES,
  durationSec: DURATION_IN_FRAMES / FPS,
  flickSec: FLICK_SEC,
  flickFrames: Math.round(FLICK_SEC * FPS),
  movePortion: FEED.flickLength,
  holdPortion: 1 - FEED.flickLength,
  easing: "editorialEase / Smooth (0.76, 0, 0.24, 1)",
  layerRule: "Higher feed index → higher zIndex (entering card on top)",
} as const;
