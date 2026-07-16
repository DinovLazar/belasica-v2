# Part 2 · Phase 02 · Design — Archive & Season page templates — Completion Report

**Date:** 2026-07-16 · **Executor:** Claude Design, Lazar's machine · **Outcome (one line):** The two pages that are the spine of the archive — `/arhiva` and `/arhiva/<slug>` — are fully specified in a single handover plus six mockups, so the 2.03 Code phase can build both from that document and `brand.md` alone.

## 1. What shipped (plain language)

A design handover at `docs/design-handovers/Part-2-Phase-02-Handover.md` specifying both templates section by section — every one mapped to a locked schema field, each with an explicit empty state — plus six rendered mockups (desktop + mobile for both pages, and the two empty states) saved beside it with their HTML sources so they can be re-rendered and never get lost again.

The design takes crnobelanostalgija.com's structure and warmth (decade-grouped season lists; season pages that read as a narrative anchored to hard data) without its styling, and honours the three named divergences: no competition taxonomy, no bylines, no invented league labels. The biggest design call is that **mostly-empty seasons are the first-class state** — after 2.09 almost all ~74 seasons will have only a title and a decade, so a photo-less season gets a navy band hero and a single archive notice instead of a hero floating above the footer.

**No repo code, schema, or content was touched.** Three docs files were written (handover, mockups folder, this report); nothing was committed — Lazar reviews and commits.

## 2. Definition of Done — verified-here vs owed-to-Lazar

**Verifiable by executor:**

- ✅ Handover produced covering both templates — `docs/design-handovers/Part-2-Phase-02-Handover.md` (§5 Archive index, §6 Season detail).
- ✅ Every locked `season` field mapped to a UI treatment — handover §2 field→UI table: `title`, `slug`, `decade`, `story`, `finalTable`, `squad`, `trainers`, plus the back-referenced photos and all five `photo` fields. None left unaddressed.
- ✅ Each Season-detail section has an explicit empty state, omit-vs-chip stated per section — handover §6 per section + §7 consolidated table. All five data sections **omit**; the hero degrades to a navy band; all-five-empty renders one notice (D-2.02-8).
- ✅ Archive groups by decade, newest first, with the Decade section header and a specified Mist-greybox empty-lead-photo card — handover §5.4/§5.5; mockup `archive-empty-desktop.png` shows a whole decade in that state.
- ✅ Responsive behaviour specified for ~1200 and ~375 incl. standings mobile treatment and grid columns per breakpoint — handover §4.1 (1 / 2 / 3 cols) and §6.4 (horizontal scroll inside the bordered frame, all 9 columns kept, `#`+`Клуб` sticky-left, D-2.02-10).
- ✅ Every value references a named `brand.md` token; genuinely missing tokens flagged, not invented — handover §12: **MT-1** (zebra/highlight named in `brand.md` but absent from `globals.css @theme`), **MT-2** (no header-height token for the sticky jump-nav offset). I also removed a drop shadow from the mockup hover state after checking `brand.md` — it defines "2px lift" and has no shadow token, so lift-only is specified.
- ✅ No competition taxonomy, no byline block, no invented league labels — verified against the rendered mockups; the season-card overline is the decade label (D-2.02-1). Confirmed the reference site does use competition tabs and „Author — date" bylines, so all three divergences are real and deliberate.
- ✅ Squad/trainer names specified as links to `/legendi/<slug>`; breadcrumb and routes match `src/lib/nav.ts` — handover §6.1/§6.5/§6.6; `/arhiva` and `/arhiva/<slug>` per D-0.00-4.
- ✅ Accessibility noted — handover §8: AA pairings only (every pairing checked against `brand.md` §Contrast), navy 2px/2px-offset focus rings, real table semantics with `sr-only` full column labels, keyboard-reachable scroll region, heading order, distinct nav landmarks, orange marker-only (D-1.02-1).
- ✅ Mockups delivered for both templates at desktop + mobile plus the two empty states, greybox frames throughout — six PNGs in `docs/design-handovers/Part-2-Phase-02-mockups/`, each rendered at its exact content height at 2× and visually checked.
- ✅ Every on-the-fly decision recorded — handover §11, **D-2.02-1 … D-2.02-15**, restated in §3 below.

**Owed to Lazar (goes on the owed-verification register):**

