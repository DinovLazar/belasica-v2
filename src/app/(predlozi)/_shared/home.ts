import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

/**
 * Phase 3.05a — the homepage's data, once, for all three direction variants.
 *
 * `HOME_QUERY` is the live homepage's query (`src/app/(site)/page.tsx`)
 * transcribed unchanged, and the derivations below (`toDecadeCounts`, the
 * portraits-first legend sort, the hero fallback chain) repeat that page's
 * logic exactly. The point of this phase is to compare three *designs*, so all
 * three must render the same content from the same reads — any drift here
 * would make the comparison dishonest.
 *
 * It is a copy rather than an import because the live page keeps its query
 * private and is explicitly out of scope this phase: nothing under
 * `src/app/(site)/` may change, so this module cannot ask it to export.
 */
export const HOME_QUERY = /* groq */ `{
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

export type Legend = {
  name: string | null;
  slug: string;
  role: string[] | null;
  playingYears: string | null;
  portrait: SanityImageSource | null;
  hasPortrait: boolean;
};

export type ClubRecordData = {
  label: string | null;
  value: string | null;
  category: string | null;
  order: number | null;
};

export type DecadeCount = { decade: number; count: number };

type RawHomeData = {
  settings: { title: string | null; description: string | null } | null;
  heroSeason: { title: string | null; photo: Photo | null } | null;
  heroFallbackPhoto: Photo | null;
  legends: (Omit<Legend, "slug"> & { slug: string | null })[];
  records: ClubRecordData[];
  decadeValues: number[];
  moment: { image: SanityImageSource | null; caption: string | null; date: string | null } | null;
};

/** What a variant page actually renders — already sorted, counted, resolved. */
export type HomeView = {
  /** The site title, or the VERIFIED wordmark if `siteSettings` has none. */
  wordmark: string;
  /** Owner-authored club description; `null` renders a placeholder chip. */
  description: string | null;
  heroPhoto: SanityImageSource | null;
  heroAlt: string;
  legends: Legend[];
  /** Sorted honours → appearances → scorers, then the curated `order`. */
  records: ClubRecordData[];
  decades: DecadeCount[];
  moment: { image: SanityImageSource; caption: string | null; date: string | null } | null;
};

const EMPTY: RawHomeData = {
  settings: null,
  heroSeason: null,
  heroFallbackPhoto: null,
  legends: [],
  records: [],
  decadeValues: [],
  moment: null,
};

/** Reduce the flat list of season decades to sorted per-decade counts. */
function toDecadeCounts(values: number[]): DecadeCount[] {
  const counts = new Map<number, number>();
  for (const d of values) counts.set(d, (counts.get(d) ?? 0) + 1);
  return [...counts.entries()]
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => a.decade - b.decade);
}

/** Honours lead — a trophy is the headline achievement (live page, D-3.03-3). */
const CATEGORY_PRIORITY: Record<string, number> = {
  honours: 0,
  appearances: 1,
  scorers: 2,
  other: 3,
};

function sortRecords(records: ClubRecordData[]): ClubRecordData[] {
  return [...records]
    .filter((r) => r.label?.trim() && r.value?.trim())
    .sort((a, b) => {
      const pa = CATEGORY_PRIORITY[a.category ?? "other"] ?? 3;
      const pb = CATEGORY_PRIORITY[b.category ?? "other"] ?? 3;
      if (pa !== pb) return pa - pb;
      const oa = a.order ?? Number.MAX_SAFE_INTEGER;
      const ob = b.order ?? Number.MAX_SAFE_INTEGER;
      if (oa !== ob) return oa - ob;
      return (a.label ?? "").localeCompare(b.label ?? "", "mk");
    });
}

export async function getHomeView(): Promise<HomeView> {
  let data: RawHomeData = EMPTY;
  try {
    data = await client.fetch<RawHomeData>(HOME_QUERY);
  } catch {
    // A failed read renders the placeholder page rather than crashing — and
    // never invents filler to cover the gap (content-truth).
    data = EMPTY;
  }

  const { settings, heroSeason, heroFallbackPhoto, moment } = data;

  return {
    wordmark: settings?.title?.trim() || "ФК Беласица",
    description: settings?.description?.trim() || null,
    heroPhoto: heroSeason?.photo?.image ?? heroFallbackPhoto?.image ?? null,
    heroAlt:
      heroSeason?.photo?.caption ||
      heroFallbackPhoto?.caption ||
      "Архивска фотографија на ФК Беласица",
    legends: data.legends
      .filter((p): p is Legend => Boolean(p.slug))
      .sort((a, b) => {
        if (a.hasPortrait !== b.hasPortrait) return a.hasPortrait ? -1 : 1;
        return (a.name ?? "").localeCompare(b.name ?? "", "mk");
      }),
    records: sortRecords(data.records),
    decades: toDecadeCounts(data.decadeValues),
    moment: moment?.image
      ? { image: moment.image, caption: moment.caption, date: moment.date }
      : null,
  };
}
