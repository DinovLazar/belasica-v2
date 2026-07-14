# brand.md — Belasica-V2

**The only source of design tokens and brand rules.** Filled by Claude Design in Phase 1.02; from then on, every design handover and every line of UI code reads tokens from here — never hardcoded, never copied into another file. Values below are the **confirmed Phase 1.02 tokens** (written back from `docs/design-handovers/Part-1-Phase-02-Handover.md` in Phase 1.03). The handover is now read-only reference; this file is the source. Every placeholder marker from the seed version has been replaced with a confirmed value.

## Direction (approved at planning)

Dignified modern archive — generous whitespace, strong Cyrillic typography, photos as the heroes. Not retro pastiche, not a template look. The design must survive the comparison "does this look better than a WordPress theme?" — that failure killed V1.

## Site name & identity

- On-site name: **ФК Беласица** (Cyrillic). *Exact preferred spelling still owed from Ace — see facts.md / owed-verification register; Design LOCKED this spelling for build in 1.02.*
- The **unofficial archive** identity (Macedonian: **неофицијална архива**) appears in the footer and page metadata on every page; the site is never styled to imply official club status.

---

## Color

Blue + white is the club identity; orange is the away/secondary accent, used sparingly. Hex values are the LOCKED approved direction. Exact-colour confirmation from a clean high-res crest is owed (P0.3) — refine any sampled hex if it differs.

| Token | Hex | Role | Tailwind |
|---|---|---|---|
| Navy — primary | `#12294F` | Header, headlines, links, primary buttons | `navy` |
| Paper — surface | `#F7F4EC` | Warm off-white base surface | `paper` |
| Orange — accent | `#E4741C` | Rules, active underlines, small markers (decorative / large only) | `orange` |
| Ink — text | `#1B1B1A` | Body copy | `ink` |
| Mist — neutral | `#E4E1D8` | Dividers, borders, greybox photo frames | `mist` |
| neutral-700 | `#3A3A38` | Secondary text | `neutral-700` |
| neutral-500 | `#6B6A64` | Captions, meta | `neutral-500` |
| Card surface | `#FFFFFF` | Cards on paper | `card` |
| Footer surface | `#EDEAE0` | Light footer band (handover §4) | `footer` |
| link | `#12294F` | Same as navy | `navy` |
| focus ring | navy 2px, 2px offset | Default focus state | — |
| error | `#B42318` | Error / validation text | `error` |

### Contrast — WCAG 2.2 AA (all pass)

| Pairing | Ratio | Level |
|---|---|---|
| Ink `#1B1B1A` on Paper `#F7F4EC` | 15.8:1 | AAA |
| Navy `#12294F` on Paper | 13.0:1 | AAA |
| Paper on Navy (header text) | 13.0:1 | AAA |
| neutral-500 `#6B6A64` on Paper | 4.9:1 | AA |
| neutral-700 `#3A3A38` on Paper | 10.4:1 | AAA |
| Error `#B42318` on Paper | 6.0:1 | AA |
| Orange `#E4741C` on Navy (marker / large) | 4.6:1 | AA |
| Orange on Paper | 2.8:1 | ✕ text — **decorative only** |

**Rule (D-1.02-1):** Orange never carries text on paper (2.8:1 fails). It appears only as a rule, an active-state underline, or a small marker. Active nav items are orange-underlined but the **label itself stays navy** (on light surfaces) — never orange — so AA holds. *(On the navy header bar the label is Paper, since navy-on-navy is invisible; see D-1.03-1.)*

---

## Typography — LOCKED

Display/headings **Source Serif 4**; body/UI **Inter**. Both cover Macedonian Cyrillic in full. Self-hosted via `next/font` (Cyrillic subsets) in Phase 1.03.

**Cyrillic coverage — verified with the test string in both faces:**
> Архива по сезони — Легенди — Тренери и Претседатели — ФК Беласица

| Role | Face | Size / line-height | Weight | Tailwind |
|---|---|---|---|---|
| Display | Source Serif 4 | 60 / 1.02 | 600–700 | `font-serif text-display` |
| H1 | Source Serif 4 | 44 / 1.08 | 600 | `font-serif text-h1` |
| H2 | Source Serif 4 | 30 / 1.15 | 600 | `font-serif text-h2` |
| H3 | Source Serif 4 | 22 / 1.25 | 600 | `font-serif text-h3` |
| Body L | Inter | 18 / 1.6 | 400 | `text-body-l` |
| Body | Inter | 16 / 1.65 | 400 | `text-body` |
| Small | Inter | 14 / 1.5 | 400–500 | `text-small` |
| Overline | Inter | 12, uppercase, .14em tracking | 600 | `text-overline uppercase tracking-overline` |

