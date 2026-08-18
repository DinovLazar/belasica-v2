# Part 3 · Phase 28 · Code — Completion Report

**Date:** 2026-08-18 · **Outcome (one line):** The season page's results and squad sections render as real tables built from Аце's own book, with no Sanity write, no schema change and no season losing a single line of what it showed before.

---

## 1. What shipped (plain language)

Two long runs of prose became tables a reader can scan. „Резултати и стрелци" is now one table per competition or stage — navy header band, a 6px orange bar over each group, есен and пролет separated, the score as the strongest thing in the row. „Состав и статистика" is № · Име · Настапи · Голови, with the same hairline after the eleventh man that the prose list has drawn since 3.17.

**The tables are generated, not hand-written.** `scripts/build-season-tables.mjs` reads the tracked book extract and writes `src/content/season-tables.ts` — **92 seasons of matches (2.267 in all) and 73 squads**. The page asks `seasonTablesFor(slug)`; a hit renders the table, a miss renders Аце's Portable Text exactly as before. **There is no flag and no list of „table seasons"** — a season that gains data starts rendering a table on the next regeneration, with no code change (D-3.28-2).

**Nothing regressed.** Seasons showing results: **96 before, 96 after.** Seasons showing a squad: **84 before, 84 after.** **Zero of the 96 pages render both a table and the prose** for the same section — counted across the built HTML, not spot-checked.

⚠️ **Three of the brief's premises did not survive contact with the data.** They were measured before any code was written, put to Lazar with the numbers, and he chose each replacement:

| Brief said | Data says | Chosen |
|---|---|---|
| Group „Првенство · Куп · Квалификации" | **No cup axis exists.** `competitionType` is `league` for all 2.252 typed matches; `competition` holds **31 league names**, not categories; the 7 rows matching /куп/ are the opponent **Шкупи** | Group by **`stage`** (53 ties, 17 seasons), falling back to competition (D-3.28-3) |
| A „Коло" column | `round` is set on **12 of 2.267 matches** (0,53 %), in two seasons | Kept, self-omitting — absent on 94 of 96 pages (D-3.28-4) |
| Link names via `PersonChip` | 82,7 % of book strings are „К. Костадинов"; **121 surnames carry more than one distinct string** (Митев ten) | Exact whole-string match only — **1 of 1.982 rows** (D-3.28-7) |

⚠️ **One real regression was caught by diffing the built output against `main`, not by reading the code.** Ten seasons list a roster carrying **no appearances or goals**. On `2025-26` the published prose reads „1. Трајков Ѓорѓи (2004) 22+0/0" — the structured rows have a birth year, a position and no figures. The table would have replaced real numbers with two empty columns. A statless squad is no longer emitted, and those ten keep their prose (D-3.28-9).

---

## 2. Coverage (Task 2 — measured before rendering anything)

| Measure | Value |
|---|---|
| Seasons in the book | 96 |
| Seasons with structured matches | **92** |
| Matches carried | **2.267** (all of them) |
| Matches carrying a `round` | **12** |
| Seasons with a structured squad, as extracted | 83 |
| …after dropping statless squads (D-3.28-9) | **73** |
| Sanity `results` (documents / blocks) | **96 / 2.579** |
| Sanity `lineupAndStats` (documents / blocks) | **84 / 2.433** |

⚠️ The brief said „2.563 lines across 95 seasons"; live is **2.579 across 96**. All 96 seasons carry `results`.

**Seasons with NO structured match data (4):** `1922-26`, `1926-1930`, `1936-37`, `2025-26`. All four keep their prose, byte-identical to `main`.

**Seasons with NO structured squad rendered (23):** `1922-26`, `1926-1930`, `1930-31`, `1931-32`, `1932-33`, `1933-34`, `1934-35`, `1935-36`, `1936-37`, `1937-38`, `1938-39`, `1939-40`, `1940-41` (13 the book never lists) plus `1942`, `1944`, `1945-48`, `1948-49`, `1951`, `1952`, `1952-53`, `1955-56`, `2012-13`, `2025-26` (10 listed without statistics, D-3.28-9).

