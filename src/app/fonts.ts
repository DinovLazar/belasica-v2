import { Golos_Text, Oswald } from "next/font/google";

/**
 * brand.md §Typography (Phase 3.05 „Трибина" amendment).
 *
 * Cyrillic coverage was verified per face by parsing the `cmap` out of each
 * shipped woff2 rather than trusting Google's `cyrillic` subset declaration —
 * the subset only says which file the browser should fetch, not which glyphs
 * the designer drew (D-3.05a-2). Both faces carry all 62 Macedonian letters
 * including Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ Џ џ.
 */

/** Display / headings. The terrace condensed caps, and one of the very few
 *  heavy condensed faces with a real Cyrillic — Anton, Bebas Neue and Archivo
 *  Narrow all failed that check. Only 600 and 700 are used anywhere. */
export const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

/** Body / UI. A modern Cyrillic-first grotesque, so the copy has a
 *  contemporary voice instead of a system-font one. 400 body, 700 labels. */
export const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-golos",
  display: "swap",
});
