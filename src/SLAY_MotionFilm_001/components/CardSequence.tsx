import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CARD_SLOTS, SLOT_IDS} from "../assets";
import {getVisibleCards} from "../motion/feedScroll";
import {EditorialCard} from "./EditorialCard";

export const CardSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cards = getVisibleCards(frame, SLOT_IDS, width, height);

  return (
    <>
      {cards.map((state) => {
        const asset = CARD_SLOTS[state.slotIndex];
        return (
          <div
            key={state.id}
            style={{
              position: "absolute",
              left: state.x,
              top: state.y,
              width: state.width,
              height: state.height,
              opacity: state.opacity,
              zIndex: state.zIndex,
              willChange: "transform, opacity",
            }}
          >
            <EditorialCard
              asset={asset}
              width={state.width}
              height={state.height}
            />
          </div>
        );
      })}
    </>
  );
};
