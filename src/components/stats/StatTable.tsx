"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { statCell } from "@/lib/archive";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

/**
 * A cell is data, not markup — this component is a client boundary, so a server
 * page cannot hand it a render function. Text cells carry an optional `href`
 * (rendered as a link) and an optional `sortValue` for when display order and
 * alphabetical order differ (seasons sort chronologically, not by title).
 */
export type StatCell =
  | {
      kind: "text";
      text: string | null;
      href?: string | null;
      /** Sorted by this instead of `text` when present. */
      sortValue?: number | null;
      /** Shown when `text` is null — never invent a name (content-truth). */
      placeholder?: string;
    }
  | { kind: "number"; value: number | null };

export type StatRow = { id: string; cells: Record<string, StatCell> };

export type StatColumn = {
  key: string;
  /** Visible abbreviation. */
  short: string;
  /** The schema's full Macedonian label, `sr-only` (D-2.02-14). */
  full: string;
  numeric: boolean;
};

export type SortDirection = "asc" | "desc";
export type SortState = { key: string; direction: SortDirection };

type Sortable = string | number | null;

function sortValueOf(cell: StatCell | undefined): Sortable {
  if (!cell) return null;
  if (cell.kind === "number") return cell.value;
  return cell.sortValue ?? cell.text;
}

/**
 * Unknown values sort last in **both** directions. A missing number is not
 * smaller than a recorded one — it is unknown, and floating it to the top of a
 * „most goals" ranking would read as a claim.
 */
function compare(a: Sortable, b: Sortable, direction: SortDirection): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const result =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b), "mk");
  return direction === "asc" ? result : -result;
}

/**
 * The sortable statistics table (`/statistika`).
 *
 * Styled as the archive's Stats table — navy header, zebra body, `—` for
 * unknown cells (brand.md §Components) — with sorting added: every header is a
 * `<button>`, so it is keyboard-operable for free, and the active `<th>` carries
 * `aria-sort`. Sorting is plain React state over an array the server already
 * rendered; the page stays static + ISR (D-0.00-5).
 *
 * Mobile keeps every column and scrolls horizontally inside the frame
 * (D-2.02-10) — hiding a column would drop recorded data. The first column is
 * sticky-left so a scrolled row keeps its identity.
 */
export function StatTable({
  columns,
  rows,
  defaultSort,
  tieBreakKey,
  caption,
  scrollLabel,
  minWidthClass = "min-w-[520px]",
}: {
  columns: StatColumn[];
  rows: StatRow[];
  defaultSort: SortState;
  /** Applied ascending whenever the primary comparison ties. */
  tieBreakKey: string;
  caption: string;
  scrollLabel: string;
  minWidthClass?: string;
}) {
  const [sort, setSort] = useState<SortState>(defaultSort);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const primary = compare(
        sortValueOf(a.cells[sort.key]),
        sortValueOf(b.cells[sort.key]),
        sort.direction,
      );
      if (primary !== 0) return primary;
      return compare(
        sortValueOf(a.cells[tieBreakKey]),
        sortValueOf(b.cells[tieBreakKey]),
        "asc",
      );
    });
  }, [rows, sort, tieBreakKey]);

  function toggle(column: StatColumn) {
    setSort((current) =>
      current.key === column.key
        ? { key: column.key, direction: current.direction === "asc" ? "desc" : "asc" }
        : // A fresh numeric column opens on „most first"; a name opens A→Ш.
          { key: column.key, direction: column.numeric ? "desc" : "asc" },
    );
  }

  return (
    <div
      // A scrollable region must be keyboard-reachable and must announce itself.
      tabIndex={0}
      role="region"
      aria-label={scrollLabel}
      className={cn(
        "overflow-x-auto rounded-card border border-mist",
        focusOnPaper,
      )}
    >
      <table className={cn("w-full text-small", minWidthClass)}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy text-paper">
          <tr>
            {columns.map((column, i) => {
              const isActive = sort.key === column.key;
              const Icon = !isActive
                ? ChevronsUpDown
                : sort.direction === "asc"
                  ? ChevronUp
                  : ChevronDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    isActive
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={cn(
                    "p-0 text-overline font-semibold uppercase tracking-overline",
                    // The sticky header cell sits above both the body and the
                    // header row, so it carries the navy fill itself.
                    i === 0 && "sticky left-0 bg-navy",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(column)}
                    className={cn(
                      "flex w-full items-center gap-1.5 px-2 py-3 hover:text-paper/80",
                      focusOnNavy,
                      column.numeric ? "justify-end" : "justify-start",
                    )}
                  >
                    <span aria-hidden>{column.short}</span>
                    <span className="sr-only">{column.full}</span>
                    <Icon
                      aria-hidden
                      className={cn(
                        "size-3.5 shrink-0",
                        !isActive && "opacity-50",
                      )}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            // The sticky cell can't inherit the row's background — it would
            // scroll out from under it — so the row state resolves to a class
            // both the <tr> and the sticky <td> apply.
            const rowBg = i % 2 === 1 ? "bg-zebra" : "bg-white";
            return (
              <tr key={row.id} className={rowBg}>
                {columns.map((column, index) => {
                  const cell = row.cells[column.key];
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        "border-b border-mist px-2 py-3 text-neutral-700 tabular-nums",
                        column.numeric ? "text-right" : "text-left",
                        index === 0 && cn("sticky left-0", rowBg),
                      )}
                    >
                      <StatCellContent cell={cell} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatCellContent({ cell }: { cell: StatCell | undefined }) {
  if (!cell) return <>—</>;
  if (cell.kind === "number") return <>{statCell(cell.value)}</>;

  if (cell.text == null) {
    return cell.placeholder ? (
      <PlaceholderChip label={cell.placeholder} />
    ) : (
      <>—</>
    );
  }

  // No slug → the name still renders, just without a link. The row's numbers
  // are archive data and are never dropped to hide a broken reference.
  if (!cell.href) return <>{cell.text}</>;

  return (
    <Link
      href={cell.href}
      className={cn(
        "font-medium text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange",
        focusOnPaper,
      )}
    >
      {cell.text}
    </Link>
  );
}
