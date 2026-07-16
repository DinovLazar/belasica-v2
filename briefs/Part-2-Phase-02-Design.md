# Part 2 · Phase 02 · Design — Archive & Season page templates

**Why this matters —** this designs the two pages that are the spine of the whole
archive: the **Archive index** (every season, grouped by decade) and the **Season
detail** page (one season's story, table, squad, and photos). Every later content
page and the whole 2.09 ingestion build on these two templates, so getting the
look and structure right here is what makes the rest of Part 2 fast and
consistent. Ace's one concrete direction from the sit-down: make these pages feel
**like crnobelanostalgija.com — modern and readable**.

## Context

You are **Claude Design**. You produce visual direction, mockups, and a written
component/layout spec (a design handover). You **never touch the repo or write
code** — your deliverable is a handover document (and mockups) that Lazar saves,
which a later Code phase (2.03) will implement. Design tokens live **only** in
`brand.md`; you reference them by name, you do not invent or redefine them.

**Read these first, by path (they are the ground truth — rebuild context from
them, not from memory):**

- `brand.md` — the **only** source of design tokens (color, type scale, spacing,
  radii) and the component anatomy already defined (Header, Breadcrumb, Hero,
  **Season card**, **Person card**, **Stats table**, **Photo figure + caption**,
  **Placeholder chip**, **Decade section header**, Footer). Reuse these; do not
  restyle them. Every value you specify must map to a named `brand.md` token.
- `docs/ace-demo/feedback.md` — Ace's sit-down feedback (2026-07-16). The
  operative line for this phase: Archive & Season pages should be **very similar
  to crnobelanostalgija.com**. He liked the homepage and flagged nothing missing.
- `src/sanity/schemaTypes/season.ts` — the **locked** season model. The Season
  page renders exactly these fields, nothing invented: `title`, `slug`, `decade`
  (required), `story` (Portable Text), `finalTable` (standings rows:
  position/club/played/wins/draws/losses/goalsFor/goalsAgainst/points), `squad`
  (rows of `player` ref → person, `appearances`, `goals`), `trainers` (refs →
  person). Photos attach via **back-reference** (`photo.relatedSeason`), not a
  forward array (D-2.01-1).
- `src/sanity/schemaTypes/photo.ts` — photo fields: `image` (hotspot),
  `caption`, `provenance` (required), `date` (free text), `relatedSeason`,
  `relatedPerson`.
- `src/sanity/schemaTypes/person.ts` — person fields (`name`, `slug`, `role[]`,
  `playingYears`, `bio`, `careerStats`). Squad players and trainers are
  references to these; their detail pages come in **2.05** at `/legendi/<slug>`.
- `src/lib/nav.ts` — the routes. Archive index is **`/arhiva`**; the Season
  detail route is **`/arhiva/<slug>`** (Latin slug per D-0.00-4, e.g.
  `/arhiva/1992-93`).
- `src/_project-state/current-state.md` — live state; the homepage components
  (`PhotoFrame`, `SectionOverline`, `DecadeTimeline`, `Reveal`, `PlaceholderChip`)
  already exist and are reusable references for these templates.
- `docs/content-ingestion-plan.md` — what data will actually exist after 2.09
  (season shells with slug/title/decade + photos with provisional provenance;
  story/table/squad/trainers curated by hand later). This tells you which fields
  are frequently **empty** and therefore need designed empty/placeholder states.
- Reference site: **crnobelanostalgija.com** — the agreed visual reference.
  Study its archive-by-decade lists and its article/season pages (narrative recap
  + standings table + squad appearance list + captioned photos). **Note the
  divergence below** before copying it.

**Design process note:** the visual direction below is **approved** (owner
resolved it in chat, 2026-07-16, in lieu of a separate sketch round). Build the
mockups to this direction; do not re-open it or invent an alternative.

## Approved visual direction (bake this into the handover)

Dignified modern archive, per `brand.md` §Direction — generous whitespace, strong
Cyrillic serif headings (Source Serif 4), Inter for body/UI, photos as the heroes,
minimal rounding. Calm and editorial, **not** a WordPress-theme look (that failure
killed V1). Take from crnobelanostalgija.com its *structure and warmth* — decade-
grouped season lists, and season pages that read as a narrative anchored to hard
data (table + appearances) — **not** its exact styling.

**Key divergence from the reference — do not copy these:**

1. **No competition taxonomy.** crnobelanostalgija splits the archive by
   competition (Prvenstvo / Kup / Evropa) then decade. **Our locked model has no
   competition/match type** (D-2.01-2). Our Archive groups by **decade only**.
   Do not design competition tabs or categories — there is no data for them.
2. **No bylines / authors / dates-of-posting.** The reference shows an
   „Author — date" byline on every article. We are an unofficial archive with no
   author facts; **content-truth forbids invented names/dates**. No byline block
   anywhere.
3. **No invented league labels.** `brand.md`'s Season card mentions an "orange
   overline (league)" — we have no league field, so the season-card overline is
   the **decade or year-span** (e.g. „1990-ти"), or omitted — never a made-up
   competition name.

## Scope

**In scope — design two responsive page templates (desktop + mobile) and one
handover document:**

1. **Archive index** (`/arhiva`): a page header, then all seasons grouped into
   **decade sections**, newest decade first, using the existing **Decade section
   header** (large serif decade + orange rule + neutral count overline) and a grid
   of **Season cards**. Includes the empty-photo state and (if useful) a decade
   jump-nav.
2. **Season detail** (`/arhiva/<slug>`): breadcrumb → hero → narrative story →
   standings table (Конечна табела) → squad (Состав) → trainers (Тренери) → photo
   set (Фотографии). Every section maps to a locked schema field and has a defined
   **empty / placeholder** state.

**Out of scope — do NOT design or touch:**

- Any code, Sanity schema change, or content writing. Model is **locked** (2.01);
  if a template genuinely needs a field that doesn't exist, **flag it in the
  handover** — do not assume it.
- The **Legends, Statistics, About, Contact** pages and the **person detail**
  page — those are 2.04/2.05. (You may specify how a squad/trainer name *links* to
  the future `/legendi/<slug>` route, but you do not design that page.)
- New brand tokens, new fonts, new colors, dark mode. If something seems to need a
  new token, flag it in the handover rather than inventing it.
- Competition tabs, bylines, invented league names (see divergences above).

## Tasks

1. **Study the reference and the model together.** Map each locked `season` /
   `photo` field to a UI treatment. Confirm every section you design is backed by
   a real field.
2. **Design the Archive index** (`/arhiva`), desktop and mobile:
   - Page header: serif H1 (e.g. „Архива по сезони"), a one-line intro, aligned to
     the homepage's section rhythm.
   - Decade sections, **newest decade first**, each led by the Decade section
     header with a real count („N сезони").
   - A responsive grid of Season cards: 3:2 lead image (from the season's
     back-referenced photo), serif title = `season.title`, meta overline = decade
     or year-span, 2px hover lift. Specify columns per breakpoint (12-col desktop /
     4-col mobile per `brand.md` §Grid).
   - **Empty lead-photo state:** a Mist greybox matted frame (never a blank/broken
     card) — most seasons will have no lead photo for a while (see ingestion plan).
   - Optional but recommended: a sticky decade jump-nav for fast scanning.
3. **Design the Season detail** (`/arhiva/<slug>`), desktop and mobile:
   - **Breadcrumb:** Почетна / Архива / `<season title>` (per `brand.md`
     Breadcrumb; unknown crumb → placeholder).
   - **Hero:** a related photo (16:9 desktop / 4:5 mobile) with navy bottom
     gradient, orange overline (decade/year), serif H1 = title. **If the season has
     no photo,** specify a photo-less hero (navy band or paper header) — no
     greybox hero.
   - **Story:** Portable Text in a single ~68ch column (`max-w-measure`). Empty →
     the whole section is omitted (no placeholder prose).
   - **Конечна табела (standings):** the Stats table component (navy header row,
     ФК Беласица row highlighted, zebra, unknown cells „—"). Specify **mobile
     behavior** (horizontal scroll within a bordered frame, or a defined column
     priority). Empty → section omitted.
   - **Состав (squad):** a readable list/table of player name · appearances ·
     goals. Player name styled as a navy text link to `/legendi/<slug>` (target
     built in 2.05; link may 404 until then — that's expected). Unknown
     appearances/goals render „—". Empty → section omitted.
   - **Тренери (trainers):** a compact person list/chips, names linking to
     `/legendi/<slug>`. Empty → section omitted.
   - **Фотографии (photos):** a matted photo grid (reuse the mist-matted frame +
     caption pattern; the homepage gallery mosaic is a reference). Caption = orange
     overline (year/`date`) + Inter description (`caption`). Mixed-quality rule
     from `brand.md` §Photo treatment applies (wider mat for small scans, identical
     outer frame). Empty → section omitted.
   - Wrap sections in the existing scroll-reveal rhythm; keep `border-t
     border-mist` + `py-16 md:py-24` section cadence from the homepage.
4. **Specify every empty/placeholder state explicitly** — this archive ships
   mostly-empty seasons first, so "what this looks like with only a title + decade"
   is a first-class state, not an afterthought.
5. **Accessibility:** confirm every text/background pairing you use is a
   `brand.md` AA-passing pair; specify focus states (navy 2px ring, 2px offset),
   table header semantics, and that orange is marker-only (never text, D-1.02-1).
6. **Produce mockups** for both templates at **desktop (~1200) and mobile
   (~375)**, plus the key empty states (an Archive card with no photo; a Season
   page with only title + decade). Mockups use **greybox/matted frames** for
   photos (real assets aren't published yet — OV-1 caveat / 2.09).
7. **Write the handover** as a single Markdown document (see Outputs). It must be
   detailed enough that the 2.03 Code phase can build both templates from it plus
   `brand.md` alone, with no further design questions.

## Definition of Done

Every item below is checkable and becomes the completion report's checklist.

- [ ] Handover document produced at the path in Outputs, covering **both**
      templates (Archive index + Season detail).
- [ ] **Every** locked `season` field (`title`, `slug`, `decade`, `story`,
      `finalTable`, `squad`, `trainers`) and the back-referenced photos is mapped
      to a specified UI treatment — none left unaddressed.
- [ ] Each Season-detail section (story, table, squad, trainers, photos) has an
      explicitly specified **empty state** (omit vs. placeholder chip stated per
      section).
- [ ] Archive index groups seasons by **decade, newest first**, using the Decade
      section header, with a specified empty-lead-photo card state (Mist greybox).
- [ ] Responsive behavior specified for desktop (~1200) and mobile (~375),
      including the standings table's mobile treatment and grid columns per
      breakpoint.
- [ ] Every color / type / spacing / radius value references a **named `brand.md`
      token**; no new hardcoded values. Any genuinely missing token is **flagged**,
      not invented.
- [ ] No competition taxonomy, no byline/author block, no invented league labels
      anywhere in the design (the three named divergences are honored).
- [ ] Squad/trainer names are specified as links to `/legendi/<slug>`; breadcrumb
      and routes match `src/lib/nav.ts` (`/arhiva`, `/arhiva/<slug>`).
- [ ] Accessibility noted: AA pairings only, focus states, table semantics,
      orange marker-only rule (D-1.02-1).
- [ ] Mockups delivered for both templates at desktop + mobile, plus the two key
      empty states, using greybox/matted photo frames.
- [ ] Any on-the-fly design decision is recorded in the handover's decisions
      section for the orchestrator to log (`D-2.02-n`).

## Outputs & where they go

- **Handover:** `docs/design-handovers/Part-2-Phase-02-Handover.md` (Lazar saves
  it — you output the full document; you do not commit). This is the single source
  the 2.03 Code phase reads.
- **Mockups:** delivered alongside the handover (image files saved to
  `docs/design-handovers/` next to the handover, or embedded/linked from it — do
  **not** leave them only in chat; the 1.02 mockups were lost that way and it's a
  known issue).
- **Completion report:** `src/_project-state/completions/Part-2-Phase-02-Completion.md`
  — summarize what was delivered, list every `D-2.02-n` decision made, and note
  anything owed to Lazar (e.g. a flagged missing token).
