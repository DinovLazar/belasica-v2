import type { ReactNode } from "react";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * A **fixed** statistics table — Аце's transcribed tables, Phase 3.34.
 *
 * Styled exactly as `StatTable` (brand.md §Components „Stats table“: navy
 * header row, `zebra` striping, mist hairlines, `—` for an unknown cell) but
 * **not sortable, and a server component** — which is the whole point of it
 * existing beside `StatTable` rather than reusing it:
 *
 *  - **Order is content here.** These tables carry Аце's own ranking and his
 *    chronology. A sort control that reordered rows would break shared ranks
 *    apart and present his 1950 → 2025/26 sequence as an arbitrary one.
 *  - **No sorting means no state**, so this needs no client bundle at all,
 *    where `StatTable` is a `"use client"` boundary.
 *  - **Names are never links.** Аце abbreviates („И. Чулев(ски)“), and matching
 *    an abbreviation to a person document asserts an identity the source does
 *    not — the same rule the squad tables follow (D-3.28-7, OV-63).
 *
 * Cells are `ReactNode`, which a server component may pass freely; that is what
 * lets one season row stack the two names of a tie in a single cell.
 *
 * Mobile keeps every column and scrolls horizontally inside the frame
 * (D-2.02-10) — hiding a column would drop recorded data.
 */
export type SourceColumn = {
  key: string;
  /** Visible label — Аце's own word from his column line, where he wrote one. */
  short: string;
  /** The full label, `sr-only` when it differs from `short` (D-2.02-14). */
  full?: string;
  numeric?: boolean;
};

export type SourceTableRow = {
  id: string;
  cells: Record<string, ReactNode>;
};

export function SourceTable({
  columns,
  rows,
  caption,
  scrollLabel,
  minWidthClass = "min-w-[520px]",
}: {
  columns: SourceColumn[];
  rows: SourceTableRow[];
  caption: string;
  scrollLabel: string;
  minWidthClass?: string;
}) {
  return (
    <div
      // A scrollable region must be keyboard-reachable and must announce
      // itself. `relative` clips the `sr-only` labels so they cannot escape and
      // stretch the document's own scrollable width — the SC 1.4.10 failure
      // D-3.09-6 fixed on this page's other tables.
      tabIndex={0}
      role="region"
      aria-label={scrollLabel}
      className={cn(
        "relative overflow-x-auto border border-mist",
        focusOnPaper,
      )}
    >
      <table className={cn("w-full text-small", minWidthClass)}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy text-paper">
          <tr>
            {columns.map((column, i) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "px-2 py-3 text-overline font-bold uppercase tracking-overline",
                  column.numeric ? "text-right" : "text-left",
                  // The sticky first cell sits above the body, so it carries
                  // the navy fill itself rather than inheriting the row's.
                  i === 0 && "sticky left-0 bg-navy",
                )}
              >
                <span aria-hidden>{column.short}</span>
                <span className="sr-only">{column.full ?? column.short}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            // The sticky cell can't inherit the row's background — it would
            // scroll out from under it — so the row state resolves to a class
            // both the <tr> and the sticky <td> apply.
            const rowBg = i % 2 === 1 ? "bg-zebra" : "bg-white";
            return (
              <tr key={row.id} className={rowBg}>
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={cn(
                      "border-b border-mist px-2 py-3 align-top text-neutral-700 tabular-nums",
                      column.numeric ? "text-right" : "text-left",
                      index === 0 && cn("sticky left-0", rowBg),
                    )}
                  >
                    {row.cells[column.key] ?? "—"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
