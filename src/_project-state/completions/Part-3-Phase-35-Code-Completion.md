# Part 3 · Phase 35 · Code — Completion Report

**Date:** 2026-08-20 · **Executor:** Claude Code (Opus 5, Linux session, `~/project/belasica-v2`) · **Outcome (one line):** Four of the brief's five cleanup items are fixed and the fifth was found already closed — the jump rails on `/arhiva`, `/legendi` and `/statistika` now show that they scroll, `llms.txt` says 212, Аце's dead Ефтимов link 308-redirects to the surviving page, and 1922 is recorded in `facts.md` as the confirmed founding year.

## 1. What shipped (plain language)

The row of section links that sits under the site header — on the archive, the legends page and the statistics page — has always been able to scroll sideways when it holds more links than fit, but nothing on screen said so, and on `/statistika` two of the seven links sat off the right edge on an ordinary desktop. It now fades out at whichever edge still has links hidden, and the fade follows your position: nothing on the left when you are at the start, nothing on the right when you have reached the end. The rail is exactly as tall as it was, so every „jump to section" link still lands in the same place.

Three smaller things: the plain-text file that describes the archive to AI search engines said 211 people and there are 212; the link Аце shared to `/legendi/tomche-eftimov` has 404'd ever since his two records were merged into one, and now redirects permanently to the page that survived; and the club's founding year — 1922 — is written into `facts.md` as confirmed, which is what „104 години историја" on „За нас" rests on.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ **Rail: the edge-fade affordance is present, the rail sticks at the same offset, and every anchor still lands.** Evidence, measured in-page with and against the class on the local production build:

  | page          | viewport | rail height with / without `rail-fade` | scroller overflow | anchors                        |
  | ------------- | -------- | -------------------------------------- | ----------------- | ------------------------------ |
  | `/arhiva`     | 1280     | 47 / 47 px                             | 0 px              | 11, all at top **130 px**      |
  | `/arhiva`     | 375      | 47 / 47 px                             | 664 px            | 11, all at top **130 px**      |
  | `/statistika` | 1280     | 62 / 62 px                             | 335 px            | 7, all at top **130 px**       |
  | `/statistika` | 375      | 47 / 47 px                             | 1184 px           | 7, all at top **130 px**       |
  | `/legendi`    | 1280     | 47 / 47 px                             | 0 px              | n/a (tabs; sticky `top: 78px`) |
  | `/legendi`    | 375      | 47 / 47 px                             | 174 px            | n/a (sticky `top: 78px`)       |

  Control against deployed `main` (`https://belasica-v2.vercel.app/statistika`, no `rail-fade` in its markup): rail height **62 px**, `#strelci` at top **130 px**, scroller 1583 px inside 1248 px — identical to the branch. `document.documentElement.scrollWidth` never exceeds the viewport on any of the six combinations, so the page body still does not scroll sideways. The `@supports` guard matched: computed `animation-timeline: scroll(self inline)`, `animation-name: rail-fade-edges`, `animation-duration: auto`.

