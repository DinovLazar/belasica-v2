/**
 * One-time extraction: the 2025/26 season, from the PUBLISHED SANITY DOCUMENT
 * into `data/book/season-2025-26.json` (Phase 3.36).
 *
 * ⚠️ **This season is NOT from the book.** „ФК Беласица – гордоста на Струмица"
 * ends its match extract with spring 2025: `data/book/matches.json` holds
 * **0** matches for 2025/26, which is exactly why the 3.28 generator emits no
 * entry for it and the season page still renders Аце's prose (D-3.28-2).
 * The authoritative 2025/26 figures are the ones Аце supplied in August 2026
 * and which were entered into the season document's `results` and
 * `lineupAndStats`. This script reads those two prose fields and turns them
 * into the same row shapes the book extract uses, so
 * `scripts/build-season-tables.mjs` can merge them without learning anything
 * about Sanity.
 *
 * ⚠️ **READ-ONLY, and no token.** It hits the public query API of a
 * public-read dataset with `fetch` — the same URL a browser would get. There is
 * no Sanity client, no write path, no credential. The only file it writes is
 * its own output.
 *
 *     node scripts/extract-season-2025-26.mjs          # re-extract + write
 *     node scripts/extract-season-2025-26.mjs --check  # re-extract + diff (needs network)
 *
 * `--check` is NOT part of the build. The generator's `--check` is, and that
 * one is offline: it reads this script's committed OUTPUT, never this script.
 *
 * ## What is verbatim and what is derived
 * Verbatim, character for character: every team name, every scoreline, every
 * scorer name and figure, every player name, and both squad figures. The book's
 * own quirks ship untouched and so do these — „Спироски 12" in one match line
 * against „Спиркоски" in five others is Аце's text and is not corrected here
 * (D-3.36-4).
 *
 * Derived, and only this: `apps = starts + subs` on Аце's own two figures
 * (D-3.36-3), the home/away split and the W/D/L/goal totals that come straight
 * out of the scorelines — and those totals are ASSERTED against the season's
 * own `finalTable` row below, so a transcription slip fails the run instead of
 * shipping.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "data/book/season-2025-26.json");

const PROJECT_ID = "f8rmnfry";
const DATASET = "production";
const SLUG = "2025-26";
const SEASON_ID = "2025/26";

/** The league, as the prose's own opening line names it. */
const COMPETITION = "Втора македонска лига";
const CLUB = "Беласица";

const QUERY = `*[_type == "season" && slug.current == "${SLUG}"][0]{
  title, "slug": slug.current, results, lineupAndStats, finalTable
}`;

const API = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`;

/** Portable Text block → its plain text, joined and trimmed. Nothing else. */
const plain = (block) =>
  (block.children ?? [])
    .map((child) => child.text ?? "")
    .join("")
    .trim();

/**
 * „Спиркоски 20, 59, 75, Коцев 52, 65, Милушев 83, автогол 40"
 *   → [{player:"Спиркоски",minutes:[20,59,75]}, …, {player:"автогол",minutes:[40]}]
 *
 * A bare number continues the scorer before it; anything else opens a new one.
 * „автогол" is a scorer string here exactly as it is in the book, where 36
 * matches carry it — this script does not know it is not a person.
 *
 * ⚠️ The numbers are carried with **no unit attached**, which is the same
 * refusal D-3.28-5 records for the book: the prose prints „Дебрешлиоски 6" and
 * printing „6'" would assert a minute it does not state. `SeasonMatchScorer`
 * calls the field `minutes` and renders it as a bare figure; that field name is
 * the book's, and this extraction changes neither it nor the rendering.
 */
function parseScorers(text) {
  if (!text) return [];
  const scorers = [];
  for (const token of text.split(/\s*,\s*/)) {
    const piece = token.trim();
    if (!piece) continue;

    if (/^\d+$/.test(piece)) {
      if (scorers.length === 0) {
        throw new Error(`scorer figure with no name before it: „${text}"`);
      }
      scorers[scorers.length - 1].minutes.push(Number(piece));
      continue;
    }

    const withFigure = piece.match(/^(.+?)\s+(\d+)$/);
    if (withFigure) {
      scorers.push({
        player: withFigure[1].trim(),
        minutes: [Number(withFigure[2])],
      });
      continue;
    }

    scorers.push({ player: piece, minutes: [] });
  }
  return scorers;
}

