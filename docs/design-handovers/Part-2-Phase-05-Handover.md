# Part 2 · Phase 05 — Design handover: People &amp; pages

**Routes:** `/legendi` (Legends index), `/legendi/<slug>` (Person detail), `/za-nas` (About), `/kontakt` (Contact).
**Visual mockup (all four routes, populated + empty/placeholder, 1280 &amp; 375):** `People & Pages.dc.html` (pan/zoom canvas, one labelled section per route).
**Type:** Design handover for a later build phase. **No code, no schema change.**

---

## 0. Dependencies &amp; provenance (read this first)

This handover **extends the merged-repo 2.02 Archive &amp; Season handover** in `docs/design-handovers/` and takes **all tokens from the repo `brand.md`**. It deliberately relies on **no external draft** — the D-2.03-1 / D-2.04-2 rework was caused by trusting pasted copy that didn't match the repo. If any convention below disagrees with the merged 2.02 handover or `brand.md`, **the repo wins** and this file should be corrected.

> ⚠ **Build-phase note on tokens.** This design was produced in a workspace where `brand.md` was not present, so token *names* below are written against the conventions the brief states (`navy`, `paper`, `mist`, `py-16 md:py-24`, card-lift). **Before building, reconcile every token name in §1 against the actual `brand.md`.** No new token is introduced (see §9). Colour swatches in the mockup are visual stand-ins for the corresponding `brand.md` tokens, not new values.

**Baked-in direction (agreed, do not re-open):** editorial, portrait-forward, navy/paper, reusing the archive/home component language and rhythm; a modern, readable reading of the reference site (crnobelanostalgija.com). The four routes are designed as one family beside Archive, Season, and Statistics.

**Provisional flag (D-2.05-1):** this design opens *before* the second Ace sit-down. **Legends** is stable (conventions-driven). **About** and **Contact** are marked **provisional** in-page; a revision may follow once Ace's input lands.

---

## 1. Shared conventions &amp; tokens (extends 2.02)

- **Palette (from `brand.md`):** `navy` (dark surfaces, hero tiles, primary buttons, headings), `paper` (page background), a lighter card surface, `mist` (hairline borders, `border-t border-mist` between sections), muted ink for secondary text, ink for body. One restrained accent for link-hover / active-nav underline only. **Reconcile names against `brand.md`.**
- **Type:** serif display for page/section headings, sans for UI, chips, labels, and metadata — matching the Archive/Season pages. Both faces **must carry the Cyrillic subset** (all UI copy is Serbian/Macedonian Cyrillic: Легенди, Играчи, Тренери, Раководство, За нас, Контакт, Биографија, Кариера, Сезоне, Фотографије). Use the repo's configured families; the mockup uses Source Serif 4 / Source Sans 3 as Cyrillic-capable stand-ins.
- **Section rhythm:** vertical sections use `py-16 md:py-24`; sections are separated by `border-t border-mist`. Container matches Archive/Season max-width and horizontal padding.
- **Hover:** cards use the existing **card-lift** (subtle `translateY` + softened shadow), identical to `SeasonCard`.
- **Empty rule (2.02/2.04, in force):** every data section **self-omits when empty** — no zero-state message inside a section that has nothing. A missing stat is omitted or placeholdered, **never rendered as `0`** (D-2.01-3 / 2.04). A photoless item gets a **solid navy title tile**, never a greybox (D-2.02-2/3).
- **Content-truth:** every string that is a content *fact* is a **register-tied `[PLACEHOLDER]` chip**, not invented text (PL-1/2/3, OV-3, UNVERIFIED socials). See the placeholder register in `current-state.md`.
- **Accessibility baseline (all routes):** text/background contrast **≥ 4.5:1 (AA)**; all interactive elements keyboard-operable with a visible focus ring; images have alt text; `aria` on anything stateful (see Contact form). Heading order is single `h1` per page → `h2` sections.

---

## 2. `/legendi` — Legends index

