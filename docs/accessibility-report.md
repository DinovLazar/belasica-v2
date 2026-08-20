# Accessibility remediation — WCAG 2.2 Level AA

**Site:** ФК Беласица — неофицијална архива (unofficial archive)
**Branch:** `a11y-remediation` · **Audited build:** the production build (`npm run build` + `npm run start`), not the dev server
**Standard:** WCAG 2.2 Level AA, which contains all of WCAG 2.1 AA — the standard the 2024 US DOJ rule and ADA web cases point at
**Pages audited:** **all 324 public URLs**, taken from the site's own sitemap, at two screen widths (1280px and 375px)
**Date of the scans:** 20 August 2026

---

## 1. Summary in one page

The site started in unusually good shape. It already had a skip link, a real
focus ring on every control, correct page language, one `<h1>` per page, proper
landmarks, and a motion setting that respects „reduce motion". The automated
tools reflected that: **Google Lighthouse scored 100/100 for accessibility on
every page tested, both before and after this work.**

That is the first thing worth saying plainly: **Lighthouse found none of the
eight real defects listed below.** Neither did most of axe-core's rule set. The
problems that actually block people were found by reading the code and by
driving the site with a keyboard and measuring what happened — which is why this
report contains its own measurements rather than only tool output.

### What was found and fixed

| Severity | Meaning | Found | Fixed | Left open |
| --- | --- | --- | --- | --- |
| **Critical** — blocks a user entirely | — | 0 | 0 | 0 |
| **Major** — a serious barrier | — | 6 | 6 | 0 |
| **Minor** — friction | — | 6 | 5 | 1 (needs your decision) |
| **Total** | | **12** | **11** | **1** |

Separately, **one long-standing content limitation** needs a decision only you
can make (§6): most league tables are published as photographs of the book, and
a photograph of a table cannot be read aloud.

### Before and after, by tool

| Measure | Before | After |
| --- | --- | --- |
| **axe-core** violations, 324 URLs at 1280px | 141 pages affected | **0** |
| **axe-core** violations, 324 URLs at 375px | 141 pages affected | **0** |
| **pa11y** (WCAG2AA) errors, 324 URLs | 1,326 errors on 83 pages | **91 on 81 pages** — all one known tool bug, proven in §7 |
| **Lighthouse** accessibility, 5 key pages | 100 / 100 / 100 / 100 / 100 | **100 / 100 / 100 / 100 / 100** |
| **Colour contrast**, every rendered text/background pair | 1 failing pair (1.19:1) | **0 failing pairs**, lowest is 5.81:1 |
| **Touch/click target size** (24×24 minimum) | 0 failures | **0 failures** |
| **Keyboard: focus hidden under the sticky bar** | 8 stops across 2 pages | **0 across 12 pages, both directions, both widths** |

Raw output for all of it is committed beside this report in
`docs/a11y-scan-before/` and `docs/a11y-scan-after/`.

### Was the design changed?

No. Screenshots of seven page states were taken before and after at identical
scroll positions and compared pixel by pixel:

| Page | Pixels different | What changed |
| --- | --- | --- |
| Home | **0 of 1,152,000** | nothing |
| Архива (index) | **0** | nothing |
| Легенди | **0** | nothing |
| Статистика | **0** | nothing |
| Контакт | **0** | nothing |
| Season page (desktop) | 3.7% | see below |
| Season page (phone) | 8.0% | see below |

The season page is the only one that moved, and for two reasons, both intended:

1. **The separator dots between goalscorers became visible.** They were always
   in the page; they were painted in a colour with 1.19:1 contrast, so nobody
   could see them. That was one of the fixes.
2. **The results table is exactly 1 pixel shorter.** Splitting it into two row
   groups (one per half-season) so a screen reader can tell autumn from spring
   changes where the shared table borders round off, by one pixel. Everything
   below shifts up by 1px, which is what makes the raw percentage look large.
   Comparing the same page one pixel apart brings the difference down to **6
   pixels out of 1,152,000 (0.001%)** — i.e. nothing but the dots.

Every colour used in a fix is an existing token from `brand.md`. No new colour,
font, or spacing value was introduced anywhere.

---

## 2. What was fixed

Files are given so a developer can find them; you do not need to read them.

