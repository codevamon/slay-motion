import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {BACKGROUND, FEED_CONFIG} from "../config";
import {
  buildScrollStops,
  getLayout,
  getScrollPosition,
  getVisibleDocCards,
} from "../scrollTimeline";
import {FeedCard} from "./FeedCard";

/**
 * Virtual document + approved Lenis-like scroll.
 * Cards: fixed 16:9 document geometry + scroll-triggered fade-up reveal.
 */
export const FeedCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const layout = getLayout();
  const stops = buildScrollStops(layout);
  const scrollY = getScrollPosition(frame, stops);
  const visible = getVisibleDocCards(scrollY, layout, height);

  // Opening: cards already above the reveal-end threshold are fully established.
  const revealEndY = height * FEED_CONFIG.revealEndY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        overflow: "hidden",
      }}
    >
      {visible.map((card) => {
        const screenY = card.y - scrollY;
        const forceRevealed = frame === 0 && screenY <= revealEndY;

        return (
          <FeedCard
            key={card.id}
            card={card}
            screenY={screenY}
            viewportHeight={height}
            forceRevealed={forceRevealed}
          />
        );
      })}
    </AbsoluteFill>
  );
};
