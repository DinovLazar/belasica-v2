NEXT: 1.04 — Sanity setup + demo content

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-14 · by Code (Phase 1.03 — layout shell) on Lazar's machine

## Summary (plain language)

- Works now: every route renders inside the real site shell — a navy header with the serif **ФК Беласица** wordmark and a six-item Cyrillic nav (default / hover / active / focus states, plus an accessible mobile disclosure menu), a light footer carrying the mandatory **неофицијална архива** line and the "not the official club site" statement, the Paper surface, a 1200px container with 40/20px gutters, and the two self-hosted Cyrillic fonts (Source Serif 4 for display, Inter for body/UI). All brand tokens are wired into the Tailwind 4 theme — `brand.md` is the single source; no hardcoded hex/font/spacing in components. Vercel Web Analytics is mounted (cookieless). `prefers-reduced-motion` disables transitions. `npm run build` and `npm run lint` both pass.
- Design system: `brand.md` now holds the confirmed Phase 1.02 tokens (zero SEED markers). P0.3 (club colors) is resolved (D-0.00-12); the 1.02 design handover was delivered to Code in-prompt (see Known issues — it was never written to `docs/design-handovers/`).
- Stubbed / not wired: the home page is a minimal placeholder (one heading + one line; the real homepage is Phase 1.05). Nav links point to `/arhiva`, `/legendi`, `/statistika`, `/za-nas`, `/kontakt` — those routes **404 until built** in later phases. No Sanity/CMS, no real content, no contact form, no domain, no favicon/OG work yet.
- Current phase: 1.03 — Layout shell, closing via pull request `phase-1.03-layout-shell` → `main`.
- Next: Phase 1.04 — Sanity setup + demo content.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). Added this phase: `@vercel/analytics` 2.0.1 and two `next/font/google` families (Inter, Source Serif 4). Otherwise unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, shadcn/ui (neutral base — semantic tokens now repointed to the brand palette), Motion 12.42.2, Lucide 1.24.0.

## Built pages / components

- `src/app/layout.tsx` — root layout: `lang="mk"`, fonts applied, Paper surface, skip-to-content link, `SiteHeader` + `<main>` + `SiteFooter`, `<Analytics/>`, site metadata (title template + unofficial-archive description).
- `src/app/page.tsx` — minimal in-shell placeholder home (real homepage is 1.05).
- `src/app/fonts.ts` — Inter + Source Serif 4 via `next/font/google`, `["latin","cyrillic"]` subsets, brand weights.
- `src/app/globals.css` — Tailwind 4 `@theme` driven by `brand.md` tokens (colors, faces, type scale, tracking, container widths, radii); reduced-motion baseline; shadcn semantics repointed to brand; single light theme.
- `src/components/SiteHeader.tsx` — navy header/nav (client component; `usePathname` active state; accessible mobile disclosure menu).
- `src/components/SiteFooter.tsx` — light footer: serif wordmark, nav links, mandatory unofficial-archive lines.
- `src/components/Container.tsx` — max-width (1200px) + page-gutter primitive, used across the shell.
- `src/lib/nav.ts` — single source for nav items + `isActivePath()`.
- `src/lib/utils.ts` — shadcn `cn()` helper (unchanged).

## Integrations wired

- Vercel — connected to the repo; production deploy on `main`, preview deploy + preview URL on every pull request. Previews public (Deployment Protection disabled, D-1.01-5). Production: https://belasica-v2.vercel.app (D-0.00-6).
- Vercel Web Analytics — `@vercel/analytics` `<Analytics/>` mounted in the root layout (cookieless). Data populates once deployed on Vercel; nothing to verify locally beyond the component mounting.
- Sanity — not yet wired (Phase 1.04).
- Claude Code GitHub Action — **not installed** (dropped by owner, D-1.01-4).
- (Sequence for the rest: `Belasica-V2-Plan.md` §8.)

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (2):**

- **OV-2** · Exact Cyrillic wordmark spelling **ФК Беласица**. Design LOCKED this spelling in 1.02 and it now renders site-wide (header + footer); `facts.md` still marks the on-page Cyrillic wording UNVERIFIED. *How Lazar verifies:* confirm with Ace that `ФК Беласица` is the exact preferred spelling. If different, update `brand.md` §Site name and the strings in `SiteHeader.tsx` / `SiteFooter.tsx`.
- **OV-3** · Exact Macedonian wording of the footer unofficial-archive statement (currently: "Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот."). The *role* is VERIFIED; the exact *wording* is UNVERIFIED (`facts.md`). *How Lazar verifies:* confirm the phrasing with Ace; adjust `SiteFooter.tsx` if he prefers different wording. The short **неофицијална архива** line is the brief-mandated string and stays.

**Resolved**

- OV-1 · Photo publishing rights for Drive material (P0.2). Resolved 2026-07-14 — Ace confirmed (via Lazar) he holds the rights.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 (pre-build) | 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 (pre-build) | 3.04 |

No new placeholders in 1.03 — the shell renders only allowed nav labels, the wordmark, and the mandated footer archive lines.

## Carryovers

None.

## Known issues

- The Phase 1.02 design handover (`Part-1-Phase-02-Handover.md`) and the design mockup HTML were delivered to Code **in-prompt** and were never written to `docs/design-handovers/` (that folder still holds only `.gitkeep`). `brand.md` now carries the confirmed tokens, so downstream build work is unblocked — but the handover doc and mockups are not archived in the repo. Flagged for the orchestrator to file if an in-repo copy is wanted.
