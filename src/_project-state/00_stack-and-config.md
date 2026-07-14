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
