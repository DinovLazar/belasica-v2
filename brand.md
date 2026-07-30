# brand.md — Belasica-V2

**The only source of design tokens and brand rules.** Filled by Claude Design in Phase 1.02; from then on, every design handover and every line of UI code reads tokens from here — never hardcoded, never copied into another file.

> **Amended 2026-07-30 (Phase 3.05), owner-directed — the „Трибина" adoption.**
> Lazar reviewed the three Phase 3.05a direction proposals and picked **В „Трибина"** (terrace modern) to become the site's design, whole-site. This file is the amendment: the direction's token layer replaces the 1.02 layer, and `docs/design-handovers/Part-3-Phase-05a-Directions.md` §В remains the intent document behind it.
>
> What changed: **§Color** (navy darkened to `#0D1F3C` with the old navy kept as a second block; orange re-scoped from marker-only to **marker + block fill carrying navy ink**), **§Typography** (Source Serif 4 + Inter → **Oswald + Golos Text**; a condensed uppercase display scale), **§Spacing & layout** (content width 1200 → 1248; **every corner radius → 0**), **§Motion** (500 → 260ms; hover is a fill swap; focus ring 2 → 3px), and **§Components** (blocks, tiles, scoreboard, the 6px orange bar motif).
>
> What did **not** change: the club identity (navy + white + orange), the unofficial-archive rule, content-truth, the single light theme, the 4px spacing grid, and — critically — **D-1.02-1 still holds**: orange never carries text on a light surface. See §Color for why promoting orange to a fill does not break it.
>
> Logged in `src/_project-state/decisions.md`: **D-3.05-1 … D-3.05-6**.

<details>
<summary>Prior amendment — 2026-07-16 (Phase 2.02)</summary>

Two kinds of change, no new colours: three component specs that called for orange *text* on a light surface were corrected to markers (D-2.02-1 / -4 / -9), and three tokens already named or implied here were exposed as Tailwind utilities — `zebra`, `highlight`, `--spacing-header` (D-2.02-16 / -17).
</details>

## Direction (approved at planning, re-set at 3.05)

**A contemporary club identity carrying a dignified archive.** Oversized condensed Cyrillic caps, hard-edged navy/orange blocking, photographs leading full-bleed, and a scoreboard voice for the numbers. The page is built from **stacked full-bleed blocks that butt directly against each other** — navy, paper, navy — rather than a scroll of bordered sections on one background.

Loud, but still an archive. There is no clock, no fixture, no ticker and **no generated number anywhere**: every figure on the site is a curated value rendered exactly as the editor wrote it. The design must survive the comparison "does this look better than a WordPress theme?" — that failure killed V1.

## Site name & identity

- On-site name: **ФК Беласица** (Cyrillic).
- The **unofficial archive** identity (Macedonian: **неофицијална архива**) appears in the footer and page metadata on every page; the site is never styled to imply official club status.

---

## Color

Blue + white is the club identity; orange is the away/secondary accent. The direction runs on **two navies** — a deep block and the brand navy as its second value — so blocks can butt against each other and still read as separate panels.

| Token | Hex | Role | Tailwind |
|---|---|---|---|
| Navy — primary block | `#0D1F3C` | Header, footer, hero, dark blocks, headlines on light | `navy` |
| Navy-2 — second block | `#12294F` | Tiles and cards inside a navy block; the mobile nav panel | `navy-2` |
| Orange — accent | `#EE7A16` | The 6px bar motif, rules, block fills, hover fills, focus ring on navy | `orange` |
| Paper — surface | `#F7F4EC` | Warm off-white base surface; text on navy | `paper` |
| Card surface | `#FFFFFF` | The crest block; cards on paper | `white` |
| Ink — text | `#14161A` | Body copy on light | `ink` |
| Mist — neutral | `#E4E1D8` | Photo mats, hairlines on light | `mist` |
| neutral-700 | `#3A3A38` | Secondary text on light | `neutral-700` |
| neutral-500 — muted | `#5E5C55` | Captions, meta, placeholder-chip text | `neutral-500` |
| Zebra row | `#FCFBF7` | Stats-table zebra striping (surface only) | `zebra` |
| Highlight row | `#EE7A16` | Stats-table ФК Беласица row — **orange fill, navy ink** | `orange` |
| link | `#0D1F3C` | Same as navy | `navy` |
| focus ring | navy 3px on light · orange 3px on navy | Default focus state | — |
| error | `#B42318` | Error / validation text | `error` |

