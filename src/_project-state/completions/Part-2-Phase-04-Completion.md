# Part 2 · Phase 04 · Code — Completion Report

**Date:** 2026-07-17 · **Executor:** Claude Code (Opus 4.8), Lazar's machine · **Outcome (one line):** `/statistika` exists — the last empty top-level nav link now renders the club's top scorers, most appearances and all-time balance from live content, and populates itself as seasons and players are ingested.

## 1. What shipped (plain language)

`/statistika` (previously a 404) renders a breadcrumb and three sections — **Најдобри стрелци**, **Најмногу настапи**, **Севкупен биланс на клубот** — from live published Sanity content with ISR `revalidate = 60`. The two player rankings read only `person.careerStats`; the balance sums only Belasica's own final-table row across every season that has a `finalTable`, into a summary band plus a season-by-season table, under a line stating how many seasons the aggregate covers. All tables sort in the browser by any column.

**With today's content, all three sections show an empty notice — that is the correct, expected result**, not a defect: no published player has `careerStats` and no published season has a `finalTable`. Nothing is fabricated to fill the gap. The page needs no further work per player or per season: publish a player with career stats and they enter the rankings; publish a season with a final table and the whole balance section appears within ~a minute.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **`/statistika` renders (previously 404); the `Статистика` nav link resolves to it** — evidence: `npm run build` lists `○ /statistika 2.73 kB · Revalidate 1m`; rendered in-browser at `localhost:3000/statistika`; the header's `Статистика` link shows its active orange underline on the page.
- ✅ **All three sections present, in order** — evidence: page text confirms Најдобри стрелци → Најмногу настапи → Севкупен биланс на клубот. Matched to the handover's **shared conventions + §6.4 table spec + `brand.md`**, since no Statistics design exists (see D-2.04-2 and §4).
- ✅ **Top scorers / Most appearances read only `person.careerStats`; no code path sums `season.squad`** — evidence: `STATS_QUERY` selects `careerStats.goals` / `careerStats.appearances` and never queries `squad`. `grep "squad"` across the five new files returns **exactly one hit — a comment** in `page.tsx` recording the D-2.01-3 rule; with comment lines stripped the count is **0**. Verifiable by inspection.
- ✅ **All-time balance aggregates only `isBelasicaRow` rows across seasons with a `finalTable`; coverage line states the season count; no fabricated zeros or rows** — evidence: `aggregateClubBalance` (`src/lib/stats.ts`) skips any season whose table has no Беласица row. Fixture-verified: a 3-season fixture where one season's table named only „Победа" produced **Сезони: 2**, and the page disclosed the third — „Во уште 1 сезона има конечна табела, но во неа не е пронајден ред за Беласица."
- ✅ **Every section shows a single empty notice when its data is absent — verified against today's live content** — evidence: all three notices render live (Сѐ уште нема внесени голови… / …настапи… / Ниту една сезона сѐ уште нема внесена конечна табела…), each with one placeholder chip. Registered as **PL-12 / PL-13**.
- ✅ **Tables client-sortable per column, keyboard-operable, `aria-sort` on the active header** — evidence: every `<th>` contains a `<button>` (native keyboard operation); `aria-sort` measured in-browser as `descending` on the active column and `none` on all others, and it moves on click. „Настапи" desc → `180, 30, 12, —`; asc → `12, 30, 180, —` (unknowns last both ways, D-2.04-5).
- ✅ **No model change: no `competition`/order field; `match.ts` remains unregistered** — evidence: `git diff main --stat` touches no file under `src/sanity/`.
- ✅ **All copy Macedonian (`lang="mk"`); `humanizer` pass run; every label/number traces to Sanity or `facts.md`** — evidence: `lang="mk"` on the root layout (unchanged). All new copy is **structural** — it describes the archive's own state and claims no fact about the club, so it needs no `facts.md` entry. No competition name, club name, or number is hardcoded anywhere; the only club string in the code is the `isBelasicaRow` **matcher** (pre-existing, 2.03), not rendered text. Humanizer pass: notices state the plain cause („Сѐ уште нема внесени голови за ниту еден играч, па нема што да се подреди") rather than inflated or apologetic filler.
- ✅ **Only `brand.md` tokens; orange never carries text; focus rings from `focus.ts`** — evidence: no hex/px/font literal in any new file; **no token added**. Orange appears only as the `SectionHeading` rule marker (a non-text 2px bar). `StatTable` imports `focusOnPaper` / `focusOnNavy` from `src/lib/focus.ts`.
- ✅ **`npm run build` and `npm run lint` both clean** — evidence: lint → no output; build → `✓ Compiled successfully in 19.3s`, 10/10 static pages. Run on a clean `.next` with the dev server stopped.
- ✅ **Rendered at 1280 and 375; WCAG 2.2 AA verified on the new UI** — evidence: computed-contrast sweep of every new text/bg pair, **lowest 10.37:1** (AA needs 4.5:1): header label on navy 13.12:1, body cell 11.40:1, zebra cell 11.01:1, player link 14.43:1, summary label 11.40:1, summary value 14.43:1, coverage line 10.37:1. At 375: no page-level horizontal scroll (`documentElement.scrollWidth === innerWidth`); each table scrolls **inside** its own frame (`role="region"`, `tabindex="0"`, `aria-label`) with the first column sticky-left — verified by scrolling a region 250px and confirming the season cell stayed at `left: 21` with the header keeping its navy fill (not transparent).
- ✅ **ISR `revalidate = 60` set** — evidence: `export const revalidate = 60`; build output shows `Revalidate 1m`.
- ✅ **No new dependency** — evidence: `package.json` / `package-lock.json` untouched. Sorting is plain React state; the sort chevrons reuse `lucide-react`, already a dependency.
- ✅ **State closed** — see §6.

