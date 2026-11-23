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
 * Asset restart alone is NOT a layout reset — only CARD_PERIOD restores both.
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
 * globalIndexBase continues the zigzag across repeated periods.
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
      zIndex: globalIndex,
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
  const pageHeight =
    metrics.horizontalPadding * 0.35 +
    CARD_PERIOD * metrics.verticalStepPx +
    metrics.horizontalPadding;

  // Preceding + current + following periods for seamless viewport coverage.
  // Period length is CARD_PERIOD (20), not asset count (10).
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
  };
};

/**
 * Scroll destination so the featured card settles vertically centered.
 * screenY = card.y - scrollY  ⇒  scrollY = card.y - (viewportHeight - cardHeight) / 2
 */
export const viewScrollForCard = (
  card: DocCard,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const targetScreenY = (viewportHeight - card.height) / 2;
  return card.y - targetScreenY;
};

/** Unique final-asset focuses in the primary period (first 10 of 20). */
export const getPrimaryAssetCards = (layout: DocumentLayout) =>
  layout.cards
    .filter((c) => c.cycle === 0 && c.globalIndex < SLAY_CARDS.length)
    .sort((a, b) => a.globalIndex - b.globalIndex);

/** Period-aligned twin of the opening card (same asset + same layout phase). */
export const getLoopTargetCard = (layout: DocumentLayout) => {
  const twin = layout.cards.find(
    (c) => c.globalIndex === CARD_PERIOD && c.cycle === 1,
  );
  if (!twin) {
    throw new Error(
      `Missing loop twin at globalIndex ${CARD_PERIOD} (cycle 1)`,
    );
  }
  return twin;
};