- ⚠️ **„…and the fade reads sensibly" — NOT verified, and this is the one real gap in this report.** This session's browser pane is never displayed: `document.visibilityState` is `hidden`, `computer{action:"screenshot"}` fails with „the page is not compositing frames", and `requestAnimationFrame` never fires. Scroll-driven animations do not advance in a document that is not rendering — confirmed independently of my CSS by constructing `new ScrollTimeline({source: rail, axis: 'inline'})` in the page, attaching a plain `opacity 0→1` animation to it, scrolling the rail, and reading `currentTime: null` with the probe still at `opacity: 1`. What could be substituted: layout **is** computed (the numbers above are real), and the mask arithmetic was verified by driving the two registered properties by hand and reading the computed `mask-image` back at each keyframe — base `rgb(0,0,0) 0px … 100%` (fully opaque, i.e. today's rail exactly), start `… 0px … calc(100% - 40px)` (right only), mid `40px … calc(100% - 40px)` (both), end `40px … 100%` (left only). Decision and reasoning: **D-3.35-4**.
- ✅ **`public/llms.txt` reads „212 личности", matching the live count.** Evidence: `count(*[_type == "person"])` = **212** on `f8rmnfry/production`, `published` perspective; the same 212 is rendered in `/legendi`'s heading on the deployed site. Its other counts were checked in the same pass and left alone because they are right: `count(*[_type == "season"])` = **96** („96 сезони"), `RAZNO_TOPICS.length` = **7** („7 тематски теми").
- ✅ **`/legendi/tomche-eftimov` 308-redirects to the survivor, which returns 200.** Evidence on the local production build (`next start`): `308` with `Location: /legendi/tome-eftimov`, and `200` following it; `/legendi/tome-eftimov` `200` directly. `.next/routes-manifest.json` holds `{"source": "/legendi/tomche-eftimov", "statusCode": 308}`. **The slug was read from the data, not assumed:** querying `*[_type == "person" && name match "*Ефтимов*"]` returns exactly two published records — `person-tome-eftimov` („Томе Ефтимов", `legendRank 9`, slug `tome-eftimov`) and `person-toni-eftimov` (rank 102) — and the old path 404s on the deployed site today. ⚠️ The live-preview leg of this is owed to Lazar (below).
- ✅ **`facts.md` records the founding year as 1922 (confirmed); no unverified-founding flag remains.** Evidence: `grep -c -i "founding year: UNVERIFIED" facts.md` → **0**. The stale cross-reference on the „104 години историја" line („the founding year itself is still UNVERIFIED as a separate fact below") was rewritten in the same edit, because leaving it would have left the file contradicting itself.
- ✅ **„За нас" untouched; `foundingDate` not added to structured data.** Evidence: `git diff --stat` touches neither `src/app/(site)/za-nas/page.tsx` nor `src/lib/facts.ts` nor any JSON-LD builder. The exclusion is now recorded inside the fact itself (D-3.35-6) so it outlives this brief.
- ✅ **The 3.25 report is committed at the completions path; `D-3.25-1/-3/-4/-5/-6` are in `decisions.md`; `D-3.25-2` not duplicated.** ⚠️ **All of it was already true before this phase and nothing was written** — see §4 and D-3.35-5. Evidence: the file is `src/_project-state/completions/Part-3-Phase-25-Cowork-Completion.md`, 17,638 bytes, `git log` shows it landed in `2d691a5` (Phase 3.30); the five IDs each appear once as `### D-3.25-n` headings; `D-3.25-2` appears once as a heading; OV-69 in `current-state.md` already read RESOLVED 2026-08-18.
- ✅ **No Sanity write, no schema change, zero new npm dependencies, no new `brand.md` token.** Evidence: every Sanity call this session was `query_documents` (read-only); `package.json` and `package-lock.json` are unmodified in `git status`; `brand.md` is unmodified; the fade introduces no colour and no spacing token — it masks alpha on an element that paints no background, and its one length (40 px) is mask geometry declared in the rule.
- ✅ **`npm run build`, `npm run lint`, `tsc --noEmit` pass from a wiped `.next`. Page count recorded.** Evidence: `rm -rf .next` then `tsc --noEmit` exit 0, `eslint` clean (no output), `next build` → **✓ Generating static pages (331/331)**, `prerender-manifest.json` **329 routes**. **Both figures are unchanged from the 3.34 state** — no page was added or lost.
- ✅ **`/impeccable audit` run on the affected pages.** The bundled detector over `JumpNav.tsx`, `LegendsBrowser.tsx` and `globals.css` returns `[]` — zero findings. Dimension notes and the two accepted trade-offs are in §7.

**Owed to Lazar (goes on the owed-verification register):**

- **The fade's visual read on the Vercel PR preview — the whole of it, not just `/statistika`.** This is the item this phase could not verify at all. Five-item eyeball checklist, on the PR preview at a normal desktop window:
  1. `/statistika` — at rest, the **right** edge of the dark link rail fades into the navy; the left edge is hard. Drag the rail right: the left edge starts fading too.
  2. `/statistika` — drag the rail all the way right. The **right** fade should be gone (you are at the end) and the left one should remain.
  3. `/arhiva` — at a wide window the eleven decades fit, so there should be **no fade at all**. Narrow the window until they do not fit: the right fade should appear.
  4. `/legendi` — the four tabs fit on desktop, so again **no fade**; on a phone (or a narrow window) the right edge should fade. Click through the tabs and confirm nothing about them changed.
  5. Any of the three — click a rail link and confirm the heading it jumps to lands clear of the rail, exactly as before.
- **The redirect on the deployed preview.** Open `<preview>/legendi/tomche-eftimov` — it should land on „Томе Ефтимов" with the URL rewritten to `/legendi/tome-eftimov`. (Аце's link is the reason this exists.)
- **A native read of nothing new.** This phase shipped **no new user-facing Macedonian copy** — the only Macedonian it touched is one digit in `llms.txt`. No humanizer pass was needed or run.

## 3. Decisions I made during this phase

All six are logged in `decisions.md`.

- **D-3.35-1** · The rail affordance is a scroll-driven edge **mask on the scroller**, not a static gradient and not a layout change · because the brief's hard constraint is that the rendered height cannot move, and masking is paint-only; the scroller paints no background of its own, so the links dissolve into the parent's `navy-2` without restating that colour anywhere · rejected: a static right-edge gradient (it would show on `/arhiva` and `/legendi`, which measure 0 px overflow at 1280, and would still be showing at the scroll end), a painted scrim (needs the navy value hardcoded as a gradient stop), a JS scroll listener (makes `JumpNav` a client component on two pages where it is server-only) · logged: **yes**.
- **D-3.35-2** · `/legendi` does **not** import `JumpNav` — it carries a second copy of the rail's surface, and both copies got the class · because editing `JumpNav.tsx` alone would have left `/legendi` without the affordance the DoD asks for on all three pages · rejected: extracting the shared surface (a refactor of a client component's tab machinery inside a five-item cleanup phase) · logged: **yes**.
- **D-3.35-3** · The blanket `prefers-reduced-motion` reset is overridden for this one animation · because a scroll-driven animation with a zeroed duration does not stop, it pins to its **end** frame — the fade would appear on the wrong side, and only for the users who asked for less motion · rejected: dropping the fade under reduced motion (removes a usability cue from the people most likely to need it; nothing here moves on its own) · logged: **yes**.
- **D-3.35-4** · The fade shipped on mechanical proof, with its visual read owed · because the brief's fallback exists to protect the shared component and its offsets, and both were **measured** to be untouched — reverting a verified-safe fix over a missing screenshot would trade it for a known-unfixed defect · rejected: taking the fallback and reverting; waiting for a session that can render (it blocks four unrelated fixes behind one screenshot) · logged: **yes**.
- **D-3.35-5** · Task 5 was already closed at 3.30, so nothing was committed · because re-committing the report or re-logging the five IDs is exactly what the reservation note exists to prevent · rejected: asking Lazar for the file anyway (the file on `main` is the real report, not a stub) · logged: **yes**.
- **D-3.35-6** · The founding-year entry records the structured-data exclusion alongside the year · because the prohibition lived only in the brief, which nobody reads again after the phase closes, while a verified founding year is exactly what a `foundingDate` property invites · rejected: recording the bare year · logged: **yes**.

