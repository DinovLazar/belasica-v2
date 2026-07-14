# Part 1 · Phase 03 · Code — Completion Report

> Save as: `src/_project-state/completions/Part-1-Phase-03-Completion.md`. One phase = one report. Filing this report and syncing `current-state.md` is what closes the phase.

**Date:** 2026-07-14 · **Executor:** Claude Code (Opus 4.8), on Lazar's machine · **Outcome (one line):** the approved design system is now a real, on-brand site shell — header, nav, footer, fonts, tokens, analytics — that every future page renders inside.

## 1. What shipped (plain language)

Every page now renders inside the real frame: a navy header with the serif **ФК Беласица** wordmark and a six-item Cyrillic nav (with hover, active-underline and keyboard-focus states, plus a working mobile menu), a light footer with the mandatory "неофицијална архива" line and the not-the-official-club statement, the warm Paper surface, a centred 1200px column with proper page margins, and the two Macedonian-Cyrillic fonts self-hosted. All the brand colours, type sizes and spacing live in one place (`brand.md` → the Tailwind theme), so nothing is hardcoded and later pages just drop into a frame that already looks right. Cookieless Vercel analytics is on, and motion respects the "reduce motion" accessibility setting.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ `brand.md` contains the real 1.02 tokens; zero SEED markers remain — evidence: `grep -c SEED brand.md` → 0 (verified below); full token set written (color roles + contrast rule + D-1.02-1, type scale, spacing, container/gutters, breakpoints, grid, radii, motion, brand rules).
- ✅ Tailwind theme driven by those tokens; no hardcoded hex/font/spacing in components — evidence: `src/app/globals.css` `@theme` defines `--color-*`, `--text-*`, `--container-*`, `--radius-*`, `--tracking-*`; components use `bg-navy`, `text-paper`, `text-h1`, `max-w-page`, `rounded-card`, etc. In-browser: `--color-orange` = `#e4741c`, `--color-paper` = `#f7f4ec`.
- ✅ Source Serif 4 + Inter self-hosted via `next/font`, Cyrillic subsets, both render the test string — evidence: `src/app/fonts.ts` (`subsets: ["latin","cyrillic"]`); build produced 13 self-hosted `woff2` files; in-browser `h1` computed font = `"Source Serif 4"`, `body` = `Inter`; the Cyrillic wordmark/headline/nav render correctly in screenshots (desktop + mobile).
- ✅ Root layout sets `lang="mk"`, Paper surface, container + gutters; header + footer wrap every page — evidence: `src/app/layout.tsx` (`<html lang="mk">`, `SiteHeader`/`main`/`SiteFooter`); browser tab title from metadata; screenshots show header+footer on the home route.
- ✅ Header/nav matches handover §4 incl. active (orange underline, label visible) and focus (orange 2px ring, 2px offset) — evidence: in-browser active nav label = `rgb(247,244,236)` (Paper) with border-bottom `rgb(228,116,28)` (Orange); 12 `focus-visible` ring rules compiled, `ring-offset-navy` present. Active label is **Paper**, not navy (navy-on-navy is invisible) — see D-1.03-1.
- ✅ Footer shows serif wordmark, nav links, **неофицијална архива**, and the not-official-club statement — evidence: screenshots (desktop + mobile) show all four; `SiteFooter.tsx`.
- ✅ Vercel Web Analytics mounted — evidence: `<Analytics/>` from `@vercel/analytics/next` in `layout.tsx`; `@vercel/analytics@2.0.1` in `package.json`.
- ✅ `prefers-reduced-motion` disables transforms; content still appears — evidence: `@media (prefers-reduced-motion: reduce)` block in `globals.css` (in-browser check: present); transitions set to ~0ms, no `display:none`, so content stays visible.
- ✅ `npm run build` and `npm run lint` both pass — evidence: build "✓ Compiled successfully", 5 static pages generated, `/` = 120 B/103 kB First Load; lint exits 0 with no output.
- ✅ State files updated — `current-state.md` NEXT → 1.04, `file-map.md` synced, `00_stack-and-config.md` appended (§6), this report filed.

**Owed to Lazar (goes on the owed-verification register):**

- **OV-2** — Exact Cyrillic wordmark spelling **ФК Беласица** (Design locked it in 1.02; `facts.md` still flags the wording UNVERIFIED). *How to verify:* confirm with Ace; if different, update `brand.md` §Site name + `SiteHeader.tsx`/`SiteFooter.tsx`.
- **OV-3** — Exact wording of the footer unofficial-archive statement (role VERIFIED, wording UNVERIFIED per `facts.md`). *How to verify:* confirm phrasing with Ace; adjust `SiteFooter.tsx`. The short `неофицијална архива` line is the brief-mandated string.
- **PR preview + 5-item eyeball checklist** — see §7 (Lazar to eyeball on the Vercel preview URL).

## 3. Decisions I made during this phase

