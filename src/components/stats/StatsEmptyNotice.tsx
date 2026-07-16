import { PlaceholderChip } from "@/components/home/PlaceholderChip";

/**
 * A section's empty state (the 2.03 self-omit philosophy, adapted).
 *
 * The archive omits an empty section outright, because a season page has a hero
 * and six other sections to stand on. `/statistika` has exactly three sections
 * and no hero — omitting them all would leave a heading above a footer, a page
 * that reads as broken. So each section keeps its heading and states, in one
 * line, that the data is not entered yet. Nothing is fabricated: no zero rows,
 * no empty table shell.
 *
 * The copy is structural — it describes the archive's own state and claims no
 * fact about the club, so it needs no `facts.md` entry.
 */
export function StatsEmptyNotice({
  note,
  pending,
}: {
  note: string;
  pending: string;
}) {
  return (
    <div className="max-w-measure rounded-card border border-mist bg-white p-6 md:p-8">
      <p className="text-body text-neutral-700">{note}</p>
      <p className="mt-4">
        <PlaceholderChip label={pending} />
      </p>
    </div>
  );
}
