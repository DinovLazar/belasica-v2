# data-shapes.md — what the data actually is

> **Written at Phase 3.29 (2026-08-18). Read-only reference — no code depends on this file.**
>
> **Why it exists.** Three consecutive briefs carried premises the data contradicted: a row
> count off by 48, a roster off by 51 people, and a competition axis that does not exist.
> Each was caught only because the executor measured before writing code. This file removes
> the cause: **every field below has a number beside it.**
>
> **Method.** Sanity counts are GROQ against `projectId f8rmnfry` / `dataset production` /
> `perspective published` — the same perspective the site reads. Book counts are non-null
> counts over `data/book/*.json` (these files use explicit `null`, so a naïve key count
> returns 100 % for every field and is worthless — see the trap at the bottom).
>
> **Re-measure, don't trust.** These numbers were true on 2026-08-18. Anything that says
> „as of" is a snapshot. Re-run before building on it.

---

## 0 · The dataset at a glance

**2 442 published documents.**

| `_type`             | count | notes                                                                                                                                                                  |
| ------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `photo`             | 1 054 |                                                                                                                                                                        |
| `sanity.imageAsset` | 1 051 | system type. All 1 054 photos carry an asset ref, resolving to **1 051 distinct** assets — three photos reuse an asset another photo already uses                      |
| `person`            | 210   |                                                                                                                                                                        |
| `season`            | 96    |                                                                                                                                                                        |
| `clubRecord`        | 30    |                                                                                                                                                                        |
| `siteSettings`      | 1     |                                                                                                                                                                        |
| `match`             | **0** | ⚠️ the type is defined in `src/sanity/schemaTypes/match.ts` and deployed, and **no document of it exists**. The 2 267 book matches live in `data/book/`, not in Sanity |

**Two deployed schema workspaces exist and they are not the same schema.** See §5 — this is
the single most expensive trap in the project.

---

## 1 · `person` — 210 published documents

Fields as deployed to workspace **`belasica-v2`** (the real one). Eleven fields, no more.

| field               | type                | carried       |
| ------------------- | ------------------- | ------------- |
| `name`              | `string` (required) | **210 / 210** |
| `slug`              | `slug` (required)   | **210 / 210** |
| `role`              | `array<string>`     | **210 / 210** |
| `bio`               | `array<block>`      | **210 / 210** |
| `playingYears`      | `string`            | **145 / 210** |
| `legendRank`        | `number`            | **162 / 231** |
| `careerStats`       | `object`            | **132 / 210** |
| `legendAppearances` | `string`            | **90 / 210**  |
| `trainerYears`      | `string`            | **45 / 210**  |
| `officialYears`     | `string`            | **29 / 210**  |
| `nationalStats`     | `object`            | **0 / 210**   |

Sub-objects:

| path                        | type     | carried       |
| --------------------------- | -------- | ------------- |
| `careerStats.appearances`   | `number` | **119 / 210** |
| `careerStats.goals`         | `number` | **94 / 210**  |
| `nationalStats.appearances` | `number` | **0 / 210**   |
| `nationalStats.goals`       | `number` | **0 / 210**   |
| `nationalStats.sourceNote`  | `string` | **0 / 210**   |

⚠️ **`nationalStats` is empty on every person, including all ten Репрезентативци.** It was
added at 3.27 and shipped deliberately empty (D-3.27-5). Consequence: the „Цела кариера"
figure group and the card's „Цела кариера: …" line **render nowhere today** — both guard on
`nationalStats` and `FigureGroup` returns `null` on an empty group.

### `role` — the only enumerable field

`array<string>`, schema list of exactly three values.

| value       | count   |
| ----------- | ------- |
| `player`    | **152** |
| `trainer`   | **68**  |
| `president` | **29**  |

Sum 249 across 210 documents. Cardinality: **171** people carry exactly one role, **39**
carry two, **0** carry three.

### `legendRank`

**162 of 231** carry it (re-measured 2026-08-22). All 162 also carry `player` in `role`; **0**
ranked people lack the player role. Values are Аце's all-time appearance ranking.

