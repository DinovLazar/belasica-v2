# Part 3 · `a11y-remediation` · Code — Completion Report

> Not a numbered phase and it has no brief in `briefs/`: the instruction was a standing accessibility-remediation prompt, and it names the branch `a11y-remediation` itself (D-a11y-1). Filed here so it sits with the other completion reports without claiming a phase number.

**Date:** 2026-08-20 · **Executor:** Claude Code (Opus 5), Lazar's machine · **Outcome (one line):** the site was audited against WCAG 2.2 AA across all 324 public URLs at two widths, twelve real defects were found and eleven fixed, and the evidence for every claim is committed rather than asserted.

## 1. What shipped (plain language)

Someone using this site with a keyboard could lose track of where they were: pressing Shift+Tab parked the thing they had just reached **entirely underneath** the blue bar at the top of the page. That is fixed, along with an invisible „clear search" button, an invisible separator between goalscorers, links that were told apart from ordinary text by colour alone, a contact form that threw the keyboard to the top of the page when you submitted it, and a handful of smaller things. The full account, written to be read without opening any code, is `docs/accessibility-report.md`.

Nothing about the design moved. Five of the seven page states screenshotted before and after are **pixel-identical**; the two that differ do so because a separator that nobody could see is now visible.

## 2. Definition of Done — verified-here vs owed to Lazar

The prompt's own Definition of Done, each item checked against the actual result.

**Verifiable by executor:**

- ✅ **Zero axe-core violations on every listed URL** — evidence: `docs/a11y-scan-after/axe-desktop.json` and `axe-mobile.json`, 324 pages each, `violations=0`, `errored=0`. Before: 141 pages affected at each width (`docs/a11y-scan-before/`).
- ⚠️ **Zero pa11y violations** — **91 remain, all `H43.HeadersRequired`, one per results table on 81 season pages, and they are documented as a justified false positive** (report §7, D-a11y-3). The checker's advice was implemented and reverted: given correct `headers` attributes it demands that an autumn fixture also name the spring half-season. Reproduced with no site code involved in `docs/a11y-scan-after/pa11y-H43-tbody-repro.html`. Before: 1.326 errors on 83 pages; the other three codes are gone.
- ✅ **Lighthouse accessibility ≥ 95 on the key pages** — 100 on `/`, `/arhiva`, `/legendi`, `/arhiva/1992-93`, `/statistika`, with no failing audits. Evidence: `docs/a11y-scan-after/lighthouse.json`. ⚠️ It was **also 100 before** (`docs/a11y-scan-before/lighthouse.json`) — see §7.
- ✅ **Clean build, no suppressed errors, no `console.log` debris, no focus outlines removed** — `npm run build` and `npm run lint` both clean; `npx tsc --noEmit` clean; no `eslint-disable` added; no `outline: none` anywhere. The one pre-existing `eslint-disable-next-line @next/next/no-img-element` in `SiteHeader` is untouched and unrelated.
- ✅ **Skip link, lang attribute, unique titles, single `<h1>` on every page** — checked in the rendered HTML of twelve page types: one `<h1>`, one `<main>`, no skipped heading levels, no duplicate `id`, every `<nav>` distinctly named. The 404's duplicate title was the one failure and is fixed.
- ✅ **All fixes use existing design tokens; visual design unchanged in screenshots** — `docs/a11y-scan-after/screenshots-fixed/`, pixel-diffed at identical absolute scroll offsets against `before/`: **0 differing pixels** on home, `/arhiva`, `/legendi`, `/statistika`, `/kontakt`. Season page differs by the now-visible separators plus a 1px table-height change; compensating for that one pixel leaves **6 differing pixels of 1.152.000**. No new colour, font or spacing value was introduced.
- ✅ **`docs/accessibility-report.md` written in plain language with the two open-items tables** — §6 „Needs your decision" and §8 „Requires human testing".
- ✅ **PR open on branch `a11y-remediation`, nothing merged.**

**Owed to Lazar (goes on the owed-verification register):**