- ~~Log D-2.02-1 … D-2.02-17 in `decisions.md`~~ — **DONE 2026-07-16, on Lazar's instruction.** All 17 appended in the project's `D-<phase>-<n>` format, each with the alternative rejected and the downside accepted. Verified **append-only**: `git diff --numstat` reports **0 deleted lines**, so no prior entry was touched. Checked first that no `D-2.02-*` already existed, and that **D-1.02-1 has never been a logged entry** (it lives only in `brand.md`) — so nothing needed a `Superseded by` status change; these entries extend D-1.03-1's reasoning rather than reverse anything.
- **OQ-1 — is `photo.provenance` displayed?** Not rendered in this design (the 2.09 provisional string is internal and those photos ship unpublished), but the OV-1 caveat about third-party screenshots may make visible attribution desirable or necessary. **Needed before 2.09 publishes photos, not before 2.03.**
- **OQ-3 — placeholder-register granularity** — adopt two summary rows (PL-10 season detail sections / PL-11 season lead photo) rather than ~74 per-season entries? The register is a 3.05 cutover blocker.
- **Review the `brand.md` + `globals.css` diff** (the follow-up below) — it changes the token source of truth, so it deserves a read before commit.

### Follow-up shipped the same day (owner-directed): `brand.md` contradictions fixed + tokens added

The two contradictions and two missing tokens above were flagged as *owed*; Lazar directed the fix in-session, so they are **done, not owed**. This took the phase slightly out of pure-design scope (it touches `brand.md` and `globals.css`) — recorded here deliberately rather than left silent.

- ✅ **BC-1 fixed** — `brand.md` §Components "Stats table" now specifies a **2px orange left-edge marker with a navy rank**, not an "orange rank". Recomputed: orange on `#FBF3EA` = **2.80:1** (fails AA).
- ✅ **BC-2 fixed** — §Components "Photo figure + caption" **and** §Photo treatment now specify an **orange rule marker + neutral-500 overline text**, not an "orange overline". Orange on paper = **2.80:1**.
- ✅ **BC-3 fixed** *(found while fixing the other two, same bug class)* — §Components "Season card" said "orange overline (**league**)": orange on white = **3.08:1** (fails AA) **and** it named a field the model has never had (D-2.01-2). Now a **neutral-500 decade overline**.
- ✅ **Rule scope tightened** — D-1.02-1 read "on paper", which is how three specs drifted into orange-on-white/-highlight; it now reads **"any light surface"**. Brand rule 3's **"large-text" exemption was removed** — orange on paper is 2.8:1 and large text needs 3.0:1, so the exemption never held.
- ✅ **MT-1 fixed (D-2.02-16)** — `--color-zebra: #fcfbf7` + `--color-highlight: #fbf3ea` added to `globals.css @theme`; both added to `brand.md` §Color with four measured contrast rows (ink/zebra 16.7 · navy/zebra 13.9 · ink/highlight 15.7 · navy/highlight 13.1 — all AAA as surfaces).
- ✅ **MT-2 fixed (D-2.02-17)** — `--spacing-header: 4.8125rem` (**77px**) added to `@theme` + `brand.md` §Spacing & layout. **Measured on the rendered header, not calculated:** 77px at both 375 and 1280. (My original paper estimate was checked against the live DOM before being written down.)

**Evidence:**
- Contrast ratios computed with a WCAG-formula script, **validated against `brand.md`'s own published numbers** before being trusted — it reproduced orange/paper 2.80, neutral-500/paper 4.94, orange/navy 4.68, matching the existing table exactly.
- Header height read from the live DOM at both breakpoints (`getBoundingClientRect().height` = 77 at 375 and 1280).
- Tokens verified to generate **working utilities** via a temporary probe route: `bg-zebra` → `rgb(252,251,247)`, `bg-highlight` → `rgb(251,243,234)`, `top-header` / `h-header` / `scroll-mt-header` → `77px`. Probe route deleted; `git status` shows `src/app/globals.css` as the only `src/app/` change.
- `npm run lint` clean · `npm run build` clean (7 static pages, no probe route in the output). Build was run with the dev server stopped (a known trap: building while dev is live corrupts `.next`).

**Known limitation:** `--spacing-header` **mirrors** the header's rendered height rather than driving it, so the two can drift if `SiteHeader`'s padding or crest size changes. Both `brand.md` and the `@theme` comment say to keep them in sync. Hardening it (`h-header` on the `<header>` so the token is the source) would mean editing shipped 1.03/1.06b chrome — out of scope here, and noted in handover §12 as an optional 2.03 improvement.

## 3. Decisions I made during this phase

