/**
 * Generates `src/content/statistika-extra.ts` from the tracked verbatim
 * transcription `data/book/statistika-source.md`, Phase 3.34.
 *
 * ⚠️ READ-ONLY. This script opens no Sanity client, holds no token and writes
 * nothing outside `src/content/statistika-extra.ts`. Same discipline
 * `scripts/build-season-tables.mjs` follows (D-3.28), minus its report.
 *
 *   node scripts/build-statistika-extra.mjs          # write the module
 *   node scripts/build-statistika-extra.mjs --check  # verify it is current
 *
 * `--check` regenerates in memory and diffs against the file on disk, so a
 * reviewer can prove the committed module is exactly what the source yields.
 *
 * ## The two proofs this script prints
 *
 * 1. **Round-trip.** Every parsed row is re-serialised from its own fields and
 *    compared to the source line it came from, with all whitespace removed on
 *    both sides. Whitespace is the ONLY thing this parser is allowed to change
 *    (the author glues fields together — „1993/94Д. Хаџиосмановиќ10“ — and the
 *    table has to separate them into cells). Any other difference means a
 *    character was invented or dropped, and the script exits non-zero.
 * 2. **Counts.** Each block's row count is asserted against the number the
 *    author himself states in his intro sentence where he states one („следниве
 *    30 играчи“, „следниве 25 играчи“, „Седум играчи“).
 *
 * ## What this script must never do
 * Nothing here corrects, reconciles, expands or reorders the author's data.
 * Shared ranks are carried as written — including the three places where his
 * numbering is internally inconsistent, which are listed as owed items in the
 * 3.34 completion report rather than renumbered here. The seasons he left blank
 * stay blank. Nothing under `src/` may read the source
 * markdown directly; this module is its only projection (D-3.16-2).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "data/book/statistika-source.md");
const OUT = join(ROOT, "src/content/statistika-extra.ts");

const CHECK = process.argv.includes("--check");

/* ------------------------------------------------------------------ read */

/** `<!-- L### -->` + the verbatim paragraph beneath it. */
function readSource() {
  const text = readFileSync(SOURCE, "utf8");
  const lines = [];
  const re = /<!-- L(\d+) -->\n(.*)\n/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    lines.push({ line: Number(m[1]), text: m[2] });
  }
  if (lines.length === 0) throw new Error("no marked lines in the source");
  return lines;
}

/** The author's rules between blocks, and his „no data“ runs inside block A. */
const IS_BLOCK_RULE = (s) => /^_{20,}$/.test(s.trim());
/** His own column line — „Сезона/играч/голови“, „Играч/период/настапи“. */
const IS_COLUMN_LINE = (s) => /^(Сезона|Играч|Играчи)\//.test(s.trim());

/* ----------------------------------------------------------------- parse */

const roundTrip = { checked: 0, identical: 0, failures: [] };

/**
 * The round-trip proof. `parts` are the parsed field values in source order;
 * with whitespace removed they must reconstitute the source line exactly.
 */
function assertRoundTrip(line, source, parts) {
  const strip = (s) => s.replace(/\s+/gu, "");
  const got = parts.map((p) => (p == null ? "" : String(p))).join("");
  roundTrip.checked += 1;
  if (strip(got) === strip(source)) {
    roundTrip.identical += 1;
  } else {
    roundTrip.failures.push({ line, source, got });
  }
}

/**
 * Block A — one season per row, in the author's chronological order.
 *
 * Four shapes occur, all of them his:
 *   „1953/54 К. Ќосев 8“                 — the ordinary row
 *   „1951. __________“                   — a season he has no scorer for
 *   „Т. Семенков 10“                     — a tie, continuing the season above
 *   „1961/62 Ѓ. Георгиев 8 (фалат 6 извештаи)“  — an inline note
 */
