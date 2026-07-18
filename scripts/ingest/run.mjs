// scripts/ingest/run.mjs
//
// Phase 2.09 content ingestion — Drive mirror → Sanity. Reads the LOCAL mirror
// (never the Drive API), classifies every folder with classify() (plan §3),
// and — only with --commit — creates season shells (Wave 0) and uploads
// season-folder photos as DRAFTS (Waves 1–8). Dry run is the default and writes
// nothing.
//
//   node scripts/ingest/run.mjs                         # dry run, full report
//   node scripts/ingest/run.mjs --source <path>         # override mirror root
//   node scripts/ingest/run.mjs --commit --wave 0       # create season shells
//   node scripts/ingest/run.mjs --commit --wave 1       # upload 1920s–40s photos
//   node scripts/ingest/run.mjs --include-thematic      # also count/stage thematic
//
// Guarantees (brief Task 3):
//  • Deterministic, idempotent IDs — season "season-<slug>", photo
//    "drafts.photo-<sha1(relPath)>" — so an interrupted run RESUMES, never dupes.
//  • Photos are DRAFTS (drafts. id prefix). The script never publishes. The
//    public site reads perspective:"published" with no token, so drafts stay
//    invisible — the rights gate (plan §5) is enforced mechanically.
//  • Invents nothing: sets only slug/title/decade/relatedSeason/image/provenance.
//  • Slug collisions are surfaced, never overwritten (see COLLISION note below).

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import {
  classify,
  provenance,
  decadeToWave,
  WAVE_LABELS,
} from "./classify.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const IMAGE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif",
  ".tif", ".tiff", ".bmp", ".avif",
]);
const BATCH = 75; // transaction size (plan §4: 50–100)
const BATCH_DELAY_MS = 300; // gentle on the free-tier mutation limit
const DEFAULT_SOURCE = path.join(os.homedir(), "belasica-ingest-source");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── .env.local loader (no dotenv dependency) ─────────────────────────────────
// The script runs under plain Node, so Next's env loading does not apply. Read
// .env.local at the repo root for the Sanity connection + write token. Existing
// process.env values win (so CI/shell overrides still work).
function loadEnvLocal() {
  const p = path.join(REPO_ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const m = raw.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let [, key, val] = m;
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

// ── arg parsing ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { commit: false, includeThematic: false, source: null, wave: null, report: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--commit") args.commit = true;
    else if (a === "--dry-run") args.commit = false;
    else if (a === "--include-thematic") args.includeThematic = true;
    else if (a === "--source") args.source = argv[++i];
    else if (a === "--wave") args.wave = parseInt(argv[++i], 10);
    else if (a === "--report") args.report = argv[++i];
    else if (a === "--help" || a === "-h") args.help = true;
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

function expandHome(p) {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return path.resolve(p);
}

// ── mirror walk ──────────────────────────────────────────────────────────────
function listImagesRecursive(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase())) {
        out.push(full);
      }
    }
  }
  return out.sort();
}

function sha1(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

// Build the classified model of the whole mirror.
function scanMirror(sourceRoot) {
  const entries = fs.readdirSync(sourceRoot, { withFileTypes: true });
  const folders = [];
  const looseFiles = [];
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    if (e.isDirectory()) {
      const abs = path.join(sourceRoot, e.name);
      const cls = classify(e.name);
      const images = listImagesRecursive(abs);
      folders.push({ ...cls, abs, images });
    } else if (e.isFile()) {
      looseFiles.push(e.name);
    }
  }
  folders.sort((a, b) => a.folderName.localeCompare(b.folderName));
  return { folders, looseFiles };
}

// ── collision / already-present resolution ───────────────────────────────────
// COLLISION NOTE: Sanity's schema `isUnique` slug validation is a STUDIO-side
// check; it does NOT run on direct API writes. So the server will not reject a
// duplicate-slug create. The script therefore detects collisions ITSELF and
// refuses to create colliding docs — this is the fail-loud plan §3.7 intends,
// made real. Two kinds:
//   • intra-run collision  — two DIFFERENT folders derive the SAME slug → error,
//     neither is created; a human resolves it.
//   • already-present      — the derived slug already exists in Sanity (e.g. the
//     hand-entered „Сезона 1992/93", slug 1992-93) → skip, do not re-create.
function resolveSeasons(folders, existingSlugToId) {
  const seasons = folders.filter((f) => f.kind === "season");
  const bySlug = new Map();
  for (const s of seasons) {
    if (!bySlug.has(s.slug)) bySlug.set(s.slug, []);
    bySlug.get(s.slug).push(s);
  }
  const collisions = [];
  const alreadyPresent = [];
  const toCreate = [];
  for (const [slug, group] of bySlug) {
    if (group.length > 1) {
      collisions.push({ slug, folders: group.map((g) => g.folderName) });
      for (const g of group) g._status = "collision";
      continue;
    }
    const s = group[0];
    if (existingSlugToId.has(slug)) {
      s._status = "already-present";
      s._existingId = existingSlugToId.get(slug);
      alreadyPresent.push(s);
    } else {
      s._status = "to-create";
      toCreate.push(s);
    }
  }
  return { collisions, alreadyPresent, toCreate };
}

