# Part 3 · Phase 09 · Code — Performance & accessibility — Completion report

**Branch:** `phase-3.09-perf-a11y` · **PR:** [#38](https://github.com/DinovLazar/belasica-v2/pull/38) → `main`
**Preview:** `https://belasica-v2-gu18d1mkl-sunset-services-team.vercel.app`
**Date:** 2026-07-31 · **Full numbers:** `docs/audits/Part-3-Phase-09-baseline.md` and `docs/audits/Part-3-Phase-09-results.md`

---

## 0 · Precondition — one of three failed, and the owner waived it

The brief's precondition 2 was **false** when this phase started, and the owner
was asked before any work began and chose to proceed. Recorded here as required.

| # | Precondition | Status |
|---|---|---|
| 1 | `phase-3.06a` merged into `main`, both commits pushed | ✅ merge `b828967`; `main` == `origin/main` at `2c94141` |
| 2 | 3.06a's housekeeping done | ❌ **failed** |
| 3 | `git pull` clean, `npm install` matches lockfile | ✅ "Already up to date", no drift |

**What is still missing from 3.06a** — untouched by this phase and still owed:

- **No completion report.** `completions/` holds nothing for 3.06a; the last is 3.05b.
- **No decisions logged.** `decisions.md` went straight from `D-3.05b-7` to this phase's `D-3.09-1`. The crest re-crop, the season-page reorder and `SeasonRecordBoard` were all judgement calls with no entry.
- **`current-state.md` was stale.** Its first line still read `NEXT: 3.06` and its snapshot described 3.05b as the latest phase. **This phase has now rewritten that file**, which means 3.06a's changes are described there for the first time — but reconstructed from its diff by me, not written by whoever executed it.
- **`file-map.md` was only partly synced** — `src/components/legends/LegendsBrowser.tsx` (164 lines) was absent.

---

## 1 · What shipped

**Nothing was changed on a hunch.** Every fix below is traced to a Lighthouse
trace or an in-browser measurement, and **two changes that raised the score were
built, measured and then reverted** because of what they cost elsewhere.

### Performance

1. **`Reveal` gained `immediate`** — the largest single finding, and invisible without the trace. On `/arhiva` and `/legendi` the LCP element is the first card's photograph, and that card sat inside a `Reveal` wrapper at `opacity: 0` until hydration → IntersectionObserver → state → a 260 ms transition had all completed. An element at `opacity: 0` cannot be the LCP, so the paint simply waited. Measured `elementRenderDelay`: **370 ms** on `/arhiva`, **331 ms** on `/legendi`, against **14 ms** on the homepage, whose hero was never wrapped. (D-3.09-3)
2. **Exactly one priority image per template, read from the trace.** `/arhiva`'s real LCP carried no priority hint at all; the crest carried one on *every* route while never being the LCP anywhere. (D-3.09-2)
3. **The crest left `next/image`.** It is `unoptimized` (D-3.05b-7), so `next/image` contributed only a `<link rel=preload>` for a 33 KB file on every route's critical path. (D-3.09-2)
4. **AVIF ahead of WebP** in `next.config.ts` — a **format** change; `quality` is untouched on every photograph. (D-3.09-4)
5. **`@sanity/image-url` no longer reaches any client bundle.** `LegendsBrowser` is a client component and pulled the builder across the boundary through `LegendCard → PhotoFrame → urlFor` — 17,266 bytes of it. `PhotoFrameView` splits markup from the Sanity dependency. (D-3.09-1)

### Accessibility — two real failures that Lighthouse's 100 did not see

Accessibility scored **100 on all nine routes before any change**. It found neither of these:

6. **SC 1.4.10 Reflow — `/statistika` scrolled the page 279 px sideways at 375 px.** The tables' `sr-only` labels are `position: absolute` inside a `static` overflow container, so they took the *initial* containing block, escaped the clip and stretched the document. One span („Бодови") sat at x = 654. Fixed with `relative` on all four scroll regions. (D-3.09-6)
7. **SC 1.4.3 — the breadcrumb separator measured 3.48:1** on navy. Now 6.14:1. (D-3.09-7)
8. **The skip link** — the first thing a keyboard user reaches — was the only control still falling back to Chrome's default `outline: 1px auto`. (D-3.09-5)
9. **`StandingsTable`'s `focus-visible:outline-none` + `ring-*` (box-shadow)** — the last instance of the shape D-3.05-4 removed everywhere else — replaced with the unlayered outline. (D-3.09-6)

### Tooling

10. **`lighthouse@13.4.1`** pinned in `devDependencies` (the version 3.04d used, so the numbers are comparable).
11. **`npm run lint` was broken on `main`** — ignore globs were root-only, so a git worktree under `.claude/worktrees/` carrying its own `.next` was parsed in full and ESLint died with a V8 out-of-memory before reaching a source file. Reproduced on a clean stash, so pre-existing. Now `**/`-anchored.

---

## 2 · Results

**Desktop: 100 on all nine routes** (baseline 97–100).
**Mobile: eight of nine at ≥95** (baseline: four of nine).
**Accessibility 100 · CLS 0.000 · TBT ≤10 ms** on every route, both form factors.

| Route | Mobile before → after | Desktop before → after |
|---|---|---|
| `/` | 94 → **95** | 100 → **100** |
| `/arhiva` | 86 → 94 **(+8)** | 97 → **100** |
| `/arhiva/1982-83` | 94 → **95** | 100 → **100** |
| `/arhiva/1931-32` | 98 → **98** | 100 → **100** |
| `/statistika` | 97 → **99** | 100 → **100** |
| `/legendi` | 89 → **95** **(+6)** | 99 → **100** |
| `/legendi/petar-andreev` | 97 → **99** | 100 → **100** |
| `/za-nas` | 95 → **97** | 100 → **100** |
| `/kontakt` | 98 → **98** | 100 → **100** |

### The one route still at 94 on mobile — an owner decision

`/arhiva` is **one point** short and reached 95 in one of three runs. **LCP is
the only failing audit**, all three LCP discovery checks pass, and the *observed*
work sums to ~100 ms — the image side is finished.

`/` was in this list until the phase's last change: the **hero** crest kept a
React-hoisted preload after the header crest had lost one, which the deployed
preview exposed. `loading="lazy"` there took the route to **95** (92/95/95).
`/arhiva` has no equivalent element left to remove.

The remaining lever is the **92 KB of preloaded fonts** on a 204 KB critical
path. It was built and measured:

| Config | `/arhiva` | `/` | Homepage FCP, 3 runs |
|---|---:|---:|---|
| Both preloaded (**shipped**) | 93 | 94 | 809 / 760 / 759 ms — stable |
| Golos unpreloaded | 95 | 94 | 805 / 1213 / 1214 ms — bimodal |
| Neither preloaded | **98** | **95** | 760 / **1518** / **1512** ms — bimodal |

**Reverted** — and it is now the only thing between `/arhiva` and the gate. It
doubles and destabilises the homepage's first paint, the same trade D-3.04d-5
refuses for photographs, applied to type. Dropping the `latin` subset (58 KB of
the 92) was also rejected: **digits live in the Latin range**, and this archive
is full of them. **Escalated to Lazar below.** (D-3.09-8)

---

## 3 · ⚠️ Vercel preview did not confirm the local numbers

The DoD asks for the three lowest templates within **3 points** of local. **Two
are not**, and I am flagging it rather than smoothing it.

| Route | Local | Preview | Δ | Within ±3? |
|---|---:|---:|---:|---|
| `/` | 94 | 91 | 3 | ✅ |
| `/arhiva` | 94 | 87 | **7** | ❌ |
| `/legendi` | 95 | 88 | **7** | ❌ |

**The fixes did land — the bottleneck moved.** `main` at `2c94141` (the exact
pre-fix commit) is deployed to production, giving a like-for-like control on the
same network, same machine, same day:

| Route | | `resourceLoadDelay` | `fetchpriority=high` | `elementRenderDelay` |
|---|---|---:|---|---:|
| `/arhiva` | pre-fix (prod) | 1243 ms | **false** | 1025 ms |
| `/arhiva` | post-fix (preview) | **15 ms** | **true** | 2012 ms |
| `/legendi` | pre-fix (prod) | 1254 ms | **false** | 883 ms |
| `/legendi` | post-fix (preview) | **226 ms** | **true** | 1979 ms |

Image delivery improved exactly as designed on real infrastructure. The score did
not move because `elementRenderDelay` (~2000 ms) now dominates and is not
image-related — the tell is the **homepage**, never reveal-wrapped, showing the
same ~1800–2000 ms both before and after.

**Two hypotheses tested and eliminated:** *cold Vercel image cache* (warmed every
image to `x-vercel-cache: HIT`, re-measured, no change) and *a regression from
this phase* (the pre-fix control scores 87 / 90 on Vercel with the old code, so
the offset predates these changes).

**What is not known:** whether that render delay is real user experience or an
artifact of this machine's path. TTFB to Vercel measured **170–190 ms** against
3–67 ms on loopback, this operator's connection is a VPN tunnel over a phone
hotspot, and `/arhiva` ranged 85–94 across seven runs. **On the owed register as
a blocking item for 3.11.**

---

## 4 · Manual WCAG 2.2 AA pass

Measured at **1280**, **375** and **320** CSS px (320 = 400 % zoom at 1280) on
the production build. Full evidence in `Part-3-Phase-09-results.md` §5.

| Check | Result |
|---|---|
| Contrast failures (alpha-composited) | **0** on all nine |
| Interactive targets < 24×24 | **0** (only the skip link's unfocused `sr-only` state; **203×37** when focused, measured on a real Tab) |
| Focus obscured by the sticky header (2.4.11) | **0**, by `elementFromPoint` hit test, not by rectangle |
| One `<h1>` / no heading skips / no missing `alt` / no unlabelled control | **0 defects**, all nine |
| Page horizontal scroll at 375 and at 320 px | **0 px** |
| WCAG text-spacing overrides | no horizontal scroll, no content clipped |
| Focus ring | `3px solid rgb(238,122,22)`, offset 2px, `:focus-visible` matching |
| `prefers-reduced-motion` | reveal forced visible + all durations 0.01 ms, verified in compiled CSS |
| JavaScript disabled | SSR ships `<html lang="mk">` with **no `.js` class**; the only hiding rule is `.js [data-reveal]`, so all content is visible |
| Lightbox — all 8 behaviours | re-verified after every change, incl. wrap 11→1 / 1→11, scroll offset **5049 identical** before and after, and a one-photo season rendering **`arrowsRendered: 0`** |
| `StatTable` | headers are buttons, `aria-sort` cycles and resets siblings, region focusable + keyboard-scrollable (520 vs 333 px, scrolled 187) while the page stays at 0 |
| `PhotoLightbox` on `/legendi/<slug>` | trigger count **0** (D-3.05b-3 holds) |
| First Load JS | `/legendi` **126 → 124 kB**; page chunk **6.74 → 3.79 kB**; **0** Sanity fingerprints in every per-page chunk |
| woff2 preloads | **4 per template**, all four rendered (Cyrillic text + Latin-range digits) |

**WCAG 2.2's own six:** 2.4.11 **Pass** · 2.5.7 **N/A** (no author-implemented
dragging; the only match is `resize-y`, a user-agent control the SC exempts) ·
2.5.8 **Pass** · 3.2.6 **Pass** (the one help mechanism, „Контакт", sits in the
identical nav on every page) · 3.3.7 **N/A** (one single-step form) · 3.3.8
**N/A** (no authentication on the public archive).

**One item verified by spec rather than by API.** The in-app browser reports a
`banner` landmark for every `<header>`; per HTML-AAM, 12 of the 13 are scoped to
`main`/`section` and are `generic`, leaving one. Chrome's `computedRole` and
`getComputedAccessibleNode()` are both unavailable in this browser, so this is
**spec + axe verified, not computed-role verified**. VoiceOver spot-check owed.

---

## 5 · Decisions logged

`D-3.09-1` … `D-3.09-8`, all in `decisions.md` in full:

| ID | Decision |
|---|---|
| D-3.09-1 | `PhotoFrame` splits into `PhotoFrame` (server, Sanity-aware) + `PhotoFrameView` (markup, no Sanity) |
| D-3.09-2 | Exactly one priority image per template, chosen from the trace — and the crest is not it |
| D-3.09-3 | `Reveal` gains `immediate`, because the reveal was hiding the LCP element |
| D-3.09-4 | AVIF ahead of WebP — a format change, explicitly not a quality change |
| D-3.09-5 | The skip link takes the project focus ring |
| D-3.09-6 | Scroll regions must be `position: relative`, or their `sr-only` labels break page reflow |
| D-3.09-7 | Breadcrumb separator `paper/40 → paper/60` (a measured AA failure) |
| D-3.09-8 | Font preloading is **kept**, and two mobile routes stay at 94 as a result |

---

## 6 · Verification run

`npm run build` ✅ **270 pages** · `npm run lint` ✅ (fixed this phase) ·
`npx tsc --noEmit` ✅ · 108 Lighthouse runs local (54 baseline + 54 final) plus
34 against Vercel · in-browser probes across 9 routes × 3 widths.

**Scope discipline:** no schema change, no Sanity write, no content edit, no
`provenance` edit. **No `brand.md` token changed** — the one measured AA failure
was fixed with an existing opacity step. No production dependency added. No
photograph's `quality` reduced. No layout restructuring on `/statistika`,
`/legendi` or `/za-nas` — the fixes there were `position: relative`, a colour
step, and an image priority flag.

---

## 7 · Owed to Lazar

### Blocking before launch

1. **Re-measure `/`, `/arhiva`, `/legendi` on the preview from a clean, wired connection.** §3 — two routes are 7 points below their local numbers and the cause is unresolved. This gates 3.11.
2. **Owner decision on the font tradeoff.** `/arhiva` stays at 94 on mobile. Taking it to 98 costs a homepage first paint that doubles and becomes unpredictable (760 → ~1515 ms in two runs of three). I judged the stable first paint worth more and shipped that; say if you disagree and I will flip it in one line.

### 5-item eyeball checklist — preview, desktop **and** phone

1. **Header crest** — it now loads lazily instead of preloaded. Watch the top-left on a cold load of `/arhiva`: it should appear with the rest of the header, not visibly pop in late.
2. **First card of `/arhiva` and `/legendi`** — the first card no longer fades in; cards 2 and 3 still do. Confirm that reads as deliberate rather than as a stutter.
3. **Breadcrumb „/" separators** — slightly brighter on the navy blocks (3.48:1 → 6.14:1). They should still sit *behind* the crumb labels in emphasis, not compete.
4. **`/statistika` on a phone** — swipe the three tables sideways. Each should scroll *inside its frame* while the page itself does not move at all.
5. **Any archive photograph, full screen** — they are AVIF now. Look for banding in skies or on jersey blocks; `quality` was not reduced, so this is purely a format check.

### Spec item for 3.06 to absorb

None. Every accessibility and performance fix needed on `/statistika`,
`/legendi` and `/za-nas` was achievable without layout restructuring
(`position: relative`, a contrast token step, an image priority flag), so
nothing was deferred into 3.06 from this phase.

### Also owed

- **VoiceOver spot-check of landmark roles** on `/arhiva` — §4, verified by spec and axe rather than by a computed-role API.
- **3.06a's housekeeping** — §0. Its completion report and `D-3.06a-*` decisions were never written and are not written here.
