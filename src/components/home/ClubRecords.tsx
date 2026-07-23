import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/home/Reveal";
import { SectionOverline } from "@/components/home/SectionOverline";
import { focusOnNavy } from "@/lib/focus";

export type ClubRecordData = {
  label: string | null;
  value: string | null;
  category: string | null;
  order: number | null;
};

/**
 * "Клубот во бројки" — the records strip (homepage section 4), the page's
 * mid-point NAVY anchor. This is the one band where orange finally carries as a
 * text-adjacent marker: on navy it is 4.6:1 (brand.md §Contrast), so the marker
 * rule and the hover underline both hold AA. Paper text on navy is 13.0:1.
 *
 * Content comes straight from the `clubRecord` documents (D-3.01-5) — `label`
 * is the "what" (e.g. „Шампион на Македонија"), `value` the fact
 * („1982/83 и 1987/88 (2 титули)"). Neither is reformatted: a record is a
 * factual claim and ships exactly as the editor curated it (content-truth).
 *
 * Order (brief: "by category then order"): grouped by a category PRIORITY that
 * leads with honours (trophies are the headline achievement), then appearances,
 * then scorers — and within each by the curated `order` (D-3.03-3). The
 * first-ordered record (the championship) is pulled out as a full-width feature;
 * the rest fall into an even 3-column ledger.
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
    <section
      aria-labelledby="records-heading"
      className="bg-navy py-16 text-paper md:py-24"
    >
      <Container>
        <Reveal>
          <SectionOverline variant="onNavy">Статистика</SectionOverline>
          <h2
            id="records-heading"
            className="mt-4 max-w-measure font-serif text-h2 font-semibold text-paper"
          >
            Клубот во бројки
          </h2>
        </Reveal>

        {/* Feature — the championship, the club's crowning record. */}
        <Reveal className="mt-10">
          <div className="border-t-2 border-orange pt-5">
            <h3 className="font-serif text-h2 font-semibold text-paper">
              {feature.label}
            </h3>
            <p className="mt-2 max-w-measure text-body-l text-paper/85">
              {feature.value}
            </p>
          </div>
        </Reveal>

        {/* Ledger — the remaining records in an even grid. */}
        {rest.length > 0 && (
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((record, i) => (
              <li key={`${record.label}-${i}`}>
                <Reveal delayIndex={i % 3}>
                  <span aria-hidden className="block h-0.5 w-8 bg-orange" />
                  <h3 className="mt-4 font-serif text-h3 font-semibold text-paper">
                    {record.label}
                  </h3>
                  <p className="mt-2 text-body text-paper/80">{record.value}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <Reveal className="mt-12">
          <Link
            href="/statistika"
            className={`group inline-flex items-center gap-1.5 text-small font-semibold text-paper decoration-2 underline-offset-4 hover:underline hover:decoration-orange ${focusOnNavy}`}
          >
            Сите рекорди и статистика
            <ArrowRight
              className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
