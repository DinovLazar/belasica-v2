# Part 3 · Phase 04 · Code — Completion Report
**Date:** 2026-07-26 · **Outcome (one line):** All 96 season pages were rebuilt from one template into the crnobelanostalgija-style long-scroll document, and every field the 3.01/3.02 phases added — team photo, table image, trainer, lineup/stats, results, story — now actually renders.

## 1. What shipped (plain language)

Until today the season pages still showed the 2.03 layout, and none of the content filled during Part 3 was visible anywhere: the archive held a curated team photo for 83 seasons, a standings image for 87, a trainer for 67 and a squad roster for 80 — and the site rendered none of it. `/arhiva/<slug>` now reads all of it.

A season page opens with a navy title band carrying the decade and the season name, with that season's team photograph mounted on a mat inside the band. Below it a small jump-rail lists only the sections this particular season actually has, then: **Табела** (the league table as the scanned image, per the owner's decision), **Тренер и статистика** (the coach's name in the heading, then the season's squad and scorers), **Резултати** (match by match), **Приказна за сезоната**, **Фотографии**, and finally links to the previous and next season so the whole 1922→2026 archive can be walked end to end.

The „Резултати" section proved the point while this phase was still being verified: it started empty on all 96 seasons, and when the parallel content pass published the first 10, the section — and its jump-link — appeared on those pages by itself, with no code change and no redeploy. The other 86 will fill the same way.

Sparse seasons look deliberate rather than broken: a section with no content simply is not there, and a season with no photograph gets the navy title band instead of an empty grey box.

## 2. Definition of Done

