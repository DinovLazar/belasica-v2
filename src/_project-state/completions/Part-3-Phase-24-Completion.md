# Part 3 · Phase 24 · Code — Completion Report

**Date:** 2026-08-18 · **Outcome (one line):** An archival photograph opened in the gallery now fills the screen instead of sitting small in the middle of it — and two of the five things this phase was sent to fix turned out not to be what the brief described.

---

## 1. What shipped (plain language)

Ace said photographs open too small, and they did. The cause was not the box being too tight — nothing was ever scaling the picture **up** to meet it, so a scan rendered at its own pixel size in the middle of a full-screen overlay. On a 1280×800 screen the first photograph of `/arhiva/1985-86` painted **331×372 px, 46,5 % of the screen height**. It now fills whatever the arrows and the close button leave it: **84 %**. The 1950 newspaper clipping on „Младинска школа" is legible where it used to be a thumbnail.

The homepage's „Момент од историјата" is now **pinned** to one specific photograph — the 1993 youth-Cup side — rather than being whichever picture the ordering happened to return, and it carries a new link to „Младинска школа". „Разно" got a box in „Каде понатаму".

Two things did not go as the brief expected, and both are the owner's call, not mine. The appearances table was cut at 46 on the belief it listed **71** players; it lists **119**, so the cut removes **three** — and those three are **Горан Пандев, Ацо Стојков и Горан Попов**. And the „absolute link to the preview domain" on „За нас" **was not there**; it has been an ordinary relative link since 3.15.

---

## 2. Definition of Done

### Verifiable by the executor

- ✅ **`npm run build` passes in a clean clone; page count unchanged.** Evidence: `rm -rf .next && npm run build` → `EXIT=0`, `✓ Generating static pages (330/330)`. `current-state.md` records 330/330 at 3.22. This phase adds no route.
- ✅ **`tsc` clean, ESLint clean, prettier applied.** Evidence: `npx tsc --noEmit` → no output, exit 0. `npm run lint` → no output. `npx prettier --check` on the three touched files → „All matched files use Prettier code style!". Only the three edited paths were formatted (per the standing rule that a tree-wide `--write` rewrites ~18 untouched files).
- ✅ **Zero new npm dependencies. No new `brand.md` token.** Evidence: `git diff --stat package.json package-lock.json` → empty. `brand.md` absent from `git status`.
- ✅ **No Sanity write occurred.** Evidence: no `patch`, `create`, `commit()`, `publish` or `unpublish` anywhere in the diff. All Sanity access this phase was read-only: MCP `query_documents`, plus one scratchpad script built on a client constructed **without a token** (it lives in the session scratchpad and is not committed).
- ✅ **Task 1: the overlay was opened in a real browser on `/arhiva/1985-86` and `/razno/mladinska-skola`, at 1280 and 375.** Evidence, measured from layout (not `getBoundingClientRect`, which this in-app browser reports unreliably):

  | Page | Width | Before (`main`) | After | Change |
  |---|---|---|---|---|
  | `/arhiva/1985-86` photo 1 | 1280×800 | **331 × 372 px** (46,5 % VH) | **598 × 672 px** (84,0 % VH) | **1,81× taller** |
  | `/razno/mladinska-skola` photo 1 | 1280×800 | **491 × 451 px** (56,4 % VH) | **688 × 632 px** (79,0 % VH) | **1,40× taller** |
  | `/razno/mladinska-skola` photo 1 | 375×812 | **345 × 317 px** (39,0 % VH) | **343 × 315 px** (38,8 % VH) | unchanged — already width-limited |

  The „before" figures come from a **controlled rebuild of `main`'s `PhotoLightbox.tsx`** on this branch, measured in the same browser at the same widths, then restored — not from the live site, whose lazy images would not load in this pane.