/** „Охрид - Беласица 1:1 (Дебрешлиоски 6)" — or null if the line is not one. */
const MATCH_LINE = /^(.+?)\s+-\s+(.+?)\s+(\d+)\s*:\s*(\d+)\s*(?:\((.*)\)\s*)?$/;

/** „3. Милушев Александар (1988) 30+0/9" — or null if the line is not one. */
const SQUAD_LINE =
  /^(\d+)\.\s*(.+?)\s*\((\d{4})\)\s+(\d+)\s*\+\s*(\d+)\s*\/\s*(\d+)$/;

/** „Есенска полусезона:" → „Есенска полусезона". */
const PART_LINE = /^(.*полусезона)\s*:?\s*$/;

function extractMatches(blocks) {
  const matches = [];
  let phase = null;

  for (const block of blocks) {
    const line = plain(block);
    if (!line) continue;

    const part = line.match(PART_LINE);
    if (part) {
      // The trailing colon is the prose's list punctuation, not part of the
      // label — the book's own phase strings („Есенски дел 1988") carry none,
      // and the part header renders the string as-is (D-3.36-2).
      phase = part[1].trim();
      continue;
    }

    const m = line.match(MATCH_LINE);
    if (!m) continue; // the opening „…резултати и стрелци." line

    const [, homeTeam, awayTeam, homeGoals, awayGoals, scorerText] = m;
    const home = Number(homeGoals);
    const away = Number(awayGoals);
    const venue = homeTeam.trim() === CLUB ? "home" : "away";
    const belasicaGoals = venue === "home" ? home : away;
    const opponentGoals = venue === "home" ? away : home;

    matches.push({
      seasonId: SEASON_ID,
      order: matches.length + 1,
      date: null,
      month: null,
      competition: COMPETITION,
      competitionType: "league",
      phase,
      stage: null,
      round: null,
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      homeGoals: home,
      awayGoals: away,
      score: `${home}:${away}`,
      venue,
      opponent: (venue === "home" ? awayTeam : homeTeam).trim(),
      belasicaGoals,
      opponentGoals,
      result:
        belasicaGoals > opponentGoals
          ? "W"
          : belasicaGoals < opponentGoals
            ? "L"
            : "D",
      scorers: parseScorers(scorerText),
      notes: [],
      sourceLine: line,
    });
  }

  return matches;
}

function extractSquad(blocks) {
  const squad = [];
  const staffAndNotes = [];

  for (const block of blocks) {
    const line = plain(block);
    if (!line) continue;

    const m = line.match(SQUAD_LINE);
    if (!m) {
      // The two heading lines, „Стручен штаб:" and the four names under it,
      // „Претседател на клуб:" and the name under that. Kept in the file so the
      // extraction loses nothing the prose holds, even though the squad table
      // has no column for any of it — see the completion report for what the
      // table switch stops displaying.
      staffAndNotes.push(line);
      continue;
    }

    const [, no, name, birthYear, starts, subs, goals] = m;
    squad.push({
      no: Number(no),
      // Verbatim, birth year included — the prose's own header line reads
      // „Играч (година на раѓање) — старт+измена/голови", so the year is part
      // of how the row prints the player, exactly as the book keeps „(кап)"
      // inside the name string on 2024/25 (D-3.36-1).
      player: `${name.trim()} (${birthYear})`,
      birthYear: Number(birthYear),
      starts: Number(starts),
      subs: Number(subs),
      apps: Number(starts) + Number(subs),
      goals: Number(goals),
      sourceLine: line,
    });
  }

  return { squad, staffAndNotes };
}

