NEXT: 1.06 close — Ace sit-down + OV-3 (homepage code complete); then 2.01 — Content model lock

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-15 · by Code (Phase 1.05.2 — homepage content-sync + 3 sections) on Lazar's machine

## Summary (plain language)

- **The homepage is now the full 8-section content page.** `src/app/(site)/page.tsx` renders, top→bottom: Hero (season team photo) → Intro (club description) → Featured season („Сезона 1992/93" + story teaser) → **Decades timeline** (1920-ти→2020-ти, 1990-ти highlighted) → Legends → **Moment band** (full-bleed 1993 cup photo) → Gallery (8 photos) → **Explore grid** (4 nav cards) → Footer. All from **live published Sanity content** via the read client (ISR `revalidate = 60`). Three sections are new this phase (D-1.05.2-3); the page is ~35% taller on desktop (more on mobile).
- **Legend portraits now render — no new content was needed.** The 1.06 snapshot concluded the portraits were a content gap needing Ace-owned uploads; that was a **misdiagnosis** (see D-1.05.2-2). The portraits for **Васо Цветков and Панче Пантазиев are already linked** via `photo.relatedPerson`; the old query just read the nonexistent `person.photos`. The rewritten `HOME_QUERY` (D-1.05.2-1) reads photos by **back-reference** (`relatedSeason`/`relatedPerson`), so both player portraits render with the real linked images. Legends is now filtered to **players only**, ordered by name; meta = role + `playingYears`.
- **Crest is on `main` and deploying.** PR #7 (`chore-crest-logo`, crest header/footer logo + favicon, D-crest-1) is **merged** to `origin/main`; PR #8 (`phase-1.06-verification`, the 1.06 docs/state) is **merged** too. This phase (1.05.2) stacks on both and ships via **PR #9** (`phase-1.05.2-homepage-content-sync`). Once #9 merges, production shows the crest + the full 8-section homepage.
- **Published demo content (live `production` dataset):** `siteSettings` (title „ФК Беласица" + full description); **1 season** „Сезона 1992/93" (decade 1990, 2 related photos); **5 persons** (Васо Цветков, Панче Пантазиев = players with `playingYears` + linked portraits; Петар Андреев = president with a linked portrait; Гоце Петровски, Илија Андреев = trainers); **8 photos** (all with `image` + `provenance`; 3 linked to a person, 2 to the season).
- **Lighthouse baseline (1.06, homepage, v13.4.0):** Mobile Perf 93 · A11y 100 · BP 96 · SEO 100 (LCP 3.2s driver). Desktop Perf 99 · A11y 100 · BP 96 · SEO 100. Baseline only — the ≥95 gate is Phase 3.02. *Re-baseline after 1.05.2 (three more sections / images) if it matters for the demo.*
- **Ace demo kit** at `docs/ace-demo/` (from 1.06): `walkthrough.md` (Macedonian demo script incl. the OV-3 footer question), `feedback.md` (capture template), `screenshots/homepage-{desktop,mobile}.png` (retake after 1.05.2 deploys — the page has three new sections + real portraits now).
- OV-2 resolved (wordmark **ФК Беласица** VERIFIED). **OV-3** (exact footer wording) stays open — to be resolved at the Ace sit-down.
- Stubbed / not wired: the Archive, Legends, Statistics, About, Contact pages (Part 2) — nav links (incl. the new timeline/explore links to `/arhiva`, `/legendi`, `/statistika`, `/za-nas`) 404 by design. No contact form, domain, or OG-image work yet.
- Current phase: **1.05.2 — homepage content-sync** (this PR). Remaining Part-1 human work is the **Ace sit-down + OV-3** (1.06 close), then **2.01**.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). **No dependencies added or changed in 1.05.2** — reuses 1.03–1.05 (`next-sanity`/`@sanity/image-url` reads, `lucide-react` for the arrow icons). Reveal = CSS + IntersectionObserver (no new lib). Unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/image-url` 2.1.1, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, shadcn/ui (neutral base, repointed to brand).

## Built pages / components

- `src/app/layout.tsx` — bare root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, `<Analytics/>`, site metadata, crest favicon set (`icon.png`/`apple-icon.png`/`favicon.ico`, on main via PR #7).
- `src/app/(site)/layout.tsx` — site chrome: pre-paint `.js` flag script (D-1.05-5) + skip link + `SiteHeader` + `<main>` + `SiteFooter`.
- `src/app/(site)/page.tsx` — **the homepage**: 8 sections from live Sanity content; `HOME_QUERY` reconciled to the live model (photos via `relatedSeason`/`relatedPerson` back-refs; legends = players); graceful placeholders; ISR `revalidate = 60` (Phase 1.05 + 1.05.2, D-1.05.2-1..3).
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio`.
- `src/components/home/` — `PlaceholderChip`, `PhotoFrame` (matted frame + `next/image`), `Reveal` (scroll reveal), `SectionOverline`, **`DecadeTimeline`** (new, 1.05.2). Reusable in Part 2.
- `src/components/` — `SiteHeader.tsx`, `SiteFooter.tsx` (crest logo beside the wordmark; white tile on the navy header — D-crest-1, on main), `Container.tsx`; plus `fonts.ts`, `lib/nav.ts`, `lib/utils.ts`. `globals.css` has the reveal + placeholder-hatch utilities.
- `src/sanity/env.ts` · `client.ts` · `image.ts` · `structure.ts` — connection, read client, image builder, Studio desk structure.
- `src/sanity/schemaTypes/` — `index.ts` + `siteSettings`, `season`, `match`, `person`, `photo` (draft model; **locked until 2.01** — note the live content links photos via `photo.relatedSeason`/`relatedPerson`, not `season.photos`/`person.photos`; the read path uses the back-refs).
- `public/crest.png` — crest artwork (on main). `sanity.config.ts` / `sanity.cli.ts` (repo root) — Studio + CLI config.

## Integrations wired

- **Sanity** — wired and **serving real content**. Project **`belasica`** (id `f8rmnfry`), dataset **`production`**, **public-read, no token** (D-1.04-1/2) — verified this phase (no-token GROQ reads return the published docs). Homepage reads published content server-side (ISR 60s). `cdn.sanity.io/images/**` allowed for `next/image`. Env vars in `.env.local` (git-ignored) + Vercel (Prod + Preview): the three `NEXT_PUBLIC_SANITY_*` values, no token.
- **Vercel** — connected; production `https://belasica-v2.vercel.app` (D-0.00-6). `origin/main` now includes the crest (PR #7) + 1.06 docs (PR #8); the 8-section homepage lands when **PR #9** merges. Preview deploy per PR (public, D-1.01-5); Deployment Protection off. PRs this stretch: [#7](https://github.com/DinovLazar/belasica-v2/pull/7) crest (merged), [#8](https://github.com/DinovLazar/belasica-v2/pull/8) 1.06 (merged), #9 1.05.2 (this).
- Vercel Web Analytics — `<Analytics/>` in root layout (cookieless).
- Claude Code GitHub Action — **not installed** (D-1.01-4); Part-1 review-gate item **formally waived** (D-1.06-1). The Vercel PR preview is the one automated safety rail.

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (1):**

- **OV-3** · Exact Macedonian wording of the footer unofficial-archive statement (role VERIFIED, wording UNVERIFIED per `facts.md`). **Plan:** resolve at the Ace sit-down — the walkthrough asks Ace to confirm/correct it. Current live wording: label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот." *If Ace confirms/corrects:* mark VERIFIED in `facts.md`, move to Resolved; a wording change ships via a **separate Code PR** (`SiteFooter.tsx` + `siteSettings`).

**Resolved**

- **OV-2** · Cyrillic wordmark **ФК Беласица**. Resolved 2026-07-15 — owner confirmed spelling (chat); VERIFIED in `facts.md`.
- OV-1 · Photo publishing rights (P0.2). Resolved 2026-07-14 — Ace confirmed he holds the rights.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Status / Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 | Open — clears 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 | Open — clears 3.04 |
| PL-5 | Intro description (`siteSettings.description`) | Почетна | 2026-07-15 | **CLEARED** — description published + rendering |
| PL-6 | Featured season (image, title, story) | Почетна | 2026-07-15 | **CLEARED** — „Сезона 1992/93" rendering |
| PL-7 | Legend portraits | Почетна | 2026-07-15 | **CLEARED 1.05.2** — the read path (`relatedPerson`) now renders the linked portraits for both players shown (Васо, Панче); no content step was needed. See D-1.05.2-2. |
| PL-8 | Gallery photos | Почетна | 2026-07-15 | **CLEARED** — 8 photos rendering |

> **No `[PLACEHOLDER]` chip is visible on `/` for the current data.** PL-5/6/7/8 all clear on the 1.05.2 homepage. (A player without `playingYears` would show a small placeholder for the *years only* — not the case for the current two. Hero H1 falls back to the verified wordmark `ФК Беласица`, not a placeholder.) PL-1..PL-4 are left as-is with their Part 2/3 clearing phases.

## Carryovers

- **[DONE] Load + publish demo content** in `/studio` — done (15 published docs; homepage renders them).
- **[DONE] Register the Studio host** — not relevant; the homepage read is server-side (no CORS).

## Remaining human steps (to close Part 1 — Lazar)

1. **Run the Ace sit-down.** Walk `docs/ace-demo/walkthrough.md` on the live site (after PR #9 deploys); capture Ace's words into `docs/ace-demo/feedback.md`. Ask him to confirm the footer wording (**OV-3**) and flag anything factually wrong. Phases 2.02 & 2.05 read `feedback.md` before they open.
2. **Resolve OV-3** from Ace's answer: mark the footer wording VERIFIED in `facts.md` (move OV-3 to Resolved). A correction ships via a **separate Code PR**.
3. **Re-take the demo screenshots** (`docs/ace-demo/screenshots/`) after PR #9 deploys — the page now has the three new sections + real portraits + the crest. Confirm no `[PLACEHOLDER]` chip anywhere on `/`.
4. *(Optional)* **Add the remaining portraits** (Петар Андреев renders on `/legendi` later; Гоце/Илија are trainers, excluded from Legends) — not needed for the homepage demo, which is placeholder-free as-is.
5. **Close 1.06 + set NEXT → `2.01 — Content model lock`** once the sit-down is done and OV-3 is resolved.

## Known issues

- **Crest club-blue vs. locked navy.** The crest's blue samples at ≈ **`#125C9A`**, brighter than the locked navy **`#12294F`** (D-crest-1). Palette **unchanged** (logo/favicon only). A future owner-gated palette refinement should use `#125C9A` as the crest blue but keep a **dark navy for text/links** (a brighter blue risks failing WCAG AA on paper, where navy passes at ~13:1).
- **Pre-existing hydration warning (dev only):** the `.js` class added to `<html>` by the reveal pre-paint script (D-1.05-5) produces a React hydration-attribute warning in dev. Benign, predates 1.05.2 (main/crest show it too); a future fix is `suppressHydrationWarning` on `<html>` or setting the flag differently. Not a runtime bug.
- **"Empty homepage" (1.06 phase-open blocker) — RESOLVED.** Stale ISR/CDN caching of the pre-content-load state; self-healed on revalidation. Env correct. See D-1.06-2. If it recurs after a content change, check ISR/CDN staleness first (wait ~2 min or redeploy), not env.
- **Lighthouse mobile Perf 93 / BP 96** — under the ≥95 gate on two metrics; **baseline only**, fixes are 3.02. Re-baseline after 1.05.2 if the demo needs it.
- **`@sanity/image-url` deprecation warning at build** — benign, pre-existing (`src/sanity/image.ts`).
- **Studio pinned to 4.x** for Next 15 (D-1.04-4); Next 16 later unlocks sanity 6 / next-sanity 13.
- The Phase 1.02 design handover + mockups were delivered in-prompt and are still **not** in `docs/design-handovers/`. Flagged for the orchestrator.

## What's now possible

- The homepage is a real, populated, placeholder-free 8-section content page ready for the Ace demo. The home components (`PlaceholderChip`, `PhotoFrame`, `Reveal`, `SectionOverline`, `DecadeTimeline`) and the reveal/placeholder CSS are reusable by the Part 2 content pages; the `relatedSeason`/`relatedPerson` back-reference read pattern is the template for the season/person pages.
- **Phase 2.02 (Archive & Season templates) and Phase 2.05 (People & pages) MUST read `docs/ace-demo/feedback.md` before they open** — it carries Ace's homepage reaction and his asks for the Part 2 pages.
