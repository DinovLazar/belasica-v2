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

  return (
    <>
      {scorers.map((scorer, index) => (
        <span key={`${scorer.player}-${index}`} className="whitespace-nowrap">
          {index > 0 && (
            <span aria-hidden className="mx-1.5 text-mist">
              ·
            </span>
          )}
          {scorer.player}
          {scorer.minutes.length > 0 && (
            <span className="text-neutral-500">
              {" "}
              {scorer.minutes.join(", ")}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

function GroupTable({ group }: { group: SeasonMatchGroup }) {
  const showRound = hasRound(group);

  // Below `sm` each <tr> becomes a grid so the scorers can drop to their own
  // line inside the same row; from `sm` up the rows are real table rows again.
  // One DOM, one <table>, and no sideways scroll on a phone — which is how this
  // content became unreadable in the first place (D-3.28-6).
  const rowGrid = showRound
    ? "grid grid-cols-[2.75rem_1fr_auto] sm:table-row"
    : "grid grid-cols-[1fr_auto] sm:table-row";

  return (
    <div className="mt-5 overflow-hidden">
      <table className="w-full border-collapse text-left tabular-nums">
        <caption className="sr-only">{group.title}</caption>
        <thead>
          <tr className={cn(rowGrid, "bg-navy text-paper")}>
            {showRound && (
              <th scope="col" className="u-label px-3 py-2.5 sm:table-cell">
                Коло
              </th>
            )}
            <th scope="col" className="u-label px-3 py-2.5 sm:table-cell">
              Натпревар
            </th>
            <th
              scope="col"
              className="u-label px-3 py-2.5 text-right sm:table-cell"
            >
              Резултат
            </th>
            {/* Hidden below `sm`: down there the scorers sit under the row, not
                in a column, so a column head would label nothing. */}
            <th
              scope="col"
              className="u-label hidden px-3 py-2.5 sm:table-cell"
            >
              Стрелци
            </th>
          </tr>
        </thead>
        <tbody>
          {group.parts.map((part) => (
            <PartRows
              key={part.label ?? "—"}
              part={part}
              showRound={showRound}
              rowGrid={rowGrid}
            />
          ))}
        </tbody>
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
    <>
      {/* Есен / пролет — the book's own wording („Есенски дел 1988"), which
          carries the year. A part with no label is the whole group. */}
      {part.label && (
        <tr className="grid sm:table-row">
          <th
            scope="colgroup"
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
            <td className="px-3 pt-2.5 text-small text-neutral-500 sm:table-cell sm:py-2.5">
              {match.round ?? ""}
            </td>
          )}
          <td className="px-3 pt-2.5 text-body text-neutral-700 sm:table-cell sm:py-2.5">
            {match.home} — {match.away}
          </td>
          {/* The strongest cell in the row: navy, bold, never wrapped. */}
          <td className="px-3 pt-2.5 text-right text-body font-bold whitespace-nowrap text-navy sm:table-cell sm:py-2.5">
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
              "px-3 text-small text-neutral-700 sm:table-cell sm:py-2.5",
              match.scorers.length > 0
                ? "col-span-full pb-2.5"
                : "hidden sm:table-cell",
            )}
          >
            <Scorers scorers={match.scorers} />
          </td>
        </tr>
      ))}
    </>
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