All seventeen are in handover §11 with rationale and the rejected alternative. **Logged in `decisions.md`: yes** — appended 2026-07-16 on Lazar's instruction (D-2.02-1 … D-2.02-17), append-only verified (0 lines deleted). The summary table below is the short form; `decisions.md` carries the full Context / Alternatives / Consequences for each.

| ID | Decision | Why (short) |
|---|---|---|
| D-2.02-1 | Season-card overline = decade label, neutral-500 — not orange, not a league | No league field (divergence 3); orange on white fails AA |
| D-2.02-2 | Season ordering within a decade = `slug.current desc`, not `title` | All slugs start with a 4-digit year; titles aren't uniform across span/single-year/era folders |
| D-2.02-3 | Archive sections use orange rule marker + serif H2, not the homepage's overline-only label | A long archive document needs scannable headings |
| D-2.02-4 | Беласица row = highlight bg + 2px orange **left marker**; rank stays navy | `brand.md`'s "orange rank" fails AA (BC-1) |
| D-2.02-5 | Breadcrumb on paper above the hero | Hero gradient is bottom-anchored; one treatment serves both hero variants |
| D-2.02-6 | „Фотографии" renders all photos **including** the hero photo | Hero shows no caption; excluding it would permanently hide that photo's caption/date |
| D-2.02-7 | Photo grid uses `object-contain` on the mat (additive `fit` prop on `PhotoFrame`); hero/cards stay `object-cover` | The only way `brand.md`'s mixed-quality "wider mat for small scans" rule is actually realised |
| D-2.02-8 | All-five-empty season → one archive notice + 5 chips | Otherwise ~all 74 post-2.09 seasons render a hero floating above the footer |
| D-2.02-9 | Caption date = neutral-500 overline + orange rule marker; caption **below** the frame, unclamped | Orange overline fails AA (BC-2); overlay captions clamp, archive captions must be readable in full |
| D-2.02-10 | Standings mobile = horizontal scroll in the frame, all 9 columns kept, `#`+`Клуб` sticky-left, focusable region | The table is the archival artifact — hiding columns loses data |
| D-2.02-11 | „Состав" = light table in `max-w-measure`, not the navy Stats table | Two navy-headed tables stacked read as a data dump |
| D-2.02-12 | Decade count pluralises: 1 → „сезона", else „сезони" | „1 сезони" is wrong Macedonian |
| D-2.02-13 | Sticky decade jump-nav included (brief said optional) | ~74 seasons over 11 decades |
| D-2.02-14 | Table headers = visible abbreviation + full schema label `sr-only` | „Победи"/„Порази" both abbreviate to „П" |
| D-2.02-15 | Mockups use non-plausible schematic filler (`Клуб А`, `Играч Б`) + a disclaimer strip | No historical fact is VERIFIED in `facts.md`; a mockup must never be mistaken for content or pasted in as seed data |

## 4. Deviations from the brief