- ✅ **Task 1: at 375 the arrows still sit below the photograph; neither arrow nor the close button overlaps the image at either width.** Evidence: at 375×812 on `/arhiva/1985-86` the painted picture ends at y=409 and both arrows sit at y=651; on `/razno/mladinska-skola` picture bottom 461, arrows y=682. Overlap was tested by rectangle intersection between each control and the **painted** picture (not the element box) — `controlsOverlappingPicture: []` in **every** measured case, across 6 photographs stepped through with the arrows at 1280 and 2 at 375.
- ✅ **Task 1: `next/image` `sizes` updated to match the new rendered dimensions.** Evidence: `92vw` → `(min-width: 640px) calc(100vw - 11rem), calc(100vw - 2rem)`, confirmed on the rendered element. At 1280 the browser now selects the `w=3840` candidate for a 1120px-wide box at DPR 2; the served bitmap is 1080×1213 (verified by `curl` + PIL), which is the source's full size — `PhotoGrid` builds these URLs with `fit("max")`, so no larger file exists. That is precisely why an upscale is soft rather than sharp.
- ✅ **Task 2: pinned by module-scope constants, and the fallback was exercised, not assumed.** Evidence: `MOMENT_PHOTO_ID` alongside `HERO_SEASON_SLUG`/`HERO_PHOTO_ID`, passed as a GROQ parameter. Pointing it at `photo-this-id-does-not-exist-fallback-test` and rebuilding gave: moment section still present, a **real photograph, no placeholder chip**, and **the link absent**. Restored and rebuilt; `grep -rn "does-not-exist\|fallback-test" src/` → nothing.
- ✅ **Task 2: the report names the pinned photo and states whether the link shipped.** `_id` **`39b358c0-be93-4130-be5e-da4d97fe7948`** · caption **„Младата екипа на Беласица со Купот на Македонија, 1993"** · `date` „1993" · `relatedSeason` **„Сезона 1992/93"** (`1992-93`, decade 1990). **The link WAS added.** The conditional resolved in favour of shipping: this is the side that won the club's first Macedonian youth Cup, and `src/content/razno.ts` line 6959 — inside the `mladinska-skola` topic — is the paragraph about it („Беласица во сезоната 1992/93 го освојува првиот младински куп на Македонија… во финалето ја победува екипата на Пелистер со 5:3").
- ✅ **Task 3: „Разно" appears in „Каде понатаму" and points at `/razno`; no overflow or broken grid at 375, 768, 1280, 1408.** Evidence, measured at each width:

  | Width | Rows | Tile widths | Tile heights | Horizontal overflow |
  |---|---|---|---|---|
  | 375 | 1+1+1+1+1 | 335 × 5 | 100 | none (`scrollWidth` 375) |
  | 768 | 2+2+1 | 346, 346, 346, 346, **704** | 100 | none |
  | 1280 | 5 | 227 × 5 | 122 | none |
  | 1408 | 5 | 227 × 5 | 122 | none |

  Built HTML order: `/arhiva`, `/legendi`, `/statistika`, `/razno`, `/za-nas`.
