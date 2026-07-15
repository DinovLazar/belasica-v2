# Part 1 · Phase 06 · Ops — Completion Report

> Save as: `src/_project-state/completions/Part-1-Phase-06-Completion.md`. One phase = one report. Filing this report and syncing `current-state.md` is what closes the phase.
>
> **STATUS: DRAFT — phase NOT yet closed.** The automatable verification + demo-kit prep are done and recorded below. Three items are human-gated and remain open before close: **Task 2** (load 5 legend portraits — needs Ace-owned photos), **Task 7** (the Ace sit-down → fill `feedback.md`), and **OV-3** (footer wording, confirmed with Ace at the sit-down). Finalize the ⚠️ rows, set `current-state.md` `NEXT:` → `2.01`, then this report closes Part 1. See `current-state.md` → "Remaining human steps".

**Date:** 2026-07-15 · **Executor:** Claude (Opus 4.8), on Lazar's machine (automatable portion) · **Outcome (one line):** the live homepage is confirmed rendering real published content in every section (only the legend-portrait content is still to be uploaded), the read-path "empty homepage" blocker is diagnosed as resolved (no fix needed), a Lighthouse baseline is captured, and the Ace demo kit is built and staged for the sit-down.

## 1. What shipped (plain language)

The Phase-1.06 opening blocker — "the live homepage shows all placeholders even though content is published" — was investigated and found **already resolved**: https://belasica-v2.vercel.app renders the real hero photo, the club description, the featured season „Сезона 1992/93", the legends, and the 8-photo gallery, all from live Sanity content. The one remaining placeholder on the page is the **legend portraits** (a content upload, Task 2 — a human step), not a read fault. A Lighthouse baseline was recorded for desktop and mobile, and the **Ace demo kit** (`docs/ace-demo/`) — walkthrough script, feedback template, and full-page screenshots — is ready for the sit-down.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ⚠️ **Live homepage renders real content in all five sections (no `[PLACEHOLDER]` anywhere).** — Four of five sections are clean and confirmed on the live HTML + screenshots: hero photo, intro description, featured season „Сезона 1992/93", 8-photo gallery. **The Legends section still shows 3 `[PLACEHOLDER: портрет]` chips** because no `person` has a portrait uploaded — clears with **Task 2** (human). The read-path itself is fully working.
- ✅ **Root cause of the empty read identified and fixed via Vercel config (or escalated).** — Identified; **it was not an env/config fault.** The deployed build's `NEXT_PUBLIC_SANITY_*` are correct — every image URL on the live page resolves to `cdn.sanity.io/images/f8rmnfry/production/…`, which a wrong projectId/dataset could not produce. Root cause was a stale ISR/CDN cache of the pre-content-load empty state, self-healed on revalidation (`revalidate = 60`). **No env change, no redeploy, no code edit** were required or made. Logged as **D-1.06-2**. (The brief's Task-1.5 escalation to a Code fix brief was therefore not triggered.)
- ❌ **All 5 legends show a portrait photo (no grey portrait frames).** — Not done: needs Ace-owned portrait photos and human judgment on which face maps to which legend (content-truth — cannot be auto-assigned). **Task 2**, owed to Lazar. Exact Studio steps in `current-state.md` → "Remaining human steps" (portrait = `person.photos[0]->image`).
- ✅ **Lighthouse baseline recorded (Performance, Accessibility, Best Practices, SEO) for mobile + desktop.** — Captured with Lighthouse **v13.4.0** against `https://belasica-v2.vercel.app`, 2026-07-15:

  | Form factor | Performance | Accessibility | Best Practices | SEO |
  |---|---|---|---|---|
  | **Mobile** | 93 | 100 | 96 | 100 |
  | **Desktop** | 99 | 100 | 96 | 100 |

  Key metrics — Mobile: FCP 1.0s, **LCP 3.2s**, TBT 30ms, CLS 0. Desktop: FCP 0.3s, LCP 0.9s, TBT 0ms, CLS 0. (PageSpeed Insights API was rate-limited (429, shared anon quota), so the baseline was taken with the local Lighthouse CLI + installed Chrome — same engine/metrics.) **Baseline only** — the ≥95 gate is Phase 3.02; the two sub-95 metrics (mobile Perf 93, Best-Practices 96) are noted for 3.02.
- ✅ **Placeholder register updated: PL-5..PL-8 reviewed on the live site; PL-1..PL-4 left as-is.** — PL-5 (intro), PL-6 (featured season), PL-8 (gallery) **confirmed cleared** on the live homepage. **PL-7 (legend portraits) left OPEN** — pending Task 2. PL-1..PL-4 unchanged (clear in 3.03/3.04). Register updated in `current-state.md`.
- ✅ **Part 1 review-gate reconciliation logged as D-1.06-1 (Action gate waived, ratifying D-1.01-4).** — Logged in `decisions.md`.
- ✅ **`current-state.md` points Phase 2.02 and 2.05 at `docs/ace-demo/feedback.md`.** — Added under "What's now possible".
- ⚠️ **`docs/ace-demo/` contains `walkthrough.md`, a completed `feedback.md`, and the demo screenshots.** — `walkthrough.md` ✅, `screenshots/homepage-{desktop,mobile}.png` ✅ (full-page live captures), `feedback.md` ✅ as an **empty capture template** — it is **completed at the sit-down** (Task 7, human). Retake the screenshots after portraits load.

