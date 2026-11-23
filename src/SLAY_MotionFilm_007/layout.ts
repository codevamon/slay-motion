import {SLAY_CARDS, getCardById} from "./assets";
import {FEED_CONFIG, getCardMetrics} from "./config";

export type HorizontalPosition = "left" | "center" | "right";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

/**
 * Combined image + zigzag period.
 * 10 assets × 4-phase zigzag → LCM(10, 4) = 20 card instances.
 */
export const CARD_PERIOD = lcm(SLAY_CARDS.length, 4);

/**
 * Infinite zigzag: LEFT → CENTER → RIGHT → CENTER → …
 * Uses globalCardIndex (not asset index) so the pattern continues across loops.
 */
export const getHorizontalPosition = (
  globalCardIndex: number,
): HorizontalPosition => {
  const phase = ((globalCardIndex % 4) + 4) % 4;
  if (phase === 0) return "left";
  if (phase === 1) return "center";
  if (phase === 2) return "right";
  return "center";
};

export type DocCard = {
  id: string;
  assetId: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  cycle: number;
  globalIndex: number;
  layoutPhase: number;
  assetIndex: number;
};

export type DocumentLayout = {
  cards: DocCard[];
  pageHeight: number;
  cardPeriod: number;
  cardWidth: number;
  cardHeight: number;
  leftX: number;
  centerX: number;
  rightX: number;
  verticalStepPx: number;
  overlapRatio: number;
};

const xForPosition = (
  position: HorizontalPosition,
  metrics: ReturnType<typeof getCardMetrics>,
) => {
  if (position === "left") return metrics.leftX;
  if (position === "right") return metrics.rightX;
  return metrics.centerX;
};

/**
 * Build one spatial period of CARD_PERIOD cards (image×layout LCM).
 * zIndex = globalIndex (later cards above earlier — deterministic).
 */
export const buildPeriodCards = (
  canvasWidth: number,
  cycle: number,
  yOffset: number,
  globalIndexBase: number,
): DocCard[] => {
  const metrics = getCardMetrics(canvasWidth);
  const cards: DocCard[] = [];
  let y = yOffset + metrics.horizontalPadding * 0.35;
  const n = SLAY_CARDS.length;

  for (let localIndex = 0; localIndex < CARD_PERIOD; localIndex++) {
    const globalIndex = globalIndexBase + localIndex;
    const assetIndex = ((globalIndex % n) + n) % n;
    const layoutPhase = ((globalIndex % 4) + 4) % 4;
    const asset = getCardById(SLAY_CARDS[assetIndex].id);
    const position = getHorizontalPosition(globalIndex);
    const x = xForPosition(position, metrics);

    cards.push({
      id: `${asset.id}__g${globalIndex}`,
      assetId: asset.id,
      src: asset.src,
      x,
      y,
      width: metrics.cardWidth,
      height: metrics.cardHeight,
      /**
       * Keep stacking order = document order, but never negative:
       * CSS negative z-index paints behind the pink AbsoluteFill background,
       * which hid preceding-period cards at the loop seam in early 006.
       */
      zIndex: globalIndex + CARD_PERIOD * 2,
      cycle,
      globalIndex,
      layoutPhase,
      assetIndex,
    });

    y += metrics.verticalStepPx;
  }

  return cards;
};

export const buildDocumentLayout = (
  canvasWidth: number = FEED_CONFIG.width,
): DocumentLayout => {
  const metrics = getCardMetrics(canvasWidth);
  /**
   * Period height = exactly CARD_PERIOD steps so card N and card N+PERIOD
   * are spaced identically to consecutive cards (no padding gap at the seam).
   */
  const pageHeight = CARD_PERIOD * metrics.verticalStepPx;

  const cards = [
    ...buildPeriodCards(canvasWidth, -1, -pageHeight, -CARD_PERIOD),
    ...buildPeriodCards(canvasWidth, 0, 0, 0),
    ...buildPeriodCards(canvasWidth, 1, pageHeight, CARD_PERIOD),
  ];

  return {
    cards,
    pageHeight,
    cardPeriod: CARD_PERIOD,
    cardWidth: metrics.cardWidth,
    cardHeight: metrics.cardHeight,
    leftX: metrics.leftX,
    centerX: metrics.centerX,
    rightX: metrics.rightX,
    verticalStepPx: metrics.verticalStepPx,
    overlapRatio: metrics.overlapRatio,
  };
};

/**
 * Scroll destination for a featured card.
 * Uses a consistent top-edge ratio (20–30% band) so the full card is inside
 * the viewport at settle. Gesture distance stays one verticalStep (offset cancels).
 */
export const viewScrollForCard = (
  card: DocCard,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const targetCardTop = viewportHeight * FEED_CONFIG.featuredCardTopRatio;
  // Guard: keep the full card inside the viewport.
  const maxTop = Math.max(0, viewportHeight - card.height);
  const clampedTop = Math.min(Math.max(0, targetCardTop), maxTop);
  return card.y - clampedTop;
};

/** Screen-space framing of a card at a given scrollY. */
export const getCardScreenFrame = (
  card: DocCard,
  scrollY: number,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const top = card.y - scrollY;
  const bottom = top + card.height;
  return {
    top,
    bottom,
    fullyVisible: top >= -0.5 && bottom <= viewportHeight + 0.5,
  };
};

/** All cards in the primary spatial period (indices 0..CARD_PERIOD-1). */
export const getPeriodCards = (layout: DocumentLayout) =>
  layout.cards
    .filter((c) => c.cycle === 0)
    .sort((a, b) => a.globalIndex - b.globalIndex);

/** Card by absolute global index (searches all cycles). */
export const getCardByGlobalIndex = (
  layout: DocumentLayout,
  globalIndex: number,
): DocCard => {
  const card = layout.cards.find((c) => c.globalIndex === globalIndex);
  if (!card) {
    throw new Error(`Missing card at globalIndex ${globalIndex}`);
  }
  return card;
};

/** Period-aligned twin of the opening card (same asset + same layout phase). */
export const getLoopTargetCard = (layout: DocumentLayout) =>
  getCardByGlobalIndex(layout, CARD_PERIOD);
