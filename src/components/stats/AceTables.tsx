import {
  SourceTable,
  type SourceColumn,
  type SourceTableRow,
} from "@/components/stats/SourceTable";
import type {
  PlainRankedTable,
  RankedTable,
  SeasonScorerRow,
} from "@/content/statistika-extra";

/**
 * The render layer for Аце's transcribed statistics, Phase 3.34.
 *
 * Everything here is a **server component** reading `src/content/statistika-extra.ts`,
 * which is generated from `data/book/statistika-source.md`. No figure, name,
 * period or sentence on these tables is written by this file — it only decides
 * which cell each one sits in.
 *
 * ## Where the column headers come from
 * Аце writes his own column line above every table („Играч/период/голови“,
 * „Играчи/настапи“, „Сезона/играч/голови“). Those words ARE the headers here,
 * split on the slash, rather than labels chosen by this file. The one column he
 * does not name is the rank — he prints the numbers („1.“, „8.“) without a
 * heading for them — so that column shows „#“ with an `sr-only` „Ранг“, exactly
 * as the balance table on this page labels its position column.
 */

/** His rank numerals need a column; „#“ is the page's existing label for one. */
const RANK_COLUMN: SourceColumn = {
  key: "rank",
  short: "#",
  full: "Ранг",
  numeric: true,
};

/**
 * Splits his column line into columns. The last field is always the figure and
 * is the only numeric one — a period („1983-91“) is a label, not a quantity.
 */
function columnsFromLine(columnLine: string): SourceColumn[] {
  const parts = columnLine
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part !== "");

  return [
    RANK_COLUMN,
    ...parts.map((part, i) => ({
      key: `c${i}`,
      short: part,
      numeric: i === parts.length - 1,
    })),
  ];
}

/**
 * Blocks B–E and both Прва-македонска tables — his intro, his table, his tail.
 *
 * Rows render in his order and are never re-sorted: his shared ranks (three
 * players tied at 8, two at 22) are the content, and a sort control would pull
 * them apart. Where his own numbering is internally inconsistent it is shown
 * exactly as he wrote it (see the module header on `statistika-extra.ts`).
 */
export function RankedSourceTable({
  intro,
  columnLine,
  rows,
  tail,
  caption,
  scrollLabel,
}: {
  intro: string[];
  columnLine: string;
  rows: RankedTable["rows"];
  tail: string[];
  caption: string;
  scrollLabel: string;
}) {
  const columns = columnsFromLine(columnLine);
  // Blocks B–E carry a period column; the Прва-македонска tables do not.
  const hasPeriod = columns.length === 4;

  const tableRows: SourceTableRow[] = rows.map((row) => ({
    // His ranks repeat, so they cannot key a row on their own.
    id: `${row.line}`,
    cells: hasPeriod
      ? {
          rank: `${row.rank}.`,
          c0: row.name,
          c1: row.period,
          c2: row.value,
        }
      : {
          rank: `${row.rank}.`,
          c0: row.name,
          c1: row.value,
        },
  }));

  return (
    <>
      {intro.length > 0 && (
        <div className="mt-4 max-w-measure space-y-3 text-small text-neutral-700">
          {intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      <div className="mt-6">
        <SourceTable
          columns={columns}
          rows={tableRows}
          caption={caption}
          scrollLabel={scrollLabel}
          minWidthClass={hasPeriod ? "min-w-[420px]" : "min-w-[320px]"}
        />
      </div>

      {/* His „Понатаму следуваат: …“ line, and block E's two `*` footnotes —
          each is a sentence of his that names players the table above stops
          short of, so dropping one would silently shorten his list. */}
      {tail.length > 0 && (
        <div className="mt-4 max-w-measure space-y-2 text-small text-neutral-500">
          {tail.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </>
  );
}

/** One of the two Прва-македонска tables, which share the block's narrative. */
export function PlainRankedSourceTable({
  table,
  caption,
  scrollLabel,
}: {
  table: PlainRankedTable;
  caption: string;
  scrollLabel: string;
}) {
  return (
    <RankedSourceTable
      intro={[table.intro]}
      columnLine={table.columnLine}
      rows={table.rows}
      tail={[]}
      caption={caption}
      scrollLabel={scrollLabel}
    />
  );
}

/**
 * Block A — top scorer per season, 1950 → 2025/26.
 *
 * Three of his shapes need a decision here, and each is resolved by showing
 * what he wrote and nothing more:
 *
 *  - **A season he left blank** renders as the season and an em dash, with an
 *    `sr-only` „нема податок“ so the gap is stated rather than merely drawn.
 *    Never a guessed scorer (content-truth).
 *  - **A tie** stacks every name he listed in the player cell and its goal
 *    figure in the same position in the goals cell, so the two columns stay in
 *    step. Both names are his; neither is promoted over the other.
 *  - **His inline note** („фалат 6 извештаи“) follows the name in muted text,
 *    in the parentheses he typed — it qualifies that season's record and must
 *    travel with it.
 */
export function SeasonScorersTable({
  rows,
  columnLine,
}: {
  rows: SeasonScorerRow[];
  columnLine: string;
}) {
  const parts = columnLine
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part !== "");

  const columns: SourceColumn[] = [
    { key: "season", short: parts[0] ?? "Сезона" },
    { key: "player", short: parts[1] ?? "Играч" },
    { key: "goals", short: parts[2] ?? "Голови", numeric: true },
  ];

  const tableRows: SourceTableRow[] = rows.map((row) => {
    const blank = row.scorers.length === 0;

    return {
      id: `${row.line}`,
      cells: {
        season: <span className="text-navy">{row.season}</span>,
        player: blank ? (
          <>
            <span aria-hidden>—</span>
            <span className="sr-only">нема податок</span>
          </>
        ) : (
          <span className="flex flex-col gap-0.5">
            {row.scorers.map((scorer, i) => (
              <span key={i}>{scorer.player}</span>
            ))}
            {row.note && <span className="text-neutral-500">({row.note})</span>}
          </span>
        ),
        goals: blank ? (
          <span aria-hidden>—</span>
        ) : (
          <span className="flex flex-col gap-0.5 font-bold text-navy">
            {row.scorers.map((scorer, i) => (
              <span key={i}>{scorer.goals}</span>
            ))}
          </span>
        ),
      },
    };
  });

  return (
    <SourceTable
      columns={columns}
      rows={tableRows}
      caption="Најдобри стрелци на Беласица по сезони"
      scrollLabel="Најдобри стрелци по сезони — скролувај хоризонтално"
      minWidthClass="min-w-[320px]"
    />
  );
}
