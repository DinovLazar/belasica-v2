# Part 3 · Phase 29 · Code — Completion Report

**Date:** 2026-08-18 · **Outcome (one line):** Three circulating claims were tested against evidence — two were false, one was true — and the project now has `docs/data-shapes.md`, a measured reference so the next brief cannot be written on a premise the data contradicts.

---

## 1. What shipped (plain language)

Nothing on the site changed. This phase stopped building and checked what was actually true, because three claims were in circulation that could not all hold at once.

Two of them were false. The schema was never broken — the Part-3 fields have been deployed all along, and the "missing fields" report came from reading a **stray second workspace** that still holds a two-parts-old model. And `current-state.md` on `main` was never stuck on Phase 1.01 — it was current. The third claim was true: **Cowork's 74 values are live and rendering**, 45 coaching spans and 29 service spans, on 74 person pages.

The lasting deliverable is `docs/data-shapes.md`: every field of every content type with a **real count beside it**, plus the six measurement traps that have each cost a phase. Three things previously written down turned out to be wrong and are corrected there.

---

## 2. Definition of Done

### Verifiable by the executor

- ✅ **Task 0's raw output is in the report and the three questions answered in plain words** — evidence: §9 below carries all six commands verbatim, and the answers are in §10.
- ✅ **If either PR was open, the phase stopped after Task 0 and no branch was created** — not applicable: **both were merged**, so the full brief ran. `gh pr list` shows #55 `MERGED 2026-08-18T00:02:10Z` and #56 `MERGED 2026-08-18T13:48:51Z`.
- ✅ **`npm run build` passes; page count stated and compared; the 659 / 330 discrepancy explained or flagged** — evidence: clean build after `rm -rf .next` reports `Generating static pages (0/329)`. **329 vs 3.28's 330 is fully explained** — one fewer person page after the Ефтимов unpublish (211 → 210 persons). **3.27's 659 is a different metric**, not a page count: 3.27's own report says "`/legendi/[slug]` yields 424 manifest entries = 211 person pages × 2 (html + rsc)", and 424 cannot be a page count when only 211 person pages exist. ⚠️ **The exact 659 is flagged as not reproducible** — this build emits 322 `.html` + 322 `.rsc` = 644 artefacts at 210 persons (646 at 211), leaving 13 unaccounted for. It should not be used as a baseline (D-3.29-3).
- ✅ **`tsc` clean, ESLint clean, prettier applied** — evidence: `npx tsc --noEmit` exit 0, no output; `npm run lint` no findings; `npx prettier --check` on this phase's four files → "All matched files use Prettier code style!" ⚠️ `00_stack-and-config.md` is flagged by prettier but was **not touched by this phase** (`git diff --name-only` does not list it) — a pre-existing warning, deliberately left alone per the "format only the paths the phase edited" rule.
- ✅ **No Sanity write; no `patch`, `create`, `createOrReplace` or `commit()` in the diff** — evidence: **the diff contains no code at all.** `git status --porcelain | grep -v '\.md$'` returns **0** — every changed file is markdown. All Sanity access this phase was GROQ reads and two `get_schema` calls.
- ✅ **No feature added; changes confined to `src/_project-state/`, `docs/`, and (only if needed) a schema redeploy** — evidence: `git diff --stat` = `current-state.md`, `decisions.md`, `file-map.md`, plus untracked `docs/data-shapes.md`. **No schema redeploy was needed or performed** (D-3.29-2).
- ⚠️ **The Cowork report is committed verbatim; `D-3.25-1…-6` logged; OV-30 resolved; new owed items on the register** — **partial, and this is the one task the phase could not close.** ✅ OV-30 is resolved on the register with live evidence. ✅ The owed items the brief names are added. ✅ **D-3.25-2 is logged** in full, from the reasoning the brief carries. ❌ **The report is not committed and D-3.25-1/-3/-4/-5/-6 are not logged, because the report text does not exist anywhere reachable** — see §4 and D-3.29-1. The five IDs are **reserved, not consumed**.
- ✅ **`current-state.md` describes the repo as Task 0 found it, NEXT line as specified** — evidence: first line now opens `NEXT: **3.30-Code — Репрезентативци, табела 2025/26 и список 135–161**`, states both PRs merged with their commits, and records that the Phase-1.01 premise was false. Stale "on branch" markers for 3.22/3.24/3.27 corrected to their merge commits; the 211-person and 659-page figures corrected throughout.
- ✅ **Task 3 states which workspace carries the Part-3 fields, with evidence** — §3 below, with the field lists from both manifests.
- ✅ **Task 4 gives counts and three quoted live URLs; the two Ефтимов status codes confirmed** — §4 below. 45 / 29, three URLs with quoted rendered text, 200 and 404 confirmed on both production and the preview.
- ✅ **`docs/data-shapes.md` exists and covers `person`, `season`, `photo` and the book files, with real counts — no field described without a number** — evidence: the file is 5 sections, ~15 tables; every field row carries an `n / total`.
- ✅ **Task 6's three descriptions are in the report with specific values, paths and strings; nothing implemented** — §6 below. Nothing from Task 6 reached Sanity, `src/` or `facts.md` (D-3.29-5).
- ✅ **One PR from `phase-3.29-reconciliation` → `main`; never committed to `main`; no secrets** — evidence: [PR #57](https://github.com/DinovLazar/belasica-v2/pull/57), commit `7fbd38f`. `main` untouched. The only identifiers in the diff are the public `projectId f8rmnfry` / `dataset production`, already public in `.env.example` and the built client bundle.
- ✅ **Vercel preview URL in the report with routes confirmed 200** — §5 below: **11/11 expected 200 and the one expected 404**.

### Owed to Lazar / Ace (unchanged — these are decisions, not tasks)

- ⏳ Lazar decides the 2025/26 table source — **now decidable**, §6.1 (OV-70).
- ⏳ Lazar decides whether to relabel the internationals' section — **now decidable**, §6.2 (OV-71).
- ⏳ Ace decides the appearances rule from the real distribution — **now decidable**, §6.3 (OV-57).
- ⏳ Ace supplies the 24 missing trainer spans and confirms the rest — 45 of 69 coaches carry one.

---

## 3. Task 3 — the schema, settled

`list_workspace_schemas` returns **three** entries for `f8rmnfry` / `production`:

| source          | workspace         | schemaId                                          |
| --------------- | ----------------- | ------------------------------------------------- |
| Studio-deployed | `default`         | `uEiDECR2xOtb6ioYwNlGPvtAavkBBV1ZUgQsVHxQ-Cq_TvQ` |
| Legacy          | **`belasica-v2`** | `_.schemas.belasica-v2`                           |
| Legacy          | `default`         | `_.schemas.default`                               |

**Workspace `belasica-v2` — the real one — carries all three Part-3 fields:**

`name` · `slug` · `role` · `playingYears` · **`trainerYears`** · **`officialYears`** · `legendRank` · `legendAppearances` · `bio` · `careerStats{appearances, goals}` · **`nationalStats{appearances, goals, sourceNote}`**

**Workspace `default` — the stray one — carries the pre-2.02 model:**

`fullName` · `slug` · `roles` · `bio` · `source` · `verified`

— and **none** of `playingYears`, `trainerYears`, `officialYears`, `legendRank`, `legendAppearances`, `careerStats`, `nationalStats`.

**Verdict: nothing is broken, and nothing was redeployed.** The finding is exactly what D-2.01-8 warned about, and the mechanism is now named: **`get_schema` defaults to `workspaceName: "default"`**, so any read that omits the parameter silently returns the stale manifest. That is almost certainly how Cowork came to report `fullName`/`roles` present and the three fields missing — those are precisely the `default` field names. Recorded as trap 1 in `docs/data-shapes.md` §5 so the scare cannot recur (D-3.29-2).

---

## 4. Task 4 — the 74 values render

**Counts (GROQ, `perspective: "published"`):** `trainerYears` **45** · `officialYears` **29** — exactly the expected figures. **No person carries both**, so 45 + 29 = **74 people carry exactly one span**, and the built output confirms it: **74** person pages contain a „Периоди" block, of which **29** contain „Раководство" — leaving 45 with „Тренер".

**Three live URLs, with the rendered text quoted** (production; identical on the preview):

| URL                         | rendered                                    |
| --------------------------- | ------------------------------------------- |
| `/legendi/panche-pantaziev` | „Периоди · **Тренер** · **1994–1996**"      |
| `/legendi/blagoj-gucev`     | „Периоди · **Тренер** · **2022–2023**"      |
| `/legendi/aleksandar-tenev` | „Периоди · **Раководство** · **1982–1983**" |

**The Ефтимов merge:** `/legendi/tome-eftimov` → **200**; `/legendi/tomche-eftimov` → **404**, on both production and the preview. **Nothing links to the 404:** `grep -ro "/legendi/tomche-eftimov" .next/server/app/` returns **0**, and the sitemap holds **0**. The string `tomche-eftimov` does appear twice in the built output, both inside `tome-eftimov.html`/`.rsc` — it is the photo document's `_id` (`portrait-person-tomche-eftimov`) used as a React key, **not an href**.

**The 2022/23 photo:** `/arhiva/2022-23` renders the caption „Фудбалерите на Беласица, сезона 2022/23", and the `/arhiva` index card carries the same string as its `alt`. Both confirmed on the deployed site.

**No `0` and no dash where a value is simply absent** — measured, not assumed. 25 players carry `careerStats.appearances` with no `goals`. On `aleksa-pandev-lece` and `aleksandar-stojanov` the built HTML contains **„Настапи" ×3 and „Голови" ×0**; on `petar-andreev`, who has both, it contains **×3 and ×3**. The guards are `!= null` throughout and `FigureGroup` returns `null` on an empty group, so an absent figure removes its tile rather than printing a zero.

⚠️ **Two residues of the merge, both new owed items.** The surviving page renders an `<h1>` of „Томе Ефтимов" above a portrait captioned **„Томче Ефтимов"** — the retired spelling (**OV-67**). And „Томче" was **unpublished, not deleted**: `drafts.person-tomche-eftimov` still exists carrying **`legendRank 9`**, the same rank the surviving record now holds, so publishing it would duplicate the rank (**OV-68**).

---

## 5. Changed files / deliverables

**Branch** `phase-3.29-reconciliation` · **commit** `7fbd38f` · **[PR #57](https://github.com/DinovLazar/belasica-v2/pull/57)** → `main`.

- **New:** `docs/data-shapes.md` — the measured reference.
- **Edited:** `src/_project-state/current-state.md` (NEXT line, phase status markers, stale counts, OV-30 resolved, OV-67…OV-71 added), `src/_project-state/decisions.md` (D-3.25-2 and D-3.29-1…-5 appended), `src/_project-state/file-map.md` (the new doc).
- **Untouched:** `00_stack-and-config.md` — **correctly**, since no dependency, version or config value changed.

**Vercel preview:** https://belasica-v2-h4cp51f63-sunset-services-team.vercel.app — **11/11 expected 200** (`/`, `/legendi`, `/legendi/tome-eftimov`, `/legendi/panche-pantaziev`, `/legendi/blagoj-gucev`, `/legendi/aleksandar-tenev`, `/arhiva`, `/arhiva/2022-23`, `/arhiva/2025-26`, `/statistika`, `/razno`) and **`/legendi/tomche-eftimov` → 404 as intended**. The three spans and „210 личности" re-confirmed on the deployed preview.

**No secrets.** The only identifiers named are the public `projectId f8rmnfry` and `dataset production`.

---

## 6. Task 6 — described, measured, and deliberately not built

### 6.1 The 2025/26 final table (**OV-70**)

**The field is `season.finalTable`** — an `array` of `tableRow`: `position` · `club` (string) · `played` · `wins` · `draws` · `losses` · `goalsFor` · `goalsAgainst` · `points`. **92 of 96 seasons carry it**, all non-empty; the four without are `1922-26`, `1936-37`, `1942` and `2025-26`.

**It holds one row per season — Belasica's own — never a full league table.** The 1992/93 precedent Cowork cited, quoted verbatim from the dataset:

```json
{
  "_key": "belasica-1992-93",
  "_type": "tableRow",
  "club": "ФК Беласица",
  "position": 9,
  "played": 34,
  "wins": 12,
  "draws": 10,
  "losses": 12,
  "goalsFor": 41,
  "goalsAgainst": 44,
  "points": 34
}
```

**A Belasica-only row derived from 2025/26's own archived results.** The season document already holds **33 `results` blocks**, opening „Втора македонска лига, резултати и стрелци." Parsing them (3 are headers — the title, „Есенска полусезона:", „Пролетна полусезона:") gives **30 matches** and:

> **P 30 · W 18 · D 4 · L 8 · 57:21**

The season is **complete**: 15 home and 15 away against **15 distinct clubs**, a full double round-robin. (There are 19 opponent _strings_ — four clubs are spelled two ways: `Слога (В)`/`Слога (Вин)`, `Шкендија`/`Шкендија (А)`, `Победа (Пр)`/`Победа (Прил)`, `Брегалница (Ш)`/`Брегалница`.)

⚠️ **Two reasons this is Lazar's decision and not an executor's.**

1. **The points depend on an era rule the data does not record.** 1992/93's stored `points: 34` is exactly `12×2 + 10` — **two points for a win**; a 3-point reading would give 46. So the 92 rows already in `finalTable` are Yugoslav-era scoring. The 2025/26 row is **58 points at 3-1-0** or **40 at 2-1-0**, and `finalTable` carries no field to say which was used.
2. **`position` cannot be derived at all.** The archive holds no other club's 2025/26 results, and `data/book/master-table.json` has **no 2025 row** — the book ends before this season.

### 6.2 The internationals (**OV-71**)

**`nationalStats` is empty on all ten — confirmed**, and in fact on all 210 people: `appearances`, `goals` and `sourceNote` are each **0 / 210**.

**Consequence the brief did not assume: neither surface renders today.** `FigureGroup` returns `null` when its figures array is empty (`src/app/(site)/legendi/[slug]/page.tsx:492`), and the card line guards on the same object. So „Цела кариера" is currently **invisible everywhere**, and relabelling it changes source strings only.

**The exact strings that would change:**

| file · line                                  | current text                  |
| -------------------------------------------- | ----------------------------- |
| `src/app/(site)/legendi/[slug]/page.tsx:371` | `label="Цела кариера"`        |
| `src/components/legends/LegendCard.tsx:305`  | `Цела кариера: {wholeCareer}` |

The Studio field titles would follow: „Статистика од целата кариера", „Настапи (цела кариера)", „Голови (цела кариера)" (`src/sanity/schemaTypes/person.ts:162–176`).

⚠️ **The relabel is not cosmetic — it changes what the number means.** „Цела кариера" is every club plus the national team; „За репрезентацијата" is caps only. **Deciding before the data is entered is much cheaper than after**, because the figures Ace supplies must match whichever claim the heading makes.

### 6.3 The appearances table (**OV-57**)

Population: `"player" in role && defined(careerStats.appearances)` = **119 players**. Rule: `APPEARANCE_MIN = 46` at `src/app/(site)/statistika/page.tsx:67`.

**Current row count: 116.**

| threshold          | rows    |     | threshold | rows   |
| ------------------ | ------- | --- | --------- | ------ |
| **≥ 46 (current)** | **116** |     | ≥ 130     | **48** |
| ≥ 100              | 63      |     | ≥ 131     | **46** |
| ≥ 120              | 52      |     | ≥ 134     | 44     |
| ≥ 125              | 51      |     | ≥ 135     | 41     |
| ≥ 126              | 51      |     | ≥ 150     | 33     |
| ≥ 127              | 49      |     | ≥ 200     | 17     |

⚠️ **No threshold yields exactly 47.** The nearest are **130 → 48** and **131 → 46**; two players sit on 130 and the cut cannot split them. If Ace wants "about 47", **130** is the closest.

---

## 7. State updates done

- ✅ `current-state.md` — NEXT line set to `3.30-Code — Репрезентативци, табела 2025/26 и список 135–161`; the snapshot now records both PRs merged with their commits, that the Phase-1.01 premise was false, that the schema is healthy, and what 3.24 / 3.25-Cowork / 3.27 / 3.28 actually shipped. Stale "on branch" markers and the 211-person / 659-page figures corrected. **OV-30 resolved**, OV-60 marked partially resolved, **OV-67…OV-71 added**.
- ✅ `file-map.md` — `docs/data-shapes.md` added.
- ✅ `00_stack-and-config.md` — **deliberately unchanged**: no dependency, version or config value moved.
- ✅ `decisions.md` — **D-3.25-2** (Cowork's, attributed) and **D-3.29-1…-5** appended.

---

## 8. Risks, follow-ups, what the next phase needs to know

1. ⚠️ **Task 1 is open and belongs to Lazar.** The 3.25-Cowork report must be pasted so it can land on this branch **before merge**, and the five reserved IDs filled. **Do not reuse `D-3.25-1`, `-3`, `-4`, `-5`, `-6`.**
2. ⚠️ **`get_schema` defaults to the wrong workspace.** Always pass `workspaceName: "belasica-v2"`. This one default has now cost a phase.
3. ⚠️ **Three previously recorded claims are corrected in `docs/data-shapes.md`** — future work should read it, not the older notes: `resultsProvenance` is **not a Sanity field at all** (book-only, 96/96, so its GROQ count of 0 means _absent_); `season.squad` and `season.trainers` are **1 of 96** each and effectively dead — do not model new work on them; and **no squad row carries a `position` field**, correcting D-3.28-9 — the position is a word inside the `player` string on 28 of 2 170 rows, and of the ten statless seasons **only 2025/26** has them.
4. ⚠️ **Season titles carry their quote marks in the data.** 95 of 96 are stored as `„Сезона 2022/23“`; only `1992-93` is bare. Anything that prints or matches a title inherits them. **Do not count this with GROQ `match`** — it ignores punctuation and returns 96/96.
5. **The build baseline is now 329 pages.** Compare against the `Generating static pages` number, never 3.27's 659.
6. **3.30's own premises are now measured** — the roster is **210** (not 211, not 160), the bands are **138 · 68 · 29 · 10**, and the appearances table holds **116 of 119**. A brief written from `docs/data-shapes.md` should not need a fourth correction.

---

## 9. Task 0 — raw command output

```
$ git fetch --all --prune
From https://github.com/DinovLazar/belasica-v2
 - [deleted]         (none)     -> origin/fix-transparent-hero-crests

$ git log --oneline origin/main | head -20
a3b8154 Фаза 3.28 — Резултати и состав како табели, од податоците на книгата (#56)
6010a2c Фаза 3.27 — Профили по улога: три нови полиња и приказ што одговара на страницата (#55)
f1fab83 Фаза 3.24 — Пет ситни поправки: лајтбокс, две врски на почетната, праг кај настапите (#54)
494b061 fix(почетна): трите грба во заглавието се без позадина (#53)
8f739f1 Install Vercel Web Analytics (#52)
5ab3932 fix(легенди): притисок на таб враќа нагоре до портокаловата линија
2dce559 Фаза 3.23 — Ревизија на целиот сајт: аудит, поправки и завршни детали (#51)
d522b25 Фаза 3.22 — „Легенди": четири категории со табови, вкрстено наведување, две поправки во редоследот (#50)
525890f Фаза 3.21 — Тренери по сезони во facts.md, шест одлуки D-3.21
23b642a Фаза 3.20 — „Разно": фотографии кај сите седум теми (#49)
0357cc1 Фаза 3.19 — Три знаменца во заглавието, натпревари кај сите играчи, скок-лента во „Разно", поправен лајтбокс (#48)
b036b98 Фаза 3.17 — Скок-ленти на „Легенди“ и „Статистика“, копче „Назад на врвот“, прередена статистика, стартна единаесторка (#47)
a338fa7 Фаза 3.16 — „Разно": седум теми од историјата на Беласица (#46)
ff3aed7 Фаза 3.15 — „За нас", авторски права во подножјето, социјални мрежи, рангирани легенди, нула placeholder-и (#45)
cc4214c Фаза 3.14 — Четири исправки на етикети и содржина (#44)
13417bf Фаза 3.13 — Преименување на две секции во сезоната + хронолошки редослед на тренерите и раководството (#43)
6749a6f 3.11b — Пуштен fill-season-content --commit: 96 приказни и 95 листи резултати се живи (#42)
19cf811 Фаза 3.12 — Биографии од книгата, рангирање по настапи, праг од 21 гол, четири фотографии, Фејсбук во подножјето
c424b3a Phase 3.11 — Книгата на Аце како податоци + скрипта за пополнување по сезони (#41)
7ef3547 data: извлечени сезонски податоци од книгата на Аце Стојанов

$ git branch -a
  chore-crest-logo
  data-book-season-extraction
* main
  phase-1.05-homepage
  phase-1.05.2-homepage-content-sync
  phase-1.06-verification
  phase-2.07-contact-page
  phase-2.09-content-ingestion
  phase-2.09-run-ingestion
  phase-3.04-season-redesign
  phase-3.04b-season-consistency
  phase-3.05a-direction-exploration
  phase-3.06a-crest-legends-seasons
+ phase-3.07-legal-page
  phase-3.09-perf-a11y
  phase-3.11-book-data-drop
  phase-3.11b-season-content-committed
  phase-3.19-ace-feedback-ui
  phase-3.20-razno-photos
  phase-3.22-legendi-categories
  phase-3.24-quick-fixes
+ phase-3.27-role-scoped-profiles
  phase-3.28-season-tables
  remotes/origin/HEAD -> origin/main
  remotes/origin/chore-crest-logo
  remotes/origin/data-book-season-extraction
  remotes/origin/main
  remotes/origin/phase-1.05-homepage
  remotes/origin/phase-1.05.2-homepage-content-sync
  remotes/origin/phase-1.06-verification
  remotes/origin/phase-2.07-contact-page
  remotes/origin/phase-2.09-content-ingestion
  remotes/origin/phase-2.09-run-ingestion
  remotes/origin/phase-3.06a-crest-legends-seasons
  remotes/origin/phase-3.07-legal-page
  remotes/origin/phase-3.09-perf-a11y
  remotes/origin/phase-3.11-book-data-drop
  remotes/origin/phase-3.11b-season-content-committed
  remotes/origin/phase-3.13-section-names-staff-order
  remotes/origin/phase-3.19-ace-feedback-ui
  remotes/origin/phase-3.20-razno-photos
  remotes/origin/phase-3.22-legendi-categories
  remotes/origin/phase-3.24-quick-fixes
  remotes/origin/phase-3.27-role-scoped-profiles
  remotes/origin/phase-3.28-season-tables

$ gh pr list --state all --limit 10
56  Фаза 3.28 — Резултати и состав како табели, од податоците на книгата   phase-3.28-season-tables         MERGED  2026-08-18T13:48:51Z
55  Фаза 3.27 — Профили по улога: три нови полиња и приказ што одговара…   phase-3.27-role-scoped-profiles  MERGED  2026-08-18T00:02:10Z
54  Фаза 3.24 — Пет ситни поправки: лајтбокс, две врски на почетната…      phase-3.24-quick-fixes           MERGED  2026-08-17T22:56:11Z
53  Трите грба во заглавието на почетната се без позадина                  fix-transparent-hero-crests      MERGED  2026-08-17T17:25:45Z
52  Install Vercel Web Analytics                          vercel/install-vercel-web-analytics-y7vobw  MERGED  2026-08-17T16:41:55Z
51  Фаза 3.23 — Ревизија на целиот сајт: аудит, поправки и завршни детали  phase-3.23-audit-and-finishing   MERGED  2026-08-14T10:31:27Z
50  Фаза 3.22 — „Легенди": четири категории со табови…                     phase-3.22-legendi-categories    MERGED  2026-08-12T05:23:18Z
49  Фаза 3.20 — „Разно": фотографии кај сите седум теми                    phase-3.20-razno-photos          MERGED  2026-08-11T08:01:35Z
48  Фаза 3.19 — Три знаменца во заглавието, натпревари кај сите играчи…    phase-3.19-ace-feedback-ui       MERGED  2026-08-11T07:19:27Z
47  Фаза 3.17 — Скок-ленти на „Легенди“ и „Статистика“…                    phase-3.17-navigation-and-order  MERGED  2026-08-09T02:36:53Z

$ git log --oneline origin/main..HEAD
(no output)

$ head -1 src/_project-state/current-state.md
NEXT: **3.25-Cowork — Слики, сезона 2025/26 и податоци за личности**. — Phase **3.28-Code
(Резултати и состав како табели, од податоците на книгата)** is COMPLETE on branch
`phase-3.28-season-tables`. …
```

Supporting: `git rev-parse HEAD origin/main` → both `a3b81541cf8738dfdb0cb11e57af74acd4cc7d29`; `git status --short` → clean.

---

## 10. Task 0 — the three questions, answered plainly

**1. Are PR #55 and PR #56 merged?**

**Yes, both.** #55 (3.27) merged as **`6010a2c`** on 2026-08-18T00:02:10Z; #56 (3.28) merged as **`a3b8154`** on 2026-08-18T13:48:51Z. `origin/main` is at `a3b8154` — the 3.28 merge is the tip. The local checkout was already exactly there, with a clean tree and nothing unpushed, so the full brief ran.

**2. What does the first line of `current-state.md` on `origin/main` actually say?**

It opens:

> `NEXT: **3.25-Cowork — Слики, сезона 2025/26 и податоци за личности**. — Phase **3.28-Code (Резултати и состав како табели, од податоците на книгата)** is COMPLETE on branch `phase-3.28-season-tables`.`

**3. Is the branch history damaged?**

**No — the premise was false, so there is nothing to investigate.** The claim was that `current-state.md` on `main` still read "Phase 1.01, dated 14 July" while 3.23's PR #51 was recorded as merged. It does not. `git show origin/main:src/_project-state/current-state.md` opens on `NEXT: 3.25-Cowork` and describes 3.28 as complete — which is **ahead of** #51, not behind it. The file is current and consistent with the log: #51 (`2dce559`), #54 (`f1fab83`), #55 (`6010a2c`) and #56 (`a3b8154`) all sit on `main` in order.

The only thing the first line got wrong was **tone, not history**: it described 3.27 and 3.28 as "COMPLETE on branch", written before their PRs merged and never updated afterwards. That is a stale status marker, not damaged history, and this phase corrected it. **Nothing was repaired, because nothing was broken.**

---

## 11. Decisions I made during this phase

All five are logged in `decisions.md`.

- **D-3.29-1 · Did not commit the Cowork report, and logged only one of its six decisions.** The report text does not exist anywhere reachable. Alternative rejected: reconstruct it from the dataset — "verbatim" cannot be satisfied by a reconstruction, and a report attributed to Cowork that Cowork did not write is precisely what `CLAUDE.md` §Content truth forbids. Also rejected: stub entries for the six IDs, which would permanently consume them in an append-only log. **Decision-log entry: YES.**
- **D-3.29-2 · Redeployed nothing.** `belasica-v2` is healthy; the drift was the stray `default` workspace and `get_schema`'s default. Alternative rejected: a "harmless" no-op redeploy — the brief permits one only if the deployment genuinely failed. **YES.**
- **D-3.29-3 · Recorded 659 and 330 as different metrics, and flagged 659 as not reproducible** rather than forcing a reconciliation. Alternative rejected: calling 659 → 330 a regression, which no removed route supports. **YES.**
- **D-3.29-4 · Counted non-null throughout, stated the method in the file, and put it in `docs/`.** Alternative rejected: a committed generator script — this phase adds no code, and a generator implies a maintenance contract nobody agreed to. **YES.**
- **D-3.29-5 · Computed Task 6's two derivable values in the scratchpad and wrote none of them anywhere.** Alternative rejected: patching the derived row into `season.finalTable`, which the phase forbids and which the scoring-rule ambiguity makes unsafe regardless. **YES.**

---

## 12. Deviations from the brief / spec

1. **Task 1 is incomplete** — the report was not committed and five decisions were not logged, because the source text does not exist. Everything else in Task 1 was done (OV-30 resolved, D-3.25-2 logged, owed items added). Recorded as **OV-69** and D-3.29-1. **This is the one deliverable this phase owes.**
2. **`00_stack-and-config.md` was left with a pre-existing prettier warning.** Task 7 says to touch it only if a version or config value changed; none did. Formatting an untouched file would have put unrelated churn in a verification phase's diff.
3. **The brief's framing of two premises was itself wrong, and the report says so rather than working around it.** The Phase-1.01 `current-state.md` claim and the schema-drift claim were both false. Confirming a premise false _was_ the task, so this is a finding rather than a deviation — but it is stated plainly because two of the three claims the phase was convened to test did not survive.

---

## 13. What's now possible that wasn't before

The next brief can be written from measured numbers instead of remembered ones — and the three decisions blocking 3.30 are now decisions rather than research.