function parseSeasonScorers(lines) {
  const rows = [];

  for (const { line, text } of lines) {
    const raw = text;
    const s = raw.trim();
    if (s === "") continue;

    const seasonMatch = s.match(/^(\d{4}(?:\/\d{2,4})?\.?)\s*(.*)$/u);

    // No leading season → a tied scorer, hanging under the season above.
    if (!seasonMatch) {
      const prev = rows[rows.length - 1];
      if (!prev) throw new Error(`L${line}: tie with no season above it`);
      const scorer = parseScorer(line, s);
      assertRoundTrip(line, s, [scorer.player, scorer.goals, scorer.noteText]);
      prev.scorers.push({ player: scorer.player, goals: scorer.goals });
      continue;
    }

    const [, season, rest] = seasonMatch;

    // „__________“ — the author has no scorer for this season. It renders as a
    // season with no name, never as a guess.
    if (/^_+$/.test(rest.trim())) {
      rows.push({ season, scorers: [], note: null, line });
      assertRoundTrip(line, s, [season, rest.trim()]);
      continue;
    }

    const scorer = parseScorer(line, rest);
    assertRoundTrip(line, s, [
      season,
      scorer.player,
      scorer.goals,
      scorer.noteText,
    ]);
    rows.push({
      season,
      scorers: [{ player: scorer.player, goals: scorer.goals }],
      note: scorer.note,
      line,
    });
  }

  return rows;
}

/**
 * „И. Чулев(ски) 11“ · „Д. Хаџиосмановиќ10“ · „Ѓ. Георгиев 8 (фалат 6 извештаи)“
 *
 * Parsed from the right: a trailing parenthetical is the author's note, the
 * digits before it are the goals, everything left of those is the name. The
 * name group is lazy so „Чулев(ски)“ stays inside the name — a trailing note is
 * only a note when it follows the number.
 */
function parseScorer(line, text) {
  const m = text
    .trim()
    .match(/^(?<player>.*?)\s*(?<goals>\d+)\s*(?:\((?<note>[^)]*)\))?\s*$/u);
  if (!m) throw new Error(`L${line}: unparsed scorer „${text}“`);

  const { player, goals, note } = m.groups;
  return {
    player,
    goals: Number(goals),
    note: note ?? null,
    /** The note as it reads in the source, for the round-trip comparison. */
    noteText: note == null ? "" : `(${note})`,
  };
}

/**
 * Blocks B–E — „1. М. Василев 1983-91, 29“.
 *
 * The period is carried exactly as printed, two-digit spans („83-90“) included:
 * expanding one to „1983-90“ would be a correction, and this file makes none.
 */
function parseRankedWithPeriod(lines) {
  const rows = [];
  for (const { line, text } of lines) {
    const s = text.trim();
    if (s === "") continue;
    const m = s.match(
      /^(?<rank>\d+)\s*\.\s*(?<name>.*?)\s*(?<period>\d{2,4}\s*-\s*\d{2,4})\s*,\s*(?<value>\d+)\s*$/u,
    );
    if (!m) throw new Error(`L${line}: unparsed ranked row „${s}“`);
    const { rank, name, period, value } = m.groups;
    assertRoundTrip(line, s, [rank, ".", name, period, ",", value]);
    rows.push({
      rank: Number(rank),
      name,
      period,
      value: Number(value),
      line,
    });
  }
  return rows;
}

/** Block F's two tables — „1. В. Костов 177“, no period column. */
function parseRankedPlain(lines) {
  const rows = [];
  for (const { line, text } of lines) {
    const s = text.trim();
    if (s === "") continue;
    const m = s.match(/^(?<rank>\d+)\s*\.\s*(?<name>.*?)\s*(?<value>\d+)\s*$/u);
    if (!m) throw new Error(`L${line}: unparsed ranked row „${s}“`);
    const { rank, name, value } = m.groups;
    assertRoundTrip(line, s, [rank, ".", name, value]);
    rows.push({ rank: Number(rank), name, value: Number(value), line });
  }
  return rows;
}

/* ------------------------------------------------------------- segmenting */

function findLine(lines, predicate, what) {
  const i = lines.findIndex(({ text }) => predicate(text.trim()));
  if (i === -1) throw new Error(`source is missing: ${what}`);
  return i;
}

