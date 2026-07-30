# Part 3 · Phase 05b · Code — Completion Report

**Date:** 2026-07-30 · **Outcome (one line):** The homepage is a front door again — a clean vector crest, ten legends and six records instead of the whole archive — and a season's archival photographs can finally be opened and looked at.

---

## 1. What shipped (plain language)

The homepage was still asking Sanity for **every** player and **every** record. That was right when the archive held 5 players and 7 records; it now holds 160 people and 30 records, so a visitor scrolled past 86 legend tiles and 30 record cells before reaching anything else. The legends band is now the **ten most-capped players** and the records strip is **six named records**. The crest at the top of the page is now a repaired vector drawing — the old one was a scan clipped on its right edge with its pennant point cut off flat — so it is sharp at every size, from the 40px header badge to the 128px hero block.

The other change is on the season pages: the „Фотографии" grid used to show each archival scan at about 380px wide, which is not a way to *look* at a 1963 team photo. Every thumbnail is now a real button that opens the scan almost full-screen, with its date and caption, arrows that move through the season's set, and the keyboard and screen-reader behaviour a dialog is supposed to have.

Nothing was invented and nothing was hidden: the eight legends with no portrait on file get the monogram tile the brand specifies, not a stand-in face, and none of them was dropped for lacking a photograph.

---

## 2. Definition of Done

### Verifiable by the executor

