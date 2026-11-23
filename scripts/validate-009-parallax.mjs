/**
 * Validate velocity-driven parallax: 0 on holds, tracks scroll velocity.
 */
const FPS = 30;
const DURATION = 1200;
const SETTLE_SEC = 0.2;
const GESTURE_SEC = 2.0;
const PERIOD = 20;
const strength = 0.28;
const maxOffset = 12;
const depths = [-0.32, 0.22, -0.18, 0.28, -0.24, 0.2, -0.3, 0.25, -0.16, 0.27];

const settleFrames = Math.round(SETTLE_SEC * FPS);
const stops = [];
for (let i = 0; i <= PERIOD; i++) {
  stops.push({frame: Math.round(i * GESTURE_SEC * FPS), scrollY: i * 524.38});
}

const lenis = (() => {
  const cx = 3 * 0.22,
    bx = 3 * (0.2 - 0.22) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * 0.7,
    by = 3 * (1 - 0.7) - cy,
    ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - (sx(t) - x) / d));
    }
    return sy(t);
  };
})();

const scrollAt = (frame) => {
  const clamped = Math.max(0, Math.min(frame, DURATION));
  if (clamped <= stops[0].frame) return stops[0].scrollY;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (clamped > b.frame) continue;
    const moveEnd = Math.max(a.frame + 1, b.frame - settleFrames);
    if (clamped >= moveEnd) return b.scrollY;
    const span = moveEnd - a.frame;
    const t = span <= 0 ? 1 : (clamped - a.frame) / span;
    const eased = lenis(Math.min(1, Math.max(0, t)));
    return a.scrollY + (b.scrollY - a.scrollY) * eased;
  }
  return stops[stops.length - 1].scrollY;
};

const velAt = (frame) => {
  const y = scrollAt(frame);
  const prev = frame <= 0 ? y : scrollAt(frame - 1);
  return y - prev;
};

const offsetAt = (frame, assetIndex) => {
  const v = velAt(frame);
  if (v === 0) return 0;
  const raw = v * depths[assetIndex] * strength;
  return Math.max(-maxOffset, Math.min(maxOffset, raw));
};

const holdFrames = [0, 60, 120, 180, 1140, 1199];
const holdZero = holdFrames.every((f) =>
  depths.every((_, i) => Math.abs(offsetAt(f, i)) < 1e-9),
);

// Sample velocity curve through first impulse
const samples = [];
for (let f = 0; f <= 60; f += 3) {
  samples.push({
    frame: f,
    velocity: +velAt(f).toFixed(3),
    offset0: +offsetAt(f, 0).toFixed(3),
  });
}

const mid = 27;
const midOffsets = depths.map((d, i) => +offsetAt(mid, i).toFixed(3));

console.log(
  JSON.stringify(
    {
      diagnosis:
        "Prior sin(π·progress) was a second curve; replaced with scrollVelocity×depth×strength",
      holdOffsetsZero: holdZero,
      holdSample: holdFrames.map((f) => ({
        frame: f,
        velocity: +velAt(f).toFixed(4),
        offset0: offsetAt(f, 0),
      })),
      midImpulse: {
        frame: mid,
        velocity: +velAt(mid).toFixed(3),
        offsets: midOffsets,
        maxAbs: Math.max(...midOffsets.map(Math.abs)),
      },
      firstImpulseVelocityTrack: samples,
      strength,
      maxOffset,
    },
    null,
    2,
  ),
);
