# Part 1 · Phase 04 · Code — Sanity setup + demo content

Why this matters — this gives the site a real content system: an editor (Sanity Studio) where Lazar types in seasons, players, and photos, and a live connection so the site can display them. Once it's in place, Lazar loads one real season and a few legends, and Phase 1.05 turns that into the homepage we show Ace.

## Context

What already exists (read these first, by path):

* `src/_project-state/current-state.md` — live repo snapshot. The shell is built: root layout (`lang="mk"`, fonts, Paper surface, header + footer), brand tokens wired into Tailwind 4, Vercel Analytics mounted, `npm run build` and `npm run lint` both green. Home page is still a minimal placeholder (the real homepage is 1.05). No Sanity yet.
* `CLAUDE.md` (repo root) — your standing rules: zsh, `~/Projects/belasica-v2`, pull before / push after, one phase branch at a time, PR to `main` (no automated review gate — D-1.01-4; review your own diff and confirm the Vercel preview loads before merge), append-only decisions with IDs `D-1.04-<n>`, exact pinned versions, close-out duties.
* `src/_project-state/00_stack-and-config.md` — the stack and every pinned version. Sanity is already named here as the CMS (free tier; a Growth upgrade is a later named decision, not this phase). Read before adding any dependency.
* `facts.md` (repo root) — the only legal source for factual claims on the site. Content-truth rules apply to demo content too (see Scope).
* `brand.md` (repo root) — design tokens. Studio does not need brand styling this phase; the site pages that render content are built in 1.05, not here.
* `src/_project-state/completions/Part-1-Phase-03-Completion.md` — what the layout shell shipped and how it's wired.
* `src/sanity.io` docs as needed: the official next-sanity embedded-Studio guide for the App Router.

Resolved gates you can rely on:

* Photo rights (OV-1) are resolved — Ace confirmed (via Lazar) he holds the rights, so real photos may be published in the demo.
* Club colors (P0.3, D-0.00-12) and the design system (1.02) are locked; not needed for this phase beyond what's already in the shell.

This is a draft content model. The schemas here are the first pass. They get finalized against the real Drive inventory in Phase 2.01 ("content model lock"). Build them clean and reasonable; do not over-engineer for content we haven't inventoried yet.

## Scope

In scope:

1. A Sanity project + `production` dataset, created under Lazar's account.
2. Five draft schema types: `season`, `match`, `person`, `photo`, `siteSettings`.
3. Sanity Studio embedded in the Next.js app at `/studio`, deployed with the site (so Lazar edits at the Vercel URL — no separate Studio host).
4. The Next.js ↔ Sanity read connection: a Sanity client, image-URL helper, `cdn.sanity.io` allowed for `next/image`, environment variables set locally and on Vercel.
5. A single temporary verification route that proves the site can read published Sanity content (removed or clearly marked temporary — the real pages are 1.05+).
6. A step-by-step Studio loading walkthrough for Lazar (this document, §Lazar's manual steps) to enter one real season, 2–3 legends, and ~10 photos from the Drive.

Out of scope — do NOT touch:

* Any designed/public page (homepage, archive, legends, stats). Those are 1.05 and Part 2. The only route you add is `/studio` and the one temporary verification route.
* `brand.md` visual work, component styling, the header/footer/shell.
* Formspree, domain, SEO/OG, sitemap.
* Finalizing or "locking" the content model — that is 2.01. No migrations, no scripted ingestion (that's 2.09).
* Committing any secret. The repo is public.

## Tasks

### A. Install and configure Sanity (Code, on Lazar's machine)

1. Cut branch `phase-1.04-sanity-setup` from an up-to-date `main` (`git pull` first).
2. Add Sanity to the existing Next.js app (do not scaffold a separate project). Install and pin exact versions of: `sanity`, `next-sanity`, `@sanity/vision`, `@sanity/image-url`, and `styled-components` (Studio peer dep). Record each exact version in `00_stack-and-config.md` (never `latest`, never caret-only).
3. During project creation, log Lazar into Sanity (a browser window opens — he authenticates with his Google account; guide him through it). Create a project named `belasica-v2` with dataset `production`, and set the dataset to public read so the site can query published content without an API token (keeps the public repo token-free). Log this as a decision (`D-1.04-n`).
4. Create `src/sanity/` with: `env.ts` (reads `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, a pinned `apiVersion` date string, `useCdn: true`), `client.ts` (the read client), `image.ts` (`@sanity/image-url` builder), and `schemaTypes/` (one file per type + an index).
5. Add `sanity.config.ts` and `sanity.cli.ts` at repo root wired to the project/dataset via the env vars and the schema types.
6. Mount the embedded Studio at `src/app/studio/[[...tool]]/page.tsx` (client route, `next-sanity`/`sanity` Studio component). Studio must load at `/studio` locally and on the Vercel preview.
7. Add the Sanity image CDN (`cdn.sanity.io`) to `next.config.ts` `images.remotePatterns` so `next/image` can render Sanity assets in 1.05.

### B. Draft schemas (Code) — first pass, to be locked in 2.01

Implement these fields. Use Latin-transliterated slugs (D-0.00-4) on `season` and `person`. Keep everything optional except the marked required fields, so a half-entered document still saves as a draft.

8. `siteSettings` (singleton): `title` (string), `description` (text), `footerUnofficialArchiveText` (text — the long footer statement). These editable global strings back the site; seed them from the current shell values but keep `facts.md`'s UNVERIFIED note in mind (see Content-truth below).
9. `season`: `title` (string, e.g. "Сезона 1985/86", required), `slug` (required, from title, e.g. `1985-86`), `decade` (string or number, for archive grouping), `story` (Portable Text — the season narrative), `finalTable` (array of rows: position, club name, played, wins, draws, losses, goalsFor, goalsAgainst, points), `squad` (array of objects: `player` → reference to `person`, `appearances` number, `goals` number), `trainers` (array of references to `person`), `photos` (array of references to `photo`).
10. `match`: `date`, `competition` (string), `opponent` (string), `homeOrAway`, `scoreFor`/`scoreAgainst`, `season` (reference to `season`). First-pass only — kept minimal.
11. `person`: `name` (string, required), `slug` (required), `role` (string/list: player, trainer, president — a person can hold more than one), `playingYears` (string, e.g. "1982–1990"), `bio` (Portable Text), `careerStats` (object: appearances, goals — free-form for now), `photos` (array of references to `photo`).
12. `photo`: `image` (Sanity image asset, required, `hotspot: true`), `caption` (string), `provenance` (string — where it came from / rights basis; required, because content-truth requires photo provenance), `date` (string or date), `relatedSeason` (reference), `relatedPerson` (reference).

### C. Verify the read connection (Code)

13. Add a temporary server component route (e.g. `src/app/_debug-sanity/page.tsx`) that runs a GROQ query for published seasons and lists their titles + slugs. Its only job is to prove the pipeline reads live data. Name it so it's obviously temporary and mark it in `file-map.md` for removal at 1.05.
14. Set the env vars in three places: `.env.local` (git-ignored — confirm it's in `.gitignore`), and the Vercel project (Production + Preview) so the preview deploy can read Sanity. Only the two `NEXT_PUBLIC_*` values and `apiVersion` are needed — no token.
15. `npm run build` and `npm run lint` must pass. Open the PR (`phase-1.04-sanity-setup` → `main`); confirm the Vercel preview URL loads, `/studio` loads on it, and `/_debug-sanity` lists the seeded season(s) once Lazar has loaded content (step B of the manual section).

### D. Lazar's manual steps (Code writes this walkthrough into the PR/completion; Lazar performs it in Studio)

Provide Lazar a numbered, plain-language walkthrough (he does not code) covering exactly how to, in `/studio`:
16. Fill in `siteSettings` once.
17. Create one `season` — the richest one he has clean material for in the Drive — entering the real season story, final table, squad with appearances/goals, and trainers. He picks the season; enter only facts present in the Drive (see Content-truth).
18. Create 2–3 `person` documents (legends) with real names, playing years, and bios, and link them into the season's squad.
19. Upload ~10 `photo` documents with real captions and a `provenance` note for each, and attach them to the season/people.
20. Publish each document (drafts are not readable by the site).

## Content-truth (applies to the demo too — non-negotiable)

* Nothing invented: no fabricated names, dates, scores, tallies, or captions — not even to make the demo look full. A field with no real Drive source is left empty, not guessed.
* Photos are cleared to publish (OV-1 resolved). Every photo still gets a real `provenance` value.
* `facts.md` still marks some identity strings UNVERIFIED (Cyrillic wordmark OV-2, footer wording OV-3). `siteSettings` may carry the current shell values as-is; do not treat entering them in Studio as "verifying" them — those OV items stay open and owned by Lazar/Ace.
* If Lazar cannot source enough real content for a field, that's expected — leave it empty; 1.05 renders missing content as a visible registered `[PLACEHOLDER]`, not as invented filler.

## Definition of Done

Verifiable by the executor:

* [ ] Branch `phase-1.04-sanity-setup` cut from up-to-date `main`; one branch only.
* [ ] `sanity`, `next-sanity`, `@sanity/vision`, `@sanity/image-url` (and Studio peer deps) installed at exact pinned versions; each appended to `00_stack-and-config.md`.
* [ ] Sanity project `belasica-v2`, dataset `production`, dataset readable without a token; the choice logged as `D-1.04-n`.
* [ ] `src/sanity/` (`env.ts`, `client.ts`, `image.ts`, `schemaTypes/`), `sanity.config.ts`, `sanity.cli.ts` present and wired via env vars.
* [ ] Five schema types implemented (`season`, `match`, `person`, `photo`, `siteSettings`) with the fields listed; `photo.provenance` and the required fields enforced.
* [ ] `/studio` loads locally and on the Vercel preview URL.
* [ ] `cdn.sanity.io` added to `next.config.ts` image `remotePatterns`.
* [ ] `.env.local` is git-ignored and contains no committed secret; env vars set on Vercel (Production + Preview); no token in the repo.
* [ ] `/_debug-sanity` route reads live published data and lists seeded season(s); route flagged temporary in `file-map.md`.
* [ ] `npm run build` and `npm run lint` pass; PR opened; Vercel preview returns 200.
* [ ] `current-state.md` updated (NEXT set to `1.05 — Homepage preview`), `file-map.md` synced, `00_stack-and-config.md` appended, decisions logged, completion report filed.

Owed to Lazar (manual, tracked — not blockers on the Code merge, but the phase's demo content):

* [ ] `siteSettings` filled; one real season, 2–3 legends, ~10 photos entered from the Drive and published; `/_debug-sanity` (or `/studio`) confirms they're live.

If the manual load can't be completed in the same sitting, the Code half may merge first; note the outstanding content-load on the completion report's owed register and in `current-state.md` so 1.05 knows whether real content is present.

## Outputs & where they go

* Brief saved to `briefs/Part-1-Phase-04-Code.md` (per CLAUDE.md; unlike 1.01, file this one).
* Completion report → `src/_project-state/completions/Part-1-Phase-04-Completion.md`, including §3 decisions and an owed-verification note if the manual content-load is incomplete at merge.
* State duties per CLAUDE.md, closing the phase with `current-state.md` first line = `NEXT: 1.05 — Homepage preview`.

---

> **Executor note (filed with the brief):** Two brief assumptions changed on contact with reality and were resolved with Lazar during the phase — recorded so this brief reads truthfully against what shipped:
> 1. **Project name / creation (Task 3).** Lazar was already logged into the Sanity CLI and an existing project **`belasica`** (id `f8rmnfry`) with a public, empty `production` dataset already existed (shared with both operators). Per Lazar's choice we reused it instead of creating a second `belasica-v2` project (D-1.04-1). No browser login was needed.
> 2. **Debug route path (Task 13 / DoD).** `src/app/_debug-sanity/` cannot route — a `_`-prefixed folder is a Next.js *private folder*, excluded from routing. The temporary route lives at **`/debug-sanity`** instead (D-1.04 completion §4).