**UNIQUE since D-RANKS-1** — 162 people, 162 distinct values, min **1**, max **163**, and **161**
is the only empty slot in that range (reserved for З. Ивановски, OV-81). Ties no longer exist:
where Аце's competition-style list gave four men rank 135 and resumed at 139, each now holds his
own number inside that same span, ordered alphabetically. ⚠️ That within-group order is
**DERIVED**, not stated by Аце — see `facts.md`. Uniqueness is validated in Studio but **not** by
the HTTP mutate API; re-check `count(*[defined(legendRank)])` against
`count(array::unique(*[defined(legendRank)].legendRank))` after any bulk write.

### The four „Легенди" bands, as the site actually computes them

Live on `/legendi`, heading reads **„231 личности"**.

| tab             | rule                  | source             | count   |
| --------------- | --------------------- | ------------------ | ------- |
| Играчи          | `defined(legendRank)` | Sanity             | **162** |
| Тренери         | `"trainer" in role`   | Sanity             | **68**  |
| Претседатели    | `"president" in role` | Sanity             | **29**  |
| Репрезентативци | membership list       | **code, not data** | **10**  |

⚠️ **Репрезентативци is not a field and cannot be queried.** It is
`INTERNATIONAL_SLUGS` — a hardcoded ordered array of 10 slugs at
[src/content/legendi.ts:36](../src/content/legendi.ts). **The order is Ace's own numbering
and carries meaning**, which is why 3.27 refused to replace it with a boolean (D-3.27-1).
The ten: `goran-pandev`, `aco-stojkov`, `goran-popov`, `robert-popov`, `igor-gjuzelov`,
`panche-stojanov`, `deni-masev-dancho-masev`, `zoran-baldovaliev`, `nikola-tanushev`,
`toni-banduliev`.

Bands overlap and do not sum to 210 (138 + 68 + 29 + 10 = 245). Nobody is in zero bands.

### Appearances distribution — for any threshold decision

Population: `"player" in role && defined(careerStats.appearances)` = **119 players**.
Current display rule `APPEARANCE_MIN = 46` at
[src/app/(site)/statistika/page.tsx:67](<../src/app/(site)/statistika/page.tsx>).

| threshold        | rows    |
| ---------------- | ------- |
| ≥ 46 _(current)_ | **116** |
| ≥ 100            | 63      |
| ≥ 120            | 52      |
| ≥ 125            | 51      |
| ≥ 126            | 51      |
| ≥ 127            | 49      |
| ≥ 130            | **48**  |
| ≥ 131            | **46**  |
| ≥ 134            | 44      |
| ≥ 135            | 41      |
| ≥ 150            | 33      |
| ≥ 200            | 17      |

⚠️ **No threshold yields exactly 47.** 130 → 48 and 131 → 46; the two players on 130 are a
tie the cut cannot split. Top of the distribution: 555, 383, 366, 336, 328, 262, 261, 260,
239, 235.

---

## 2 · `season` — 96 published documents

| field               | type                 | carried                               |
| ------------------- | -------------------- | ------------------------------------- |
| `title`             | `string`             | **96 / 96**                           |
| `slug`              | `slug`               | **96 / 96**                           |
| `decade`            | `number`             | **96 / 96**                           |
| `story`             | `array<block>`       | **96 / 96**                           |
| `results`           | `array<block>`       | **96 / 96**                           |
| `finalTable`        | `array<tableRow>`    | **92 / 96**                           |
| `tablePhoto`        | `reference → photo`  | **88 / 96**                           |
| `teamPhoto`         | `reference → photo`  | **84 / 96**                           |
| `lineupAndStats`    | `array<block>`       | **84 / 96**                           |
| `trainer`           | `string`             | **72 / 96**                           |
| `squad`             | `array<squadMember>` | **1 / 96**                            |
| `trainers`          | `array`              | **1 / 96**                            |
| `resultsProvenance` | —                    | ⚠️ **not a field at all** — see below |

