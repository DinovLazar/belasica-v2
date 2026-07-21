Part 2 · Phase 08 · Code — Homepage finalization

Why this matters — the homepage was built and tuned when the site had exactly one season and eight photos. The archive now holds 96 seasons and 889 published photos, and the homepage's selection logic has not caught up: it is picking content that was never chosen, and showing a placeholder where a real archive stands behind it. This phase makes the homepage a truthful front door to the finished archive — the last build phase of Part 2.

Context

What already exists

* Phases 1.05 / 1.05.2 / 1.06b built the homepage as eight sections (hero → intro → featured season → decades timeline → legends → moment band → gallery → explore grid), reading live published Sanity content with ISR `revalidate = 60`. It has not been touched since.
* Phases 2.03 / 2.04 / 2.06 / 2.07 built every other route. The six-item nav is complete; nothing 404s.
* Phase 2.09 + 2.09-Run ingested the archive. Live `production` now holds:
   * 96 seasons (1922 → 2025-26) across 11 decades. Every season has a title, a decade, and at least one linked photo.
   * 889 published photos (881 ingested + 8 original demo photos). Every ingested photo has no `caption`, no `date`, and no `relatedPerson`. Each has a resolving `relatedSeason` and a `provenance` string reading „…Потекло и права за објавување НЕПОТВРДЕНИ…".
   * 7 persons. Two (Роберт Христовски, Љупчо Мафков) have real `careerStats`.
   * 1 season (`1982-83`) has a `finalTable`. No season has a `story`.

Read first, by path
Read these before writing any code. They are the spec; this brief does not restate them.

* `src/_project-state/current-state.md` — live snapshot, the NEXT line, both registers, Known issues.
* `src/_project-state/completions/Part-2-Phase-09-Run-Completion.md` — what ingestion actually did, and its five decisions `D-2.09R-1…-5`.
* `docs/ingestion/2.09-editorial-handoff.md` — the per-field content coverage table (§1) and the ten seasons flagged for spot-check (§7).
* `docs/design-handovers/Part-1-Phase-05-Homepage.md` — the approved homepage layout spec. The homepage's visual design is settled and is not reopened by this phase.
* `brand.md` — the only source of design tokens.
* `facts.md` — the only legal source for factual claims on the site.
* `CLAUDE.md` — repo rules.
* `src/app/(site)/page.tsx` — the file this phase changes.

Verify your inputs before you start
This repo has a documented history of briefs citing spec files or decision IDs that do not exist (see `current-state.md` §Known issues: `D-2.03-1` → `D-2.04-2` → `D-2.06-1`, three occurrences). Task 0 below is the cheap fix. If a path in this brief does not resolve, stop and report it rather than substituting your own source.

Scope

In scope

* `src/app/(site)/page.tsx` — `HOME_QUERY` and the selection logic that consumes it.
* A thin, named editorial content slice: captions in Sanity Studio for the specific photos the homepage surfaces.
* `facts.md` — recording the owner's rights confirmation (Task 7).
* `docs/ace-demo/screenshots/` — regenerating the two stale demo screenshots.
* The three state files + this phase's completion report.

Out of scope — do not touch

* Any schema change. The content model is locked (Phase 2.01). No new field on `season`, `person`, `photo` or `siteSettings` — including a curated-featured-season reference. This was considered and deliberately rejected (see Decisions, below).
* `/arhiva`, `/arhiva/<slug>`, `/statistika`, `/legendi`, `/legendi/<slug>`, `/za-nas`, `/kontakt` — no route other than `/` changes.
* `brand.md` — no new token. `globals.css` — no new utility.
* `SiteHeader`, `SiteFooter`, `Container`, and every component under `src/components/archive/`, `src/components/stats/`, `src/components/legends/`, `src/components/contact/`.
* Any new dependency.
* The full editorial pass (96 season stories, final tables, squads, trainers, remaining career stats). That is a separate phase; this brief takes only the caption slice named in Task 5.
* Confirming the nine `manual-title` seasons (`1922-26`, `1926-1930`, `1945-48`, `1942`, `1943`, `1944`, `1950`, `1951`, `1952`). Owner spot-check, tracked separately.
* Formspree / `NEXT_PUBLIC_FORMSPREE_ENDPOINT` — clears at 3.03.
* Lighthouse remediation. Measure and record only; the ≥95 gate is Phase 3.02.

Decisions already made — build to these, do not re-litigate
These were resolved by the orchestrator with the owner. Log each in `decisions.md` under this phase's namespace (`D-2.08-n`) with its rejected alternative and accepted downside.

1 · Photo rights are confirmed; all 889 photos stay public. The owner confirms the project holds the rights to all archive photos. OV-RIGHTS closes this phase (Task 7). The homepage draws from the full published photo set with no restriction. Rejected: restricting the homepage to the 8 original Ace-owned photos, and un-publishing the 881 back to drafts — both were live options and both were declined by the owner. Downside accepted: the `provenance` string on all 881 ingested photos still reads НЕПОТВРДЕНИ, so the per-document record now lags the owner's confirmation. Task 7 fixes this at the `facts.md` level only; a bulk `provenance` rewrite is a separate ingestion-tooling job, not this phase.