// ── report generation ────────────────────────────────────────────────────────
function buildReport({ mode, sourceRoot, folders, looseFiles, resolved, includeThematic, wave }) {
  const seasons = folders.filter((f) => f.kind === "season");
  const thematic = folders.filter((f) => f.kind === "thematic");
  const skipped = folders.filter((f) => f.kind === "skip");
  const manualReview = folders.filter((f) => f.kind === "manual-review");
  const { collisions, alreadyPresent, toCreate } = resolved;

  // images per decade wave (season folders only, excluding collision folders —
  // those are not created until a human resolves the slug clash, so their photos
  // are not uploaded either; counting them here would overstate the write).
  const imagesByWave = {};
  let seasonImageTotal = 0;
  for (const s of seasons) {
    if (s._status === "collision") continue;
    const w = decadeToWave(s.decade);
    imagesByWave[w] = (imagesByWave[w] || 0) + s.images.length;
    seasonImageTotal += s.images.length;
  }
  const thematicImageTotal = thematic.reduce((n, t) => n + t.images.length, 0);

  const L = [];
  const now = new Date().toISOString();
  L.push(`# Phase 2.09 — ${mode === "dry-run" ? "Dry-run" : "Run"} report`);
  L.push("");
  L.push(`- Generated: ${now}`);
  L.push(`- Mirror root: \`${sourceRoot}\``);
  L.push(`- Mode: **${mode}**${wave != null ? ` · wave ${wave} (${WAVE_LABELS[wave] ?? "?"})` : ""}`);
  L.push(`- Thematic photos: ${includeThematic ? "INCLUDED" : "excluded (counted only)"}`);
  L.push("");

  // ── TOP: collisions + unmatched (must be at the top, brief Task 4) ──
  L.push("## ⚠ Needs a human before any commit");
  L.push("");
  L.push(`### Slug collisions (${collisions.length})`);
  if (collisions.length === 0) {
    L.push("None — every derived season slug is unique.");
  } else {
    L.push("Two or more folders derive the same slug. **Neither is created** — resolve by hand.");
    L.push("");
    L.push("| slug | folders |");
    L.push("|---|---|");
    for (const c of collisions) L.push(`| \`${c.slug}\` | ${c.folders.map((f) => `\`${f}\``).join(" · ")} |`);
  }
  L.push("");
  L.push(`### Unmatched → manual-review (${manualReview.length})`);
  if (manualReview.length === 0) {
    L.push("None — every folder matched a plan §3 rule.");
  } else {
    L.push("Folders that begin with a year but matched no rule. **Never guessed at.**");
    L.push("");
    for (const m of manualReview) L.push(`- \`${m.folderName}\` — ${m.reason}`);
  }
  L.push("");

  // ── counts ──
  L.push("## Counts");
  L.push("");
  L.push("| Class | Folders |");
  L.push("|---|---|");
  L.push(`| Season | ${seasons.length} |`);
  L.push(`| — to create | ${toCreate.length} |`);
  L.push(`| — already present (skipped) | ${alreadyPresent.length} |`);
  L.push(`| — in a collision (skipped) | ${collisions.reduce((n, c) => n + c.folders.length, 0)} |`);
  L.push(`| Thematic | ${thematic.length} |`);
  L.push(`| Skipped (- не) | ${skipped.length} |`);
  L.push(`| Unmatched | ${manualReview.length} |`);
  L.push(`| **Total folders** | **${folders.length}** |`);
  L.push("");
  L.push("| Images | Count |");
  L.push("|---|---|");
  for (let w = 1; w <= 8; w++) {
    L.push(`| Wave ${w} — ${WAVE_LABELS[w]} | ${imagesByWave[w] || 0} |`);
  }
  L.push(`| **Season-folder images (Waves 1–8)** | **${seasonImageTotal}** |`);
  L.push(`| Thematic images (${includeThematic ? "will be staged" : "NOT uploaded"}) | ${thematicImageTotal} |`);
  L.push("");
  const photoDocs = includeThematic ? seasonImageTotal + thematicImageTotal : seasonImageTotal;
  L.push(`**Documents that would be created:** ${toCreate.length} season shells + ${photoDocs} photo drafts = **${toCreate.length + photoDocs}**.`);
  L.push("");

  // ── locked-mapping spot-check (brief Task 4) ──
  L.push("## Locked-mapping check (brief Task 4)");
  L.push("");
  L.push("| Folder | slug | title | decade | present? |");
  L.push("|---|---|---|---|---|");
  const findFolder = (name) => folders.find((f) => f.folderName === name);
  for (const name of ["1950/51", "1999-2000", "1942", "1945-48 Илинден", "Листа на стрелци - не", "1992-93"]) {
    const f = findFolder(name);
    if (!f) {
      L.push(`| \`${name}\` | — | *(not in mirror)* | — | — |`);
    } else if (f.kind === "season") {
      L.push(`| \`${name}\` | \`${f.slug}\` | ${f.title} | ${f.decade} | ${f._status} |`);
    } else {
      L.push(`| \`${name}\` | — | **${f.kind.toUpperCase()}** | — | — |`);
    }
  }
  L.push("");

  // ── every season, full detail ──
  L.push(`## Seasons (${seasons.length})`);
  L.push("");
  L.push("| Folder | slug | title | decade | wave | images | status | flags |");
  L.push("|---|---|---|---|---|---|---|---|");
  for (const s of [...seasons].sort((a, b) => a.slug.localeCompare(b.slug))) {
    L.push(
      `| \`${s.folderName}\` | \`${s.slug}\` | ${s.title} | ${s.decade} | ${decadeToWave(s.decade)} | ${s.images.length} | ${s._status ?? "?"} | ${(s.flags || []).join(", ") || "—"} |`,
    );
  }
  L.push("");

  // ── thematic ──
  L.push(`## Thematic (${thematic.length}) — no season shell; photos link to persons/galleries by hand`);
  L.push("");
  L.push("| Folder | images |");
  L.push("|---|---|");
  for (const t of thematic) L.push(`| \`${t.folderName}\` | ${t.images.length} |`);
  L.push("");

  // ── skipped ──
  L.push(`## Skipped — owner exclude "- не" (${skipped.length})`);
  L.push("");
  for (const s of skipped) L.push(`- \`${s.folderName}\``);
  L.push("");

  if (looseFiles.length) {
    L.push(`## Loose files at mirror root (${looseFiles.length}) — ignored (prose docs for the manual pass)`);
    L.push("");
    for (const f of looseFiles) L.push(`- \`${f}\``);
    L.push("");
  }

  return L.join("\n") + "\n";
}

