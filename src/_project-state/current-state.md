NEXT: 1.06 — Verification + Ace demo

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-15 · by Code (Phase 1.05 — Homepage preview) on Lazar's machine

## Summary (plain language)

- Works now: the **real homepage** is built at `src/app/(site)/page.tsx` — five sections (hero, intro, featured season, legends, gallery) rendered from **live published Sanity content** via the read client (no token). Sanity photos render through `next/image` + `src/sanity/image.ts` in matted fixed-ratio frames. Reveal-on-scroll motion is within the brand budget and respects reduced-motion. `npm run build` and `npm run lint` both pass; `/` and `/studio` return 200. The temporary `/debug-sanity` route is **removed**.
- The dataset still reads **empty** (published `season`/`person`/`photo`/`siteSettings` counts are all 0 as of build time). By design, the homepage **degrades to registered `[PLACEHOLDER]` chips** for every section whose content is absent — it does not crash or invent filler. For a meaningful preview to show Ace, **Lazar publishes the demo content in `/studio`** (one season, 2–3 legends, ~10 photos, site settings) per §9 of the Phase 1.04 completion report, then re-opens the preview (ISR `revalidate = 60` → content appears within ~a minute, no redeploy). See Carryovers.
- Design archived: the homepage §Layout spec is written to `docs/design-handovers/Part-1-Phase-05-Homepage.md`. New home components live under `src/components/home/` (PlaceholderChip, PhotoFrame, Reveal, SectionOverline).
- OV-2 resolved: the on-page Cyrillic wordmark **ФК Беласица** is VERIFIED (owner, chat, 2026-07-15) in `facts.md`; moved to Resolved below. No component edit — the existing spelling was confirmed. **OV-3** (exact footer wording) stays open.
- Stubbed / not wired: the Archive, Legends, Statistics, About, Contact pages (Part 2) — nav links to them still 404, as expected. No contact form, domain, favicon/OG work yet.
- Current phase: 1.05 — Homepage preview, closing via pull request `phase-1.05-homepage` → `main`.
- Next: Phase 1.06 — Verification + Ace demo.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). **No dependencies added or changed in 1.05** — the homepage uses only what 1.01–1.04 installed (`next-sanity`/`@sanity/image-url` for reads, `lucide-react` for the one arrow icon). Reveal-on-scroll is CSS + IntersectionObserver (no new lib; `motion` remains available but unused here). Unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/image-url` 2.1.1, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, shadcn/ui (neutral base, repointed to brand).

## Built pages / components

- `src/app/layout.tsx` — bare root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, `<Analytics/>`, site metadata.
- `src/app/(site)/layout.tsx` — site chrome: **pre-paint `.js` flag script** (reveal progressive-enhancement, D-1.05-5) + skip link + `SiteHeader` + `<main>` + `SiteFooter`.
- `src/app/(site)/page.tsx` — **the homepage** (Phase 1.05): 5 sections from live Sanity content; graceful placeholders; ISR `revalidate = 60`.
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio`.
- `src/components/home/` — `PlaceholderChip`, `PhotoFrame` (matted frame + `next/image`), `Reveal` (scroll reveal), `SectionOverline` (Phase 1.05).
- `src/sanity/env.ts` · `client.ts` · `image.ts` · `structure.ts` — connection, read client, image builder, Studio desk structure.
- `src/sanity/schemaTypes/` — `index.ts` + `siteSettings`, `season`, `match`, `person`, `photo` (draft model; locked until 2.01).
- `sanity.config.ts` / `sanity.cli.ts` (repo root) — embedded Studio + CLI config.
- Unchanged: `SiteHeader.tsx`, `SiteFooter.tsx`, `Container.tsx`, `fonts.ts`, `lib/nav.ts`, `lib/utils.ts`. `globals.css` gained the reveal + placeholder-hatch utilities (1.05).

## Integrations wired

