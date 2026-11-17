import {FEED_CONFIG} from "./config";
import {
  buildDocumentLayout,
  getPrimaryPageCards,
  viewScrollForCard,
  type DocumentLayout,
} from "./layout";
import {scrollEase} from "./motion/easing";

export type ScrollStop = {
  frame: number;
  scrollY: number;
  label: string;
};

/**
 * Viewing targets (seconds) → focused card index on the primary page.
 * Last stop aims at cycle-1 Barcelona for seamless loop handoff.
 */
const FOCUS_PLAN: {timeSec: number; focusIndex: number; label: string}[] = [
  {timeSec: 0, focusIndex: 0, label: "barcelona"},
  {timeSec: 2, focusIndex: 1, label: "botanical"},
  {timeSec: 4, focusIndex: 2, label: "flower"},
  {timeSec: 6, focusIndex: 3, label: "north-ave"},
  {timeSec: 8, focusIndex: 4, label: "maple-street"},
  {timeSec: 10, focusIndex: 5, label: "arches"},
  {timeSec: 12, focusIndex: 6, label: "fresh"},
  {timeSec: 14, focusIndex: 7, label: "nov-2026"},
  {timeSec: 16, focusIndex: 8, label: "wildflowers"},
  {timeSec: 18, focusIndex: 0, label: "barcelona-loop"},
];

/** Brief settle after each impulse (~0.3s). */
const SETTLE_SEC = 0.3;

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
 * Deterministic Lenis-like scroll position for a Remotion frame.
 * Impulses ease between stops; last SETTLE_SEC of each segment holds.
 */
export const getScrollPosition = (
  frame: number,
  stops: ScrollStop[] = buildScrollStops(),
): number => {
  const fps = FEED_CONFIG.fps;
  const settleFrames = Math.round(SETTLE_SEC * fps);
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
    const eased = scrollEase(Math.min(1, Math.max(0, t)));
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
