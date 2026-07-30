import { statCell } from "@/lib/archive";
import {
  formatGoalDifference,
  formatWinRate,
  type ClubBalance,
} from "@/lib/stats";

/**
 * The all-time balance band — one figure per summed column (D-2.04-1).
 *
 * Every figure is a sum of entered values; an unrecorded column renders „—",
 * the table convention for unknown (§6.4). It never renders 0, which would be a
 * claim that the club played nothing.
 */
export function BalanceSummary({ balance }: { balance: ClubBalance }) {
  const { totals } = balance;

  const figures: { label: string; value: string }[] = [
    { label: "Сезони", value: String(balance.seasons.length) },
    { label: "Одиграни", value: statCell(totals.played.sum) },
    { label: "Победи", value: statCell(totals.wins.sum) },
    { label: "Нерешени", value: statCell(totals.draws.sum) },
    { label: "Порази", value: statCell(totals.losses.sum) },
    { label: "Дадени голови", value: statCell(totals.goalsFor.sum) },
    { label: "Примени голови", value: statCell(totals.goalsAgainst.sum) },
    { label: "Гол-разлика", value: formatGoalDifference(balance.goalDifference) },
    { label: "Бодови", value: statCell(totals.points.sum) },
    { label: "Победи %", value: formatWinRate(balance.winRate) },
  ];

  return (
    // The same scoreboard treatment as the homepage records strip (brand.md
    // §Components): navy cells over an orange ground, gapped 2px so the orange
    // reads as the rule between them rather than a border drawn around each.
    <dl className="grid grid-cols-2 gap-0.5 border-y-[3px] border-orange bg-orange sm:grid-cols-3 lg:grid-cols-5">
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