- ✅ **`npm run build`, `npm run lint` and `npx tsc --noEmit` all clean** — evidence: build `✓ Generating static pages (270/270)`, exit 0, run in an isolated worktree; `eslint` and `tsc --noEmit` both produced no output. The build log also shows the 3.02F retry layers absorbing live CDN timeouts (`/arhiva/1977-78` exhausted all 5 read attempts and the page-level retry recovered it) — the designed behaviour, not a regression.
- ✅ **`package.json` and the lockfile unchanged — zero new dependencies** — evidence: `git diff main --name-only -- package.json package-lock.json` returns empty. The lightbox is plain React; its entry animation uses `tw-animate-css` **1.4.0, already pinned and already imported by `globals.css`**.
- ✅ **No file under `src/sanity/schemaTypes/` changed; no `brand.md` token added or altered; no `@theme` block changed; no Sanity document written** — evidence: `git diff main --name-only` lists 14 files, none under `src/sanity/`, and neither `brand.md` nor `src/app/globals.css` appears. No write tool was used against Sanity this phase (reads only, to verify the ranking and the six labels).
- ✅ **`/crest.svg` returns 200 and renders in header and hero; no `/_next/image` request for the crest on either surface** — evidence: `curl` → `200 image/svg+xml`; in-page `performance.getEntriesByType('resource')` shows exactly one crest request, `/crest.svg`, 31,291 bytes, and `optimizerReferencingCrest: 0`. Both `<img>` elements report `natural: [916, 1294]` and render at 28×40 (header) and 91×128 (hero).
- ✅ **Header measures 78px at 1280 and at 375** — evidence: `header.getBoundingClientRect().height` = **78** at both viewports; `--spacing-header` reads `4.875rem`. The token was **not** changed. Anchor jump re-verified anyway: `/arhiva/1982-83#prikazna` puts the target's top at 78.16px against a header bottom of 78 — a 0.16px sub-pixel gap, `scroll-margin-top: 78px`.
- ✅ **The legends band renders exactly 10 cards, and they are the ten named in the brief** — evidence: direct `<ul>` children = **10**; order rendered Петар Андреев · Томе Стојанов · Дончо Георгиев · Костадин Секулов · Љупчо Мафков · Милан Василев · Митко Георгиев - Шеки · Ристо Панов · Стефан Сулев · Тони Атанасов. That is the brief's ten, arranged by the D-3.03-2 display sort (portraits first, then Cyrillic name) rather than by appearances — the ranking happens in GROQ. Cross-checked against live Sanity before building: 555 · 383 · 366 · 336 · 328 · 262 · 260 · 235 · 235 · 232, with the 235 tie broken by `name asc`.
- ✅ **2 render a photographic portrait (Андреев, Т. Стојанов) and 8 render the monogram tile; zero grey boxes, zero stand-in faces** — evidence: `portraits: 2`, `monograms: 8`, `withPortrait: ["Петар Андреев","Томе Стојанов"]`; screenshot shows the eight orange monogram tiles (ДГ, КС, ЉМ, МВ, МГ, РП, СС, ТА) on navy with the orange keyline.
- ✅ **The records strip renders exactly 6 cells, in the briefed order, with `Шампион на Македонија` as the featured orange cell** — evidence: `totalCells: 6`; feature label `Шампион на Македонија` with `backgroundColor rgb(238,122,22)` and `color rgb(13,31,60)`; the remaining five in order Вицешампион · Полуфинале — Куп · Југословенски второлигаш · Најдобар стрелец · Рекордер по настапи.
- ✅ **`/statistika` still renders all 30 records, grouped 5 / 13 / 8 / 4** — evidence: measured groups `Трофеи и признанија: 5`, `Стрелци: 13`, `Настапи: 8`, `Друго: 4`, total **30**.
- ✅ **`/legendi` still renders three bands totalling 160 (86 · 46 · 28) with 0 duplicates** — evidence: bands `Играчи 86`, `Тренери 46`, `Раководство 28`, total **160**; 160 person links, 160 unique, `duplicates: 0`.
- ✅ **Lightbox exercised in-browser on `/arhiva/1982-83` (11 photos)** — evidence, all measured on the built output: opens on click and on activating the focused thumbnail; `role="dialog"`, `aria-modal="true"`, `aria-label="Фотографии од сезоната"`; `ArrowRight` 1→2, `ArrowLeft` 2→1, `ArrowLeft` from 1 → **11 / 11**, `ArrowRight` from 11 → **1 / 11** (wraps at both ends); `Escape` closes; a click on the backdrop closes while a click on the photo does **not**; focus returns to the triggering thumbnail on both close paths (`focusReturns: true`, `focusReturns2: true`); the page behind does not move on open (`pageUnmoved: true`) and its scroll offset is identical before and after (**17269.5** both times).
- ✅ **Lightbox verified on a season with exactly one photo** — evidence: `/arhiva/1931-32` (1 gallery photo) opens with `controlCount: 1`, `controlLabels: ["Затвори"]`, `arrowsRendered: 0` — the arrows are absent, not hidden; the counter is also not rendered; `ArrowRight` is inert; Escape closes and focus returns.
- ✅ **Every new text/background pair ≥ 4.5:1; every new interactive target ≥ 24×24; the lightbox's own controls ≥ 48×48** — evidence: computed against the backdrop's real composite (navy at 96% over the worst case, a white scan): caption paper **13.44:1** worst / 14.95:1 best; date and counter `paper/80` **9.10:1** worst / 9.93:1 best; control ink navy-on-orange **5.81:1**; control hover navy-on-paper **14.95:1**. All three controls measure exactly **48×48** at 1280 and at 375 (`controlsAllGE48: true`), and all sit inside the viewport at 375. Grid thumbnails are 373×249 (desktop) / 335×223 (mobile).
- ✅ **No horizontal scroll at 1280 and 375 on `/` and on the season page, overlay open and closed** — evidence: `window.scrollTo(500, y)` leaves `scrollX` at **0** in every case, and `documentElement.scrollWidth === clientWidth` (1280/1280 and 375/375) with the overlay both open and closed.
- ✅ **`[PLACEHOLDER]` chips inside `<main>` remain 0 on `/` and on the season page** — evidence: `placeholderChipsInMain: 0` on `/` at 1280 and 375, on `/arhiva/1982-83`, on `/statistika`, on `/legendi` and on `/legendi/petar-andreev`.
- ✅ **Vercel PR preview verified before requesting merge; report lists the URL and the routes checked** — evidence: https://belasica-v2-e2ypyce8i-dinovlazars-projects.vercel.app, all 10 routes 200 and an unknown slug 404, full table in §5. The preview reproduces the local build exactly, including the lightbox exercised in-browser there.

### Owed to Lazar (now on the register in `current-state.md`, items 9–11)

- ⬜ Eyeball the new crest at desktop and on a phone — header, hero and browser tab.
- ⬜ Confirm the six homepage records are the right six.
- ⬜ Decide whether to source portrait photographs for the eight legends who have none.

---

## 3. Decisions I made during this phase

