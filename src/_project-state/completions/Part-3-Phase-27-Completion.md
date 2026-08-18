# Part 3 · Phase 27 · Code — Completion Report

**Date:** 2026-08-18 · **Outcome (one line):** Each of the four tabs on „Легенди" now shows only the facts that belong to it, and three new optional `person` fields give the missing coaching years, service years and whole-career figures somewhere to live.

---

## 1. What shipped (plain language)

A coach's card no longer carries his player ranking, and an international's card no longer shows his Беласица appearance count under a heading about his career everywhere else. The card is now **told which tab it is in** and shows that tab's facts only — while keeping every role chip, so a coach who played keeps his player *tag* and loses only the player *detail*, exactly as Ace asked.

**Панче Стојанов is the proof.** He is the one man who appears in three tabs, and his three cards now read differently:

| Tab | His card, quoted from the built HTML |
|---|---|
| Играчи | `Ранг 54 . Панче Стојанов 127 настапи · Играч · Тренер · 1992–2012` |
| Тренери | `Панче Стојанов · Играч · Тренер` |
| Репрезентативци | `Панче Стојанов · Играч · Тренер` |

Three new fields were created for the data that had nowhere to live. **All three ship empty** — the numbers come from Ace and from public records, and inventing them is what this repo exists not to do. The visible consequence on merge day is that Тренери and Претседатели cards show a name and chips and nothing else; that is the shape waiting for the content pass.

⚠️ **The one change the owner must approve:** „Играчи" is now Ace's ranked list rather than the `player` role, which takes it from **153 to 138** and drops **15 men** — see §2 for the names. Nobody disappears from the site; all 15 are still in another tab.

---

## 2. Definition of Done

### ✅ `npm run build` passes; the page count is unchanged
Final clean build (`rm -rf .next` first, per the stale-data-cache trap) — **659/659 prerendered paths, identical to the baseline** taken on untouched `f1fab83` before any edit. `/legendi/[slug]` yields 424 manifest entries = 211 person pages × 2 (html + rsc) + 2 for the index.

### ✅ `tsc` clean, ESLint clean, prettier applied
`npx tsc --noEmit` → no output. `npm run lint` → no output. `npx prettier --check` on the seven touched paths → „All matched files use Prettier code style!". Prettier was run **only on this phase's files** — a repo-wide glob rewrites ~18 untouched files.

### ✅ Zero new npm dependencies; no new `brand.md` token
`git diff --quiet package.json package-lock.json` → unchanged; `brand.md` unchanged. ⚠️ `npm install` in the fresh worktree removed 11 `"dev": true` flags from optional native binaries — **spurious churn, reverted**, so the lockfile is byte-identical.

### ✅ No Sanity write occurred
`git diff | grep -E "^\+.*(\.patch\(|\.create\(|createOrReplace|createIfNotExists|\.commit\(|\.delete\()"` → **no matches.** All measurement used a read client with **no token**. The live dataset is byte-identical apart from the schema manifest.

### ⚠️ All new fields are optional; existing documents still validate
**Three fields, not four** (see §3/§4 and D-3.27-1). `sanity schema extract --enforce-required-fields` reports `optional: true` for `trainerYears`, `officialYears`, `nationalStats` **and** for all three `nationalStats` sub-fields. Since all are optional and absent from every document, no existing document can fail validation. ⚠️ **The DoD's "open three in `/studio`" was NOT done** — the in-app browser cannot authenticate to Studio. Owed as **OV-62**. (The brief says 160 documents; there are **211**.)

### ✅ Schema deployed to workspace `belasica-v2`, never `default`
`npx sanity schema deploy` → „Deployed 1/1 schemas". `npx sanity schema list` →
`_.schemas.belasica-v2 · belasica-v2 · production · f8rmnfry` — exactly one row.

### ✅ The new fields appear in Studio with Macedonian titles and descriptions
Exact strings, for Lazar's native read (**OV-59**):

