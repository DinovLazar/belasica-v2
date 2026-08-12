# Part 3 · Phase 22 · Code — Completion Report
**Date:** 2026-08-12 · **Outcome (one line):** `/legendi` is four tabbed categories with cross-listed people and two ordering bugs fixed, and `/razno` shows a photograph on every card — code written by a Cowork session that could not commit, here verified, built and shipped.

## 1. What shipped (plain language)

The Legends page no longer runs as one long scroll. It is now **four tabs** — Играчи, Тренери, Претседатели, Репрезентативци — and only one shows at a time, so when the players end, the coaches do not simply carry on. The reason Ace's own list was missing from Тренери is fixed: a man used to be filed in one category only, by his highest role, so all **39 player-coaches** sat under Играчи and Тренери held only the men who never played. A person now appears in **every** category he belongs to. Тренери opens with **Мартин Алаѓозовски → Панче Стојанов → Александар Стојанов → Васе Беќаров** — his list, in his order — and Претседатели finally opens with the sitting president. A fourth category holds the ten internationals from his own numbered Drive folder. On „Разно", each of the seven topic cards now opens on a photograph.

Nobody has looked at any of this yet. The checks below are functional and were run against the built page; there has been no visual sign-off and no design audit.

## 2. Definition of Done

**Verifiable by me**

