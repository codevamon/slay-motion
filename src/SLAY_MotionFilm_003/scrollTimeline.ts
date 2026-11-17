import {FEED_CONFIG} from "./config";
import {
  buildDocumentLayout,
  getPrimaryPageCards,
  viewScrollForCard,
  type DocumentLayout,
} from "./layout";
import {lenisLikeEase} from "./motion/easing";

export type ScrollStop = {
  frame: number;
  scrollY: number;
  label: string;
};

/**
 * Same destinations as 001/002.
 * Arrival times re-spaced so primary impulses run ~20% longer than 001's
 * 51-frame moves (target ~61 frames), with brief 5-frame settles.
 *
 * 001 intervals were uniform 60f (move 51 + settle 9).
 * 003: longer early/mid intervals, slightly compressed near the loop handoff.
 */
const FOCUS_PLAN: {timeSec: number; focusIndex: number; label: string}[] = [
  {timeSec: 0, focusIndex: 0, label: "barcelona"},
  {timeSec: 2.2, focusIndex: 1, label: "botanical"},
  {timeSec: 4.4, focusIndex: 2, label: "flower"},
  {timeSec: 6.6, focusIndex: 3, label: "north-ave"},
  {timeSec: 8.8, focusIndex: 4, label: "maple-street"},
  {timeSec: 11.0, focusIndex: 5, label: "arches"},
  {timeSec: 13.2, focusIndex: 6, label: "fresh"},
  {timeSec: 15.2, focusIndex: 7, label: "nov-2026"},
  {timeSec: 16.8, focusIndex: 8, label: "wildflowers"},
  {timeSec: 18.0, focusIndex: 0, label: "barcelona-loop"},
];

let cachedLayout: DocumentLayout | null = null;

export const getLayout = (): DocumentLayout => {
  if (!cachedLayout) {
    cachedLayout = buildDocumentLayout(FEED_CONFIG.width);
  }
  return cachedLayout;
};

export const buildScrollStops = (
  layout: DocumentLayout = getLayout(),
): ScrollStop[] => {
  const primary = getPrimaryPageCards(layout);
  const fps = FEED_CONFIG.fps;

  return FOCUS_PLAN.map((plan) => {
    const card =
      plan.label === "barcelona-loop"
        ? layout.cards.find((c) => c.cycle === 1 && c.assetId === "barcelona")!
        : primary[plan.focusIndex];

    return {
      frame: Math.round(plan.timeSec * fps),
      scrollY: viewScrollForCard(card, FEED_CONFIG.height),
      label: plan.label,
    };
  });
};

/**
 * Section impulses like 001 (bezier per gesture), not 002 Hermite.
 * Longer travel + shorter settle + lenisLikeEase for natural inertia.
 */
export const getScrollPosition = (
  frame: number,
  stops: ScrollStop[] = buildScrollStops(),
): number => {
  const settleFrames = Math.round(FEED_CONFIG.settleSec * FEED_CONFIG.fps);
  const clamped = Math.max(0, Math.min(frame, FEED_CONFIG.durationInFrames));

  if (clamped <= stops[0].frame) {
    return stops[0].scrollY;
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (clamped > b.frame) {
      continue;
    }

    const moveEnd = Math.max(a.frame + 1, b.frame - settleFrames);
    if (clamped >= moveEnd) {
      return b.scrollY;
    }

    const span = moveEnd - a.frame;
    const t = span <= 0 ? 1 : (clamped - a.frame) / span;
    const eased = lenisLikeEase(Math.min(1, Math.max(0, t)));
    return a.scrollY + (b.scrollY - a.scrollY) * eased;
  }

  return stops[stops.length - 1].scrollY;
};

export const getVisibleDocCards = (
  scrollY: number,
  layout: DocumentLayout = getLayout(),
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const margin = viewportHeight * 0.35;
  return layout.cards.filter((card) => {
    const screenY = card.y - scrollY;
    return screenY < viewportHeight + margin && screenY + card.height > -margin;
  });
};
