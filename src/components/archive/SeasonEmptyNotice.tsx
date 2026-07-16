import Link from "next/link";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnPaper } from "@/lib/focus";

/** The five data-bearing sections, in page order — each one a chip here. */
const PENDING = [
  "приказна за сезоната",
  "конечна табела",
  "состав",
  "тренери",
  "фотографии",
];

/**
 * The fully-empty season notice (D-2.02-8) — the first-class state, not an
 * edge case: right after 2.09 ~all 74 seasons are shells with only
 * slug/title/decade, since story/table/squad/trainers are curated by hand
 * afterwards and photos land unpublished behind the rights gate.
 *
 * Without it, five self-omitting sections would leave the hero floating
 * directly above the footer — a page that reads as broken rather than as
 * honestly incomplete.
 *
 * All copy here is **structural**: it describes the archive's own state and
 * claims no fact about the club, so it needs no `facts.md` entry.
 */
export function SeasonEmptyNotice() {
  return (
    <div className="max-w-measure rounded-card border border-mist bg-white p-8">
      <h2 className="font-serif text-h3 font-semibold text-navy">
        Оваа сезона сѐ уште нема објавени детали.
      </h2>
      <p className="mt-3 text-body text-neutral-700">
        Архивата се пополнува постепено. За оваа сезона допрва се внесуваат:
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {PENDING.map((label) => (
          <li key={label}>
            <PlaceholderChip label={label} />
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Link
          href="/arhiva"
          className={`text-small text-navy decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnPaper}`}
        >
          Назад кон архивата
        </Link>
      </p>
    </div>
  );
}
