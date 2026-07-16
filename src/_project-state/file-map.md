# file-map.md — Belasica-V2

> Location in repo: `src/_project-state/file-map.md`. Every meaningful file/folder, one line each: what it's for. Updated by the executor on **every** add, rename, or delete — a stale map lies. Real tree as of Phase 1.05 (node_modules, .next, and other gitignored paths omitted).

## Docs & rules (repo root)
- `CLAUDE.md` — Code's standing rules (behavioral contract; under 150 lines)
- `README.md` — public-facing repo overview; "unofficial archive" disclaimer; stack + layout
- `facts.md` — verified business facts; the only legal source for factual claims on the site
- `brand.md` — design tokens + brand rules; the only token source (confirmed 1.02 tokens written back in Phase 1.03; zero SEED)
- `briefs/` — every phase brief, saved by Lazar; versioned instruction history (`.gitkeep` placeholder — the Phase 1.01 brief was not filed per owner decision, D-1.01-3)
- `docs/design-handovers/` — Design's handover files; Code reads the matching one before any UI work
  - `Part-1-Phase-05-Homepage.md` — homepage §Layout spec, archived in-repo (Phase 1.05)
- `docs/ace-demo/` — Ace demo kit (Phase 1.06); Phases 2.02 & 2.05 read `feedback.md` before they open
  - `walkthrough.md` — demo script (spoken lines in Macedonian; incl. the OV-3 footer question)
  - `feedback.md` — capture template for Ace's feedback (**still the empty template** — the sit-down had not happened as of 2.01; D-2.01-7)
  - `screenshots/homepage-desktop.png` · `homepage-mobile.png` — full-page live-site captures (current state; retake after portraits load)
- `docs/content-ingestion-plan.md` — **how the ~915 photos / ~74 seasons get into Sanity** (Phase 2.01, D-2.01-4): the hybrid approach (scripted shells+assets / manual editorial), the deterministic Drive-folder→season mapping rules, the by-decade wave plan, and the provisional-provenance / P0.2-rights gate. Phase 2.09 builds and runs against this.

## Project state (`src/_project-state/`)
- `current-state.md` — live repo snapshot; NEXT line; owed-verification + placeholder registers
- `file-map.md` — this file
- `00_stack-and-config.md` — append-only stack/config log with exact pinned versions
- `decisions.md` — append-only decision log, IDs `D-<phase>-<n>`
- `completions/_TEMPLATE.md` — completion-report template
- `completions/Part-1-Phase-01-Completion.md` — Phase 1.01 completion report
- `completions/Part-1-Phase-03-Completion.md` — Phase 1.03 completion report
- `completions/Part-1-Phase-04-Completion.md` — Phase 1.04 completion report
- `completions/Part-1-Phase-05-Completion.md` — Phase 1.05 completion report
- `completions/Part-1-Phase-05-2-Completion.md` — Phase 1.05.2 completion report (homepage content-sync)
- `completions/Part-1-Phase-06-Completion.md` — Phase 1.06 completion report (draft — pending the Ace sit-down + portraits before close)
- `completions/Part-2-Phase-01-Completion.md` — Phase 2.01 completion report (content model lock)

