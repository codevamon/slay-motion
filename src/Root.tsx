import React from "react";
import {Composition} from "remotion";
import {MyComposition} from "./Composition";
import {
  SLAY_MotionFilm_001,
  COMPOSITION_ID,
  WIDTH,
  HEIGHT,
  FPS,
  DURATION_IN_FRAMES,
} from "./SLAY_MotionFilm_001";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />

      <Composition
        id={COMPOSITION_ID}
        component={SLAY_MotionFilm_001}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
