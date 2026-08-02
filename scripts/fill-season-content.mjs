#!/usr/bin/env node
/**
 * fill-season-content.mjs — populate `season.story` and `season.results` from the book.
 *
 * Source: data/book/season-content.json, generated verbatim from
 * „ФК Беласица – гордоста на Струмица" (Аце Стојанов, финална верзија 04.10.2025).
 *
 * NON-DESTRUCTIVE BY DESIGN. Every write is `setIfMissing`, so a season that already
 * has a story or results keeps exactly what it has. Re-running changes nothing.
 * No schema change: `story` and `results` are existing `block[]` fields on `season`.
 *
 * Usage:
 *   node scripts/fill-season-content.mjs                  # dry run, writes a report
 *   node scripts/fill-season-content.mjs --commit         # write to Sanity
 *   node scripts/fill-season-content.mjs --commit --only 1963-64,2001-02
 *   node scripts/fill-season-content.mjs --commit --field results
 *
 * Flags:
 *   --commit              actually write (default is dry run)
 *   --only <slugs>    comma-separated season slugs, for a pilot
 *   --field <name>    `story` | `results` | `both` (default both)
 *   --report <path>   report destination (default docs/ingestion/season-content-report.md)
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@sanity/client";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "data", "book", "season-content.json");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f8rmnfry";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const API_VERSION = "2026-07-15";

// ---------------------------------------------------------------- args
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d = null) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};
const COMMIT = has("--commit");
const ONLY = val("--only") ? val("--only").split(",").map((s) => s.trim()).filter(Boolean) : null;
const FIELD = val("--field", "both");
const REPORT = val("--report", path.join("docs", "ingestion", "season-content-report.md"));

if (!["both", "story", "results"].includes(FIELD)) {
  console.error(`--field must be one of: both, story, results (got "${FIELD}")`);
  process.exit(1);
}

// ---------------------------------------------------------------- token
function readEnvLocal() {
  const p = path.join(ROOT, ".env.local");
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
const env = readEnvLocal();
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;

if (COMMIT && !TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN not found in environment or .env.local — cannot commit.");
  process.exit(1);
}

// ---------------------------------------------------------------- portable text
const key = (...parts) =>
  "bk" + crypto.createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 12);

const toBlocks = (lines, slug, field) =>
  lines.map((text, i) => ({
    _type: "block",
    _key: key(slug, field, i, text),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(slug, field, "s", i, text), text, marks: [] }],
  }));

// ---------------------------------------------------------------- run
if (!fs.existsSync(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}
const src = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
});

const existing = await client.fetch(
  `*[_type=="season"]{ _id, "slug": slug.current, "hasStory": count(story) > 0, "hasResults": count(results) > 0 }`
);
const bySlug = new Map(existing.map((d) => [d.slug, d]));

const rows = [];
let patched = 0;

for (const [slug, entry] of Object.entries(src.seasons)) {
  if (ONLY && !ONLY.includes(slug)) continue;
  const doc = bySlug.get(slug);
  if (!doc) {
    rows.push({ slug, status: "НЕМА ДОКУМЕНТ", story: "-", results: "-", prov: "-" });
    continue;
  }

  const set = {};
  let storyNote = "-";
  let resultsNote = "-";

  if (FIELD !== "results") {
    if (doc.hasStory) storyNote = "постои, недопрено";
    else if (entry.story?.length) {
      set.story = toBlocks(entry.story, slug, "story");
      storyNote = `+${entry.story.length} пасуси`;
    } else storyNote = "нема во книгата";
  }

  if (FIELD !== "story") {
    if (doc.hasResults) resultsNote = "постои, недопрено";
    else if (entry.results?.length) {
      set.results = toBlocks(entry.results, slug, "results");
      resultsNote = `+${entry.results.length} реда`;
    } else resultsNote = "нема во книгата";
  }

  if (Object.keys(set).length === 0) {
    rows.push({ slug, status: "прескокнато", story: storyNote, results: resultsNote, prov: entry.resultsProvenance || "-" });
    continue;
  }

  if (COMMIT) {
    await client.patch(doc._id).setIfMissing(set).commit({ autoGenerateArrayKeys: false });
    await new Promise((r) => setTimeout(r, 120));
  }
  patched++;
  rows.push({ slug, status: COMMIT ? "запишано" : "би се запишало", story: storyNote, results: resultsNote, prov: entry.resultsProvenance || "-" });
}

// ---------------------------------------------------------------- report
const stamp = new Date().toISOString().slice(0, 19).replace("T", " ");
const lines = [
  `# Пополнување на приказни и резултати по сезони`,
  ``,
  `- Режим: **${COMMIT ? "ЗАПИШАНО ВО SANITY" : "проба (dry run) — ништо не е запишано"}**`,
  `- Поле: \`${FIELD}\``,
  `- Извор: ${src.source}`,
  `- Датасет: \`${PROJECT_ID}/${DATASET}\``,
  `- Изведено: ${stamp}`,
  `- Сезони обработени: ${rows.length}, променети: ${patched}`,
  ``,
  `Секој запис е \`setIfMissing\` — сезона што веќе има приказна или резултати останува недопрена.`,
  ``,
  `| Сезона | Статус | Приказна | Резултати | Потекло на резултатите |`,
  `|---|---|---|---|---|`,
  ...rows.map((r) => `| ${r.slug} | ${r.status} | ${r.story} | ${r.results} | ${r.prov} |`),
  ``,
];
fs.mkdirSync(path.dirname(path.join(ROOT, REPORT)), { recursive: true });
fs.writeFileSync(path.join(ROOT, REPORT), lines.join("\n"), "utf8");

console.log(`${COMMIT ? "Запишано" : "Проба"}: ${patched} од ${rows.length} сезони.`);
console.log(`Извештај: ${REPORT}`);
if (!COMMIT) console.log(`Ништо не е запишано. Додај --commit за вистински запис.`);