## Application (`src/`)
- `src/app/layout.tsx` — **bare** root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, Vercel Analytics, site metadata. Site chrome moved to the `(site)` group so `/studio` can escape it (Phase 1.04, D-1.04-3)
- `src/app/(site)/layout.tsx` — public-site chrome: pre-paint `.js` flag script + skip link + `SiteHeader` + `<main>` + `SiteFooter` (relocated verbatim from root layout in 1.04; `.js` script added 1.05 for the reveal progressive-enhancement, D-1.05-5)
- `src/app/(site)/page.tsx` — **the homepage**: 8 sections (hero, intro, featured, decades timeline, legends, moment band, gallery, explore grid) from live published Sanity content via the read client; graceful placeholders when empty; ISR `revalidate = 60`. `HOME_QUERY` reconciled to the live model (photos via `relatedSeason`/`relatedPerson` back-refs); legends filtered to players (Phase 1.05; content-synced + 3 sections in 1.05.2, D-1.05.2-1..3); gallery restyled to an asymmetric 2×2-feature mosaic with navy-gradient caption overlays (1.06b, D-1.06b-3)
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio` (`NextStudio`); renders on the bare root (no site chrome) (Phase 1.04)
- `src/app/fonts.ts` — Inter + Source Serif 4 via `next/font/google`, Cyrillic subsets (Phase 1.03)
- `src/app/globals.css` — Tailwind 4 `@theme` driven by brand.md tokens; reduced-motion baseline; reveal-on-scroll (`.js [data-reveal]`) + placeholder-hatch utilities (1.05); shadcn semantics repointed to brand; light-only (Phase 1.03/1.05)
- `src/app/favicon.ico` — club-crest favicon (16/32/48/64), generated from `public/crest.png` (chore-crest-logo)
- `src/app/icon.png` — 512² crest favicon (Next file-convention `<link rel=icon>`) (chore-crest-logo)
- `src/app/apple-icon.png` — 180² crest apple-touch-icon (Next file-convention) (chore-crest-logo)
- `src/components/SiteHeader.tsx` — **sticky** navy header/nav (`sticky top-0 z-40` + `border-paper/10`, 1.06b); client component; active-state + accessible mobile menu (opens beneath the sticky bar); crest on a white tile beside the wordmark (Phase 1.03; sticky 1.06b; crest chore-crest-logo)
- `src/components/SiteFooter.tsx` — light footer; brand block (wordmark + mandatory unofficial-archive lines) beside **Навигација / Контакт / Следете нѐ** columns + copyright bottom bar; contact/social are **demo** values (PL-9, D-1.06b-1); crest on a white tile beside the wordmark (Phase 1.03; columns 1.06b; crest chore-crest-logo)
- `src/components/Container.tsx` — max-width (1200px) + page-gutter layout primitive (Phase 1.03)
- `src/components/home/PlaceholderChip.tsx` — placeholder chip (dashed mist border, hatch, mono `[PLACEHOLDER: …]`); the only legal way to show a missing display fact (Phase 1.05)
- `src/components/home/PhotoFrame.tsx` — matted photo frame (mist mat, 2px radius, hairline border); `next/image` via `urlFor`; greybox + chip when no image; `ratio` optional — omit for fill mode (`h-full`) used by the gallery mosaic (Phase 1.05; fill mode 1.06b, D-1.06b-3) · **2.03:** gained an additive `fit="cover"|"contain"` prop (default `cover`, no existing caller changed) so the archival photo grid can mat whole scans rather than crop them (D-2.02-7)
- `src/components/home/Reveal.tsx` — client reveal-on-scroll wrapper; IntersectionObserver toggles `.is-visible`; 60ms stagger via `delayIndex` (Phase 1.05)
- `src/components/home/SectionOverline.tsx` — section overline: orange rule + navy text on paper, orange text on navy (D-1.02-1) (Phase 1.05)
- `src/components/home/DecadeTimeline.tsx` — decades rail (fixed 1920-ти→2020-ти markers; orange node for decades with a published season; links to `/arhiva`; horizontal-scroll on mobile) (Phase 1.05.2, D-1.05.2-3)
- `src/lib/nav.ts` — single source for nav items + `isActivePath()` (Phase 1.03)
- `src/lib/utils.ts` — shadcn `cn()` class-merge helper

## Sanity (`src/sanity/`) — created Phase 1.04; content model **LOCKED** at Phase 2.01
- `src/sanity/env.ts` — reads `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET`, pinned `apiVersion`, `useCdn: true`
- `src/sanity/client.ts` — read-only client (published perspective, no token)
- `src/sanity/image.ts` — `@sanity/image-url` builder (`urlFor`) for `next/image`
- `src/sanity/structure.ts` — Studio desk structure; `siteSettings` pinned as a singleton (D-1.04-5). Every other type is auto-listed via `documentTypeListItems()`, so retiring `match` from `index.ts` drops it from the desk with no change here
- `src/sanity/lib/isUniqueSlug.ts` — `isUniqueSlugPerType`: slug-uniqueness check scoped to the document type, wired into `season.slug` / `person.slug` via `options.isUnique`; excludes the doc's own draft/published pair (Phase 2.01, D-2.01-6)
- `src/sanity/schemaTypes/index.ts` — the **locked** schema: `siteSettings`, `season`, `person`, `photo`. `match` is deliberately **not** registered (D-2.01-2)
- `src/sanity/schemaTypes/siteSettings.ts` — singleton: site title, description, footer archive statement
- `src/sanity/schemaTypes/season.ts` — season: title, slug (**unique**), decade (**required**), story (PT), final table, squad, trainers. **No `photos`** — photos attach via `photo.relatedSeason` and are read by GROQ back-reference (D-2.01-1)
- `src/sanity/schemaTypes/match.ts` — **DEFERRED / unregistered** (D-2.01-2): kept in-repo with a deferral header, absent from `index.ts`, so Studio does not list „Натпревар". No match-level Drive source exists (P0.1); stats come from season aggregates. Re-add via a future phase if that changes
- `src/sanity/schemaTypes/person.ts` — person: name, slug (**unique**), roles, playing years, bio (PT), `careerStats` (**authoritative** career total — D-2.01-3). **No `photos`** — portraits attach via `photo.relatedPerson` (D-2.01-1)
- `src/sanity/schemaTypes/photo.ts` — photo: image (hotspot, required), caption, provenance (**required** — the rights paper-trail; carries the P0.1/P0.2 rights-gate comment), date, `relatedSeason` / `relatedPerson` — **the single, canonical direction** of both relationships (D-2.01-1)

## Archive templates (Phase 2.03)
- `src/app/(site)/arhiva/page.tsx` — **Archive index** `/arhiva`: decade-grouped season cards from live Sanity content, newest decade first; page header + real „N сезони · M децении" counts, sticky decade jump-nav, 3/2/1-col card grid. ISR `revalidate = 60`. Zero seasons → one placeholder chip (handover §5.6)
- `src/app/(site)/arhiva/[slug]/page.tsx` — **Season detail** `/arhiva/<slug>`: breadcrumb → hero (photo or navy band) → Приказна → Конечна табела → Состав → Тренери → Фотографии → back-links. `generateStaticParams` over every published season slug; unknown slug → `notFound()`. Every data section omits itself when empty (D-2.02-3); all five empty → one archive notice (D-2.02-8). ISR `revalidate = 60`
- `src/components/archive/Breadcrumb.tsx` — `Почетна / Архива / <season>`; navy links, mist `/` separators, current crumb `aria-current`; unknown crumb → placeholder chip (D-2.02-5)
- `src/components/archive/SectionHeading.tsx` — orange rule marker + serif H2; the archive templates' section label (D-2.02-3). Replaces `SectionOverline` on these pages only — the homepage's is untouched
- `src/components/archive/DecadeSectionHeader.tsx` — serif decade + real „N сезони" count (neutral-500) + orange rule → mist hairline
- `src/components/archive/SeasonCard.tsx` — 3:2 lead photo (or Mist greybox + chip), **neutral-500** decade overline (D-2.02-1), serif navy title; whole card is one `<a>`; 2px lift on hover. Wraps its own `Reveal` **inside** the `<li>`
- `src/components/archive/DecadeJumpNav.tsx` — sticky decade rail, offset by `top-header` (D-2.02-17); only decades with ≥1 published season; mobile scrolls the rail, never the page body. Scroll-spy deliberately not built (optional per handover §5.3)
- `src/components/archive/StandingsTable.tsx` — „Конечна табела": navy `<thead>`, `<th scope="col">` with abbreviation + `sr-only` full label (D-2.02-14), zebra body, ФК Беласица row = `bg-highlight` + inset 2px orange left marker + navy rank (D-2.02-4), unknown cells „—". Mobile keeps **all nine columns** and scrolls inside the frame with `#`+`Клуб` sticky-left (D-2.02-10)
- `src/components/archive/SquadTable.tsx` — „Состав": light table in `max-w-measure` (D-2.02-11); names link to `/legendi/<slug>` (**404s until 2.05 — expected**); unresolved player → chip, unknown numbers „—"
- `src/components/archive/PersonChip.tsx` — trainer chip → `/legendi/<slug>`; orange dot marker, navy label
- `src/components/archive/SeasonStory.tsx` — Portable Text renderer for `season.story` via `@portabletext/react` (D-2.03-2); blockquote uses orange as a left rule only
- `src/components/archive/PhotoGrid.tsx` — „Фотографии": matted `PhotoFrame fit="contain"` (D-2.02-7), renders **all** photos incl. the hero's (D-2.02-6); caption below the frame = orange rule marker + neutral-500 date overline + unclamped description (D-2.02-9). `provenance` never rendered
- `src/components/archive/SeasonEmptyNotice.tsx` — the all-five-empty season notice + five chips (D-2.02-8); structural copy only
- `src/lib/archive.ts` — archive display helpers: `decadeLabel`, `decadeAnchor`, `seasonCountLabel`/`decadeCountLabel` (pluralisation, D-2.02-12), `isBelasicaRow`, `statCell` (`—` for null, `0` preserved)
- `src/lib/focus.ts` — shared `focusOnPaper` / `focusOnNavy` focus-ring strings. NB: the same strings remain inlined in `src/app/(site)/page.tsx` and `DecadeTimeline.tsx` (homepage files, out of scope for 2.03) — worth folding in during a later homepage phase

