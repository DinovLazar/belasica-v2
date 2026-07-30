import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { fetchOrThrow } from "@/sanity/fetch";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { MattedPhoto, type LeadPhoto } from "@/components/archive/MattedPhoto";
import { PhotoGrid, type ArchivePhoto } from "@/components/archive/PhotoGrid";
import {
  SeasonAnchorNav,
  type SeasonAnchor,
} from "@/components/archive/SeasonAnchorNav";
import { SeasonEmptyNotice } from "@/components/archive/SeasonEmptyNotice";
import {
  SeasonNeighbourNav,
  type SeasonNeighbour,
} from "@/components/archive/SeasonNeighbourNav";
import { SeasonRecordList } from "@/components/archive/SeasonRecordList";
import { SeasonSectionEmpty } from "@/components/archive/SeasonSectionEmpty";
import { SeasonStory } from "@/components/archive/SeasonStory";
import { SectionHeading } from "@/components/archive/SectionHeading";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { decadeAnchor, decadeLabel } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

// Match the homepage (D-1.05-4): hand-curated season content appears without a
// redeploy. The Cowork content pass is filling `results` season by season, so
// each one surfaces here on its own within ~a minute of publish.
export const revalidate = 60;

/* ------------------------------------------------------------------ *
 * The season document, in one round trip (Phase 3.04).
 *
 *  - `teamPhoto` / `tablePhoto` are references (D-3.01-3) and are
 *    dereferenced here along with the asset's intrinsic dimensions, which
 *    `MattedPhoto` needs to mat each scan at its own aspect (D-3.04-3).
 *  - `gallery` is the season's remaining photos by back-reference
 *    (`photo.relatedSeason`, D-2.01-1 — there is no `season.photos` array),
 *    with the two lead photos excluded by `_id` so nothing appears twice
 *    (D-3.04-2). Ordering is the deterministic 2.08 key: a non-empty caption
 *    first (the editor's curation lever), then date, then `_id` as a stable
 *    total order (D-2.08-3).
 *  - `previousSeason` / `nextSeason` walk the archive spine by
 *    `decade`, then `slug.current` — the slug key the archive index already
 *    orders by (D-2.02-2). Ordering by `title` (as the brief says) puts
 *    „Беласица 1945–1948“ before „Сезона 1940/41“, because Б sorts before С;
 *    the slug key is chronologically correct for all 96 seasons (D-3.04-1).
 *  - The legacy `finalTable` / `squad` / `trainers` are deliberately NOT read:
 *    the table is now an image (D-3.01-2) and the squad lives in
 *    `lineupAndStats` (D-3.04-6).
 * ------------------------------------------------------------------ */
const LEAD_PHOTO_PROJECTION = /* groq */ `{
    "image": image,
    caption,
    date,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }`;

const SEASON_QUERY = /* groq */ `
*[_type == "season" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  decade,
  trainer,
  lineupAndStats,
  results,
  story,
  "teamPhoto": teamPhoto->${LEAD_PHOTO_PROJECTION},
  "tablePhoto": tablePhoto->${LEAD_PHOTO_PROJECTION},
  "gallery": *[_type == "photo"
      && relatedSeason._ref == ^._id
      && !(_id in [^.teamPhoto._ref, ^.tablePhoto._ref])]
    | order(
        select(defined(caption) && caption != "" => 0, 1) asc,
        coalesce(date, "9999") asc,
        _id asc
      ){
      "id": _id,
      "image": image,
      caption,
      date,
      // The intrinsic dimensions the lightbox's next/image needs for the
      // scan's true aspect (3.05b). Projected here, on the server — the client
      // overlay receives plain data and never touches Sanity.
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height
    },
  "previousSeason": *[_type == "season" && defined(slug.current)
      && (decade < ^.decade
          || (decade == ^.decade && slug.current < ^.slug.current))]
    | order(decade desc, slug.current desc)[0]{
      title,
      "slug": slug.current
    },
  "nextSeason": *[_type == "season" && defined(slug.current)
      && (decade > ^.decade
          || (decade == ^.decade && slug.current > ^.slug.current))]
    | order(decade asc, slug.current asc)[0]{
      title,
      "slug": slug.current
    }
}`;

