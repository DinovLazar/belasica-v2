# Part 3 · Phase 05 — „Трибина" adopted site-wide

**Phase:** 3.05 · **Executor:** Claude Code · **Machine:** Lazar's · **Date:** 2026-07-30
**Branch:** `phase-3.05-tribina-adoption` → `main`
**Owner instruction:** „make /predlog-c the official homepage", then — asked how far it should reach — **full site-wide adoption now**, and **delete all three proposals**.

---

## 1 · What shipped

**The archive now looks like direction В „Трибина" on every route, not just the homepage.**

Phase 3.05a built three homepages and made no recommendation. Lazar picked **В** and asked for it as the real homepage. Because В's header and footer are part of what В *is* — the 6px orange bar opens the header and closes the footer so the page reads as one bounded object — a homepage-only swap would have changed the chrome's shape on every click into an inner page. Asked to choose, the owner took the full adoption.

- **`brand.md` was amended, not replaced** (D-3.05-1). §Color, §Typography, §Spacing & layout, §Motion, §Components, §Brand rules and the quick-reference block now describe В; the 1.02/2.02 history is kept in a collapsed block, and `docs/design-handovers/Part-3-Phase-05a-Directions.md` §В remains the intent document behind it. The direction's `--pc-*` variables were **not** copied — every value was re-derived into the project's own token names, so no component carries an exploration-era prefix.
- **The token layer did the heavy lifting.** Rewriting `globals.css` `@theme` flipped colour, radius and type across all 39 UI files at once; the per-file work was then only the direction's own vocabulary (blocks, tiles, the scoreboard, the bar motif).
- **The homepage** is the seven-block „Трибина" page: matchday-poster hero → paper Story → navy Legends → the scoreboard Records strip → navy Decades → Moment → navy Quick links. **Same `HOME_QUERY`, same ISR 60** — this phase re-dressed the page, it did not re-source it.
- **Every inner page** opens with a new shared navy `PageHeader` block (breadcrumb → H1 → intro → counted meta). The season and person pages keep their richer heroes but sit on the same navy block with the breadcrumb pulled inside it. `PersonHero`'s two variants both moved onto navy, so a person page no longer changes shape depending on whether a photograph happens to exist.
- **`src/app/(predlozi)/` is gone** — all three proposals, their five exploration typefaces, their scoped stylesheets and components. Build: 120 → **117** pages.

**No schema change. No Sanity write. No new npm dependency. No new env var.**

## 2 · Verification

| Check | Result |
|---|---|
| `npm run build` | **clean, 117 pages** (96 seasons + 88 people SSG) |
| `npm run lint` | **clean, 0 problems** |
| `npx tsc --noEmit` | **clean** |
| Impeccable mechanical detector | **`[]`** over `globals.css` + all routes + all components |
| Routes swept at **1280** and **375** | `/` · `/arhiva` · `/arhiva/[slug]` · `/legendi` · `/legendi/[slug]` · `/statistika` · `/za-nas` · `/kontakt` |
| One `<h1>` per route | **8/8** |
| Heading order (no skips) | **8/8 clean** |
| Images without `alt` | **0** |
| Text/background pairs below AA | **0** (measured, alpha composited over the real backdrop) |
| Targets under 24×24 | **0** |
| Horizontal page scroll | **none** at either width |
| Placeholder chips | 4 home · 2 arhiva · 2 statistika · 4 legendi · 2 person · 2 season · 6 za-nas · 5 kontakt |

