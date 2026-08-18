import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImageSource } from "@sanity/image-url";
import { fetchOrThrow } from "@/sanity/fetch";
import { framedImage } from "@/sanity/frame";
import { SITE_URL } from "@/lib/site";
import { Container } from "@/components/Container";
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
 * **`legendAppearances` joins it at 3.23 (A2/P2).** It is the book's printed
 * figure and is a *string* because for some players the book prints a range
 * („120–135", D-3.15-4). `LegendCard` has rendered it in preference to
 * `careerStats.appearances` since 3.19, but this query never selected it — so
 * **19 men whose only appearance figure is the book's showed a count on
 * /legendi and nothing in Кариера on their own page.** That is exactly the
 * D-3.19-3 shape (one page describing a man differently from another) mirrored
 * onto the person template, and it is fixed by reading the same two fields with
 * the same precedence rather than by copying one into the other — the two have
 * different recorded provenance and OV-39 is still open (D-3.23-12).
 *
 * **Photo ordering, same phase.** `order(coalesce(date,"9999") asc)` did NOT put
 * undated photos last: `photo.date` is free text (schema: „Слободен текст — на
 * пр. „околу 1985""), and live values include `April 2, 2026` and `околу 2002`.
 * String-compared, the `"9999"` sentinel sorts *before* any letter- or
 * Cyrillic-leading value ('9' < 'A' < 'о'), so an undated photo beat a dated one
 * and won the portrait slot on 4 people. An explicit definedness rank makes
 * „undated last" independent of what the text happens to start with — the key
 * the homepage and the season gallery already moved to (D-2.08-3 / D-3.04-2).
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
  trainerYears,
  officialYears,
  legendAppearances,
  bio,
  careerStats{ appearances, goals },
  nationalStats{ appearances, goals, sourceNote },
  "portrait": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(select(defined(date) => 0, 1) asc, coalesce(date, "9999") asc, _id asc)[0].image,
  "photos": *[_type == "photo" && relatedPerson._ref == ^._id]
    | order(select(defined(date) => 0, 1) asc, coalesce(date, "9999") asc, _id asc){
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
  /** The coaching and service spans (3.27). This page is the one place a man's
   *  WHOLE record belongs, so all three spans render here where present — each
   *  under its own label, so „1982–1990" can never be read as when he coached. */
  trainerYears: string | null;
  officialYears: string | null;
  /** The book's printed appearance figure — a STRING, because for some players
   *  the book prints a range rather than a number (D-3.15-4). */
  legendAppearances: string | null;
  bio: PortableTextBlock[] | null;
  /** BELASICA only, and authoritative (D-2.01-3). */
  careerStats: { appearances: number | null; goals: number | null } | null;
  /** The WHOLE career — every club plus the national team, from public records
   *  (3.27). A different scope from a different source, so it is rendered under
   *  its own label and `sourceNote` travels with it. Never summed with
   *  `careerStats` and never substituted for it (OV-47). */
  nationalStats: {
    appearances: number | null;
    goals: number | null;
    sourceNote: string | null;
  } | null;
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
  const slugs = await fetchOrThrow<string[]>(
    /* groq */ `*[_type == "person" && defined(slug.current)].slug.current`,
    {},
    "the person slug list (generateStaticParams)",
  );
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const person = await fetchOrThrow<{ name: string | null } | null>(
    /* groq */ `*[_type == "person" && slug.current == $slug][0]{ name }`,
    { slug },
    `person „${slug}" (metadata)`,
  );
  if (!person) return {};
  return {
    // From the slug, so it always matches the route (3.23, B2).
    alternates: { canonical: `/legendi/${slug}` },
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

  // Retried, then loud (D-3.02F-C-1) — see the season template for the full
  // reasoning. With 160 people the old silent-404-on-timeout was the likeliest
  // way for this archive to lose a page without anyone noticing.
  const person = await fetchOrThrow<PersonData | null>(
    PERSON_QUERY,
    { slug },
    `person „${slug}"`,
  );

  if (!person) notFound();

  const roles = orderedRoles(person.role);
  // Resolved once, on the server: the hero renders it and the `Person` node
  // below carries the same URL, so the two can never point at different images.
  const portraitUrl = framedImage(person.portrait, 800)?.src ?? null;
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

  // The SAME precedence `LegendCard` uses (LegendCard.tsx — the book's printed
  // figure first, the compiled career total as the fallback), so a man's card on
  // /legendi and his own page can no longer state different appearance counts
  // (3.23, A2/P2). Nothing is copied between the two fields: they carry
  // different recorded provenance and OV-39 is still open.
  const appearancesLabel =
    person.legendAppearances?.trim() ||
    (appearances != null ? String(appearances) : null);

  /**
   * **Кариера is three labelled groups since 3.27**, because this page now holds
   * two sets of numbers with different scopes and different sources, and an
   * unlabelled grid of four figures would have told the reader nothing about
   * which was which — the defect recorded as OV-47.
   *
   * Each group self-omits, so a man with only Belasica figures gets exactly the
   * grid he got before, under a „Беласица" label. Nothing is ever summed across
   * the groups and neither set of numbers falls back to the other: they are
   * separate claims from separate records and are printed as such.
   */
  const belasicaFigures = [
    appearancesLabel != null && { label: "Настапи", value: appearancesLabel },
    goals != null && { label: "Голови", value: String(goals) },
  ].filter((figure): figure is { label: string; value: string } => !!figure);

  // `!= null`, never falsiness — a recorded 0 is a real figure and survives, on
  // this page exactly as on the card.
  const nationalAppearances = person.nationalStats?.appearances ?? null;
  const nationalGoals = person.nationalStats?.goals ?? null;
  const wholeCareerFigures = [
    nationalAppearances != null && {
      label: "Настапи",
      value: String(nationalAppearances),
    },
    nationalGoals != null && { label: "Голови", value: String(nationalGoals) },
  ].filter((figure): figure is { label: string; value: string } => !!figure);

  // Where the whole-career numbers came from. Rendered only beside them, never
  // on its own: a source note with no figure to source is not a fact about the
  // man, and never beside the Belasica figures, whose provenance is the club's
  // own records.
  const sourceNote = person.nationalStats?.sourceNote?.trim() || null;

  /**
   * The role-scoped spans. `playingYears` is NOT among them: it is already the
   * hero's own line, directly under the role chips, and repeating it here would
   * state the same period twice on one page.
   *
   * These two exist because a coach's years and a president's term had nowhere
   * to live before 3.27, so the only span the page could show was a playing one
   * — which on a man who is on the page for his coaching is the wrong fact under
   * the right heading. Both are empty across all 211 people until the Cowork
   * content pass, and an empty span omits its tile rather than showing a dash.
   */
  const spanFigures = [
    person.trainerYears?.trim() && {
      label: "Тренер",
      value: person.trainerYears.trim(),
    },
    person.officialYears?.trim() && {
      label: "Раководство",
      value: person.officialYears.trim(),
    },
  ].filter((figure): figure is { label: string; value: string } => !!figure);

  const hasBio = bio.length > 0;
  const hasCareer =
    belasicaFigures.length > 0 ||
    wholeCareerFigures.length > 0 ||
    spanFigures.length > 0;
  const hasSeasons = seasons.length > 0;
  const hasPhotos = photos.length > 0;

  /**
   * `Person` structured data (3.23, B6) — deliberately three fields and no more.
   *
   * **No `jobTitle`.** It is the obvious thing to derive from `role`, and it is
   * exactly what must not be published: OV-35 records that nobody has checked
   * whether all 28 people in the Претседатели category were actually club
   * presidents, so a machine-readable „jobTitle: President" would assert at
   * scale a claim the archive has never verified. The same reasoning rules out
   * `nationality`, `birthDate`, `worksFor` and any team affiliation — none is a
   * verified fact for these 211 people, and `athlete`/`memberOf` would also
   * imply the club relationship `/pravni-informacii` §1 denies.
   *
   * Emitted only when the person has a name: a `Person` node whose `name` is a
   * placeholder is worse than no node.
   */
  const personJsonLd = person.name
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: person.name,
        url: `${SITE_URL}/legendi/${person.slug}`,
        // The same portrait the hero renders, resolved on the server through
        // the one seam that owns `@sanity/image-url` (D-3.09-1). Omitted
        // entirely where there is none — most trainers and officials get the
        // monogram plate, which is a brand element and not a photograph of them.
        ...(portraitUrl ? { image: portraitUrl } : {}),
      })
    : null;

  // Section cadence: a mist rule + `py-section`. The rule is dropped on the
  // first section, because the hero is now always the navy block and that
  // colour change already terminates it — the same reasoning as the season
  // page (brand.md: a block boundary is a colour change, not a border).
  const order = [
    hasBio && "bio",
    hasCareer && "career",
    hasSeasons && "seasons",
    hasPhotos && "photos",
    "backlinks",
  ].filter((key): key is string => typeof key === "string");

  const sectionClass = (key: string) =>
    cn("py-section", key !== order[0] && "border-t border-mist");

  return (
    <>
      {personJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
      )}

      {/* The breadcrumb rides inside the hero block (D-2.02-5): one treatment
          for both the portrait and the monogram variant, both now on navy. */}
      <PersonHero
        name={person.name}
        roles={roles}
        playingYears={person.playingYears}
        portrait={person.portrait}
        crumbs={[
          { label: "Почетна", href: "/" },
          { label: "Легенди", href: "/legendi" },
          { label: person.name, placeholder: "име на личноста" },
        ]}
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

              {/* Three self-omitting groups, each stating its own scope. The
                  Belasica figures and the whole-career figures are never placed
                  in one grid: two „Настапи" tiles side by side with no scope
                  between them is precisely the ambiguity this phase removes. */}
              <div className="mt-8 flex flex-col gap-8">
                <FigureGroup
                  label="Беласица"
                  figures={belasicaFigures}
                  // The club's own records — the authoritative Belasica total
                  // (D-2.01-3). No source note: the archive IS the source.
                />

                <FigureGroup
                  label="За репрезентацијата"
                  figures={wholeCareerFigures}
                  note={sourceNote}
                />

                <FigureGroup label="Периоди" figures={spanFigures} />
              </div>
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
                      className={`group inline-flex items-center gap-2 border border-mist bg-white px-3.5 py-2 text-small font-bold text-navy ${focusOnPaper}`}
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
                className={`u-link text-navy ${focusOnPaper}`}
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

/**
 * One labelled group inside Кариера (3.27) — a scope label, a tile grid, and an
 * optional source note under it.
 *
 * **The label is the point.** This page carries two sets of figures that share
 * the same nouns („Настапи", „Голови") and do not share a scope or a source: the
 * club's own Belasica records, and a whole-career total compiled from public
 * ones. Printing them in a single grid would produce four tiles whose meaning a
 * reader could not recover, which is the defect on the register as OV-47. Each
 * group therefore states what it is, and nothing is ever summed across them.
 *
 * **Self-omitting**, like every section on this page: a group with no figures
 * renders nothing at all — no label, no empty grid, no dash and no placeholder
 * chip. Today that is the normal case for two of the three groups, because 3.27
 * creates the fields and enters no data into them.
 *
 * The tile treatment is unchanged — the `BalanceSummary` visual language (§3),
 * white tiles on a mist grid with an overline label and a serif navy figure — so
 * a man who only has Belasica figures sees exactly the grid he saw before, now
 * with its scope named above it.
 */
function FigureGroup({
  label,
  figures,
  note = null,
}: {
  label: string;
  figures: { label: string; value: string }[];
  /** Provenance for the figures in THIS group, rendered only where the group has
   *  both a note and figures to source. */
  note?: string | null;
}) {
  if (figures.length === 0) return null;

  return (
    <div>
      {/* Navy and overline-sized, so it reads as a level above the tiles' own
          neutral labels without introducing a heading into the section's
          outline — the `<h2>` „Кариера" is the section's only heading. */}
      <p className="text-overline font-bold uppercase tracking-overline text-navy">
        {label}
      </p>

      <dl className="mt-3 grid max-w-md grid-cols-2 gap-px overflow-hidden border border-mist bg-mist">
        {figures.map((figure) => (
          <div key={figure.label} className="bg-white px-4 py-5">
            <dt className="text-overline uppercase tracking-overline text-neutral-700">
              {figure.label}
            </dt>
            <dd className="mt-2 u-h3 tabular-nums text-navy">{figure.value}</dd>
          </div>
        ))}
      </dl>

      {note && (
        <p className="mt-3 max-w-md text-small text-neutral-700">{note}</p>
      )}
    </div>
  );
}
