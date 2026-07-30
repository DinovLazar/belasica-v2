import { decadeAnchor, decadeLabel } from "@/lib/archive";
import { focusOnNavy } from "@/lib/focus";

/**
 * Decade jump-nav (D-2.02-13). With 96 seasons over 11 decades, scanning the
 * index needs it.
 *
 * Sticks *beneath* the sticky site header, offset by `top-header`
 * (`--spacing-header`, the measured header height — D-2.02-17). Never hardcode
 * that number; the token is the single source and is kept in sync with the
 * rendered header. On the second navy value, so header and rail read as two
 * stacked bands of one block rather than a dark bar over a light one.
 *
 * Only decades that actually have a published season are listed — the index
 * never offers a jump to an empty decade. Mobile scrolls the rail inside its
 * own container, so the page body never scrolls sideways.
 */
export function DecadeJumpNav({ decades }: { decades: number[] }) {
  return (
    <nav
      aria-label="Скок по деценија"
      className="sticky top-header z-30 bg-navy-2"
    >
      {/* Vertical rhythm is split container/link (py-1 + py-2) so each link is
          a ≥24px tap target (WCAG 2.5.8) while the rail keeps its measured
          height — the /arhiva anchors' `scroll-mt-[calc(var(--spacing-header)
          +3.25rem)]` was derived from it, so any change to these paddings must
          keep the container+link vertical total at 12px per side. */}
      <div className="mx-auto w-full max-w-page overflow-x-auto px-5 py-1 md:px-8">
        <ul className="flex min-w-max items-center gap-5">
          {decades.map((decade) => (
            <li key={decade}>
              <a
                href={`#${decadeAnchor(decade)}`}
                className={`block border-b-2 border-transparent py-2 text-small font-bold uppercase tracking-[0.12em] tabular-nums text-paper/80 transition-colors hover:border-orange hover:text-paper ${focusOnNavy}`}
              >
                {decadeLabel(decade)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
