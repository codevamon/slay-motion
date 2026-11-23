import {SLAY_CARDS} from "./assets";
import {FEED_CONFIG} from "./config";
import {
  CARD_PERIOD,
  buildDocumentLayout,
  getCardByGlobalIndex,
  getCardScreenFrame,
  getLoopTargetCard,
  getPeriodCards,
  viewScrollForCard,
  type DocumentLayout,
} from "./layout";
import {lenisLikeEase} from "./motion/easing";
import {getRevealState} from "./components/FeedCard";

export type ScrollStop = {
  frame: number;
  scrollY: number;
  label: string;
  globalIndex: number;
};

/**
 * Uniform Lenis gestures across the full visual period — preserved from 006.
 *
 * Each stop advances exactly one card-step to the next featured card.
 * Destinations use featured-card framing (full card inside viewport).
 * Interval 2.0s; settle ~6 frames. No end catch-up / no velocity spikes.
 */
const buildFocusPlan = () => {
  const interval = FEED_CONFIG.gestureIntervalSec;
  const plan: {
    timeSec: number;
    globalIndex: number;
    label: string;
  }[] = [];

  for (let i = 0; i <= CARD_PERIOD; i++) {
    const assetIndex = ((i % SLAY_CARDS.length) + SLAY_CARDS.length) % SLAY_CARDS.length;
    const assetId = SLAY_CARDS[assetIndex].id;
    plan.push({
      timeSec: i * interval,
      globalIndex: i,
      label: i === CARD_PERIOD ? `${assetId}-loop` : `${assetId}-g${i}`,
    });
  }

  return plan;
};

const FOCUS_PLAN = buildFocusPlan();

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
  const fps = FEED_CONFIG.fps;

  return FOCUS_PLAN.map((plan) => {
    const card = getCardByGlobalIndex(layout, plan.globalIndex);
    return {
      frame: Math.round(plan.timeSec * fps),
      scrollY: viewScrollForCard(card, FEED_CONFIG.height),
      label: plan.label,
      globalIndex: plan.globalIndex,
    };
  });
};

/**
 * Section impulses: one-card Lenis bezier per gesture, brief settle.
 * No special final segment — every impulse uses the same vocabulary.
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

export type VelocityStats = {
  peak: number;
  meanMoving: number;
  samples: number;
};

const velocityStats = (velocities: number[]): VelocityStats => {
  const moving = velocities.filter((v) => Math.abs(v) > 0.01);
  const peak = moving.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const meanMoving =
    moving.length === 0
      ? 0
      : moving.reduce((s, v) => s + Math.abs(v), 0) / moving.length;
  return {peak, meanMoving, samples: moving.length};
};

/** Per-frame scroll + velocity diagnostics for validation. */
export const getScrollVelocityProfile = (
  layout: DocumentLayout = getLayout(),
) => {
  const stops = buildScrollStops(layout);
  const duration = FEED_CONFIG.durationInFrames;
  const scroll: number[] = [];
  for (let f = 0; f <= duration; f++) {
    scroll.push(getScrollPosition(f, stops));
  }

  const velocity: number[] = [];
  for (let f = 0; f < duration; f++) {
    velocity.push(scroll[f + 1] - scroll[f]);
  }

  const third = Math.floor(duration / 3);
  const first = velocity.slice(0, third);
  const middle = velocity.slice(third, third * 2);
  const final = velocity.slice(third * 2);

  // Per-impulse peak (exclude settle frames near zero)
  const impulsePeaks: number[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    let peak = 0;
    for (let f = stops[i].frame; f < stops[i + 1].frame; f++) {
      peak = Math.max(peak, Math.abs(velocity[f] ?? 0));
    }
    impulsePeaks.push(peak);
  }

  const midImpulses = impulsePeaks.slice(1, Math.max(2, impulsePeaks.length - 1));
  const typicalMidPeak =
    midImpulses.reduce((s, v) => s + v, 0) / Math.max(1, midImpulses.length);
  const finalImpulsePeak = impulsePeaks[impulsePeaks.length - 1] ?? 0;
  const finalWithin15pct =
    typicalMidPeak === 0
      ? true
      : Math.abs(finalImpulsePeak - typicalMidPeak) / typicalMidPeak <= 0.15;

  return {
    duration,
    stopCount: stops.length,
    firstThird: velocityStats(first),
    middleThird: velocityStats(middle),
    finalThird: velocityStats(final),
    impulsePeaks,
    typicalMidPeak,
    finalImpulsePeak,
    finalWithin15pct,
    distances: stops.slice(0, -1).map((s, i) => stops[i + 1].scrollY - s.scrollY),
  };
};