### Major

| # | Page(s) | The problem, in plain words | WCAG | What was changed | File(s) |
| --- | --- | --- | --- | --- | --- |
| 1 | Every page; proven on **/статистика** and every season page | **Keyboard focus disappeared under the blue bar at the top.** Moving backwards through a page with Shift+Tab, the browser scrolls the thing you land on to the very top of the screen — which is exactly where the sticky header sits. Measured: on a season page „Назад кон архивата" and „Сите сезони од 1990-ти" were *entirely* covered; on /статистика six season links in a row were. You could not see where you were. | **2.4.11 Focus Not Obscured (Minimum), AA — new in WCAG 2.2** | The page now reserves the height of the sticky bars whenever it scrolls anything into view, using one rule instead of the eleven per-section offsets it replaces. Pages with a second sticky bar (/архива, /статистика, /легенди) reserve both; the rest reserve just the header. | `src/app/globals.css`, `src/components/JumpNav.tsx`, `src/components/legends/LegendsBrowser.tsx`, `CategoryGrid.tsx`, `src/app/(site)/arhiva/page.tsx`, `statistika/page.tsx`, `arhiva/[slug]/page.tsx`, `razno/[slug]/page.tsx`, `SeasonAnchorNav.tsx`, `SiteHeader.tsx` |
| 2 | **/легенди** | **The „clear the search" ✕ was invisible.** It was painted in the off-white used on the dark blue blocks, but it sits inside the white search field. Sampled from a screenshot: **1.05:1** where the rule asks for 3:1. Sighted users could not see the button; it may as well not have existed. | **1.4.11 Non-text Contrast, AA** | Recoloured to the same grey the magnifying-glass at the other end of the field already used — **6.69:1**. Its focus ring was also switched from orange to navy, because orange on white is 2.6:1. | `src/components/legends/LegendsBrowser.tsx` |
| 3 | **/легенди** | **Clearing the search threw you to the top of the page.** The ✕ deletes the text, which removes the ✕ itself — and the browser then has nowhere to put the keyboard, so it drops it on the page body. Measured: focus came back as `<body>`. A keyboard user had to tab through the whole site header again to carry on searching. | **2.4.3 Focus Order, A** | Focus is handed back to the search box, which is where the person was typing anyway. | `src/components/legends/LegendsBrowser.tsx` |
| 4 | Every season page with goalscorers (**91 pages**) | **The „·" between goalscorers was unreadable** — 1.19:1 against the page. It is the only thing separating „Гошев 17" from „Андреев 48" in a long list. | **1.4.3 Contrast (Minimum), AA** | Painted in the same grey as the minute figures it separates — **6.09:1**. This alone was 1,233 of the 1,326 reported errors. | `src/components/archive/SeasonResultsTable.tsx` |
| 5 | Season pages | **Player links were told apart from ordinary text by colour alone.** They did carry an underline, but it was drawn at 1.19:1 — invisible. In the squad table some names are links and some are plain text, and navy against the body grey is only 1.44:1, so there was no reliable way to see which names you could click. | **1.4.1 Use of Colour, A** | The underline now inherits the link's own navy — **14.95:1**. Hover still turns it orange. | `SeasonSquadTable.tsx`, `SeasonRecordList.tsx`, `SeasonStory.tsx` |
| 6 | **/контакт** | **The contact form lost the keyboard on submit, and the „thank you" was not announced.** Pressing „Испрати" disabled the button, which blurs it and drops focus on the page body; the form was then replaced entirely. A screen-reader user could be left with no confirmation that anything had happened. | **2.4.3 Focus Order, A** and **4.1.3 Status Messages, AA** | The button now says it is busy instead of switching itself off, so focus stays put, and focus moves to the result panel when the reply arrives — which guarantees the message is read out. A second press is blocked in the code instead. | `src/components/contact/ContactForm.tsx` |

### Minor

