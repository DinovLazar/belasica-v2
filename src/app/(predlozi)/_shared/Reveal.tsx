"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll observer, shared by the three exploration variants.
 *
 * It carries **no styling of its own** — it only marks the element
 * `[data-reveal]` and flips `.is-visible` the first time it scrolls into view.
 * The motion itself is a variant token: each direction's stylesheet overrides
 * `[data-reveal]` inside its own scope (`.pv-a`, `.pv-b`, `.pv-c`), so A fades
 * flat like ink drying, B rises slowly, C snaps. That is why one observer is
 * shared where every visual component is copied per variant — there is no
 * design decision in here to diverge.
 *
 * The hidden state is gated on `html.js` (set by the pre-paint script in this
 * route group's layout), so without JS nothing is ever hidden.
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
  as?: "div" | "li" | "tr" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      ? ({ "--reveal-delay": `${delayIndex * 70}ms` } as React.CSSProperties)
      : undefined;

  return (
    <Tag
      // One `ref` type per tag would need a discriminated union for no gain —
      // the element is only ever passed to IntersectionObserver.
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={[className, visible ? "is-visible" : ""]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
