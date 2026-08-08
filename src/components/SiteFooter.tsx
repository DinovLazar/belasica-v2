import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { focusOnNavy } from "@/lib/focus";
import { Container } from "@/components/Container";
import { SectionOverline } from "@/components/home/SectionOverline";
import { SocialLinks } from "@/components/SocialLinks";
import {
  CONTACT_EMAIL,
  CONTENT_PERMISSION_NOTICE,
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";

/**
 * Site footer — brand.md §Components ("Footer").
 *
 * The last block: navy, closed by the same 6px orange bar that opens the
 * header, so the page reads as one bounded object. At 3.05 the footer moved
 * off the old light `footer` surface onto navy — the direction alternates
 * navy and paper blocks, and a third light value at the bottom broke that
 * rhythm (the `footer` colour token is retired with it).
 *
 * Every string here comes from `src/lib/facts.ts` (VERIFIED): the
 * unofficial-archive statement (OV-3), the contact address, the two social
 * profiles and the copy-permission notice in the bottom bar. Since 3.15 the
 * footer renders **no placeholder chip at all** — the last one (PL-15, socials)
 * closed with the Facebook + Instagram links below.
 */

// Footer link — small caps over a hairline that fills in on hover. `py-1.5`
// pads the hit area past 24px (WCAG 2.5.8); the column uses `gap-2` so the
// padding reads as rhythm rather than drift.
const footerLink = cn(
  "inline-flex w-fit border-b-2 border-transparent py-1.5 text-small text-paper/80 transition-colors hover:border-orange hover:text-paper",
  focusOnNavy,
);

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-paper">
      <div className="h-1.5 w-full bg-orange" />
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] md:gap-8">
          {/* (a) Brand — wordmark, unofficial-archive identity, disclaimer */}
          <div>
            <p className="u-h2 text-paper">ФК Беласица</p>
            <p className="mt-4 max-w-[44ch] text-small text-paper/80">
              {UNOFFICIAL_ARCHIVE_STATEMENT}
            </p>
          </div>

          {/* (b) Навигација — reuses the primary nav */}
          <nav aria-labelledby="footer-nav-heading" className="min-w-0">
            <h2 id="footer-nav-heading">
              <SectionOverline variant="onNavy">Навигација</SectionOverline>
            </h2>
            <ul className="mt-5 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* (c) Контакт — the address became a VERIFIED `facts.md` entry on
              2026-07-31 (owner, chat), so the chip that had stood here since
              3.03 is now the real `mailto:`. Clears the email half of PL-3 /
              PL-9; the socials below stay a chip, still unverified. */}
          <div className="min-w-0">
            <h2>
              <SectionOverline variant="onNavy">Контакт</SectionOverline>
            </h2>
            <ul className="mt-5 flex flex-col items-start gap-3">
              <li>
                <Link href="/kontakt" className={footerLink}>
                  Контакт формулар
                </Link>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={footerLink}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* (d) Следете нѐ — both profiles, as icon links. Until 3.15 this
              column held one text link calling the Facebook profile a *fan
              page* (D-3.12-6), on the reasoning that this archive does not run
              it. „За нас" now states the opposite in the author's own words —
              Аце Стојанов writes the site, the FB profile FK Belasica
              1956-2006 and the book — so that framing is retired (D-3.15-2)
              rather than left to contradict the About page. Instagram is the
              same identity (`belasica1956.2006`). Closes PL-15 here and on
              `/kontakt`, which renders the same component. */}
          <div className="min-w-0">
            <h2>
              <SectionOverline variant="onNavy">Следете нѐ</SectionOverline>
            </h2>
            <SocialLinks onNavy className="mt-4" />
          </div>
        </div>

        {/* Bottom bar — the identity line and copyright, on a hairline.
            „Правни информации" sits here beside the © rather than in
            „Навигација" or the header: it must be reachable from every page,
            but it is not a seventh destination competing with the six real
            ones, and `src/lib/nav.ts` stays the single source for those
            (D-3.07-2). */}
        <div className="mt-12 border-t border-paper/15 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
            <p className="text-small uppercase tracking-[0.16em] text-paper/80">
              {UNOFFICIAL_ARCHIVE_LABEL}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <Link href="/pravni-informacii" className={footerLink}>
                Правни информации
              </Link>
              <p className="text-small text-paper/80">© {year} ФК Беласица</p>
            </div>
          </div>

          {/* The copy posture, on its own row rather than as a fourth column:
              it belongs with the © and the legal link, not in the navigation.
              Its own row (not a third item in the flex above) because at 150
              characters it would otherwise force the © line to wrap oddly at
              every width between 375 and 1280. Capped at the reading measure so
              it does not run the full 1248px at desktop.

              ⚠ It asks for PERMISSION, not ownership — see
              `CONTENT_PERMISSION_NOTICE` in `src/lib/facts.ts` and D-3.15-1.
              Do not "tighten" it into a copyright claim: the archive publishes
              material whose rights sit elsewhere, and `/pravni-informacii` §5
              promises an unconditional takedown on request. */}
          <p className="mt-5 max-w-measure text-small text-paper/80">
            {CONTENT_PERMISSION_NOTICE}
          </p>
        </div>
      </Container>
    </footer>
  );
}
