/**
 * Generates `src/content/season-tables.ts` from the tracked extracts, Phase
 * 3.28 — the book (`data/book/matches.json` + `data/book/seasons.json`) and,
 * since 3.36, one season that is not in the book at all.
 *
 * ⚠️ **Two inputs, two provenances.** The book's match extract ends with spring
 * 2025, so it holds 0 matches for 2025/26. That season's figures are Аце's own,
 * entered into the Sanity season document in August 2026 and extracted to
 * `data/book/season-2025-26.json` by `scripts/extract-season-2025-26.mjs`. That
 * file states its provenance in its own header field; this generator merges it
 * as a second input and changes nothing about the first (D-3.36-5).
 *
 * ⚠️ READ-ONLY, AND OFFLINE. This script opens no Sanity client, holds no
 * token, makes no network call, and writes nothing outside
 * `src/content/season-tables.ts` and its report. The 3.36 input does not change
 * that: the *extraction* fetched once and is committed; the generator reads the
 * committed JSON, so `--check` still passes on a machine with no network. It is the same
 * discipline `scripts/fill-season-content.mjs` follows, minus the write path
 * that one has: there is nothing here to `--commit`.
 *
 *   node scripts/build-season-tables.mjs          # write the module + report
 *   node scripts/build-season-tables.mjs --check  # verify the module is current
 *
 * `--check` regenerates in memory and diffs against the file on disk, so CI or
 * a reviewer can prove the committed module is exactly what the data yields.
 *
 * Nothing in `src/` may import `data/book/*.json` directly. That directory is
 * the archive of the extraction; this module is its projection, and the two are
 * tied together only here. Same rule `src/content/razno.ts` states for
 * `razno-source.md` (D-3.16-2).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/content/season-tables.ts");
const REPORT = join(ROOT, "docs/ingestion/season-tables-coverage.md");

const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

/**
 * Book season id → season slug in Sanity.
 *
 * The rule is „/" → „-", and it holds for 93 of the 96 seasons. These three do
 * not follow it and are listed rather than pattern-matched, because each is a
 * different reason and a clever regex would hide that: the book abbreviates a
 * four-year span, a wartime season is filed under its second year, and the
 * millennium rolls the century.
 */
const SLUG_EXCEPTIONS = {
  "1926/30": "1926-1930",
  "1943/44": "1944",
  "1999/00": "1999-2000",
};