// ------------------------------------------------------------------ run
const response = await fetch(API);
if (!response.ok) {
  throw new Error(`Sanity query API ${response.status} ${response.statusText}`);
}
const season = (await response.json()).result;
if (!season) throw new Error(`no published season with slug „${SLUG}"`);

const matches = extractMatches(season.results ?? []);
const { squad, staffAndNotes } = extractSquad(season.lineupAndStats ?? []);

// ----------------------------------------------------------- assertions
const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exit(1);
};

if (matches.length !== 30)
  fail(`expected 30 matches, parsed ${matches.length}`);
if (squad.length !== 35) fail(`expected 35 squad rows, parsed ${squad.length}`);

const homeCount = matches.filter((m) => m.venue === "home").length;
const awayCount = matches.filter((m) => m.venue === "away").length;
if (homeCount !== 15 || awayCount !== 15) {
  fail(`expected 15 home / 15 away, got ${homeCount} / ${awayCount}`);
}

const phases = [...new Set(matches.map((m) => m.phase))];
if (phases.length !== 2 || phases.some((p) => !p)) {
  fail(`expected both half-seasons, got ${JSON.stringify(phases)}`);
}

// The derived record must reproduce the season's own `finalTable` row exactly
// (D-3.30-3 built that row from these same 30 matches). A mismatch is a
// transcription error HERE — the table is not the thing to change.
const derived = {
  played: matches.length,
  wins: matches.filter((m) => m.result === "W").length,
  draws: matches.filter((m) => m.result === "D").length,
  losses: matches.filter((m) => m.result === "L").length,
  goalsFor: matches.reduce((n, m) => n + m.belasicaGoals, 0),
  goalsAgainst: matches.reduce((n, m) => n + m.opponentGoals, 0),
};

const row = (season.finalTable ?? []).find((r) =>
  /Беласица/.test(r.club ?? ""),
);
if (!row) fail("the season document carries no Беласица finalTable row");
for (const key of Object.keys(derived)) {
  if (derived[key] !== row[key]) {
    fail(
      `derived ${key} = ${derived[key]}, finalTable says ${row[key]} — fix the transcription, not the table`,
    );
  }
}

const payload = {
  // ⚠️ Provenance, and it is the point of this file: these rows are NOT from
  // the book. Anything that reads this file inherits that.
  provenance: {
    source: "sanity",
    projectId: PROJECT_ID,
    dataset: DATASET,
    documentSlug: SLUG,
    fields: ["results", "lineupAndStats"],
    note: "Од објавениот season документ во Sanity — внесен во август 2026 од материјалот на Аце Стојанов. НЕ е од книгата „ФК Беласица – гордоста на Струмица“: нејзиниот извадок завршува со пролетта 2025 и не содржи ниту еден натпревар од 2025/26.",
    extractedBy: "scripts/extract-season-2025-26.mjs",
    phase: "3.36",
  },
  seasonId: SEASON_ID,
  slug: SLUG,
  title: season.title ?? null,
  competition: COMPETITION,
  derivedRecord: derived,
  matchCount: matches.length,
  matches,
  squad,
  // Everything in `lineupAndStats` that is not a numbered player row.
  staffAndNotes,
};

const source = JSON.stringify(payload, null, 2) + "\n";

if (process.argv.includes("--check")) {
  if (readFileSync(OUT, "utf8") !== source) {
    console.error("✗ data/book/season-2025-26.json is STALE — re-extract it.");
    process.exit(1);
  }
  console.log("✓ data/book/season-2025-26.json matches the season document.");
  process.exit(0);
}

writeFileSync(OUT, source);

console.log(
  `✓ ${matches.length} matches (${homeCount} home / ${awayCount} away)`,
);
console.log(`  parts: ${phases.join(" · ")}`);
console.log(
  `  derived P${derived.played} W${derived.wins} D${derived.draws} L${derived.losses} ${derived.goalsFor}:${derived.goalsAgainst} — matches finalTable`,
);
console.log(
  `  ${squad.length} squad rows, ${staffAndNotes.length} other lines`,
);
console.log(`  → data/book/season-2025-26.json`);
