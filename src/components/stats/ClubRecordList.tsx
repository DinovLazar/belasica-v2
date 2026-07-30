import { Reveal } from "@/components/home/Reveal";
import type { ClubRecordGroup } from "@/lib/stats";

/**
 * „Клупски рекорди" — the 30 curated `clubRecord` documents (D-3.01-5),
 * grouped into the Studio's own four categories.
 *
 * **Why this is a register and not the scoreboard.** brand.md §Components
 * makes the scoreboard the records voice, and both existing record surfaces
 * use it — the homepage strip and this page's `BalanceSummary` both set their
 * value in `u-stat` (Oswald, `clamp(1.375rem, 3vw, 2.25rem)`). That works for
 * a figure like „1982/83 и 1987/88". It does not survive this set: the
 * international-appearances record is a 17-name roster of ~400 characters, and
 * several others are full clauses. Setting those in condensed display caps
 * produces a wall, not a record. So the value here is body copy and the
 * scoreboard is left to the figures that are actually figures — the balance
 * band directly below (D-3.02F-C-2).
 *
 * What is kept from that vocabulary: the record **label** is the same tracked
 * caps as the strip's and the band's `dt`, each group is a white block capped
 * by the signature 6px orange bar (`u-cap`), and every value renders exactly
 * as curated — never reformatted, never computed (brand.md §Components).
 *
 * An empty group never reaches here (`groupClubRecords` drops it, D-2.02-3),
 * and the caller omits the whole section when no group survives.
 */
export function ClubRecordList({ groups }: { groups: ClubRecordGroup[] }) {
  return (
    <div className="mt-8 space-y-10 md:space-y-12">
      {groups.map((group, groupIndex) => (
        <Reveal key={group.key} delayIndex={groupIndex}>
          <h3 className="u-h3 text-navy">{group.title}</h3>

          {/* One block per group, capped by the 6px orange bar — the same
              treatment `StatsEmptyNotice` gives a block on this page. */}
          <dl className="u-cap mt-5 bg-white">
            {group.records.map((record, index) => (
              <div
                key={`${group.key}-${index}`}
                className={[
                  // A hairline between rows, never around them: the block is
                  // one object and the rules divide it (brand.md §Color, mist).
                  index > 0 ? "border-t border-mist" : "",
                  "px-5 py-5 md:px-8 md:py-6",
                  // Label column left, value right from md up; stacked below,
                  // so a long value simply grows downward and never pushes the
                  // page wider. `minmax(0,…)` lets both tracks shrink — without
                  // it a long unbroken run of text would force overflow.
                  "md:grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-baseline md:gap-x-10",
                ].join(" ")}
              >
                <dt className="text-overline font-bold uppercase leading-snug tracking-overline text-navy">
                  {record.label}
                </dt>
                <dd className="mt-2 max-w-measure text-body text-ink md:mt-0">
                  {record.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  );
}
