import type {AnchorName} from "./config";

/**
 * Phase 01.1 creative-direction enter schedule (seconds in 18s loop).
 *
 * `barcelona-repeat` is documented for creative checkpoints but rendered via
 * loop wrapping of `barcelona` (enter + 18) so t=0 and t=18 match without
 * stacking two copies of the same card at the seam.
 */
export type FeedEvent = {
  id: string;
  assetId: string;
  enter: number;
  anchor: AnchorName;
};

/** Nine unique cards — order is the Feed Scroll sequence. */
export const FEED_EVENTS: FeedEvent[] = [
  // enter -2.8 → wrap at 15.2s (Phase 01.1 barcelona-repeat checkpoint)
  {id: "barcelona", assetId: "barcelona", enter: -2.8, anchor: "left"},
  // Slightly early so t=0 already shows the feed establishing (Barcelona + next)
  {id: "botanical", assetId: "botanical", enter: -0.2, anchor: "center"},
  {id: "flower", assetId: "flower", enter: 1.8, anchor: "right"},
  {id: "north-ave", assetId: "north-ave", enter: 3.0, anchor: "center"},
  {id: "maple-street", assetId: "maple-street", enter: 4.3, anchor: "left"},
  {id: "arches", assetId: "arches", enter: 5.8, anchor: "center"},
  {id: "fresh", assetId: "fresh", enter: 7.5, anchor: "left"},
  {id: "nov-2026", assetId: "nov-2026", enter: 9.2, anchor: "center"},
  {id: "wildflowers", assetId: "wildflowers", enter: 11.2, anchor: "right"},
];

/**
 * barcelona-repeat @ 15.2s = barcelona.enter + 18 (cycle wrap).
 */
export const BARCELONA_REPEAT_EFFECTIVE_ENTER = 15.2;