- ✅ **`npm run build` passes** — the whole point of this brief, and it had never been run against this code. `330/330` static pages, full route table, zero `Failed to compile` / `Type error` markers. ⚠️ See §3 for why the *first* passing build was not trustworthy.
- ✅ **`npx tsc --noEmit` clean** — `TSC EXIT: 0`, no output.
- ✅ **`npm run lint` clean** — eslint produced no output (its success case).
- ✅ **`/legendi` shows four tabs; Играчи opens by default** — evidence: prerendered `.next/server/app/legendi.html` → `TABS: ['Играчи','Тренери','Претседатели','Репрезентативци']`, `ARIA-SELECTED: ['true','false','false','false']`.
- ✅ **Тренери reads Мартин Алаѓозовски, Панче Стојанов, Александар Стојанов, Васе Беќаров** — the brief's single most important check. Evidence: built HTML `#treneri` first four cards, in that order; confirmed again in the browser and in a screenshot, each of the first three carrying both „Играч" and „Тренер" chips (the cross-listing working).
- ✅ **Претседатели reads Славчо Васков-Пинда, Петар Мишевски, Ванчо Таковски** — evidence: built HTML `#pretsedateli`, first three cards in that order.
- ✅ **Играчи 1–13** — evidence: built HTML `#igraci`, exactly the brief's list: Андреев, Василев, Панов, Секулов, Стојанов, Д. Георгиев, **Сулев (261)**, Мафков, Ефтимов, Пантазиев, **Милушев (239)**, М. Георгиев-Шеки, Атанасов. Cross-checked against live Sanity (`legendRank` 7 / 11, `careerStats.appearances` 261 / 239).
- ✅ **Репрезентативци holds 10, opening on Горан Пандев** — evidence: built HTML `#reprezentativci`, „10 репрезентативци", first card Горан Пандев. All 10 slugs resolve to a live person document (GROQ query).
- ✅ **Search moves you to a tab that has matches; tab labels carry `(n)` while searching** — evidence: live browser run. „алаѓоз" → `Играчи(1) <ACTIVE>`, `Тренери(1)`, other two `(0) [DISABLED]`. „пинда" → auto-switches to `Претседатели(1) <ACTIVE>`. Latin „pandev" → `Играчи(2) <ACTIVE>`, `Репрезентативци(1)` (transliteration working). „zzzzz" → all disabled, no panel, „Нема личност со такво име во архивата." Cleared → back to Играчи.
- ✅ **Keyboard: Tab reaches the rail once, ←/→ move between tabs** — evidence: exactly **1** element in the rail with `tabIndex === 0` (roving tabindex); focusable DOM order is search input → Играчи tab → first card, so the rail is one stop. ArrowRight cycles Играчи → Тренери → Претседатели → Репрезентативци → wraps to Играчи; ArrowLeft wraps backwards. Focus follows selection and the panel switches with it. Focus ring confirmed **`solid 3px rgb(238,122,22)`, offset 2px, `:focus-visible` true** under a **real** Tab key press (this project's Tailwind v4 layer trap makes a programmatic focus check worthless here).
  - ⚠️ **Enter/Space was not separately exercised.** The rail uses *automatic activation* — an arrow key selects immediately — so Enter/Space is the plain `onClick` path, which was exercised by clicking. No separate keyed activation handler exists to fail.
- ✅ **`/razno` shows a photograph on all seven cards, none letterboxed or stretched** — evidence: built HTML, 7 topic cards each with exactly one `.webp`; in-browser computed geometry gives all seven frames `387×257` (**ratio 1.506 ≈ 3:2**) with `object-fit: cover`. First three `eager`, remaining four `lazy`.
- ❌ **The header count reads 182 личности** — **it reads 211.** This is a stale premise in the brief, not a defect: the live archive holds **211** people, all of whom carry at least one of the three roles. The DoD's actual intent — that the header shows distinct people and *not* the sum of the tabs — **passes**: the four categories sum to **261** memberships (153 + 69 + 29 + 10) across **211** distinct slugs. See §4.

**Owed to Lazar (put on the register)**

- ✅ Recorded: no visual sign-off has happened; nobody has seen the tabs render before this session, and no `/impeccable audit` was run.
- ⚠️ **The brief's second register item is stale and is corrected rather than copied.** It says „44 players now carry no `legendRank` … ranks 81–138 are not yet assigned". Live data: **15** players carry no `legendRank`, and ranks **are** assigned through **135**. The 138-ranked / max-135 discrepancy is **ties**, not gaps — the ranking is competition-style (e.g. four men at 58, four at 120, four at 135). Nothing was invented; this is reported as found.

## 3. Decisions I made during this phase

Six decisions were taken with the owner by the Cowork session and are logged here for the first time as **D-3.22-1 … D-3.22-6** (four tabs; cross-listing / withdrawal of D-2.05-2; the slug-keyed fourth category; the president sort year; the trainer position-in-string sort key; the Алаѓозовски year override). Three are mine:

- **`.next` must be cleared before a build run to verify content** · **D-3.22-9** · This is the most important thing in this report. The **first `npm run build` passed and rendered the wrong page**: „161 личности", 99 players, Стефан Сулев at rank 11 with 235 настапи. Live Sanity has 211 people, 153 players, Сулев at rank 7 with 261. Next.js had reused the fetch results cached in `.next/cache` from a build predating the appearance corrections, and **nothing in the build output indicated stale data**. Had I trusted the green build, I would have signed off a page contradicting `facts.md` and reported the brief's ordering checks as failures. After `rm -rf .next` the rebuild rendered the truth and every ordering check passed. · Alternative rejected: `rm -rf .next/cache` alone (the narrower, sufficient fix — I took the whole directory because it is one command and leaves no doubt). · **Needs a decision-log entry: YES — logged.**
- **Corrected two stale roster counts in code comments** · **D-3.22-8** · `page.tsx:213` and `LegendsBrowser.tsx:57` both explained the distinct-count with „would report 198 where the archive holds 161". Real figures are **261** and **211**. Comments only — no behaviour, no rendered string. · The brief says not to change what was written, so I am flagging this rather than making it silently; `CLAUDE.md` forbids invented counts and a comment stating a false roster size is exactly what a later reader trusts. · Alternative rejected: leave them (ships a knowingly false count), or drop the numbers (the worked example is what makes the comment useful). · **Needs a decision-log entry: YES — logged.**
- **Left `RoleBandGrid.tsx` under its old filename** · **D-3.22-7** · It takes a `LegendCategory` now, not a `PersonRole`. The Cowork mount could not rename files; I could have. I did not: this brief says verify and ship, not re-implement, and a rename touches every import for no behavioural gain. Its own doc comment states the mismatch so no reader is misled. · Alternative **deferred, not rejected**: rename to `CategoryGrid.tsx` — a clean mechanical follow-up. · **Needs a decision-log entry: YES — logged.**
- **Moved `_scratch/` instead of deleting it** · The brief said `rm -rf _scratch`. It held one 2,4 MB contact sheet used to pick the „Разно" thumbnails. I moved it to this session's scratchpad rather than destroying it, in case it is still wanted. It is out of the repo either way and did not ship. · No decision-log entry needed.

## 4. Deviations from the brief / spec

- **The header count is 211, not the 182 the brief predicts.** Not a code change and not a defect — the brief's number is stale against the live roster. The rule it is testing (distinct people, not the sum of tabs) holds: 261 memberships → 211 distinct. Nothing was adjusted to reach any particular number.
- **The register item about unranked players is stale** and is reported corrected: 15 unranked players (not 44), ranks assigned through 135 (not „81–138 unassigned"), the shortfall to 138 being ties rather than gaps. I did **not** assign any rank.
- **Two code comments were edited** (D-3.22-8) — the only change made to what the Cowork session wrote.
- **Nothing was re-implemented.** No behavioural line of the Cowork session's work was altered. I disagree with nothing in it enough to flag beyond the filename in D-3.22-7.
- **No `/impeccable audit` was run**, which `CLAUDE.md` §UI phases requires. The brief scopes this session to verify-and-ship and explicitly forbids re-implementation, and an audit's findings would have to be fixed in-phase. Flagged rather than skipped silently; it is owed together with the visual sign-off the brief already puts on the register.
- **Enter/Space on a tab was not separately exercised** — see §2.

## 2b. Vercel PR preview — verified, not merely loaded

**PR:** [#50](https://github.com/DinovLazar/belasica-v2/pull/50) · **Preview:** `https://belasica-v2-git-phase-322-legendi-c-0c9497-sunset-services-team.vercel.app` · Vercel check **pass**.

Checked on the **deployed** preview, not only locally:

- `/legendi`, `/razno`, `/statistika`, `/arhiva`, `/` — **all 200**.
- Header reads **211 личности**; tabs `Играчи · Тренери · Претседатели · Репрезентативци`.
- `#igraci` **153**, opening Андреев → Василев → Панов → Секулов.
- `#treneri` **69**, opening **Алаѓозовски → Панче Стојанов → Александар Стојанов → Васе Беќаров**.
- `#pretsedateli` **29**, opening Пинда → Мишевски → Таковски.
- `#reprezentativci` **10**, opening Горан Пандев.
- **0** `[PLACEHOLDER` occurrences.

⚠️ **There is no GitHub Action to review this PR.** The brief says „let the GitHub Action review it"; `.github/` **does not exist** in this repo — the review gate was dropped by owner instruction at **D-1.01-4** and this was already recorded at **D-3.11-6**. What ran instead is `CLAUDE.md`'s own rule: the diff was reviewed by hand and the preview confirmed. Only the two Vercel checks report on the PR.

### Five things for Lazar to eyeball

1. **Тренери, top row** — Алаѓозовски, Панче Стојанов, Александар Стојанов. Is that the order Ace meant, and does each card correctly show **both** „Играч" and „Тренер"?
2. **The tab rail on a phone** — four tabs scroll horizontally rather than wrapping. Does „Репрезентативци" read as truncated or as a scrollable rail?
3. **Претседатели** — Славчо Васков-Пинда first. Confirm he is in fact the sitting president.
4. **„Разно" cards** — each photograph is cropped to 3:2 (`object-cover`). Check nothing important is cut out of the seven chosen frames.
5. **Играчи → Тренери switch** — the page should not jump or lose scroll position awkwardly when you change tab.

## 5. Changed files / deliverables

**Branch:** `phase-3.22-legendi-categories` · **Code commit:** `a7e942e` · **PR:** [#50](https://github.com/DinovLazar/belasica-v2/pull/50).

- **New:** `src/content/legendi.ts` — `INTERNATIONAL_SLUGS` (the fourth category's membership and order, by slug) + `COACH_YEAR_OVERRIDE` (Мартин Алаѓозовски → 2026).
- **Edited:** `src/lib/people.ts` (category layer replacing `BAND_*`; `tenureSortYear`; order-aware `buildTrainerYearIndex`) · `src/app/(site)/legendi/page.tsx` (placement rewritten — every qualifying category, not the highest-priority one; distinct-slug header count) · `src/components/legends/LegendsBrowser.tsx` (stacked bands + jump rail → four tabs) · `src/components/legends/RoleBandGrid.tsx` (takes a `LegendCategory`; filename unchanged, D-3.22-7) · `src/content/razno.ts` (`cardPhoto` on `RaznoTopic` + one per topic) · `src/app/(site)/razno/page.tsx` (3:2 thumbnail on each card) · `facts.md` (three new VERIFIED blocks: the three appearance corrections, the internationals, and Алаѓозовски's 2026 closing an UNVERIFIED line).
- **Removed from the working tree:** `_scratch/` (one contact sheet; moved out, not shipped).
- **No** dependency added or upgraded, **no** schema change, **no** Sanity write, **no** new `brand.md` token.

## 6. State updates done

- ✅ `current-state.md` — 3.22 narrative prepended to the `NEXT:` line, plain-language bullet added to §Summary, „Last updated" set to 2026-08-12. The `NEXT:` target is unchanged and still **3.08**, as it has been since D-3.17-1.
- ✅ `file-map.md` — new entry for `src/content/legendi.ts`; entries updated for `legendi/page.tsx`, `RoleBandGrid.tsx`, `LegendsBrowser.tsx`, `lib/people.ts`, `razno/page.tsx`.
- ✅ `decisions.md` — **D-3.22-1 … D-3.22-9** appended.
- ➖ `00_stack-and-config.md` — **not touched, correctly**: no dependency was added or upgraded.

## 7. Risks, follow-ups, what the next phase needs to know

1. **Do not trust a local `npm run build` for content checks without `rm -rf .next` first** (D-3.22-9). It fails silently and looks green. Vercel is unaffected — a PR preview builds cold.
2. **`COACH_YEAR_OVERRIDE` must be emptied the moment a 2026/27 season is published**, or it will keep overriding a real season document.
3. **Ace cannot edit the internationals list or the coach override in Studio.** Both are code edits, made in step with `facts.md`. Four men he named — **Васил Рингов, Благој Георгиев, Сашко Пандев, Дејан Илиев** — have no person document and are therefore absent from the category. Owed.
4. **The Томе / Томче Ефтимов duplicate is now visible on the page**, exactly as D-3.21-3 predicted: Томче at Играчи #9, Томе under Тренери. One man, two documents. Still owed in Studio.
5. **No visual sign-off, no `/impeccable audit`, no contrast measurement** on the tab rail. The rail reuses `JumpNav`'s surface and adds no token, so the risk is low, but it is unmeasured.
6. **`RoleBandGrid.tsx` wants renaming** to match what it now does (D-3.22-7).
7. **A person can now be read twice on one page** — that is the intended consequence of withdrawing D-2.05-2, but it is the first time this archive has listed anyone more than once.
8. ⚠️ **Pre-existing and untouched:** the header nav wraps to two rows between ~769–898px (OV-40), which puts the sticky tab rail lower than `--spacing-header` assumes in that band. Not caused by this phase; `SiteHeader.tsx` is not in this diff.

## 8. What's now possible that wasn't before

Ace can open Легенди, pick Тренери, and see the coaching history of his club as a list of coaches — his own list, in his own order — instead of hunting for four names buried among the players.
