# Part 3 · Phase 34 · Code — Completion Report

**Phase:** 3.34-Code — Аце's statistics, added to `/statistika`
**Branch:** `phase-3.34-statistika-content`
**Date:** 2026-08-19

---

## 1. What shipped (plain language)

Аце's complete set of club statistics is now on `/statistika`, transcribed from his own document and nothing else.

Three new sections, appended after the four existing ones:

1. **„Најдобри стрелци по сезони"** — **76 seasons**, 1950 → 2025/26, one row each. The **4 seasons he has no scorer for** (1951., 1952/53, 1955/56, 2012/13) render as the season and an em dash with an `sr-only` „нема податок" — **zero invented scorers**. The **5 ties** (1966/67, 1971/72, 1982/83, 1988/89, 1995/96) show both names. His inline note „(фалат 6 извештаи)" travels with 1961/62.
2. **„Југословенска лига"** — his four ranked tables under his own ALL-CAPS headers, **13 + 30 + 25 + 7 = 75 rows**, each with his intro sentence, his shared ranks, and every tail and footnote line he wrote (including the two `*`/`**` notes on the goals table).
3. **„Прва македонска лига"** — his header, his four narrative paragraphs verbatim (the 432-match aggregate, the vice-champion seasons, the four relegations, and **his own note that he counted 1992/93 and 1993/94 wins as three points though they were two at the time**), plus **25 + 16** ranked rows.

The pipeline is the razno/season-tables one: the `.docx` is committed as provenance → transcribed verbatim to `data/book/statistika-source.md` → generated into `src/content/statistika-extra.ts` by a committed script that proves its own work.

**Two mechanical proofs, both green:**

