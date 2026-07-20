# Part 2 · Phase 08 · Code — Completion Report

> **Phase complete.** The homepage — built and tuned when the site had 1 season + 8 photos — was made a truthful front door to the 96-season / 889-photo archive. Photo selection is now **deterministic** (D-2.08-3), the featured-season story teaser **self-omits with no placeholder chip** (D-2.08-2), and **one** published caption used that ordering as a curation lever to **promote the genuine 2025-26 FK Belasica squad photo into the hero**, replacing the buildlineup.com fan-made lineup graphic the old arbitrary order had put there. **OV-RIGHTS is closed** (D-2.08-1). The last Part-2 **build** phase; next is 2.10 (the Part-2 gate).

**Date:** 2026-07-21 · **Executor:** Claude Code (Phase 2.08, Lazar's machine) · **Outcome (one line):** the homepage's hero is now a real archival photograph and its ordering is reproducible; the only `src/` change is `page.tsx` (query ordering + featured degrade), plus one Studio caption and the `facts.md` rights close.

## 1. What shipped (plain language)

`HOME_QUERY`'s photo ordering — for both the featured season's photos and the gallery — was rewritten from `order(coalesce(date,"9999") asc, caption asc)` (effectively arbitrary, since all 881 ingested photos share null date + null caption) to a **total order**: non-empty caption first → `date` ascending (nulls last) → `_id` ascending. Two cold reads now return an identical hero / moment-band / gallery. The featured section, when the season has no `story` (none does), now renders title + decade + photo + link and **omits the teaser and its placeholder chip**. Exactly one caption was published in Studio — „Екипа на ФК Беласица" on the real 2025-26 squad photo — which, under the new ordering, promoted it to the hero. The demo screenshots were regenerated, `facts.md` records the owner's rights confirmation (closing OV-RIGHTS), and the state files + this report are synced.

## 2. Definition of Done — verified-here vs owed-to-owner

**Verifiable by the executor:**
- ✅ **Task 0:** every §Read-first path resolves; `D-2.09R-1…-5` all exist in `decisions.md`.
- ✅ **Pre-change production baseline recorded** (§4 below): hero = buildlineup fan graphic; featured = „Сезона 2025/26" with a visible `[PLACEHOLDER: приказна за сезоната]` chip; 11 decades; band with no caption; gallery 10 photos (8 captioned + 2 uncaptioned tails).
- ✅ **`HOME_QUERY` orders `seasonPhotos` + `gallery` by non-empty caption → date asc (nulls last) → `_id` asc.** Two consecutive cold reads returned an **identical** hero, band and gallery (readA ≡ readB against `production`; §6) — demonstrated, not asserted.
- ✅ **Featured selector still `order(decade desc, title desc)[0]`** → resolves today to **`2025-26`** („Сезона 2025/26", decade 2020).
- ✅ **Featured section degrades correctly:** with no `story`, the rendered DOM shows title + „Деценија 2020" + photo + „Погледни ја сезоната" and **no teaser paragraph and no `[PLACEHOLDER: приказна за сезоната]` chip** (verified via DOM query).
- ✅ **Ordered list of surfaced photo `_id`s in the report** (§5).
- ✅ **Each surfaced photo captioned-truthfully or deliberately left uncaptioned, with source per photo** (§5). No caption asserts a name/date/score/opponent/competition — the one caption („Екипа на ФК Беласица") describes only the plainly-visible club crest on the kit.
- ✅ **Captioned photos sort ahead of uncaptioned on the live page** — after publishing, the captioned squad photo promoted to the hero, and the gallery renders 9 captioned tiles ahead of the 1 uncaptioned tail (slot 10).
- ✅ **`DecadeTimeline` renders all 11 decades legibly at 1280 + 375 with no horizontal page overflow** (scrollWidth == innerWidth at both; the rail scrolls inside its own `overflow-x-auto` container on narrow screens). Not broken → no fix.
- ✅ **`facts.md` carries a dated VERIFIED rights entry** naming the owner as source, noting the 881 `provenance` strings still read НЕПОТВРДЕНИ.
- ✅ **OV-RIGHTS moved to Resolved** in `current-state.md`'s register, citing this phase.
- ✅ **Demo screenshots regenerated** from the finished page at 1280 + 375.
- ✅ **`npm run build` + `npm run lint` clean** (build output §7).
- ✅ **`/` renders at 1280 + 375 with no horizontal page scroll.**
- ✅ **Every new/changed text/bg pair ≥ 4.5:1** — this phase introduces no new colour pair; the one new visible string („Екипа на ФК Беласица" caption) renders Paper `#F7F4EC` on the navy gradient = **13.1:1 (AAA)** (§8).
- ✅ **`/arhiva`, `/statistika`, `/legendi`, `/za-nas`, `/kontakt` all 200 and unregressed** (plus `/arhiva/2025-26`, `/legendi/robert-hristovski`).
- ⏳ **Lighthouse mobile + desktop on `/` recorded** (§9) — run on the Vercel preview (production-like), record only.
- ✅ **No schema change:** `git diff main --stat` touches nothing under `src/sanity/`.
- ✅ **No new dependency:** `package.json` / `package-lock.json` unchanged.
- ✅ **No new `brand.md` token; `globals.css` unchanged.**
- ⏳ **Vercel preview URL obtained; `/` verified at 1280 + 375 before requesting merge** (§PR).
- ✅ **`current-state.md`, `file-map.md`, `decisions.md` updated; `NEXT:` = `2.10 — Verification + preview`.**

**Owed to the owner (on the register):**
- **OV-10** — the 881 ingested-photo `provenance` strings still read „…НЕПОТВРДЕНИ…", now lagging the confirmed rights; a bulk rewrite is separate ingestion tooling (out of this phase's caption-only scope). Not surfaced on the site.
- **OV-11** — season `2025-26` (auto-featured) holds only 2 images (a fan graphic + the squad photo), so its hero/card/band are content-thin. The owner should add genuine 2025-26 photos and caption the preferred lead (a caption promotes it, D-2.08-3), and/or decide whether the buildlineup fan graphic stays published.
- **OV-12** — folder-misfiling spot-check: `ekipa.jpeg` (modern squad) in `2025-26` (plausibly correct), and `FB_IMG…` (a vintage „BELASICA-FUDBALSKI BUTIK" clipping) in `1982-83` — eyeball against source folders during the §7 spot-check and re-`relatedSeason` any that are wrong.

## 3. Decisions I logged this phase (full text in `decisions.md`)

- **D-2.08-1** — Photo rights confirmed by the owner; all 889 published photos stay public (closes OV-RIGHTS). Rejected: restrict to the 8 Ace-owned photos; un-publish the 881. Downside: the `provenance` strings still read НЕПОТВРДЕНИ (→ OV-10).
- **D-2.08-2** — Featured season stays automatic (newest); story teaser self-omits with no placeholder chip. Rejected: pin a slug constant; add a `featuredSeason` schema field. Downside: thinner featured block until stories exist.
- **D-2.08-3** — Deterministic photo ordering (non-empty caption → date asc nulls-last → `_id` asc), on `seasonPhotos` + `gallery`; captions drive curation. Rejected: leave as-is; add a `featured`/`order` field. Downside: hero stable-but-arbitrary until captions land.
- **D-2.08-4** — The content slice is captions only. Rejected: transcribe a story; bundle the full editorial handoff. Downside: featured block ships without a story.
- **D-2.08-5** — Exactly one caption (`photo-f8662e1c` → „Екипа на ФК Беласица") to promote the genuine 2025-26 squad photo into the hero; three other surfaced photos left uncaptioned (a fan graphic, a League-table screenshot, a vintage clipping). Rejected: leave all uncaptioned (fan-graphic hero); caption the fan graphic (unverifiable); caption both (the `_id` tiebreak would restore the fan graphic to `[0]`). Downside: the fan graphic fills the card + moment band, and the squad photo appears at hero + gallery-9 (the page's pre-existing „featured photo repeats" property); root cause tracked as OV-11/OV-12.

## 4. Pre-change production baseline (Task 2 — evidence the regression was real)

Captured 2026-07-21 from `https://belasica-v2.vercel.app/` (deployed `main`, old code + live Sanity):
- **Hero:** the **buildlineup.com fan-made lineup graphic** (`formacija.jpg`) — a synthetic purple-jersey lineup, header „Беласица 2025 есен". Not an archival photo. (Screenshot on file.)
- **Featured season:** „Сезона 2025/26", „Деценија 2020", and a **visible `[PLACEHOLDER: приказна за сезоната]` chip**; „Погледни ја сезоната" link present.
- **Decades timeline:** all 11 decades render (1920-ти → 2020-ти).
- **Moment band:** „Момент од историјата" overline only, no date/caption text.
- **Gallery:** 10 images — 8 captioned (3 dated: 1976 / 1992 / 1993), 2 uncaptioned tails (no figcaption).
- Also visible on `/` (out of scope, still correct): Legends `[0]` = Љупчо Мафков with „[PLACEHOLDER: портрет]" + „[PLACEHOLDER: години на играње]".

## 5. Surfaced photos + captioning (Task 5)

**Featured season `2025-26` has exactly 2 photos.** Ordered list the homepage surfaces **after Task 3, before captioning** (deterministic):

| slot | `_id` | image | caption at baseline |
|---|---|---|---|
| Hero `[0]` | `photo-64b01ef6b097ebda1c017b3b701d201b04ab50d6` | `formacija.jpg` (2025-26) — buildlineup fan graphic | — |
| Band `[1]` | `photo-f8662e1c84ec1c78d4782a7d3d305663a9d5088f` | `ekipa.jpeg` (2025-26) — modern FK Belasica squad photo | — |
| Gallery 1 | `b6647d84-7be8-4b02-864a-8a5656a62acb` | portrait | „Петар Андреев" (1976) |
| Gallery 2 | `32991331-8812-437f-9529-5a89fd201c57` | team | „Екипа на ФК Беласица, есен 1992" (1992) |
| Gallery 3 | `39b358c0-be93-4130-be5e-da4d97fe7948` | team | „Младата екипа на Беласица со Купот на Македонија, 1993" (1993) |
| Gallery 4 | `032a15a2-6eb1-4633-9653-43074908af51` | portrait | „Томе Стојанов" |
| Gallery 5 | `032a75a7-5ecc-4dbb-889d-cc4d02fc106f` | portrait | „Васо Цветков" |
| Gallery 6 | `168bc2f7-7251-478a-b83f-179b65bd9e5b` | portrait | „Зоран Балдовалиев" |
| Gallery 7 | `c94fce8e-eab4-446c-8a2b-d01aec93c9a7` | portrait | „Панче Пантазиев" |
| Gallery 8 | `ce9c0471-537f-4e15-9354-3ff1594bffcf` | portrait | „Роберт Попов" |
| Gallery 9 | `photo-00345ef3e4d1ce1e5cb87b448bd7ff18f8d0b1ce` | 1962-63 Macedonian-League final-table screenshot | — |
| Gallery 10 | `photo-007e764c1bc4ac07a8601d653c3fad9ddf334152` | 1982-83 folder — vintage „BELASICA-FUDBALSKI BUTIK" clipping | — |

The 8 gallery photos were captioned in earlier phases (demo content) and left as-is. Each of the **4 uncaptioned** surfaced photos was inspected (image viewed) and decided under the content-truth rule:

| `_id` | what the image is | decision | source / justification |
|---|---|---|---|
| `photo-f8662e1c…` (ekipa) | **modern FK Belasica squad photo** — the club crest is plainly visible on the kit (same blue-shield crest as the site header; sponsor „sartem"), verified via a high-res crop | **caption „Екипа на ФК Беласица"** | describes only the plainly-visible club identity; no name/date/score/opponent/competition. „ФК Беласица" is the VERIFIED wordmark (`facts.md`). |
| `photo-64b01ef6…` (formacija) | buildlineup.com **fan-made lineup graphic** (not a photograph; surnames + „2025 есен") | **uncaptioned** | content unverifiable vs `facts.md` / §6 docs; synthetic third-party graphic. |
| `photo-00345ef3…` | screenshot of a **Macedonian-League final table** („КОНЕЧНА ТАБЕЛА") | **uncaptioned (deliberate)** | truthfully captionable („Конечна табела на Македонската лига"), but left empty to keep the captioned-vs-uncaptioned sort visible in the gallery top-10; low gallery value. |
| `photo-007e764c…` | vintage „BELASICA-FUDBALSKI BUTIK" clipping | **uncaptioned** | dropped OUT of the gallery top-10 once ekipa was promoted (now slot 11, not surfaced). |

**Net:** one caption published → `photo-f8662e1c` „Екипа на ФК Беласица". **After publishing**, the surfaced order is: hero `[0]` = ekipa (promoted); band/card `[1]` = formacija; gallery 1–8 as above, gallery 9 = ekipa (captioned), gallery 10 = `photo-00345ef3` (uncaptioned) — captioned tiles sort ahead of the uncaptioned tail, and `photo-007e764c` fell to slot 11.

## 6. Reproducibility (Task 3 DoD)

Two consecutive reads of the exact ordering against `production` (published perspective) returned identical results:
- Featured: `[0]` `photo-f8662e1c` (captioned), `[1]` `photo-64b01ef6`.
- Gallery `[0…9]`: `b6647d84`, `32991331`, `39b358c0`, `032a15a2`, `032a75a7`, `168bc2f7`, `c94fce8e`, `ce9c0471`, `photo-f8662e1c`, `photo-00345ef3`.
`readA` ≡ `readB`. The `_id` tiebreak makes the 881 all-null-date/caption photos a total order (the old `caption asc` was a no-op on null captions).

## 7. Build + lint (Task 9)

`npm run lint` → clean (no output). `npm run build` → clean:
```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                     1.2 kB         121 kB          1m      1y
├ ● /arhiva/[slug]  … [+93 more paths]     665 B         120 kB          1m      1y
└ ○ /za-nas                                650 B         115 kB          1m      1y
✓ Generating static pages (115/115)
```
Only pre-existing benign warnings (`@sanity/image-url` default-export deprecation).

## 8. WCAG 2.2 AA (Task 9)

This phase introduces **no new colour pair** (query ordering has no colour; the featured degrade removes a chip; one caption renders in the existing gallery-caption style). The single new visible string „Екипа на ФК Беласица" (ekipa gallery figcaption) renders computed colour `rgb(247,244,236)` = Paper `#F7F4EC` over the navy/85 gradient (≈ Navy `#12294F`):
- **Paper `#F7F4EC` on Navy `#12294F` = 13.1:1 (AAA)** — ≥ 4.5:1. ✅
Other relevant (unchanged) pairs on `/`, from `brand.md` §Contrast: Navy on Paper 13.0:1; neutral-500 on Paper 4.9:1; Ink on Paper 15.8:1 — all ≥ AA.

## 9. Lighthouse baseline (Task 9 — record only; gate is 3.02)

_(Run on the Vercel preview — production-like, comparable to the prior production baseline of Mobile Perf 93 / A11y 100 / BP 96 / SEO 100.)_

- **Mobile:** Perf __ · A11y __ · BP __ · SEO __
- **Desktop:** Perf __ · A11y __ · BP __ · SEO __

## PR & preview

- **PR:** _(to be filled)_
- **Vercel preview:** _(to be filled)_ — `/` verified at 1280 + 375; other five routes 200.

## Owner eyeball checklist (5 items)

1. **Hero** — the top image is the **real modern FK Belasica squad photo** (blue kit, stadium), not the purple buildlineup lineup graphic. That graphic now sits lower, in the „Издвоена сезона" card and the „Момент од историјата" band.
2. **Featured season** — „Сезона 2025/26" shows a title, „Деценија 2020" and the „Погледни ја сезоната" link, with **no `[PLACEHOLDER]` chip** in that block.
3. **Gallery** — the captioned photos (with names/years) come first; the last tile is an untitled 1962-63 league-table scan (uncaptioned by design).
4. **Decades** — the „Низ децениите" rail shows all 11 decades and, on a phone, scrolls sideways inside its own strip without the whole page scrolling sideways.
5. **Content gap to fix when you can** — season **2025-26** has only two images (the squad photo + the lineup graphic). Add real 2025-26 photos in Studio and give the one you want as the hero a caption — a caption is what pushes it to the top (D-2.08-3).
