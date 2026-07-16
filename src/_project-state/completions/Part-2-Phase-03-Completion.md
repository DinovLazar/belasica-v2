# Part 2 · Phase 03 · Code — Completion Report
**Date:** 2026-07-16 · **Outcome (one line):** The Archive index (`/arhiva`) and the Season detail page (`/arhiva/<slug>`) are live, rendering real published Sanity content — the backbone every future season page is built on.

## 1. What shipped (plain language)

The archive is now a real, navigable part of the site. `/arhiva` lists every published season, grouped by decade with a real count per decade and a sticky row of decade links for jumping down the page. Each season is a card that links to its own page. `/arhiva/<slug>` is that page: a photo hero (or a navy title band when the season has no photo), then the season's story, final table, squad, trainers and photos — each section disappearing entirely when there's nothing to show, rather than showing an empty heading.

From here, **every season the archive gains gets a page for free** — publish a season in Studio and its page exists within a minute, no redeploy.

⚠️ **Two things need Lazar's attention before this is fully signed off:** the phase brief I was given was written against a superseded draft of the design handover (§4), and three of the specified states could only be verified against local fixtures because no published season exercises them (§2, §7).

## 2. Definition of Done

The brief's DoD is restated below. Where the brief's item contradicts the merged 2.02 handover, the item is marked and the **shipped** behaviour is what the repo handover + `brand.md` specify (see §4 and D-2.03-1).