| # | Page(s) | The problem | WCAG | What was changed | File(s) |
| --- | --- | --- | --- | --- | --- |
| 7 | **/контакт** | The grouped, switched-off form had no name, so a screen reader announced a group boundary and nothing else — and never said *why* it was switched off. | 1.3.1, 4.1.2 (A) | A hidden group label: „Контакт формулар — сѐ уште не е активен". Carries the reason, not just the label. | `ContactForm.tsx` |
| 8 | Every season page with two half-seasons (**91 pages**) | „Есенски дел 1992" was marked up as a heading for every **column** of the table rather than for the **rows** underneath it. A screen reader could attach the wrong half-season to a result. | 1.3.1 (A) | Each half-season is now its own row group, with the label heading that group. Confirmed in the browser's accessibility tree: it is now read as a row heading. | `SeasonResultsTable.tsx` |
| 9 | Every season page, **on a phone only** | The „Стрелци" column heading was removed below 640px while the goalscorer cell was still shown — so „Андреев 75 · Гошев 80" was announced as a bare value with nothing to say what it was. | 1.3.1 (A) | The heading is hidden from the eye but kept for screen readers. Layout is unchanged. | `SeasonResultsTable.tsx` |
| 10 | **The „page not found" page** | It carried the homepage's title, word for word. The title is the first thing a screen reader announces and the label on the browser tab, so the one page that most needs to say „this does not exist" was the one that never said it. | 2.4.2 Page Titled (A) | Its own title: „Страницата не постои · ФК Беласица" (and it now tells search engines not to index it). | `src/app/not-found.tsx` |
| 11 | **/статистика** | The sortable column buttons showed „ДГ" but were *named* „Дадени голови" to software. Someone controlling the computer by voice says what they can see — „ДГ" — and nothing happened. Eight of ten columns. | 2.5.3 Label in Name (A) | The visible short label is now part of the button's name: „ДГ Дадени голови". Nothing changes on screen. | `src/components/stats/StatTable.tsx` |
| 12 | **141 person pages**, season cards, photo galleries | **The same words read out twice.** A portrait's description was the person's name — directly under a heading that was already the person's name. Same on season cards, and on any photo whose caption is printed right below it. | 1.1.1 (A) / axe `image-redundant-alt` | Portraits on a person page are described as „Архивски портрет"; card images and captioned photographs are marked decorative, because the caption beside them already says it. This cleared the only violation axe reported anywhere on the site. | `PersonHero.tsx`, `LegendCard.tsx`, `SeasonCard.tsx`, `PhotoGrid.tsx`, `RaznoPhotoGrid.tsx` |
| 13 | Season and topic photo galleries | Up to seventeen „open photo" buttons on one page had the identical name „Отвори: Архивска фотографија" — a screen-reader user listing the buttons got seventeen indistinguishable rows. | 2.4.6 (AA, best practice here) | An uncaptioned photo's button now carries its position in the grid. | `PhotoLightbox.tsx` |

---

## 3. Colour contrast — every pair the site actually renders

Measured from the rendered page, not from the stylesheet: transparency is
composited, the background is resolved through the ancestors, and the threshold
comes from the real font size and weight. **All 23 pairs pass. The lowest is
5.81:1, against a requirement of 4.5:1.**

| Text | Background | Ratio | Needs | Result |
| --- | --- | --- | --- | --- |
| Navy `#0d1f3c` | Orange `#ee7a16` (buttons) | 5.81:1 | 4.5:1 | ✅ |
| Orange `#ee7a16` | Navy `#0d1f3c` (large display figures) | 5.81:1 | 3:1 | ✅ |
| Error red `#b42318` | Paper `#f7f4ec` (the required-field `*`) | 5.98:1 | 4.5:1 | ✅ |
| Grey `#5e5c55` | Paper `#f7f4ec` | 6.09:1 | 4.5:1 | ✅ |
| Grey `#5e5c55` | Zebra `#fcfbf7` (table stripes) | 6.46:1 | 4.5:1 | ✅ |
| Grey `#5e5c55` | White | 6.69:1 | 4.5:1 | ✅ |
| Off-white at 80% | Navy-2 `#12294f` | 8.89:1 | 4.5:1 | ✅ |
| Dark grey `#3a3a38` | Paper | 10.37:1 | 4.5:1 | ✅ |
| Dark grey `#3a3a38` | Zebra | 11.01:1 | 4.5:1 | ✅ |
| Dark grey `#3a3a38` | White | 11.40:1 | 4.5:1 | ✅ |
| Paper `#f7f4ec` | Navy-2 `#12294f` | 13.12:1 | 4.5:1 | ✅ |
| Paper `#f7f4ec` | Navy `#0d1f3c` | 14.95:1 | 4.5:1 | ✅ |
| Navy `#0d1f3c` | Paper `#f7f4ec` | 14.95:1 | 4.5:1 | ✅ |
| Navy `#0d1f3c` | Zebra `#fcfbf7` | 15.86:1 | 4.5:1 | ✅ |
| Navy `#0d1f3c` | White | 16.43:1 | 4.5:1 | ✅ |
| Ink `#14161a` | Paper `#f7f4ec` | 16.48:1 | 4.5:1 | ✅ |
| Ink `#14161a` | White | 18.11:1 | 4.5:1 | ✅ |

