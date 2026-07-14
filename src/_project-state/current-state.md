NEXT: 1.05 — Homepage preview

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-15 · by Code (Phase 1.04 — Sanity setup + demo content) on Lazar's machine

## Summary (plain language)

- Works now: the site has a real content system. **Sanity Studio is embedded at `/studio`** (deployed with the site — no separate Studio host), and the Next.js → Sanity **read connection is live and verified**. There are five draft schema types (`season`, `match`, `person`, `photo`, `siteSettings`). A temporary route at **`/debug-sanity`** proves the pipeline reads published content (it currently reports "no published seasons yet" because the dataset is empty — see below). `npm run build` and `npm run lint` both pass; `/`, `/studio`, and `/debug-sanity` all return 200 locally.
- The dataset is **empty** — the Code half is done, but the demo content (one season, 2–3 legends, ~10 photos, `siteSettings`) is **owed by Lazar** via `/studio` (see Carryovers + the walkthrough in the completion report). 1.05 needs real content present to build the homepage preview; if it isn't loaded, 1.05 renders registered `[PLACEHOLDER]`s.
- Structure change: the site chrome (header/footer/skip-link) moved from the root layout into a new `(site)` route group so the Studio renders full-screen without the site nav. The `SiteHeader`/`SiteFooter` components are untouched; the home page and shell render exactly as before (verified in-browser). See D-1.04-3.
- Stubbed / not wired: real content pages (homepage 1.05; archive/legends/stats/about in Part 2). Nav links still 404 until built. No contact form, domain, favicon/OG work yet.
- Current phase: 1.04 — Sanity setup, closing via pull request `phase-1.04-sanity-setup` → `main`.
- Next: Phase 1.05 — Homepage preview.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). Added this phase (all exact): `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/vision` 4.22.0, `@sanity/image-url` 2.1.1, `styled-components` 6.4.3. Studio pinned to the 4.22.0 line and next-sanity to 11.6.13 for **Next 15 compatibility** (sanity 5+/next-sanity 12+ require React 19.2 / Next 16 respectively — see D-1.04-4). Otherwise unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, shadcn/ui (neutral base, repointed to brand).

## Built pages / components

- `src/app/layout.tsx` — **bare** root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, `<Analytics/>`, site metadata. (Chrome relocated — D-1.04-3.)
- `src/app/(site)/layout.tsx` — site chrome: skip link + `SiteHeader` + `<main>` + `SiteFooter` (verbatim relocation).
- `src/app/(site)/page.tsx` — minimal placeholder home (real homepage is 1.05).
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio (`NextStudio`) at `/studio`.
- `src/app/debug-sanity/page.tsx` — ⚠️ TEMPORARY read-connection check; **remove/replace in 1.05**.
- `src/sanity/env.ts` · `client.ts` · `image.ts` · `structure.ts` — connection, read client, image builder, Studio desk structure (`siteSettings` singleton).
- `src/sanity/schemaTypes/` — `index.ts` + `siteSettings`, `season`, `match`, `person`, `photo` (draft model; locked in 2.01).
- `sanity.config.ts` / `sanity.cli.ts` (repo root) — embedded Studio + CLI config, wired via env vars.
- Unchanged from 1.03: `SiteHeader.tsx`, `SiteFooter.tsx`, `Container.tsx`, `fonts.ts`, `globals.css`, `lib/nav.ts`, `lib/utils.ts`.

## Integrations wired

- **Sanity** — wired. Project **`belasica`** (id `f8rmnfry`), dataset **`production`**, **public-read, no token** (D-1.04-1, D-1.04-2). The site reads published content server-side. `cdn.sanity.io/images/**` allowed for `next/image` in `next.config.ts`. CORS origins (credentials) on the project: `http://localhost:3000`, `https://belasica-v2.vercel.app`, and the PR preview alias `https://belasica-v2-git-phase-104-sanity-setup-dinovlazars-projects.vercel.app`. Env vars set in `.env.local` (git-ignored) **and on Vercel** (Production + Preview): the three non-secret `NEXT_PUBLIC_SANITY_*` values, no token. PR [#5](https://github.com/DinovLazar/belasica-v2/pull/5); preview verified (`/`, `/studio`, `/debug-sanity` all 200, read pipeline live).
- Vercel — connected; production `https://belasica-v2.vercel.app` (D-0.00-6); preview deploy per PR (public, D-1.01-5).
- Vercel Web Analytics — `<Analytics/>` in root layout (cookieless).
- Claude Code GitHub Action — **not installed** (D-1.01-4).

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (2):**

- **OV-2** · Exact Cyrillic wordmark spelling **ФК Беласица** (renders site-wide; `facts.md` flags the on-page Cyrillic wording UNVERIFIED). *How Lazar verifies:* confirm with Ace; if different, update `brand.md` §Site name + `SiteHeader.tsx`/`SiteFooter.tsx` (and, once entered, `siteSettings.title` in Studio).
- **OV-3** · Exact Macedonian wording of the footer unofficial-archive statement (role VERIFIED, wording UNVERIFIED per `facts.md`). *How Lazar verifies:* confirm phrasing with Ace; adjust `SiteFooter.tsx` (and `siteSettings.footerUnofficialArchiveText`). Entering the current shell text into Studio does **not** verify it — OV-3 stays open.

**Resolved**

- OV-1 · Photo publishing rights (P0.2). Resolved 2026-07-14 — Ace confirmed he holds the rights.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 (pre-build) | 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 (pre-build) | 3.04 |

No new visible placeholders in 1.04 (`/debug-sanity` is a temporary internal route, not a public page).

## Carryovers

> Tracked manual tasks owed by Lazar. Not blockers on the Code merge, but 1.05 depends on the content load.

- **Register the Studio host** on first `/studio` visit (Sanity 4.x shows a "Connect this studio" screen): "Register this studio" for the production URL, "Add development host" for localhost/preview. One-time per host, done in Lazar's own logged-in browser. (Walkthrough §A in the completion report.)
- **Load demo content** in `/studio` and **publish**: `siteSettings` once; one real season (story, final table, squad, trainers); 2–3 legends; ~10 photos with `provenance`. Only facts present in the Drive; leave unknowns empty (content-truth). Confirm via `/debug-sanity`. (Walkthrough §B.)

Done by the executor this phase (no longer owed): Vercel env vars (Production + Preview) are set; CORS origins added for localhost, production, and the PR preview; preview deploy verified (200 on `/`, `/studio`, `/debug-sanity`).

## Known issues

- **Studio 4.x, not latest 5.x.** Pinned back for Next 15 compatibility (D-1.04-4). A future Next 16 upgrade unlocks sanity 6 / next-sanity 13 — revisit together.
- **`/debug-sanity` is temporary.** Delete or replace it in 1.05; it is unstyled and unlinked.
- The Phase 1.02 design handover + mockups were delivered in-prompt and are still **not** in `docs/design-handovers/` (carried from 1.03). Flagged for the orchestrator.

## What's now possible

Content pages (starting with the 1.05 homepage preview) can query real published Sanity content and render Sanity images via `next/image`, once Lazar loads the demo content.