**The four „divergent" seasons are not defects and were not touched.** They now explain themselves on the page: `1987-88` renders „Прва македонска лига" (17 + 19) *and*, separately, „Финале на квалификациите за влез во Втората југословенска лига" (2) — which is exactly why its count exceeds the book's league-only summary table. Same shape on `1950`, `1950-51` and `1954-55`.

---

## 3. Definition of Done

### ✅ `npm run build` passes; page count unchanged
**330/330**, identical to the `main` baseline built from `6010a2c` in the same checkout. This phase adds no route. Every build in this phase ran after `rm -rf .next`, per the stale-data-cache trap.

### ✅ `tsc` clean, ESLint clean, prettier applied
`npx tsc --noEmit` → no output. `npm run lint` → no output. `npx prettier --check` on the five hand-written paths → „All matched files use Prettier code style!". Prettier was run **only on this phase's files** — a repo-wide glob rewrites ~18 untouched files.

### ✅ Zero new dependencies · no new `brand.md` token · no table library
`git diff main --stat -- package.json package-lock.json` → empty. `brand.md` → empty. The header type uses the existing `--text-overline` / `--tracking-overline` theme tokens (D-3.28-11).

### ✅ No Sanity write and no schema change
`git diff main --stat -- src/sanity/` → **empty**. The diff contains **no** `patch(` / `create(` / `createOrReplace` / `commit(`. The generator opens no Sanity client and holds no token. `match.ts` stays unregistered.

### ✅ The existing fields are untouched in the dataset
Read-only query before and after, identical both times: `results` **96 documents / 2.579 blocks**, `lineupAndStats` **84 / 2.433**. Аце's text is fully recoverable.

### ✅ No season renders both a table and the prose — verified across all 96
Counted in the built HTML per section, not spot-checked: results **92 table + 4 prose = 96**; squad **73 table + 11 prose = 84**; **pages rendering both in one section: 0**.

### ✅ Every season that showed results still shows results
Results **96 → 96**. Squad **84 → 84**. No drop.

### ✅ A season with data renders grouped tables; one without renders prose byte-identical to `main`
With: **`1987-88`** — two groups, есен 17 + пролет 19, plus its two qualification ties. Without: **`1922-26`**, **`1926-1930`**, **`1936-37`**, **`2025-26`** — all four `#rezultati` and `#trener` sections **byte-identical** to the `main` build.

### ✅ „Коло" absent — not blank — where the data holds no round
**`1938-39`**, on one page: „Група Струмица" renders **three** header cells; „Провинциска лига", „Полуфинале" and „Финале" render **four**.

### ✅ Scorers render with their figures; an empty cell is empty
„Савов 43 · Секулив 70". **0 scorer cells across all 92 pages contain a dash, a zero or a placeholder.** The cell is still emitted from `sm` up so every row matches the header's column count; below `sm` an empty one is removed rather than left holding a grid row.

### ✅ Zero horizontal overflow at 375 px on three named seasons
**`1987-88` (38 matches)**, **`1938-39`** (4 groups, the Коло case) and **`2018-19`**: page `scrollWidth` = `clientWidth` = **375**, and **0 tables overflow their container**. Scorers sit beneath their row below `sm`.

⚠️ **Three defects were found here by measuring, and all three are fixed** (D-3.28-6): scorer spans butted together with no whitespace, so there was **no inline break opportunity** and a four-scorer cell ran **429 px inside a 335 px column**; the wrapper carried `overflow-hidden`, which would have **silently clipped** that rather than revealing it; and a grid item's default `min-width: auto` would not let the match cell shrink below its longest word, pushing the round-column tables **6 px** past the container.

