# file-map.md — Belasica-V2

> Location in repo: `src/_project-state/file-map.md`. Every meaningful file/folder, one line each: what it's for. Updated by the executor on **every** add, rename, or delete — a stale map lies. Seeded pre-repo; Phase 1.01 replaces the "created at scaffold" markers with the real tree.

- `CLAUDE.md` — Code's standing rules (behavioral contract; under 150 lines)
- `facts.md` — verified business facts; the only legal source for factual claims on the site
- `brand.md` — design tokens + brand rules; the only token source (filled in Phase 1.02)
- `briefs/` — every phase brief, saved by Lazar; versioned instruction history
- `docs/design-handovers/` — Design's handover files; Code reads the matching one before any UI work
- `src/_project-state/current-state.md` — live repo snapshot; NEXT line; owed-verification + placeholder registers
- `src/_project-state/file-map.md` — this file
- `src/_project-state/00_stack-and-config.md` — append-only stack/config log with exact pinned versions
- `src/_project-state/decisions.md` — append-only decision log, IDs `D-<phase>-<n>`
- `src/_project-state/completions/` — one completion report per phase (`Part-X-Phase-YY-Completion.md`); `_TEMPLATE.md` inside
- `src/app/` — Next.js App Router pages (created at scaffold, Phase 1.01)
- `src/components/` — UI components, PascalCase, one per file (created at scaffold)
- `src/sanity/` — Sanity schemas, client, queries (created in Phase 1.04)
