"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Направление В — the header.
 *
 * The one client component in this exploration. It is here because the
 * direction's brief calls for pronounced states, and at 375 the condensed caps
 * nav is too wide to wrap gracefully — so it collapses into a full-width panel
 * behind a 48px toggle rather than shrinking the type below the direction's
 * own floor.
 *
 * Sticky, unlike the other two directions: this is the one that behaves like a
 * contemporary club site.
 */
export function TerraceHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="pc-block-navy sticky top-0 z-40">
      <div className="pc-topbar" />

      <div className="pc-wrap flex items-center justify-between gap-4 py-3">
        <Link
          href="/predlog-c"
          className="pc-focus pc-focus--on-navy flex items-center gap-3"
        >
          {/* The crest sits on white because its white left half needs a light
              ground. Decorative — the wordmark carries the accessible name. */}
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
          <span className="pc-h3 pc-h3--on-navy">ФК Беласица</span>
        </Link>

        <nav
          aria-label="Главна навигација"
          className="hidden items-center gap-7 md:flex lg:gap-9"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              // This page is the homepage proposal, so „Почетна" is current
              // even though the URL is /predlog-c.
              aria-current={item.href === "/" ? "page" : undefined}
              className="pc-nav-link pc-focus pc-focus--on-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="pc-mobile-nav"
          // 24px icon + 12px padding each side = 48px target.
          className="pc-burger pc-focus pc-focus--on-navy inline-flex md:hidden"
        >
          <span className="sr-only">{open ? "Затвори мени" : "Отвори мени"}</span>
          {open ? (
            <X className="size-6" aria-hidden />
          ) : (
            <Menu className="size-6" aria-hidden />
          )}
        </button>
      </div>

      {open && (
        <nav
          id="pc-mobile-nav"
          aria-label="Главна навигација"
          className="pc-block-navy-2 md:hidden"
        >
          <ul className="pc-wrap flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.href === "/" ? "page" : undefined}
                  className="pc-nav-link pc-nav-link--mobile pc-focus pc-focus--on-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