**Purpose:** a portrait roster of everyone who shaped the club.
**Reused components:** `Breadcrumb`, `SectionHeading`, `PhotoFrame` (`fit="cover"`), `PersonChip`. **New:** `LegendCard` (§6.1), `RoleBandGrid` (§6.2).

### Section order (top → bottom)
1. `Breadcrumb` — Почетна / Легенди.
2. `SectionHeading` — “Легенди” + one-line intro.
3. **Band: Играчи** → 4. **Band: Тренери** → 5. **Band: Раководство** — fixed order, each a `RoleBandGrid`.

### Band grid
- Responsive **3 / 2 / 1 columns** at 1280 / tablet / 375.
- Each band = `SectionHeading`-style sub-heading (with a count) + a grid of `LegendCard`.
- **Order within a band: by `name`** (locale-aware Cyrillic collation).
- **Empty band omits itself** entirely — heading and grid both gone. No placeholder text.

### Card content
Portrait (`PhotoFrame`, read via `photo.relatedPerson` back-reference, `fit="cover"`, 4:5), then name (serif), role chip(s), `playingYears`. Whole card links to `/legendi/<slug>`.

### Multi-role placement — **D-2.05-2** (critical)
`role` is multi-select, so a person can hold several roles.
- Place each person **exactly once**, in the band of their **highest-priority role**: **`player` > `trainer` > `president`**.
- Show **all** their roles as chips on the card (the mockup's third Играчи card shows a player+trainer example — placed under Играчи, both chips visible).
- Never duplicate a person across bands.

### States
- **Photoless card:** solid **navy tile with the person's initials**, never a greybox (D-2.02-2). Rest of the card unchanged.
- **Empty band:** omitted (above).
- **Whole page empty** (no published persons): out of the normal path, but should render the heading + a single `SeasonEmptyNotice`-style line rather than a bare page. (Confirm with existing empty-notice convention.)

### Responsive
1280: 3-col, portraits ~4:5. 375: single column, full-width cards, hamburger nav (matches existing header). Tap target = whole card.

---

## 3. `/legendi/<slug>` — Person detail

**Applies to EVERY published person** — players, trainers, and officials alike. Season and Statistics pages already link every person here, so the build phase must `generateStaticParams` over **all** published persons; **trainer/official slugs must not 404.**

**Reused components:** `Breadcrumb`, `PhotoFrame`, `SeasonStory` (Portable Text), `BalanceSummary` (career), `PersonChip` (seasons), `PhotoGrid`. **New:** `PersonHero` (§6.3).

### Section order (top → bottom) — each **self-omits when empty**
1. **Breadcrumb** — Почетна / Легенди / <name>.
2. **Hero** (`PersonHero`): portrait + name + role chip(s) + `playingYears`. Photoless → **navy title band with initials** (D-2.02-2).
3. **Биографија** — render `person.bio` as **Portable Text**, reusing the **`SeasonStory`** pattern (same measure, paragraph rhythm, blockquote/link styles). **No schema change — `person.bio` already exists** (`array of block`, title „Биографија"). **Omitted while `bio` is empty** — the demo people have none yet, and that absent state is the correct current behaviour, not a bug.
4. **Кариера** — `careerStats` (`appearances`, `goals`) in the **`BalanceSummary`** visual language (large navy stat tiles). `careerStats` is the **authoritative career total** — never summed from `season.squad` (D-2.01-3). **2.04 rule:** a missing metric is **omitted or placeholdered, never shown as `0`** (a trainer with only `appearances` shows one tile, no goals tile). If both are missing, the whole Career section omits.
5. **Сезоне** — seasons this person appears in, read from `season.squad`, as `PersonChip`-style chips linking to `/arhiva/<slug>`. Omits if none.
6. **Фотографије** — `PhotoGrid` of photos where `relatedPerson` is this person (back-reference). Omits if none.
7. **Back-links** — “← Све легенде” always; plus a contextual “← Назад на сезону …” when arrived from a season/stats page (natural, optional).

### States
- **Photoless hero:** navy tile + initials, name/chips beside it as normal.
- **Bio empty:** section absent (correct current state).
- **Career partial:** show only the known metric; **no `0`**.
- **Trainer/official with minimal data:** breadcrumb + hero + (career if any) + (seasons/photos if any) + back-links. Still a complete, non-404 page.

### Responsive
1280: hero is portrait-left (300px) + text-right; career tiles side-by-side; photos 4-col. 375: single column, portrait full-width above name; career tiles stacked 2-up; photos 2-col.

---

## 4. `/za-nas` — About  *(provisional — D-2.05-1)*

**Purpose:** the quiet human page that explains the archive.
**Reused:** `PhotoFrame` (optional single hero), `SeasonStory` (Portable Text body). No new component (single editorial column).

### Layout
Single centred editorial column (narrower measure than full content width). In-page **provisional banner** at top. Section order:
1. `Breadcrumb` + heading “За нас”.
2. **Optional hero portrait** (`PhotoFrame`, `fit="cover"`), only if a photo is supplied — omits otherwise.
3. **Unofficial-archive framing** — the **verified OV-3** copy, rendered as a set-apart lead block (navy left-rule). **Render verbatim; do not reword** (OV-3 is confirmed). *This handover does not restate the OV-3 string — the build must pull it verbatim from the register/`current-state.md`; the mockup shows a marked verified-copy slot, not invented wording.*
4. **Ace's story + father thread** — body as Portable Text (`SeasonStory` pattern).

### Placeholder states (design the placeholder, not only the filled form)
- **PL-1** — Ace's public name **and** About body text: `[PLACEHOLDER]` chips inline until cleared in 3.03.
- **PL-2** — his father's name + playing years: `[PLACEHOLDER]` chip.
Both render as the standard visible placeholder chip (amber), never invented text. The mockup shows the explicit placeholder state.

### Responsive
1280: centred column, optional 16:9 hero. 375: full-width column, hero 16:10, banner condensed.

---

## 5. `/kontakt` — Contact  *(provisional — D-2.05-1)*

**Purpose:** minimal contact page with a **Formspree-backed** form + a direct-contact block.
**Reused:** `SectionHeading`. **New:** `ContactForm` (§6.4). **No new runtime dependency** — a plain `POST` to a Formspree endpoint supplied as an env var (owner/ops config, D-2.05-3). Creating the account/endpoint is out of scope.

### Layout
Two columns at 1280: **form (left)** + **direct-contact block (right, `border-l border-mist`)**. In-page provisional banner at top.
- **Form fields:** `name`, `email` (type=email), `message` (textarea). Single primary submit.
- **Direct block:** email as `mailto:` (**PL-3** placeholder value) + social links (**placeholder — socials UNVERIFIED in `facts.md`**).

### Form interaction states — **must all be built (D-2.05-3)**
| State | Treatment |
|---|---|
| **Idle** | Fields empty with labels + placeholders; enabled navy submit “Пошаљи”. |
| **Submitting** | Button disabled, spinner + “Шаље се…”; inputs disabled; no layout shift. |
| **Success** | Form replaced by a confirmation panel (check + “Хвала!” + line); `role="status"` `aria-live="polite"`. |
| **Error** | Inline `role="alert"` error banner above the form; fields **retain the user's input**; button returns to enabled “Пошаљи поново”. |

### Accessibility
Every input has a bound `<label>`; required fields marked; email validated; error announced via `role="alert"`; success via `role="status"`; visible focus ring; fully keyboard-operable; contrast ≥ 4.5:1.

### Responsive
1280: two columns. 375: single column — form first, direct-contact block below a `border-t border-mist`.

---

## 6. New component specs

### 6.1 `LegendCard`
- **Props:** `person` (`{ name, slug, roles[], playingYears, portrait }`).
- **Renders:** `PhotoFrame` portrait (4:5, `fit="cover"`) **or** navy initials tile when `portrait` is null; name; role chip(s) for **all** roles (primary role chip = navy, others = muted); `playingYears`. Whole card is a link to `/legendi/<slug>`.
- **States:** with-photo / photoless (navy tile); hover = card-lift.
- **Responsive:** fills its grid cell (grid owns columns).
- **A11y:** single focusable link wrapping the card; `alt` = person name; focus ring; contrast ≥ 4.5:1 on chips.

### 6.2 `RoleBandGrid`
- **Props:** `title`, `people[]` (already filtered + name-sorted by the page).
- **Renders:** sub-heading + count + responsive grid (3/2/1) of `LegendCard`.
- **States:** **renders nothing when `people` is empty** (self-omitting band).
- **A11y:** band title is an `h2`/`h3` in document order.

### 6.3 `PersonHero`
- **Props:** `name`, `roles[]`, `playingYears`, `portrait`.
- **Renders:** portrait-left / text-right at desktop; stacked at mobile. Photoless → navy tile + initials.
- **A11y:** name is the page `h1`; chips are text, not colour-only (role name shown).

### 6.4 `ContactForm`
- **Props:** `endpoint` (Formspree URL from env), optional `successMessage`.
- **State machine:** `idle → submitting → success | error` (see §5 table). Plain `fetch` `POST` (or native form POST) — no new dependency.
- **A11y:** labelled inputs, `type=email`, required handling, `role="alert"` (error) / `role="status"` (success), keyboard + focus, ≥ 4.5:1 contrast.
- **Fields:** `name`, `email`, `message`.

---

## 7. Reused components (existing paths)
- `src/components/archive/`: `Breadcrumb`, `SectionHeading`, `PhotoFrame` (`fit="cover"|"contain"`), `PersonChip`, `SeasonStory`, `PhotoGrid`, `SeasonEmptyNotice`, card-lift pattern from `SeasonCard`.
- `src/components/stats/`: `BalanceSummary` (career section), unknown-handling rule from `StatTable`/`StatsEmptyNotice`.

## 8. Data reads (no schema change)
- Legends portrait &amp; Person photos: `photo.relatedPerson` back-reference (GROQ, D-2.01-1).
- Person bio: existing `person.bio` (`array of block`).
- Career: `person.careerStats.{appearances,goals}` — authoritative, never summed (D-2.01-3).
- Seasons on a person: iterate `season.squad` for this person's slug.
- Routes from `src/lib/nav.ts`: `/legendi`, `/legendi/<slug>`, `/za-nas`, `/kontakt`; season links `/arhiva/<slug>`.

## 9. Tokens
**No new `brand.md` token is introduced.** All colour, type, spacing, and border usage maps to existing tokens (navy / paper / card surface / mist / accent / ink). The amber `[PLACEHOLDER]` chip treatment reuses the project's existing placeholder-chip convention from the registers; if that convention is *not* already tokenised, use it as a design-only affordance (it never ships as real content) rather than adding a token. If the build finds any usage that genuinely has no token, define it in `brand.md` first and note the justification here before use.

## 10. Definition-of-Done cross-check
- Four routes, populated + empty/placeholder, 1280 &amp; 375 — §2–5 + mockup. ✔
- Legends: three bands, multi-role single-placement (player>trainer>president), by-name order, empty-band omission, photoless tile — §2. ✔
- Person detail: all sections self-omitting, covers all persons (no 404), bio = `person.bio` Portable Text via `SeasonStory`, career applies 2.04 no-`0` rule — §3. ✔
- About: OV-3 verbatim framing + PL-1/PL-2 placeholder states, provisional — §4. ✔
- Contact: Formspree form, four states, PL-3 email + placeholder socials, provisional — §5. ✔
- Reused components named by path; new components fully specced — §6–7. ✔
- No new token (§9); relies on merged repo 2.02 handover + `brand.md`, not an external draft (§0). ✔