type SeasonData = {
  title: string | null;
  slug: string;
  decade: number | null;
  trainer: string | null;
  lineupAndStats: PortableTextBlock[] | null;
  results: PortableTextBlock[] | null;
  story: PortableTextBlock[] | null;
  teamPhoto: LeadPhoto | null;
  tablePhoto: LeadPhoto | null;
  gallery: ArchivePhoto[] | null;
  previousSeason: SeasonNeighbour | null;
  nextSeason: SeasonNeighbour | null;
};

/**
 * The five sections, in page order. Since 3.04b **every one of them renders on
 * every season page** (D-3.04b-1) — a section with no content shows `empty`
 * instead of vanishing — so the jump rail is the same five links everywhere and
 * two season pages can be compared side by side.
 *
 * `empty` is structural copy: it states what the archive does not hold, and
 * claims no fact about the club.
 */
const SECTIONS = {
  table: {
    id: "tabela",
    label: "Табела",
    heading: "Табела",
    empty: "Во архивата сѐ уште нема табела за оваа сезона.",
  },
  staff: {
    id: "trener",
    label: "Тренер",
    heading: "Тренер и статистика",
    empty:
      "Во архивата сѐ уште нема податоци за тренерот и составот во оваа сезона.",
  },
  results: {
    id: "rezultati",
    label: "Резултати",
    heading: "Резултати",
    empty: "Во архивата сѐ уште нема резултати од натпреварите во оваа сезона.",
  },
  story: {
    id: "prikazna",
    label: "Приказна",
    heading: "Приказна за сезоната",
    empty: "Во архивата сѐ уште нема напишана приказна за оваа сезона.",
  },
  gallery: {
    id: "fotografii",
    label: "Фотографии",
    heading: "Фотографии",
    empty: "Во архивата нема други фотографии од оваа сезона.",
  },
} as const;

type SectionKey = keyof typeof SECTIONS;

export async function generateStaticParams() {
  const slugs = await fetchOrThrow<string[]>(
    /* groq */ `*[_type == "season" && defined(slug.current)].slug.current`,
    {},
    "the season slug list (generateStaticParams)",
  );
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const season = await fetchOrThrow<{ title: string | null } | null>(
    /* groq */ `*[_type == "season" && slug.current == $slug][0]{ title }`,
    { slug },
    `season „${slug}" (metadata)`,
  );
  if (!season) return {};
  return {
    title: season.title ?? "Сезона",
    description: season.title
      ? `${season.title} — архивска страница во неофицијалната архива на ФК Беласица.`
      : undefined,
  };
}

