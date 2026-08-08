/**
 * Social glyphs — hand-authored, no icon library and no new dependency.
 *
 * `brand.md` names no icon set, so the pair is drawn to this direction rather
 * than borrowed: both are **outlined containers with a solid mark inside**, on
 * the same 24×24 artboard with the same 2px ring, so the two read as one set in
 * a row rather than as two glyphs from two libraries (the mismatched-weight
 * tell). Both take their colour from `currentColor`, so the footer's ink and
 * its orange hover swap carry straight through with no per-icon override.
 *
 * `aria-hidden` + `focusable="false"` on every glyph: the accessible name comes
 * from the link's own text (see `SocialLinks`), never from the SVG. `focusable`
 * is not redundant — IE/Edge legacy put SVGs in the tab order without it, and
 * it costs one attribute to be certain the tab ring lands on the `<a>`.
 */

const glyph = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  "aria-hidden": "true",
  focusable: "false",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

/**
 * Facebook — the „f" inside a ring. Drawn as one `evenodd` path: the ring is an
 * outer circle (r 10) with an inner circle (r 8) punched out, and the letter is
 * a third subpath, which `evenodd` fills because it sits at an odd crossing
 * depth. One path rather than three shapes keeps the fill rule doing the work
 * instead of a stroke, so the glyph scales without the ring thinning.
 */
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg {...glyph} className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm1.03 14.6v-5.35h1.8l.34-2.2h-2.14V9.62c0-.63.18-1.06 1.09-1.06h1.13V6.59a15.3 15.3 0 0 0-1.68-.09c-1.68 0-2.83 1.03-2.83 2.91v1.64H8.98v2.2h1.76v5.35h2.29Z"
      />
    </svg>
  );
}

/**
 * Instagram — the camera outline. Same `evenodd` construction, four subpaths:
 * the rounded body and its punched-out inside, then the lens ring and its
 * punched-out centre. The flash dot is a fifth subpath sitting inside the
 * body's hole, so it lands back on an odd depth and fills.
 */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg {...glyph} className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm5.25-3.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
      />
    </svg>
  );
}
