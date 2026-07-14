# 00_stack-and-config.md — Belasica-V2 (APPEND-ONLY)

> Location in repo: `src/_project-state/00_stack-and-config.md`. Append new dated entries; never rewrite past ones. Every dependency added or upgraded gets an entry with its **exact pinned version** (`next@15.x.y`, never `latest`, never caret-only). This is the canonical stack table — every other document links here.

## 2026-07-14 — Stack locked at planning (pre-scaffold; exact pins appended by Phase 1.01)

| Layer | Pick | Recurring cost |
|---|---|---|
| Framework | Next.js 15, App Router, static rendering | — |
| Language | TypeScript | — |
| Styling | Tailwind CSS 4 | — |
| UI primitives | shadcn/ui (owned in-repo, fully restyled per brand.md) | — |
| Animation | Motion (Framer Motion) | — |
| Icons | Lucide | — |
| Fonts | next/font, self-hosted, Cyrillic subsets | — |
| CMS | Sanity (free tier; upgrade to Growth ~$15/mo is a named decision pending P0.1 Drive audit) | $0 for now |
| Images | next/image + Sanity image CDN | — |
| Forms | Formspree free tier (wired 3.03) | $0 |
| Analytics | Vercel Web Analytics (cookieless) | in Vercel Pro |
| Hosting/DNS/CDN | Vercel Pro | $20/mo |
| Package manager | npm | — |
| i18n | none — single language, `lang="mk"` | — |

- Notes: total recurring cost at launch target: $20/mo. Sanity asset ceiling (10 GB free tier) is a tracked risk.
- Rule for Phase 1.01: append a new entry below with the exact pinned versions from `package.json` after scaffold. Do not edit this entry.

## 2026-07-14 — Phase 1.01 scaffold: exact pinned versions

Toolchain used to scaffold (Task 1 preflight, macOS):
- Node v26.3.0 · npm 11.16.0 · git 2.54.0 · gh 2.95.0

Runtime dependencies (`package.json` → `dependencies`, all exact — no caret/tilde):

| Package | Version |
|---|---|
| next | 15.5.20 |
| react | 19.2.4 |
| react-dom | 19.2.4 |
| motion | 12.42.2 |
| lucide-react | 1.24.0 |
| radix-ui | 1.6.2 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| tailwind-merge | 3.6.0 |

Dev dependencies (`package.json` → `devDependencies`, all exact — no caret/tilde):

| Package | Version |
|---|---|
| typescript | 5.9.3 |
| @types/node | 20.19.43 |
| @types/react | 19.2.17 |
| @types/react-dom | 19.2.3 |
| tailwindcss | 4.3.2 |
| @tailwindcss/postcss | 4.3.2 |
| eslint | 9.39.5 |
| eslint-config-next | 15.5.20 |
| @eslint/eslintrc | 3.3.6 |
| tw-animate-css | 1.4.0 |
| shadcn | 3.8.5 |

Notes / deviations from the planning-stage table above:
- **Next.js pinned to 15.5.20, not 16.** `create-next-app@latest` now defaults to Next 16; the brief and Definition of Done specify Next 15.x, so it was pinned back to the latest stable 15.x line. See D-1.01-1.
- **Tailwind CSS 4 confirmed (4.3.2).** `create-next-app` produced Tailwind 4 directly (`@tailwindcss/postcss`), so no v3→v4 upgrade was needed.
- **shadcn/ui initialized with the shadcn 3.8.5 CLI, base color `neutral`.** The current shadcn CLI (4.13.0) replaced the neutral base-color init with an opinionated theme-preset picker (Nova/Vega/…), which is a design decision reserved for Phase 1.02. The `shadcn` CLI is pinned in devDependencies at 3.8.5 so future `npx shadcn add` stays consistent with the init. See D-1.01-2.
- `@eslint/eslintrc` added as a direct devDependency: the Next 15 flat ESLint config uses `FlatCompat` from it (the Next-16-generated `eslint.config.mjs` imports were incompatible with `eslint-config-next@15`).
- `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, and `tw-animate-css` were added by `shadcn init`.
- **Claude Code GitHub Action review NOT installed** — dropped by owner decision for this project. No `CLAUDE_CODE_OAUTH_TOKEN` secret and no `.github/workflows/`. See D-1.01-3 / D-1.01-4.
- `npm run build` and `npm run lint` both exit 0 on this stack.

## 2026-07-14 — Phase 1.03 layout shell: dependency + font additions

Runtime dependency added (`package.json` → `dependencies`, exact — no caret/tilde):

| Package | Version |
|---|---|
| @vercel/analytics | 2.0.1 |

Fonts (self-hosted via `next/font/google`, not npm dependencies — no package to pin; the family + subsets + weights are the config that matters):

| Family | Import | Subsets | Weights |
|---|---|---|---|
| Inter | `next/font/google` → `Inter` | latin, cyrillic | 400, 500, 600, 700 |
| Source Serif 4 | `next/font/google` → `Source_Serif_4` | latin, cyrillic | 400, 600, 700 |

Notes:
- Installed with `--save-exact` (repo has no `.npmrc`; all deps are pinned exact by hand). `@vercel/analytics@2.0.1` exports a `./next` subpath used as `import { Analytics } from "@vercel/analytics/next"`.
- `next/font/google` downloads and self-hosts the font files at build time (13 `woff2` files produced); no font binaries are committed. See D-1.03-2. Build needs network to fonts.googleapis.com (Vercel has it).
- No other dependencies added. `npm run build` and `npm run lint` both exit 0 on this stack.
