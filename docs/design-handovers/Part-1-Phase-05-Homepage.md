# Part 1 · Phase 05 — Homepage layout (design handover, archived in-repo)

> The approved homepage direction, built in Phase 1.05 at `src/app/(site)/page.tsx`.
> All values are **references into `brand.md`** (the only token source) — this file
> names roles, not raw hex/px/font values. Read `brand.md` for the tokens.

## Direction

A single dignified column inside the existing header/footer chrome. **Photos are the
heroes.** Not a template look — generous whitespace, strong Cyrillic serif display,
matted photo frames. Brand rule **D-1.02-1**: orange never carries text on the paper
surface (2.8:1 fails AA). Orange appears only as a **rule, an active underline, or a
small marker**. Section overlines on paper are **navy** (or neutral-700) text preceded
by a short **orange rule**. On the navy hero, an **orange** overline is fine (4.6:1 on
navy passes AA).

## Sections (top → bottom)

### 1 · Hero (full-bleed)
- Lead historical photo, **16:9 desktop / 4:5 mobile** (`aspect-[4/5] md:aspect-[16/9]`),
  edge-to-edge, with a **navy bottom gradient** (`from-navy/95 via-navy/45 to-transparent`)
  so the in-column text stays AA-legible.
- Overline `Неофицијална архива` (orange on navy). Serif **H1** (`text-h1 md:text-display`,
  paper) = `siteSettings.title` if present, else the verified wordmark `ФК Беласица`
  (OV-2, not a fabricated claim). One-line Inter subhead (structural copy, no fact claim).
- Primary button → `/arhiva` (paper fill / navy label — inverted for the dark surface),
  secondary text link → `/za-nas` (paper label, orange hover underline).
- Photo source: the featured season's lead photo (`siteSettings` has no hero-image field).
  No photo → **matted greybox** frame with a placeholder chip. Nothing fabricated.

### 2 · Intro strip
- Two columns. Left: overline `За архивата` + a serif lead line (structural). Right:
  1–2 short Inter paragraphs = `siteSettings.description`, else a **placeholder chip**.

### 3 · Featured season
- Overline `Издвоена сезона`. **3:2** lead image + serif **H2** title (`season.title`),
  a `Деценија {decade}` meta line (shown only when present — the model has no league field),
  a story teaser (first block of `season.story`, `line-clamp-4`), and a text link
  `Погледни ја сезоната →` to `/arhiva/{slug}`. Unknown fields → placeholder chips or omitted.

### 4 · Legends
- Overline `Легенди`. Up to three **person cards**: **4:5** portrait, serif name (H3),
  neutral `role · appearances` (`careerStats.appearances`, roles mapped to Cyrillic).
  Whole card links to `/legendi/{slug}`; hover = 2px lift. Names/roles only from Sanity —
  missing → placeholder chip. Zero legends → one placeholder chip.

### 5 · Gallery
- Overline `Галерија`. Up to ~10 photos in **matted 3:2 frames**, responsive grid
  (2 / 3 / 4 cols). Per-photo caption = **date overline** (neutral-500) + Inter small
  description (neutral-700). Zero photos → one placeholder chip.

### 6 · Footer
- Unchanged (Phase 1.03). Renders the mandatory `неофицијална архива` line and the
  "not the official club site" statement.

## Photo frames — `brand.md` §Photo treatment
Mist mat, **2px radius** (`rounded-photo`), hairline mist border. Image sits inside with
`object-cover` (cropped, **never stretched**). No image → the mist mat is the greybox and
holds a placeholder chip. Rendered with `next/image` via `src/sanity/image.ts` (`urlFor`).

## Placeholder chip — `brand.md` §Components
Dashed mist border, hatched fill, **mono** `[PLACEHOLDER: …]` text, `rounded-chip`, paper
fill (legible on paper and on mist greyboxes). The only legal way to show a missing
required display fact (content-truth). Never invent content in its place.

## Motion — `brand.md` §Motion
Reveal-on-scroll: **opacity 0→1 + translateY 10→0, 500ms cubic-bezier(.2,.7,.2,1),
60ms stagger**, transform + opacity only (Lighthouse budget). Card hover = 2px lift, 150ms.
Implemented in `globals.css` (`.js [data-reveal]`) + `<Reveal>` (IntersectionObserver
toggles `.is-visible`). Gated on `html.js` (pre-paint script in the `(site)` layout) so
**motion is pure enhancement** — without JS, or under `prefers-reduced-motion`, all content
is visible instantly and nothing is hidden.

## Content selection rules (see decisions D-1.05-1..3)
- **Featured season:** newest by `decade` desc, then `title` desc.
- **Legends:** most-capped first (`careerStats.appearances` desc), then `name` asc; top 3.
- **Gallery:** oldest related season first (`relatedSeason->decade` asc), then `date` asc; top 10.

## Empty-dataset behaviour
Every section degrades to registered placeholders when its query returns nothing — the
page never crashes and never invents filler. This is the current preview state until the
demo content is published in `/studio`.