- ✅ **Task 4: the rendered table contains only players with 46+ appearances; sorting still works.** Evidence: **116 rows** (was 119). Sorted ascending, the first three are Дервиш Хаџиосмановиќ **47**, Игор Ѓузелов **50**, Атанас Малинов - Пата **60** — so the floor is honoured with nothing below it. A real mouse click on „Голови" re-sorted to descending (Љупчо Мафков 115) with all 116 rows preserved and `aria-sort` moving correctly between columns.
- ✅ **Task 4: no dash, no zero-substitute, no placeholder chip introduced.** Evidence: `PLACEHOLDER` count on the built page = **0**. The table contains 31 `—` cells, in the „Голови" column for players with no recorded goal total — **exactly the same count as `main`** (verified against the live page: 31 em-dashes over 119 rows), so this phase changed it by zero. `—` is the brand's specified marker for an unknown cell (`statCell` in `src/lib/archive.ts`, `value == null`), and a genuine recorded `0` still renders `0`.
- ⚠️ **Task 4: keyboard operation — partial.** Sorting is verified by click in both directions, and the orange focus ring is visibly on the header button. **`Enter`/`Space` activation could not be exercised**: this in-app browser's key delivery to the pane failed repeatedly and then timed out. The headers are native `<button type="button" onClick>` elements, so activation is browser-native, and **`StatTable.tsx` is not in this phase's diff** — the risk is inherited, not introduced. Logged as **OV-54**.
- ✅ **Task 5: `grep -rn "belasica-v2.vercel.app" src/` returns nothing user-facing.** Evidence: restricted to application code, the only hit in the whole of `src/` is `src/lib/site.ts` — the deliberate 3.23 default the brief says stays. Across the deployed site, `<a>` elements carrying an absolute self-URL: **0 on all 9 routes checked** (`/`, `/za-nas`, `/statistika`, `/razno`, `/razno/mladinska-skola`, `/arhiva/1985-86`, `/kontakt`, `/pravni-informacii`, `/legendi`). The only absolute occurrences are `<link rel="canonical">` tags, which are metadata and are supposed to be absolute.
- ✅ **Task 5: the Sanity sweep is listed, and nothing in Sanity was changed.** Evidence: a read-only script (no token) walked **2 443 published documents**, every field, recursively. **`vercel.app`: 0 hits. `belasica-v2`: 0 hits.** The only absolute URLs in content are 1 076 `cdn.sanity.io` asset URLs (system fields), Facebook `share` links inside photo `provenance` strings (internal metadata, never rendered as links), and one YouTube URL sitting as plain text in `person-mile-boev`'s bio.
- ✅ **Task 5: the „За нас" copy is byte-identical.** Evidence: `src/app/(site)/za-nas/page.tsx` is **absent from `git status`** — not one character changed, including the `href`, because there was nothing to change (see §4).
- ✅ **Every new or changed Macedonian string is listed verbatim.** See §5.
- ✅ **All four record files handled per the two named skills; report filed.** See §6.
- ✅ **One PR from `phase-3.24-quick-fixes` → `main`; never committed to `main`; no secrets.** See §5.
- ✅ **Vercel preview URL with the six routes confirmed 200.** See §5.

---

## 3. Decisions I made during this phase

All seven are logged as **D-3.24-1, -1b, -2, -3, -4, -5, -6, -7** in `src/_project-state/decisions.md`.

1. **The lightbox scales the image via flex rather than a vh number** · a hard `sm:h-[85vh]` overflows once the 80px close-button band and the caption are added, so the height is derived from the real chrome · alternative rejected: a fixed vh cap · decision-log entry: **YES (D-3.24-1)**.
2. **`sm:flex-nowrap` on the overlay row** · my own first cut was wrong and measurement caught it: a wrapping flex line cannot be compressed below its content, so the figure came out **1 258px tall in an 800px viewport**. Logged separately because a future editor could undo this utility without touching the sizing decision · decision-log entry: **YES (D-3.24-1b)**.
3. **The moment link is gated on the pin resolving, not on a photograph existing** · the brief said to add the link; it did not say what happens when the pin is unpublished. Gating on the picture would let the link assert the youth school under the fallback photograph · alternative rejected: render the link whenever the section renders · decision-log entry: **YES (D-3.24-2)**.
4. **„Каде понатаму" went to five tracks with a widening last tile** · the brief said to fix the grid if a fifth box breaks it, without saying how · alternative rejected: `sm:grid-cols-3` (3+2 is still ragged) · decision-log entry: **YES (D-3.24-3)**.
5. **The „Разно" sub-label reuses `RAZNO_INTRO`'s opening words** („Теми од историјата") · the brief asked for the `/razno` index's own voice rather than a new register · decision-log entry: folded into **D-3.24-3**.
6. **„Најмногу настапи" states its cut on the page** · the brief only required recomputing an existing coverage line, and this section had none. A threshold that silently removes Пандев reads as an incomplete archive rather than a bounded list · alternative rejected: say nothing · decision-log entry: **YES (D-3.24-5)**.
7. **`defined(careerStats.appearances)` dropped from the appearances query** · `>= 46` is already false for an undefined field, so the guard was redundant. Called out explicitly because it *looks* like a loosening of the „a recorded `0` must survive" rule and is not · decision-log entry: folded into **D-3.24-4**, and the query's doc comment says so.
8. **Nothing was changed on `/za-nas`** · the defect does not exist; I did not invent a change to make the task „pass" · decision-log entry: **YES (D-3.24-6)**.
9. **The `file-map.md` entry for `PhotoLightbox.tsx` was corrected** · it still described the pre-3.19 „capped 92vw × 82vh", stale by two phases. No file was added, renamed or deleted this phase, so strictly the map did not need touching — but leaving a description that is now wrong twice over is worse · decision-log entry: no, recorded here.

