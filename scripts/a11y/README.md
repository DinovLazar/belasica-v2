# `scripts/a11y` — the accessibility scanners

Five Node scripts written for the WCAG 2.2 AA remediation (branch
`a11y-remediation`, report at `docs/accessibility-report.md`). They exist because
the off-the-shelf tools have blind spots that matter on this site, and because a
claim like „focus is never hidden" has to be a measurement, not an opinion.

**They add no dependency.** All five drive the `puppeteer-core` and `axe-core`
already present under `node_modules` (both arrive with `lighthouse`, a
devDependency), and they point at the Chrome installed on the machine. Nothing
here is imported by the site.

## Running them

Build and serve first — scan the production output, not `next dev`, which injects
its own overlay:

```
npm run build && npm run start
```

Then, from the repo root (override the origin with `A11Y_BASE` if the server
took another port, and the browser with `CHROME_PATH`):

| Script | What it measures | Invocation |
| --- | --- | --- |
| `scan-axe.mjs` | axe-core over a list of paths on stdin, at one viewport. One browser for the whole run; the CLI relaunches Chrome per URL and takes ~20 minutes over 324 routes. Scrolls each page first, so nothing is audited mid-reveal. | `node scripts/a11y/scan-axe.mjs out.json --viewport=mobile < paths.txt` |
| `scan-contrast.mjs` | SC 1.4.3 / 1.4.11 from the RENDERED DOM: composites alpha, resolves the ancestor background, and applies the large-text threshold from the computed font size. Reports what it could not resolve (text over a background image) instead of passing it silently — the hole D-3.05a-8 already records. | `node scripts/a11y/scan-contrast.mjs out.json < paths.txt` |
| `scan-targets.mjs` | SC 2.5.8, including the spacing exception — it draws the 24px circle the criterion describes rather than only measuring the box, and separates real failures from targets the exception rescues. | `node scripts/a11y/scan-targets.mjs out.json --viewport=mobile < paths.txt` |
| `keyboard-walk.mjs` | Tabs (or Shift+Tabs) through a page and records, per stop, what got focus, whether a ring is painted, and — by hit-testing the focused rectangle — whether the sticky chrome covers it. This is what caught the SC 2.4.11 failure. `A11Y_NO_SCROLL_PADDING=1` reproduces the pre-fix state on a fixed build. | `MAX_STOPS=45 node scripts/a11y/keyboard-walk.mjs /statistika 1280 --shift` |
| `visual-diff.mjs` | Screenshots a fixed page set at fixed ABSOLUTE scroll offsets and pixel-diffs two runs, writing a map with changed pixels in red. Absolute offsets on purpose: `scrollIntoView` is itself moved by `scroll-padding-top`. | `node scripts/a11y/visual-diff.mjs shoot dir/` then `… diff before/ after/` |

`pa11y` and `@axe-core/cli` were run too, but from a scratch directory rather
than from here, so that the audit tooling never entered this project's
dependency graph. `npx pa11y@9.0.1 <url>` and `npx @axe-core/cli@4.11.0 <url>`
reproduce them.

## The path list

Every scan in the report ran over all 324 public URLs, taken from the site's own
sitemap so the list cannot drift from what is published:

```
curl -s http://localhost:3000/sitemap.xml \
  | grep -o '<loc>[^<]*</loc>' | sed 's|<loc>||;s|</loc>||' \
  | sed 's|https://belasica-v2.vercel.app||' > paths.txt
```

`/studio` is deliberately absent: it is the vendored Sanity Studio, an editing
tool that `robots.ts` already keeps out of the index, and its markup is not this
repo's to fix. See the report's „What was not audited".
