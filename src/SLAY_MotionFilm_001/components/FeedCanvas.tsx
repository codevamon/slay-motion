import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {BACKGROUND} from "../config";
import {
  buildScrollStops,
  getLayout,
  getScrollPosition,
  getVisibleDocCards,
} from "../scrollTimeline";
import {FeedCard} from "./FeedCard";

/**
 * Fixed pink canvas + virtual camera through the editorial document.
 * All motion comes from shared scrollY — cards stay fixed in document space.
 */
export const FeedCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const layout = getLayout();
  const stops = buildScrollStops(layout);
  const scrollY = getScrollPosition(frame, stops);
  const visible = getVisibleDocCards(scrollY, layout, height);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        overflow: "hidden",
      }}
    >
      {visible.map((card) => (
        <FeedCard
          key={card.id}
          card={card}
          screenY={card.y - scrollY}
        />
      ))}
    </AbsoluteFill>
  );
};