2 · The featured season stays automatic. The story teaser self-omits. Featured season remains "newest first" — `order(decade desc, title desc)[0]` — which today resolves to `2025-26`. No season has a `story`, so the featured section must omit its teaser paragraph entirely rather than render a `[PLACEHOLDER: приказна за сезоната]` chip. Rejected: pinning a hand-picked season slug as a code constant, and adding a `featuredSeason` reference to `siteSettings` (a schema change on a locked model). Downside accepted: the featured season is whatever is newest, not what a curator would choose, and its block is thinner than designed until stories exist.

3 · Photo selection becomes deterministic, and captions drive curation. Every ingested photo has a null `date` and a null `caption`, so the current `order(coalesce(date, "9999") asc, caption asc)` produces an effectively arbitrary result that can shuffle between reads. New ordering rule, applied to both the featured season's photos and the gallery:

1. photos with a non-empty `caption` first,
2. then by `date` ascending (nulls last, as today via `coalesce`),
3. then by `_id` ascending as a stable final tiebreak.

This makes the homepage's hero, moment band and gallery reproducible across builds, and it makes captioning a photo in Studio the lever that promotes it onto the homepage — curation without a schema change. Rejected: leaving the ordering as-is (non-reproducible hero), and adding a `featured`/`order` field to `photo` (schema change). Downside accepted: until captions land, the hero is stable-but-arbitrary.

4 · The content slice is captions only. Task 5 captions only the ~10 photos the homepage actually surfaces. No season stories, no final tables, no squads. Rejected: transcribing a season story for the featured block (unnecessary once decision 2 makes the teaser self-omit), and bundling the full editorial handoff (many hours of transcription, blocks 2.10). Downside accepted: the featured-season block ships without a story.

Tasks

0 · Verify inputs. Confirm every path in §Read first resolves in the repo, and that `D-2.09R-1…-5` all exist in `src/_project-state/decisions.md`. Report any that do not and stop — do not substitute a different source.

1 · Branch. Cut `phase-2.08-homepage-finalization` from an up-to-date `main`. Pull first (two-machine rule). One phase branch at a time.

2 · Establish the current live baseline. Before changing anything, load the deployed production homepage and record exactly what it renders today: which season is featured, whether a placeholder chip is visible and which one, which photos appear in the hero / moment band / gallery, and how the decades timeline looks with all 11 decades active. This baseline goes in the completion report — it is the evidence that the regression this phase fixes was real.

3 · Rewrite `HOME_QUERY`'s selection logic.

* Apply the decision-3 ordering to the featured season's `seasonPhotos` and to `gallery`.
* Keep the featured-season selector as `order(decade desc, title desc)[0]`.
* Keep `legends` as players-only ordered by name, and `decades` as `array::unique(...)`.
* Confirm the query still returns in one round trip and that it performs acceptably against 889 photo documents — if `gallery` scans the full photo set, constrain it in the query rather than slicing in JS.

4 · Make the featured section degrade correctly.

* When the featured season has no `story`, render the section without the teaser paragraph and without a placeholder chip. Title, decade line, photo and the „Погледни ја сезоната" link all still render.
* Every other placeholder branch on the page stays exactly as it is. Do not remove `PlaceholderChip` usages that are still correct.

5 · Caption the surfaced photos (the content slice).

