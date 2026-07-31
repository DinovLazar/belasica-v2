"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal-on-scroll wrapper. The animation itself lives in globals.css
 * (`[data-reveal]`, brand.md §Motion — 260ms, things arrive rather than
 * drift); this only toggles `.is-visible` the first time the element scrolls
 * into view. Transform + opacity only.
 *
 * Reduced motion is handled entirely in CSS (the global rule forces the
 * end-state), so content is never hidden for those users — no JS branch here.
 * `delayIndex` produces the stagger for items in a group.
 *
 * **`immediate` opts an element out entirely** — no `data-reveal`, so the
 * hidden state never applies and there is nothing to observe or transition.
 * It exists for the LCP element (3.09). A reveal costs the thing it wraps a
 * full hydrate → observe → state → 260ms transition before it paints, and
 * Lighthouse measured exactly that as `elementRenderDelay` **370ms on /arhiva**
 * and **331ms on /legendi**, where the LCP is the first card's photograph —
 * against 14ms on the homepage, whose hero was never wrapped. Content sitting
 * in the first viewport also has nothing to reveal *from*: the visitor has not
 * scrolled yet (D-3.09-3).
 */
export function Reveal({
  children,
  className,
  delayIndex = 0,
  immediate = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delayIndex?: number;
  /** Render visible from the first paint — for above-the-fold LCP candidates. */
  immediate?: boolean;
  /** Use `"li"`/`"tr"` where a wrapping `<div>` would break the parent's
   *  content model (a `<ul>` may only contain `<li>`). */
  as?: "div" | "li" | "tr" | "section" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old/edge runtimes) → show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  const style =
    !immediate && delayIndex > 0
      ? ({ "--reveal-delay": `${delayIndex * 60}ms` } as React.CSSProperties)
      : undefined;

  return (
    <Tag
      // One `ref` type per tag would need a discriminated union for no gain —
      // the element is only ever passed to IntersectionObserver.
      ref={ref as React.Ref<never>}
      // Omitted when `immediate`: the CSS hidden state keys off this attribute,
      // so without it the element is simply never hidden — no class to wait
      // for, and nothing that could strand it at opacity 0.
      data-reveal={immediate ? undefined : ""}
      className={cn(!immediate && visible && "is-visible", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
