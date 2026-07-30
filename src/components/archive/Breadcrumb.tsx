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
                <span
                  aria-hidden
                  className={onNavy ? "text-paper/40" : "text-mist"}
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
