import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { Container } from "@/components/Container";
import { ClubRecords, type ClubRecordData } from "@/components/home/ClubRecords";
import { DecadeExplore } from "@/components/home/DecadeExplore";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { LegendCard } from "@/components/legends/LegendCard";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";

// Re-read published Sanity content ~every 60s (D-1.05-4) — new editorial
// content (a captioned photo, a fresh clubRecord) surfaces on the preview
// without a redeploy. ISR stays 60 through the Part-3 redesign.
export const revalidate = 60;

/* ------------------------------------------------------------------ *
 * Homepage content — one GROQ round trip against the read client
 * (published only, no token). Part 3.03 redesign: the page leads with the
 * club's identity and its legends, so the query is rebuilt around that flow.
 *
 *  - HERO: the `teamPhoto` of the most recent season that has one
 *    (`order(decade desc, title desc)`, deterministic) — today the 2025/26
 *    squad. `heroFallbackPhoto` is the newest published photo, used only if no
 *    season carries a teamPhoto (defensive — 83/96 do today).
 *  - STORY: the verified `siteSettings.description` (owner-authored club copy).
 *  - LEGENDS: the club's players; portraits attach via `photo.relatedPerson`.
 *    Sorted portraits-first (real faces lead the marquee) then name (D-3.03-2).
 *  - RECORDS: the curated `clubRecord` documents (D-3.01-5).
 *  - DECADES: every season's `decade`, reduced to per-decade counts for the
 *    archive doorway.
 *  - MOMENT: one real, captioned, season-anchored, landscape archival photo,
 *    oldest era first then widest crop (D-3.03-4) — today the 1993 Cup photo.
 *    Ordering oldest-first structurally excludes the modern hero photo.
 *
 * Everything degrades to a visible placeholder (never invented) when a query
 * returns nothing — content-truth.
 * ------------------------------------------------------------------ */
