import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