| Field | Title | Description |
|---|---|---|
| `trainerYears` | **Години како тренер** | „Периодот во кој лицето било ТРЕНЕР на Беласица, на пр. 2024–2026. Тука не се пишуваат години на играње — за тоа е полето „Години на играње“. Остави празно ако не е познат периодот." |
| `officialYears` | **Години во раководството** | „Периодот во кој лицето било претседател или функционер, на пр. 2015–2024 или 2015– ако мандатот трае. Тука не се пишуваат години на играње. Остави празно ако не е познат периодот." |
| `nationalStats` | **Статистика од целата кариера** | „Настапи и голови од ЦЕЛАТА кариера — сите клубови и репрезентацијата заедно. Ова НЕ е статистиката за Беласица. Се пополнува од јавни извори." |
| `nationalStats.appearances` | **Настапи (цела кариера)** | — |
| `nationalStats.goals` | **Голови (цела кариера)** | — |
| `nationalStats.sourceNote` | **Извор на бројките** | „Од каде се земени бројките, кратко — на пр. „Според Трансфермаркт, 2026“. Се прикажува на страницата на личноста, до бројките, за да може читателот да провери од каде се." |
| `careerStats` *(retitled)* | **Кариерна статистика (Беласица)** | „Само настапи и голови ЗА БЕЛАСИЦА. За целата кариера постои полето подолу." |

New **visible** labels on the site: „Беласица", „Цела кариера", „Периоди", „Тренер", „Раководство", and the card line „Цела кариера: 38 настапи, 16 голови".

### ✅ The Играчи tab contains only people with a `legendRank`

**Before: 153 · After: 138 · Dropped: 15.** Measured against `production` before the rule was written, and confirmed in the built HTML (`Играчи cards=138`).

⚠️ **The 15 who drop off — the owner's confirmation is owed (OV-58):**

| # | Name | Roles held | Still appears in |
|---|---|---|---|
| 1 | **Аце Стојанов** | player, trainer | Тренери |
| 2 | Ацо Стојков | player | Репрезентативци |
| 3 | Горан Пандев | player | Репрезентативци |
| 4 | Горан Попов | player | Репрезентативци |
| 5 | Дервиш Хаџиосмановиќ | trainer, player | Тренери |
| 6 | Звонко Тодоров | trainer, player | Тренери |
| 7 | Игор Ѓузелов | player | Репрезентативци |
| 8 | Илија Матеничаров | trainer, player | Тренери |
| 9 | Јордан Николов | trainer, player | Тренери |
| 10 | Југослав Тренчовски | trainer, player | Тренери |
| 11 | Ристо Божинов | trainer, player | Тренери |
| 12 | Томе Ефтимов | trainer, player | Тренери |
| 13 | Тони Бандулиев | player | Репрезентативци |
| 14 | Чедо Хаџиски | trainer, player | Тренери |
| 15 | Шефки Арифовски | trainer, player | Тренери |

**Nobody leaves the site.** Verified programmatically: **0 people are orphaned**, the distinct roster is **unchanged at 211**, and every `/legendi/<slug>` page is still linked. Two things the owner should notice: **Аце Стојанов**, whose book the ranking comes from, is not in his own ranked list; and **five of the ten internationals** are among the 15, keeping only their own tab. If any should stay, the fix is a `legendRank` typed in Studio — no code change.

### ⚠️ Each tab shows exactly the specified fields — verified in the built output

One named example per tab, quoted from `.next/server/app/legendi.html`:

| Tab | Example | Card text | Forbidden fields present? |
|---|---|---|---|
| Играчи | **Петар Андреев** | `Ранг 1 . Петар Андреев 555 настапи · Играч · Тренер · 1974–1995` | „Цела кариера" **absent** ✅ |
| Тренери | **Мартин Алаѓозовски** | `Мартин Алаѓозовски · Играч · Тренер` | „Ранг" **absent**, „настапи" **absent** ✅ |
| Претседатели | **Славчо Васков-Пинда** | `Славчо Васков-Пинда · Претседател` | „Ранг" **absent**, „настапи" **absent** ✅ |
| Репрезентативци | **Горан Пандев** | `Горан Пандев · Играч` | „Ранг" **absent**; his Беласица 38/16 **absent** ✅ |