**Owed to Lazar (human-gated — see `current-state.md` → "Remaining human steps"):**

- **OV-3 — footer wording.** Reviewed and left **open with a plan**: confirmed/corrected by Ace at the sit-down (the walkthrough asks him explicitly). Current live wording is quoted in `walkthrough.md`/`feedback.md`. On confirmation → mark VERIFIED in `facts.md`; a correction ships via a **separate Code PR**.
- **Task 2 — load 5 legend portraits** in `/studio`, then confirm the 3 portrait chips are gone on `/`.
- **Task 7 — run the Ace sit-down**, capturing his words into `feedback.md`.
- **Close-out** — finalize this report's ⚠️ rows, set `current-state.md` `NEXT:` → `2.01 — Content model lock`, commit + push.

## 3. Decisions I made during this phase

- **D-1.06-1** · Close Part 1 without the Claude Code Action review gate (ratifies D-1.01-4); the Vercel PR preview is the surviving safety rail. Logged: **yes**.
- **D-1.06-2** · The "empty homepage" at phase open was a stale ISR/data-cache state, not an env misconfiguration; diagnosed from the live render (correct `f8rmnfry/production` image URLs + all published content). No redeploy or code change made. Logged: **yes**.
- **No production redeploy triggered.** The brief's Task 1.3 (clean redeploy, cache off) presupposed a broken read-path; since the page already renders correctly, forcing a production deploy would be an unnecessary outward action fixing a non-existent problem. Folded into D-1.06-2.

## 4. Deviations from the brief

- **Task 1 executed as diagnosis, not repair.** The read-path was already working, so the env-var confirmation/redeploy steps were unnecessary; documented why (D-1.06-2) rather than performing a no-op redeploy.
- **Lighthouse via the local Lighthouse CLI**, not pagespeed.web.dev — the PSI API returned 429 (shared anonymous daily quota). Same Lighthouse engine and metrics; noted above.
- **Tasks 2, 7 (and OV-3) are human-gated and not executed by the assistant.** Task 2 needs Ace-owned photos + human mapping (content-truth); Task 7 is the in-person Ace sit-down; OV-3 resolves there. All are staged with exact steps; none were faked. This is why the phase is filed as a **draft** and `NEXT:` stays `1.06`.
- **Found (out of scope, flagged not fixed):** the crest logo/favicon commit (`e5f05d5`) is on **local main only (unpushed)**; production is the pre-crest build, so the live demo shows the wordmark with no crest (and no broken image). Left for Lazar to decide (deploy before demo?) and to reconcile the direct-to-main commit vs. `origin/chore-crest-logo`. Recorded in `current-state.md` → Known issues.

## 5. Changed files / deliverables

- **Added (docs):** `docs/ace-demo/walkthrough.md`, `docs/ace-demo/feedback.md` (template), `docs/ace-demo/screenshots/homepage-desktop.png` (1440×3760), `docs/ace-demo/screenshots/homepage-mobile.png` (375×5532).
- **Added (state):** this report.
- **Edited (state):** `src/_project-state/current-state.md` (registers, read-path resolution, Lighthouse baseline, crest/git note, remaining-human-steps, 2.02/2.05 feedback pointer); `src/_project-state/decisions.md` (D-1.06-1, D-1.06-2); `src/_project-state/file-map.md` (ace-demo + this report).
- **No `src/` (application code) edits** — an ops/verification phase. No dependency changes.
- **Branch/PR:** none opened by this phase (docs/state only). Any code follow-ups (OV-3 wording correction, crest deploy) go through their own PRs.

## 6. State updates done (mandatory for Code phases)

- [x] `current-state.md` overwritten to match reality, incl. registers — **but `NEXT:` intentionally left at `1.06`** (phase not closed; human steps pending)
- [ ] `NEXT:` line set to `2.01 — Content model lock` — **deferred to close** (after the sit-down + portraits)
- [x] `file-map.md` synced (ace-demo docs + this report)
- [x] `00_stack-and-config.md` — no change (no dependency added/upgraded)

## 7. Risks, surprises, what the next phase needs to know

- **The demo depends on Task 2 first.** Load the 5 portraits before sitting with Ace, or the Legends section shows grey placeholder frames during the demo.
- **Crest not on production** (unpushed `e5f05d5`). Decide before the demo whether the club crest should be visible; it's a one-line git push + auto-deploy, but it changes the demo surface — Lazar's call.
- **In-app preview browser under-reports mobile page height** and freezes reveal transitions (matches the known quirk); screenshots were taken with headless Chrome + a force-reveal/height-splice workaround. Documented for future screenshot tasks.
- **Lighthouse is a baseline, not a gate.** Mobile Performance 93 (LCP 3.2s, the hero image) and Best-Practices 96 are the levers for Phase 3.02.
- **Part 1 closes with no automated code-review gate** (D-1.06-1 ratifies D-1.01-4) — accepted residual risk; the Vercel preview + owner review are the rails.

## 8. What's now possible that wasn't before

The homepage is a verified, populated content page ready to show Ace — and once his feedback lands in `docs/ace-demo/feedback.md`, Phases 2.02 and 2.05 have a real user signal to design the Part 2 pages against.
