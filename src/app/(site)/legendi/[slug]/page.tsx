import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { Container } from "@/components/Container";
import { Breadcrumb } from "@/components/archive/Breadcrumb";
import { PhotoGrid, type ArchivePhoto } from "@/components/archive/PhotoGrid";
import { SeasonStory } from "@/components/archive/SeasonStory";
import { SectionHeading } from "@/components/archive/SectionHeading";
import { PersonHero } from "@/components/legends/PersonHero";
import { Reveal } from "@/components/home/Reveal";
import { focusOnPaper } from "@/lib/focus";
import { orderedRoles } from "@/lib/people";
import { cn } from "@/lib/utils";

// Match the archive (D-1.05-4): a bio or career total entered in Studio appears
// within ~a minute, without a redeploy.
export const revalidate = 60;

type SeasonRef = { title: string | null; slug: string | null };

/**
 * The person, their photos by back-reference (`photo.relatedPerson`, D-2.01-1 —
 * there is no `person.photos` array), and the seasons they appear in.
 *
 * `careerStats` is read **directly** and never summed from `season.squad`
 * (D-2.01-3): the squad rows are per-season detail, and adding them up would
 * fabricate a career total out of whatever seasons happen to be published.
 *
 * Seasons match on **either** `squad[].player` or `trainers[]`. The handover §3
 * says „read from `season.squad`", which is true for players but would leave
 * every trainer's Сезони section empty even though the season page links
 * *to* them — the dead end this phase exists to remove (D-2.06-3). Both arms
 * read real references; neither invents a link.
 */
const PERSON_QUERY = /* groq */ `
*[_type == "person" && slug.current == $slug][0]{
  name,
  "slug": slug.current,
  role,
  playingYears,
  bio,
  careerStats{ appearances, goals },
  "portrait": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(coalesce(date, "9999") asc)[0].image,
  "photos": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(coalesce(date, "9999") asc){
      "id": _id,
      "image": image,
      caption,
      date
    },
  "seasons": *[_type == "season"
    && (^._id in squad[].player._ref || ^._id in trainers[]._ref)]
    | order(slug.current desc){
      title,
      "slug": slug.current
    }
}`;

type PersonData = {
  name: string | null;
  slug: string;
  role: string[] | null;
  playingYears: string | null;
  bio: PortableTextBlock[] | null;
  careerStats: { appearances: number | null; goals: number | null } | null;
  portrait: SanityImageSource | null;
  photos: ArchivePhoto[] | null;
  seasons: SeasonRef[] | null;
};

