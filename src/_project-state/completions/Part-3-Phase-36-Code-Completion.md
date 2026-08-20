# Part 3 · Phase 36 · Code — Completion Report

**Date:** 2026-08-20 · **Executor:** Claude Code (Opus 5, Linux session, `~/project/belasica-v2`) · **Outcome (one line):** `/arhiva/2025-26` now renders the same „Резултати" and „Состав и статистика" tables every other covered season renders — 30 matches in two half-seasons and 35 players — from Аце's own figures, with **zero diff to the season page and all three table components**.

## 1. What shipped (plain language)

Аце asked for one thing: „За сезоната 2025/26, не ви се направени резултатите и стрелците и играчите со настапите, како кај другите сезони." That was true, and the reason was mundane — the 3.28 generator builds its tables from the book, and the book's match extract stops at spring 2025. `data/book/matches.json` holds **0** matches for 2025/26, so `seasonTablesFor("2025-26")` returned `null` and the page fell back to prose, exactly as D-3.28-2 designed it to.

The 2025/26 figures were never missing — they were in the wrong shape. Аце supplied them in August 2026 and they were typed into the season document's `results` and `lineupAndStats` as prose: 30 match lines with scorers, and a 35-player list as „3. Милушев Александар (1988) 30+0/9". This phase turned that prose into rows.

It did it in two steps rather than one, and that split is the only real design decision here. The direct route — teach the generator to query Sanity — would have given it a network dependency and destroyed the property its `--check` rests on: that the committed module is provably the projection of committed inputs, checkable offline by anyone. So instead a **new one-time extraction** (`scripts/extract-season-2025-26.mjs`) fetches once from the public query API and commits `data/book/season-2025-26.json` with its provenance written into the file, and the **generator gained a second local input**. It still opens no Sanity client, holds no token, and makes no network call.

Everything downstream then happened by itself. `seasonTablesFor("2025-26")` stopped returning `null`, and the page — untouched — started rendering tables.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **`seasonTablesFor("2025-26")` returns tables, and the page flips on its own.** The prerendered `/arhiva/2025-26` carries **two `<table>` elements**: „Втора македонска лига" (32 `<tbody>` rows = 30 matches + 2 part headers) and „Состав и статистика" (36 rows = 35 players + 1 after-eleven divider). Columns are № · Име · Настапи · Голови and Натпревар · Резултат · Стрелци — **no „Коло" column**, correctly, since the prose gives no round numbers.
- ✅ **Zero diff to the season page and the three components.** `git diff --stat` over `src/app/(site)/arhiva/[slug]/page.tsx`, `SeasonResultsTable.tsx`, `SeasonSquadTable.tsx` and `SeasonRecordList.tsx` is **empty**. The brief predicted this; it held exactly.
- ✅ **Extraction proofs — all asserted inside the script, so a failure aborts the run rather than shipping.**

  | proof                   | required      | measured                          |
  | ----------------------- | ------------- | --------------------------------- |
  | matches                 | 30            | **30**                            |
  | home / away split       | 15 / 15       | **15 / 15**                       |
  | half-seasons            | both          | **Есенска · Пролетна полусезона** |
  | re-derived played–W–D–L | P30 W18 D4 L8 | **P30 W18 D4 L8**                 |
  | re-derived goals        | 57:21         | **57:21**                         |
  | squad rows              | 35            | **35**                            |

  The re-derived record is compared field by field against the season's own `finalTable` row (D-3.30-3) **before** the file is written. All six fields match.

