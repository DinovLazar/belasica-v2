import { focusOnNavy } from "@/lib/focus";

export type SeasonAnchor = { id: string; label: string };

/**
 * In-page jump nav for the season document (D-3.04-5).
 *
 * A filled season runs long — a standings scan can be 2000px tall on its own,
 * a squad roster is up to 38 lines — so the page needs a way past its own
 * sections. Only sections that actually rendered are listed: the nav can never
 * offer a jump to a heading that self-omitted.
 *
 * Deliberately **not sticky**, unlike the archive index's `DecadeJumpNav`.
 * A second sticky bar under the sticky site header would make every anchor
 * offset `--spacing-header` + this rail's own rendered height — exactly the
 * two-bar arithmetic D-2.02-13 flags as fragile. Sitting in the flow, this
 * page needs the one-bar clearance, which is what it gets: it sets no
 * `data-sticky-rail`, so `globals.css` leaves the scroller on the plain
 * `scroll-padding-top: var(--spacing-header)` tier.
 */
export function SeasonAnchorNav({
  anchors,
  label = "Скок низ сезоната",
}: {
  anchors: SeasonAnchor[];
  /**
   * The rail's accessible name. Defaults to the season page's, and is
   * overridden where the same rail serves another document — „Разно" passes
   * its own, because a landmark called „Скок низ сезоната" on a topic page
   * would name a thing that page does not have (3.19).
   */
  label?: string;
}) {
  // One link is not navigation — it is a link to the thing right below it.
  if (anchors.length < 2) return null;

  return (
    <nav aria-label={label} className="bg-navy-2">
      {/* Vertical rhythm is split container/link (py-1 + py-2) so each link is
          a ≥24px tap target (WCAG 2.5.8) without changing the rail's height. */}
      <div className="relative mx-auto w-full max-w-page overflow-x-auto px-5 py-1 md:px-8">
        <ul className="flex min-w-max items-center gap-5">
          {anchors.map((anchor) => (
            <li key={anchor.id}>
              <a
                href={`#${anchor.id}`}
                className={`block border-b-2 border-transparent py-2 text-small font-bold uppercase tracking-[0.12em] text-paper/80 transition-colors hover:border-orange hover:text-paper ${focusOnNavy}`}
              >
                {anchor.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