### ✅ Verified at 375, 768, 1280 and 1408 px
No page overflow and no table overflow at any of the four. At 768 and above the rows are real `table-row`s again with „Стрелци" back in its own column.

### ✅ Names link only to slugs that exist
**1 of 1.982 rendered squad rows links** (Давид Стојков); 759 distinct names render as plain text. ⚠️ Reported as **OV-63** — one link among 1.981 plain names reads as a fault, and the honest choices are to keep it or drop squad linking until a verified alias map exists.

### ✅ Section `id`s unchanged across all 96 pages
The rendered `<section id>` set was captured from the `main` build and from this one and diffed per slug: **identical on all 96**.

### ✅ No book data crosses into a client bundle
**`/arhiva/[slug]` First Load JS is 123 kB — identical to `/legendi/[slug]` and `/razno/[slug]`.** The module is 1,2 MB and server-only: both table components are server components, neither is a `"use client"` boundary, and **what crosses to the browser is nothing at all** — not one season's rows, not a projection. The tables are static HTML.

### ✅ Contrast measured, not estimated
Computed from the painted values in the browser: header ink (`#F7F4EC`) on the navy band (`#0D1F3C`) = **14.95:1**; body text (`#3A3A38`) on paper = **10.37:1**. Both AAA. ⚠️ The row separator (`mist #E4E1D8` on paper) is **1.19:1** — it is a decorative hairline, not a UI control, and is the same `border-mist` treatment `SeasonRecordList` and the rest of the site already use; row structure is carried by table semantics, not by that line.

### ✅ Record files updated · report filed
`decisions.md` **D-3.28-1…-11**; `current-state.md` snapshot, coverage and **OV-63…OV-66**; `file-map.md` four new files plus the `SeasonRecordList` export. `00_stack-and-config.md` **unchanged — no version or config value moved.**

---

## 4. Every new or changed Macedonian string (for Lazar's native read)

Column heads only; no sentence was written.

| String | Where |
|---|---|
| `Коло` | results table, when the group holds a round |
| `Натпревар` | results table |
| `Резултат` | results table |
| `Стрелци` | results table, `sm` and up |
| `№` | squad table |
| `Име` | squad table |
| `Настапи` | squad table |
| `Голови` | squad table |

Group titles and есен/пролет labels are **not new strings** — they are the book's own values rendered verbatim („Прва македонска лига", „Финале", „Есенски дел 1988").

---

## 5. Decisions

**D-3.28-1** static import over Sanity ingestion, and the Studio-editability cost · **D-3.28-2** the switch is absence of data, not a flag · **D-3.28-3** grouping by `stage`, because no cup axis exists · **D-3.28-4** „Коло" self-omits · **D-3.28-5** scorer figures print without a unit · **D-3.28-6** the phone layout, and three measured defects · **D-3.28-7** exact-match linking only · **D-3.28-8** `PersonChip` not used — it is an `<li>` · **D-3.28-9** statless squads are not emitted · **D-3.28-10** the generator owns the generated file's formatting · **D-3.28-11** table headers drop the orange bar.

---

## 6. Owed (register in `current-state.md`)

**OV-63** squad links are effectively inert (1 of 1.982) — keep or drop · **OV-64** 27 matches whose scorer figures read as goal counts · **OV-65** Аце must know these tables are not editable in Studio · **OV-66** Аце reads the grouping and columns on real pages; native read of the eight column heads.

⚠️ **The DoD item „Ace confirms cup and qualification matches belong in their own tables" is half unanswerable** — the qualification half is live and visible on four named seasons; **the cup half has nothing to confirm, because the book's season section records no cup ties at all.**

---

## 7. Out of scope — untouched, as instructed

The two new league tables („Втора и трета југословенска лига", „Прва македонска лига") were **not started**. Section `id`s and headings unchanged. `StandingsTable`, `SquadTable` and `PersonChip` remain legacy and unrendered — **none was resurrected**. No other season-page section, no archive index, `/statistika`, homepage, `/legendi` or „Разно".
