// scripts/ingest/verify-classify.mjs
//
// Pure unit check for classify() — needs NO mirror, NO Sanity, NO token. It
// asserts the five mappings the brief (Task 4) and the ingestion plan (§3) LOCK,
// plus representative thematic / skip / era / single-year / collision-prone
// cases, then prints a mapping table and a PASS/FAIL summary. Exits non-zero on
// any mismatch so it can gate CI or a pre-commit check.
//
//   node scripts/ingest/verify-classify.mjs
//
// This is the correctness evidence for the classifier while the source mirror is
// unavailable; the real dry-run report (Task 4) still requires the mirror.

import { classify } from "./classify.mjs";

// Expected results. `title` uses the Macedonian marks „…“ (U+201E / U+201C); the
// brief's table renders them as „…" — same glyph intent (see classify.mjs note).
const CASES = [
  // ── The five LOCKED mappings (brief Task 4) ──────────────────────────────
  { name: "1950/51", kind: "season", slug: "1950-51", title: "„Сезона 1950/51“", decade: 1950 },
  { name: "1999-2000", kind: "season", slug: "1999-2000", title: "„Сезона 1999/2000“", decade: 1990 },
  { name: "1942", kind: "season", slug: "1942", title: "„Сезона 1942“", decade: 1940 },
  { name: "1945-48 Илинден", kind: "season", slug: "1945-48", title: "„Беласица 1945–1948“", decade: 1940 },
  { name: "Листа на стрелци - не", kind: "skip" },

  // ── Plan §3.3 span examples ──────────────────────────────────────────────
  { name: "1985-86", kind: "season", slug: "1985-86", title: "„Сезона 1985/86“", decade: 1980 },
  { name: "1930-31", kind: "season", slug: "1930-31", title: "„Сезона 1930/31“", decade: 1930 },
  { name: "2025-26", kind: "season", slug: "2025-26", title: "„Сезона 2025/26“", decade: 2020 },
  // The existing published season — run.mjs marks it already-present by slug.
  { name: "1992-93", kind: "season", slug: "1992-93", title: "„Сезона 1992/93“", decade: 1990 },

  // ── Plan §3.5 era ranges (end − start > 1 → Беласица title, manual-title) ─
  { name: "1922-26", kind: "season", slug: "1922-26", title: "„Беласица 1922–1926“", decade: 1920 },
  { name: "1926-1930", kind: "season", slug: "1926-1930", title: "„Беласица 1926–1930“", decade: 1920 },

  // ── Plan §3.4 single years (manual-title) ────────────────────────────────
  { name: "1943", kind: "season", slug: "1943", title: "„Сезона 1943“", decade: 1940 },
  { name: "1950", kind: "season", slug: "1950", title: "„Сезона 1950“", decade: 1950 },

  // ── §3.2 thematic (numbered prefix or non-year start) ────────────────────
  { name: "009. Фудбалски легенди", kind: "thematic" },
  { name: "011. Treneri", kind: "thematic" },
  { name: "021. Стадион", kind: "thematic" },
  { name: "25.Спонзори", kind: "thematic" },
  { name: "15. Uefa natprevari", kind: "thematic" },
  { name: "000. Корица", kind: "thematic" },
  { name: "Куп на Македонија од 1992", kind: "thematic" },
  { name: "СТАТИСТИКА", kind: "thematic" },

  // ── §3.1 other skip ──────────────────────────────────────────────────────
  { name: "Sostavi mkd sport - не", kind: "skip" },

  // ── §3.6 fail-loud (starts with a year, no rule) ─────────────────────────
  { name: "1985_86", kind: "manual-review" },
];

let failures = 0;
const rows = [];

for (const c of CASES) {
  const got = classify(c.name);
  const checks = [];
  if (got.kind !== c.kind) checks.push(`kind ${got.kind}≠${c.kind}`);
  if (c.slug !== undefined && got.slug !== c.slug) checks.push(`slug ${got.slug}≠${c.slug}`);
  if (c.title !== undefined && got.title !== c.title) checks.push(`title ${got.title}≠${c.title}`);
  if (c.decade !== undefined && got.decade !== c.decade) checks.push(`decade ${got.decade}≠${c.decade}`);
  const ok = checks.length === 0;
  if (!ok) failures++;
  rows.push({
    ok,
    name: c.name,
    kind: got.kind,
    slug: got.slug ?? "—",
    title: got.title ?? "—",
    decade: got.decade ?? "—",
    note: ok ? "" : checks.join("; "),
  });
}

// Print a readable table.
const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("", 3) + pad("folder", 26) + pad("kind", 15) + pad("slug", 12) + pad("decade", 8) + "title / note",
);
console.log("-".repeat(96));
for (const r of rows) {
  console.log(
    pad(r.ok ? "ok" : "XX", 3) +
      pad(r.name, 26) +
      pad(r.kind, 15) +
      pad(r.slug, 12) +
      pad(r.decade, 8) +
      (r.ok ? r.title : `!! ${r.note}`),
  );
}
console.log("-".repeat(96));
console.log(`${rows.length - failures}/${rows.length} passed.`);

if (failures > 0) {
  console.error(`\nFAIL: ${failures} case(s) did not match the locked spec.`);
  process.exit(1);
}
console.log("PASS: classifier matches the locked ingestion-plan §3 mappings.");
