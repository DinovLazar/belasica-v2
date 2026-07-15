Part 1 · Phase 05 · Code — Homepage preview

Why this matters — this builds the real homepage from the approved design and the demo content already in Sanity, and ships it to a Vercel preview URL — the exact page Lazar will sit down and show Ace at Phase 1.06.

Context

What already exists (all merged to `main`):

* 1.01 Scaffold — Next.js 15.5.20 + React 19.2.4 + Tailwind 4.3.2 + shadcn/ui, Vercel with PR previews. `main` is protected (PR required).
* 1.02 Design system — all tokens live in `brand.md` (navy `#12294F`, paper `#F7F4EC`, orange `#E4741C`, ink `#1B1B1A`, mist `#E4E1D8`, footer `#EDEAE0`; Source Serif 4 display + Inter body, Cyrillic subsets; type scale; spacing; radii photo 2px / card 4px / chip 4px; motion; component anatomy for hero, season card, person card, stats table, photo figure, placeholder chip, decade header, footer).
* 1.03 Layout shell — site chrome in the `(site)` route group: `src/app/(site)/layout.tsx` (skip link + `SiteHeader` + `<main>` + `SiteFooter`), `SiteHeader.tsx`, `SiteFooter.tsx`, `Container.tsx`, `src/lib/nav.ts` (canonical Latin nav slugs `/arhiva`, `/legendi`, `/statistika`, `/za-nas`, `/kontakt`), `src/app/fonts.ts`, brand tokens wired in `src/app/globals.css` `@theme` (e.g. `bg-navy`, `text-paper`, `text-h1`, `max-w-page`, `rounded-photo`). `prefers-reduced-motion` is already handled globally in `globals.css`.
* 1.04 Sanity — embedded Studio at `/studio`; live read connection, public dataset, no token. Project `belasica` (id `f8rmnfry`), dataset `production`. Read client at `src/sanity/client.ts`; image URL builder at `src/sanity/image.ts`; five schema types in `src/sanity/schemaTypes/` (`season`, `match`, `person`, `photo`, `siteSettings`). `cdn.sanity.io/images/**` is allowed in `next.config.ts`. A temporary route `src/app/debug-sanity/page.tsx` (`/debug-sanity`) proves the read pipeline — remove it this phase. The current home is a minimal placeholder at `src/app/(site)/page.tsx`.

Read first, by exact path, before writing anything:

* `brand.md` — the only source of tokens and component anatomy. Do not hardcode any value it defines.
* `src/sanity/schemaTypes/season.ts`, `person.ts`, `photo.ts`, `siteSettings.ts` — for the exact field names to query (labels in Studio are Cyrillic; the field names are English). Do not guess field names — read them.
* `src/sanity/client.ts` and `src/sanity/image.ts` — the read client and image builder to reuse.
* `src/app/(site)/layout.tsx` and `src/app/(site)/page.tsx` — where the homepage lives and what wraps it.
* `src/lib/nav.ts` — canonical slugs for links.
* `src/_project-state/current-state.md`, `src/_project-state/completions/Part-1-Phase-04-Completion.md` — live state + how Sanity was wired.
* `facts.md` — content-truth rules and the owed items.
* `CLAUDE.md` — repo rules.

Scope

In scope:

* Replace the placeholder home at `src/app/(site)/page.tsx` with the real homepage: five sections (hero, intro, featured season, legends, gallery), built from live published Sanity content via the existing read client.
* GROQ queries for the content each section needs (field names taken from the schema files).
* Sanity images through `next/image` using `src/sanity/image.ts`.
* A reusable placeholder chip component for any missing required display fact; register each visible placeholder.
* Reveal-on-scroll motion within the `brand.md` motion budget; reduced-motion respected.
* Remove the temporary `/debug-sanity` route and its `file-map.md` entry.
* Mark OV-2 resolved in `facts.md` and the owed-verification register (the wordmark `ФК Беласица` was confirmed by the owner on 2026-07-15). Leave OV-3 (footer wording) open.
* Write the homepage layout spec (the §Layout below) to `docs/design-handovers/Part-1-Phase-05-Homepage.md` so the design is archived in-repo.
* Sync all state files and file the completion report.

