import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { golos, oswald } from "./fonts";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The two strings every share card reuses. Both keep the unofficial-archive
// self-description (brand rule 2 — metadata on every page).
const SITE_TITLE = "ФК Беласица — неофицијална архива";
const SITE_DESCRIPTION =
  "Неофицијална архива посветена на историјата на ФК Беласица.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · ФК Беласица",
  },
  description: SITE_DESCRIPTION,
  // ⚠️ Deliberately NO `alternates.canonical` here. Next merges metadata from
  // the root layout down, so a canonical set at the root would be INHERITED by
  // every page that does not override it — telling search engines that all 322
  // pages are the homepage. Each route declares its own instead (3.23, B2).
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    locale: "mk_MK",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // A purpose-built 1200×630 share card (3.23, B5). It replaces `/crest.png`,
    // which is 864×1220 — a PORTRAIT image in a landscape slot, so every share
    // of this site rendered as a letterboxed crest in a thumbnail. Built as a
    // static asset from the real tokens and the real fonts, not by `next/og` at
    // runtime: an image route is build fragility this archive does not need.
    // Dimensions confirmed against the file on disk with `sips`, not assumed.
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "ФК Беласица — неофицијална архива",
      },
    ],
  },
  // `summary_large_image`, not `summary` — the small square variant was
  // cropping the card to a thumbnail even once the image itself was landscape.
  // Title, description and image inherit from the resolved metadata above.
  twitter: {
    card: "summary_large_image",
  },
  // Search Console. Emitted only when the variable is set; unset today, and no
  // value is invented — supplying the real token is an owner step after the
  // domain cutover. `verification: {}` would still emit nothing, but keeping
  // the key absent entirely is the cleaner no-op.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

/**
 * Site-level structured data (3.23, B6) — and the hard constraint on it.
 *
 * This is an unofficial archive **about** FK Belasica. It is not the club, does
 * not represent it, and must never be marked up as though it were. So there is
 * deliberately **no** `SportsTeam`, `SportsOrganization` or `Organization` node
 * anywhere on this site: giving the club an entity whose `url` is this domain
 * is precisely the claim `/pravni-informacii` §1 exists to deny.
 *
 * Also absent, on content-truth grounds rather than taste:
 *  - **`foundingDate`.** The founding year 1922 is UNVERIFIED in `facts.md`. It
 *    renders on the homepage only because it sits inside owner-authored CMS
 *    copy; that is not licence to assert it as machine-readable fact.
 *  - **`potentialAction` / SearchAction.** The site has no server-side search
 *    endpoint. Declaring one that does not exist is exactly the invented claim
 *    this project does not ship. (/legendi's filter is client-side over an
 *    already-rendered list.)
 *  - **`LocalBusiness`, address, telephone, openingHours, aggregateRating.**
 *    None is a fact about this site, and the phone number has never been a
 *    verified fact at all.
 */
const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_TITLE,
  url: SITE_URL,
  inLanguage: "mk",
  description: SITE_DESCRIPTION,
};

// Bare root layout: <html>/<body>, fonts, global styles, analytics. The site
// chrome (header/footer) lives in the (site) route group so the embedded Studio
// at /studio renders full-screen without it. See D-1.04-3.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk" className={`${golos.variable} ${oswald.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* One `WebSite` node for the whole site. `JSON.stringify` rather than a
            hand-written string, so the block cannot drift out of valid JSON. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
