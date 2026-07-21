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

## 2026-07-15 — Phase 1.04 Sanity setup: dependency additions (exact pins)

Runtime dependencies added (`package.json` → `dependencies`, all exact — no caret/tilde), installed with `--save-exact`:

| Package | Version | Role |
|---|---|---|
| sanity | 4.22.0 | Sanity Studio (embedded at `/studio`) |
| next-sanity | 11.6.13 | Next.js ↔ Sanity client + Studio helpers (`NextStudio`) |
| @sanity/vision | 4.22.0 | GROQ playground plugin (Studio) |
| @sanity/image-url | 2.1.1 | image-URL builder for `next/image` |
| @portabletext/react | 6.2.0 | renders `season.story` (Portable Text) on the Season page — **added Phase 2.03** (D-2.03-2) |
| styled-components | 6.4.3 | Studio peer dependency |

**Phase 2.03 — `@portabletext/react` 6.2.0 added (D-2.03-2).** The only dependency change in 2.03. It was already resolved in the tree as a transitive dependency of `sanity`, so declaring it added **one line** to `package-lock.json` and no new packages to the install; it is now pinned and upgraded deliberately rather than riding along with `sanity`. Needed by `src/components/archive/SeasonStory.tsx` for handover §6.3 (paragraphs, h2/h3, lists, blockquote, links, strong/em).

Transitive (not pinned directly; noted for reference): `@portabletext/types` (comes with `@portabletext/react`; used for the `PortableTextBlock` type); `@sanity/client` 7.23.1 (satisfies `next-sanity` peer `^7.13.2`); `sharp` 0.34.5 (image optimization, pulled by the toolchain).

Version-selection rationale (see D-1.04-4 in `decisions.md`):
- **Next 15 constraint.** The stack is pinned to Next.js **15.5.20** (D-1.01-1, the newest 15.x). `next-sanity` 12.x/13.x peer-require `next ^16`; only the **11.x** line supports Next 15 (`11.6.13` peers `next ^15.1.0-0 || ^16.0.0-0`).
- **React 19.2 constraint.** `sanity`/`@sanity/vision` **5.x** peer `react ^19.2.2` and import React 19.2's `useEffectEvent`. Next 15.5.20 bundles a pre-19.2 React for the App Router client graph, so a `sanity@5` build fails: `'useEffectEvent' is not exported from 'react'` (even though the app's own react is 19.2.4). `sanity@4.22.0` peers `react ^18 || ^19`, so the Studio pins to the **4.22.0** line. `next-sanity@11.6.13` peers `sanity ^4.22.0 || ^5` → this set resolves with **no** `--legacy-peer-deps`.

Config / env:
- `.env.local` (git-ignored via `.env*`): `NEXT_PUBLIC_SANITY_PROJECT_ID=f8rmnfry`, `NEXT_PUBLIC_SANITY_DATASET=production`, `NEXT_PUBLIC_SANITY_API_VERSION=2026-07-15`. Same non-secret values must be set on Vercel (Production + Preview). No token anywhere (public dataset, D-1.04-2).
- `apiVersion` pinned to `2026-07-15` in `src/sanity/env.ts` (overridable via env).
- `next.config.ts`: `images.remotePatterns` now allows `https://cdn.sanity.io/images/**` for `next/image`.
- Sanity project: existing **`belasica`** (id `f8rmnfry`), dataset `production`, public-read (D-1.04-1). CORS origins (credentials) on the project: `http://localhost:3000`, `https://belasica-v2.vercel.app` (+ the PR preview URL, added after deploy).
- `npm run build` and `npm run lint` exit 0 on this stack.

## 2026-07-18 — Phase 2.09 content ingestion: dev dependency added (exact pin)

Dev dependency added (`package.json` → `devDependencies`, exact — no caret/tilde), installed with `--save-dev --save-exact`:

| Package | Version | Role |
|---|---|---|
| @sanity/client | 7.23.1 | Write client for the Phase 2.09 ingestion script (`scripts/ingest/`) — build-time/local only, never in the site runtime |

**Phase 2.09 — `@sanity/client` 7.23.1 added as a devDependency (D-2.09-5).** The only dependency change in 2.09, and the one the brief permits. It was **already resolved in the tree at 7.23.1** as a transitive of `next-sanity`, so pinning it as a direct devDependency dedupes with that copy and added **one line** to `package-lock.json` and no new packages to the install. Pinned to **7.23.1** (the resolved version) rather than npm-latest **7.23.2** to avoid a second resolved version for a one-patch gain. A pre-existing nested `@sanity/client@6.29.1` under `@sanity/mutate` (a transitive of `@sanity/visual-editing` → `next-sanity`) is unrelated and unchanged.

- Used only by `scripts/ingest/run.mjs` (plain Node ESM, no TypeScript, no build step). The **site itself stays token-free** (D-1.04-2): `@sanity/client` here is a *devDependency* and the write token lives only in `.env.local` (git-ignored), never in the site bundle or on Vercel.
- New env var (SECRET, local only): `SANITY_API_WRITE_TOKEN` — Sanity token with Editor on `production`, read by the ingestion script's `--commit` mode. Documented (empty) in `.env.example`; **not** set in `.env.local` or Vercel this phase (the ingestion waves have not run — see D-2.09-3). Never `NEXT_PUBLIC`, never committed.
- `npm run build` and `npm run lint` exit 0 on this stack (the script is not part of the Next build graph).

## 2026-07-21 — Phase 3.01 content model update: schema change (NO dependency change)

**No npm dependency was added, upgraded, or removed this phase.** Stack unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/vision` 4.22.0, `@sanity/image-url` 2.1.1, `@portabletext/react` 6.2.0, `@vercel/analytics` 2.0.1, `@sanity/client` 7.23.1 (dev). Recorded here per the append-only rule because the phase changed the deployed **schema/config**, which this log also tracks.

Schema / Studio changes (Part 3, D-3.01-1..7 — additive & optional; model re-opened after the 2.01 lock, re-locks after 3.06):
- `season` gained five **optional** fields (Studio order, immediately after `story`): `teamPhoto` + `tablePhoto` (`reference → photo`, `options.filter` scopes the picker to the same season), `trainer` (string), `lineupAndStats` + `results` (portable text, same `block` config as `story`). Legacy `finalTable`/`squad`/`trainers` are unchanged in shape (descriptions marked legacy).
- New document type `clubRecord` (`label` req, `value` req, `category` radio, `order`), registered in `schemaTypes/index.ts`, exposed in `structure.ts` as „Клупски рекорди".
- **Schema deployed to the Content Lake:** `npx sanity schema deploy --workspace belasica-v2` → `_.schemas.belasica-v2` (project `f8rmnfry`, dataset `production`). Always the `belasica-v2` workspace, **never** the stray Studio-deployed `default` (D-2.01-8). The embedded `/studio` bundles its schema from code, so it reflects the change on the next Vercel deploy; the deployed manifest is for tooling (schema-aware MCP / typegen).
- The reference `options.filter` is a **function** (`({ document }) => …`), so it is **not** serialized into the deployed tooling manifest — it runs only in the code-bundled Studio at edit time. It compiled cleanly on `sanity@4.22.0`; the brief's unfiltered fallback was **not** needed.
- `.env` / tokens: no change; no new env var; the site stays token-free.
- `npm run build` (115 pages) and `npm run lint` exit 0 on this stack.