- **D-1.03-1** · Orange stays non-text in the shell; on the navy header the active nav label is **Paper** (not navy — invisible on navy) with an orange underline; footer overline is navy/neutral, not orange. Why: reconciles the handover's "navy label / orange overline" component wording with the locked accessibility rule D-1.02-1. Alt rejected: literal navy label (invisible) / orange text (fails AA). Logged: yes.
- **D-1.03-2** · Fonts self-hosted via `next/font/google` (build-time download + self-host), no vendored `.woff2`. Why: it already self-hosts; vendoring adds binaries + manual subset management for no benefit. Alt rejected: `next/font/local` with committed files; Google `<link>` CDN. Logged: yes.
- **D-1.03-3** · Mobile nav is an accessible disclosure (hamburger) menu; handover ships a mobile frame but doesn't spec the mechanism. Alt rejected: horizontal scroll/wrap of six items. Logged: yes.
- **D-1.03-4** · Single light theme; shadcn's `.dark` OKLCH block dropped, semantics repointed to brand. Why: no dark-mode design exists. Alt rejected: keep a brand-mapped `.dark` block (dead code). Logged: yes.
- **D-1.03-5** · Canonical top-level nav slugs (Latin, per D-0.00-4): `/arhiva`, `/legendi`, `/statistika`, `/za-nas`, `/kontakt`, defined once in `src/lib/nav.ts`. Alt rejected: deferred/`#` hrefs. Logged: yes.

Also captured (not my decision, but handled): **D-0.00-12** (P0.3 club-colors resolved) appeared as an uncommitted, unauthored working-tree edit to `decisions.md` mid-session on this shared machine. Per Lazar's direction it was committed **separately** on this branch (`chore: capture P0.3 club-colors decision`) so it is neither lost nor mixed into the 1.03 changes.

## 4. Deviations from the brief

- The active nav label on the navy header is Paper, not the handover's literal "navy label" (D-1.03-1) — impossible on a navy bar; intent preserved.
- Mobile disclosure menu added beyond the bare "nav component" (D-1.03-3) — needed for six items at 375px.
- The 1.02 handover doc + design HTML were provided in-prompt and are **not** in `docs/design-handovers/` (only `.gitkeep`). `brand.md` now carries the tokens so build work is unblocked, but the handover/mockups are not archived in-repo — flagged in `current-state.md` Known issues for the orchestrator.
- Default create-next-app `public/*.svg` assets are now unused but left in place (removing them is out of scope for a layout-shell phase).

## 5. Changed files / deliverables

- **Added:** `src/app/fonts.ts`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/components/Container.tsx`, `src/lib/nav.ts`, this report.
- **Edited:** `brand.md` (SEED → real tokens), `src/app/globals.css` (brand `@theme` + reduced-motion), `src/app/layout.tsx`, `src/app/page.tsx`, `package.json` + `package-lock.json` (`@vercel/analytics@2.0.1`), `src/_project-state/{current-state.md,file-map.md,00_stack-and-config.md,decisions.md}`.
- **Branch:** `phase-1.03-layout-shell` · **PR:** <PR link — see §7> · **Preview:** <Vercel preview URL — see §7>.

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality, incl. registers
- [x] `NEXT:` line set to: `1.04 — Sanity setup + demo content`
- [x] `file-map.md` synced (new components/lib/app files added)
- [x] `00_stack-and-config.md` appended (`@vercel/analytics@2.0.1` + font families, exact)

## 7. Risks, surprises, what the next phase needs to know

- **Concurrent edits on the shared machine.** `decisions.md` was edited by another process mid-session (the P0.3 D-0.00-12 entry) — handled per §3. If both machines run sessions simultaneously, expect this; the append-only + phase-namespaced-ID design keeps it collision-safe, but pull/coordinate.
- **Nav routes 404 until built** (`/arhiva`, `/legendi`, `/statistika`, `/za-nas`, `/kontakt`). Later phases must build pages at these exact slugs, or rename in `src/lib/nav.ts` (the single source).
- **Handover not in-repo** (see §4) — orchestrator may want to file it.
- **`next/font/google` needs build-time network** to fonts.googleapis.com (Vercel has it; local build verified green).

### 5-item eyeball checklist for Lazar (on the Vercel preview URL)

1. **Nav states** — hover a nav item (brightens to full white); the current page shows the orange underline; press Tab through the nav and confirm each item gets an orange focus ring.
2. **Footer archive line** — footer shows **неофицијална архива** and "Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот."
3. **Cyrillic fonts** — the wordmark/headline are a serif (Source Serif 4), the nav/body are a sans (Inter); all Macedonian letters render cleanly (no boxes/fallback).
4. **Mobile gutters** — on a phone, content sits ~20px from each edge; tap the ☰ menu and confirm the six items open and each link works/closes the menu.
5. **Reduced motion** — with OS "Reduce Motion" on, page state still changes instantly (nothing hidden), focus rings and colours remain.

## 8. What's now possible that wasn't before

Content pages can be built by dropping components into a frame that is already on-brand, accessible, and Cyrillic-correct — starting with Phase 1.04 (Sanity + demo content).
