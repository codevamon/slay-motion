import React from "react";
import {Img, interpolate, staticFile} from "remotion";
import {FEED_CONFIG} from "../config";
import type {DocCard} from "../layout";
import {revealEase} from "../motion/easing";

export type RevealState = {
  opacity: number;
  translateY: number;
};

/**
 * Scroll-triggered fade-up — thresholds identical to approved 007.
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
 * Outer: virtual-scroll document position (image-driven width×height).
 * Inner: opacity + fade-up only.
 *
 * Wrapper matches intrinsic image AR at approved card width →
 * no letterboxing, no cover crop, no cream fill, transparent container.
 */
export const FeedCard: React.FC<{
  card: DocCard;
  screenY: number;
  viewportHeight: number;
  forceRevealed?: boolean;
  /** Reveal uses master-scroll Y (not parallax) so holds match 008. */
  revealY?: number;
}> = ({
  card,
  screenY,
  viewportHeight,
  forceRevealed = false,
  revealY,
}) => {
  const reveal = getRevealState(
    revealY ?? screenY,
    viewportHeight,
    forceRevealed,
  );

  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: screenY,
        width: card.width,
        height: card.height,
        zIndex: card.zIndex,
        background: "transparent",
        padding: 0,
        margin: 0,
        border: "none",
        overflow: "visible",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          opacity: reveal.opacity,
          transform: `translate3d(0, ${reveal.translateY}px, 0)`,
        }}
      >
        <Img
          src={staticFile(card.src)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            // Wrapper AR matches intrinsic AR → contain fills exactly (no bars, no crop).
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </div>
    </div>
  );
};
