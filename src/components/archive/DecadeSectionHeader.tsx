import { decadeLabel, seasonCountLabel } from "@/lib/archive";

/**
 * Decade section header — brand.md §Components: the decade in condensed caps
 * with its count, over the 6px orange bar that bands every block on the site.
 *
 * The count is real (the number of published seasons in this decade), never
 * decorative: a decade with zero seasons is not rendered at all, so „0 сезони"
 * can't appear. The count text is neutral, not orange — orange ink on a light
 * surface fails AA at every size (brand rule 3).
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
      {/* The bar caps the block along its TOP edge, as everywhere else. */}
      <div aria-hidden className="h-1.5 w-full bg-orange" />
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={headingId} className="u-h2 tabular-nums text-navy">
          {decadeLabel(decade)}
        </h2>
        <p className="text-overline font-bold uppercase tracking-overline tabular-nums text-neutral-500">
          {seasonCountLabel(count)}
        </p>
      </div>
    </header>
  );
}