/**
 * A block B–E: an ALL-CAPS heading, the author's intro paragraph(s), his column
 * line, the ranked rows, then whatever he wrote underneath (a „Понатаму
 * следуваат…“ tail, or the two `*` footnotes on block E). The block rules
 * (`______`) are the document's own separators and are not content.
 */
function segmentRanked(slice) {
  const heading = slice[0].text.trim();
  const colIndex = findLine(
    slice,
    IS_COLUMN_LINE,
    `column line under „${heading}“`,
  );

  const intro = slice
    .slice(1, colIndex)
    .map(({ text }) => text.trim())
    .filter((t) => t !== "" && !IS_BLOCK_RULE(t));

  const body = slice.slice(colIndex + 1).filter(({ text }) => {
    const t = text.trim();
    return t !== "" && !IS_BLOCK_RULE(t);
  });

  const isRow = ({ text }) => /^\d+\s*\./.test(text.trim());
  let end = body.findIndex((entry) => !isRow(entry));
  if (end === -1) end = body.length;

  return {
    heading,
    intro,
    columnLine: slice[colIndex].text.trim(),
    rowLines: body.slice(0, end),
    tail: body.slice(end).map(({ text }) => text.trim()),
    line: slice[0].line,
  };
}

/* ------------------------------------------------------------------ build */

function build() {
  const lines = readSource();

  const iA = findLine(
    lines,
    (t) => t.startsWith("Најдобри стрелци на Беласица по сезони"),
    "block A heading",
  );
  const iB = findLine(
    lines,
    (t) => t === "ВТОРА И ТРЕТА ЈУГОСЛОВЕНСКА ЛИГА - ГОЛОВИ",
    "block B heading",
  );
  const iC = findLine(
    lines,
    (t) => t === "ВТОРА И ТРЕТА ЈУГОСЛОВЕНСКА ЛИГА - НАТПРЕВАРИ",
    "block C heading",
  );
  const iD = findLine(
    lines,
    (t) => t === "ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - НАТПРЕВАРИ",
    "block D heading",
  );
  const iE = findLine(
    lines,
    (t) => t === "ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - ГОЛОВИ",
    "block E heading",
  );
  const iRazno = findLine(lines, (t) => t === "РАЗНО", "the РАЗНО marker");
  const iF = findLine(
    lines,
    (t) => t.startsWith("БЕЛАСИЦА –"),
    "block F heading",
  );

  if (!(
    iA < iB &&
    iB < iC &&
    iC < iD &&
    iD < iE &&
    iE < iRazno &&
    iRazno < iF
  )) {
    throw new Error("the six blocks are not in the expected document order");
  }

  /* --- Block A --------------------------------------------------------- */
  const aSlice = lines.slice(iA, iB);
  const aColIndex = findLine(aSlice, IS_COLUMN_LINE, "block A column line");
  const seasonScorers = parseSeasonScorers(
    aSlice
      .slice(aColIndex + 1)
      .filter(({ text }) => !IS_BLOCK_RULE(text.trim())),
  );
  // His own sentence above the table, and his own column line — both belong to
  // him, so neither may be retyped at the call site.
  const seasonScorersIntro = aSlice[0].text.trim();
  const seasonScorersColumnLine = aSlice[aColIndex].text.trim();

  /* --- Blocks B–E ------------------------------------------------------ */
  const b = segmentRanked(lines.slice(iB, iC));
  const c = segmentRanked(lines.slice(iC, iD));
  const d = segmentRanked(lines.slice(iD, iE));
  const e = segmentRanked(lines.slice(iE, iRazno));

  const yugoslav = [b, c, d, e].map((block) => ({
    heading: block.heading,
    intro: block.intro,
    columnLine: block.columnLine,
    rows: parseRankedWithPeriod(block.rowLines),
    tail: block.tail,
    line: block.line,
  }));

  /* --- Block F --------------------------------------------------------- */
  const fSlice = lines.slice(iF);
  const fCols = fSlice
    .map((entry, i) => ({ entry, i }))
    .filter(({ entry }) => IS_COLUMN_LINE(entry.text));
  if (fCols.length !== 2) {
    throw new Error(
      `block F should hold exactly two tables, found ${fCols.length}`,
    );
  }

  const [appsCol, goalsCol] = fCols.map(({ i }) => i);

  // Everything above the first table's intro sentence is the narrative.
  const appsIntroIndex = appsCol - 1;
  const narrative = fSlice
    .slice(1, appsIntroIndex)
    .map(({ text }) => text.trim())
    .filter((t) => t !== "" && !IS_BLOCK_RULE(t));

  const isRow = ({ text }) => /^\d+\s*\./.test(text.trim());

  const appsBody = fSlice.slice(appsCol + 1, goalsCol - 1).filter(isRow);
  const goalsBody = fSlice.slice(goalsCol + 1).filter(isRow);

  // ⚠️ L209 — a bare `__________________________` sitting between rank 11 and
  // rank 12 of the appearances table. The author drew it; what he meant by it
  // is not stated anywhere in the document, so it is recorded here and in the
  // completion report and is NOT rendered. Drawing a divider on the page would
  // assert a grouping („the top eleven“) that he never wrote down.
  const dividerLines = fSlice
    .slice(appsCol + 1, goalsCol - 1)
    .filter(({ text }) => IS_BLOCK_RULE(text.trim()))
    .map(({ line }) => line);

  const macedonian = {
    heading: fSlice[0].text.trim(),
    narrative,
    appearances: {
      intro: fSlice[appsIntroIndex].text.trim(),
      columnLine: fSlice[appsCol].text.trim(),
      rows: parseRankedPlain(appsBody),
    },
    goals: {
      intro: fSlice[goalsCol - 1].text.trim(),
      columnLine: fSlice[goalsCol].text.trim(),
      rows: parseRankedPlain(goalsBody),
    },
    unrenderedDividerLines: dividerLines,
  };

  return {
    seasonScorers,
    seasonScorersIntro,
    seasonScorersColumnLine,
    yugoslav,
    macedonian,
  };
}