**Owed to Lazar (goes on the owed-verification register):**

- **OV-4 · The Statistics tables have never rendered from real content (D-2.04-6).** Live `production` has no season with a `finalTable` and no player with `careerStats`, so the tables, the summary band, the coverage lines and the sorting are **fixture-verified only**. How to clear: in `/studio`, publish **one** player with `careerStats` (goals + appearances) and **one** season with a `finalTable` containing a Беласица row, then reload `/statistika` twice ~60s apart (ISR). Expect: the player appears in both rankings; the balance section replaces its notice with the band + coverage line + one season row. Clears naturally at **2.09**.
- **The Vercel preview URL — never obtained; merged without the gate (D-2.04-7, owner-directed).** The brief requires the preview URL in this report. **It does not exist for this phase.** Vercel created **no deployment** for `phase-2.04-statistics` (both branch-alias forms return `DEPLOYMENT_NOT_FOUND` — not a build error); GitHub's REST endpoints for the repo returned 500 „Unicorn!" pages for the whole session while GraphQL stayed up; the PR showed zero checks and zero comments. An empty-commit retrigger (`3d25549`) was pushed and polled ~3.5 minutes — still nothing. The push never reached Vercel's webhook. This is **infrastructure, not the code**: the same commit builds clean (`✓ Compiled successfully`, 10/10 static pages). Told Lazar the gate was open and unobtainable; he directed „merge it", and PR #14 was merged on the local evidence (clean build + lint, rendered and verified at 1280/375, contrast ≥ 10.37:1, sorting/`aria-sort`/keyboard, mobile scroll frames). **Now owed as OV-5:** confirm `https://belasica-v2.vercel.app/statistika` returns 200 once Vercel catches up — `/statistika` reached `main` having never been served by Vercel, so a Vercel-only failure would surface first in production. Low risk (static, additive, no existing route changed), but unproven on the platform that serves it.
- **The 5-item eyeball checklist** is in the PR body and repeated in §7 below.

## 3. Decisions I made during this phase

All six logged in `decisions.md`.

