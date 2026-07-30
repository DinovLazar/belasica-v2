# Part 3 · Phase 05b · Code — Homepage owner follow-up + season photo lightbox

**Why this matters —** the front door currently shows the whole archive at once: 86 legend
tiles and 30 records scroll past before a visitor reaches anything else, and the crest that
opens the page is a damaged crop. This phase makes the homepage a front door again — a clean
crest, ten legends, six records — and makes the season galleries openable, so an archive
photograph can finally be looked at rather than squinted at.

---

## Context

**Read first, by path:**

- `src/_project-state/current-state.md` — live repo snapshot, owed-verification register,
  placeholder register, known issues.
- `brand.md` — tokens and component anatomy. §Color, §Components, §Photo treatment,
  §Motion and §Brand rules all bind this phase.
- `CLAUDE.md` — the repo's standing rules.
- `docs/design-handovers/Part-3-Phase-05a-Directions.md` — direction **В „Трибина"**, adopted
  site-wide at 3.05. Everything built here extends it.
- `src/app/(site)/page.tsx` — the seven-section homepage this phase edits.
- `src/components/home/ClubRecords.tsx` — the records scoreboard strip.
- `src/components/archive/PhotoGrid.tsx` and `src/app/(site)/arhiva/[slug]/page.tsx` —
  the season gallery this phase makes interactive.
- `src/components/SiteHeader.tsx` — the header crest block.

**What already exists.** 3.03 rebuilt the homepage into seven sections; 3.05 re-dressed the
whole site onto direction В; 3.02F-Code hardened the build's Sanity reads on the season and
person templates and put all 30 `clubRecord` documents on `/statistika`. The homepage queries
`person` and `clubRecord` **unsliced**, which was right when the archive held 5 players and 7
records and is wrong now that it holds 160 people and 30 records.

**Content prerequisite — already done, do not repeat.** Three portrait photos that existed in
Sanity but were never linked (`Томе Стојанов`, `Зоран Балдовалиев`, `Роберт Попов`) were
linked to their `person` documents and published on 2026-07-30 by the Cowork session that wrote
this brief. Six published photos now carry `relatedPerson`. **No further Sanity write belongs
to this phase.**

**Assets delivered with this brief.** Six files ship alongside this document. They are finished
artwork — do not regenerate, retouch or re-export them:

| File | Destination | Note |
|---|---|---|
| `crest.svg` | `public/crest.svg` | **new** — the scalable master |
| `crest.png` | `public/crest.png` | replaces; still **864×1220**, so the Open Graph metadata in `src/app/layout.tsx` stays correct and must not change |
| `crest-ui.webp` | `public/crest-ui.webp` | replaces; still **400×565**, so every existing `width`/`height` prop stays correct |
| `icon.png` | `src/app/icon.png` | replaces; still 512×512 |
| `apple-icon.png` | `src/app/apple-icon.png` | replaces; still 180×180 |
| `favicon.ico` | `src/app/favicon.ico` | replaces; still 64×64 |

They are a traced, repaired rebuild of the existing club crest — the same artwork, not a new
one. The source raster was clipped on the right edge and its pennant point was cut off flat;
the rebuild closes the point on the artwork's own measured diagonals, evens the margins so
nothing bleeds to the edge, and is now vector, so it stays sharp at every size. The club blue
is unchanged at `#125C9A` (D-crest-1) and the palette is untouched.

---

## Scope

**In scope**

1. Swap the crest assets and point the header and hero at the SVG.
2. Cap the homepage legends band at **10** people.
3. Cap the homepage records strip at **6** records.
4. Add a photo lightbox to the season page's „Фотографии" grid.
5. Wrap the homepage's Sanity read in the existing retry helper.

**Out of scope — do not touch**

- `/statistika` — all **30** records keep rendering there, in their four groups.
- `/legendi` — all **160** people keep rendering there, in three bands.
- Any redesign of `/statistika`, `/legendi`, `/za-nas` or the season page — that is **3.06**.
- Any Sanity write, any schema change, any `sanity schema deploy`.
- Any new `brand.md` token, any change to `globals.css`'s `@theme`.
- Any new npm dependency. The lightbox is plain React; no dialog library, no carousel library.
- The Open Graph metadata block in `src/app/layout.tsx` — the crest keeps its dimensions
  precisely so this stays untouched.
- The `person` and `season` templates' `fetchOrThrow` wiring from 3.02F — unchanged.

---

## Tasks

### 1 · Crest

