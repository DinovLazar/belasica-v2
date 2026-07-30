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
 */
export function Reveal({
  children,
  className,
  delayIndex = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delayIndex?: number;
  /** Use `"li"`/`"tr"` where a wrapping `<div>` would break the parent's
   *  content model (a `<ul>` may only contain `<li>`). */
  as?: "div" | "li" | "tr" | "section" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  const style =
    delayIndex > 0
      ? ({ "--reveal-delay": `${delayIndex * 60}ms` } as React.CSSProperties)
      : undefined;

  return (
    <Tag
      // One `ref` type per tag would need a discriminated union for no gain —
      // the element is only ever passed to IntersectionObserver.
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={cn(visible && "is-visible", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