Panel-wide scan of the built HTML: Тренери, Претседатели and Репрезентативци contain **no „Ранг" and no „настапи"** anywhere; Играчи contains **no „Цела кариера"**.

⚠️ **The "three or more roles" example could not be met as written** (D-3.27-11). **Nobody in the archive holds three roles** — `person.role` has three possible values and the maximum anyone holds is two. Substituted the nearest real thing, which tests the same property harder: **Панче Стојанов**, the one man in **three tabs** (`role=[player,trainer]`, `legendRank=54`, plus `INTERNATIONAL_SLUGS` membership). His three cards are quoted in §1 — same man, same component, three different cards.

### ✅ Role chips render on every card in every tab
Confirmed per card in the built HTML: Панче Стојанов shows „Играч + Тренер" in **all three** of his tabs; Мартин Алаѓозовски shows „Играч + Тренер" under Тренери; Славчо Васков-Пинда shows „Претседател".

### ✅ No dash, zero-substitute or placeholder for a missing field; a recorded `0` renders
Across all four panels: **0 placeholder chips, 0 em-dash cells**. The recorded-zero rule was proven by temporary injection (D-3.27-13): with `goals: 0` the person page rendered **„Голови 0"** and the card rendered **„Цела кариера: 412 настапи, 0 голови"**. Every test is `!= null`, never falsiness.

### ✅ The person page separates Беласица from whole-career figures; neither summed nor substituted
Proven with injected values, then reverted. Built HTML for `/legendi/panche-stojanov`:

> Кариера · **Беласица** Настапи 127 Голови 13 · **Цела кариера** Настапи 412 Голови 0 · *Според Трансфермаркт, 2026.* · **Периоди** Тренер 2024–2026 Раководство 2015–2024

Two labelled groups, no sum anywhere (127+412 appears nowhere), `sourceNote` rendered beneath the whole-career figures only. With the injection removed, only the „Беласица" group renders — the other two self-omit.

### ✅ `generateStaticParams` still yields every published person
**211 person pages** built. A trainer's page (`/legendi/martin-alagjozovski`, 70 292 bytes) and an official's page (`/legendi/slavcho-vaskov-pinda`, 62 189 bytes) both render. Preview HTTP checks in §9.

### ✅ The client bundle does not receive fields on surfaces that do not render them
Counted in the shipped HTML (the RSC payload is inlined):

| Field | Occurrences | Expected |
|---|---|---|
| `nationalStats` | **10** | the 10 Репрезентативци cards only ✅ |
| `trainerYears` | **69** | the 69 Тренери cards only ✅ |
| `officialYears` | **29** | the 29 Претседатели cards only ✅ |
| `legendRank` / `legendAppearances` / `careerStats` | **138** | the 138 Играчи cards only ✅ |
| `sourceNote` | **0** | never crosses to a card ✅ |
| `bioLead` | **0** | server-only sort input, still stripped ✅ |

Projected by named field throughout; `nationalStats` is rebuilt from its two numbers so `sourceNote` cannot ride along.

### ✅ Record files updated; report filed
See §6.

### ✅ Zero horizontal overflow at 375 / 768 / 1280 / 1408 px
Measured on the deployed preview — **0 px at all four widths** on both `/legendi` and a person page. Full table and the tab-rail containment proof in §9.

### ✅ One PR from `phase-3.27-role-scoped-profiles` → `main`; no secrets
See §5. Nothing was committed to `main` directly. No secret is in the diff; `.env.local` was copied into the worktree for the build and is gitignored.

---

## 3. Decisions I made during this phase

All thirteen are logged as **D-3.27-1 … D-3.27-13**. The ones the orchestrator most needs to ratify:

1. **Only three fields were created; `isNationalTeamPlayer` was NOT added** (D-3.27-1) · the brief told me to read how the Репрезентативци tab derives its members first and extend what exists — it is `INTERNATIONAL_SLUGS`, a hand-ordered list whose **order is Ace's own numbering** from his Drive folder · a boolean cannot carry that order, and adding one creates the second source of truth the brief forbids · rejected: add the boolean anyway; migrate the list into it and sort some other way (there is no other source for the order) · **decision-log entry: YES.**
2. **The Репрезентативци card shows no year span at all** (D-3.27-6) · `playingYears` is a Беласица span, so printing it under a heading about a man's career elsewhere is the same category error as printing his Беласица appearance count there · the brief's "shows" column lists only the two whole-career numbers · rejected: show it, since the brief does not explicitly forbid it · **YES.**
3. **`careerStats` was retitled „Кариерна статистика (Беласица)"** (D-3.27-7) · `nationalStats` now sits directly beneath it in the same form and both were labelled „статистика", which is how a whole-career figure ends up typed into the authoritative Belasica field · this is a **Studio label change on a field outside the brief's stated scope**; the field's name, shape and data are untouched · rejected: leave it and rely on the descriptions · **YES.**
4. **„Кариера" became three labelled groups, and the two new spans live there rather than in the hero** (D-3.27-8) · the hero prints its span unlabelled, so adding two more would force labels onto all three and change the opening block of all 211 pages · rejected: put them in the hero; one flat grid of four figures (the OV-47 ambiguity) · **YES.**
5. **The `category` prop defaults to `"player"`** (D-3.27-12) · keeps the homepage marquee — explicitly out of scope — byte-identical and absent from the diff · rejected: make it required and edit the homepage · **YES.**
6. **Empty branches were verified by temporary injection, then reverted** (D-3.27-13) · every new field ships empty, so four code paths had no data to exercise them; „0 голови" would otherwise have shipped unverified · **no Sanity write** — the injection was local code, built, inspected, reverted, and is not in the diff · rejected: write test data to Sanity; ship unverified · **YES.**
7. **Three stale code comments were recomputed** · `legendi/page.tsx` and `LegendsBrowser.tsx` stated „261" and „49 of the 211", both true before the membership rule and false after; now **246** and **34** · left unrecorded they would have become the next phase's wrong premise · **covered by D-3.27-10.**

---

## 4. Deviations from the brief

1. **Three fields, not four.** Task 1.4 offered `isNationalTeamPlayer` "**or whatever mechanism the Репрезентативци tab already uses**" and instructed me to read that first. I did; it is `INTERNATIONAL_SLUGS`. No boolean was added. (D-3.27-1)
2. **The brief's roster figures are stale by 51 people.** It states `98 · 34 · 28 = 160` (OV-49). Live is **211 people**, `153 · 69 · 29 · 10`. Measured with a read-only client before any code; every number in the code, the snapshot and this report is the measured one. ⚠️ **This is the fourth recorded stale-brief premise on this project.** (D-3.27-10)
3. **The DoD's "three or more roles" example is unsatisfiable.** Nobody holds three roles; the maximum is two. Substituted the one man in three *tabs*. (D-3.27-11)
4. **The DoD's "open three documents in `/studio`" was not done.** The in-app browser cannot authenticate to Studio. Verified from the deployed schema instead and owed as **OV-62**.
5. **The brief names `RoleBandGrid`.** That file was renamed `CategoryGrid.tsx` at 3.23. No `RoleBandGrid` exists.
6. **The brief says "changing anyone's `roles` array".** The schema field is `role`, singular. Nobody's roles were changed either way.
7. **`match.ts` stays unregistered; `/statistika`, `/arhiva`, the homepage, „Разно", the header, footer, crest and pennants are untouched** — all confirmed absent from the diff.

---

## 5. Changed files / deliverables

