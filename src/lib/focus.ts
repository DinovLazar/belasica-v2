/**
 * Focus-visible rings — brand.md §Color ("focus ring: navy 2px, 2px offset")
 * and the handover §4.4 / §8.
 *
 * Two variants, because the ring must contrast with the surface it sits on:
 *  - `focusOnPaper` — navy ring on the paper/white surfaces (the default).
 *  - `focusOnNavy`  — orange ring on the navy hero band, where a navy ring
 *    would be invisible.
 *
 * NB: the same two strings are also inlined in `src/app/(site)/page.tsx` and
 * `src/components/home/DecadeTimeline.tsx` (they predate this module). Those
 * are homepage files and out of scope for 2.03, so they were left alone rather
 * than refactored — worth folding into this module in a later homepage phase.
 */
export const focusOnPaper =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export const focusOnNavy =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy";
