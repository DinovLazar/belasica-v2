NEXT: 1.02 — Design system

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-14 · by Claude Code (Lazar's Mac), closing Phase 1.01

## Summary (plain language)

- Works now: the Next.js 15 + TypeScript + Tailwind 4 + shadcn/ui skeleton builds, lints, and serves the default starter page. Every dependency is pinned to an exact version. The repo is public; `main` is protected (pull request required, force-push and deletion blocked, conversation resolution required). Vercel is connected and produces a preview URL on every pull request.
- Stubbed / not wired: no real pages, layout, navigation, or footer (the default create-next-app page is untouched). No design tokens (brand.md is still all SEED). No fonts, no Sanity/CMS, no contact form, no analytics component, no domain.
- Not set up (owner decision): the Claude Code GitHub Action review gate was dropped for this project (D-1.01-4). Pull requests have no automated review; the Vercel preview is the one automated safety rail.
- Current phase: 1.01 — Scaffold, closing via pull request `phase-1.01-scaffold` → `main`.
- Next: Phase 1.02 — Design system. **Additionally gated on P0.3** — Lazar confirming the club colors (collected from Drive + web, outside this repo) — before Design begins.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins recorded for Phase 1.01). Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, shadcn/ui (neutral base), Motion 12.42.2, Lucide 1.24.0.

## Built pages / components

None beyond the create-next-app default page (`src/app/page.tsx`, untouched) and the shadcn `cn` helper (`src/lib/utils.ts`). `src/components/` has no components yet.

## Integrations wired

- Vercel — connected to the repo; production deploy on `main`, preview deploy + preview URL on every pull request. Preview deployments are public (Deployment Protection disabled, D-1.01-5). Production: https://belasica-v2.vercel.app (D-0.00-6.)
- Claude Code GitHub Action — **not installed** (dropped by owner, D-1.01-4).
- (Sequence for the rest: `Belasica-V2-Plan.md` §8.)

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

| # | Item | Owed since | Owed by | Blocker for |
|---|---|---|---|---|
| OV-1 | Photo publishing rights for Drive material — Ace confirms what he owns / has permission for (P0.2) | 2026-07-14 | Ace via Lazar | Launch; publicly shipping any photo |

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 (pre-build) | 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 (pre-build) | 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 (pre-build) | 3.04 |

## Carryovers

None.

## Known issues

None.