/* ------------------------------------------------------- author's counts */

/**
 * The author states a row count in three of his intro sentences. Each is
 * asserted against what actually parsed, so a silently dropped row is a build
 * failure rather than a quiet omission on the page.
 */
function assertAuthorCounts(data) {
  const checks = [
    [
      "Втора и трета — натпревари (his „следниве 30 играчи“)",
      data.yugoslav[1].rows.length,
      30,
    ],
    ["Втора — голови (his „Седум играчи“)", data.yugoslav[3].rows.length, 7],
    [
      "Прва македонска — над 60 настапи (his „следниве 25 играчи“)",
      data.macedonian.appearances.rows.length,
      25,
    ],
  ];
  const bad = checks.filter(([, got, want]) => got !== want);
  for (const [what, got, want] of checks) {
    console.log(
      `  ${got === want ? "✓" : "✗"} ${what}: ${got} rows, he says ${want}`,
    );
  }
  if (bad.length > 0)
    throw new Error(
      "a block's row count contradicts the author's own stated count",
    );
}

/* ------------------------------------------------------------------ emit */

const q = (s) => JSON.stringify(s);

function emitSeasonRow(row) {
  const scorers = row.scorers
    .map((s) => `{ player: ${q(s.player)}, goals: ${s.goals} }`)
    .join(", ");
  return `  { season: ${q(row.season)}, scorers: [${scorers}], note: ${
    row.note == null ? "null" : q(row.note)
  }, line: ${row.line} },`;
}

