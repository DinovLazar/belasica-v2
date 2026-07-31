# Part 3 · Phase 09 — Performance & accessibility **baseline**

Measured **before** any change in this phase, on `main` at `2c94141`, so the
post-fix numbers in `Part-3-Phase-09-results.md` are comparable and so the
launch verification at **3.11** can repeat this exactly.

> The 3.04d numbers are **not** the baseline. Everything visual changed after
> them (3.05 rebuilt the token layer and every route, 3.05b added the lightbox
> and the vector crest, 3.06a rebuilt the crest, reordered the season page and
> added `SeasonRecordBoard` + 86 portraits). This was measured from scratch.

---

## Method — repeat this verbatim at 3.11

**Tool.** Lighthouse CLI **13.4.1**, pinned exactly in `devDependencies`
(same major/minor/patch as the 3.04d pass, so the two are comparable).
Chrome: Google Chrome (stable, macOS), headless.

**Server.** The real production build, served locally:

```bash
npm run build && npm run start
```

**Per route, per form factor — three runs, median taken:**

```bash
npx lighthouse "http://localhost:3000<route>" --output=json --output-path=<file> --throttling-method=simulate --quiet --chrome-flags="--headless=new --no-sandbox --disable-gpu"
```

Desktop adds `--preset=desktop`. Mobile is the default config (Moto-G-class
emulation: **412×823 CSS px, DPR 1.75**, simulated Slow 4G).

**How the median is chosen.** The **median run by Performance score** is
selected, and every metric in that row comes from that same run — so the numbers
in a row are internally consistent, rather than a per-metric median stitched
together from three different traces. The individual three scores are printed in
the last column so the spread is visible.

The harness that drives this is `lh-run.mjs` (54 runs: 9 routes × 2 form factors
× 3). It is a scratch script, not a repo file; the command above is the contract.

**Routes.** All nine slugs were confirmed to exist in the build output
(`curl -o /dev/null -w "%{http_code}"` → `200` on every one) before measuring.
No substitutions were needed.

---

## Baseline results

Build: **270 static pages**. Bold = meets the ≥95 gate.

| Template | Route | Form | Perf | A11y | BP | SEO | LCP | TBT | CLS | FCP | SI | 3 runs |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Home | `/` | mobile | 94 | 100 | 96 | 100 | 3108 ms | 22 ms | 0.000 | 758 ms | 1195 ms | 93 / 94 / 94 |
| Home | `/` | desktop | **100** | 100 | 96 | 100 | 699 ms | 0 ms | 0.000 | 212 ms | 451 ms | 99 / 100 / 100 |
| Season index | `/arhiva` | mobile | 86 | 100 | 96 | 100 | 4260 ms | 7 ms | 0.000 | 909 ms | 1213 ms | 95 / 86 / 84 |
| Season index | `/arhiva` | desktop | **97** | 100 | 96 | 100 | 1241 ms | 0 ms | 0.000 | 247 ms | 496 ms | 97 / 97 / 97 |
| Season detail (rich) | `/arhiva/1982-83` | mobile | 94 | 100 | 96 | 100 | 3074 ms | 6 ms | 0.000 | 906 ms | 994 ms | 92 / 94 / 96 |
| Season detail (rich) | `/arhiva/1982-83` | desktop | **100** | 100 | 96 | 100 | 666 ms | 0 ms | 0.000 | 247 ms | 305 ms | 100 / 100 / 100 |
| Season detail (thin) | `/arhiva/1931-32` | mobile | **98** | 100 | 96 | 100 | 2420 ms | 8 ms | 0.000 | 763 ms | 763 ms | 97 / 98 / 98 |
| Season detail (thin) | `/arhiva/1931-32` | desktop | **100** | 100 | 96 | 100 | 584 ms | 0 ms | 0.000 | 207 ms | 313 ms | 100 / 100 / 100 |
| Statistics | `/statistika` | mobile | **97** | 100 | 96 | 100 | 2571 ms | 37 ms | 0.000 | 914 ms | 914 ms | 95 / 97 / 98 |
| Statistics | `/statistika` | desktop | **100** | 100 | 96 | 100 | 680 ms | 0 ms | 0.000 | 247 ms | 400 ms | 100 / 100 / 100 |
| Person index | `/legendi` | mobile | 89 | 100 | 96 | 100 | 3849 ms | 27 ms | 0.000 | 911 ms | 911 ms | 89 / 89 / 90 |
| Person index | `/legendi` | desktop | **99** | 100 | 96 | 100 | 1023 ms | 0 ms | 0.000 | 249 ms | 424 ms | 99 / 98 / 99 |
| Person detail | `/legendi/petar-andreev` | mobile | **97** | 100 | 96 | 100 | 2568 ms | 11 ms | 0.000 | 759 ms | 1183 ms | 94 / 97 / 98 |
| Person detail | `/legendi/petar-andreev` | desktop | **100** | 100 | 96 | 100 | 607 ms | 0 ms | 0.000 | 207 ms | 398 ms | 100 / 100 / 100 |
| About | `/za-nas` | mobile | **95** | 100 | 96 | 100 | 2881 ms | 10 ms | 0.000 | 766 ms | 1364 ms | 95 / 94 / 95 |
| About | `/za-nas` | desktop | **100** | 100 | 96 | 100 | 680 ms | 0 ms | 0.000 | 207 ms | 218 ms | 100 / 100 / 100 |
| Contact | `/kontakt` | mobile | **98** | 100 | 96 | 100 | 2415 ms | 9 ms | 0.000 | 760 ms | 760 ms | 98 / 98 / 96 |
| Contact | `/kontakt` | desktop | **100** | 100 | 96 | 100 | 587 ms | 0 ms | 0.000 | 207 ms | 461 ms | 100 / 100 / 100 |

---

## What the baseline says

**Desktop is already at the gate.** Every route 97–100. Nothing to fix there.

**Accessibility is 100 on all nine routes, both form factors, with zero failed
audits.** That is the *starting* point, not a pass — Lighthouse's automated set
covers a minority of WCAG. The manual pass is Task 2 and it found real failures
that this 100 does not see.

**CLS is 0.000 everywhere.** Already far inside the ≤0.02 target.

**TBT is negligible** — 0 ms desktop, ≤37 ms mobile. There is no JavaScript
problem on this site.

**The entire mobile gap is LCP.** On every route below 95 the *only* failing
Performance audit is `largest-contentful-paint` (weight 25); every other audit
scores 1.0 and no audit reports an `overallSavingsMs` above 50 ms.

Three routes miss the gate on mobile:

| Route | Perf | LCP | Note |
|---|---:|---:|---|
| `/arhiva` | 86 | 4260 ms | Also the noisiest: 95 / 86 / 84 across three runs |
| `/legendi` | 89 | 3849 ms | 160 cards, 86 portraits — the heaviest image page |
| `/` | 94 | 3108 ms | |

`/za-nas` at 95 is on the line (runs 95 / 94 / 95).

**Best Practices 96 is a local-only artifact, not a defect.** The single failing
audit is `errors-in-console`, and the single console error is
`GET /_vercel/insights/script.js → 404`. `@vercel/analytics` only serves that
script on Vercel, so it 404s against `localhost` by definition. Expected to be
100 on the deployed preview; confirmed there in the results document.

**`/_next/image` re-measured, as the brief asked.** `w=640`, `w=1920` and
`w=3840` all return **200** — D-3.05-11's 402 has not returned.
