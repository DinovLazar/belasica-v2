# Part 3 · Phase 20 · Code — Completion Report

**Date:** 2026-08-11 · **Executor:** Claude Code (Opus 5), on Lazar's machine, from a checkout of `~/Projects/belasica-v2` · **Outcome (one line):** the seven „Разно" topics stopped being text-only — 64 archival photographs now sit under „Фотографии" on every one of them, and every topic carries the jump rail.

> ⚠️ **No brief, as at 3.19.** The work arrived as direct owner feedback, and no `briefs/Part-3-Phase-20-Code.md` exists. **This report is the only specification of what 3.20 was asked to do**, and §2's Definition of Done is reconstructed from the owner's instructions rather than copied.
>
> ⚠️ **The code was written in a different session and found uncommitted in the shared checkout.** This session cleaned the working tree, ran the build, branched it, and filed the paperwork. The decisions in §3 are therefore **reconstructed from the diff and its comments**, not recorded live as they were made — a weaker record than a phase that logs its own, and the reason each one names the file it was read out of.

## 1. What shipped (plain language)

Every „Разно" topic now has photographs — **64 in all**: 3 on Тиверија, 5 on Виареџо, 6 on Куп на УЕФА, 6 on Стадион, 7 on Партизан, 8 on Ајдуци, 29 on the младинска школа. **Every topic now carries the jump rail too**, where before only the three with records did — Ace's „нека ги има сите горе, како што е кај архивата". Clicking a photograph opens **the same overlay the archive uses**, including the arrow fix from 3.19, because that component was reused rather than rebuilt.

**29 of the 64 photographs have a caption. 35 have none, and were given none** — they arrived with machine-generated filenames that describe nothing, and writing a description would have been writing a fact nobody has.

## 2. Definition of Done — reconstructed from the owner's instructions

**Verifiable by executor:**