⚠️ **`resultsProvenance` does not exist in the Sanity `season` schema.** It exists only in
`data/book/season-content.json`, where all 96 seasons carry it. It was never migrated. A
GROQ query for it returns 0 because the field is absent, not because the values are missing.

⚠️ **`squad` and `trainers` are effectively dead: 1 of 96 each** (both on `1992-93`). The
season page's squad comes from `lineupAndStats` prose and, since 3.28, from the generated
`src/content/season-tables.ts`. Do not model new work on `season.squad`.

### `finalTable` — the field a 2025/26 table would use

`array` of `tableRow` objects. Nine fields, all `number` except `club`:

`position` · `club` (`string`) · `played` · `wins` · `draws` · `losses` · `goalsFor` ·
`goalsAgainst` · `points`

**92 of 96 seasons carry it, all non-empty.** The four without: `1922-26`, `1936-37`,
`1942`, `2025-26`.

**It holds one row per season — Belasica's own — never a full league table.** The 1992/93
precedent, verbatim:

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

⚠️ **The stored `points` are era-specific.** 12 W · 10 D = 34 points is **2 points for a
win**, the Yugoslav-era rule (12×2 + 10 = 34; a 3-point reading would give 46). Any modern
season's row computed with 3-1-0 is **not** arithmetically comparable to the 92 rows already
stored. `finalTable` records no scoring rule, so nothing in the data flags the difference.

### `decade`

| value | seasons |
| ----- | ------- |
| 1920  | 2       |
| 1930  | 10      |
| 1940  | 6       |
| 1950  | 12      |
| 1960  | 10      |
| 1970  | 10      |
| 1980  | 10      |
| 1990  | 10      |
| 2000  | 10      |
| 2010  | 10      |
| 2020  | 6       |

### `title` — 95 of 96 carry decorative quotes

**95 of 96** titles are wrapped in `„…“` — e.g. `„Сезона 2022/23“`, `„Беласица 1926–1930“`.
The lone exception is `1992-93`, stored bare as `Сезона 1992/93`. The quotes are **inside the
stored string**, not added by the template, so they reach every surface that prints a title.

⚠️ Do not use GROQ `match "*„*"` to count this — `match` tokenizes and ignores punctuation;
it returns 96/96. Count client-side with `String.includes`.

---

## 3 · `photo` — 1 054 published documents

| field           | type                 | carried           |
| --------------- | -------------------- | ----------------- |
| `image`         | `image`              | **1 054 / 1 054** |
| `provenance`    | `string`             | **1 054 / 1 054** |
| `relatedSeason` | `reference → season` | **887 / 1 054**   |
| `caption`       | `string`             | **174 / 1 054**   |
| `relatedPerson` | `reference → person` | **167 / 1 054**   |
| `date`          | `date`               | **29 / 1 054**    |

**Every photo carries exactly one relation.** 887 + 167 = 1 054; **0** carry both and **0**
carry neither. A photo is a season photo or a person photo, never mixed and never orphaned.

`caption` is the sparse one — **84 % of photos have none.** Any surface that prints a caption
must handle its absence.

⚠️ **A photo's `_id` can outlive the person it was named for.** `portrait-person-tomche-eftimov`
now points at `person-tome-eftimov` (OV-30's merge), and its `caption` still reads
„Томче Ефтимов" — so `/legendi/tome-eftimov` renders an `<h1>` of „Томе Ефтимов" above a
photo captioned „Томче Ефтимов". The id is a key, not a link; the caption is a visible defect.

---

## 4 · The book data — `data/book/*.json`

Extracted from „ФК Беласица – гордоста на Струмица" (Аце Стојанов, финална верзија
04.10.2025). **Data, not code** — nothing in `src/` imports it. `src/content/season-tables.ts`
is _generated_ from it by `scripts/build-season-tables.mjs`.

### `matches.json` — `{ matchCount: 2267, matches: [2267] }`

Match row, **non-null** counts:

| field                           | type   | non-null  |
| ------------------------------- | ------ | --------- |
| `seasonId`                      | string | 2 267     |
| `order`                         | number | 2 267     |
| `homeTeam` `awayTeam`           | string | 2 267     |
| `homeGoals` `awayGoals`         | number | 2 267     |
| `score`                         | string | 2 267     |
| `venue`                         | string | 2 267     |
| `opponent`                      | string | 2 267     |
| `belasicaGoals` `opponentGoals` | number | 2 267     |
| `result`                        | string | 2 267     |
| `sourceLine`                    | string | 2 267     |
| `opponentKey`                   | string | 2 266     |
| `competition`                   | string | **2 252** |
| `competitionType`               | string | **2 252** |
| `phase`                         | string | **2 133** |
| `scorers`                       | array  | **1 474** |
| `stage`                         | string | **53**    |
| `notes`                         | array  | **31**    |
| `date`                          | string | **21**    |
| `round`                         | number | **12**    |
| `month`                         | string | **1**     |

⚠️ **There is no cup axis.** `competitionType` has exactly **two** distinct values:
`"league"` on **2 252** rows and `null` on **15**. Not one row is typed as a cup. A brief that
assumes a league/cup split is assuming a field that does not exist. (The rows matching
/куп/ are the opponent **Шкупи**.)

⚠️ **`competition` is 31 league _names_, not categories** — `Прва македонска лига` 1 203,
`Втора македонска лига` 266, `Трета македонска лига – исток` 133,
`Втора македонска лига – исток` 128, `Втора југословенска лига – исток` 102,
`Штипски потсојуз` 87, `Втора југословенска лига` 72,
`Трета југословенска лига – исток` 63, `Македонска лига` 47, then 22 names under 25 rows
each, down to singletons.

`stage` — **53 rows over 10 distinct values** (2 214 `null`):

| value                                          | rows |
| ---------------------------------------------- | ---- |
| `Квалификации, резултати и стрелци`            | 10   |
| `Полуфинале`                                   | 8    |
| `Финале`                                       | 8    |
| `Квалификации за Македонска лига`              | 6    |
| `Квалификации за 4 зона`                       | 6    |
| `Бараж`                                        | 5    |
| `Квалификации, есен 1950`                      | 4    |
| `полуфинале` _(lowercase — a second spelling)_ | 2    |
| `Квалификации за Втората сојузна лига- исток`  | 2    |
| `Квалификации за Првата македонска лига`       | 2    |