1. Drop the six delivered files into the destinations in the table above, replacing what is there.
2. In `src/components/SiteHeader.tsx` and `src/app/(site)/page.tsx`, change the crest `<Image>`
   `src` from `/crest-ui.webp` to **`/crest.svg`**. Keep `unoptimized` (D-3.05-11's 402 stands —
   the account's image optimizer is exhausted, and an SVG must not be optimized anyway). Keep the
   existing `width={400} height={565}`: the rebuilt artwork's aspect ratio is identical to
   0.708, so `h-*` + `w-auto` renders exactly as before. Keep the white tile and the 6px orange
   bar above it — the crest's left half is white and still needs a light backdrop.
3. `public/crest-ui.webp` stays in the repo as the raster fallback and is still the file the
   `/crest.png` lineage derives from; nothing else references it after step 2.
4. **Re-measure the rendered header height.** `--spacing-header` is 78px and mirrors the header
   rather than driving it (D-2.02-17) — every `top-header` / `scroll-mt-header` consumer depends
   on it. If the measured height moves, update the token and re-verify one in-page anchor jump
   on a season page lands flush at the header's bottom edge.

### 2 · Legends — exactly 10

5. In `HOME_QUERY`, rank and slice the `legends` projection in GROQ:
   order by `coalesce(careerStats.appearances, -1) desc`, then `name asc`, then take `[0...10]`.
   Add nothing to the projection beyond what the ranking needs.
6. `careerStats.appearances` is the **authoritative** career total (D-2.01-3). Do not sum
   `season.squad`, do not compute a total, and do not let a person with no recorded appearances
   outrank a person with one — that is what the `-1` coalesce is for.
7. Leave the existing display sort in `page.tsx` alone: it puts portraits first, then Cyrillic
   name order (D-3.03-2), and now simply orders the chosen ten. Two of the ten have a portrait;
   the other eight render `LegendCard`'s monogram tile, which is the specified treatment for a
   person with no portrait on file (`brand.md` §Photo treatment). **Do not substitute a stand-in
   face and do not drop a person for lacking one.**
8. Section heading, overline and the „Сите легенди" link are unchanged. The grid stays
   2 → sm:3 → lg:5, so ten cards fill exactly two rows at `lg`.

### 3 · Records — exactly 6

9. The homepage strip renders these six `clubRecord` documents, in this order, matched on the
   exact `label` string:

   1. `Шампион на Македонија` — **the featured cell** (orange ground, navy ink)
   2. `Вицешампион на Македонија`
   3. `Полуфинале — Куп на Македонија`
   4. `Југословенски второлигаш`
   5. `Најдобар стрелец на сите времиња на Беласица`
   6. `Рекордер по настапи`

10. Implement this as an **explicit label whitelist**, not a slice and not a category filter, so
    that adding a 31st record in Studio cannot change what the homepage shows. Keep the query
    reading `clubRecord`; do the selection where the six are named in one readable place.
11. If a whitelisted label is not present in Sanity, that cell is **omitted** — never
    substituted, never back-filled from another record, never invented (content-truth).
12. `label` and `value` still render exactly as curated — no reformatting, no truncation,
    no computation (`brand.md` §Components, Scoreboard).
13. `ClubRecords` is used by the homepage only. Verify that after this change `/statistika`
    still renders all 30 records in its own `Клупски рекорди` register — if `ClubRecords` turns
    out to be shared, whitelist at the homepage call site instead of inside the component.

### 4 · Season photo lightbox

14. Add a client component under `src/components/archive/` that owns the lightbox. Keep
    `PhotoGrid` and the season page as **server** components: build the image URLs on the
    server and pass plain serialisable data (id, url, width, height, caption, date) into the
    client component. **No Sanity client import inside a client component.**
15. Each grid thumbnail becomes a real `<button>` around the image, labelled with the photo's
    caption (or „Архивска фотографија" when it has none). The caption and date keep rendering
    in the grid exactly as they do now.
16. Opening the overlay:
    - `role="dialog"`, `aria-modal="true"`, `aria-label="Фотографии од сезоната"`.
    - Backdrop: `navy` at ~96% opacity, full viewport.
    - Photo: `object-contain`, capped at 92vw × 82vh, so a tall scan and a wide scan both fit
      whole. `next/image` with `sizes="92vw"`, no `priority`.
    - Below the photo, on the navy ground: the date as the tracked-caps overline in `paper/80`,
      the caption in `paper`, and a „N / M" counter inside an `aria-live="polite"` region.
    - Radius 0, no shadow (`brand.md` rules 6 and 7).
17. Controls:
    - Previous and next buttons, left and right, **minimum 48×48 CSS px**, orange fill with
      navy ink, hover swaps the fill to paper (`brand.md` §Components, Buttons).
    - Navigation **wraps** — next from the last photo goes to the first — so no control is ever
      a dead end and neither button is ever disabled.
    - Close button top-right, minimum 48×48, same treatment.
    - Both arrows are hidden (not just visually) when the season has only one photo.
18. Keyboard and focus:
    - `ArrowLeft` / `ArrowRight` navigate, `Escape` closes, a click on the backdrop closes.
    - Focus is trapped inside the dialog while open and **returns to the thumbnail that opened
      it** on close.
    - Page scroll is locked while the overlay is open and restored exactly on close.
19. Motion follows `brand.md` §Motion: transform + opacity only, 160ms ease-out, and nothing
    animates under `prefers-reduced-motion` — the overlay appears instantly and the focus ring
    and state colours still apply.
20. The lightbox is for the season page's „Фотографии" grid only. The homepage moment band,
    the hero and the person pages are unchanged in this phase.

### 5 · Homepage read retry

21. While `page.tsx` is open, wrap its `client.fetch(HOME_QUERY)` in `src/sanity/fetch.ts`'s
    existing helper, the same way the season and person templates do. The homepage is one of the
    five uncovered read sites the 3.02F-Code report names, and it is the one observed to fail
    first under the CDN's intermittent connect timeouts. Keep the existing graceful fallback
    behaviour on final failure — the placeholder homepage, never invented filler. Do not touch
    the other four uncovered call sites.

---

## Definition of Done

### Verifiable by the executor

- [ ] `npm run build`, `npm run lint` and `npx tsc --noEmit` all clean.
- [ ] `package.json` and the lockfile are unchanged — **zero** new dependencies.
- [ ] No file under `src/sanity/schemaTypes/` changed; no `brand.md` token added or altered;
      no `@theme` block in `globals.css` changed; no Sanity document written.
- [ ] `/crest.svg` returns 200 and renders in both the header and the hero; the network panel
      shows **no** `/_next/image` request for the crest on either surface.
- [ ] The rendered header measures **78px** at 1280 and at 375 (or `--spacing-header` was updated
      and one season-page anchor jump was re-verified to land flush at the header's bottom edge).
- [ ] The homepage legends band renders **exactly 10** cards, and the ten are:
      Петар Андреев (555), Милан Василев (383), Ристо Панов (366), Костадин Секулов (336),
      Томе Стојанов (328), Дончо Георгиев (262), Љупчо Мафков (260), Митко Георгиев - Шеки (235),
      Стефан Сулев (235), Тони Атанасов (232).
- [ ] Of those ten, **2** render a photographic portrait (Андреев, Т. Стојанов) and **8** render
      the monogram tile. Zero grey boxes, zero stand-in faces.
- [ ] The homepage records strip renders **exactly 6** cells, in the order listed in Task 9, with
      `Шампион на Македонија` as the featured orange cell.
- [ ] `/statistika` still renders **all 30** records, grouped 5 / 13 / 8 / 4.
- [ ] `/legendi` still renders three bands totalling **160** (Играчи 86 · Тренери 46 ·
      Раководство 28), with 0 duplicates.
- [ ] Lightbox exercised in-browser on a season with at least three photos (use
      `/arhiva/1982-83`): opens on click and on `Enter`; `ArrowLeft`/`ArrowRight` move and wrap
      at both ends; `Escape` closes; a backdrop click closes; focus returns to the triggering
      thumbnail; the page behind does not scroll while open and its scroll position is intact
      after close.
- [ ] Lightbox verified on a season with exactly **one** photo: it opens, and no arrow control
      is rendered.
- [ ] Every new text/background pair measured at **≥ 4.5:1**; every new interactive target
      measured at **≥ 24×24** CSS px, and the lightbox's own controls at **≥ 48×48**.
- [ ] No horizontal scroll at 1280 and 375 on `/` and on the season page, overlay open and closed.
- [ ] `[PLACEHOLDER]` chips inside `<main>` remain **0** on `/` and on the season page.
- [ ] Vercel PR preview verified **before** requesting merge — the report lists the preview URL
      and the routes checked (`/`, `/arhiva`, `/arhiva/1982-83`, `/statistika`, `/legendi`,
      `/za-nas`, `/kontakt`, plus an unknown slug returning 404).

### Owed to Lazar (goes on the register in `current-state.md`)

- [ ] Eyeball the new crest at desktop and on a phone — header, hero and browser tab.
- [ ] Confirm the six homepage records are the right six.
- [ ] Decide whether to source portrait photographs for the eight legends who have none; until
      then the homepage band is 2 photographs and 8 monogram tiles.

---

## Outputs & where they go

- Branch **`phase-3.05b-homepage-followup`** → PR to `main`. One phase, one PR, one report.
  No direct commits to `main`. No secrets — the repo is public.
- Decisions logged in `src/_project-state/decisions.md` as **`D-3.05b-1…n`** (append-only).
- State files re-synced per the `syncing-project-state` skill: `current-state.md` (including the
  `NEXT:` line, which returns to **3.06**), `file-map.md`, and `00_stack-and-config.md` if
  anything pinned moved — it should not.
- Completion report → `src/_project-state/completions/Part-3-Phase-05b-Completion.md`, written
  with the `writing-completion-reports` skill.
