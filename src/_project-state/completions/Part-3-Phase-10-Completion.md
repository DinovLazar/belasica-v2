# Part 3 · Phase 10 · Code — Completion Report

**Date:** 2026-07-31 · **Outcome (one line):** The contact page stopped apologising for itself, the legends search moved into the navy header and now answers a Latin keyboard, and the homepage opens on the 1982/83 squad instead of the newest one.

---

## 1. What shipped (plain language)

Three corrections the owner asked for, to pages that were already live.

**`/kontakt` no longer says it is unfinished.** The „Страницата е во подготовка" banner is gone. It had already been rewritten twice in a single day as the form went live and then the email was published, and after the third time the honest conclusion was that the element itself was wrong, not its wording. The form, the email link and the social-media placeholder are untouched — the socials are still genuinely unknown and still render as a visible placeholder.

**The legends search moved up into the navy header, and it now understands Latin typing.** It used to sit alone in a wide empty band below the header; it now sits inside it, under a new line reading „160 личности". More importantly, someone typing `Gjorgji`, `Gorgi` or `Djorgji` on an ordinary keyboard now finds Ѓорѓи — which matters for a diaspora audience that mostly does not have a Cyrillic keyboard. Typing in Cyrillic works exactly as it did before; that was proved, not assumed.

**The homepage opens on history.** The hero is now the 1982/83 team photograph rather than the most recent squad. If that photo is ever unpublished the page quietly falls back to the newest season instead of showing a hole — tested by pointing it at a season that does not exist.

**One thing did not work out, and it needs the owner:** on a phone, the picture shape the brief specified cannot show the full team photograph. About a fifth of the width gets cut, which slices the outermost kneeling player at each edge. That is geometry, not a bug that can be tuned away — details in §2 and §3.

---

## 2. Definition of Done

### Contact