**Paper at 80% over navy** (`paper/80`) is the meta/secondary text value inside dark blocks — 9.9:1 on `navy`, 8.9:1 on `navy-2`.

### The orange promotion — and why D-1.02-1 still holds

`brand.md`'s **D-1.02-1** says orange never carries text on a light surface. **That rule is not broken by this amendment.** Orange text on paper is still `2.6:1` and is still never used anywhere.

What changed is the *direction of the pair*. Previously orange could only be a thin marker. Now the **block itself goes orange and the text on it goes navy** — which measures **5.8:1** and passes AA for body text. Orange as a fill, navy as the ink; never orange as ink on a light ground.

**The signature motif** is a **6px orange bar**. It opens the header, closes the footer, caps every tile and every card-like block, and tops the moment caption. One motif banding the page, its blocks and its tiles. It is a *top* edge, never a left edge — a thick coloured left border on a card is the single most recognisable generated-UI tell (D-3.05a-7). The one exception is the mobile nav panel, where a stacked list legitimately reads its state down its left edge at 3px.

### Contrast — WCAG 2.2 AA

Every pairing **used for text** passes. The `✕` rows are documented **failures**, kept deliberately as guardrails: they are the combinations someone will reach for and must not use. (Ratios computed 2026-07-30 with the WCAG formula; alpha values composited over their real backdrop first.)

| Pairing | Ratio | Level |
|---|---|---|
| Paper on Navy `#0D1F3C` | 14.95:1 | AAA |
| Paper on Navy-2 `#12294F` | 13.12:1 | AAA |
| Paper 80% on Navy | 9.90:1 | AAA |
| Paper 80% on Navy-2 | 8.87:1 | AAA |
| **Navy on Orange `#EE7A16`** — the promotion | **5.81:1** | **AA** |
| Navy-2 on Orange | 5.10:1 | AA |
| Orange on Navy (marker / large / focus ring) | 5.81:1 | AA |
| Orange on Navy-2 | 5.10:1 | AA |
| Navy on Paper | 14.95:1 | AAA |
| Navy on White | 16.43:1 | AAA |
| Navy on Zebra `#FCFBF7` | 15.86:1 | AAA |
| Navy on Mist `#E4E1D8` | 12.56:1 | AAA |
| Ink `#14161A` on Paper | 16.48:1 | AAA |
| Ink on White | 18.11:1 | AAA |
| neutral-700 on Paper | 10.37:1 | AAA |
| neutral-500 `#5E5C55` on Paper | 6.09:1 | AA |
| Error `#B42318` on Paper | 5.98:1 | AA |
| Placeholder chip text vs its own hatch stroke (light) | 4.73:1 | AA |
| Placeholder chip text vs its own hatch stroke (navy) | 5.84:1 | AA |
| Orange on Paper | 2.57:1 | ✕ text — **fill only, never ink** |
| Orange on White | 2.83:1 | ✕ text — **fill only, never ink** |

**Rule (D-1.02-1, restated at 3.05):** Orange never carries text on **any light surface**. It appears as the 6px bar, a rule, a hover/active fill, a focus ring on navy, or a block fill — and when it is a fill, **the text on it is navy**. Orange **text** is legal only on navy (5.8:1).

