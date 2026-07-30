import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { Container } from "@/components/Container";
import { ClubRecords, type ClubRecordData } from "@/components/home/ClubRecords";
import { DecadeExplore } from "@/components/home/DecadeExplore";
import { PhotoFrame } from "@/components/home/PhotoFrame";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { LegendCard } from "@/components/legends/LegendCard";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";

// Re-read published Sanity content ~every 60s (D-1.05-4) — new editorial
// content (a captioned photo, a fresh clubRecord) surfaces without a redeploy.
export const revalidate = 60;

/* ------------------------------------------------------------------ *
 * Homepage content — one GROQ round trip against the read client
 * (published only, no token). The query is unchanged by the 3.05 redesign:
 * this phase re-dresses the page, it does not re-source it.
 *
 *  - HERO: the `teamPhoto` of the most recent season that has one
 *    (`order(decade desc, title desc)`, deterministic) — today the 2025/26
 *    squad. `heroFallbackPhoto` is the newest published photo, used only if no
 *    season carries a teamPhoto (defensive — 83/96 do today).
 *  - STORY: the verified `siteSettings.description` (owner-authored club copy).
 *  - LEGENDS: the club's players; portraits attach via `photo.relatedPerson`.
 *    Sorted portraits-first (real faces lead the marquee) then name (D-3.03-2).
 *  - RECORDS: the curated `clubRecord` documents (D-3.01-5).
 *  - DECADES: every season's `decade`, reduced to per-decade counts.
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
  moment: {
    image: SanityImageSource | null;
    caption: string | null;
    date: string | null;
  } | null;
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
const DECADES_LEAD =
  "Сезоните од целата историја на клубот, групирани по децении.";

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
      {/* ── 1 · Hero — the matchday poster ───────────────────────────── *
       * The photograph leads full-bleed and the crest is a white BLOCK capped
       * by the same 6px orange bar that opens the header — a badge on the
       * hoarding, not an image floating on navy. Only the crest carries the
       * negative margin, so it is the single element overlapping the picture;
       * the <h1> is bottom-aligned to it and therefore sits entirely on solid
       * navy (14.95:1), rather than depending on whichever team photo ISR
       * happens to serve (D-3.05a-10). */}
      <section aria-labelledby="hero-heading" className="bg-navy">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/8]">
          <PhotoFrame
            image={heroPhoto}
            alt={heroAlt}
            fit="cover"
            sizes="100vw"
            width={2400}
            priority
            placeholderLabel="насловна фотографија"
            objectPosition="50% 32%"
          />
        </div>

        <Container>
          {/* Badge + wordmark as one bottom-aligned lockup along the
              photograph's lower edge. The block is WHITE, not paper: the
              crest's left half is white, so it needs a light backdrop, and a
              cream panel would make it read as a white card inside a cream
              one. The tile stays even though the PNG's background is now
              transparent (D-crest-2). Decorative — the <h1> beside it carries
              the accessible name. */}
          <div className="flex flex-wrap items-end gap-5 lg:gap-8">
            <div className="relative z-10 -mt-13 flex-none bg-white md:-mt-17 lg:-mt-19">
              <div className="h-1.5 w-full bg-orange" />
              <div className="flex items-center justify-center px-4.5 py-3.5 lg:px-6 lg:py-4.5">
                <Image
                  src="/crest.png"
                  alt=""
                  width={256}
                  height={362}
                  priority
                  className="h-20 w-auto md:h-28 lg:h-32"
                />
              </div>
            </div>

            {/* No <br>: it sets on one line from `lg` up and wraps to two on
                narrow screens, which is the right break for the lockup. The
                wordmark carries its own clamp rather than `u-display`'s, so
                „ФК БЕЛАСИЦА" holds one line beside a ~150px badge. */}
            <h1
              id="hero-heading"
              className="u-display pb-[0.15em] text-wordmark text-paper"
            >
              {heroTitle}
            </h1>
          </div>

          <Reveal className="pb-12 pt-7 md:pb-16">
            <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <SectionOverline variant="onNavy">
                  Неофицијална архива
                </SectionOverline>
                <p className="mt-4 max-w-measure text-body-l text-paper/80">
                  {HERO_HERITAGE}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/arhiva" className={`u-btn ${focusOnNavy}`}>
                  Разгледај ја архивата
                </Link>
                <Link
                  href="/legendi"
                  className={`u-btn u-btn--ghost ${focusOnNavy}`}
                >
                  Легенди на клубот
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 2 · The club, on a paper block ───────────────────────────── */}
      <section aria-labelledby="story-heading" className="bg-paper">
        <Container className="py-section">
          <Reveal className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
            <div>
              <SectionOverline>За клубот</SectionOverline>
              <h2
                id="story-heading"
                className="u-h2 mt-6 max-w-[14ch] text-navy"
              >
                {STORY_LEAD}
              </h2>
            </div>
            <div>
              {description ? (
                // Owner-authored copy, rendered with the editor's own
                // paragraph breaks and never reflowed (content-truth).
                <p className="max-w-measure whitespace-pre-line text-body-l text-ink">
                  {description}
                </p>
              ) : (
                <PlaceholderChip label="опис на архивата (Поставки на сајтот)" />
              )}
              <Link
                href="/za-nas"
                className={`u-link mt-7 text-navy ${focusOnPaper}`}
              >
                За архивата
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── 3 · Legends — the marquee band, high on the page ─────────── */}
      <section aria-labelledby="legends-heading" className="bg-navy">
        <Container className="py-section">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div>
              <SectionOverline variant="onNavy">Легенди</SectionOverline>
              <h2
                id="legends-heading"
                className="u-h2 mt-6 max-w-[18ch] text-paper"
              >
                Луѓето што ја одбележаа историјата
              </h2>
            </div>
            <Link href="/legendi" className={`u-link text-paper ${focusOnNavy}`}>
              Сите легенди
            </Link>
          </Reveal>

          {legends.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {legends.map((person, i) => (
                <LegendCard
                  key={person.slug}
                  person={person}
                  delayIndex={i % 5}
                  onNavy
                  // Matches THIS grid's tracks (2 → sm:3 → lg:5), not the
                  // /legendi default — halves the mobile portrait request.
                  sizes="(min-width:1024px) 19vw, (min-width:640px) 31vw, 47vw"
                />
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <PlaceholderChip
                label="легенди (играчи) — сѐ уште не се објавени"
                onNavy
              />
            </div>
          )}
        </Container>
      </section>

      {/* ── 4 · The club in numbers — the scoreboard strip ───────────── */}
      <ClubRecords records={records} />

      {/* ── 5 · Explore the archive by decade ────────────────────────── */}
      {decades.length > 0 && (
        <section aria-labelledby="decades-heading" className="bg-navy">
          <Container className="py-section">
            <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <div>
                <SectionOverline variant="onNavy">Архива</SectionOverline>
                <h2 id="decades-heading" className="u-h2 mt-6 text-paper">
                  Разгледај по децении
                </h2>
              </div>
              <p className="max-w-[36ch] text-body-l text-paper/80">
                {DECADES_LEAD}
              </p>
            </Reveal>

            <div className="mt-10">
              <DecadeExplore decades={decades} />
            </div>
          </Container>
        </section>
      )}

      {/* ── 6 · A moment from history ────────────────────────────────── */}
      {moment?.image && (
        <section aria-labelledby="moment-heading" className="bg-paper">
          <h2 id="moment-heading" className="sr-only">
            Момент од историјата
          </h2>
          <figure className="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div className="relative min-h-64 lg:min-h-[28rem]">
              <PhotoFrame
                image={moment.image}
                alt={moment.caption || "Архивска фотографија на ФК Беласица"}
                fit="cover"
                sizes="(min-width:1024px) 61vw, 100vw"
                width={1800}
                placeholderLabel="фотографија"
                objectPosition="50% 35%"
              />
            </div>
            <figcaption className="u-cap flex flex-col justify-center bg-navy p-5 sm:p-6 lg:p-8">
              <SectionOverline variant="onNavy">
                Момент од историјата
              </SectionOverline>
              {moment.date && (
                <p className="mt-6 text-overline font-bold uppercase tracking-overline text-paper/80">
                  {moment.date}
                </p>
              )}
              {moment.caption && (
                <p className="u-h2 mt-3 text-paper">{moment.caption}</p>
              )}
            </figcaption>
          </figure>
        </section>
      )}

      {/* ── 7 · Where next ───────────────────────────────────────────── */}
      <section aria-labelledby="quicklinks-heading" className="bg-navy">
        <Container className="py-section">
          <Reveal>
            <SectionOverline variant="onNavy">Истражи</SectionOverline>
            <h2 id="quicklinks-heading" className="u-h2 mt-6 text-paper">
              Каде понатаму
            </h2>
          </Reveal>

          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((card, i) => (
              <Reveal as="li" key={card.href} delayIndex={i}>
                <Link href={card.href} className={`u-tile ${focusOnNavy}`}>
                  <h3 className="u-h3 text-paper">{card.label}</h3>
                  <span className="u-tile-meta">{card.sub}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
