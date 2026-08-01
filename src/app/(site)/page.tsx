import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { fetchOrThrow } from "@/sanity/fetch";
import { framedImage } from "@/sanity/frame";
import { Container } from "@/components/Container";
import {
  ClubRecords,
  type ClubRecordData,
} from "@/components/home/ClubRecords";
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

/**
 * The season whose team photo opens the site, pinned in code (D-3.10-4).
 *
 * The archive's subject is history, so the front door shows the 1982/83 squad
 * rather than whichever season happens to be newest. It is pinned here rather
 * than as a Sanity „featured" field because that would be a schema change for
 * a single editorial choice, and this phase owns no schema work — moving it
 * into Studio later is a one-field migration, not a rewrite.
 */
const HERO_SEASON_SLUG = "1982-83";

/** That season's `teamPhoto`, kept out of „Момент од историјата" (see below). */
const HERO_PHOTO_ID = "photo-1bb63ff6de96c8152fae78794736fd7cd990ad81";

/* ------------------------------------------------------------------ *
 * Homepage content — one GROQ round trip against the read client
 * (published only, no token).
 *
 *  - HERO: the pinned season's `teamPhoto` (`heroPinned`, D-3.10-4). The two
 *    older sources are kept beneath it as a fallback chain, and that is
 *    load-bearing: unpublish the pinned season and the homepage quietly returns
 *    to `heroSeason` — the `teamPhoto` of the most recent season that has one
 *    (`order(decade desc, title desc)`, deterministic) — rather than opening on
 *    a placeholder. `heroFallbackPhoto` is the newest published photo, used
 *    only if no season carries a teamPhoto at all (defensive — 83/96 do today).
 *  - STORY: the verified `siteSettings.description` (owner-authored club copy).
 *  - LEGENDS: the club's ten most-capped players; portraits attach via
 *    `photo.relatedPerson`. Ranked and sliced IN GROQ by
 *    `careerStats.appearances` — the authoritative career total (D-2.01-3),
 *    never a sum of `season.squad`. The `-1` coalesce is load-bearing: it keeps
 *    a player with no recorded appearances below one with a single appearance,
 *    where a `0` default would tie them. The homepage is a front door, not the
 *    roster — all 160 people stay on `/legendi` (3.05b).
 *  - RECORDS: the curated `clubRecord` documents (D-3.01-5). The query reads
 *    them all; `ClubRecords` renders the homepage's six by an explicit label
 *    whitelist, and `/statistika` renders all 30.
 *  - DECADES: every season's `decade`, reduced to per-decade counts.
 *  - MOMENT: one real, captioned, season-anchored, landscape archival photo,
 *    oldest era first then widest crop (D-3.03-4) — today the 1993 Cup photo.
 *    The hero photograph is excluded by `_id`, explicitly: it is a 1980s scan
 *    that the oldest-first ordering would now rank *first*, and the only thing
 *    keeping it out was its missing caption — one caption typed in Studio and
 *    the same picture would have opened the page and closed it (D-3.10-5).
 *
 * Everything degrades to a visible placeholder (never invented) when a query
 * returns nothing — content-truth.
 * ------------------------------------------------------------------ */
