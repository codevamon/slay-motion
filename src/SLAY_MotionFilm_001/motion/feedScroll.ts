import {interpolate} from "remotion";
import {DURATION_IN_FRAMES, FEED, HEIGHT, WIDTH} from "../config";
import {editorialEnter, smoothFlick} from "./easing";
import {
  getCardGeometry,
  laneX,
  restY,
  type CardGeometry,
} from "./transforms";

export type CardMotionState = {
  id: string;
  slotIndex: number;
  x: number;
  y: number;
  opacity: number;
  zIndex: number;
  width: number;
  height: number;
};

/**
 * Feed Scroll (Flicks) — reconstructed from animos / Shotreel behaviour:
 * Cards enter from the bottom and flick upward in offset lanes.
 * Each new card covers the one above. Seamless loop over slotCount.
 *
 * Timing model (inferred from settings + observed rhythm):
 * - 12 slots → 12 flick steps across 18s (~1.5s / flick)
 * - flickLength = portion of each step spent moving (rest is a brief hold)
 * - stagger currently 0% (verified in most reference frames)
 */
export const getFlickScrollOffset = (
  frame: number,
  geo: CardGeometry,
  duration: number = DURATION_IN_FRAMES,
  slotCount: number = FEED.slotCount,
) => {
  const steps = slotCount;
  const phase = (frame / duration) * steps;
  const stepIndex = Math.floor(phase);
  const stepT = phase - stepIndex;

  const movePortion = FEED.flickLength;
  let easedStep = 0;
  if (stepT <= movePortion) {
    easedStep = smoothFlick(stepT / movePortion);
  } else {
    easedStep = 1;
  }

  return (stepIndex + easedStep) * geo.stride;
};

export const getVisibleCards = (
  frame: number,
  slotIds: string[],
  width = WIDTH,
  height = HEIGHT,
): CardMotionState[] => {
  const geo = getCardGeometry(width, height);
  const slotCount = slotIds.length;
  const loopLength = slotCount * geo.stride;
  const scroll = getFlickScrollOffset(frame, geo, DURATION_IN_FRAMES, slotCount);
  const scrollMod = ((scroll % loopLength) + loopLength) % loopLength;

  // Anchor so early cards sit in-frame at t≈0 (matches BARCELONA near top).
  const viewAnchor = geo.padY + geo.cardH * 0.15;

  const states: CardMotionState[] = [];

  for (let cycle = -1; cycle <= 1; cycle++) {
    for (let i = 0; i < slotCount; i++) {
      const y =
        restY(i, geo) - scrollMod + viewAnchor + cycle * loopLength;
      const x = laneX(i, geo, width);

      if (y > height + geo.cardH || y + geo.cardH < -geo.cardH) {
        continue;
      }

      // Fade in as the card rises from below the bottom edge into view.
      const fadeStart = height - geo.padY;
      const fadeEnd = height - geo.padY - geo.cardH * FEED.fadeIn;
      const enterProgress = interpolate(
        y,
        [fadeEnd, fadeStart],
        [1, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      );
      const opacity =
        FEED.enterBy === "fade"
          ? editorialEnter(enterProgress)
          : 1;

      // Each newer feed card covers the one above (verified Feed Scroll behaviour).
      const zIndex = i + (cycle + 1) * slotCount;

      states.push({
        id: `${slotIds[i]}__c${cycle}`,
        slotIndex: i,
        x,
        y,
        opacity,
        zIndex,
        width: geo.cardW,
        height: geo.cardH,
      });
    }
  }

  return states.sort((a, b) => a.zIndex - b.zIndex);
};
