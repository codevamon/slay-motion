/** Image-driven card + motion comparison diagnostics for 008 vs 007. */
const WIDTH = 1920;
const HEIGHT = 1080;
const NW = 4211;
const NH = 2633;
const CARD_W = WIDTH * 0.52;
const AR = NW / NH;
const cardH008 = CARD_W / AR;
const cardH007 = CARD_W / (16 / 9);
const stepRatio = 0.84;
const step007 = cardH007 * stepRatio;
const step008 = cardH008 * stepRatio;
const period = 20;

console.log(
  JSON.stringify(
    {
      images: Array.from({length: 10}, (_, i) => ({
        file: `slay-${String(i + 1).padStart(2, "0")}.png`,
        width: NW,
        height: NH,
        aspectRatio: +AR.toFixed(4),
      })),
      paddingSource:
        "CSS: fixed 16:9 wrapper + object-fit:contain (not baked into PNG)",
      cardWidth: CARD_W,
      height007_16x9: +cardH007.toFixed(2),
      height008_imageDriven: +cardH008.toFixed(2),
      fitsViewport: cardH008 <= HEIGHT,
      featuredTop008: +((HEIGHT - cardH008) / 2).toFixed(2),
      step007: +step007.toFixed(2),
      step008: +step008.toFixed(2),
      stepDeltaPct: +(((step008 - step007) / step007) * 100).toFixed(2),
      pageHeight007: +(period * step007).toFixed(2),
      pageHeight008: +(period * step008).toFixed(2),
      velocityNote:
        "Same 2.0s gestures + Lenis ease; ~11% longer travel → ~11% higher peak px/frame. Timing/easing unchanged.",
      letterboxing: "none — wrapper AR matches intrinsic AR",
      cropping: "none",
      distortion: "none",
    },
    null,
    2,
  ),
);
