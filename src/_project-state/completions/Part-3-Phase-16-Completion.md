# Part 3 · Phase 16 · Code — Completion Report

**Date:** 2026-08-09 · **Outcome (one line):** Seven parts of the club's story that belong to no season and no person — the UEFA Cup, the youth school, Viareggio, Partizan, the Tiverija derby, the stadium and the „Ајдуци" — now have real pages, transcribed word for word from Аце Стојанов's book and attributed to it, with „Разно" in the main menu.

> ⚠️ **Two things need the orchestrator's eye before merge**, both in §4: a one-phrase correction to a card summary the brief supplies as verbatim (**D-3.16-9**), and a **measured header-nav regression** at tablet widths that a seventh nav item causes (**D-3.16-11 → OV-40**).

## 1. What shipped (plain language)

`/razno` is a new section of the archive: an index of seven cards, and behind each one a page carrying the book's own chapter. Nothing on those pages is written by this archive. Every paragraph is Аце Стојанов's, transcribed character for character — his typos included — and every page ends by naming him and the book, so the claims on them are **attributed rather than asserted**.

The seven are the two UEFA Cup ties of 2002 and 2003; the youth school that produced Pandev, Stojkov, Masev and Baldovaliev; eight editions of the Viareggio „Копа карневале"; four Partizan visits to Strumica, two of them farewell matches for Истатов and for Андреев; twenty-nine Strumica derbies against Tiverija from 1929 to 2017, with their scorelines; the stadium, from the pitch opened in 1931 to the arena that now carries Благој Истатов's name; and the „Ајдуци", from „Блу Драгон" in 1988 to the north stand today. They run in the owner's order — neither alphabetical nor chronological.

**„Разно" is in the main navigation**, between „Статистика" and „За нас", and in the footer and the sitemap. The pages ship **text-only by decision**: no empty photo frame, no greybox and no placeholder chip stands where the Drive photographs will later go.

The thing worth knowing about how this was built: `src/content/razno.ts` is **generated from** the committed source file rather than typed, and a separate script re-derives every one of its 101 blocks from that file and diffs them. **101/101 byte-identical.** A transcription you can prove is a different object from one you can only vouch for.

## 2. Definition of Done

### Branch & source

- ✅ **Branch `phase-3.16-razno` cut from a freshly pulled `main`; `git log origin/main..main` empty first** — evidence: `git pull --ff-only` → „Already up to date."; `git log origin/main..main --oneline` → **no output**, checked *before* the branch was cut (the D-3.12-8 rule).
- ✅ **`data/book/razno-source.md` committed** — 297 lines, 52.621 bytes, **109 `<!-- L#### -->` paragraphs**. ⚠️ Written from the brief's **inline** copy: no such file existed on disk (D-3.16-13).

### Content module

- ✅ **Exactly 7 topics, in the owner's order, with the Task 3 slugs** — evidence: `kup-na-uefa → mladinska-skola → viaredzo-kup → partizan → tiverija → stadion-blagoj-istatov → ajduci`. Three differ from the source file's own `Slug:` annotations; the brief's table wins (D-3.16-1).
- ✅ **Every block byte-identical to its `L####` paragraph — proved programmatically, not read** — evidence: an independent verifier re-parses `data/book/razno-source.md`, re-parses the **committed** `src/content/razno.ts` as text, and compares. **22 checks, 101 blocks, 109 source paragraphs, PASS.** Arithmetic: 109 source paragraphs − 7 chapter headings − 1 joined tail (L6935) = **101**, and 101 is what the module holds. Total transcribed: **26.904 characters**.
- ✅ **The L6934+L6935 join is the only sentence-level exception** — evidence: the verifier asserts *this specific* join (`source(6934) + " " + source(6935)`, one space, `line: 6934`) and fails on any other. Reads correctly on the page: „…Беласица доживува уште една катастрофа и губи со 0:5."
- ⚠️ **One further exception, logged: the markdown bullet marker** — five lines (L7105, L7156–L7159) reach the extract with a leading `* `, the renderer's glyph for a `.docx` list item. Stripped; the ordered-list numerals on L6945/L6946 („1. З. Балдовалиев, 3;") are **kept**, because those are the book's own ranking (D-3.16-5). The verifier accepts `"* " + text === source` for **exactly those five** and prints them, so the exception cannot widen unnoticed.
- ✅ **The seven chapter-heading lines appear nowhere in the rendered HTML** — evidence: each of L6931, L6948, L6988, L7086, L7153, L7163, L7167 searched, as whitespace-collapsed visible text, across all 8 built pages → **0 hits each**. Also checked in the other direction: no heading's *text* appears under any other line number.
- ✅ **`record` / `para` / `closing` classification matches the Task 3 table exactly** — evidence: the verifier rebuilds the expected kind per line from the table independently of the generator. Result: `kup-na-uefa` 5 para / 6 record · `mladinska-skola` 19 para · `viaredzo-kup` 10 para · `partizan` 3 para / 4 record · `tiverija` 4 para / 46 record · `stadion-blagoj-istatov` 1 para · `ajduci` 2 para / 1 closing. **0 misclassified.**

