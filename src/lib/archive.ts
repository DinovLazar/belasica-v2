/**
 * Archive display helpers — pure formatting for the /arhiva templates.
 * No facts here: every string either labels a real counted value or renders
 * data straight from the locked model (content-truth).
 */

/** „1990-ти" — the decade label used by the jump-nav, section headers, card
 *  overlines and the season hero overline (D-2.02-1). */
export function decadeLabel(decade: number): string {
  return `${decade}-ти`;
}

/** The in-page anchor a decade section owns („#d1990"), shared by the
 *  jump-nav, the section id and the season page's back-link. */
export function decadeAnchor(decade: number): string {
  return `d${decade}`;
}

/**
 * Macedonian count label (D-2.02-12). „1 сезони" is wrong — the singular is
 * „сезона". Only 1 takes the singular; 0 and 2+ take „сезони".
 */
export function seasonCountLabel(count: number): string {
  return count === 1 ? "1 сезона" : `${count} сезони`;
}

/** Macedonian count label for decades, same rule as seasons. */
export function decadeCountLabel(count: number): string {
  return count === 1 ? "1 деценија" : `${count} децении`;
}

/**
 * Does this standings row belong to the club? Match is case- and
 * whitespace-insensitive on „Беласица", because `finalTable[].club` is free
 * text typed by an editor („ФК Беласица", „Беласица Струмица", …).
 * Not matching is harmless — the row simply isn't highlighted. The row is
 * never invented or reordered to make one match (D-2.02-4).
 */
export function isBelasicaRow(club: string | null | undefined): boolean {
  return (club ?? "").toLocaleLowerCase("mk").includes("беласица");
}

/** Unknown numeric cells render „—", never blank and never 0 (§6.4 / §6.5). */
export const UNKNOWN = "—";

/** `—` for null/undefined; the number otherwise. `0` is a real value and must
 *  survive (a team really can score 0 goals). */
export function statCell(value: number | null | undefined): string {
  return value == null ? UNKNOWN : String(value);
}
