import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Container } from "@/components/Container";
import { DecadeTimeline } from "@/components/home/DecadeTimeline";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";

// Re-read published Sanity content ~every 60s, so demo content published in
// /studio appears on the preview without a redeploy (Lazar publishes, then
// re-opens this URL for the Ace demo). See D-1.05-4.
export const revalidate = 60;

/* ------------------------------------------------------------------ *
 * Content — GROQ against the read client (published only, no token).
 * Reconciled to the LIVE content model (Phase 1.05.2, D-1.05.2-1); the
 * old schema files / query were out of date:
 *  - siteSettings: title, description (a full club paragraph).
 *  - season: title, slug, decade, story (Portable Text). Photos attach
 *    OUTWARD via photo.relatedSeason — we read them that way (robust and
 *    degrades gracefully) rather than via any season.photos field. D-1.05.2-2.
 *  - person: name, slug, role[], playingYears, bio. Portraits attach via
 *    photo.relatedPerson (there is no person.photos / careerStats).
 *  - photo: image, caption, date, provenance, relatedPerson, relatedSeason.
 * Selection: featured season = newest by decade then title (D-1.05-1);
 * legends = players only, by name (D-1.05.2-3); gallery = by date then
 * caption. Everything degrades to placeholders when a query returns nothing.
 * ------------------------------------------------------------------ */
