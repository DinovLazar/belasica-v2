# Part 3 · Phase 17 · Code — Completion Report

**Date:** 2026-08-09 · **Outcome (one line):** The two longest pages after the archive got the jump rail that makes `/arhiva` usable, every public page got a way back to the top, `/statistika` now opens with the scorers table instead of the curated records, and a season's roster shows where the first eleven end — with no new content and no new claim about the club.

> ⚠️ **Four things for the orchestrator before merge**, all in §3 and §4: the brief's Task 2 and its DoD **disagree** about where focus lands after the click (**D-3.17-8**); the brief's 45-page breakdown is **off by one season**, though its 51/45 total is exact; `BackToTop` is the repo's **seventh** client component, not the sixth; and the „byte-identical `/arhiva`" DoD item is met at the **rendered DOM**, not at the whole file, for reasons no change of any kind could avoid (**D-3.17-7**).

## 1. What shipped (plain language)

Four fixes to how the site is *read*. Nothing here adds a fact, a photograph or a sentence about the club.

`/legendi` and `/statistika` now have the same sticky jump strip `/arhiva` has had since 2.02 — a row of links under the header that takes you straight to a section. All three pages now share **one** component instead of three copies of the same markup, and `/arhiva` itself is untouched: its rendered page is byte-identical to what it was before, which was proved against a baseline build rather than assumed.

Every public page has a **back-to-top button** — a navy circle at the bottom-right that appears once you are a viewport and a half down. It returns you to the top and hands the keyboard back to the start of the page instead of leaving it stranded in the footer. It does not exist until it is needed: not in the HTML, not with JavaScript off. And it sits **under** an open photograph rather than floating over it.

`/statistika` now **opens with „Најдобри стрелци"** — the table people come to that page for. The curated „Клупски рекорди" close the page instead of standing in front of it.

A season's roster gets **a hairline after number 11**, on 51 of the 96 season pages, drawn only when a twelfth name follows. **It says nothing.** No label, no „стартна единаесторка", and invisible to a screen reader — because the book prints a numbered list and never claims those eleven started, and this archive does not add the claim.

## 2. Definition of Done

### Build & scope

