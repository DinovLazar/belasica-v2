import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import type { LegendCardData } from "@/components/legends/LegendCard";
import { RoleBandGrid } from "@/components/legends/RoleBandGrid";
import { compareByName, primaryRole, ROLE_PRIORITY } from "@/lib/people";

// Match the archive (D-1.05-4): a person published in Studio appears within
// ~a minute, without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Легенди",
  description:
    "Играчите, тренерите и раководството што го обележале ФК Беласица — неофицијална архива.",
};

/**
 * Every published person, with the portrait by back-reference
 * (`photo.relatedPerson`, D-2.01-1 — there is no `person.photos` array). `[0]`
 * after `coalesce(date,"9999") asc` is the portrait, the same ordering key the
 * homepage and the archive use.
 *
 * Deliberately **not** ordered in GROQ: the band order is by `name` with
 * locale-aware Cyrillic collation (§2), which GROQ's `order()` cannot do — it
 * compares code units, so „Ѓ" (U+0403) would sort after „Ш" instead of between
 * „Г" and „Д". The sort happens in JS below.
 */
const LEGENDS_QUERY = /* groq */ `
*[_type == "person" && defined(slug.current)]{
  name,
  "slug": slug.current,
  role,
  playingYears,
  "portrait": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(coalesce(date, "9999") asc)[0].image
}`;

export default async function LegendsPage() {
  let people: LegendCardData[] = [];
  try {
    people = (await client.fetch<LegendCardData[]>(LEGENDS_QUERY)) ?? [];
  } catch {
    // A failed read must not crash the route or invent filler. The page falls
    // through to its empty notice, which is honest about having nothing.
    people = [];
  }

  const sorted = [...people].sort((a, b) =>
    compareByName(a.name ?? "", b.name ?? ""),
  );

  // Placement is a whole-roster decision, so it happens here rather than inside
  // a band: each person lands in exactly one band — the one for their
  // highest-priority role (player > trainer > president, D-2.05-2) — and never
  // appears twice. Their other roles still show as chips on the card.
  //
  // A person holding no recognised role is placed in no band; inventing a
  // fourth band for them would be a design decision this phase does not own.
  // Their `/legendi/<slug>` page still renders, and nothing links to it.
  const bands = ROLE_PRIORITY.map((role) => ({
    role,
    people: sorted.filter((person) => primaryRole(person.role) === role),
  }));

  const placed = bands.reduce((sum, band) => sum + band.people.length, 0);

  return (
    <>
      <Container className="py-5">
        <Breadcrumb
          items={[{ label: "Почетна", href: "/" }, { label: "Легенди" }]}
        />
      </Container>

      <Container className="pb-12">
        <h1 className="font-serif text-h1 font-semibold text-navy md:text-display">
          Легенди
        </h1>
        {/* Structural copy — describes the page, claims no fact about the club. */}
        <p className="mt-4 max-w-measure text-body-l text-neutral-700">
          Играчите, тренерите и раководството што го обележале клубот низ
          годините.
        </p>
      </Container>

      {placed === 0 ? (
        // Heading + one notice rather than a bare page (§2 „Whole page empty").
        // This matches the archive index's zero-seasons state — the existing
        // empty convention for a collection page, which §2 asks to confirm
        // against — not the season page's five-chip notice, which enumerates
        // one season's own missing sections.
        <Container className="pb-16 md:pb-24">
          <PlaceholderChip label="легенди — сѐ уште не се објавени" />
        </Container>
      ) : (
        <Container className="pb-16 md:pb-24">
          <div className="flex flex-col gap-16 md:gap-24">
            {bands.map((band) => (
              <RoleBandGrid
                key={band.role}
                role={band.role}
                people={band.people}
                headingId={`band-${band.role}`}
              />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