**Branch:** `phase-3.27-role-scoped-profiles` (cut from `f1fab83`, i.e. `main` with 3.24 merged) · **PR:** see §9.

**Edited (9 files, no files added, renamed or deleted):**

| File | What changed |
|---|---|
| `src/sanity/schemaTypes/person.ts` | +3 optional fields; `careerStats` retitled |
| `src/app/(site)/legendi/page.tsx` | query +3 fields; `legendRank` membership rule; per-category `project()`; `PersonRow` stated in full |
| `src/app/(site)/legendi/[slug]/page.tsx` | query +4 fields; Кариера split into three labelled groups; local `FigureGroup` |
| `src/components/legends/LegendCard.tsx` | `category` prop; role-scoped rank/count/span; whole-career line |
| `src/components/legends/CategoryGrid.tsx` | passes `category` down |
| `src/components/legends/LegendsBrowser.tsx` | two stale counts recomputed |
| `src/lib/people.ts` | `appearanceCountLabel`, `goalCountLabel` |
| `src/_project-state/decisions.md` | D-3.27-1…-13 |
| `src/_project-state/current-state.md`, `file-map.md` | snapshot + map |

**Not code:** the Sanity **schema manifest** was deployed to workspace `belasica-v2`. No document was written. No secrets are in the report or the diff.

---

## 6. State updates done

- **`current-state.md`** — `NEXT:` set to **`3.25-Cowork — Слики, сезона 2025/26 и податоци за личности`**; new 3.27 summary bullet; `OV-58…OV-62` added; the `/legendi`, person-page, `components/legends/` and `schemaTypes/` inventory lines updated with the measured band counts.
- **`file-map.md`** — no files added, renamed or deleted, so no entries added; `LegendCard`'s description was rewritten because its behaviour changed materially (it still described the superseded D-3.15-5 both-or-nothing rule).
- **`00_stack-and-config.md`** — **not touched, correctly**: no dependency or config value changed.

---

## 7. Risks, follow-ups, what the next phase needs to know

1. ⚠️ **OV-58 is a live editorial question.** 15 men leave the most-read page. Nobody is orphaned, but the owner should confirm before merge.
2. ⚠️ **All three new fields are empty on all 211 people.** 3.25-Cowork must fill them. `sourceNote` should be filled whenever a `nationalStats` number is — it is what lets a reader check a figure the club's own records do not back.
3. ⚠️ **Репрезентативци membership is still edited in code, not Studio** — pre-existing and unchanged. The four men Ace named with no person document (Васил Рингов, Благој Георгиев, Сашко Пандев, Дејан Илиев) remain owed.
4. ⚠️ **OV-49 should be re-read against the measured 211 / 153 · 69 · 29 · 10.** The 160 it records is stale.
5. ⚠️ **A card rendered without `category` gets player scoping**, not an error (D-3.27-12). The prop's doc comment says so.
6. **For the orchestrator:** the DoD line "three or more roles" should be reworded to "appears in three or more categories", which is a real property of this data.
7. **Process note:** 3.24 was **not merged** when this phase began — it was uncommitted work on an unpushed branch. It was committed, PR'd (#54) and merged as `f1fab83` before 3.27 was cut, on the owner's instruction. This phase was built in a **git worktree** because another session was live in the main checkout.

---

## 8. What's now possible that wasn't before

Ace can enter a coach's years, a president's term and a man's whole-career figures, and each will appear on the page it belongs to and nowhere else — so the archive can describe a man's coaching without borrowing his playing record.

---

## 9. Vercel preview — confirmed on the deployed build