const HOME_QUERY = /* groq */ `{
  "settings": *[_type == "siteSettings"][0]{ title, description },
  "heroPinned": *[_type == "season" && slug.current == $heroSeasonSlug && defined(teamPhoto)][0]{
    title, "photo": teamPhoto->{ "image": image, caption }
  },
  "heroSeason": *[_type == "season" && defined(teamPhoto)]
    | order(decade desc, title desc)[0]{
      title,
      "photo": teamPhoto->{ "image": image, caption }
    },
  "heroFallbackPhoto": *[_type == "photo" && defined(image)]
    | order(select(defined(caption) && caption != "" => 0, 1) asc, coalesce(date, "9999") asc, _id asc)[0]{
      "image": image, caption
    },
  "legends": *[_type == "person" && "player" in role && defined(slug.current)]
    | order(coalesce(careerStats.appearances, -1) desc, name asc)[0...10]{
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
      && _id != $heroPhotoId
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

type Season = { title: string | null; photo: Photo | null };

type HomeData = {
  settings: { title: string | null; description: string | null } | null;
  heroPinned: Season | null;
  heroSeason: Season | null;
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
  heroPinned: null,
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

/** Last-resort hero alt — used only when nothing on the photo names it. */
const HERO_ALT_GENERIC = "Архивска фотографија на ФК Беласица";

/**
 * The hero's alt text, resolved in the **same order as `heroPhoto`** so the two
 * can never describe different pictures.
 *
 * A caption always wins where one exists. The pinned season has none today, so
 * its own title carries the alt with Studio's typographic quotes („…“) stripped
 * — derived from the fetched title rather than written out here, so the string
 * follows the data if the season is ever re-pinned or retitled.
 */
function heroAltFor({
  heroPinned,
  heroSeason,
  heroFallbackPhoto,
}: HomeData): string {
  if (heroPinned?.photo?.image) {
    const season = (heroPinned.title ?? "").replace(/[„“]/g, "").trim();
    return (
      heroPinned.photo.caption?.trim() ||
      (season ? `Тимска фотографија — ${season}` : HERO_ALT_GENERIC)
    );
  }
  if (heroSeason?.photo?.image) {
    return heroSeason.photo.caption?.trim() || HERO_ALT_GENERIC;
  }
  return heroFallbackPhoto?.caption?.trim() || HERO_ALT_GENERIC;
}

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
    // Retried before it is allowed to fail (3.05b). The homepage is one of the
    // read sites 3.02F-Code left uncovered, and the one observed to fail first
    // under the CDN's intermittent connect timeouts (D-3.05a-9) — it is the
    // first page every build prerenders. `fetchOrThrow` logs each attempt, so a
    // build log still shows the wobble even when the retry absorbs it.
    //
    // The graceful fallback below is deliberately KEPT rather than replaced by
    // the season/person templates' loud throw: those own a single archive page
    // and a missing one is a silent hole, whereas the homepage degrades to a
    // visible placeholder front door — which is honest, and better than a site
    // that will not load at all. It never invents filler (content-truth).
    data = await fetchOrThrow<HomeData>(
      HOME_QUERY,
      { heroSeasonSlug: HERO_SEASON_SLUG, heroPhotoId: HERO_PHOTO_ID },
      "the homepage",
    );
  } catch {
    data = EMPTY;
  }

  const {
    settings,
    heroPinned,
    heroSeason,
    heroFallbackPhoto,
    records,
    moment,
  } = data;

  const heroTitle = settings?.title?.trim() || "ФК Беласица";
  const heroPhoto =
    heroPinned?.photo?.image ??
    heroSeason?.photo?.image ??
    heroFallbackPhoto?.image ??
    null;
  const heroAlt = heroAltFor(data);

  const description = settings?.description?.trim() || null;

  // DISPLAY order for the ten the query already chose (D-3.03-2): portraits
  // first, so real faces lead the marquee, then Cyrillic name order. This does
  // not re-rank the band — the ten are picked by appearances in GROQ, and this
  // only arranges them. Two of today's ten have a portrait on file; the other
  // eight render LegendCard's monogram tile, which is the specified treatment
  // for a person with no portrait (brand.md §Photo treatment) — never a
  // stand-in face, and never a reason to drop someone from the band.
  // Only people with a slug (a real detail page) are shown.
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
       * The photograph leads full-bleed and the crest overlaps its lower
       * edge — a badge pinned to the hoarding. It sat in a white block capped
       * by an orange bar until 3.06a; the owner asked for the crest alone, and
       * the block went with the bar. The motif still opens the header and
       * closes the footer. Only the crest carries the
       * negative margin, so it is the single element overlapping the picture;
       * the <h1> is bottom-aligned to it and therefore sits entirely on solid
       * navy (14.95:1), rather than depending on whichever team photo ISR
       * happens to serve (D-3.05a-10). */}
      <section aria-labelledby="hero-heading" className="bg-navy">
        {/* `3/2` on a phone, not the `4/5` this block carried while the hero was
            a modern squad photo (D-3.10-6): the pinned 1982/83 scan is 1.92:1
            and lines twenty people up across its full width, so a portrait box
            cropped away more than half the team. */}
        <div className="relative aspect-[3/2] w-full sm:aspect-[16/10] lg:aspect-[21/8]">
          <PhotoFrame
            image={heroPhoto}
            alt={heroAlt}
            fit="cover"
            sizes="100vw"
            width={2400}
            priority
            placeholderLabel="насловна фотографија"
            // Down from 32%: the wide `21/8` desktop box keeps both rows of
            // heads and gives up grass along the bottom instead.
            objectPosition="50% 38%"
          />
        </div>

        <Container>
          {/* Badge + wordmark as one bottom-aligned lockup along the
              photograph's lower edge. No panel behind the crest: its own left
              half is white and its background is transparent, so on navy — or
              over the photograph — the artwork carries itself, and the white
              rectangle only read as a sticker (owner decision, 3.06a,
              superseding D-crest-2). Decorative — the <h1> beside it carries
              the accessible name. */}
          <div className="flex flex-wrap items-end gap-5 lg:gap-8">
            <div className="relative z-10 -mt-13 flex-none md:-mt-17 lg:-mt-19">
              <div className="flex items-center justify-center">
                {/* `/crest.svg` + `unoptimized` — see the note in `SiteHeader`.
                    The vector master matters most here: this is the crest's
                    largest appearance on the site (128px tall at `lg`), which
                    is where the old raster's clipped edge and flattened
                    pennant point were visible. `/crest.png` stays the canonical
                    asset for the Open Graph card and the favicon lineage, at
                    its unchanged 864×1220. */}
                {/* A plain <img loading="lazy">, matching `SiteHeader` — see
                    the note there. Both crests point at the same 33 KB
                    `/crest.svg`, and this page's LCP is the hero *photograph*
                    behind them, so neither may be promised to the network
                    ahead of it. `lazy` is what actually removes the preload:
                    React 19 hoists any non-lazy SSR image into one, so a bare
                    <img> here kept the homepage preloading the crest after the
                    header had stopped (measured on the deployed preview).
                    Decorative — the <h1> beside it carries the name, and it
                    sits in the first viewport, so the browser fetches it as
                    soon as layout places it (D-3.09-2). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/crest.svg"
                  alt=""
                  width={864}
                  height={1233}
                  loading="lazy"
                  decoding="async"
                  className="h-24 w-auto md:h-32 lg:h-40"
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
            <Link
              href="/legendi"
              className={`u-link text-paper ${focusOnNavy}`}
            >
              Сите легенди
            </Link>
          </Reveal>

          {legends.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {legends.map((person, i) => (
                <LegendCard
                  key={person.slug}
                  // Resolved here, on the server — `LegendCard` no longer holds
                  // a raw Sanity asset (D-3.09-1). 640px is the widest this
                  // 5-up track ever renders a portrait.
                  person={{
                    ...person,
                    portrait: framedImage(person.portrait, 640),
                  }}
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
