# Part 2 · Phase 02 — Archive & Season page templates (design handover)

> **Read this with `brand.md` open.** Together they are the complete spec for the
> **2.03 Code phase**: Archive index (`/arhiva`) + Season detail (`/arhiva/<slug>`).
> Every value here is a **named `brand.md` token** — this document names roles, never
> raw hex/px/font values. Where a token is genuinely missing it is **flagged** (§12),
> not invented.
>
> **Mockups:** `Part-2-Phase-02-mockups/` (6 PNGs + their HTML sources + README).
> The mockups illustrate; **this document is the spec**. If they disagree, this wins.
>
> **Status:** design complete, 2026-07-16. Decisions **D-2.02-1 … D-2.02-17** are **logged in
> `src/_project-state/decisions.md`** — §11 is the summary; the log carries the full reasoning.
>
> **§12 is now closed.** The two missing tokens and the `brand.md` contradictions were fixed
> the same day on the owner's instruction — `brand.md` and `globals.css @theme` are correct,
> so **2.03 has nothing to work around**: use `bg-zebra`, `bg-highlight`, `top-header`,
> `scroll-mt-header`. One open question remains (§13 OQ-1 provenance, OQ-3 register).

---

## 1 · Direction

Dignified modern archive (`brand.md` §Direction): generous whitespace, strong Cyrillic
serif headings (Source Serif 4), Inter for body/UI, **photos as the heroes**, minimal
rounding. Calm and editorial — never a WordPress-theme look.

