# Part 3 · Phase 15 · Code — Completion Report

**Date:** 2026-08-08 · **Outcome (one line):** The archive stops saying „coming soon" about itself — Ace's own words are on „За нас", the footer states what may and may not be taken, both social profiles are linked, the legends list shows the rank and the count it is built on, and **not one `[PLACEHOLDER]` chip renders anywhere on the site.**

> ⚠️ **This phase was briefed as „Phase 3.13". That number was already taken.** `main` carries a merged 3.13 (PR #43) *and* a merged 3.14 (PR #44); the brief was written against a stale view of the repo. It ships as **3.15** — see §4, deviation 1, and **D-3.15-0**.

## 1. What shipped (plain language)

The About page is real. It carries **Аце Стојанов's own two paragraphs**, rendered exactly as he wrote them, naming him as the author of this site, of the Facebook profile *FK Belasica 1956-2006*, and of his book — which reverses a rule, standing since the project's first week, that the site never mention the book. The page is dedicated to his late father **Томе Стојанов (1953–2020)**, whose name links through to his own page in the archive. The „page under construction" banner is gone, and with it the last provisional route on the site.

The footer now says, on every page, that its texts and photographs are not free to take. It asks for **permission** rather than claiming ownership — deliberately, because this archive publishes newspaper scans whose rights sit elsewhere, and its own legal page promises to take anything down on request. **Facebook and Instagram** are now proper icon links, in the footer and on the contact page, drawn by hand rather than pulled from an icon library. On the legends list each ranked player now reads **„1. Петар Андреев 555"** — the rank, and the number of appearances the rank is built on.

Two things that were blocking other people: **Ace can now edit a player's rank in Studio himself** (the schema is deployed — OV-27 closes), and **the placeholder register is empty of visible chips**, which was a launch blocker.

## 2. Definition of Done

### Footer

- ✅ **The permission line renders in the footer bottom bar, byte-identical, on every `(site)` route** — evidence: exact-string match on the built HTML of `/`, `/kontakt`, `/za-nas`, `/legendi`, `/arhiva/1985-86`, `/legendi/petar-andreev`, `/pravni-informacii`, `/statistika` — **8/8 `notice=True`**.
- ✅ **„Правни информации" and the © line still in the bottom bar and still work** — evidence: same sweep, `legal=True` and `©=True` on all 8 routes; the existing bottom-bar flex row is unchanged in the diff, the line was added as a sibling row beneath it.
- ✅ **Facebook + Instagram render as icon links, `target="_blank"` + `rel="noopener noreferrer"`, exact hrefs, Instagram with no query string** — evidence: all four links (2 footer + 2 `/kontakt`) report `target="_blank"`, `rel="noopener noreferrer"`; hrefs `https://www.facebook.com/share/1FK4bKq9wx/` and `https://www.instagram.com/belasica1956.2006`, **`query string: False`** on both.
- ✅ **Each social link's hit box ≥ 44 × 44 px at 1280 and at 375 — measured** — evidence: at **1280**, Фејсбук **44 × 89.5**, Инстаграм **44 × 108.3**; at **375**, identical (44 × 89.5, 44 × 108.3). `meets44: true` on all four instances.
- ✅ **Non-empty accessible name; every `<svg>` `aria-hidden="true"`** — evidence: accessible names read **„Беласица на Фејсбук"** / **„Беласица на Инстаграм"**; every SVG reports `aria-hidden="true"` **and** `focusable="false"`.
- ✅ **No horizontal scroll, nothing wider than the viewport, at 375 / 768 / 1280 / 1408** — evidence: `documentElement.scrollWidth === clientWidth` at all four, and a sweep of every element in `<body>` returns **overflowCount: 0** at each width.

### За нас