- ⚠️ **No element on `/kontakt` renders „Страницата е во подготовка" or „Оваа страница сѐ уште се доработува"; `grep` across `src/` returns nothing for either.** — **The page requirement passes; the repo-wide grep does not, and cannot.** On the deployed preview, `/kontakt` contains neither string (`bannerText: false` against the full `document.body.textContent`). But `grep -rn` across `src/` returns **one** hit: `src/app/(site)/za-nas/page.tsx:123`, a **separate** `ProvisionalBanner` component with its own second paragraph („Текстот за архивата и за луѓето зад неа сѐ уште се дополнува…") and its own open placeholder fields. `/za-nas` is not in this phase's scope or its edited-files list, and the caveat is still true of that page, so it was left alone (D-3.10-9). **Owner question, carried forward.**
- ✅ **The form, the email link and the socials `PlaceholderChip` are all unchanged and still render. PL-15 is still an open chip.** — evidence, measured on the preview DOM: `formPresent: true`, email link text `info@belasicahistory.mk`, `<main>` carries exactly **1** chip — `[PLACEHOLDER: профили на социјалните мрежи]` — and the footer carries its own site-wide one. **PL-15 open.**
- ✅ **No unused import is left behind; ESLint clean.** — `Reveal` is still used by the two `<section>` blocks and was correctly kept; `npm run lint` exits 0 with no output.

### Legends search

- ✅ **The input renders inside the navy header block. No white strip between the header and the first band's orange rule at 375, 768, 1280 and 1408 px.** — evidence: `inputInsidePageHeader: true` at every width; the gap between the header's bottom edge and the first orange rule is **48 / 48 / 64 / 70 px**, which is exactly the `py-section` token (`clamp(3rem,5vw,4.5rem)`), and every sampled pixel in that strip resolves to the page's own paper background, not white.
- ✅ **The header meta line shows the real placed-people total with the correct singular/plural, and matches the sum of the band counts.** — renders „160 личности"; band counts on the same page read **86 играчи + 46 тренери + 28 членови = 160**, and the page contains exactly 160 unique person links.
- ✅ **Every Latin query returns the named person, with its hit count.** — **all 30 rows match the briefed counts exactly.** Verified twice: in Node against the live 160-name roster, and again live in the browser by driving the real input. Counts below are the browser run.

  | Typed | Hits | Expected | Result |
  |---|---|---|---|
  | `gjorgji` | 3 | 3 | ✅ Ѓорѓи Ќучуков, Ѓорѓи Москов, Ѓорѓи Стојчев |
  | `gorgi` | 3 | 3 | ✅ the same three |
  | `kjucukov` / `kucukov` | 1 / 1 | 1 / 1 | ✅ Ѓорѓи Ќучуков |
  | `ljupco` / `lupco` | 2 / 2 | 2 / 2 | ✅ Љупчо Мафков, Љупчо Стоилков |
  | `zivkovic` / `zhivkovikj` | 1 / 1 | 1 / 1 | ✅ Марјан Живковиќ |
  | `shefki` / `sefki` | 1 / 1 | 1 / 1 | ✅ Шефки Арифовски |
  | `dusko` / `dushko` | 2 / 2 | 2 / 2 | ✅ Душко Колев, Душко Руменовски |
  | `panche` / `pance` | 4 / 4 | 4 / 4 | ✅ the four Панче |
  | `hadziski` / `hadjiski` | 1 / 1 | 1 / 1 | ✅ Чедо Хаџиски |
  | `dzrtev` / `djrtev` | 2 / 2 | 2 / 2 | ✅ Боривое Џртев, Митко Џртев |
  | `alagjozovski` / `aladjozovski` | 1 / 1 | 1 / 1 | ✅ Мартин Алаѓозовски |
  | `bozic` / `bozhikj` | 1 / 1 | 1 / 1 | ✅ Никола Божиќ |
  | `cedo` / `chedo` | 1 / 1 | 1 / 1 | ✅ Чедо Хаџиски |
  | `gjuzelov` / `djuzelov` | 1 / 1 | 1 / 1 | ✅ Игор Ѓузелов |
  | `cicmilovic` | 1 | 1 | ✅ Раде Цицмиловиќ |
  | `dzorlev` | 2 | 2 | ✅ Митко Џорлев, Славко Џорлев |
  | `pandev` | 1 | 1 | ✅ Горан Пандев |
  | `goran pandev` | 1 | 1 | ✅ Горан Пандев — the space matched across the name |

  Repeated live on the **deployed preview**: `gjorgji` → „3 резултати".
- ✅ **Cyrillic search is unchanged: „Ѓор", „панче" and „ЖИВ" each return what they return on `main` today.** — evidence beyond the three: an **exhaustive** comparison of **9,871 distinct Cyrillic substrings** (every Cyrillic substring of every roster name up to length 12) against `main`'s exact `normalise().includes()` behaviour returns **identical result sets, every one — zero mismatches**. The three named queries return 4 / 4 / 1, matching `main`. Uppercase and padded forms (`ЃОРЃИ`, `"  панче  "`) also match.
- ✅ **`Димитар Стојков-Чутино` findable by `stojkov`; `Дени Масев (Данчо Масев)` by `masev`.** — `stojkov` → 4 hits including `dimitar-stojkov-chutino`; `masev` → 1 hit, `deni-masev-dancho-masev`. Hyphen, parentheses and the en dash in `Ристо Попов (Р. Попов–Думбович)` all take the "matches only itself" path rather than throwing.
- ✅ **A query with no match still shows „Нема личност со такво име во архивата." and no band heading.** — `qqqzzzxxx` → 0 cards, live count „0 резултати", the notice rendered exactly once, and **zero** band headings present.
- ✅ **Typing fast produces no perceptible lag; no debounce was added.** — no debounce and **no memoisation** were needed. Measured over the full 160-name roster: **0.16–0.23 ms per pass**, including deliberately adversarial queries designed to force backtracking (`cccccccccccccccccccc`, `szczszczszcz`, `dzdzdzdzdzdzdzdz`, `sisisisisisisisisisi`). Worst single keystroke while typing out „aleksandar ozdolenovski" character by character: **0.23 ms**.
- ✅ **The page still renders every person with JavaScript disabled.** — `/legendi` still builds as `○ (Static)`; the server HTML contains **160** unique person links, the „160 личности" meta line and the search input. Confirmed on the deployed preview too.
- ✅ / ⚠️ **Label, placeholder and result-count each ≥4.5:1 against navy; focus ring is the orange on-navy variant, visible on keyboard focus.** — focus ring ✅: confirmed under a **real Tab** press (not a programmatic `.focus()`), computed `outline: 3px solid rgb(238,122,22)`, `outline-offset: 2px`, `:focus-visible` matching — on both the input and the clear button; visible in the preview screenshot. Contrast, measured by compositing each colour over its **actual** backdrop: label **14.95:1**, result count **9.95:1**, meta **9.95:1** — all on navy, all pass. ⚠️ The **placeholder** does not sit on navy — it sits inside the white input the same brief mandates — so it measures **6.69:1 against white** (passes AA). Against navy it would be 2.45:1, but no text is ever rendered in that combination. The brief's gate is self-conflicting here; see D-3.10-8.

### Homepage hero

- ✅ **The homepage hero renders the 1982/83 squad photograph.** — asset `f26b56dfde2caee1210df41113ec2e748a596acf-1079x561.jpg`, the `teamPhoto` of `season-1982-83`, on both local and the deployed preview.
- ❌ **At 375 px the full front row of kneeling players is visible — nobody in that row is cut off at either edge.** — **NOT MET, and it cannot be met at the mandated ratio.** `object-cover` fitting a **1.934:1** photograph into a **1.5:1** (`3/2`) box must discard width: measured in the live page, the visible window is **11.2 %–88.8 %** of the picture, i.e. **22.4 % cropped, 11.2 % off each side**, and the outermost kneeling player at each edge falls inside those bands — visible in the 375 px screenshot. `objectPosition` cannot resolve it: at that width the full height is already shown so the vertical value has **no effect at all**, and the horizontal value can only trade one edge for the other. The brief states the aspect ratios are the owner's decision and must not be tuned, so they were followed exactly and the conflict is reported rather than silently resolved. See D-3.10-6 / **OV-24**.
- ✅ **At 1408 px both rows of heads are inside the frame.** — the `21/8` box is wider than the photograph, so the **full width** is shown and only height is cropped; both rows are complete in the preview screenshot.
- ✅ **The crest + „ФК БЕЛАСИЦА" lockup still sits on solid navy, not over the photograph, at all three widths.** — measured, not eyeballed: the `<h1>`'s top edge and the photo box's bottom edge are the **same pixel** (614 / 614 at 1408), so the wordmark is entirely below the picture on solid navy (14.95:1). Only the crest carries the negative margin and overlaps, which is the intended design.
- ✅ **The hero `alt` is not empty and does not read `undefined`.** — `alt="Тимска фотографија — Сезона 1982/83"`, derived from the fetched season title with Studio's „…“ quotes stripped, not hardcoded.
- ✅ **„Момент од историјата" still renders the 1993 Cup photo and is not the same image as the hero.** — moment asset `54eac988827fbfd04874f3a282b728c72b349d9e-1564x970`, caption „Младата екипа на Беласица со Купот на Македонија, 1993"; different asset from the hero. Verified against the production dataset that the `_id` exclusion changes nothing today — the moment resolves identically with and without it.
- ✅ **Unpublishing simulation falls back to the newest-season photo and renders no placeholder. Reverted after testing.** — with `HERO_SEASON_SLUG` pointed at a non-existent slug, the hero rendered `149a16459dca250c51315a099594e3c56de562b5-2048x1152` (the 2025/26 photo) with `alt="Екипа на ФК Беласица"` — its own caption — and `rendersPlaceholderChip: false`. Reverted; the committed value is `"1982-83"`.

### Repo

- ✅ **Production build passes in a clean clone; page count unchanged.** — `npm run build` → **271/271**, identical to `main`. ⚠️ The first attempt died on the known `WasmHash` webpack **cache** flake (`TypeError: Cannot read properties of undefined (reading 'length')` in `bundle5.js`); `rm -rf .next` and a clean rebuild passed. Environment flake, not a code fault — and the clean rebuild is what the DoD asks for anyway.
- ✅ **`tsc` clean, ESLint clean, prettier applied.** — `npx tsc --noEmit` exit 0; `npm run lint` exit 0, no output; `npx prettier --write` applied to all six source files, then tsc/lint re-run clean and the matcher re-verified afterwards.
- ✅ **No new dependency; `package.json` unchanged.** — `package.json` and the lockfile are not in the diff.
- ✅ **No hardcoded colour, spacing or type value — tokens only.** — every value used is an existing token (`text-paper`, `text-paper/80`, `text-ink`, `border-mist`, `bg-white`, `mt-8`, `max-w-md`, `py-section`, `u-focus--on-navy` via `focusOnNavy`). No new `brand.md` token, no `@theme` entry, no inline focus ring.
- ✅ **`decisions.md`, `current-state.md`, `file-map.md` updated; NEXT line reads 3.08.** — see §6.
- ✅ **One PR from `phase-3.10-contact-search-hero`; no commits on `main`.** — [PR #40](https://github.com/DinovLazar/belasica-v2/pull/40). `main` untouched.

### Owed to Lazar

- ✅ **Vercel preview URL + 5-item eyeball checklist** — see §7.
- ⬜ **Native confirmation that „160 личности" reads naturally** — **OV-25**, owed.
- ⬜ **Owner confirmation of publishing rights to the 1982/83 photograph** — **OV-26**, owed. OV-1/OV-RIGHTS covered the Drive photos generally, but this frame is now the single most prominent image on the site.

---

## 3. Decisions I made during this phase

All nine are logged as **D-3.10-1 … D-3.10-9**. The ones the brief did not spell out:

- **The empty-roster branch keeps its own `PageHeader`, so three header strings are written twice** · with `LegendsBrowser` owning the header, the `placed === 0` path has no field to host and no real count to state · alternatives rejected: a new shared constants module (this phase's outputs are a fixed list and `translit.ts` is the only new file it owns), exporting the constants from the route file (Next restricts route exports), or giving `LegendsBrowser` an empty state (puts a placeholder branch inside a filter component) · **decision-log entry: YES — D-3.10-3.**

- **Contrast is measured against each element's real backdrop, not against navy across the board** · the brief requires both a white input surface *and* that the placeholder measure 4.5:1 against navy; those are mutually exclusive, since any colour passing on navy would be unreadable on the white field where it actually renders · kept `text-neutral-500` unchanged from `main` (6.69:1 on white) · **decision-log entry: YES — D-3.10-8.**

- **`/za-nas` keeps its „Страницата е во подготовка" banner** · the DoD's repo-wide grep assumed the string lived only on `/kontakt`; it is also a separate component on `/za-nas`, still true of that page and outside this phase's scope · alternative rejected: deleting it to make the grep pass, which would remove a truthful notice from a page the owner did not ask about · **decision-log entry: YES — D-3.10-9.**

- **No memoisation was added to the matcher** · the brief permits it *if* a query shape stalls the input; I looked for one deliberately and none exists (worst measured pass 0.23 ms over 160 names, including adversarial backtracking queries), so the simpler code stands · **decision-log entry: folded into D-3.10-7.**

- **The alt text is resolved by a helper that walks the same order as the image** (`heroAltFor`), rather than as an inline `||` chain · the brief specifies the chain for the pinned photo only, and an inline version would let alt and image disagree whenever the fallback fires · **decision-log entry: folded into D-3.10-4.**

- **Verification method: the real `.ts` module was executed directly under Node** (v26 strips types natively) rather than reimplementing the table in a test script · a hand-copied duplicate could drift from the shipped code and prove nothing · no decision-log entry needed — method, not product.

---

## 4. Deviations from the brief / spec

- **The 375 px crop requirement is not met** — and cannot be, at the ratio the brief mandates and forbids me from tuning. Implemented exactly as specified (`aspect-[3/2]`, `objectPosition="50% 38%"`), reported rather than silently fixed. **The fix is one line** (`aspect-[2/1]` or wider shows the full width and crops height instead) and is the owner's call. D-3.10-6 / OV-24.
- **The repo-wide grep gate cannot pass** because of `/za-nas`. The underlying requirement — `/kontakt` renders neither string — does pass. D-3.10-9.
- **The placeholder contrast figure is measured against white**, its real backdrop, not against navy. D-3.10-8.
- Everything else in the brief was done as written. No task was skipped, deferred or narrowed.

---

## 5. Changed files / deliverables

**New**
- `src/lib/translit.ts` — the Latin-spelling table and `matchesName()`.

**Edited**
- `src/app/(site)/kontakt/page.tsx` — banner block and its `mt-10` deleted; doc comment rewritten.
- `src/app/(site)/legendi/page.tsx` — keeps the server work; renders `PageHeader` only on the empty branch, otherwise returns `<LegendsBrowser bands={bands} />`.
- `src/components/legends/LegendsBrowser.tsx` — now renders `PageHeader` + the field as its `children` + the bands; filter switched to `matchesName`; field chrome moved to the navy scale.
- `src/lib/people.ts` — added `personCountLabel`.
- `src/app/(site)/page.tsx` — `HERO_SEASON_SLUG` / `HERO_PHOTO_ID` constants, `heroPinned` in `HOME_QUERY`, `heroAltFor()`, hero box `4/5 → 3/2`, `objectPosition 32% → 38%`, `moment` excludes the hero by `_id`.
- `src/_project-state/decisions.md`, `current-state.md`, `file-map.md`.

**Branch / commit / PR** — branch `phase-3.10-contact-search-hero`, commit `3133885`, **[PR #40](https://github.com/DinovLazar/belasica-v2/pull/40)** → `main`. No commits on `main`.

**No secrets** in the diff. No schema change, no Sanity write, no `brand.md` token, no dependency.

---

## 6. State updates done

- **`current-state.md`** — NEXT line rewritten to lead with **3.08 — Domain cutover** and carry the 3.10 result; the deep per-phase history it had accumulated (12,193 → 5,977 chars) was trimmed to pointers into `completions/`, per the snapshot-not-log rule. Summary bullet added; the `/kontakt`, `/legendi` and homepage entries in "Built pages" now describe what actually ships; `/kontakt` is no longer described as provisional while `/za-nas` still is; **OV-24, OV-25, OV-26** added to the owed-verification register; two carryovers added. **PL-15 unchanged and still open.**
- **`file-map.md`** — `src/lib/translit.ts` added; the `LegendsBrowser`, `legendi/page.tsx`, `people.ts`, `kontakt/page.tsx` and homepage entries corrected for the moved header, the new label and the pinned hero.
- **`00_stack-and-config.md`** — **not touched, correctly**: no dependency was added or upgraded.

---

## 7. Risks, follow-ups, what the next phase needs to know

**Preview:** https://belasica-v2-cidicbobc-sunset-services-team.vercel.app — verified before requesting merge, gate not waived. All 9 routes return 200, an unknown slug returns 404, and the preview reproduces the local build exactly (160 person links, „160 личности", the pinned hero asset with its derived alt, the 1993 moment photo, `aspect-[3/2]` present and `aspect-[4/5]` gone, zero banner strings, 1 chip in `/kontakt`'s `<main>`).

**Eyeball checklist for Lazar (5 items):**
1. `/kontakt` — no banner above the form. → https://belasica-v2-cidicbobc-sunset-services-team.vercel.app/kontakt
2. `/legendi` — the search sits inside the navy header, under „160 личности", with no empty band below it. → `/legendi`
3. Type `gjorgji` (or `pandev`) into that field — Cyrillic names come back from Latin letters.
4. The homepage hero **on a phone** — **this is the one that needs your decision.** The team photo is cut at both edges; see OV-24.
5. The homepage hero **at desktop width** — the full squad, both rows.

**Risks / follow-ups**
- **OV-24 (owner decision, most important):** the phone crop. One line changes the base ratio if you want the whole team over the taller box.
- **OV-26:** this photograph is now the most prominent image on the site — worth an explicit rights confirmation on this single frame before launch.
- **OV-25:** „160 личности" needs a native ear.
- **`/za-nas`'s banner** is still there and is an open owner question (D-3.10-9).
- **The hero scan is upscaled.** 1079 px wide against a 2400 px request — slightly soft on a wide desktop. Accepted for an archival photograph; only a better scan of the same frame would fix it.
- **Known environment flakes, both hit and both already documented:** the `WasmHash` webpack-cache build crash (fix: `rm -rf .next`), and the in-app browser throttling timers and killing `requestAnimationFrame` while its pane is hidden — which is why the browser verification uses timers plus a fronted pane rather than rAF.
- **Still handed on, not introduced here:** 3.06a shipped to `main` with no completion report and no decisions logged; `_to_delete/` plumbing junk is still tracked on `main`, with two untracked strays beside it; and one „ТЕСТ" message is still sitting in the owner's Formspree inbox.

**Next phase is 3.08 — Domain cutover.** Nothing in this phase touched `metadataBase`, `robots.ts`, `sitemap.ts`, canonical URLs or the OG image, so 3.08 starts on exactly the ground it expected.

---

## 8. What's now possible that wasn't before

Someone in Melbourne or Malmö with no Cyrillic keyboard can type `pandev` and find him — and the first thing they see is the club's own history rather than last season's squad.
