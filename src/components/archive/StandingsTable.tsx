// ⚠️ LEGACY — in-repo but NOT RENDERED since 3.04 (D-3.04-6). The season page
// now shows the league table as an image (`season.tablePhoto`, D-3.01-2), so
// nothing imports this component today. It is kept, unrendered, for the same
// reason `season.finalTable` is kept in the schema ("Задржано за
// компатибилност") and on the same precedent as the unregistered `match.ts`
// (D-2.01-2): the legacy field still holds a real row (`1982-83`), which
// `/statistika` reads to build its all-time balance — with its own components,
// not this one — and this is the only component that can display that row as a
// table. Delete it together with the field when the model re-locks after 3.06.
import { cn } from "@/lib/utils";
import { isBelasicaRow, statCell } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";

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
      // `relative` is load-bearing, not cosmetic (3.09): the `sr-only` column
      // labels inside are `position: absolute`, and against a `static` scroll
      // container their containing block is the initial one — so they escape
      // the `overflow-x` clip and stretch the DOCUMENT's scrollable width.
      // Measured on /statistika at 375px: the page itself scrolled 279px
      // sideways, an SC 1.4.10 failure, traced to one `sr-only` span sitting at
      // x=654. Making the region a containing block clips them (D-3.09-6).
      //
      // The ring is now the project's `.u-focus` outline. This was the last
      // `focus-visible:outline-none` + `ring-*` (box-shadow) pair on the site —
      // the exact shape D-3.05-4 removed everywhere else.
      className={cn("relative overflow-x-auto border border-mist", focusOnPaper)}
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
                  "px-2 py-3 text-overline font-bold uppercase tracking-overline",
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
              <tr key={i} className={cn(rowBg, isClub && "text-ink font-bold")}>
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