**PR [#55](https://github.com/DinovLazar/belasica-v2/pull/55)** · **Preview:** https://belasica-v2-l9rnnvqof-sunset-services-team.vercel.app

**Routes — 10/10 return 200**, including the trainer's and the official's page the DoD names:
`/` · `/legendi` · `/legendi/panche-stojanov` · `/legendi/martin-alagjozovski` *(trainer)* · `/legendi/slavcho-vaskov-pinda` *(official)* · `/legendi/goran-pandev` · `/statistika` · `/arhiva` · `/razno` · `/za-nas`

**Roster on the deployed page:** header reads **„211 личности"**; 246 card links over **211 distinct people** — the membership rule removed 15 from Играчи without removing anyone from the site.

**All four tabs, read from the deployed DOM:**

| Tab | Count | „Ранг" present | „настапи" present | First card |
|---|---|---|---|---|
| Играчи | **138 играчи** | ✅ yes | ✅ yes | `РАНГ 1. ПЕТАР АНДРЕЕВ 555 НАСТАПИ · Играч · Тренер · 1974–1995` |
| Тренери | **69 тренери** | ❌ **no** | ❌ **no** | `Мартин Алаѓозовски · Играч · Тренер` |
| Претседатели | **29 претседатели** | ❌ **no** | ❌ **no** | `Славчо Васков-Пинда · Претседател` |
| Репрезентативци | **10 репрезентативци** | ❌ **no** | ❌ **no** | `Горан Пандев · Играч` |

**Панче Стојанов, the one man in three tabs, on the deployed site:**

| Панel | His card |
|---|---|
| Играчи | `РАНГ 54. ПАНЧЕ СТОЈАНОВ 127 НАСТАПИ · Играч · Тренер · 1992–2012` |
| Тренери | `Панче Стојанов · Играч · Тренер` |
| Претседатели | *(absent — he is not one)* |
| Репрезентативци | `Панче Стојанов · Играч · Тренер` |

**Person page:** `/legendi/panche-stojanov` Кариера reads **„КАРИЕРА · БЕЛАСИЦА · НАСТАПИ 127 · ГОЛОВИ 13"** — the Belasica group labelled, „Цела кариера" and „Периоди" correctly self-omitted (their fields are empty). Zero em-dash cells.

### ✅ Zero horizontal overflow at 375 / 768 / 1280 / 1408 px
`document.documentElement.scrollWidth − clientWidth` measured on the deployed preview:

| Width | `/legendi` | `/legendi/panche-stojanov` |
|---|---|---|
| 375 | **0 px** | **0 px** |
| 768 | **0 px** | — |
| 1280 | **0 px** | — |
| 1408 | **0 px** | **0 px** |

The tab rail measures 509 px at 375 px wide, but its parent is `overflow-x-auto` (`parentOverflowX: "auto"`, clientWidth 375) — it scrolls **inside its own container** by the 3.22 design, and the page body does not scroll. Verified explicitly rather than inferred.

⚠️ **Not verified:** switching tabs by mouse on the preview. The in-app browser's input did not reach the page (a recorded quirk of this harness — `aria-selected` stayed on Играчи after two clicks). The tab **panels themselves were read from the deployed DOM**, which is the content this phase changed; the switching mechanism is 3.22 code and is not in this diff. **Nothing blocks a human check.**

---

## 10. Five-item eyeball checklist for Lazar

On **https://belasica-v2-l9rnnvqof-sunset-services-team.vercel.app** — ideally once on a laptop and once on a phone:

1. **„Легенди" → Играчи** should say **138 играчи** (was 153). Then read the 15 dropped names in §2 and tell me whether any of them belongs back — especially **Аце Стојанов** himself.
2. **Press „Тренери".** Every card should show a name and its chips and **no rank and no number**. Мартин Алаѓозовски opens the tab.
3. **Press „Репрезентативци".** Горан Пандев's card should show **no number at all** — his „38" was his Беласица count and has no business on this tab.
4. **Open Панче Стојанов** (`/legendi/panche-stojanov`). Under „Кариера" you should see **„БЕЛАСИЦА"** above 127 / 13. That label is the whole point — a second group „Цела кариера" will appear beneath it once Ace's numbers are entered.
5. **Read the new Studio strings** in §2's table — four titles and four descriptions, plus the retitled „Кариерна статистика (Беласица)". These are what Cowork and Ace will be reading while typing the data in.
