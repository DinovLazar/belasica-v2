# Part 3 · Phase 23 — Site-wide audit

**Run:** 2026-08-14 · branch `phase-3.23-audit-and-finishing` · against a clean
`rm -rf .next && npm run build` of `main` (330 pages, 323 HTML artefacts).

**Method.** Every measurement below comes from the **built output** of a cold
build, not from the dev server and not from reading source alone. Where a number
could not be obtained, this document says so rather than estimating.

> ⚠️ **Two premises in the phase brief were already stale when the phase opened.**
> The brief says „~160 person pages" and „330 pages"; the live build renders
> **211** person pages, and 330 is the Next.js *route* count (which includes
> `sitemap.xml`, `robots.txt`, the icons and `/studio`) against **323** HTML
> files and **322** indexable pages. Every count in this document is measured.

---

## 1 · Summary

| Dimension | Result |
|---|---|
| Correctness | **42 findings** — 0 P1, 14 P2, 28 P3 |
| Link integrity | **0** broken internal links of 322 distinct hrefs |
| Images — missing `alt` | **0** of 1 928 `<img>` |
| Image weight (`/razno/mladinska-skola`) | **4.78 MB** across 29 photographs, none optimised |
| Accessibility | 1 `<h1>` / 1 `<main>` / 1 `<footer>` and no skipped heading level on all 12 route types; every `<nav>` named |
| Dead code | 5 scaffolding SVGs + 2 unused runtime deps — **all removed** |
| Console | Only the local-only Vercel Analytics 404; **0** other errors or warnings |

**Bottom line:** no P1. The archive is correct in the ways that matter most —
nothing renders an invented number, no link is broken, no image lacks an `alt`
decision. The P2s cluster in one place: **the consequences of 3.22's
cross-listing rewrite, which nobody re-read afterwards.**

---

## 2 · Dimension 1 — Correctness

