import { Fragment } from "react";
import type { SeasonMatch, SeasonMatchGroup } from "@/content/season-tables";
import { cn } from "@/lib/utils";

/**
 * „Резултати" as tables, Phase 3.28 — one table per competition or stage.
 *
 * **Server component.** It is handed one season's groups, already projected by
 * named field in `src/content/season-tables.ts`; the book extract itself never
 * reaches the browser. Nothing here is interactive, so nothing here needs to.
 *
 * ## Why the grouping is what it is
 * The brief expected „Првенство / Куп / Квалификации". The data holds no such
 * axis: `competitionType` is `league` for all 2.252 typed matches and there is
 * no cup type at all, while `competition` holds 31 distinct *league names*, so
 * grouping on it alone is a no-op on the 72 seasons that played in one league.
 * The generator therefore groups on `stage` where there is one and falls back
 * to `competition` — which is what puts 1987/88's two promotion-qualification
 * ties in their own table below its league season (D-3.28-3).
 *
 * ## Why there is no „Коло" column on almost every page
 * `round` is set on **12 of 2.267 matches**, in two seasons. The column renders
 * only for a group that actually holds one, rather than printing a column of
 * blanks 94 seasons wide (D-3.28-4).
 */

/** A group's „Коло" column exists only if some match in it carries a round. */
function hasRound(group: SeasonMatchGroup): boolean {
  return group.parts.some((part) =>
    part.matches.some((match) => match.round != null),
  );
}

/**
 * The scorers cell — „Ашиков 28, 54, 89 · Стојанов 38".
 *
 * ⚠️ **The numbers carry no unit, deliberately.** The extraction report calls
 * them minutes, and for 1.323 of the 1.435 numbered matches they demonstrably
 * are — but the book also prints „5:0 (Иванов 4, Чулевски)", where 4 is a goal
 * *count*, and 27 matches read exactly as counts. Printing „4'" would assert a
 * minute the book does not give. The figures render exactly as printed and the
 * page claims nothing about what they mean (D-3.28-5).
 *
 * A match with no scorers returns null, so the cell renders empty — no dash, no
 * zero, no placeholder. The book not naming a scorer is not a fact about the
 * match.
 */
