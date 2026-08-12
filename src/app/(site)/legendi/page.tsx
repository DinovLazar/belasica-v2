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
  CATEGORY_ORDER,
  compareByLegendRank,
  compareByRecency,
  orderedRoles,
  tenureSortYear,
} from "@/lib/people";
import {
  COACH_YEAR_OVERRIDE,
  INTERNATIONAL_SLUGS,
} from "@/content/legendi";

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

  // Both sort years are derived for EVERY person who holds the matching role,
  // not just for the one category they used to be filed under. Since 3.22 a
  // player-coach is in Играчи and Тренери at once, and his coaching year has to
  // exist to order the second of those.
  const resolved = people.map((person) => ({
    ...person,
    // 800px matches the card's largest rendered width (a 3-up track at 1408).
    portrait: framedImage(person.portrait, 800),
    // The override wins over the season index: Ace states Мартин Алаѓозовски is
    // the 2026 coach and no 2026/27 season exists, so the index cannot know it
    // and he would otherwise sort to the bottom of a band his own list opens.
    trainerYear:
      COACH_YEAR_OVERRIDE[person.name ?? ""] ??
      trainerYears.get(person.name ?? "") ??
      null,
    // Reads the term out of `playingYears` for a president who held no other
    // role, and falls back to the biography's opening line. Without it the two
    // most recent presidents both derive 2015 and the alphabet puts Петар
    // Мишевски above the sitting president (fixed at 3.22).
    presidentYear: tenureSortYear(person),
  }));

  // `LegendsBrowser` is a client component. Projecting **by name** is what keeps
  // the server-only sort inputs out of the client bundle — `bioLead` and the two
  // derived years (D-3.13-6).
  //
  // `legendRank` and `legendAppearances` cross the boundary from 3.15, and
  // `careerStats.appearances` joins them at 3.19: all three are no longer sort
  // inputs only, they are **rendered** on the card („1. Петар Андреев 555"), so
  // they have to reach it. The single number is sent on its own rather than by
  // spreading `careerStats`, so nothing else in that object (goals) rides along.
  const project = (person: (typeof resolved)[number]): LegendCardData => ({
    name: person.name,
    slug: person.slug,
    role: person.role,
    playingYears: person.playingYears,
    legendRank: person.legendRank,
    legendAppearances: person.legendAppearances,
    careerStats:
      person.careerStats?.appearances != null
        ? { appearances: person.careerStats.appearances }
        : null,
    portrait: person.portrait,
  });

  // Placement, rewritten at 3.22 on the owner's instruction. A person is now in
  // **every** category they qualify for rather than only the highest-priority
  // one (D-2.05-2, withdrawn): „не е проблем и да се споменуваат и кај играчи и
  // кај тренери". That single rule is what fixes his „хаос" — under the old one
  // all 37 player-coaches were filed under Играчи, so Тренери was missing
  // Мартин Алаѓозовски, Панче Стојанов, Александар Стојанов and Васе Беќаров,
  // the four men his own list opens with.
  //
  // A person holding no recognised role is still placed nowhere. Their
  // `/legendi/<slug>` page renders; nothing links to it.
  //
  // Each category then takes its own order:
  //  - Играчи — the club's all-time appearance ranking, most-capped first
  //    (D-3.12-2), read from `legendRank`.
  //  - Тренери and Претседатели — most recent service first (D-3.13-4), which is
  //    a chronology and not a ranking; the book ranks nobody in either.
  //  - Репрезентативци — Ace's own numbering, taken from the file order of his
  //    Drive folder. Not sorted here at all: the list IS the order.
  const bands: LegendBand[] = CATEGORY_ORDER.map((category) => {
    if (category === "international") {
      return {
        category,
        // A slug that resolves to nobody is dropped rather than rendered as a
        // gap. Four men Ace named — Васил Рингов, Благој Георгиев, Сашко Пандев,
        // Дејан Илиев — have no person document yet and are owed, not omitted.
        people: INTERNATIONAL_SLUGS.map((slug) =>
          resolved.find((person) => person.slug === slug),
        )
          .filter((person) => person !== undefined)
          .map(project),
      };
    }

    const held = resolved.filter((person) =>
      orderedRoles(person.role).includes(category),
    );

    const ordered =
      category === "player"
        ? held.sort(compareByLegendRank)
        : held.sort((a, b) =>
            compareByRecency(
              {
                name: a.name,
                sortYear:
                  category === "trainer" ? a.trainerYear : a.presidentYear,
              },
              {
                name: b.name,
                sortYear:
                  category === "trainer" ? b.trainerYear : b.presidentYear,
              },
            ),
          );

    return { category, people: ordered.map(project) };
  });

  // DISTINCT people, not category memberships: a player-coach is in two bands
  // and summing them would report 261 where the archive holds 211.
  const distinct = new Set(
    bands.flatMap((band) => band.people.map((person) => person.slug)),
  );
  const placed = distinct.size;

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
  return <LegendsBrowser bands={bands} total={placed} />;
}