## Build & tooling config (repo root)
- `package.json` / `package-lock.json` — dependencies, all pinned exact; scripts (dev/build/start/lint)
- `tsconfig.json` — TypeScript config; `@/*` path alias
- `next.config.ts` — Next.js config; `images.remotePatterns` allows `cdn.sanity.io/images/**` for `next/image` (Phase 1.04)
- `sanity.config.ts` — embedded Studio config (projectId/dataset via env, schema types, structure + vision plugins); read by `/studio` and the Sanity CLI (Phase 1.04)
- `sanity.cli.ts` — Sanity CLI config (projectId/dataset from env; tolerant of missing values) (Phase 1.04)
- `.env.local` — **git-ignored** (`.env*`); `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` / `_API_VERSION`. No token, not committed (Phase 1.04)
- `eslint.config.mjs` — ESLint flat config (Next 15 `FlatCompat`: next/core-web-vitals + next/typescript)
- `postcss.config.mjs` — PostCSS config (`@tailwindcss/postcss`)
- `components.json` — shadcn/ui config (style new-york, base color neutral, Lucide icons)
- `public/crest.png` — official FK Belasica club crest (864×1220, blue/white pennant, owner-supplied 2026-07-15); source for the header/footer logo and the generated favicon set (chore-crest-logo)
- `public/*.svg` — create-next-app default static assets (next/vercel/file/globe/window)

## Not present (deliberately)
- `.github/workflows/` — no CI/review workflow; the Claude review Action was dropped for this project (D-1.01-4)
