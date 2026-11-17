import React from "react";
import {MotionCanvas} from "./components/MotionCanvas";

export const SLAY_MotionFilm_001: React.FC = () => {
  return <MotionCanvas />;
};

export {
  COMPOSITION_ID,
  WIDTH,
  HEIGHT,
  FPS,
  DURATION_IN_FRAMES,
  BACKGROUND,
  FEED,
} from "./config";