- ✅ **`npm run build` passes; page count 279/279 — unchanged** — evidence: `✓ Generating static pages (279/279)`, exit 0. *(The known `WasmHash` webpack-cache flake fired once on an incremental build; `rm -rf .next/cache` and a rebuild passed — the environment flake documented since 3.10, not a code fault.)*
- ✅ **`npx tsc --noEmit` clean · `npm run lint` clean · Prettier applied** — evidence: `tsc` exit 0 with no output; `eslint` no output; `prettier --check` → „All matched files use Prettier code style!"
- ✅ **`package.json` and the lockfile byte-unchanged** — evidence: `git diff --cached --name-only | grep -cE "package(-lock)?\.json"` → **0**.
- ✅ **No `lucide-react` import added** — evidence: `git diff --cached -- src/components src/app src/lib | grep -c lucide-react` → **0**. The arrow is a hand-authored inline `<svg>`, as the 3.15 social icons were. *(A `grep` across the whole diff returns 1 hit — it is the sentence „no `lucide-react` import" in this phase's own state-file prose.)*
- ✅ **No file under `src/sanity/` in the diff; no GROQ query string in the diff; no Sanity write** — evidence: `grep -c "^src/sanity/"` on the staged file list → **0**; a `grep` for `groq` / `*[_type` across the staged code diff → **0** changed lines; no MCP or scripted write was issued this phase.
- ✅ **`SiteHeader.tsx`, `nav.ts`, `metadataBase`, `robots.ts`, `sitemap.ts` absent from the diff** — evidence: `git diff --cached --name-only | grep -cE "SiteHeader|lib/nav\.ts|robots\.ts|sitemap\.ts"` → **0**; `metadataBase` lives in `src/app/layout.tsx`, which is not in the diff.

### Task 1 — the rails

- ⚠️ **`/arhiva`'s built HTML byte-identical to a `main` baseline** — **met at the rendered DOM; the whole file cannot be, for reasons unrelated to this refactor.** Evidence, from three builds: a baseline build of `main`, this branch, and a **third isolation build of this branch with the `BackToTop` mount removed** so the rail refactor stands alone.
  - **Rendered DOM: byte-identical.** Stripping `<script>` elements and hashed asset URLs, `cmp` reports **no difference across 291.164 bytes** (baseline vs isolation build) and **1658 element lines identical** (baseline vs full branch).
  - The rail's own markup hashes identically: `md5` of `<nav aria-label="Скок по деценија"…>` → `572fde37e664726a5e86d090a96f0c53` on **both**.
  - `/arhiva`'s **CSS bundle hash is unchanged** in the isolation build — `cfa10d9ce288078d.css` on `main` and on the refactor — so the refactor emits no new CSS.
  - What still differs in the file: the Next **build ID** (fresh on every build, for every page) and **webpack chunk filenames** (content hashes, which shift because `JumpNav.tsx` adds a module). In the full branch the RSC flight payload additionally gains a `BackToTop` module row — that is **Task 2's** doing and it appears on **every** route. Logged as **D-3.17-7**.
- ✅ **`/legendi` renders the rail with exactly three items — Играчи · Тренери · Претседатели — and every `href` resolves to a `<section id>` in the same document** — evidence, from the built HTML and live in the browser: `[('igraci','Играчи'), ('treneri','Тренери'), ('pretsedateli','Претседатели')]`, all three targets present; live `targetsResolve: true`.
- ✅ **A query matching only players leaves one band, and the rail disappears rather than rendering a single link** — evidence, driven through the real input: „Пандев" → sections `['igraci']`, `railPresent: false`; „Андреев" → same; „zzzz" → no sections, no rail; „ов" and the empty query → all three sections, all three rail items, `allRailTargetsExist: true`.
- ✅ **`/statistika` renders the rail in the order Најдобри стрелци · Најмногу настапи · Севкупен биланс · Клупски рекорди, and all four `id`s resolve** — evidence: `#strelci → Најдобри стрелци`, `#nastapi → Најмногу настапи`, `#bilans → Севкупен биланс`, `#rekordi → Клупски рекорди`; `every rail target exists: True`.
- ✅ **The rail is in the server HTML** (so it works with JS off, on both pages) — evidence: a fresh `fetch('/legendi')` of the prerendered document contains „Скок по улога" and all three `id="…"` attributes.

### Task 2 — „Назад на врвот"

- ✅ **Appears in zero prerendered HTML files** — evidence: `grep -rl "Назад на врвот" .next/server/app | wc -l` → **0**. Present in exactly **1** file under `.next/static` (the client chunk), as expected.
- ✅ **Appears past 1.5 viewport heights and disappears below it, on `/`, `/arhiva`, `/legendi`, `/statistika`, `/razno/<slug>` and a long season page** — evidence, measured at 1280×900 (threshold 1350px): at `scrollY 1980` present; scrolled back to `1080` → **absent**; back to `1440` → **present**. Checked mounted on `/`, `/statistika`, `/arhiva`, `/arhiva/1985-86` and `/razno/tiverija`, and absent at the top of each.
- ✅ **The mount-time read works without any scroll event** — evidence: navigating to `/arhiva#d1930` lands at `scrollY 13723.5` and the button is present with **no scroll event dispatched at all**.
- ✅ **With JS disabled it never appears and nothing else changes** — evidence: it renders `null` on the server, so the prerendered document (the JS-off document) contains neither the button nor its string; the grep above is that proof.
- ✅ **Clicking returns the page to `scrollY === 0`** — evidence: `scrollBefore: 1440` → `scrollAfter: 0`; repeated on a season page, `2250 → 0`.
- ⚠️ **„…and the next Tab press lands on the skip link"** — **satisfied in substance, one step earlier than the sentence says.** Evidence: after the click `document.activeElement` **is** the skip link, and its text is „Прескокни на содржина". Because focus is already *on* it, the next Tab moves into the header. This is exactly what the brief's own Behaviour section specifies (`…a[href="#main"]')?.focus()`), and the two statements cannot both hold. Implemented as specified; logged as **D-3.17-8**.
- ✅ **With `prefers-reduced-motion: reduce`, the return is instant** — evidence: the query is stubbed at click time and `window.scrollTo` captured. The **same button instance** produced `{top: 0, behavior: "auto"}` with the query matching and `{top: 0, behavior: "smooth"}` with it not matching — proving the read happens at click time, not at mount.
- ✅ **An open lightbox covers the button; closing it leaves the button working** — evidence, by **hit test at the button's own centre**, not by comparing rectangles: with the lightbox open, `elementFromPoint` returns `DIV.fixed.inset-0.z-50` (the overlay, `position: fixed`, `z-index: 50`) and the button is `z-index: 30`; `lightboxCoversButton: true`. After closing, `buttonTopmostAfterClose: true` and a click still gives `2250 → 0` with focus on the skip link.
- ✅ **Appearance matches the spec** — evidence, computed styles at 1280: `position: fixed`, `bottom: 32px`, `right: 32px`, `z-index: 30`, `48x48`, `border-radius` fully round, `background rgb(13,31,60)` (navy), `color rgb(247,244,236)` (paper), `transition-property` includes `background-color`+`color` at `transition-duration: 0.16s`, `type: "button"`, **no `title` attribute**, accessible name „Назад на врвот", `svg aria-hidden="true"` at `20x20`. `duration-160` compiles: the built CSS contains `transition-duration:.16s`.

### Task 3 — the statistics order

- ✅ **First `<section>` in source order is `#strelci`; last is `#rekordi`** — evidence, from the built HTML in document order: `#strelci → #nastapi → #bilans → #rekordi`.
- ✅ **`#strelci` carries no `border-t`; the other three do** — evidence, computed `border-top-width` live: `#strelci` **0px**, `#nastapi` / `#bilans` / `#rekordi` **1px `rgb(228,225,216)`** (mist).
- ✅ **The threshold line renders once, unchanged** — evidence: „Листата ги опфаќа играчите со 21 или повеќе првенствени голови за Беласица." appears **exactly 1** time in the whitespace-collapsed visible text of the built page.
- ✅ **`STATS_QUERY`, `SCORER_MIN_GOALS`, all column definitions, every empty notice and every caption byte-identical** — evidence: the staged diff for that file touches only the import block, the new `railItems`, the four `<section>` open tags, the two rewritten comments and the JSX order. No query, constant, column, notice or caption line appears as changed.
- ✅ **Both stale comments gone; their replacements state the real reason** — evidence: „The curated records lead the page…" and „The hairline only exists BETWEEN two paper sections…" are both deletions in the diff. The replacements name the owner's instruction of 2026-08-09 and, for the scorers, why a leading section takes no rule.

