/**
 * Generates `src/content/season-tables.ts` from the tracked book extract
 * (`data/book/matches.json` + `data/book/seasons.json`), Phase 3.28.
 *
 * ⚠️ READ-ONLY. This script opens no Sanity client, holds no token and writes
 * nothing outside `src/content/season-tables.ts` and its report. It is the same
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
  // goals — 2025/26 among them, where the published prose reads „1. Трајков
  // Ѓорѓи (2004) 22+0/0" and carries both figures the extract lacks. Rendering
  // the table there would replace real numbers with two empty columns, which is
  // the drop this phase is forbidden to cause. So a statless squad is simply
  // not emitted, and the prose keeps the section (D-3.28-9).
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

const built = seasons
  .map((s) => buildSeason(s, bySeason.get(s.id) ?? []))
  // A season with neither structured matches nor a structured squad is not in
  // the module at all, so the page's lookup misses and the prose renders. The
  // switch is the absence of data, never a flag.
  .filter((s) => s.matchGroups.length > 0 || s.squad.length > 0)
  .sort((a, b) => a.slug.localeCompare(b.slug));

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
 * Every row here traces to one line of the book. The tracing field itself
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

const report = `# Покриеност — структурирани табели по сезона (Фаза 3.28)

⚠️ Генерирано од \`scripts/build-season-tables.mjs\`. Не се уредува рачно.

| Мерка | Вредност |
|---|---|
| Сезони во книгата | ${seasons.length} |
| Сезони во модулот | ${built.length} |
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