- ✅ **The transcription is verbatim, proven by round-trip.** Every one of the 30 match rows and 35 squad rows was rebuilt from its parsed fields and compared to the prose line it came from: **0 mismatches on both**. Every prose line is accounted for — the only three `results` lines that do not become matches are the opening „Втора македонска лига, резултати и стрелци." and the two half-season labels; all 44 `lineupAndStats` lines are either a squad row or preserved in `staffAndNotes`.
- ✅ **An independent internal check nobody asked for, which passed:** the scorer figures across the 30 match lines **sum to 57**, exactly the derived `goalsFor`. Two independently transcribed halves of the prose agree.
- ✅ **The stale 26-row pre-season roster is provably absent.** D-3.28-9's statless-squad guard is **untouched** — it is what still drops the book's 2025/26 entry („Трајков Ѓорѓи 2004 голман": birth year and position, no настапи, no голови) — and the real squad arrives on a separate input that never passes through it. Checked against the rendered HTML: **0 of the 26 stale strings appear**, and all 35 real names do. The generator additionally **asserts the book contributes nothing to slug `2025-26`** and exits non-zero if it ever does, so one season can never be described by two sources at once.
- ✅ **Scorer cross-check against „А. Милушев 9" — PASS, no reconciliation needed.** Counting the match lines gives **Милушев 9**, and his squad row reads `30+0/9`. Аце's 3.34 per-season scorer list, this phase's match lines, and this phase's squad list are three independent statements of the same number and all three agree.
- ⚠️ **One flagged, not reconciled (D-3.36-4):** „Слога (В) - Беласица 1:2 (**Спироски** 12, …)" against **Спиркоски** in five other lines. The arithmetic says one man (8 + 1 = 9 = his squad row). It ships as printed; raised as **OV-90** for Аце.
- ✅ **Every other season is byte-identical.** All **92** pre-existing entries in `season-tables.ts` compared as parsed JSON: **0 changed, 0 removed, 1 added (`2025-26`)**. At the raw-text level the module diff is exactly **two hunks** — the deliberate header note, and one contiguous 745-line insertion. Spot-rendered `2024-25`, `1992-93` and `2012-13`: unchanged, and `2012-13` still correctly shows no squad table.
- ✅ **The book extract is byte-unchanged.** `data/book/matches.json` and `seasons.json` carry the same SHA-256 as at session start (`ba0b436d…`, `6d1358e9…`).
- ✅ **The generator is still offline, and this is proven rather than asserted.** With `globalThis.fetch` replaced by a function that throws, `build-season-tables.mjs --check` **passes**; the extractor under the identical stub **fails on its first call**. Treatment and control. `grep` for `fetch|http|@sanity|createClient|token|process.env` in the generator hits only comment text.
- ✅ **`--check` passes for both scripts; the coverage doc is regenerated** (92→93 seasons, 2267→2297 matches, 73→74 squads, and a „Два извора" note naming the split).
- ✅ **No Sanity write, no schema change, zero new npm dependencies, no new `brand.md` token.** The extraction is a single `fetch` on Node's built-in; nothing was added to `package.json`.
- ✅ **Clean build.** From a deleted `.next`: `npm run lint` clean, `npx tsc --noEmit` exit 0, `npm run build` green — **331 pages**. A `main` baseline built in a throwaway git worktree returns **331 pages and 124 kB First Load JS on `/arhiva/[slug]`** as well, so this phase moved neither. `season-tables.ts` remains server-only: grepping the client chunks for 2025/26 data (`Есенска полусезона`, `Дебрешлиоски`, `Шаренковски`) returns **nothing**, while the same probe finds it in the server output.
- ✅ **Responsive behaviour measured at 1280 and 375** on the local production build: **no horizontal page scroll at either** (`scrollWidth == clientWidth`: 1265/1265 and 375/375). At 375 the five-scorer row (Беласица — Вардар (Нег) 8:1) is a `grid` and its scorers **drop to their own line** (cell top 4639 vs 4601, width 335 px inside 375); a scorerless row hides the empty cell (`display: none`). The only elements measuring past the viewport are the jump rail's own `min-w-max` inner scroller — 3.35's intended inline scroll, not a page overflow.

**Owed to Lazar (and Аце):**

- ⚠️ **Nobody has seen the page.** Same limitation D-3.35-4 recorded: this session's browser pane does not composite, so screenshots time out. Layout **is** computed, so every number above is measured rather than assumed — but the visual read at **1280 and 375 on the Vercel PR preview** is owed. Аце especially: this is his own request.
- ⚠️ **OV-89 — confirm what the table switch stops displaying** (below, §7). This is the one thing in the phase that a machine cannot decide.
- ⚠️ **OV-90 — the „Спироски"/„Спиркоски" split**, if he wants it corrected in Studio.

**Five-item eyeball checklist for Lazar (on `/arhiva/2025-26`, preview):**

1. The „Резултати и стрелци" section shows a table headed **Втора македонска лига**, split into **Есенска полусезона** and **Пролетна полусезона**, 15 matches each.
2. „Состав и статистика" shows **35 numbered rows** ending „35. Младенов Славе (2009) — 2 — 0", with a hairline rule after row 11.
3. The names read **„Милушев Александар (1988)"** — surname first, birth year kept. Confirm that is how Аце wants them printed (D-3.36-1).
4. At **375 px** nothing scrolls sideways and the scorers sit on their own line under each match.
5. The **стручен штаб and претседател lines are gone** from the page. That is expected (OV-89) — confirm with Аце whether it is acceptable.

## 3. Decisions I made during this phase

All six are logged in full in `decisions.md`.

- **D-3.36-1** — The 2025/26 squad name carries the birth year, because the prose prints it inside the name. `player` is `"Милушев Александар (1988)"`; the year is also kept as its own `birthYear` field in the JSON. Same treatment the book already gives „А. Милушев (кап)".
- **D-3.36-2** — The half-season label loses its trailing colon and nothing else. „Есенска полусезона:" → „Есенска полусезона". Not normalised to the book's „Есенски дел", and given no year the prose does not print. **This one colon is the only character removed anywhere in the extraction.**
- **D-3.36-3** — `настапи = старт + измена`, computed on Аце's own two figures, with both operands stored beside the sum. `голови` verbatim, never derived.
- **D-3.36-4** — „Спироски 12" ships as printed against „Спиркоски" elsewhere. No correction, no merge, no on-page marker. Flagged to Аце as OV-90.
- **D-3.36-5** — The generator gains a second input rather than a Sanity client. The split that keeps `--check` offline and verifiable.
- **D-3.36-6** — No 2025/26 squad name becomes a link, and none is reordered to make one. 0 of 35 match as printed; 7 would match on a word swap, which was refused as respelling.

## 4. Deviations from the brief

**None in scope or approach.** Three things worth recording:

- **The brief's premises all held.** Every fact it listed was re-verified and every one was correct: 0 book matches for 2025/26; the 26-row trap roster present and already dropped by D-3.28-9; 33 `results` blocks and 44 `lineupAndStats` blocks; P30 W18 D4 L8 57:21. This is the first brief in a while that needed no correction.
- **The scorer-number question resolved itself.** The brief warned not to invent a unit (the OV-64 lesson). The prose's figures are the same shape the book's are and they flow into the same `SeasonMatchScorer.minutes` field, rendered by the same cell that already prints them as bare figures with no unit (D-3.28-5). Nothing needed deciding — the existing refusal to assert a unit covers 2025/26 unchanged. Own goals („автогол 69") are likewise not special-cased: `автогол` is a scorer string in the book on **36 matches** already.
- **A `.env.local` was created locally to build.** It is git-ignored (`.gitignore:34`) and holds only the three documented non-secret `NEXT_PUBLIC_SANITY_*` values from `00_stack-and-config.md`. No token exists in this session.

## 5. Changed files / deliverables

**New:**

- `scripts/extract-season-2025-26.mjs` — the one-time extraction. Read-only, token-free, one `fetch` against the public query API. Asserts six proofs before writing.
- `data/book/season-2025-26.json` — its committed output, 36.611 bytes. The only file in `data/book/` that is not from the book, and it says so in its own `provenance` field.

**Modified:**

- `scripts/build-season-tables.mjs` — merges the second input keyed to slug `2025-26`; asserts the book contributes nothing to that slug; D-3.28-9's guard untouched and its comment corrected to say what it now protects.
- `src/content/season-tables.ts` — regenerated. Two hunks: header note + the `2025-26` entry.
- `docs/ingestion/season-tables-coverage.md` — regenerated, with the two-source note.

**Untouched, as required:** `data/book/matches.json`, `data/book/seasons.json` (SHA-256 verified), the season page, `SeasonResultsTable.tsx`, `SeasonSquadTable.tsx`, `SeasonRecordList.tsx`, `/statistika`, `llms.txt`, Sanity (zero writes), the schema.

## 6. State updates done

- `current-state.md` — `NEXT` reset; the reorder ahead of blocked 3.33 recorded explicitly; „Last updated" bumped; **OV-89 and OV-90** added to the owed-verification register; two carryovers added; `season-2025-26.json` and the extraction script added to „Tracked data & scripts".
- `file-map.md` — two new rows (the source file under `data/book/`, the script under the content-fill section) and two existing rows corrected (`season-tables.ts` counts 92→93 / 2.267→2.297 / 73→74 plus the two-provenance warning; `build-season-tables.mjs` second input and the offline proof).
- `decisions.md` — **D-3.36-1 … -6** appended. The reserved `D-3.25-*` IDs were not touched.
- `00_stack-and-config.md` — **not touched**: no dependency was added, upgraded or removed.

## 7. Risks, surprises, what the next phase needs to know

- ⚠️ **The one thing a machine cannot decide — OV-89.** Per D-3.28-2 the tables **replace** the prose, they do not sit beside it. On 2025/26 that retires seven lines Аце wrote: the four **стручен штаб** entries (Стојанов Панче — главен тренер; Митев Благој — помошен; Манчев Димче — кондиционен; Муканов Филип — тренер на голмани), the **претседател** „Васков Славчо - Пинда", and the two header lines („Состав и статистика:" and „Играч (година на раѓање) — старт+измена/голови", now redundant against the table's own caption and columns). **Nothing was deleted** — all seven are untouched in Sanity and preserved in `staffAndNotes` in the committed JSON. This is the established behaviour on every covered season, but 2025/26 is the first where the hidden lines are _staff names_ rather than headers, which is why it is worth Аце's eyes. The season's `trainer` field still renders its own card and reads „Александар Стојанов, Панче Стојанов".
- ⚠️ **A Studio correction to 2025/26 no longer reaches the page on its own.** It now needs `node scripts/extract-season-2025-26.mjs`, a regeneration and a deploy. That cost is what D-3.28-1 already records for the other 92 seasons; this phase extends it to the one season that was previously live-editable. It is on the register.
- ⚠️ **Seven linkable players are not linked** (D-3.36-6, carryover). Not a regression — the prose linked nobody — but a real gap, and the same gap the whole archive carries. A name-matching phase is the fix, not a special case here.
- ⚠️ **`docs/ingestion/season-tables-coverage.md` fails `prettier --check`, and did so on `main` too** — verified against the file at `main`. Generator-owned, exactly like `season-tables.ts`, which **is** in `.prettierignore` (D-3.28-10); the exclusion just never covered the report. One line closes it. Left alone here because it is out of scope and pre-existing.
- **3.33 is still blocked on OV-81.** This phase deliberately ran ahead of it and depends on nothing 3.33 owes.

## 8. What's now possible that wasn't before

- **The archive's most current season reads like the other 92.** 2025/26 is the season the 30 August promotion event points at, and it was the one page still showing a wall of prose where every neighbour showed tables.
- **The generator can take a season from outside the book without becoming a Sanity client.** The pattern is now established and proven offline: extract once to a committed, provenance-stamped file; merge locally. **2026/27 will need exactly this**, and the answer is a second data file, not a rewrite.
- **A transcription error in that pipeline now fails loudly.** The extraction asserts its own totals against the season's own `finalTable` row before writing anything. That check did not exist for any season before this phase.