⚠️ **`round` („Коло") exists on 12 of 2 267 rows.** Any round column self-omits on virtually
every season page.

### `seasons.json` — `{ seasonCount: 96, matchCount: 2267, seasons: [96] }`

Season object, non-null counts: `_type` `_id` `id` `startYear` `club` `title` `headline`
`derivedRecord` `story` `storyText` `storyWordCount` `matchCount` all **96 / 96**;
`officialRecord` **91**; `league` **90**; `competitions` **90**; `matches` **92**;
`squad` **83**; `topScorers` **78**; `otherLines` **43**; `photoCaptions` **25**;
`staffAndNotes` **5**; `tables` **2**.

Squad row — **2 170 rows across 83 seasons**:

| field                  | type   | non-null       |
| ---------------------- | ------ | -------------- |
| `no`                   | number | 2 170          |
| `player`               | string | 2 170          |
| `sourceLine`           | string | 2 170          |
| `goals`                | number | **1 980**      |
| `starts` `subs` `apps` | number | **1 794** each |

⚠️ **There is no `position` field on a squad row** — not one of the 2 170 rows has the key.
A position word appears _inside the `player` string_ on **28 of 2 170** rows, in two
formats: `"Ѓ. Шопов (голман)"` (parenthetical, 2 rows) and
`"Трајков Ѓорѓи 2004 голман"` (name · birth year · position, 26 rows). This corrects
D-3.28-9, which described the ten statless seasons as holding „a position": **ten seasons
have a squad with no `apps` and no `goals` on any row** (`1942`, `1943/44`, `1945/48`,
`1948/49`, `1951`, `1952`, `1952/53`, `1955/56`, `2012/13`, `2025/26` — 188 rows), and of
those ten **only `2025/26` carries position words**, on all 26 of its rows. The other nine
carry none.

### `master-table.json` — `{ rowCount: 107, totals, rows: [107] }`

Row: `season` `league` `finalPosition` (strings) · `played` `won` `drawn` `lost` `goalsFor`
`goalsAgainst` `points` (numbers) — all **107 / 107**.

`totals`: `played 2275 · won 1030 · drawn 421 · lost 824 · goalsFor 3907 · goalsAgainst 2976 · points 2885`.

⚠️ **107 rows for 96 seasons** — the book's own table splits some seasons across competitions.
Do not join it 1:1 to `season`. **It has no 2025/26 row at all.**

### `legends.json` — `{ peopleCount: 86, rankedCount: 80, withBioCount: 60, people: [86] }`

| field                             | non-null    |
| --------------------------------- | ----------- |
| `slug` `bookName`                 | **86 / 86** |
| `legendRank`                      | **80 / 86** |
| `bio` `bioSource`                 | **60 / 86** |
| `appearancesInBook` `yearsInBook` | **30 / 86** |

### `index.json` — `{ seasonCount: 96, seasons: [96] }`

Row: `id` `startYear` `title` `league` `finalPosition` `matchCount` `storyWordCount`
`squadCount` — all **96 / 96**.

### `season-content.json`

`{ seasonCount: 96, resultLineCount: 2563, storyParagraphCount: 167, seasonsWithResults: 95,
seasonsWithStory: 96, seasons: { …96 keys… } }`

⚠️ **`seasons` is an object keyed by season id, not an array.** `.length` is `undefined` and
`.map` throws. Sample key: `"1942"`.

Per-season value: `seasonId` **96 / 96** · `title` **96 / 96** · `story` **96 / 96** ·
`results` **95 / 96** · `resultsProvenance` **96 / 96**.

---

## 5 · Traps that have each cost a phase

1. **Two deployed schema workspaces.** `list_workspace_schemas` returns three entries:
   Studio-deployed **`default`**, legacy **`belasica-v2`**, legacy **`default`**. The real
   schema is **`belasica-v2`**. The stray **`default`** is a Phase-2.01 leftover (D-2.01-8)
   carrying a **pre-2.02 person model** — `fullName`, `roles`, `source`, `verified`, and
   **none** of `playingYears` / `trainerYears` / `officialYears` / `legendRank` /
   `legendAppearances` / `careerStats` / `nationalStats`. **`get_schema` defaults to
   `workspaceName: "default"`**, so omitting the parameter silently reads the stale manifest.
   That is exactly how Phase 3.25-Cowork concluded the Part-3 fields were undeployed when they
   were deployed all along. **Always pass `workspaceName: "belasica-v2"`.**

2. **Sanity accepts a write to a field the deployed schema does not know.** So a value can be
   correctly stored and invisible on the site at the same time. „The value is in the dataset"
   and „the value renders" are two separate checks; run both.

3. **Explicit `null` in the book JSON.** Counting `Object.keys` returns 100 % for every field
   on every row. Every count in §4 is a **non-null** count. Use one too.

4. **GROQ `match` ignores punctuation.** `title match "*„*"` returns 96/96 on a field where 95
   actually carry the character. Filter client-side for punctuation.

5. **`.next` can serve months-old Sanity data on a green build.** `rm -rf .next` before any
   content verification, or the numbers you measure are from a previous phase.

6. **An unpublished document is not a deleted one.** `person-tomche-eftimov` still exists as
   `drafts.person-tomche-eftimov`, still carrying `legendRank 9` — the same rank the surviving
   `person-tome-eftimov` now holds. Publishing it would duplicate rank 9. Queries at
   `perspective: "published"` cannot see it; `perspective: "raw"` can.