All seven are logged as **D-3.05b-1 … D-3.05b-7** in `src/_project-state/decisions.md`.

1. **The homepage's six records are an explicit label whitelist, and `CATEGORY_PRIORITY`/`sortRecords` were deleted** · the brief required a whitelist over a slice or category filter, and leaving the old sort in place as dead code would suggest the order still came from Studio metadata · rejected: slicing `[0...6]` after the existing sort (a 31st `honours` record or an `order` renumber would silently change the front page) and filtering on `category == "honours"` (cannot express a set that mixes an honour, a scorer and an appearance record) · **decision-log entry: YES (D-3.05b-1).** I also pinned the featured cell to „Шампион на Македонија" specifically rather than taking `[0]` of the survivors, so an unpublished championship leaves no featured cell instead of promoting the runner-up into the orange one — the brief's rule 11 forbids back-filling.
2. **The scoreboard's final cell widens to close the last row** · not in the brief. Capping the strip at six leaves five cells in a 2/3-column grid, and because the cells sit *on* the orange ground the leftover track paints as an orange rectangle beside the one deliberate orange cell — a visible hole, and the old 7-record set happened to divide evenly so it had never appeared · rejected: `lg:grid-cols-5` (the 76-character scorer value would set ~5 lines deep in a 240px cell), a navy `<ul>` background (would make the 2px gaps navy and kill the orange-rule motif), and leaving the gap · **decision-log entry: YES (D-3.05b-2).**
3. **`PhotoGrid` gained an opt-in `lightbox` prop instead of the lightbox being unconditional** · `PhotoGrid` is shared with `/legendi/<slug>`, and the brief scopes the lightbox to the season page · this follows `PhotoFrame`'s `fit` precedent (D-2.02-7) · **decision-log entry: YES (D-3.05b-3).** Same entry records that overlay URLs use `.fit("max")` rather than a bare `.width(2400)`, because Sanity's `w` upscales and brand.md's mixed-quality rule forbids enlarging a low-res scan.
4. **The homepage keeps its graceful `EMPTY` fallback under `fetchOrThrow`** · task 21 says "the same way the season and person templates do", and those templates deliberately *throw* — but their reason (a silent `null` became a 404 for a season that exists) does not transfer to the homepage, where a throw takes the whole site down and a placeholder front door is the more honest degradation. The brief itself asks to keep the fallback, so this is a reading, not a departure · **decision-log entry: YES (D-3.05b-4).**
5. **The overlay's scroll lock targets `documentElement`, not `<body>`** · the first cut used the usual `body { overflow: hidden }` and measurement showed it was a **no-op** · **decision-log entry: YES (D-3.05b-5).**
6. **Neither focus restoration nor the entry motion may depend on `requestAnimationFrame`** · both were built on rAF and both failed when measured in a hidden document · the entry motion became a CSS animation from the already-pinned `tw-animate-css` rather than hand-written `@keyframes`, so no new CSS and no `@theme` change · **decision-log entry: YES (D-3.05b-6).**
7. **Kept `unoptimized` on the crest, and re-tested D-3.05-11's premise instead of assuming it** · production's `/_next/image` now returns **200** at `w=640/1920/3840`, so the 402 quota has recovered — but `unoptimized` stays because Next refuses to optimize SVG without `dangerouslyAllowSVG` · rejected: dropping `unoptimized` (would 400 on the SVG) and setting `dangerouslyAllowSVG` (relaxes a real security boundary to buy nothing for a 31KB static asset) · **decision-log entry: YES (D-3.05b-7).** This mattered beyond the crest: it is what made the brief's mandated `next/image` + `sizes="92vw"` safe for the lightbox.

**Two smaller calls, recorded here rather than in the log:**

- The overlay is rendered in place (a `position: fixed` sibling of the grid) rather than in a portal. `aria-modal="true"` already scopes assistive tech to it, and a portal adds a mount point for no measured benefit. If a future phase introduces a stacking context above `z-50`, this is the thing to revisit.
- The single-photo case also omits the „N / M" counter, not just the arrows. The brief only requires the arrows to go; „1 / 1" is noise, and the brief's own reasoning (no control that is a dead end) points the same way.

---

## 4. Deviations from the brief / spec