## 4. Deviations from the brief

1. **Task 5 was a no-op.** The brief says „Lazar provides the 3.25-Cowork completion report file" and asks for it to be committed and its five IDs logged. No file came with the brief, and none was needed: the report has been on `main` since `2d691a5` (Phase 3.30, D-3.30-6), the five IDs are logged, and OV-69 already read RESOLVED. The brief was written against a state that predates 3.30. Verified, not repeated (D-3.35-5).
2. **The rail fix touches two files, because the brief's premise about the third page is wrong.** The brief states that `JumpNav` is shared by `/arhiva`, `/legendi` and `/statistika` and that `/legendi` pulls it client-side. `/legendi` does neither — `LegendsBrowser.tsx` renders its own `role="tablist"` rail that copies `JumpNav`'s surface, as its own comment says. Both got the class (D-3.35-2). The duplication itself was left in place.
3. **`/arhiva` does not have „the same hard cut-off" at desktop widths.** The brief says it does. Measured: **0 px of overflow at 1280** — the eleven decades fit. It overflows at 375 (664 px), so the fade is a mobile affordance there. `/legendi` is the same shape: 0 px at 1280, 174 px at 375. Only `/statistika` overflows on a desktop.
4. **One line beyond the founding-year edit was changed in `facts.md`.** The „104 години историја" entry ended „the founding year itself is still UNVERIFIED as a separate fact below" — leaving it would have made the file contradict itself one line after the fix.
5. **The DoD's „the fade reads sensibly" is not met.** See §2 and D-3.35-4. Not a deferral by choice — the environment could not render.

Everything the brief put out of scope stayed out: OV-64, OV-85, OV-86, OV-87, the portrait/bio half of OV-84, `foundingDate` in structured data, and the 20 players of 3.33.

## 5. Changed files / deliverables

Branch `phase-3.35-cleanup` → PR to `main`. Six files, all edits, no adds/renames/deletes:

- `src/app/globals.css` — the `.rail-fade` block: two `@property` lengths, the base mask, and an `@supports (animation-timeline: scroll(self inline))` block holding the keyframes, the timeline wiring, `animation-duration: auto !important` and `scroll-padding-inline: 2.5rem`.
- `src/components/JumpNav.tsx` — `rail-fade` on the scroller (+ comment).
- `src/components/legends/LegendsBrowser.tsx` — `rail-fade` on its copy of the rail (+ comment).
- `next.config.ts` — new `async redirects()`; existing `images` and `experimental` config preserved verbatim.
- `public/llms.txt` — one digit: 211 → 212.
- `facts.md` — the founding-year entry, and the stale cross-reference on the „104" line.

State files: `src/_project-state/current-state.md` (line 1, OV-69, OV-84, OV-88), `src/_project-state/decisions.md` (D-3.35-1…-6), `src/_project-state/file-map.md` (five entries updated), and this report.

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers — OV-88 ✅ RESOLVED, OV-84 ⚠️ PARTIALLY RESOLVED (count half closed, portrait/bio half open), OV-69 re-verification note appended. Left open exactly as the brief directs: OV-64, OV-81, OV-82, OV-83, OV-85, OV-86, OV-87.
- [x] `NEXT:` line set to: `3.33 — Играчи 139–159: the 20 new men, once their full names exist (STILL BLOCKED on OV-81)` — unchanged, because 3.33 is still blocked on Аце and this phase ran ahead of it by design.
- [x] `file-map.md` synced — no file was added, renamed or deleted, so the sync is descriptive: `globals.css`, `JumpNav.tsx`, `LegendsBrowser.tsx`, `next.config.ts` and the `llms.txt` count.
- [x] `00_stack-and-config.md` — **not touched, correctly**: zero dependencies added or upgraded.
- **Note on the founding-year register item.** The brief says to mark it resolved. There is no separate founding-year entry in `current-state.md` — the unverified flag lived only in `facts.md`, and that is where it was cleared.

## 7. Risks, surprises, what the next phase needs to know

- **The one thing nobody has checked is how the fade looks.** Everything else about it is measured. If it reads badly, undoing it is deleting one class from two files and one block from `globals.css` — no other code depends on it.
- **`llms.txt` is hand-maintained and will be wrong again.** 3.33 adds 20 players; the moment they publish, „212 личности" understates the roster. Whoever runs 3.33 must re-sync line 11. (The deeper fix — a static file that stops hardcoding a roster size — is still nobody's task.)
- **Two copies of one rail surface now carry the same affordance.** Any future change to the rail must be made in both `JumpNav.tsx` and `LegendsBrowser.tsx` (D-3.35-2).
- **A pre-existing 10 px that is not worth fixing.** Anchored sections use `scroll-mt-[calc(var(--spacing-header)+3.25rem)]` — 52 px of rail — but the rail measures 62 px when a classic scrollbar is drawn under it (as in this headless Chrome; macOS overlay scrollbars do not do this). The anchor therefore lands 10 px „under" the rail — invisibly, because the section's own `py-section` puts its heading 94 px further down. Identical on deployed `main`, unchanged by this phase, and not touched: the shared offset is precisely what the brief said not to risk.
- **Audit dimensions, for the record.** Detector: 0 findings. Accessibility: focus cannot come to rest under a ramp (`scroll-padding-inline: 2.5rem`); reduced-motion keeps the affordance deliberately (D-3.35-3); no ARIA, roles or tab order changed, and `/legendi`'s tabs were re-tested after the change (`aria-selected` moves to „Тренери" and back). Two accepted trade-offs: text inside a 40 px ramp is partially transparent while it is on its way out of view (inherent to the pattern), and the project's blanket `0.01ms` reduced-motion kill remains for everything else (pre-existing, out of scope). Performance: the timeline is the rail's **own** inline scroll, so page scrolling never runs it — the cost is a paint on one small element while the rail is dragged. Theming: no colour, no new token. Responsive: verified at 375 and 1280, no page-level horizontal scroll, touch targets unchanged.
- **Environment note for the next executor on a machine like this one.** There is no `.env.local` in the repo (it is gitignored, correctly). `npm run build` needs `NEXT_PUBLIC_SANITY_PROJECT_ID=f8rmnfry` and `NEXT_PUBLIC_SANITY_DATASET=production` — both public, both readable off any deployed page's `cdn.sanity.io` image URLs. A temporary one was written for this session and removed afterwards.

## 8. What's now possible that wasn't before

The launch checklist is four items shorter, and the last one that needed a human — the founding year — is in `facts.md` rather than in someone's chat history.
