"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { Container } from "@/components/Container";

// Focus: orange 2px ring, 2px offset against the navy bar (handover §4).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-paper/10 bg-navy text-paper">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className={cn("flex items-center gap-2.5 rounded-card", focusRing)}
        >
          {/* Crest on a white tile — the artwork has a white background and a
              white left half, so it needs a light backdrop to read on the navy
              bar. Decorative: the wordmark text carries the accessible name. */}
          <span className="flex shrink-0 items-center rounded-card bg-white p-1">
            <Image
              src="/crest.png"
              alt=""
              width={40}
              height={57}
              priority
              className="h-9 w-auto"
            />
          </span>
          <span className="font-serif text-h3 font-semibold tracking-tight text-paper">
            ФК Беласица
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Главна навигација"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "border-b-2 pb-1 font-sans text-small font-medium transition-colors",
                  focusRing,
                  active
                    ? "border-orange text-paper"
                    : "border-transparent text-paper/[0.72] hover:text-paper",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={cn(
            "inline-flex items-center justify-center rounded-card p-2 text-paper md:hidden",
            focusRing,
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

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Главна навигација"
          className="border-t border-paper/15 md:hidden"
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
                    "border-l-2 py-3 pl-3 font-sans text-body font-medium transition-colors",
                    focusRing,
                    active
                      ? "border-orange text-paper"
                      : "border-transparent text-paper/[0.72] hover:text-paper",
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
