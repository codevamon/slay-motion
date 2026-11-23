import React from "react";
import {Img, interpolate, staticFile} from "remotion";
import {CARD_IMAGE_FILL, FEED_CONFIG} from "../config";
import type {DocCard} from "../layout";
import {revealEase} from "../motion/easing";

export type RevealState = {
  opacity: number;
  translateY: number;
};

/**
 * Scroll-triggered fade-up reveal based on card top edge vs viewport.
 * Clamps to fully visible after reveal — no fade-out on exit.
 *
 * Thresholds are tuned so the "next" neighbor at a previous settle
 * (top ≈ 0.68·H) stays near opacity 0; reveal runs during its own approach.
 */
export const getRevealState = (
  screenY: number,
  viewportHeight: number,
  forceRevealed: boolean,
): RevealState => {
  if (forceRevealed) {
    return {opacity: 1, translateY: 0};
  }

  const startY = viewportHeight * FEED_CONFIG.revealStartY;
  const endY = viewportHeight * FEED_CONFIG.revealEndY;

  const rawProgress = interpolate(screenY, [endY, startY], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const revealProgress = revealEase(rawProgress);

  return {
    opacity: revealProgress,
    translateY: (1 - revealProgress) * FEED_CONFIG.revealTranslatePx,
  };
};

/**
 * Outer: virtual-scroll document position.
 * Inner: opacity + fade-up reveal (does not affect scroll transform).
 *
 * Images use object-fit:contain — sources are ~1.60 AR inside a 16:9 frame.
 * Cream fill avoids black letterboxing; no stretch, no cover crop.
 */
export const FeedCard: React.FC<{
  card: DocCard;
  screenY: number;
  viewportHeight: number;
  forceRevealed?: boolean;
}> = ({card, screenY, viewportHeight, forceRevealed = false}) => {
  const reveal = getRevealState(screenY, viewportHeight, forceRevealed);

  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: screenY,
        width: card.width,
        height: card.height,
        zIndex: card.zIndex,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: CARD_IMAGE_FILL,
          opacity: reveal.opacity,
          transform: `translate3d(0, ${reveal.translateY}px, 0)`,
        }}
      >
        <Img
          src={staticFile(card.src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};
