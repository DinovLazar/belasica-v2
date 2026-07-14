# file-map.md — Belasica-V2

> Location in repo: `src/_project-state/file-map.md`. Every meaningful file/folder, one line each: what it's for. Updated by the executor on **every** add, rename, or delete — a stale map lies. Real tree as of Phase 1.03 (node_modules, .next, and other gitignored paths omitted).

## Docs & rules (repo root)
- `CLAUDE.md` — Code's standing rules (behavioral contract; under 150 lines)
- `README.md` — public-facing repo overview; "unofficial archive" disclaimer; stack + layout
- `facts.md` — verified business facts; the only legal source for factual claims on the site
- `brand.md` — design tokens + brand rules; the only token source (confirmed 1.02 tokens written back in Phase 1.03; zero SEED)
- `briefs/` — every phase brief, saved by Lazar; versioned instruction history (`.gitkeep` placeholder — the Phase 1.01 brief was not filed per owner decision, D-1.01-3)
- `docs/design-handovers/` — Design's handover files; Code reads the matching one before any UI work (`.gitkeep` placeholder; first handover lands in Phase 1.02)

## Project state (`src/_project-state/`)
- `current-state.md` — live repo snapshot; NEXT line; owed-verification + placeholder registers
- `file-map.md` — this file
- `00_stack-and-config.md` — append-only stack/config log with exact pinned versions
- `decisions.md` — append-only decision log, IDs `D-<phase>-<n>`
- `completions/_TEMPLATE.md` — completion-report template
- `completions/Part-1-Phase-01-Completion.md` — Phase 1.01 completion report

## Application (`src/`)
- `src/app/layout.tsx` — root layout: `lang="mk"`, fonts, Paper surface, skip link, header/footer shell, Vercel Analytics, site metadata (Phase 1.03)
- `src/app/page.tsx` — minimal in-shell placeholder home (real homepage in Phase 1.05)
- `src/app/fonts.ts` — Inter + Source Serif 4 via `next/font/google`, Cyrillic subsets (Phase 1.03)
- `src/app/globals.css` — Tailwind 4 `@theme` driven by brand.md tokens; reduced-motion baseline; shadcn semantics repointed to brand; light-only (Phase 1.03)
- `src/app/favicon.ico` — default favicon (placeholder)
- `src/components/SiteHeader.tsx` — navy header/nav; client component; active-state + accessible mobile menu (Phase 1.03)
- `src/components/SiteFooter.tsx` — light footer; wordmark, nav links, mandatory unofficial-archive lines (Phase 1.03)
- `src/components/Container.tsx` — max-width (1200px) + page-gutter layout primitive (Phase 1.03)
- `src/lib/nav.ts` — single source for nav items + `isActivePath()` (Phase 1.03)
- `src/lib/utils.ts` — shadcn `cn()` class-merge helper
- `src/sanity/` — Sanity schemas, client, queries (created in Phase 1.04)

## Build & tooling config (repo root)
- `package.json` / `package-lock.json` — dependencies, all pinned exact; scripts (dev/build/start/lint)
- `tsconfig.json` — TypeScript config; `@/*` path alias
- `next.config.ts` — Next.js config (default)
- `eslint.config.mjs` — ESLint flat config (Next 15 `FlatCompat`: next/core-web-vitals + next/typescript)
- `postcss.config.mjs` — PostCSS config (`@tailwindcss/postcss`)
- `components.json` — shadcn/ui config (style new-york, base color neutral, Lucide icons)
- `public/*.svg` — create-next-app default static assets (next/vercel/file/globe/window)

## Not present (deliberately)
- `.github/workflows/` — no CI/review workflow; the Claude review Action was dropped for this project (D-1.01-4)
