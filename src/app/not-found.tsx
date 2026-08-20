import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BackToTop } from "@/components/BackToTop";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";

/**
 * 404 — „Страницата не постои" (Phase 3.23, B3).
 *
 * Until now there was **no `not-found.tsx` anywhere in the repo**, so an unknown
 * season slug — and `notFound()` is called on three routes — rendered Next's
 * own default: English, unstyled, no header, no footer, and no way back into the
 * archive. On a site whose whole subject is 322 interlinked pages, a dead end is
 * the one thing a 404 must not be.
 *
 * ⚠️ **Why this is at the app root and not in `(site)`, which the brief asked
 * for.** It was written at `src/app/(site)/not-found.tsx` first and measured:
 * a `not-found.tsx` inside a route group is only reached by an explicit
 * `notFound()` call from within that group. A genuinely unmatched URL has no
 * segment to match, so Next resolves the **root** boundary and rendered its
 * default 404 instead — `/nepostoecka-stranica` returned Next's `next-error-h1`
 * markup with the archive's own page sitting unused one directory away. Only
 * `app/not-found.tsx` catches both cases (D-3.23-8).
 *
 * The cost of moving up is that this file sits outside `(site)/layout.tsx`, so
 * it mounts that layout's chrome itself. That is the duplication below, and it
 * is deliberate: the alternative was two 404 files with one body component
 * between them, which is more surface for the same result. **If `(site)/layout.tsx`
 * gains a chrome element, add it here too.**
 *
 * ⚠️ The three Macedonian strings were supplied by the orchestrator and have
 * **not** been read by a native speaker. Recorded as an owed item.
 */
/**
 * The page needs a title of its own (SC 2.4.2 Page Titled).
 *
 * Without this export the route inherited the root layout's `title.default` and
 * every 404 on the site was served as „ФК Беласица — неофицијална архива" —
 * byte-identical to the homepage's. A title is the first thing a screen reader
 * announces and the label a tab and a bookmark carry, so „the page you asked
 * for does not exist" was the one thing the page never said in the one place
 * that gets read first. Measured before the change: `curl` on an unknown path
 * and on `/` returned the same `<title>`.
 *
 * `robots: noindex` rides along for the same reason it belongs on any 404 —
 * this is not a page to put in an index.
 */
export const metadata: Metadata = {
  title: "Страницата не постои",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      {/* Mirrors `(site)/layout.tsx` — see the note above. */}
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-navy focus:px-4 focus:py-2 focus:text-small focus:font-bold focus:text-paper",
          focusOnNavy,
        )}
      >
        Прескокни на содржина
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <PageHeader
          title="Страницата не постои"
          crumbs={[
            { label: "Почетна", href: "/" },
            { label: "Страницата не постои" },
          ]}
          intro="Страницата што ја баравте не е тука. Можеби е избришана, преместена, или адресата е погрешно напишана."
          // No `BreadcrumbList` here: this response is a 404 and describes no
          // real place in the archive. The visible trail stays — it is a way back.
          crumbStructuredData={false}
        />

        <Container className="py-section">
          <nav aria-label="Продолжете во архивата">
            <ul className="flex flex-col gap-2">
              {ONWARD.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={onwardLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </main>

      <SiteFooter />
      <BackToTop />
    </>
  );
}

/** The three ways back in. Not `NAV_ITEMS`: a reader who mistyped a URL wants
 *  the archive's main entrances, not all seven destinations restated. */
const ONWARD = [
  { label: "Почетна", href: "/" },
  { label: "Архива", href: "/arhiva" },
  { label: "Легенди", href: "/legendi" },
] as const;

/**
 * The footer navigation column's link, on paper.
 *
 * Same anatomy — a transparent 2px underline that fills orange on hover, the
 * same `py-1.5` hit padding past WCAG 2.5.8's 24px, the same `w-fit` so the
 * target is the word and not the column. Only the two colour values change, and
 * they have to: the footer's `text-paper/80` is a value for navy ground and
 * measures ~1.1:1 on paper. Navy ink on paper is 14.95:1 (D-3.23-6).
 */
const onwardLink = cn(
  "inline-flex w-fit border-b-2 border-transparent py-1.5 text-body-l font-bold text-navy transition-colors hover:border-orange",
  focusOnPaper,
);
