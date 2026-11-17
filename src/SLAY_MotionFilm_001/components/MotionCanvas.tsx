import React from "react";
import {AbsoluteFill} from "remotion";
import {BACKGROUND, CANVAS_RADIUS} from "../config";
import {CardSequence} from "./CardSequence";

/**
 * Pink editorial canvas — stable background (verified #f6c5d9).
 * Rounded corners belong to the design surface (verified in reference).
 * No shadows / grain / glow (shadow unchecked in source).
 */
export const MotionCanvas: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND,
        borderRadius: CANVAS_RADIUS,
        overflow: "hidden",
      }}
    >
      <CardSequence />
    </AbsoluteFill>
  );
};