- **Sanity** — wired. Project **`belasica`** (id `f8rmnfry`), dataset **`production`**, **public-read, no token** (D-1.04-1/2). The homepage reads published content server-side (ISR 60s). `cdn.sanity.io/images/**` allowed for `next/image` in `next.config.ts`. Env vars set in `.env.local` (git-ignored) and on Vercel (Production + Preview): the three non-secret `NEXT_PUBLIC_SANITY_*` values, no token. The PR preview URL for `phase-1.05-homepage` must be added to Sanity CORS **only if** the Studio is opened on it (the homepage read needs no CORS — server-side, public dataset).
- Vercel — connected; production `https://belasica-v2.vercel.app` (D-0.00-6); preview deploy per PR (public, D-1.01-5).
- Vercel Web Analytics — `<Analytics/>` in root layout (cookieless).
- Claude Code GitHub Action — **not installed** (D-1.01-4).

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (1):**

- **OV-3** · Exact Macedonian wording of the footer unofficial-archive statement (role VERIFIED, wording UNVERIFIED per `facts.md`). *How Lazar verifies:* confirm phrasing with Ace; adjust `SiteFooter.tsx` (and `siteSettings.footerUnofficialArchiveText`). Entering the current shell text into Studio does **not** verify it — OV-3 stays open.

**Resolved**

- **OV-2** · Cyrillic wordmark **ФК Беласица**. Resolved 2026-07-15 — owner confirmed the existing spelling (chat). Marked VERIFIED in `facts.md`; the site-wide wordmark (header, footer, hero H1 fallback) is unchanged.
- OV-1 · Photo publishing rights (P0.2). Resolved 2026-07-14 — Ace confirmed he holds the rights.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 (pre-build) | 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 (pre-build) | 3.04 |
| PL-5 | Intro description (`siteSettings.description`) | Почетна | 2026-07-15 | Owner content load (publish `siteSettings`) |
| PL-6 | Featured season (image, title, story teaser) | Почетна | 2026-07-15 | Owner content load (publish a `season`) |
| PL-7 | Legends (person cards + portraits) | Почетна | 2026-07-15 | Owner content load (publish `person` docs) |
| PL-8 | Gallery photos | Почетна | 2026-07-15 | Owner content load (publish `photo` docs) |

> **PL-5..8 are content-load-conditional:** they render only while the `production` dataset lacks that content, and each disappears the moment Lazar publishes the matching demo content in `/studio`. They are not owed-to-Ace facts — the code is done; the content is the manual step below. (Hero H1 falls back to the verified wordmark `ФК Беласица`, not a placeholder.)

## Carryovers

> Tracked manual tasks owed by Lazar. Not blockers on the Code merge, but the meaningful 1.05/1.06 preview depends on the content load.

- **Register the Studio host** on the `phase-1.05-homepage` preview URL (first `/studio` visit shows Sanity's "Add development host" screen) — one-time, in Lazar's own logged-in browser. (Walkthrough §A in the Phase 1.04 completion report.)
- **Load + publish demo content** in `/studio`: `siteSettings` (title, description); one real season (title, slug, decade, story, and attach ~1–2 photos so the hero/featured images render); 2–3 legends (`person`, with a portrait photo each); ~10 photos with `provenance`. Only facts present in the Drive; leave unknowns empty (content-truth). Re-open the homepage preview after ~a minute (ISR) to see it populate. This is what turns the placeholder preview into the real page for the Ace demo (1.06).

## Known issues

- **Homepage preview reads empty until content is published.** Expected — the page degrades to PL-5..8 placeholders. Not a bug.
- **`@sanity/image-url` deprecation warning at build** ("Use the named export `createImageUrlBuilder`") — benign, originates in `src/sanity/image.ts` (a Phase 1.04 file the 1.05 brief said to reuse, not modify). Cosmetic; a one-line change to the named import can be folded into a future Sanity touch.
- **Studio pinned to 4.x** for Next 15 compatibility (D-1.04-4). A future Next 16 upgrade unlocks sanity 6 / next-sanity 13 — revisit together.
- The Phase 1.02 design handover + mockups were delivered in-prompt and are still **not** in `docs/design-handovers/` (carried from 1.03). The 1.05 homepage §Layout **is** now archived there. Flagged for the orchestrator.

## What's now possible

The homepage is the first real content page; the 1.06 verification/Ace-demo phase can run against it on the Vercel preview once Lazar loads the demo content. The home components (`PlaceholderChip`, `PhotoFrame`, `Reveal`, `SectionOverline`) and the reveal/placeholder CSS are reusable by the Part 2 content pages.
