import {SLAY_CARDS, getCardById} from "./assets";
import {FEED_CONFIG, getCardMetrics} from "./config";

export type HorizontalPosition = "left" | "center" | "right";

/**
 * Infinite zigzag: LEFT → CENTER → RIGHT → CENTER → …
 * Uses globalCardIndex (not asset index) so the pattern continues across loops.
 * Nine assets are not divisible by 4 — card 10 (index 9) must be CENTER.
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
};

export type DocumentLayout = {
  cards: DocCard[];
  pageHeight: number;
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
 * Build document cards for one asset cycle.
 * globalIndexBase continues the zigzag across repeated pages.
 */
export const buildPageCards = (
  canvasWidth: number,
  cycle: number,
  yOffset: number,
  globalIndexBase: number,
): DocCard[] => {
  const metrics = getCardMetrics(canvasWidth);
  const cards: DocCard[] = [];
  let y = yOffset + metrics.horizontalPadding * 0.35;

  SLAY_CARDS.forEach((_slot, localIndex) => {
    const globalIndex = globalIndexBase + localIndex;
    // JS % is signed — normalize so preceding cycles resolve correctly.
    const n = SLAY_CARDS.length;
    const assetIndex = ((globalIndex % n) + n) % n;
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
    });

    y += metrics.verticalStepPx;
  });

  return cards;
};

export const buildDocumentLayout = (
  canvasWidth: number = FEED_CONFIG.width,
): DocumentLayout => {
  const metrics = getCardMetrics(canvasWidth);
  const pageHeight =
    metrics.horizontalPadding * 0.35 +
    SLAY_CARDS.length * metrics.verticalStepPx +
    metrics.horizontalPadding;

  // Preceding + current + following pages for seamless loop viewport coverage.
  // Cycle -1: globalIndexBase -9; cycle 0: 0; cycle 1: 9 (next zigzag continues).
  const cards = [
    ...buildPageCards(canvasWidth, -1, -pageHeight, -SLAY_CARDS.length),
    ...buildPageCards(canvasWidth, 0, 0, 0),
    ...buildPageCards(canvasWidth, 1, pageHeight, SLAY_CARDS.length),
  ];

  return {
    cards,
    pageHeight,
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
 *
 * Relative distances between destinations are unchanged vs 003 (same cardHeight),
 * so Lenis impulse velocities stay consistent — only absolute framing shifts.
 */
export const viewScrollForCard = (
  card: DocCard,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  const targetScreenY = (viewportHeight - card.height) / 2;
  return card.y - targetScreenY;
};

export const getPrimaryPageCards = (layout: DocumentLayout) =>
  layout.cards.filter((c) => c.cycle === 0);
