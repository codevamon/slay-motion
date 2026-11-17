import {FEED_CONFIG} from "./config";
import {
  buildDocumentLayout,
  getPrimaryPageCards,
  viewScrollForCard,
  type DocumentLayout,
} from "./layout";
// continuousScrollEase kept in easing.ts for reference; Hermite uses raw time
// so first-derivative continuity across stops is preserved.

export type ScrollStop = {
  frame: number;
  scrollY: number;
  label: string;
};

/**
 * Same destinations / rhythm as 001 — only interpolation & settle differ.
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

/** Cubic Hermite basis — C1 continuous when endpoint tangents match across segments. */
const hermite = (
  t: number,
  p0: number,
  p1: number,
  m0: number,
  m1: number,
) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * p0 +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * p1 +
    (t3 - t2) * m1
  );
};

/** Central-difference velocity (scrollY / frame) at stop i. */
const tangentAt = (stops: ScrollStop[], i: number) => {
  if (i <= 0) {
    const dt = stops[1].frame - stops[0].frame;
    return dt === 0 ? 0 : (stops[1].scrollY - stops[0].scrollY) / dt;
  }
  if (i >= stops.length - 1) {
    const dt = stops[i].frame - stops[i - 1].frame;
    return dt === 0 ? 0 : (stops[i].scrollY - stops[i - 1].scrollY) / dt;
  }
  const dt = stops[i + 1].frame - stops[i - 1].frame;
  return dt === 0 ? 0 : (stops[i + 1].scrollY - stops[i - 1].scrollY) / dt;
};

/**
 * Deterministic continuous scroll for 002.
 * - Same stop destinations as 001
 * - Settle reduced to FEED_CONFIG.settleSec (~3 frames)
 * - Hermite tangents keep first-derivative continuity across impulses
 * - Mild continuousScrollEase shapes the segment parameter (not a hard stop)
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
    const t = span <= 0 ? 1 : Math.min(1, Math.max(0, (clamped - a.frame) / span));

    // Scale tangents by full segment duration so knot velocities match across segments.
    const dt = b.frame - a.frame;
    const m0 = tangentAt(stops, i) * dt;
    const m1 = tangentAt(stops, i + 1) * dt;

    return hermite(t, a.scrollY, b.scrollY, m0, m1);
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
