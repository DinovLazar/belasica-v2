# Part 2 · Phase 09 · Code — Completion Report

> ⚠️ **Phase partially complete — the ingestion waves are blocked.** The source mirror the script reads (`~/belasica-ingest-source/`) does **not** exist on this machine, so Tasks 4–8 (dry run, Wave 0, Waves 1–8, and the OV-4/OV-7 content transcription) could not run. Per the brief's Source-material rule, the mirror was **not** worked around: no Drive-API fallback, no fabricated tree. Every mirror-independent task was completed; the ingestion itself is owed to a follow-up run (D-2.09-3). Lazar chose „build the non-blocked work now" when the blocker was surfaced.

**Date:** 2026-07-18 · **Executor:** Claude Code (Phase 2.09, Lazar's machine) · **Outcome (one line):** the ingestion script is built, spec-verified, and ready to run; the 2.05 documentation gap is closed; only the mirror + a write token stand between here and ~74 seasons + ~915 photo drafts.

## 1. What shipped (plain language)

A deterministic, resumable, dry-run-first ingestion script (`scripts/ingest/`) that turns the Drive mirror into Sanity content — season shells + photo **drafts** — with the folder→season rules from `content-ingestion-plan.md` §3 baked in and verified against the locked mappings. It has **not** been run against real content because the mirror is missing. Separately, the long-standing 2.05 documentation gap is closed: `D-2.05-1/-2/-3` are back-filled and a 2.05 completion report is filed, so the dangling references across the repo now resolve.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by the executor:**
- ✅ **Branch `phase-2.09-content-ingestion` cut from up-to-date `main`; no other phase branch unmerged.** Evidence: `git pull` „Already up to date"; `git branch --no-merged main` empty.
- ✅ **Ingestion script exists under `scripts/ingest/`, plain Node ESM, runs. Dry run default; writing requires `--commit`.** Evidence: `classify.mjs` + `run.mjs` + `verify-classify.mjs`; a dry run against a synthetic mirror produced a full report and wrote nothing to Sanity.
- ✅ **`SANITY_API_WRITE_TOKEN` read from the environment, exits clearly when unset on `--commit`, appears nowhere in the diff; `.env.example` documents it empty.** Evidence: `--commit` without the token → „ERROR: --commit requires SANITY_API_WRITE_TOKEN … exit 1"; a grep of the diff finds only the variable *name* (empty `.env.example` key + code references), no value.
- ✅ **At most one new dependency (`@sanity/client`, devDependency, exact pin 7.23.1) — recorded in `00_stack-and-config.md`.** Evidence: `package.json` devDependencies; `npm ls @sanity/client` dedupes to the tree's 7.23.1; stack log appended.
- ❌ **Dry-run report committed at `docs/ingestion/2.09-dry-run-report.md`** — **BLOCKED: mirror missing.** In its place: `2.09-classifier-verification.md` (the pure classifier proof) is committed, and `README.md` documents the pending report + the run procedure.
- ⚠️ **The five locked mappings appear exactly as specified; `1992-93` already-present.** Proven **without** the archive: `verify-classify.mjs` asserts all five (`1950/51`→`1950-51`/„Сезона 1950/51“/1950, `1999-2000`, `1942`, `1945-48 Илинден`→„Беласица 1945–1948“, and the `- не` skip) — 23/23 pass; a synthetic-mirror dry run confirmed `1992-93` resolves to **already-present** against live Sanity, not a collision. The real per-folder dry-run report over the archive is owed once the mirror lands.
- ❌ **Wave 0 (season shells)** — **BLOCKED: mirror missing.**
- ❌ **Waves 1–8 (photos by decade)** — **BLOCKED: mirror missing.**
- ✅ **An unauthenticated GROQ read returns exactly 8 published photos.** Evidence: `count(*[_type=="photo"])` against `f8rmnfry.apicdn.sanity.io` → **8**. Query used: `curl -s 'https://f8rmnfry.apicdn.sanity.io/v2026-07-15/data/query/production?query=count(*%5B_type%3D%3D%22photo%22%5D)'`. Nothing was ingested, so this is trivially unchanged; the script only ever creates **drafts**, so this stays 8 through the waves too (the script prints and checks it after each commit wave).
- ✅ **No thematic-folder photo uploaded; thematic classified/counted only.** By design — `--include-thematic` defaults off, and no wave ran at all.
- ⚠️ **Re-running a completed wave creates zero new documents (idempotency).** Demonstrated **by construction** — deterministic IDs (`season-<slug>`, `drafts.photo-<sha1(relPath)>`) + `createIfNotExists` + a per-photo `getDocument` skip — and exercised via the synthetic mirror's already-present detection. Not demonstrated against the real archive (blocked).
- ❌ **Final run report + editorial hand-off** (`2.09-run-report.md`, `2.09-editorial-handoff.md`) — **BLOCKED: mirror missing.**
- ✅ **OV-4 / OV-7: both remain open, reason stated, nothing invented.** The single season final table and single player career total (Task 8) are transcribed from the **15 prose documents in the mirror** — which is absent. No figure could be sourced, so none was entered (content-truth). OV-4 and OV-7 stay open; they clear in the follow-up run alongside the waves. This is the „leave open with the reason stated" branch the brief permits.
- ✅ **`D-2.05-1`, `D-2.05-2`, `D-2.05-3` exist in `decisions.md`, marked back-filled; `Part-2-Phase-05-Completion.md` filed.** Evidence: three appended entries + the report.
- ✅ **`D-2.09-*` logged, incl. the verification-gate waiver (D-2.09-1) and the 2.09-before-2.08 reorder (D-2.09-2).** Seven entries D-2.09-1…-7.
- ✅ **No file under `src/app/`, `src/components/`, `src/sanity/schemaTypes/`, `brand.md` or `globals.css` changed.** Evidence: `git status` filtered on those paths → clean.
- ✅ **`npm run build` and `npm run lint` clean.** Evidence: both exit 0; the `.mjs` script is outside the Next build graph.
- ⚠️ **`current-state.md` updated; `file-map.md` synced; completion filed.** Done — but the `NEXT:` line is set to finish 2.09's blocked waves **before** 2.08, not straight to `2.08` (the brief's Task 11 target presumed 2.09 completed; it did not — see §4).
- ⚠️ **PR opened; Vercel preview loads; routes 200.** The work is committed on the branch; opening/merging the PR is deferred to Lazar's call given the phase is mid-flight (no runtime change ships, so all six routes remain 200 — the build prerenders `/`, `/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt`).