Out of scope (do NOT touch):

* The Archive, Legends, Statistics, About, Contact pages (Part 2). Nav links to them may still 404 — that is expected this phase.
* Contact form / Formspree (3.03); domain, OG images, favicon (later phases).
* Any change to the five Sanity schemas — the model is locked until 2.01.
* Restyling `SiteHeader` / `SiteFooter`, or changing the wordmark string (OV-2 is resolved by confirming the existing spelling — a register/`facts.md` update only, no component edit).
* Adding new dependencies unless unavoidable; if one is truly needed, pin it exact and log a decision.

Tasks

1. Branch discipline. `git pull` on `main`; confirm no other phase branch is unmerged (one branch at a time). Cut `phase-1.05-homepage`.
2. Read the schema files and note the exact field names for `season`, `person`, `photo`, `siteSettings`. Write GROQ queries (server-side, via `src/sanity/client.ts`) for:
   * `siteSettings` singleton (title, description, footer text, and a hero image if the field exists).
   * One featured season — choose a deterministic selection rule (e.g. a `featured` boolean if present, else the most recent by decade/title). Document the rule as a decision.
   * Up to 3 legends — `person` docs (prefer a legend/role marker if the schema has one, else the first 3 by name). Document the rule.
   * Up to ~10 photos — ordered deterministically (e.g. by date or related season). Document the rule.
3. Build the five sections per the §Layout spec below, every color/size/spacing from brand tokens (Tailwind classes wired in `globals.css`). No hardcoded hex, px, or font names in the new code.
4. Placeholder chip. Build the `brand.md` placeholder-chip component. Any required display fact that is missing renders `[PLACEHOLDER: <what's needed>]` in that style — never invent content. Add every visible placeholder to the register in `current-state.md`.
5. Photos. Render Sanity images with `next/image` via `src/sanity/image.ts`, in the matted fixed-ratio frames from `brand.md` (mist mat, 2px radius, hairline border; low-res scans matted, never stretched). Captions = year overline (navy/neutral) + Inter small description.
6. Motion. Reveal-on-scroll: opacity 0→1 + translateY 10→0, 500ms `cubic-bezier(.2,.7,.2,1)`, 60ms stagger, transform + opacity only (Lighthouse budget). Card hover lift per brand. `prefers-reduced-motion` shows everything instantly with nothing hidden (reuse the existing global rule).
7. Remove `/debug-sanity` (`src/app/debug-sanity/`) and drop its `file-map.md` entry.
8. Resolve OV-2. In `facts.md`, mark the on-page Cyrillic wordmark `ФК Беласица` VERIFIED (owner, chat, 2026-07-15). Move OV-2 to "Resolved" in the `current-state.md` owed register. Do not touch OV-3.
9. Archive the design. Write §Layout into `docs/design-handovers/Part-1-Phase-05-Homepage.md`.
10. Graceful empty state. If a query returns nothing (dataset empty or a field blank), that section renders placeholders — it must not crash or invent filler.
11. Verify + ship. `npm run build` and `npm run lint` pass; `/` and `/studio` still return 200. Open a PR from `phase-1.05-homepage`; confirm the Vercel preview returns 200 and eyeball the homepage against §Layout and `brand.md`.
12. Sync state. Overwrite `current-state.md` (set `NEXT: 1.06 — Verification + Ace demo`, update registers), sync `file-map.md`, append `decisions.md`, and file `src/_project-state/completions/Part-1-Phase-05-Completion.md`.

Layout — the approved homepage direction (build exactly this)

Single dignified column inside the existing header/footer. Photos are the heroes. Brand rule D-1.02-1: orange never carries text on the paper surface (fails contrast) — it appears only as a rule, an active underline, or a small marker. Section overlines on paper are navy or neutral-700 text preceded by a short orange rule. On the navy hero, an orange or light overline is fine (passes AA on navy).