- **No screen reader was run.** Every claim about what is *announced* is inferred from the markup and from Chrome's accessibility tree. Report §8 lists the five flows to test with VoiceOver (Cmd+F5), in priority order.
- **The contact form's live path was never exercised** — `NEXT_PUBLIC_FORMSPREE_ENDPOINT` is unset in this environment, so `idle → submitting → success | error` was fixed by reading the code. One real submission on the Vercel preview confirms it. ⚠️ This re-opens the ground OV-8 covered at 3.03b: the state machine changed.
- **Eyeball checklist on the Vercel PR preview (5 items):**
  1. `/legendi` — type „пан", then click the **✕**. The ✕ should be a visible grey, and the cursor should land back in the field.
  2. `/arhiva/1992-93` — in „Резултати", the **·** between two goalscorers should now be readable. In „Состав", a player name that is a link should carry a **navy** underline, not an invisible one.
  3. `/statistika` — scroll to „Најдобри стрелци по сезони", click a season link, then press **Shift+Tab** a few times. The focused link must never disappear under the blue bar.
  4. `/kontakt` — the form still looks exactly as it did (it is pixel-identical); submit it once for real.
  5. Any browser tab on a bad URL (e.g. `/nema-takva-stranica`) — the tab title should read **„Страницата не постои"**, not the homepage's title.
- **Report §6-A is an owner decision, not a developer one**, and it is the largest remaining gap: the league tables on 88 of 96 season pages are photographs of the book.

## 3. Decisions I made during this phase

All six are logged in `decisions.md`.

| ID | Decision | Why | Rejected alternative | Logged |
| --- | --- | --- | --- | --- |
| **D-a11y-1** | Branch `a11y-remediation`, not `phase-X.YY-<slug>` | The instruction names it twice, once as a checkable deliverable; this is cross-cutting work with no brief | Inventing `phase-3.37-…`, which would put a fake entry in the phase sequence | yes |
| **D-a11y-2** | `scroll-padding-top` on the scroller replaces all eleven `scroll-mt-*` | Only `scroll-padding` also offsets the **focus** scroll, which has no author hook — and the two **stack** (measured: 130 + 130 = 260px) | Keeping both; a JS focus handler | yes |
| **D-a11y-3** | Keep `scope`; document pa11y's 91 `H43` errors as a tool defect | Its own advice, implemented, produces a demand that is factually wrong about the data | Obeying it; one table per half-season (a visual change) | yes |
| **D-a11y-4** | Remove redundant `alt` rather than reword it | Every string removed was already on screen inside the same figure or link | „Портрет на <име>" — still duplicated, now longer | yes |
| **D-a11y-5** | Emit `aria-disabled` only when true | `aria-disabled="false"` overrode `<fieldset disabled>` for tooling and produced a false contrast failure | Emitting it unconditionally | yes |
| **D-a11y-6** | Add no dependency; drive what `lighthouse` already brings | Two more transitive trees, incl. a second Chromium, carried forever for tooling run a few times a year | `pa11y` + `@axe-core/cli` as devDependencies | yes |

## 4. Deviations from the instruction

- **`TodoWrite` was not used** — the tool is not available in this harness. Stage tracking was kept in the working notes and every stage below was run and reported.
- **pa11y's „zero violations" is not met**, by the escape hatch the instruction itself provides („or each exception documented as a justified false positive"). See §2 and report §7.
- **`/studio` was excluded** from the URL list and from every count. It is the vendored Sanity Studio — third-party markup, already `Disallow`ed in `robots.ts`, reachable only by the two editors. Stated in report §9 rather than left implicit.
- **The „before" Lighthouse and screenshots were captured by stashing the fixes and rebuilding**, not at the start of the session. Same build pipeline, same commands, same machine; noted so nobody reads them as having been taken first.

## 5. Changed files / deliverables

**Code — 23 files, branch `a11y-remediation`:**

