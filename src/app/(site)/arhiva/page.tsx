import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { fetchOrThrow } from "@/sanity/fetch";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { DecadeJumpNav } from "@/components/archive/DecadeJumpNav";
import { DecadeSectionHeader } from "@/components/archive/DecadeSectionHeader";
import {
  SeasonCard,
  type SeasonCardData,
} from "@/components/archive/SeasonCard";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import {
  decadeAnchor,
  decadeCountLabel,
  seasonCountLabel,
} from "@/lib/archive";

// Match the homepage (D-1.05-4): hand-curated seasons appear on the site within
// ~a minute of publishing, without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  // Its own path, relative — resolved against `metadataBase`, so the
  // domain cutover stays one environment variable (3.23, B2).
  alternates: { canonical: "/arhiva" },
  title: "Архива по сезони",
  description:
    "Секоја сезона од историјата на ФК Беласица, подредена по деценија — неофицијална архива.",
};

/**
 * Seasons for the index. Per season we need only `title`, `slug`, `decade` and
 * the **lead photo** — the rest of the model belongs to the detail page.
 *
 * The lead photo is the season's curated **`teamPhoto`** (D-3.04b-2). That
 * reference is what 3.01 modelled and 3.02/3.04-Cowork filled precisely so a
 * curator could choose each season's face, and until now this page ignored it:
 * it took `[0]` of the season's photos ordered by `coalesce(date,"9999") asc`,
 * which on this data is arbitrary — 886 of the 889 photos have no `date` — so
 * **69 of the 96 cards were showing something other than the chosen photo**
 * (a newspaper clipping, a table screenshot, a formation graphic). The season
 * page has read `teamPhoto` since 3.04, so index and detail disagreed too.
 *
 * The old back-reference stays as the **fallback** for the 13 seasons that have
 * no `teamPhoto`, but now ordered by the deterministic 2.08 key (a non-empty
 * caption first — the curator's other lever — then date, then `_id` as a stable
 * total order, D-2.08-3) rather than the unstable date-only key.
 *
 * **3.23 (A2/P2): the fallback now excludes `tablePhoto` as well**, mirroring the
 * exclusion the detail page has applied since D-3.04-2. Without it the fallback
 * matched *every* photo back-referencing the season, so a season with no
 * `teamPhoto` but with a league-table screenshot could lead its card with that
 * screenshot — measured on **5 of the 96** cards (`1931-32`, `1932-33`,
 * `1935-36`, `1936-37`, `1952`), and on `1932-33` the table scan is the season's
 * only photo, so it won every time. `^.teamPhoto._ref` in the list is a no-op
 * (this branch only runs when `teamPhoto` is null) and is kept so the two
 * queries read as the same rule (D-3.23-10).
 *
 * Ordering is `slug.current desc`, not `title` (D-2.02-2): every slug starts
 * with a 4-digit year (`1992-93`, `1950`, `1922-26`), so lexical desc is
 * chronological desc for all folder shapes, whereas titles are not uniform
 * („Беласица 1922–1926" vs „Сезона 1950") and would sort wrongly.
 *
 * 96 seasons × 1 image is comfortably one query; the page is static + ISR.
 */
const ARCHIVE_QUERY = /* groq */ `
*[_type == "season" && defined(slug.current) && defined(decade)]
  | order(decade desc, slug.current desc){
    title,
    "slug": slug.current,
    decade,
    "leadPhoto": coalesce(
      teamPhoto->{ "image": image, caption },
      *[_type == "photo" && relatedSeason._ref == ^._id
          && !(_id in [^.teamPhoto._ref, ^.tablePhoto._ref])]
        | order(
            select(defined(caption) && caption != "" => 0, 1) asc,
            coalesce(date, "9999") asc,
            _id asc
          )[0]{
          "image": image,
          caption
        }
    )
  }`;

type ArchiveSeason = {
  title: string | null;
  slug: string;
  decade: number;
  leadPhoto: { image: SanityImageSource | null; caption: string | null } | null;
};

/** Group the already-ordered seasons by decade, preserving query order. A
 *  decade with no seasons simply never appears — there is no „0 сезони" state
 *  and nothing to jump to (§7). */
function groupByDecade(seasons: ArchiveSeason[]) {
  const groups = new Map<number, SeasonCardData[]>();
  for (const season of seasons) {
    // `title` is required in the model, but a document could still be published
    // without one; such a season has nothing to label a card with, so it is not
    // listed rather than shown as a card with an invented name.
    if (!season.title) continue;
    const list = groups.get(season.decade) ?? [];
    list.push({
      title: season.title,
      slug: season.slug,
      decade: season.decade,
      leadPhoto: season.leadPhoto,
    });
    groups.set(season.decade, list);
  }
  return [...groups.entries()].map(([decade, seasons]) => ({
    decade,
    seasons,
  }));
}

export default async function ArchivePage() {
  // Retried, then loud (3.23, C3). No try/catch here by design — this page has
  // always failed loudly, and that is correct: an archive index that quietly
  // renders „no seasons" is worse than a build that stops. The helper adds five
  // bounded attempts before that failure, so one transient CDN timeout no
  // longer kills a deploy (D-3.02F-C-2's measured numbers).
  const seasons = await fetchOrThrow<ArchiveSeason[]>(
    ARCHIVE_QUERY,
    {},
    "the archive index",
  );
  const decades = groupByDecade(seasons ?? []);
  const total = decades.reduce((sum, d) => sum + d.seasons.length, 0);

  return (
    <>
      <PageHeader
        title="Архива по сезони"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "Архива" }]}
        // Structural copy — describes the page, claims no fact about the club.
        intro="Секоја сезона од историјата на клубот, подредена по деценија — од најновата наназад."
        // Both numbers are counted from published documents — truthful, never
        // invented. Omitted entirely at zero.
        meta={
          total > 0
            ? `${seasonCountLabel(total)} · ${decadeCountLabel(decades.length)}`
            : undefined
        }
      />

      {total === 0 ? (
        <Container className="py-section">
          <PlaceholderChip label="сезони — сѐ уште не се објавени" />
        </Container>
      ) : (
        <>
          <DecadeJumpNav decades={decades.map((d) => d.decade)} />

          {decades.map(({ decade, seasons }, decadeIndex) => {
            const headingId = `${decadeAnchor(decade)}-heading`;
            return (
              <section
                key={decade}
                id={decadeAnchor(decade)}
                aria-labelledby={headingId}
                // Scroll clearance is no longer set here: the scroller's
                // `scroll-padding-top` (globals.css) carries it for jump links,
                // `scrollIntoView()` and keyboard focus alike (SC 2.4.11).
                className="py-section"
              >
                <Container>
                  <Reveal>
                    <DecadeSectionHeader
                      decade={decade}
                      count={seasons.length}
                      headingId={headingId}
                    />
                  </Reveal>
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {seasons.map((season, i) => (
                      <SeasonCard
                        key={season.slug}
                        season={season}
                        delayIndex={i % 3}
                        // The one priority image on this template: the first
                        // card of the newest decade, which the Lighthouse
                        // trace named as the LCP element (D-3.09-2).
                        priority={decadeIndex === 0 && i === 0}
                      />
                    ))}
                  </ul>
                </Container>
              </section>
            );
          })}
        </>
      )}
    </>
  );
}
