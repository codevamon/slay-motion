import React from "react";
import {Composition} from "remotion";
import {MyComposition} from "./Composition";
import {
  SLAY_MotionFilm_001,
  COMPOSITION_ID as SLAY_001_ID,
  WIDTH as SLAY_001_WIDTH,
  HEIGHT as SLAY_001_HEIGHT,
  FPS as SLAY_001_FPS,
  DURATION_IN_FRAMES as SLAY_001_DURATION,
} from "./SLAY_MotionFilm_001";
import {
  SLAY_MotionFilm_002,
  COMPOSITION_ID as SLAY_002_ID,
  WIDTH as SLAY_002_WIDTH,
  HEIGHT as SLAY_002_HEIGHT,
  FPS as SLAY_002_FPS,
  DURATION_IN_FRAMES as SLAY_002_DURATION,
} from "./SLAY_MotionFilm_002";
import {
  SLAY_MotionFilm_003,
  COMPOSITION_ID as SLAY_003_ID,
  WIDTH as SLAY_003_WIDTH,
  HEIGHT as SLAY_003_HEIGHT,
  FPS as SLAY_003_FPS,
  DURATION_IN_FRAMES as SLAY_003_DURATION,
} from "./SLAY_MotionFilm_003";
import {
  SLAY_MotionFilm_004,
  COMPOSITION_ID as SLAY_004_ID,
  WIDTH as SLAY_004_WIDTH,
  HEIGHT as SLAY_004_HEIGHT,
  FPS as SLAY_004_FPS,
  DURATION_IN_FRAMES as SLAY_004_DURATION,
} from "./SLAY_MotionFilm_004";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />

      <Composition
        id={SLAY_001_ID}
        component={SLAY_MotionFilm_001}
        durationInFrames={SLAY_001_DURATION}
        fps={SLAY_001_FPS}
        width={SLAY_001_WIDTH}
        height={SLAY_001_HEIGHT}
      />

      <Composition
        id={SLAY_002_ID}
        component={SLAY_MotionFilm_002}
        durationInFrames={SLAY_002_DURATION}
        fps={SLAY_002_FPS}
        width={SLAY_002_WIDTH}
        height={SLAY_002_HEIGHT}
      />

      <Composition
        id={SLAY_003_ID}
        component={SLAY_MotionFilm_003}
        durationInFrames={SLAY_003_DURATION}
        fps={SLAY_003_FPS}
        width={SLAY_003_WIDTH}
        height={SLAY_003_HEIGHT}
      />

      <Composition
        id={SLAY_004_ID}
        component={SLAY_MotionFilm_004}
        durationInFrames={SLAY_004_DURATION}
        fps={SLAY_004_FPS}
        width={SLAY_004_WIDTH}
        height={SLAY_004_HEIGHT}
      />
    </>
  );
};
