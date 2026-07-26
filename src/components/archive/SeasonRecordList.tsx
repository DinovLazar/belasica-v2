import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * Portable Text for the season's two **record** fields — `lineupAndStats` and
 * `results` (D-3.04-9). `SeasonStory` stays the renderer for prose (`story`,
 * `person.bio`) and is untouched.
 *
 * These two fields are not prose. Every one of the 1401 published
 * `lineupAndStats` blocks is a `normal` block holding a single line — either a
 * one-sentence fact („Најдобар стрелец на сезоната: …") or one roster entry
 * („1. Љ. Димовски25+0/0"). `results` will be the same shape: one match per
 * block. Rendered through `SeasonStory`'s `mt-6` paragraph rhythm a 38-line
 * roster becomes a page of orphaned sentences; these two variants give each
 * field the rhythm its content actually has.
 *
 *  - `roster` — a tight line list. Reading is top-to-bottom, name→numbers.
 *  - `results` — one hairline-separated row per match, so a long list of
 *    matches stays scannable at a glance (the reference site's cadence).
 *
 * `tabular-nums` in both: these lines are mostly digits, and lining figures
 * keep the apps/goals and the scorelines in visual columns without imposing a
 * table structure the source text does not have. Nothing is reformatted — the
 * transcribed text (source OCR quirks included) renders verbatim.
 */
function componentsFor(variant: "roster" | "results"): PortableTextComponents {
  // `text-body` lives here rather than on the wrapper: the wrapper carries the
  // text colour, and `tailwind-merge` (which `cn` uses) does not know this
  // project's custom type scale — it reads `text-body` as a text COLOUR, so a
  // single `cn("text-body … text-neutral-700")` would silently drop the size.
  const row =
    variant === "results"
      ? "border-b border-mist py-2.5 text-body last:border-b-0"
      : "mt-1.5 text-body";

  // Studio's default `block` config can emit h1–h6 even though no published
  // block uses one today; mapping them explicitly keeps an editor's intent from
  // silently flattening into an unstyled paragraph.
  //
  // They all render as <h3>, the level `SeasonStory` uses for the same reason:
  // both call sites sit under the section's <h2>, so <h3> is the next level in
  // „Резултати" (h2 → h3) and a sibling of „Состав и статистика" in the roster
  // block (h3 → h3). Either way no level is skipped.
  const subheading = ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-8 font-serif text-h3 font-semibold text-navy">
      {children}
    </h3>
  );

  return {
    block: {
      normal: ({ children }) => <p className={row}>{children}</p>,
      h1: subheading,
      h2: subheading,
      h3: subheading,
      h4: subheading,
      h5: subheading,
      h6: subheading,
      blockquote: ({ children }) => (
        <blockquote className="mt-4 border-l-2 border-orange pl-5 italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mt-3 list-disc space-y-1 pl-5">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="mt-3 list-decimal space-y-1 pl-5">{children}</ol>
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
}

// Built once at module scope, like `SeasonStory`'s map — the config is static,
// so rebuilding it per render would only churn object identity.
const COMPONENTS: Record<"roster" | "results", PortableTextComponents> = {
  roster: componentsFor("roster"),
  results: componentsFor("results"),
};

export function SeasonRecordList({
  blocks,
  variant,
  className,
}: {
  blocks: PortableTextBlock[];
  variant: "roster" | "results";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-measure tabular-nums text-neutral-700 [&>*:first-child]:mt-0",
        className,
      )}
    >
      <PortableText value={blocks} components={COMPONENTS[variant]} />
    </div>
  );
}
