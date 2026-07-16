import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { focusOnPaper } from "@/lib/focus";

/**
 * Portable Text mapping for `season.story` (§6.3). Every style the block
 * editor can produce is mapped explicitly — an unmapped style would render as
 * an unstyled paragraph and quietly lose the editor's intent.
 *
 * Orange appears once, as the blockquote's left rule (a marker). The quote's
 * text stays neutral-700: orange on paper is 2.8:1 and fails AA (D-1.02-1).
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6">{children}</p>,
    h2: ({ children }) => (
      <h3 className="mt-10 font-serif text-h3 font-semibold text-navy">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-serif text-h3 font-semibold text-navy">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-orange pl-5 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href;
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={`text-navy underline decoration-mist decoration-2 underline-offset-4 hover:decoration-orange ${focusOnPaper}`}
        >
          {children}
        </Link>
      );
    },
  },
};

/**
 * Приказна за сезоната — the season narrative, in one `max-w-measure` column.
 * Rendered only when `story` has blocks; an empty story omits the whole
 * section at the call site (D-2.02-3), with no placeholder prose.
 *
 * The heading levels sit under the page's single H1 (the hero title): the
 * section's own „Приказна за сезоната" is the H2, so blocks styled h2/h3 in
 * Studio both render as H3 — going to H2 here would collide with the section
 * heading and skip no level (§8).
 */
export function SeasonStory({ blocks }: { blocks: PortableTextBlock[] }) {
  return (
    // `[&>*:first-child]:mt-0` — every block carries its own top margin, which
    // would otherwise push the first paragraph away from the heading.
    <div className="max-w-measure text-body-l text-neutral-700 [&>*:first-child]:mt-0">
      <PortableText value={blocks} components={components} />
    </div>
  );
}