**Measured, not eyeballed:**
- Header renders **78px**, matching `--spacing-header: 4.875rem`; an in-page anchor jump lands at exactly **78px** (the header's bottom edge).
- Focus ring on a real `Tab`: **3px solid `rgb(13,31,60)`** at 2px offset on light surfaces, **3px solid `rgb(238,122,22)`** on navy.
- Mobile nav: 48×48 burger, `navy-2` panel, six 48px rows, orange 3px left bar on the current row with `aria-current="page"`.
- `/statistika` at 375: the page does **not** scroll (`window.scrollX` stays 0, `body.scrollWidth` = 375); the tables scroll inside their own region (187px of internal scroll) with the first column sticky — the intended D-2.02-10 behaviour.
- Placeholder chips measured against their own **hatch stroke** (the worst case, which an automated sweep skips): 4.73:1 light, 5.84:1 on navy.

**Impeccable audit — 20/20 (Excellent).** A11y 4 · Performance 4 · Theming 4 · Responsive 4 · Implementation integrity 4. Zero hard-coded colours in any component; every arbitrary Tailwind value is geometry (aspect ratios, measures, tracking), never colour. No `will-change`, no blur/filter; only colour, transform and opacity animate.

### Four real defects found and fixed in-phase

1. **[P1] The focus ring was silently disabled site-wide.** Moving `focus.ts` from Tailwind `ring-*` utilities to an `outline`-based class put it in `@layer components`, where the vendored shadcn sheet's `&:focus-visible { outline-style: none }` in `@layer utilities` beat it on every focusable element. Fixed by making the rules **unlayered** (D-3.05-4). A second bug hid inside it: through the `outline` shorthand the base layer's `outline-ring/50` bled in and produced navy at **50% alpha** — a ~3.4:1 ring where 14.95:1 was intended — so `outline-color` is now its own longhand.
2. **[P1] Three tap targets under 24px** — breadcrumb links at 22px, every `/statistika` in-table link and the person back-link at 16.5px. Fixed with an explicit `min-h-6`, deliberately not the padding-plus-negative-margin trick, which makes hit areas overlap once a breadcrumb wraps (D-3.05-8).
3. **[P2] Cards were not equalising height** — `u-card`'s `height:100%` needs every wrapper between it and the grid track to be full-height. Fixed in `LegendCard` / `SeasonCard` / `SeasonNeighbourNav` rather than with the page-level grid hack the 3.03 homepage used.
4. **[P2] Font weights described results nobody saw** — 8 `font-medium` and 19 `font-semibold` on a body face that ships only 400/700, so CSS matching rendered 500 as 400 and 600 as 700 (D-3.05-7).

### Known / carried forward
- ⚠️ **Not introduced here, reproduced again:** `npm run build` fails intermittently on a **random** season page from a Sanity CDN connect-timeout (D-3.05a-9). It hit `/arhiva/1963-64` on one run; the immediate retry was clean at 117/117, which is the discriminator — the flake picks a different season each time. The season template still has no catch around its read, so one failed fetch among 96 can fail a Vercel deploy. **Worth a small hardening pass.**
- ⚠️ **`public/crest.png` changed on disk during this session** (1,253,968 → 972,185 bytes) and is **not** part of this commit. Nothing in this phase writes it and it was clean at session start; most likely another session in this shared checkout re-optimised it. Left modified in the working tree for its author to handle — neither committed nor reverted.
- The `.js` hydration warning in dev is pre-existing (the pre-paint reveal gate, D-1.05-5), unchanged by this phase.

## 3 · Decisions logged

| ID | Decision |
|---|---|
| **D-3.05-1** | Direction В adopted site-wide; `brand.md` amended in place rather than replaced or forked |
| **D-3.05-2** | `font-serif` retired for `font-display` — Oswald is a condensed gothic, and the old name would mislead |
| **D-3.05-3** | Heading roles became CSS component classes (`u-h1`…`u-label`) — `@theme` cannot carry `text-transform` |
| **D-3.05-4** | The focus ring is **deliberately unlayered**; inside `@layer components` it did nothing |
| **D-3.05-5** | `PhotoFrame`'s `fit` now selects the surround as well as the crop (hard block vs mist mat) |
| **D-3.05-6** | Every inner page opens with the shared navy `PageHeader` block; `Breadcrumb` gained `onNavy` |
| **D-3.05-7** | Font weights normalised to the two actually loaded per face; italics dropped (no italic ships) |
| **D-3.05-8** | Three sub-24px targets fixed with explicit `min-h`, not padding-plus-negative-margin |
| **D-3.05-9** | `/predlog-a|b|c` deleted with the whole `(predlozi)` group (owner-directed) |
| **D-3.05-10** | Radius tokens kept defined at `0` rather than deleted, so nothing can reintroduce rounding |

## 4 · State files updated

- `brand.md` — amended to В (the token source for everything downstream).
- `src/_project-state/decisions.md` — D-3.05-1…-10 appended.
- `src/_project-state/00_stack-and-config.md` — the font replacement recorded with exact families, subsets and weights; the `@theme` deltas; the unlayered-focus rule; the enlarged `utils.ts` maintenance duty.
- `src/_project-state/file-map.md` — `(predlozi)` removal noted, `PageHeader.tsx` added, and every changed component's line updated.
- `src/_project-state/current-state.md` — snapshot overwritten, `NEXT:` reset.

## 5 · Preview + eyeball checklist for Lazar

**Vercel preview:** _(see the PR — added once the deployment is green)_

Please open the preview at desktop **and** on your phone and check these five:

1. **The homepage hero.** This is the poster you approved at 3.05a, now on the real site — photograph full-bleed, crest as a white block with the orange bar over the picture's bottom edge, „ФК БЕЛАСИЦА" on solid navy. Does it still land?
2. **Click through the nav.** `/arhiva` → a season → `/legendi` → a person → `/statistika`. The chrome should never change shape, and every page should open with the same navy block. Anything that feels like a different site?
3. **The archive at 375.** Season cards, the sticky decade rail under the header, and the jump links. Is the rail comfortable to tap, and does the right decade land under the header rather than behind it?
4. **`/statistika`.** The tables now scroll sideways inside their own frame with the first column pinned. Try it on the phone — does that read as intended, or does it feel broken?
5. **The overall temperature.** В was the loudest of the three. Across a whole site rather than one page, is it still right — or does anywhere need to come down (or go further)?

Anything you want changed is a follow-up phase; say which of the five and I'll scope it.
