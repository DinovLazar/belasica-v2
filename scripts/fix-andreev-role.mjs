// scripts/fix-andreev-role.mjs
//
// Phase 3.14 — one-off role correction, owner-requested.
//
// Петар Андреев was never a club president (owner correction — Goran,
// 2026-08-07). Remove the `president` role, add `trainer`, keep `player`.
// Decision D-3.14-4.
//
//   node scripts/fix-andreev-role.mjs             # dry run — prints the plan, writes nothing
//   node scripts/fix-andreev-role.mjs --commit    # apply
//
// This is a CONTENT correction, not a schema or data-pipeline change. It is
// safe to run once and then forget: nothing in this repo writes `person.role`
// (`bios.mjs` sets `bio` + `legendRank`, `fill-season-content.mjs` sets
// `story`/`results`, `classify.mjs` classifies photo folders), so no later
// ingest can revert it.
//
// The correction does NOT move him between bands on /legendi. Placement is by
// highest-priority role, player > trainer > president (D-2.05-2), and he keeps
// `player` — so he stays under Играчи. What changes is his chips: Играч ·
// Претседател becomes Играч · Тренер, and his /legendi/petar-andreev page
// stops calling him Претседател.
//
// Guarantees:
//  • Idempotent. Re-running after a successful commit is a no-op that exits 0
//    — the doc is already in the target state, which is not an error.
//  • Fails loud and writes NOTHING if the document is not the one expected:
//    wrong name, or a role array that is neither the known before-state nor the
//    known after-state.
//  • Touches exactly one field on exactly one document. No transaction, no
//    batch, no other document is even fetched.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

/** The published document. Slug `petar-andreev`; there is no draft (checked
 *  below — the check needs a token, see NOTE at the call site). */
const DOC_ID = "f69a1977-1ddd-4201-8649-33187ad837c2";
const EXPECTED_NAME = "Петар Андреев";
const TARGET_ROLE = ["player", "trainer"];

/** Canonical order, so the written array is deterministic no matter what order
 *  the stored one happens to be in. Same order as `ROLE_PRIORITY` in
 *  `src/lib/people.ts` — the app sorts chips by it. */
const ROLE_ORDER = ["player", "trainer", "president"];

// ── .env.local loader (no dotenv dependency; same shape as ingest/bios.mjs) ──
function loadEnvLocal() {
  const p = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const m = raw.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, val] = m;
    if (process.env[key] === undefined) {
      process.env[key] = val.replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const argv = process.argv.slice(2);
const COMMIT = argv.includes("--commit");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET.");
  process.exit(1);
}
if (COMMIT && !token) {
  console.error("--commit needs SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token,
  useCdn: false,
  perspective: "published",
});

const fmt = (role) => JSON.stringify(role);
const sameRole = (a, b) =>
  Array.isArray(a) && a.length === b.length && a.every((v, i) => v === b[i]);

// ── fetch + guards ──────────────────────────────────────────────────────────
const doc = await client.fetch(
  /* groq */ `*[_id == $id][0]{ _id, name, role, "slug": slug.current }`,
  { id: DOC_ID },
);

if (!doc) {
  console.error(`Документот ${DOC_ID} не постои во ${dataset}.`);
  process.exit(1);
}
if (doc.name !== EXPECTED_NAME) {
  console.error(
    `Погрешен документ: очекувано име „${EXPECTED_NAME}", најдено „${doc.name}". Ништо не е запишано.`,
  );
  process.exit(1);
}

const before = Array.isArray(doc.role) ? doc.role : [];
console.log(`${doc.name}  (${doc.slug})  ${DOC_ID}`);

// Already corrected — a re-run, not a fault.
if (sameRole(before, TARGET_ROLE)) {
  console.log(
    `  улоги: ${fmt(before)} — веќе исправено, нема што да се смени.`,
  );
  process.exit(0);
}

// Anything other than the known before-state is unexpected: the document has
// been edited by someone else since this script was written, and blindly
// overwriting `role` could drop a role a human deliberately added.
if (!before.includes("president")) {
  console.error(
    `  улоги: ${fmt(before)} — не ја содржат „president" и не се целната состојба ${fmt(TARGET_ROLE)}.\n` +
      `  Документот е менуван во меѓувреме. Ништо не е запишано.`,
  );
  process.exit(1);
}

// `role` is a free string array in the schema, so a value outside the Studio
// list can exist. Reordering through ROLE_ORDER would silently drop it, so an
// unknown role stops the run instead of being thrown away.
const unknown = before.filter((r) => !ROLE_ORDER.includes(r));
if (unknown.length > 0) {
  console.error(
    `  непозната улога ${fmt(unknown)} во ${fmt(before)}. Ништо не е запишано.`,
  );
  process.exit(1);
}

const next = new Set(before);
next.delete("president");
next.add("trainer");
const after = ROLE_ORDER.filter((r) => next.has(r));

if (!sameRole(after, TARGET_ROLE)) {
  console.error(
    `  пресметаните улоги ${fmt(after)} не се ${fmt(TARGET_ROLE)}. Ништо не е запишано.`,
  );
  process.exit(1);
}

console.log(`  улоги: ${fmt(before)} → ${fmt(after)}`);

// NOTE: a draft would shadow this fix the moment anyone published it, so it is
// worth knowing about. Drafts are only readable WITH a token — an anonymous
// read returns nothing whether or not a draft exists, so on a token-less dry
// run this check is reported as inconclusive rather than as a pass.
if (token) {
  const draft = await client.fetch(
    /* groq */ `*[_id == $id][0]._id`,
    { id: `drafts.${DOC_ID}` },
    { perspective: "raw" },
  );
  if (draft) {
    console.error(
      `  Постои нацрт (${draft}). Тој би ја покрил исправката штом се објави. Ништо не е запишано.`,
    );
    process.exit(1);
  }
  console.log("  нацрт: нема");
} else {
  console.log("  нацрт: непроверено (проверката бара токен)");
}

if (!COMMIT) {
  console.log("\nПробно извршување. Ништо не е запишано. Додај --commit.");
  process.exit(0);
}

await client.patch(DOC_ID).set({ role: after }).commit({ visibility: "async" });

const written = await client.fetch(/* groq */ `*[_id == $id][0].role`, {
  id: DOC_ID,
});
if (!sameRole(written, TARGET_ROLE)) {
  console.error(`Запишано, но враќа ${fmt(written)}. Провери рачно.`);
  process.exit(1);
}
console.log(`Готово. Запишани улоги: ${fmt(written)}`);
