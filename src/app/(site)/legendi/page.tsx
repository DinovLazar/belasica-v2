import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { framedImage } from "@/sanity/frame";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import type { LegendCardData } from "@/components/legends/LegendCard";
import {
  LegendsBrowser,
  type LegendBand,
} from "@/components/legends/LegendsBrowser";
import {
  buildTrainerYearIndex,
  compareByLegendRank,
  compareByRecency,
  primaryRole,
  ROLE_PRIORITY,
  tenureEndYear,
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
 * `seasons` rides along in the same round trip (D-3.13-5): the Тренери band is
 * ordered from `season.trainer`, so the two reads are one query rather than two
 * fetches that could disagree. `bioLead` is the biography's **first line only**
 * — the officials' term lives there, and pulling the whole `bio` would ship
 * 126k characters to order 28 people.
 *
 * Deliberately **not** ordered in GROQ: both band orders need locale-aware
 * Cyrillic collation, which GROQ's `order()` cannot do — it compares code
 * units, so „Ѓ" (U+0403) would sort after „Ш" instead of between „Г" and „Д".
 * The sort happens in JS below.
 */
const LEGENDS_QUERY = /* groq */ `{
  "people": *[_type == "person" && defined(slug.current)]{
    name,
    "slug": slug.current,
    role,
    playingYears,
    legendRank,
    legendAppearances,
    careerStats{ appearances },
    "bioLead": bio[0].children[0].text,
    "portrait": *[_type == "photo" && relatedPerson._ref == ^._id]
      | order(coalesce(date, "9999") asc)[0].image
  },
  "seasons": *[_type == "season" && defined(trainer)]{
    "slug": slug.current,
    trainer
  }
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
  /** First line of the biography, the source of an official's term. A **sort
   *  input only** — stripped below, before the bands reach the client. */
  bioLead: string | null;
};

/** Every season that names a coach — the Тренери band's ordering source. */
type SeasonTrainerRow = { slug: string | null; trainer: string | null };

type LegendsData = { people: PersonRow[]; seasons: SeasonTrainerRow[] };

export default async function LegendsPage() {
  let people: PersonRow[] = [];
  let seasons: SeasonTrainerRow[] = [];
  try {
    const data = await client.fetch<LegendsData>(LEGENDS_QUERY);
    people = data?.people ?? [];
    seasons = data?.seasons ?? [];
  } catch {
    // A failed read must not crash the route or invent filler. The page falls
    // through to its empty notice, which is honest about having nothing.
    people = [];
    seasons = [];
  }

  // Built once for the whole roster rather than per person: 68 season strings
  // are parsed one time, and each trainer is then a single Map lookup.
  const trainerYears = buildTrainerYearIndex(seasons);

  const resolved = people.map((person) => {
    const role = primaryRole(person.role);

    return {
      ...person,
      // 800px matches the card's largest rendered width (a 3-up track at 1408).
      portrait: framedImage(person.portrait, 800),
      // Derived here, on the server, and never rendered — a sort key only.
      // Players do not use it: their band is ordered by `legendRank`.
      sortYear:
        role === "trainer"
          ? (trainerYears.get(person.name ?? "") ?? null)
          : role === "president"
            ? tenureEndYear(person.bioLead)
            : null,
    };
  });

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
  // `legendRank` (D-3.12-2).
  //
  // Тренери and Претседатели are ordered by **most recent service** (D-3.13-4),
  // so the club's latest coach and its last president open their bands instead
  // of sitting mid-alphabet. Neither year is stored: a trainer's comes from the
  // latest `season.trainer` naming them, an official's from the term in their
  // own biography. This is a chronology, not a ranking — the book ranks nobody
  // in these two bands, and none is invented here. Anyone with no derivable
  // year falls to the end of their band, alphabetically.
  const bands: LegendBand[] = ROLE_PRIORITY.map((role) => ({
    role,
    people: resolved
      .filter((person) => primaryRole(person.role) === role)
      .sort(role === "player" ? compareByLegendRank : compareByRecency)
      // `LegendsBrowser` is a client component. Projecting **by name** is what
      // keeps the server-only sort inputs out of the client bundle — `bioLead`
      // and the derived `sortYear`, and with them the `careerStats` a spread
      // carried across since 3.12 (D-3.13-6).
      //
      // `legendRank` and `legendAppearances` cross the boundary from 3.15 and
      // are the exception that proves the rule: they are no longer sort inputs
      // only, they are **rendered** on the card („1. Петар Андреев 555"), so
      // they have to reach it. `careerStats` and `bioLead` still do not.
      .map((person) => ({
        name: person.name,
        slug: person.slug,
        role: person.role,
        playingYears: person.playingYears,
        legendRank: person.legendRank,
        legendAppearances: person.legendAppearances,
        portrait: person.portrait,
      })),
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
