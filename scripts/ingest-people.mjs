/**
 * Fill Belasica person documents (presidents / trainers) with a portrait and a
 * full biography harvested from Ace's Facebook posts.
 *
 * Dry run by default. Pass --commit to actually write.
 *   node ingest-people.mjs data/presidents.json
 *   node ingest-people.mjs data/presidents.json --commit
 *
 * Follows the same conventions as scripts/fill-season-content.mjs in the repo:
 * hand-rolled .env parsing, no dotenv, explicit --commit gate.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const PROJECT_ID = "f8rmnfry";
const DATASET = "production";
const API_VERSION = "2026-07-15";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PHOTO_DIR = path.join(ROOT, "photos");
const ENV_FILE = "/mnt/user-data/uploads/belasica-v2/.env.local";

const args = process.argv.slice(2);
const COMMIT = args.includes("--commit");
const dataFile = args.find((a) => a.endsWith(".json"));
if (!dataFile) {
  console.error("Usage: node ingest-people.mjs <data.json> [--commit]");
  process.exit(1);
}

function readEnvLocal() {
  if (!fs.existsSync(ENV_FILE)) return {};
  const out = {};
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = readEnvLocal();
const TOKEN = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;
if (COMMIT && !TOKEN) {
  console.error("SANITY_API_WRITE_TOKEN not found — cannot commit.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: TOKEN,
});

/** Plain paragraphs -> Portable Text blocks. */
function toPortableText(paragraphs) {
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `b${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `b${i}s0`, text, marks: [] }],
  }));
}

const people = JSON.parse(fs.readFileSync(path.join(ROOT, dataFile), "utf8"));

console.log(
  `\n${COMMIT ? "COMMIT" : "DRY RUN"} — ${people.length} person record(s)\n`,
);

for (const p of people) {
  const doc = await client.getDocument(p.id);
  if (!doc) {
    console.log(`  ✗ ${p.name} — document ${p.id} NOT FOUND, skipping`);
    continue;
  }

  const photoPath = path.join(PHOTO_DIR, p.photo);
  if (!fs.existsSync(photoPath)) {
    console.log(`  ✗ ${p.name} — photo missing at ${photoPath}, skipping`);
    continue;
  }

  const existingPhotos = await client.fetch(
    `count(*[_type == "photo" && relatedPerson._ref == $id])`,
    { id: p.id },
  );

  const bytes = fs.statSync(photoPath).size;
  console.log(`  ${p.name}  (${p.id})`);
  console.log(
    `      bio      : ${p.bio ? `${p.bio.length} paragraphs` : "KEPT (photo only)"}`,
  );
  console.log(`      photo    : ${p.photo} (${Math.round(bytes / 1024)} KB)`);
  console.log(`      existing : ${existingPhotos} photo doc(s)`);
  console.log(`      years    : ${p.playingYears ?? "—"}`);

  if (!COMMIT) {
    console.log("      -> would upload asset, create photo doc, patch person\n");
    continue;
  }

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(photoPath),
    { filename: p.photo },
  );

  const photoDoc = await client.create({
    _type: "photo",
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    caption: p.caption,
    provenance: `Од официјалната Facebook страница на ФК Беласица — ${p.source}. Објавено од Ace Stojanov; користено со негова согласност.`,
    date: p.date,
    relatedPerson: { _type: "reference", _ref: p.id },
  });

  // Adding a role must not drop the roles already on the document.
  const role =
    p.addRole && !(doc.role ?? []).includes(p.addRole)
      ? [...(doc.role ?? []), p.addRole]
      : undefined;

  await client
    .patch(p.id)
    .set({
      ...(p.bio ? { bio: toPortableText(p.bio) } : {}),
      ...(p.playingYears ? { playingYears: p.playingYears } : {}),
      ...(role ? { role } : {}),
    })
    .commit({ visibility: "async" });

  if (role) console.log(`      -> role now ${role.join(", ")}`);

  console.log(`      -> asset ${asset._id}`);
  console.log(`      -> photo ${photoDoc._id}`);
  console.log(`      -> person patched\n`);
}

console.log(COMMIT ? "Done — committed.\n" : "Done — dry run, nothing written.\n");
