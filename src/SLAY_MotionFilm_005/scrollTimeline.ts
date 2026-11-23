import {SLAY_CARDS} from "./assets";
import {FEED_CONFIG} from "./config";
import {
  CARD_PERIOD,
  buildDocumentLayout,
  getLoopTargetCard,
  getPrimaryAssetCards,
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
 * Approved 004 rhythm adapted for 10 final assets (was 9 placeholders).
 * Early/mid impulses stay near ~2.0s; late intervals compress slightly
 * like 004 toward the handoff.
 *
 * LOOP ADJUSTMENT (documented):
 * True spatial period is LCM(10,4)=20. Ending on asset-cycle restart
 * (index 10) would land RIGHT while frame 0 is LEFT — the 004 discontinuity.
 * The final stop therefore targets globalIndex 20 (period twin of index 0):
 * same asset, same layout phase, scroll delta = pageHeight.
 *
 * That final impulse travels 11 card-steps (slay-10 → period twin of slay-01)
 * over the last ~2.0s. Main impulses remain one-step Lenis gestures.
 * We do NOT cram 20 discrete focuses into 18s (would accelerate the whole film).
 */
const FOCUS_PLAN: {
  timeSec: number;
  focusIndex: number;
  label: string;
  loop?: boolean;
}[] = [
  {timeSec: 0, focusIndex: 0, label: "slay-01"},
  {timeSec: 2.0, focusIndex: 1, label: "slay-02"},
  {timeSec: 4.0, focusIndex: 2, label: "slay-03"},
  {timeSec: 6.0, focusIndex: 3, label: "slay-04"},
  {timeSec: 8.0, focusIndex: 4, label: "slay-05"},
  {timeSec: 10.0, focusIndex: 5, label: "slay-06"},
  {timeSec: 12.0, focusIndex: 6, label: "slay-07"},
  {timeSec: 13.8, focusIndex: 7, label: "slay-08"},
  {timeSec: 15.2, focusIndex: 8, label: "slay-09"},
  {timeSec: 16.4, focusIndex: 9, label: "slay-10"},
  {timeSec: 18.0, focusIndex: 0, label: "slay-01-loop", loop: true},
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
  const primary = getPrimaryAssetCards(layout);
  const loopCard = getLoopTargetCard(layout);
  const fps = FEED_CONFIG.fps;

  if (primary.length !== SLAY_CARDS.length) {
    throw new Error(
      `Expected ${SLAY_CARDS.length} primary asset cards, got ${primary.length}`,
    );
  }

  return FOCUS_PLAN.map((plan) => {
    const card = plan.loop ? loopCard : primary[plan.focusIndex];
    if (!card) {
      throw new Error(`Missing focus card for ${plan.label}`);
    }

    return {
      frame: Math.round(plan.timeSec * fps),
      scrollY: viewScrollForCard(card, FEED_CONFIG.height),
      label: plan.label,
    };
  });
};

/**
 * Section impulses like 004 (bezier per gesture).
 * Longer travel + shorter settle + lenisLikeEase for natural inertia.
 */
export const getScrollPosition = (
  frame: number,
  stops: ScrollStop[] = buildScrollStops(),
): number => {
  const settleFrames = Math.round(FEED_CONFIG.settleSec * FEED_CONFIG.fps);
  // Allow evaluating the mathematical boundary at durationInFrames (540).
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

/** Diagnostics for loop continuity (frame 540 ≡ frame 0 + one period). */
export const getLoopDiagnostics = (layout: DocumentLayout = getLayout()) => {
  const stops = buildScrollStops(layout);
  const scroll0 = getScrollPosition(0, stops);
  const scroll539 = getScrollPosition(539, stops);
  const scroll540 = getScrollPosition(FEED_CONFIG.durationInFrames, stops);
  const delta = scroll540 - scroll0;
  const primary = getPrimaryAssetCards(layout);
  const loopCard = getLoopTargetCard(layout);

  return {
    assetCount: SLAY_CARDS.length,
    cardPeriod: CARD_PERIOD,
    pageHeight: layout.pageHeight,
    scroll0,
    scroll539,
    scroll540,
    delta,
    deltaMatchesPageHeight: Math.abs(delta - layout.pageHeight) < 0.5,
    openCard: {
      globalIndex: primary[0].globalIndex,
      assetId: primary[0].assetId,
      x: primary[0].x,
      layoutPhase: primary[0].layoutPhase,
    },
    loopCard: {
      globalIndex: loopCard.globalIndex,
      assetId: loopCard.assetId,
      x: loopCard.x,
      layoutPhase: loopCard.layoutPhase,
    },
    phaseMatch: primary[0].layoutPhase === loopCard.layoutPhase,
    assetMatch: primary[0].assetId === loopCard.assetId,
    xMatch: primary[0].x === loopCard.x,
    settledAtBoundary: Math.abs(scroll539 - scroll540) < 0.5,
  };
};
