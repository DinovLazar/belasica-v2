# Part 3 · Phase 05a · Code — Visual direction exploration: three homepages, owner picks

**Date:** 2026-07-28 · **Executor:** Claude Code (Opus 5), Lazar's machine · **Outcome (one line):** the same homepage now exists in three genuinely different visual directions at `/predlog-a`, `/predlog-b` and `/predlog-c`, all on live content, so the owner can pick a direction before 3.05 redesigns anything else.

## 1. What shipped (plain language)

Three complete homepages — a newsprint chronicle, a club museum, and a bold terrace-modern club identity — each a full restyle of all seven homepage zones plus its own header and footer. All three pull the **same** live Sanity content through one shared query and render the **same** copy, so what differs between them is design and nothing else. The live site is unchanged; the three routes are `noindex`, absent from the sitemap, and linked from nowhere. The comparison document (`docs/design-handovers/Part-3-Phase-05a-Directions.md`) sets out each direction's intent, its exact token deltas vs `brand.md`, and what adopting it would cost — with **no recommendation**, because the pick is Lazar's and Ace's.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **`/predlog-a`, `/predlog-b`, `/predlog-c` each render the full seven-zone homepage from live Sanity content, in three visibly divergent directions matching the recipes** — evidence: all three 200 on the Vercel preview; each renders hero → story → legends → records → decades → moment → quick links + variant header/footer; each carries 4 placeholder chips and 6–7 images from the live dataset. Recipes met per direction: **А** paper-dominant, masthead, hairline navy rules, navy-duotone photos, box-score `<table>`, print captions, orange as marker only; **Б** navy-dominant, mats scaled up with brass keyline + spotlight, paper text on navy, plaque numerals, ~double the live vertical rhythm, full-bleed hero under a navy scrim; **В** oversized condensed Cyrillic caps, navy/orange blocking, crest-forward hero, scoreboard stat strip, tighter sections, pronounced hover/focus (full fill swap), no fake "live" elements.
- ✅ **Live homepage and all existing pages byte-identical in rendering; no shared component or token changed; `brand.md` untouched** — evidence, three independent checks: (1) `git status` shows **not one tracked file modified** — the diff is entirely new files under `src/app/(predlozi)/` plus docs/state; (2) the **rendered body markup** (scripts/links/comments stripped) of `/`, `/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt`, `/arhiva/1982-83` and `/legendi/petar-andreev` is **byte-identical** to a build of this same commit with the whole `(predlozi)` folder moved off disk; (3) in the shared stylesheet, all **405 baseline Tailwind utilities** are present, unchanged, and in the **same relative order** (the variants add 97 new ones, interleaved) — so no conflicting-utility tie can flip on a live page. Also verified: no `@/components/*` import anywhere in the group; no hex value in any variant `.tsx`.
- ✅ **All three routes carry noindex metadata; no nav link points at them** — evidence: `<meta name="robots" content="noindex, nofollow">` on all three in the built HTML and on the live preview; the same tag is **absent** from all six live routes; `sitemap.xml` returns 109 URLs and **0** containing `predlog`; `src/lib/nav.ts` untouched.
- ✅ **Content-truth clean; placeholder chips render where facts are missing** — evidence: 4 chips per variant (two legends with no `playingYears`, footer e-mail, footer socials), identical across all three. No dateline, no edition number, no city, no founding year invented anywhere (D-3.05a-6) — `facts.md` has the founding year UNVERIFIED and records no home town. Footer strings read from `src/lib/facts.ts` unchanged. Record `label`/`value` render exactly as curated; nothing computed.
- ✅ **`/impeccable audit` run on all three routes; P1/P2 fixed, remainder logged** — see §2a below.
- ✅ **Each route verified at 1280 + 375** — evidence: an in-browser sweep on the production build reporting **0 problems** for each of the 6 route×width combinations: exactly one `<h1>`, no heading level skipped, every `<img>` with `alt`, every text/background pair ≥ AA (large text ≥ 3:1), every link/button ≥ 24×24, no horizontal scroll.
- ✅ **`npm run build` and `npm run lint` clean** — evidence: build emits **120 pages** (117 + the three routes), lint exits 0, `tsc --noEmit` clean. ⚠️ See D-3.05a-9 and §7 — the build fails intermittently on a random season page from an upstream Sanity timeout, which reproduces with this phase's code deleted.
- ✅ **`docs/design-handovers/Part-3-Phase-05a-Directions.md` written** — intent paragraph, token-delta table vs `brand.md`, and an "adopting it site-wide would touch" list per direction, plus a verification table. Explicitly no recommendation.
- ✅ **Font choices and every on-the-fly decision logged as `D-3.05a-n`** — D-3.05a-1…-9 in `decisions.md`; fonts are D-3.05a-2 (with the cmap verification method) and D-3.05a-3 (per-variant modules).
- ✅ **PR open with the preview URL and the three links** — [PR #29](https://github.com/DinovLazar/belasica-v2/pull/29).

**Owed to Lazar (goes on the owed-verification register):**

- **The direction pick itself.** Preview: `https://belasica-v2-git-phase-305a-directio-952037-dinovlazars-projects.vercel.app`
  - А · <https://belasica-v2-git-phase-305a-directio-952037-dinovlazars-projects.vercel.app/predlog-a>
  - Б · <https://belasica-v2-git-phase-305a-directio-952037-dinovlazars-projects.vercel.app/predlog-b>
  - В · <https://belasica-v2-git-phase-305a-directio-952037-dinovlazars-projects.vercel.app/predlog-c>

  **Five-item eyeball checklist:**
  1. **А at desktop** — does „Спортски весник" read as a real archive front page, or as a gimmick? Look at the masthead, the two-ink photograph and the box score.
  2. **Б at desktop** — does „Клупски музеј" feel dignified or funereal? Look at the mounted photographs and the plaque wall, and decide whether the extra air is worth the scrolling.
  3. **В at desktop** — does „Трибина" feel like the club, or like a generic sports template? Look at the crest-forward hero and the scoreboard strip.
  4. **All three on your phone**, in this order: A → B → C. Which one you still want to keep scrolling is the answer.
  5. **For each of the three: does it still feel like FK Belasica?** Blue/white with orange stays the identity in all three — say if any of them stops reading as the club's.

  Answer as **A, B, C, or a named combination** (e.g. „B's photography with C's typography"). 3.05 is blocked until then.

## 2a. `/impeccable audit` result

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 4 | 0 failures across 6 route×width sweeps; every focus ring measured on its own surface |
| 2 | Performance | 3 | A preloads 18 woff2 — its three-tier system is real, but it is the heaviest of the three |
| 3 | Responsive Design | 3 | 0 targets under WCAG 2.2's 24px; 17 sit between 24 and 44px |
| 4 | Theming | 4 | Full scoped token layer per variant; zero hex in any `.tsx` |
| 5 | Implementation Integrity | 4 | Detector returns `[]`; each variant reads as one designed system |
| **Total** | | **18/20** | Excellent (minor polish) |

**Findings and what happened to them:**

- **[P1 · Implementation integrity] Side-tab accent border on every tile in В.** `border-left: 6px solid orange` on `.pc-tile` (15 instances) and `.pc-moment-caption` — the detector's most-recognisable-generated-UI-tell rule. Verified in context, not dismissed. **Fixed in-phase** by rotating it to the top edge, where it becomes the same 6px bar that opens the header and closes the footer (D-3.05a-7). Detector now clean.
- **[P1 · Accessibility] Б's hero wall label failed AA over the photograph.** Brass at **1.99:1** worst case. **Fixed in-phase**: scrim deepened through the text band and the label switched to paper, 13.5:1 worst case (D-3.05a-5).
- **[P1 · Accessibility] Four of six placeholder-chip states failed AA** where a hatch line crosses a glyph (worst 3.80:1). The automated sweep had silently exempted them, since it skips anything over a background image. **Fixed in-phase**: all hatch strokes to α 0.18, every state now 4.55–7.63:1 (D-3.05a-8).
- **[P2 · Responsive] В's crest shared a line with the kicker at 375** and В's wordmark overran its column at 1280; Б's spotlight gradient bled 53px past the page. **All three fixed in-phase.**
- **[P3 · Responsive — logged, not fixed] 17 of 39 targets are between 24 and 44px** (nav links 38px, footer links ~29px). They clear WCAG 2.2 AA, which is the project's stated standard, and they match the live site's own profile as set at D-3.04d-2. Raising them to 44px is a whole-site decision that belongs with the direction pick, not inside an exploration.
- **[P3 · Performance — logged, not fixed] A preloads 18 woff2** vs 8 for B and C, because a newspaper genuinely needs display + text + agate and a real italic. Already reduced from 26 by splitting the font modules (D-3.05a-3). If A wins, the trim to make is PT Serif's italic-700, which nothing sets.
- **[P3 · A11y — inherited, not introduced] The project's global `prefers-reduced-motion` rule kills all transition duration** rather than substituting a reduced alternative. It is `!important` and beats every variant override, so content still appears instantly and correctly in all three — but it is the blunt form of the rule. Pre-existing in `globals.css` since 1.05; out of scope here.

## 3. Decisions I made during this phase

All nine are logged in `decisions.md`.

| ID | Decision | Why / alternative rejected |
|---|---|---|
| **D-3.05a-1** | New `(predlozi)` route group; variant-local components; only data, copy and a styling-free reveal observer shared | The comparison is only honest if content is identical; three copies of the query would drift. Rejected: importing live components (satisfies "pixel-identical" but not liftability). |
| **D-3.05a-2** | Seven faces, Cyrillic verified by parsing each font's own `cmap` | A Google subset declaration is a fetch hint, not a coverage guarantee. Anton / Bebas Neue / Archivo Narrow rejected — no Cyrillic at all. |
| **D-3.05a-3** | One font module per variant, unused weights dropped | `next/font` preloads at module granularity: one shared module = 26 woff2 on every route. Now 18/8/8. |
| **D-3.05a-4** | Variant tokens as scoped CSS custom properties + semantic classes; Tailwind keeps `display` and layout | Extending `globals.css @theme` would be a shared-token change. Documents the specificity hazard that bit twice. |
| **D-3.05a-5** | Б's hero label is paper, not brass | The hero photo is dynamic (ISR), so it was measured against the worst case, not the current image. Re-derives D-3.03-5 on a new palette. |
| **D-3.05a-6** | No invented masthead/museum furniture | A dateline or „Струмица" is the most plausible-looking invention available in these two forms; `facts.md` has neither. |
| **D-3.05a-7** | В's tile accent moved from left border to top bar | Impeccable detector finding, verified in context; the rotation turned a card tell into a page-wide motif. |
| **D-3.05a-8** | Chip hatch alpha 0.18, measured against the hatch stroke | The stroke is where the text actually sits; four of six states were failing unmeasured. |
| **D-3.05a-9** | Intermittent build failure diagnosed and recorded, not worked around | It is an upstream Sanity timeout on a file this phase may not touch; a catch would silently ship an incomplete season page. |
| **D-3.05a-10** | В's hero rebuilt as a matchday poster after the owner rejected the first cut | It repeated the crest AND wordmark the sticky header carries 60px above, put the badge on a plain white rectangle, and used none of the direction's blocking. Rejected: dropping the crest (the brief calls for crest-forward) and setting the wordmark over the photo (contrast would depend on whichever `teamPhoto` ISR serves). |

## 4. Deviations from the brief

- **None on scope.** All eight tasks were completed as written.
- **One thing the brief did not ask for and I did not build:** an index page listing the three proposals. The brief says the routes are reached by URL only, so the three links live in this report and in the PR body instead.
- **One brief item interpreted:** "shared components are not modified — build variant-local copies instead". I read the parenthetical as protecting the live site, and applied it strictly to *components*: no `@/components/*` is imported or touched. Pure helper modules (`@/lib/archive`, `@/lib/people`, `@/lib/nav`, `@/lib/facts`) and the Sanity read client are imported read-only — copying `seasonCountLabel`'s Macedonian pluralisation or the verified footer strings into three places would have created three chances to get a fact wrong.

## 5. Changed files / deliverables

Branch `phase-3.05a-direction-exploration` · **[PR #29](https://github.com/DinovLazar/belasica-v2/pull/29)** · preview `https://belasica-v2-git-phase-305a-directio-952037-dinovlazars-projects.vercel.app`

**Added — 21 files, all new:**
- `src/app/(predlozi)/layout.tsx` · `_shared/home.ts` · `_shared/copy.ts` · `_shared/Reveal.tsx`
- `src/app/(predlozi)/predlog-a/` — `page.tsx`, `a.css`, `fonts.ts`, `_components/{Masthead,Colophon,parts}.tsx`
- `src/app/(predlozi)/predlog-b/` — `page.tsx`, `b.css`, `fonts.ts`, `_components/{Entrance,Plaque,parts}.tsx`
- `src/app/(predlozi)/predlog-c/` — `page.tsx`, `c.css`, `fonts.ts`, `_components/{TerraceHeader,TerraceFooter,parts}.tsx`
- `docs/design-handovers/Part-3-Phase-05a-Directions.md`
- `briefs/Part-3-Phase-05a-Code.md`

**Edited:** `src/_project-state/{current-state,decisions,file-map,00_stack-and-config}.md` only.

**Not touched:** `brand.md`, `globals.css`, `src/lib/*`, `src/components/*`, `src/app/(site)/*`, `src/app/layout.tsx`, `src/app/fonts.ts`, `src/sanity/*`, `package.json`.

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers
- [x] `NEXT:` line set to: `3.05 — Statistics + About + Legends redesign (blocked: owner direction pick from 3.05a; the 3.05 brief must bake the chosen direction in and include amending brand.md)`
- [x] `file-map.md` synced (the new route group + the handover)
- [x] `00_stack-and-config.md` appended — **no npm dependency changed**; entry records the seven `next/font` families with subsets and weights, per the 1.03 precedent that fonts are config

## 7. Risks, surprises, what the next phase needs to know

1. **⚠️ The build fails intermittently, and it is not this phase's code.** Four of eight production builds died with `Error occurred prerendering page "/arhiva/<slug>"` — a **different** season each time, same digest, and one run named the cause: `ConnectTimeoutError … f8rmnfry.apicdn.sanity.io:443`. It reproduced on a build with the entire `(predlozi)` group removed from disk, and no tracked file differs from `main`. The season template has no catch around its read, so one failed fetch among 96 static pages kills the build — **this can fail a Vercel deploy**. Recommend a small hardening pass on `src/app/(site)/arhiva/[slug]/page.tsx` (bounded retry, or catch → the existing archive notice) in a later phase. (D-3.05a-9)
2. **Whichever direction wins, `brand.md` has to be amended before 3.05 builds anything** — the 3.05 brief must say so. §A of the handover lists exactly what each direction moves.
3. **Direction Б is a theme inversion, not a restyle.** It contradicts **D-1.03-4 („single light theme, no dark mode")**, which would have to be formally reversed, and it forces a dark-surface pass over `StatTable`'s zebra/highlight rows and all four `ContactForm` states. It is the most expensive to adopt; **В is the cheapest** (it keeps the sticky header and `--spacing-header`, so the 2.02–3.04d anchor arithmetic survives); **А is in between but is the only one that rewrites the header's structure** and therefore that same arithmetic.
4. **A cascade hazard worth remembering** (D-3.05a-4): a route-scoped CSS class and a Tailwind utility that set the same property have equal specificity, and the route stylesheet loads later — so it wins. It cost a burger visible at desktop and a hero photo collapsed to 0px before it was pinned down. Variant classes now never declare `display`.
5. **The automated contrast sweep has a blind spot**: it skips any element whose ancestor paints a background image, which silently exempts every placeholder chip and everything over a photo. Both were caught here only because they were checked separately (D-3.05a-5, D-3.05a-8). The same blind spot applies to the live site's own audits.
6. **The founding-year dependency is unchanged and still open.** All three variants show „основан на 13 август 1922" because it is inside the owner-authored `siteSettings.description`, which is already live on the homepage. `facts.md` still lists the founding year UNVERIFIED. Flagged since 3.03; worth confirming into `facts.md` at the next Ace sit-down.
7. **These routes are disposable.** Once the pick is made, delete the two losers and the `(predlozi)` group; the winner's tokens go into `brand.md` and `globals.css`, not into a copy of this code.

## 7a. Post-review change — В's hero rebuilt (2026-07-28)

Lazar reviewed the three proposals, **picked В „Трибина"** as the direction he likes, and rejected its hero. Diagnosed against the rendered page, the hero had three faults, none of them what makes В good:

1. It repeated **both** the crest and the wordmark that the sticky header carries ~60px above it — it read as a mistake, not a hierarchy.
2. The crest sat on a plain white rectangle: a sticker pasted onto navy, the least considered element on the page.
3. It used **none** of the direction's own vocabulary — a plain two-column split with a photo rectangle beside a vertical text stack, while hard navy/orange blocking is what makes the rest of В work.

**Rebuilt as a matchday poster** (D-3.05a-10): the photograph leads full-bleed (`4/5` → `16/10` → `21/8`); the crest is now a white **block** capped by the same 6px orange bar that opens the header, closes the footer and tops every tile, pinned over the photograph's bottom edge; badge and wordmark form one bottom-aligned lockup where only the crest carries the negative margin, so the `<h1>` sits entirely on solid navy (14.95:1 — deterministic, not dependent on whichever `teamPhoto` ISR serves); kicker, heritage line and both CTAs sit on one row beneath.

Verified: wordmark holds **one line** from `lg` up beside the badge (92px at 1280) and wraps to a full-width line on mobile (52px at 375); everything through the CTAs is **above the fold** at 1280×860 (CTA bottom 803px), which the first cut missed; **0 problems** at 1280 and 375 (contrast, headings, alt, targets, overflow); `npm run build` + `npm run lint` clean. **А and Б are untouched.**

## 8. What's now possible that wasn't before

The design question that has been blocking Part 3 can now be settled by looking rather than by arguing — and 3.05 can be written against a direction the owner has actually chosen.