**Placeholder chips** are measured against their own **hatch stroke** — the worst case, where a hatch line crosses a glyph — not against the chip surface, since a patterned background otherwise silently escapes the automated sweep. Hatch alpha is **0.18** in both states (D-3.05a-8).

---

## Typography — LOCKED (3.05)

Display/headings **Oswald**; body/UI **Golos Text**. Both cover Macedonian Cyrillic in full. Self-hosted via `next/font`.

**Cyrillic coverage — verified from each face's own `cmap`, not from Google's subset declaration** (D-3.05a-2). All 62 Macedonian letters including **Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ Џ џ**. *(Anton, Bebas Neue and Archivo Narrow were rejected for having no Cyrillic at all.)*

Headings are **condensed, uppercase and tightly leaded** — that is the direction's voice. They are set through the role classes below, which bundle face + size + weight + `text-transform` + tracking, because a size token alone cannot carry a case change.

| Role | Face | Size / line-height | Weight | Class |
|---|---|---|---|---|
| Display | Oswald | `clamp(3rem, 9.5vw, 7rem)` / 0.86, UPPERCASE, −0.01em | 700 | `u-display` |
| H1 | Oswald | `clamp(2.5rem, 7vw, 4.5rem)` / 0.92, UPPERCASE | 700 | `u-h1` |
| H2 | Oswald | `clamp(2rem, 5.4vw, 3.75rem)` / 0.95, UPPERCASE, .005em | 600 | `u-h2` |
| H3 | Oswald | `clamp(1.125rem, 1.9vw, 1.5rem)` / 1.1, UPPERCASE, .03em | 600 | `u-h3` |
| Stat | Oswald | `clamp(1.375rem, 3vw, 2.25rem)` / 1.05, tabular | 700 | `u-stat` |
| Stat (featured) | Oswald | `clamp(1.75rem, 4.4vw, 3.25rem)` / 1.05 | 700 | `u-stat text-stat-lead` |
| Wordmark (hero) | Oswald | `clamp(3.25rem, 8vw, 5.75rem)` / 0.86 | 700 | `u-display text-wordmark` |
| Label / overline | Golos Text | 12 / 1, UPPERCASE, .18em, with the orange bar | 700 | `u-label` |
| Body L | Golos Text | 17 / 1.7 | 400 | `text-body-l` |
| Body | Golos Text | 17 / 1.65 | 400 | `text-body` |
| Small | Golos Text | 14 / 1.5 | 400–700 | `text-small` |

- **Faces (Tailwind):** `font-display` = Oswald · `font-sans` (default) = Golos Text.
  *`font-serif` no longer exists — Oswald is a condensed gothic, and keeping the old utility name pointed at it would mislead every future editor (D-3.05-2).*
- **Weights available:** Oswald 600/700 · Golos Text 400/700.
- **Measure:** body copy capped at **62ch** (`max-w-measure`); narratives flow in a single column.
- **Long Macedonian headings must be re-checked in condensed uppercase** — the hero wordmark carries its own clamp so „ФК БЕЛАСИЦА" holds one line beside the crest block.
- **Every custom type token must also be registered in `src/lib/utils.ts`** with `tailwind-merge`, or `cn()` silently drops it (D-3.04d-1). This is a standing maintenance duty.

---

## Spacing & layout

- **Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 — Tailwind's default 4px utilities. No custom spacing scale needed.
- **Content max-width:** **1248px** (`max-w-page`) · **Page gutter:** 32px desktop (`md:px-8`) / 20px mobile (`px-5`).
- **Section rhythm:** `clamp(3rem, 5vw, 4.5rem)` (`py-section`) — the tightest of the three directions. Blocks butt against each other; **a block boundary is a colour change, not a border**.
- **Sticky header height:** **`--spacing-header`** → `top-header` / `h-header` / `scroll-mt-header`. Anything that sticks beneath the header offsets by `top-header`, and in-page anchor targets clear it with `scroll-mt-header`. **Measured on the rendered header — keep in sync if the header's padding, bar or crest size changes.**
- **Breakpoints:** 640 · 768 (`md`) · 1024 (`lg`) · 1280 (`xl`) — Tailwind defaults align.
- **Corner radii:** **0 everywhere.** Hard blocks are the direction. There is no `rounded-card` / `rounded-photo` / `rounded-chip` value above zero, and no component may reintroduce one.
- **Tap targets:** ≥ 24×24 CSS px everywhere (WCAG 2.5.8); ≥ 44px for the mobile nav toggle.