1. Hero (full-bleed). The lead historical photo (16:9 desktop / 4:5 mobile) with a navy bottom gradient. Overline `Неофицијална архива`; serif H1 (site tagline/headline — from `siteSettings` if present, else a fixed structural headline, not a fact claim); one-line Inter subhead; primary button to `/arhiva` + secondary text link to `/za-nas`. Photo source: `siteSettings` hero image or the featured season's lead photo; if none exists, a matted greybox frame (real photos are cleared to ship — OV-1 resolved — but nothing is fabricated).
2. Intro strip. Two columns: left an overline `За архивата` + a serif lead line; right 1–2 short Inter paragraphs stating what the archive is. Copy from `siteSettings.description` (or equivalent) if present, else a placeholder chip.
3. Featured season. Overline `Издвоена сезона`. 3:2 lead image + a `Сезона {title}` serif heading, league/meta line, a short story teaser (first block of the season story), and a `Погледни ја сезоната →` link to `/arhiva/{slug}`. Unknown fields → placeholder chips or `—`.
4. Legends. Overline `Легенди`. Up to three person cards: 4:5 portrait, serif name, neutral `role · appearances`. Card links to `/legendi/{slug}`. Names/roles only from Sanity — missing → placeholder chip.
5. Gallery. Overline `Галерија`. Up to ~10 photos in matted frames (a simple responsive grid is fine). One caption line under the grid describing the matting treatment is optional; per-photo captions use the year overline + description.
6. Footer. Unchanged (already renders the mandatory `неофицијална архива` line and the not-official-club statement).

Definition of Done

* [ ] `src/app/(site)/page.tsx` renders all five sections from live published Sanity content via the read client (no token); `npm run build` and `npm run lint` both pass.
* [ ] Every color, type size, and spacing value in the new code comes from brand tokens — `grep` shows no hardcoded hex, px, or font-family in the homepage components.
* [ ] Orange never renders as text on the paper surface; paper overlines are navy/neutral with an orange rule marker; the hero overline passes AA on navy. (State the check performed.)
* [ ] Sanity photos render via `next/image` + `src/sanity/image.ts`, inside matted fixed-ratio frames per `brand.md`.
* [ ] A placeholder-chip component exists; every missing required display fact renders it, and each visible placeholder is listed in the `current-state.md` register.
* [ ] Reveal-on-scroll animates transform + opacity only; with OS reduce-motion on, all content is visible instantly and nothing is hidden.
* [ ] `/debug-sanity` is removed; `file-map.md` no longer lists it; `/` and `/studio` still return 200.
* [ ] OV-2 marked VERIFIED in `facts.md` (owner, 2026-07-15) and moved to Resolved in the owed register; OV-3 still open.
* [ ] `docs/design-handovers/Part-1-Phase-05-Homepage.md` written with the §Layout spec.
* [ ] Empty-dataset path renders placeholders gracefully with no runtime error (verified on the preview).
* [ ] PR opened from `phase-1.05-homepage`; Vercel preview returns 200 on `/`; homepage matches §Layout and `brand.md`. Include a 5-item eyeball checklist for Lazar in the completion report.
* [ ] State synced: `current-state.md` (NEXT → `1.06 — Verification + Ace demo`, registers), `file-map.md`, `decisions.md` (selection-rule decisions + any others), and the completion report filed.

Precondition (owner, not a code blocker)

The Sanity `production` dataset currently reads empty — the demo content appears to be entered as drafts but not published, or not yet loaded. Build the homepage so it degrades to registered placeholders when content is absent. For a meaningful preview to show Ace, Lazar publishes the demo content in `/studio` (one season, 2–3 legends, ~10 photos, site settings) per §9 of the Phase 1.04 completion report, then re-opens the preview URL.

Outputs & where they go

* Homepage: `src/app/(site)/page.tsx` (+ any small components under `src/components/home/`).
* Design handover: `docs/design-handovers/Part-1-Phase-05-Homepage.md`.
* Completion report: `src/_project-state/completions/Part-1-Phase-05-Completion.md`.
* Branch `phase-1.05-homepage` → PR into `main` (Vercel preview URL is the deliverable to eyeball).