export default async function SeasonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Retried, then loud (D-3.02F-C-1). The old `catch → season = null` turned a
  // transient CDN timeout into a *silent 404* for a season that exists — the
  // worst outcome of the three, because the build stays green and the archive
  // quietly loses a page. A genuinely unknown slug still resolves to `null`
  // without throwing, so real 404s are unaffected.
  const season = await fetchOrThrow<SeasonData | null>(
    SEASON_QUERY,
    { slug },
    `season „${slug}"`,
  );

  if (!season) notFound();

  const title = season.title;
  const decade = season.decade;

  // A reference can resolve to a photo whose asset is missing; treat that as
  // absent rather than rendering an empty frame.
  const teamPhoto = season.teamPhoto?.image ? season.teamPhoto : null;
  const tablePhoto = season.tablePhoto?.image ? season.tablePhoto : null;
  const trainer = season.trainer?.trim() || null;
  const lineup = season.lineupAndStats ?? [];
  const results = season.results ?? [];
  const story = season.story ?? [];
  const gallery = season.gallery ?? [];

  // Which sections have real content. Since 3.04b this no longer decides
  // whether a section RENDERS (they all do — D-3.04b-1); it decides whether the
  // section shows its content or its one-line empty note. Most of the 96
  // seasons are sparse in at least one field, and those are genuine source
  // gaps, not defects — the note says so rather than inventing filler.
  const present: Record<SectionKey, boolean> = {
    table: Boolean(tablePhoto),
    staff: Boolean(trainer) || lineup.length > 0,
    results: results.length > 0,
    story: story.length > 0,
    gallery: gallery.length > 0,
  };

  const order = Object.keys(SECTIONS) as SectionKey[];

  const anchors: SeasonAnchor[] = order.map((key) => ({
    id: SECTIONS[key].id,
    label: SECTIONS[key].label,
  }));

  // The one case that still collapses: a season with no lead photo AND nothing
  // in any of the five sections would otherwise stack five identical empty
  // notes. One archive notice reads better and is the established treatment
  // (D-2.02-8). No published season is in this state today — it is a guard.
  const isEmpty = !teamPhoto && !Object.values(present).some(Boolean);

  const hasNeighbours = Boolean(
    season.previousSeason?.slug || season.nextSeason?.slug,
  );

  // Section cadence (2.02 §4.2): `border-t border-mist` + `py-section`,
  // except the FIRST paper section — the navy band (or the anchor rail's own
  // bottom rule) already terminates that edge, so a rule there reads as a
  // stray line.
  const firstSection = isEmpty ? "empty" : order[0];
  const sectionClass = (key: string) =>
    cn(
      "scroll-mt-header py-section",
      key !== firstSection && "border-t border-mist",
    );

  return (
    <>
      {/* 1 · Title band + the season's lead photograph (D-3.04-4).
          Not revealed — it is above the fold (matches the homepage).

          The 2.02 hero cover-cropped the season's first photo full-bleed. That
          worked when the lead was one hand-picked image; `teamPhoto` is now a
          curated reference across 83 seasons whose scans run from 0.49 to 2.63
          in aspect, and a fixed 16:9 cover crop slices most of a portrait
          squad photo away. So the band carries the title, and the scan sits
          whole on a mist mat beneath it — mounted, not cropped. A season with
          no `teamPhoto` is the same band without the photo: a deliberate title
          band, never a greybox at hero scale (2.02 §6.2b). */}
      <section aria-labelledby="season-heading" className="bg-navy">
        {/* Without a photo the band is the whole lead, so it takes the taller
            padding 2.02 §6.2b specifies for the photo-less hero — a thin strip
            would read as a stray bar rather than a deliberate title band. */}
        <Container className="py-section">
          {/* The breadcrumb rides inside the block (D-2.02-5), as it does on
              every other page — one treatment for both hero variants. */}
          <Breadcrumb
            items={[
              { label: "Почетна", href: "/" },
              { label: "Архива", href: "/arhiva" },
              { label: title, placeholder: "наслов на сезоната" },
            ]}
            onNavy
          />

          <div className="mt-8 max-w-measure">
            {decade != null && (
              <SectionOverline variant="onNavy">
                {decadeLabel(decade)}
              </SectionOverline>
            )}
            <h1
              id="season-heading"
              className="mt-3 u-h1 text-paper"
            >
              {/* `title` is required in the model, so this should never fire —
                  but a document could still be published without one, and an
                  invented fallback („Сезона") would be a made-up name on an
                  archive page. Show the gap instead (content-truth). */}
              {title ?? <PlaceholderChip label="наслов на сезоната" />}
            </h1>
          </div>

          {teamPhoto && (
            <div className="mt-10 md:mt-14">
              <MattedPhoto
                photo={teamPhoto}
                alt={
                  teamPhoto.caption ||
                  (title
                    ? `Екипна фотографија на ФК Беласица — ${title}`
                    : "Екипна фотографија на ФК Беласица")
                }
                sizes="(min-width: 1280px) 1120px, (min-width: 768px) 88vw, 100vw"
                renderWidth={1600}
                maxHeightRem={40}
                priority
                tone="onNavy"
              />
            </div>
          )}
        </Container>
      </section>

      <SeasonAnchorNav anchors={isEmpty ? [] : anchors} />

      {isEmpty ? (
        <section className={sectionClass("empty")}>
          <Container>
            <Reveal>
              <SeasonEmptyNotice />
            </Reveal>
          </Container>
        </section>
      ) : (
        <>
          {/* 2 · Табела — the league table as an IMAGE (D-3.01-2), matching the
              reference site. The structured `finalTable` is legacy and is not
              rendered here. No height cap: a standings scan that cannot be read
              defeats the point of showing it. */}
          <section
            id={SECTIONS.table.id}
            aria-labelledby="table-heading"
            className={sectionClass("table")}
          >
            <Container>
              <Reveal>
                <SectionHeading id="table-heading">
                  {SECTIONS.table.heading}
                </SectionHeading>
              </Reveal>
              <Reveal delayIndex={1} className="mt-8">
                {tablePhoto ? (
                  <MattedPhoto
                    photo={tablePhoto}
                    // The standings are shown as a scan by owner decision
                    // (D-3.01-2) and 95 of 96 seasons have no typed table to
                    // fall back on, so no full text alternative can be built
                    // without inventing one. The alt therefore says exactly
                    // what the image is and where it comes from, and names the
                    // season, rather than pretending to convey the figures.
                    alt={
                      tablePhoto.caption ||
                      (title
                        ? `Фотографија од табелата за ${title}, скенирана од изворниот документ`
                        : "Фотографија од табелата на сезоната, скенирана од изворниот документ")
                    }
                    sizes="(min-width: 1280px) 1120px, (min-width: 768px) 88vw, 100vw"
                    renderWidth={1400}
                  />
                ) : (
                  <SeasonSectionEmpty note={SECTIONS.table.empty} />
                )}
              </Reveal>
            </Container>
          </section>

          {/* 3 · Тренер и статистика — the trainer name in the heading (the
              reference site's treatment), then the season's lineup/stats.
              The SECTION always renders (D-3.04b-1); its two halves still
              self-omit individually, so a season with a trainer but no roster
              shows the trainer and nothing else — one empty note per section,
              never two stacked inside one. */}
          <section
            id={SECTIONS.staff.id}
            aria-labelledby="staff-heading"
            className={sectionClass("staff")}
          >
            <Container>
              <Reveal>
                <SectionHeading id="staff-heading">
                  {SECTIONS.staff.heading}
                </SectionHeading>
              </Reveal>

              {!present.staff && (
                <Reveal delayIndex={1} className="mt-8">
                  <SeasonSectionEmpty note={SECTIONS.staff.empty} />
                </Reveal>
              )}

              {trainer && (
                  <Reveal delayIndex={1} className="mt-8">
                    {/* 2px orange LEFT-EDGE marker — the same marker the
                        standings row uses (D-2.02-4). The label and the name
                        both stay navy/neutral: orange on a white card is
                        3.1:1 and fails AA (D-1.02-1). */}
                    <div className="u-cap max-w-measure bg-white p-6 md:p-8">
                      {/* `text-h3`, not `text-h2` — an <h3> must not render at
                          its section <h2>'s size, or the type stops carrying
                          the hierarchy (brand.md §Typography). The card, the
                          orange edge and the muted label do the emphasis. */}
                      <h3 className="u-h3 text-navy">
                        <span className="font-normal text-neutral-500">
                          Тренер:{" "}
                        </span>
                        {trainer}
                      </h3>
                    </div>
                  </Reveal>
                )}

              {lineup.length > 0 && (
                <Reveal delayIndex={2} className="mt-10">
                  <h3 className="u-h3 text-navy">
                    Состав и статистика
                  </h3>
                  <SeasonRecordList
                    blocks={lineup}
                    variant="roster"
                    className="mt-5"
                  />
                </Reveal>
              )}
            </Container>
          </section>

          {/* 4 · Резултати — match by match. The Cowork content pass is filling
              this field season by season (10 of 96 at the time of writing), and
              ISR 60 surfaces each one here — section, jump-link and all —
              without a code change or a redeploy. */}
          <section
            id={SECTIONS.results.id}
            aria-labelledby="results-heading"
            className={sectionClass("results")}
          >
            <Container>
              <Reveal>
                <SectionHeading id="results-heading">
                  {SECTIONS.results.heading}
                </SectionHeading>
              </Reveal>
              <Reveal delayIndex={1} className="mt-8">
                {present.results ? (
                  <SeasonRecordList blocks={results} variant="results" />
                ) : (
                  <SeasonSectionEmpty note={SECTIONS.results.empty} />
                )}
              </Reveal>
            </Container>
          </section>

          {/* 5 · Приказна за сезоната — the documentary tail. */}
          <section
            id={SECTIONS.story.id}
            aria-labelledby="story-heading"
            className={sectionClass("story")}
          >
            <Container>
              <Reveal>
                <SectionHeading id="story-heading">
                  {SECTIONS.story.heading}
                </SectionHeading>
                <div className="mt-8">
                  {present.story ? (
                    <SeasonStory blocks={story} />
                  ) : (
                    <SeasonSectionEmpty note={SECTIONS.story.empty} />
                  )}
                </div>
              </Reveal>
            </Container>
          </section>

          {/* 6 · Фотографии — everything else linked to this season. The two
              lead photos are excluded in GROQ, so no photo appears twice
              (D-3.04-2, superseding D-2.02-6: the lead now carries its own
              caption, so excluding it hides no archive data). */}
          <section
            id={SECTIONS.gallery.id}
            aria-labelledby="photos-heading"
            className={sectionClass("gallery")}
          >
            <Container>
              <Reveal>
                <SectionHeading id="photos-heading">
                  {SECTIONS.gallery.heading}
                </SectionHeading>
              </Reveal>
              <div className="mt-8">
                {present.gallery ? (
                  // `lightbox` is opt-in and set only here (3.05b): a season's
                  // scans are the set worth opening full-size. The person
                  // page's grid is unchanged.
                  <PhotoGrid photos={gallery} lightbox />
                ) : (
                  <Reveal>
                    <SeasonSectionEmpty note={SECTIONS.gallery.empty} />
                  </Reveal>
                )}
              </div>
            </Container>
          </section>
        </>
      )}

      {/* 7 · Prev/next season + back-links — navigation, not content.
          The prev/next pair renders even on a fully-empty season: the archive
          spine is the one thing that must not break, and walking past a sparse
          season is exactly when it earns its keep. The back-links are omitted
          there instead, because the empty notice already ends with the same
          „Назад кон архивата" link (D-2.02-8). */}
      {(hasNeighbours || !isEmpty) && (
        <section
          aria-label="Навигација низ архивата"
          className="border-t border-mist py-section"
        >
          <Container>
            <Reveal>
              <SeasonNeighbourNav
                previous={season.previousSeason}
                next={season.nextSeason}
              />
            </Reveal>
            {!isEmpty && (
              <ul
                className={cn(
                  "flex flex-col gap-3",
                  hasNeighbours && "mt-10",
                )}
              >
                {decade != null && (
                  <li>
                    <Link
                      href={`/arhiva#${decadeAnchor(decade)}`}
                      className={`u-link text-navy ${focusOnPaper}`}
                    >
                      Сите сезони од {decadeLabel(decade)}
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/arhiva"
                    className={`u-link text-navy ${focusOnPaper}`}
                  >
                    Назад кон архивата
                  </Link>
                </li>
              </ul>
            )}
          </Container>
        </section>
      )}
    </>
  );
}
