import Link from "next/link";
import { PlaceholderChip } from "@/components/home/PlaceholderChip";
import { focusOnPaper } from "@/lib/focus";

/** The data-bearing sections of the redesigned season page, in page order —
 *  each one a chip here. Re-worded at 3.04 (D-3.04-7): the page now renders
 *  the team photo, the table AS AN IMAGE, trainer + lineup/stats, results,
 *  story and gallery — so the old chips („конечна табела", „состав",
 *  „тренери") named fields the page no longer reads, which would have told a
 *  reader the archive was waiting on the wrong thing. */
const PENDING = [
  "тимска фотографија",
  "табела на сезоната",
  "тренер и статистика",
  "резултати",
  "приказна за сезоната",
  "фотографии",
];

/**
 * The fully-empty season notice (D-2.02-8) — written when ~all 74 seasons were
 * shells with only slug/title/decade. After the 3.02 content fill **no
 * published season is fully empty any more**, so this is now a guard rather
 * than the common case: it fires only if a season is published with no lead
 * photo and none of the five sections.
 *
 * Without it, the self-omitting sections would leave the title band floating
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
