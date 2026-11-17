/**
 * Replaceable SLAY card registry.
 * Temporary Hungrybird case-study images — swap `src` only when finals arrive.
 *
 * Paths are under public/ (Remotion staticFile).
 * Native dimensions recorded for aspect-correct layout (no stretch).
 */

export type SlayCard = {
  id: string;
  src: string;
  nativeWidth: number;
  nativeHeight: number;
};

const DIR = "projects/slay/assets/cards";

/**
 * Deterministic mapping: sorted case-study filenames → sequence slots.
 * Slot names describe the prototype sequence; images are approved placeholders.
 */
export const SLAY_CARDS: SlayCard[] = [
  {
    id: "barcelona",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-08-scaled.jpg`,
    nativeWidth: 2400,
    nativeHeight: 1509,
  },
  {
    id: "botanical",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-09-scaled.jpg`,
    nativeWidth: 1856,
    nativeHeight: 2400,
  },
  {
    id: "flower",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-11.1-scaled.jpg`,
    nativeWidth: 1857,
    nativeHeight: 2400,
  },
  {
    id: "north-ave",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-11.2-scaled.jpg`,
    nativeWidth: 1801,
    nativeHeight: 2400,
  },
  {
    id: "maple-street",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-12-scaled.jpg`,
    nativeWidth: 2400,
    nativeHeight: 1429,
  },
  {
    id: "arches",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-13.1.jpg`,
    nativeWidth: 1080,
    nativeHeight: 1396,
  },
  {
    id: "fresh",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-13.2-scaled.jpg`,
    nativeWidth: 1856,
    nativeHeight: 2400,
  },
  {
    id: "nov-2026",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-14-scaled.jpg`,
    nativeWidth: 2400,
    nativeHeight: 1430,
  },
  {
    id: "wildflowers",
    src: `${DIR}/CaseStudies-Hungrybird-Web_HB-Casestudy-16-scaled.jpg`,
    nativeWidth: 2400,
    nativeHeight: 1430,
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