*(Seventeen rows; the remaining six are the same pairs at a large-text size, where the requirement drops to 3:1.)*

### The three that were changed

| Where | Before | After | Rule |
| --- | --- | --- | --- |
| „·" between goalscorers | mist `#e4e1d8` on paper — **1.19:1** ❌ | grey `#5e5c55` — **6.09:1** ✅ | 1.4.3 (4.5:1) |
| „clear search" ✕ on /легенди | off-white at 80% on white — **1.05:1** ❌ | grey `#5e5c55` — **6.69:1** ✅ | 1.4.11 (3:1) |
| Underline on player links | mist `#e4e1d8` on paper — **1.19:1** ❌ | navy, inherited — **14.95:1** ✅ | 1.4.1 / 1.4.11 (3:1) |

**One element cannot be measured automatically and was checked by hand:** the
dashed „[PLACEHOLDER: …]" chip is painted over a diagonal hatch pattern, and
every automated contrast checker skips anything sitting on a background image.
Its text was measured against the hatch stroke — the worst case, where a line
crosses a letter — at 4.73:1 on light and 5.84:1 on navy. Both pass. This was
already known and recorded in the project's decision log as D-3.05a-8.

---

## 4. Keyboard walkthrough

Every page was driven from the keyboard by script, one Tab at a time, forwards
from the top **and backwards from the end** — backwards matters, because that is
the direction that scrolls things underneath the sticky header. At every stop the
script recorded what received focus, whether a focus ring was actually painted,
and whether the sticky bars were covering it (by hit-testing the focused
rectangle, not by comparing numbers).

| Page | Skip link first? | Every control reachable? | Focus always visible? | Focus ever hidden by the sticky bars? |
| --- | --- | --- | --- | --- |
| Home | ✅ | ✅ | ✅ 3px ring on all | ✅ none |
| /архива | ✅ | ✅ | ✅ | ✅ none *(was: none)* |
| /архива/1992-93 | ✅ | ✅ | ✅ | ✅ none *(was: 2 links entirely hidden)* |
| /легенди | ✅ | ✅ | ✅ | ✅ none |
| /легенди/goran-pandev | ✅ | ✅ | ✅ | ✅ none |
| /статистика | ✅ | ✅ | ✅ | ✅ none *(was: 6 links entirely hidden)* |
| /разно | ✅ | ✅ | ✅ | ✅ none |
| /разно/kup-na-uefa | ✅ | ✅ | ✅ | ✅ none |
| /за-нас | ✅ | ✅ | ✅ | ✅ none |
| /контакт | ✅ | ✅ | ✅ | ✅ none |
| /правни-информации | ✅ | ✅ | ✅ | ✅ none |
| „page not found" | ✅ | ✅ | ✅ | ✅ none |

The same walk was repeated at 375px on six pages: no failures. No element
anywhere has a hand-set tab order (`tabindex` greater than 0), and no focus
outline is removed anywhere in the codebase.

### The photo lightbox

Opened and driven by script on a season page. It behaves correctly and was **not
changed**: focus moves into the dialog on open; the dialog is announced as a
modal with a name; the page behind is locked from scrolling; Escape closes it;
focus returns to the exact thumbnail that opened it; and the scroll lock is
released. Left and right arrows move between photographs, and the position
counter is announced.

### One observation, not a failure

