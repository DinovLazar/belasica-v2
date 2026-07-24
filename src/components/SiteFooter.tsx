import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { Container } from "@/components/Container";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import {
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";

// Focus: orange 2px ring, 2px offset against the light footer surface.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-footer";

// Footer text link: navy label, orange underline on hover (D-1.02-1 — orange
// never carries text on a light surface). Shared by every link in the footer.
const footerLink = cn(
  "inline-flex w-fit font-sans text-small text-navy underline-offset-4 decoration-2 transition-colors hover:underline hover:decoration-orange",
  focusRing,
);

// Column heading — overline treatment (navy/neutral, never orange — D-1.03-1).
const columnHeading =
  "text-overline uppercase tracking-overline text-neutral-700";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist bg-footer text-ink">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-8">
          {/* (a) Brand — wordmark, unofficial-archive identity, disclaimer */}
          <div className="md:max-w-sm">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2.5 rounded-card",
                focusRing,
              )}
            >
              {/* Crest on a white tile (matches the header treatment). */}
              <span className="flex shrink-0 items-center rounded-card bg-white p-1">
                <Image
                  src="/crest.png"
                  alt=""
                  width={40}
                  height={57}
                  className="h-9 w-auto"
                />
              </span>
              <span className="font-serif text-h3 font-semibold tracking-tight text-navy">
                ФК Беласица
              </span>
            </Link>
            <p className="mt-4 text-overline uppercase tracking-overline text-neutral-700">
              {UNOFFICIAL_ARCHIVE_LABEL}
            </p>
            <p className="mt-3 max-w-measure text-small text-neutral-700">
              {UNOFFICIAL_ARCHIVE_STATEMENT}
            </p>
          </div>

          {/* (b–d) Link columns — stack 2-up on mobile, row on desktop */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:gap-x-16">
            {/* (b) Навигација — reuses the primary nav */}
            <nav
              aria-labelledby="footer-nav-heading"
              className="flex flex-col gap-3"
            >
              <h2 id="footer-nav-heading" className={columnHeading}>
                Навигација
              </h2>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* (c) Контакт — the contact page is live; the direct email is not a
                verified fact yet (facts.md — deferred to 3.03), so it renders as
                a visible placeholder, never a demo value (PL-3, was PL-9). */}
            <div className="flex flex-col items-start gap-3">
              <h2 className={columnHeading}>Контакт</h2>
              <Link href="/kontakt" className={footerLink}>
                Контакт формулар
              </Link>
              <PlaceholderChip label="е-пошта за контакт" />
            </div>

            {/* (d) Следете нѐ — no social profiles are confirmed yet (facts.md —
                UNVERIFIED), so the slot is a visible placeholder, not the old
                demo links (PL-15, was PL-9). */}
            <div className="flex flex-col items-start gap-3">
              <h2 className={columnHeading}>Следете нѐ</h2>
              <PlaceholderChip label="профили на социјални мрежи" />
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright, divided from the columns above */}
        <div className="mt-12 border-t border-mist pt-6">
          <p className="text-small text-neutral-500">
            © {year} ФК Беласица — {UNOFFICIAL_ARCHIVE_LABEL}
          </p>
        </div>
      </Container>
    </footer>
  );
}