### Task 4 — the roster divider

- ⚠️ **51 render one divider and 45 render none — the totals match exactly; the brief's breakdown of the 45 is off by one season.** Evidence, counted in the built HTML across all 96 pages: **exactly one: 51 · none: 45 · more than one: 0**. But the 45 split **43 / 1 / 1**, not the brief's 44 / 1:
  - **43** seasons hold no numbered roster line at all.
  - **`1952`** — roster stops at eleven (`1. А. Ушаков` … `11. Љ. Стоилков`), exactly as the brief says.
  - **`1942`** — a second season with roster lines but no divider: its roster runs `1. И. Николов` … **`7. В. Митев`** and stops at seven, so there is no line 11 to hang the rule on. The brief counted it among the „no numbered roster lines" group. **The rule was not reshaped; the difference is reported.**
- ✅ **No page renders two** — evidence: `more than one: 0`, and independently, **no season contains a second block numbered 11** in the source data.
- ✅ **All five named seasons match the table** — evidence, read from the built HTML and confirmed live on the page:

  | Season | Result |
  |---|---|
  | `1985-86` | divider after „11. Г. Узунов 27+0/8", before „12. Д. Руменовски9+1/0" ✅ |
  | `1993-94` | divider after „11. Т. Ефтимов 19+1/4", before „12. З. Манев 7+0/0" ✅ |
  | `1984-85` | divider after „11. Г. Узунов 20+9/6" ✅ — first line is „1 Д. Георгиев 15+0 /0", **no dot**, and the rule still lands |
  | `1952` | no divider ✅ |
  | `2017-18` | no divider ✅ (the section holds only the top-scorer sentence) |

