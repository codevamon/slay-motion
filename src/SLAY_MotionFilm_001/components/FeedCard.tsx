import React from "react";
import {Img, staticFile} from "remotion";
import type {FeedCardState} from "../motion/feedMotion";

/**
 * Single editorial image card — absolute layer, transform via left/top.
 * No borders, shadows, fades, scale, or rotation.
 */
export const FeedCard: React.FC<{state: FeedCardState}> = ({state}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
        zIndex: state.zIndex,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(state.src)}
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