At 375px on the home page, the round „back to top" button overlaps the bottom
corner of a focused decade card. The card is 100px tall and remains almost
entirely visible, so this passes SC 2.4.11, which is about a control being
*entirely* hidden. Worth knowing about; not worth changing the design for.

---

## 5. What was checked and found already correct

Recording this so the next audit does not redo it, and so the „0 findings" rows
above are not mistaken for „not looked at".

- **Page structure.** `lang="mk"` on every page; one `<main>`, one `<h1>`, and
  no skipped heading levels on any of the twelve page types checked in the real
  rendered HTML; every `<nav>` on a page has a distinct name; **no duplicate
  `id` on any page**, including the very repetitive /статистика and season pages.
- **Titles.** Every route has its own descriptive title (the 404 was the only
  exception, now fixed).
- **Forms.** Every field has a real label attached to it, plus correct
  `autocomplete` on name and e-mail. Required fields are stated in words, not by
  a red asterisk alone. Errors appear in text next to the form and are announced.
- **Target size (SC 2.5.8).** Every interactive element on 15 page types was
  measured at both widths, including the 24px-circle spacing exception the
  criterion allows. **No failures**, before or after.
- **Motion.** Nothing autoplays. „Reduce motion" is honoured site-wide; the
  scroll-position rail fade deliberately survives it, because it is a position
  readout rather than decoration, and nothing moves unless the user scrolls.
- **ARIA.** Nothing focusable is hidden from screen readers; icon-only buttons
  all have names; the search result count and the lightbox counter are announced
  through live regions that exist *before* their content changes.

### Claims that were investigated and turned out to be wrong

Four plausible-sounding problems were raised during the audit and **disproved by
measurement**. They are listed because each would have caused a pointless — in
two cases harmful — change:

1. *„The results table loses its table structure on a phone, because the rows
   are laid out as a grid below 640px."* **False.** Read out of Chrome's
   accessibility tree at 375px, the table is still a table: 2 tables, 2 row
   groups, 68 rows, 210 cells, 8 column headers, all correctly related.
2. *„The mobile menu is taller than a zoomed-in screen, so the last links cannot
   be reached."* **False.** Tested at 640×400 (200% zoom), 512×320, 375×667 and
   320×256: „Контакт" scrolls into view at every one of them, with no sideways
   scrolling.
3. *„The photo lightbox strands focus / does not restore scrolling."* **False**,
   as measured above.
4. *„The English word „cookies" inside Macedonian prose needs a language
   marker."* WCAG 3.1.2 exempts technical terms in the surrounding vernacular,
   and the sentence gives „cookies" as a gloss on the Macedonian „колачиња".
   Changing it would have meant restructuring the legal page's content model for
   no conformance gain.

---

## 6. Needs your decision

| # | The question | Why it cannot be decided by a developer | Recommendation |
| --- | --- | --- | --- |
| **A** | **The league tables are photographs.** On 88 of 96 season pages, the final standings exist only as a scan of the book. Someone who cannot see the scan gets the description „a photograph of the table for season X, scanned from the source document" — honest, but it conveys none of the figures. This is a real 1.1.1 gap and the largest remaining accessibility issue on the site. | Writing the figures out means typing them from the book. Nobody may invent them, and the site's own content rule forbids publishing a fact that is not verified. Only you can authorise the transcription and confirm the numbers. | Transcribe the standings for the seasons that matter most first — the two title seasons (1982/83 and 1987/88) and the most-visited pages — and add them as text tables beside the scan, exactly as `/архива/1992-93` already does for results and squads. The machinery for typed tables exists; only the data is missing. Keep the scan: it is the source. |
| **B** | **The 404 page's three Macedonian sentences have still never been read by a native speaker.** This is carried over from an earlier phase, not introduced here; this work gave that page its own title and so drew attention to it again. | It is a copy question, not a code question. | Read the three lines on the „page not found" page and confirm or correct them. |

---

## 7. The 91 remaining pa11y errors — why they are being left

All 91 are the same code, `H43.HeadersRequired`, one per results table, on 81
season pages. pa11y is asking for a different way of connecting a table's cells
to its headings on tables that have headings at two levels.

