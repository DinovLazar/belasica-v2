import { statCell } from "@/lib/archive";

/** Belasica's own row of a season's final table — the locked `finalTable`
 *  fields, nothing derived. */
export type SeasonRecord = {
  position: number | null;
  played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goalsFor: number | null;
  goalsAgainst: number | null;
  points: number | null;
};

/**
 * The club's league record for one season, as a scoreboard.
 *
 * Why this exists (3.06a): „Табела" rendered only `tablePhoto`, so 8 seasons
 * showed an empty note even though the archive holds their figures, and the 88
 * with a scan showed a photograph of a table that is often barely legible.
 * `finalTable` has carried Belasica's own row on 92 seasons since 3.02F and was
 * read by `/statistika` alone; this puts the same authoritative figures on the
 * season page they belong to.
 *
 * It is the club's row, NOT the full standings — the archive holds one row per
 * season, so the board is deliberately a record strip and never pretends to be
 * the league table. The scan, where one exists, remains the table itself.
 *
 * Same scoreboard treatment as `BalanceSummary` and the homepage records strip
 * (brand.md §Components): navy cells on an orange ground, gapped 2px so the
 * orange reads as the rule between cells. An unrecorded figure renders „—"
 * (§6.4) — never 0, which would be a claim the club did not play.
 */
export function SeasonRecordBoard({ record }: { record: SeasonRecord }) {
  const figures: { label: string; value: string }[] = [
    { label: "Пласман", value: statCell(record.position) },
    { label: "Одиграни", value: statCell(record.played) },
    { label: "Победи", value: statCell(record.wins) },
    { label: "Нерешени", value: statCell(record.draws) },
    { label: "Порази", value: statCell(record.losses) },
    { label: "Дадени голови", value: statCell(record.goalsFor) },
    { label: "Примени голови", value: statCell(record.goalsAgainst) },
    { label: "Бодови", value: statCell(record.points) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-0.5 border-y-[3px] border-orange bg-orange sm:grid-cols-4">
      {figures.map((figure) => (
        <div key={figure.label} className="bg-navy px-4 py-5">
          <dt className="text-overline font-bold uppercase tracking-overline text-paper/80">
            {figure.label}
          </dt>
          <dd className="u-stat mt-2 tabular-nums text-paper">
            {figure.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