### Routes

- ✅ **`/razno` renders 7 cards; „7 теми" derived from the array length** — evidence: built HTML contains „7 теми" and links all seven slugs **in array order**; `RAZNO_TOPICS.length` is the only source of the 7.
- ⚠️ **All 7 detail routes statically prerendered — reported as `● (SSG)`, not `○ (Static)`** — the DoD asks for `○ (Static)`, which Next.js never emits for a dynamic segment; `● (SSG) prerendered as static HTML (uses generateStaticParams)` is the equivalent marker, and it is what `/arhiva/[slug]` and `/legendi/[slug]` also show. Revalidate column **empty** on both new routes.
- ✅ **Body text present in the server HTML with JavaScript disabled** — evidence: all **101** blocks located in `.next/server/app/razno/*.html`, the pre-hydration payload, per page: 11 / 19 / 10 / 7 / 50 / 1 / 3.
- ✅ **`/razno/nema-takva-tema` returns the 404 page** — evidence: HTTP **404**, rendering the site's 404 page (Next's default — this repo has no custom `not-found.tsx`; pre-existing).
- ✅ **The source line is in the built HTML of all 7 detail pages — grep count exactly 7** — evidence: `grep -rl "Извор: Аце Стојанов" .next/server/app --include="*.html"` → the seven `razno/*.html` files and **nothing else**; count **7**. Per page it renders **exactly once**.
- ✅ **Prev/next resolves for all 7; topic 1 has no prev, topic 7 no next, neither renders an empty card** — evidence, from the built HTML: `kup-na-uefa` no/yes · `mladinska-skola` yes/yes · `viaredzo-kup` yes/yes · `partizan` yes/yes · `tiverija` yes/yes · `stadion-blagoj-istatov` yes/yes · `ajduci` yes/no. `RaznoNeighbourNav` returns `null` when both are absent and omits the missing side entirely.

### Navigation, sitemap, metadata

- ✅ **„Разно" in the header and the footer, links to `/razno`, active on `/razno` and on `/razno/<slug>`** — evidence, all 8 pages: the header link carries `aria-current="page"` **and** `border-orange`; the footer nav link is present. ⚠️ **The footer's list marks no item active on any route** — `SiteFooter` does not import `isActivePath` and never has; „Разно" behaves exactly as „Легенди" does. Pre-existing, not introduced here.
- ⚠️ **At 375 px the nav does not wrap and nothing exceeds the viewport — but a wider band regressed.** At 375 the desktop nav is `display:none`; the burger panel lists all seven, „Разно" carrying the orange 3px left bar and `aria-current="page"`, minimum tap height **48 px**, `scrollWidth === innerWidth`. Measured at **375 / 768 / 790 / 820 / 860 / 899 / 900 / 1280 / 1408: zero horizontal overflow everywhere.** The regression is the header's own height — see §4 and **D-3.16-11**.
- ✅ **`/razno` and all 7 detail routes in `/sitemap.xml`** — evidence: all eight `<loc>` entries present in the built `sitemap.xml.body`. The file's Sanity read, `revalidate` and origin are untouched.
- ✅ **All 8 new routes have a non-empty, non-duplicate `<title>` and `<meta name="description">`** — evidence: 8/8 non-empty on both, **8/8 distinct** on both. `/razno` → „Разно · ФК Беласица"; the seven detail titles are the topic H1s.

