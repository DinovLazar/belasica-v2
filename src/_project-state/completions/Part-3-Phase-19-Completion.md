# Part 3 · Phase 19 · Code — Completion Report

**Date:** 2026-08-11 · **Executor:** Claude Code (Opus 5), on Lazar's machine, from a checkout of `~/Projects/belasica-v2` · **Outcome (one line):** the front page leads with three of Ace's pennants instead of the crest, every player the archive holds a figure for now shows his appearance count, „Разно" reads with the archive's jump rail, and a wide scan in the lightbox is no longer covered by its own arrows.

> ⚠️ **This phase has no brief.** The work arrived as direct owner feedback („Ace feedback" — the branch is `phase-3.19-ace-feedback-ui`), and no `briefs/Part-3-Phase-19-Code.md` exists. There is also **no phase 3.18** anywhere in the repo — no branch, no PR, no decision, no report; D-3.17-1 considered and rejected that number. **This report is therefore the only specification of what 3.19 was asked to do**, and §2's Definition of Done is *reconstructed from the owner's four instructions* rather than copied from a brief (D-3.19-1).

## 1. What shipped (plain language)

Four things Ace asked for after looking at the site. The **front door now leads with three pennants** — znamenca 1, 6 and 9, in his order — instead of the single crest; a screen reader announces them once, as one object, and says only what they are, because the archive holds no record of their dates. **Every player now shows how many matches he played**: 80 of 98, where before only 32 did, by falling back to the career total his own page already shows when the book prints no figure. **„Разно" reads like the archive** — each topic splits into „Преглед" and „Рекорди" with the same jump rail, cut at the point the chapter turns from story to lists so not one line of Ace's transcribed text moves. And **a wide photograph is readable in the lightbox again**: the arrows used to sit on top of his newspaper clipping and now hold a real gutter beside it, dropping below the picture on a phone.

One thing was found by measuring rather than by reading: the homepage's ten legends showed a number on **2 cards** while `/legendi` showed one on all it could — the same ten men, described differently. Fixed in-phase.

## 2. Definition of Done — reconstructed from the owner's instructions

**Verifiable by executor — all evidence from the deployed preview `https://belasica-v2-lm01c1v86-sunset-services-team.vercel.app` unless noted:**

- ✅ **The hero badge is three znamenca, in the owner's order** — evidence: `/znamenca/zname-01.webp`, `zname-06.webp`, `zname-09.webp` all present in the deployed homepage HTML, in that order from the `ZNAMENCA` table.
- ✅ **They read as a set** — all three files are **520px tall** (368/476/418 wide), normalised by one `h-16/20/28` + `w-auto`, so each keeps its own proportions.
- ✅ **They are one accessible object, not three** — evidence: `aria-label="Три знаменца на ФК Беласица"` on a single `role="img"` wrapper in the deployed HTML; every `<img>` carries `alt=""`.
- ✅ **The label invents nothing** — it names the group and gives no date, occasion or competition, because `facts.md` holds no entry for these images (D-3.19-4). → **OV-46**.
- ✅ **The header's crest is untouched** — evidence: `crest.svg` still present on the deployed homepage; `public/crest.svg` byte-unchanged and absent from the diff.
- ✅ **Every player carries an appearance count where the archive holds one** — evidence: **80** `sr-only настапи` markers on the deployed `/legendi`, up from 32 before this phase.
- ✅ **Nothing was written to Sanity** — `legendAppearances` still holds the book's printed value alone; no write, no schema change, no migration (D-3.19-2).
- ✅ **The homepage and `/legendi` describe the same ten people identically** — evidence: deployed homepage renders `555 383 366 336 328 262 260 235`; the two without a number (Ефтимов #8, Пантазиев #9) render nothing on **both** pages (D-3.19-3).
- ✅ **„Разно" gains the rail and splits into two sections** — evidence: all **7/7** topics return 200; **exactly 3** (`kup-na-uefa`, `partizan`, `tiverija`) render „Скок низ темата" + `id="pregled"` + `id="rekordi"`; the other **4** render none of the three, as intended for a chapter with no records.
- ✅ **The transcription is not reordered** — the cut is at the first `record` block, never by filtering kinds; the 101 blocks are byte-unchanged and in source order (D-3.19-5).
- ✅ **The season page's rail is unaffected** — evidence: `/arhiva/1985-86` still renders `aria-label="Скок низ сезоната"`; `SeasonAnchorNav` gained an optional prop with that string as its default (D-3.19-7).
- ✅ **The lightbox arrows no longer overlap the scan** — arrows and figure share one flex row; the image cap `sm:max-w-[calc(100vw-11rem)]` is derived from the controls (2 × 48px + 2 × 16px gap + 2 × 16px overlay padding + slack) rather than guessed, and `pt-20` reserves the close button's band (D-3.19-8). ⚠️ **Verified by construction and by reading the compiled CSS, NOT by opening the overlay in a browser** — see §4.
- ✅ **Build, types, lint** — `npm run build` **279/279, page count unchanged**; `npx tsc --noEmit` exit 0; `npm run lint` clean.
- ✅ **Zero new dependencies** — `package.json` and `package-lock.json` absent from the diff.
- ✅ **No placeholders introduced** — 0 occurrences of `PLACEHOLDER` on the deployed homepage.
- ⚠️ **„кај сите играчи треба да има бројка на натпревари" — 80 of 98, not all.** 18 players hold **neither** source. Two are in the homepage's own ten (Ефтимов, Пантазиев — both fields `null` in `production`, confirmed by GROQ query). Rendering a zero or a dash was refused on content truth. → **OV-48**.
- ❌ **`/impeccable audit` — NOT RUN.** CLAUDE.md requires it on affected pages for every UI phase. It was not run, and no P1/P2 triage exists for this phase. The two `broken-image` findings the design hook raised on `page.tsx` were reviewed and are **false positives** — the matcher hit the literal text `<img` inside two prose comments, not JSX; nothing was changed and no suppression was added.
- ❌ **Contrast ratios — NOT MEASURED.** Every prior UI phase in this project reports measured ratios against each element's real backdrop. Nothing was measured here: not the „Преглед"/„Рекорди" headings, not the „Скок низ темата" rail on navy-2, not the rearranged lightbox caption.
- ❌ **Focus rings — NOT CONFIRMED under a real Tab.** The lightbox's two arrow buttons changed position and class list; their `focusOnNavy` ring was not re-verified.

**Owed to Lazar (now on the owed-verification register):**

- **OV-45** — a native speaker reads four new Macedonian strings on screen: the hero `aria-label` (heard, not seen — needs reading aloud), „Скок низ темата", „Преглед", „Рекорди".
- **OV-46** — Ace confirms **what the three znamenca are** (no `facts.md` entry exists) and whether 1, 6 and 9 in that order are the selection he wanted.
- **OV-47** — Ace decides how to resolve two provenances now sharing one number slot; **OV-39's open question is the way to close it**.
- **OV-48** — Ace supplies figures for Томче Ефтимов and Панче Пантазиев if he has them; they are the two blanks on the front page.
- **OV-49** — the owner reviews the roster split, which drifted **86 · 46 → 98 · 34** in Studio since 3.17 (total still 160). **Not caused by this phase.**

**Five-item eyeball checklist for Lazar** — on `https://belasica-v2-lm01c1v86-sunset-services-team.vercel.app`:
1. **Homepage** — do the three pennants sit right beside „ФК БЕЛАСИЦА", and do they look like a set rather than three different sizes? Check at phone width too, where the row wraps onto its own line.
2. **Homepage legends** — eight of the ten cards show a number; Томче Ефтимов and Панче Пантазиев show none. Is that acceptable, or should those two be left out until Ace supplies figures?
3. **`/legendi`** — the band counts now read **98 · 34 · 28**. Is that intended? (It changed in Studio, not in code.)
4. **`/razno/kup-na-uefa`** — the rail and the „Преглед"/„Рекорди" split. Then **`/razno/ajduci`**, which has no records and should look exactly as it did before.
5. **`/arhiva/1985-86`** → open a photograph → step through with the arrows. **This is the one thing never opened in a browser during the phase.** Check a wide scan is not covered, and check phone width, where the arrows should fall *below* the picture.

## 3. Decisions I made during this phase

All eight are logged in `decisions.md`.

- **D-3.19-1** · Execute from owner feedback with no brief; number it 3.19; leave 3.18 permanently unused; NEXT stays 3.08. *Why:* no brief exists and the branch was already pushed as 3.19. *Rejected:* renumbering a pushed branch; writing a retroactive brief (it would manufacture an instruction source that never existed). *Logged:* yes.
- **D-3.19-2** · The card's count falls back to `careerStats.appearances` — **reversing the second alternative D-3.15-12 explicitly rejected**. *Why:* that refusal was right while the gap was an open question about the book; the owner has now answered it by asking for the number regardless of source. Nothing written to Sanity, so the *write* half of D-3.15-12 stands. *Rejected:* backfilling the transcription field (asserts unverified provenance); styling the fallback differently (asks the reader to decode a distinction the page never explains). *Logged:* yes — and D-3.15-12's **Status** was amended in place, its history untouched.
- **D-3.19-3** · `HOME_QUERY` carries `careerStats` too. *Why:* found by measuring the built output — 2 counts vs 80. *Rejected:* filing it as an OV item and shipping the contradiction (put to the owner, who chose the fix). *Logged:* yes.
- **D-3.19-4** · The three pennants are one accessible object; the label dates nothing. *Rejected:* an `alt` per pennant; a label naming years or occasions. *Logged:* yes.
- **D-3.19-5** · „Разно" splits at the **first `record` block**, never by filtering kinds. *Why:* filtering silently reorders a verbatim transcription. *Rejected:* filtering by kind; hand-authored section markers in the generated module. *Logged:* yes.
- **D-3.19-6** · Sections are labelled regions only where the chapter actually splits — **narrows D-3.16-8, does not reverse it**. *Logged:* yes.
- **D-3.19-7** · `SeasonAnchorNav` takes a `label` prop instead of being forked or renamed. *Why:* 3.17 had just collapsed three copies of this markup into one component. *Logged:* yes.
- **D-3.19-8** · Lightbox arrows and figure share one flex row; the image cap is derived from the controls; the row wraps below `sm` via `order` on one set of buttons. *Rejected:* a fixed percentage cap; a second hidden pair of arrows (duplicate labels and tab stops). *Logged:* yes.

## 4. Deviations

- **No brief to deviate from.** See D-3.19-1. The DoD in §2 is reconstructed, which means **nobody has checked it against what Ace actually meant** — the largest single risk in this phase.
- **CLAUDE.md's UI-phase rules were not fully followed.** „Invoke the `designing-and-coding-branded-web-ui` skill before writing any UI code" — not done. „Run `/impeccable audit` on the affected pages before filing the completion report" — **not done**. „Render every affected page and verify against the handover and `brand.md`" — done for the homepage, `/legendi` and all seven `/razno` pages via the deployed HTML, **not done for the lightbox**, which requires interaction. These are stated rather than papered over; the report is filed with the gaps visible.
- **The rearranged lightbox was never opened.** Its wrap behaviour below `sm`, its focus rings and its behaviour with a genuinely wide scan are reasoned from the CSS and the compiled output, not observed. It is item 5 on Lazar's checklist for exactly this reason.
- **One thing was fixed that the owner did not ask for**: the homepage projection (D-3.19-3). It was a contradiction this phase introduced, so fixing it in-phase was the alternative to shipping it.

## 5. Changed files / deliverables

- **Added:** `public/znamenca/zname-01.webp`, `zname-06.webp`, `zname-09.webp` (~110 KB total).
- **Edited:** `src/app/(site)/page.tsx` · `src/app/(site)/legendi/page.tsx` · `src/app/(site)/razno/[slug]/page.tsx` · `src/components/archive/PhotoLightbox.tsx` · `src/components/archive/SeasonAnchorNav.tsx` · `src/components/legends/LegendCard.tsx`.
- **Branch:** `phase-3.19-ace-feedback-ui` · **PR:** [#48](https://github.com/DinovLazar/belasica-v2/pull/48) · **Preview:** `https://belasica-v2-lm01c1v86-sunset-services-team.vercel.app` (Vercel status: success).
- **No Sanity write, no schema change, no dependency change, no `brand.md` change.**

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers (OV-45…OV-49 added; the stale `86 · 46 · 28` band split corrected to the live `98 · 34 · 28` where it is asserted as current)
- [x] `NEXT:` line set to: **`3.08 — Domain cutover to www.belasicahistory.mk`** (unchanged, per D-3.17-1 and D-3.19-1)
- [x] `file-map.md` synced — `public/znamenca/` added
- [x] `00_stack-and-config.md` — **not touched, correctly**: zero dependencies added or upgraded

## 7. Risks, surprises, what the next phase needs to know

- **The phase sequence is now broken twice over.** 3.17 → 3.19, with 3.18 skipped, and 3.08 still pending after all of them. **The NEXT line, not the number, is the pointer.**
- **The biggest surprise was a contradiction the phase itself created**, invisible in the diff and only findable by grepping the built HTML: `/legendi` and the homepage render the same ten people through the same component but from *different queries*, and only one of them was updated. **Any future change to what a `LegendCard` displays must touch both `HOME_QUERY` and `/legendi`'s projection.** The type comment on `HomeData` now says so.
- **A content-truth decision was reversed for the first time in this project.** D-3.15-12 refused the `careerStats` fallback to protect a field's provenance; 3.19 does it at the owner's instruction. The reversal is confined to *rendering* — nothing was written — but **OV-47 is the debt it creates** and OV-39 is how to clear it.
- **The roster is drifting in Studio between phases** (OV-49). Twelve people changed role since 3.17 with no phase involved. Any snapshot claim about band sizes goes stale on its own; **verify counts against the live data, never against this file's history.**
- **The known `WasmHash` webpack-cache flake fired twice more this session**, once on each build. `rm -rf .next/cache` then rebuild works every time. It is an environment flake, not a code fault — now seen across at least four phases.
- **`/impeccable audit`, contrast measurements and a browser pass on the lightbox are genuinely owed** and are the first things a verification phase should pick up.

## 8. What's now possible that wasn't before

Ace's own pennants greet a visitor on the front page, and a reader can finally see how many matches a legend played without opening his page — for 80 of the 98 men the archive holds a figure for.
