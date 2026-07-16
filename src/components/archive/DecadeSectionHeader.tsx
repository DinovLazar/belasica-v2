import { decadeLabel, seasonCountLabel } from "@/lib/archive";

/**
 * Decade section header — brand.md §Components: large serif decade + orange
 * rule + neutral count overline.
 *
 * The count is real (the number of published seasons in this decade), never
 * decorative: a decade with zero seasons is not rendered at all, so „0 сезони"
 * can't appear (§7). The count text is neutral-500 — orange on paper fails AA
 * (D-1.02-1).
 */
export function DecadeSectionHeader({
  decade,
  count,
  headingId,
}: {
  decade: number;
  count: number;
  headingId: string;
}) {
  return (
    <header>
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id={headingId}
          className="font-serif text-h2 font-semibold text-navy"
        >
          {decadeLabel(decade)}
        </h2>
        <p className="text-overline font-semibold uppercase tracking-overline text-neutral-500">
          {seasonCountLabel(count)}
        </p>
      </div>
      {/* Orange marker segment, then a mist hairline to the edge. Decorative —
          the H2 above carries the section's accessible name. */}
      <div aria-hidden className="mt-3 flex items-center">
        <span className="h-0.5 w-16 shrink-0 bg-orange" />
        <span className="h-px flex-1 bg-mist" />
      </div>
    </header>
  );
}
