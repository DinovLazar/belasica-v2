import { Fragment } from "react";
import Link from "next/link";
import type { SeasonSquadRow } from "@/content/season-tables";
import { RosterDivider } from "@/components/archive/SeasonRecordList";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * „Состав и статистика" as a table, Phase 3.28 — број, име, настапи, голови.
 *
 * **Server component**, handed one season's rows and a name→slug index built
 * once per render from the published `person` documents.
 *
 * ## Why names are mostly not links
 * The book lists a squad as „К. Костадинов" — **82,7 % of the 831 distinct
 * squad strings are initial-and-surname** — while a `person` document is „Коце
 * Костадинов". Only an exact, whole-string match to a person's name becomes a
 * link. Matching on surname would resolve far more rows and would be wrong:
 * **121 surnames carry more than one distinct book string** (Митев alone has
 * ten), so a surname match asserts an identity the book does not — the merge
 * D-3.11-2 explicitly refused. A link to the wrong man is worse than plain
 * text, and a link to a 404 is worse than both (D-3.28-7).
 *
 * The link is a plain inline anchor rather than `PersonChip`: that component is
 * legacy, unrendered since 3.04, and renders an `<li>` chip — not a thing that
 * can live in a table cell (D-3.28-8).
 */

/**
 * The row the after-eleven rule goes under — the first row numbered 11, and
 * only when a row numbered 12 follows it. Same two conditions `SeasonRecordList`
 * applies to the Portable Text roster (3.17), so a season reads identically
 * whichever of the two surfaces renders it. The rule itself is imported from
 * there rather than redrawn.
 */
function dividerIndex(rows: SeasonSquadRow[]): number {
  const eleventh = rows.findIndex((row) => row.no === 11);
  if (eleventh === -1) return -1;

  const hasTwelfth = rows.slice(eleventh + 1).some((row) => row.no === 12);
  return hasTwelfth ? eleventh : -1;
}

function PlayerName({
  player,
  slug,
}: {
  player: string;
  slug: string | undefined;
}) {
  if (!slug) return <>{player}</>;

  return (
    <Link
      href={`/legendi/${slug}`}
      className={cn(
        "text-navy decoration-mist decoration-2 underline-offset-4 hover:decoration-orange",
        "underline",
        focusOnPaper,
      )}
    >
      {player}
    </Link>
  );
}

export function SeasonSquadTable({
  rows,
  personSlugs,
  className,
}: {
  rows: SeasonSquadRow[];
  /** Exact person name → slug. Only whole-string hits become links. */
  personSlugs: Map<string, string>;
  className?: string;
}) {
  const divider = dividerIndex(rows);

  return (
    <div className={cn("max-w-measure", className)}>
      <table className="w-full border-collapse text-left tabular-nums">
        <caption className="sr-only">Состав и статистика</caption>
        <thead>
          <tr className="bg-navy text-paper">
            <th scope="col" className="u-label px-3 py-2.5 text-right">
              №
            </th>
            <th scope="col" className="u-label px-3 py-2.5">
              Име
            </th>
            <th scope="col" className="u-label px-3 py-2.5 text-right">
              Настапи
            </th>
            <th scope="col" className="u-label px-3 py-2.5 text-right">
              Голови
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <Fragment key={`${row.no ?? "—"}-${row.player}-${index}`}>
              <tr className="border-b border-mist last:border-b-0">
                <td className="px-3 py-2 text-right text-small text-neutral-500">
                  {row.no ?? ""}
                </td>
                <td className="px-3 py-2 text-body text-neutral-700">
                  <PlayerName
                    player={row.player}
                    slug={personSlugs.get(row.player)}
                  />
                </td>
                <td className="px-3 py-2 text-right text-body text-navy">
                  {row.apps ?? ""}
                </td>
                <td className="px-3 py-2 text-right text-body font-bold text-navy">
                  {row.goals ?? ""}
                </td>
              </tr>
              {/* The rule spans the table, so it needs a row of its own — and
                  that row is `aria-hidden`, because it holds no data and states
                  nothing. The book prints a numbered list; it does not print
                  the words „стартна единаесторка", and saying so to a screen
                  reader would assert a fact on the book's behalf (D-3.17-4). */}
              {index === divider && (
                <tr aria-hidden>
                  <td colSpan={4} className="p-0">
                    <RosterDivider className="mt-0 mb-0" />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
