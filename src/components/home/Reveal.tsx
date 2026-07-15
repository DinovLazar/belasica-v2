"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal-on-scroll wrapper. The animation itself lives in globals.css
 * (`[data-reveal]`, brand.md §Motion); this only toggles `.is-visible` the
 * first time the element scrolls into view. Transform + opacity only.
 *
 * Reduced motion is handled entirely in CSS (the global rule forces the
 * end-state), so content is never hidden for those users — no JS branch here.
 * `delayIndex` produces the 60ms stagger for items in a group.
 */
export function Reveal({
  children,
  className,
  delayIndex = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayIndex?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style =
    delayIndex > 0
      ? ({ "--reveal-delay": `${delayIndex * 60}ms` } as React.CSSProperties)
      : undefined;

  return (
    <div
      ref={ref}
      data-reveal
      className={cn(visible && "is-visible", className)}
      style={style}
    >
      {children}
    </div>
  );
}
