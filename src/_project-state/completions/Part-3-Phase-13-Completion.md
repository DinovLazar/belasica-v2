# Part 3 · Phase 3.13 · Code — Completion Report

**Date:** 2026-08-06 · **Outcome (one line):** The season page's two misnamed sections now say what they hold („Преглед", „Играчи и тренер"), and the Тренери and Раководство bands on `/legendi` run newest-first by most recent service instead of alphabetically — from a year derived at build time, with no new field and no Sanity write.

## 1. What shipped (plain language)

Two sections of every season page were renamed. „Приказна за сезоната" is now **„Преглед"**, because the section is a preview of the year; „Тренер и статистика" is now **„Играчи и тренер"**, because the section is the season's people — it opens with the coach, then the roster. The jump rail at the top of the page was renamed alongside each heading, so a rail link can never describe its target wrongly. The web addresses of those two sections did **not** change, so any `#prikazna` or `#trener` link already shared with somebody still works.

On `/legendi`, the Тренери and Раководство bands stop being alphabetical. Both now read newest-first: the club's most recent coach opens Тренери (Васе Беќаров), and its last president opens Раководство (Славчо Васков-Пинда). The ordering year is worked out during the build from information the archive already holds — for a coach, the most recent season that names him; for a president, the end of the term written in his own biography. **Nothing new was added to Sanity, and the year is never shown on the page** — it only decides the order. The Играчи band is untouched.

## 2. Definition of Done

### Season sections

- ⚠️ **`grep -rn "Тренер и статистика" src/app src/components` returns nothing** — **not met as written, and it cannot be.** One hit survives: `src/components/archive/PersonChip.tsx:3`, a comment on a legacy unrendered component that **Task 2 of this same brief explicitly says to leave alone**. Both instructions cannot hold; the explicit scope instruction was followed and the conflict is logged (**D-3.13-8**), matching the D-3.10-9 precedent. The substantive requirement — that the string render nowhere — **is met**: it is gone from `SECTIONS`, and the only survivor is a code comment.
- ✅ **`grep -rn "Приказна за сезоната" src/app src/components` returns nothing** — evidence: grep output empty. The Studio field title in `src/sanity/schemaTypes/season.ts` survives as expected and is outside both paths.
- ⚠️ **`/arhiva/1985-86` rail reads ПРЕГЛЕД · ИГРАЧИ · ТАБЕЛА · ФОТОГРАФИИ** — the rail renders **Преглед · Резултати · Играчи · Табела · Фотографии**. The two assertions that matter both hold — **ПРЕГЛЕД and ИГРАЧИ are present, ПРИКАЗНА and ТРЕНЕР are gone**. The extra ТАБЕЛА-preceding **Резултати** link is not this phase's doing: 3.11b filled results for 95 of 96 seasons, so that section now exists on this page, and the DoD's four-item list predates that fill. Proven not to be a regression by the section-set diff below (0 differences vs `main`).
- ✅ **The two `<h2>`s render ПРЕГЛЕД and ИГРАЧИ И ТРЕНЕР; the `<h3>` still reads „Тренер: Благој Истатов"** — evidence, from the built HTML of `/arhiva/1985-86`: `<h2>` text extracted as `Преглед`, `Резултати`, `Играчи и тренер`, `Табела`, `Фотографии` (`u-h2` uppercases at render), and `<h3 class="u-h3 text-navy"><span …>Тренер: </span>Благој Истатов</h3>`.
- ✅ **Every rail link still lands on its section; `scroll-mt-header` unchanged** — evidence: on `/arhiva/1982-83`, `prikazna` → section present `true`, rail link present `true`; `trener` → `true`/`true`. `git diff main...HEAD` on the season page shows **no `scroll-mt` and no `sectionClass` line touched**.
- ✅ **All 96 built season pages: rendered `<section id>` set byte-identical to `main`** — evidence: a full baseline build of `main` was made and both outputs parsed; **96 season pages compared, 0 section-id set differences.**
- ✅ **`SECTIONS.story.id === "prikazna"` and `SECTIONS.staff.id === "trener"`** — evidence: both unchanged in the diff, each now carrying a comment recording that the `id` is the original name kept for link stability.
- ✅ **The `SECTIONS` doc comment no longer claims every section renders on every page** — evidence: rewritten to describe the live 3.06a behaviour. The same false claim in the staff section's inline comment was corrected too (**D-3.13-2**).

### Legends order

