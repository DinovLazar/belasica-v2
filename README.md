# belasica-v2

The unofficial digital archive of FK Belasica — a Macedonian-language, informational record of the club's history.

This is not the official website of FK Belasica and is not affiliated with the club.

## Stack

Next.js (App Router, static rendering) · TypeScript · Tailwind CSS · shadcn/ui · Sanity · Vercel.

Exact pinned versions: `src/_project-state/00_stack-and-config.md`.

## Local development

Requires Node 20 LTS or newer.

```zsh
npm install
npm run dev
```

## How this repo is organised

| Path | What's in it |
|---|---|
| `briefs/` | The instruction file for each phase of work |
| `docs/design-handovers/` | Design specifications the UI is built from |
| `src/_project-state/` | Live project state: what exists, what's decided, what shipped |
| `facts.md` | The only source for factual claims made on the site |
| `brand.md` | The only source of design tokens |
| `CLAUDE.md` | Standing rules for automated contributors |

Work happens on `phase-X.YY-<slug>` branches and reaches `main` through a reviewed pull request.
