import { bandCountLabel, BAND_TITLE, type PersonRole } from "@/lib/people";
import { LegendCard, type LegendCardData } from "./LegendCard";

/**
 * One role band on /legendi (handover §6.2) — sub-heading + real count + a
 * 3/2/1 grid of `LegendCard`, matching the archive's `DecadeSectionHeader`
 * (brand.md §Components): serif H2, neutral count overline, orange rule marker.
 *
 * **Self-omitting** (§2): a band with no people renders nothing at all — no
 * heading, no placeholder text. The count is therefore always real and „0
 * играчи" can never appear, exactly as a zero-season decade is never listed
 * (2.02 §7).
 *
 * The handover specs the props as `title` + `people[]`; this takes `role`
 * instead and derives the title from `BAND_TITLE`, so the band's title, its
 * placement priority and its count noun all read from one source in
 * `@/lib/people` rather than being restated at the call site.
 *
 * `people` arrives already filtered and name-sorted — placement is a
 * whole-roster decision (a person must appear in exactly one band, D-2.05-2),
 * which a single band cannot make for itself.
 */
export function RoleBandGrid({
  role,
  people,
  headingId,
  anchorId,
  leadsPage = false,
}: {
  role: PersonRole;
  people: LegendCardData[];
  headingId: string;
  /** The band's own `#…` target, from `BAND_ANCHOR` — what the page's jump rail
   *  links to (3.17). Distinct from `headingId`, which stays on the `<h2>` and
   *  names the section for assistive tech. */
  anchorId: string;
  /** Set on the first band that actually renders. Its first card holds the
   *  page's LCP element and is treated accordingly (D-3.09-2/3). */
  leadsPage?: boolean;
}) {
  if (people.length === 0) return null;

  return (
    <section
      id={anchorId}
      aria-labelledby={headingId}
      // Clear BOTH sticky bars when jumped to: the site header
      // (`--spacing-header`) plus the jump rail's own height, or the heading
      // lands underneath them. Same offset as /arhiva's decade sections.
      className="scroll-mt-[calc(var(--spacing-header)+3.25rem)]"
    >
      <header>
        {/* The 6px orange bar caps the band, exactly as it caps a decade on
            /arhiva and every tile on the site. Decorative — the H2 below
            carries the section's accessible name. */}
        <div aria-hidden className="h-1.5 w-full bg-orange" />
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={headingId} className="u-h2 text-navy">
            {BAND_TITLE[role]}
          </h2>
          <p className="text-overline font-bold uppercase tracking-overline tabular-nums text-neutral-500">
            {bandCountLabel(role, people.length)}
          </p>
        </div>
      </header>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person, i) => (
          <LegendCard
            key={person.slug}
            person={person}
            delayIndex={i % 3}
            priority={leadsPage && i === 0}
          />
        ))}
      </ul>
    </section>
  );
}
