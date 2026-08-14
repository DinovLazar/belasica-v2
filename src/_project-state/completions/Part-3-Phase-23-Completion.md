# Part 3 · Phase 23 · Code — Completion Report

**Branch:** `phase-3.23-audit-and-finishing` → `main` · **Date:** 2026-08-14 · **Executor:** Claude Code (Opus 5)

---

## 1. What shipped (plain language)

The archive was read end to end as one site for the first time, and then given the furniture a finished public site is expected to have.

**The audit found 42 correctness defects: 0 P1, 14 P2, 28 P3.** No page is broken for a visitor today. What the P2s share is a single cause — **3.22 rewrote `/legendi` so a person appears in every category they qualify for, and nothing downstream was re-read afterwards.** The search count still summed band memberships, so 49 people counted twice; the person template never selected the field its own card had been rendering since 3.19, so **19 men showed an appearance count on `/legendi` and nothing at all on their own page**; and a photo-ordering key that reads „undated last" actually sorted undated *first*, because `photo.date` is free text and `"9999"` string-sorts ahead of `April 2, 2026`.

Alongside that: the site now has a Macedonian 404 that lives inside its own chrome instead of Next's English default; an error boundary so a Sanity wobble during revalidation shows the archive rather than a stack trace; canonical URLs on all 322 indexable pages; a real 1200×630 share card replacing a portrait crest that every share was letterboxing; JSON-LD that deliberately gives the **club no entity at all**; an `llms.txt`; and a privacy section. **PL-4 is closed in code** — the origin lives once, in `src/lib/site.ts`, and the cutover is now one environment variable plus a redeploy.

Four register items closed: **OV-40** (the header nav wrap, unfixed since 3.16), the sitemap's missing `/pravni-informacii`, the four unhardened fetch call sites, and the misnamed `RoleBandGrid`.

---

## 2. Definition of Done

### Track A — Audit and bugfix

- ✅ `docs/audits/Part-3-Phase-23-Audit.md` covers all eleven route types across the seven dimensions, every finding classified P1/P2/P3.
- ⚠️ **Every P1 and P2 code finding fixed — DOES NOT PASS AS WRITTEN.** 0 P1 (nothing to fix). Of 14 P2, **8 are fixed** and **6 are deliberately reported instead** — see §4 and **D-3.23-16**. Each fixed defect has a decision entry.
- ✅ All 28 P3 findings listed in the audit and summarised in §4 below. None fixed silently; none left unrecorded.
- ✅ **Broken internal links: 0**, of 322 distinct internal hrefs in the built HTML.
- ✅ External links: **0** of 4 lack `target="_blank"`; **0** lack `rel="noopener noreferrer"`. Instagram **200**. ⚠️ **Facebook could not be confirmed as 200** — the share URL **302-redirects to a real profile**, so it is live, but a scripted `GET` gets Facebook's anti-automation 400 page. Stated as a limit, not a pass.
- ✅ **Images with a missing `alt`: 0** (of 1 928). Deliberate `alt=""`: **368**; non-empty `alt`: **1 560**. ⚠️ **The DoD line „`alt=""` count unchanged from before this phase" cannot be honestly claimed.** The baseline was counted with a line-based `grep` and the final build with a whole-file regex — the two disagree on tags spanning a newline — and the baseline snapshot was cleaned from the scratchpad mid-session, so it cannot be re-measured with one method. A delta was expected regardless: the styled 404 now renders the crest (confirmed: 1 `<img>`, `alt=""`, where the default 404 had none), and the portrait-ordering fix changes which photo 4 people show, which can move an `alt` between the columns. **The number the DoD actually turns on — zero missing `alt` — is solid.**
- ✅ `/impeccable audit` run: the mechanical detector returns **only two findings**, both false positives (its `<img>` matcher catching comment prose in `SiteHeader.tsx`; the real tag has `src="/crest.svg"`, which exists). Runtime a11y measured separately — see §2b.
- ✅ **`/razno/mladinska-skola` measured: 29 photographs, 5 018 312 bytes = 4.78 MB**, **0** through `/_next/image`. Not changed, as instructed.

### Track B