/**
 * Every published person — players, trainers and officials alike (§3). The
 * season and statistics pages already link every person here, so a trainer or
 * president slug must resolve rather than 404.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    /* groq */ `*[_type == "person" && defined(slug.current)].slug.current`,
  );
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = await client.fetch<{ name: string | null } | null>(
    /* groq */ `*[_type == "person" && slug.current == $slug][0]{ name }`,
    { slug },
  );
  if (!person) return {};
  return {
    title: person.name ?? "Личност",
    description: person.name
      ? `${person.name} — во неофицијалната архива на ФК Беласица.`
      : undefined,
  };
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let person: PersonData | null = null;
  try {
    person = await client.fetch<PersonData | null>(PERSON_QUERY, { slug });
  } catch {
    // A failed read must not crash the route or invent filler. There is nothing
    // truthful to show for this slug right now, so it 404s.
    person = null;
  }

  if (!person) notFound();

  const roles = orderedRoles(person.role);
  const bio = person.bio ?? [];
  const photos = person.photos ?? [];
  const seasons = (person.seasons ?? []).filter(
    (season): season is { title: string; slug: string } =>
      season.title != null && season.slug != null,
  );

  // The no-`0` rule (§3, from 2.04): a metric that was never entered is
  // **omitted**, never coerced to 0 — „0 голови" is a claim, not a gap. A
  // genuine 0 is a real value and survives (a defender really can score none),
  // which is why these test `!= null` rather than falsiness.
  const appearances = person.careerStats?.appearances ?? null;
  const goals = person.careerStats?.goals ?? null;
  const careerFigures = [
    appearances != null && { label: "Настапи", value: String(appearances) },
    goals != null && { label: "Голови", value: String(goals) },
  ].filter((figure): figure is { label: string; value: string } => !!figure);

  const hasBio = bio.length > 0;
  const hasCareer = careerFigures.length > 0;
  const hasSeasons = seasons.length > 0;
  const hasPhotos = photos.length > 0;

  // Section cadence: `border-t border-mist` + `py-16 md:py-24`. The rule is
  // dropped on the first section **only when the hero is the navy band**, which
  // already terminates that band — the same reasoning as the season page. The
  // portrait hero sits on paper, so the first section keeps its rule to
  // separate the two.
  const order = [
    hasBio && "bio",
    hasCareer && "career",
    hasSeasons && "seasons",
    hasPhotos && "photos",
    "backlinks",
  ].filter((key): key is string => typeof key === "string");

  const sectionClass = (key: string) =>
    cn(
      "py-16 md:py-24",
      !(key === order[0] && !person.portrait) && "border-t border-mist",
    );

  return (
    <>
      {/* Breadcrumb on paper, above the hero (D-2.02-5) — one treatment that
          works for both the portrait and the navy-band hero. */}
      <Container className="py-5">
        <Breadcrumb
          items={[
            { label: "Почетна", href: "/" },
            { label: "Легенди", href: "/legendi" },
            { label: person.name, placeholder: "име на личноста" },
          ]}
        />
      </Container>

      <PersonHero
        name={person.name}
        roles={roles}
        playingYears={person.playingYears}
        portrait={person.portrait}
      />

      {/* Every section below omits itself when empty (§3) — no heading, no
          placeholder prose. A trainer with only a name is still a complete,
          non-404 page: breadcrumb + hero + back-links. */}
      {hasBio && (
        <section aria-labelledby="bio-heading" className={sectionClass("bio")}>
          <Container>
            <Reveal>
              <SectionHeading id="bio-heading">Биографија</SectionHeading>
              <div className="mt-8">
                {/* `SeasonStory` is the project's Portable Text renderer —
                    same measure, paragraph rhythm and blockquote/link styles
                    the season narrative uses (§3). */}
                <SeasonStory blocks={bio} />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {hasCareer && (
        <section
          aria-labelledby="career-heading"
          className={sectionClass("career")}
        >
          <Container>
            <Reveal>
              <SectionHeading id="career-heading">Кариера</SectionHeading>
              {/* The `BalanceSummary` visual language (§3): white tiles on a
                  mist grid, overline label, serif navy figure. Not the
                  component itself — it takes a `ClubBalance` and is shaped for
                  ten fixed columns, and generalising it would mean refactoring
                  a stats component this phase must not touch. */}
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-card border border-mist bg-mist">
                {careerFigures.map((figure) => (
                  <div key={figure.label} className="bg-white px-4 py-5">
                    <dt className="text-overline uppercase tracking-overline text-neutral-700">
                      {figure.label}
                    </dt>
                    <dd className="mt-2 font-serif text-h3 font-semibold text-navy tabular-nums">
                      {figure.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      )}

      {hasSeasons && (
        <section
          aria-labelledby="seasons-heading"
          className={sectionClass("seasons")}
        >
          <Container>
            <Reveal>
              <SectionHeading id="seasons-heading">Сезони</SectionHeading>
              {/* `PersonChip`-style (§3), but pointing at `/arhiva/<slug>`
                  rather than `/legendi/<slug>` — `PersonChip` hardcodes the
                  person route and its own „име на тренер" placeholder, so it
                  cannot be reused here without changing an archive component
                  this phase must not touch. */}
              <ul className="mt-8 flex flex-wrap gap-3">
                {seasons.map((season) => (
                  <li key={season.slug}>
                    <Link
                      href={`/arhiva/${season.slug}`}
                      className={`group inline-flex items-center gap-2 rounded-chip border border-mist bg-white px-3.5 py-2 text-small font-medium text-navy ${focusOnPaper}`}
                    >
                      {/* Marker only — the label stays navy (D-1.02-1). */}
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-orange"
                      />
                      <span className="decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
                        {season.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>
      )}

      {hasPhotos && (
        <section
          aria-labelledby="photos-heading"
          className={sectionClass("photos")}
        >
          <Container>
            <Reveal>
              <SectionHeading id="photos-heading">Фотографии</SectionHeading>
            </Reveal>
            <div className="mt-8">
              <PhotoGrid photos={photos} />
            </div>
          </Container>
        </section>
      )}

      {/* Back-links — navigation, not content. Always present: on a person with
          no bio, career, seasons or photos this is the only thing under the
          hero, and it keeps the page from ending at the footer. */}
      <section
        aria-label="Навигација низ архивата"
        className={sectionClass("backlinks")}
      >
        <Container>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                href="/legendi"
                className={`text-small text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
              >
                Сите легенди
              </Link>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
