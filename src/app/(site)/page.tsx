import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Container } from "@/components/Container";
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
 * Field names taken from src/sanity/schemaTypes/*. Selection rules:
 *  - featured season: newest by decade, then title (D-1.05-1)
 *  - legends: most-capped first, then name (D-1.05-2)
 *  - gallery: oldest season first, then date (D-1.05-3)
 * Everything degrades to placeholders when a query returns nothing.
 * ------------------------------------------------------------------ */
const HOME_QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{ title, description },
  "featured": *[_type == "season" && defined(slug.current)]
    | order(decade desc, title desc)[0]{
      title,
      "slug": slug.current,
      decade,
      "teaserSpans": story[0].children[].text,
      "photos": photos[0...2]->{ "image": image, caption }
    },
  "legends": *[_type == "person" && defined(slug.current)]
    | order(coalesce(careerStats.appearances, -1) desc, name asc)[0...3]{
      name,
      "slug": slug.current,
      role,
      "appearances": careerStats.appearances,
      "portrait": photos[0]->image
    },
  "gallery": *[_type == "photo" && defined(image)]
    | order(coalesce(relatedSeason->decade, 9999) asc, date asc)[0...10]{
      "id": _id,
      "image": image,
      caption,
      date
    }
}`;

type PhotoRef = { image: SanityImageSource | null; caption: string | null };

type HomeData = {
  settings: { title: string | null; description: string | null } | null;
  featured: {
    title: string | null;
    slug: string | null;
    decade: number | null;
    teaserSpans: (string | null)[] | null;
    photos: PhotoRef[] | null;
  } | null;
  legends: {
    name: string | null;
    slug: string | null;
    role: string[] | null;
    appearances: number | null;
    portrait: SanityImageSource | null;
  }[];
  gallery: {
    id: string;
    image: SanityImageSource | null;
    caption: string | null;
    date: string | null;
  }[];
};

const EMPTY: HomeData = {
  settings: null,
  featured: null,
  legends: [],
  gallery: [],
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

  const { settings, featured, legends, gallery } = data;

  const heroTitle = settings?.title?.trim() || "ФК Беласица";
  const heroImage = featured?.photos?.[0]?.image ?? null;
  const heroCaption = featured?.photos?.[0]?.caption ?? null;

  const description = settings?.description?.trim() || null;

  const featuredCardImage =
    featured?.photos?.[1]?.image ?? featured?.photos?.[0]?.image ?? null;
  const featuredTitle = featured?.title?.trim() || null;
  const teaser = (featured?.teaserSpans ?? [])
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .join("");

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
                const roleLabels = (person.role ?? [])
                  .map((r) => ROLE_LABEL[r])
                  .filter(Boolean);
                const metaParts = [
                  roleLabels.join(", ") || null,
                  person.appearances != null
                    ? `${person.appearances} наст.`
                    : null,
                ].filter(Boolean);

                return (
                  <li key={person.slug ?? i}>
                    <Reveal delayIndex={i}>
                      <Link
                        href={person.slug ? `/legendi/${person.slug}` : "/legendi"}
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
                        {metaParts.length > 0 ? (
                          <p className="mt-1 text-small text-neutral-500">
                            {metaParts.join(" · ")}
                          </p>
                        ) : (
                          <p className="mt-1">
                            <PlaceholderChip label="улога · настапи" />
                          </p>
                        )}
                      </Link>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8">
              <PlaceholderChip label="легенди (личности) — сѐ уште не се објавени" />
            </div>
          )}
        </Container>
      </section>

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
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {gallery.map((photo, i) => (
                <li key={photo.id}>
                  <Reveal delayIndex={i % 4}>
                    <figure>
                      <PhotoFrame
                        image={photo.image}
                        alt={photo.caption || "Архивска фотографија"}
                        ratio="3/2"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        placeholderLabel="фотографија"
                      />
                      {(photo.date || photo.caption) && (
                        <figcaption className="mt-2">
                          {photo.date && (
                            <span className="block text-overline uppercase tracking-overline text-neutral-500">
                              {photo.date}
                            </span>
                          )}
                          {photo.caption && (
                            <span className="mt-1 block text-small text-neutral-700">
                              {photo.caption}
                            </span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8">
              <PlaceholderChip label="фотографии — сѐ уште не се објавени" />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
