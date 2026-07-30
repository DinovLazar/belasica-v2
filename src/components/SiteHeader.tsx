"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { focusOnNavy } from "@/lib/focus";
import { Container } from "@/components/Container";

/**
 * Site header — brand.md §Components ("Header nav").
 *
 * A navy block opened by the 6px orange bar that also closes the footer, so
 * the whole page reads as one bounded object. Restyled at 3.05 rather than
 * rewritten: it is still `sticky top-0` with the same burger and the same
 * `isActivePath` logic, so `--spacing-header` and every `top-header` /
 * `scroll-mt-header` consumer downstream survived with a re-measure only.
 *
 * Height arithmetic (kept in sync with `--spacing-header`, 78px):
 *   6px bar + 12px pad + 48px crest block + 12px pad = 78px.
 */

// Nav item — condensed caps over a 3px underline that carries the state.
// Never colour-only: the active item gains an orange rule, hover a paper one.
const navLink =
  "inline-flex items-center border-b-[3px] py-2.5 font-display text-base font-semibold uppercase tracking-[0.06em] transition-colors";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy text-paper">
      {/* The club's colour, edge to edge, above everything. */}
      <div className="h-1.5 w-full bg-orange" />

      <Container className="flex items-center justify-between gap-4 py-3">
        <Link href="/" className={cn("flex items-center gap-3", focusOnNavy)}>
          {/* The crest sits on white because its artwork's left half is white,
              so it needs a light backdrop to read on the navy bar — the tile
              stays even though the PNG's background is now transparent
              (D-crest-2). Decorative: the wordmark carries the accessible name. */}
          <span className="flex shrink-0 items-center bg-white p-1">
            <Image
              src="/crest.png"
              alt=""
              width={44}
              height={62}
              priority
              className="h-10 w-auto"
            />
          </span>
          <span className="u-h3 text-paper">ФК Беласица</span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Главна навигација"
          className="hidden items-center gap-7 md:flex lg:gap-9"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  navLink,
                  focusOnNavy,
                  active
                    ? "border-orange text-paper"
                    : "border-transparent text-paper/80 hover:border-paper hover:text-paper",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle — 24px icon + 12px padding a side = a 48px target. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={cn(
            "inline-flex items-center justify-center p-3 text-paper md:hidden",
            focusOnNavy,
          )}
        >
          <span className="sr-only">{open ? "Затвори мени" : "Отвори мени"}</span>
          {open ? (
            <X className="size-6" aria-hidden />
          ) : (
            <Menu className="size-6" aria-hidden />
          )}
        </button>
      </Container>

      {/* Mobile nav panel — the second navy value, so it reads as a panel
          dropped in front of the page rather than more header. */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Главна навигација"
          className="bg-navy-2 md:hidden"
        >
          <Container className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    // A stacked list reads its state down the LEFT edge, so
                    // here the marker is a left bar — on a nav row, not on a
                    // card, which is what brand rule 4 is about. 3px keeps it
                    // a marker rather than a slab.
                    "flex w-full border-l-[3px] py-3 pl-3.5 font-display text-base font-semibold uppercase tracking-[0.06em] transition-colors",
                    focusOnNavy,
                    active
                      ? "border-orange text-paper"
                      : "border-transparent text-paper/80 hover:border-paper/45 hover:text-paper",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      )}
    </header>
  );
}
