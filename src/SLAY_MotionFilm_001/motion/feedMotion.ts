import {getCardById} from "../assets";
import {
  FEED_CONFIG,
  HORIZONTAL_ANCHORS,
  type AnchorName,
} from "../config";
import {FEED_EVENTS} from "../timeline";

export type FeedCardState = {
  key: string;
  assetId: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

/**
 * Continuous vertical Feed Scroll.
 *
 * Shared constant velocity (no per-card ease-in/out holds).
 * Spacing % → stride relative to a 16:9 reference card height.
 * Enter times stagger cards along that shared timebase.
 * Loop via ±cycle copies of each event (seamless 18s wrap).
 */
export const getScrollSpeedPxPerSec = (width: number) => {
  const cardW = width * (FEED_CONFIG.cardSizePercent / 100);
  const refHeight = cardW / (16 / 9);
  const stride = refHeight * (FEED_CONFIG.spacingPercent / 100);
  // Mean enter gap across the creative schedule (~1.45s)
  // Slightly tighter than mean enter gap → confident pace, cards clear for loop seam
  const meanEnterGapSec = 1.35;
  return stride / meanEnterGapSec;
};

export const getCardSize = (
  width: number,
  nativeWidth: number,
  nativeHeight: number,
) => {
  const cardWidth = width * (FEED_CONFIG.cardSizePercent / 100);
  const aspect = nativeWidth / nativeHeight;
  const cardHeight = cardWidth / aspect;
  return {cardWidth, cardHeight};
};

export const anchorCenterX = (
  anchor: AnchorName,
  width: number,
) => width * HORIZONTAL_ANCHORS[anchor];

export const getFeedCardStates = (
  frame: number,
  fps: number,
  width: number,
  height: number,
): FeedCardState[] => {
  const timeSec = frame / fps;
  const loopSec = FEED_CONFIG.loopDurationSeconds;
  const speed = getScrollSpeedPxPerSec(width);
  const states: FeedCardState[] = [];

  for (let cycle = -1; cycle <= 1; cycle++) {
    FEED_EVENTS.forEach((event, eventIndex) => {
      const enter = event.enter + cycle * loopSec;
      const age = timeSec - enter;
      // Not yet entered or long gone
      if (age < -0.05) {
        return;
      }

      const card = getCardById(event.assetId);
      const {cardWidth, cardHeight} = getCardSize(
        width,
        card.nativeWidth,
        card.nativeHeight,
      );

      // Top edge starts at canvas bottom (fully below), travels upward.
      const startY = height;
      const y = startY - age * speed;

      if (y > height + 4 || y + cardHeight < -4) {
        return;
      }

      const x = anchorCenterX(event.anchor, width) - cardWidth / 2;

      states.push({
        key: `${event.id}__c${cycle}`,
        assetId: event.assetId,
        src: card.src,
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        // Later sequence index above earlier; cycle bias keeps wrap order stable
        zIndex: eventIndex + (cycle + 1) * FEED_EVENTS.length,
      });
    });
  }

  return states.sort((a, b) => a.zIndex - b.zIndex);
};

/** Debug / report helpers */
export const describeFeedMotion = (width: number) => {
  const cardW = width * (FEED_CONFIG.cardSizePercent / 100);
  const refH = cardW / (16 / 9);
  const stride = refH * (FEED_CONFIG.spacingPercent / 100);
  const speed = getScrollSpeedPxPerSec(width);
  return {
    cardWidth: cardW,
    referenceCardHeight: refH,
    stridePx: stride,
    scrollSpeedPxPerSec: speed,
    aspectMode: "native per asset",
    easing: "constant velocity (shared timebase); editorialEase reserved",
  };
};

