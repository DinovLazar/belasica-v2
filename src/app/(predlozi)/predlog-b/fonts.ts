import { Commissioner, Cormorant_Garamond } from "next/font/google";

/**
 * Направление Б — „Клупски музеј": wall label + object label.
 * Per-variant module — see the note in `../predlog-a/fonts.ts` (D-3.05a-3).
 * Cyrillic coverage verified from each face's own cmap (D-3.05a-2).
 */

/** The reverence. An old-style with fine strokes that only works set large and
 *  given air — which is exactly this direction's rhythm. 400 carries the
 *  monograms, 600 every heading. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-pb-display",
  display: "swap",
});

/** The label furniture. A low-contrast humanist sans by a Cyrillic type
 *  designer, so the delicate serif never has to do caption work. */
export const commissioner = Commissioner({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-pb-text",
  display: "swap",
});
