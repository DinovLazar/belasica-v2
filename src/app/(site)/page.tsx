import type { Metadata } from "next";
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
import { compareByLegendRank } from "@/lib/people";

// Re-read published Sanity content ~every 60s (D-1.05-4) — new editorial
// content (a captioned photo, a fresh clubRecord) surfaces without a redeploy.
export const revalidate = 60;

/**
 * The homepage's only metadata is its canonical (3.23, B2) — title, description
 * and the share card all inherit from the root layout, which is correct: this
 * page IS the site, so restating them here would be two sources for one string.
 *
 * A relative path, resolved against `metadataBase`. That is what makes the
 * domain cutover a single environment variable rather than 322 edits.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

/**
 * The photograph in „Момент од историјата", pinned in code (3.24) on the same
 * pattern and for the same reason as `HERO_PHOTO_ID` above (D-3.10-4).
 *
 * Until now the section resolved its picture deterministically — oldest era,
 * captioned, season-anchored, widest crop (D-3.03-4) — which is stable but not
 * FIXED: publish an older captioned landscape scan in Studio and the front
 * page changes on the next revalidate. That was tolerable while the section was
 * only a photograph and its own caption. It stopped being tolerable the moment
 * the section gained a link that names a specific topic (see `MOMENT_LINK`):
 * a „read more about the youth school" sitting under a photograph that has
 * quietly become something else is not a stale link, it is a false statement on
 * the front door.
 *
 * This is „Младата екипа на Беласица со Купот на Македонија, 1993" — the side
 * that won the club's first Macedonian youth Cup in season 1992/93, the team
 * `razno.ts` describes at line 6959 of the book, beating Пелистер 5:3 in the
 * final. Its `relatedSeason` is `1992-93`.
 *
 * The deterministic lookup below is KEPT beneath it as a fallback, and that is
 * load-bearing: unpublish this document and the section quietly returns to the
 * old ordering rather than opening on a placeholder — exactly the chain the
 * hero has carried since 3.10.
 */
const MOMENT_PHOTO_ID = "39b358c0-be93-4130-be5e-da4d97fe7948";

/**
 * The link out of „Момент од историјата" (owner request, 3.24).
 *
 * It is rendered ONLY when the pinned photograph above is the one on screen —
 * see `momentIsPinned` in the body. The fallback picture is by definition not
 * the 1993 Cup side, so the sentence would stop being true the moment the
 * fallback engaged.
 */
const MOMENT_LINK = {
  href: "/razno/mladinska-skola",
  label: "Прочитај повеќе за младинската школа",
};

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
 *    `photo.relatedPerson`. Ranked and sliced IN GROQ by `legendRank` — the
 *    book's own all-time appearance list, which is also what orders the Играчи
 *    band on `/legendi` (D-3.12-3). It replaced a sort on
 *    `careerStats.appearances` at 3.12 so the two pages cannot disagree about
 *    who the most-capped ten are: the book ranks fifteen of its eighty on a
 *    count it gives only as a range, and an appearances sort silently dropped
 *    those players — Панче Пантазиев (#9) and Томче Ефтимов (#8) among them —
 *    out of the ten. The `9999` coalesce keeps the unranked below the ranked.
 *    The homepage is a front door, not the roster — all 160 people stay on
 *    `/legendi` (3.05b).
 *  - RECORDS: the curated `clubRecord` documents (D-3.01-5). The query reads
 *    them all; `ClubRecords` renders the homepage's six by an explicit label
 *    whitelist, and `/statistika` renders all 30.
 *  - DECADES: every season's `decade`, reduced to per-decade counts.
 *  - MOMENT: `momentPinned` is the 1993 Cup photograph, pinned by `_id`
 *    (D-3.24-2 — see `MOMENT_PHOTO_ID`). `moment` is the older deterministic
 *    lookup kept beneath it as the fallback: one real, captioned,
 *    season-anchored, landscape archival photo, oldest era first then widest
 *    crop (D-3.03-4). The hero photograph is excluded from THAT query by `_id`,
 *    explicitly: it is a 1980s scan that the oldest-first ordering would now
 *    rank *first*, and the only thing keeping it out was its missing caption —
 *    one caption typed in Studio and the same picture would have opened the
 *    page and closed it (D-3.10-5).
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
    | order(coalesce(legendRank, 9999) asc, name asc)[0...10]{
    name,
    "slug": slug.current,
    role,
    playingYears,
    legendRank,
    legendAppearances,
    careerStats { appearances },
    "portrait": *[_type == "photo" && relatedPerson._ref == ^._id][0].image
  },
  "records": *[_type == "clubRecord"]{ label, value, category, order },
  "decadeValues": *[_type == "season" && defined(decade)].decade,
  "momentPinned": *[_type == "photo" && _id == $momentPhotoId && defined(image)][0]{
      "image": image, caption, date
    },
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
  /** The book's rank and the count it is built on. Rendered on the card as
   *  „1. Петар Андреев 555", the same format `/legendi` uses — the two pages
   *  show the same ten people and must not describe them differently
   *  (D-3.15-5).
   *
   *  `careerStats` is the count's FALLBACK source and is selected here for
   *  exactly that invariant: at 3.19 `/legendi` began falling back to it, and
   *  the printed figure exists for only ranks 1–2 of the ten, so without it
   *  this band showed a number on two cards where `/legendi` showed one on all
   *  ten — the same people, described differently (D-3.19-2). */
  legendRank: number | null;
  legendAppearances: string | null;
  careerStats: { appearances: number | null } | null;
  portrait: SanityImageSource | null;
};

