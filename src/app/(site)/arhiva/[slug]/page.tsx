import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { PersonChip, type PersonRef } from "@/components/archive/PersonChip";
import { PhotoGrid, type ArchivePhoto } from "@/components/archive/PhotoGrid";
import { SeasonEmptyNotice } from "@/components/archive/SeasonEmptyNotice";
import { SeasonStory } from "@/components/archive/SeasonStory";
import { SectionHeading } from "@/components/archive/SectionHeading";
import {
  SquadTable,
  type SquadMember,
} from "@/components/archive/SquadTable";
import {
  StandingsTable,
  type StandingsRow,
} from "@/components/archive/StandingsTable";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { decadeAnchor, decadeLabel } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

// Match the homepage (D-1.05-4): hand-curated season content appears without a
// redeploy — the seasons are shells at first and are filled in over time.
export const revalidate = 60;

/**
 * The season, its people dereferenced, and its photos by back-reference
 * (`photo.relatedSeason`, D-2.01-1 — there is no `season.photos` array).
 * Photos order by `coalesce(date,"9999") asc`, the same key the homepage and
 * the archive index use; `[0]` is the hero.
 */
const SEASON_QUERY = /* groq */ `
*[_type == "season" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  decade,
  story,
  finalTable[]{
    position, club, played, wins, draws, losses, goalsFor, goalsAgainst, points
  },
  squad[]{
    appearances,
    goals,
    "name": player->name,
    "slug": player->slug.current
  },
  "trainers": trainers[]->{ name, "slug": slug.current },
  "photos": *[_type == "photo" && relatedSeason._ref == ^._id]
    | order(coalesce(date, "9999") asc){
      "id": _id,
      "image": image,
      caption,
      date
    }
}`;

