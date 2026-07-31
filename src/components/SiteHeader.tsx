"use client";

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
          {/* No tile. D-crest-2 put the crest on a white square because its
              left half is white and was assumed to need a light backdrop; on
              the navy bar that white half is simply the artwork, at 14.9:1,
              and the square read as a sticker around the badge. Owner asked
              for the crest alone (3.06a). Decorative: the wordmark carries the
              accessible name.

              `/crest.svg` — the traced, repaired vector master (3.05b). It is
              the same artwork as the raster lineage, not a new crest: the
              source scan was clipped on its right edge and its pennant point
              was cut off flat, and the rebuild closes the point on the
              artwork's own diagonals. Being vector, it is sharp at every size
              from this 40px block up to the hero's 128px one.

              `width`/`height` track the file: the viewBox is now cropped to
              the artwork's own bounds (864×1233), so there is no transparent
              margin left to trim in CSS.

              h-12, not h-10: the tile was 40px of crest plus 4px of padding
              top and bottom. Dropping the padding and growing the crest to
              48px keeps this row — and therefore `--spacing-header` at 78px —
              byte-identical, so every `scroll-mt-header` anchor still lands
              flush. */}
          {/* A plain <img>, not next/image (3.09). The crest is `unoptimized`
              for a structural reason — Next will not optimize SVG without
              `dangerouslyAllowSVG`, and an SVG has no raster variants worth
              generating (D-3.05b-7) — so `next/image` was contributing exactly
              one thing here: a `<link rel=preload as=image>` on **every** route.
              The file is 33 KB over the wire, and Lighthouse showed it sharing
              the simulated critical path with the LCP photograph on /arhiva and
              /legendi, where the score is decided.

              `loading="lazy"` is what finally takes it off that path: React 19
              hoists any non-lazy SSR image into a `<link rel=preload>` of its
              own, so both `priority` and a bare `<img>` kept preloading it
              (both measured). Lazy does not mean late for a logo sitting at the
              top of the viewport — the browser fetches it as soon as layout
              places it — it only means the crest stops being promised to the
              network ahead of the photograph the score is measured on.
              Explicit width/height keep the box reserved, so CLS stays 0
              (D-3.09-2). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/crest.svg"
            alt=""
            width={864}
            height={1233}
            loading="lazy"
            decoding="async"
            className="h-12 w-auto shrink-0"
          />
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
          <span className="sr-only">
            {open ? "Затвори мени" : "Отвори мени"}
          </span>
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