Read across all eight template types plus the three static pages, by eight
parallel readers, each finding then put to two independent adversarial verifiers
(one asking „does it reproduce in the built HTML?", one asking „is this
deliberate, per the code comments and `decisions.md`?"). 32 of 42 findings
received verdicts before the run was interrupted; **all 42 were then adjudicated
by hand against the source and the built HTML**, which is what the classification
below reflects.

### P1 — none

No finding in any template was broken or wrong for a user today.

### P2 — 14 findings

**Fixed in this phase (8):**

| # | Finding | File | Fix |
|---|---|---|---|
| 1 | Archive-index fallback lead photo could be the season's **league-table screenshot** — live on 5 of 96 cards (`1931-32`, `1932-33`, `1935-36`, `1936-37`, `1952`); on `1932-33` the table scan is the only photo so it always won | `arhiva/page.tsx` | Fallback now excludes `tablePhoto`, mirroring D-3.04-2 on the detail page (**D-3.23-10**) |
| 2 | Search result count **summed band memberships**, so each of the 49 cross-listed people counted 2–3× — „2 резултати" over one card | `LegendsBrowser.tsx` | Count distinct slugs (**D-3.23-11**) |
| 3 | `PERSON_QUERY` never selected `legendAppearances`, so **19 men showed a count on `/legendi` and nothing in Кариера on their own page** — the D-3.19-3 shape, mirrored | `legendi/[slug]/page.tsx` | Select it and apply `LegendCard`'s exact precedence; **nothing copied between the two fields** (**D-3.23-12**) |
| 4 | `coalesce(date,"9999")` put **undated photos first, not last** — `photo.date` is free text, and `"9999"` sorts before `April 2, 2026` / `околу 2002`; an undated photo won the portrait on 4 people | `legendi/[slug]/page.tsx`, `legendi/page.tsx` | Explicit definedness rank, the D-2.08-3 key (**D-3.23-12**) |
| 5 | Scorer coverage line read as a **completeness claim** the data does not support, and the same page's curated record contradicts it | `statistika/page.tsx` | Added „внесени", matching the sibling empty notice (**D-3.23-13**) |
| 6 | `toSections()` cut between a colon lead-in and its list, so „Преглед" **ended on a dangling colon** — all three split topics | `razno/[slug]/page.tsx` | Cut moves one block earlier when the lead-in ends in „:"; source order still never reordered (**D-3.23-14**) |
| 7 | `/pravni-informacii` stated „Последно ажурирање: **16 август 2026**" — a **future date**, written 16 days ahead of the commit that introduced it, on the page whose own §9 makes that label load-bearing | `pravni-informacii/page.tsx` | Set to 14 август 2026, the date this phase actually changed the copy (**D-3.23-15**) |
| 8 | Header nav wrapped to two rows 769–898 px → header 101 px vs the 78 px token (OV-40) | `SiteHeader.tsx` | Burger breakpoint `md` → `lg` (**D-3.23-1**) |

**NOT fixed — reported instead (6).** Each is a deliberate departure from the
brief's „fix every P2", and the reason is stated:

| # | Finding | Why not fixed here |
|---|---|---|
| 9 | Gallery dedupes on photo `_id`, so **two `photo` docs sharing one image asset both render** — live on `1969-70` and `1982-83` | **Content, and already decided.** D-3.04-10 explicitly rejected asset-level dedupe because it would delete the only captioned copy. The fix is unpublishing 3 duplicate documents in Studio — a Sanity write, which this phase must not make. |
| 10 | „Статистика на играчи" heads a section holding **only a coach and no players** on `/arhiva/1922-26` (1 of 96) | **Owner labelling call**, exact sibling of OV-36. Changing a shared section heading changes all 96 pages. |
| 11 | `legendRank` prints as a **leading list index inside the three bands that are not ordered by rank** — 39 of 69 Тренери cards, 1 of 29 Претседатели, 5 of 10 Репрезентативци | **Visible design change to a page the owner redesigned last phase** (3.22, by his instruction). The number is real; what is wrong is that it reads as a position. Needs his call on whether to hide it outside Играчи or qualify it („Ранг 62"). |
| 12 | The filled navy role chip names the person's **highest-priority role, not the category being read** — every player-coach | Same reason as #11; its doc comment still cites **D-2.05-2, which D-3.22-2 withdrew**. |
| 13 | „Рекорди" heads **four dated anecdotes and a closing wish** on `/razno/partizan` — the heading is chosen by block *kind*, not content | **Naming judgement for Ace**, sibling of OV-42. |
| 14 | The Сезони section reads only the **legacy** `squad[]`/`trainers[]` reference arrays, so it lists 1 of Гоце Петровски's 3 seasons and **nothing at all for the other 208 people** | **Substantial new behaviour, not a bugfix.** Matching on the live `season.trainer` string needs exact-name discipline (`Благој Истатов` is a substring of seven other strings and of the stadium's name). Sized as its own phase. |

### P3 — 28 findings

Recorded in full, fixed in none (per the brief). The consequential ones:

- **Dead GROQ selections.** `HOME_QUERY` fetches `clubRecord.category`/`order`
  and `heroSeason.title`, none of which is rendered; `SEASON_QUERY` selects
  `"slug"` that nothing reads. Harmless over-fetch — the inverse of D-3.19-3.
- **Stale measured counts in comments.** `arhiva/page.tsx` says 13 seasons lack
  a `teamPhoto` (live: **12**); the season page says 83 (live: **84**);
  `SeasonRecordList` says a divider draws on 51 of 96 seasons (live: **81**, and
  „1952 is the one season" is now three — `1939-40`, `1942`, `1952`);
  `legendi/page.tsx` describes `legendRank` as a 1–80 list of eighty players
  (live: **138 ranked people, ranks 1–135**).
- **`/legendi#treneri` and friends are dead anchors.** The ids still render, but
  three of the four now sit inside `display:none` tab panels, so a pre-3.22
  public link lands at the top of the page with Играчи open.
- **`focalPosition`'s hotspot branch is dead across the whole dataset** — all
  476 cover crops use the `50% 20%` default. Not a code bug: a Studio curation
  lever nobody has pulled.
- **Empty `<Reveal>` wrapper** with `mt-8` on the 6 seasons holding a record row
  but no table scan.
- **`generateMetadata` invents the title „Сезона"** for a title-less season,
  which the page body's own comment forbids twelve lines later.
- **`SeasonStory` claims every producible block style is mapped**; `h1`/`h4`–`h6`
  are not, and would silently flatten to unstyled paragraphs.
- **`SeasonCard` alt uses `??`**, so an empty-string caption yields `alt=""`
  where the detail page's `||` yields the descriptive fallback.
- **`lastCellSpan` leaks `sm:col-span-2` into the lg grid** when exactly two of
  the six whitelisted records are missing — one editor rename away.
- **Homepage picks its ten legends with a different tiebreak than it displays
  them with** — unreachable today (ranks 1–10 are all populated).

---

## 3 · Dimension 2 — Link integrity

- **322** distinct internal page hrefs across the built HTML; **0** resolve to a
  route that does not exist.
- **4** distinct external anchors (Facebook ×2 surfaces, Instagram ×2). **0**
  lack `target="_blank"`; **0** lack `rel="noopener noreferrer"`.
- Both social URLs from `facts.md`:
  - **Instagram** `https://www.instagram.com/belasica1956.2006` → **200**.
  - **Facebook** `https://www.facebook.com/share/1FK4bKq9wx/` → the share link
    **302-redirects to a real profile** (`profile.php?id=100090333518007`), so
    the link is live. ⚠️ **A scripted `GET` returns 400** — Facebook's
    anti-automation page (`<title>Error</title>`, `noindex,nofollow`), not a dead
    link. **A definitive 200 could not be obtained from a script**; this is the
    honest limit of the check.

---

## 4 · Dimension 3 — Images

| Measure | Baseline (`main`) | After this phase |
|---|---|---|
| Total `<img>` | 1 928 | 1 929 |
| **Missing `alt` attribute** | **0** | **0** |
| Deliberate `alt=""` | 367 | 368 |
| Non-empty `alt` | 1 561 | 1 561 |

The `+1` in both totals is the crest, which now renders on the styled 404 (the
baseline's `_not-found` was Next's unstyled default and carried no chrome). The
`alt=""` count is otherwise **unchanged**, as required — those are the deliberate
decorative/undescribed cases of D-3.19-4 and D-3.20-6, not defects.

---

## 5 · Dimension 4 — Image weight

`/razno/mladinska-skola`, the heaviest „Разно" topic:

- **29** photographs, **5 018 312 bytes = 4.78 MB** transferred.
- **0** go through `/_next/image` — they are plain `<img>` on static WebP files,
  so none reaches the Vercel optimiser (D-3.20-7).
- HTML document itself: 149 760 bytes.
- Largest single file: `mladinska-skola-01.webp` at **497 584 bytes**.

**Not changed in this phase, as instructed** — measured and reported so the
orchestrator can decide. Context worth having: the account has previously hit
`/_next/image` **402 PAYMENT_REQUIRED** on uncached variants, so moving 64
photographs onto the optimiser is a quota decision, not only a performance one.

---

## 6 · Dimension 5 — Accessibility

Measured on the built output and in a real browser against the production build.

| Route type | `<h1>` | `<main>` | `<footer>` | Skipped level | Unlabelled `<nav>` |
|---|---|---|---|---|---|
| all 12 (incl. 404) | **1** | **1** | **1** | **none** | **0** |

- **Contrast**, measured through a canvas so Tailwind v4's `oklab()` values
  resolve correctly (a naive parser reads them as garbage): 404 H1 **14.95:1**,
  intro paragraph **9.9:1**, breadcrumb link **14.95:1**, current crumb
  **9.9:1**, onward links **14.95:1**. Every one matches `brand.md`'s published
  figure. Nothing added this phase introduces a new value.
- **Focus** rules are present and **unlayered**, so they beat the utilities
  layer: `.u-focus:focus-visible { outline: 3px solid var(--color-navy); outline-offset: 2px }`
  and `.u-focus--on-navy:focus-visible { outline-color: var(--color-orange) }`.
- **Tap targets:** the only element under 24×24 on the 404 is the `sr-only` skip
  link, which is the standard pattern and expands on focus. Burger toggle
  measures **48×48** at every width where it shows.
- **Horizontal overflow:** 0 px at 375.
- ⚠️ **Not done:** no VoiceOver / computed-role pass. OV-21's limitation stands —
  the in-app browser exposes neither `computedRole` nor
  `getComputedAccessibleNode()`.

---

## 7 · Dimension 6 — Dead code and dead files

- `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` —
  Next.js scaffolding from Phase 1.01. **0 references** anywhere in `src/`,
  `public/`, `docs/` or `scripts/`. **Deleted.**
- `radix-ui@1.6.2` and `class-variance-authority@0.7.1` — **0 imports** in
  `src/`. Checked for transitive need by walking the `dependencies` and
  `peerDependencies` of **every installed package**, including `sanity` and
  `next-sanity` for the embedded Studio: **no installed package requires
  either**. **Removed**; recorded in `00_stack-and-config.md`.
  *(`components.json` remains — it is shadcn's generator config, not a runtime
  dependency.)*

---

## 8 · Dimension 7 — Console

Loaded on the **production** build (`npm start`), one clean tab, across
`/arhiva`, a season page, `/legendi`, a person page, `/statistika`, a „Разно"
topic and `/pravni-informacii`:

- **The only output is** `/_vercel/insights/script.js` **404**, once per page.
  That script is served by Vercel's edge and does not exist under `next start`;
  it is an artefact of measuring locally, not a defect.
- **0** hydration warnings. The known `.js`-class mismatch (D-1.05-5) is
  **dev-only** and did not appear in production.
- **0** other errors or warnings.

---

## 9 · What this audit did NOT check

Stated plainly, because a gap named is worth more than a checkmark with nothing
behind it:

1. **Runtime behaviour of the error boundary.** `src/app/(site)/error.tsx`
   compiles, is a client component, exposes `reset`, and renders no digest or
   stack — verified by reading it and by the build. **It was never made to
   fire.** Triggering it needs a Sanity read to fail during an ISR
   revalidation, which cannot be staged without either a fault injection this
   phase did not build or pointing the client at a dead host.
2. **The Facebook link's status code** — see §3.
3. **Computed accessibility roles** — see §6.
4. **The „Разно" lightbox** — still never opened (OV-52 carries forward
   unchanged; `role="dialog"` appears 0 times in the prerendered HTML because
   the overlay mounts only on open).
5. **Lighthouse.** Not re-run. The header breakpoint change alters no bytes on
   the critical path, but that is reasoning, not measurement.
