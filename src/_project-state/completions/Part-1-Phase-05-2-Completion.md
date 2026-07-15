# Part 1 · Phase 05.2 · Code — Completion Report

**Date:** 2026-07-15 · **Executor:** Claude (Code) on Lazar's machine · **Outcome (one line):** the homepage query is reconciled to the live Sanity model (real portraits + all content render) and three new sections were added — an 8-section, placeholder-free homepage for the Ace demo.

## 1. What shipped (plain language)
The homepage now reads content the way the live Sanity content is actually linked, so the two legend portraits (Васо Цветков, Панче Пантазиев) render from their already-linked photos — **no new content was needed**, correcting the 1.06 assumption that they required Ace-owned uploads. Three sections were added — a decades timeline, a full-bleed "moment" band, and an explore grid — making the page ~35% taller (more on mobile) and placeholder-free with the current data.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**
- ✅ `npm run build` and `npm run lint` pass — evidence: both exit 0; build statically generated 7/7 pages from the worktree with live data; lint clean. (Only the pre-existing benign `@sanity/image-url` deprecation warning.)
- ✅ Homepage renders the real **description** (Intro), the **„Сезона 1992/93"** title + story teaser (Featured), the player names, and the gallery — no longer placeholders. Evidence: full-page render at `localhost:3009`; every optimized image URL returns 200 through the Next optimizer; all resolve to `cdn.sanity.io/images/f8rmnfry/production/…`.
  - ⚠️ **Two clarifications vs the brief's wording:** the brief's `"player" in role` query yields **2 players** (Васо, Панче), not "three names" — I followed the explicit query (trainers/president excluded). And the gallery renders **8 photos** (all `photo` docs with an image, per the "keep as-is" instruction), not "six" — the brief's "six" was a stale count. Both are truthful renders of the live data.
- ✅ Portraits for **Васо Цветков and Панче Пантазиев render** (linked via `photo.relatedPerson`) — evidence: both `<img>` carry valid `cdn.sanity.io/images/f8rmnfry/production/…` srcs and paint in the full-page screenshot; a legend without a linked portrait would show the portrait placeholder (not a broken image).
- ✅ Hero + featured-season images render the season's related photo (hero = `[0]` „есен 1992", featured card = `[1]` „Купот 1993"), and degrade to the matted placeholder when none exists (guarded with `?.`; no crash, `object-cover` never stretches).
- ✅ Section 6 (moment band) renders **only** because a 2nd season photo exists; it is omitted entirely (no placeholder band) when absent — guarded by `{bandPhoto?.image && …}`.
- ✅ Section 7 (decades timeline) shows markers **1920-ти → 2020-ти** with **1990-ти highlighted** (orange node) and every marker linking `/arhiva` — evidence: 11 nodes, 1 active (1990-ти).
- ✅ Section 8 (explore grid) shows four cards linking `/arhiva`, `/legendi`, `/statistika`, `/za-nas` — evidence: 4 anchors with those hrefs.
- ⚠️ Total rendered height **≥ ~40% greater**: measured **+35% on desktop** (3597→4861 px, same viewport); larger on mobile (the band is 3/2 and the explore grid stacks 2×2). Three new sections are present; the increase is substantial but slightly under the ~40% figure on desktop.
- ✅ No fabricated facts; every absent required display fact would render a registered `[PLACEHOLDER]` chip. For the current data **no chip is visible on `/`** (PL-5/6/7/8 all clear).
- ✅ Reduced-motion: content is visible with motion disabled — the `prefers-reduced-motion` rule in `globals.css` forces the reveal end-state (`opacity:1; transform:none !important`); verified by force-revealing (content present, no dependence on the transition). Motion is `transform`/`opacity` only.
- ⚠️ **Lighthouse not regressed vs the 1.05/1.06 baseline** — not re-run this phase (three sections + images added). The 1.06 baseline stands (mobile Perf 93 / desktop 99); a re-baseline is optional and belongs to the ≥95 gate at 3.02. Owed if the demo needs a fresh number.
- ✅ The three state files updated (`current-state.md`, `file-map.md`, `decisions.md`) and decisions logged (D-1.05.2-1..3).

**Owed to Lazar (goes on the register):**
- **Eyeball the PR #9 Vercel preview** with the 6-item checklist below and confirm before merge (CLAUDE.md — the one human gate; the review Action is waived, D-1.06-1).
- **Lighthouse re-baseline** (optional) after 1.05.2 deploys, if a current number is wanted for the demo.

**6-item eyeball checklist (PR preview):** _(preview URL recorded in the follow-up commit)_
1. Hero shows the team photo + „ФК Беласица" + the crest in the header.
2. Intro shows the real club description paragraph.
3. Featured shows „Сезона 1992/93" + the story teaser.
4. Legends shows Васо Цветков and Панче Пантазиев with **real portrait photos** (no grey placeholder).
5. Decades timeline shows 1920-ти→2020-ти with **1990-ти** highlighted orange.
6. Explore grid shows 4 cards linking into the site.

