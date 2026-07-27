import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { inter, sourceSerif } from "./fonts";
import "./globals.css";

// Production origin — the Vercel default domain; no custom domain yet and no
// env override exists (cf. src/sanity/env.ts, which holds only the Sanity
// NEXT_PUBLIC_* values). When a domain lands, update here and in robots.ts +
// sitemap.ts, which repeat it because they cannot import from a layout module.
const SITE_URL = "https://belasica-v2.vercel.app";

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
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    locale: "mk_MK",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // The club crest at its real pixel size (public/crest.png is 864×1220,
    // verified with sips). Resolved absolute via metadataBase.
    images: [
      {
        url: "/crest.png",
        width: 864,
        height: 1220,
        alt: "Грб на ФК Беласица",
      },
    ],
  },
  // Title, description and image inherit from the resolved metadata above.
  twitter: {
    card: "summary",
  },
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
    <html
      lang="mk"
      className={`${inter.variable} ${sourceSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
