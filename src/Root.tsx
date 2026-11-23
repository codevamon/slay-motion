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
import {
  SLAY_MotionFilm_005,
  COMPOSITION_ID as SLAY_005_ID,
  WIDTH as SLAY_005_WIDTH,
  HEIGHT as SLAY_005_HEIGHT,
  FPS as SLAY_005_FPS,
  DURATION_IN_FRAMES as SLAY_005_DURATION,
} from "./SLAY_MotionFilm_005";
import {
  SLAY_MotionFilm_006,
  COMPOSITION_ID as SLAY_006_ID,
  WIDTH as SLAY_006_WIDTH,
  HEIGHT as SLAY_006_HEIGHT,
  FPS as SLAY_006_FPS,
  DURATION_IN_FRAMES as SLAY_006_DURATION,
} from "./SLAY_MotionFilm_006";
import {
  SLAY_MotionFilm_007,
  COMPOSITION_ID as SLAY_007_ID,
  WIDTH as SLAY_007_WIDTH,
  HEIGHT as SLAY_007_HEIGHT,
  FPS as SLAY_007_FPS,
  DURATION_IN_FRAMES as SLAY_007_DURATION,
} from "./SLAY_MotionFilm_007";

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

      <Composition
        id={SLAY_005_ID}
        component={SLAY_MotionFilm_005}
        durationInFrames={SLAY_005_DURATION}
        fps={SLAY_005_FPS}
        width={SLAY_005_WIDTH}
        height={SLAY_005_HEIGHT}
      />

      <Composition
        id={SLAY_006_ID}
        component={SLAY_MotionFilm_006}
        durationInFrames={SLAY_006_DURATION}
        fps={SLAY_006_FPS}
        width={SLAY_006_WIDTH}
        height={SLAY_006_HEIGHT}
      />

      <Composition
        id={SLAY_007_ID}
        component={SLAY_MotionFilm_007}
        durationInFrames={SLAY_007_DURATION}
        fps={SLAY_007_FPS}
        width={SLAY_007_WIDTH}
        height={SLAY_007_HEIGHT}
      />
    </>
  );
};