**Owed to Lazar (goes on the owed-verification register):**
- **Place the mirror + create the write token, then run the ingestion.** `~/belasica-ingest-source/` with the „Belasica 1922-2025" tree, and a Sanity **Editor** token in `.env.local` as `SANITY_API_WRITE_TOKEN=`. Then: `node scripts/ingest/run.mjs` (dry run → review report) → `--commit --wave 0` → `--commit --wave 1..8`. Procedure + checks in `docs/ingestion/README.md`.
- **Spot-check ~10 ingested season pages against their source folders** (single years, era ranges, labelled folders) — the mapping is deterministic but „right" for ambiguous folders needs a human eye.
- **Every `manual-review` folder** needs a human decision (the dry run surfaces them).
- **The slash-folder representation in the mirror is unverified** (D-2.09-7): `classify()` accepts `/ ／ ⁄` but not underscore; if the mirror sanitises `/` to a character not in that set, those folders fail loud to manual-review and one line of `RE_SPAN` needs the real separator added.
- **OV-6 remains open and is now higher-stakes** — `siteSettings.footerUnofficialArchiveText` holds unverified copy contradicting the VERIFIED footer string; it looks authoritative in Studio to whoever will curate ~74 new seasons there.
- **The photo-rights caveat.** This phase treats rights as UNVERIFIED (the stricter reading) — every ingested photo stays a draft. Nothing may be published until the screenshot-provenance specifics are settled with Ace, ideally in writing.

## 3. Decisions I made during this phase

All logged in `decisions.md` (D-2.09-1…-7). One line each:

| ID | Decision | Rejected alternative | logged |
|---|---|---|---|
| **D-2.09-1** | Verification-gate waiver — ingestion proceeds with the register at 4 open items (owner) | An ops verification phase first | yes |
| **D-2.09-2** | Phase order — 2.09 before 2.08 (owner) | Finalize the homepage against the 8 demo docs | yes |
| **D-2.09-3** | Mirror absent → execute the mirror-independent tasks, report Tasks 4–8 blocked; no Drive-API fallback, no fabricated tree | Fall back to the Drive API; stub a partial tree; do nothing | yes |
| **D-2.09-4** | Generated titles use „…“ marks (brief's locked table); the one hand-entered `Сезона 1992/93` (no marks) is left untouched, flagged for the curator | Match the no-marks style; rewrite the existing doc | yes |
| **D-2.09-5** | `@sanity/client` pinned to 7.23.1 (the tree's resolved version), not npm-latest 7.23.2 | Pin latest; import via `next-sanity` | yes |
| **D-2.09-6** | Slug-collision detection is done in the script — Sanity's `isUnique` is Studio-only and does not run on API writes | Rely on the server to reject (the plan's literal instruction) | yes |
| **D-2.09-7** | Span separator accepts `/ ／ ⁄` but not underscore; unknown separators fail loud | Accept only literal `-`/`/`; also accept underscore | yes |

## 4. Deviations from the brief

- **Tasks 4–8 not run (mirror missing).** The single largest deviation; fully explained in D-2.09-3 and §2. The script is built and exercised at every path reachable without the mirror.
- **`NEXT:` line is not set straight to `2.08`.** The brief's Task 11 says set `NEXT: 2.08 — Homepage finalization`, but that presumes 2.09 closed. It did not — the ingestion waves are the actual next work — so `current-state.md` follows the code and points at finishing 2.09 first, then 2.08. Stated here rather than silently following the brief against reality.
- **The plan §3.7 „schema rejects a duplicate slug" premise is factually wrong for API writes** — corrected in the script (D-2.09-6). The fail-loud is preserved, just script-side.

## 5. Changed files / deliverables

- **New — `scripts/ingest/`:** `classify.mjs` (pure §3 classifier + provenance/wave helpers), `run.mjs` (walker/writer/reporter), `verify-classify.mjs` (locked-mapping self-test, 23/23 pass).
- **New — `docs/ingestion/`:** `README.md` (procedure + mirror-missing status), `2.09-classifier-verification.md` (the classifier proof). The three run reports are **pending the mirror**.
- **New — `src/_project-state/completions/`:** `Part-2-Phase-05-Completion.md` (back-fill), `Part-2-Phase-09-Completion.md` (this).
- **Edited:** `.env.example` (added empty `SANITY_API_WRITE_TOKEN=` + comment), `package.json` / `package-lock.json` (`@sanity/client@7.23.1` devDependency), `src/_project-state/decisions.md` (D-2.05-1/-2/-3 back-fill + D-2.09-1…-7), `00_stack-and-config.md` (dep entry), `file-map.md` (sync), `current-state.md` (snapshot).
- **Secrets:** none committed. The write token is **not** valued anywhere — documented empty in `.env.example`; the real value belongs only in `.env.local` (git-ignored), placed by Lazar, never on Vercel.
- Branch `phase-2.09-content-ingestion`. PR: deferred to Lazar's call (phase mid-flight).

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality, incl. registers (2.09 status, OV-4/-6/-7 open, PL register unchanged — no seasons landed)
- [x] `NEXT:` line set to: `2.09 (ingestion) — dry run → Wave 0 → Waves 1–8, BLOCKED on the missing ~/belasica-ingest-source/ mirror + a write token (D-2.09-3); then 2.08 — Homepage finalization`
- [x] `file-map.md` synced (`scripts/ingest/`, `docs/ingestion/`, the completion reports, the `.env.example` token note)
- [x] `00_stack-and-config.md` appended (`@sanity/client` 7.23.1 devDependency, exact pin)

## 7. Risks, surprises, what the next phase needs to know

- **The mirror is the whole gate.** Nothing in the ingestion can proceed until `~/belasica-ingest-source/` exists. The script fails loud and clearly if it is missing — that is intended, not a bug.
- **Sanity validation does not run on API writes** (D-2.09-6). Anyone extending the ingestion must keep the script-side collision scan; there is no server-side backstop for slug uniqueness.
- **Slug-folder encoding is unverified** (D-2.09-7). The first real dry run will reveal whether the mirror's slash substitution is one the classifier already accepts; if not, it is a one-line fix, and the dry run will show it as `manual-review` (loud, not silent).
- **OV-4 and OV-7 did not clear** (contra the waiver D-2.09-1's intent) because Task 8 needs the mirror's prose docs. They clear in the follow-up run.
- **When the waves do run:** after each, confirm the unauthenticated published-photo count stays **8** — the script prints it. If it ever changes, a draft leaked and something is wrong.

## 8. What's now possible that wasn't before

The moment the mirror is placed and a write token exists, the archive fills itself: one dry run to review, then eight commit waves, and `/arhiva`, `/statistika` and `/legendi` stop being near-empty shells — with every photo held as a draft behind the rights gate until Ace's provenance is settled.