- ✅ **Sections render in the exact order team photo → table image → trainer & stats → results → story → gallery → prev/next nav, each self-omitting when empty** — evidence: a structural sweep of the **rendered HTML of all 96 prerendered pages** on the local production build compared each page's `<section id>` list against the season's live field values. **96/96 matched exactly**, in that order, on every build. Totals on the final build: `tabela` 87, `trener` 83, `rezultati` **10**, `prikazna` 66, `fotografii` 91 — which reconciles with the dataset (tablePhoto 87; trainer 67 ∪ lineupAndStats 80 = 83; results 10, the Cowork pass's first batch, which landed mid-phase; story 66; 96 − 5 empty galleries = 91).
- ✅ **Reads `teamPhoto`, `tablePhoto` (both dereferenced), `trainer`, `lineupAndStats`, `results`, `story` — from LIVE Sanity, not a fixture, on a rich season** — evidence: `/arhiva/1985-86` renders the 1985/86 squad photograph (asset `45d8ae21…-960x649`), the „ВТОРА ЛИГА ИСТОК" standings scan (`8443e112…-1031x1605`), „Тренер: Благој Истатов", the 24-block roster („Најдобар стрелец на сезоната: Н. Шабани — 12 гола." … „21. Воротовиќ0+2/0"), the season narrative, and 11 gallery photos. The full GROQ is quoted in §9.
- ✅ **`teamPhoto` and `tablePhoto` shown once each and excluded from the gallery (no photo appears twice; deduped by `_id`)** — evidence: the sweep parsed every `<img>` on all 96 pages and checked the lead assets against the gallery assets. **0/96 pages leak a lead photo into the gallery by `_id`.** Archive-wide the gallery holds 713 photos = 889 season-linked photos − the leads. ⚠️ **One related content defect found and NOT fixed here** — see §7 and D-3.04-10: on 3 of 96 seasons the 2.09 ingestion created **two distinct `photo` documents sharing one uploaded image**, so the same picture renders twice; on `1992-93` one of that pair is the `teamPhoto`, so the lead image does reappear. The `_id` contract holds; the duplication is upstream content.
- ✅ **A photoless season shows the navy title band, never a greybox** — evidence: content-verified on the 13 live seasons with no `teamPhoto`, e.g. `/arhiva/1940-41` (navy band, decade overline, H1, no image element in the band); the sweep asserts `bg-navy` and no placeholder in the lead block for all 13.
- ⚠️ **An all-empty season shows the all-empty notice** — **fixture-verified, not content-verified.** After the 3.02 fill **no published season is fully empty** (`allEmpty` = 0 of 96), so this state cannot be reached from live content. Proven against a temporary local fixture that blanked every field on `1922-26`: the notice rendered („Оваа сезона сѐ уште нема објавени детали.") with the six re-worded chips, and the anchor rail correctly did not render. Fixture stripped before commit. Same shape as D-2.03-4 / D-2.06-6.
- ✅ **`results` renders correctly when present and self-omits when absent** — **content-verified, and it happened during this phase.** It was first proven against a temporary non-plausible fixture (`Клуб А`, `Клуб Б` … per D-2.02-15), which was stripped before commit. Then, while verification was still running, the parallel Cowork pass published `results` on the first **10 seasons** (`1930-31` … `1940-41`, 2–16 blocks each) — so the section is now proven against **real content**: `/arhiva/1938-39` renders „Резултати" with 16 real match rows in the per-match hairline rhythm („Беласица - Шумадија 7:0", „Тиквеш (Неготно)-Беласица 0:3(службено)" …) and „Резултати" appears in the jump-rail between „Табела" and „Приказна". The absent half is content-verified on the other 86 seasons (no heading, no jump-link). **This is exactly the behaviour the brief asked for — the section appeared by itself, with no code change and no redeploy.**
- ✅ **Anchor nav lists only existing sections and is offset by `--spacing-header`; prev/next resolve and omit at the ends** — evidence: sweep — the rail's `href`s equal the rendered section list on **95/96** pages and the rail is correctly absent on the 96th (`2025-26`, which has one section, below the two-entry threshold). Offset measured in-browser: clicking `#trener` lands the section top at **77px**, exactly the sticky header's bottom edge, with the `<h2>` clear of it; every anchored section carries `scroll-mt-header` (computed `77px`). Prev/next verified as a complete spine — exactly one season with no previous (`1922-26`), exactly one with no next (`2025-26`), a single unbroken 96-link chain, every link symmetric.
- ✅ **Only `brand.md` tokens; no new token; no new npm dependency** — evidence: no hex, no px font size and no raw font/colour literal in any new file; `git diff main -- package.json package-lock.json` is empty; `brand.md` unchanged. Orange appears only as a marker (the `SectionHeading` rule, the trainer card's 2px left edge, the photo-caption rule, hover underlines) and as text only on solid navy (the decade overline, 4.68:1 measured).
- ✅ **`npm run build` and `npm run lint` pass clean; all routes 200** — evidence: build ✓ **115 pages**, all 96 season routes prerendered (SSG) with `Revalidate 1m`; `eslint` produced no output. Routes on the production build: `/` `/arhiva` `/arhiva/1985-86` `/arhiva/1940-41` `/arhiva/2025-26` `/arhiva/1922-26` `/statistika` `/legendi` `/legendi/petar-andreev` `/za-nas` `/kontakt` → **all 200**; unknown slug `/arhiva/nema-vakva` → **404** (correct).
- ✅ **Verified at 1280 and 375: no horizontal scroll; every text/bg ≥ AA; heading order clean; all images alt'd; keyboard focus ring** — evidence below.
  - **No horizontal scroll:** at 375, `document.documentElement.scrollWidth == innerWidth == 375`; the only element wider than the viewport is the jump-rail's own `<ul>` **inside** its `overflow-x-auto` container (rail 440px vs. 375px), the same containment `DecadeJumpNav` uses. At 1280, `scrollWidth == 1280`.
  - **Contrast** (sampled from the rendered DOM, effective colour over the resolved background): orange/navy overline **4.68**, neutral-500/white („Тренер:", „Претходна сезона") **5.43**, neutral-700/paper (roster, results, story) **10.37**, navy/paper (headings, links, rail) **13.12**, paper/navy (H1, photo caption on navy) **13.12**, navy/white (trainer name) **14.43**. AA floor is 4.5. The one sub-AA pair on the page is the breadcrumb's mist „/" separator (1.19) — `aria-hidden`, decorative, pre-existing from 2.03, not text.
  - **Heading order:** sweep asserts no skipped level inside `<main>` on all 96 pages, and that the first heading is the `<h1>`. On `1985-86`: H1 „Сезона 1985/86“ → H2 Табела → H2 Тренер и статистика → H3 „Тренер: Благој Истатов" → H3 Состав и статистика → H2 Приказна за сезоната → H2 Фотографии.
  - **Alt text:** sweep asserts every `<img>` in `<main>` has a non-empty `alt` — **0 failures across 96 pages** (13 images on `1985-86`).
  - **Focus ring:** measured on a real focused element — `box-shadow: rgb(247,244,236) 0 0 0 2px, rgb(18,41,79) 0 0 0 4px` on the rail links, the prev/next cards, the back-links and the breadcrumb — i.e. brand.md's „navy 2px, 2px offset".
- ✅ **PR opened, Vercel preview verified 200 and rendering correctly, preview URL + checklist in the report (gate NOT waived)** — [PR #26](https://github.com/DinovLazar/belasica-v2/pull/26); preview `https://belasica-v2-git-phase-304-season-redesign-dinovlazars-projects.vercel.app` (Vercel check `pass`). Verified **on the preview, not only locally**: all 12 checked routes 200 and `/arhiva/nema-vakva` 404; five season pages render the new structure with their sections and jump-rail matching each season's live data — `1985-86` → tabela/trener/prikazna/fotografii · `1938-39` → tabela/**rezultati**/prikazna/fotografii · `1940-41` → rezultati/prikazna/fotografii on the navy band with no lead photo · `2025-26` → fotografii only, **no rail** (one section), „Претходна" only · `1945-48` → trener/prikazna/fotografii with the correct era-range neighbours. Every image alt'd on all five. At **375**: no horizontal scroll (`scrollWidth == innerWidth == 375`), heading scale measured H1 44 → H2 30 → H3 22.
- ✅ **Completion report filed; decisions logged `D-3.04-<n>`** — 11 entries, `D-3.04-1` … `D-3.04-11`, appended to `decisions.md`; `D-2.02-6`'s Status changed to „Superseded by D-3.04-2" (only its Status, per the append-only rule).

**How the code was reviewed.** Beyond the checks above, the diff went through a multi-agent review — four independent reviewers (correctness, brand/accessibility, reuse/simplification, DoD conformance), then three adversarial verifiers per finding, each instructed to refute it from a different angle. It raised **19 findings**. Four were substantive and are **fixed in this branch**: a heading-level skip (`SeasonRecordList` emitted an `<h4>` directly under the section `<h2>` in „Резултати" — now `<h3>`), the trainer `<h3>` rendering at its section `<h2>`'s size on desktop, a factually loose comment on `StandingsTable`, and the fact that a lead photo's `date` had nowhere to render — the lead caption now carries date **and** caption, exactly like `PhotoGrid`, which also removes the one downside D-3.04-2 had accepted. The rest were refuted on verification (e.g. „links are distinguishable by colour alone" — they carry `underline`) or were preferences declined on scope grounds and recorded in §3. **Worth noting honestly: the most consequential defect of the phase — the `cn()` size-token bug (D-3.04-12) — was not found by any reviewer.** It surfaced from *measuring* the rendered page (`getComputedStyle` on the built output), which is the check that should be repeated in the redesign phases that follow.

## 3. Decisions I made during this phase

All 11 are logged in `src/_project-state/decisions.md`. Four of them changed something the brief or a prior decision said explicitly — those are called out first.

1. **D-3.04-1 · Prev/next ordered by `decade` then `slug.current`, not by `title` as the brief says.** The brief's key is chronologically wrong on the live data in six places: „Беласица 1945–1948“ sorts before „Сезона 1940/41“ (Б before С), „Сезона 1950/51“ before „Сезона 1950“, and the one unquoted title (`1992-93`) before every quoted 1990s title. The slug key is the archive index's own key (D-2.02-2) and yields an unbroken, symmetric 96-season chain. *Rejected:* following the brief literally (six wrong links, and the index and the season page would disagree about „next"); normalising the titles in Sanity (this phase writes no content). **Needs a decision-log entry: YES — logged.**
2. **D-3.04-2 · The gallery now excludes both lead photos — this supersedes D-2.02-6**, which deliberately repeated the hero. D-2.02-6's entire argument was that the hero showed no caption, so excluding it would hide that photo's caption/date from the site; the 3.04 lead renders its own `figcaption`, so nothing is hidden. **YES — logged, and D-2.02-6's Status updated.**
3. **D-3.04-3 · Lead photos are matted at their own aspect ratio via a new `MattedPhoto`, not dropped into a fixed-ratio `PhotoFrame fit="contain"` as the brief specifies.** Measured on the live assets, `teamPhoto` aspects run 0.49→2.63 and `tablePhoto` 0.36→2.86; a 0.36 standings scan in a fixed 3:2 contain frame is a thin strip on a mat several times its own area, and illegible — which defeats showing the table as an image at all (D-3.01-2). *Rejected:* adding an intrinsic-size mode to `PhotoFrame` (shared by the archive index, the legends grid and the homepage — that is the blast radius D-2.02-7 avoided). **YES — logged.**
4. **D-3.04-10 · Gallery dedupe stays at `_id`; asset-level dedupe rejected.** Three seasons render the same picture twice because the ingestion created two `photo` documents per asset. Deduping by asset would fix the visible repeat — but on `1992-93`, the copy it would drop is the **only one carrying a caption and date**, while the `teamPhoto` reference points at the bare duplicate. That is exactly the data loss D-2.02-6 existed to prevent, so it is a content fix, not a template fix. **YES — logged.**
5. **D-3.04-4 · The lead is a navy title band with the photo mounted inside it**, replacing 2.02 §6.2's full-bleed cover-crop hero; a photoless season is the same band without the photo, at §6.2b's taller padding. **YES — logged.**
6. **D-3.04-5 · The jump-rail is not sticky**, unlike the archive index's, so a single `scroll-mt-header` is the exact and only offset — avoiding the two-sticky-bar arithmetic D-2.02-13 flags and needing no second measured token. **YES — logged.**
7. **D-3.04-6 · `StandingsTable`, `SquadTable` and `PersonChip` are kept in-repo but unrendered**, each with a header comment — the `match.ts` precedent (D-2.01-2) rather than the `DecadeTimeline` deletion (D-3.03-6), because the legacy fields still hold real data that `/statistika` reads. **YES — logged.**
8. **D-3.04-7 · `SeasonEmptyNotice`'s chips re-worded** to the six sections the page now renders; the old chips named fields the page no longer reads. **YES — logged.**
9. **D-3.04-8 · Season titles render verbatim, guillemets included.** Stripping them would make the season page disagree with `/arhiva`, and is the template rewriting stored content. **YES — logged.**
10. **D-3.04-9 · `lineupAndStats` and `results` get their own dense renderer (`SeasonRecordList`); `SeasonStory` is untouched.** All 1401 published `lineupAndStats` blocks are single lines; through a prose rhythm a 38-line roster reads as broken prose. `SeasonStory` is shared with `/legendi/<slug>` and was deliberately not given a variant prop. **YES — logged.**
11. **D-3.04-11 · The gallery adopts 2.08's deterministic caption-first photo order**, replacing `coalesce(date,"9999") asc`, which is not a total order on this data (881 of 889 photos have neither a date nor a caption) and so was unstable across cold reads. **YES — logged.**

12. **D-3.04-12 · `cn()` silently drops this project's custom `text-*` size tokens — fixed in this phase's files, the repo-wide fix deliberately deferred.** Found by measuring the built page: the lead caption rendered at 16px instead of 14px and its class was just `text-paper`. `cn()` is `twMerge(clsx(…))`, and `tailwind-merge` uses Tailwind's *default* scale, so it reads `text-small` / `text-h3` / `text-overline` / `text-body` (brand.md's own type scale) as text **colours** — any one `cn()` call holding a size and a colour keeps only the last. `twMerge("text-small text-paper")` → `"text-paper"`, confirmed directly. *Rejected:* the correct one-file fix (`extendTailwindMerge`) would repair all 8 remaining pre-existing sites at once — but they live in `SiteHeader`, `SiteFooter`, `PlaceholderChip`, `SectionOverline`, `ContactForm` and `RoleChips`, so it would change rendered type sizes on the homepage, footer, navbar, `/kontakt`, `/legendi` and `/statistika` — all explicitly out of scope — and ship them unreviewed. **YES — logged, and handed to the next phase in §7.**

Two smaller calls, deliberately not given their own entries:
- The prev/next pair renders **even on a fully-empty season** (the back-links do not — the notice already carries one). Rationale in the code comment: the archive spine is the one thing that must not break.
- The jump-rail suppresses itself below two entries — one link is not navigation. Exercised live by `2025-26`.

## 4. Deviations from the brief / spec

- **Prev/next ordering key** — brief says „order by `decade` then `title`"; built on `decade` then `slug.current` (D-3.04-1, with the six failing cases listed).
- **Lead photo rendering** — brief says „matted via `PhotoFrame`… `fit="contain"`"; built as intrinsic-aspect matting in a new component (D-3.04-3, with the measured aspect ranges).
- **„Тренер и статистика" is one section, not two** — the brief left this to the executor („or „Тренер" + „Статистика" as two sub-blocks — your call"). Built as one `<h2>` with two `<h3>` sub-blocks, each self-omitting.
- **The all-empty notice's chip list changed** (D-3.04-7). The brief did not ask for this; leaving the old chips would have named fields the page no longer reads.
- **Not done, deliberately:** no Sanity write of any kind (schema and content are out of scope); `/arhiva` index untouched; `/statistika`, `/legendi`, `/za-nas`, `/kontakt`, homepage, footer and navbar untouched.

## 5. Changed files / deliverables

**Branch:** `phase-3.04-season-redesign`. **Commit:** `b26d9ea`. **PR:** [#26](https://github.com/DinovLazar/belasica-v2/pull/26) → `main`.

Code — rewritten:
- `src/app/(site)/arhiva/[slug]/page.tsx` — the season template (new GROQ, new section order, anchor rail, prev/next).

Code — new:
- `src/components/archive/MattedPhoto.tsx`
- `src/components/archive/SeasonAnchorNav.tsx`
- `src/components/archive/SeasonRecordList.tsx`
- `src/components/archive/SeasonNeighbourNav.tsx`

Code — edited:
- `src/components/archive/SeasonEmptyNotice.tsx` — chips + header comment (D-3.04-7).
- `src/components/archive/StandingsTable.tsx`, `SquadTable.tsx`, `PersonChip.tsx` — **comment only**, marking them legacy/unrendered (D-3.04-6). No behaviour change.

Docs / state:
- `src/_project-state/decisions.md` — `D-3.04-1` … `D-3.04-11`; `D-2.02-6` Status → superseded.
- `src/_project-state/file-map.md` — season-page entry rewritten; four new components added; the three legacy components flagged.
- `src/_project-state/current-state.md` — snapshot overwritten (`NEXT:` line + summary + known issues + placeholder register).
- `src/_project-state/completions/Part-3-Phase-04-Code-Completion.md` — this file.

Not changed: `package.json` / `package-lock.json` (no dependency), `brand.md` (no token), `src/app/globals.css`, `src/sanity/**` (no schema change), and every other route.

No secrets are involved in this phase — the season read uses the public, tokenless read client (D-1.04-2).

## 6. State updates done

- ✅ `src/_project-state/current-state.md` — overwritten to match reality; first line set to `NEXT: 3.05 …`.
- ✅ `src/_project-state/file-map.md` — synced for the 4 added and 5 edited files.
- ✅ `src/_project-state/00_stack-and-config.md` — **no change needed**: no dependency was added, removed or upgraded (`git diff main -- package.json package-lock.json` empty).
- ✅ `src/_project-state/decisions.md` — 11 new entries; one Status change.

## 7. Risks, follow-ups, what the next phase needs to know

1. **⚠️ Three seasons show the same photograph twice — a content duplication, not a template bug (D-3.04-10).** The 2.09 ingestion created two `photo` documents sharing one uploaded asset on `1969-70`, `1982-83` and `1992-93` (3 pairs, archive-wide, out of 889 photos). **`1992-93` is the one that matters:** the season's `teamPhoto` points at the bare duplicate `photo-6ce62638057327612b0c9b65c126e25602c064ae`, while the copy left in the gallery — `32991331-8812-437f-9529-5a89fd201c57` — carries the only caption and date that photograph has („Екипа на ФК Беласица, есен 1992" / „1992"). **The fix is two content edits, no code:** re-point `1992-93`'s `teamPhoto` at `32991331-…` (which also gives the lead its caption), and unpublish the three bare duplicates. Recommended for the Cowork content pass.
2. **⚠️ NEW, and the most important item for the next phase: `cn()` silently drops this project's custom `text-*` size tokens (D-3.04-12).** `cn` is `twMerge(clsx(…))` and `tailwind-merge` is running Tailwind's **default** type scale, so it treats `text-display`/`text-h1`/`text-h2`/`text-h3`/`text-body-l`/`text-body`/`text-small`/`text-overline` as text **colours**. Any single `cn()` call containing a size *and* a colour keeps only the last one — `twMerge("text-small text-paper")` returns `"text-paper"`. This phase's files are fixed (size on the wrapper, colour on the text) and measured correct. **8 pre-existing call sites are still wrong**, and two of them are site-wide:
   - `PlaceholderChip` — **every `[PLACEHOLDER: …]` chip on the site renders at 16px instead of 14px** (measured).
   - `SectionOverline` — **every overline renders at 16px instead of 12px** (measured), including the season page's decade label and the homepage's section overlines.
   - Plus `SiteHeader` ×2, `SiteFooter`, `ContactForm` ×2, `RoleChips`.
   **The fix is one file** — give `cn` the project's scale:
   ```ts
   // src/lib/utils.ts
   const twMerge = extendTailwindMerge({
     extend: { classGroups: { "font-size": [{ text: ["display","h1","h2","h3","body-l","body","small","overline"] }] } },
   });
   ```
   It was **not** done here because those 8 sites are in `SiteHeader`, `SiteFooter`, `PlaceholderChip`, `SectionOverline`, `ContactForm` and `RoleChips` — so it changes rendered type on the homepage, the footer, the navbar, `/kontakt`, `/legendi` and `/statistika`, every one of which this brief marks *do not touch*. **It wants its own small phase**, with a visual pass over those six surfaces, and it is worth doing before 3.05 — it is the difference between the type scale in `brand.md` and the type actually on screen.
3. **`results` has started landing and renders correctly** — 10 seasons (`1930-31` … `1940-41`) were published by the Cowork pass during this phase and are live on the page. The remaining 86 will appear the same way. One thing to watch: the real transcriptions interleave **group/round labels** („Група Струмица:", „2 коло", „Полуфинале") as ordinary blocks among the match lines, so those labels get the same hairline row treatment as a match. It reads fine, but if the content pass later marks them as headings the renderer already maps every heading style to an `<h3>`.
4. **A tall standings scan makes a long section.** `tablePhoto` is uncapped in height by design (legibility over page length, D-3.04-3): at 1280 the worst case is ~1560px (`1972-73`, a 946×2163 scan). The jump-rail is the mitigation. If the owner finds it too dominant, the single lever is `MattedPhoto`'s `maxHeightRem` on that one call site.
5. **Season titles carry guillemets and one does not** (`1992-93`, D-2.09-4). The H1 therefore reads „Сезона 1985/86“ with quotes. Rendered verbatim by decision (D-3.04-8); one content normalisation of the 96 titles fixes it site-wide with no code change.
6. **Three components are now unimported** (`StandingsTable`, `SquadTable`, `PersonChip`). Kept deliberately (D-3.04-6) and commented. **They should be deleted together with the legacy `finalTable`/`squad`/`trainers` fields when the model re-locks after 3.06** — that is their trigger.
7. **The archive index (`/arhiva`) still ignores `teamPhoto`.** Its card lead is still „earliest free-text `date`" (D-2.03-3), so the index and the season page can show different lead photos for the same season. Out of scope this phase; a one-line GROQ change in a later one, and it is the last place the „curated lead is modelled but not wired" note in `current-state.md` still applies.
8. **The two archive templates now behave differently on jump-nav** (index sticky, season not — D-3.04-5). Intentional, and worth knowing before anyone „fixes" the inconsistency.
9. **One fixture-verified state carries over as an owed item** (§2): the **all-empty season notice**. No published season is fully empty, so it cannot be reached from live content and was proven against a temporary local fixture only. It is a guard, not a page anyone will see — but it is unproven against real data, the same shape as D-2.03-4 / D-2.06-6. (`results` was the other one and it **cleared during the phase**.)

## 8. What's now possible that wasn't before

The archive reads as a documentary rather than a directory: every season is a page you can walk into from any other season, the photographs and standings scans the club actually holds are on screen at their true shape, and any content published from here on — a results transcription, a missing team photo, a trainer's name — appears on the public site by itself within a minute, with no code change and no redeploy.

## 9. The season query (one round trip)

```groq
*[_type == "season" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  decade,
  trainer,
  lineupAndStats,
  results,
  story,
  "teamPhoto": teamPhoto->{
    "id": _id,
    "image": image,
    caption,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  },
  "tablePhoto": tablePhoto->{
    "id": _id,
    "image": image,
    caption,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  },
  "gallery": *[_type == "photo"
      && relatedSeason._ref == ^._id
      && !(_id in [^.teamPhoto._ref, ^.tablePhoto._ref])]
    | order(
        select(defined(caption) && caption != "" => 0, 1) asc,
        coalesce(date, "9999") asc,
        _id asc
      ){
      "id": _id,
      "image": image,
      caption,
      date
    },
  "previousSeason": *[_type == "season" && defined(slug.current)
      && (decade < ^.decade
          || (decade == ^.decade && slug.current < ^.slug.current))]
    | order(decade desc, slug.current desc)[0]{
      title,
      "slug": slug.current
    },
  "nextSeason": *[_type == "season" && defined(slug.current)
      && (decade > ^.decade
          || (decade == ^.decade && slug.current > ^.slug.current))]
    | order(decade asc, slug.current asc)[0]{
      title,
      "slug": slug.current
    }
}
```

## 10. Vercel preview + eyeball checklist for Lazar

**PR:** [#26 — Phase 3.04 · Season page redesign & restructure](https://github.com/DinovLazar/belasica-v2/pull/26)
**Preview URL:** https://belasica-v2-git-phase-304-season-redesign-dinovlazars-projects.vercel.app — **verified before this report was filed** (Vercel check `pass`; 12 routes 200, unknown slug 404, structure and mobile layout checked on the preview itself). The gate was **not** waived.

Six things to look at, at 1280 and then at 375:

1. **`/arhiva/1985-86` — the rich season.** The navy band should carry „1980-ТИ" in orange, „Сезона 1985/86“ in white, and the 1985/86 squad photograph mounted on a light mat inside the band. Below it, the rail should list exactly: Табела · Тренер · Приказна · Фотографии (no „Резултати" — that season has none yet).
2. **The standings scan under „Табела".** It should be big enough to read the club names and points, and be the whole scan — no cropping, no cut edges.
3. **`/arhiva/1938-39` — the new results content.** „Резултати" should be in the rail and render 16 match rows, each on its own hairline-separated line. This is the first season the content pass filled, so it is worth confirming the rhythm reads right before the other 86 land.
4. **`/arhiva/1940-41` — a season with no photograph.** It must be a solid navy title band, not an empty grey box.
5. **The bottom of any season page.** „Претходна сезона" and „Следна сезона" cards should name the seasons either side chronologically — check `/arhiva/1945-48` in particular, whose neighbours should be „Сезона 1944“ and „Сезона 1948/49“. On `/arhiva/1922-26` only „Следна" should appear; on `/arhiva/2025-26` only „Претходна".
6. **`/arhiva/1992-93` — the known content defect.** The squad photo appears twice (once as the lead, once in the gallery) and the lead shows no caption. That is the duplicate-document issue in §7.1, not a layout bug — worth seeing so the content fix can be scheduled.
