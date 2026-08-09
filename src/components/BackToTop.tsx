"use client";

import { useEffect, useState } from "react";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/** Show the button once the reader is this many viewport heights down. */
const REVEAL_AFTER_VIEWPORTS = 1.5;

/**
 * „Назад на врвот" — the site's one fixed control (3.17).
 *
 * Mounted once, in the `(site)` layout, so every public page has it and
 * `/studio` — which sits outside that route group — correctly never does. The
 * pages that need it are the long ones (a season document, `/arhiva`,
 * `/legendi`, a `/razno` topic), but a control that appears on some pages and
 * not others is a control a reader cannot rely on, so the rule is the scroll
 * position rather than the route.
 *
 * **Renders nothing until it is needed.** Hidden means unmounted, not
 * `opacity: 0` — so it is absent from every prerendered page, costs the server
 * payload nothing, and cannot be tabbed to while invisible.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * REVEAL_AFTER_VIEWPORTS);
    };

    // Read once on mount: a restored scroll position or a deep link lands the
    // reader mid-page with no scroll event to follow, and the button has to be
    // there already.
    read();

    // Coalesced through rAF — the listener fires far more often than the paint,
    // and the only thing it does is compare two numbers per frame.
    const onScroll = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  const returnToTop = () => {
    // Read at click time, not at mount: the setting can change under a running
    // page, and this is the only moment its answer matters.
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top: 0, behavior });

    // Focus follows the scroll. Without this the click leaves the keyboard
    // stranded wherever it was — in the footer, at the bottom of a page that is
    // now scrolled to the top — and this button unmounts itself the moment the
    // scroll passes its threshold, so focus would fall to <body>. Handing it to
    // the skip link restarts the tab order where the reader now is.
    document.querySelector<HTMLElement>('a[href="#main"]')?.focus();
  };

  return (
    <button
      type="button"
      onClick={returnToTop}
      className={cn(
        "fixed bottom-5 right-5 z-30 md:bottom-8 md:right-8",
        // z-30, deliberately: under the header (z-40), under the skip link
        // (focus:z-50) and under `PhotoLightbox` (z-50). An open lightbox is a
        // photograph the reader chose to look at; nothing floats over it.
        "flex h-12 w-12 items-center justify-center",
        // The one named exception to brand.md's „radius 0 everywhere" — owner
        // instruction, 2026-08-09 (D-3.17-2). It applies to this button and to
        // nothing else on the site.
        "rounded-full",
        // §Components: the fill swaps and takes the ink with it — never
        // colour-on-colour text. Navy paper → orange navy, both ≥ 4.5:1.
        "bg-navy text-paper hover:bg-orange hover:text-navy",
        // §Motion: 160ms hover.
        "transition-colors duration-160",
        focusOnPaper,
      )}
    >
      <span className="sr-only">Назад на врвот</span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      >
        <path d="M10 16.5V4.5M4.5 10L10 4.5l5.5 5.5" />
      </svg>
    </button>
  );
}