- ✅ **The Тренери band lists 46 people in exactly the brief's order** — **all 46 rows match exactly**, verified twice: predicted from the live dataset, then read back out of the built HTML. Васе Беќаров (2023) → Благој Гуцев (2022) → Шефки Арифовски (2022) → … → Коста Ефински (1957) → Усни Бег (1922).
- ⚠️ **The Раководство band lists 28 people in exactly the brief's order** — **27 of 28 rows match; one differs.** **Александар Оздоленовски** renders at **#11**, where the brief's table places him at **#15**. Cause established, not guessed: his term line reads „…во периодот **1991–1992**.", so `tenureEndYear` returns **1992**, tying him with the four officials whose line reads „во **1992** година". The brief's **written rule** („equal years also break on `compareByName`") puts him first of those five — „Александар" leads alphabetically. The brief's **table** puts him last, which is only reachable by breaking ties on the term's **start** year, a derivation the brief never specifies. **The rule was implemented; the divergence is reported rather than the code bent to reproduce a table** (**D-3.13-7**, owed as **OV-32**). Every other row, and the whole Тренери band, match.
- ✅ **The Играчи band is unchanged** — evidence: rendered slug order **identical to the `main` baseline build** (`order-identical=true`, 86 people). It still opens Андреев → Василев → Панов → К. Секулов → Т. Стојанов → Д. Георгиев → Мафков → Т. Ефтимов → Пантазиев → Шеки, exactly as `current-state.md` records from 3.12.
- ✅ **Band membership unchanged: 46 · 28, same people; header still „160 личности"** — evidence: `membership-identical=true` for all three bands against `main`; band sizes Играчи 86 · Тренери 46 · Раководство 28 = 160; the string „160 личности" is present in the built HTML.
- ✅ **No year, term or sort key visible anywhere on `/legendi`** — evidence: with image CDN URLs and the footer excluded, the two staff bands render **0** four-digit years, **no** dash-range term (`1991–1992`), and **no** biography text. `sortYear` does not appear in the page HTML at all.
- ✅ **`bioLead` and `sortYear` reach neither the props nor the client bundle** — evidence: the bands are built by naming the five fields `LegendBand` declares rather than spreading, so the leak is structurally impossible; `grep -rl` over `.next/static` returns **zero hits** for `bioLead`, for `sortYear`, and for „Претседател на ФК Беласица во периодот". (`legendRank` appears only in the unrelated Studio chunk.)
- ✅ **Search still works and preserves the new band order** — evidence: the **real compiled `matchesName`** from `src/lib/translit.ts` was run over the **rendered** band order. `pinda` → Славчо Васков-Пинда; `Пинда` → Славчо Васков-Пинда; `bekjarov`/`Беќаров` → Васе Беќаров; a no-match query → 0 hits, which is the „Нема личност со такво име во архивата." branch (string confirmed present in the client chunk). Filtering „ов" over Тренери → 30 hits, **order preserved: true**.
- ✅ **The page still renders every person with JavaScript disabled, in the new order** — evidence: `/legendi` is statically prerendered and the server HTML contains **160 distinct person links** in the new order.
- ✅ **A person with no derivable year sorts to the end of their band and does not break the page — exercised, then reverted** — evidence: two synthetic people were injected (a trainer whose name matches no season, and an official whose bio holds no year), both named „Ааа …" so alphabetical order would have placed them **first**. After a full build they rendered **last in their bands — 47 of 47 and 29 of 29** — and the build stayed green. The probe was then reverted (`git checkout --`), leaving the tree clean.

### Repo

- ✅ **Production build passes; page count 271, unchanged** — evidence, from a clean `rm -rf .next && npm run build`: `✓ Compiled successfully in 22.6s`, `✓ Generating static pages (271/271)`.
- ✅ **`tsc` clean, ESLint clean, prettier applied** — evidence: `npx tsc --noEmit` exits 0 with no output; `npm run lint` prints no findings; prettier 3.6.2 run over the four changed files (see §3 for how, and what was reverted).
- ✅ **No new dependency; `package.json` and `package-lock.json` unchanged** — evidence: both absent from `git diff main...HEAD --stat`.
- ✅ **No schema file changed; no Sanity write; no schema deploy** — evidence: `src/sanity/` absent from the diff. All Sanity access this phase was **read-only** (GROQ queries to verify the derivation and the roster).
- ✅ **No hardcoded colour, spacing or type value** — this phase adds no style at all; the diff contains no `className` change.
- ✅ **`src/app/(site)/page.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`, `src/lib/nav.ts`, `LegendsBrowser.tsx` unchanged** — evidence: `git diff main...HEAD --stat` for those five paths is **empty**. The full diff touches exactly four files.
- ✅ **`decisions.md`, `current-state.md`, `file-map.md` updated; the NEXT line still reads `3.08 — Domain cutover`** — evidence: `D-3.13-1…-9` appended; `current-state.md` begins `NEXT: **3.08 — Domain cutover to \`www.belasicahistory.mk\`**…` verbatim.
- ✅ **One PR from `phase-3.13-section-names-staff-order`; no commits on `main`** — see §5.
- ⚠️ **`git log --oneline origin/main..HEAD` was run before any file was written** — it was, and it printed **nothing**; `git status` was clean. **But this check could not do its job here, and that must not be misread as an all-clear.** See §7.