### Quality floor

- ✅ **Zero `[PLACEHOLDER]` chips on the 8 new routes, and site-wide still 0** — evidence: 0 across the 15 new `.html`/`.rsc` artefacts, and **0 across all 544 built `.html`/`.rsc` artefacts** of the 279-page build.
- ✅ **Contrast measured against each element's real backdrop** — computed by resolving each element's own computed colour and its nearest opaque ancestor background through a canvas readback, then WCAG luminance. Method validated against the repo's known figures (paper/80 on navy came out at **9.95:1**, matching 3.10 exactly).

  | Element | Ink | Backdrop | Ratio |
  |---|---|---|---|
  | Index card title (`u-h3` navy) | `#0D1F3C` | white card | **16.43:1** |
  | Index card summary (neutral-700) | `#3A3A38` | white card | **11.40:1** |
  | Index header intro (paper/80) | `#F8F4EC` @ .8 | navy | **9.95:1** |
  | Index meta „7 теми" | `#F8F4EC` @ .8 | navy | **9.95:1** |
  | Detail prose paragraph (neutral-700) | `#3A3A38` | paper | **10.37:1** |
  | Detail record row (neutral-700) | `#3A3A38` | paper | **10.37:1** |
  | **Source credit (neutral-500)** | `#5E5C55` | paper | **6.09:1** |
  | Closing line „НАПРЕД БЕЛАСИЦА!" (navy) | `#0D1F3C` | white `u-cap` block | **16.43:1** |
  | Prev/next label (neutral-500) | `#5E5C55` | white card | **6.69:1** |
  | Prev/next title (navy) | `#0D1F3C` | white card | **16.43:1** |
  | Back link „Сите теми" (navy) | `#0D1F3C` | paper | **14.95:1** |

  **Lowest is 6.09:1 — every new element clears AA (4.5:1) by a wide margin.**
