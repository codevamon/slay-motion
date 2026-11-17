import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {BACKGROUND} from "../config";
import {getFeedCardStates} from "../motion/feedMotion";
import {FeedCard} from "./FeedCard";

/**
 * Fixed pink canvas. Square corners (cornerRadiusPercent: 0).
 * Cards clipped to canvas; background never moves.
 */
export const FeedCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const cards = getFeedCardStates(frame, fps, width, height);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        overflow: "hidden",
      }}
    >
      {cards.map((state) => (
        <FeedCard key={state.key} state={state} />
      ))}
    </AbsoluteFill>
  );
};