- `src/app/globals.css` — the new „Scroll clearance" block and the `--spacing-rail` token
- `src/components/JumpNav.tsx`, `src/components/legends/LegendsBrowser.tsx` — `data-sticky-rail`; `LegendsBrowser` also carries the clear-button contrast, ring and focus-return fixes and now reads its scroll clearance from the scroller
- `src/components/legends/CategoryGrid.tsx`, `src/app/(site)/arhiva/page.tsx`, `statistika/page.tsx`, `arhiva/[slug]/page.tsx`, `razno/[slug]/page.tsx` — `scroll-mt-*` removed (11 call sites)
- `src/components/SiteHeader.tsx`, `src/components/archive/SeasonAnchorNav.tsx` — comments only, retiring the description of the mechanism that was replaced
- `src/components/archive/SeasonResultsTable.tsx` — separator contrast, `<tbody>` per half-season with `scope="rowgroup"`, „Стрелци" head kept for AT on a phone
- `src/components/archive/SeasonSquadTable.tsx`, `SeasonRecordList.tsx`, `SeasonStory.tsx` — link underlines made visible
- `src/components/contact/ContactForm.tsx` — `<legend>`, focus kept on submit, focus moved to the result, `aria-disabled`
- `src/app/not-found.tsx` — its own `metadata`
- `src/components/stats/StatTable.tsx` — SC 2.5.3
- `src/components/legends/PersonHero.tsx`, `LegendCard.tsx`, `src/components/archive/SeasonCard.tsx`, `PhotoGrid.tsx`, `src/components/razno/RaznoPhotoGrid.tsx`, `PhotoLightbox.tsx` — `alt` and button names

**Docs & tooling (new):** `docs/accessibility-report.md`; `docs/a11y-scan-before/`; `docs/a11y-scan-after/`; `scripts/a11y/` (five scanners + `README.md`).

**Untouched, deliberately:** `package.json`, `package-lock.json`, every Sanity schema, every content module under `src/content/`, and `data/`.

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. the open owner decision and the two owed verifications
- [x] `NEXT:` line set to: `3.33 — Играчи 139–159 (STILL BLOCKED on OV-81)`, with this branch recorded ahead of the 3.36 entry
- [x] `file-map.md` synced — `docs/accessibility-report.md`, both scan directories, and `scripts/a11y/` with a line per scanner
- [x] `00_stack-and-config.md` — **no entry needed and none made**: no dependency was added or upgraded (D-a11y-6)

## 7. Risks, surprises, what the next phase needs to know

- **⚠️ Lighthouse scored 100/100 before this work and 100/100 after.** It caught none of the twelve findings. Treat „Lighthouse is green" as evidence of nothing about accessibility on this project; the scanners in `scripts/a11y/` exist because of it.
- **⚠️ Any new `position: sticky` bar must set `data-sticky-rail`**, or keyboard focus will hide underneath it exactly as it did before. This is the one thing a future phase can silently break. `keyboard-walk.mjs … --shift` catches it in about thirty seconds.
- **⚠️ `scroll-mt-*` must not come back.** It stacks with the scroller's `scroll-padding-top` and doubles every anchor offset. There is now no `scroll-mt` anywhere in `src/`.
- **Three claims that sounded right and were wrong**, all disproved by measurement and written up in report §5 so they are not re-investigated: the results table does **not** lose its table semantics on a phone (checked in the accessibility tree at 375px); the mobile menu **is** reachable at 320×256 and at 200% zoom; the photo lightbox's focus trap, Escape handling, focus restore and scroll lock are all **correct** and were not touched.
- **The contact form's state machine changed** — this is the part of the branch with no live verification behind it, and it is the one thing on the eyeball checklist that needs a real submission.
- **`.claude/launch.json` was temporarily given `autoPort` during this work** (port 3000 was taken) and has been **reverted**; it is not in the diff.

## 8. What's now possible that wasn't before

A keyboard-only visitor can move backwards through any page on this site and always see where they are — and there is now a committed, dependency-free way to prove that is still true after the next change.
