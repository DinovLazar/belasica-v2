# Part 3 · Phase 03 · Code — Completion Report

**Date:** 2026-07-23 · **Outcome (one line):** The homepage was rebuilt as a photo-forward, heritage-and-legends-led front door in the seven-section flow from real Sanity content, the footer was redesigned (fake demo contact/social replaced with visible `[PLACEHOLDER]` chips), and the navbar got a slight refresh — all on the locked `brand.md` tokens, verified ≥ WCAG AA, shipped to a PR + Vercel preview.

## 1. What shipped (plain language)
The front page no longer opens on a single featured season and a decade grid — it now opens on **the club itself and its legends**. Top to bottom: a full-bleed **hero** (crest + „ФК Беласица" over the most recent team photo, with a navy gradient so the text is legible); a short **story** paragraph (the club's own description from the CMS); a **legends** band of the club's players high on the page (real vintage portraits where they exist, tasteful navy monogram tiles where they don't); a **navy "club in numbers"** band of the curated records (two league titles, the 555-appearance record, the top scorers); a clean **"explore by decade"** grid that counts the seasons in each decade and links into the archive; one full-bleed **"moment from history"** photo (the 1993 Cup photo); and **quick-link cards** into the rest of the site, then the redesigned **footer**. The footer's old fake email/phone/social links are gone — replaced by honest `[PLACEHOLDER]` chips — while the „неофицијална архива" statement stays. The navbar is unchanged in structure, just tidied (a bigger, easier-to-tap hamburger and a subtle hover cue). The whole page reads as one designed system — navy/paper rhythm, an orange marker motif, photos as heroes — and it clearly beats the „better than a WordPress theme?" bar the brand doc sets.

## 2. Definition of Done
Each item restated from the phase prompt and checked against the actual result.

- ✅ **Seven-section flow, leads with club identity + legends, keeps navy/paper/orange + Source Serif 4 + Inter, reads real content, ISR 60.** Evidence: `src/app/(site)/page.tsx` renders Hero → Story → Legends → Numbers → Decade explore → Moment → Quick links, in that order; one `HOME_QUERY` reads `siteSettings.description`, the most-recent `teamPhoto`, the players, the `clubRecord` docs, per-decade counts, and the moment photo; `export const revalidate = 60`. Verified on the preview (§ preview) — hero = the 2025/26 squad photo, legends band shows Васо/Панче/Петар + ЉМ/РХ, records band shows all 7 records, 11 decade tiles with real counts, the 1993 moment photo.
- ✅ **Footer redesigned (contact/social as visible `[PLACEHOLDER]`, not the old demo values; unofficial-archive line from `src/lib/facts.ts`); navbar refreshed (sticky bar, 6 items, orange underline, mobile menu intact).** Evidence: preview footer JS check — `[PLACEHOLDER: е-пошта за контакт]` + `[PLACEHOLDER: профили на социјални мрежи]` present; the old `kontakt@fkbelasica-arhiva.mk`, `+389 70 000 000`, and Facebook/Instagram/YouTube are **all gone**; label „неофицијална архива" + statement come from `UNOFFICIAL_ARCHIVE_LABEL`/`_STATEMENT` in `src/lib/facts.ts`. Header still `sticky top-0`, 6 nav items, orange active-underline, hamburger opens the mobile panel.
- ✅ **Only `brand.md` tokens used (no new token applied); orange carries no text; every text/bg ≥ AA; ≥2px focus; 44px tap targets; reduced-motion respected.** Evidence: no hex/px literals for color/type/spacing added; orange appears only as rule markers / the active underline / hover-underline (never as text on a light surface, and the one hero/moment overline that was orange text is now a marker + paper text — D-3.03-5). Contrast measured on the built page (§5): all pairs ≥ AA. Keyboard-tab shows a 2px navy `:focus-visible` ring. Hamburger measured 44px; hero CTAs 45px; cards are large targets. `prefers-reduced-motion` is handled globally in `globals.css` (unchanged). **No `brand.md` token changed; none proposed.**
- ✅ **Content-truth: no invented names/records/dates/contact; every factual claim verified in `facts.md` or a visible registered `[PLACEHOLDER]`; unofficial-archive identity visible; legends band + records render believably from thin content, dependency flagged.** Evidence: the hero asserts no founding year/count (only structural copy); records/legends render verbatim from published docs; contact/social are placeholders; the „неофицијална архива" identity shows in the hero overline **and** the footer. Legends dependency flagged in §7. ⚠️ one content note in §7 (the description asserts a founding year that `facts.md` still lists UNVERIFIED).
- ✅ **Pre-ship audit + accessibility review run and recorded; no avoid-list tell survives.** Evidence: §5 (avoid-list audit) + §6 (WCAG 2.1 AA table). No Inter-as-lazy-default (Inter is brand-mandated, Law 1), no unmandated gradient/palette, no emoji icons (lucide SVG), no uniform-shadow-on-everything (there are no shadows — depth from the navy bands + borders + spacing), minimal radius, one visual anchor set (photos + the navy bands).
- ✅ **`npm run build` + `npm run lint` clean; `/` at 1280 + 375 no horizontal scroll; all six routes 200.** Evidence: `npm run build` = 115 pages, no errors; `npm run lint` = 0 problems. `document.documentElement.scrollWidth == innerWidth` at both 1280 and 375 (no overflowing element). On the deployed preview, `/`, `/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt` all returned **200**.
- ✅ **PR from `phase-3.03-homepage-redesign` → `main`; Vercel preview verified + included with a 5-item eyeball checklist.** Evidence: [PR #25](https://github.com/DinovLazar/belasica-v2/pull/25); preview URL below, verified (homepage render + footer placeholders confirmed on the deployed build); checklist in the § preview section and in the PR body.

## 3. Decisions I made during this phase
Full entries in `decisions.md` (**D-3.03-1 … -6**). Summary:

- **D-3.03-1 — combined design + build, Vercel preview is the review gate** (the owner decision the brief asked me to log). This brief supersedes the design-only `Part-3-Phase-03-Design.md`.
- **D-3.03-2 — legends marquee ordered portraits-first, then Cyrillic name.** Real B&W portraits (Васо, Панче, Петар) lead the row; the navy-initials tiles (Љупчо, Роберт) follow. Reuses `LegendCard` so the homepage and `/legendi` never drift. · alternative rejected: pure name order (interleaves the tiles among portraits, reads less deliberate).
- **D-3.03-3 — `clubRecord` order = category priority (honours → appearances → scorers) then `order`; the championship is pulled out as a full-width feature.** · alternative rejected: strict alphabetical category order (would bury the two titles behind the appearances record).
- **D-3.03-4 — the "moment" photo is selected by a deterministic GROQ rule** (captioned + season-anchored + landscape, oldest era then widest crop → the 1993 Cup photo), which structurally excludes the modern hero photo. · alternative rejected: hardcoding a photo `_id` (brittle) or reusing the featured season's 2nd photo (not necessarily historical).
- **D-3.03-5 — new `SectionOverline` `onPhoto` variant: orange marker + PAPER text.** Pixel-sampling the built hero showed the orange overline sits over a light photo pixel where even a heavy gradient leaves orange at ~3.7:1 — below the 4.5 AA floor for 12px text, and exactly what D-1.02-1 forbids. Paper carries the text (measured ≥ 6.8:1); orange stays a marker; orange **text** survives only on the solid-navy records band (4.68:1). Same reconciliation as D-1.03-1 (AA wins over the brand doc's looser "orange overline" phrasing).
- **D-3.03-6 — retired `DecadeTimeline` (dot rail) for `DecadeExplore` (decade grid with real counts + deep-links).**
- **(minor, not decision-logged)** hamburger enlarged `p-2` → `p-2.5` for a 44px tap target (header height token unchanged at 77px); legend cards equalised to full height via a **homepage-scoped** grid variant (`[&>li>div>a]:h-full`) so `LegendCard` — a `/legendi` component — stays untouched; the homepage now imports `focusOnPaper`/`focusOnNavy` from `@/lib/focus` (folding in the duplication `file-map.md` had flagged for "a later homepage phase").

## 4. Deviations from the brief / spec
- **New component variant, no new token.** `SectionOverline` gained an `onPhoto` variant (D-3.03-5). This is not a `brand.md` token change — it's the brand's own D-1.02-1 rule (orange only where AA holds) applied to a surface the brand doc described loosely. No new color/font/spacing token was added or proposed.
- **Records ordering nuance.** The brief says "ordered by `category` then `order`"; I use a category **priority** (honours-first) rather than alphabetical category order, so the championship leads (D-3.03-3). Same fields, more intentional sequence.
- Otherwise none. No out-of-scope page (`/legendi`, `/statistika`, `/arhiva`, `/za-nas`) was redesigned; no schema change; no dependency added; no secret; no final marketing copy written (verified/real strings + placeholders only).

## 5. Pre-ship audit (avoid-list) + changed files

**Pre-ship audit — no tell survives:**
- **Fonts** — Source Serif 4 (display) + Inter (body), both **brand-mandated** (Law 1). Inter is on the generic avoid-list but is a brand choice; craft is earned via the strong Cyrillic serif hierarchy, the navy/paper rhythm, and the orange-marker motif — not by overriding the brand.
- **Color** — navy/paper/orange only; no unmandated purple/indigo gradient, no default framework palette.
- **Layout** — not the generic centered-hero-over-three-cards; a photo hero with a crest+wordmark lockup, a marquee legends row, a featured+ledger records band, a decade grid, a full-bleed moment. Structure encodes real meaning (the archive's decade span, the records categories).
- **Surfaces** — no shadows anywhere (the brand has no shadow token); depth comes from the navy bands, hairline `mist` borders, and spacing. Minimal radius (card 4px, photo 2px).
- **Icons** — lucide line-SVG (`ArrowRight`, `ArrowUpRight`, `Menu`, `X`); no emoji.
- **Anchor** — boldness spent on the photographs and the two solid-navy bands; everything else is quiet.

**Changed files (`src/`):**
- `src/app/(site)/page.tsx` — rewritten to the seven-section flow + new `HOME_QUERY`.
- `src/components/home/ClubRecords.tsx` — **new**: the navy records band.
- `src/components/home/DecadeExplore.tsx` — **new**: the decade-tile grid.
- `src/components/home/DecadeTimeline.tsx` — **removed** (replaced by `DecadeExplore`).
- `src/components/home/SectionOverline.tsx` — added the `onPhoto` variant.
- `src/components/SiteFooter.tsx` — redesigned (placeholders replace demo values; dynamic year).
- `src/components/SiteHeader.tsx` — refresh (44px hamburger; non-color hover underline).
- `src/_project-state/{current-state,decisions,file-map}.md` — state synced + decisions logged.
- (no `brand.md`, no `globals.css`, no `src/sanity/**`, no `package.json` change; no new dependency.)

## 6. Accessibility review (WCAG 2.1 AA — run on the built page)
Contrast measured in-browser by compositing each foreground (resolving alpha) over its real background:

| Element | Pair | Ratio | Req. | Pass |
|---|---|---|---|---|
| Hero overline / heritage (paper) | paper over photo+gradient (worst-case light pixel) | ≥ 6.8:1 | 4.5 | ✅ |
| Records overline | orange `#E4741C` on **solid** navy | 4.68:1 | 4.5 | ✅ |
| Records h2 / feature / link (paper) | paper on navy | 13.1:1 | 4.5 | ✅ |
| Records values (paper/80–85) | paper α on navy | ~8.8–9.5:1 | 4.5 | ✅ |
| Story h2 / legend names (navy) | navy on paper/white | 13.0:1 | 4.5 | ✅ |
| Story body | neutral-700 on paper | 9.5:1 | 4.5 | ✅ |
| Decade count / quick-link sub | neutral-500 on white | 5.4:1 | 4.5 | ✅ |
| Footer statement | neutral-700 on footer `#EDEAE0` | 9.5:1 | 4.5 | ✅ |
| Footer nav link | navy on footer | 12.0:1 | 4.5 | ✅ |
| Footer copyright | neutral-500 on footer | 4.51:1 | 4.5 | ✅ (tight) |
| Placeholder chip text | neutral-700 on paper-hatch | 11.4:1 | 4.5 | ✅ |

- **Keyboard / focus (2.4.7, 2.1.1):** keyboard Tab shows a visible `:focus-visible` ring — 2px navy + 2px paper offset (13:1) on light surfaces, orange on navy. Mobile menu is a real `<button>` with `aria-expanded`/`aria-controls` + sr-only label; every card/link/CTA is reachable and operable.
- **Target size (2.5.5):** hamburger 44px, hero CTAs 45px; cards/tiles are large targets.
- **Structure (1.3.1):** one H1 (the wordmark) → H2 section headings → H3 sub-items; no level skipped. Nav has `aria-label`; active item has `aria-current="page"` **and** the orange underline (never color-only).
- **Non-text (1.1.1):** 8 images — 3 decorative crests carry `alt=""` (the wordmark provides the name); the hero photo, 3 portraits and the moment photo have descriptive alt.
- **Motion:** `prefers-reduced-motion` disables the reveal transitions globally (unchanged from `globals.css`).
- **Reflow / no h-scroll (1.4.10):** `scrollWidth == innerWidth` at 1280 and 375; no element overflows the viewport.

**Result: no critical / major / minor issues.** The single tight pair (footer copyright, 4.51:1) passes AA and is the pre-existing muted-copyright token (neutral-500 is the brand's caption/meta color); it was not a regression.

## 7. Content dependencies & owner sign-off items
- **Legends set is thin (flagged per the brief).** Only 5 players exist, and only 3 have a portrait (Васо, Панче, Петар). Роберт and Љупчо render the **navy-initials tile** (a deliberate brand element, not a broken image) and a `[PLACEHOLDER: години на играње]` chip (their `playingYears` is unknown — an honest missing fact, consistent with `/legendi`). As more portraits/years are published in Studio, the band fills in automatically.
- ⚠️ **`siteSettings.description` asserts a founding year that `facts.md` still lists UNVERIFIED.** The Story section renders the description verbatim (the brief designates it as the section-2 source), and it reads „…основан на 13 август 1922 година…". `facts.md` records "Club founding year: UNVERIFIED". This is owner-authored CMS copy, so it's implicitly owner-approved, but the two sources disagree — **recommend confirming the founding date into `facts.md` (VERIFIED)** so the record matches what the site shows. No hero copy asserts a year/count.
- **No new brand token needed or proposed.** The identity held on the existing palette + fonts.
- **PL register updated:** PL-9 (footer demo values) **retired** — the footer now shows `[PLACEHOLDER]` chips tracked under PL-3 (email) and PL-15 (socials), which now render on two surfaces (`/kontakt` + footer).

## 8. Vercel preview + 5-item eyeball checklist (please review before merge)
**Preview (verified 200 on all six routes; homepage + footer render confirmed on the deployed build):**
`https://belasica-v2-git-phase-303-homepage-6af6c9-dinovlazars-projects.vercel.app`

Review at **1280** and **375**:
1. **Hero** — does the team photo read clearly with „ФК Беласица" + „Разгледај ја архивата" legible over the navy gradient?
2. **Legends** — do the 3 vintage portraits + 2 navy „ЉМ"/„РХ" tiles look deliberate (not broken)?
3. **Numbers** — does the navy „Клубот во бројки" band (2 titles, 555 apps, 38-goal season …) read correctly?
4. **Footer** — email + socials show as `[PLACEHOLDER]` chips (no fake values), and the „неофицијална архива" statement is present?
5. **Mobile (375)** — no sideways scroll; hamburger opens the menu; legends/decades/quick-links stack cleanly?

## 9. State files synced
- `current-state.md` — `NEXT: 3.04 — Season + Statistics + About + Legends redesign`; summary bullet added; PL register (PL-3/-9/-15) + homepage-placeholders note updated; built-pages/components section updated.
- `file-map.md` — added `ClubRecords`/`DecadeExplore`, removed `DecadeTimeline`, updated `page.tsx`/`SiteHeader`/`SiteFooter`/`SectionOverline`/`focus.ts`/`people.ts` entries.
- `decisions.md` — D-3.03-1 … -6 appended.
- `00_stack-and-config.md` — no change (no dependency added/upgraded).
