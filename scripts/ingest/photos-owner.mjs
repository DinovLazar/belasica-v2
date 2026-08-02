// scripts/ingest/photos-owner.mjs
//
// Photographs handed over directly by the owner, one at a time — as opposed to
// the bulk Drive mirror that `run.mjs` walks. These are PUBLISHED on creation:
// they come from Ace's own archive, whose publishing rights are VERIFIED in
// `facts.md`, so the draft gate that holds the 2.09 Drive batch does not apply.
//
//   node scripts/ingest/photos-owner.mjs <manifest.json>            # dry run
//   node scripts/ingest/photos-owner.mjs <manifest.json> --commit
//
// The manifest is a JSON array; every entry needs `file`, `provenance`, and at
// most one of `personSlug` / `seasonSlug`:
//
//   [{ "file": "/abs/path.png", "caption": "…", "provenance": "…",
//      "personSlug": "marko-bozhinov" }]
//
// Document IDs are `photo-<sha1(basename)[0..16]>`, so re-running replaces the
// same document instead of adding a second copy of the same picture.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

function loadEnvLocal() {
  const p = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const m = raw.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const [manifestPath] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const COMMIT = process.argv.includes("--commit");
if (!manifestPath) {
  console.error(
    "Usage: node scripts/ingest/photos-owner.mjs <manifest.json> [--commit]",
  );
  process.exit(1);
}

const token = process.env.SANITY_API_WRITE_TOKEN;
if (COMMIT && !token) {
  console.error("--commit needs SANITY_API_WRITE_TOKEN in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token,
  useCdn: false,
  perspective: "published",
});

const entries = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const e of entries) {
  if (!e.file || !e.provenance) {
    console.error(
      `Every entry needs "file" and "provenance": ${JSON.stringify(e)}`,
    );
    process.exit(1);
  }
  if (!fs.existsSync(e.file)) {
    console.error(`Missing file: ${e.file}`);
    process.exit(1);
  }
}

// Resolve the references first, so a typo in a slug fails before any upload.
for (const e of entries) {
  if (e.personSlug) {
    e._person = await client.fetch(
      `*[_type=="person" && slug.current==$s][0]._id`,
      {
        s: e.personSlug,
      },
    );
    if (!e._person) {
      console.error(`No person with slug "${e.personSlug}".`);
      process.exit(1);
    }
  }
  if (e.seasonSlug) {
    e._season = await client.fetch(
      `*[_type=="season" && slug.current==$s][0]._id`,
      {
        s: e.seasonSlug,
      },
    );
    if (!e._season) {
      console.error(`No season with slug "${e.seasonSlug}".`);
      process.exit(1);
    }
  }
  e._id =
    "photo-" +
    crypto
      .createHash("sha1")
      .update(path.basename(e.file))
      .digest("hex")
      .slice(0, 16);
}

for (const e of entries) {
  const size = (fs.statSync(e.file).size / 1024).toFixed(0);
  console.log(
    `  ${e._id}  ${path.basename(e.file)} (${size} KB) → ` +
      `${e.personSlug ? `личност ${e.personSlug}` : `сезона ${e.seasonSlug}`}` +
      `${e.caption ? `  „${e.caption}“` : ""}`,
  );
}

if (!COMMIT) {
  console.log("\nПробно извршување. Ништо не е запишано. Додај --commit.");
  process.exit(0);
}

for (const e of entries) {
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(e.file),
    {
      filename: path.basename(e.file),
    },
  );
  const doc = {
    _id: e._id,
    _type: "photo",
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    provenance: e.provenance,
  };
  if (e.caption) doc.caption = e.caption;
  if (e.date) doc.date = e.date;
  if (e._person) doc.relatedPerson = { _type: "reference", _ref: e._person };
  if (e._season) doc.relatedSeason = { _type: "reference", _ref: e._season };
  await client.createOrReplace(doc);
  console.log(
    `  ✓ ${e._id}  ${asset.metadata?.dimensions?.width}×${asset.metadata?.dimensions?.height}`,
  );
}
console.log("Готово.");
