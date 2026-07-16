import { cn } from "@/lib/utils";
import { isBelasicaRow, statCell } from "@/lib/archive";

export type StandingsRow = {
  position: number | null;
  club: string | null;
  played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goalsFor: number | null;
  goalsAgainst: number | null;
  points: number | null;
};

/**
 * Columns are exactly the locked `season.finalTable` row fields — nothing
 * derived. Goal difference is deliberately absent: it is not a field, so
 * computing it would put a number on the page that no source states.
 *
 * Each header shows a short abbreviation with the schema's full Macedonian
 * label `sr-only` (D-2.02-14) — „Победи" and „Порази" both abbreviate to „П",
 * so the visible text alone would be ambiguous to a screen reader.
 */
const COLUMNS = [
  { key: "position", short: "#", full: "Позиција", numeric: false },
  { key: "club", short: "Клуб", full: "Клуб", numeric: false },
  { key: "played", short: "Од", full: "Одиграни", numeric: true },
  { key: "wins", short: "Поб", full: "Победи", numeric: true },
  { key: "draws", short: "Нер", full: "Нерешени", numeric: true },
  { key: "losses", short: "Пор", full: "Порази", numeric: true },
  { key: "goalsFor", short: "ДГ", full: "Дадени голови", numeric: true },
  { key: "goalsAgainst", short: "ПГ", full: "Примени голови", numeric: true },
  { key: "points", short: "Бод", full: "Бодови", numeric: true },
] as const satisfies readonly {
  key: keyof StandingsRow;
  short: string;
  full: string;
  numeric: boolean;
}[];

/** The two sticky-left columns keep each row identifiable while the rest
 *  scrolls on mobile. They need an explicit background per row state, or they
 *  render transparent over the text scrolling beneath them (§6.4). */
const STICKY: Partial<Record<keyof StandingsRow, string>> = {
  position: "sticky left-0 w-11",
  club: "sticky left-11",
};

/**
 * Конечна табела — brand.md §Components (Stats table): navy header row, zebra
 * body, ФК Беласица row highlighted, unknown cells „—".
 *
 * Mobile keeps **all nine columns** and scrolls horizontally inside the frame
 * (D-2.02-10). The table is the archival artifact — hiding columns to fit a
 * phone would drop recorded data, which is the one thing this page exists to
 * carry.
 */
export function StandingsTable({
  rows,
  seasonTitle,
}: {
  rows: StandingsRow[];
  seasonTitle: string;
}) {
  return (
    <div
      // A scrollable region must be keyboard-reachable, so it takes focus and
      // announces itself (§8).
      tabIndex={0}
      role="region"
      aria-label="Конечна табела — скролувај хоризонтално"
      className="overflow-x-auto rounded-card border border-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <table className="w-full min-w-[560px] text-small">
        <caption className="sr-only">Конечна табела за {seasonTitle}</caption>
        <thead className="bg-navy text-paper">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-2 py-3 text-overline font-semibold uppercase tracking-overline",
                  col.numeric ? "text-right" : "text-left",
                  STICKY[col.key],
                  // The sticky header cells sit above both the scrolling body
                  // and the header row, so they carry the navy fill themselves.
                  STICKY[col.key] && "bg-navy",
                )}
              >
                <span aria-hidden>{col.short}</span>
                <span className="sr-only">{col.full}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isClub = isBelasicaRow(row.club);
            // Sticky cells can't inherit the row's background — it would scroll
            // out from under them — so the row state resolves to a concrete
            // class that both the <tr> and each sticky <td> apply.
            const rowBg = isClub
              ? "bg-highlight"
              : i % 2 === 1
                ? "bg-zebra"
                : "bg-white";

            return (
              <tr key={i} className={cn(rowBg, isClub && "text-ink font-semibold")}>
                {COLUMNS.map((col) => {
                  const isFirst = col.key === "position";
                  const value = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        "border-b border-mist px-2 py-3 tabular-nums",
                        col.numeric ? "text-right" : "text-left",
                        isClub ? "text-ink" : "text-neutral-700",
                        // Rank + club go navy on the club's own row — the row is
                        // marked by weight and the orange bar, never by orange
                        // text (orange on `highlight` is 2.8:1 — D-1.02-1).
                        isClub && !col.numeric && "text-navy",
                        STICKY[col.key],
                        STICKY[col.key] && rowBg,
                        // 2px orange left marker on the club's row. An inset
                        // shadow rather than a border, so the sticky cell's
                        // contents don't shift 2px against the other rows.
                        isFirst &&
                          isClub &&
                          "shadow-[inset_2px_0_0_var(--color-orange)]",
                      )}
                    >
                      {col.key === "club"
                        ? (row.club ?? "—")
                        : statCell(value as number | null)}
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
