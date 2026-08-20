import { focusOnNavy } from "@/lib/focus";

export type JumpItem = { id: string; label: string };

/**
 * The sticky in-page jump rail, generalised at 3.17 from `DecadeJumpNav`
 * (D-2.02-13) so the three long pages can share one rail instead of three
 * copies of the same markup: `/arhiva` by decade, `/legendi` by role,
 * `/statistika` by section.
 *
 * Sticks *beneath* the sticky site header, offset by `top-header`
 * (`--spacing-header`, the measured header height — D-2.02-17). Never hardcode
 * that number; the token is the single source and is kept in sync with the
 * rendered header. On the second navy value, so header and rail read as two
 * stacked bands of one block rather than a dark bar over a light one.
 *
 * Callers pass only the items that actually rendered — the rail can never
 * offer a jump to a section that self-omitted. Anchored targets no longer carry
 * a `scroll-mt-*` of their own: `data-sticky-rail` below puts the page on the
 * two-bar `scroll-padding-top` tier in `globals.css`, which is the single
 * offset for jump links, `scrollIntoView()` and keyboard focus alike.
 *
 * A server component on purpose: it holds no state and needs none. `/legendi`
 * imports it into a client component because its bands are filtered in the
 * browser, which pulls this markup into that page's bundle — everywhere else
 * it stays server-only.
 */
export function JumpNav({
  items,
  ariaLabel,
}: {
  items: JumpItem[];
  ariaLabel: string;
}) {
  // One link is not navigation — it is a link to the thing right below it
  // (`SeasonAnchorNav`'s rule). On /arhiva this branch is unreachable with the
  // published data: the index renders its empty state below one decade, and
  // eleven decades have seasons.
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={ariaLabel}
      // Marks the page as carrying a SECOND sticky bar, so `globals.css`
      // gives the scroller the two-bar `scroll-padding-top` (SC 2.4.11).
      // An attribute on the rail itself, not a route list: the tier then
      // follows what actually rendered — this component returns null for a
      // single item, and on that page there is no second bar to clear.
      data-sticky-rail
      className="sticky top-header z-30 bg-navy-2"
    >
      {/* Vertical rhythm is split container/link (py-1 + py-2) so each link is
          a ≥24px tap target (WCAG 2.5.8) while the rail keeps its measured
          height — `--spacing-rail` was derived from it, so any change to these
          paddings must keep the container+link vertical total at 12px per side
          or that token has to move with it. */}
      {/* `rail-fade` (globals.css) fades whichever edge still has content
          off-screen — paint only, so the rail's measured height, and the
          `--spacing-rail` token derived from it, are unchanged. */}
      <div className="rail-fade relative mx-auto w-full max-w-page overflow-x-auto px-5 py-1 md:px-8">
        <ul className="flex min-w-max items-center gap-5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block border-b-2 border-transparent py-2 text-small font-bold uppercase tracking-[0.12em] tabular-nums text-paper/80 transition-colors hover:border-orange hover:text-paper ${focusOnNavy}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