### Owed to Lazar

- ⚠️ **Vercel preview URL + 5-item eyeball checklist** — the checklist is in §7; the **URL cannot be supplied from this machine** and must be taken from the PR once Vercel builds it.
- ⚠️ **Native confirmation of „Преглед" / „Играчи и тренер", and of ordering officials by term end** — owed, logged as **OV-34** and **OV-32**.
- ⚠️ **Ace's confirmation of trainer ordering where several coaches shared a year** — owed, logged as **OV-33**.

## 3. Decisions I made during this phase

Nine are logged as `D-3.13-1…-9`. The ones that go beyond restating the brief:

- **Corrected a second false comment the brief did not name** (`D-3.13-2`) · the staff section's inline comment also claimed „The SECTION always renders (D-3.04b-1)", directly above the `{present.staff && …}` guard that disproves it · alternative rejected: fix only the doc comment the brief named, leaving a known-false comment in a block I was already editing · **decision-log entry: YES.**
- **Read the roster and the season list in one round trip** (`D-3.13-5`) · the brief allowed either; wrapping the query cost one extra type and avoids two reads that could observe different dataset states · alternative rejected: a second `client.fetch` · **YES.**
- **Projected the client props field-by-field instead of stripping two fields** (`D-3.13-6`) · a rest-destructure trips `@typescript-eslint/no-unused-vars` in this config, and naming the five fields `LegendBand` declares makes the requirement structural rather than a step a later edit can drop · **side effect worth ratifying: `legendRank` and `careerStats`, which the spread has been carrying into the client bundle since 3.12, stop crossing too.** Nothing rendered changes — `LegendCard` has only ever read those five fields, and the Играчи order is byte-identical to `main` · alternatives rejected: an eslint-disable comment, or changing the lint config to pass lint · **YES.**
- **Implemented the brief's tie-break rule where its own table disagreed** (`D-3.13-7`) · see §2 and §4 · alternative rejected: parse the term's start year purely to reproduce the table, inventing an unspecified derivation · **YES.**
- **Followed Task 2 over a DoD grep that contradicts it** (`D-3.13-8`) · `PersonChip.tsx` is under `src/components`, so „leave it" and „the grep returns nothing" cannot both hold · alternative rejected: edit a component this phase does not own to satisfy a grep · **YES.**
- **Ran prettier pinned via `npx`, then reverted its collateral reformat** (`D-3.13-9`) · prettier is **not a dependency** here and no version is pinned, so `npx --yes prettier@3.6.2` was used (it installs nothing into the project). It reformatted two JSX arrow bodies in `SeasonStory.tsx` that this phase never touched — a file the brief scopes to „comments only" — so those two hunks were reverted by hand · alternative rejected: keep the churn, or add prettier as a pinned dev dependency (the brief forbids any dependency change) · **YES.**
- **Corrected two stale claims in `current-state.md` while syncing it** · the 3.12 summary bullet still read „COMPLETE — but NOT committed" and „Nothing is committed or pushed", which the same file's own NEXT line and `git log` contradict (3.12 was pushed to `main` on 2026-08-02) · the syncing skill requires the snapshot to mirror the live repo, so the stale lines were replaced rather than left to mislead · alternative rejected: leave them, since the brief said „registers unchanged" — but these are summary claims, not register entries · **decision-log entry: no (a state-file correction, recorded here).**
- **Added three items to the owed-verification register** · the brief says „Registers unchanged", but its own „Owed to Lazar" section directs three items onto that register; the **placeholder register is untouched**, and OV-32…OV-34 were added · **no separate entry (recorded here).**

## 4. Deviations from the brief / spec

- **Раководство row 11 vs 15 (Александар Оздоленовски).** The brief's rule and the brief's table disagree; the rule was implemented. 27 of 28 Раководство rows and 46 of 46 Тренери rows match the supplied tables exactly. `D-3.13-7`, owed as OV-32.
- **One DoD grep is unmet as written** because the same brief protects the file it hits. `D-3.13-8`.
- **The `/arhiva/1985-86` rail carries a fifth link (Резултати)** the DoD's four-item list omits. Not a change made here — proven by the 0-difference section-set diff against `main`.
- **No Vercel preview URL.** Cannot be produced from this machine; it comes from the PR.
- **`00_stack-and-config.md` was not appended to** — correctly: no dependency was added, upgraded or pinned this phase.

