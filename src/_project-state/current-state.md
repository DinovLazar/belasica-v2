NEXT: 2.02 — Archive templates design  ·  (unblocked — Ace sit-down captured 2026-07-16 in docs/ace-demo/feedback.md; OV-3 resolved; OV-1 resolved on Ace's word, see caveat)

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-16 · by Orchestrator (Ace sit-down capture — closes Part-1 owed items; OV-1/OV-3 resolved) on Lazar's machine

## Summary (plain language)

- **[2.01 — content model lock] The schema is no longer a draft.** The content model is **locked** against the real archive (P0.1: ≈915 photos, ≈74 season folders 1922→2025-26, ≈23 thematic folders, ≈0.4 GB, free tier). Four launch types: **`siteSettings`, `season`, `person`, `photo`**. Changes: (1) the photo↔season/person relationship is now **single-direction** — the link lives only on the photo (`relatedSeason`/`relatedPerson`) and is read by GROQ back-reference; the `season.photos`/`person.photos` forward arrays are **gone** (D-2.01-1). (2) **`match` is retired** from the launch model — no match-level source exists in the Drive, so statistics come from `season.finalTable` + `season.squad`; `match.ts` stays in-repo, unregistered, with a deferral header (D-2.01-2). (3) **`person.careerStats` is the authoritative career total** (per-season detail stays in `season.squad`; never summed to fake a total) (D-2.01-3). (4) **`season.decade` is now required** and `season.slug`/`person.slug` **enforce uniqueness** per type via a new `isUniqueSlug` helper (D-2.01-6). (5) `photo.provenance` stays **required** and carries the rights-gate comment. **Verify-before-remove was run and did *not* come back clean** — one season („Сезона 1992/93") *did* populate `season.photos`, but both photos were **dual-linked** via `relatedSeason`, so removal dropped no data; the orphaned array was unset on that document (D-2.01-5). Locked schema **deployed to Sanity `production`** (workspace `belasica-v2`); `npm run build` + `npm run lint` clean; homepage verified still rendering photos + portraits from the back-references. **No new dependencies.** Also new: **`docs/content-ingestion-plan.md`** — the decided ingestion approach for 2.09 (D-2.01-4). Ships via PR `phase-2.01-content-model-lock` → main — pending Lazar's diff-review + Vercel preview check. ⚠️ **This phase opened with 1.06 still open** (Ace sit-down uncaptured, OV-3 unresolved) by owner decision (D-2.01-7) — the model has **not** been checked against Ace's stated needs.
- **[1.06b — visual polish]** A visual pass on top of Phase 1.05 (branch `phase-1.06b-visual-polish`), no content or data-model changes: (1) the site **header is now sticky** (`sticky top-0 z-40` + a `border-paper/10` hairline) — verified it stays fixed on scroll and the mobile menu still opens beneath the bar; (2) the **footer is filled out** — the brand block now sits beside three columns (**Навигација** reusing `NAV_ITEMS` / **Контакт** / **Следете нѐ**) with a copyright bottom bar, styled in brand tokens; the contact/social values are **demo placeholders** (PL-9, D-1.06b-1), not real facts; (3) the **gallery is now an asymmetric editorial mosaic** — the first photo is a 2×2 feature and the rest tile around it; `PhotoFrame` gained an optional **fill mode** and captions overlay on a navy gradient (D-1.06b-3); (4) light polish only — section rhythm (`py-16 md:py-24` + `border-t border-mist`) and card-lift hovers were already consistent from 1.05.2, so nothing was forced. **Task 2 (crest logo + favicon) was already shipped by D-crest-1**, so it was a no-op this pass — `src/app/favicon.ico` was kept deliberately (it is the crest, not the Next default the brief assumed; D-1.06b-2). `npm run build` + `npm run lint` clean; verified in-browser at desktop (1280) and mobile (375). No new dependencies. Ships via **[PR #10](https://github.com/DinovLazar/belasica-v2/pull/10)** (`phase-1.06b-visual-polish` → main) — pending Lazar's diff-review + Vercel preview check before merge.
- **The homepage is now the full 8-section content page.** `src/app/(site)/page.tsx` renders, top→bottom: Hero (season team photo) → Intro (club description) → Featured season („Сезона 1992/93" + story teaser) → **Decades timeline** (1920-ти→2020-ти, 1990-ти highlighted) → Legends → **Moment band** (full-bleed 1993 cup photo) → Gallery (8 photos) → **Explore grid** (4 nav cards) → Footer. All from **live published Sanity content** via the read client (ISR `revalidate = 60`). Three sections are new this phase (D-1.05.2-3); the page is ~35% taller on desktop (more on mobile).
- **Legend portraits now render — no new content was needed.** The 1.06 snapshot concluded the portraits were a content gap needing Ace-owned uploads; that was a **misdiagnosis** (see D-1.05.2-2). The portraits for **Васо Цветков and Панче Пантазиев are already linked** via `photo.relatedPerson`; the old query just read the nonexistent `person.photos`. The rewritten `HOME_QUERY` (D-1.05.2-1) reads photos by **back-reference** (`relatedSeason`/`relatedPerson`), so both player portraits render with the real linked images. Legends is now filtered to **players only**, ordered by name; meta = role + `playingYears`.
- **Crest is on `main` and deploying.** PR #7 (`chore-crest-logo`, crest header/footer logo + favicon, D-crest-1) is **merged** to `origin/main`; PR #8 (`phase-1.06-verification`, the 1.06 docs/state) is **merged** too. This phase (1.05.2) stacks on both and ships via **PR #9** (`phase-1.05.2-homepage-content-sync`). Once #9 merges, production shows the crest + the full 8-section homepage.
- **Published demo content (live `production` dataset):** `siteSettings` (title „ФК Беласица" + full description); **1 season** „Сезона 1992/93" (decade 1990, 2 related photos); **5 persons** (Васо Цветков, Панче Пантазиев = players with `playingYears` + linked portraits; Петар Андреев = president with a linked portrait; Гоце Петровски, Илија Андреев = trainers); **8 photos** (all with `image` + `provenance`; 3 linked to a person, 2 to the season).
- **Lighthouse baseline (1.06, homepage, v13.4.0):** Mobile Perf 93 · A11y 100 · BP 96 · SEO 100 (LCP 3.2s driver). Desktop Perf 99 · A11y 100 · BP 96 · SEO 100. Baseline only — the ≥95 gate is Phase 3.02. *Re-baseline after 1.05.2 (three more sections / images) if it matters for the demo.*
- **Ace demo kit** at `docs/ace-demo/` (from 1.06): `walkthrough.md` (Macedonian demo script incl. the OV-3 footer question), `feedback.md` (**captured 2026-07-16** — Ace's reaction + the 2.02 direction), `screenshots/homepage-{desktop,mobile}.png` (still to retake — the page has three new sections + real portraits + the crest now).
- OV-2 resolved (wordmark **ФК Беласица** VERIFIED). **OV-3 resolved** (2026-07-16) — Ace confirmed the current footer wording as correct at the sit-down; VERIFIED in `facts.md`, no code change needed. **OV-1 resolved** (2026-07-16) — Ace confirmed rights to all Drive photos (see register for the screenshot caveat).
- Stubbed / not wired: the Archive, Legends, Statistics, About, Contact pages (Part 2) — nav links (incl. the new timeline/explore links to `/arhiva`, `/legendi`, `/statistika`, `/za-nas`) 404 by design. No contact form, domain, or OG-image work yet.
- Current phase: **2.01 — content model lock** (merged, PR #11). **The Ace sit-down is done (2026-07-16)** and captured in `docs/ace-demo/feedback.md` — this clears the last owed Part-1 human work and **unblocks 2.02 and 2.05**. Ace's verdict: likes the homepage, on the right path, nothing missing; Archive/Season pages should be **very similar to crnobelanostalgija.com** (→ 2.02); no Legends/About/Contact input yet (→ another sit-down in ~a week, feeds 2.05). The locked 4-type model held — Ace named no content need it cannot carry, so the D-2.01-7 risk is cleared (see Known issues).

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). **No dependencies added or changed in 1.05.2** — reuses 1.03–1.05 (`next-sanity`/`@sanity/image-url` reads, `lucide-react` for the arrow icons). Reveal = CSS + IntersectionObserver (no new lib). Unchanged: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/image-url` 2.1.1, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, shadcn/ui (neutral base, repointed to brand).

## Built pages / components

- `src/app/layout.tsx` — bare root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, `<Analytics/>`, site metadata, crest favicon set (`icon.png`/`apple-icon.png`/`favicon.ico`, on main via PR #7).
- `src/app/(site)/layout.tsx` — site chrome: pre-paint `.js` flag script (D-1.05-5) + skip link + `SiteHeader` + `<main>` + `SiteFooter`.
- `src/app/(site)/page.tsx` — **the homepage**: 8 sections from live Sanity content; `HOME_QUERY` reconciled to the live model (photos via `relatedSeason`/`relatedPerson` back-refs; legends = players); graceful placeholders; ISR `revalidate = 60` (Phase 1.05 + 1.05.2, D-1.05.2-1..3). Gallery restyled to an asymmetric 2×2-feature mosaic with navy-gradient caption overlays (1.06b, D-1.06b-3).
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio`.
- `src/components/home/` — `PlaceholderChip`, `PhotoFrame` (matted frame + `next/image`; `ratio` now **optional** — omit for fill mode / `h-full`, used by the gallery mosaic, 1.06b), `Reveal` (scroll reveal), `SectionOverline`, **`DecadeTimeline`** (new, 1.05.2). Reusable in Part 2.
- `src/components/` — `SiteHeader.tsx` (**sticky** navy bar — `sticky top-0 z-40` + `border-paper/10`, 1.06b), `SiteFooter.tsx` (brand block + **Навигација / Контакт / Следете нѐ** columns + copyright bottom bar — contact/social are **demo** values PL-9/D-1.06b-1, 1.06b; crest logo beside the wordmark on a white tile — D-crest-1, on main), `Container.tsx`; plus `fonts.ts`, `lib/nav.ts`, `lib/utils.ts`. `globals.css` has the reveal + placeholder-hatch utilities.
- `src/sanity/env.ts` · `client.ts` · `image.ts` · `structure.ts` — connection, read client, image builder, Studio desk structure.
- `src/sanity/schemaTypes/` — the **LOCKED** model (2.01): `index.ts` + `siteSettings`, `season`, `person`, `photo`. `match.ts` is in-repo but **unregistered** (deferred, D-2.01-2). Photos link **one direction only**: `photo.relatedSeason` / `photo.relatedPerson`, read by GROQ back-reference — the `season.photos`/`person.photos` arrays no longer exist (D-2.01-1). `season.decade` required; `season.slug`/`person.slug` unique per type via `src/sanity/lib/isUniqueSlug.ts` (D-2.01-6). Changing this model now needs its own phase.
- `public/crest.png` — crest artwork (on main). `sanity.config.ts` / `sanity.cli.ts` (repo root) — Studio + CLI config.

## Integrations wired

- **Sanity** — wired and **serving real content**. Project **`belasica`** (id `f8rmnfry`), dataset **`production`**, **public-read, no token** (D-1.04-1/2). Homepage reads published content server-side (ISR 60s). `cdn.sanity.io/images/**` allowed for `next/image`. Env vars in `.env.local` (git-ignored) + Vercel (Prod + Preview): the three `NEXT_PUBLIC_SANITY_*` values, no token.
  - **Locked schema deployed (2.01)** via `npx sanity schema deploy` → workspace **`belasica-v2`** on `production` (`_.schemas.belasica-v2`). `/studio` is embedded in Next and bundles its schema **from code**, so it shows the locked model as soon as the PR deploys — the Content-Lake manifest is for tooling. Deploy writes `dist/static/create-manifest.json`; `/dist` is now git-ignored.
  - ⚠️ **Two schema manifests exist on this dataset.** A stray **Studio-deployed `default`** workspace (hosted studio app `q93d4lfwpetxz05s17ulprtb`) carries a *completely different, non-project* model (`page`, `story`, `season{label,startYear}`, `person{fullName}`, `source`/`verified`) — not from this repo, predates it. **Schema-aware tooling defaults to `workspaceName: "default"` and will read the WRONG model** — always pass `workspaceName: "belasica-v2"`. Left in place deliberately (D-2.01-8); zero runtime impact.
- **Vercel** — connected; production `https://belasica-v2.vercel.app` (D-0.00-6). `origin/main` now includes the crest (PR #7) + 1.06 docs (PR #8); the 8-section homepage lands when **PR #9** merges. Preview deploy per PR (public, D-1.01-5); Deployment Protection off. PRs this stretch: [#7](https://github.com/DinovLazar/belasica-v2/pull/7) crest (merged), [#8](https://github.com/DinovLazar/belasica-v2/pull/8) 1.06 (merged), [#9](https://github.com/DinovLazar/belasica-v2/pull/9) 1.05.2 (this — preview verified 200, 8 sections, portraits load: `https://belasica-v2-git-phase-1052-homepage-72474b-dinovlazars-projects.vercel.app`).
- Vercel Web Analytics — `<Analytics/>` in root layout (cookieless).
- Claude Code GitHub Action — **not installed** (D-1.01-4); Part-1 review-gate item **formally waived** (D-1.06-1). The Vercel PR preview is the one automated safety rail.

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (0).** All owed-verification items resolved as of 2026-07-16.

> ⚠️ **OV-1 carries a caveat that is not a blocker but must be settled before bulk publish** — see the OV-1 Resolved entry below.

**Resolved**

- **OV-1** · **Photo publishing rights (P0.2).** Resolved 2026-07-16 — at the sit-down Ace confirmed he **has the right to use all photos in the Drive**; VERIFIED in `facts.md` (D-1.06-3). ⚠️ **Caveat kept on record:** the P0.1 audit found most archive photos are third-party screenshots (Facebook / Messenger / newspaper), for which "right to use" is legally nuanced. This is **not a launch blocker anymore**, but the specifics (ideally a written confirmation from Ace) should be nailed down before the bulk **2.09** ingestion is published — `docs/content-ingestion-plan.md` §5 already keeps every ingested photo **unpublished** until publish is explicitly cleared, so the gate holds procedurally regardless. *(The 8 already-published demo photos are Ace's own and were never in question.)*
- **OV-3** · Exact Macedonian footer wording. Resolved 2026-07-16 — Ace confirmed the current wording as correct at the sit-down (label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот."); VERIFIED in `facts.md`. **No code change needed** (confirmed as-is, not corrected).
- **OV-2** · Cyrillic wordmark **ФК Беласица**. Resolved 2026-07-15 — owner confirmed spelling (chat); VERIFIED in `facts.md`.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Status / Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 | Open — clears 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 | Open — clears 3.04 |
| PL-5 | Intro description (`siteSettings.description`) | Почетна | 2026-07-15 | **CLEARED** — description published + rendering |
| PL-6 | Featured season (image, title, story) | Почетна | 2026-07-15 | **CLEARED** — „Сезона 1992/93" rendering |
| PL-7 | Legend portraits | Почетна | 2026-07-15 | **CLEARED 1.05.2** — the read path (`relatedPerson`) now renders the linked portraits for both players shown (Васо, Панче); no content step was needed. See D-1.05.2-2. |
| PL-8 | Gallery photos | Почетна | 2026-07-15 | **CLEARED** — 8 photos rendering |
| PL-9 | Footer contact (email + phone) + social links | site-wide (footer) | 2026-07-15 | **Open** — demo values added for the Ace demo (D-1.06b-1); remove or replace with verified values before cutover |

> **No `[PLACEHOLDER]` chip is visible on `/` for the current data.** PL-5/6/7/8 all clear on the 1.05.2 homepage. (A player without `playingYears` would show a small placeholder for the *years only* — not the case for the current two. Hero H1 falls back to the verified wordmark `ФК Беласица`, not a placeholder.) PL-1..PL-4 are left as-is with their Part 2/3 clearing phases. **PL-9 is a different kind of placeholder** — the footer demo contact/social values (D-1.06b-1) render as ordinary links, **not** as a visible hatched `[PLACEHOLDER]` chip, so they look real; they are unverified demo data and are a cutover blocker until cleared.

## Carryovers

- **[DONE] Load + publish demo content** in `/studio` — done (15 published docs; homepage renders them).
- **[DONE] Register the Studio host** — not relevant; the homepage read is server-side (no CORS).

## Remaining human steps (Lazar)

> The Ace sit-down (2026-07-16) closed the Part-1 human work. **2.02 and 2.05 are unblocked.** What's left:

1. **[DONE 2026-07-16] Ace sit-down.** Captured in `docs/ace-demo/feedback.md`. Direction for 2.02: Archive/Season pages like crnobelanostalgija.com.
2. **[DONE 2026-07-16] OV-3** — footer wording confirmed as-is, VERIFIED in `facts.md`. No code change needed.
3. **[DONE 2026-07-16] OV-1 / P0.2 photo rights** — Ace confirmed rights to all Drive photos; VERIFIED in `facts.md` (D-1.06-3). ⚠️ Not a launch blocker anymore, but settle the screenshot-provenance specifics (ideally in writing) before **2.09** publishes ingested photos; the §5 unpublished-until-cleared gate holds meanwhile.
4. **[DONE 2026-07-16] Locked model checked against Ace's asks** — Ace named no content need the 4 types cannot hold; the lock stands (D-1.06-4). Clears the D-2.01-7 risk.
5. **[OPEN] Second Ace sit-down (~1 week)** — to gather Legends / About / Contact input; **2.05 reads that** before it opens. 2.02 does **not** wait on it.
6. **[OPEN] Re-take the demo screenshots** (`docs/ace-demo/screenshots/`) — the page has three new sections + real portraits + the crest. Confirm no `[PLACEHOLDER]` chip anywhere on `/`. (Housekeeping — not a blocker for 2.02.)
7. *(Optional)* **Add the remaining portraits** (Петар Андреев renders on `/legendi` later; Гоце/Илија are trainers, excluded from Legends) — not needed for the homepage, which is placeholder-free as-is.
8. **[DONE] Part 1 formally closed** — all Part-1 owed items resolved; the project is in Part 2.

## Known issues

- **Two schema manifests on `production` — tooling reads the wrong one by default (2.01).** Besides our `belasica-v2` workspace, a stray **Studio-deployed `default`** workspace holds a non-project model (`page`/`story`/`fullName`/`startYear`/`source`/`verified`). Any schema-aware tool that omits `workspaceName` resolves **`default`** and gets a schema that is not this project's (this bit the 2.01 verification on the first attempt). **Always pass `workspaceName: "belasica-v2"`.** Not deleted — out of scope and not ours to remove (D-2.01-8). Cleanup is an owner call; it matters most for **2.09**.
- **~~The locked model was never checked against Ace's needs (2.01).~~ RESOLVED 2026-07-16.** The Ace sit-down happened and is captured in `docs/ace-demo/feedback.md`. Ace named **no** content need the four types (`siteSettings`/`season`/`person`/`photo`) cannot hold — nothing missing, and the only page-specific ask (Archive/Season like crnobelanostalgija.com) is a design/layout direction, not a new content shape. The D-2.01-7 risk is cleared; the lock stands (D-1.06-4).
- **Crest club-blue vs. locked navy.** The crest's blue samples at ≈ **`#125C9A`**, brighter than the locked navy **`#12294F`** (D-crest-1). Palette **unchanged** (logo/favicon only). A future owner-gated palette refinement should use `#125C9A` as the crest blue but keep a **dark navy for text/links** (a brighter blue risks failing WCAG AA on paper, where navy passes at ~13:1).
- **Pre-existing hydration warning (dev only):** the `.js` class added to `<html>` by the reveal pre-paint script (D-1.05-5) produces a React hydration-attribute warning in dev. Benign, predates 1.05.2 (main/crest show it too); a future fix is `suppressHydrationWarning` on `<html>` or setting the flag differently. Not a runtime bug.
- **"Empty homepage" (1.06 phase-open blocker) — RESOLVED.** Stale ISR/CDN caching of the pre-content-load state; self-healed on revalidation. Env correct. See D-1.06-2. If it recurs after a content change, check ISR/CDN staleness first (wait ~2 min or redeploy), not env.
- **Lighthouse mobile Perf 93 / BP 96** — under the ≥95 gate on two metrics; **baseline only**, fixes are 3.02. Re-baseline after 1.05.2 if the demo needs it.
- **`@sanity/image-url` deprecation warning at build** — benign, pre-existing (`src/sanity/image.ts`).
- **Studio pinned to 4.x** for Next 15 (D-1.04-4); Next 16 later unlocks sanity 6 / next-sanity 13.
- The Phase 1.02 design handover + mockups were delivered in-prompt and are still **not** in `docs/design-handovers/`. Flagged for the orchestrator.

## What's now possible

- **The content model is fixed, so Part 2 can build on a shape that won't move.** The Archive/Season, Legends and Statistics templates (2.02→2.05) can be designed and coded against four settled types, with the back-reference read pattern (`relatedSeason`/`relatedPerson`) as the template for every season/person page. 2.04 no longer has to decide where aggregate numbers come from — `person.careerStats` is authoritative, `season.squad` is the per-season detail (D-2.01-3).
- **2.09 has a deterministic spec to build against.** `docs/content-ingestion-plan.md` fixes the Drive-folder→season mapping (grounded in the real audited folder names — hyphen `1992-93`, slash `1950/51`, single-year `1942`, era ranges `1922-26`/`1945-48 Илинден`, numbered thematic `NNN. Title`, and Ace's own `- не` exclude marker), the by-decade wave plan, and the provisional-provenance/rights gate. The script can be written and dry-run before a single document is written.
- The homepage is a real, populated, placeholder-free 8-section content page ready for the Ace demo. The home components (`PlaceholderChip`, `PhotoFrame`, `Reveal`, `SectionOverline`, `DecadeTimeline`) and the reveal/placeholder CSS are reusable by the Part 2 content pages; the `relatedSeason`/`relatedPerson` back-reference read pattern is the template for the season/person pages.
- **Phase 2.02 (Archive & Season templates) and Phase 2.05 (People & pages) MUST read `docs/ace-demo/feedback.md` before they open** — now captured (2026-07-16). For 2.02 it carries the concrete direction: model the Archive/Season pages closely on **crnobelanostalgija.com** (modern, readable). For 2.05, feedback.md notes Ace has **not** given Legends/About/Contact input yet — that comes from a **second sit-down (~1 week)**, so 2.05 should wait for the updated feedback.md; 2.02 does not.
- **2.02 is unblocked and is the next phase.** It is a design phase, so it runs sketch-first (rough direction in chat → Lazar iterates → then the brief), per D-0.00-2.
