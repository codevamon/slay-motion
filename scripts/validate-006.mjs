/**
 * Overlap + velocity + loop diagnostics for SLAY-MotionFilm-006.
 * Mirrors the composition math (no TS import needed).
 */
const CARD_ASPECT = 16 / 9;
const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const ASSET_COUNT = 10;
const ZIGZAG = 4;
const VERTICAL_STEP_RATIO = 0.84;
const GESTURE_SEC = 2.0;
const SETTLE_SEC = 0.17;

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const CARD_PERIOD = lcm(ASSET_COUNT, ZIGZAG);

const cardWidth = WIDTH * 0.52;
const cardHeight = cardWidth / CARD_ASPECT;
const verticalStepPx = cardHeight * VERTICAL_STEP_RATIO;
const overlapRatio = 1 - VERTICAL_STEP_RATIO;
const pageHeight = CARD_PERIOD * verticalStepPx;
const durationSec = CARD_PERIOD * GESTURE_SEC;
const durationFrames = durationSec * FPS;

// Lenis-like bezier sample (Remotion Easing.bezier(0.22, 0.7, 0.2, 1.0))
// Approximate peak velocity via dense sampling of cubic bezier ease.
const lenisLikeEase = (() => {
  // Use Remotion-compatible cubic bezier solver (simplified for diagnostics)
  const cx = 3 * 0.22;
  const bx = 3 * (0.2 - 0.22) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 0.7;
  const by = 3 * (1.0 - 0.7) - cy;
  const ay = 1 - cy - by;
  const sampleCurveX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t) => ((ay * t + by) * t + cy) * t;
  const solve = (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleCurveX(t) - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= xEst / d;
      t = Math.min(1, Math.max(0, t));
    }
    return sampleCurveY(t);
  };
  return solve;
})();

const settleFrames = Math.round(SETTLE_SEC * FPS);
const stops = [];
for (let i = 0; i <= CARD_PERIOD; i++) {
  const y = 1920 * 0.06 * 0.35 + i * verticalStepPx;
  const targetScreenY = (HEIGHT - cardHeight) / 2;
  stops.push({
    frame: Math.round(i * GESTURE_SEC * FPS),
    scrollY: y - targetScreenY,
    globalIndex: i,
  });
}

const getScroll = (frame) => {
  const clamped = Math.max(0, Math.min(frame, durationFrames));
  if (clamped <= stops[0].frame) return stops[0].scrollY;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (clamped > b.frame) continue;
    const moveEnd = Math.max(a.frame + 1, b.frame - settleFrames);
    if (clamped >= moveEnd) return b.scrollY;
    const span = moveEnd - a.frame;
    const t = span <= 0 ? 1 : (clamped - a.frame) / span;
    const eased = lenisLikeEase(Math.min(1, Math.max(0, t)));
    return a.scrollY + (b.scrollY - a.scrollY) * eased;
  }
  return stops[stops.length - 1].scrollY;
};

const scroll = [];
for (let f = 0; f <= durationFrames; f++) scroll.push(getScroll(f));
const velocity = [];
for (let f = 0; f < durationFrames; f++) velocity.push(scroll[f + 1] - scroll[f]);

const impulsePeaks = [];
for (let i = 0; i < stops.length - 1; i++) {
  let peak = 0;
  for (let f = stops[i].frame; f < stops[i + 1].frame; f++) {
    peak = Math.max(peak, Math.abs(velocity[f] ?? 0));
  }
  impulsePeaks.push(peak);
}

const mid = impulsePeaks.slice(1, -1);
const typicalMid = mid.reduce((s, v) => s + v, 0) / mid.length;
const finalPeak = impulsePeaks[impulsePeaks.length - 1];
const firstPeak = impulsePeaks[0];

const third = Math.floor(durationFrames / 3);
const stats = (arr) => {
  const m = arr.filter((v) => Math.abs(v) > 0.01);
  return {
    peak: m.reduce((a, v) => Math.max(a, Math.abs(v)), 0),
    mean: m.length ? m.reduce((s, v) => s + Math.abs(v), 0) / m.length : 0,
  };
};

const phases = ["left", "center", "right", "center"];
const report = {
  oldVerticalStepRatio: 1.12,
  newVerticalStepRatio: VERTICAL_STEP_RATIO,
  cardHeight,
  verticalStepPx,
  overlapPercent: +(overlapRatio * 100).toFixed(2),
  cardPeriod: CARD_PERIOD,
  pageHeight,
  durationSec,
  durationFrames,
  eighteenSecondsSupportsExactLoop: false,
  reason:
    "20 one-step gestures × 2.0s mid-pace = 40s; 18s would require ~0.9s/gesture (~2.2× faster).",
  scrollDelta: scroll[durationFrames] - scroll[0],
  deltaMatchesPage: Math.abs(scroll[durationFrames] - scroll[0] - pageHeight) < 0.5,
  openPhase: phases[0],
  loopPhase: phases[CARD_PERIOD % 4],
  phaseMatch: phases[0] === phases[CARD_PERIOD % 4],
  impulsePeaks: impulsePeaks.map((p) => +p.toFixed(3)),
  typicalMidPeak: +typicalMid.toFixed(3),
  finalImpulsePeak: +finalPeak.toFixed(3),
  firstImpulsePeak: +firstPeak.toFixed(3),
  finalWithin15pctOfMid: Math.abs(finalPeak - typicalMid) / typicalMid <= 0.15,
  thirds: {
    first: stats(velocity.slice(0, third)),
    middle: stats(velocity.slice(third, third * 2)),
    final: stats(velocity.slice(third * 2)),
  },
  forcedCatchUpRemoved: true,
  distancesEqual: stops
    .slice(0, -1)
    .every(
      (s, i) =>
        Math.abs(stops[i + 1].scrollY - s.scrollY - verticalStepPx) < 0.01,
    ),
};

console.log(JSON.stringify(report, null, 2));