- ✅ `src/lib/site.ts` exists; `layout.tsx`, `robots.ts`, `sitemap.ts` (and `Breadcrumb.tsx`) all read from it. `grep -rn "belasica-v2.vercel.app" src/` → **`src/lib/site.ts` only**.
- ✅ `NEXT_PUBLIC_SITE_URL` in `.env.example`, empty, set **nowhere** — verified absent from `.env.local` and never added to Vercel.
- ✅ **322 of 323 built HTML files emit exactly one `<link rel="canonical">`; 322 distinct values; 0 duplicates; 0 pages with more than one.** The single file without one is `_not-found.html` — correct, since a canonical on a 404 asserts the URL exists.
- ✅ An unknown path renders the Macedonian 404 **with header and footer** and returns HTTP **404**. So do all three `notFound()` routes.
- ✅ `src/app/(site)/error.tsx` exists, is a client component, exposes a working `reset`, renders no stack or digest. ⚠️ **Never made to fire** — see §7.
- ✅ `public/og-default.png` is **exactly 1200×630**, read from the file on disk with `sips`.
- ✅ `/`, `/arhiva` and a season page all emit `og:image` → `/og-default.png` at 1200×630 and `twitter:card` = `summary_large_image`. **0** pages still use `crest.png` as an OG image.
- ✅ JSON-LD: `WebSite` **323/323, exactly once each**; `BreadcrumbList` **321** (every page with a visible trail except the 404, suppressed deliberately); `Person` **211**, all on `/legendi/<slug>`, **0** elsewhere. **0** blocks fail to parse.
- ✅ **The constraint check: `SportsTeam`, `SportsOrganization`, `Organization`, `LocalBusiness`, `foundingDate`, `jobTitle`, `aggregateRating` → 0 hits each** across all 323 files.
- ✅ `public/llms.txt` states the unofficial-archive status in its first two lines; counts taken from live data (**211** people, not the brief's „~160").
- ✅ `/pravni-informacii` renders **eleven** sections; **the first ten are byte-identical** to the `main` baseline (compared section by section); the eleventh is the supplied copy verbatim.
- ✅ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` supported and unset; no `<meta name="google-site-verification">` is emitted.

### Track C

- ✅ **Header height at 375 / 768 / 810 / 820 / 899 / 1024 / 1280 / 1408 px = 78 px at all eight**, delta **0** against the token. Before: 101 px at 810 (delta +23), 7 links on 2 rows.
- ⚠️ **Anchor offsets at 810 px are non-negative but not all 0**, and the brief predicted 0: `/arhiva` **+5 px**, `/legendi` **+5 px**, `/statistika` **+5 px**, season page **0 px**. The +5 is by design — `scroll-mt-[calc(var(--spacing-header)+3.25rem)]` reserves 52 px for a rail that measures 47 px. The season page is exactly 0 because its rail is not sticky. **Nothing lands underneath the header**; before the fix all four were −18 to −23.
- ✅ Sitemap includes `/pravni-informacii`. **Total 322 = 8 static + 7 razno + 96 seasons + 211 people**, 0 duplicates.
- ✅ All four previously-unhardened fetch call sites go through `src/sanity/fetch.ts`; `grep -rn "client.fetch" src/app` returns nothing. Each site's failure behaviour preserved.
- ✅ `RoleBandGrid.tsx` gone, `CategoryGrid.tsx` in its place, export renamed, all imports updated. **Proven inert:** `/legendi`'s rendered DOM is byte-identical to the `main` baseline **apart from React `useId` values** — identical total length, ids internally consistent — which shift only because the `(site)` segment gained an `error.tsx`. Visible text identical on all 9 pages compared.
- ✅ Five scaffolding SVGs deleted; `file-map.md` reflects it.

### Repo hygiene

- ✅ `rm -rf .next && npm run build` → **330/330 pages, exit 0**, **323 HTML artefacts — no page added or removed** vs the baseline.
- ✅ `npx tsc --noEmit` clean · `npm run lint` clean · prettier applied.
- ✅ **Zero new runtime dependencies; two were removed** (`radix-ui`, `class-variance-authority`), recorded in `00_stack-and-config.md`.
- ✅ No file under `src/sanity/schemaTypes/` changed; **no Sanity write of any kind**; no `brand.md` token added.
- ✅ `current-state.md`, `file-map.md`, `00_stack-and-config.md`, `decisions.md` all updated; `NEXT` line reset.

### 2b. Verification quality — what was measured, and how

- **Contrast** was measured through a **canvas**, because Tailwind v4 emits `oklab()` and a naive parser reads those numbers as RGB and reports ~1.2:1 for text that is actually 9.9:1. Real figures on the new 404: H1 **14.95:1**, intro **9.9:1**, breadcrumb link **14.95:1**, current crumb **9.9:1**, onward links **14.95:1** — every one matching `brand.md`'s published value.
- **Heading order and landmarks**, all 12 route types: **1 `<h1>`, 1 `<main>`, 1 `<footer>`, no skipped level, 0 unlabelled `<nav>`**.
- **Focus rings** confirmed from the stylesheet and confirmed **unlayered**, so they beat the utilities layer: `3px solid navy`, `2px` offset, orange on navy.
- **Console**, on the production build across 7 template types: the **only** output is the `/_vercel/insights/script.js` 404, which exists only on Vercel's edge. **0** hydration warnings — the known `.js` mismatch (D-1.05-5) is dev-only and did not appear.
- **Horizontal overflow at 375: 0 px.** Burger toggle **48×48** at every width it shows.

### 2c. Vercel PR preview — verified, not merely loaded

**PR:** https://github.com/DinovLazar/belasica-v2/pull/51
**Preview:** https://belasica-v2-7gpb3ll6v-sunset-services-team.vercel.app

Checked against the deployed preview, not the local build:

- **15/15 routes return 200** — `/`, `/arhiva`, `/arhiva/1982-83`, `/legendi`, `/legendi/goran-pandev`, `/statistika`, `/razno`, `/razno/tiverija`, `/za-nas`, `/kontakt`, `/pravni-informacii`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og-default.png`.
- **Unknown paths return 404**, both an unmatched URL and a `notFound()` route — and `/nepostoecka-stranica` renders the archive's own page: „Страницата не постои" + header nav + `<footer>` + the onward nav, all present.
- **Canonicals resolve against the Vercel origin** (`https://belasica-v2.vercel.app/arhiva`, `…/legendi/goran-pandev`) — correct, since `NEXT_PUBLIC_SITE_URL` is deliberately unset.
- **`og:image` → `/og-default.png`** and **`twitter:card` = `summary_large_image`** on all three sampled routes.
- **JSON-LD per route type is exactly as designed:** `/` → `[WebSite]`; `/arhiva` → `[WebSite, BreadcrumbList]`; `/legendi/goran-pandev` → `[WebSite, Person, BreadcrumbList]`.
- **No `google-site-verification` meta** is emitted anywhere.
- **Sitemap: 322 URLs, including `/pravni-informacii`.**

### 5-item eyeball checklist for Lazar

1. Open `/nepostoecka-stranica` — does the 404 read right in Macedonian, and is the way back obvious?
2. Resize any page through **~800 px** — the header now shows a burger below 1024. Acceptable on iPad?
3. Look at `/og-default.png` at full size — it becomes the site's face in every share.
4. `/pravni-informacii` — read the new **§11** and check the „Последно ажурирање" date now says 14 август 2026.
5. `/legendi` → open a coach's page (e.g. a man with a range like „120–135") — the appearance count should now match what his card shows.

---

## 3. Decisions I made during this phase

**D-3.23-1 … D-3.23-16**, all in `decisions.md`. The ones that change something a reader can see or that a future phase must know:

1. **D-3.23-1** — burger breakpoint `md` → `lg`, closing OV-40. Also caught: moving the nav without the toggle left 768–1023 px with **no navigation at all**, found by measuring.
2. **D-3.23-3** — canonicals are declared **per route, never in the root layout**. A root canonical is inherited by every page that does not override it, which would have told search engines all 322 pages are the homepage.
3. **D-3.23-4** — the share image is a committed static PNG captured from a **throwaway route** that was then deleted, so it inherits the real self-hosted fonts. No `next/og`, no new dependency.
4. **D-3.23-5** — JSON-LD is three node types and **no entity for the club**. No `foundingDate` (UNVERIFIED in `facts.md`), no SearchAction (there is no search endpoint), no `jobTitle` (OV-35 is open). `BreadcrumbList` is generated **inside `Breadcrumb` itself**, so the visible and machine-readable forms cannot disagree.
5. **D-3.23-8** — the 404 is at the **app root, not in `(site)`**, contradicting the brief. Built the brief's way first and measured it failing.
6. **D-3.23-12** — the person page now reads `legendAppearances`; **nothing was copied between it and `careerStats`**, because they have different recorded provenance and OV-39 is open.
7. **D-3.23-16** — six P2s reported rather than fixed, with reasons.

---

## 4. Deviations from the brief / spec

1. ⚠️ **Six of fourteen P2 findings were not fixed** (D-3.23-16). Two are Sanity content the phase is forbidden to write; two are visible design changes to `/legendi`, which the owner had rebuilt at 3.22 by his own instruction; one is a naming judgement for Аце; one is a feature-sized change. Making any of them silently would repeat this project's recorded failure mode. **All six are in the audit with evidence and in §7 below.**
2. ⚠️ **The 404 is at `src/app/not-found.tsx`, not `src/app/(site)/not-found.tsx`** as the brief specifies (D-3.23-8). The brief's location does not catch unmatched URLs; measured, not assumed. Cost: the chrome is written in two places, and the file says so.
3. ⚠️ **The brief's premises were stale.** It says „~160 person pages"; the live build renders **211**. It says „330 pages"; that is the Next *route* count — there are **323** HTML artefacts and **322** indexable pages. All counts in the audit and this report are measured. *(This is the pattern already recorded for 3.11 and 3.13.)*
4. **The 404's onward links use the footer column's anatomy with paper colour values, not its literal classes** (D-3.23-6). The footer's `text-paper/80` measures ~1.1:1 on paper.
5. **Anchor offsets at 810 px are +5, not 0**, on the three routes with a sticky rail — by design, and explained above.
6. **One extra fix beyond the audit's own list:** `/legendi`'s portrait query had the same undated-first ordering bug as the person page, so both were corrected together rather than leaving one half fixed.

### P3 findings — recorded, not fixed (per the brief)

28 in total; the full list with evidence is in the audit, §2. The ones a future phase should know: **dead GROQ selections** on `HOME_QUERY` and `SEASON_QUERY`; **four comments stating measured counts that the build now contradicts** (13 vs 12 seasons without a `teamPhoto`, 83 vs 84, a divider on 51 vs 81 seasons, `legendRank` described as 1–80 when live data has 138 ranked people spanning 1–135); **`/legendi#treneri` and two sibling anchors are dead** because those panels are now `display:none`; **`focalPosition`'s hotspot branch is dead across the whole dataset** (all 476 crops use the default — a Studio lever nobody has pulled); an **empty `<Reveal>` wrapper** on 6 season pages; `generateMetadata` **inventing the title „Сезона"** where the page body refuses to; `SeasonStory` **not mapping `h1`/`h4`–`h6`**; `SeasonCard`'s `??` yielding `alt=""` for an empty-string caption; `lastCellSpan` leaking `sm:col-span-2` into the lg grid.

---

## 5. Changed files / deliverables

**New:** `src/lib/site.ts` · `src/app/not-found.tsx` · `src/app/(site)/error.tsx` · `public/og-default.png` · `public/llms.txt` · `docs/audits/Part-3-Phase-23-Audit.md`
**Renamed:** `src/components/legends/RoleBandGrid.tsx` → `CategoryGrid.tsx`
**Deleted:** `public/{file,globe,next,vercel,window}.svg` · (throwaway `src/app/og-preview/` — created and removed within the phase)
**Modified:** `src/app/layout.tsx`, `robots.ts`, `sitemap.ts` · all 11 route modules (canonicals) · `src/app/(site)/{page,arhiva/page,arhiva/[slug]/page,legendi/page,legendi/[slug]/page,statistika/page,razno/page,razno/[slug]/page,za-nas/page,kontakt/page,pravni-informacii/page}.tsx` · `src/components/{SiteHeader,PageHeader}.tsx`, `archive/Breadcrumb.tsx`, `legends/LegendsBrowser.tsx` · `.env.example` · `package.json`, `package-lock.json`

---

## 6. State updates done

`current-state.md` (NEXT line reset; PL-4 closed in code; OV-40 resolved; the fetch-hardening known issue closed) · `file-map.md` (5 new/renamed entries, 5 deletions recorded) · `00_stack-and-config.md` (dependency removals, two new env vars, new/removed static files) · `decisions.md` (D-3.23-1…16) · this report.

---

## 7. Risks, follow-ups, what the next phase needs to know

### Owed to Lazar — please do these, I could not

1. **A native speaker reads the new Macedonian.** Ten new strings: the three on the 404, the three on the error page, the three privacy paragraphs, and the whole `llms.txt` body. Plus one word changed on `/statistika` („внесени").
2. **The owner approves the new §11 privacy copy.** It is the **only** copy on `/pravni-informacii` that is not his.
3. **The owner eyeballs `og-default.png`.** It becomes the site's face in every share.
4. **The owner confirms the header now switching to a burger below 1024 px.** It changes the header on every route at tablet widths.
5. **The owner confirms the corrected „Последно ажурирање" date** on his legal page (it read a future date).

### The six P2s I did not fix — decisions needed

6. **(Ace/Studio)** Two `photo` documents share one image asset on `1969-70` and `1982-83`, so the same scan renders twice in the gallery and twice in the lightbox count. D-3.04-10 rejected code-side asset dedupe; the fix is unpublishing the duplicates.
7. **(Owner)** „Статистика на играчи" heads a coach-only section on `/arhiva/1922-26`. Sibling of **OV-36**; the heading is shared across all 96 pages.
8. **(Owner)** `legendRank` prints as a **leading list index** inside the three bands not ordered by rank — 39 of 69 Тренери cards, 1 of 29 Претседатели, 5 of 10 Репрезентативци. The number is real; what is wrong is that it reads as a position.
9. **(Owner)** The filled navy role chip names the person's highest-priority role, not the category being read. Its doc comment still cites **D-2.05-2, which D-3.22-2 withdrew**.
10. **(Ace)** „Рекорди" heads four dated anecdotes and a closing wish on `/razno/partizan`. Sibling of **OV-42**.
11. **(Next phase)** The Сезони section on a person page reads only the **legacy** `squad[]`/`trainers[]` arrays, so it shows **nothing for 208 of 211 people**. Matching the live `season.trainer` string needs exact-name discipline — „Благој Истатов" is a substring of seven other strings and of the stadium's name. Sized as its own phase.

### Not verified — stated plainly

12. ✅ **The Vercel PR preview gate IS satisfied** — see §2c. All 15 routes 200, unknown paths 404 rendering the archive's own page, canonicals/OG/JSON-LD confirmed on the deployed build, sitemap 322.
13. ⚠️ **The error boundary was never made to fire.** Structurally verified only — it compiles, is a client component, exposes `reset`, and renders no digest or stack. Triggering it needs a Sanity read to fail during an ISR revalidation, which cannot be staged without fault injection this phase did not build. **This is the one deliverable whose runtime behaviour is unproven.**
14. ⚠️ **The Facebook link's status code could not be confirmed** — live via a 302 to a real profile, but scripted GETs get a 400 anti-automation page.
15. ⚠️ **No VoiceOver / computed-role pass** — OV-21's limitation stands.
16. ⚠️ **The „Разно" lightbox is still never opened** — OV-52 carries forward unchanged.
17. ⚠️ **Lighthouse was not re-run.**

### Content-side findings mapped to existing register IDs

OV-35 (`jobTitle` deliberately omitted from `Person` because of it) · OV-36 (item 7) · OV-39 (why `legendAppearances` was read rather than backfilled) · OV-42 (item 10) · OV-52 (item 16) · D-3.04-10 (item 6) · D-3.20-7 (the 4.78 MB unoptimised topic page).

---

## 8. What's now possible that wasn't before

- **The domain cutover is an Ops step, not a code change.** Point DNS at Vercel, set `NEXT_PUBLIC_SITE_URL`, **redeploy**, hand-edit `public/llms.txt`. Four things, one of them a text file.
- **The site can be shared.** Every share now renders a purpose-built 1200×630 card instead of a letterboxed crest thumbnail.
- **Search engines and answer engines can read the archive correctly** — and, just as importantly, **cannot mistake it for the club**: there is no entity for FK Belasica anywhere in the structured data, by design.
- **A wrong URL is no longer a dead end**, and a Sanity wobble at request time no longer shows a stack trace.
- **The build can no longer lose a page to a transient CDN timeout on any route** — every Sanity read in the app is now retried.