function writeReport(reportPath, content) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, content, "utf8");
  console.log(`Report written: ${path.relative(REPO_ROOT, reportPath)}`);
}

// ── commit: Wave 0 (season shells) ───────────────────────────────────────────
async function commitWave0(writeClient, toCreate) {
  let created = 0;
  let batch = [];
  const flush = async () => {
    if (!batch.length) return;
    const tx = writeClient.transaction();
    for (const doc of batch) tx.createIfNotExists(doc);
    await tx.commit({ visibility: "async" });
    created += batch.length;
    batch = [];
    await sleep(BATCH_DELAY_MS);
  };
  for (const s of toCreate) {
    batch.push({
      _id: `season-${s.slug}`,
      _type: "season",
      title: s.title,
      slug: { _type: "slug", current: s.slug },
      decade: s.decade,
    });
    if (batch.length >= BATCH) await flush();
  }
  await flush();
  return created;
}

// ── commit: Waves 1–8 (season-folder photos, as drafts) ──────────────────────
async function commitPhotoWave(writeClient, sourceRoot, seasonsInWave) {
  let created = 0;
  let skipped = 0;
  let batch = [];
  const flush = async () => {
    if (!batch.length) return;
    const tx = writeClient.transaction();
    for (const doc of batch) tx.createIfNotExists(doc);
    await tx.commit({ visibility: "async" });
    batch = [];
    await sleep(BATCH_DELAY_MS);
  };
  for (const s of seasonsInWave) {
    for (const abs of s.images) {
      const relPath = path.relative(sourceRoot, abs).split(path.sep).join("/");
      const id = `drafts.photo-${sha1(relPath)}`;
      const existing = await writeClient.getDocument(id);
      if (existing) {
        skipped++;
        continue;
      }
      // Content-addressed asset upload (Sanity dedupes identical files by sha1).
      const asset = await writeClient.assets.upload("image", fs.readFileSync(abs), {
        filename: path.basename(abs),
      });
      batch.push({
        _id: id,
        _type: "photo",
        image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
        provenance: provenance(s.folderName),
        relatedSeason: { _type: "reference", _ref: `season-${s.slug}` },
      });
      created++;
      if (batch.length >= BATCH) await flush();
    }
  }
  await flush();
  return { created, skipped };
}

