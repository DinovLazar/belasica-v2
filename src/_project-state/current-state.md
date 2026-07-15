NEXT: 1.06 — Verification + Ace demo (IN PROGRESS — automatable work done; human steps + close remain)

# current-state.md — Belasica-V2

> Location in repo: `src/_project-state/current-state.md`. This is a **snapshot of the live repo, overwritten as things change** — not a log. The plan is aspirational; this file follows the code. Updated by the executor when closing every phase; the phase is not closed until this file matches reality.

**Last updated:** 2026-07-15 · by Ops (Phase 1.06 — Verification + Ace demo, in progress) on Lazar's machine

## Summary (plain language)

- **The live homepage now renders real content.** https://belasica-v2.vercel.app shows the hero team photo, the club description, the featured season „Сезона 1992/93", the legends, and an 8-photo gallery — all from **live published Sanity content**. The Phase-1.06 opening blocker ("homepage reads empty / all placeholders") was **diagnosed and is resolved**: it was a stale ISR/data-cache state, **not** an env misconfiguration — the deployed build's `NEXT_PUBLIC_SANITY_*` are correct (every image URL resolves to `cdn.sanity.io/images/f8rmnfry/production/…`), and the content self-healed onto the page via ISR revalidation (`revalidate = 60`). **No env change, no redeploy, no code edit were needed.** See D-1.06-2.
- **Only one placeholder remains on the homepage: the legend portraits** (3 shown of 5 legends, all lacking a portrait). This is a **content** gap, not a read fault — it clears when Lazar adds a portrait photo to each `person` in Studio (Task 2, a human step needing Ace-owned photos). See "Remaining human steps".
- **Published demo content (verified via the Sanity API this phase):** `siteSettings` (title „ФК Беласица" + full description); **1 season** „Сезона 1992/93" (decade 1990, 2 photos); **5 persons** (Васо Цветков, Гоце Петровски, Илија Андреев, Панче Пантазиев, Петар Андреев — roles set, `careerStats.appearances` empty, **no portraits yet**); **8 photos** (all with `image` + `provenance`).
- **Lighthouse baseline captured** (homepage, Lighthouse v13.4.0, 2026-07-15): **Mobile** Perf 93 · A11y 100 · Best-Practices 96 · SEO 100 (LCP 3.2s is the driver). **Desktop** Perf 99 · A11y 100 · Best-Practices 96 · SEO 100. Baseline only — the ≥95 gate is Phase 3.02, not now.
- **Ace demo kit built** at `docs/ace-demo/`: `walkthrough.md` (demo script, spoken lines in Macedonian, incl. the OV-3 footer question), `feedback.md` (empty capture template with the required headings), and `screenshots/homepage-{desktop,mobile}.png` (full-page, current state — retake after portraits load).
- **Crest logo/favicon exists in code but is NOT on production.** Local `main` (`e5f05d5`, "feat(crest)…") adds the crest to header/footer + a favicon set, but it is **unpushed**; `origin/main` (`8d5836c`) is the deployed pre-crest build. So the live demo shows the wordmark only — **no crest, and no broken image** (deployed code doesn't reference `/crest.png`, though `/crest.png` and `/icon.png` 404 on prod). **Lazar decides** whether to push+deploy the crest before the Ace demo. See Known issues + D-crest-1.
- OV-2 resolved (wordmark **ФК Беласица** VERIFIED). **OV-3** (exact footer wording) stays open — to be resolved at the Ace sit-down.
- Stubbed / not wired: the Archive, Legends, Statistics, About, Contact pages (Part 2) — nav links 404 by design. No contact form, domain, or OG-image work yet.
- Current phase: 1.06 — Verification + Ace demo. **In progress:** automatable verification + demo-kit prep are done; the human steps (portraits, the Ace sit-down, OV-3) and phase close remain.

## Current stack

See `src/_project-state/00_stack-and-config.md` (only source; exact pins). **No dependencies added or changed in 1.06** (an ops/verification phase — no `src/` edits). Unchanged since 1.05: Next.js 15.5.20, React 19.2.4, Tailwind CSS 4.3.2, `sanity` 4.22.0, `next-sanity` 11.6.13, `@sanity/image-url` 2.1.1, `@vercel/analytics` 2.0.1, Motion 12.42.2, Lucide 1.24.0, shadcn/ui (neutral base, repointed to brand).

## Built pages / components

- `src/app/layout.tsx` — bare root layout: `<html lang="mk">`/`<body>`, fonts, `globals.css`, `<Analytics/>`, site metadata, crest favicon set (`icon.png`/`apple-icon.png`/`favicon.ico` — on local main).
- `src/app/(site)/layout.tsx` — site chrome: pre-paint `.js` flag script (D-1.05-5) + skip link + `SiteHeader` + `<main class="flex-1">` + `SiteFooter`.
- `src/app/(site)/page.tsx` — **the homepage**: 5 sections from live Sanity content; graceful placeholders; ISR `revalidate = 60`.
- `src/app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio at `/studio`.
- `src/components/home/` — `PlaceholderChip`, `PhotoFrame` (matted frame + `next/image`), `Reveal` (scroll reveal), `SectionOverline` (1.05; reusable in Part 2).
- `src/components/` — `SiteHeader.tsx`, `SiteFooter.tsx` (crest logo beside the wordmark; white tile on the navy header — D-crest-1, on local main), `Container.tsx`; plus `fonts.ts`, `lib/nav.ts`, `lib/utils.ts`. `globals.css` has the reveal + placeholder-hatch utilities.
- `src/sanity/env.ts` · `client.ts` · `image.ts` · `structure.ts` — connection, read client, image builder, Studio desk structure.
- `src/sanity/schemaTypes/` — `index.ts` + `siteSettings`, `season`, `match`, `person`, `photo` (draft model; **locked until 2.01**).
- `public/crest.png` — crest artwork (tracked; on local main). `sanity.config.ts` / `sanity.cli.ts` (repo root) — Studio + CLI config.

## Integrations wired

- **Sanity** — wired and **serving real content**. Project **`belasica`** (id `f8rmnfry`), dataset **`production`**, **public-read, no token** (D-1.04-1/2). Homepage reads published content server-side (ISR 60s). `cdn.sanity.io/images/**` allowed for `next/image` in `next.config.ts`. Env vars set in `.env.local` (git-ignored) and on Vercel (Production + Preview): the three non-secret `NEXT_PUBLIC_SANITY_*` values, no token — confirmed correct by the live render (images resolve to `f8rmnfry/production`).
- **Vercel** — connected; production `https://belasica-v2.vercel.app` (D-0.00-6), deployed from `origin/main` (`8d5836c`); preview deploy per PR (public, D-1.01-5). Deployment Protection off (D-1.01-5) — production + previews are public.
- Vercel Web Analytics — `<Analytics/>` in root layout (cookieless).
- Claude Code GitHub Action — **not installed** (D-1.01-4); Part-1 review-gate item **formally waived** (D-1.06-1). The Vercel PR preview is the one automated safety rail.

## Owed-verification register

> Items the executor could not verify and owes to Lazar/Ace. At 3+ items, the next phase is a verification phase.

**Open items (1):**

- **OV-3** · Exact Macedonian wording of the footer unofficial-archive statement (role VERIFIED, wording UNVERIFIED per `facts.md`). **Plan:** resolve at the Ace sit-down (Phase 1.06 · Task 7) — the walkthrough asks Ace to confirm/correct it. Current live wording: label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот." *If Ace confirms/corrects:* mark VERIFIED in `facts.md`, move to Resolved; a wording change ships via a **separate Code PR** (`SiteFooter.tsx` + `siteSettings`), not this ops phase. Entering the current shell text into Studio does **not** verify it.

**Resolved**

- **OV-2** · Cyrillic wordmark **ФК Беласица**. Resolved 2026-07-15 — owner confirmed spelling (chat); VERIFIED in `facts.md`.
- OV-1 · Photo publishing rights (P0.2). Resolved 2026-07-14 — Ace confirmed he holds the rights.

## Placeholder register

> Every visible `[PLACEHOLDER]` on the site. Must be empty before cutover — launch blocker checked at 3.05.

| # | Placeholder | Page | Registered | Status / Cleared in |
|---|---|---|---|---|
| PL-1 | Ace's public name + About text | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-2 | Ace's father: name + playing years | За нас | 2026-07-14 | Open — clears 3.03 |
| PL-3 | Contact email (form destination) | Контакт | 2026-07-14 | Open — clears 3.03 |
| PL-4 | Domain | site-wide metadata | 2026-07-14 | Open — clears 3.04 |
| PL-5 | Intro description (`siteSettings.description`) | Почетна | 2026-07-15 | **CLEARED 2026-07-15** — description published + rendering live |
| PL-6 | Featured season (image, title, story) | Почетна | 2026-07-15 | **CLEARED 2026-07-15** — „Сезона 1992/93" published + rendering live |
| PL-7 | Legends portraits | Почетна | 2026-07-15 | **OPEN** — names/roles render; **portraits not uploaded** → clears when Lazar adds a portrait to each `person` (Task 2, human step) |
| PL-8 | Gallery photos | Почетна | 2026-07-15 | **CLEARED 2026-07-15** — 8 photos published + rendering live |

> PL-5/6/8 confirmed gone on the live homepage this phase. **PL-7 is the only placeholder still visible on `/`** — a portrait (`person.photos[0]->image`) content gap, not a read fault. PL-1..PL-4 are left as-is with their Part 2/3 clearing phases. (Hero H1 falls back to the verified wordmark `ФК Беласица`, not a placeholder.)

## Carryovers

- **[DONE] Load + publish demo content** in `/studio` — done and verified this phase (15 published docs; homepage renders them). Closed.
- **[DONE] Register the Studio host** — no longer relevant; the demo runs on production, whose homepage read is server-side (no CORS needed).

## Remaining human steps (Phase 1.06 — Lazar, to finish + close the phase)

1. **Load 5 legend portraits (Task 2 — needs Ace-owned photos).** In `/studio`, open each **Личност** (person): Васо Цветков, Гоце Петровски, Илија Андреев, Панче Пантазиев, Петар Андреев. The homepage reads the portrait from **`photos[0]`** — the first item of the person's **„Фотографии"** reference array → its `image`. So add a photo to each person's **Фотографии** field (create/pick a `photo` doc that has an `image`, placed first), then **Publish**. Wait ~a minute (ISR), reload `/`, confirm faces replace the 3 grey `[PLACEHOLDER: портрет]` frames. (Homepage shows the top 3; add all 5 so the future `/legendi` page is ready too.)
2. **Run the Ace sit-down (Task 7).** Walk `docs/ace-demo/walkthrough.md` on the live site; capture Ace's words into `docs/ace-demo/feedback.md`. Ask him to confirm the footer wording (**OV-3**) and flag anything factually wrong.
3. **Resolve OV-3.** From Ace's answer: mark the footer wording VERIFIED in `facts.md` (move OV-3 to Resolved). A correction ships via a **separate Code PR**, not this ops phase.
4. **Re-take the demo screenshots** (`docs/ace-demo/screenshots/`) after portraits load; confirm **no `[PLACEHOLDER]` chip anywhere** on `/`.
5. **Decide the crest** (see Known issues) — push+deploy `e5f05d5` before the demo, or demo without the crest.
6. **Close the phase:** finalize `src/_project-state/completions/Part-1-Phase-06-Completion.md` (fill the Ace-feedback + final-screenshot rows), set this file's `NEXT:` → `2.01 — Content model lock`, commit + push.

## Known issues

- **Crest logo/favicon in code but not deployed.** Local `main` = `e5f05d5` ("feat(crest): club crest as header/footer logo + favicon") is **1 commit ahead of `origin/main` (`8d5836c`)** and **unpushed**; the crest also lives on `origin/chore-crest-logo`. Production (from `origin/main`) is the **pre-crest** build → header/footer show the wordmark only; `/crest.png` and `/icon.png` 404 (harmless — deployed code doesn't reference them); `/favicon.ico` is the default Next icon. Recorded from D-crest-1: the crest's club blue samples at ≈ **`#125C9A`**, brighter than the locked navy **`#12294F`** — palette **unchanged** (logo/favicon only); a future owner-gated palette refinement should keep a dark navy for text/links (AA). **Action for Lazar:** decide whether to push/deploy the crest before the Ace demo, and reconcile the direct-to-main commit vs. the `chore-crest-logo` branch (git hygiene).
- **Read-path "empty homepage" (phase-open blocker) — RESOLVED.** Root cause was stale ISR/CDN caching of the pre-content-load empty state; self-healed on revalidation. Env correct; no fix needed. See D-1.06-2. If the empty state ever recurs after a content change, check ISR/CDN staleness first (wait ~2 min or redeploy), not the env vars.
- **Lighthouse mobile Performance 93 / Best-Practices 96 (both form factors 96 BP)** — under the ≥95 launch gate on two metrics. **Baseline only** (this phase records, does not tune); fixes are Phase 3.02. Mobile LCP 3.2s (hero image) is the main perf lever.
- **`@sanity/image-url` deprecation warning at build** — benign, pre-existing (`src/sanity/image.ts`).
- **Studio pinned to 4.x** for Next 15 (D-1.04-4); Next 16 later unlocks sanity 6 / next-sanity 13.
- The Phase 1.02 design handover + mockups were delivered in-prompt and are still **not** in `docs/design-handovers/`. Flagged for the orchestrator.

## What's now possible

- The homepage is a real, populated content page suitable for the Ace demo (once portraits load). The home components (`PlaceholderChip`, `PhotoFrame`, `Reveal`, `SectionOverline`) and the reveal/placeholder CSS are reusable by the Part 2 content pages.
- **Phase 2.02 (Archive & Season templates design) and Phase 2.05 (People & pages design) MUST read `docs/ace-demo/feedback.md` before they open** — it carries Ace's homepage reaction and his asks for the Part 2 pages.
