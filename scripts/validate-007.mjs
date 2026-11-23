/**
 * Featured-card framing + reveal + velocity diagnostics for SLAY-MotionFilm-007.
 */
const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const ASSET_COUNT = 10;
const ZIGZAG = 4;
const VERTICAL_STEP_RATIO = 0.84;
const GESTURE_SEC = 2.0;
const SETTLE_SEC = 0.2;
const FEATURED_TOP_RATIO = 0.24;
const REVEAL_START = 0.8;
const REVEAL_END = 0.68;
const REVEAL_TRANSLATE = 35;
const OLD_REVEAL_START = 0.76;
const OLD_REVEAL_END = 0.52;
const OLD_REVEAL_TRANSLATE = 55;

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const CARD_PERIOD = lcm(ASSET_COUNT, ZIGZAG);

const cardWidth = WIDTH * 0.52;
const cardHeight = cardWidth / (16 / 9);
const verticalStepPx = cardHeight * VERTICAL_STEP_RATIO;
const pageHeight = CARD_PERIOD * verticalStepPx;
const durationFrames = CARD_PERIOD * GESTURE_SEC * FPS;
const featuredTop = HEIGHT * FEATURED_TOP_RATIO;
const padY = WIDTH * 0.06 * 0.35;

const lenisLikeEase = (() => {
  const cx = 3 * 0.22;
  const bx = 3 * (0.2 - 0.22) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 0.7;
  const by = 3 * (1.0 - 0.7) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleX(t) - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - xEst / d));
    }
    return sampleY(t);
  };
})();

const revealEase = (() => {
  const cx = 3 * 0.22;
  const bx = 3 * (0.36 - 0.22) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * 1.0;
  const by = 3 * (1.0 - 1.0) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xEst = sampleX(t) - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - xEst / d));
    }
    return sampleY(t);
  };
})();

const revealAt = (screenY, startR, endR) => {
  const startY = HEIGHT * startR;
  const endY = HEIGHT * endR;
  let raw = 0;
  if (screenY <= endY) raw = 1;
  else if (screenY >= startY) raw = 0;
  else raw = 1 - (screenY - endY) / (startY - endY);
  return revealEase(raw);
};

const settleFrames = Math.round(SETTLE_SEC * FPS);
const stops = [];
for (let i = 0; i <= CARD_PERIOD; i++) {
  const y = padY + i * verticalStepPx;
  stops.push({
    frame: Math.round(i * GESTURE_SEC * FPS),
    scrollY: y - featuredTop,
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
    return a.scrollY + (b.scrollY - a.scrollY) * lenisLikeEase(Math.min(1, Math.max(0, t)));
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

const settles = stops.map((s) => {
  const y = padY + s.globalIndex * verticalStepPx;
  const top = y - s.scrollY;
  const bottom = top + cardHeight;
  const opacity = revealAt(top, REVEAL_START, REVEAL_END);
  return {
    globalIndex: s.globalIndex,
    settleFrame: s.frame,
    top: +top.toFixed(2),
    bottom: +bottom.toFixed(2),
    topRatio: +(top / HEIGHT).toFixed(4),
    fullyVisible: top >= -0.5 && bottom <= HEIGHT + 0.5,
    opacity: +opacity.toFixed(4),
    opacityComplete: opacity >= 0.999,
  };
});

// Next-card opacity at previous settle (the "stuck at bottom" symptom)
const nextAtPrevSettle = [];
for (let i = 0; i < CARD_PERIOD; i++) {
  const scrollY = stops[i].scrollY;
  const nextY = padY + (i + 1) * verticalStepPx;
  const nextTop = nextY - scrollY;
  nextAtPrevSettle.push({
    atFeaturedIndex: i,
    nextTop: +nextTop.toFixed(2),
    opacityOld: +revealAt(nextTop, OLD_REVEAL_START, OLD_REVEAL_END).toFixed(4),
    opacityNew: +revealAt(nextTop, REVEAL_START, REVEAL_END).toFixed(4),
  });
}

const midPeaks = impulsePeaks.slice(1, -1);
const typicalMid = midPeaks.reduce((s, v) => s + v, 0) / midPeaks.length;

console.log(
  JSON.stringify(
    {
      originalReveal: {
        start: OLD_REVEAL_START,
        end: OLD_REVEAL_END,
        span: +(OLD_REVEAL_START - OLD_REVEAL_END).toFixed(2),
        translate: OLD_REVEAL_TRANSLATE,
      },
      newReveal: {
        start: REVEAL_START,
        end: REVEAL_END,
        span: +(REVEAL_START - REVEAL_END).toFixed(2),
        translate: REVEAL_TRANSLATE,
      },
      featuredTopRatio: FEATURED_TOP_RATIO,
      settleSec: SETTLE_SEC,
      settleFrames,
      gestureDistance: verticalStepPx,
      distancesEqual: stops
        .slice(0, -1)
        .every((s, i) => Math.abs(stops[i + 1].scrollY - s.scrollY - verticalStepPx) < 0.01),
      scrollDelta: scroll[durationFrames] - scroll[0],
      pageHeight,
      deltaMatchesPage: Math.abs(scroll[durationFrames] - scroll[0] - pageHeight) < 0.5,
      typicalMidPeak: +typicalMid.toFixed(3),
      finalImpulsePeak: +impulsePeaks[impulsePeaks.length - 1].toFixed(3),
      finalWithin15pct: Math.abs(impulsePeaks.at(-1) - typicalMid) / typicalMid <= 0.15,
      allFeaturedFullyVisible: settles.every((s) => s.fullyVisible),
      allFeaturedOpaque: settles.every((s) => s.opacityComplete),
      sampleSettles: settles.slice(0, 3),
      nextCardAtSettleSample: nextAtPrevSettle.slice(0, 3),
    },
    null,
    2,
  ),
);
