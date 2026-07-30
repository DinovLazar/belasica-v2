import { Golos_Text, Oswald } from "next/font/google";

/**
 * Направление В — „Трибина": condensed gothic + contemporary grotesque.
 * Per-variant module — see the note in `../predlog-a/fonts.ts` (D-3.05a-3).
 * Cyrillic coverage verified from each face's own cmap (D-3.05a-2).
 */

/** The terrace/matchday condensed caps, and one of the very few heavy
 *  condensed faces with a real Cyrillic — Anton, Bebas Neue and Archivo Narrow
 *  all failed that check. Only 600 and 700 are set anywhere on the page. */
export const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-pc-display",
  display: "swap",
});

/** Body and labels. A modern Cyrillic-first grotesque, so the copy has a
 *  contemporary voice instead of a system-font one. 400 body, 700 labels. */
export const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-pc-text",
  display: "swap",
});
