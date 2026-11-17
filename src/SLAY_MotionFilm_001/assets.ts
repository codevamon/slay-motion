/**
 * Centralized SLAY asset registry.
 *
 * STATUS: Original slot images were NOT present in
 * public/projects/slay/assets/ at project start.
 *
 * Provisional photos were cropped from the reference canvas recording
 * (see public/projects/slay/assets/PROVENANCE.txt).
 * Composed cards rebuild editorial layouts in React using those photos.
 *
 * Replace photo paths with authentic SLAY exports when available.
 */

export type CardKind =
  | "barcelona"
  | "flower-pale"
  | "numbers"
  | "portrait-flower"
  | "north-ave"
  | "maple-street"
  | "circles-74k"
  | "meadow"
  | "fresh"
  | "nov-2026"
  | "orange-bloom"
  | "meadow-soft";

export type CardAsset = {
  id: CardKind;
  label: string;
  /** staticFile path under public/ */
  photo?: string;
  /** Design recipe rendered by EditorialCard */
  recipe:
    | "barcelona"
    | "flower-pale"
    | "numbers"
    | "portrait-flower"
    | "north-ave"
    | "maple-street"
    | "circles-74k"
    | "meadow"
    | "fresh"
    | "nov-2026"
    | "orange-bloom"
    | "meadow-soft";
};

const P = "projects/slay/assets/photos";

/**
 * Slot order reconstructed from reference chronology (bottom-up feed).
 * Verified identities from canvas frames; order inferred from flick sequence.
 */
export const CARD_SLOTS: CardAsset[] = [
  {
    id: "barcelona",
    label: "BARCELONA",
    recipe: "barcelona",
  },
  {
    id: "flower-pale",
    label: "Pale flower",
    photo: `${P}/flower-pale.png`,
    recipe: "flower-pale",
  },
  {
    id: "numbers",
    label: "0034 / 0095",
    recipe: "numbers",
  },
  {
    id: "portrait-flower",
    label: "Portrait + emblem",
    photo: `${P}/portrait.png`,
    recipe: "portrait-flower",
  },
  {
    id: "north-ave",
    label: "north ave",
    photo: `${P}/meadow-wide.png`,
    recipe: "north-ave",
  },
  {
    id: "maple-street",
    label: "Maple Street",
    photo: `${P}/orange-flower.png`,
    recipe: "maple-street",
  },
  {
    id: "circles-74k",
    label: "74K circles",
    photo: `${P}/circles-graphic.png`,
    recipe: "circles-74k",
  },
  {
    id: "meadow",
    label: "Meadow soft",
    photo: `${P}/meadow-soft.png`,
    recipe: "meadow",
  },
  {
    id: "fresh",
    label: "FRESH",
    recipe: "fresh",
  },
  {
    id: "nov-2026",
    label: "2026 NOV",
    photo: `${P}/meadow-nov.png`,
    recipe: "nov-2026",
  },
  {
    id: "orange-bloom",
    label: "Orange bloom",
    photo: `${P}/orange-flower.png`,
    recipe: "orange-bloom",
  },
  {
    id: "meadow-soft",
    label: "Meadow reprise",
    photo: `${P}/meadow-soft.png`,
    recipe: "meadow-soft",
  },
];

export const SLOT_IDS = CARD_SLOTS.map((c) => c.id);

export const MISSING_ORIGINAL_ASSETS = [
  "Original animos Media Slot 1–12 image uploads (authentic SLAY designs)",
  "Any master PSD/Figma card exports used to build the showcase",
  "Brand fonts if custom (currently system / CSS fallbacks approximating reference)",
] as const;
