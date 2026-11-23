/** Validate centered settles + delayed neighbor reveal for refined 007. */
const HEIGHT = 1080;
const WIDTH = 1920;
const cardWidth = WIDTH * 0.52;
const cardHeight = cardWidth / (16 / 9);
const step = cardHeight * 0.84;
const featuredTop = (HEIGHT - cardHeight) / 2;
const padY = WIDTH * 0.06 * 0.35;
const revealStart = 0.64;
const revealEnd = 0.52;

const revealEase = (x) => {
  // bezier(0.22,1,0.36,1) approximate via cubic solve
  const cx = 3 * 0.22,
    bx = 3 * (0.36 - 0.22) - cx,
    ax = 1 - cx - bx;
  const cy = 3 * 1,
    by = 3 * (1 - 1) - cy,
    ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  let t = x;
  for (let i = 0; i < 8; i++) {
    const d = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(d) < 1e-6) break;
    t = Math.min(1, Math.max(0, t - (sx(t) - x) / d));
  }
  return sy(t);
};

const opacityAt = (screenY) => {
  const startY = HEIGHT * revealStart;
  const endY = HEIGHT * revealEnd;
  let raw = 0;
  if (screenY <= endY) raw = 1;
  else if (screenY >= startY) raw = 0;
  else raw = 1 - (screenY - endY) / (startY - endY);
  return revealEase(raw);
};

const settles = [];
for (let i = 0; i <= 20; i++) {
  const y = padY + i * step;
  const scrollY = y - featuredTop;
  const top = y - scrollY;
  const bottom = top + cardHeight;
  const nextTop = padY + (i + 1) * step - scrollY;
  settles.push({
    i,
    top: +top.toFixed(2),
    bottom: +bottom.toFixed(2),
    centerErr: +Math.abs(top - featuredTop).toFixed(4),
    fullyVisible: top >= 0 && bottom <= HEIGHT,
    featuredOpacity: +opacityAt(top).toFixed(4),
    nextOpacity: i < 20 ? +opacityAt(nextTop).toFixed(4) : null,
    nextTop: i < 20 ? +nextTop.toFixed(2) : null,
  });
}

console.log(
  JSON.stringify(
    {
      sourceAR: 4211 / 2633,
      frameAR: 16 / 9,
      coverWouldCrop: true,
      fit: "contain",
      fill: "#FBF6F0",
      featuredTop,
      reveal: {start: revealStart, end: revealEnd},
      allCentered: settles.every((s) => s.centerErr <= 10),
      allFullyVisible: settles.every((s) => s.fullyVisible),
      allFeaturedOpaque: settles.every((s) => s.featuredOpacity >= 0.999),
      allNeighborsSubdued: settles
        .filter((s) => s.nextOpacity !== null)
        .every((s) => s.nextOpacity < 0.35),
      sample: settles.slice(0, 3),
    },
    null,
    2,
  ),
);
