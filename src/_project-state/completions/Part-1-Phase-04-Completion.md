# Part 1 · Phase 04 · Code — Completion Report

> Save as: `src/_project-state/completions/Part-1-Phase-04-Completion.md`. One phase = one report. Filing this report and syncing `current-state.md` is what closes the phase.

**Date:** 2026-07-15 · **Executor:** Claude Code (Opus 4.8), on Lazar's machine · **Outcome (one line):** the site now has a real content system — Sanity Studio embedded at `/studio` and a verified live read connection to a public Sanity dataset — ready for Lazar to load the demo season, legends, and photos.

## 1. What shipped (plain language)

Lazar can now open **`/studio`** (locally and, after this PR deploys, on the Vercel URL) and type in the archive's content — seasons, players, trainers, matches, photos, and the global site texts — using five draft content types built this phase. The site can **read** that content live: a temporary check page at **`/debug-sanity`** already talks to the real Sanity project and lists published seasons (right now it correctly says "none yet," because the dataset is still empty). The Code half is done and green; the actual demo content (one season, 2–3 legends, ~10 photos) is Lazar's next manual step, in the walkthrough below.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **Branch `phase-1.04-sanity-setup` cut from up-to-date `main`; one branch.** — evidence: `git pull` → "Already up to date"; `git checkout -b phase-1.04-sanity-setup`.
- ✅ **Deps installed at exact pins; appended to `00_stack-and-config.md`.** — `sanity@4.22.0`, `next-sanity@11.6.13`, `@sanity/vision@4.22.0`, `@sanity/image-url@2.1.1`, `styled-components@6.4.3` (all exact, `--save-exact`; verified in `package.json`). Stack log appended (§ "2026-07-15 — Phase 1.04").
- ✅ **Sanity project + `production` dataset, readable without a token; choice logged.** — used existing project **`belasica`** (id `f8rmnfry`) per Lazar (D-1.04-1); `production` verified **public** and **empty** (unauthenticated GROQ `count` → 0, HTTP 200). No token anywhere (D-1.04-2). Logged: D-1.04-1, D-1.04-2.
- ✅ **`src/sanity/` + `sanity.config.ts` + `sanity.cli.ts` present and wired via env.** — `env.ts`, `client.ts`, `image.ts`, `structure.ts`, `schemaTypes/`; root config files import from `./src/sanity/*`.
- ✅ **Five schema types with the listed fields; required fields enforced.** — `season`, `match`, `person`, `photo`, `siteSettings`. Enforced `required`: `season.title`, `season.slug`, `person.name`, `person.slug`, `photo.image`, `photo.provenance`. Latin slugs on `season`/`person` (D-0.00-4).
- ✅ **`/studio` loads locally.** — dev server: `GET /studio` → HTTP 200; in-browser the Studio app mounts (renders Sanity's "Connect this studio to your project" first-run screen — see §7). Production build compiles the route (`/studio/[[...tool]]`, 1.7 MB bundle).
- ✅ **`cdn.sanity.io` in `next.config.ts` `remotePatterns`.** — `https://cdn.sanity.io/images/**` added.
- ✅ **`.env.local` git-ignored, no committed secret; env vars on Vercel (Production + Preview); no token.** — `git check-ignore .env.local` matches; no `.env*` tracked. Vercel: 3 non-secret `NEXT_PUBLIC_SANITY_*` vars set on **Production + Preview** (`vercel env ls` shows all 6 entries). No token exists to leak.
- ✅ **`/debug-sanity` reads live published data; flagged temporary in `file-map.md`.** — route renders live (project `f8rmnfry`, dataset `production`); currently "no published seasons yet" (dataset empty) — proves the read pipeline works. **Path is `/debug-sanity`, not `/_debug-sanity`** (Next.js private-folder rule — see §4). Flagged for 1.05 removal in `file-map.md`.
- ✅ **`npm run build` and `npm run lint` pass.** — build "✓ Compiled successfully"; 4 routes (`/`, `/_not-found`, `ƒ /debug-sanity`, `/studio/[[...tool]]`) generated; `lint` exits 0.
- ✅ **Shell intact after the route-group refactor.** — in-browser `/` renders header (navy wordmark + menu), placeholder home, and footer (`неофицијална архива` + statement + nav). `SiteHeader`/`SiteFooter` unchanged.
- ✅ **PR opened; Vercel preview returns 200; `/studio` loads on preview.** — PR [#5](https://github.com/DinovLazar/belasica-v2/pull/5). Preview (stable git alias) `https://belasica-v2-git-phase-104-sanity-setup-dinovlazars-projects.vercel.app`: `/` → 200, `/studio` → 200 (Studio mounts), `/debug-sanity` → 200 and reads live Sanity ("Project f8rmnfry · dataset production … no published season documents … yet"). Preview URL added to Sanity CORS (credentials).

**Owed to Lazar (manual, tracked — not blockers on the Code merge):**

- **Register the Studio + load demo content and publish** (`siteSettings`, one season, 2–3 legends, ~10 photos). Full step-by-step in **§9 (Walkthrough)** below. Confirm live via `/debug-sanity`. Until then, 1.05 will render registered `[PLACEHOLDER]`s rather than real content.

## 3. Decisions I made during this phase

All logged in `decisions.md`.

- **D-1.04-1** · Reuse existing `belasica` project (f8rmnfry), not a new `belasica-v2`. Lazar was already logged into the Sanity CLI and this project (public, empty `production`, both operators as members) already existed; I surfaced the discrepancy and he chose reuse. Alt rejected: create a duplicate `belasica-v2`. Logged: yes.
- **D-1.04-2** · Public dataset, read without a token (brief-mandated). Alt rejected: private dataset + token (leaks in a public repo). Logged: yes.
- **D-1.04-3** · Studio escapes the site chrome via a `(site)` route group; root layout reduced to `<html>/<body>` + fonts + analytics, chrome relocated verbatim. Alt rejected: leave the Studio inside the header/footer; duplicate root layouts. Logged: yes.
- **D-1.04-4** · Studio pinned to `sanity`/`@sanity/vision` 4.22.0 and `next-sanity` 11.6.13 for Next 15 compatibility (sanity 5+ needs React 19.2's `useEffectEvent`, which Next 15.5.20's bundled React lacks; next-sanity 12+ needs Next 16). Alt rejected: `sanity@5` (build fails); upgrade to Next 16 (out of scope). Logged: yes.
- **D-1.04-5** · `siteSettings` is a Studio singleton via a custom `structureTool` structure. Alt rejected: ordinary document type (invites duplicates). Logged: yes.

## 4. Deviations from the brief

- **Project name.** Brief said create `belasica-v2`; reused existing `belasica`/f8rmnfry per Lazar (D-1.04-1). Functionally identical (public `production`, no token); the project id is opaque.
- **Debug route path.** Brief suggested `src/app/_debug-sanity/`. A `_`-prefixed folder is a Next.js **private folder** — excluded from routing, so `/_debug-sanity` would 404. Renamed to `src/app/debug-sanity/` → route `/debug-sanity`. Same purpose, still flagged temporary.
- **Root layout / route group.** To give the embedded Studio the full viewport without the site nav, the site chrome moved from the root layout into a new `(site)` route group (D-1.04-3). The `SiteHeader`/`SiteFooter` components and their markup are unchanged; the home page renders identically (verified). This is the minimal structural change the embedded-Studio requirement forces; it is not a shell restyle.
- **No browser login step.** Brief Task 3 assumed a fresh Sanity login; Lazar was already authenticated in the CLI, so no browser auth was needed.

## 5. Changed files / deliverables

- **Added (code):** `src/sanity/{env,client,image,structure}.ts`; `src/sanity/schemaTypes/{index,siteSettings,season,match,person,photo}.ts`; `sanity.config.ts`, `sanity.cli.ts` (root); `src/app/studio/[[...tool]]/page.tsx`; `src/app/debug-sanity/page.tsx`; `src/app/(site)/layout.tsx`; `src/app/(site)/page.tsx`.
- **Edited:** `src/app/layout.tsx` (reduced to bare root); `next.config.ts` (image `remotePatterns`); `package.json` + `package-lock.json` (5 deps); `src/_project-state/{current-state.md,file-map.md,00_stack-and-config.md,decisions.md}`; `briefs/Part-1-Phase-04-Code.md` (filed).
- **Deleted / moved:** `src/app/page.tsx` → `src/app/(site)/page.tsx`.
- **Not committed:** `.env.local` (git-ignored), `.vercel/` (git-ignored).
- **Config outside the repo (where it lives, no secrets):** Sanity project `belasica`/`f8rmnfry` → dataset `production` (public); CORS origins (credentials) `http://localhost:3000`, `https://belasica-v2.vercel.app`, `https://belasica-v2-git-phase-104-sanity-setup-dinovlazars-projects.vercel.app`. Vercel project `dinovlazars-projects/belasica-v2` → env vars `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` on **Production + Preview** (values are public, non-secret).
- **Branch:** `phase-1.04-sanity-setup` · **PR:** https://github.com/DinovLazar/belasica-v2/pull/5 · **Preview:** https://belasica-v2-git-phase-104-sanity-setup-dinovlazars-projects.vercel.app (HTTP 200; `/`, `/studio`, `/debug-sanity` all verified 200).

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality, incl. registers
- [x] `NEXT:` line set to: `1.05 — Homepage preview`
- [x] `file-map.md` synced (Sanity files, route group, studio + debug routes, root config)
- [x] `00_stack-and-config.md` appended (5 deps, exact pins + version rationale)

## 7. Risks, surprises, what the next phase needs to know

- **Studio first-run "Connect this studio" screen (Sanity 4.x).** On first visit to `/studio` on any host, the Studio shows a "This studio is not registered" screen with **Register this studio** / **Add development host**. This is expected (a `CorsOriginError` is caught and handled into this screen). Lazar completes it once per host in his own logged-in browser — see §9 §A. It does **not** mean the build or config is broken (the Studio mounts fine).
- **1.05 depends on real content.** If Lazar hasn't loaded/published content before 1.05 starts, the homepage preview must render registered `[PLACEHOLDER]`s, not invented filler (content-truth). `/debug-sanity` (or `/studio`) is how 1.05 checks whether content is present.
- **Delete `/debug-sanity` in 1.05.** It is temporary, unstyled, unlinked, and `force-dynamic`.
- **Studio pinned to 4.x.** Latest Sanity (5/6) is blocked by the Next 15 pin (D-1.04-4). A future Next 16 upgrade unlocks it — do them together.
- **`apiVersion` pinned `2026-07-15`** in `src/sanity/env.ts` and mirrored in env. Bump deliberately, not to "today".

### 5-item eyeball checklist for Lazar (on the Vercel preview URL, once it deploys)

1. **Home unchanged** — `/` still shows the navy header + wordmark, the placeholder home text, and the footer with **неофицијална архива**. (The route-group refactor shouldn't have changed anything visible.)
2. **Studio loads** — open `/studio`; you should see the Sanity Studio (first time: the "Connect this studio" screen — that's normal; §9 §A).
3. **Read check** — open `/debug-sanity`; before you load content it says "no published seasons yet"; after you publish a season it lists that season's title + slug.
4. **No site nav around the Studio** — `/studio` fills the screen; the navy header/footer are not wrapped around it.
5. **Images later** — nothing to check yet; Sanity photos render via `next/image` starting in 1.05.

## 8. What's now possible that wasn't before

The 1.05 homepage (and every later content page) can query real, published Sanity content and render Sanity-hosted photos through `next/image` — as soon as Lazar loads the demo content.

## 9. Walkthrough for Lazar — load the demo content in `/studio`

You don't write any code. Do this in the browser. Use the **Vercel preview URL** from the PR (or run `npm run dev` and use `http://localhost:3000`). All content is Cyrillic; **only enter facts that are actually in Ace's Drive — if you don't have something, leave it blank** (an empty field is fine; a guessed one is not).

### §A. First time only — connect the Studio
1. Open **`/studio`**. You'll see **"Connect this studio to your project."**
2. On the **production** URL (`belasica-v2.vercel.app/studio`), click **"Register this studio."** On **localhost** or a **preview** URL, click **"Add development host"** instead.
3. If asked to log in, sign in with the **same Google account** that owns the Sanity project. After this one-time step the Studio opens to the content list. (You'll repeat step 2 the first time you use each new host.)

### §B. Enter and publish the demo content
The left panel lists: **Поставки на сајтот** (site settings, a single item), **Сезона**, **Натпревар**, **Личност**, **Фотографија**. For every item below, fill the fields, then click **Publish** (top-right) — **the site only shows published items; drafts stay invisible.**

1. **Поставки на сајтот (once).** Open it and fill:
   - *Наслов на сајтот* → e.g. `ФК Беласица`
   - *Опис на сајтот* → the one-line description of the archive
   - *Изјава за неофицијална архива (подножје)* → the footer statement (you can paste the current one). **Publish.**
   - (Note: entering these does **not** "confirm" the wordmark/footer wording — those are still OV-2/OV-3, to check with Ace.)
2. **One Сезона (season) — pick the one you have the cleanest Drive material for.** Fill what you have:
   - *Наслов* (e.g. `Сезона 1985/86`) and *Слаг* in Latin (e.g. `1985-86`) — both required.
   - *Деценија* (e.g. `1980`), *Приказна за сезоната* (the narrative, in the rich-text editor).
   - *Конечна табела* — click "Add item" per row (position, club, played, W/D/L, goals for/against, points).
   - *Состав* (squad) — add players (you'll link the `Личност` docs you make in step 3), with appearances/goals.
   - *Тренери* — references to trainer `Личност` docs.
   - Leave *Фотографии* for after step 4. **Publish.**
3. **2–3 Личност (legends).** For each: *Име* + *Слаг* (Latin, e.g. `petar-petrov`) — required; *Улога* (Играч/Тренер/Претседател — pick one or more); *Години на играње* (e.g. `1982–1990`); *Биографија*; *Кариерна статистика* (appearances/goals). **Publish** each, then go back to the season's *Состав*/*Тренери* and link them.
4. **~10 Фотографија (photos).** For each: upload the *Слика* (required); add *Опис* (caption); **fill *Потекло / права* — required** (where the photo came from / the rights basis); *Датум* (free text, e.g. `околу 1985` is fine); optionally link *Поврзана сезона* / *Поврзана личност*. **Publish** each. Then attach them under the season's *Фотографии* and/or a person's *Фотографии* and re-publish those.
5. **Check it worked.** Open **`/debug-sanity`** — it should now list your published season(s) by title and slug. If it does, the content is live and 1.05 can build the homepage from it.
