# Part 3 · Phase 07 · Code — Completion Report

**Date:** 2026-07-31 · **Outcome (one line):** The archive now has a public legal page that says what it is, discloses that AI helped build it, and promises any rights holder their material comes down on request — linked from the footer of every page.

## 1. What shipped (plain language)

A new page at **`/pravni-informacii`** carries the archive's legal statement in ten sections: that this is an unofficial archive and not the club's site, what it is for, an explicit disclosure that **AI tools helped build it**, a caveat about data accuracy, how photographs and copyright are handled, the club's name and crest, a limit of liability, external links, amendments, and contact.

The most consequential line is a promise rather than a disclaimer: anyone who owns rights in something published here can ask, and it comes down „без одлагање и без прашања" — the page says outright that no legal process is needed. That turns `info@belasicahistory.mk` into an inbox somebody has to watch.

The contact email also stopped being a placeholder. It is now a verified fact rendering as a real clickable address in the footer, on `/kontakt`, and on the legal page. The legal page is reachable only from the small link beside the copyright at the bottom of every page — deliberately not from the main menu, which stays the six real destinations.

## 2. Definition of Done

**Verifiable by the executor:**

- ✅ **`/pravni-informacii` builds and renders; page count 270 → 271** — evidence: `npm run build` → `✓ Generating static pages (271/271)`, and the route table lists `○ /pravni-informacii  759 B  116 kB` with an **empty** Revalidate column. On "a clean clone": the build ran in a **fresh `git worktree` cut from `main`** (a clean checkout of committed files only), and — stronger — **Vercel built the pushed branch from scratch and deployed it Ready**, with all 9 checked routes returning 200 and an unknown slug returning 404.
- ✅ **`tsc` clean, ESLint clean, prettier applied** — evidence: `npx tsc --noEmit` exits 0 with no output; `npm run lint` produces no findings; `npx prettier --check` on all four changed files → „All matched files use Prettier code style!". ⚠️ *Honest note:* `prettier --check "src/**/*.{ts,tsx}"` reports **19** unformatted files repo-wide. All 19 are **pre-existing** — verified by checking out `src/lib/utils.ts` at `2c94141` (`main`) and finding it already unformatted. They were deliberately **not** reformatted: doing so would add 19 unrelated files to this diff.
- ✅ **All ten sections present and character-for-character identical to §Copy — verified by diffing, not by eye** — evidence: the ten `<h2>`s were enumerated from the DOM in order (`1. Што е оваа страница` … `10. Контакт`); the rendered text was extracted from the **built HTML** and `diff`ed against a transcription of the brief → **41/41 copy lines identical, zero differences**. Repeated against the **Vercel preview** → identical there too. (The only two lines the diff excludes are the breadcrumb „Почетна / Правни информации", which is page furniture, not §Copy.)
- ✅ **No `[PLACEHOLDER: …]` chip anywhere on the page** — evidence: `[PLACEHOLDER:` occurrences inside `<main>` = **0**, both in the local build and on the preview. (The footer's socials chip, PL-15, sits outside `<main>` and is site-wide and out of scope.)
- ✅ **„Правни информации" is in the footer bottom bar, links to `/pravni-informacii`, spot-checked on four page types** — evidence: `href="/pravni-informacii"` count = 1 in `<footer>` on `/`, `/arhiva/1982-83`, `/legendi/aco-stojanov`, `/statistika` (plus `/za-nas`, `/kontakt` and the page itself), confirmed on both the local build and the preview. Rendered label „Правни информации", 144×35px hit area, `text-small` (14px) matching the bottom bar.
- ✅ **The link is NOT in the header nav; `src/lib/nav.ts` and `SiteHeader.tsx` unchanged** — evidence: `git diff --name-only HEAD` contains neither file; „Правни информации" occurrences inside `<header>` = **0**, inside `<footer>` = 2 (markup + RSC payload); the header's hrefs are exactly `/`, `/arhiva`, `/legendi`, `/statistika`, `/za-nas`, `/kontakt`.
- ✅ **Both email links resolve to `mailto:info@belasicahistory.mk`; no demo email survives in `src/`** — evidence: the legal page's `<a>` reports `href="mailto:info@belasicahistory.mk"`, as does the footer's; a regex sweep of the built output found **exactly two** distinct email-shaped strings: `info@belasicahistory.mk` (1060 occurrences) and **`ime@example.com`** (1). ⚠️ The latter is the contact form's `<input placeholder="ime@example.com">` — a typing hint on the IANA-reserved `example.com`, not an archive address. **Deliberately kept**; removing it would degrade the form. Flagged here so it is a decision, not an oversight.
- ✅ **Zero horizontal overflow at 375, 1280 and 1408; body text within the reading measure at 1408** — evidence: `documentElement.scrollWidth - clientWidth` = **0** at all three widths; a sweep for any element in `main`/`footer` extending past the viewport returned **none** at 375. Widest body paragraph at a 1408 viewport = **615px**, inside the 62ch (`max-w-measure`) cap.
- ✅ **Body and link colours ≥ 4.5:1; the footer link ≥ 4.5:1 against the bottom bar** — measured, not assumed (see §7 for the two measurement traps):

  | Pair | Ratio |
  |---|---|
  | Body paragraph — neutral-700 on paper | 10.37:1 |
  | Copy list item — neutral-700 on paper | 10.37:1 |
  | H2 section heading — navy on paper | 14.95:1 |
  | H1 — paper on navy | 14.95:1 |
  | „Последно ажурирање" meta — paper/80 on navy | 9.90:1 |
  | **Email link — navy on paper** | **14.95:1** |
  | **Footer legal link — paper/80 on navy** | **9.90:1** |
  | Footer © line — paper/80 on navy | 9.90:1 |

  Worst case **9.90:1** against a 4.5:1 requirement. Every figure matches `brand.md`'s published table, which cross-validates the conversion. Focus rings measured on the real elements: **3px solid `rgb(13,31,60)`** (navy, 2px offset) on the legal page's email link, **3px solid `rgb(238,122,22)`** (orange, 2px offset) on the footer link.
- ✅ **No new dependency; `package.json` unchanged** — evidence: `git diff --name-only HEAD | grep package` returns nothing. Zero new components, zero new tokens, no `globals.css` change, no schema change, no Sanity write.
- ✅ **`facts.md`, `decisions.md`, `current-state.md`, `file-map.md` updated; the snapshot reflects the actual tree** — see §6. ⚠️ The brief's premise here was wrong and is corrected rather than followed (§4).
- ✅ **One PR from `phase-3.07-legal-page`; no commits on `main`** — [PR #37](https://github.com/DinovLazar/belasica-v2/pull/37), one commit `c2fb001`. `main` was never checked out or written to; the work was done in an isolated `git worktree` because another session held the shared checkout (§7).

**Owed to Lazar (on the owed-verification register):**

- ⏳ **Native read-through of the rendered Macedonian page by Lazar and Ace** — tracked as **OV-19**. The copy is yours and is rendered verbatim (proven above), but nobody has read the finished page on screen.
- ✅ **Vercel preview URL + 5-item eyeball checklist** — below.

### Vercel preview

**https://belasica-v2-git-phase-307-legal-page-sunset-services-team.vercel.app/pravni-informacii**

Preview gate verified before requesting merge (not waived): all of `/`, `/pravni-informacii`, `/kontakt`, `/statistika`, `/za-nas`, `/arhiva`, `/arhiva/1982-83`, `/legendi`, `/legendi/aco-stojanov` return **200**; an unknown slug returns **404**; the copy diff is **41/41 identical** on the preview; `/kontakt`'s `<main>` carries **2** chips (Formspree, socials) instead of 3; the legal page's `<main>` carries **0**.

### Five things for Lazar to eyeball

1. **Read the ten sections end to end** on a phone and on desktop — this is the copy you supplied, rendered verbatim, but it has never been read on-screen (OV-19).
2. **The two quoted phrases** — §6 „ФК Беласица“ and §7 „како што е“ — render with a **U+201C** closing quote (Macedonian convention; the repo has 4 of these and 0 of U+201D). If you meant the English-style `”`, it is a one-character fix (D-3.07-9).
3. **The footer bottom bar**: „Правни информации" now sits beside „© 2026 ФК Беласица". Check the wrap at phone width — it becomes two rows by design.
4. **`/kontakt` → „Директен контакт"** now shows the real address instead of a dashed placeholder box. Confirm `info@belasicahistory.mk` is correct and that clicking it opens your mail app.
5. **The heading „Последно ажурирање: 16 август 2026"** renders in small tracked capitals under the title. Confirm that date is the one you want published.

## 3. Decisions I made during this phase

All ten are logged as **D-3.07-1 … D-3.07-10** in `decisions.md`. The ones that go beyond what the brief specified:

- **`/kontakt`'s email chip was cleared too** (D-3.07-5) · The brief's Task 5 names only the footer, but Task 6c says „Clear PL-3", and the register records PL-3 as open on **two** surfaces. Clearing only the footer would have shipped `/kontakt` saying it had no email address directly above a footer displaying one · alternative rejected: footer-only, leaving PL-3 half-open and the page self-contradictory · **needs a decision-log entry: YES (logged).**
- **The address became one constant, `CONTACT_EMAIL` in `src/lib/facts.ts`** (D-3.07-6) · it renders on three surfaces, and `src/lib/facts.ts` is the established home for VERIFIED `facts.md` strings; OV-6 was opened about exactly this kind of drift · alternative rejected: three hardcoded literals · **YES (logged).**
- **The email link drops the text-link role's uppercase** (D-3.07-4) · `brand.md`'s text link is condensed caps, which would render `INFO@BELASICAHISTORY.MK`; an address is a value to be copied, not a label · the rest of the role (3px orange underline, hover swap, navy ink, focus ring) is kept exactly · alternative rejected: a new global role class for one call site · **YES (logged).**
- **The copy is a data array, not ten JSX blocks** (D-3.07-7) · it is what made the character-for-character check mechanical, and it stops §7 being styled unlike §4 · alternative rejected: Portable Text from Sanity — a legal statement must not be silently editable in a CMS · **YES (logged).**
- **No `revalidate` on the route** (D-3.07-8) · every sibling sets `revalidate = 60` „for consistency", but this page fetches nothing, so the value has no referent and would imply the text can change without a deploy · **YES (logged).**
- **The two quote pairs render „…“ (U+201C)** (D-3.07-9) · the single character-level judgement made against §Copy; matches Macedonian convention and the repo's existing usage (4 × U+201C, 0 × U+201D) · **YES (logged).**
- **3.06a's missing paperwork was recorded, not invented** (D-3.07-10) · alternative rejected: back-filling `D-3.06a-*` entries from the diff, which would put invented rationale into an append-only log · **YES (logged).**
- **Also logged for the record:** the route slug (D-3.07-1), the footer bottom-bar placement (D-3.07-2), and the takedown-on-request posture (D-3.07-3), which the brief specified but which change what the site publicly promises.

## 4. Deviations from the brief / spec

- **The brief's description of the state files was wrong, and I followed the repo instead.** It states `current-state.md` „still reads as if Phase 1.01 just closed" and `file-map.md` „stops around 2.04". Both were current through **3.05b**. The actual gap is that **3.06a** filed no completion report and logged no decisions. I synced from the working tree and recorded 3.06a's shipped surface from its diff, but did **not** author its report or back-fill its decisions (D-3.07-10).
- **The brief's „replace the footer's demo contact email (PL-9)" premise was stale.** No demo email existed to replace — 3.03 had already removed it and left a `PlaceholderChip`. The chip is what I replaced. Recorded in the PL-9 register row.
- **`src/app/(site)/kontakt/page.tsx` is in the diff although the brief's „Outputs" list did not name it** — the PL-3 scope call above (D-3.07-5).
- **`ime@example.com` survives in `src/`**, against a literal reading of „no demo email string survives anywhere in `src/`". It is an `<input placeholder>` typing hint on a reserved domain, not an archive address. Kept deliberately; flagged in §2 so it is your call, not a silent one.
- **Nothing else was deferred or changed.** The out-of-scope list was honoured in full: `nav.ts`/`SiteHeader.tsx` untouched, no metadata/`metadataBase`/canonical/OG/sitemap/robots change for the new domain, the footer's social links untouched, no new dependency, no contact form, no privacy page, no cookie banner, and §Copy rendered exactly as written.

## 5. Changed files / deliverables

**New:**
- `src/app/(site)/pravni-informacii/page.tsx` — the route (static server component, no new component file)

**Edited:**
- `src/components/SiteFooter.tsx` — real `mailto:` in „Контакт"; „Правни информации" in the bottom bar
- `src/app/(site)/kontakt/page.tsx` — email chip → real `mailto:` (D-3.07-5)
- `src/lib/facts.ts` — added `CONTACT_EMAIL`
- `facts.md` — email + domain under §Contact & links, legal-page date under §Naming & identity, all three VERIFIED (owner, chat, 2026-07-31)
- `src/_project-state/decisions.md` — D-3.07-1 … D-3.07-10
- `src/_project-state/current-state.md` · `src/_project-state/file-map.md` — see §6

**Branch / commit / PR:** `phase-3.07-legal-page` · `c2fb001` · [PR #37](https://github.com/DinovLazar/belasica-v2/pull/37) → `main`

**No secrets are in this report or the repo.** See the warning in §7 about a file in Lazar's working tree that may contain one.

## 6. State updates done

- ✅ **`current-state.md`** — `NEXT:` line rewritten to **3.08 (domain cutover)**; „Last updated" set to 2026-07-31; a 3.07 summary bullet added, plus a **3.06a bullet reconstructed from its diff** so the snapshot is not silently missing a shipped phase. Placeholder register: **PL-3 CLEARED**, **PL-4 partly cleared** (domain verified, cutover explicitly not done), **PL-9 email half closed**. Built-pages list gained the new route and the updated footer/`kontakt` entries. Owed register gained **OV-19** and **OV-20** (count 9 → 11). Known issues gained the 3.06a paperwork gap and the `_to_delete/` finding. Human steps gained items 12–15.
- ✅ **`file-map.md`** — new route entry; updated `SiteFooter`, `kontakt/page.tsx`, `lib/facts.ts` entries; **added `SeasonRecordBoard.tsx`** (shipped by 3.06a, never mapped); new „Committed by accident" section for `_to_delete/` and `.claude/launch.json`.
- ✅ **`00_stack-and-config.md`** — **deliberately untouched.** It is append-only and records dependency/config changes; this phase added none. Confirmed: `package.json` and `package-lock.json` are not in the diff.

## 7. Risks, follow-ups, what the next phase needs to know

- **⚠️ Possible secret in the working tree.** `_to_delete/` holds **11 tracked** files of git plumbing junk committed during 3.06a. Beside them, **untracked and un-ignored**, sits **`sanity_token_transfer.tmp`**. Because the directory is tracked, a single `git add -A` would stage a file whose name suggests a Sanity **write token**, in a **public** repo. I did not open it (reading a suspected secret is the wrong move) and did not delete it (destructive, out of scope). **Lazar: inspect and shred it, rotate the token if it was ever live, then `git rm -r _to_delete/`.**
- **The takedown promise is now operational, not just copy (OV-20).** The site publicly commits to removing material on request. The code is correct; keeping the promise needs a monitored mailbox and someone who acts. Note that `/kontakt`'s form is still disabled (Formspree endpoint unset, PL-14/OV-8), so the `mailto:` is currently the **only** working channel.
- **3.06a's reasoning is permanently unrecorded** (D-3.07-10) — the fourth brief in this project written against repo state that did not match the repo (cf. D-2.03-1, D-2.04-2, D-2.06-1). Worth fixing upstream in how briefs are generated.
- **Two measurement traps in the in-app browser, for whoever verifies UI next.** (1) `getComputedStyle().outlineColor` **lags one read behind** on `:focus-visible` — it initially appeared to show a broken 50%-alpha focus ring that does not exist. Proof it is an artifact: setting `outline-color` to literal red inline and reading back returned navy. Focus one element, let a paint happen, then read in a **separate** call. (2) Chrome's readback could not parse the theme's `oklab()` colours, silently yielding black and fake contrast failures — contrast was computed with a hand-rolled oklab→sRGB conversion, cross-validated against `brand.md`'s published table.
- **Session isolation:** another session held the shared checkout on `phase-3.09-perf-a11y` with uncommitted work, so this phase ran in a `git worktree` off `main`. Its uncommitted changes are untouched. Whoever merges should expect `current-state.md` / `decisions.md` conflicts if 3.09 also edits them — resolve by keeping both phases' entries.
- **Next phase (3.08) is the domain cutover.** `www.belasicahistory.mk` is VERIFIED and now printed on the legal page, but `metadataBase` (`src/app/layout.tsx`), `robots.ts` and `sitemap.ts` still hardcode `https://belasica-v2.vercel.app` in three places kept in sync by comment only.

## 8. What's now possible that wasn't before

The archive can be published under its own name without a rights holder having to guess who to contact or what the site claims — and the next phase can point the domain at it, because the page it needs to name already exists.
