import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {BACKGROUND, FEED_CONFIG} from "../config";
import {getParallaxOffset, getScrollVelocity} from "../parallax";
import {
  buildScrollStops,
  getLayout,
  getVisibleDocCards,
} from "../scrollTimeline";
import {FeedCard} from "./FeedCard";

/**
 * Virtual document + approved Lenis scroll from 008.
 * Parallax = f(master scroll velocity) only — no secondary animation curve.
 */
export const FeedCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const layout = getLayout();
  const stops = buildScrollStops(layout);
  const {scrollY, velocity} = getScrollVelocity(frame, stops);
  const visible = getVisibleDocCards(scrollY, layout, height);

  const revealEndY = height * FEED_CONFIG.revealEndY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        overflow: "hidden",
      }}
    >
      {visible.map((card) => {
        const baseY = card.y - scrollY;
        const parallaxOffset = getParallaxOffset(card.assetIndex, velocity);
        const screenY = baseY + parallaxOffset;
        const forceRevealed = frame === 0 && baseY <= revealEndY;

        return (
          <FeedCard
            key={card.id}
            card={card}
            screenY={screenY}
            revealY={baseY}
            viewportHeight={height}
            forceRevealed={forceRevealed}
          />
        );
      })}
    </AbsoluteFill>
  );
};