## 5. Changed files / deliverables

**Code — four files, all under `src/`:**

- `src/app/(site)/arhiva/[slug]/page.tsx` — the four `SECTIONS` strings, two `id` comments, the corrected doc comment, two inline section comments.
- `src/app/(site)/legendi/page.tsx` — wrapped query (`people` + `seasons`), `bioLead`, server-side `sortYear`, `compareByRecency` for the two staff bands, field-by-field client projection, rewritten band comment.
- `src/lib/people.ts` — new `seasonStartYear`, `buildTrainerYearIndex`, `tenureEndYear`, `compareByRecency` (+ `DatedPerson`); `compareByLegendRank`'s closing paragraph corrected.
- `src/components/archive/SeasonStory.tsx` — **comments only** (4 lines).

**Records:** `src/_project-state/decisions.md` (`D-3.13-1…-9`), `current-state.md`, `file-map.md`, and this report.

**New files:** none. **Deleted:** none.

**Branch / commits:** `phase-3.13-section-names-staff-order`, cut from an up-to-date `main` (`6749a6f`). Code commit `89a4823`; the record files follow in a second commit. **No commit was made on `main`.** PR into `main` — URL in §7.

No secrets are in the diff or in this report. `.env.local` was created locally for the build and holds only the three **public** `NEXT_PUBLIC_SANITY_*` values already documented in `00_stack-and-config.md`; it is git-ignored via `.env*` and is not in the diff.

## 6. State updates done

- ✅ `current-state.md` — new 3.13 summary bullet; 3.13 narrative inserted into the rolling NEXT line with 3.12 demoted to „Prior"; the season-page and `/legendi` entries refreshed; `src/lib/people.ts` entry refreshed; **OV-32…OV-34 added**; two stale 3.12 claims corrected (§3). **The `NEXT:` pointer still reads `3.08 — Domain cutover`, verbatim.** The placeholder register is untouched.
- ✅ `file-map.md` — season-page section flow renamed, `/legendi` band order, `src/lib/people.ts` helpers, and the `PersonChip.tsx` line that still named the old heading.
- ✅ `00_stack-and-config.md` — deliberately untouched: no dependency added or upgraded.

## 7. Risks, follow-ups, what the next phase needs to know

**⚠️ The unpushed-commit check could not do its job, and this is the one thing to read carefully.** The brief's pre-flight exists because 3.12 was begun against `origin/main` and missed three commits that existed only on the owner's Mac (D-3.12-8). It was run here before any file was written and returned clean — **but this phase was executed from a fresh clone of `origin/main` on a different machine**, and in a fresh clone `git log origin/main..HEAD` is *structurally* empty and can never fire. It is therefore **not evidence** that Lazar's working copy holds nothing unpushed. What can be said: `origin/main` was last pushed **2026-08-02**, and its tree matches the brief's description of `main` exactly (3.12 present, highest decision ID `D-3.12-9`, `NEXT:` on 3.08). **Before merging, Lazar should confirm his own checkout has nothing unpushed** — the four files this phase touches are all under `src/`, where 3.12 last wrote.

**Owed items:** **OV-32** (order officials by term end? and the Оздоленовски tie-break), **OV-33** (coaches sharing a season separate only by name — e.g. Гуцев/Арифовски both 2022; Чернишов/Милков/Јовановски all 2020), **OV-34** (native read of „Преглед" and „Играчи и тренер").

**Eyeball checklist for the Vercel preview (5 items):**
1. A season page's rail reads **ПРЕГЛЕД · … · ИГРАЧИ · …** — no ПРИКАЗНА, no ТРЕНЕР.
2. The **ПРЕГЛЕД** heading renders above the season narrative.
3. The **ИГРАЧИ И ТРЕНЕР** heading renders, with **„Тренер: <име>"** still on the card inside it.
4. `/legendi` → **Тренери opens on Васе Беќаров**.
5. `/legendi` → **Раководство opens on Славчо Васков-Пинда**.

**Also worth knowing:** the derived trainer key depends on `season.trainer` staying spelled exactly as the person document is named. All 46 resolve today and **no season trainer name is left unmatched**, but a future season typed with a variant spelling would silently send that coach to the end of the band rather than break anything. Nothing else in the repo reads the new helpers.

## 8. What's now possible that wasn't before

A reader arriving at `/legendi` sees the club's coaching and leadership history in the order it happened, most recent first, instead of an alphabet — and every season page names its sections for what they actually contain.