async function publishedPhotoCount(publicClient) {
  return publicClient.fetch('count(*[_type=="photo"])');
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 22).join("\n"));
    return;
  }
  loadEnvLocal();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f8rmnfry";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-15";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  const sourceRoot = expandHome(args.source) || DEFAULT_SOURCE;

  // Guard: the mirror must exist. Do NOT fall back to the Drive API (brief).
  if (!fs.existsSync(sourceRoot) || !fs.statSync(sourceRoot).isDirectory()) {
    console.error(
      `\nERROR: source mirror not found at:\n  ${sourceRoot}\n\n` +
        `The script reads the LOCAL mirror only — it never calls the Drive API.\n` +
        `Place the „Belasica 1922-2025" mirror there, or pass --source <path>.\n` +
        `Stop and report a missing/partial tree rather than working around it.\n`,
    );
    process.exit(1);
  }

  // Guard: writing needs a token — never fall back to an unauthenticated client.
  if (args.commit && !token) {
    console.error(
      `\nERROR: --commit requires SANITY_API_WRITE_TOKEN (Editor on ${dataset}).\n` +
        `Set it in .env.local (git-ignored). It is never committed or added to Vercel.\n`,
    );
    process.exit(1);
  }
  if (args.commit && args.wave == null) {
    console.error(`\nERROR: --commit requires --wave <0-8> (run one wave at a time).\n`);
    process.exit(1);
  }

  const publicClient = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
  const writeClient = token
    ? createClient({ projectId, dataset, apiVersion, useCdn: false, token })
    : null;

  // Existing season slugs (drafts + published if a token is available, else
  // published only) → so 1992-93 reads as already-present, not a collision.
  const slugClient = writeClient || publicClient;
  const existing = await slugClient.fetch(
    '*[_type=="season" && defined(slug.current)]{ "slug": slug.current, _id }',
  );
  const existingSlugToId = new Map();
  for (const r of existing) if (!existingSlugToId.has(r.slug)) existingSlugToId.set(r.slug, r._id);

  const { folders, looseFiles } = scanMirror(sourceRoot);
  const resolved = resolveSeasons(folders, existingSlugToId);

  console.log(
    `Scanned ${folders.length} folders: ` +
      `${resolved.toCreate.length} seasons to create, ` +
      `${resolved.alreadyPresent.length} already present, ` +
      `${resolved.collisions.length} collision(s), ` +
      `${folders.filter((f) => f.kind === "manual-review").length} unmatched.`,
  );

  // ── dry run: report only, write nothing ──
  if (!args.commit) {
    const reportPath = args.report
      ? path.resolve(args.report)
      : path.join(REPO_ROOT, "docs", "ingestion", "2.09-dry-run-report.md");
    const content = buildReport({
      mode: "dry-run",
      sourceRoot,
      folders,
      looseFiles,
      resolved,
      includeThematic: args.includeThematic,
      wave: args.wave,
    });
    writeReport(reportPath, content);
    if (resolved.collisions.length) {
      console.error(`\n⚠ ${resolved.collisions.length} slug collision(s) — see the report's top section.`);
    }
    console.log("\nDry run complete. Nothing was written to Sanity. Review the report before --commit.");
    return;
  }

  // ── commit ──
  if (resolved.collisions.length) {
    console.error(
      `\nERROR: ${resolved.collisions.length} slug collision(s) — refusing to write.\n` +
        `Resolve them (see the dry-run report) before committing.\n`,
    );
    process.exit(1);
  }

  if (args.wave === 0) {
    console.log(`Wave 0 — creating ${resolved.toCreate.length} season shells…`);
    const created = await commitWave0(writeClient, resolved.toCreate);
    console.log(`Wave 0 done: createIfNotExists issued for ${created} season shells (existing = no-op).`);
  } else {
    const seasonsInWave = folders.filter(
      (f) => f.kind === "season" && f._status !== "collision" && decadeToWave(f.decade) === args.wave,
    );
    const imgTotal = seasonsInWave.reduce((n, s) => n + s.images.length, 0);
    console.log(`Wave ${args.wave} (${WAVE_LABELS[args.wave]}) — ${seasonsInWave.length} seasons, ${imgTotal} source images…`);
    const { created, skipped } = await commitPhotoWave(writeClient, sourceRoot, seasonsInWave);
    console.log(`Wave ${args.wave} done: ${created} photo drafts created, ${skipped} already present (skipped).`);
  }

  // Gate check: nothing this script writes may be public.
  const pubCount = await publishedPhotoCount(publicClient);
  console.log(`\nPublished photo count (unauthenticated perspective): ${pubCount} — must be 8. ${pubCount === 8 ? "OK ✓" : "⚠ CHECK"}`);
}

main().catch((err) => {
  console.error("\nIngestion failed:", err?.message || err);
  process.exit(1);
});
