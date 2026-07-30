import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { focusOnPaper } from "@/lib/focus";

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
 * Order (D-3.03-3): grouped by a category priority that leads with honours
 * (trophies are the headline achievement), then appearances, then scorers —
 * and within each by the curated `order`.
 */
const CATEGORY_PRIORITY: Record<string, number> = {
  honours: 0,
  appearances: 1,
  scorers: 2,
  other: 3,
};

function sortRecords(records: ClubRecordData[]): ClubRecordData[] {
  return [...records].sort((a, b) => {
    const pa = CATEGORY_PRIORITY[a.category ?? "other"] ?? 3;
    const pb = CATEGORY_PRIORITY[b.category ?? "other"] ?? 3;
    if (pa !== pb) return pa - pb;
    const oa = a.order ?? Number.MAX_SAFE_INTEGER;
    const ob = b.order ?? Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    // Stable final tiebreak so the render is deterministic across cold reads.
    return (a.label ?? "").localeCompare(b.label ?? "", "mk");
  });
}

export function ClubRecords({ records }: { records: ClubRecordData[] }) {
  // Only records that can actually be rendered (both required fields present).
  const usable = sortRecords(
    records.filter((r) => r.label?.trim() && r.value?.trim()),
  );
  if (usable.length === 0) return null;

  const [feature, ...rest] = usable;

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
        <div className="bg-orange p-6 sm:p-8 lg:p-10">
          <h3 className="text-overline font-bold uppercase tracking-overline text-navy">
            {feature.label}
          </h3>
          <p className="u-stat mt-3 text-stat-lead text-navy">{feature.value}</p>
        </div>

        {rest.length > 0 && (
          <ul className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((record, i) => (
              <li
                key={`${record.label}-${i}`}
                className="bg-navy p-5 sm:p-6 lg:p-7"
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