function Scorers({ scorers }: { scorers: SeasonMatch["scorers"] }) {
  if (scorers.length === 0) return null;

  // A scorer and their figures never break apart (`whitespace-nowrap`), but the
  // list of them must be able to break BETWEEN scorers — and an inline break
  // needs actual whitespace to break at. The separator is therefore its own
  // element with real spaces around it: without them the spans butt together,
  // the browser finds no break opportunity, and a four-scorer cell runs 429px
  // wide inside a 335px column (D-3.28-6).
  return (
    <>
      {scorers.map((scorer, index) => (
        <Fragment key={`${scorer.player}-${index}`}>
          {index > 0 && (
            <>
              {" "}
              {/* `text-mist` here measured 1.19:1 against the paper ground —
                  below the 4.5:1 SC 1.4.3 asks of text, and flagged as an error
                  on all 91 season pages that carry a scorer list. It is the
                  same ink as the minutes it separates now (6.09:1), which is
                  also the reading it should have had: a separator that cannot
                  be seen is not separating anything. `aria-hidden` stays — the
                  real whitespace either side is what a screen reader needs, and
                  it is what lets the line break between scorers. */}
              <span aria-hidden className="text-neutral-500">
                ·
              </span>{" "}
            </>
          )}
          <span className="whitespace-nowrap">
            {scorer.player}
            {scorer.minutes.length > 0 && (
              <span className="text-neutral-500">
                {" "}
                {scorer.minutes.join(", ")}
              </span>
            )}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/**
 * ⚠️ Header association here is `scope`, and it is NOT going to become
 * `headers`/`id` — this is the second time that has been tried.
 *
 * The column heads live in `<thead>` and each half-season's label is a
 * `<th scope="rowgroup">` heading the `<tbody>` it opens. That is the canonical
 * HTML for this shape and Chrome resolves it correctly — measured on the
 * rendered page, „Есенски дел 1992" is exposed as `rowheader`, and every match
 * cell resolves to its column head plus that one row-group head.
 *
 * pa11y (HTML_CodeSniffer) reports `H43.HeadersRequired` on this table anyway,
 * once per table, 91 times across the season pages. Its advice was followed and
 * reverted: with a correct `headers` list on every cell it then reports
 * `H43.IncorrectAttr` and asks for BOTH half-seasons on every match — „Expected
 * `c1 g1 g2` but found `c1 g1`" — because its H43 implementation does not
 * honour `<tbody>` boundaries. Complying would tell a screen-reader user that
 * every autumn fixture also belongs to the spring half-season, which is false.
 * A 12-line reproduction is committed beside the scan output at
 * `docs/a11y-scan-after/pa11y-H43-tbody-repro.html`.
 */
function GroupTable({ group }: { group: SeasonMatchGroup }) {
  const showRound = hasRound(group);

  // Below `sm` each <tr> becomes a grid so the scorers can drop to their own
  // line inside the same row; from `sm` up the rows are real table rows again.
  // One DOM, one <table>, and no sideways scroll on a phone — which is how this
  // content became unreadable in the first place (D-3.28-6).
  const rowGrid = showRound
    ? "grid grid-cols-[2.25rem_1fr_auto] sm:table-row"
    : "grid grid-cols-[1fr_auto] sm:table-row";

  return (
    <div className="mt-5">
      <table className="w-full border-collapse text-left tabular-nums">
        <caption className="sr-only">{group.title}</caption>
        <thead>
          <tr className={cn(rowGrid, "bg-navy text-paper")}>
            {showRound && (
              <th
                scope="col"
                className="font-sans text-overline font-bold tracking-overline uppercase px-2 py-2.5 sm:table-cell sm:px-3"
              >
                Коло
              </th>
            )}
            <th
              scope="col"
              className="font-sans text-overline font-bold tracking-overline uppercase px-2 py-2.5 sm:table-cell sm:px-3"
            >
              Натпревар
            </th>
            <th
              scope="col"
              className="font-sans text-overline font-bold tracking-overline uppercase px-2 py-2.5 text-right sm:table-cell sm:px-3"
            >
              Резултат
            </th>
            {/* Visually hidden below `sm` — where the scorers sit under the
                row rather than in a column, so a visible column head would
                label nothing — but NOT removed. It was `hidden`, and the cell
                it heads still renders down there: the row then had a third
                cell with no header, so „Андреев 75, Гошев 80" was announced as
                a bare value with nothing to say what it was (SC 1.3.1).
                `sr-only` is `position: absolute`, so it takes no grid track and
                the phone layout is unchanged. */}
            <th
              scope="col"
              className="font-sans text-overline font-bold tracking-overline uppercase sr-only px-2 py-2.5 sm:not-sr-only sm:table-cell sm:px-3"
            >
              Стрелци
            </th>
          </tr>
        </thead>
        {/* One `<tbody>` PER PART, not one for the table. „Есенски дел 1988"
            is a header for the rows that follow it, and the only scope that
            says so is `rowgroup` — which is defined as „the remaining cells in
            this row group" and therefore needs the group to end where the part
            does. It was a single `<tbody>` with the label carrying
            `scope="colgroup"`, i.e. announced as a header for every COLUMN of
            the table, on all 91 season pages that split into two half-seasons.
            Multiple `<tbody>` elements render identically. */}
        {group.parts.map((part) => (
          <PartRows
            key={part.label ?? "—"}
            part={part}
            showRound={showRound}
            rowGrid={rowGrid}
          />
        ))}
      </table>
    </div>
  );
}

function PartRows({
  part,
  showRound,
  rowGrid,
}: {
  part: SeasonMatchGroup["parts"][number];
  showRound: boolean;
  rowGrid: string;
}) {
  const span = showRound ? 4 : 3;

  return (
    <tbody>
      {/* Есен / пролет — the book's own wording („Есенски дел 1988"), which
          carries the year. A part with no label is the whole group. */}
      {part.label && (
        <tr className="grid sm:table-row">
          <th
            scope="rowgroup"
            colSpan={span}
            className="u-label col-span-full border-b border-mist bg-zebra px-3 py-2 text-left text-neutral-500 sm:table-cell"
          >
            {part.label}
          </th>
        </tr>
      )}
      {part.matches.map((match, index) => (
        <tr
          key={`${match.home}-${match.away}-${index}`}
          className={cn(rowGrid, "border-b border-mist last:border-b-0")}
        >
          {showRound && (
            <td className="px-2 pt-2.5 text-small text-neutral-500 sm:table-cell sm:px-3 sm:py-2.5">
              {match.round ?? ""}
            </td>
          )}
          <td className="min-w-0 px-2 pt-2.5 text-body break-words text-neutral-700 sm:table-cell sm:px-3 sm:py-2.5">
            {match.home} — {match.away}
          </td>
          {/* The strongest cell in the row: navy, bold, never wrapped. */}
          <td className="px-2 pt-2.5 text-right text-body font-bold whitespace-nowrap text-navy sm:table-cell sm:px-3 sm:py-2.5">
            {match.score}
          </td>
          {/* Always present from `sm` up, so every row has as many cells as the
              header has columns — a short row would break the column
              association a screen reader relies on. When the book names no
              scorer the cell is simply empty: no dash, no zero, no placeholder.
              Below `sm` an empty one is removed outright rather than left to
              occupy a grid row of its own. */}
          <td
            className={cn(
              "min-w-0 px-2 text-small break-words text-neutral-700 sm:table-cell sm:px-3 sm:py-2.5",
              match.scorers.length > 0
                ? "col-span-full pb-2.5"
                : "hidden sm:table-cell",
            )}
          >
            <Scorers scorers={match.scorers} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function SeasonResultsTable({
  groups,
  className,
}: {
  groups: SeasonMatchGroup[];
  className?: string;
}) {
  return (
    <div className={className}>
      {groups.map((group) => (
        <section key={group.title} className="mt-10 first:mt-0">
          {/* The 6px orange bar — brand.md's signature motif, a top edge. */}
          <div aria-hidden className="h-1.5 w-full bg-orange" />
          <h3 className="mt-4 u-h3 text-navy">{group.title}</h3>
          <GroupTable group={group} />
        </section>
      ))}
    </div>
  );
}