- ✅ **Focus ring confirmed under a real Tab** — on paper (the card links, the prev/next links, the back link): **3px solid navy `#0D1F3C`, 2px offset**, with `:focus-visible` matching. On navy (the „Разно" breadcrumb link on a detail page): **confirmed visually in a screenshot — orange 3px, 2px offset.** ⚠️ Chrome's `getComputedStyle` readback reported `rgba(14,32,60,0.5)` for the on-navy ring across four reads with forced layout — **the 50 %-alpha ring D-3.07-9 already established does not exist.** The screenshot is the evidence; the readback is a known trap, now reproduced a second time.
- ✅ **`npm run build` passes — 279/279 pages, up from 271** — exactly the +8 the brief predicted (index + 7). `npx tsc --noEmit` clean, `npm run lint` clean, Prettier applied.
- ✅ **`git diff` confirms the out-of-scope files untouched** — evidence: `git diff --stat main -- package.json package-lock.json brand.md src/sanity src/app/robots.ts src/app/layout.tsx` returns **empty**. **Zero new dependencies.** No Sanity schema file, no schema deploy, no document write, no query change. `metadataBase` untouched — **PL-4 stays open, and 3.08 is still next.**
- ✅ **`/impeccable audit` run on the affected pages** — the mechanical detector over all four new files returned **`[]`**. One P3 found by hand and **fixed in-phase**: the detail page's prose `<section aria-label={topic.title}>` was a `region` landmark duplicating the H1; the label is gone (D-3.16-8). Heading order: `/razno` = H1 + 7×H2, detail = a single H1, no skips. No image on any new page (so no alt-text surface), no interactive element under 24×24, the global `prefers-reduced-motion` rule applies.
- ✅ **`humanizer` run on the new connective copy only** — the index intro, the seven card summaries, the source line and the eight meta descriptions. **Never on a transcribed paragraph** (D-3.16-3). What it changed: six of eight meta descriptions were built on the same `X — Y` em-dash template, which reads as a machine filling a form; they now vary (a two-sentence one, three colons, three comma clauses) and carry **no em dash**. The seven card summaries were already varied in shape and are unchanged bar the Виареџо correction below.

### Every figure in the card summaries, checked line by line against the source

| Card | Claim | Source | ✓ |
|---|---|---|---|
| Куп на УЕФА | 2002 | L6938 „2002 г. Лешоеш – Беласица" | ✅ |
| Куп на УЕФА | 2003 | L6940 „2003 г. Публикум - Беласица" | ✅ |
| Куп на УЕФА | четири натпревари | L6937 „вкупно одиграните четири натпревари" | ✅ |
| Куп на УЕФА | пет гола | L6944 „има постигнато 5 гола" | ✅ |
| Младинска школа | Пандев, Стојков, Масев, Балдовалиев | L6963 „Г. Пандев, А. Стојков, Д. Масев, З. Балдовалиев" | ✅ |
| Младинска школа | финалиња | L6981 „шесто финале на младинскиот куп" | ✅ |
| Младинска школа | двојни круни | L6968 „ја освои двојната круна"; L6972 „ја освојуваат двојната круна" | ✅ |
| Виареџо | осум изданија | L7009 „вкупно 8 изданија од турнирот во Виареџо" | ✅ |
| Виареџо | 24 натпревари | L7009 „одигрува 24 натпревари" | ✅ |
| Виареџо | „Копа карневале", Италија | L6989 „Турнирот во Виареџо, Италија, наречен „Копа карневале“" | ✅ |
| Виареџо | Европа, Америка, Азија | L6989 Килмес · L6994 Сантос Лагуна · L6997 малезискиот тим · L6999 Индепиенте од Санта Фе · L7007 Национал од Парагвај | ⚠️ **corrected — see §4** |
| Партизан | четири гостувања | L7155 „играно помеѓу себе четири пати во Струмица" | ✅ |
| Партизан | простување на Истатов | L7157 „на простувањето на Благој Истатов" | ✅ |
| Партизан | простување на Андреев | L7158 „на простувањето на … Петар Андреев" | ✅ |
| Тиверија | дваесет и девет дербија | L7087 „одигруваат 29 првенствени натпревари" | ✅ |
| Тиверија | 1929 до 2017 | L7087 „во периодот од 1929 до 2017 година" | ✅ |
| Стадион | терен отворен 1931 | L7164 „терен имало во 1931 година кога свечено е отворен" | ✅ |
| Стадион | арена со името на голманот | L7164 „преименуван во „БлагојИстатов“" + L6953 „голманот Благој Истатов" / L7154 „Истатов брани три сезони" | ✅ |
| Ајдуци | „Блу Драгон" | L7169 „Првото име … било „Блу Драгон“" | ✅ |
| Ајдуци | 1988 | L7169 „се организираат како навивачка група во 1988 година" | ✅ |
| Ајдуци | северната трибина | L7169 „поминато на северната трибина" | ✅ |

**26 claims located in the source, mechanically.** One needed correcting.

## 3. Decisions logged

**D-3.16-1 … D-3.16-14.** The ones that change what a reader sees or what a future phase may do:

- **D-3.16-1** — slugs come from the brief's Task 3 table, not the source file's own annotations, which are now stale for three topics.
- **D-3.16-2** — the copy is a typed TS module, not Sanity. **Ace cannot edit these seven pages in Studio.**
- **D-3.16-3** — verbatim transcription, typos included, no `humanizer`; the module is generated from the source and diffed against it.
- **D-3.16-4 / D-3.16-5** — the two extraction repairs: the split sentence, and the markdown bullet on five lines.
- **D-3.16-6 / D-3.16-7** — record rows and the prev/next spine are copies of the archive's patterns, not generalisations of components that render on 95+ pages.
- **D-3.16-8** — the prose section is an unnamed `<section>`, so it is not a duplicate landmark.
- **D-3.16-9** — ⚠️ the Виареџо summary's „против европските академии" was corrected. **Needs ratifying.**
- **D-3.16-10** — the cards keep `u-card`'s 4px hover lift; the brief's „2px" contradicts `brand.md` and the components it names.
- **D-3.16-11** — ⚠️ the seventh nav item widens a pre-existing header wrap. **Measured, not fixed. → OV-40.**
- **D-3.16-12** — „…“ quotes; one `RAZNO_SOURCE_CREDIT` constant.
- **D-3.16-13** — the source file was reconstructed from the brief's inline copy; the brief itself was not committed.
- **D-3.16-14** — the seven sitemap entries carry no `lastModified`, because they have no document and no revision time.

## 4. Deviations from the brief

**1 · One card summary the brief supplies as verbatim was corrected (D-3.16-9).**
The brief's Task 4 table gives the Виареџо summary as „…и 24 натпревари против **европските академии**." and asks that the summaries be used verbatim. The same task also says „Every figure in that table is checkable against `data/book/razno-source.md`. **Check each one before you ship it**." The figures check out. **The geography does not:** five of the 24 opponents were not European — Килмес (Argentina, L6989), Сантос Лагуна (Mexico, L6994), a Malaysian side (L6997), Индепиенте од Санта Фе (Colombia, L6999) and Национал од Парагвај (L7007). Shipping it would have put an unsupported factual claim on the page, which CLAUDE.md's content-truth rule forbids and this brief's own decision 5 forbids again („Nothing outside `data/book/razno-source.md` may become a factual claim on these pages"). It now reads „…и 24 натпревари против **младински екипи од Европа, Америка и Азија**." — every element checkable in the source. The parallel meta description was corrected the same way. **The other six summaries and the index intro are verbatim as supplied.** Ratify or overrule.

**2 · A measured header-nav regression, reported rather than fixed (D-3.16-11 → OV-40).**
The DoD asks that seven items not wrap at 375px. They do not — below `md` the desktop nav is hidden and the burger panel takes over. But a width sweep, with the „Разно" item toggled off in the same DOM to get a true pre-phase baseline, found this:

| Viewport | 6 items (before) | 7 items (after) | Header height |
|---|---|---|---|
| 375 | burger panel | burger panel, 7 items, 48px targets | 78 px |
| **768** | **2 rows** ← already broken | 2 rows | **101 px** |
| **790 / 820 / 860** | 1 row | **2 rows** ← newly broken | **101 px** |
| 899 / 900 / 1280 / 1408 | 1 row | 1 row | 78 px |

So the wrap threshold moves from ~780 px to ~899 px, newly breaking roughly **769–898 px** — which includes iPad portrait at 810 and 820. The consequence is not only cosmetic: in that band the sticky header is **101 px while `--spacing-header` still claims 78 px**, so every `scroll-mt-header` anchor lands ~23 px under it and the archive's decade rail sticks 23 px too high. **That was already true at 768 px before this phase**; the band is now ~130 px wider. Not fixed here because the brief states „`nav.ts` and `sitemap.ts` are the only shared files this phase edits", and `SiteHeader.tsx` is neither. Smallest likely fix: `gap-7` → `gap-5` in the `md` range. Better fix, and it clears the pre-existing 768 px break too: move the burger breakpoint from `md` to `lg`. **Both are visible design changes on every route — the owner's call.**

**3 · The brief and the source file arrived inline, not as files (D-3.16-13).** `data/book/razno-source.md` was written from the brief's inline copy because the brief requires it as a tracked output. `briefs/Part-3-Phase-16-Code.md` was **not** created — it is not in „Outputs & where they go", and `file-map.md` already records that most phases run from a brief pasted into the session. **If a canonical `razno-source.md` exists elsewhere, diff it against the committed one before trusting either.**

**4 · `● (SSG)`, not `○ (Static)`.** Next.js does not emit `○ (Static)` for a dynamic segment. `● (SSG)` with an empty Revalidate column is the equivalent, and the same marker `/arhiva/[slug]` and `/legendi/[slug]` carry.

**5 · The cards lift 4px, not the brief's 2px (D-3.16-10).** `brand.md` and the two components the brief names both specify 4px.

## 5. Owed to Lazar / Ace

- **OV-40 — ⚠️ the consequential one.** The header nav wraps to two rows between roughly **769 and 898 px** with seven items, taking the header to 101 px against a 78 px `--spacing-header`, which throws every `scroll-mt-header` anchor off by 23 px in that band. Pre-existing at 768 px; widened here. Needs a `SiteHeader` decision — see §4.
- **OV-41.** A native speaker should read the eight new pages on screen. The index intro, the seven card summaries and the source line are new Macedonian copy nobody has read aloud. *(The 101 transcribed paragraphs are the book's own words and need no such read — but they do carry the author's typos on purpose, and a reader should know that before flagging them.)*
- **OV-42.** Ace should confirm that the seven topic titles and the section name „Разно" read right to him.

## 6. Preview — checked before asking for a merge

**PR:** [#46](https://github.com/DinovLazar/belasica-v2/pull/46) · **Preview:** `https://belasica-v2-1y7rm81rp-sunset-services-team.vercel.app` · Vercel build **Ready**, 1m.

There is no GitHub Action on this repo (D-1.01-4, D-3.11-6), so CLAUDE.md's self-review is the gate. It ran. Three phases in a row bypassed it before 3.15 restored it; this one did not.

**HTTP status — 13 routes, all as expected:**

| Route | | Route | |
|---|---|---|---|
| `/razno` | **200** | `/razno/tiverija` | **200** |
| `/razno/kup-na-uefa` | **200** | `/razno/stadion-blagoj-istatov` | **200** |
| `/razno/mladinska-skola` | **200** | `/razno/ajduci` | **200** |
| `/razno/viaredzo-kup` | **200** | `/` | **200** |
| `/razno/partizan` | **200** | `/legendi` | **200** |
| `/sitemap.xml` | **200** | `/arhiva` | **200** |
| `/razno/nema-takva-tema` | **404** ✓ | | |

**Read on the preview, not only locally:**

- **All 101 transcribed blocks are present in the deployed HTML**, per page: 11 / 19 / 10 / 7 / 50 / 1 / 3. Re-derived from `data/book/razno-source.md` against the live response, not against the local build.
- **Source credit: exactly 1 per detail page**, 7 in total.
- **`[PLACEHOLDER`: 0** on all eight new routes.
- **„Разно" marked active** (`aria-current="page"` + `border-orange`) on all seven detail pages and on the index.
- **`/razno` renders 7 cards and the „7 теми" meta line.**
- **All 8 `<title>`s distinct and correct** on the live pages.
- **`/sitemap.xml` lists `/razno` and all seven topics** — canonical origin still `belasica-v2.vercel.app`, i.e. `metadataBase` untouched and **PL-4 still open**, as intended.

### Five things for Lazar to eyeball on the preview

1. **`/razno`** — do the seven card titles and one-line summaries read right, and is the order the one Ace wants (УЕФА → Младинска школа → Виареџо → Партизан → Тиверија → Стадион → Ајдуци)?
2. **`/razno/tiverija`** — the 46-row derby list. Every row is styled the same, so the season/competition lines („1929/30", „1955/56, Штипски потсојуз") sit in the list rather than above it. That is what the brief's classification table specifies; say if it should be sub-headed instead.
3. **`/razno/kup-na-uefa`** — the second paragraph ends „…Беласица доживува уште една катастрофа и губи со 0:5." That sentence was split across two paragraphs in the `.docx` and is rejoined here. Confirm it reads as one sentence.
4. **Any detail page, at the bottom** — „Извор: Аце Стојанов, „ФК Беласица – гордоста на Струмица“, 2025 година." Is that the attribution Ace wants on his own text?
5. **The header at tablet width** — open any page at roughly 800 px wide and look at the menu. It is **two rows**. See **OV-40**; it needs a decision, and the fix is outside this phase's edit list.