type Season = { title: string | null; photo: Photo | null };

/** „Момент од историјата" — the same shape whether it came from the pin or
 *  from the deterministic fallback, so the two are interchangeable. */
type MomentPhoto = {
  image: SanityImageSource | null;
  caption: string | null;
  date: string | null;
};

type HomeData = {
  settings: { title: string | null; description: string | null } | null;
  heroPinned: Season | null;
  heroSeason: Season | null;
  heroFallbackPhoto: Photo | null;
  legends: Legend[];
  records: ClubRecordData[];
  decadeValues: number[];
  momentPinned: MomentPhoto | null;
  moment: MomentPhoto | null;
};

const EMPTY: HomeData = {
  settings: null,
  heroPinned: null,
  heroSeason: null,
  heroFallbackPhoto: null,
  legends: [],
  records: [],
  decadeValues: [],
  momentPinned: null,
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
//
// „Разно" joined at 3.24 (owner request). It sits between „Статистика" and „За
// нас", the position it already holds in `src/lib/nav.ts` — a reader who learns
// an order from the header should not meet a different one at the foot of the
// homepage. Its sub-label reuses the opening words of `RAZNO_INTRO`, the voice
// `/razno` describes itself in, rather than inventing a second register for the
// same destination.
const QUICK_LINKS: { href: string; label: string; sub: string }[] = [
  { href: "/arhiva", label: "Архива", sub: "Сезона по сезона" },
  { href: "/legendi", label: "Легенди", sub: "Играчи и личности" },
  { href: "/statistika", label: "Статистика", sub: "Рекорди и табели" },
  { href: "/razno", label: "Разно", sub: "Теми од историјата" },
  { href: "/za-nas", label: "За нас", sub: "За овој проект" },
];

/**
 * The extra classes the LAST quick-link box needs so it never sits alone in a
 * half-empty row.
 *
 * The grid runs 1 / 2 / 5 tracks. At five boxes the `lg` row is exact, but the
 * two-track row between `sm` and `lg` leaves the fifth on a line of its own, so
 * it widens to close that line — the same „widen the last cell rather than
 * leave an empty track" move `ClubRecords` makes (D-3.05b-2). `lg:col-span-1`
 * is not redundant: it cancels the `sm` span again once the row is exact, and
 * without it the wide cell would leak up into the five-track layout.
 *
 * Derived from the array's length, so adding a sixth box changes the outcome
 * instead of silently breaking the row.
 */
const LAST_TILE_SPAN =
  QUICK_LINKS.length % 2 === 1 ? "sm:col-span-2 lg:col-span-1" : "";

/**
 * The three marks in the hero badge, in the owner's order (3.19): znamenca
 * 1, 6 and 9 of the set in `public/znamenca/`.
 *
 * All three are **background-free** — the artwork is cut out, so it sits on
 * the navy and on the photograph without a white card behind it. Since 3.24
 * that is true of every slot, where before it was true of none: the first is
 * now `/crest.svg` itself (the same transparent vector the header renders —
 * it was always the same pennant as `zname-01.webp`, only with its white
 * background still attached), and 6 and 9 were replaced in place by
 * owner-supplied cut-outs of the same two crests.
 *
 * `width`/`height` are intrinsic — 364/446/438 × **520**. The shared 520 is
 * deliberate and survived the swap: it is what lets a single `h-*` + `w-auto`
 * normalise three different shapes into a set. `/crest.svg` has no pixels of
 * its own, so its pair is its viewBox (864×1233) reduced to that same height.
 *
 * Listed here rather than inline so the order is one edit, and so nothing
 * about them is duplicated between the markup and this table.
 */
const ZNAMENCA: { src: string; width: number; height: number }[] = [
  { src: "/crest.svg", width: 364, height: 520 },
  { src: "/znamenca/zname-06.webp", width: 446, height: 520 },
  { src: "/znamenca/zname-09.webp", width: 438, height: 520 },
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
      {
        heroSeasonSlug: HERO_SEASON_SLUG,
        heroPhotoId: HERO_PHOTO_ID,
        momentPhotoId: MOMENT_PHOTO_ID,
      },
      "the homepage",
    );
  } catch {
    data = EMPTY;
  }

  const { settings, heroPinned, heroSeason, heroFallbackPhoto, records } = data;

  // The pin wins; the deterministic lookup catches the fall (D-3.24-2).
  const momentIsPinned = Boolean(data.momentPinned?.image);
  const moment = data.momentPinned ?? data.moment;

  const heroTitle = settings?.title?.trim() || "ФК Беласица";
  const heroPhoto =
    heroPinned?.photo?.image ??
    heroSeason?.photo?.image ??
    heroFallbackPhoto?.image ??
    null;
  const heroAlt = heroAltFor(data);

  const description = settings?.description?.trim() || null;

  // DISPLAY order: the book's rank, 1→10, via the same `compareByLegendRank`
  // the /legendi Играчи band uses — so the two pages that show these same ten
  // people present them identically (D-3.15-11).
  //
  // This **supersedes D-3.03-2's** portraits-first-then-alphabetical display
  // sort. That rule existed so real faces led the marquee instead of monogram
  // tiles, and it was the right call while the cards were anonymous. From 3.15
  // each card PRINTS its rank, and a row reading „Ранг 6 · Ранг 4 · Ранг 7 · Ранг 2…"
  // reads as a bug rather than as a curated order — a visible number has to run
  // in its own sequence or it is noise.
  //
  // Nothing is lost by dropping the portrait tiebreak here: all ten of today's
  // band have a portrait on file, so it was already a no-op and only the
  // alphabetical fallback was doing anything. Should a future top-ten member
  // have none, `LegendCard`'s monogram tile is the specified treatment
  // (brand.md §Photo treatment) — never a stand-in face, and never a reason to
  // drop somebody from the band.
  //
  // Band MEMBERSHIP is unchanged — the ten are still picked by `legendRank` in
  // GROQ. Only people with a slug (a real detail page) are shown.
  const legends = [...data.legends]
    .filter((p): p is Legend & { slug: string } => Boolean(p.slug))
    .sort(compareByLegendRank);

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
              photograph's lower edge. No panel behind the badge: the artwork
              carries itself on navy — or over the photograph — and a white
              rectangle only read as a sticker (owner decision, 3.06a,
              superseding D-crest-2).

              Since 3.19 the badge is THREE marks rather than the single crest
              (owner instruction, Ace): znamenca 1, 6 and 9, in that order.

              3.24 made that decision literal. Until then the three were
              scans WITH their white backgrounds, so the „no panel" above was
              defeated by the files themselves — each one painted its own
              white rectangle onto the navy, which is the sticker 3.06a threw
              out. All three are now cut out, so the artwork really does carry
              itself. `/crest.svg` is unchanged and still the header's mark;
              slot 1 now points at it directly rather than at a second copy of
              the same pennant. */}
          <div className="flex flex-wrap items-end gap-5 lg:gap-8">
            <div className="relative z-10 -mt-9 flex-none md:-mt-11 lg:-mt-14">
              {/* One accessible object, not three. The three pennants are the
                  club's mark shown three ways; read out individually they would
                  be three near-identical announcements in front of an <h1> that
                  already says „ФК Беласица". So the row carries a single
                  `role="img"` + `aria-label` and every <img> is `alt=""`.
                  The label names the group and nothing more: dating the
                  pennants would be a factual claim, and `facts.md` holds no
                  entry for them. */}
              <div
                role="img"
                aria-label="Три знаменца на ФК Беласица"
                className="flex items-end gap-3 md:gap-4"
              >
                {/* Normalised by HEIGHT, not width: all three are 520px tall
                    with different widths (364 / 446 / 438), so one `h-*`
                    plus `w-auto` makes them read as a set and each keeps its
                    own proportions. Since 3.24 that height is the ARTWORK's,
                    not a scan's — cutting the backgrounds out also trimmed
                    the white margins each file used to carry, so the same
                    `h-*` now renders visibly bigger marks. That is the
                    intended result, not drift: the box was always mostly
                    padding. Heights are ~2/3 of the single crest's
                    (h-24/32/40) so three side by side do not outweigh the
                    wordmark; below `md` the row simply wraps onto its own line
                    above the <h1> rather than shrinking to illegibility.

                    Plain <img loading="lazy">, matching `SiteHeader` and the
                    crest this replaced: this page's LCP is the hero
                    *photograph* behind them, so nothing here may be promised
                    to the network ahead of it. `lazy` is what actually removes
                    the preload — React 19 hoists any non-lazy SSR image into
                    one (D-3.09-2). Intrinsic `width`/`height` on each so the
                    row reserves its box before the bytes land. */}
                {ZNAMENCA.map((zname) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={zname.src}
                    src={zname.src}
                    alt=""
                    width={zname.width}
                    height={zname.height}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-auto md:h-20 lg:h-28"
                  />
                ))}
              </div>
            </div>

            {/* No <br>: it sets on one line from `md` up and wraps to two on
                narrow screens, which is the right break for the lockup. The
                wordmark carries its own clamp rather than `u-display`'s, so
                „ФК БЕЛАСИЦА" holds one line beside the pennant row. */}
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

              {/* Gated on the PIN, not merely on there being a photograph
                  (3.24). The label names the youth school, and only the pinned
                  1993 Cup side is that story; if the pin is ever unpublished
                  the section falls back to a different picture, and the link
                  would then be a sentence the page cannot support. It goes away
                  rather than becoming false.

                  `u-link` — the site's text link, the same one „Сите легенди"
                  and „За архивата" use, so this reads as a link rather than a
                  fifth button. `self-start` keeps the orange rule the width of
                  the words: the figcaption is a column flex, which would
                  otherwise stretch an inline-flex child across the whole
                  panel. Orange ring, because this sits on navy. */}
              {momentIsPinned && (
                <Link
                  href={MOMENT_LINK.href}
                  className={`u-link mt-7 self-start text-paper ${focusOnNavy}`}
                >
                  {MOMENT_LINK.label}
                </Link>
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

          {/* Five tracks at `lg`, not four: „Разно" joined the row at 3.24 and
              a fifth box under a four-track grid would stand alone on a second
              line with three empty tracks beside it. The tiles are short — a
              label over one line of meta — so five across at 1248px is a
              comfortable ~185px each rather than a squeeze. */}
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {QUICK_LINKS.map((card, i) => (
              <Reveal
                as="li"
                key={card.href}
                delayIndex={i}
                className={
                  i === QUICK_LINKS.length - 1 ? LAST_TILE_SPAN : undefined
                }
              >
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