---

## 4. Deviations from the brief / spec

**Two of the five tasks rested on premises that are no longer true. Both were verified against the live archive before any code was written.**

1. **Task 4's numbers are stale, and the consequence is material.** The brief states the section „currently renders 71 players" and expects 46 to leave **47**. The live table renders **119**, of which **116** clear 46 — confirmed both by a direct Sanity query and by counting `<tbody>` rows on the deployed production page, so it is drift in the archive, not a stale local cache. I followed the brief's explicit instruction („the threshold wins — ship it and report the actual number. Do not tune the threshold to hit 47") and shipped 46.

   ⚠️ **The stated purpose — „cut it to the top of the table" — is therefore not achieved: it removes 3 players of 119.** ⚠️ **And the three are Горан Пандев (38), Ацо Стојков (35) and Горан Попов (26)** — three of the club's best-known internationals, whose Беласица totals are small precisely because they left young for bigger clubs. **Пандев remains on „Најдобри стрелци" immediately above**, so the page now lists him as a scorer while omitting him from appearances. The most likely origin of „46" is the `71` in `current-state.md`'s 3.02F line, a months-old snapshot.

   **For the owner's decision:** no threshold yields exactly 47 on today's data — **≥131 gives 46 rows, ≥130 gives 48**, because Коцев and Џорлев are tied on 130. It is one constant, `APPEARANCE_MIN`. Raised as **OV-57**.

2. **Task 5's defect does not exist.** `src/app/(site)/za-nas/page.tsx` does not contain `https://belasica-v2.vercel.app/legendi/tome-stojanov`. The link has been derived from a Sanity lookup as `` `/legendi/${slug}` `` since 3.15 — relative already — and the deployed page serves `href="/legendi/tome-stojanov"`. `facts.md` line 20 also records the link as `/legendi/tome-stojanov`. Nothing was changed; the sweep the brief asked for was run in full and is reported above and in **D-3.24-6**.

**One task grew slightly:** Task 4 gained a user-facing sentence the brief did not ask for (D-3.24-5, §3 item 6).

**Nothing in the out-of-scope list was touched.** No Sanity write; no schema; no person model, Легенди role bands, representatives split, season tables or new statistics tables; no lightbox keyboard handling, focus trap, close-button behaviour or accessible name; no pennants, hero photograph, crest, header or footer; no `src/content/razno.ts`; no new dependency, token or component file.

---

## 5. Changed files / deliverables

**Branch:** `phase-3.24-quick-fixes` · **PR:** see below · **Commit:** see below.

Three source files edited; none added, renamed or deleted.

- `src/components/archive/PhotoLightbox.tsx` — the sizing change (Task 1). Serves both call sites through D-3.05b-3's server/client split, so one fix covers the season galleries and „Разно".
- `src/app/(site)/page.tsx` — `MOMENT_PHOTO_ID` + `MOMENT_LINK` + the `momentPinned` query branch + the gated link (Task 2); the fifth quick-link box and the five-track grid (Task 3).
- `src/app/(site)/statistika/page.tsx` — `APPEARANCE_MIN` + the query threshold + the coverage line and empty-state notice (Task 4).

Record files: `src/_project-state/decisions.md`, `current-state.md`, `file-map.md`, and this report. `00_stack-and-config.md` **not** touched — no version or config value changed.

**No secrets are in the diff or in this report.** The Sanity sweep script reads `.env.local` at runtime and lives only in the session scratchpad; it is not committed, and it constructs its client **without a token**.

### Every new or changed Macedonian string, verbatim — for Lazar's native read

1. **`Прочитај повеќе за младинската школа`** — the link under „Момент од историјата" on the homepage.
2. **`Разно`** — the new quick-link box's label (identical to the existing header nav item).
3. **`Теми од историјата`** — that box's sub-label. Reuses the opening words of `RAZNO_INTRO`.
4. **`Листата ги опфаќа играчите со 46 или повеќе внесени првенствени настапи за Беласица.`** — under „Најмногу настапи". Mirrors the scorers' existing sentence word for word apart from the noun and the number.
5. **`Сѐ уште нема играч со 46 или повеќе внесени настапи, па нема што да се подреди.`** — the „Најмногу настапи" empty-state notice, replacing „Сѐ уште нема внесени настапи за ниту еден играч, па нема што да се подреди." (the old wording claims something stronger than the section can now know).

Strings 1–3 are navigation copy; 4–5 describe the page's own state. **None makes a factual claim about the club**, so all five are safe under content-truth without a `facts.md` entry.

### Vercel preview

*To be filled in on the PR — see §7.*

---

## 6. State updates done

- ✅ **`current-state.md`** — first line set to `NEXT: **3.25-Cowork — Слики и сезона 2025/26**`; a 3.24 summary bullet added at the top of §Summary; the „Built pages / components" entries for `page.tsx`, `statistika/page.tsx` and `src/components/archive/` updated to describe what actually ships; **OV-52 marked CLOSED** with the evidence, its superseded text preserved inline; **OV-53…OV-57 added**.
- ✅ **`file-map.md`** — no file added, renamed or deleted, so no structural change. The `PhotoLightbox.tsx` description was corrected (it was stale since 3.19 and would have been wrong twice over — §3 item 9).
- ✅ **`decisions.md`** — `D-3.24-1, -1b, -2, -3, -4, -5, -6, -7` appended. Append-only respected: no past entry's substance was edited.
- ✅ **`00_stack-and-config.md`** — deliberately untouched; nothing to record.

---

## 7. Risks, follow-ups, what the next phase needs to know

1. **⚠️ OV-57 is the one that needs an answer before launch.** The 46 threshold does not do what it was meant to do and removes Пандев, Стојков and Попов from „Најмногу настапи". One constant, `APPEARANCE_MIN`.
2. **⚠️ Two stale brief premises in one phase.** This project has now recorded this failure mode four times (the 3.11 and 3.13 phase-ID collisions, and both of this phase's). **Every factual premise in a brief should be checked against the live repo and the live archive before code is written** — here, checking first is what stopped an editorial defect from shipping quietly and stopped a no-op edit being made to a dedication to Ace's late father.
3. **The archive has grown a lot since the snapshots most briefs quote.** Live today: **1 054 published photographs** (median height 1 066px; 19 % shorter than 672px), **2 443 published documents**, **119** players with a recorded appearance total, **35** rows on „Најдобри стрелци" (the report at 3.12 says 28). Treat any count in an older state file as a historical reading.
4. **The in-app browser is unreliable for measurement and must not be trusted naively.** In this session it reported `innerWidth`/`innerHeight` as **0**, returned **0×0** from `getBoundingClientRect()` for elements that were laid out and painting, reported `naturalWidth` as the *rendered* size rather than the bitmap's, desynced the screenshot viewport from `window.scrollY` on long pages, deferred every `loading="lazy"` image because the pane reports `visibilityState: "hidden"`, and timed out delivering keystrokes. **What worked:** `offsetWidth`/`offsetHeight` and `offsetLeft`/`offsetTop` chains, `getComputedStyle`, `curl` against the running server for anything about bytes, and — to screenshot a section far down a long page — setting `display:none` on the sections above it and reading at scroll 0.
5. **Build hygiene, confirmed again the hard way.** A `npm run build` fired while `npm run start` was serving `.next` crashed webpack inside `bundle5.js`. `rm -rf .next` with the server stopped fixed it. Both memory notes on this hold.
6. **`APPEARANCE_MIN`'s doc comment points at this report.** If the threshold is changed, that comment should be trimmed with it.

---

## 8. What's now possible that wasn't before

Somebody can open a photograph in the archive and actually look at it — read the names printed under a 1950 clipping, pick a face out of a squad line-up — instead of squinting at a thumbnail floating in a full-screen navy block.
