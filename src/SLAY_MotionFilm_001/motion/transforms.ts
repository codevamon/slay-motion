import {FEED, HEIGHT, WIDTH} from "../config";

export type CardGeometry = {
  cardW: number;
  cardH: number;
  padX: number;
  padY: number;
  stride: number;
  maxLaneOffset: number;
};

export const getCardGeometry = (
  width = WIDTH,
  height = HEIGHT,
): CardGeometry => {
  const cardW = width * FEED.cardSize;
  const cardH = cardW / FEED.cardRatio;
  const padX = width * FEED.padding;
  const padY = height * FEED.padding;
  const stride = cardH * FEED.spacing;
  const usable = width - padX * 2 - cardW;
  const maxLaneOffset = Math.max(0, usable * 0.5 * FEED.laneSpread);

  return {cardW, cardH, padX, padY, stride, maxLaneOffset};
};

/** Alternating left / right lanes (Feed Scroll lane spread). */
export const laneX = (index: number, geo: CardGeometry, width = WIDTH) => {
  const lane = index % 2 === 0 ? -1 : 1;
  const center = width / 2 - geo.cardW / 2;
  return center + lane * geo.maxLaneOffset;
};

/**
 * Vertical rest position in content space.
 * Index 0 starts near the top of the feed stack.
 */
export const restY = (index: number, geo: CardGeometry) => {
  return geo.padY + index * geo.stride;
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const fadeOpacity = (
  localProgress: number,
  fadeIn = FEED.fadeIn,
  easing: (t: number) => number,
) => {
  if (FEED.enterBy !== "fade") {
    return 1;
  }
  const t = clamp01(localProgress / Math.max(0.0001, fadeIn));
  return easing(t);
};
