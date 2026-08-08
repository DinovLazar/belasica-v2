import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { RAZNO_TOPICS } from "@/content/razno";

// Production origin — the Vercel default domain; no custom domain yet. Kept in
// sync by hand with src/app/layout.tsx (metadataBase) and src/app/robots.ts —
// update all three when a domain lands.
const SITE_URL = "https://belasica-v2.vercel.app";

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

// The seven static routes — every top-level nav destination. /studio is
// deliberately absent (robots.ts disallows it too): an editing tool, not
// archive content.
const STATIC_PATHS = [
  "/",
  "/arhiva",
  "/statistika",
  "/legendi",
  "/razno",
  "/za-nas",
  "/kontakt",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: SitemapData | null = null;
  try {
    data = await client.fetch<SitemapData>(SITEMAP_QUERY);
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
