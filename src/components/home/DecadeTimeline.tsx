import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Decades rail — Phase 1.05.2 handover §7 ("Низ децениите").
 *
 * A fixed structural spine of decades (the club was founded 1922 — structural,
 * not a per-decade fact claim). Decades that have at least one published season
 * get an orange node + navy label; the rest are muted. No milestone text (that
 * would be an unverified fact). Every marker links to the archive.
 *
 * The rail scrolls horizontally inside its own container on narrow screens, so
 * the page body never scrolls sideways; on ≥768px the 11 decades spread evenly.
 */
const DECADES = [
  1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
] as const;

const focusOnPaper =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function DecadeTimeline({ activeDecades }: { activeDecades: number[] }) {
  const active = new Set(activeDecades);

  return (
    <div className="mt-8 overflow-x-auto pb-2">
      <ol className="flex min-w-max items-start">
        {DECADES.map((decade, i) => {
          const on = active.has(decade);
          return (
            <li
              key={decade}
              className="flex min-w-[64px] flex-1 flex-col items-center"
            >
              <Link
                href="/arhiva"
                aria-label={
                  on
                    ? `Архива — ${decade}-ти (има сезони)`
                    : `Архива — ${decade}-ти`
                }
                className={cn(
                  "group flex w-full flex-col items-center gap-2 rounded-card py-1",
                  focusOnPaper,
                )}
              >
                <span className="relative flex h-3 w-full items-center justify-center">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="absolute left-0 right-1/2 h-px bg-mist"
                    />
                  )}
                  {i < DECADES.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 right-0 h-px bg-mist"
                    />
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "relative z-10 size-3 rounded-full border-2 transition-transform duration-150 ease-out group-hover:scale-110",
                      on ? "border-orange bg-orange" : "border-mist bg-paper",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-small tabular-nums",
                    on ? "font-semibold text-navy" : "text-neutral-500",
                  )}
                >
                  {decade}-ти
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
