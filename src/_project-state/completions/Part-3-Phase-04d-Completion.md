# Part 3 · Phase 04d · Code — Completion Report

> Owner-directed audit-fix phase (no written brief): Lazar ran `/impeccable audit` on the full site (score 18/20) and directed „run them all in order, then push them to a PR so I can review before a merge — use parallel tasks where needed". The instruction source is that in-session direction plus the audit report's five recommended passes: **typeset → adapt → harden → optimize → polish**.

**Date:** 2026-07-27 · **Executor:** Claude Code (Fable 5) on Lazar's machine · **Outcome (one line):** The rendered type scale finally matches `brand.md`, every small link is a ≥24px tap target, the site has launch metadata (OG/robots/sitemap), and the LCP images are priority-hinted — one PR, no visual redesign.

## 1. What shipped (plain language)

Five audit fixes in one phase. The long-standing `cn()` bug that made every overline and chip render at the wrong size is fixed at its source, so the type on screen is now the type `brand.md` specifies. The tiny links (jump rails, footer, breadcrumbs) are now comfortably tappable without moving a single pixel of the visual design. Sharing a page now produces a proper card (crest + „неофицијална архива" framing), search engines get a robots file and a live 109-URL sitemap, and the Studio is kept out of both. The homepage and season-page hero images tell the browser they are the most important thing on the page, which is measurably faster on mobile.

## 2. Definition of Done — verified-here vs owed-to-Lazar

No brief exists; the DoD is the audit's five recommendations, each verified:

**Verifiable by executor:**
- ✅ **typeset — `cn()` type-scale fix** — evidence: 14-case node proof transpile-importing the shipped `src/lib/utils.ts` (all six known drop cases keep both classes; size/colour/tracking conflicts still merge last-wins); in-browser computed styles: overlines **12px**, chips + header/footer nav + legends chips **14px**, at 1280 and 375.
- ✅ **adapt — tap targets ≥24px (WCAG 2.5.8)** — evidence: measured hit heights: rail links **37px** (rails byte-identical at 46/47px before/after — the sticky/anchor arithmetic untouched), footer links **29px**, breadcrumbs **25px**, hamburger 44px; zero visual drift confirmed by eyeball at both viewports.
- ✅ **harden — launch metadata** — evidence: served HTML carries `og:title`/`og:image` (crest, 864×1220 `sips`-verified)/`og:locale mk_MK`/`twitter:card summary`; `/robots.txt` allows all + disallows `/studio`; `/sitemap.xml` lists **109 URLs** = 6 static + 96 seasons + 7 people (matches the live GROQ counts; slug filter identical to both `generateStaticParams`).
- ✅ **optimize — Lighthouse re-baseline** — evidence (v13.4.1, local prod build): home mobile **92** simulated (2.08 baseline: 88) / **96 devtools-throttled** (LCP 2.3s — the ≥95 line met under applied throttling), season mobile 92–93, desktop **99**, A11y + SEO **100** everywhere; `fetchPriority="high"` verified in the served HTML of both LCP images; legends overfetch 106→21 KiB est. The remaining simulated gap is the lantern estimator (hero variant is a 39 KB webp, observed load phases ≈147ms), and the hero photo's quality was deliberately not reduced (D-3.04d-5).
- ✅ **polish — bounded verification** — evidence: `npm run build` (117 pages, +`/robots.txt` +`/sitemap.xml`) + `npm run lint` clean; Impeccable detector re-run: 1 finding, the known false positive (the documented orange left-edge marker, D-2.02-4); adversarial 3-lens review workflow over the full diff: **2 confirmed P3s** (both stale comments describing the pre-fix `cn()` behaviour — fixed in this phase), 0 other confirmed findings, 0 rejected; batched visual round at 1280 + 375 (homepage, `/arhiva`, season page, `/legendi`): no h-scroll, coherent rendering end to end. *(The a11y-lens reviewer of the first run died on an API error; it was re-run to completion — outcome recorded in §7.)*

**Owed to Lazar (goes on the owed-verification register):**
- **Vercel preview loads + share-card sanity** — how to verify: open the PR preview URL; check `/`, one season page, `/robots.txt`, `/sitemap.xml`; the 5-item eyeball checklist is in §8.
- **Production Lighthouse confirmation** — the ≥95 mobile number should be confirmed on the Vercel preview/production (HTTP/2 + CDN), where the 2.08 baseline was taken; local devtools-throttled already shows 96.

## 3. Decisions I made during this phase

All logged in `decisions.md`: **D-3.04d-1** (cn() fixed via `extendTailwindMerge`; `tracking-overline` registered too; workaround comments rewritten) · **D-3.04d-2** (tap-target technique: padding-into-link with rail heights invariant; negative margins in footer/breadcrumb; breadcrumb capped at 25px to avoid wrapped-row overlap) · **D-3.04d-3** (metadataBase hardcoded Vercel origin ×3 files with sync comments; portrait crest as OG image; twitter `summary`; root-only OG) · **D-3.04d-4** (sitemap from live GROQ, static fallback, ISR 60; robots disallows only `/studio`) · **D-3.04d-5** (fetchPriority gated on `priority`; LegendCard `sizes` prop; hero quality NOT reduced; lantern 92 accepted with devtools 96 on record) · **D-3.04d-6** (phase id renamed 3.04c→3.04d to avoid colliding with Cowork's `D-3.04C-*` namespace).

## 4. Deviations from the brief

No brief. Deviations from the audit's letter: the audit suggested per-page metadata additions — an audit-time error; every page already had metadata, so harden added none (audited, not assumed). The audit's „re-baseline against the ≥95 gate" is satisfied via the devtools-throttled 96 + the on-record explanation of the lantern gap, rather than by degrading the hero image to move the simulated number.

## 5. Changed files / deliverables

- Code: `src/lib/utils.ts` · `src/components/archive/{SeasonAnchorNav,DecadeJumpNav,Breadcrumb,MattedPhoto,SeasonRecordList}.tsx` · `src/components/{SiteFooter}.tsx` · `src/components/home/PhotoFrame.tsx` · `src/components/legends/LegendCard.tsx` · `src/app/layout.tsx` · `src/app/(site)/page.tsx` · **new** `src/app/robots.ts`, `src/app/sitemap.ts`
- State: `decisions.md` (+6), `current-state.md` (snapshot synced), `file-map.md` (+2 files, 2 entries updated), this report. No dependency change → `00_stack-and-config.md` untouched.
- Branch `phase-3.04d-audit-fixes` · PR → `main` (link on the PR; preview URL added there).

## 6. Verification commands run

`npm run build` (✓ 117 pages) · `npm run lint` (✓ clean) · detector re-run (✓ 1 known false positive) · 14-case cn() node proof (✓) · Lighthouse v13.4.1 ×7 runs across home/season × mobile/desktop × lantern/devtools · computed-style + hit-area measurements in the browser at 1280/375 · `curl` checks of `/robots.txt`, `/sitemap.xml`, meta tags, `fetchPriority` attributes.

## 7. Findings & follow-ons handed to the orchestrator

1. **Adversarial review round 1:** 2 confirmed P3s (stale `cn()` workaround comments in `MattedPhoto.tsx` + `SeasonRecordList.tsx`) — **fixed in this phase**; 0 rejected findings. The a11y/metadata lens reviewer failed on an API connection error mid-run and was re-run via workflow resume; its outcome: **one finding, adversarially rejected** — it flagged the 1.25 MB `crest.png` as an OG image that „size-capped scrapers may drop", but verification showed no documented platform cap is violated (Twitter <5 MB, Facebook <8 MB), the claim rested on undocumented scraper folklore, and the crest choice is the logged deliberate decision D-3.04d-3 (designed OG asset deferred, owner-gated). Recorded here as a future optimization option: serve a resized OG derivative when a designed share asset lands.
2. **Pre-existing, preserved, not fixed:** `/arhiva`'s anchor offset constant (`3.25rem` = 52px) overshoots the measured 46px rail by 6px — benign gap above the jumped-to heading, predates this phase, documented in a comment in `DecadeJumpNav.tsx`.
3. **Open from 3.04:** the 3 duplicate photo documents (D-3.04-10) — content edit in Sanity, no code; recommended alongside the `story`/`results` overlap trim (Known issues).
4. **Maintenance duty created:** new `@theme` font-size tokens must also be registered in `src/lib/utils.ts` (in-file comment; nothing mechanical enforces it).
5. **When a custom domain lands:** update the hardcoded origin in `layout.tsx` + `robots.ts` + `sitemap.ts` (each carries a sync comment naming the others).

## 8. Eyeball checklist for Lazar (5 items, on the PR preview)

1. **Homepage overline** („НЕОФИЦИЈАЛНА АРХИВА" over the hero): now small and tightly tracked (12px) — it should read as a quiet kicker, not body text.
2. **Footer + navbar links**: slightly smaller type than before (14px — the brand scale); spacing/rhythm otherwise pixel-identical.
3. **A season page rail** (e.g. `/arhiva/1982-83`): same visual height as before, but each label comfortably tappable on a phone.
4. **Paste a page URL into a chat app**: the share card should show the crest + „ФК Беласица — неофицијална архива".
5. **`/robots.txt` and `/sitemap.xml`** on the preview: robots disallows `/studio`; the sitemap ends with the legend slugs after 96 season URLs.