function emitRankedTable(table, indent = "  ") {
  const rows = table.rows
    .map(
      (r) =>
        `${indent}    { rank: ${r.rank}, name: ${q(r.name)}, period: ${
          r.period == null ? "null" : q(r.period)
        }, value: ${r.value}, line: ${r.line} },`,
    )
    .join("\n");
  return [
    `${indent}{`,
    `${indent}  heading: ${q(table.heading)},`,
    `${indent}  intro: [${table.intro.map(q).join(", ")}],`,
    `${indent}  columnLine: ${q(table.columnLine)},`,
    `${indent}  rows: [`,
    rows,
    `${indent}  ],`,
    `${indent}  tail: [${table.tail.map(q).join(", ")}],`,
    `${indent}  line: ${table.line},`,
    `${indent}},`,
  ].join("\n");
}

function emitPlainTable(table, indent = "    ") {
  const rows = table.rows
    .map(
      (r) =>
        `${indent}    { rank: ${r.rank}, name: ${q(r.name)}, period: null, value: ${r.value}, line: ${r.line} },`,
    )
    .join("\n");
  return [
    `${indent}{`,
    `${indent}  intro: ${q(table.intro)},`,
    `${indent}  columnLine: ${q(table.columnLine)},`,
    `${indent}  rows: [`,
    rows,
    `${indent}  ],`,
    `${indent}},`,
  ].join("\n");
}

function emit(data) {
  return `/**
 * Аце Стојанов's club statistics — the three sections added to \`/statistika\`
 * at Phase 3.34.
 *
 * ⚠️ GENERATED — DO NOT EDIT BY HAND. Written by
 * \`scripts/build-statistika-extra.mjs\` from \`data/book/statistika-source.md\`,
 * the verbatim transcription of \`data/book/sources/belasica-statistika-razno.docx\`
 * („БЕЛАСИЦА - статистика и разно“, Аце Стојанов). Regenerate with:
 *
 *     node scripts/build-statistika-extra.mjs
 *
 * and prove the committed copy is current with \`--check\`.
 *
 * ⚠️ **NOT EDITABLE IN STUDIO.** Like the „Разно“ chapters (D-3.16-2) and the
 * season tables (D-3.28), this content lives in the repo, so a correction Аце
 * wants is a code change and a deploy — not a Studio edit. That cost is on the
 * register in \`current-state.md\`.
 *
 * ⚠️ **EVERY FIGURE, NAME, PERIOD AND SENTENCE HERE IS HIS, VERBATIM.** Nothing
 * was corrected, expanded, reconciled or reordered. In particular:
 *
 *  - The seasons he has no scorer for carry an empty \`scorers\` array. They
 *    render as the season and a dash — never as a guess.
 *  - Names stay abbreviated as he wrote them („И. Чулев(ски)“), and are NOT
 *    linked to player pages: 82,7 % of book name strings are initial-and-
 *    surname, and matching on a surname asserts an identity the source does not
 *    (the same rule the squad tables follow — D-3.28-7, OV-63).
 *  - Periods stay as printed, two-digit spans („83-90“) beside four-digit ones.
 *  - Shared ranks are his. **Three of his rank numbers are internally
 *    inconsistent** and are carried unchanged rather than renumbered; they are
 *    listed as owed items in the 3.34 completion report.
 *  - His two-points-counted-as-three note travels with the narrative it
 *    qualifies. It is what keeps this block consistent with the season tables,
 *    which still show 1992/93 at 34 points. Neither was reconciled to the other.
 *
 * \`line\` is never rendered. It exists so any figure on the site can be traced
 * to one paragraph of the document — the same auditability rule
 * \`data/book/razno-source.md\` follows.
 *
 * **Server-only by construction.** \`/statistika\` is a server component, so
 * importing this costs the client nothing — provided no client component ever
 * imports it.
 *
 * **Nothing may import \`data/book/statistika-source.md\`.** That file is data,
 * not code; this module is its projection, and the two are tied together only
 * by the generator (D-3.16-2).
 */

/** One named scorer. A season the author left blank has none. */
export type SeasonScorer = {
  player: string;
  goals: number;
};

export type SeasonScorerRow = {
  /** Exactly as printed — including his trailing periods („1951.“). */
  season: string;
  /** Empty when he recorded no scorer. Two or more when he recorded a tie. */
  scorers: SeasonScorer[];
  /** His inline parenthetical, e.g. „фалат 6 извештаи“. */
  note: string | null;
  line: number;
};

export type RankedRow = {
  rank: number;
  name: string;
  /** Null in the Прва македонска лига tables, which print no period. */
  period: string | null;
  value: number;
  line: number;
};

export type RankedTable = {
  /** His own ALL-CAPS header. */
  heading: string;
  /** His intro paragraph(s), above the table. */
  intro: string[];
  /** His own column line — „Играч/период/голови“. */
  columnLine: string;
  rows: RankedRow[];
  /** „Понатаму следуваат: …“, and block E's two \`*\` footnotes. */
  tail: string[];
  line: number;
};

export type PlainRankedTable = {
  intro: string;
  columnLine: string;
  rows: RankedRow[];
};

export type MacedonianLeague = {
  heading: string;
  /** The 14-season aggregate and the three lines under it, verbatim. */
  narrative: string[];
  appearances: PlainRankedTable;
  goals: PlainRankedTable;
  /**
   * Source lines holding a bare rule the author drew inside the appearances
   * table (between rank 11 and rank 12). What he meant is not stated anywhere
   * in the document, so it is recorded and deliberately NOT rendered — drawing
   * it would assert a grouping he never wrote down.
   */
  unrenderedDividerLines: number[];
};

/** His own sentence introducing block A. */
export const SEASON_SCORERS_INTRO = ${q(data.seasonScorersIntro)};

/** His own column line for block A — the source of that table's headers. */
export const SEASON_SCORERS_COLUMN_LINE = ${q(data.seasonScorersColumnLine)};

/** Block A — his season-by-season top scorers, 1950 → 2025/26. */
export const SEASON_SCORERS: SeasonScorerRow[] = [
${data.seasonScorers.map(emitSeasonRow).join("\n")}
];

/** Blocks B–E — the four Yugoslav-league rankings, in his document order. */
export const YUGOSLAV_TABLES: RankedTable[] = [
${data.yugoslav.map((t) => emitRankedTable(t)).join("\n")}
];

/** Block F — independent Macedonia's top division. */
export const MACEDONIAN_LEAGUE: MacedonianLeague = {
  heading: ${q(data.macedonian.heading)},
  narrative: [
${data.macedonian.narrative.map((p) => `    ${q(p)},`).join("\n")}
  ],
  appearances:
${emitPlainTable(data.macedonian.appearances)}
  goals:
${emitPlainTable(data.macedonian.goals)}
  unrenderedDividerLines: [${data.macedonian.unrenderedDividerLines.join(", ")}],
};
`;
}