const HOME_QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{ title, description },
  "featured": *[_type == "season" && defined(slug.current)]
    | order(decade desc, title desc)[0]{
      title,
      "slug": slug.current,
      decade,
      "teaserSpans": story[0].children[].text,
      "seasonPhotos": *[_type == "photo" && relatedSeason._ref == ^._id]{
        "image": image,
        caption,
        date
      } | order(coalesce(date, "9999") asc)
    },
  "legends": *[_type == "person" && "player" in role && defined(slug.current)]
    | order(name asc)[0...3]{
      name,
      "slug": slug.current,
      role,
      playingYears,
      "portrait": *[_type == "photo" && relatedPerson._ref == ^._id][0].image
    },
  "gallery": *[_type == "photo" && defined(image)]
    | order(coalesce(date, "9999") asc, caption asc)[0...10]{
      "id": _id,
      "image": image,
      caption,
      date
    },
  "decades": array::unique(*[_type == "season" && defined(decade)].decade)
}`;

type SeasonPhoto = {
  image: SanityImageSource | null;
  caption: string | null;
  date: string | null;
};

type HomeData = {
  settings: { title: string | null; description: string | null } | null;
  featured: {
    title: string | null;
    slug: string | null;
    decade: number | null;
    teaserSpans: (string | null)[] | null;
    seasonPhotos: SeasonPhoto[] | null;
  } | null;
  legends: {
    name: string | null;
    slug: string | null;
    role: string[] | null;
    playingYears: string | null;
    portrait: SanityImageSource | null;
  }[];
  gallery: {
    id: string;
    image: SanityImageSource | null;
    caption: string | null;
    date: string | null;
  }[];
  decades: number[];
};

const EMPTY: HomeData = {
  settings: null,
  featured: null,
  legends: [],
  gallery: [],
  decades: [],
};

// Role values → Cyrillic labels (person.role list in the schema).
const ROLE_LABEL: Record<string, string> = {
  player: "Играч",
  trainer: "Тренер",
  president: "Претседател",
};

// Structural (non-fact) copy. The wordmark ФК Беласица is VERIFIED (owner,
// 2026-07-15, OV-2); these lines describe what the archive is and make no
// factual claim about seasons, people, or stats.
const HERO_SUBHEAD =
  "Неофицијална архива на историјата на клубот — сезона по сезона.";
const INTRO_LEAD = "Историјата на клубот, собрана на едно место.";

// Section 8 — navigation cards. Labels/sublabels are structural navigation
// copy (what each section is), not factual claims — safe under content-truth.
const EXPLORE_CARDS: { href: string; label: string; sub: string }[] = [
  { href: "/arhiva", label: "Архива по сезони", sub: "Сезона по сезона" },
  { href: "/legendi", label: "Легенди", sub: "Играчи и личности" },
  { href: "/statistika", label: "Статистика", sub: "Табели и прегледи" },
  { href: "/za-nas", label: "За архивата", sub: "За овој проект" },
];

const focusOnNavy =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy";
const focusOnPaper =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export default async function Home() {
  let data: HomeData = EMPTY;
  try {
    data = await client.fetch<HomeData>(HOME_QUERY);
  } catch {
    // Graceful: a failed/empty read renders the placeholder homepage rather
    // than crashing (content-truth — never invent filler).
    data = EMPTY;
  }

  const { settings, featured, legends, gallery, decades } = data;

  const heroTitle = settings?.title?.trim() || "ФК Беласица";
  const seasonPhotos = featured?.seasonPhotos ?? [];
  const heroImage = seasonPhotos[0]?.image ?? null;
  const heroCaption = seasonPhotos[0]?.caption ?? null;

  const description = settings?.description?.trim() || null;

  // Featured card prefers the season's 2nd photo (so it differs from the hero),
  // falling back to the 1st — brief: "[0] (or [1] if present)".
  const featuredCardImage =
    seasonPhotos[1]?.image ?? seasonPhotos[0]?.image ?? null;
  const featuredTitle = featured?.title?.trim() || null;
  const teaser = (featured?.teaserSpans ?? [])
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .join("");

  // Section 6 — full-bleed "moment" band: the season's 2nd related photo, or
  // the section is omitted entirely (no placeholder band) when absent.
  const bandPhoto = seasonPhotos[1] ?? null;

  return (
    <>
      {/* 1 · Hero — full-bleed lead photo, navy bottom gradient, text in-column */}
      <section aria-labelledby="hero-heading" className="relative w-full">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-mist md:aspect-[16/9]">
          {heroImage ? (
            <Image
              src={urlFor(heroImage).width(2000).auto("format").url()}
              alt={heroCaption || "Архивска фотографија на ФК Беласица"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <PlaceholderChip label="насловна фотографија" />
            </span>
          )}

          {/* Navy bottom gradient — keeps the in-column text AA-legible */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-navy/95 via-navy/45 to-transparent"
          />

          <Container className="absolute inset-x-0 bottom-0">
            <div className="max-w-measure pb-10 md:pb-16">
              <SectionOverline variant="onNavy">
                Неофицијална архива
              </SectionOverline>
              <h1
                id="hero-heading"
                className="mt-3 font-serif text-h1 font-semibold text-paper md:text-display"
              >
                {heroTitle}
              </h1>
              <p className="mt-4 max-w-measure text-body-l text-paper/90">
                {HERO_SUBHEAD}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/arhiva"
                  className={`inline-flex items-center justify-center rounded-card bg-paper px-5 py-3 text-small font-semibold text-navy transition-colors hover:bg-white ${focusOnNavy}`}
                >
                  Разгледај ја архивата
                </Link>
                <Link
                  href="/za-nas"
                  className={`inline-flex items-center text-small font-medium text-paper decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnNavy}`}
                >
                  За архивата
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 2 · Intro strip — what the archive is */}
      <section aria-labelledby="intro-heading" className="py-16 md:py-24">
        <Container>
          <Reveal className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <SectionOverline>За архивата</SectionOverline>
              <h2
                id="intro-heading"
                className="mt-4 max-w-measure font-serif text-h2 font-semibold text-navy"
              >
                {INTRO_LEAD}
              </h2>
            </div>
            <div className="max-w-measure">
              {description ? (
                <p className="whitespace-pre-line text-body-l text-neutral-700">
                  {description}
                </p>
              ) : (
                <PlaceholderChip label="опис на архивата (Поставки на сајтот)" />
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 3 · Featured season */}
      <section
        aria-labelledby="featured-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Издвоена сезона</SectionOverline>
          </Reveal>
          <div className="mt-8 grid items-start gap-8 md:grid-cols-2 md:gap-12">
            <Reveal>
              <PhotoFrame
                image={featuredCardImage}
                alt={
                  featuredTitle
                    ? `${featuredTitle} — фотографија`
                    : "Архивска фотографија на сезоната"
                }
                ratio="3/2"
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholderLabel="фотографија од сезоната"
              />
            </Reveal>
            <Reveal delayIndex={1} className="max-w-measure">
              <h2
                id="featured-heading"
                className="font-serif text-h2 font-semibold text-navy"
              >
                {featuredTitle ?? (
                  <PlaceholderChip label="наслов на сезоната" />
                )}
              </h2>

              {featured?.decade != null && (
                <p className="mt-3 text-small text-neutral-500">
                  Деценија {featured.decade}
                </p>
              )}

              <div className="mt-5">
                {teaser ? (
                  <p className="line-clamp-4 text-body-l text-neutral-700">
                    {teaser}
                  </p>
                ) : (
                  <PlaceholderChip label="приказна за сезоната" />
                )}
              </div>

              {featured?.slug && (
                <Link
                  href={`/arhiva/${featured.slug}`}
                  className={`group mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
                >
                  Погледни ја сезоната
                  <ArrowRight
                    className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 7 · Decades timeline — inserted after the featured season */}
      <section
        aria-labelledby="decades-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Низ децениите</SectionOverline>
            <h2 id="decades-heading" className="sr-only">
              Низ децениите
            </h2>
          </Reveal>
          <Reveal delayIndex={1}>
            <DecadeTimeline activeDecades={decades} />
          </Reveal>
        </Container>
      </section>

      {/* 4 · Legends */}
      <section
        aria-labelledby="legends-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Легенди</SectionOverline>
            <h2 id="legends-heading" className="sr-only">
              Легенди
            </h2>
          </Reveal>

          {legends.length > 0 ? (
            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {legends.map((person, i) => {
                const roleLabel = (person.role ?? [])
                  .map((r) => ROLE_LABEL[r])
                  .filter(Boolean)
                  .join(", ");
                const years = person.playingYears?.trim() || null;

                return (
                  <li key={person.slug ?? i}>
                    <Reveal delayIndex={i}>
                      <Link
                        href={
                          person.slug ? `/legendi/${person.slug}` : "/legendi"
                        }
                        className={`group block rounded-card transition-transform duration-150 ease-out hover:-translate-y-0.5 ${focusOnPaper}`}
                      >
                        <PhotoFrame
                          image={person.portrait}
                          alt={person.name ? person.name : "Архивски портрет"}
                          ratio="4/5"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          placeholderLabel="портрет"
                        />
                        <h3 className="mt-4 font-serif text-h3 font-semibold text-navy">
                          {person.name ?? (
                            <PlaceholderChip label="име на личноста" />
                          )}
                        </h3>
                        {/* Meta = role label + playing years. Role is always
                            present (players filter); years may be absent → a
                            registered placeholder for the years only. */}
                        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-small text-neutral-500">
                          {roleLabel && <span>{roleLabel}</span>}
                          {roleLabel && <span aria-hidden>·</span>}
                          {years ? (
                            <span>{years}</span>
                          ) : (
                            <PlaceholderChip label="години на играње" />
                          )}
                        </p>
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8">
              <PlaceholderChip label="легенди (играчи) — сѐ уште не се објавени" />
            </div>
          )}
        </Container>
      </section>

      {/* 6 · Moment band — full-bleed; only rendered when a 2nd season photo exists */}
      {bandPhoto?.image && (
        <section aria-labelledby="moment-heading" className="relative w-full">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-mist md:aspect-[16/6]">
            <Image
              src={urlFor(bandPhoto.image).width(2400).auto("format").url()}
              alt={bandPhoto.caption || "Архивска фотографија на ФК Беласица"}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/35 to-transparent"
            />
            <Container className="absolute inset-x-0 bottom-0">
              <Reveal className="max-w-measure pb-8 md:pb-12">
                <SectionOverline variant="onNavy">
                  Момент од историјата
                </SectionOverline>
                <h2 id="moment-heading" className="sr-only">
                  Момент од историјата
                </h2>
                {bandPhoto.date && (
                  <span className="mt-3 block text-overline uppercase tracking-overline text-paper/80">
                    {bandPhoto.date}
                  </span>
                )}
                {bandPhoto.caption && (
                  <p className="mt-1 font-serif text-h3 font-semibold text-paper md:text-h2">
                    {bandPhoto.caption}
                  </p>
                )}
              </Reveal>
            </Container>
          </div>
        </section>
      )}

      {/* 5 · Gallery */}
      <section
        aria-labelledby="gallery-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Галерија</SectionOverline>
            <h2 id="gallery-heading" className="sr-only">
              Галерија
            </h2>
          </Reveal>

          {gallery.length > 0 ? (
            // Editorial mosaic — the first photo is a 2×2 feature; the rest
            // tile around it. Fixed row tracks (auto-rows) define the cell
            // heights, so PhotoFrame runs in fill mode (h-full, object-cover)
            // and every cell tiles cleanly regardless of caption length. One
            // photo → just the feature; empty → the placeholder branch below.
            <ul className="mt-8 grid auto-rows-[43vw] grid-cols-2 gap-4 sm:auto-rows-[27vw] md:auto-rows-[13rem] md:grid-cols-4 md:gap-6">
              {gallery.map((photo, i) => {
                const feature = i === 0;
                return (
                  <li
                    key={photo.id}
                    className={feature ? "col-span-2 row-span-2" : undefined}
                  >
                    <Reveal delayIndex={i % 4} className="h-full">
                      <figure className="relative h-full">
                        <PhotoFrame
                          image={photo.image}
                          alt={photo.caption || "Архивска фотографија"}
                          sizes={
                            feature
                              ? "(min-width: 768px) 50vw, 100vw"
                              : "(min-width: 768px) 25vw, 50vw"
                          }
                          placeholderLabel="фотографија"
                        />
                        {photo.image && (photo.date || photo.caption) && (
                          <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/85 via-navy/30 to-transparent p-3 md:p-4">
                            {photo.date && (
                              <span className="block text-overline uppercase tracking-overline text-paper/80">
                                {photo.date}
                              </span>
                            )}
                            {photo.caption && (
                              <span className="mt-1 line-clamp-2 text-small text-paper">
                                {photo.caption}
                              </span>
                            )}
                          </figcaption>
                        )}
                      </figure>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8">
              <PlaceholderChip label="фотографии — сѐ уште не се објавени" />
            </div>
          )}
        </Container>
      </section>

      {/* 8 · Explore grid — navigation into the site, just before the footer */}
      <section
        aria-labelledby="explore-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Истражи ја архивата</SectionOverline>
            <h2 id="explore-heading" className="sr-only">
              Истражи ја архивата
            </h2>
          </Reveal>

          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {EXPLORE_CARDS.map((card, i) => (
              <li key={card.href}>
                <Reveal delayIndex={i}>
                  <Link
                    href={card.href}
                    className={`group flex h-full flex-col justify-between gap-8 rounded-card border border-mist bg-white p-5 transition-transform duration-150 ease-out hover:-translate-y-0.5 ${focusOnPaper}`}
                  >
                    <div>
                      <h3 className="font-serif text-h3 font-semibold text-navy">
                        <span className="decoration-2 underline-offset-4 group-hover:underline group-hover:decoration-orange">
                          {card.label}
                        </span>
                      </h3>
                      <p className="mt-1 text-small text-neutral-500">
                        {card.sub}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="size-5 text-navy transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
