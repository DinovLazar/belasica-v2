/**
 * Focus-visible rings — brand.md §Color ("focus ring: navy 3px on light,
 * orange 3px on navy, 2px offset") and §Components.
 *
 * The rings themselves are the `.u-focus` role classes in `globals.css`; these
 * two constants are the names call sites use, so every focusable element in the
 * app states which surface it sits on rather than repeating an outline recipe.
 *
 * Two variants, because the ring must contrast with the surface it sits on:
 *  - `focusOnPaper` — navy ring on the paper/white surfaces (14.95:1).
 *  - `focusOnNavy`  — orange ring on the navy blocks (5.81:1), where a navy
 *    ring would be invisible.
 */
export const focusOnPaper = "u-focus";

export const focusOnNavy = "u-focus u-focus--on-navy";