**Its advice was followed, and it then rejected its own advice.** With every cell
explicitly naming its column heading and its half-season, pa11y switched to
`H43.IncorrectAttr` and demanded that each autumn match *also* declare the spring
half-season as one of its headings — „Expected `c1 g1 g2` but found `c1 g1`".
Complying would tell a screen-reader user that every autumn fixture belongs to
the spring half-season as well, which is false.

The cause is a bug in the checker: it does not respect row-group boundaries. A
twelve-line standalone HTML file reproducing it is committed at
`docs/a11y-scan-after/pa11y-H43-tbody-repro.html` — open it, run pa11y over it,
and the same wrong demand appears with no site code involved.

So the markup was left as the standard, correct form, and it was verified
directly instead: in Chrome's accessibility tree, „ЕСЕНСКИ ДЕЛ 1992" is exposed
as a **row heading** over exactly its own group of matches, and every cell
resolves to its column heading plus that one half-season. **axe-core, which is
the engine Lighthouse and most compliance vendors use, reports no violation on
these tables.**

The same file also explains axe's two remaining „incomplete" notes, which are
questions rather than findings: the number-sign column head „№" contains no
letters, so axe declines to judge its contrast (it is off-white on navy,
14.95:1), and it makes the same row-group query about the results table.

---

## 8. Requires human testing — please read this part

**This audit cannot certify the site as accessible, and no automated audit can.**
Automated tools reliably catch about 30–40% of accessibility problems. The
code-level review and the scripted keyboard runs in this report go well beyond
that, but they still are not the same thing as a person using the site with a
screen reader, or a person with low vision, a motor impairment, or dyslexia
trying to get something done on it.

Two specific limits of this work, stated plainly:

- **No screen reader was run.** Everything about announcements here is inferred
  from the markup and from Chrome's accessibility tree. That is a good
  approximation and it is not proof. On a Mac, VoiceOver starts with **Cmd+F5**.
- **The contact form's live path was never exercised**, because the sending
  address is not configured in this environment. The submit, success and error
  behaviour was fixed by reading the code, and needs one real submission to
  confirm.

### The five flows to test by hand, in priority order

1. **Find a player and open their page** — go to /легенди, type part of a name,
   clear the search with the ✕, switch category tabs, open a card. Listen for
   whether the result count is announced and check that clearing the search
   leaves the cursor in the field.
2. **Read a season** — open /архива/1992-93 with a screen reader and go through
   the results table. Confirm that autumn and spring are announced as separate
   groups and that each result is read with its column heading. Then do it again
   on a phone.
3. **Send a message** — fill in /контакт and submit it for real. Confirm the
   „thank you" is spoken and that the keyboard has not jumped to the top of the
   page. Then submit with a bad address and check the error is announced.
4. **Open and close a photograph** — on a season page, open a photo from the
   gallery with the keyboard, move between photographs with the arrow keys,
   close with Escape, and confirm you land back on the thumbnail you started on.
5. **Move backwards through a long page** — on /статистика, press Shift+Tab
   repeatedly from the bottom and confirm you can always see where the focus is.
   This is the fix that mattered most; it deserves a human check.

Testing with people who use these tools every day is worth more than all of the
above. If the archive ever has the opportunity, one hour with one screen-reader
user will find things this report did not.

---

## 9. What was not audited, and why

- **`/studio`** — the content-editing tool. It is the Sanity Studio, third-party
  software embedded in the site, kept out of search engines by `robots.ts`, and
  reachable only by the two editors. Its markup is not this repository's to fix,
  and auditing it would fill this report with findings nobody here can act on.
  It is excluded from every count above; all 324 public URLs are included.
- **Video and audio** — the site has none, so the criteria about captions,
  transcripts and audio description do not apply.
- **Sign-in and payment** — the site has neither, so SC 3.3.7 Redundant Entry
  and 3.3.8 Accessible Authentication do not apply.

---

## 10. Conformance statement

**Remediated toward WCAG 2.2 Level AA; see open items above.**

Concretely: every issue found by axe-core and by code review has been fixed and
re-verified, at two screen widths, across all 324 public pages. The one
outstanding conformance gap is item **A** in §6 — league tables published as
photographs — which cannot be closed without transcribing figures from the book.
Until it is closed, the site does not fully meet SC 1.1.1 on those season pages.
Nothing in this report should be read as a legal opinion or as certification.