- **D-2.04-1 · "Per-competition balance" → one all-time club balance.** Pre-resolved by the brief; logged as instructed. The locked model has **no competition dimension** — `finalTable` rows carry no league name and `match` was retired (D-2.01-2) — so a per-competition split could only be invented. **Rejected:** adding a `competition` field (model change, locked); inferring the league from the season year (invented content). **Logged: yes.**
- **D-2.04-2 · No Statistics design exists; built from the handover's shared conventions + `brand.md`.** The brief says to read "the section covering the Statistics page" in the 2.02 handover. **There is none** — §15 explicitly defers it. Derived the page from §4.3–4.6 (heading, links/focus, ordering, count labels) + §6.4 (Stats table) + `brand.md`; added **no token**. **Rejected:** stopping for a design phase (the brief pre-resolves all content — only visual direction was missing, and the archive already settles that for tables); designing something new (drift). **Logged: yes.** ⚠️ **Consequence: this page ships without a design review.**
- **D-2.04-3 · Sections keep their heading + an empty notice; they do not self-omit.** `/statistika` has three sections and no hero, so literal self-omission (D-2.02-3) would render an H1, a paragraph, then the footer. Kept the philosophy (never fabricate), rejected the mechanism. **Rejected:** omitting each section (near-blank page reading as broken); one page-level notice (wrong the moment one section populates); an empty table with headers (implies "queried, found nothing" rather than "not entered yet"). **Logged: yes.**
- **D-2.04-4 · GD and win % computed — aggregate band only, never a table column.** Direct conflict: the brief **requires** them; handover §15 says goal difference „must not be computed". Read §15 in its own scope — it governs the `finalTable` standings table whose columns are exactly the locked fields (`StandingsTable` still has no GD column). The all-time band is derived arithmetic by definition. **Rejected:** omitting both (guts the band over a line scoped elsewhere); adding GD to the per-season table (squarely what §15 forbids). **Logged: yes.**
- **D-2.04-5 · Unknown values sort last in both directions.** A null is unknown, not small — treating it as 0 would put a player whose appearances were never entered at the top of an ascending „fewest" sort. **Rejected:** null-as-0 (invents a fact); strict comparator symmetry; dropping rows with a null in the sorted column (their other numbers are real archive data). **Logged: yes.**
- **D-2.04-6 · Fixture-verified, not content-verified.** Anticipated by the brief. Verified the empty states against **real** content and the tables against a temporary in-file fixture, stripped before commit. **Rejected:** publishing test content to the shared live `production` dataset (invented numbers, not this phase's call); shipping the aggregate unverified. **Logged: yes.**

## 4. Deviations from the brief

- **The brief's central spec reference does not exist.** It directs the executor to "the Phase 2.02 design handover … the section covering the Statistics page" and warns (via D-2.03-1) to build strictly to the merged handover. The merged handover **§15 Out of scope** reads: „**Not designed:** Legends, Statistics, About, Contact, and the person detail page (`/legendi/<slug>`) — 2.04/2.05." There is no Statistics section, layout, or mockup. Resolved per **D-2.04-2**. **This is the second consecutive brief whose spec references don't match the repo** (cf. D-2.03-1, where the brief cited a superseded draft). **Flagged to the orchestrator: both briefs should be regenerated before they are kept as instruction history.**
- **The brief's summary-band requirement conflicts with handover §15** on computing goal difference. Resolved per **D-2.04-4** (band only, never a column) rather than escalating — the scoping reading is clean and the entry makes it cheap to reverse.
- **"Following the 2.03 self-omit philosophy" was honoured in spirit, not mechanism** — per **D-2.04-3**.
- **`src/lib/stats.ts` is a new lib file**, not named in the brief's "Outputs & where they go" (which lists only the route + `src/components/stats/*`). The aggregation is presentation-free and belongs beside `src/lib/archive.ts`, and keeping it out of the components is what lets it survive a future restyle. `file-map.md` synced.
- Nothing was cut. Every DoD item is addressed.

## 5. Changed files / deliverables

**Added:**
- `src/app/(site)/statistika/page.tsx` — the route: server component, ISR 60, one GROQ round trip with three reads, three sections, empty/coverage states.
- `src/components/stats/StatTable.tsx` — **the only client component**: sortable `<button>` headers, `aria-sort`, unknowns-last comparator, archive Stats-table styling, mobile scroll frame + sticky first column.
- `src/components/stats/BalanceSummary.tsx` — the 10-figure all-time band.
- `src/components/stats/StatsEmptyNotice.tsx` — a section's empty state (structural copy + placeholder chip).
- `src/lib/stats.ts` — `aggregateClubBalance` + `formatGoalDifference` / `formatWinRate`; presentation-free.

**Edited:** `src/_project-state/current-state.md`, `decisions.md`, `file-map.md`.
**Unchanged (deliberately):** everything under `src/sanity/` (no model change; `match.ts` still unregistered), `brand.md` (no token needed), `package.json` (no dependency).

**Branch:** `phase-2.04-statistics` → **PR:** https://github.com/DinovLazar/belasica-v2/pull/14

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers (**PL-12 / PL-13** added for the three visible Statistics chips; two new Known issues: the non-existent handover section, and fixture-verification)
- [x] `NEXT:` line set to: `NEXT: 2.05 — People & pages design`
- [x] `file-map.md` synced (5 files added)
- [x] `00_stack-and-config.md` — **not touched; correct**: no dependency was added or upgraded

## 7. Risks, surprises, what the next phase needs to know

- **The surprise: the brief's spec reference didn't exist.** Two briefs in a row have now cited handover content that isn't in the repo. The pattern is worth fixing upstream, not just per-phase — an executor following either brief literally would ship AA failures (2.03) or invent a design (2.04). **The repo is the spec; briefs are drifting from it.**
- **`/statistika` ships without a design review** (D-2.04-2). It is a faithful extension of the archive's table language, but no one designed it. **If 2.05 produces a Statistics/Legends design that disagrees, only `src/components/stats/*` changes** — `src/lib/stats.ts` is presentation-free and survives.
- **The balance aggregate is the one place this page could produce a confidently wrong number, and it is unproven against live data** (D-2.04-6 / OV-4). Its honesty rails are built and fixture-tested: per-metric `contributing` counts detect a partial aggregate, seasons whose table names no Беласица row are excluded **and disclosed**, and win % returns `—` rather than `0` when either half of the fraction is missing. But no real `finalTable` has ever gone through it.
- **For 2.05:** `/statistika` links every ranked player to `/legendi/<slug>` — those 404 until 2.05 ships, which is expected and matches the season page's behaviour (handover §6.5). The moment 2.05 lands, the statistics tables become an entry point into the person pages.
- **For 2.09:** this page is a shape waiting for content. No per-player or per-season work is needed — ingestion populates it. Worth publishing **one** season with a `finalTable` early in 2.09 to clear OV-4 before ~74 land.

- **⚠️ The Vercel preview never deployed, and the phase was merged without it** (D-2.04-7, §2) — so unlike 2.03, **no preview URL is on record for this phase** and the page was verified only on `localhost:3000`. Confirming production is owed (**OV-5**). If a future phase hits the same outage, the retrigger to try is an empty commit; if that fails too, only a Vercel-dashboard redeploy (owner-only) is left.

**5-item eyeball checklist for Lazar** (run against production once Vercel catches up — see OV-5):

1. **`/statistika` loads** and the `Статистика` nav link resolves to it (was a 404).
2. **All three sections show an empty notice + a `[PLACEHOLDER: …]` chip** — no zeros, no empty table shells, no invented rows. **Expected, not a bug.**
3. **Type/spacing match the archive** — orange rule marker over a serif navy H2, same section rhythm as `/arhiva`.
4. **375 mobile** — the page never scrolls sideways; nothing overflows.
5. **The page reads as honestly incomplete, not broken** — the copy says the data isn't entered yet, not that the club has no history.

> To see the tables populated: publish one season with a `finalTable` or one player with `careerStats` in `/studio` — the page fills itself within ~a minute (ISR 60). This also clears OV-4.

---

## Addendum · 2026-07-17 · OV-5 resolved — production is live

> Appended after filing. The report above stands as written; this records what changed.

The Vercel/GitHub outage described in §2 and D-2.04-7 **cleared on its own**, and `main` deployed without anyone triggering a redeploy. Verified by direct check:

- `https://belasica-v2.vercel.app/statistika` → **200**, serving the real page: all three headings (`Најдобри стрелци`, `Најмногу настапи`, `Севкупен биланс на клубот`) and the three expected `[PLACEHOLDER]` chips (`голови по играч`, `настапи по играч`, `конечни табели по сезони`).
- `https://belasica-v2.vercel.app/` and `/arhiva` → **200**. No route regressed.

**OV-5 is resolved; no owner action is needed.** The risk D-2.04-7 accepted — that a Vercel-only failure (env vars, image domains, ISR on their runtime) would surface first in production because the page had never been served by Vercel — **did not materialise**; production matches what was verified on `localhost`. The waived preview gate cost nothing here, but it remains a one-off waiver for a third-party outage, not a precedent.

**Still open: OV-4.** This addendum clears the *deployment* gap only. The tables, summary band and sorting have still **never rendered from real content** — the live page correctly shows its empty notices, which is exactly why OV-4 stands. The 5-item checklist above is now runnable against production; items 2–5 are the ones it can actually confirm today.

## 8. What's now possible that wasn't before

The archive has its statistics layer — the thing the reference site is known for — built ahead of its data, so 2.09's ingestion fills it automatically, and five of six top-level nav links now resolve.