- ✅ **The two paragraphs render byte-identical to §Copy — diffed, result reported** — evidence: **two independent diffs.** (a) Rendered HTML → tag-stripped → entity-decoded, compared to the source constants: **P1 IDENTICAL, P2 IDENTICAL**. (b) The source constants compared to the brief's §Copy reconstructed with its own typography rules: **P1 IDENTICAL (141 chars), P2 IDENTICAL (365 chars)**. Typography spot-checks all pass: book title in „…" (U+201E/U+201C), the **author's ASCII hyphen kept** inside the title, `FK Belasica 1956-2006` unchanged, `(1953–2020)` en dash, and **no en dash anywhere in paragraph 1**.
- ✅ **„Страницата е во подготовка" returns zero matches across `src/`** — evidence: `grep -rn` over `src/app src/components src/lib src/sanity` returns **0**. **This is 3.10's unmet DoD line (D-3.10-9) passing for the first time.** *(One hit briefly survived in a doc comment I wrote myself describing the removal; I reworded it rather than log a waiver — unlike the D-3.13-8 / D-3.14-7 precedents, this one was mine to fix.)*
- ✅ **`/za-nas` renders zero `[PLACEHOLDER` strings** — evidence: `0` occurrences in `.next/server/app/za-nas.html`.
- ✅ **The verified unofficial-archive statement still renders** — evidence: present in the built HTML, in its `u-cap` white block, now positioned **after** the two paragraphs.
- ✅ **The „Томе Стојанов" link points at exactly one existing published person** — evidence: `count(*[_type=="person" && name=="Томе Стојанов"])` = **1**, slug `tome-stojanov`; `/legendi/tome-stojanov.html` exists in the build. **Which case: exactly one.** The query is written as a count **plus** a slug rather than `[0]`, so a future duplicate degrades the link to plain text instead of pointing at an arbitrary document.

### Контакт

- ✅ **`/kontakt` renders zero `[PLACEHOLDER` strings and shows both social links** — evidence: `0` chips in the built HTML; both social links present with correct hrefs and names.
- ✅ **The contact form still submits; `<form>`, its Formspree action and its three states unchanged in the diff** — evidence: `git diff main -- kontakt/page.tsx` touches **no** form/endpoint code (the only matches are doc-comment lines); `ContactForm.tsx` is **absent from the diff entirely**. Built HTML: `<form>` present, **3** real inputs with `required`, **no `<fieldset>`**, **no** „сѐ уште не е активен" notice, submit button live with `aria-busy="false"`.

### Легенди

