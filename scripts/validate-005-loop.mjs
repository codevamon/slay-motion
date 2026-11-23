/**
 * Loop / asset diagnostics for SLAY-MotionFilm-005.
 * Run: node scripts/validate-005-loop.mjs
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const finalDir = path.join(root, "public/projects/slay/assets/final-cards");

const expected = Array.from({length: 10}, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return `slay-${n}.png`;
});

const missing = expected.filter((f) => !fs.existsSync(path.join(finalDir, f)));
if (missing.length) {
  console.error("MISSING FINAL ASSETS:", missing);
  process.exit(1);
}

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const assetCount = 10;
const zigZag = 4;
const cardPeriod = lcm(assetCount, zigZag);

const phases = ["left", "center", "right", "center"];
const phaseAt = (i) => phases[((i % 4) + 4) % 4];
const assetAt = (i) => expected[((i % assetCount) + assetCount) % assetCount];

const open = {i: 0, asset: assetAt(0), phase: phaseAt(0)};
const wrongTwin = {i: 10, asset: assetAt(10), phase: phaseAt(10)};
const periodTwin = {i: 20, asset: assetAt(20), phase: phaseAt(20)};

const cardWidth = 1920 * 0.52;
const cardHeight = cardWidth / (16 / 9);
const verticalStepPx = cardHeight * 1.12;
const pad = 1920 * 0.06;
const pageHeight = pad * 0.35 + cardPeriod * verticalStepPx + pad;

console.log(
  JSON.stringify(
    {
      assetsOnDisk: expected,
      missing,
      assetCount,
      cardPeriod,
      open,
      wrongTwin_assetRestartOnly: wrongTwin,
      periodTwin_correct: periodTwin,
      wrongTwinWouldJump: wrongTwin.phase !== open.phase,
      periodTwinMatches:
        periodTwin.asset === open.asset && periodTwin.phase === open.phase,
      pageHeight,
      verticalStepPx,
      note: "005 loop targets period twin (index 20), not asset-restart (index 10).",
    },
    null,
    2,
  ),
);
