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

## 2026-07-28 — Phase 3.05a direction exploration: seven exploration typefaces (NO npm dependency change)

**No npm dependency was added, upgraded, or removed this phase.** Stack unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/vision` 4.22.0, `@sanity/image-url` 2.1.1, `@portabletext/react` 6.2.0, `@vercel/analytics` 2.0.1, `@sanity/client` 7.23.1 (dev). Recorded here per the append-only rule because the phase adds **fonts**, which this log tracks as config (the 1.03 precedent: a `next/font/google` family is not an npm package, but its family + subsets + weights are the config that matters).

Fonts added — **exploration only**, loaded exclusively by the three `/predlog-*` routes and never by the live site:

| Variant | Family | Import | Subsets | Weights / styles | CSS variable |
|---|---|---|---|---|---|
| А | Playfair Display | `next/font/google` → `Playfair_Display` | latin, cyrillic | 700, 900 | `--font-pa-display` |
| А | PT Serif | → `PT_Serif` | latin, cyrillic | 400, 700 × normal, italic | `--font-pa-text` |
| А | PT Sans Narrow | → `PT_Sans_Narrow` | latin, cyrillic | 400, 700 | `--font-pa-agate` |
| Б | Cormorant Garamond | → `Cormorant_Garamond` | latin, cyrillic | 400, 600 | `--font-pb-display` |
| Б | Commissioner | → `Commissioner` | latin, cyrillic | 400, 500, 600 | `--font-pb-text` |
| В | Oswald | → `Oswald` | latin, cyrillic | 600, 700 | `--font-pc-display` |
| В | Golos Text | → `Golos_Text` | latin, cyrillic | 400, 700 | `--font-pc-text` |

Notes:
- **Declared per variant** (`src/app/(predlozi)/predlog-<x>/fonts.ts`), deliberately **not** in `src/app/fonts.ts`. The root layout loads that module for every route, so a face declared there would ship its `@font-face` CSS and preload hints to the live pages. `next/font` also attaches preloads at **module** granularity, so one shared module made every `/predlog-*` route preload 26 woff2 files; split, it is 18 / 8 / 8, with the live homepage unchanged at 4 (D-3.05a-3).
- **Cyrillic verified per face from the font's own `cmap`**, not from the Google subset declaration (D-3.05a-2): all 62 Macedonian letters (incl. Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ Џ џ) in the cyrillic subset, digits and „ “ ” — – · ( ) / . , : % in the latin subset.
- No `brand.md` token, no `globals.css` change, no schema change, no new env var. Variant tokens live in three route-scoped stylesheets (`predlog-<x>/<x>.css`) under `.pv-a` / `.pv-b` / `.pv-c` (D-3.05a-4).
- `npm run build` (120 pages — 117 + the three exploration routes) and `npm run lint` exit 0 on this stack. ⚠️ The build fails intermittently on a **random** season page from a Sanity CDN connect-timeout; pre-existing and unrelated to this phase — see D-3.05a-9.

## 2026-07-30 — Phase 3.05 „Трибина" adoption: display + body faces replaced site-wide (NO npm dependency change)

**No npm dependency was added, upgraded, or removed this phase.** Stack unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/vision` 4.22.0, `@sanity/image-url` 2.1.1, `@portabletext/react` 6.2.0, `@vercel/analytics` 2.0.1, `@sanity/client` 7.23.1 (dev). Recorded here per the append-only rule because the phase **replaces both site typefaces**, which this log tracks as config (the 1.03 precedent).

