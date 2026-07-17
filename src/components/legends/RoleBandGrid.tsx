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
}: {
  role: PersonRole;
  people: LegendCardData[];
  headingId: string;
}) {
  if (people.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <header>
        <div className="flex items-baseline justify-between gap-4">
          <h2 id={headingId} className="font-serif text-h2 font-semibold text-navy">
            {BAND_TITLE[role]}
          </h2>
          <p className="text-overline font-semibold uppercase tracking-overline text-neutral-500">
            {bandCountLabel(role, people.length)}
          </p>
        </div>
        {/* Orange marker segment, then a mist hairline to the edge. Decorative
            — the H2 above carries the section's accessible name. */}
        <div aria-hidden className="mt-3 flex items-center">
          <span className="h-0.5 w-16 shrink-0 bg-orange" />
          <span className="h-px flex-1 bg-mist" />
        </div>
      </header>

      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person, i) => (
          <LegendCard key={person.slug} person={person} delayIndex={i % 3} />
        ))}
      </ul>
    </section>
  );
}