/** Per-settle featured-card framing + reveal completion checks. */
export const getFeaturedSettleDiagnostics = (
  layout: DocumentLayout = getLayout(),
) => {
  const stops = buildScrollStops(layout);
  const viewportHeight = FEED_CONFIG.height;

  return stops.map((stop) => {
    const card = getCardByGlobalIndex(layout, stop.globalIndex);
    const frame = getCardScreenFrame(card, stop.scrollY, viewportHeight);
    const reveal = getRevealState(frame.top, viewportHeight, false);
    const topRatio = frame.top / viewportHeight;

    // Neighbor (next card) prominence at this settle — should stay subdued.
    const next =
      stop.globalIndex < CARD_PERIOD
        ? getCardByGlobalIndex(layout, stop.globalIndex + 1)
        : null;
    const nextFrame = next
      ? getCardScreenFrame(next, stop.scrollY, viewportHeight)
      : null;
    const nextReveal = nextFrame
      ? getRevealState(nextFrame.top, viewportHeight, false)
      : null;

    return {
      label: stop.label,
      globalIndex: stop.globalIndex,
      settleFrame: stop.frame,
      top: frame.top,
      bottom: frame.bottom,
      idealTop: frame.idealTop,
      centerErrorPx: frame.centerErrorPx,
      topRatio,
      fullyVisible: frame.fullyVisible,
      centeredWithin10px: frame.centeredWithin10px,
      tallerThanViewport: frame.tallerThanViewport,
      cardHeight: card.height,
      opacity: reveal.opacity,
      revealTranslate: reveal.translateY,
      opacityComplete: reveal.opacity >= 0.999,
      revealSettled: Math.abs(reveal.translateY) < 0.5,
      nextOpacity: nextReveal?.opacity ?? null,
      nextSubdued: nextReveal ? nextReveal.opacity < 0.35 : true,
    };
  });
};

/** Diagnostics for loop continuity (frame duration ≡ frame 0 + one period). */
export const getLoopDiagnostics = (layout: DocumentLayout = getLayout()) => {
  const stops = buildScrollStops(layout);
  const scroll0 = getScrollPosition(0, stops);
  const lastFrame = FEED_CONFIG.durationInFrames - 1;
  const scrollLast = getScrollPosition(lastFrame, stops);
  const scrollBoundary = getScrollPosition(FEED_CONFIG.durationInFrames, stops);
  const delta = scrollBoundary - scroll0;
  const open = getCardByGlobalIndex(layout, 0);
  const loopCard = getLoopTargetCard(layout);
  const period = getPeriodCards(layout);
  const velocity = getScrollVelocityProfile(layout);
  const settles = getFeaturedSettleDiagnostics(layout);

  return {
    assetCount: SLAY_CARDS.length,
    cardPeriod: CARD_PERIOD,
    pageHeight: layout.pageHeight,
    overlapRatio: layout.overlapRatio,
    verticalStepPx: layout.verticalStepPx,
    cardHeight: layout.cardHeight,
    scroll0,
    scrollLast,
    scrollBoundary,
    delta,
    deltaMatchesPageHeight: Math.abs(delta - layout.pageHeight) < 0.5,
    openCard: {
      globalIndex: open.globalIndex,
      assetId: open.assetId,
      x: open.x,
      layoutPhase: open.layoutPhase,
    },
    loopCard: {
      globalIndex: loopCard.globalIndex,
      assetId: loopCard.assetId,
      x: loopCard.x,
      layoutPhase: loopCard.layoutPhase,
    },
    phaseMatch: open.layoutPhase === loopCard.layoutPhase,
    assetMatch: open.assetId === loopCard.assetId,
    xMatch: open.x === loopCard.x,
    settledAtBoundary: Math.abs(scrollLast - scrollBoundary) < 0.5,
    periodCardCount: period.length,
    durationSeconds: FEED_CONFIG.loopDurationSeconds,
    durationFrames: FEED_CONFIG.durationInFrames,
    forcedCatchUpRemoved: true,
    allFeaturedFullyVisible: settles.every((s) => s.fullyVisible),
    allFeaturedOpaque: settles.every((s) => s.opacityComplete),
    allFeaturedRevealSettled: settles.every((s) => s.revealSettled),
    allFeaturedCentered: settles.every((s) => s.centeredWithin10px),
    allNeighborsSubdued: settles.every((s) => s.nextSubdued),
    velocity,
    settles,
  };
};
