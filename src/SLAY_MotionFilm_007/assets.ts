/**
 * SLAY-MotionFilm-005 — final card registry.
 * Uses only final assets under public/projects/slay/assets/final-cards/.
 * Numeric filename order is the approved sequence.
 */

export type SlayCard = {
  id: string;
  src: string;
  nativeWidth: number;
  nativeHeight: number;
};

const DIR = "projects/slay/assets/final-cards";

/** All final images are 4211×2633 (≈16:9) — cover inside fixed 16:9 cards. */
const NATIVE_WIDTH = 4211;
const NATIVE_HEIGHT = 2633;

/**
 * Exact order: slay-01 … slay-10.
 * Do not reorder without an explicit approved manifest.
 */
export const SLAY_CARDS: SlayCard[] = [
  {
    id: "slay-01",
    src: `${DIR}/slay-01.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-02",
    src: `${DIR}/slay-02.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-03",
    src: `${DIR}/slay-03.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-04",
    src: `${DIR}/slay-04.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-05",
    src: `${DIR}/slay-05.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-06",
    src: `${DIR}/slay-06.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-07",
    src: `${DIR}/slay-07.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-08",
    src: `${DIR}/slay-08.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-09",
    src: `${DIR}/slay-09.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
  {
    id: "slay-10",
    src: `${DIR}/slay-10.png`,
    nativeWidth: NATIVE_WIDTH,
    nativeHeight: NATIVE_HEIGHT,
  },
];

export const getCardById = (id: string): SlayCard => {
  const card = SLAY_CARDS.find((c) => c.id === id);
  if (!card) {
    throw new Error(`Unknown SLAY card id: ${id}`);
  }
  return card;
};

/** Aspect ratio width/height for layout. */
export const cardAspect = (card: SlayCard) =>
  card.nativeWidth / card.nativeHeight;
