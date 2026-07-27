import type { MetadataRoute } from "next";

// Production origin — the Vercel default domain; no custom domain yet. Kept in
// sync by hand with src/app/layout.tsx (metadataBase) and src/app/sitemap.ts —
// update all three when a domain lands.
const SITE_URL = "https://belasica-v2.vercel.app";

// The public site is fully indexable; only the embedded Studio is kept out —
// it is an editing tool, not archive content ("/studio" prefix-matches
// /studio and everything under it).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
