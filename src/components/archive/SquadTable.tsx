import Link from "next/link";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { statCell } from "@/lib/archive";
import { focusOnPaper } from "@/lib/focus";

export type SquadMember = {
  name: string | null;
  slug: string | null;
  appearances: number | null;
  goals: number | null;
};

/**
 * Состав — a light table capped at `max-w-measure` (D-2.02-11), deliberately
 * *not* the navy Stats table: two navy-headed tables stacked read as a data
 * dump and fight the page's editorial tone, and the narrow measure keeps the
 * name→number relationship readable.
 *
 * Player names link to `/legendi/<slug>`, which is built in 2.05 — **these
 * links 404 until then, and that is expected**. They stay underlined on hover
 * and carry a navy label, so they are distinguishable without relying on
 * colour (§8).
 */
export function SquadTable({
  members,
  seasonTitle,
}: {
  members: SquadMember[];
  seasonTitle: string;
}) {
  return (
    <table className="w-full text-body">
      <caption className="sr-only">Состав за {seasonTitle}</caption>
      <thead>
        <tr className="border-b border-mist">
          <th
            scope="col"
            className="pb-2.5 text-left text-overline font-semibold uppercase tracking-overline text-neutral-700"
          >
            Играч
          </th>
          <th
            scope="col"
            className="w-28 pb-2.5 text-right text-overline font-semibold uppercase tracking-overline text-neutral-700"
          >
            {/* Abbreviated where the column is narrow; the full word stays
                available to screen readers (same rule as the standings). */}
            <span aria-hidden className="md:hidden">
              Наст.
            </span>
            <span aria-hidden className="hidden md:inline">
              Настапи
            </span>
            <span className="sr-only">Настапи</span>
          </th>
          <th
            scope="col"
            className="w-24 pb-2.5 text-right text-overline font-semibold uppercase tracking-overline text-neutral-700"
          >
            <span aria-hidden className="md:hidden">
              Гол.
            </span>
            <span aria-hidden className="hidden md:inline">
              Голови
            </span>
            <span className="sr-only">Голови</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((member, i) => (
          <tr key={i} className="border-b border-mist">
            <td className="py-3 text-neutral-700">
              {member.name == null || member.slug == null ? (
                // An unresolved reference (or a person with no slug) still has
                // real appearance/goal numbers, so the row stays — with a chip
                // instead of a name. Never invent the name, never drop the row.
                <PlaceholderChip label="име на играч" />
              ) : (
                <Link
                  href={`/legendi/${member.slug}`}
                  className={`font-medium text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
                >
                  {member.name}
                </Link>
              )}
            </td>
            <td className="py-3 text-right tabular-nums text-neutral-700">
              {statCell(member.appearances)}
            </td>
            <td className="py-3 text-right tabular-nums text-neutral-700">
              {statCell(member.goals)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
