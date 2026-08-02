// scripts/ingest/bios.mjs
//
// Phase 3.12 — biographies + the all-time appearance ranking, book → Sanity.
//
// Reads `data/book/legends.json` (the machine-extracted chapters 9 and 10 of
// Ace Stojanov's book, with a `line` on every paragraph) and writes two fields
// on the matching `person` documents:
//
//   • `bio`         — the book's narrative, one Portable Text block per source
//                     paragraph, verbatim.
//   • `legendRank`  — the book's place on the all-time appearance list (1–80).
//
//   node scripts/ingest/bios.mjs              # dry run — prints the plan, writes nothing
//   node scripts/ingest/bios.mjs --commit     # apply
//   node scripts/ingest/bios.mjs --only <slug>[,<slug>…]
//
// Guarantees:
//  • Invents nothing. Every block is one paragraph of the book; the script has
//    no prose of its own and never summarises, merges or reorders.
//  • Idempotent. Block `_key`s are derived from the slug and the source line,
//    so a second run produces byte-identical documents.
//  • Writes the PUBLISHED document, not a draft — unlike the 2.09 photo
//    ingestion, whose drafts are gated on photo rights. Text from the club's
//    own history has no such gate, and a draft bio would be invisible on a
//    site that reads `perspective: "published"` with no token (D-1.04-2).
//  • Refuses to touch a person the book does not cover, and refuses to run at
//    all if any slug in the data file is missing from the dataset — a silent
//    partial write is how a roster drifts out of sync with its source.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DATA = path.join(REPO_ROOT, "data", "book", "legends.json");
const BATCH = 25;

// ── .env.local loader (no dotenv dependency; same shape as run.mjs) ──────────
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
const onlyArg = argv[argv.indexOf("--only") + 1];
const ONLY =
  argv.includes("--only") && onlyArg
    ? new Set(onlyArg.split(",").map((s) => s.trim()))
    : null;

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

/** A stable key: same slug + same source line ⇒ same key, run after run. */
const keyFor = (slug, line) =>
  crypto
    .createHash("sha1")
    .update(`${slug}:${line}`)
    .digest("hex")
    .slice(0, 12);

// Roughly a comfortable screen paragraph. Several of the book's entries are a
// single unbroken 2,000–3,000 character block — printable, unreadable on a
// phone — so a paragraph over this length is re-broken at sentence boundaries
// (D-3.12-4). Only the line breaks change: no word is added, removed, reworded
// or reordered, and the source paragraph stays one record in `legends.json`.
const MAX_PARAGRAPH = 900;

/** Sentence-end that is really a sentence end: not „г.", not „1982.", not an
 *  initial like „П. Георгиев". */
const SENTENCE_END = /(?<=[^\s.][.!?…])\s+(?=[«„("]?[А-ШЅЈЉЊЌЏЃЖЧ])/u;

function reflow(text) {
  if (text.length <= MAX_PARAGRAPH) return [text];
  const sentences = text.split(SENTENCE_END);
  const chunks = [];
  let buf = "";
  for (const s of sentences) {
    const next = buf ? `${buf} ${s}` : s;
    // Break once the chunk is long enough AND adding this sentence would push
    // it past the target — so chunks land just under, not just over.
    if (buf && next.length > MAX_PARAGRAPH) {
      chunks.push(buf);
      buf = s;
    } else {
      buf = next;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

/** One source paragraph → one or more Portable Text blocks. No marks, no
 *  styles: the book's paragraphs carry no emphasis, and inventing some would
 *  be editing. */
function toBlocks(slug, paragraphs) {
  const blocks = [];
  for (const p of paragraphs) {
    reflow(p.text).forEach((text, i) => {
      const key = keyFor(slug, `${p.line}:${i}`);
      blocks.push({
        _type: "block",
        _key: key,
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
      });
    });
  }
  return blocks;
}

const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
const people = data.people.filter((p) => !ONLY || ONLY.has(p.slug));

const existing = await client.fetch(
  `*[_type == "person" && slug.current in $slugs]{ _id, name, "slug": slug.current }`,
  { slugs: people.map((p) => p.slug) },
);
const byslug = new Map(existing.map((d) => [d.slug, d]));

const missing = people.filter((p) => !byslug.has(p.slug));
if (missing.length > 0) {
  console.error(
    `Не постојат во Sanity (${missing.length}): ${missing.map((m) => m.slug).join(", ")}`,
  );
  process.exit(1);
}

const plan = people.map((p) => {
  const doc = byslug.get(p.slug);
  const blocks = p.bio.length > 0 ? toBlocks(p.slug, p.bio) : null;
  const chars = p.bio.reduce((n, b) => n + b.text.length, 0);
  return {
    id: doc._id,
    name: doc.name,
    slug: p.slug,
    rank: p.legendRank,
    blocks,
    chars,
  };
});

console.log(
  `${plan.length} лица · ${plan.filter((p) => p.blocks).length} со биографија · ` +
    `${plan.filter((p) => p.rank != null).length} со ранг · ` +
    `${plan.reduce((n, p) => n + p.chars, 0).toLocaleString("mk")} знаци`,
);
for (const p of plan) {
  console.log(
    `  ${String(p.rank ?? "—").padStart(3)}  ${p.slug.padEnd(34)} ` +
      `${p.blocks ? `${p.blocks.length} пасуси, ${p.chars} знаци` : "(само ранг)"}`,
  );
}

if (!COMMIT) {
  console.log("\nПробно извршување. Ништо не е запишано. Додај --commit.");
  process.exit(0);
}

let written = 0;
for (let i = 0; i < plan.length; i += BATCH) {
  const tx = client.transaction();
  for (const p of plan.slice(i, i + BATCH)) {
    const set = {};
    if (p.blocks) set.bio = p.blocks;
    if (p.rank != null) set.legendRank = p.rank;
    tx.patch(p.id, { set });
  }
  await tx.commit({ visibility: "async" });
  written += Math.min(BATCH, plan.length - i);
  console.log(`  запишани ${written}/${plan.length}`);
}
console.log("Готово.");
