import type { MetadataRoute } from "next";
import { fetchOrThrow } from "@/sanity/fetch";
import { RAZNO_TOPICS } from "@/content/razno";
import { SITE_URL } from "@/lib/site";

// Match the pages (D-1.05-4): a season or person published in Studio reaches
// the sitemap within ~a minute, without a redeploy.
export const revalidate = 60;

/**
 * Every published slug in one round trip, with `_updatedAt` as the honest
 * `lastModified` — the document's own revision time, not an invented date.
 * `defined(slug.current)` matches the filter both `generateStaticParams`
 * implementations use, so the sitemap lists exactly the URLs that resolve.
 */
const SITEMAP_QUERY = /* groq */ `{
  "seasons": *[_type == "season" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "people": *[_type == "person" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
}`;

type SlugEntry = { slug: string; updatedAt: string };

type SitemapData = {
  seasons: SlugEntry[] | null;
  people: SlugEntry[] | null;
};

// The eight static routes — every top-level nav destination, plus the legal
// page. /studio is deliberately absent (robots.ts disallows it too): an editing
// tool, not archive content.
//
// `/pravni-informacii` was missing until 3.23 (C2). It is a real, indexable page
// linked from the footer of all 330 routes, and it carries the archive's
// takedown promise — the one page a rights holder is most likely to be looking
// for. It is not in `NAV_ITEMS` by design (D-3.07-2), which is why listing the
// nav's seven destinations quietly dropped it.
const STATIC_PATHS = [
  "/",
  "/arhiva",
  "/statistika",
  "/legendi",
  "/razno",
  "/za-nas",
  "/kontakt",
  "/pravni-informacii",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: SitemapData | null = null;
  try {
    // Retried through the shared helper since 3.23 (C3). The existing catch is
    // KEPT and unchanged: this route's correct failure mode is to degrade to
    // the static paths, not to fail the build. What the helper adds is five
    // bounded attempts before that degradation, so a single transient
    // `ConnectTimeoutError` no longer silently costs the sitemap 314 URLs.
    data = await fetchOrThrow<SitemapData>(
      SITEMAP_QUERY,
      {},
      "the sitemap slug list",
    );
  } catch {
    // A failed read must not break the route. The static pages alone are
    // still a valid sitemap; the slugs return on the next revalidation.
    data = null;
  }

  // "/" concatenates to the canonical trailing-slash root URL.
  const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  // The seven „Разно" topics. Listed from the same array the routes are
  // generated from, so a topic can never be prerendered without appearing here.
  // No `lastModified`: unlike a season or a person these carry no `_updatedAt`
  // — they change when the repo changes — and inventing a date for them would
  // be exactly the kind of made-up value the archive does not publish.
  const raznoRoutes: MetadataRoute.Sitemap = RAZNO_TOPICS.map((topic) => ({
    url: `${SITE_URL}/razno/${topic.slug}`,
  }));

  const seasonRoutes: MetadataRoute.Sitemap = (data?.seasons ?? []).map(
    (season) => ({
      url: `${SITE_URL}/arhiva/${season.slug}`,
      lastModified: season.updatedAt,
    }),
  );

  const personRoutes: MetadataRoute.Sitemap = (data?.people ?? []).map(
    (person) => ({
      url: `${SITE_URL}/legendi/${person.slug}`,
      lastModified: person.updatedAt,
    }),
  );

  return [...staticRoutes, ...raznoRoutes, ...seasonRoutes, ...personRoutes];
}