- **None on scope.** All five task groups shipped in full.
- **One task turned out to be a no-op, correctly:** task 4 said to re-measure the header and update `--spacing-header` *if the measured height moved*. It did not move (78px at both viewports), so the token is unchanged. I re-verified an anchor jump anyway rather than relying on the arithmetic.
- **The brief's asset table lists `favicon.ico` as "still 64×64".** The delivered file is a multi-size `.ico` containing **16×16, 32×32 and 64×64**. That is a superset of what the brief describes and strictly better for browser tab rendering, so it was landed as delivered; noting it because the table said one size.
- **The Impeccable detector's one finding is resolved at source, not waived.** `broken-image` fired on `PhotoLightbox.tsx` throughout the phase. I first took it for a false positive on the overlay's `<Image src={photo.url}>` (a runtime `src` the detector can't resolve). On checking the reported line it was not an element at all — the pattern was matching a literal `<img>` I had written in **comment prose**; the line number drifting across edits (264 → 274 → 285 → 286) was tracking that comment. Fixed by rewording the comment, so there is **no ignore rule, no inline waiver and no design change**. Final state: `detect.mjs` returns `[]` across all six changed files. The diff is comment-only (`git diff` = 2 prose lines inside a `{/* */}` block), so no rebuild or re-verification was required.

---

## 5. Changed files / deliverables

**Branch:** `phase-3.05b-homepage-followup` → **[PR #34](https://github.com/DinovLazar/belasica-v2/pull/34)** · five commits (feature, three measured fixes, state/docs).

**New**

- `src/components/archive/PhotoLightbox.tsx` — the overlay: provider + trigger + dialog. The repo's fifth client component.
- `public/crest.svg` — the vector master (916×1294, pure paths, no embedded raster, no script, no external refs).

**Edited**

- `src/app/(site)/page.tsx` — crest → `/crest.svg`; `legends` ranked and sliced `[0...10]` in GROQ; `client.fetch` → `fetchOrThrow` keeping the fallback.
- `src/components/home/ClubRecords.tsx` — label whitelist; `CATEGORY_PRIORITY`/`sortRecords` removed; `lastCellSpan` helper.
- `src/components/archive/PhotoGrid.tsx` — opt-in `lightbox` prop; builds overlay URLs server-side; `ArchivePhoto` gained optional `width`/`height`.
- `src/app/(site)/arhiva/[slug]/page.tsx` — gallery projection returns asset dimensions; passes `lightbox`.
- `src/components/SiteHeader.tsx` — crest → `/crest.svg`.
- `public/crest.png`, `public/crest-ui.webp`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/favicon.ico` — replaced with the delivered re-exports, dimensions preserved.
- `src/_project-state/decisions.md`, `current-state.md`, `file-map.md` — see §6.
- `briefs/Part-3-Phase-05b-Code.md` — the brief itself, committed with the phase.

**Not touched, deliberately:** `src/app/layout.tsx` (the Open Graph block), `brand.md`, `src/app/globals.css`, anything under `src/sanity/schemaTypes/`, `package.json`, `package-lock.json`.

**No secrets** are in the diff; the repo is public and nothing in this phase needed a token.

### Vercel preview — verified before requesting merge (gate not waived)

**Preview URL:** https://belasica-v2-e2ypyce8i-dinovlazars-projects.vercel.app

| Route | Expected | Result |
|---|---|---|
| `/` | 10 legends · 6 records · crest from `/crest.svg` | **200** — 10 unique `/legendi/` links, and they are exactly the briefed ten slugs; all six record labels present; `src="/crest.svg"` present and `crest-ui.webp` **no longer referenced anywhere**; a non-whitelisted record (`Вкупна екипна статистика низ историјата`) is **absent** |
| `/arhiva` | archive index | **200** |
| `/arhiva/1982-83` | season page + lightbox | **200** — 11 lightbox triggers; overlay exercised in-browser at 375 (see below) |
| `/arhiva/1931-32` | one-photo season | **200** — 1 trigger |
| `/statistika` | all 30 records | **200** — the 30th record (`Вкупна екипна статистика низ историјата`) still renders here |
| `/legendi` | 160 in three bands | **200** — 160 unique person links |
| `/legendi/petar-andreev` | person page **unchanged** | **200** — **0** lightbox triggers |
| `/za-nas` | about | **200** |
| `/kontakt` | contact | **200** |
| `/crest.svg` | the vector master | **200** `image/svg+xml` |
| `/arhiva/ne-postoi-sezona` | unknown slug | **404** |

**Lightbox exercised on the preview itself**, at a 375×812 viewport: opens (`1 / 11`); `role="dialog"` · `aria-modal="true"` · `aria-label="Фотографии од сезоната"`; three controls (Затвори · Претходна · Следна) all ≥ 48×48; `ArrowLeft` from 1 wraps to **11 / 11** and `ArrowRight` wraps back to **1 / 11**; `Escape` closes; focus returns to the triggering thumbnail; `documentElement` overflow `hidden` while open and `visible` after; scroll offset identical across open→close (4573).

**`[PLACEHOLDER]` chips inside `<main>`: 0** on both `/` and `/arhiva/1982-83` on the preview. (The page source contains 4 raw occurrences; all are the two documented **footer** chips — PL-3 „е-пошта за контакт" and PL-15 „профили на социјални мрежи" — each appearing once in the rendered footer and once in the RSC flight payload. `<main>` itself is clean, which is what the DoD measures.)

---

## 6. State updates done

- ✅ **`current-state.md`** — headline line rewritten (`NEXT: **3.06 …**`), new leading summary bullet for 3.05b, component lists updated (`PhotoLightbox` added as the fifth client component; `ClubRecords` noted as whitelisted), the „Remaining human steps" register gained items **9–11** (crest eyeball, six-records confirmation, portrait decision), and the „build reads only partly hardened" known issue narrowed to record that the homepage is now covered.
- ✅ **`file-map.md`** — `PhotoLightbox.tsx` added; `PhotoGrid`, `ClubRecords`, `page.tsx`, `SiteHeader`, the season page, `public/crest.svg`, `public/crest.png`, `public/crest-ui.webp` and the three icon files all updated.
- ✅ **`00_stack-and-config.md`** — **not touched, correctly**: nothing pinned moved. Verified rather than assumed — `git diff main` shows `package.json` and `package-lock.json` unchanged.
- ✅ **`decisions.md`** — D-3.05b-1 … D-3.05b-7 appended; no prior entry edited. D-3.03-3's Status is left alone per the repo's rule that a reversal is a new entry linking the old; D-3.05b-1 states that it supersedes D-3.03-3 on the homepage surface only.

---

## 7. Risks, follow-ups, what the next phase needs to know

- **`ClubRecords` is now homepage-specific in behaviour but still generically named.** It lives in `src/components/home/`, it is used by exactly one page, and its docblock says so — but a future phase that reaches for it elsewhere will get six named records, not the records it passes in. Verified before choosing this: `/statistika` renders its 30 through `ClubRecordList` + `groupClubRecords`, a separate path.
- **Two ordering rules for records now exist** — the homepage's whitelist and `/statistika`'s `groupClubRecords` (D-3.02F-C-5). Each is commented with a pointer to the other; this is the second phase to add one, so a third surface should reuse rather than add a third.
- **`overflow: hidden` does not block `window.scrollTo`.** This is what made the scroll-lock diagnosis ambiguous for a while. Any future modal must be tested with a real user scroll or by checking which element the lock landed on — a `scrollTo` probe proves nothing.
- **rAF does not fire in a hidden document.** Two separate parts of this component were built on that assumption and both broke. Worth remembering for any future overlay, toast or transition.
- **D-3.05-11 is now stale as a standing constraint.** The optimizer quota has recovered (measured). A future phase that wants `next/image` optimization back for the crest still should not take it — the SVG reason stands — but other surfaces are no longer blocked by a 402.
- **3.06 redesigns the season page**, which is exactly where the lightbox now lives. `PhotoLightbox` is styled entirely from `brand.md` tokens and takes plain data, so a re-dress of the grid around it should not require touching the overlay; the one coupling to know about is that `PhotoGrid` builds the overlay's URLs.
- **The archive still contains the OV-13 content contradiction** surfaced at 3.02F (two different all-time totals on `/statistika`). Untouched here; still owed to Ace.

---

## 8. What's now possible that wasn't before

A visitor lands on a front door that introduces the club instead of dumping the archive on them — and when they reach a season, they can actually *look* at the photographs the archive exists to preserve.
