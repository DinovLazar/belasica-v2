# Part 2 · Phase 09-Run · Code — Completion Report

> **Phase complete.** The ingestion that Phase 2.09 built but could not run (the mirror + token were absent, D-2.09-3) was executed end-to-end: **96 seasons + 889 published photos** now populate `/arhiva`, `/statistika`, `/legendi`. OV-4, OV-6, OV-7 and OV-9 are cleared. **One consequential deviation, by informed owner decision:** the ingested photos were **published** (not left as drafts), overriding the brief's rights gate — see §4 and D-2.09R-2.

**Date:** 2026-07-20 · **Executor:** Claude Code (Phase 2.09-Run, Lazar's machine) · **Outcome (one line):** the archive is real — ~74→96 season pages and ~915→881 photos landed and went live; the statistics and career layers render from real content for the first time.

## 1. What shipped (plain language)

The Drive mirror was placed on disk, classified, and ingested in resumable waves: **95 season shells** (Wave 0) and **881 photos** (Waves 1–8), all deterministic and idempotent. Two owed-verification items were cleared with figures **transcribed** from the mirror's prose documents — a real 1982/83 championship final table (OV-4) and two players' real career totals (OV-7) — and the divergent footer copy was converged on one verified source (OV-6). Then, by an informed owner decision, all 881 photos were **published**, taking the archive live. Three reports document the run; the editorial hand-off lists what the manual pass still owes.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by the executor:**
- ✅ **Mirror placed** at `~/belasica-ingest-source/` with season + thematic folders as direct children; **counts recorded and compared:** 1163 images / 17 docs / 611 MB / 119 folders — **larger than the ≈915/15/≈0.4 GB estimate, not short** (so no stop-and-report condition; the over-count is thematic photos + a fuller season run).
- ✅ **`verify-classify.mjs` passes 23/23.**
- ✅ **`2.09-dry-run-report.md` generated from the real mirror + committed:** 0 collisions, 0 unmatched, the five locked mappings exactly, `1992-93` already-present.
- ✅ **Lazar's explicit go-ahead** obtained after the dry run, before the first `--commit`.
- ✅ **Slash-folder settled with no code change (D-2.09R-1):** `1950/51` arrived on disk as `1950-51` (hyphen); the classifier handled it untouched; `RE_SPAN` unchanged; `verify-classify` still 23/23.
- ✅ **Wave 0 ran; 95 shells created; `/arhiva` shows 96 seasons · 11 decades; five titles spot-checked** (one slash-form `1950-51`, one single-year `1942`, one era `1945-48`, plus `1985-86`, `2025-26`).
- ✅ **Waves 1–8 ran in order; per-wave created == source** (72/101/118/111/124/119/114/122 = 881; 0 skipped).
- ⚠️ **Published-photo count = 8 after every wave** — held during ingestion (drafts). **Then intentionally changed to 889 by the owner-directed publish (D-2.09R-2)** — the DoD's "stays 8 / no photo published" is deliberately not met (§4).
- ✅ **Idempotency demonstrated against the real archive:** re-running Wave 8 created 0 documents.
- ✅ **Every ingested photo has provenance + a resolving `relatedSeason` + an image asset** (0 missing, 0 dangling, verified by query). ⚠️ They are **published**, not drafts (§4).
- ✅ **OV-4 + OV-7 cleared with real, sourced figures, verified live:** season `1982-83` final table (from `Беласица 1926-2025-финал…xlsx`); Роберт Христовски 175/7 + Љупчо Мафков 115 (from the history docx). `/statistika` renders both rankings + the balance band/coverage/row; the person pages render the Кариера tiles. Sources named in `2.09-run-report.md` §6.
- ✅ **No-`0` rule verified against real data:** Мафков (goals 115, appearances null) shows **one** tile („ГОЛОВИ 115"), never „0 настапи"; `/statistika` shows „—" for his appearances.
- ✅ **OV-6 closed:** Studio field = verified string (republished); `SiteFooter` reads both constants from `src/lib/facts.ts`; **byte-identity confirmed by script** (facts.md ↔ facts.ts ↔ live CDN field).
- ✅ **All three reports committed** to `docs/ingestion/`; the hand-off names the specific per-season/per-person gaps.
- ✅ **`SANITY_API_WRITE_TOKEN` appears nowhere in the diff** (only the empty `.env.example` key name); no secret committed; nothing added to Vercel.
- ✅ **Only `src/` change is `SiteFooter.tsx`;** no `src/app/`, no `src/sanity/schemaTypes/`, no `brand.md`/`globals.css`. Evidence: `git diff --stat`.
- ✅ **`npm run build` + `npm run lint` clean.**
- ✅ **PR opened; Vercel preview loads; six routes 200.** (See §PR below.)
- ✅ **`decisions.md` (D-2.09R-1…-5), `current-state.md`, `file-map.md` synced; this report filed.**

**Owed to Lazar (on the register):**
- **OV-RIGHTS (URGENT):** 881 mostly-third-party-screenshot photos are now public before rights were settled in writing. Settle with Ace in writing, then confirm-public or unpublish (a scripted un-publish is the trivial reverse of D-2.09R-5).
- **Spot-check the 10 named season pages** against their folders (`2.09-editorial-handoff.md` §7).
- **Confirm the 9 `manual-title` seasons** (era ranges + lone years).
- **The editorial pass** — story/finalTable/squad/trainers/bio/careerStats/captions/relatedPerson (hand-off worklist).

## 3. Decisions I made during this phase

All logged in `decisions.md` (D-2.09R-1…-5):

| ID | Decision | Rejected alternative |
|---|---|---|
| **D-2.09R-1** | Slash folder arrived as hyphen `1950-51` → `RE_SPAN` unchanged (resolves D-2.09-7) | Pre-emptively add separators not present in the mirror |
| **D-2.09R-2** | **Owner-directed:** publish all 881 ingested photos (override the draft-only rights gate) | Keep drafts until Ace confirms rights in writing (executor's recommendation) |
| **D-2.09R-3** | OV-4 final table = a single Беласица row (source is Belasica's own record, not full standings) | Invent/await the other clubs' rows |
| **D-2.09R-4** | OV-7 career stats only from explicit whole-career totals; per-season NOT summed | Sum per-season top-scorer goals into a career total |
| **D-2.09R-5** | Publish via a throwaway scratchpad script; committed tooling stays drafts-only | Add a `--publish` flag to `run.mjs` |

## 4. Deviations from the brief

1. **Photos published, not left as drafts (D-2.09R-2) — the single biggest deviation.** The brief's rights gate ("every ingested photo stays a draft, full stop") and the matching DoD items ("published count stays 8", "no ingested photo published") were overridden by Lazar's informed, in-session decision. Before acting, the executor surfaced in full that the site is live/public, that most photos are third-party screenshots whose rights `facts.md` flags as unsettled, and that publishing is hard to reverse. The residual rights risk is now the active **OV-RIGHTS** item.
2. **`RE_SPAN` unchanged (D-2.09R-1)** — the anticipated one-line fix was unnecessary; the slash folder arrived as a hyphen.
3. **Mirror larger than estimated** — reported, not worked around; not a stop condition (over, not short).
4. **`NEXT:` line leads with OV-RIGHTS, then 2.08** — the waves completed and OV-9 cleared, but the publish created an urgent owed item, so `current-state.md` flags rights settlement ahead of 2.08 (per the brief's "follow the code" instruction).
5. **Run brief not committed to `briefs/`** — following the repo convention (D-1.01-3: briefs are Lazar's to save, `briefs/` is a gitkeep placeholder), not the brief's boilerplate output line.

## 5. Changed files / deliverables

- **New — `docs/ingestion/`:** `2.09-dry-run-report.md`, `2.09-run-report.md`, `2.09-editorial-handoff.md`.
- **New — `src/_project-state/completions/`:** `Part-2-Phase-09-Run-Completion.md` (this).
- **Edited — `src/components/SiteFooter.tsx`:** reads `UNOFFICIAL_ARCHIVE_LABEL`/`_STATEMENT` from `src/lib/facts.ts` (OV-6). The **only** `src/` change.
- **Edited — state:** `decisions.md` (D-2.09R-1…-5), `current-state.md` (snapshot: NEXT, summary, OV register, placeholder register, content reality), `file-map.md` (sync).
- **Sanity `production` (content, not repo):** +95 season docs, +881 photo docs (published), +2 person docs, `season-1982-83.finalTable`, `siteSettings.footerUnofficialArchiveText` corrected.
- **Not committed / not in repo:** the write token (only in `.env.local`), the one-off publish script (scratchpad; the repo copy was deleted — verified absent from `git status`).
- Branch `phase-2.09-run-ingestion`.

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality (NEXT line, 2.09-Run summary bullet, OV register with OV-4/-6/-7/-9 resolved + OV-RIGHTS active, placeholder register PL-10/-11/-12/-13 partial-clears, content-reality line).
- [x] `NEXT:` set to `2.08 — Homepage finalization`, led by the urgent OV-RIGHTS item.
- [x] `file-map.md` synced (three reports, this completion report).
- [x] `00_stack-and-config.md` — **no change** (no dependency added or upgraded this phase; `@sanity/client` was already pinned at 2.09).

## 7. Risks, surprises, what the next phase needs to know

- **The rights exposure is live.** 889 public photos, most third-party screenshots, rights not settled in writing. This is the top thing to resolve before 2.08 — either confirm-public with Ace or unpublish.
- **Career totals barely exist in the sources.** Only two whole-career Belasica totals were found in 17 documents; the rest of the stats data is per-season (`season.squad` territory, D-2.01-3). The stats/career layer will fill slowly and mostly by hand.
- **The final-table source is Belasica-only.** `Беласица 1926-2025-финал…xlsx` gives Belasica's own row per season, not full standings — so ingested tables will be single-row until an editor adds opponents. Good enough for `/statistika`'s balance.
- **ISR lag is real but self-healing.** After content writes, `/arhiva` and `/statistika` trail by one `revalidate = 60` cycle; on-demand pages (new person slugs) render immediately. Reload twice if verifying by eye (2.06 precedent).
- **The publish is not reproducible from the repo** (D-2.09R-5) — it lived in the scratchpad. Documented in `2.09-run-report.md` §5.

## 8. What's now possible that wasn't before

The archive is no longer a set of empty shells — it is a browsable 96-season, 889-photo history, with the statistics and career layers rendering from real content for the first time. **2.08 (Homepage finalization) can now finalize against a genuinely populated site** (the reorder rationale in D-2.09-2 pays off), and the manual editorial pass has a concrete, sourced worklist. The one gate still down is rights: nothing about the archive's honesty or legality is settled until the screenshot-provenance question is closed with Ace in writing.