const HOME_QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{ title, description },
  "heroSeason": *[_type == "season" && defined(teamPhoto)]
    | order(decade desc, title desc)[0]{
      title,
      "photo": teamPhoto->{ "image": image, caption }
    },
  "heroFallbackPhoto": *[_type == "photo" && defined(image)]
    | order(select(defined(caption) && caption != "" => 0, 1) asc, coalesce(date, "9999") asc, _id asc)[0]{
      "image": image, caption
    },
  "legends": *[_type == "person" && "player" in role && defined(slug.current)]{
    name,
    "slug": slug.current,
    role,
    playingYears,
    "portrait": *[_type == "photo" && relatedPerson._ref == ^._id][0].image,
    "hasPortrait": defined(*[_type == "photo" && relatedPerson._ref == ^._id][0].image)
  },
  "records": *[_type == "clubRecord"]{ label, value, category, order },
  "decadeValues": *[_type == "season" && defined(decade)].decade,
  "moment": *[_type == "photo"
      && defined(caption) && caption != ""
      && defined(relatedSeason)
      && image.asset->metadata.dimensions.aspectRatio > 1.2]
    | order(coalesce(relatedSeason->decade, 9999) asc, image.asset->metadata.dimensions.aspectRatio desc, _id asc)[0]{
      "image": image, caption, date
    }
}`;

type Photo = { image: SanityImageSource | null; caption: string | null };

type Legend = {
  name: string | null;
  slug: string | null;
  role: string[] | null;
  playingYears: string | null;
  portrait: SanityImageSource | null;
  hasPortrait: boolean;
};

type HomeData = {
  settings: { title: string | null; description: string | null } | null;
  heroSeason: { title: string | null; photo: Photo | null } | null;
  heroFallbackPhoto: Photo | null;
  legends: Legend[];
  records: ClubRecordData[];
  decadeValues: number[];
  moment: { image: SanityImageSource | null; caption: string | null; date: string | null } | null;
};

const EMPTY: HomeData = {
  settings: null,
  heroSeason: null,
  heroFallbackPhoto: null,
  legends: [],
  records: [],
  decadeValues: [],
  moment: null,
};

// Structural (non-fact) copy. The wordmark ФК Беласица is VERIFIED (owner,
// 2026-07-15, OV-2). These lines describe what the archive IS — they make no
// claim about a founding year, a season count, or any stat (content-truth):
// the hero must never assert „од 1922" or „96 сезони".
const HERO_HERITAGE =
  "Сезоните, легендите и рекордите на клубот — собрани и зачувани на едно место.";
const STORY_LEAD = "Историјата на клубот, собрана на едно место.";

// Section 7 — quick links. Labels/sublabels are navigation copy (what each
// destination is), not factual claims — safe under content-truth.
const QUICK_LINKS: { href: string; label: string; sub: string }[] = [
  { href: "/arhiva", label: "Архива", sub: "Сезона по сезона" },
  { href: "/legendi", label: "Легенди", sub: "Играчи и личности" },
  { href: "/statistika", label: "Статистика", sub: "Рекорди и табели" },
  { href: "/za-nas", label: "За нас", sub: "За овој проект" },
];

/** Reduce the flat list of season decades to sorted per-decade counts. */
function toDecadeCounts(values: number[]): { decade: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const d of values) counts.set(d, (counts.get(d) ?? 0) + 1);
  return [...counts.entries()]
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade - b.decade);
}

export default async function Home() {
  let data: HomeData = EMPTY;
  try {
    data = await client.fetch<HomeData>(HOME_QUERY);
  } catch {
    // Graceful: a failed read renders the placeholder homepage rather than
    // crashing (content-truth — never invent filler).
    data = EMPTY;
  }

  const { settings, heroSeason, heroFallbackPhoto, records, moment } = data;

  const heroTitle = settings?.title?.trim() || "ФК Беласица";
  const heroPhoto = heroSeason?.photo?.image ?? heroFallbackPhoto?.image ?? null;
  const heroAlt =
    heroSeason?.photo?.caption ||
    heroFallbackPhoto?.caption ||
    "Архивска фотографија на ФК Беласица";

  const description = settings?.description?.trim() || null;

  // Legends: portraits first (real faces lead the marquee), then Cyrillic name
  // order (D-3.03-2). Only people with a slug (a real detail page) are shown.
  const legends = [...data.legends]
    .filter((p): p is Legend & { slug: string } => Boolean(p.slug))
    .sort((a, b) => {
      if (a.hasPortrait !== b.hasPortrait) return a.hasPortrait ? -1 : 1;
      return (a.name ?? "").localeCompare(b.name ?? "", "mk");
    });

  const decades = toDecadeCounts(data.decadeValues);

  return (
    <>
      {/* 1 · Hero — the club itself: crest + wordmark + heritage line over the
          most-recent team photo, navy gradient for AA-legible paper text. */}
      <section aria-labelledby="hero-heading" className="relative w-full">
        <div className="relative min-h-[34rem] w-full overflow-hidden bg-navy md:min-h-[42rem]">
          {heroPhoto ? (
            <Image
              src={urlFor(heroPhoto).width(2400).auto("format").url()}
              alt={heroAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 30%" }}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <PlaceholderChip label="насловна фотографија" />
            </span>
          )}

          {/* Navy bottom gradient — strong navy through the lower ~60% where the
              text sits (paper overline + heritage → measured ≥ 6.8:1 over the
              worst-case light photo pixel), fading to reveal the photo up top. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-navy via-navy/75 via-60% to-transparent"
          />

          <Container className="absolute inset-x-0 bottom-0">
            <div className="max-w-measure pb-12 pt-28 md:pb-16">
              <SectionOverline variant="onPhoto">
                Неофицијална архива
              </SectionOverline>

              <div className="mt-4 flex items-center gap-3 md:gap-4">
                {/* Crest on a white tile — the artwork has a white ground, so it
                    needs a light backdrop to read over the photo. Decorative:
                    the wordmark carries the accessible name. */}
                <span className="flex shrink-0 items-center rounded-card bg-white p-1.5">
                  <Image
                    src="/crest.png"
                    alt=""
                    width={64}
                    height={91}
                    priority
                    className="h-10 w-auto md:h-14"
                  />
                </span>
                <h1
                  id="hero-heading"
                  className="font-serif text-h1 font-semibold tracking-tight text-paper md:text-display"
                >
                  {heroTitle}
                </h1>
              </div>

              <p className="mt-5 max-w-measure text-body-l text-paper/90">
                {HERO_HERITAGE}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/arhiva"
                  className={`inline-flex items-center justify-center rounded-card bg-paper px-5 py-3 text-small font-semibold text-navy transition-colors hover:bg-white ${focusOnNavy}`}
                >
                  Разгледај ја архивата
                </Link>
                <Link
                  href="/legendi"
                  className={`inline-flex items-center text-small font-medium text-paper decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnNavy}`}
                >
                  Легенди на клубот
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* 2 · The club's story — the verified siteSettings.description */}
      <section aria-labelledby="story-heading" className="py-16 md:py-24">
        <Container>
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
            <div>
              <SectionOverline>За клубот</SectionOverline>
              <h2
                id="story-heading"
                className="mt-4 max-w-measure font-serif text-h2 font-semibold text-navy"
              >
                {STORY_LEAD}
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
              <Link
                href="/za-nas"
                className={`group mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
              >
                За архивата
                <ArrowRight
                  className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 3 · Legends — the marquee band, high on the page */}
      <section
        aria-labelledby="legends-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <SectionOverline>Легенди</SectionOverline>
              <h2
                id="legends-heading"
                className="mt-4 max-w-measure font-serif text-h2 font-semibold text-navy"
              >
                Луѓето што ја одбележаа историјата
              </h2>
            </div>
            <Link
              href="/legendi"
              className={`group inline-flex items-center gap-1.5 text-small font-semibold text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
            >
              Сите легенди
              <ArrowRight
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Reveal>

          {legends.length > 0 ? (
            // Equalise card heights on the marquee row (Петар carries two role
            // chips, so his card is tallest). LegendCard renders `<li><Reveal
            // div><Link a>`; stretching those two descendants to h-full makes
            // every white card the same height with content top-aligned. Scoped
            // to this grid so the shared /legendi component stays untouched.
            <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 [&>li>div>a]:h-full [&>li>div]:h-full">
              {legends.map((person, i) => (
                <LegendCard key={person.slug} person={person} delayIndex={i % 5} />
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <PlaceholderChip label="легенди (играчи) — сѐ уште не се објавени" />
            </div>
          )}
        </Container>
      </section>

      {/* 4 · The club in numbers — records strip (navy anchor) */}
      <ClubRecords records={records} />

      {/* 5 · Explore the archive by decade */}
      <section
        aria-labelledby="decades-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Архива</SectionOverline>
            <h2
              id="decades-heading"
              className="mt-4 max-w-measure font-serif text-h2 font-semibold text-navy"
            >
              Разгледај по децении
            </h2>
            <p className="mt-3 max-w-measure text-body-l text-neutral-700">
              Сезоните од целата историја на клубот, групирани по децении.
            </p>
          </Reveal>
          <Reveal delayIndex={1} className="mt-10">
            <DecadeExplore decades={decades} />
          </Reveal>
        </Container>
      </section>

      {/* 6 · A moment from history — one full-bleed real archival photograph */}
      {moment?.image && (
        <section aria-labelledby="moment-heading" className="relative w-full">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-navy md:aspect-[16/6]">
            <Image
              src={urlFor(moment.image).width(2400).auto("format").url()}
              alt={moment.caption || "Архивска фотографија на ФК Беласица"}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "50% 35%" }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-navy via-navy/70 via-55% to-transparent"
            />
            <Container className="absolute inset-x-0 bottom-0">
              <Reveal className="max-w-measure pb-8 md:pb-12">
                <SectionOverline variant="onPhoto">
                  Момент од историјата
                </SectionOverline>
                <h2 id="moment-heading" className="sr-only">
                  Момент од историјата
                </h2>
                {moment.date && (
                  <span className="mt-3 block text-overline uppercase tracking-overline text-paper/80">
                    {moment.date}
                  </span>
                )}
                {moment.caption && (
                  <p className="mt-1 font-serif text-h3 font-semibold text-paper md:text-h2">
                    {moment.caption}
                  </p>
                )}
              </Reveal>
            </Container>
          </div>
        </section>
      )}

      {/* 7 · Quick links — into the rest of the site, just before the footer */}
      <section
        aria-labelledby="quicklinks-heading"
        className="border-t border-mist py-16 md:py-24"
      >
        <Container>
          <Reveal>
            <SectionOverline>Истражи</SectionOverline>
            <h2
              id="quicklinks-heading"
              className="mt-4 max-w-measure font-serif text-h2 font-semibold text-navy"
            >
              Каде понатаму
            </h2>
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {QUICK_LINKS.map((card, i) => (
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
