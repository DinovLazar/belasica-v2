# Part 3 · Phase 09 — Performance & accessibility **results**

Post-fix numbers, measured with the **identical method** documented in
`Part-3-Phase-09-baseline.md` (Lighthouse CLI 13.4.1, local production build,
`--throttling-method=simulate`, three runs, median run by Performance score).
Re-run that method at **3.11** to verify the launch.

---

## 1 · Performance, before → after

Bold = meets the ≥95 gate.

| Template | Route | Form | Perf before → after | LCP before → after | CLS | A11y |
|---|---|---|---|---|---:|---:|
| Home | `/` | mobile | 94 → 94 = | 3108 → 3023 ms | 0.000 | 100 |
| Home | `/` | desktop | 100 → **100** = | 699 → 651 ms | 0.000 | 100 |
| Season index | `/arhiva` | mobile | 86 → 94 **+8** | 4260 → 3156 ms | 0.000 | 100 |
| Season index | `/arhiva` | desktop | 97 → **100** **+3** | 1241 → 692 ms | 0.000 | 100 |
| Season detail (rich) | `/arhiva/1982-83` | mobile | 94 → **95** **+1** | 3074 → 3009 ms | 0.000 | 100 |
| Season detail (rich) | `/arhiva/1982-83` | desktop | 100 → **100** = | 666 → 625 ms | 0.000 | 100 |
| Season detail (thin) | `/arhiva/1931-32` | mobile | 98 → **98** = | 2420 → 2480 ms | 0.000 | 100 |
| Season detail (thin) | `/arhiva/1931-32` | desktop | 100 → **100** = | 584 → 627 ms | 0.000 | 100 |
| Statistics | `/statistika` | mobile | 97 → **99** **+2** | 2571 → 2260 ms | 0.000 | 100 |
| Statistics | `/statistika` | desktop | 100 → **100** = | 680 → 662 ms | 0.000 | 100 |
| Person index | `/legendi` | mobile | 89 → **95** **+6** | 3849 → 2919 ms | 0.000 | 100 |
| Person index | `/legendi` | desktop | 99 → **100** **+1** | 1023 → 647 ms | 0.000 | 100 |
| Person detail | `/legendi/petar-andreev` | mobile | 97 → **99** **+2** | 2568 → 2260 ms | 0.000 | 100 |
| Person detail | `/legendi/petar-andreev` | desktop | 100 → **100** = | 607 → 550 ms | 0.000 | 100 |
| About | `/za-nas` | mobile | 95 → **97** **+2** | 2881 → 2667 ms | 0.000 | 100 |
| About | `/za-nas` | desktop | 100 → **100** = | 680 → 640 ms | 0.000 | 100 |
| Contact | `/kontakt` | mobile | 98 → **98** = | 2415 → 2474 ms | 0.000 | 100 |
| Contact | `/kontakt` | desktop | 100 → **100** = | 587 → 563 ms | 0.000 | 100 |

**Desktop: 100 on all nine routes.** (Baseline 97–100.)
**Mobile: seven of nine at ≥95.** Two sit at 94 — see §2.
**Accessibility 100, CLS 0.000, TBT ≤10 ms** on every route, both form factors.

### What moved each row

| Row | What moved it |
|---|---|
| `/arhiva` mobile **+8** | The LCP card left the `Reveal` wrapper (`elementRenderDelay` 370 → 41 ms) and gained the priority hint it never had. Also the least noisy row now: baseline ran 95/86/84, final runs 95/93/94. |
| `/legendi` mobile **+6** | Same reveal fix (`elementRenderDelay` 331 → 46 ms) + priority on the first portrait + AVIF. |
| `/arhiva` desktop **+3** | LCP 1241 → 692 ms, same causes. |
| `/statistika`, `/legendi/…`, `/za-nas` mobile **+2** | AVIF only; these were never reveal-blocked. |
| `/arhiva/1982-83` mobile **+1** | AVIF. Its hero was never inside a `Reveal`. |
| `/` mobile **=** | AVIF trimmed LCP 3108 → 3023 ms, not enough to cross. See §2. |
| `/arhiva/1931-32`, `/kontakt` **=** | Already passing; changes were neutral (LCP moved ±60 ms, inside run-to-run noise). |