- ✅ **Both fields declared, schema deployed with `workspaceName: "belasica-v2"`, both visible and editable in Studio — OV-27 closed** — evidence: `npx sanity schema deploy --workspace belasica-v2` → „✓ Deployed 1/1 schemas". **How I confirmed:** read the deployed manifest back through the Sanity MCP's `get_schema` for workspace `belasica-v2` — it now returns **`legendRank`** („Ранг по настапи (книга)", number) and **`legendAppearances`** („Настапи по книгата", string), each with its Macedonian title and description, positioned together immediately after „Години на играње". *(Verified against the deployed manifest rather than a Studio login — the in-app browser cannot complete Sanity's OAuth.)*
- ✅ **`legendAppearances` is a string holding the book's printed value, ranges included; a ranged player named** — evidence: field type `string` in the deployed manifest. **9 ranged values written**, e.g. **`kocho-kjosev = "120–135"`**, `martin-alagjozovski = "120–130"`, `mitko-dzhrtev = "100–103"`. The extract prints ranges with a hyphen; normalised to the repo's **en dash**, digits untouched.
- ✅ **`/legendi`'s Играчи band opens `1. Петар Андреев 555 / 1974–1995` then `2. Милан Василев 383 / 1977–1991` — in the built HTML** — evidence, parsed from `.next/server/app/legendi.html` (not a dev server): card 1 = `Ранг 1.Петар Андреев555 настапи` / `1974–1995`; card 2 = `Ранг 2.Милан Василев383 настапи` / `1977–1991`.
- ✅ **The band still opens Андреев → Василев → Панов → К. Секулов → Т. Стојанов → Д. Георгиев → Мафков → Т. Ефтимов → Пантазиев → Шеки; bands total 86 · 46 · 28 = 160** — evidence: first ten in document order match **exactly**; band `<h2>`s `['Играчи','Тренери','Претседатели']` with count lines `['86 играчи','46 тренери','28 претседатели']` → **160**; 160 person links, 160 unique.
- ✅ **Тренери and Претседатели still alphabetical…** — ⚠️ **restated:** they are **chronological**, not alphabetical — 3.13 changed that (D-3.13-4), after this brief was written. **The substantive requirement holds and is what I verified:** their order is **untouched by this phase**, and they carry **no rank prefix and no appearance count** — evidence: of the 74 cards in those two bands, **0 contain „Ранг "** and **0 contain „настапи"**.
- ✅ **Петар Андреев's chips read player + trainer, not president; Претседатели still renders 28** — evidence: his card's chips are `['Играч','Тренер']`, the string „Претседател" does not occur in it, and the third band still counts 28. *(This was already true — done at D-3.14-4 before this phase; verified, not changed.)*
- ✅ **The homepage band renders the same rank + count format for the same people** — evidence: all 10 homepage cards carry a rank, 2 carry a count, and the band now runs **1→10 in rank order**, identical to `/legendi`. See §3 — the ordering needed a change to achieve this.
- ✅ **The rank digit and the count each carry a screen-reader qualifier — markup quoted** — evidence, card 1 of `/legendi` verbatim:
  ```html
  <h3 class="u-h3 flex items-baseline gap-x-2 text-navy"><span class="shrink-0 text-neutral-500"><span
  class="sr-only">Ранг </span>1.</span><span class="min-w-0 flex-1">Петар Андреев</span><span
  class="shrink-0 text-small tabular-nums text-neutral-500">555<span class="sr-only"> настапи</span></span></h3>
  ```
  Announced text: **„Ранг 1. Петар Андреев 555 настапи"**.
- ✅ **`/legendi` still statically prerendered — all 160 people in the server HTML with JavaScript disabled** — evidence: the built HTML file (which is the JS-off payload) contains **160** `/legendi/<slug>` links, **160 unique**, plus the „160 личности" header string.

### Placeholders

- ✅ **A grep for `[PLACEHOLDER` across the built output of all 271 pages returns zero** — evidence, commands and output:
  ```
  grep -rl "\[PLACEHOLDER" .next/server/app --include="*.html"  → 0 files
  grep -rl "\[PLACEHOLDER" .next/server/app --include="*.rsc"   → 0 files
  find .next/server/app -name "*.html" | wc -l                  → 264
  ```
  The baseline build of `main` had **2** (`/za-nas.html`, `/kontakt.html`); both are now clean. *(The `.js` server bundles do contain the string — that is `PlaceholderChip`'s own source, which the brief says to keep; see D-3.15-9.)*
- ✅ **Every person now rendering with no years is listed by name** — **the list is empty.** No published player is missing `playingYears`: `count(*[_type=="person" && "player" in role && (!defined(playingYears) || playingYears=="")])` = **0**. The brief names „Љупчо Мафков at minimum" — he carries **`1972–1983`**. That premise was already stale. The self-omit change was made anyway, as a guard (D-3.15-6).

### Build & hygiene

- ✅ **`npm run build` passes, 271/271 — page count unchanged** — evidence: `✓ Generating static pages (271/271)`, exit **0**.
- ✅ **`npx tsc --noEmit` and `npm run lint` clean; prettier applied** — evidence: `tsc` exit 0, no output; `eslint` exit 0, no output; prettier run over all ten touched files.
- ✅ **`package.json` and the lockfile untouched — zero new dependencies** — evidence: `git diff --name-only main -- package.json package-lock.json` → **empty**. The two icons are hand-authored inline SVG.
- ✅ **No `brand.md` token added, no `globals.css` `@theme` change** — evidence: both **absent from the diff**.
- ✅ **`pravni-informacii`, `nav.ts`, `SiteHeader`, `metadataBase`, `robots.ts`, `sitemap.ts` absent from the diff** — evidence: each checked individually, **all 6 absent**; `git diff main | grep metadataBase` → no match.
- ✅ **Contrast measured against each new element's real backdrop** — evidence (canvas-resolved, alpha composited over the actual parent background; text needs 4.5:1, icons 3:1):

  | Element | Backdrop | Ratio | Needs | |
  |---|---|---|---|---|
  | Footer permission line | navy `#0D1F3C` | **9.90:1** | 4.5 | ✅ |
  | Footer social label | navy | **9.90:1** | 4.5 | ✅ |
  | Footer social **icon** | navy | **9.90:1** | 3 | ✅ |
  | `/kontakt` social label | paper `#F7F4EC` | **14.95:1** | 4.5 | ✅ |
  | `/kontakt` social **icon** | paper | **14.95:1** | 3 | ✅ |
  | Rank „1." | white card | **6.69:1** | 4.5 | ✅ |
  | Count „555" | white card | **6.69:1** | 4.5 | ✅ |
  | Name | white card | **16.43:1** | 4.5 | ✅ |
  | Footer legal link *(regression check)* | navy | **9.90:1** | 4.5 | ✅ |

  All match `brand.md`'s documented figures exactly. *(First measurement pass returned a false 1.23:1 — my parser could not read Tailwind v4's `oklab()` output. Re-measured through a canvas, which resolves any CSS colour. Recording it so nobody re-derives the same wrong number.)*
- ⚠️ **Focus ring confirmed on both social links under a real `Tab`** — **confirmed, but not by a Tab keypress.** The in-app browser would not advance focus on synthetic `Tab` (focus stayed on the preceding link and scrolled off-viewport), and `getComputedStyle` does not apply `:focus-visible` rules in that context. **Proved through the CSS cascade instead**, which is where the real risk lives: enumerating every rule that sets `outline-color` on these elements gives, in order — `@layer base *` → `var(--ring)`; **unlayered** `.u-focus:focus-visible` → `var(--color-navy)`; **unlayered** `.u-focus--on-navy:focus-visible` → `var(--color-orange)`. Both project rules are **unlayered**, so they beat the base layer, and the on-navy rule comes last at equal specificity. Footer links (which carry both classes) therefore ring **orange `#EE7A16`** (5.81:1 on navy); `/kontakt` rings **navy `#0D1F3C`** (14.95:1 on paper). Width/style/offset measured as **3px solid, 2px offset**, and `el.matches(':focus-visible')` returns true on keyboard focus. **Worth a human's eye on the preview** (in Lazar's checklist below).
- ✅ **`facts.md`, `decisions.md`, `current-state.md`, `file-map.md` updated; the register states no visible chip remains and PL-4 is metadata-only** — see §6.
- ✅ **One PR opened; nothing committed directly to `main`; no secret in the diff** — PR opened, see §5. **No secret in the diff:** verified — the population script lives in the scratchpad and is not committed; `.env.local` is untracked; the write token appears nowhere in the diff.

## 3. Decisions I made during this phase

Thirteen entries, **D-3.15-0 … D-3.15-12**. The ones the orchestrator most needs to ratify:

- **Renumbered the phase 3.13 → 3.15** · the brief's number collides with ten existing `D-3.13-*` IDs and a filed report · rejected: using 3.13 verbatim (corrupts the log), and `3.13b` (asserts a lineage to the real 3.13, which is an unrelated phase) · **decision-log entry: YES — D-3.15-0.**
- **Reordered the homepage legends band to rank order** · the cards now *print* their rank, and the band was rendering „Ранг 6 · Ранг 4 · Ранг 7 · Ранг 2 · Ранг 10 …" under D-3.03-2's portraits-first display sort, which reads as a bug · rejected: keeping the old sort (makes the printed number meaningless), and hiding the rank on the homepage (defeats Task 5d's stated purpose) · **nothing is lost: all ten of the current band have portraits**, so the portrait tiebreak was already a no-op; membership is unchanged · **decision-log entry: YES — D-3.15-11, supersedes D-3.03-2.** ⚠️ **This changes a page the brief did not ask me to reorder — flagged for ratification.**
- **Did NOT backfill `legendAppearances` for ranks 3–50 from `careerStats.appearances`** · 43 of those 48 people already carry a count, decreasing monotonically with rank, so the numbers are almost certainly the book's — but the field is documented as *the book's printed value* and `careerStats` has a different recorded provenance (D-2.01-3) · rejected: copying it across (asserts an unverified provenance in the one field whose job is faithful transcription) · **decision-log entry: YES — D-3.15-12, raised as OV-39.** ⚠️ **This is the most consequential thing left open.**
- **Dropped `hasPortrait` from the homepage query and type** · nothing read it once the sort changed; shipping a dead field to the client is waste · **entry: folded into D-3.15-11.**
- **Reworded my own doc comment rather than log a grep waiver** · my comment describing the banner's removal contained the banner string, which would have failed 3.10's DoD line · rejected: logging a D-3.13-8-style waiver for a hit I created and controlled · **entry: noted in D-3.15-7.**
- **Left `legendRank`'s validation untouched** · I briefly added `.max(80)` to match the brief's „(integer 1–80)", then reverted it — the field was already declared, the brief's phrase describes the data rather than demanding a constraint, and a new validation rule could block Ace from entering a rank the book does not have · **entry: not logged; a reverted no-op, recorded here only.**
- **Put the About copy in `src/lib/facts.ts` rather than in the page** · it carries four factual claims (328, 14 seasons, 1953–2020, 104 years) and `facts.md` governs those; it also makes the byte-identical check mechanical · **entry: not logged; follows the existing `CONTACT_EMAIL` pattern.**

Full text for all thirteen is in `decisions.md`. The remaining entries — the permission-not-ownership wording (D-3.15-1), retiring the fan-page framing (D-3.15-2, supersedes D-3.12-6), stripping the Instagram query string (D-3.15-3), the string-not-number field (D-3.15-4), rank-without-count rendering (D-3.15-5), self-omitting years (D-3.15-6), retiring `ProvisionalBanner`/D-2.05-1 (D-3.15-7), the book-mention supersession (D-3.15-8), keeping the unreachable fallbacks (D-3.15-9), and the 44px target (D-3.15-10) — are all things the brief specified; they are logged because they carry reasoning a future reader would otherwise re-litigate.

## 4. Deviations from the brief / spec

1. **Phase number: 3.13 → 3.15.** The brief's central premise („`main` carries phases up to and including 3.12") is wrong; `main` carries 3.13 (PR #43) and 3.14 (PR #44). D-3.15-0.
2. **Five further stale premises, corrected in place rather than followed:**
   - *Task 5e — „Петар Андреев is not a president… set his roles"*: **already done** at D-3.14-4, live in production since 2026-08-07. Verified, not re-applied.
   - *Task 5a — „`legendRank` … has never been declared in `person.ts`"*: it **was** declared. Only the **deploy** was outstanding, which is what OV-27 actually was. Only `legendAppearances` is new.
   - *Task 5c — „Тренери and Раководство stay alphabetical"*: the band is **„Претседатели"** since D-3.14-1, and both staff bands are **chronological** since D-3.13-4. I left their order untouched, which is what the instruction protects.
   - *Task 6 — „Љупчо Мафков at minimum" is missing `playingYears`*: **no** player is missing it. The self-omit change was made anyway as a regression guard; the report's owed list of yearless people is **empty**.
   - *Task 5b — „fifteen of the eighty" are ranged*: the extract has **nine**.
3. **The brief's pre-flight check #2 could not be run as written.** `git log --oneline origin/main..HEAD` was run from a stale, already-squash-merged branch (`phase-3.11b-season-content-committed`) and printed one commit. That was **not** unpushed work — the branch's PR #42 was merged. Verified `main == origin/main`, working tree clean, then branched. No D-3.12-8 situation existed.
4. **Focus ring proved by cascade analysis, not by a Tab keypress** — see §2, last item. The tool could not deliver a real Tab; the CSS-cascade proof addresses the actual failure mode (the Tailwind v4 layering trap).
5. **`legendAppearances` populated for 32 of 80, not „all ranked players"** — the brief's named source only carries 30, plus the owner's 2. Deviation is in the source, not the execution. OV-39.
6. **Not done, and correctly so:** no `humanizer` pass on the About copy (the brief forbids it); `ProvisionalBanner` **has no component file to delete** (it was a local function inside `za-nas/page.tsx`); the unreachable placeholder fallbacks are kept (D-3.15-9).

## 5. Changed files / deliverables

**Branch:** `phase-3.15-about-socials-legends`, cut from `main` @ `cc4214c`. **Commit** `c19d261`. **PR:** [#45](https://github.com/DinovLazar/belasica-v2/pull/45) → `main`, **squash-merged** on the owner's instruction, after the preview check recorded below. **Nothing was committed to `main`.**

**Self-review of the diff** (CLAUDE.md requires it, since this repo has no automated review gate — D-1.01-4/D-1.06-1): 10 source files, **+507 / −184**. Checked and clean — **no hardcoded colour literal** added (`grep` for `#hex`/`rgb(`/`oklch(` on added lines → empty), **no inline focus ring** (every focusable element uses `src/lib/focus.ts`), **no new arbitrary-value Tailwind class**, and all ten out-of-scope files absent. ✅ **The Vercel preview WAS checked before merging** — the first time since 3.11. Vercel build SUCCESS; **9/9 routes returned 200** (`/`, `/za-nas`, `/kontakt`, `/legendi`, `/arhiva/1985-86`, `/legendi/tome-stojanov`, `/legendi/petar-andreev`, `/pravni-informacii`, `/statistika`); and the changes were verified **on the deployed preview**, not just locally: **0 `[PLACEHOLDER]`** on all four checked routes, the permission line present on all four, both social links present, „За нас" paragraph 1 **byte-identical** with the `/legendi/tome-stojanov` link live and no banner, both bands opening `1. Петар Андреев 555` → `2. Милан Василев 383` → `3. Ристо Панов`, bands **86 · 46 · 28 = 160**, Андреев chips Играч + Тренер.

**New (2):**
- `src/components/SocialLinks.tsx` — the two profiles as icon links, both surfaces, one source.
- `src/components/icons/SocialIcons.tsx` — `FacebookIcon` + `InstagramIcon`, hand-authored inline SVG, no dependency.

**Edited (8):**
- `src/lib/facts.ts` — `CONTENT_PERMISSION_NOTICE`, `FACEBOOK_URL`, `INSTAGRAM_URL`, `SOCIAL_LINKS`, the two About paragraphs and `ABOUT_FATHER_NAME`; removed `FACEBOOK_FAN_PAGE` / `FACEBOOK_FAN_PAGE_LABEL`.
- `src/components/SiteFooter.tsx` — permission line in the bottom bar; „Следете нѐ" now renders `SocialLinks`.
- `src/app/(site)/za-nas/page.tsx` — rewritten: banner + 4 chips out, real copy in, father's link query added.
- `src/app/(site)/kontakt/page.tsx` — PL-15 chip → `SocialLinks`. Form untouched.
- `src/components/legends/LegendCard.tsx` — rank + count title line; years self-omit.
- `src/app/(site)/legendi/page.tsx` — fetch `legendAppearances`; pass both new fields across the client boundary.
- `src/app/(site)/page.tsx` — fetch both fields; band ordered by rank; `hasPortrait` dropped.
- `src/sanity/schemaTypes/person.ts` — `legendAppearances` declared.

**Records:** `facts.md`, `src/_project-state/decisions.md`, `current-state.md`, `file-map.md`, and this report.

**Sanity (production, live now):**
- **Schema deployed** to workspace `belasica-v2` — `legendRank` and `legendAppearances` now editable in Studio.
- **32 person documents patched** with `legendAppearances` (`setIfMissing`, so nothing could be overwritten): ranks **1–2** from the owner, ranks **51–80** from the book. **0** documents lost a field, **0** drafts created (verified before and after), **0** slug mismatches, **0** `legendRank` disagreements between book and CMS, **0** conflicts between the book's figure and `careerStats`.
- The population script is a **scratchpad file and is deliberately not committed** (precedent D-2.09R-5). **No token appears anywhere in the repo or this report**; it was read from the untracked `.env.local` at runtime.

## 6. State updates done

- ✅ `current-state.md` — NEXT line rewritten (and set back to **3.08 — Domain cutover**); a 3.15 summary bullet added; **PL-1, PL-2, PL-15 marked CLEARED**; **PL-4 explicitly re-scoped as metadata-only** with a warning not to read „zero chips" as „3.08 is done"; a prominent register banner stating that **no visible chip remains**, with the command output that proves it; **OV-27 closed**; **OV-38 and OV-39 added**; the stale „two chips in the Legends band" note on `/` corrected; the 3.10 `/za-nas` banner carryover closed.
- ✅ `file-map.md` — both new files added; `SiteFooter`, `LegendCard`, `za-nas/page.tsx`, `facts.ts`, `person.ts` entries corrected.
- ✅ `decisions.md` — D-3.15-0 … D-3.15-12 appended; **Status-only** edits to D-3.03-2 (→ superseded by D-3.15-11), D-3.12-6 (→ superseded by D-3.15-2) and D-2.05-1 (→ fully retired at D-3.15-7). No history rewritten.
- ✅ `facts.md` — Аце Стојанов and Томе Стојанов VERIFIED (closing PL-1/PL-2's underlying entries); both social URLs VERIFIED with authorship; the permission line VERIFIED; the „never mention the book" rule **marked SUPERSEDED and dated, not deleted**.
- ✅ `00_stack-and-config.md` — **deliberately untouched.** Zero dependencies added or upgraded (`git diff --name-only` on it returns empty).

## 7. Risks, follow-ups, what the next phase needs to know

- ⚠️ **OV-39 is the one to act on.** 48 of the 80 ranked legends show a rank and no count, so the list reads „…555", „…383", then a 48-player gap, then counts again from #51. The archive very likely already holds the missing figures. One question to Ace turns this into a one-line script change.
- ⚠️ **OV-38** — nobody who speaks Macedonian has read the new copy on a screen. The About text is the author's own and must not be edited; this is proofreading and rendering, not rewriting.
- ⚠️ **The brief on disk still says „Phase 3.13".** Anyone reading `briefs/Part-3-Phase-13-Code.md` needs to know it shipped as 3.15. Worth renaming the brief.
- ⚠️ **This PR should actually be reviewed.** The last **three** phases (D-3.12-9, D-3.13-10, D-3.14-8) all bypassed the Vercel-preview gate at the owner's instruction, so **no human has eyeballed a rendered page of this site across four phases of copy and content change**. This phase adds the site's most personal copy and its only two outbound links. The gate exists for exactly this.
- **Note for whoever runs 3.08:** `/za-nas` now reads Sanity, so it is no longer a purely static page — irrelevant to the domain cutover, but worth knowing.
- **A machine difference caught in passing:** 3.14 recorded that this project's machine has no `SANITY_API_WRITE_TOKEN`. **This machine has one**, which is why the 32 writes went through a local script rather than the MCP.

### Five things for Lazar to eyeball on the Vercel preview (desktop + phone)

1. The footer's permission line reads correctly in Macedonian and does not overflow at phone width.
2. Both social icons look right and go to the right pages (Facebook, Instagram).
3. „За нас" reads exactly as Ace wrote it — especially the book title's „…" quotes and the „1953–2020" dash.
4. The top of the legends list reads **`1. Петар Андреев 555`**, and the homepage band runs 1→10 in the same order.
5. Петар Андреев no longer shows a „Претседател" chip — and tab to a social link to confirm the orange focus ring is visible.

## 8. What's now possible that wasn't before

A visitor can find out who made this archive and why, in the author's own words; the site states what may be reused and links the two places it lives; and with no placeholder chip left anywhere, the only thing standing between this archive and its real domain is the cutover itself.
