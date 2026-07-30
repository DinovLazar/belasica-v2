/**
 * A season section's empty state (D-3.04b-1).
 *
 * Until 3.04b a season section omitted itself when its field was empty
 * (D-2.02-3). The owner asked for every season page to carry the same
 * structure instead, so each section now always renders and states, in one
 * line, that the archive does not hold that piece yet — the pattern
 * `/statistika` already uses (D-2.04-3, `StatsEmptyNotice`).
 *
 * Deliberately **no `PlaceholderChip`**, unlike `StatsEmptyNotice`. A chip is
 * the register-tracked marker for a missing *display fact*, and the register
 * („Placeholder register", current-state.md) is a launch blocker that must be
 * empty at cutover. Always-on sections would emit ~170 chips across the 96
 * pages — 86 for `results` alone — which would swamp that gate with entries
 * that are genuine source gaps, not outstanding work. A plain structural
 * sentence says the same thing truthfully without pretending it is a to-do.
 *
 * The copy is structural: it describes the archive's own state and claims no
 * fact about the club, so it needs no `facts.md` entry. It says the archive
 * does not *hold* the material — never that it is coming, because for most of
 * these seasons no source exists (D-3.04C-5 / D-3.04C-6).
 */
export function SeasonSectionEmpty({ note }: { note: string }) {
  return (
    // The 6px orange bar caps the block, as it does every block on the site —
    // so an empty section still reads as part of the page's system.
    <div className="u-cap max-w-measure bg-white p-6 text-body text-neutral-700 md:p-8">
      <p>{note}</p>
    </div>
  );
}