- ✅ **`/arhiva` renders decade-grouped season cards from live published Sanity content, newest decade first, with a real „N сезони" count.** Evidence: Vercel preview 200; „1990-ти" section with count „1 сезона" — the count is computed from published docs, and this is the **singular** case working (D-2.02-12; „1 сезони" would be wrong Macedonian). Only one season is published, so "newest decade first" is ordered but not visually demonstrable across decades.
- ✅ **Decade jump-nav works: sticky, in-page anchors, `aria-label`, mobile scroll strip.** Evidence: computed `position: sticky`, `top: 77px` — resolved from `--spacing-header`, not a hardcoded number. `aria-label="Скок по деценија"` (repo handover §5.3 wording, not the brief's „Скокни на деценија" — §4). Jumping to `#d1990` puts the heading at 204px vs the nav's bottom edge at 129px: it clears **both** sticky bars. Mobile rail is `overflow-x: auto` and `window.scrollTo(9999,0)` leaves `scrollX = 0` — the page body never scrolls sideways. **Active-state scroll-spy not built** — explicitly optional in handover §5.3.
- ⚠️ **A season with no photo shows the greybox card; a season with a photo shows its lead photo. Grid 3/2/1.** Evidence: the photo case is confirmed live (1992/93 lead photo renders). Grid computed `335px` (1 col) at 375 and `sm:grid-cols-2 lg:grid-cols-3` at desktop. **The no-photo card could not be verified against real content** — every published season has a photo. The path is `PhotoFrame`'s existing greybox + chip, already shipped and exercised on the homepage. Note: the label is the repo handover's `[PLACEHOLDER: фотографија од сезоната]` chip, **not** the brief's „Без фотографија" (§4).
- ✅ **`/arhiva/<slug>` renders for every published slug via `generateStaticParams`; unknown slug → 404.** Evidence: build output shows `● /arhiva/[slug]` with `└ /arhiva/1992-93` prerendered. Preview: `/arhiva/1992-93` → **200**, `/arhiva/nema-vakva-sezona` → **404**.
- ✅ **Section order correct; every empty data section omitted — verified against a mostly-empty published season.** Evidence: „Сезона 1992/93" has **no `finalTable`**, and the live page's headings are exactly `Приказна за сезоната · Состав · Тренери · Фотографии` — „Конечна табела" is genuinely absent, with no heading and no placeholder prose. `document.querySelector('[aria-labelledby="table-heading"]')` → `null` on the preview. This is the DoD's "mostly-empty published season" check, passing against real data.
- ⚠️ **Photoless season hero is a navy→navy-deep band with orange overline + white H1.** Evidence: code path verified; **no photoless season is published**, so this was checked via fixture/inspection only. Note: `brand.md` has **no `navy-deep` token** — the shipped band is solid `bg-navy`, which is what repo handover §6.2b specifies. The brief's `navy-deep` comes from its stale §0 palette (§4).
- ⚠️ **Standings table: navy `<thead>`, `<th scope="col">`, zebra, orange left bar + weight (not orange text), „—" cells; mobile scroll frame, Belasica row highlighted via CSS (no `scrollIntoView`).** Evidence: all confirmed — `thead` `rgb(18,41,79)`; Belasica row `rgb(251,243,234)` = `highlight`; `box-shadow: rgb(228,116,28) 2px 0 0 0 inset`; club cell navy `rgb(18,41,79)`; `font-weight: 600`; unknown cells render „—"; `scrollIntoView` appears nowhere. Mobile frame scrolls internally (560→333) with `#`/`Клуб` `sticky left: 0px`/`44px` and opaque per-row backgrounds. **But verified against a local fixture, not published content** (no season has a `finalTable`) — D-2.03-4. **Deviation:** the brief's 7-column priority order + drag hint is **not** shipped; all nine columns are kept per D-2.02-10 (§4).
- ✅ **Squad names and trainer chips link to `/legendi/<slug>`; links distinguishable without colour.** Evidence: live squad link `href="/legendi/petar-andreev"`; trainer chips „Гоце Петровски"/„Илија Андреев". These 404 until 2.05 — expected and correct. Labels are navy with a hover underline (`hover:underline hover:decoration-orange`), so they never rely on colour alone.
- ✅ **Photo grid reuses matted `PhotoFrame` with the mixed-quality mat rule; caption = date overline + caption; `provenance` never a visible byline.** Evidence: live `object-fit: contain` on grid images (D-2.02-7) — this is what makes the mixed-quality rule real: the low-res second scan sits on a wider mat inside an identical outer frame. `provenance` appears in no query projection and no component. **Deviation:** the date overline text is **neutral-500 with an orange rule marker**, not orange text (D-2.02-9 / §4).
- ⚠️ **All-empty season shows breadcrumb + navy hero + a single explanatory chip, all data sections omitted.** Evidence: renders correctly — serif H2, explanatory line, five chips, back-link — but **against a fixture** (no such season is published). **Deviation:** the repo handover §6.9 specifies **five** chips (one per pending section) plus a back-link; the brief said "one explanatory `PlaceholderChip`". Shipped per the repo handover.
- ✅ **Every colour/spacing/type value binds to a named `brand.md` token; nothing hardcoded.** Evidence: **no tokens were added and none were needed** — this reverses the brief's instruction, deliberately (D-2.03-1). The brief's four candidates all resolve to existing tokens or are unnecessary: `muted-2`→`neutral-500`, `mist-fill`/`mist-line`→`mist` (PhotoFrame's existing greybox), and `orange-onDark` is unnecessary because `brand.md` §Contrast already clears plain `orange` on navy at 4.6:1 — verified live: hero overline `rgb(228,116,28)`. The brief's §0 hex table is a **different palette** and was not used. The only non-token numbers are layout offsets (`min-w-[560px]`, `left-11`, `scroll-mt-[calc(var(--spacing-header)+3.25rem)]`) — the last is token-derived.
- ✅ **No content-model file changed; no new *undeclared* dependency; no secret committed.** Evidence: `git diff --stat` touches nothing under `src/sanity/schemaTypes/`. **One dependency was added with Lazar's explicit approval** — `@portabletext/react` pinned `6.2.0` (D-2.03-2); it was already in the tree via `sanity`, so `package-lock.json` gained one line. No `.env`, token or key is in the diff.
- ✅ **`npm run build` and `npm run lint` clean.** Evidence: `lint` → no output, exit 0. `build` → `✓ Compiled successfully`, 9/9 static pages. Pre-existing warnings noted below, none introduced.
- ✅ **Both pages verified on the Vercel PR preview at 1280 and 375.** Evidence: `https://belasica-v2-lp0z9ycdo-dinovlazars-projects.vercel.app` — see §5 for the checklist.
- ✅ **Every on-the-fly decision logged as `D-2.03-n` and surfaced here.** Evidence: D-2.03-1 … D-2.03-4 in `decisions.md`, all four in §3.

**Pre-existing warnings (not introduced, not fixed):** the `@sanity/image-url` deprecation notice at build, and the dev-only `.js`-class hydration warning (D-1.05-5) — the latter fires on `/` too, confirmed this session.

## 3. Decisions I made during this phase

- **Built to the repo handover + `brand.md`, not the brief's "resolved decisions"** · the brief's attached handover is a superseded draft whose baked-in decisions would have re-introduced three WCAG AA failures fixed the same day in `faaf8ba` · alternatives rejected: follow the brief literally (fails AA, overwrites owner-directed corrections, cites a palette this project doesn't use); add the four tokens as harmless aliases (`orange-onDark` is an invented colour; the rest duplicate existing tokens) · **decision-log entry: YES — D-2.03-1.** ⚠️ **Escalated to Lazar before writing code; he chose this option.**
- **Declared `@portabletext/react` at pinned 6.2.0** · handover §6.3 requires real Portable Text rendering and the package was in the tree but undeclared · alternatives rejected: hand-write a ~60-line serializer (puts nested-list/overlapping-mark correctness on us, for an archive whose substance is text); render only `normal` blocks (silently drops editor formatting); import it undeclared (breaks silently when `sanity` reorganises deps) · **decision-log entry: YES — D-2.03-2.** ⚠️ **Escalated to Lazar; he approved.**
- **Photo ordering = `coalesce(date,"9999") asc`, `[0]` is the lead/hero** · no lead/order field exists and the model is locked · alternatives rejected: add a field (out of scope), `_createdAt` (entry order, not history), newest-first (inconsistent with the homepage) · **decision-log entry: YES — D-2.03-3.**
- **Verified three states against local fixtures rather than publishing test content** · alternatives rejected: publish a throwaway season to the shared live `production` dataset (invented content on a public site, and not my call); ship unverified · **decision-log entry: YES — D-2.03-4.**
- **Created `src/lib/focus.ts`** for the focus-ring strings, which were already duplicated in `page.tsx` and `DecadeTimeline.tsx`. New components import it; **the two homepage copies were left untouched** because the homepage is out of scope. This leaves a third copy in the repo temporarily — noted in the file's own header and in `file-map.md` · alternative rejected: refactor the homepage too (out of scope) · **decision-log entry: no** — additive, no behaviour change.
- **Moved `Reveal` inside `SeasonCard`'s `<li>`** rather than wrapping the card from the outside. Wrapping would have put a `<div>` directly inside `<ul>` — invalid HTML that also breaks the announced item count · **decision-log entry: no** — a correctness fix, not a choice.
- **Back-links section omitted on the fully-empty season.** Handover §6.8 makes back-links the final section and §6.9 gives the empty notice its own back-link; rendering both duplicates the link. `season-empty-desktop.png` shows no separate back-links section, so I followed the mockup · **decision-log entry: no** — resolves an ambiguity in favour of the mockup, no spec contradicted.

## 4. Deviations from the brief / spec

**The brief itself is the deviation.** It was written against a stale handover draft attached from `~/Downloads/`, which is a different document from `docs/design-handovers/Part-2-Phase-02-Handover.md` — the file the brief's own "Read first" list points to. Full reasoning in **D-2.03-1**. Everything below ships per the **repo handover + `brand.md`**:

| Brief said | Shipped | Why |
|---|---|---|
| Orange season-card overline | **neutral-500** | Orange on white is 3.08:1 — fails AA (D-1.02-1 / D-2.02-1) |
| Add `orange-onDark`, `mist-fill`, `mist-line`, `muted-2` to `brand.md` | **No tokens added** | All resolve to existing tokens or are unnecessary; `orange-onDark` would be an invented colour |
| Mobile table: 7 priority columns + „← Повлечи…" hint | **All 9 columns**, `#`+`Клуб` sticky-left | The table is the archival artifact — hiding columns drops recorded data (D-2.02-10) |
| Photo caption date = orange overline | **neutral-500 + orange rule marker** | Orange on paper is 2.8:1 — fails AA (D-2.02-9) |
| Standings/squad footnotes | **Not rendered** | Repo handover §6.4/§6.5 specify none; the mockup strips are mockup annotations (D-2.02-15) |
| All-empty season: one chip | **Five chips** + explanatory copy | Repo handover §6.9 |
| Overline „Црно-бела носталгија"; `aria-label="Скокни на деценија"` | **No page overline**; `aria-label="Скок по деценија"` | Repo handover §5.2 / §5.3 wording |
| Hero band `navy → navy-deep` | **Solid `bg-navy`** | No `navy-deep` token exists in `brand.md`; §6.2b specifies a navy band |
| §0 hex table (navy `#12243B` …) | **Locked palette** (navy `#12294F` …) | A different palette; `brand.md` is the only source |

**Also not done, deliberately:** scroll-spy on the jump-nav (optional per §5.3); `h-header` on `<header>` (handover §12 MT-2 suggests it as 2.03 "optional hardening", but it edits shipped chrome the brief puts out of scope).

## 5. Changed files / deliverables

**Branch:** `phase-2.03-archive-season-templates` · **Commit:** `496a580` · **PR:** [#13](https://github.com/DinovLazar/belasica-v2/pull/13) → `main` (open, awaiting Lazar's diff-review + preview check)
**Vercel preview:** `https://belasica-v2-lp0z9ycdo-dinovlazars-projects.vercel.app`

**New — routes:** `src/app/(site)/arhiva/page.tsx` · `src/app/(site)/arhiva/[slug]/page.tsx`
**New — components** (`src/components/archive/`): `Breadcrumb` · `SectionHeading` · `DecadeSectionHeader` · `SeasonCard` · `DecadeJumpNav` · `StandingsTable` · `SquadTable` · `PersonChip` · `SeasonStory` · `PhotoGrid` · `SeasonEmptyNotice`
**New — lib:** `src/lib/archive.ts` (decade labels, count pluralisation, `isBelasicaRow`, `statCell`) · `src/lib/focus.ts`
**Edited:** `src/components/home/PhotoFrame.tsx` (additive `fit` prop, default `cover` — no existing caller changed) · `package.json` + `package-lock.json` (`@portabletext/react` 6.2.0) · `decisions.md` · `00_stack-and-config.md` · `file-map.md`
**Deleted before commit:** the temporary fixture route used to verify the standings table and empty notice (D-2.03-4).
**No secrets in the diff.** No file under `src/sanity/schemaTypes/` touched.

**Eyeball checklist for Lazar** (preview, `/arhiva` and `/arhiva/1992-93`):
1. **Card overline „1990-ти" is grey, not orange** — this is the AA fix; the brief asked for orange.
2. **On the season page there is no „Конечна табела" section at all** — that season has no table, and the section omits itself rather than showing an empty heading.
3. **Scroll the season page at phone width** — the page must never slide sideways; only the table (when one exists) scrolls inside its frame.
4. **The second photo in „Фотографии"** sits on a wider mat inside the same outer frame as the first — small scans are matted, never stretched.
5. **Click a squad name or trainer chip** — it goes to `/legendi/…` and 404s. That is expected; those pages arrive in 2.05.

## 6. State updates done

- ✅ `src/_project-state/decisions.md` — D-2.03-1 … D-2.03-4 appended (append-only respected; no history edited).
- ✅ `src/_project-state/00_stack-and-config.md` — `@portabletext/react` 6.2.0 added to the pinned table with rationale; `@portabletext/types` noted as transitive.
- ✅ `src/_project-state/file-map.md` — all 15 new files listed; `PhotoFrame`'s `fit` prop noted on its existing entry.
- ✅ `src/_project-state/current-state.md` — snapshot rewritten, `NEXT:` set to 2.04.

## 7. Risks, follow-ups, what the next phase needs to know

- ⚠️ **Owed to Lazar — three states are fixture-verified, not content-verified (D-2.03-4).** The **standings table**, the **photoless navy hero** and the **fully-empty season notice** have never been seen backed by real Sanity content, because only one season is published and it has no `finalTable`. They're correct in code and in the browser. Natural clearing point: **2.09**, when ~74 shell seasons make these the *common* states. If Lazar wants them cleared sooner, publishing one photoless season and one season with a `finalTable` would do it.
- ⚠️ **The 2.03 brief should be regenerated** from the merged 2.02 handover before it's kept as instruction history — otherwise the next reader hits the same contradiction (D-2.03-1).
- **Flagged for the 2.01 model owner:** `photo` has no lead/order field, so the card lead and hero are "earliest free-text `date`" (D-2.03-3). Deterministic, but a curator **cannot promote a better lead photo** without editing dates. A curated lead needs a model change — not taken here.
- **`--spacing-header` is a mirror, not a source** (D-2.02-17). Both new pages depend on it. If anyone changes `SiteHeader`'s padding or crest size, the sticky jump-nav and every anchor offset silently go wrong. The hardening (`h-header` on `<header>`) is still unclaimed.
- **2.05 must build `/legendi/<slug>`** — squad names and trainer chips already link there and 404 today. The slugs are live now (e.g. `petar-andreev`).
- **`OQ-1` (visible `provenance`) is still open** and is now a real question: `provenance` is required on every photo but rendered nowhere. Must be decided **before 2.09 publishes photos**, not before 2.04.
- No Lighthouse run this phase — the ≥95 gate is 3.02. The season page ships one `priority` hero image, same as the homepage.

## 8. What's now possible that wasn't before

Every season published in Studio gets a real, linkable archive page within a minute — so 2.09 can ingest ~74 season shells and watch the archive populate itself, and 2.04/2.05 can build statistics and person pages against a season page that already links to them.