type SeasonData = {
  title: string | null;
  slug: string;
  decade: number | null;
  story: PortableTextBlock[] | null;
  finalTable: StandingsRow[] | null;
  squad: SquadMember[] | null;
  trainers: PersonRef[] | null;
  photos: ArchivePhoto[] | null;
};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    /* groq */ `*[_type == "season" && defined(slug.current)].slug.current`,
  );
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const season = await client.fetch<{ title: string | null } | null>(
    /* groq */ `*[_type == "season" && slug.current == $slug][0]{ title }`,
    { slug },
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

  let season: SeasonData | null = null;
  try {
    season = await client.fetch<SeasonData | null>(SEASON_QUERY, { slug });
  } catch {
    // A failed read must not crash the route or invent filler. There is nothing
    // truthful to show for this slug right now, so it 404s (§10).
    season = null;
  }

  if (!season) notFound();

  const story = season.story ?? [];
  const finalTable = season.finalTable ?? [];
  const squad = season.squad ?? [];
  const trainers = season.trainers ?? [];
  const photos = season.photos ?? [];

  const heroPhoto = photos[0] ?? null;
  const decade = season.decade;

  // Every data-bearing section omits itself when empty (D-2.02-3) — no heading,
  // no placeholder prose. When ALL five are empty the sections would leave the
  // hero floating above the footer, so the page shows one archive notice
  // instead (D-2.02-8). This is the normal post-2.09 state, not an edge case.
  const hasStory = story.length > 0;
  const hasTable = finalTable.length > 0;
  const hasSquad = squad.length > 0;
  const hasTrainers = trainers.length > 0;
  const hasPhotos = photos.length > 0;
  const isEmpty =
    !hasStory && !hasTable && !hasSquad && !hasTrainers && !hasPhotos;

  const title = season.title;

  // Section cadence (§4.2): `border-t border-mist` + `py-16 md:py-24`, except
  // the FIRST section under the hero — the hero already terminates that band,
  // so a rule there would read as a stray line. Which section is first depends
  // on what this season actually has, so resolve it from the same flags that
  // decide what renders.
  const order = [
    isEmpty && "empty",
    hasStory && "story",
    hasTable && "table",
    hasSquad && "squad",
    hasTrainers && "trainers",
    hasPhotos && "photos",
    !isEmpty && "backlinks",
  ].filter((key): key is string => typeof key === "string");

  const sectionClass = (key: string) =>
    cn("py-16 md:py-24", key !== order[0] && "border-t border-mist");

  return (
    <>
      {/* Breadcrumb on paper, above the hero (D-2.02-5) — one treatment that
          works for both the photo and the photo-less hero. */}
      <Container className="py-5">
        <Breadcrumb
          items={[
            { label: "Почетна", href: "/" },
            { label: "Архива", href: "/arhiva" },
            { label: title, placeholder: "наслов на сезоната" },
          ]}
        />
      </Container>

      {/* Hero. Not revealed — it is above the fold (matches the homepage). */}
      <section aria-labelledby="season-heading" className="relative w-full">
        {heroPhoto?.image ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist md:aspect-[16/9]">
            <Image
              src={urlFor(heroPhoto.image).width(2000).auto("format").url()}
              alt={heroPhoto.caption || "Архивска фотографија на ФК Беласица"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-navy/95 via-navy/45 to-transparent"
            />
            <Container className="absolute inset-x-0 bottom-0">
              <SeasonHeroText title={title} decade={decade} />
            </Container>
          </div>
        ) : (
          // Photo-less hero: a solid navy band, never a greybox at hero scale
          // (D-2.02-2). It reads as a deliberate title band rather than as a
          // missing image — which matters, because most seasons have no photo.
          <div className="bg-navy py-16 md:py-24">
            <Container>
              <SeasonHeroText title={title} decade={decade} inBand />
            </Container>
          </div>
        )}
      </section>

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
          {hasStory && (
            <section aria-labelledby="story-heading" className={sectionClass("story")}>
              <Container>
                <Reveal>
                  <SectionHeading id="story-heading">
                    Приказна за сезоната
                  </SectionHeading>
                  <div className="mt-8">
                    <SeasonStory blocks={story} />
                  </div>
                </Reveal>
              </Container>
            </section>
          )}

          {hasTable && (
            <section aria-labelledby="table-heading" className={sectionClass("table")}>
              <Container>
                <Reveal>
                  <SectionHeading id="table-heading">
                    Конечна табела
                  </SectionHeading>
                  <div className="mt-8">
                    <StandingsTable
                      rows={finalTable}
                      seasonTitle={title ?? "сезоната"}
                    />
                  </div>
                </Reveal>
              </Container>
            </section>
          )}

          {hasSquad && (
            <section aria-labelledby="squad-heading" className={sectionClass("squad")}>
              <Container>
                <Reveal>
                  <SectionHeading id="squad-heading">Состав</SectionHeading>
                  <div className="mt-8 max-w-measure">
                    <SquadTable
                      members={squad}
                      seasonTitle={title ?? "сезоната"}
                    />
                  </div>
                </Reveal>
              </Container>
            </section>
          )}

          {hasTrainers && (
            <section aria-labelledby="trainers-heading" className={sectionClass("trainers")}>
              <Container>
                <Reveal>
                  <SectionHeading id="trainers-heading">Тренери</SectionHeading>
                  <ul className="mt-8 flex flex-wrap gap-3">
                    {trainers.map((trainer, i) => (
                      <PersonChip key={trainer.slug ?? i} person={trainer} />
                    ))}
                  </ul>
                </Reveal>
              </Container>
            </section>
          )}

          {hasPhotos && (
            <section aria-labelledby="photos-heading" className={sectionClass("photos")}>
              <Container>
                <Reveal>
                  <SectionHeading id="photos-heading">
                    Фотографии
                  </SectionHeading>
                </Reveal>
                <div className="mt-8">
                  {/* All photos, including the hero's (D-2.02-6) — the hero
                      shows no caption, so excluding [0] would hide its caption
                      and date for good. */}
                  <PhotoGrid photos={photos} />
                </div>
              </Container>
            </section>
          )}
        </>
      )}

      {/* Back-links — navigation, not content. Omitted on the fully-empty
          season: its notice already ends with the same back-link. */}
      {!isEmpty && (
      <section aria-label="Навигација низ архивата" className={sectionClass("backlinks")}>
        <Container>
          <ul className="flex flex-col gap-3">
            {decade != null && (
              <li>
                <Link
                  href={`/arhiva#${decadeAnchor(decade)}`}
                  className={`text-small text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
                >
                  Сите сезони од {decadeLabel(decade)}
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/arhiva"
                className={`text-small text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
              >
                Назад кон архивата
              </Link>
            </li>
          </ul>
        </Container>
      </section>
      )}
    </>
  );
}

/**
 * Hero overline + H1, shared by the photo and photo-less variants so the two
 * can never drift apart. Orange text is legal here and only here: on navy it
 * measures 4.6:1 and passes AA (D-1.02-1).
 */
function SeasonHeroText({
  title,
  decade,
  inBand = false,
}: {
  title: string | null;
  decade: number | null;
  inBand?: boolean;
}) {
  return (
    <div className={inBand ? "max-w-measure" : "max-w-measure pb-10 md:pb-16"}>
      {decade != null && (
        <SectionOverline variant="onNavy">{decadeLabel(decade)}</SectionOverline>
      )}
      <h1
        id="season-heading"
        className="mt-3 font-serif text-h1 font-semibold text-paper md:text-display"
      >
        {/* `title` is required in the model, so this should never fire — but a
            document could still be published without one, and an invented
            fallback („Сезона") would be a made-up name on an archive page.
            Show the gap instead (handover §2, content-truth). */}
        {title ?? <PlaceholderChip label="наслов на сезоната" />}
      </h1>
    </div>
  );
}