- **Faithfulness** — the transcription is **232/232 paragraphs byte-identical** to the `.docx`.
- **Round-trip** — every parsed row re-serialised from its own fields matches its source line, whitespace removed: **197/197 identical**. Whitespace is the only thing the parser is permitted to change, because Аце glues fields together („1993/94Д. Хаџиосмановиќ10"). The script also asserts **his own stated row counts** — „следниве 30 играчи" → 30, „Седум играчи" → 7, „следниве 25 играчи" → 25.

**Nothing was corrected, expanded, reconciled or reordered.** His run-together words, trailing periods („1951.", „В. Цветков."), two-digit period spans („83-90" beside „1983-92") and shared ranks are all as printed.

---

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verified by executor:**

- [x] **The three sections render in order after „Севкупен биланс"** — measured in the built DOM: `strelci` → `nastapi` → `bilans` → `rekordi` → `strelci-sezoni` → `jugoslavija` → `makedonija`. See D-3.34-2 on the placement.
- [x] **The four existing sections and their Sanity queries are byte-unchanged** — `git diff main -- src/app/(site)/statistika/page.tsx` **removes zero lines**. The change is purely additive.
- [x] **Each new section has a `JumpNav` anchor that lands correctly under the sticky header** — all three carry `scroll-margin-top: 130px`, identical to the existing sections; a real jump lands each with a **130 px gap** and the heading at viewport-top **219 px**, clear of the 125 px of header (78) + rail (47).
- [x] **Section 1** — 76 seasons in his chronological order; the 4 blanks render „—" / „нема податок" with **zero invented scorers**; all 5 ties show every name; the 1961/62 note preserved.
- [x] **Section 2** — all four sub-tables with his headers, intros, ranked rows and every tail/footnote line. Shared ranks preserved (rank **8 appears three times**, then jumps to 11).
- [x] **Section 3** — narrative verbatim including the two-vs-three-point note; both ranked tables present with ties preserved.
- [x] **`statistika-extra.ts` round-trips against the source (197/197) and the source is faithful to the `.docx` (232/232).** `--check` confirms the committed module is current.
- [x] **No name in the new tables links to a player page**; names are verbatim (spot-checked in the built HTML for „И. Чулев(ски)", „В. Костов", „М. Василев").
- [x] **No Sanity write, no schema change, no new `brand.md` token, zero new npm dependencies.** `package.json` untouched; the extraction used only Python stdlib (`zipfile` + `ElementTree`), so `python-docx` was never needed.
- [x] **`npm run build`, `npm run lint`, `tsc` all pass from a clean `.next`** — `rm -rf .next` first (the stale-data-cache trap). **Build page count: 331** (unchanged from `main` — these sections add no routes). `/statistika` First Load JS **117 kB, unchanged**, because everything new is server-rendered.
- [x] **Checked at 1280 and 375** — **no horizontal page scroll at either width**; tables that exceed the viewport scroll inside their own `role="region"` frame (at 375: 420 px of table inside a 333 px region, page `scrollWidth` stays 375).

**Owed to Lazar:**

- **Native read of the transcribed statistics on the deployed preview (Lazar + Аце).** The figures are Аце's; a human should confirm the page reads them correctly. **Two items to look at specifically: OV-85 and OV-86.**
- **Confirm the committed `.docx` is the intended document** (D-3.34-1) — it was not in the repo and was located on disk.

**Figures flagged as conflicting:** ⚠️ **One, and the brief predicted it.** Аце's Прва-македонска narrative states he counted 1992/93 and 1993/94 wins as three points, while the season balance table still shows **1992/93 at 34 points** (verified in the built HTML: `1992/93 · 9 · 34 · 12 · 10 · 12 · 41`), i.e. two-points-for-a-win. **Neither was reconciled to the other**, per the brief. **No figure conflicts with `facts.md`** — `facts.md` makes no claim about the 14-season aggregate, the vice-champion seasons or the relegations.

---

## 2b. Vercel PR preview — and the 5 things for Lazar to eyeball

**Preview:** https://belasica-v2-ay68mmcn8-sunset-services-team.vercel.app/statistika · **PR [#60](https://github.com/DinovLazar/belasica-v2/pull/60)**

Verified on the **deployed** build, not just locally: `/statistika` returns **200**, all three anchors present, and the ten tables render **35 · 48 · 93 · 76 · 13 · 30 · 25 · 7 · 25 · 16** rows — the last seven being the new content, matching the source exactly.

**Five things to look at (Lazar, ideally with Аце):**

1. **The blank seasons.** Scroll „Најдобри стрелци по сезони" to **1951., 1952/53, 1955/56 и 2012/13** — each should be the season and a dash, with **no name invented**. Confirm those are the only four he has no scorer for.
2. **The ties.** **1966/67, 1971/72, 1982/83, 1988/89, 1995/96** should each show **two names** stacked, with their goal figures lined up beside them.
3. **⚠️ The rank numbering (OV-85).** In **„ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - НАТПРЕВАРИ"** look at ranks **18, 19, 20, 20** (40, 40, 39, 38) and in **„ВТОРА ЈУГОСЛОВЕНСКА ЛИГА - ГОЛОВИ"** at **5, 5, 7** (12, 10, 10). These are printed exactly as Аце wrote them. **Does he want them left, or renumbered?**
4. **⚠️ The missing attribution (OV-86).** The three sections end with no „Извор:" line, unlike every „Разно" page. **What wording does Аце want**, given these figures come from „БЕЛАСИЦА - статистика и разно.docx" and not from the book?
5. **The three-point note.** In „Прва македонска лига", the fourth paragraph is his own caveat about 1992/93 and 1993/94. Confirm it reads correctly — and note that the balance table higher up the page still shows **1992/93 at 34 points**, which is the two-point era. **Deliberately not reconciled.**

Also worth a glance: on a phone, the wide tables scroll sideways **inside their own frame** and the page itself must never scroll sideways.

---

## 3. Decisions I made during this phase

- **D-3.34-1** — Аце's document was not in the repo; it was located on disk (`~/Downloads/БЕЛАСИЦА - статистика и разно.docx`) and committed under the brief's own path. **Fifth stale-brief-premise incident.**
- **D-3.34-2** — The three sections were appended at the end of the page, not inserted before „Клупски рекорди": the brief's stated page order is stale, and inserting would have split the four existing sections.
- **D-3.34-3** — A new fixed `SourceTable` rather than reusing the sortable `StatTable`.
- **D-3.34-4** — No source-attribution line was written (the document is not the book, so the razno credit cannot be reused). **Opens OV-86.**
- **D-3.34-5** — Аце's three internally inconsistent rank numerals were rendered exactly as written. **Opens OV-85.**
- **D-3.34-6** — The bare rule he drew inside the appearances table is recorded but not rendered. **Opens OV-87.**
- **D-3.34-7** — The generated module is listed in `.prettierignore`, following D-3.28-10.
- **D-3.34-8** — The jump rail now overflows at desktop widths and was left to scroll rather than re-labelled. **Opens OV-88.**

---

## 4. Deviations from the brief

1. **The `.docx` was not in the repo** (D-3.34-1). The brief says „Lazar places it in the repo"; `data/book/sources/` did not exist. The document was identified by content — its six blocks match the brief's §„The six blocks" item for item — and committed.
2. **Placement** (D-3.34-2). „After «Севкупен биланс»" was written against a page order that changed on 2026-08-09. All three sections were appended at the end, which satisfies the instruction literally and leaves the existing four contiguous.
3. **`python-docx` was not used.** The brief says „`python-docx` (or equivalent)"; it is not installed, and a `.docx` is a zip — the extraction uses Python stdlib only, so **zero dependencies were added** to satisfy the brief's own out-of-scope rule.
4. **The brief's „at least" lists are exact.** It predicted blanks at „at least 1951, 1952/53, 1955/56, 2012/13" and ties at „at least 1966/67, 1971/72, 1982/83, 1988/89, 1995/96". Confirmed from the document: **those are the complete sets** — 4 blanks and 5 ties, no more.
5. **His column line is rendered as table headers, not as a raw slash-separated line.** „Играч/период/голови" becomes the columns ИГРАЧ · ПЕРИОД · ГОЛОВИ, plus a `#` column (with `sr-only` „Ранг") for the numerals he prints without a heading. The words are his; only their arrangement is this phase's.

---

## 5. Changed files / deliverables

**New:**

- `data/book/sources/belasica-statistika-razno.docx` — Аце's document, 22.000 bytes, SHA-256 `7cf8ab94…f2d955d0`
- `data/book/statistika-source.md` — 232-paragraph verbatim transcription, `<!-- L#### -->` traced
- `scripts/build-statistika-extra.mjs` — the generator, with `--check` and the two proofs
- `src/content/statistika-extra.ts` — **GENERATED**, 368 lines
- `src/components/stats/SourceTable.tsx` — the fixed, server-rendered stats table
- `src/components/stats/AceTables.tsx` — the three sections' render layer

**Modified:**

- `src/app/(site)/statistika/page.tsx` — **additive only; zero lines removed**
- `.prettierignore` — one entry (D-3.34-7)
- `src/_project-state/decisions.md`, `current-state.md`, `file-map.md`

---

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` — `NEXT` reset; **OV-85 … OV-88** added to the owed-verification register.
- [x] `file-map.md` — all six new files indexed; the `.prettierignore` line updated.
- [x] `decisions.md` — **D-3.34-1 … D-3.34-8** appended. The reserved IDs `D-3.25-1/-3/-4/-5/-6` were not used.
- [x] `00_stack-and-config.md` — **no change required: zero dependencies added or upgraded.**
- [x] This report filed.

---

## 7. Risks, surprises, what the next phase needs to know

- ⚠️ **The brief was stale about the page order** — it described „Клупски рекорди" as leading `/statistika`; the records have closed the page since 2026-08-09. **This is the fifth phase in a row where a brief's factual premise had to be checked against the repo before writing code** (3.11, 3.13, 3.24, 3.32, 3.34). Verify every cited document and every claimed page state first.
- ⚠️ **Аце's rank numbering is internally inconsistent in two of his six tables** (OV-85). It is a numbering slip, not a wrong figure — all values are correctly ordered. It is rendered as written.
- ⚠️ **The three new sections carry no attribution** (OV-86). This is the only content on the site from this second document, and the razno credit names the book instead — so the wording is owed by Аце.
- ⚠️ **The jump rail overflows at 1280** (OV-88). Measured, and **not fixable by relabelling** — 7 items at these lengths exceed the rail by 335 px whatever they are called. Fixing it means changing `JumpNav`, which `/arhiva` and `/legendi` also use.
- **This content is not editable in Studio** (D-3.16-2 again). A correction Аце wants to any of these figures is a source edit + regeneration + deploy. That cost now applies to a third body of content.
- **The generator is the safety net.** If anyone hand-edits `src/content/statistika-extra.ts`, `node scripts/build-statistika-extra.mjs --check` exits non-zero. Run it in any phase that touches this content.

---

## 8. What's now possible that wasn't before

- `/statistika` now carries **a top scorer for all but four seasons since 1950** and six ranked all-time tables — the page is no longer limited to what has been keyed into Sanity.
- The transcription pipeline is proven a **third** time (razno → season tables → statistics), now with **two mechanical proofs** rather than an out-of-band diff: source-vs-`.docx` byte equality, and a parsed-row round-trip. That pattern is reusable for any further document Аце supplies.
- Every figure on the three sections traces to one numbered paragraph of a committed `.docx`, so any question Аце raises on his native read can be answered by reading one line.
