import {getCardById, type SlayCard} from "./assets";
import {FEED_CONFIG} from "./config";

export type Side = "left" | "right";

/**
 * Zigzag sides — deliberate consecutive same-side placements (not rigid checkerboard).
 */
export const CARD_LAYOUT: {id: string; side: Side}[] = [
  {id: "barcelona", side: "left"},
  {id: "botanical", side: "right"},
  {id: "flower", side: "right"},
  {id: "north-ave", side: "left"},
  {id: "maple-street", side: "left"},
  {id: "arches", side: "right"},
  {id: "fresh", side: "left"},
  {id: "nov-2026", side: "right"},
  {id: "wildflowers", side: "left"},
];

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
};

export type DocumentLayout = {
  cards: DocCard[];
  /** Height of one full 9-card page (for loop wrapping). */
  pageHeight: number;
};

const cardSize = (asset: SlayCard, canvasWidth: number) => {
  const width = canvasWidth * (FEED_CONFIG.cardSizePercent / 100);
  const aspect = asset.nativeWidth / asset.nativeHeight;
  const height = width / aspect;
  return {width, height};
};

const cardX = (side: Side, cardWidth: number, canvasWidth: number) => {
  if (side === "left") {
    return canvasWidth * FEED_CONFIG.leftEdge;
  }
  return canvasWidth * FEED_CONFIG.rightEdge - cardWidth;
};

/**
 * Build one page of document-space cards with zigzag + 70% vertical step.
 */
export const buildPageCards = (
  canvasWidth: number,
  cycle: number,
  yOffset: number,
): DocCard[] => {
  const cards: DocCard[] = [];
  let y = yOffset + canvasWidth * (FEED_CONFIG.paddingPercent / 100) * 0.5;

  CARD_LAYOUT.forEach((slot, index) => {
    const asset = getCardById(slot.id);
    const {width, height} = cardSize(asset, canvasWidth);
    const x = cardX(slot.side, width, canvasWidth);

    cards.push({
      id: `${slot.id}__c${cycle}`,
      assetId: slot.id,
      src: asset.src,
      x,
      y,
      width,
      height,
      zIndex: index + cycle * CARD_LAYOUT.length,
      cycle,
    });

    // Same-side pairs need more run-out; opposite sides can share a shallow overlap zone.
    const prevSide = CARD_LAYOUT[index]?.side;
    const nextSide = CARD_LAYOUT[index + 1]?.side;
    const sameSide = Boolean(nextSide && nextSide === prevSide);
    const step = sameSide
      ? Math.max(FEED_CONFIG.verticalStep, 0.9)
      : FEED_CONFIG.verticalStep;
    y += height * step;
  });

  return cards;
};

export const buildDocumentLayout = (
  canvasWidth = FEED_CONFIG.width,
): DocumentLayout => {
  // Measure page height from a dry run
  const probe = buildPageCards(canvasWidth, 0, 0);
  const last = probe[probe.length - 1];
  const pageHeight =
    last.y + last.height + canvasWidth * (FEED_CONFIG.paddingPercent / 100);

  // Two cycles for seamless loop scrolling into the next page
  const cards = [
    ...buildPageCards(canvasWidth, 0, 0),
    ...buildPageCards(canvasWidth, 1, pageHeight),
  ];

  return {cards, pageHeight};
};

/** ScrollY that frames a document card near the top of the viewport. */
export const viewScrollForCard = (
  card: DocCard,
  viewportHeight: number = FEED_CONFIG.height,
) => {
  return card.y - viewportHeight * FEED_CONFIG.viewTopMargin;
};

/** Stable lookup of cycle-0 cards by asset id order. */
export const getPrimaryPageCards = (layout: DocumentLayout) =>
  layout.cards.filter((c) => c.cycle === 0);

