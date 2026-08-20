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
 * offer a jump to a section that self-omitted. Every anchored target carries
 * `scroll-mt-[calc(var(--spacing-header)+3.25rem)]`, derived from this rail's
 * own height (see the padding comment below).
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
    <nav aria-label={ariaLabel} className="sticky top-header z-30 bg-navy-2">
      {/* Vertical rhythm is split container/link (py-1 + py-2) so each link is
          a ≥24px tap target (WCAG 2.5.8) while the rail keeps its measured
          height — every call site's `scroll-mt-[calc(var(--spacing-header)
          +3.25rem)]` was derived from it, so any change to these paddings must
          keep the container+link vertical total at 12px per side. */}
      {/* `rail-fade` (globals.css) fades whichever edge still has content
          off-screen — paint only, so the rail's measured height, and every
          call site's scroll-margin derived from it, are unchanged. */}
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
