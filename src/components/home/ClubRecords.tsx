import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { focusOnPaper } from "@/lib/focus";
import { cn } from "@/lib/utils";

export type ClubRecordData = {
  label: string | null;
  value: string | null;
  category: string | null;
  order: number | null;
};

/**
 * "Клубот во бројки" — the records scoreboard (homepage section 4).
 *
 * A stat strip, not a live scoreboard: no clock, no fixture, no ticker, and
 * nothing computed. Content comes straight from the `clubRecord` documents
 * (D-3.01-5) — `label` is the "what" („Шампион на Македонија"), `value` the
 * fact („1982/83 и 1987/88 (2 титули)"). Neither is reformatted: a record is a
 * factual claim and ships exactly as the editor curated it (content-truth).
 *
 * The strip is full-bleed and gapped 2px over an orange ground, so the orange
 * reads as the rule BETWEEN cells rather than as a border drawn around them.
 * The featured record is an orange cell carrying navy ink (5.81:1); the rest
 * are navy cells carrying paper (14.95:1).
 *
 * **Selection is an explicit label whitelist** (3.05b, superseding D-3.03-3's
 * category-priority sort). The archive holds 30 `clubRecord` documents and all
 * 30 render on `/statistika`; the homepage is a front door and shows six. The
 * six are NAMED here rather than sliced or filtered by category, so that
 * publishing a 31st record in Studio — or re-ordering the existing ones —
 * cannot silently change what the front page claims about the club. Changing
 * the homepage's six is an editorial decision, and it is made in this list.
 *
 * The order below IS the render order; it does not consult `category` or
 * `order`. A whitelisted label that is not in Sanity simply does not render —
 * never substituted, never back-filled from another record (content-truth).
 */
const FEATURED_LABEL = "Шампион на Македонија";

const HOMEPAGE_RECORD_LABELS: readonly string[] = [
  FEATURED_LABEL,
  "Вицешампион на Македонија",
  "Полуфинале — Куп на Македонија",
  "Југословенски второлигаш",
  "Најдобар стрелец на сите времиња на Беласица",
  "Рекордер по настапи",
];

/**
 * Widen the strip's final cell so the last row ends flush.
 *
 * The cells sit ON the orange ground with a 2px gap, so an incomplete final
 * row does not leave whitespace — it leaves an ORANGE rectangle the size of a
 * record cell, which reads as a hole beside the one deliberate orange cell
 * (the featured record). Today's whitelist puts five cells in this grid: at
 * `lg` that is 3 + 2 and at `sm` 2 + 2 + 1, so both breakpoints would show one.
 *
 * Widening the last cell closes the row at every count, without capping the
 * strip or dropping a record. Classes are literals so Tailwind keeps them.
 */
function lastCellSpan(count: number): string {
  const sm = count % 2 === 0 ? "" : "sm:col-span-2";
  const lg =
    count % 3 === 0 ? "" : count % 3 === 1 ? "lg:col-span-3" : "lg:col-span-2";
  return `${sm} ${lg}`.trim();
}

export function ClubRecords({ records }: { records: ClubRecordData[] }) {
  // Only records that can actually be rendered (both required fields present).
  const usable = records.filter((r) => r.label?.trim() && r.value?.trim());

  // Resolve the whitelist in its own order. `find` on the exact label string:
  // a record is matched by what the editor titled it, so a renamed document
  // drops out visibly rather than being approximated by a near-match.
  const selected = HOMEPAGE_RECORD_LABELS.map((label) =>
    usable.find((r) => r.label?.trim() === label),
  ).filter((r): r is ClubRecordData => Boolean(r));

  if (selected.length === 0) return null;

  // The feature is specifically the championship record — not „whichever
  // survived first". If it were ever unpublished, the strip renders without a
  // featured cell rather than promoting the runner-up into the orange one,
  // which would overstate a lesser record (content-truth, brief task 11).
  const feature =
    selected[0]?.label?.trim() === FEATURED_LABEL ? selected[0] : null;
  const rest = feature ? selected.slice(1) : selected;

  return (
    <section aria-labelledby="records-heading" className="bg-paper">
      <Container className="py-section">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div>
            <SectionOverline>Статистика</SectionOverline>
            <h2 id="records-heading" className="u-h2 mt-6 text-navy">
              Клубот во бројки
            </h2>
          </div>
          <Link href="/statistika" className={`u-link text-navy ${focusOnPaper}`}>
            Сите рекорди и статистика
          </Link>
        </Reveal>
      </Container>

      {/* Full-bleed strip. The 2px grid gap lets the orange ground show
          through as the rule between cells. */}
      <Reveal className="grid gap-0.5 border-y-[3px] border-orange bg-orange">
        {feature && (
          <div className="bg-orange p-6 sm:p-8 lg:p-10">
            <h3 className="text-overline font-bold uppercase tracking-overline text-navy">
              {feature.label}
            </h3>
            <p className="u-stat mt-3 text-stat-lead text-navy">
              {feature.value}
            </p>
          </div>
        )}

        {rest.length > 0 && (
          <ul className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((record, i) => (
              <li
                key={`${record.label}-${i}`}
                className={cn(
                  "bg-navy p-5 sm:p-6 lg:p-7",
                  i === rest.length - 1 && lastCellSpan(rest.length),
                )}
              >
                <h3 className="text-overline font-bold uppercase tracking-overline text-paper/80">
                  {record.label}
                </h3>
                <p className="u-stat mt-3 text-paper">{record.value}</p>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