- ✅ **No `results` section on any season page renders a divider** — evidence: **0** of 96 built pages match a divider adjacent to a results row; live on `/arhiva/1985-86`, `#rezultati` contains **0** dividers. The results variant uses the module-scope config built with a `null` key, so its `normal` renderer contains no key comparison at all.
- ✅ **The divider markup is exactly as specified** — evidence, computed live: `DIV`, `aria-hidden="true"`, `height 1px`, `background rgb(228,225,216)`, `margin-top 16px`, `margin-bottom 4px`, width 615px (the reading measure). **`document.querySelectorAll('hr').length` → 0** on the page.

### Accessibility & responsive

- ✅ **Contrast measured against each element's real backdrop, all ≥ 4.5:1** — computed from the stylesheet's own token values, not typed from brand.md:

  | Pair | Ratio |
  |---|---|
  | Rail link default — `paper/80` composited on `navy-2` | **8.89:1** |
  | Rail link hover — `paper` on `navy-2` | **13.12:1** |
  | Button's paper arrow on `navy` | **14.95:1** |
  | Button's navy arrow on the `orange` hover fill | **5.81:1** |

  Lowest **5.81**. *(Focus rings, for reference: navy on paper 14.95:1; orange on navy-2 5.10:1 — both well past the 3:1 non-text floor.)*
- ✅ **Focus rings confirmed under a real Tab press** — evidence: parking focus on the element immediately before each target and pressing a real `Tab`. Rail link → `:focus-visible` true, `outline 3px solid rgb(238,122,22)` (orange), `outline-offset 2px`, tap target 178.5×39, and **`elementFromPoint` at its centre returns the link itself** — it is not under the sticky header. Button → `:focus-visible` true, `outline 3px solid rgb(13,31,60)` (navy), `outline-offset 2px`; it is the **last** thing in tab order, one Tab past the footer's final link.
- ⚠️ **Anchor landing measured at 375 · 768 · 820 · 900 · 1280 on `/legendi` and `/statistika`** — **clean at 375, 900 and 1280; ~18px of overlap at 768 and 820, which is OV-40 and not this phase's to fix.**

  | Width | Header | Rail | Section top hidden under the bars |
  |---|---|---|---|
  | 375 | 78 | 47 | **0** (heading clears by 27.1px) |
  | 768 | **101** | 47 | **18.2 / 17.8 / 18.0** |
  | 820 | **101** | 47 | **17.9 / 17.9 / 18.1** |
  | 900 | 78 | 47 | **0** |
  | 1280 | 78 | 47 | **0** (heading clears by 27.1px) |

  The token `--spacing-header` reads `4.875rem` (78px) at every width; between 769 and 898 the seven-item nav wraps to two rows and the header renders **101px**, so every `scroll-mt` anchor in that band lands ~23px short — the same error `/arhiva` already carries. Both new rails inherit it exactly. `SiteHeader.tsx` is out of scope. `/statistika` shows the same figures (17.8–18.3px at 768 and 820, 0 elsewhere).
- ✅ **`/statistika` at 375px does not scroll sideways** — evidence: `document.scrollingElement.scrollWidth === clientWidth` → **375 === 375**, `true`. The 3.09 regression (D-3.09-6) does not return. Same check passes on `/legendi` at 375 and at all five widths on both pages.

### brand.md & state

- ✅ **`brand.md` gained exactly one line, in §Components, and no token** — evidence: `git diff` shows `brand.md | 1 +`, a single added line describing the back-to-top button and naming its `rounded-full` as the one exception to „radius 0 everywhere" (D-3.17-2). No colour, spacing value or token added.
- ✅ **`decisions.md`, `current-state.md` and `file-map.md` updated** — see §6.
- ✅ **`current-state.md`'s first line still names 3.08 as NEXT** — evidence: the file opens `NEXT: **3.08 — Domain cutover to \`www.belasicahistory.mk\`**…`, unchanged (D-3.17-1).

