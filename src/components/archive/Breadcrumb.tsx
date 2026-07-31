import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";

export type Crumb = {
  label: string | null;
  href?: string;
  /** Shown when `label` is missing — never invent a crumb (brand.md §Components). */
  placeholder?: string;
};

/**
 * Breadcrumb — brand.md §Components: navy links on paper, mist „/" separators,
 * tracked caps, current crumb not a link. Renders on paper above the hero
 * (D-2.02-5), never over the photograph: the hero's picture runs full-bleed to
 * its own edges, so a crumb laid over it would sit on bare image and would
 * need a second treatment for the photo-less variant. On paper it is one
 * treatment for both.
 */
export function Breadcrumb({
  items,
  onNavy = false,
}: {
  items: Crumb[];
  /** Set inside a navy page-header block, where the navy links would vanish. */
  onNavy?: boolean;
}) {
  return (
    <nav aria-label="Патека">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-overline font-bold uppercase tracking-[0.12em]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-2">
              {i > 0 && (
                // `paper/60`, not `paper/40` (3.09). Measured against the navy
                // block's real composite, /40 is **3.48:1** — under AA even
                // though the glyph is `aria-hidden`, because it is still text a
                // sighted reader uses to parse the trail. /60 measures
                // **6.14:1** and stays a step quieter than the crumbs
                // themselves at 9.93:1, so the hierarchy is unchanged
                // (D-3.09-7). `text-neutral-500` replaces `text-mist` on the
                // paper variant for the same reason: mist is a 1.2:1 hairline
                // colour meant for borders, not for a glyph.
                <span
                  aria-hidden
                  className={onNavy ? "text-paper/60" : "text-neutral-500"}
                >
                  /
                </span>
              )}
              {item.label == null ? (
                <PlaceholderChip
                  label={item.placeholder ?? "непозната ставка"}
                  onNavy={onNavy}
                />
              ) : isLast || !item.href ? (
                <span
                  aria-current="page"
                  className={onNavy ? "text-paper/80" : "text-neutral-700"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  // `min-h-6` gives the 24px hit area WCAG 2.5.8 wants around a
                  // 12px overline. An explicit height rather than padding with a
                  // cancelling negative margin: the negative-margin trick makes
                  // adjacent hit areas overlap once the trail wraps to a second
                  // row, which is exactly when a breadcrumb is hardest to tap.
                  className={cn(
                    "inline-flex min-h-6 items-center border-b-2 border-transparent transition-colors hover:border-orange",
                    onNavy ? "text-paper" : "text-navy",
                    onNavy ? focusOnNavy : focusOnPaper,
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