---

## Components (anatomy + states)

- **Block** — the base unit. A full-bleed band of `navy`, `navy-2` or `paper`, with its content in the `max-w-page` wrap. Adjacent blocks alternate value and share an edge; no gap, no border, no shadow. **There is no shadow token — depth comes from value, not blur.**
- **Header nav** — navy block, opened by the 6px orange bar. Crest on a white block + condensed caps wordmark left, condensed caps nav right. States: default (paper 80%), hover (100% paper + paper underline), active (100% paper + **orange 3px underline**), focus (orange 3px ring). Sticky. Below `md` it collapses into a full-width `navy-2` panel behind a 48px toggle, where the current item is marked by a 3px orange **left** bar.
- **Footer** — navy block, closed by the same 6px orange bar, so the page reads as one bounded object. Wordmark, the mandatory **неофицијална архива** line and the "not the official club site" statement, both from `src/lib/facts.ts`.
- **Tile** (decades, quick links) — `navy-2`, capped by the **6px orange top bar**, condensed caps title + tracked meta. Hover: the whole tile flips to **orange fill with navy ink**, plus a 4px lift.
- **Card** (season, person) — `navy-2` inside a navy block, or white inside a paper block. Photo flush to the edges, no mat, no radius. Hover: a 6px orange bar wipes in along the **bottom** edge, plus a 4px lift.
- **Scoreboard** (records) — a full-bleed strip on an orange ground, gapped 2px so the orange reads as the rule between cells. The featured record is an **orange cell with navy ink**; the rest are `navy` cells with paper ink. Values render exactly as curated — never reformatted, never computed.
- **Stats table** — navy header row (`navy`/`paper`); zebra `zebra`; the **ФК Беласица row is an orange fill with navy ink** (5.8:1) and bold weight, so the row is never distinguished by colour alone; unknown cells render `—`.
- **Breadcrumb** — navy links on paper, mist `/` separators, tracked caps.
- **Hero** — the **matchday poster**: the photograph leads full-bleed (`4/5` → `16/10` → `21/8`), and the crest sits on a **white block capped by the 6px orange bar**, pinned over the picture's bottom edge by a negative margin. Only the crest overlaps the photo; the wordmark is bottom-aligned to it and sits entirely on solid navy, so contrast is a deterministic 14.95:1 and never depends on which photograph is served. This block is the reusable pattern every page hero inherits.
- **Photo figure + caption** — a hard-edged block: no frame, no radius, no mat on presentation surfaces. Caption = `u-label` (orange bar + tracked caps) + the description.
- **Placeholder chip** — dashed border, hatched fill (α 0.18), mono text `[PLACEHOLDER: …]`. Every unknown from `facts.md` uses this — never invented.
- **Buttons** — primary is an **orange fill with navy ink**, hover swaps the fill to paper. Secondary is a 2px paper inset outline on navy, hover swaps to a paper fill with navy ink. Text link: condensed caps with a **3px orange underline**, hover swaps the underline to the text colour.
- **Archival photo sets** keep the **mist mat** and `object-contain` — see §Photo treatment. The hard-edge rule governs *presentation* surfaces; a scan's true aspect is information.

---

## Photo treatment

