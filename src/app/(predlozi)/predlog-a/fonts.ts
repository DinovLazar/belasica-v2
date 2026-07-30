import { Playfair_Display, PT_Sans_Narrow, PT_Serif } from "next/font/google";

/**
 * Направление А — „Спортски весник": display / text / agate, the three-tier
 * system a newspaper actually runs on.
 *
 * Declared per variant rather than in one shared module: `next/font` attaches
 * a route's preloads at module granularity, so a single file exporting all
 * seven exploration faces made every `/predlog-*` page preload 26 woff2 files
 * instead of its own (D-3.05a-3). It is also not in `src/app/fonts.ts`, which
 * the root layout loads for the whole site — a face declared there would ship
 * its CSS and preload hints to the live pages.
 *
 * **Cyrillic verified per face, not assumed** (D-3.05a-2): the Google
 * `cyrillic` subset only says which file to fetch, not which glyphs were
 * drawn. Each face below was checked by parsing the cmap out of its shipped
 * woff2 — all 62 Macedonian letters (incl. Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ Џ џ) are
 * present in the cyrillic subset, and the digits plus „ “ ” — – · ( ) / . , :
 * % in the latin subset.
 */

/** Headlines. A Didone — the high thick/thin contrast of a 20th-c sports front
 *  page. 900 for the lead, 700 for sub-heads and card titles. */
export const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "900"],
  variable: "--font-pa-display",
  display: "swap",
});

/** Body column. A Cyrillic-native text face (ParaType, drawn for Russian
 *  first), so the copy reads as set rather than transliterated. Italic is real,
 *  not synthesised: the deck and the print captions are set in it. */
export const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pa-text",
  display: "swap",
});

/** Agate — box scores, standing heads, captions. */
export const ptSansNarrow = PT_Sans_Narrow({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-pa-agate",
  display: "swap",
});
