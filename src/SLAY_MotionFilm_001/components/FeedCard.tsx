import React from "react";
import {Img, staticFile} from "remotion";
import type {DocCard} from "../layout";

/**
 * Document-space card projected to screen via shared scroll.
 * No per-card opacity/scale/rotation/X animation.
 */
export const FeedCard: React.FC<{
  card: DocCard;
  screenY: number;
}> = ({card, screenY}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: card.x,
        top: screenY,
        width: card.width,
        height: card.height,
        zIndex: card.zIndex,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(card.src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "fill",
          display: "block",
        }}
      />
    </div>
  );
};
