import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { DecadeJumpNav } from "@/components/archive/DecadeJumpNav";
import { DecadeSectionHeader } from "@/components/archive/DecadeSectionHeader";
import { SeasonCard, type SeasonCardData } from "@/components/archive/SeasonCard";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { decadeAnchor, decadeCountLabel, seasonCountLabel } from "@/lib/archive";

// Match the homepage (D-1.05-4): hand-curated seasons appear on the site within
// ~a minute of publishing, without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
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
      *[_type == "photo" && relatedSeason._ref == ^._id]
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
  return [...groups.entries()].map(([decade, seasons]) => ({ decade, seasons }));
}

export default async function ArchivePage() {
  const seasons = await client.fetch<ArchiveSeason[]>(ARCHIVE_QUERY);
  const decades = groupByDecade(seasons ?? []);
  const total = decades.reduce((sum, d) => sum + d.seasons.length, 0);

  return (
    <>
      <Container className="py-5">
        <Breadcrumb
          items={[
            { label: "Почетна", href: "/" },
            { label: "Архива" },
          ]}
        />
      </Container>

      <Container className="pb-12">
        <h1 className="font-serif text-h1 font-semibold text-navy md:text-display">
          Архива по сезони
        </h1>
        {/* Structural copy — describes the page, claims no fact about the club. */}
        <p className="mt-4 max-w-measure text-body-l text-neutral-700">
          Секоја сезона од историјата на клубот, подредена по деценија — од
          најновата наназад.
        </p>
        {total > 0 && (
          // Both numbers are counted from published documents — truthful, never
          // invented. Omitted entirely at zero.
          <p className="mt-4 text-small text-neutral-500">
            {seasonCountLabel(total)} · {decadeCountLabel(decades.length)}
          </p>
        )}
      </Container>

      {total === 0 ? (
        <Container className="pb-16 md:pb-24">
          <PlaceholderChip label="сезони — сѐ уште не се објавени" />
        </Container>
      ) : (
        <>
          <DecadeJumpNav decades={decades.map((d) => d.decade)} />

          {decades.map(({ decade, seasons }) => {
            const headingId = `${decadeAnchor(decade)}-heading`;
            return (
              <section
                key={decade}
                id={decadeAnchor(decade)}
                aria-labelledby={headingId}
                // Clear BOTH sticky bars when jumped to: the site header
                // (`--spacing-header`) plus the jump-nav's own height, or the
                // heading lands underneath them.
                className="scroll-mt-[calc(var(--spacing-header)+3.25rem)] border-t border-mist py-16 first:border-t-0 md:py-24"
              >
                <Container>
                  <Reveal>
                    <DecadeSectionHeader
                      decade={decade}
                      count={seasons.length}
                      headingId={headingId}
                    />
                  </Reveal>
                  <ul className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {seasons.map((season, i) => (
                      <SeasonCard
                        key={season.slug}
                        season={season}
                        delayIndex={i % 3}
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