- ✅ **Every topic has a „Фотографии" section** — evidence: `id="fotografii"` present in all **7** prerendered pages.
- ✅ **Every photograph on disk reaches its page** — evidence: images referenced in each built page match that topic's folder **exactly**, all seven: 6·29·5·7·3·6·8 = **64 files, 64 references**.
- ✅ **Every topic carries the rail** („нека ги има сите горе") — evidence: „Скок низ темата" present in all 7 pages, where 3.19 had it in 3.
- ✅ **„Фотографии" sorts last**, after the book's text, mirroring the season page (D-3.20-4).
- ✅ **The section appears only where photographs exist** — the governing rule from D-3.19-5 holds; the `isSplit` guard is retained for a future topic with neither records nor pictures.
- ✅ **The book's credit still closes the book's text** — evidence: exactly **one** occurrence in the body of each of the 7 pages, on the last *prose* section (D-3.20-5). The second textual match per file was checked and sits in the inlined RSC payload, not a second render.
- ✅ **The lightbox is reused, not reimplemented** — `RaznoPhotoGrid` composes `PhotoLightboxProvider`/`Trigger` unchanged; the only edit to `PhotoLightbox.tsx` is the added `label` prop (D-3.20-2).
- ✅ **No caption was invented** — 29 captions, 35 deliberately absent with `alt=""` (D-3.20-6).
- ✅ **No `[PLACEHOLDER]` chip reintroduced** — 3.15's zero-placeholder state is intact.
- ✅ **No image reaches the Vercel optimiser** — all 64 are plain `<img>` (D-3.20-7).
- ✅ **Build, types, lint** — `npm run build` **279/279, page count unchanged**; `npx tsc --noEmit` exit 0; `npm run lint` clean.
- ✅ **Zero new dependencies; no Sanity write; no schema change** — `package.json`/lockfile and `src/sanity/**` absent from the diff.
- ❌ **The lightbox was never opened.** The dialog is **not server-rendered at all** — `role="dialog"` appears **0 times** in the prerendered HTML of `/razno/tiverija` *and* `/arhiva/1985-86`, because it mounts only on open. So the per-topic label (D-3.20-3) is **unverified**, and so is the 3.19 arrow/gutter behaviour in this new context. → **OV-52**.
- ❌ **`/impeccable audit` — NOT RUN**, as at 3.19. No P1/P2 triage exists for this phase.
- ❌ **Contrast — NOT MEASURED** on the new caption anatomy (`neutral-700` on paper with the orange rule) or the grid frames.
- ❌ **Focus rings — NOT CONFIRMED under a real Tab** on the 64 new thumbnail buttons.

**Owed to Lazar (on the register):**

- **OV-50** — Ace captions any of the 35 undescribed photographs he recognises. Files are `<slug>-NN.webp` in his own folder order, so each is identifiable by name.
- **OV-51** — **the consequential one.** Confirm the rights confirmation in `facts.md` („all archive photos") was meant to cover this later batch, and decide whether a provenance note should live beside them.
- **OV-52** — open the „Разно" lightbox in a browser, including at phone width.

**Five-item eyeball checklist for Lazar** — on the PR preview:
1. **`/razno/mladinska-skola`** — 29 photographs, the largest set. Do they read as a gallery or as a wall?
2. **`/razno/tiverija`** — only 3. Does a short set still look deliberate rather than sparse?
3. **Any topic** — click a photograph, step through with the arrows, **then try it at phone width**. This is the one thing never verified (OV-52).
4. **`/razno/ajduci`** — was a single unbroken read before; it now has a rail and two headings. Is that an improvement or clutter on a short topic?
5. **Any topic's bottom** — „Извор: Аце Стојанов…" should sit under the *text*, above the photographs, not beneath them.

## 3. Decisions — reconstructed from the diff

All eight are logged in `decisions.md`. ⚠️ **Reconstructed, not recorded live** — see the note at the head of this report.

- **D-3.20-1** · Photographs ship as **static files under `public/`**, not Sanity assets. *Read out of:* `public/razno/` + the generated module's header. *Consequences:* Ace cannot manage them in Studio; 9,3 MB enters git history permanently; **no `provenance` field exists** → OV-51.
- **D-3.20-2** · **New `RaznoPhotoGrid`; lightbox reused unchanged.** *Why:* `PhotoGrid` is Sanity-shaped end to end and would need fabricated image objects; `PhotoLightbox` already takes plain `url · width · height · caption` (D-3.05b-3). *Read out of:* the component's own doc comment.
- **D-3.20-3** · `PhotoLightboxProvider` takes a **`label`** prop — the same move as D-3.19-7's. ⚠️ Unverifiable from static output.
- **D-3.20-4** · **„Фотографии" sorts last, appears only where photographs exist** — so **all seven topics now carry the rail**, superseding 3.19's „four show no rail".
- **D-3.20-5** · **The source credit closes the last *prose* section, not the page** — hanging it under the gallery would attribute the photographs to Аце's chapter, a provenance claim nobody has made.
- **D-3.20-6** · **35 photographs get no caption and `alt=""`.** Rejected: captioning from the topic title, deriving from filenames or neighbouring years, and a visible placeholder chip.
- **D-3.20-7** · **Plain `<img>`, not `next/image`** — pre-optimised files, and it keeps 64 images off an optimiser this project has hit a `402 PAYMENT_REQUIRED` on before.
- **D-3.20-8** · `TopicSection` became a **discriminated union** rather than one shape with an unused half.

## 4. Deviations

- **No brief to deviate from** (see the head note). Nobody has checked the reconstructed DoD against what Ace actually meant.
- **The phase's own decisions were not logged as they were made.** They were reconstructed here from the diff and its comments. Where a comment stated the reasoning explicitly the record is strong; where it did not, the *alternatives rejected* are inference and are the weakest part of §3.
- **CLAUDE.md's UI-phase rules were not fully followed**, identically to 3.19: no `designing-and-coding-branded-web-ui` invocation, **no `/impeccable audit`**, no contrast measurements, no Tab check.
- **Three files were removed from the working tree before building**, at the owner's instruction: a stale `.git/index.lock` (0 bytes, no git process holding it), `razno-photos.manifest.json`, and `_to_delete/` (already absent). **The manifest was verified as safe to delete before removing it** — `razno-photos.ts` declares it scratch and not a build dependency, and its data is already baked into that module.
- **The work was landed via branch + PR rather than pushed directly to `main`**, per CLAUDE.md's branch rules and at the owner's choice when asked.

## 5. Changed files / deliverables

- **Added:** `public/razno/` — **64 WebP, 9,3 MB**, seven folders · `src/content/razno-photos.ts` (generated) · `src/components/razno/RaznoPhotoGrid.tsx`.
- **Edited:** `src/app/(site)/razno/[slug]/page.tsx` · `src/content/razno.ts` · `src/components/archive/PhotoLightbox.tsx` (one added prop).
- **Not committed, by design:** `razno-photos.manifest.json` — scratch, not a build dependency.
- **Branch:** `phase-3.20-razno-photos` · **PR:** [#49](https://github.com/DinovLazar/belasica-v2/pull/49).
- **No Sanity write, no schema change, no dependency change, no `brand.md` change.**

## 6. State updates done

- [x] `current-state.md` overwritten to match reality, incl. registers (OV-50…OV-52 added; **3.19's „four of the seven topics show no rail" corrected**, since 3.20 makes it false)
- [x] `NEXT:` line set to: **`3.08 — Domain cutover to www.belasicahistory.mk`** (unchanged)
- [x] `file-map.md` synced — `public/razno/`, `razno-photos.ts`, `RaznoPhotoGrid.tsx`
- [x] `00_stack-and-config.md` — **not touched, correctly**: zero dependencies added or upgraded

## 7. Risks, surprises, what the next phase needs to know

- **`public/` is becoming a second content store.** 3.19 put 3 files there, 3.20 put 64 and 9,3 MB. Neither batch is in Sanity, neither is editable by Ace, and **git history now carries them permanently**. That is two phases of drift away from the Sanity-first model in a week. **If this is the intended direction, it should be a recorded decision rather than an accumulation of them** — and if it is not, the correction gets more expensive with every batch.
- **OV-51 is the one to act on first.** 64 photographs are publicly served with no provenance record of any kind, and the renaming to `<slug>-NN.webp` destroyed the only hint the filenames carried. The rights confirmation on file is broad enough to plausibly cover them, but nobody has been asked.
- **The lightbox is now three pages' worth of behaviour that has never been opened in a browser** (season gallery, plus seven topic galleries). It is unverifiable from prerendered HTML by construction. **A verification phase should drive it, not read it.**
- **The owed register is at eight open items** (OV-45…OV-52) across two phases, both of which skipped the audit step. By this project's own rule — „At 3+ items, the next phase is a verification phase" — **that phase is overdue, and 3.08 is still waiting behind it.**
- **Two phases in a row have shipped with no brief.** The completion reports are now the only specification of what was asked for.

## 8. What's now possible that wasn't before

The seven parts of the club's story that fit neither a season nor a person can finally be *looked at*, not only read — 64 photographs, on every topic, in the same overlay the rest of the archive uses.