- **Faces (Tailwind):** `font-serif` = Source Serif 4 · `font-sans` (default) = Inter.
- **Weights available:** Inter 400/500/600/700 · Source Serif 4 400/600/700 (via `font-normal` / `font-medium` / `font-semibold` / `font-bold`).
- **Measure:** body copy capped at **68ch** (`max-w-measure`) for comfortable Macedonian reading; narratives flow in a single column.

---

## Spacing & layout

- **Spacing scale (4px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 — mapped to Tailwind's default 4px spacing utilities (`p-1`=4 … `p-6`=24, `p-8`=32, `p-12`=48, `p-16`=64, `p-24`=96, `p-32`=128). No custom spacing scale needed.
- **Content max-width:** 1200px (`max-w-page`) · **Page gutter:** 40px desktop (`md:px-10`) / 20px mobile (`px-5`).
- **Breakpoints:** 640 · 768 (`md`) · 1024 (`lg`) · 1280 (`xl`) — Tailwind defaults align.
- **Grid:** 12-col / 24px gutter (desktop), 4-col / 16px gutter (mobile).
- **Corner radii (minimal rounding — archive dignity):** photo 2px (`rounded-photo`) · card 4px (`rounded-card`) · chip 4px (`rounded-chip`).

---

## Components (anatomy + states)

- **Header nav** — navy bar, serif wordmark left, Cyrillic nav right. States: default (72% paper), hover (100% paper), active (100% + orange 2px underline; label Paper on the navy bar), focus (orange 2px ring, 2px offset).
- **Breadcrumb** — navy links, mist `/` separators; current/unknown crumb as `[PLACEHOLDER]`.
- **Hero** — photo (16:9 desktop / 4:5 mobile) with navy bottom gradient; orange overline, serif headline, optional CTA.
- **Season card** — 3:2 image, orange overline (league), serif title, neutral meta. Hover: 2px lift.
- **Person card** — 4:5 portrait, serif name, neutral role · appearances.
- **Stats table** — navy header row, ФК Беласица row highlighted `#FBF3EA` with orange rank; zebra `#FCFBF7`; unknown cells render `—`.
- **Photo figure + caption** — mist-matted frame, 2px radius; caption = orange overline (year) + Inter small description.
- **Placeholder chip** — dashed mist border, hatched fill, mono text `[PLACEHOLDER: …]`. Every unknown from `facts.md` uses this — never invented.
- **Buttons/links** — primary (navy fill), secondary (navy outline), text link (navy label, orange underline on hover). Full default/hover/focus/disabled row in the specimen.
- **Decade section header** — large serif decade + orange rule + neutral count overline (archive grouping).
- **Footer** — light (`footer` `#EDEAE0`) surface, serif wordmark, nav links, and the mandatory line **неофицијална архива**, plus the "not the official club site" statement.

---

## Photo treatment

- **Aspect ratios:** 16:9 (hero/full-bleed) · 3:2 (season/gallery) · 4:5 (portrait) · 1:1 (crest/badge)
- **Radius:** 2px on all photos (`rounded-photo`).
- **Caption:** orange overline for year/meta + Inter 14px description (neutral-700).
- **Mixed-quality rule:** every scan sits in a fixed-ratio frame on a Mist mat with a hairline border. Smaller/lower-res scans get a wider mat; the outer frame is identical, so varied scans line up cleanly and the grid never looks broken. Low-res images are matted, never stretched full-bleed.
- **Rights:** resolved (OV-1, 2026-07-14 — Ace confirmed Drive photo rights). Real historical images may ship; mockups still use greybox frames until real assets are loaded via Studio.

---

## Motion

- **Reveal on scroll:** opacity 0→1 + translateY 10→0, 500ms cubic-bezier(.2,.7,.2,1), 60ms stagger.
- **Hover/focus:** 150ms ease-out; card lift, underline wipe; never colour-only.
- **Budget:** transform + opacity only (never layout-animated) to stay within **Lighthouse ≥95**.
- **prefers-reduced-motion:** all transitions/animations disabled (content appears instantly); focus rings and state colours remain. Enforced globally in `globals.css`.

---

## Brand rules

1. Site name is **ФК Беласица** (Cyrillic). Exact preferred spelling still owed from Ace (open facts.md item).
2. The **unofficial archive** identity appears in the footer and metadata on every page; never style the site to imply official club status.
3. Orange is decorative / marker / large-text only — never body or link text (D-1.02-1).
4. No invented content. Real strings come from `facts.md`; unknowns render as a visible `[PLACEHOLDER: …]` chip.
5. Real historical photos may ship (OV-1 resolved); load only Drive-sourced, Ace-owned material.
6. Single light theme — no dark mode (D-1.03-4).
