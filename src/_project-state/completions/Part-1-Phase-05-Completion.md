# Part 1 · Phase 05 · Code — Completion Report

> Save as: `src/_project-state/completions/Part-1-Phase-05-Completion.md`. One phase = one report. Filing this report and syncing `current-state.md` is what closes the phase.

**Date:** 2026-07-15 · **Executor:** Claude Code (Opus 4.8), on Lazar's machine · **Outcome (one line):** the real homepage is built from the approved design and live published Sanity content, degrades gracefully to registered placeholders while the dataset is empty, and ships to a Vercel preview URL for the Phase 1.06 Ace demo.

## 1. What shipped (plain language)

`src/app/(site)/page.tsx` is now the real homepage: five sections — **hero, intro strip, featured season, legends, gallery** — built exactly to the approved §Layout, every colour/size/spacing from `brand.md` tokens. It reads **live published content** from Sanity through the existing read client (no token) and renders Sanity photos with `next/image` in matted fixed-ratio frames. Because the `production` dataset is still empty, the page currently shows dignified `[PLACEHOLDER]` chips in each section — it never crashes and never invents filler. The moment Lazar publishes the demo content in `/studio`, those chips are replaced by real photos, the featured season, legends, and the gallery (the page re-reads within ~a minute via ISR, no redeploy). Reveal-on-scroll motion is within the brand budget and turns off for reduced-motion users. The temporary `/debug-sanity` route is gone.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **Five sections from live Sanity via the read client; build + lint pass.** — `page.tsx` runs one combined GROQ query through `src/sanity/client.ts`; `npm run build` "✓ Compiled successfully", 5 static routes, `/` is ISR (Revalidate 1m); `npm run lint` exits clean.
- ✅ **No hardcoded hex / px / font-family in the homepage code.** — `grep -E "#[0-9a-fA-F]{3,8}|\[[0-9]+px\]|font-family|Source Serif|Inter\b"` over `page.tsx` + `src/components/home/` returns **no design-token violations**. The only `px` hits are `next/image` `sizes` breakpoints and an IntersectionObserver `rootMargin` (functional API params, not styling), plus one comment referencing "2px radius". All colours/sizes are brand utilities (`text-navy`, `text-h1`, `rounded-photo`, …).
- ✅ **Orange never renders as text on paper; paper overlines are navy + orange rule; hero overline passes AA on navy.** — verified in-browser via computed styles: intro/featured overlines `rgb(18,41,79)` = navy `#12294F` on paper, each preceded by a 32×2px `bg-orange` rule; hero overline `rgb(228,116,28)` = orange `#E4741C` on the navy hero (4.6:1, AA). `SectionOverline` enforces this split (D-1.02-1).
- ✅ **Sanity photos via `next/image` + `src/sanity/image.ts`, in matted fixed-ratio frames.** — `PhotoFrame` (mist mat, `rounded-photo` 2px, hairline mist border, `object-cover`) + a direct `next/image` for the full-bleed hero; both build the src with `urlFor(...).width(...).auto("format")`.
- ✅ **Placeholder-chip component; every missing display fact renders it; each visible placeholder registered.** — `PlaceholderChip` verified in-browser: `ui-monospace` font, dashed mist border, `rounded-chip` 4px, hatch fill, paper background. PL-5..8 added to the `current-state.md` register (content-load-conditional).
- ✅ **Reveal animates transform + opacity only; reduced-motion shows everything instantly, nothing hidden.** — `globals.css` `.js [data-reveal]` transitions opacity + translateY only (500ms, 60ms stagger); the `@media (prefers-reduced-motion: reduce)` rule forces the visible end-state with `!important`. Gated on `html.js` so no-JS users also see everything (D-1.05-5).
- ✅ **`/debug-sanity` removed; `file-map.md` no longer lists it; `/` and `/studio` return 200.** — directory deleted; `GET /debug-sanity` → 404; `GET /` → 200, `GET /studio` → 200 (dev server).
- ✅ **OV-2 VERIFIED in `facts.md` and moved to Resolved; OV-3 untouched.** — `facts.md` marks the wordmark `ФК Беласица` VERIFIED (owner, chat, 2026-07-15); `current-state.md` owed register moves OV-2 to Resolved, leaves OV-3 open. No component edit (existing spelling confirmed).
- ✅ **`docs/design-handovers/Part-1-Phase-05-Homepage.md` written with the §Layout spec.** — archived in-repo.
- ✅ **Empty-dataset path renders placeholders gracefully with no runtime error.** — verified in-browser on the empty dataset: hero greybox + chip, intro chip, featured greybox + chips, legends chip, gallery chip; page renders, no crash. A `try/catch` around the fetch falls back to the same empty-state render.
- ✅ **PR opened; Vercel preview 200 on `/`; homepage matches §Layout and brand.md.** — PR [#6](https://github.com/DinovLazar/belasica-v2/pull/6). Preview `https://belasica-v2-git-phase-105-homepage-dinovlazars-projects.vercel.app`: `/` → 200, `/studio` → 200, `/debug-sanity` → 404. Verified in-browser on the deployed preview: all five sections render in order with the correct empty-dataset placeholders, orange rules before navy overlines, serif headings, matted greyboxes — matches §Layout and `brand.md`.

**Owed to Lazar (manual, tracked — not a blocker on the Code merge):**

- **Load + publish the demo content** in `/studio` (`siteSettings`, one season with ~1–2 attached photos, 2–3 legends with portraits, ~10 photos), then re-open the preview. Until then the homepage shows PL-5..8 placeholders (by design). Steps: §9 of the Phase 1.04 completion report.

## 3. Decisions I made during this phase

All logged in `decisions.md`.

- **D-1.05-1** · Featured season = newest by `decade` desc, then `title` desc (schema has no `featured` flag; model locked until 2.01).
- **D-1.05-2** · Legends = most-capped first (`careerStats.appearances` desc), then `name` asc, top 3 (appearances is the meaningful proxy; no legend flag exists).
- **D-1.05-3** · Gallery = oldest related season first (`relatedSeason->decade` asc), then `date` asc, top 10 (free-text `date` needs the season anchor).
- **D-1.05-4** · Homepage freshness via ISR `revalidate = 60` (reuses `client.ts`; content appears ~a minute after publishing, no redeploy — needed for the Ace-demo flow).
- **D-1.05-5** · Reveal-on-scroll gated on `html.js` (pre-paint script in the `(site)` layout) so motion is pure enhancement (no blank page without JS); dropped `will-change` (lingering layers + observed paint suppression, no benefit for a one-shot entrance).
- **D-1.05-6** · Hero primary button inverted to paper-fill / navy-label on the dark hero (navy-fill would be invisible on the navy gradient); existing tokens, roles swapped.

## 4. Deviations from the brief

- **Reveal implemented in CSS + IntersectionObserver, not `motion`.** The brief said reuse the motion budget and the global reduced-motion rule; `motion` (framer-motion) is present but a CSS approach reuses the existing global rule literally, avoids JS runtime for a CSS-doable effect, and (via `.js`-gating) guarantees content is never hidden without JS. Same visual result, same budget.
- **Featured card image uses `photos[1] ?? photos[0]`** so the hero and the featured-season card don't show the identical photo when a season has ≥2 photos. Falls back to the single photo (or greybox) otherwise. Minor, content-truth-safe.
- **Featured heading renders `season.title` verbatim** (e.g. „Сезона 1985/86") rather than the brief's `Сезона {title}` template, which would double the word „Сезона" given the schema's title convention.
- **Hero subhead + intro serif lead are fixed structural copy** (no fact claims — they describe what the archive is), per the brief's allowance for "a fixed structural headline, not a fact claim" when `siteSettings` is absent. The editable `siteSettings.description` drives the intro body (placeholder if absent).
- **No dependencies added** (brief preferred none). The one icon (`ArrowRight`) comes from the already-installed `lucide-react`.

## 5. Changed files / deliverables

- **Added (code):** `src/components/home/{PlaceholderChip,PhotoFrame,Reveal,SectionOverline}.tsx`.
- **Added (docs/state):** `docs/design-handovers/Part-1-Phase-05-Homepage.md`; this completion report.
- **Edited:** `src/app/(site)/page.tsx` (placeholder home → real 5-section homepage); `src/app/(site)/layout.tsx` (pre-paint `.js` script); `src/app/globals.css` (reveal + placeholder-hatch utilities); `facts.md` (OV-2 VERIFIED); `src/_project-state/{current-state.md,file-map.md,decisions.md}`; `briefs/Part-1-Phase-05-Code.md` (filed).
- **Deleted:** `src/app/debug-sanity/` (temporary read-check route).
- **Branch:** `phase-1.05-homepage` · **PR:** https://github.com/DinovLazar/belasica-v2/pull/6 · **Preview:** https://belasica-v2-git-phase-105-homepage-dinovlazars-projects.vercel.app (HTTP 200 on `/`, `/studio`; `/debug-sanity` 404)

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality, incl. registers (OV-2 resolved, PL-5..8 added)
- [x] `NEXT:` line set to: `1.06 — Verification + Ace demo`
- [x] `file-map.md` synced (home components, handover, page/layout/globals updates, debug route removed, completion reports listed)
- [x] `00_stack-and-config.md` — **no change** (no dependency added or upgraded this phase)
- [x] `decisions.md` appended (D-1.05-1 … D-1.05-6)

## 7. Risks, surprises, what the next phase needs to know

- **The preview is placeholder-only until content is published.** This is the expected empty-dataset state, not a bug. 1.06's real value depends on Lazar loading the demo content first (Carryovers).
- **Headless-preview quirks during local verification.** The in-app preview browser froze CSS transitions and, at one point, reported a 0-px viewport (so `md:` styles didn't apply and scrolled screenshots came back blank). These are environment artifacts — verified around them via computed styles (all brand tokens correct) and the cascade (reveal reaches `opacity:1` with the transition removed). The real eyeball is the Vercel preview in a normal browser.
- **`@sanity/image-url` build warning** is benign and pre-existing (see current-state Known issues) — not introduced here.
- **Reveal is JS-gated but no-JS-safe:** without JS the `.js` flag is absent and all content renders visible. Part 2 pages can reuse `Reveal`/`PhotoFrame`/`PlaceholderChip`/`SectionOverline` as-is.

### 5-item eyeball checklist for Lazar (on the Vercel preview `/`)

1. **Hero reads right** — full-bleed lead area with the navy bottom gradient, orange `НЕОФИЦИЈАЛНА АРХИВА` overline, big serif `ФК Беласица`, a subhead, a paper "Разгледај ја архивата" button + "За архивата" link. (Before you load content, the photo area is a matted greybox with a placeholder chip — that's expected.)
2. **Sections in order** — scroll down: Intro (`За архивата`) → Featured season (`Издвоена сезона`) → Legends (`Легенди`) → Gallery (`Галерија`) → the usual footer with `неофицијална архива`. Each section overline is navy with a short orange dash before it (never orange text).
3. **Placeholders, not fake content** — every empty slot shows a dashed `[PLACEHOLDER: …]` chip in a mono font. Nothing invented.
4. **After you publish content** — load `siteSettings` + one season (attach a photo or two) + 2–3 legends (with portraits) + ~10 photos in `/studio`, wait ~a minute, reload `/`: the greyboxes become real photos, the featured season and legends fill in, the gallery populates.
5. **Motion is gentle** — sections fade/rise in as you scroll; with your OS "reduce motion" on, everything just appears instantly (nothing stays hidden).

## 8. What's now possible

The homepage is the first real content page — the Phase 1.06 verification + Ace demo runs against it on the Vercel preview once the demo content is loaded. The reusable home components and the reveal/placeholder CSS carry forward into the Part 2 content pages.