---

## 2 · The two routes still under 95 on mobile

Both are **one point** short, and both reached 95 in one of their three runs
(`/` ran 95/94/94; `/arhiva` ran 95/93/94).

| Route | Perf | Blocking metric | Measured |
|---|---:|---|---|
| `/` | 94 | `largest-contentful-paint` | **3023 ms** |
| `/arhiva` | 94 | `largest-contentful-paint` | **3156 ms** |

On both, LCP is the **only** Performance audit scoring below 1.0, and no audit
reports an `overallSavingsMs` above 50 ms. Every LCP discovery check passes:

```
priorityHinted:       fetchpriority=high applied   ✔
requestDiscoverable:  discoverable in initial doc  ✔
eagerlyLoaded:        not loading=lazy             ✔
```

…and the *observed* breakdown sums to ~100 ms
(`timeToFirstByte` 9 + `resourceLoadDelay` 34 + `resourceLoadDuration` 16 +
`elementRenderDelay` 41). The image work is done; the residual is Lantern's
simulation of a Slow-4G link carrying the page's legitimately-needed critical
bytes — the same estimator gap 3.04d recorded.

### The specific fix that would close it, and why it was not applied

`/arhiva`'s simulated critical path carries **204 KB** at High priority, of which
the LCP image is only 37 KB:

| Resource | Size |
|---|---:|
| Document | 25 KB |
| **Fonts (4 × woff2)** | **92 KB** |
| Crest (before the fix) | 33 KB |
| LCP image | 37 KB |
| CSS | 10 KB |

The fonts are the largest block. Setting `preload: false` on both `next/font`
families was **built and measured**:

| Config | `/arhiva` | `/` | Homepage FCP across 3 runs |
|---|---:|---:|---|
| Both preloaded (**shipped**) | 93 | 94 | 809 / 760 / 759 ms — stable |
| Oswald only | 95 | 94 | 805 / 1213 / 1214 ms — bimodal |
| Neither preloaded | **98** | **95** | 760 / **1518** / **1512** ms — bimodal |

**Reverted.** Dropping the preload doubles and destabilises the homepage's first
paint: FCP becomes a race between the fallback and the real face, landing at
~1515 ms in two runs of three against a stable ~760 ms with preload. That trades
the visitor's first paint for a simulator number, which is exactly the trade
**D-3.04d-5** refuses for photographs, applied to type. Logged as **D-3.09-8**.

A note on why the fonts cannot simply be shrunk: two of the four preloaded files
are the **Latin** subsets (Oswald 21 KB + Golos 37 KB = 58 KB) on an all-Cyrillic
site — but **digits live in the Latin range** (`u+00??`), and this archive is
full of them (season titles, stat tables, counts). Dropping `latin` would put
every number on the site into a fallback face. Not done.

**No photograph's `quality` was reduced anywhere in this phase.**

---

## 3 · JavaScript

First Load JS per route, before → after:

| Route | Before | After | Page chunk |
|---|---:|---:|---|
| `/` | 121 kB | 121 kB | 769 B → 795 B |
| `/arhiva` | 121 kB | 121 kB | 769 B → 795 B |
| `/arhiva/[slug]` | 123 kB | 123 kB | 201 B |
| `/legendi` | **126 kB** | **124 kB** | **6.74 kB → 3.79 kB** |
| `/legendi/[slug]` | 123 kB | 123 kB | 197 B |
| `/statistika` | 117 kB | 117 kB | 2.87 → 2.9 kB |
| `/kontakt` | 117 kB | 117 kB | 2.49 → 2.52 kB |
| `/za-nas` | 115 kB | 115 kB | 753 → 784 B |

Shared by all: **103 kB**. (`/studio` is 1.81 MB — the Sanity Studio, not a
public archive route, and not one of the sampled templates.)

**No Sanity code in any client bundle.** Before this phase, `/legendi`'s page
chunk contained the whole `@sanity/image-url` builder — 17,266 bytes carrying
`cdn.sanity.io`, `projectId`, `dataset`, `hotspot`, `crop` — because
`LegendsBrowser` is a client component and pulled it across the boundary through
`LegendCard → PhotoFrame → urlFor`. Verified after the fix by grepping every
per-page chunk for those fingerprints:

```
./page-*.js                     sanity-hits:0
./legendi/page-*.js             sanity-hits:0      (was 17)
./za-nas/page-*.js              sanity-hits:0
./kontakt/page-*.js             sanity-hits:0
./arhiva/page-*.js              sanity-hits:0
./statistika/page-*.js          sanity-hits:0
./legendi/[slug]/page-*.js      sanity-hits:0
./arhiva/[slug]/page-*.js       sanity-hits:0
```

**`PhotoLightbox` is absent from `/legendi/<slug>`** (D-3.05b-3 holds) — trigger
button count on that route measured **0**, and no `[role="dialog"]` in the DOM.

---

## 4 · Fonts

**4 woff2 preloads per template, on all nine routes.** 3.05a's 26-file problem
does not recur. The four are:

| File | Family | unicode-range | Size |
|---|---|---|---:|
| `2409d02e…` | Oswald | cyrillic | 11 KB |
| `bd9b9909…` | Oswald | latin | 21 KB |
| `ffe0837c…` | Golos Text | cyrillic | 22 KB |
| `401f9db3…` | Golos Text | latin | 37 KB |

Both faces are self-hosted through `next/font/google` with
`subsets: ["latin","cyrillic"]`, `display: "swap"`, and weights 600/700 (Oswald)
and 400/700 (Golos). Weight pairs share one file per subset, which is why two
families × two weights × two subsets yields four files, not eight.

**No route preloads a face it does not render** — every template renders both
families, Cyrillic body/heading text and Latin-range digits. The nine remaining
built woff2 files are the other Google subsets (greek, vietnamese, …); they are
declared with their `unicode-range` and are never fetched.

---

## 5 · WCAG 2.2 AA — manual pass

Lighthouse Accessibility was **100 on all nine routes before any change**. It did
not see either of the two real failures below. A 100 is a starting point.

Measured at **1280** and **375** CSS px, and at **320** (= 400 % zoom at 1280),
on the production build.

### 5.1 Failures found and fixed

| SC | Route(s) | Measured before | After |
|---|---|---|---|
| **1.4.10 Reflow** | `/statistika` | The **page itself** scrolled **279 px** sideways at 375 px (`documentElement.scrollWidth` 654 vs `clientWidth` 375) | **0 px** |
| **1.4.3 Contrast** | all 8 with a breadcrumb | Separator „/" `text-paper/40` on navy = **3.48:1** | `paper/60` = **6.14:1** |
| **2.4.7 Focus Visible** | all | Skip link fell back to Chrome's default `outline: 1px auto` | Project ring, `3px solid rgb(238,122,22)`, offset 2px |
| **2.4.7 / consistency** | `/arhiva/<slug>` | `StandingsTable` used `focus-visible:outline-none` + `ring-*` (box-shadow) — the shape D-3.05-4 removed everywhere else | Unlayered `.u-focus` outline |