Fonts **removed** from the project (they were the live site's faces since 1.03):

| Family | Was | Notes |
|---|---|---|
| Inter | `--font-inter`, body/UI | Replaced by Golos Text |
| Source Serif 4 | `--font-source-serif`, display | Replaced by Oswald |

Fonts **added** to `src/app/fonts.ts` — now the live site's faces on every route:

| Role | Family | Import | Subsets | Weights | CSS variable | Tailwind |
|---|---|---|---|---|---|---|
| Display | Oswald | `next/font/google` → `Oswald` | latin, cyrillic | 600, 700 | `--font-oswald` | `font-display` |
| Body / UI | Golos Text | → `Golos_Text` | latin, cyrillic | 400, 700 | `--font-golos` | `font-sans` |

Fonts **removed with the `(predlozi)` group** (exploration-only, never on the live site): Playfair Display, PT Serif, PT Sans Narrow (А); Cormorant Garamond, Commissioner (Б). Oswald + Golos Text were promoted from `predlog-c/fonts.ts` into `src/app/fonts.ts` (D-3.05-9).

Notes:
- **Only two weights are fetched per face**, and every class in the tree was normalised to them: CSS font matching renders a requested 500 as 400 and a 600 as 700, so `font-medium` / `font-semibold` on body text described a weight nobody saw (D-3.05-7). `font-semibold` survives **only** in `SiteHeader`, on Oswald, where 600 is loaded. Neither face ships an italic, so the two `italic` blockquotes were dropped rather than left to synthesise an oblique on Cyrillic.
- **Cyrillic coverage** for both faces was verified at 3.05a from each font's own `cmap` rather than Google's subset declaration (D-3.05a-2) — all 62 Macedonian letters incl. Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ Џ џ.
- `--font-serif` **no longer exists** in `@theme`; the utility is `font-display` (D-3.05-2).
- `globals.css` `@theme` rewritten to the amended `brand.md` tokens: two navies (`navy` `#0D1F3C`, `navy-2` `#12294F`), `orange` `#EE7A16`, `ink` `#14161A`, `neutral-500` `#5E5C55`; a clamp-based type scale plus `--text-stat` / `--text-stat-lead` / `--text-wordmark`; `--spacing-section`; `--container-page` 1200 → **1248**; `--spacing-header` 77 → **78px** (re-measured on the rendered header); all three radius tokens → `0px`. The `--color-footer` token was **removed** with the light footer surface.
- **Maintenance duty unchanged and now larger:** every custom `--text-*` token must also be registered in `src/lib/utils.ts` with `tailwind-merge` or `cn()` silently drops it (D-3.04d-1). The list is now `display, h1, h2, h3, stat, stat-lead, wordmark, body-l, body, small, overline` + `tracking-overline`.
- `.u-focus` / `.u-focus--on-navy` are **deliberately unlayered** in `globals.css` — inside `@layer components` a `@layer utilities` rule in the vendored shadcn sheet silently disabled every focus ring on the site (D-3.05-4). Keep them out of `@layer`.
- No schema change, no Sanity write, no new env var; the site stays token-free.
- `npm run build` (96 season + 88 person + 8 static routes, all prerendered; the three `/predlog-*` routes are gone) and `npm run lint` exit 0 on this stack. ⚠️ The build still fails intermittently on a **random** season page from a Sanity CDN connect-timeout — pre-existing, reproduced again this phase, see D-3.05a-9.

## 2026-07-30 — Phase 3.02F-Code (build hardening + Клупски рекорди)

- **No dependency added, upgraded or removed.** `package.json` and `package-lock.json` are byte-identical to `main`. Versions unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/image-url` 2.1.1, `@portabletext/react` 6.2.0, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, `@sanity/client` 7.23.1 (dev).
- **One config change — `next.config.ts`:** added `experimental.staticGenerationRetryCount: 2` (D-3.02F-C-3). Next re-runs a page whose static generation failed; it is the second layer under the bounded-retry read helper in `src/sanity/fetch.ts`. Reason: the build now prerenders **270 pages** (96 seasons + 160 people + 14 static/route files) making ~540 Sanity reads, and a single `Connect Timeout Error` to `apicdn.sanity.io` failed the whole deploy (D-3.05a-9). Measured before/after: 3 retry attempts → 2 of 3 builds failed; 5 attempts → 1 of 3 failed; 5 attempts + this key → **3 of 3 clean while absorbing 125 transient read failures**.
- ⚠️ **`experimental.*` is not a stable API.** Re-check this key exists on any Next major upgrade (the pending Next 16 / sanity 6 / next-sanity 13 move noted at D-1.04-4). If it is removed or renamed, the read helper still stands on its own — the build simply loses its second layer.
- **No env var added or changed.** No `brand.md` token, no `globals.css` change, no schema change, no Sanity write.
