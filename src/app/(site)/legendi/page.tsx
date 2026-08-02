import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { framedImage } from "@/sanity/frame";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import type { LegendCardData } from "@/components/legends/LegendCard";
import { LegendsBrowser } from "@/components/legends/LegendsBrowser";
import {
  compareByLegendRank,
  compareByName,
  primaryRole,
  ROLE_PRIORITY,
} from "@/lib/people";

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
 * Deliberately **not** ordered in GROQ: both band orders need locale-aware
 * Cyrillic collation, which GROQ's `order()` cannot do — it compares code
 * units, so „Ѓ" (U+0403) would sort after „Ш" instead of between „Г" and „Д".
 * The sort happens in JS below.
 */
const LEGENDS_QUERY = /* groq */ `
*[_type == "person" && defined(slug.current)]{
  name,
  "slug": slug.current,
  role,
  playingYears,
  legendRank,
  careerStats{ appearances },
  "portrait": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(coalesce(date, "9999") asc)[0].image
}`;

/** What the query returns: the portrait is still a raw Sanity asset here. It is
 *  resolved to a URL below, on the server — `LegendsBrowser` is a client
 *  component and may not receive one (D-3.09-1). */
type PersonRow = Omit<LegendCardData, "portrait"> & {
  portrait: SanityImageSource | null;
  /** The book's all-time appearance rank, 1–80. Null for everyone it does not
   *  list — most of the roster, and every trainer and official. */
  legendRank: number | null;
  careerStats: { appearances: number | null } | null;
};

export default async function LegendsPage() {
  let people: PersonRow[] = [];
  try {
    people = (await client.fetch<PersonRow[]>(LEGENDS_QUERY)) ?? [];
  } catch {
    // A failed read must not crash the route or invent filler. The page falls
    // through to its empty notice, which is honest about having nothing.
    people = [];
  }

  const resolved = people.map((person) => ({
    ...person,
    // 800px matches the card's largest rendered width (a 3-up track at 1408).
    portrait: framedImage(person.portrait, 800),
  }));

  // Placement is a whole-roster decision, so it happens here rather than inside
  // a band: each person lands in exactly one band — the one for their
  // highest-priority role (player > trainer > president, D-2.05-2) — and never
  // appears twice. Their other roles still show as chips on the card.
  //
  // A person holding no recognised role is placed in no band; inventing a
  // fourth band for them would be a design decision this phase does not own.
  // Their `/legendi/<slug>` page still renders, and nothing links to it.
  //
  // Each band then takes its own order. Играчи is the club's all-time
  // appearance ranking, most-capped first — the owner's instruction at 3.12
  // („наредете ги според број на натпревари, а не по азбучен ред"), read from
  // `legendRank` (D-3.12-2). Тренери and Раководство stay alphabetical: the
  // book ranks nobody in those two bands, and ordering them by anything would
  // be inventing a ranking.
  const bands = ROLE_PRIORITY.map((role) => ({
    role,
    people: resolved
      .filter((person) => primaryRole(person.role) === role)
      .sort(
        role === "player"
          ? compareByLegendRank
          : (a, b) => compareByName(a.name ?? "", b.name ?? ""),
      ),
  }));

  const placed = bands.reduce((sum, band) => sum + band.people.length, 0);

  // The empty branch keeps its own header: it has no search field to host and
  // no real count to state, so `LegendsBrowser` — which since 3.10 renders the
  // header around the search (D-3.10-2) — is not the right thing to mount for
  // a roster of nobody. The three header strings are therefore written twice,
  // here and in the browser; they are the same copy and this branch is the
  // defensive one (D-3.10-3).
  if (placed === 0) {
    return (
      <>
        <PageHeader
          title="Легенди"
          crumbs={[{ label: "Почетна", href: "/" }, { label: "Легенди" }]}
          // Structural copy — describes the page, claims no fact about the club.
          intro="Играчите, тренерите и раководството што го обележале клубот низ годините."
        />

        {/* Heading + one notice rather than a bare page (§2 „Whole page empty").
            This matches the archive index's zero-seasons state — the existing
            empty convention for a collection page, which §2 asks to confirm
            against — not the season page's five-chip notice, which enumerates
            one season's own missing sections. */}
        <Container className="py-section">
          <PlaceholderChip label="легенди — сѐ уште не се објавени" />
        </Container>
      </>
    );
  }

  // Bands are built here (placement is a whole-roster decision); the browser
  // renders the navy header, the name filter and the bands under it.
  return <LegendsBrowser bands={bands} />;
}
