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
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-mist bg-mist sm:grid-cols-3 lg:grid-cols-5">
      {figures.map((figure) => (
        <div key={figure.label} className="bg-white px-4 py-5">
          <dt className="text-overline uppercase tracking-overline text-neutral-700">
            {figure.label}
          </dt>
          <dd className="mt-2 font-serif text-h3 font-semibold text-navy tabular-nums">
            {figure.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