### The preview gate

- ✅ **Branch `phase-3.17-navigation-and-order`, cut from an up-to-date `main` with no unpushed local commits** — evidence, checked **before** cutting (the D-3.12-8 rule): `git log origin/main..HEAD --oneline` → no output; `git fetch` then `git log HEAD..origin/main --oneline` → no output; `git status --short` → clean.
- ✅ **PR opened** — [#47](https://github.com/DinovLazar/belasica-v2/pull/47).
- **Preview build + on-preview verification:** see §9.

## 3. Decisions I made during this phase

All nine are in `decisions.md` as **D-3.17-1 … D-3.17-9**. The four the brief named are `-1` (out-of-order phase), `-2` (the radius exception), `-3` (the statistics order) and `-4` (the wordless divider). The five I made on my own:

- **D-3.17-5 · `BAND_ANCHOR` lives in `@/lib/people`, beside `BAND_TITLE`.** The brief fixes the three id values but not where the map goes. Putting it beside `BAND_TITLE` means a band's title, count noun and anchor read from one source; `RoleBandGrid` takes a new `anchorId` prop rather than deriving it, so the rail and the section cannot disagree. **Rejected:** reusing `headingId` (`band-player`) as the anchor — it is an internal `aria-labelledby` target and does not follow the site's Latin-slug convention. **Logged: YES.**
- **D-3.17-6 · The „fewer than two links" rule now governs all three rails, and costs a measured 46px shift on `/legendi`.** The brief puts the guard in `JumpNav`, so `DecadeJumpNav` inherits it (unreachable on `/arhiva` with the published data — verified against a baseline build) and `/legendi`'s rail vanishes mid-search. Measured: the content below moves up **46px**, always beneath the reader's focus point, since the search field sits above the rail. **Logged: YES.**
- **D-3.17-7 · The `/arhiva` byte-identity item is proved at the rendered DOM and the residue reported.** I ran a **third build** — this branch with `BackToTop` unmounted, in a throwaway git worktree — specifically to isolate the rail refactor from the layout mount. **Rejected:** declaring the item passed (misleading) or failed (also misleading). **Logged: YES.**
- **D-3.17-8 · The focus target follows the brief's Behaviour section, not its DoD sentence.** They describe different end states. **Logged: YES.**
- **D-3.17-9 · The roster's Portable Text config is rebuilt per render; `results` keeps its module-scope object.** The divider key depends on the blocks, so the roster's config can no longer be static. Building `results` with a `null` key is what makes „the results variant is provably unaffected" a fact rather than a claim. **Logged: YES.**

Two smaller calls, not worth their own entries:

- **The scorers' `railItems` block sits above the `balanceRows` comment, not below it.** My first pass inserted it between that comment and the `const` it describes, orphaning the comment. Caught in self-review of the diff and moved.
- **Prettier reformatted one pre-existing line** in `SeasonRecordList.tsx` (a three-line `<h3>` collapsed to one). It is a formatting-only normalisation of a line I did not otherwise touch, produced by the mandated `prettier --write`.

## 4. Deviations from the brief / spec

- **The brief's 45-page breakdown is off by one season** (§2, Task 4). Its total — 51 with a divider, 45 without — is exact. Its split of the 45 is not: **`1942`**, whose roster runs 1–7, is a second season with roster lines but no line 11, and the brief counted it as having none. Reported, not engineered around.
- **`BackToTop` is the repo's seventh client component, not the sixth.** There are six already: `SiteHeader`, `contact/ContactForm`, `home/Reveal`, `archive/PhotoLightbox`, `legends/LegendsBrowser`, `stats/StatTable`. *(`file-map.md` also carries a stale „fifth client component" note on `PhotoLightbox` from 3.05b; left as-is — correcting a filed historical line is not this phase's business, and the new entries state the current count.)*
- **The DoD's focus sentence** — see D-3.17-8 above.
- **The DoD's „byte-identical" wording** — see D-3.17-7 above.
- **Screenshots could not be taken.** The in-app browser pane runs with `document.visibilityState === "hidden"`, which suspends painting and `requestAnimationFrame`. Consequences and how each was worked around, all disclosed rather than skipped:
  - Screenshots after a programmatic scroll return a stale or blank frame, so no visual capture of the button is included. **Everything the screenshot would have shown was measured instead** — computed styles, geometry, colours, and `elementFromPoint` hit tests, which are stronger evidence for layering than a picture would be.
  - `rAF` never fires, so the button's coalesced scroll listener could not run on its own. It was exercised by shimming `window.requestAnimationFrame` to `setTimeout` — the component looks the callback up on `window` at call time, so this drives the **real** listener and threshold code rather than bypassing it. The **mount-time** read needs no rAF and was verified untouched (`/arhiva#d1930`).
  - `:focus` styling needs `document.hasFocus()`, which is false until a real click lands in the pane. Every focus-ring measurement in §2 was taken **after** a real click and a real `Tab` keypress, with `:focus-visible` confirmed true.
