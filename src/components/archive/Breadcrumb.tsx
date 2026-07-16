import Link from "next/link";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnPaper } from "@/lib/focus";

export type Crumb = {
  label: string | null;
  href?: string;
  /** Shown when `label` is missing — never invent a crumb (brand.md §Breadcrumb). */
  placeholder?: string;
};

/**
 * Breadcrumb — brand.md §Components: navy links, mist „/" separators, current
 * crumb not a link. Renders on paper above the hero (D-2.02-5), never over the
 * photo: the hero's gradient is bottom-anchored, so a crumb at the top would
 * sit on bare image, and the photo-less navy hero would need a second
 * treatment. On paper it is one treatment for both hero variants.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Патека">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-x-2">
              {i > 0 && (
                <span aria-hidden className="text-mist">
                  /
                </span>
              )}
              {item.label == null ? (
                <PlaceholderChip label={item.placeholder ?? "непозната ставка"} />
              ) : isLast || !item.href ? (
                <span aria-current="page" className="text-neutral-700">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
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
