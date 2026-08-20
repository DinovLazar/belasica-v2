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
 *
 * The `roster` variant additionally draws one hairline after the line numbered
 * 11 — see `rosterDividerKey` and `RosterDivider` below (3.17).
 */
function componentsFor(
  variant: "roster" | "results",
  dividerKey: string | null,
): PortableTextComponents {
  // `text-body` lives here so each variant owns its full row treatment. (It
  // no longer needs to dodge cn(): the custom type scale is registered in
  // src/lib/utils.ts, so size and colour merge correctly — D-3.04-12,
  // fixed at 3.04d.)
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
    <h3 className="mt-8 u-h3 text-navy">{children}</h3>
  );

  return {
    block: {
      normal:
        dividerKey === null
          ? ({ children }) => <p className={row}>{children}</p>
          : ({ children, value }) => (
              <>
                <p className={row}>{children}</p>
                {value._key === dividerKey && <RosterDivider />}
              </>
            ),
      h1: subheading,
      h2: subheading,
      h3: subheading,
      h4: subheading,
      h5: subheading,
      h6: subheading,
      blockquote: ({ children }) => (
        <blockquote className="mt-4 border-l-[3px] border-orange pl-5 text-body-l">
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
            // No `decoration-mist`: at 1.19:1 on paper the underline was
            // invisible, leaving a link inside prose distinguished from the
            // text around it by colour alone (SC 1.4.1). Inheriting
            // `currentColor` puts it at navy's 14.95:1.
            className={`text-navy underline decoration-2 underline-offset-4 hover:decoration-orange ${focusOnPaper}`}
          >
            {children}
          </Link>
        );
      },
    },
  };
}

/**
 * A numbered roster line: „11. Г. Узунов 27+0/8". The separators are whatever
 * the transcription actually holds — the live data has „1 Д. Георгиев 15+0 /0"
 * with no dot at all, „2.М. Василев 27+0/3" with no space, and „19.Г. Стојменов
 * 2+7/2" with both — so the dot and the space are each optional.
 *
 * The `(?=\D)` lookahead is the guard: it requires a non-digit after the
 * number, which is what stops a scoreline („2:1 …") or a bare year from being
 * read as a roster position.
 */
const ROSTER_LINE = /^\s*(\d{1,2})\s*[.)]?\s*(?=\D)/;

/** The number a block opens with as a roster line, or null if it is not one. */
function rosterNumber(block: PortableTextBlock): number | null {
  if (block._type !== "block") return null;
  if ((block.style ?? "normal") !== "normal") return null;

  const text = (block.children ?? [])
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("");

  const match = ROSTER_LINE.exec(text);
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * The `_key` of the roster line the divider goes under — the first line
 * numbered 11 — or null when no divider should be drawn (owner, 2026-08-09).
 *
 * Two conditions, both required. There must be a line numbered 11, and a
 * *later* line numbered 12: if the roster stops at eleven there is nothing on
 * the other side of the rule to separate, so none is drawn (`1952` is the one
 * published season in that position). On the live data this returns a key for
 * 51 of the 96 seasons and null for the other 45, and no season holds a second
 * block numbered 11, so no page can render two dividers.
 */
function rosterDividerKey(blocks: PortableTextBlock[]): string | null {
  const eleventh = blocks.findIndex((block) => rosterNumber(block) === 11);
  if (eleventh === -1) return null;

  const hasTwelfth = blocks
    .slice(eleventh + 1)
    .some((block) => rosterNumber(block) === 12);

  return hasTwelfth ? (blocks[eleventh]._key ?? null) : null;
}

/**
 * The rule after the eleventh roster line (owner, 2026-08-09).
 *
 * **No text, no label, no `<hr>`, and `aria-hidden`.** The book prints a
 * numbered list; it does not print the words „стартна единаесторка". Grouping
 * the first eleven visually is what the owner asked for — *stating* that those
 * eleven started is a fact the archive would be asserting on the book's behalf,
 * which content-truth forbids. `<hr>` is a semantic thematic break and would
 * make that same claim to a screen reader, so this is a presentational `<div>`
 * hidden from the accessibility tree: the numbered list it separates already
 * reads correctly without it (D-3.17-4).
 */
export function RosterDivider({ className }: { className?: string } = {}) {
  return (
    <div aria-hidden className={cn("mt-4 mb-1 h-px bg-mist", className)} />
  );
}

// The results config is static and built once, like `SeasonStory`'s map. The
// roster's depends on which line the divider falls under, so it is built per
// render — and passing `null` here is what makes the results variant provably
// divider-free: its `normal` renderer is the same one-line paragraph it has
// always been, with no key comparison in it at all.
const RESULTS_COMPONENTS = componentsFor("results", null);

export function SeasonRecordList({
  blocks,
  variant,
  className,
}: {
  blocks: PortableTextBlock[];
  variant: "roster" | "results";
  className?: string;
}) {
  const components =
    variant === "results"
      ? RESULTS_COMPONENTS
      : componentsFor("roster", rosterDividerKey(blocks));

  return (
    <div
      className={cn(
        "max-w-measure tabular-nums text-neutral-700 [&>*:first-child]:mt-0",
        className,
      )}
    >
      <PortableText value={blocks} components={components} />
    </div>
  );
}