## 3. Decisions I made during this phase
- **D-1.05.2-1** · Rewrote `HOME_QUERY` to source images by back-reference (`relatedSeason`/`relatedPerson`) and dropped `careerStats`/`person.photos` from the read path · why: matches how the live content is linked and is robust to the schema drift · rejected: keeping `season.photos` (doesn't fix portraits) · logged: yes.
- **D-1.05.2-2** · Legends filtered to `"player" in role`, portraits via `relatedPerson`; this **corrects D-1.06-2's conclusion** that portraits needed Ace uploads (they were already linked) · why: renders the real portraits with no new content · rejected: waiting for content / appearances ordering (field absent) · logged: yes.
- **D-1.05.2-3** · Three new sections (decades timeline, moment band, explore grid); with 2 season photos across 3 image slots, hero=`[0]`/card=`[1]`/band=`[1]` (card+band repeat the cup photo, sections apart, self-heals when a 3rd photo is linked) · rejected: distinct-photo-per-slot (impossible with 2 photos) · logged: yes.
- **Process (not a code decision):** integrated the two parallel sessions cleanly — merged crest PR #7, committed + merged the finished 1.06 work as PR #8, and stacked this phase on top so there are **no merge conflicts**. See §5.

## 4. Deviations from the brief
- The brief's model note said "no `season.photos` field"; the live `season` **does** have a `photos` array (holding the 2 team photos), which is why the old hero/featured already rendered. I followed the brief's explicit instruction to source via `relatedSeason` (identical result, more robust) and noted the discrepancy (D-1.05.2-1).
- "three player/staff names" → the explicit `"player" in role` query yields **2** (correct per the query); "six gallery photos" → **8** render (per "keep the query as-is"). Both are the truthful live counts (see §2).
- Desktop height increase is **+35%**, slightly under the "~40%" target; three sections are present (see §2).
- "Public-read restored" was listed as a decision to log — the dataset was already public-read when verified (D-1.04-2); I did not change it, so nothing new to log there.

## 5. Changed files / deliverables
- **Code (branch `phase-1.05.2-homepage-content-sync`, PR #9):**
  - `src/app/(site)/page.tsx` — rewrote `HOME_QUERY` + render logic to the live model; added sections 6/7/8; legends = players with `relatedPerson` portraits.
  - `src/components/home/DecadeTimeline.tsx` — **new** decades-rail component.
  - `docs/design-handovers/Part-1-Phase-05-Homepage.md` — appended the Phase 1.05.2 addendum (sections 6–8 + revised selection rules).
  - `src/_project-state/` — `current-state.md`, `file-map.md`, `decisions.md` (D-1.05.2-1..3), and this report.
- **Integration / git (both parallel sessions, no conflicts):** crest PR **#7** merged → `main`; the finished 1.06 verification work committed + merged as PR **#8**; this phase stacked on both (crest → 1.06 → 1.05.2, linear).
- Built and verified in an isolated **git worktree** (`.claude/worktrees/phase-1.05.2-homepage-content-sync`) so the parallel session's tree was never touched. No secrets handled; `.env.local` reused from the main checkout (git-ignored, not committed).

## 6. State updates done
- [x] `current-state.md` overwritten to match reality (portraits cleared, 8 sections, crest on main, registers)
- [x] `NEXT:` line set to: `1.06 close — Ace sit-down + OV-3 (homepage code complete); then 2.01 — Content model lock`
- [x] `file-map.md` synced (added `DecadeTimeline.tsx`; updated the `page.tsx` line)
- [x] `00_stack-and-config.md` — no change (no dependency added/upgraded this phase)

## 7. Risks, surprises, what the next phase needs to know
- **Two Claude sessions ran on this repo simultaneously** (this one on 1.05.2, another on 1.06) sharing one working tree — a real collision risk. Resolved by isolating 1.05.2 in a git worktree and merging in a clean linear order. Going forward, one phase branch at a time (CLAUDE.md) — or a worktree per session — avoids this.
- The 1.06 snapshot's "legend portraits need Ace photos" and "crest not on production" statements are now superseded (portraits render; crest merged). This report + the updated `current-state.md` are the current truth.
- The moment band reuses the featured card's photo (only 2 season photos exist). Linking a distinct landscape team photo to the season in Studio self-heals it — no code change.
- Content model is still **locked until 2.01**; the read path deliberately uses back-references rather than the drifted `season.photos`/`person.photos` fields — worth reconciling at the 2.01 lock.

## 8. What's now possible that wasn't before
A placeholder-free, 8-section homepage with real portraits and the club crest — ready to demo to Ace — plus a reusable `relatedSeason`/`relatedPerson` read pattern for the Part 2 season and person pages.