- **The brief says "you never touch the repo" but also that mockups must not be left only in chat** (the 1.02 mockups were lost that way — a known issue). I resolved this by **writing docs files to disk without committing**: the handover, the mockups folder, and this report. No code, schema, or content file was touched. Lazar reviews and commits.
- **The brief's own instruction for the photo caption ("orange overline (year/date)") conflicts with its own accessibility requirement** ("orange is marker-only, never text, D-1.02-1"). I followed the accessibility rule and flagged the conflict (BC-2) rather than shipping a 2.8:1 caption.
- **Added `/arhiva#d<decade>` anchors + back-links** (§6.8) — navigation the jump-nav already required; not a new content feature. **Prev/next season nav was deliberately not designed** (not in the brief's section list) and is noted as a suggestion in §15.
- The mockups folder also contains the HTML sources + `mockup.css` + a README with the exact re-render commands. Not requested, but it makes the mockups reproducible rather than dead pixels — directly addressing the known 1.02 issue.

## 5. Changed files / deliverables

Design phase — **no schema, no content, no dependency, no branch, no PR.** Nothing committed. One small **code** change (`globals.css` tokens) + `brand.md`, both owner-directed after the handover was filed (see §2 follow-up).

- `brand.md` — **token source of truth, amended.** Three component specs corrected (Season card / Stats table / Photo figure + caption); D-1.02-1 restated as "any light surface"; brand rule 3's large-text exemption removed; `zebra` + `highlight` added to §Color with four measured contrast rows; sticky header height added to §Spacing & layout; an amendment note added at the top. **No new colour value invented** — zebra/highlight were already published in this file.
- `src/app/globals.css` — `@theme` gains `--color-zebra`, `--color-highlight`, `--spacing-header`. The only code change in the phase.

- `docs/design-handovers/Part-2-Phase-02-Handover.md` — **the deliverable.** Direction + the three divergences; field→UI map for every locked field; shared conventions (grid, section cadence, section heading, links/focus/hover, ordering keys, Macedonian pluralisation); Archive index spec; Season detail spec section by section; consolidated empty-state table; accessibility; motion; data notes for 2.03; the 15 decisions; flagged tokens/contradictions; open questions; mockup index; out-of-scope.
- `docs/design-handovers/Part-2-Phase-02-mockups/` — 6 PNGs (`archive-{desktop,mobile}`, `season-{desktop,mobile}`, `archive-empty-desktop`, `season-empty-desktop`), their 6 HTML sources, `mockup.css`, and `README.md` (what each shows, the schematic-content warning, exact re-render commands + the headless-Chrome mobile gotcha).
- `src/_project-state/completions/Part-2-Phase-02-Completion.md` — this report.

## 6. State updates done

Design phase — `current-state.md` / `file-map.md` / `00_stack-and-config.md` are the orchestrator's to update (no code shipped, no dependency changed). For whoever syncs state:

- [ ] `NEXT:` → `2.03 — Archive & Season templates (Code)`
- [ ] `file-map.md` — add `docs/design-handovers/Part-2-Phase-02-Handover.md` + the `Part-2-Phase-02-mockups/` folder (14 files incl. README)
- [x] **Log D-2.02-1 … D-2.02-17 in `decisions.md`** — done 2026-07-16 (append-only verified)
- [ ] Note in `current-state.md` that **`brand.md` was amended** (three specs corrected, three tokens added) and that `globals.css @theme` now carries `zebra` / `highlight` / `--spacing-header`
- [ ] Consider the known-issue line "Phase 1.02 handover + mockups were delivered in-prompt and are still not in `docs/design-handovers/`" — **still true for 1.02**, but 2.02's mockups are now in-repo with sources, so the failure did not repeat.
- [ ] Placeholder register — see OQ-3 (PL-10 / PL-11 proposal)
- [ ] `00_stack-and-config.md` — no change (no dependency added)

## 7. Risks, surprises, what the next phase needs to know

- **`brand.md` contained *three* instructions that failed its own accessibility rule** (orange rank, orange caption overline, orange season-card overline) — the notable surprise of the phase, and the brief inherited two of them. **All three are now fixed in `brand.md` itself**, along with the root cause: D-1.02-1 was scoped to "on paper", so nothing stopped specs drifting into orange-on-white/-highlight. It now reads "any light surface". If similar drift shows up elsewhere, that scope wording is the thing to check first.
- **The three tokens 2.03 needs now exist** (`bg-zebra`, `bg-highlight`, `top-header` / `scroll-mt-header`), verified resolving in the running app. No hardcoded fallbacks needed.
- **`--spacing-header` mirrors the header rather than driving it** — see the §2 known limitation. If someone changes `SiteHeader`'s padding or crest size, the sticky jump-nav offset silently goes wrong. `h-header` on the `<header>` closes this for good and is a good 2.03 candidate.
- **`PhotoFrame` needs one additive prop** (`fit="cover" | "contain"`, default `cover`). Default-preserving, so no existing caller changes. Without it, `brand.md`'s mixed-quality mat rule cannot be honoured — the current `object-cover` means the mat is only ever visible in the empty state.
- **The archive ships mostly empty and that is the normal state, not a bug.** Per `docs/content-ingestion-plan.md`, 2.09 creates ~74 shells (slug/title/decade) and photos land **unpublished** behind the rights gate; story/table/squad/trainers are hand-curated afterwards. 2.03 should build and test the empty states **first** — they are what production shows on day one.
- **Season photos may all be invisible on the public site for a while.** Ingested photos are drafts and the site reads `perspective: "published"` with no token, so the hero and „Фотографии" will be empty for most seasons regardless of what's in the dataset. That is the gate working, not a query bug.
- **`/legendi/<slug>` links will 404 until 2.05.** Expected and stated in the handover; don't let it look like a defect during 2.03 review.
- **2.05 still waits on the second Ace sit-down** (~1 week) for Legends/About/Contact input. 2.02 did not depend on it.

## 8. What's now possible that wasn't before

The Archive index and Season detail can be built in 2.03 straight from the handover plus `brand.md` with no further design questions — and because the empty states are specified as first-class, the templates will look finished on the day 2.09 lands ~74 title-and-decade-only seasons.
