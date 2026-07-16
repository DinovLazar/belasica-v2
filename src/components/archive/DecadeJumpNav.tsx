import { decadeAnchor, decadeLabel } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";

/**
 * Decade jump-nav (D-2.02-13). With ~74 seasons over 11 decades, scanning the
 * index needs it.
 *
 * Sticks *beneath* the sticky site header, offset by `top-header`
 * (`--spacing-header`, the measured header height — D-2.02-17). Never hardcode
 * that number; the token is the single source and is kept in sync with the
 * rendered header.
 *
 * Only decades that actually have a published season are listed — the index
 * never offers a jump to an empty decade (§7). Mobile scrolls the rail inside
 * its own container, so the page body never scrolls sideways.
 *
 * Scroll-spy/active state is explicitly optional in the handover (§5.3) and is
 * not built here — it would need a client component for a scannable list that
 * already works. If added later, the active item keeps its navy label and takes
 * an orange underline (D-1.02-1).
 */
export function DecadeJumpNav({ decades }: { decades: number[] }) {
  return (
    <nav
      aria-label="Скок по деценија"
      className="sticky top-header z-30 border-b border-mist bg-paper"
    >
      <div className="mx-auto w-full max-w-page overflow-x-auto px-5 py-3 md:px-10">
        <ul className="flex min-w-max items-center gap-5">
          {decades.map((decade) => (
            <li key={decade}>
              <a
                href={`#${decadeAnchor(decade)}`}
                className={`block rounded-chip text-small font-medium text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
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