/* ------------------------------------------------------------------- run */

const data = build();

console.log(
  "Round-trip (parsed fields → source line, whitespace-insensitive):",
);
console.log(`  ${roundTrip.identical}/${roundTrip.checked} identical`);
if (roundTrip.failures.length > 0) {
  for (const f of roundTrip.failures) {
    console.error(
      `  ✗ L${f.line}\n    source: ${f.source}\n    parsed: ${f.got}`,
    );
  }
  process.exit(1);
}

console.log("The author's own stated counts:");
assertAuthorCounts(data);

console.log("Parsed:");
console.log(`  ${data.seasonScorers.length} seasons (block A)`);
console.log(
  `  ${data.yugoslav.map((t) => t.rows.length).join(" + ")} = ${data.yugoslav.reduce(
    (n, t) => n + t.rows.length,
    0,
  )} ranked rows (blocks B–E)`,
);
console.log(
  `  ${data.macedonian.appearances.rows.length} + ${data.macedonian.goals.rows.length} ranked rows (block F)`,
);

const next = emit(data);

if (CHECK) {
  const current = readFileSync(OUT, "utf8");
  if (current === next) {
    console.log(`\n✓ ${OUT} is current.`);
  } else {
    console.error(`\n✗ ${OUT} is STALE — re-run without --check.`);
    process.exit(1);
  }
} else {
  writeFileSync(OUT, next);
  console.log(`\n✓ wrote ${OUT}`);
}