The reflow cause is worth recording for 3.11: the tables' `sr-only` column labels
are `position: absolute` inside a **`position: static`** `overflow-x-auto`
container, so their containing block is the *initial* one — they escape the
clip and stretch the document's scrollable width. One `sr-only` span
(„Бодови") sat at **x = 654**. `relative` on the scroll region makes it a
containing block and clips them. Applied to all four scroll regions
(`StatTable`, `StandingsTable`, `SeasonAnchorNav`, `DecadeJumpNav`).

### 5.2 Verified clean — all nine routes

| Check | Result |
|---|---|
| Contrast failures (computed, incl. alpha compositing) | **0** on every route |
| Interactive targets < 24×24 px | **0** (see §5.3) |
| Focus obscured by the sticky header (SC 2.4.11) | **0**, by hit test |
| `<h1>` per template | exactly **1** |
| Heading-level skips | **0** |
| `<img>` without `alt` | **0** |
| Unlabelled form controls | **0** |
| Skip link | present, targets `#main`, target exists, works |
| Page horizontal scroll at 375 px | **0 px** |
| Page horizontal scroll at 320 px (400 % zoom) | **0 px** — `scrollWidth` = `clientWidth` = 320 on all nine |
| WCAG text-spacing overrides applied | **0 px** horizontal scroll, no content clipped |

Text spacing was applied as the SC 1.4.12 override set (`line-height: 1.5`,
`letter-spacing: 0.12em`, `word-spacing: 0.16em`, paragraph spacing `2em`). The
only elements reporting clipped overflow afterwards were `.sr-only` spans, which
are clipped by definition.

### 5.3 Target size (SC 2.5.8)

Script output — every focusable element measured at 375 px, flagging anything
under 24×24 including spacing:

```
/                       targetsUnder24: [ Прескокни на содржина 1x1 ]
/arhiva                 targetsUnder24: [ Прескокни на содржина 1x1 ]
/arhiva/1982-83         targetsUnder24: [ Прескокни на содржина 1x1 ]
/arhiva/1931-32         targetsUnder24: [ Прескокни на содржина 1x1 ]
/statistika             targetsUnder24: [ Прескокни на содржина 1x1 ]
/legendi                targetsUnder24: [ Прескокни на содржина 1x1 ]
/legendi/petar-andreev  targetsUnder24: [ Прескокни на содржина 1x1 ]
/za-nas                 targetsUnder24: [ Прескокни на содржина 1x1 ]
/kontakt                targetsUnder24: [ Прескокни на содржина 1x1 ]
```

The single entry on each route is the skip link **in its unfocused `sr-only`
state**, which is the standard pattern — it is not perceivable or operable until
focused. Measured **focused, with a real Tab keypress**: `203 × 37` px at
`(16, 16)`. **No other interactive target on the site is under 24×24.**

The lightbox's three controls re-measured at **48 × 48** each.

### 5.4 SC 2.4.11 Focus Not Obscured (Minimum)

Tested by **hit test, not by rectangle**: each focusable element is scrolled
above the viewport, focused (which makes the browser scroll it back), and then
`document.elementFromPoint` is asked what is actually painted at its top edge.
A rectangle-only check reports a false failure for the skip link, which overlaps
the header's box but paints **above** it (`z-50` against the header's `z-40`) —
`elementFromPoint` at its centre returns the link itself.

**Result: 0 obscured elements on all nine routes** (38–247 focusables per route).

### 5.5 The lightbox — all eight behaviours re-verified

On `/arhiva/1982-83` (11 photos) after every change in this phase:

| # | Behaviour | Evidence |
|---|---|---|
| 1 | `role="dialog"` + `aria-modal` + name | `dialog` · `true` · „Фотографии од сезоната" |
| 2 | Focus moves in, and is trapped | `activeElement === dialog` on open; Tab from the last control returns to „Затвори" |
| 3 | Escape closes | dialog removed from DOM |
| 4 | Backdrop click closes | closes on the backdrop; clicking the photo does not |
| 5 | Focus returns to the triggering thumbnail | `true` on **both** the Escape and the backdrop path |
| 6 | `aria-live` „N / M" counter announces | `aria-live="polite"`, stable node; wraps 11 → 1 forward and 1 → 11 back |
| 7 | Scroll lock on `<html>`, offset preserved | `documentElement.overflow` `hidden` while open → `visible` after; scrollY **5049 identical** before and after (D-3.05b-5) |
| 8 | A one-photo season renders no arrow | `/arhiva/1931-32`: 1 control („Затвори"), **`arrowsRendered: 0`**, no counter, ArrowRight inert |

### 5.6 `StatTable` (SC 2.1.1, 1.3.1)

- Every sortable header is a real `<button>` with `scope="col"` — keyboard-operable and focusable (`activeElement === button` confirmed).
- `aria-sort` cycles `none → ascending → descending` on the active column and resets the other three to `none`; row order actually changes.
- The scrolling region is `tabIndex=0`, `role="region"`, named („Најдобри стрелци — скролувај хоризонтално"), and keyboard-scrollable — at 375 px, `scrollWidth` 520 vs `clientWidth` 333, scrolled to 187 while **the page itself stayed at 0**.

### 5.7 Motion and no-JS

- **`prefers-reduced-motion: reduce`** — verified in the compiled CSS: `*,::before,::after { animation-duration: .01ms !important; transition-duration: .01ms !important }`, plus `.js [data-reveal] { opacity: 1 !important; transform: none !important }`. The `Reveal` content shows immediately and the lightbox's entry animation (a CSS animation from `tw-animate-css`) is suppressed with it.
- **JavaScript disabled** — the only rule that hides revealed content is `.js [data-reveal]{opacity:0}`, and the SSR HTML ships `<html lang="mk" class="__variable_… h-full">` with **no `.js` class** (it is added by the pre-paint inline script, D-1.05-5). Without JS the hidden state never matches and all content is visible; confirmed by fetching the raw HTML and finding card titles present.
- The LCP card now ships with **no `data-reveal` attribute at all** (the `immediate` opt-out), so it cannot be hidden by any path.

### 5.8 WCAG 2.2's own criteria — each recorded

| SC | Verdict | Basis |
|---|---|---|
| **2.4.11** Focus Not Obscured (Min) | **Pass** | 0 obscured across 9 routes by hit test (§5.4) |
| **2.5.7** Dragging Movements | **N/A** | No author-implemented dragging anywhere — no sliders, reordering, drawing or maps. The only match in a source sweep is `resize-y` on the contact textarea, a **user-agent** control, which the SC exempts |
| **2.5.8** Target Size (Min) | **Pass** | 0 targets under 24×24 (§5.3) |
| **3.2.6** Consistent Help | **Pass** | The one help mechanism is „Контакт", reached from the identical `NAV_ITEMS` nav rendered by `SiteHeader` on every page, so its relative order is the same site-wide |
| **3.3.7** Redundant Entry | **N/A** | One single-step form (`ContactForm`); no multi-step process asks for the same information twice |
| **3.3.8** Accessible Authentication (Min) | **N/A** | The public archive has no authentication. `/studio` is Sanity's own admin surface, not an archive template, and is not one of the nine sampled routes |

### 5.9 One item verified by spec rather than by a computed-role API

The in-app browser's accessibility reading lists a `banner` landmark for **every**
`<header>` element, which on `/arhiva` would mean 12. Per HTML-AAM a `<header>`
maps to `banner` **only** when it is not scoped to `article`, `aside`, `main`,
`nav` or `section` — and 12 of the 13 are inside `<main>` or a `<section>`
(verified per element with `closest('article,aside,main,nav,section')`), leaving
exactly one banner: the sticky `SiteHeader`. axe (via Lighthouse) reports zero
accessibility failures and passes `landmark-one-main` on every route.

Chrome's `Element.computedRole` and `getComputedAccessibleNode()` are both
unavailable in this browser, so this one is **spec + axe verified, not
computed-role verified**. A VoiceOver spot-check is on the owed register.

---

## 6 · Layout stability

**CLS 0.000 on all nine routes, both form factors, before and after** — an order
of magnitude inside the ≤0.02 target. Every image, embed and media box reserves
its space: `next/image` frames carry a fixed `aspect-[…]` or intrinsic
`width`/`height`, and the crest's switch from `next/image` to a plain `<img>`
kept its explicit `width={864} height={1233}`, so the reservation is unchanged.

---

## 7 · Best Practices 96 — local artifact, confirmed

96 on every route, local and unchanged by this phase. The single failing audit is
`errors-in-console`, and the single error is:

```
404  http://localhost:3000/_vercel/insights/script.js
```

`@vercel/analytics` only serves that script on Vercel, so it 404s against
`localhost` by definition. Re-measured against the deployed preview in §8.

---

## 8 · Vercel preview verification — ⚠️ two routes outside tolerance

Preview: `https://belasica-v2-gu18d1mkl-sunset-services-team.vercel.app`
(PR [#38](https://github.com/DinovLazar/belasica-v2/pull/38)).

The DoD asks for the three lowest-scoring templates re-measured against the
preview, each within **3 points** of its local number. **Two are not**, and that
is reported here rather than smoothed over.

| Route | Local | Preview | Δ | Within ±3? |
|---|---:|---:|---:|---|
| `/` | 94 | 91 | 3 | ✅ |
| `/arhiva` | 94 | 87 | **7** | ❌ |
| `/legendi` | 95 | 88 | **7** | ❌ |

Preview numbers are the median of **7** runs for `/` and `/arhiva` and of 3 warm
runs for the others; the spread over this network path is wide (`/arhiva` ran
85–94 across seven runs), which is itself part of the finding.

**Accessibility 100 and Best Practices 100** on all three — the latter confirms
§7: the local 96 was purely the `/_vercel/insights/script.js` 404. **SEO is 66 on
the preview**, caused by `is-crawlable` failing because Vercel sends
`x-robots-tag: noindex` on preview deployments — a preview artifact, not a
regression (production is indexable, and SEO is 3.08's phase anyway).

### The fixes did land — the bottleneck moved

`main` at `2c94141` (the exact pre-fix baseline commit) is deployed to
production, which gives a clean like-for-like control on the same network from
the same machine on the same day. The LCP breakdowns:

| Route | | `resourceLoadDelay` | `resourceLoadDuration` | `fetchpriority=high` | `elementRenderDelay` |
|---|---|---:|---:|---|---:|
| `/arhiva` | pre-fix (prod) | 1243 ms | 253 ms | **false** | 1025 ms |
| `/arhiva` | post-fix (preview) | **15 ms** | **62 ms** | **true** | 2012 ms |
| `/legendi` | pre-fix (prod) | 1254 ms | 396 ms | **false** | 883 ms |
| `/legendi` | post-fix (preview) | **226 ms** | **61 ms** | **true** | 1979 ms |

The image work did exactly what it was designed to do on real infrastructure:
`resourceLoadDelay` on `/arhiva` fell from **1243 ms to 15 ms**, load duration
more than halved (AVIF), and the priority hint is now applied where it was
absent. On the wire the LCP image is **23 KB arriving in 59 ms**, and every
high-priority resource on the page completes inside ~200 ms.

**But the composite score did not move, because `elementRenderDelay` (~2000 ms)
now dominates and is not image-related.** The tell is the homepage: its hero was
never inside a `Reveal`, and it shows the same ~1800–2000 ms render delay both
before *and* after this phase. With FCP at 1046 ms and LCP at 3821 ms, there is
a ~2.8 s gap in which nothing is loading.

Measured on Vercel, post-fix, the whole high-priority critical path is:

| Resource | Size | Time |
|---|---:|---:|
| Document | 21 KB | 191 ms |
| **Fonts (4 × woff2)** | **92 KB** | 52–87 ms each |
| LCP image | 23 KB | 59 ms |
| CSS (render-blocking) | 11 KB | 48 ms |

The crest is **gone** from this list — the D-3.09-2 fix is visible here. The
fonts are what remain, which is exactly the constraint **D-3.09-8** identified
and deliberately declined to trade away.

### What is not known, and must be settled before launch

Whether that ~2000 ms render delay is real user experience or an artifact of
**this machine's** network path. Measured TTFB to Vercel is **170–190 ms**
against **3–67 ms** on loopback, and this operator's connection is a VPN tunnel
over a phone hotspot (the same condition already recorded against the build
flake at D-3.05a-9). A ±7-point run-to-run spread on a single route is
consistent with a noisy path, not with a stable deployment difference.

Two hypotheses were tested and eliminated:

- **Cold Vercel image cache.** Every image on all three routes was fetched twice
  until `x-vercel-cache: HIT`, then re-measured. Scores did not change
  (`/arhiva` 87 → 87, `/legendi` 89 → 88).
- **A regression introduced by this phase.** Ruled out by the pre-fix control
  above: the same routes score 87 / 90 on Vercel with the *old* code, so the
  local-to-Vercel offset exists independently of these changes.

**This is on the owed register as a blocking item for 3.11:** re-measure the
three routes from a clean, wired connection before the launch sign-off. Until
then, treat the local numbers as the attributable measurement of *this phase's
changes* and the Vercel numbers as unverified for absolute launch conformance.