const slugFor = (id) => SLUG_EXCEPTIONS[id] ?? id.replace(/\//g, "-");

/**
 * Which table a match belongs in.
 *
 * `competitionType` is `league` for every typed match in the extract and there
 * is no cup type at all, so grouping on it (or on the brief's assumed
 * „Првенство / Куп / Квалификации") would produce one group and call it a
 * category. `competition` is no better on its own: it holds 31 distinct *league
 * names*, so grouping by it alone is a no-op on most seasons.
 *
 * What genuinely separates a run of matches in this data is `stage` — the 53
 * qualification, playoff and final ties across 17 seasons. So: a match with a
 * stage is grouped by its stage; a match without one falls back to its
 * competition, which keeps a season that ran in two leagues in two tables.
 */
const groupTitle = (m) =>
  m.stage?.trim() || m.competition?.trim() || "Натпревари";

function buildSeason(bookSeason, matches) {
  const groups = [];
  const byTitle = new Map();

  for (const m of matches) {
    const title = groupTitle(m);
    let group = byTitle.get(title);
    if (!group) {
      group = { title, parts: [], _parts: new Map() };
      byTitle.set(title, group);
      groups.push(group);
    }

    // Есен / пролет comes from `phase` („Есенски дел 1988"), used verbatim
    // rather than normalised to „Есен" — the year in it is information, and it
    // is the book's own wording. A null phase collapses into one unlabelled
    // part, which is most of the older seasons.
    const label = m.phase?.trim() || null;
    let part = group._parts.get(label);
    if (!part) {
      part = { label, matches: [] };
      group._parts.set(label, part);
      group.parts.push(part);
    }

    part.matches.push({
      home: m.homeTeam ?? "",
      away: m.awayTeam ?? "",
      score: m.score ?? "",
      round: m.round ?? null,
      scorers: (m.scorers ?? []).map((s) => ({
        player: s.player,
        minutes: s.minutes ?? [],
      })),
    });
  }

  for (const g of groups) delete g._parts;

  const squad = (bookSeason.squad ?? []).map((p) => ({
    no: p.no ?? null,
    player: p.player,
    apps: p.apps ?? null,
    goals: p.goals ?? null,
  }));

  // ⚠️ A squad with no statistics is not „Состав и статистика", and shipping it
  // as one LOSES information. Ten seasons list a roster without appearances or
  // goals, and the guard is what keeps their richer prose on the page
  // (D-3.28-9).
  //
  // ⚠️ **3.36 depends on this line and does not weaken it.** The book's 2025/26
  // entry is a 26-name PRE-SEASON roster („Трајков Ѓорѓи 2004 голман" — birth
  // year and position, no настапи, no голови), superseded by Аце's final
  // 35-player list. This guard is the only thing that stops that stale roster
  // rendering, so it stays exactly as it was; the real 2025/26 squad arrives on
  // the separate input below and never passes through here.
  const hasStats = squad.some((p) => p.apps != null || p.goals != null);

  return {
    slug: slugFor(bookSeason.id),
    matchGroups: groups,
    squad: hasStats ? squad : [],
  };
}

const { matches } = read("data/book/matches.json");
const { seasons } = read("data/book/seasons.json");

const bySeason = new Map();
for (const m of matches) {
  if (!bySeason.has(m.seasonId)) bySeason.set(m.seasonId, []);
  bySeason.get(m.seasonId).push(m);
}

const fromBook = seasons
  .map((s) => buildSeason(s, bySeason.get(s.id) ?? []))
  // A season with neither structured matches nor a structured squad is not in
  // the module at all, so the page's lookup misses and the prose renders. The
  // switch is the absence of data, never a flag.
  .filter((s) => s.matchGroups.length > 0 || s.squad.length > 0);

/* ------------------------------------------------------------------ *
 * Second input — 2025/26, and only 2025/26 (Phase 3.36).
 *
 * `data/book/season-2025-26.json` is committed, states its own provenance, and
 * is the ONLY season here that does not come from the book. It is read exactly
 * like the book's own rows — `buildSeason` is not modified, and the season is
 * grouped and split into есен/пролет parts by the same rules as the other 92.
 *
 * ⚠️ The book must contribute NOTHING to this slug. If it ever did, two
 * different sources would be describing one season and the last writer would
 * win silently — the class of defect D-3.19-3 records. So it is asserted rather
 * than assumed: the run fails loudly instead of shipping a merge nobody chose.
 * ------------------------------------------------------------------ */
const supplement = read("data/book/season-2025-26.json");

const bookRowsForSupplement = fromBook.filter(
  (s) => s.slug === supplement.slug,
);
if (bookRowsForSupplement.length > 0) {
  console.error(
    `✗ the book extract now yields rows for „${supplement.slug}" — two sources ` +
      `for one season. Resolve which one is authoritative before regenerating.`,
  );
  process.exit(1);
}

const built = [
  ...fromBook,
  buildSeason(
    { id: supplement.seasonId, squad: supplement.squad },
    supplement.matches,
  ),
].sort((a, b) => a.slug.localeCompare(b.slug));

const HEADER = `/**
 * Structured season results and squads, Phase 3.28.
 *
 * ⚠️ GENERATED — DO NOT EDIT BY HAND. Written by
 * \`scripts/build-season-tables.mjs\` from \`data/book/matches.json\` and
 * \`data/book/seasons.json\`, the machine extract of „ФК Беласица – гордоста на
 * Струмица" (Аце Стојанов, финална верзија 04.10.2025). Regenerate with:
 *
 *     node scripts/build-season-tables.mjs
 *
 * and prove the committed copy is current with \`--check\`.
 *
 * ⚠️ **NOT EDITABLE IN STUDIO.** Like the „Разно" chapters (D-3.16-2), this
 * content lives in the repo, so a correction Аце wants is a code change and a
 * deploy — not a Studio edit. That cost is on the register in
 * \`current-state.md\`.
 *
 * ⚠️ **One season is not from the book: \`2025-26\`.** The book's match extract
 * ends with spring 2025 and holds zero matches for it. Its 30 results and its
 * 35-player squad come from the published Sanity season document, entered in
 * August 2026 from Аце's own material, and were extracted to
 * \`data/book/season-2025-26.json\` — which carries the provenance in the file —
 * by \`scripts/extract-season-2025-26.mjs\` (D-3.36-5). Every other season here
 * is the book's.
 *
 * Every book row traces to one line of the book. The tracing field itself
 * (\`sourceLine\`) is deliberately NOT carried into this module — it would
 * roughly double the bundle for a string no surface renders. It stays in
 * \`data/book/*.json\`, which is tracked, and the two are joined by
 * \`seasonId\`/\`order\` in the generator above.
 *
 * **Server-only by construction.** The season page is a server component, so
 * importing this costs the client nothing — provided no client component ever
 * imports it. Nothing here is a \`"use client"\` boundary, and the tables that
 * render it are server components too.
 */

export type SeasonMatchScorer = {
  player: string;
  /** Minutes as the book prints them. Empty when it prints a name only. */
  minutes: number[];
};

export type SeasonMatch = {
  home: string;
  away: string;
  /** The scoreline exactly as extracted — never recomputed from the goals. */
  score: string;
  /** Set on 12 of 2.267 matches. The column self-omits where it is absent. */
  round: number | null;
  scorers: SeasonMatchScorer[];
};

/** Есен / пролет within one competition, or a single unlabelled run. */
export type SeasonMatchPart = {
  label: string | null;
  matches: SeasonMatch[];
};

export type SeasonMatchGroup = {
  /** The stage („Финале", „Квалификации…") or, failing that, the competition. */
  title: string;
  parts: SeasonMatchPart[];
};

export type SeasonSquadRow = {
  /** Shirt number as the book lists it, where it lists one. */
  no: number | null;
  player: string;
  apps: number | null;
  goals: number | null;
};

export type SeasonTables = {
  slug: string;
  matchGroups: SeasonMatchGroup[];
  squad: SeasonSquadRow[];
};

const SEASON_TABLES: Record<string, SeasonTables> = `;

const FOOTER = `;

/**
 * The structured tables for a season, or null when the book holds none — which
 * is what makes the season page render Аце's prose instead. A season that gains
 * data later starts rendering a table on the next regeneration, with no change
 * to any component.
 */
export function seasonTablesFor(slug: string): SeasonTables | null {
  return SEASON_TABLES[slug] ?? null;
}
`;

const body = {};
for (const s of built) body[s.slug] = s;

const source = HEADER + JSON.stringify(body, null, 2) + FOOTER;

// ---------------------------------------------------------------- reporting
const withMatches = built.filter((s) => s.matchGroups.length > 0);
const withSquad = built.filter((s) => s.squad.length > 0);
const allSlugs = seasons.map((s) => slugFor(s.id));
const noMatches = allSlugs.filter(
  (slug) => !withMatches.some((s) => s.slug === slug),
);
const noSquad = allSlugs.filter(
  (slug) => !withSquad.some((s) => s.slug === slug),
);
const matchCount = withMatches.reduce(
  (n, s) =>
    n +
    s.matchGroups.reduce(
      (m, g) => m + g.parts.reduce((p, x) => p + x.matches.length, 0),
      0,
    ),
  0,
);
const roundCount = withMatches.reduce(
  (n, s) =>
    n +
    s.matchGroups.reduce(
      (m, g) =>
        m +
        g.parts.reduce(
          (p, x) => p + x.matches.filter((y) => y.round != null).length,
          0,
        ),
      0,
    ),
  0,
);

const supplementMatches = supplement.matches.length;

const report = `# Покриеност — структурирани табели по сезона (Фаза 3.28)

⚠️ Генерирано од \`scripts/build-season-tables.mjs\`. Не се уредува рачно.

⚠️ **Два извора.** Сите сезони освен една доаѓаат од извадокот на книгата.
Сезоната \`${supplement.slug}\` (${supplementMatches} натпревари, ${supplement.squad.length} играчи) доаѓа
од објавениот \`season\` документ во Sanity — внесен во август 2026 од материјалот
на Аце — бидејќи извадокот на книгата завршува со пролетта 2025 и не содржи ниту
еден натпревар од неа (Фаза 3.36).

| Мерка | Вредност |
|---|---|
| Сезони во книгата | ${seasons.length} |
| Сезони во модулот | ${built.length} |
| Од нив, надвор од книгата | 1 (\`${supplement.slug}\`) |
| Сезони со структурирани натпревари | ${withMatches.length} |
| Сезони со структуриран состав | ${withSquad.length} |
| Натпревари вкупно | ${matchCount} |
| Натпревари со „коло" | ${roundCount} |

## Сезони без структурирани натпревари (${noMatches.length})

${noMatches.map((s) => `- \`${s}\``).join("\n")}

## Сезони без структуриран состав (${noSquad.length})

${noSquad.map((s) => `- \`${s}\``).join("\n")}
`;

if (process.argv.includes("--check")) {
  const onDisk = readFileSync(OUT, "utf8");
  if (onDisk !== source) {
    console.error("✗ src/content/season-tables.ts is STALE — regenerate it.");
    process.exit(1);
  }
  console.log("✓ src/content/season-tables.ts matches the data.");
  process.exit(0);
}

writeFileSync(OUT, source);
writeFileSync(REPORT, report);

console.log(`✓ ${built.length} seasons → src/content/season-tables.ts`);
console.log(
  `  ${withMatches.length} with matches (${matchCount} matches, ${roundCount} with round)`,
);
console.log(`  ${withSquad.length} with squad`);
console.log(`  no matches: ${noMatches.length} → ${noMatches.join(", ")}`);
console.log(`  no squad:   ${noSquad.length} → ${noSquad.join(", ")}`);
