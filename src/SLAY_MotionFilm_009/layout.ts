import {SLAY_CARDS, getCardById} from "./assets";
import {
  FEED_CONFIG,
  getCardHeightForAsset,
  getCardMetrics,
  getVerticalStepForHeight,
} from "./config";

export type HorizontalPosition = "left" | "center" | "right";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

/**
 * Combined image + zigzag period.
 * 10 assets × 4-phase zigzag → LCM(10, 4) = 20 card instances.
 */
export const CARD_PERIOD = lcm(SLAY_CARDS.length, 4);

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
  nativeWidth: number;
  nativeHeight: number;
};

export type DocumentLayout = {
  cards: DocCard[];
  pageHeight: number;
  cardPeriod: number;
  cardWidth: number;
  /** Reference height (first asset) — individual cards may differ. */
  cardHeight: number;
  leftX: number;
  centerX: number;
  rightX: number;
  /** Mean step across the period (for diagnostics). */
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

/** Document advance after placing a card of the given height. */
const stepAfterCard = (cardHeight: number) =>
  getVerticalStepForHeight(cardHeight);

/**
 * Build one spatial period with per-image heights.
 * Vertical step after each card = that card's height × overlap ratio.
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
    const height = getCardHeightForAsset(
      asset.nativeWidth,
      asset.nativeHeight,
      canvasWidth,
    );

    cards.push({
      id: `${asset.id}__g${globalIndex}`,
      assetId: asset.id,
      src: asset.src,
      x,
      y,
      width: metrics.cardWidth,
      height,
      zIndex: globalIndex + CARD_PERIOD * 2,
      cycle,
      globalIndex,
      layoutPhase,
      assetIndex,
      nativeWidth: asset.nativeWidth,
      nativeHeight: asset.nativeHeight,
    });

    y += stepAfterCard(height);
  }

  return cards;
};

/** Exact period height from the 20-card image×layout sequence. */
export const measurePeriodHeight = (
  canvasWidth: number = FEED_CONFIG.width,
): number => {
  let height = 0;
  const n = SLAY_CARDS.length;
  for (let i = 0; i < CARD_PERIOD; i++) {
    const asset = SLAY_CARDS[((i % n) + n) % n];
    const cardHeight = getCardHeightForAsset(
      asset.nativeWidth,
      asset.nativeHeight,
      canvasWidth,
    );
    height += stepAfterCard(cardHeight);
  }
  return height;
};

export const buildDocumentLayout = (
  canvasWidth: number = FEED_CONFIG.width,
): DocumentLayout => {
  const metrics = getCardMetrics(canvasWidth);
  const pageHeight = measurePeriodHeight(canvasWidth);
  const refHeight = getCardHeightForAsset(
    SLAY_CARDS[0].nativeWidth,
    SLAY_CARDS[0].nativeHeight,
    canvasWidth,
  );

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
    cardHeight: refHeight,
    leftX: metrics.leftX,
    centerX: metrics.centerX,
    rightX: metrics.rightX,
    verticalStepPx: pageHeight / CARD_PERIOD,
    overlapRatio: metrics.overlapRatio,
  };
};

/**
 * Centered scroll destination using each card's actual height.
 * targetScrollY = documentY + height/2 - viewportHeight/2
 */
export const viewScrollForCard = (
  card: DocCard,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  return card.y + card.height / 2 - viewportHeight / 2;
};

export const getCardScreenFrame = (
  card: DocCard,
  scrollY: number,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const top = card.y - scrollY;
  const bottom = top + card.height;
  const idealTop = (viewportHeight - card.height) / 2;
  const center = top + card.height / 2;
  return {
    top,
    bottom,
    idealTop,
    center,
    centerErrorPx: Math.abs(center - viewportHeight / 2),
    fullyVisible: top >= -0.5 && bottom <= viewportHeight + 0.5,
    centeredWithin10px: Math.abs(center - viewportHeight / 2) <= 10,
    tallerThanViewport: card.height > viewportHeight + 0.5,
  };
};

export const getPeriodCards = (layout: DocumentLayout) =>
  layout.cards
    .filter((c) => c.cycle === 0)
    .sort((a, b) => a.globalIndex - b.globalIndex);

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

export const getLoopTargetCard = (layout: DocumentLayout) =>
  getCardByGlobalIndex(layout, CARD_PERIOD);