- **Nothing in the brief was skipped or deferred.** No item was left unattempted.

## 5. Changed files / deliverables

**New**
- `src/components/JumpNav.tsx` — the shared sticky rail.
- `src/components/BackToTop.tsx` — the fixed back-to-top control (`"use client"`).

**Edited**
- `src/components/archive/DecadeJumpNav.tsx` — now a thin wrapper over `JumpNav`.
- `src/components/archive/SeasonRecordList.tsx` — the roster divider.
- `src/components/legends/LegendsBrowser.tsx` — renders the role rail.
- `src/components/legends/RoleBandGrid.tsx` — new `anchorId` prop.
- `src/app/(site)/layout.tsx` — mounts `BackToTop` once.
- `src/app/(site)/statistika/page.tsx` — the rail, the reorder, the hairlines, the two comments.
- `src/lib/people.ts` — `BAND_ANCHOR`.
- `brand.md` — one line, §Components.
- `src/_project-state/{current-state,file-map,decisions}.md`.

**Deleted:** none. **Dependencies:** none added, removed or upgraded — `00_stack-and-config.md` is correctly untouched.

**Branch** `phase-3.17-navigation-and-order` · **commit** `f9c434e` · **PR** [#47](https://github.com/DinovLazar/belasica-v2/pull/47).

Diffstat: 13 files, +481 / −82.

## 6. State updates done

- ✅ **`current-state.md`** — first line still `NEXT: 3.08`; the 3.17 narrative added ahead of 3.16's; „Last updated" set to this phase; the components inventory notes `JumpNav`, `BackToTop` and the `DecadeJumpNav`/`SeasonRecordList` changes; **OV-43** and **OV-44** added to the owed-verification register.
- ✅ **`file-map.md`** — two new entries (`JumpNav.tsx`, `BackToTop.tsx`) and six updated (`layout.tsx`, `DecadeJumpNav`, `RoleBandGrid`, `SeasonRecordList`, `people.ts`, `statistika/page.tsx`, `LegendsBrowser`).
- ✅ **`decisions.md`** — `D-3.17-1 … D-3.17-9` appended; no past entry edited.
- ✅ **`00_stack-and-config.md`** — deliberately untouched: zero dependency changes.

## 7. Risks, follow-ups, what the next phase needs to know

**Owed to Lazar (both on the register):**
- **OV-43** — a native speaker should read the three new strings on screen: „Скок по улога", „Скок низ статистиката", and „Назад на врвот", which is `sr-only` and therefore only ever *heard*.
- **OV-44** — Ace should confirm what the divider implies. The rule is deliberately silent, but a line in that position still suggests „the starting eleven". If the book's numbering is a squad list in some other order, it should come out.

**Carried, not introduced:**
- **OV-40** stays open and now affects three pages instead of one. The fix is a re-measure of `--spacing-header` or a header that does not wrap — both inside `SiteHeader.tsx`, which no phase has been allowed to touch since 3.16 flagged it. Worth its own small phase before the domain cutover, since it degrades every anchor link on the site at iPad-portrait widths.

**For whoever touches these files next:**
- `JumpNav`'s container+link padding is **load-bearing**: three call sites derive `scroll-mt-[calc(var(--spacing-header)+3.25rem)]` from its 47px rendered height. Changing `py-1`/`py-2` silently breaks all three.
- The three `/legendi` anchors (`#igraci`, `#treneri`, `#pretsedateli`) are now public URLs. D-3.13-3's rule applies: renaming them breaks links already shared.
- `BackToTop` is mounted in the `(site)` layout, so it lands in **every** route's RSC flight payload. That is why no route's built HTML is byte-comparable to `main` any more — expected, and worth knowing before the next „is this page unchanged?" check.

## 8. What's now possible that wasn't before

The three longest pages on the site can be navigated without scrolling through them, from either end — and the rail that does it is now one component, so the next long page gets it in two lines.

## 9. The preview gate — verified on the deployed build

**PR** [#47](https://github.com/DinovLazar/belasica-v2/pull/47) · **Vercel check: pass, „Deployment has completed"** · **Preview URL:**

`https://belasica-v2-git-phase-317-navigatio-50b646-sunset-services-team.vercel.app`

**Routes loaded, with status codes — all 200:**

`/` · `/arhiva` · `/legendi` · `/statistika` · `/razno` · `/za-nas` · `/arhiva/1985-86` · `/arhiva/1984-85` · `/arhiva/1993-94` · `/arhiva/1952` · `/arhiva/2017-18`

**What was re-checked on the deployed preview, not just locally:**

- `/statistika` — sections in document order `#strelci → #nastapi → #bilans → #rekordi`, `#strelci` with **no** `border-t` and the other three with one; rail in the same four-item order; the 21-goal threshold line present **exactly once**.
- `/legendi` — rail `#igraci · #treneri · #pretsedateli`, all three targets resolving; searching „Пандев" leaves one band and the rail **disappears**; clearing the field brings all three back.
- `/arhiva` — the decade rail still renders its **11** links.
- The divider — `1985-86` after „11. Г. Узунов 27+0/8" before „12. Д. Руменовски9+1/0"; `1993-94` after „11. Т. Ефтимов 19+1/4" before „12. З. Манев 7+0/0"; `1984-85` after „11. Г. Узунов 20+9/6" (the no-dot season); `1952` and `2017-18` **none**. **Zero `<hr>` elements** across the season pages served.
- The button — `"Назад на врвот"` appears **0** times in the HTML of every route fetched. Live at 1280: `fixed`, `bottom/right 32px`, `z-30`, `48x48`, round, navy on paper ink, `0.16s`, `type="button"`; clicking it took `scrollY 2250 → 0` and left focus on „Прескокни на содржина".
- Anchor landing at 1280: every jumped-to section clears both sticky bars by **5px** on both pages; `scrollWidth === clientWidth` on both.

### Five things for Lazar to eyeball

1. **`/statistika`** — the page should now open on the **scorers table**, with „Клупски рекорди" at the very bottom. There should be **no hairline** above „Најдобри стрелци", and one above each of the other three.
2. **`/legendi`** — the navy strip under the header reading **ИГРАЧИ · ТРЕНЕРИ · ПРЕТСЕДАТЕЛИ**. Click each; then type a player's name in the search box and watch the strip **vanish** once only one band is left.
3. **The button** — scroll down anywhere until a **navy circle** appears bottom-right. Hover it: it should flip to **orange with a navy arrow**. Click it: back to the top.
4. **`/arhiva/1985-86` → „Статистика на играчи" → „Состав и статистика"** — a faint line under **„11. Г. Узунов 27+0/8"** and above „12. Д. Руменовски". Then `/arhiva/1952`, where the roster stops at eleven and there should be **no line at all**.
5. **`/arhiva`** — should look and behave **exactly** as before. If anything there is different, that is a bug, not a feature.

*One thing worth knowing: on an iPad in portrait (roughly 769–898 px wide) a jumped-to heading will sit slightly under the header. That is **OV-40**, it was already true of `/arhiva`, and fixing it means editing the site header — which this phase was not allowed to touch.*