From **crnobelanostalgija.com** (Ace's direction, `docs/ace-demo/feedback.md`) we take the
**structure and warmth**, not the styling: decade-grouped season lists, and season pages
that read as a **narrative anchored to hard data** (story → table → appearances → photos).
The reference is a functional WordPress archive; ours is the same substance, made modern
and readable.

**Three divergences from the reference — deliberate, do not "fix" them:**

1. **No competition taxonomy.** The reference splits by Prvenstvo / Kup / Evropa, then
   decade. Our locked model has **no competition or match type** (D-2.01-2). We group by
   **decade only**. No tabs, no categories — there is no data for them.
2. **No bylines / authors / dates-of-posting.** The reference prints „Author — date" on
   every article. We have no author facts, and content-truth forbids inventing them.
   **No byline block anywhere.**
3. **No invented league labels.** `brand.md`'s Season card says "orange overline (league)",
   but **there is no league field**. The season-card overline is the **decade** (§5.4,
   D-2.02-1) — never a made-up competition name.

---

## 2 · Field → UI map (every locked field is addressed)

`season` (`src/sanity/schemaTypes/season.ts`) — the page renders these and nothing else.

| Field | Where it renders | Empty behaviour |
|---|---|---|
| `title` | Season card title (Archive); hero H1 (Season); breadcrumb crumb 3 | Required in schema → assume present. If absent: `[PLACEHOLDER: наслов на сезоната]` |
| `slug` | Route `/arhiva/<slug>`; card link; ordering key (§4.5) | Required → assume present. No slug → the season is not listed (nothing to link to) |
| `decade` | Archive decade grouping + Decade section header; season-card overline; hero orange overline | Required (D-2.01-6) → assume present |
| `story` (Portable Text) | Season §6.3 — single `max-w-measure` column | **Section omitted entirely.** No placeholder prose |
| `finalTable[]` (position/club/played/wins/draws/losses/goalsFor/goalsAgainst/points) | Season §6.4 „Конечна табела" — Stats table | **Section omitted.** Individual unknown cells → `—` |
| `squad[]` (`player`→person, `appearances`, `goals`) | Season §6.5 „Состав" — light table, names link to `/legendi/<slug>` | **Section omitted.** Unknown `appearances`/`goals` → `—`; unresolved `player` ref → chip |
| `trainers[]` (→person) | Season §6.6 „Тренери" — person chips linking to `/legendi/<slug>` | **Section omitted** |
| photos (**back-reference** `photo.relatedSeason`, D-2.01-1) | Season hero (§6.2) + §6.7 „Фотографии"; Archive card lead image (§5.4) | Hero → photo-less navy band (§6.2b). Grid → **section omitted**. Card → Mist greybox + chip (§5.5) |

`photo` (`src/sanity/schemaTypes/photo.ts`):

| Field | Where it renders |
|---|---|
| `image` (hotspot) | Hero, card lead, photo grid. Hotspot **honoured** (existing `PhotoFrame.focalPosition`) |
| `caption` | Photo grid caption text; `alt` for hero/card/grid images |
| `date` (free text, e.g. „околу 1985") | Photo grid caption overline; photo ordering key |
| `provenance` (required) | **Not rendered** — see §13 OQ-1 |
| `relatedSeason` | The back-reference that supplies every season photo |
| `relatedPerson` | Not used by these two templates (2.05) |

`person`: only `name` + `slug` are used here (squad + trainer names/links). `role`,
`playingYears`, `bio`, `careerStats` belong to 2.04/2.05.

**Nothing else exists.** No goal difference (not a field — do **not** compute it), no
league, no match, no attendance, no venue.

---

## 3 · Reused components (do not restyle)

Existing, from `src/components/` + `src/components/home/` — these templates are
assembled from them:

- `Container` — `max-w-page` + `px-5 md:px-10` gutters.
- `PhotoFrame` — matted frame, hotspot-aware. **Needs one additive prop** (§6.7 / D-2.02-7).
- `PlaceholderChip` — the only legal way to show a missing display fact.
- `Reveal` — scroll reveal, `.js`-gated, `delayIndex` stagger.
- `SectionOverline` — orange rule + navy label (`onPaper`) / orange label (`onNavy`).
- `SiteHeader` (sticky, `z-40`) / `SiteFooter`.

New to 2.03 (specified below): `Breadcrumb`, `DecadeSectionHeader`, `SeasonCard`,
`DecadeJumpNav`, `SectionHeading`, `StandingsTable`, `SquadTable`, `PersonChip`,
`SeasonEmptyNotice`.

---

## 4 · Shared conventions

### 4.1 Grid (`brand.md` §Grid — 12-col desktop / 4-col mobile)
- Page width `max-w-page` (1200), gutters `px-5 md:px-10`.
- **Season-card grid:** 1 col mobile (card spans all 4 mobile cols) → 2 cols ≥`sm` →
  **3 cols ≥`lg`** (each card = 4 of 12 desktop cols). `gap-6 md:gap-8`.
  Tailwind: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8`.
- **Photo grid:** same columns as the season-card grid.
- **Body copy / story / squad:** `max-w-measure` (68ch).

### 4.2 Section cadence (matches the homepage exactly)
Every section: `border-t border-mist` + `py-16 md:py-24`. The **first** section under a
hero drops the top border (the hero already terminates the band). Wrap section contents in
`<Reveal>`; stagger grid children with `delayIndex={i % 3}`.

### 4.3 Section heading (D-2.02-3)
The homepage labels sections with a 12px overline only. A season page is a **long document**
and needs scannable headings. So for the archive templates:

```
<span aria-hidden class="block h-0.5 w-8 bg-orange" />   ← orange rule marker
<h2 class="mt-4 font-serif text-h2 font-semibold text-navy">Конечна табела</h2>
```
The orange rule keeps the brand signature; the serif H2 carries the label. This **replaces**
`SectionOverline` on the Season page's five sections and on the Archive decade headers.
`SectionOverline` itself is unchanged and still used on the homepage.

### 4.4 Links, focus, hover
- **Text link:** navy label; hover adds an **orange 2px underline**
  (`decoration-2 underline-offset-4 hover:underline hover:decoration-orange`). The label
  never turns orange (D-1.02-1).
- **Focus (on paper):** `focus-visible:ring-2 ring-navy ring-offset-2 ring-offset-paper`.
  **On navy** (hero): `ring-orange` + `ring-offset-navy` (existing `focusOnNavy`).
- **Card hover:** `-translate-y-0.5` (2px lift), 150ms ease-out. **Lift only — no shadow**
  (`brand.md` defines no shadow token; do not add one).
- **Reduced motion:** already globally handled in `globals.css`.

### 4.5 Ordering (D-2.02-2)
- **Decades:** newest first — `decade desc`.
- **Seasons within a decade:** newest first — **`slug.current desc`**, *not* `title`.
  Every slug starts with a 4-digit year (`1992-93`, `1950`, `1922-26`), so lexical desc is
  chronological desc for **all** folder shapes. Titles are not uniform (era folders become
  „Беласица 1922–1926", single years „Сезона 1950") and would sort wrongly.
- **Photos of a season:** `coalesce(date, "9999") asc` — same key the homepage uses.
  `[0]` is the hero photo.

### 4.6 Macedonian count label (D-2.02-12)
Decade header count: `n === 1 ? "1 сезона" : `${n} сезони``. Never „1 сезони".

---

## 5 · Archive index — `/arhiva`

**Mockups:** `archive-desktop.png`, `archive-mobile.png`, `archive-empty-desktop.png`.

Top → bottom: breadcrumb → page header → sticky decade jump-nav → decade sections
(newest first) → footer.

### 5.1 Breadcrumb
`Почетна / Архива` — inside `Container`, `py-5`. Spec in §6.1.

### 5.2 Page header
- Serif **H1** navy: **„Архива по сезони"**.
- One-line intro, `text-body-l text-neutral-700 max-w-measure`, `mt-4`:
  **„Секоја сезона од историјата на клубот, подредена по деценија — од најновата наназад."**
  (Structural copy — describes the page, claims no fact.)
- Optional meta line, `text-small text-neutral-500`, `mt-4`: **„N сезони · M децении"**.
  Both numbers are **counted from published documents** — truthful, not invented. Omit the
  line if the count is 0.
- Padding: `pb-12` (the jump-nav supplies the following rule).

### 5.3 Decade jump-nav (D-2.02-13 — recommended, included)
With ~74 seasons over 11 decades, scanning needs it.

- `<nav aria-label="Скок по деценија">` — **sticky beneath the site header**, `z-30`,
  `bg-paper`, `border-b border-mist`, `py-3`.
- **Sticky offset = the header's height:** `top-header` (`--spacing-header`, 77px — added in
  2.02, D-2.02-17). Never hardcode the number.
- Items = **only decades that have ≥1 published season**, newest first, label „1990-ти".
  Navy `text-small font-medium`; hover orange underline; brand focus ring.
- `href="#d<decade>"` → the decade section's `id="d1990"`. Give the section
  **`scroll-mt-header`** plus the jump-nav's own height, so an anchored heading isn't hidden
  under **both** sticky bars.
- **Mobile:** a horizontally scrollable rail (`overflow-x-auto`) — the rail scrolls inside
  its own container; **the page body never scrolls sideways**. Same pattern as the
  existing `DecadeTimeline`.
- Current-decade state (scroll-spy) is **optional**; if built, the active item gets the
  **orange 2px underline** and stays navy (D-1.02-1). Not required for 2.03.

### 5.4 Decade section + Season cards
**Decade section header** (`brand.md` §Components — large serif decade + orange rule +
neutral count overline):

```
1990-ти                                            10 СЕЗОНИ     ← t-h2 navy · count = text-overline neutral-500
━━━━━━━━━━━━━────────────────────────────────────────────────    ← orange 2px w-16, then mist 1px flex-1
```
Baseline row (`flex items-baseline justify-between`), then the rule row `mt-3`. The count
is `aria-hidden`-free plain text; the H2 carries the accessible name (`id="d1990"` on the
`<section>`, `aria-labelledby` the H2).

**Season card** (`brand.md` §Components: 3:2 image, serif title, neutral meta, 2px lift):
- Whole card is one `<a href="/arhiva/<slug>">` inside an `<li>`.
- `bg-white border border-mist rounded-card overflow-hidden`.
- **Lead image:** `PhotoFrame ratio="3/2"`, flush to the card's top edge
  (`border-b border-mist`, no own radius), `object-cover`, hotspot honoured.
  Source: the season's back-referenced photos `[0]` (§4.5).
  `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`.
- **Body** `p-5`:
  - **Meta overline** — `text-overline uppercase tracking-overline text-neutral-500`,
    content = **the decade label** („1990-ти"). **Neutral, not orange** (D-2.02-1): orange on
    a white card is 3.08:1 and fails AA, and there is no league to name (divergence 3).
    `brand.md` used to say "orange overline (league)"; **corrected** in 2.02 (§12 BC-3).
  - **Title** — `mt-1.5 font-serif text-h3 font-semibold text-navy` = `season.title`.
- **Hover:** `-translate-y-0.5` + orange underline on the title. **Focus:** navy ring.

### 5.5 Empty lead-photo state (the common case — see `archive-empty-desktop.png`)
After 2.09 most seasons are shells with no photo. The card **never** renders blank or
broken: `PhotoFrame` with no image already gives the **Mist greybox** (`bg-mist`, hairline
border, `rounded-photo`) holding `[PLACEHOLDER: фотографија од сезоната]`. Title + decade
are always present (both required in the model), so **every card is always complete**.

### 5.6 Zero seasons published
Whole-page fallback: page header + one `[PLACEHOLDER: сезони — сѐ уште не се објавени]`
chip. No decade sections, no jump-nav.

---

## 6 · Season detail — `/arhiva/<slug>`

**Mockups:** `season-desktop.png`, `season-mobile.png`, `season-empty-desktop.png`.

Top → bottom: breadcrumb → hero → Приказна → Конечна табела → Состав → Тренери →
Фотографии → back-links → footer. **Every section below is backed by a locked field**
and omits itself when empty.

### 6.1 Breadcrumb (D-2.02-5)
`Почетна / Архива / <season.title>` — on **paper, above the hero**, not over the photo
(the hero's gradient sits at the bottom, so a top-anchored crumb would be illegible; and
the photo-less hero variant would need a second treatment). Inside `Container`, `py-5`.

- `<nav aria-label="Патека">` + `<ol>`.
- Links navy (`text-small`), hover orange underline; separators `/` in `text-mist`
  (`aria-hidden`); current crumb `text-neutral-700` + `aria-current="page"`, not a link.
- Unknown crumb → `[PLACEHOLDER: наслов на сезоната]` (`brand.md` Breadcrumb).

### 6.2 Hero — with photo
- Full-bleed. **`aspect-[4/5]` mobile / `md:aspect-[16/9]` desktop** (`brand.md` §Hero).
- Image = back-referenced photos `[0]`, `object-cover`, hotspot honoured, `priority`,
  `sizes="100vw"`. `alt` = `photo.caption` || „Архивска фотографија на ФК Беласица".
- **Navy bottom gradient** (identical to the homepage hero):
  `bg-linear-to-t from-navy/95 via-navy/45 to-transparent`.
- Text in-column (`Container` + `max-w-measure`, `pb-10 md:pb-16`):
  - **Orange overline** = the decade label „1990-ти" — `SectionOverline variant="onNavy"`.
    Orange on navy is **4.6:1 → AA passes**, so orange text is legal *here only*.
  - **H1** `mt-3 font-serif text-h1 md:text-display font-semibold text-paper` = `season.title`.
- **No CTA, no byline, no photo caption** in the hero (the caption lives in §6.7).

### 6.2b Hero — photo-less (see `season-empty-desktop.png`)
Most seasons have no photo for a while. **Never a greybox hero.** Instead a **navy band**:
`bg-navy`, `py-16 md:py-24`, same `Container` + `max-w-measure`, same orange overline +
paper H1. It reads as a deliberate title band, not as a missing image.

### 6.3 Приказна за сезоната — `season.story`
- Section heading (§4.3): **„Приказна за сезоната"**.
- Portable Text in **one `max-w-measure` column**, `text-body-l text-neutral-700`,
  paragraphs `mt-6`.
- Portable Text mapping: `normal` → `<p>`; `h2`/`h3` → `font-serif text-h3 text-navy mt-10`;
  `strong`/`em` → default; lists → `list-disc pl-5 mt-4 space-y-2`; `blockquote` →
  `border-l-2 border-orange pl-5 italic` (orange as a **marker**, text stays neutral-700);
  links → navy + orange hover underline.
- **Empty → the whole section is omitted.** No placeholder prose (brief, explicit).

### 6.4 Конечна табела — `season.finalTable`
`brand.md` §Components (Stats table): navy header row, ФК Беласица row highlighted, zebra,
unknown cells `—`.

- Section heading (§4.3): **„Конечна табела"**.
- Frame: `border border-mist rounded-card overflow-hidden`.
- `<table class="w-full text-small">` + `<caption class="sr-only">Конечна табела за
  {season.title}</caption>`.
- **`<thead>`:** `bg-navy text-paper`, cells `text-overline uppercase tracking-overline
  px-2 py-3`, each `<th scope="col">`. Numeric columns right-aligned; `#`/`Клуб` left.
- **Column headers** (D-2.02-14) — visible abbreviation + the schema's full Macedonian
  label as `sr-only`, so screen readers get the real word and sighted users get a table
  that fits:

  | Visible | `sr-only` full label | Field |
  |---|---|---|
  | `#` | Позиција | `position` |
  | Клуб | Клуб | `club` |
  | Од | Одиграни | `played` |
  | Поб | Победи | `wins` |
  | Нер | Нерешени | `draws` |
  | Пор | Порази | `losses` |
  | ДГ | Дадени голови | `goalsFor` |
  | ПГ | Примени голови | `goalsAgainst` |
  | Бод | Бодови | `points` |

- **`<tbody>`:** `<td>` `px-2 py-3 text-neutral-700 tabular-nums`, `border-b border-mist`.
  **`bg-zebra`** on even rows. **Any null/undefined cell renders `—`** — never blank, never 0.
- **ФК Беласица row** (D-2.02-4): **`bg-highlight`**, text `text-ink font-semibold`,
  club + rank `text-navy`, plus a **2px orange left border** on the first cell
  (`border-l-2 border-orange`, or `box-shadow: inset 2px 0 0 var(--color-orange)`).
  The rank is **navy, not orange** — orange on `highlight` is 2.80:1 and fails AA
  (D-1.02-1). `brand.md` used to say "orange rank"; it was **corrected** in 2.02 (§12 BC-1),
  so the two now agree.
  Match on `club` — case/whitespace-insensitive contains „Беласица". Not matching is
  harmless (the row simply isn't highlighted); never invent the row.
- **Mobile (D-2.02-10):** the table is the archival artifact — **no column is hidden**.
  Horizontal scroll **inside the bordered frame**: `overflow-x-auto` on the frame,
  `min-w-[560px]` on the table. `#` and `Клуб` are **sticky-left** (`sticky left-0` /
  `left-11`) so every row keeps its identity; the sticky cells need an explicit background
  per row state (paper / zebra / highlight) or they render transparent over scrolled text.
  Give the scroll container `tabindex="0"` + `role="region"` +
  `aria-label="Конечна табела — скролувај хоризонтално"` (a11y: a scrollable region must be
  keyboard-reachable).
- **Empty → section omitted.**

### 6.5 Состав — `season.squad`
- Section heading (§4.3): **„Состав"**.
- **A light table in `max-w-measure`** (D-2.02-11) — *not* the navy Stats table. Two heavy
  navy-headed tables stacked would read as a data dump and fight the editorial tone; the
  narrow measure also keeps the name→number relationship readable.
- `<table class="w-full text-body">` + `<caption class="sr-only">Состав за {title}</caption>`.
  `<thead>` has **no navy fill**: `<th scope="col">` in `text-overline uppercase
  tracking-overline text-neutral-700`, `border-b border-mist`, `pb-2.5`.
  Columns: **Играч** (left) · **Настапи** (right, `w-28`) · **Голови** (right, `w-24`).
  Mobile: shorten the visible headers to „Наст." / „Гол." with the full word `sr-only`.
- Rows: `py-3`, `border-b border-mist`, numbers `text-right tabular-nums`.
- **Player name** = navy text link → **`/legendi/<person.slug>`** (`font-medium`, orange
  hover underline, navy focus ring). The target is built in **2.05** — **it may 404 until
  then, and that is expected**.
- `appearances` / `goals` null → **`—`**.
- **Unresolved `player` reference** (or a person without a slug) → render
  `[PLACEHOLDER: име на играч]` and **no link**. Never invent a name; never drop the row
  silently (its numbers are still archive data).
- **Empty → section omitted.**

### 6.6 Тренери — `season.trainers`
- Section heading (§4.3): **„Тренери"**.
- A compact chip list — `<ul class="flex flex-wrap gap-3">`, each chip an `<a>` →
  `/legendi/<slug>`: `bg-white border border-mist rounded-chip px-3.5 py-2 text-small
  font-medium text-navy`, with a small **orange dot marker** (`size-1.5 rounded-full
  bg-orange`, `aria-hidden`) before the name. Hover: orange underline on the label.
  Focus: navy ring.
- Unresolved reference → `[PLACEHOLDER: име на тренер]` chip, not a link.
- **Empty → section omitted.**

### 6.7 Фотографии — back-referenced photos
- Section heading (§4.3): **„Фотографии"**.
- **Renders ALL of the season's photos, including the one used in the hero** (D-2.02-6).
  The hero is a *cropped presentation band* and shows no caption; the grid is the
  *complete captioned set*. Excluding `[0]` would permanently hide that photo's caption and
  date — unacceptable for an archive whose substance is captioned scans.
- Grid: same columns as §4.1. Each item is a `<figure>`.
- **Frame:** `PhotoFrame ratio="3/2"` — mist mat, `rounded-photo`, hairline border —
  but with **`object-contain`, not `object-cover`** (D-2.02-7). This is what makes
  `brand.md`'s **mixed-quality rule** real: a fixed outer frame for every scan, and a
  **wider mat around smaller/lower-res scans**, so the grid never looks broken and no scan
  is cropped or stretched. Requires one **additive prop** on `PhotoFrame`, e.g.
  `fit="cover" | "contain"` (default `"cover"` — no existing caller changes).
  **Rule of thumb:** `cover` for presentation surfaces (hero, season-card lead, homepage);
  `contain` for the archival photo set, where the scan's true aspect *is* information.
- **Caption below the frame** (never an overlay — D-2.02-9): the homepage's gradient
  overlay `line-clamp-2`s and is right for a mosaic, wrong for archive captions that must
  be read in full.
  - **Date overline** (`photo.date`) — `text-overline uppercase tracking-overline
    text-neutral-500`, preceded by a short **orange rule marker** (`h-0.5 w-4 bg-orange`,
    `aria-hidden`). The overline **text is neutral-500, not orange** — orange on paper is
    2.80:1 and fails AA (D-1.02-1). `brand.md` used to say "orange overline (year)"; it was
    **corrected** in 2.02 (§12 BC-2), so the two now agree.
  - **Description** (`photo.caption`) — `mt-1.5 text-small text-neutral-700`, **not
    clamped**.
  - No `date` → no overline. No `caption` → no description. Neither → frame only.
- `alt` = `photo.caption` || „Архивска фотографија". `sizes` as §5.4.
- **Empty → section omitted.**

### 6.8 Back-links (navigation, not content)
Final section: two navy text links — **„Сите сезони од {decade}-ти"** → `/arhiva#d<decade>`
and **„Назад кон архивата"** → `/arhiva`. Orange hover underline.
*(Prev/next season navigation is **not** designed here — see §15.)*

### 6.9 Fully-empty season — the first-class state (D-2.02-8)
**This is what ~all 74 seasons look like right after 2.09** (`docs/content-ingestion-plan.md`:
the script creates shells with only slug/title/decade; story/table/squad/trainers are
curated by hand later; photos land unpublished behind the rights gate).

If **all five** sections are empty, the sections omitting themselves would leave a hero
floating directly above the footer — a page that looks broken. Instead render **one archive
notice** (`season-empty-desktop.png`):

- `bg-white border border-mist rounded-card p-8 max-w-measure`.
- Serif **H2** (`text-h3` navy): **„Оваа сезона сѐ уште нема објавени детали."**
- `text-body text-neutral-700`: **„Архивата се пополнува постепено. За оваа сезона допрва
  се внесуваат:"**
- The five `PlaceholderChip`s: приказна за сезоната · конечна табела · состав · тренери ·
  фотографии.
- Back-link „Назад кон архивата" → `/arhiva`.
- **Condition:** render **only** when all five are empty. If even one has content, the
  notice is omitted and the empty sections simply don't render.
- All copy here is **structural** — it describes the archive's state and claims no fact.

---

## 7 · Empty / placeholder states — consolidated

| Surface | Empty state | Rule |
|---|---|---|
| Archive — season card lead photo | **Mist greybox + chip** | Never a blank/broken card (§5.5) |
| Archive — zero seasons | One chip, page header stays | §5.6 |
| Archive — decade with 0 seasons | **Decade not listed at all**, and absent from the jump-nav | Never „0 сезони" |
| Season — hero photo | **Navy band hero** | Never a greybox hero (§6.2b) |
| Season — story | **Section omitted** | No placeholder prose |
| Season — final table | **Section omitted**; unknown cells `—` | §6.4 |
| Season — squad | **Section omitted**; unknown numbers `—`; unresolved player → chip | §6.5 |
| Season — trainers | **Section omitted**; unresolved ref → chip | §6.6 |
| Season — photos | **Section omitted** | §6.7 |
| Season — all five empty | **One archive notice** with five chips | §6.9 |
| Season — unknown breadcrumb crumb | `[PLACEHOLDER: наслов на сезоната]` | §6.1 |

**Register:** the season-card photo chip and the §6.9 notice chips will appear across the
archive after 2.09. Suggested placeholder-register entries for `current-state.md`
(orchestrator's call, §13 OQ-3): a single **PL-10 "Season detail — story/table/squad/
trainers/photos, per season"** and **PL-11 "Season lead photo (Archive card)"**, cleared
progressively by the manual editorial pass — rather than ~74 individual rows.

---

## 8 · Accessibility

- **Every pairing used is an AA pair from `brand.md` §Contrast:** ink/paper 15.8 · navy/paper
  13.0 · paper/navy 13.0 · neutral-700/paper 10.4 · neutral-500/paper 4.9 · orange/navy 4.6.
  **Orange on paper (2.8) is never used for text** — only as a rule, a left-edge marker, a
  dot, or an underline (**D-1.02-1**). The two places `brand.md`/the brief asked for orange
  text on a light surface are resolved to markers (§12 BC-1, BC-2).
  On the navy hero, orange text is legal (4.6) and used for the decade overline.
- **Focus:** navy 2px ring, 2px offset on paper; orange ring with navy offset on the hero.
  Every card, chip, crumb, jump-nav item, table link and back-link is focusable with a
  visible ring. Card focus ring goes on the `<a>`, not the inner frame.
- **Table semantics:** real `<table>` (never divs). `<caption class="sr-only">`, `<thead>`,
  `<th scope="col">`. Abbreviated headers carry the full Macedonian label `sr-only`
  (§6.4). The mobile scroll container is `tabindex="0"` + `role="region"` + `aria-label`.
- **Headings:** exactly one `<h1>` per page (Archive „Архива по сезони"; Season = the hero
  title). Decade sections and the five season sections are `<h2>`. Season-card titles are
  `<h3>`. No level is skipped.
- **Landmarks:** `<nav aria-label="Патека">` (breadcrumb), `<nav aria-label="Скок по
  деценија">` (jump-nav) — distinct names, since the site header's nav already exists.
- **Lists:** card grids, chips and the jump-nav are `<ul>`/`<ol>`, so counts are announced.
- **Images:** `alt` = caption when present, else a descriptive Macedonian fallback.
  Decorative rules/dots/separators are `aria-hidden`.
- **Motion:** `prefers-reduced-motion` already neutralises reveal/hover globally.
- **`lang="mk"`** is already set on `<html>`.
- **Sticky offsets:** anchored decade sections need `scroll-mt` ≥ header + jump-nav height,
  or the heading lands underneath them (a keyboard/skip-link trap).

---

## 9 · Motion

`brand.md` §Motion, unchanged: reveal = opacity 0→1 + translateY 10→0, 500ms
cubic-bezier(.2,.7,.2,1), 60ms stagger via `Reveal delayIndex`. Hover/focus 150ms ease-out.
Transform + opacity only (Lighthouse ≥95 budget). Reveal is `.js`-gated — without JS
everything is visible. **The hero is not revealed** (it is above the fold; match the
homepage).

---

## 10 · Data notes for 2.03 (design-relevant only)

Not a GROQ spec — but these shapes are what the design assumes:

- **Photos are read by back-reference** (D-2.01-1), the pattern already in `HOME_QUERY`:
  `*[_type=="photo" && relatedSeason._ref == ^._id] | order(coalesce(date,"9999") asc)`.
  There is **no** `season.photos` array.
- **Archive index** needs, per season: `title`, `slug.current`, `decade`, and the **lead
  photo only** (`[0]`). Group by `decade` and count in the page, ordered per §4.5.
  ~74 seasons × 1 image is fine as one query; the page is static + ISR like the homepage.
- **Season detail** needs the season fields + `squad[]{ appearances, goals, player->{name,
  "slug": slug.current} }` + `trainers[]->{name, "slug": slug.current}` + the photo
  back-reference. Dereference persons in the query — the design depends on `name` + `slug`.
- **Routing:** `/arhiva/<slug>` — Latin slug (D-0.00-4). Unknown slug → `notFound()`.
  `generateStaticParams` from published seasons; keep ISR (`revalidate = 60`) so
  hand-curated content appears without a redeploy, as on the homepage.
- **A season whose query fails/returns nothing** must degrade to the §6.9 notice or a 404 —
  never a crash, never invented filler.

---

## 11 · Decisions (`D-2.02-n`) — logged in `src/_project-state/decisions.md`

| ID | Decision | Why |
|---|---|---|
| **D-2.02-1** | Season-card meta overline = **decade label, neutral-500** — not orange, not a league name | No league field exists (divergence 3); orange text on white fails AA (D-1.02-1) |
| **D-2.02-2** | Season ordering key within a decade = **`slug.current desc`**, not `title` | Every slug starts with a 4-digit year; titles are not uniform across span/single-year/era folders |
| **D-2.02-3** | Archive sections use **orange rule marker + serif H2**, replacing the homepage's overline-only labels | A long archive document needs scannable headings; keeps the orange signature without orange text |
| **D-2.02-4** | ФК Беласица table row = `--highlight` bg + **2px orange left marker**; rank stays **navy** | `brand.md` says "orange rank" → orange on a light row is ~2.8:1, fails AA and D-1.02-1. See BC-1 |
| **D-2.02-5** | Breadcrumb renders **on paper above the hero**, not over the photo | The hero gradient is bottom-anchored; also gives the photo-less hero one consistent treatment |
| **D-2.02-6** | „Фотографии" renders **all** photos **including the hero photo** | The hero shows no caption; excluding `[0]` would permanently hide its caption/date |
| **D-2.02-7** | Photo grid uses **`object-contain` on the mist mat**; hero/cards keep `object-cover`. Adds an additive `fit` prop to `PhotoFrame` | The only way `brand.md`'s mixed-quality "wider mat for small scans, identical outer frame" rule is actually realised |
| **D-2.02-8** | A season with **all five sections empty** renders a single **archive notice** + 5 chips | Otherwise ~all 74 post-2.09 seasons render a hero floating above the footer |
| **D-2.02-9** | Photo caption date = **neutral-500 overline + orange rule marker**; caption sits **below** the frame, unclamped | `brand.md`/brief say "orange overline" → fails AA on paper (BC-2). Overlay captions clamp; archive captions must be readable in full |
| **D-2.02-10** | Standings on mobile = **horizontal scroll inside the bordered frame, all 9 columns kept**, `#`+`Клуб` sticky-left, scroll region keyboard-focusable | The table is the archival artifact — hiding columns loses data |
| **D-2.02-11** | „Состав" = **light table in `max-w-measure`**, not the navy Stats table | Two navy-headed tables stacked read as a data dump and fight the editorial tone |
| **D-2.02-12** | Decade count label pluralises: `1 → „сезона"`, else `„сезони"` | „1 сезони" is wrong Macedonian |
| **D-2.02-13** | The **sticky decade jump-nav is included** (brief said optional) | ~74 seasons over 11 decades; scanning needs it |
| **D-2.02-14** | Table headers = **visible abbreviation + full schema label `sr-only`** | „Победи"/„Порази" both abbreviate to „П"; full labels for screen readers, a fitting table for everyone |
| **D-2.02-15** | **Mockups use deliberately non-plausible schematic filler** (`Клуб А`, `Играч Б`) + a disclaimer strip | No historical fact is VERIFIED in `facts.md`; a mockup must never be mistaken for content or pasted in as seed data |
| **D-2.02-16** | **`zebra` + `highlight` exposed as real tokens** in `globals.css @theme`; added to `brand.md` §Color with measured contrast rows | `brand.md` named both hexes under §Components but no utility existed, so 2.03 would have had to hardcode them |
| **D-2.02-17** | **`--spacing-header: 4.8125rem` (77px) added** → `top-header` / `h-header` / `scroll-mt-header` | The sticky jump-nav must offset below the sticky header; the value is **measured on the rendered header** at 375 and 1280, not derived on paper |

---

## 12 · Tokens & `brand.md` contradictions — ✅ ALL RESOLVED (2026-07-16, owner-directed)

These were flagged as open when this handover was first written. The owner directed the fix
the same day, so **`brand.md` and `globals.css` are now correct and 2.03 has nothing to work
around.** Kept here as the audit trail.

### ✅ MT-1 · Stats-table zebra + highlight — tokens now exist (D-2.02-16)
`brand.md` named **zebra `#FCFBF7`** and **highlight `#FBF3EA`** under §Components, but no
utility existed. Both are now `--color-zebra` / `--color-highlight` in `globals.css @theme`
and rows in `brand.md` §Color. **Use `bg-zebra` / `bg-highlight`** — verified resolving to
`rgb(252,251,247)` / `rgb(251,243,234)` in the running app. Contrast rows were computed and
added to `brand.md` §Contrast (ink/zebra 16.7 · navy/zebra 13.9 · ink/highlight 15.7 ·
navy/highlight 13.1 — all AAA as surfaces).

### ✅ MT-2 · Header height — token now exists (D-2.02-17)
`--spacing-header: 4.8125rem` (**77px**) is in `@theme` and documented in `brand.md`
§Spacing & layout. **Use `top-header`** for the sticky jump-nav (§5.3) and
**`scroll-mt-header`** on the decade sections — both verified resolving to `77px`.
The value was **measured on the rendered `SiteHeader`** at 375 and 1280 (16 + 44px crest
tile + 16 + 1px border), not calculated on paper.
⚠️ It is a **mirror** of the header's rendered height, not its source — `brand.md` and the
`@theme` comment both say to keep it in sync if the header's padding or crest size changes.
*Optional hardening for 2.03: apply `h-header` to the `<header>` element so the token drives
the height and the two can never drift. Not done here — it changes shipped 1.03/1.06b chrome,
which is outside a design phase.*

### ✅ BC-1 · "orange rank" on the Stats table — corrected in `brand.md`
Orange on `highlight` is **2.80:1** (recomputed) → fails AA and breaks D-1.02-1.
`brand.md` §Components now specifies a **2px orange left-edge marker with a navy rank**
(D-2.02-4), with the failing ratio recorded in §Contrast so it can't be reintroduced.

### ✅ BC-2 · "orange overline (year)" on photo captions — corrected in `brand.md`
Same arithmetic on paper (**2.80:1**). `brand.md` §Components **and** §Photo treatment now
specify an **orange rule marker + neutral-500 overline text** (D-2.02-9), noting orange text
stays legal on navy (4.68:1).

### ✅ BC-3 · Season card "orange overline (league)" — corrected in `brand.md` *(found while fixing the above)*
The same bug, twice over: orange on a white card is **3.08:1** (fails AA for normal text),
**and** it named a *league* the content model has never had (D-2.01-2). `brand.md` now
specifies a **neutral-500 decade overline** (D-2.02-1).

### ✅ Rule scope tightened — D-1.02-1 now reads "any light surface"
It previously read "on paper", which is why three specs drifted into orange-on-white/-highlight.
`brand.md` Brand rule 3 also dropped its **"large-text" exemption**: orange on paper is 2.8:1
and large text needs **3.0:1**, so no such exemption ever existed.

*(No new font, colour, radius or spacing **value** was invented: zebra/highlight were already
published in `brand.md`, and the header height was measured from shipped code.)*

---

## 13 · Open questions for the orchestrator / Lazar

- **OQ-1 · Is `photo.provenance` displayed?** It is **required** on every photo and is the
  rights paper-trail, but this design **does not render it**: the 2.09 script writes a
  *provisional* internal string („…права НЕПОТВРДЕНИ…") that must never reach a page, and
  those photos ship unpublished anyway. **However**, the OV-1 caveat (most archive photos
  are third-party Facebook/newspaper screenshots) suggests visible attribution may be
  wanted — or required — once real provenance is written. A small `Извор: …` line under the
  caption is trivial to add later. **Decision needed before 2.09 publishes photos**, not
  before 2.03.
- ~~**OQ-2 · Header-height token**~~ — **RESOLVED 2026-07-16.** Owner directed the fix;
  `--spacing-header` is in `@theme` and `brand.md` (D-2.02-17, §12 MT-2).
- **OQ-3 · Placeholder-register granularity** — adopt the two summary rows (PL-10/PL-11,
  §7) rather than ~74 per-season entries? The register is a cutover blocker checked at 3.05,
  so its granularity matters.

---

## 14 · Mockups

In `Part-2-Phase-02-mockups/` (PNG + HTML source + `mockup.css` + README):

| File | What it shows |
|---|---|
| `archive-desktop.png` | Archive index, 1200 — page header, sticky jump-nav, two decade sections, 3-up cards, one card in hover, mixed photo/empty cards |
| `archive-mobile.png` | Archive index, 375 — 1-col cards, jump-nav rail scrolling in-container |
| `season-desktop.png` | Season detail, 1200 — all seven sections, highlighted table row, `—` cells, squad chip row, small-scan wider mat, caption-less photo |
| `season-mobile.png` | Season detail, 375 — 4:5 hero, standings clipped inside its scroll frame, 1-col photos |
| `archive-empty-desktop.png` | **Empty state** — a whole decade of photo-less cards (the post-2.09 reality) |
| `season-empty-desktop.png` | **Empty state** — season with only title + decade: navy band hero + archive notice |

All photos are greybox/matted frames (real assets unpublished — OV-1 / 2.09). **All textual
content is schematic filler** (D-2.02-15) — see the mockups README.

---

## 15 · Out of scope / deferred

- **Not designed:** Legends, Statistics, About, Contact, and the person detail page
  (`/legendi/<slug>`) — 2.04/2.05. This handover only specifies **how a squad/trainer name
  links to** that route.
- **No schema change requested.** Every section maps to a locked field; nothing here needs a
  new one. (Goal difference is *not* a field — it is not designed and must not be computed.)
- **No new tokens, fonts, colours, or dark mode.** Gaps are flagged in §12.
- **Prev/next season navigation** is a natural fit for an archive spine and the data
  supports it (§4.5 ordering), but the brief's section list doesn't include it, so it is
  **not designed**. §6.8 gives back-links instead. Suggested for a later phase.
- **Scroll-spy** on the jump-nav is optional (§5.3).
- **Search / filter across seasons** — not in scope, not modelled.