- **Aspect ratios:** 21:8 / 16:10 / 4:5 (hero, responsive) · 16:6 (moment band) · 3:2 (season/gallery) · 4:5 (portrait) · 1:1 (crest/badge)
- **Radius:** 0 on all photos.
- **Fit:** `object-cover` on presentation surfaces (hero, moment, card leads); **`object-contain`** for archival photo sets, where the scan's true aspect is information and the mat must widen around it.
- **Mixed-quality rule:** every archival scan sits in a fixed-ratio frame on a Mist mat with a hairline border. Smaller/lower-res scans get a wider mat; the outer frame is identical, so varied scans line up cleanly and the grid never looks broken. Low-res images are matted, never stretched full-bleed.
- **A person with no portrait on file** gets a **monogram block** — `navy` ground, orange inset keyline, initials in the display face. Never a stand-in face, never a grey box.
- **Rights:** resolved (OV-1 / OV-RIGHTS — owner confirmed rights to all Drive photos).

---

## Motion

- **Reveal on scroll:** opacity 0→1 + translateY 12→0, **260ms** cubic-bezier(.2,.9,.3,1), 60ms stagger. Things arrive; they do not drift.
- **Hover/focus:** **160ms** ease-out. Hover is a **fill swap** (navy→orange) plus a 4px lift — pronounced, and never colour-only: the fill swap always moves the ink colour with it, and every interactive element also carries an underline, bar or lift.
- **Budget:** transform + opacity + background-color only (never layout-animated), to stay within **Lighthouse ≥95**.
- **prefers-reduced-motion:** all transitions/animations disabled (content appears instantly); focus rings and state colours remain. Enforced globally in `globals.css`.

---

## Brand rules

1. Site name is **ФК Беласица** (Cyrillic).
2. The **unofficial archive** identity appears in the footer and metadata on every page; never style the site to imply official club status.
3. **Orange is a fill, never ink on a light surface** (D-1.02-1). On paper it is 2.6:1, which fails AA even at large sizes, so there is no "large text" exemption. Orange **text** is legal only on navy (5.8:1). When orange is the fill, the ink on it is navy (5.8:1).
4. The **6px orange bar** is the signature. It bands blocks along their **top** edge — never as a left-hand accent border on a card (D-3.05a-7).
5. **No invented content.** Real strings come from `facts.md`; unknowns render as a visible `[PLACEHOLDER: …]` chip. No number on the site is computed to look complete.
6. **Radius is 0.** No component reintroduces rounding.
7. **No shadow token.** Depth comes from value and spacing.
8. Single light theme — no dark mode (D-1.03-4). *(The navy blocks are a value in a light theme, not a dark mode.)*

---

## Design tokens (quick reference)

```
COLOR    navy #0D1F3C · navy-2 #12294F · orange #EE7A16 · paper #F7F4EC
         white #FFFFFF · ink #14161A · mist #E4E1D8
         neutral-700 #3A3A38 · neutral-500 #5E5C55 · zebra #FCFBF7 · error #B42318
         on-navy meta = paper/80

TYPE     display = Oswald 600/700 UPPERCASE   ·  body = Golos Text 400/700
         u-display clamp(3rem,9.5vw,7rem)/0.86   u-h1 clamp(2.5rem,7vw,4.5rem)/0.92
         u-h2 clamp(2rem,5.4vw,3.75rem)/0.95     u-h3 clamp(1.125rem,1.9vw,1.5rem)/1.1
         u-stat clamp(1.375rem,3vw,2.25rem)/1.05 u-label 12/1 .18em + orange bar
         body-l 17/1.7 · body 17/1.65 · small 14/1.5 · measure 62ch

SHAPE    radius 0 everywhere · no shadow · page 1248 · gutter 20/32
         section py clamp(3rem,5vw,4.5rem) · bar 6px orange (top edge)

STATE    focus 3px (navy on light, orange on navy), 2px offset
         hover fill swap navy→orange + 4px lift, 160ms ease-out
         reveal 260ms cubic-bezier(.2,.9,.3,1), 60ms stagger
         tap target ≥ 24px (≥ 44px mobile nav toggle)
```