* After Task 3, print the ordered list of `_id`s the homepage now surfaces: the featured season's photos `[0]` (hero) and `[1]` (moment band), plus the ten gallery photos. This list is a deliverable — put it in the completion report.
* In `/studio`, add a Macedonian `caption` to exactly those photos, then publish.
* Content-truth rule for captions, no exceptions: a caption may describe only what is plainly visible in the image. Any name, date, score, opponent, or competition must come from `facts.md` or from a source document named in `docs/ingestion/2.09-editorial-handoff.md` §6. If a photo cannot be captioned truthfully from those sources, leave its caption empty — the `figcaption` already self-omits. Do not use `Беласица - младинска школа и Виареџо…docx` (Ace's own „don't take the text from here" note).
* Re-run the homepage and confirm the captioned photos now sort to the front per decision 3.

6 · Check the decades timeline against 11 active decades. `DecadeTimeline` was built and verified when one decade was active. Render it with all 11 and confirm it is legible and does not overflow at 375. Fix only if it is broken; this is not a redesign.

7 · Close OV-RIGHTS in `facts.md`. Record the owner's rights confirmation as a VERIFIED entry, dated, with the owner named as the source, and note that the 881 ingested photos' `provenance` strings still read НЕПОТВРДЕНИ and lag this confirmation. Then move OV-RIGHTS to the Resolved section of the owed-verification register in `current-state.md`, citing this phase.

8 · Retake the demo screenshots. Regenerate `docs/ace-demo/screenshots/homepage-desktop.png` and `homepage-mobile.png` from the finished page (1280 and 375). This clears the open housekeeping item in `current-state.md` §Remaining human steps #6.

9 · Verify. `npm run build` and `npm run lint` clean. Render `/` at 1280 and 375. Check every new or changed text/background pair against WCAG 2.2 AA (≥ 4.5:1) and report measured ratios. Confirm `/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt` all still return 200 and are visually unregressed. Record a fresh Lighthouse mobile + desktop run on `/` as a baseline for 3.02 — record only, do not optimize.

10 · Ship. Open a PR to `main` from the phase branch. Obtain the Vercel preview URL and verify `/` renders correctly on it at 1280 and 375 before requesting merge. The D-2.04-7 waiver was a one-off third-party outage, not a precedent — if no preview appears, push an empty commit to retrigger, and if that fails, report it rather than merging blind.

11 · Close state. Update `current-state.md` (including the `NEXT:` line, both registers, and Known issues), `file-map.md`, and `decisions.md` (`D-2.08-n` for each decision above plus anything you decided yourself). `00_stack-and-config.md` should not change — no dependency is added. File the completion report.

Definition of Done

Verifiable by the executor

* [ ] Every path in §Read first resolved; `D-2.09R-1…-5` all exist in `decisions.md` (Task 0).
* [ ] The pre-change production baseline is recorded in the completion report: featured season, any visible placeholder chip, and the hero / band / gallery photos as they rendered before this phase.
* [ ] `HOME_QUERY` orders the featured season's photos and the gallery by: non-empty `caption` first → `date` ascending (nulls last) → `_id` ascending. Two consecutive cold reads return the same hero, moment-band and gallery photos, in the same order — demonstrated, not asserted.
* [ ] The featured season is still selected as `order(decade desc, title desc)[0]`; the completion report names which season that resolves to today.
* [ ] With the featured season having no `story`, the featured section renders title + decade + photo + season link, and no teaser paragraph and no `[PLACEHOLDER: приказна за сезоната]` chip — verified in the rendered DOM.
* [ ] The ordered list of surfaced photo `_id`s (hero, moment band, 10 gallery) is in the completion report.
* [ ] Each of those photos either carries a Macedonian caption traceable to `facts.md` or a named source doc, or is deliberately left uncaptioned — the report states which, per photo, with the source for every caption written.
* [ ] No caption asserts a name, date, score, opponent or competition that is not in `facts.md` or a named source document.
* [ ] Captioned photos verifiably sort ahead of uncaptioned ones on the live page after publishing.
* [ ] `DecadeTimeline` renders all 11 active decades legibly at 1280 and 375 with no horizontal page overflow.
* [ ] `facts.md` carries a dated VERIFIED rights entry naming the owner as source, and noting that the 881 `provenance` strings still read НЕПОТВРДЕНИ.
* [ ] OV-RIGHTS is moved to Resolved in `current-state.md`'s owed-verification register, citing this phase.
* [ ] `docs/ace-demo/screenshots/homepage-{desktop,mobile}.png` are regenerated from the finished page.
* [ ] `npm run build` and `npm run lint` both clean; build output quoted.
* [ ] `/` renders at 1280 and 375 with no horizontal page scroll.
* [ ] Every new or changed text/background pair measures ≥ 4.5:1; measured ratios listed.
* [ ] `/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt` all return 200 and are visually unregressed.
* [ ] Lighthouse mobile + desktop scores for `/` recorded as a 3.02 baseline (recorded, not gated).
* [ ] No schema change: `git diff main --stat` touches nothing under `src/sanity/`.
* [ ] No new dependency: `package.json` and `package-lock.json` unchanged.
* [ ] No new `brand.md` token; `globals.css` unchanged.
* [ ] Vercel preview URL obtained and `/` verified on it at 1280 and 375 before requesting merge; the URL is in the report.
* [ ] `current-state.md`, `file-map.md`, `decisions.md` updated; `NEXT:` set to `2.10 — Verification + preview`.

Owed to the owner (goes on the owed-verification register)

* [ ] Anything you could not verify yourself is written up as a numbered OV item with a plain-language "how the owner clears it" — not silently dropped.
* [ ] A 5-item eyeball checklist for the owner, in the PR body and repeated in the completion report.

Outputs & where they go

* Code: `src/app/(site)/page.tsx` (the only `src/` file this phase should need to change).
* Content: captions published in Sanity `production` via `/studio`.
* Docs: `facts.md` (rights entry); `docs/ace-demo/screenshots/homepage-{desktop,mobile}.png` (regenerated).
* State: `src/_project-state/current-state.md`, `file-map.md`, `decisions.md`.
* Completion report: `src/_project-state/completions/Part-2-Phase-08-Completion.md`
* Branch: `phase-2.08-homepage-finalization` → PR to `main`.
* Brief: save this file to `briefs/Part-2-Phase-08-Code.md`.

What the next phase needs
Phase 2.10 — Verification + preview is the Part 2 gate: a full preview walkthrough, a facts check, a `humanizer` pass across all copy, and a review of both registers. Leave it a completion report that says plainly which parts of the homepage are content-verified against real published documents and which are not — 2.10's job is to catch what this phase could only assert.
