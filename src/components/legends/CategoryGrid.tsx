import {
  categoryCountLabel,
  CATEGORY_TITLE,
  type LegendCategory,
} from "@/lib/people";
import { LegendCard, type LegendCardData } from "./LegendCard";

/**
 * One category panel on /legendi — sub-heading + real count + a 3/2/1 grid of
 * `LegendCard`, matching the archive's `DecadeSectionHeader` (brand.md
 * §Components): serif H2, neutral count overline, orange rule marker.
 *
 * **Named `RoleBandGrid` until 3.23.** It stopped rendering a role band at 3.22,
 * when /legendi became four tabbed categories and a person stopped being
 * confined to one of them — but the Cowork session that made that change could
 * not rename a file, and the rename was out of that phase's scope (D-3.22-7).
 * The old name then described neither of the two things this renders: not a
 * „role" (one of the four categories corresponds to no schema role at all) and
 * not a „band" (they are tab panels, only one of which is visible).
 *
 * It takes a `LegendCategory`, which is a superset of `PersonRole` — three
 * categories are named after a role, the fourth („Репрезентативци и
 * интернационалци") is a membership list from `INTERNATIONAL_SLUGS` and
 * corresponds to no schema value.
 *
 * **Self-omitting**: a category with no people renders nothing at all — no
 * heading, no placeholder text. The count is therefore always real and „0
 * играчи" can never appear, exactly as a zero-season decade is never listed
 * (2.02 §7).
 *
 * Title and count noun are derived from the category rather than passed in, so
 * a section's heading, its tab's label and its count all read from one source in
 * `@/lib/people` and cannot drift apart (D-3.13-1).
 *
 * `people` arrives already filtered and sorted: each category takes a different
 * order (Играчи by appearance rank, Тренери and Претседатели newest-first,
 * Репрезентативци in Ace's own numbering), and that is a whole-roster decision a
 * single section cannot make for itself.
 */
export function CategoryGrid({
  category,
  people,
  headingId,
  anchorId,
  leadsPage = false,
}: {
  category: LegendCategory;
  people: LegendCardData[];
  headingId: string;
  /** The section's own `#…` target, from `CATEGORY_ANCHOR`. It is also what the
   *  tab rail's `aria-controls` points at, so it must be on the element that
   *  holds the panel. Distinct from `headingId`, which stays on the `<h2>` and
   *  names the section for assistive tech. */
  anchorId: string;
  /** Set on the category that opens the page. Its first card holds the page's
   *  LCP element and is treated accordingly (D-3.09-2/3). */
  leadsPage?: boolean;
}) {
  if (people.length === 0) return null;

  return (
    <section
      id={anchorId}
      aria-labelledby={headingId}
      // Clear BOTH sticky bars when jumped to: the site header
      // (`--spacing-header`) plus the tab rail's own height, or the heading
      // lands underneath them. Same offset as /arhiva's decade sections.
      className="scroll-mt-[calc(var(--spacing-header)+3.25rem)]"
    >
      <header>
        {/* The 6px orange bar caps the section, exactly as it caps a decade on
            /arhiva and every tile on the site. Decorative — the H2 below
            carries the section's accessible name. */}
        <div aria-hidden className="h-1.5 w-full bg-orange" />
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={headingId} className="u-h2 text-navy">
            {CATEGORY_TITLE[category]}
          </h2>
          <p className="text-overline font-bold uppercase tracking-overline tabular-nums text-neutral-500">
            {categoryCountLabel(category, people.length)}
          </p>
        </div>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person, i) => (
          <LegendCard
            key={person.slug}
            person={person}
            // The card renders the facts belonging to THIS category (3.27) —
            // the rank and the Belasica count under Играчи, the coaching span
            // under Тренери, the whole-career figures under Репрезентативци. The
            // grid already knows which panel it is, so the card is told rather
            // than left to guess from the man's roles, which cannot answer it.
            category={category}
            delayIndex={i % 3}
            priority={leadsPage && i === 0}
          />
        ))}
      </ul>
    </section>
  );
}
