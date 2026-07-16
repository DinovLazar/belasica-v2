# Phase 2.02 mockups — Archive & Season templates

Six mockups for `../Part-2-Phase-02-Handover.md`. **The handover is the spec; these
are illustrations of it.** Where a mockup and the handover disagree, the handover wins.

| File | Template | Viewport |
|---|---|---|
| `archive-desktop.png` | Archive index `/arhiva` | 1200 |
| `archive-mobile.png` | Archive index `/arhiva` | 375 |
| `season-desktop.png` | Season detail `/arhiva/<slug>` | 1200 |
| `season-mobile.png` | Season detail `/arhiva/<slug>` | 375 |
| `archive-empty-desktop.png` | **Empty state** — decade of seasons with no lead photo | 1200 |
| `season-empty-desktop.png` | **Empty state** — season with only `title` + `decade` | 1200 |

## ⚠️ The content in these mockups is SCHEMATIC — never copy it

No historical fact in `facts.md` is VERIFIED yet (see its "Historical facts" section).
So every club name, player name, standings number, appearance count and date in these
mockups is deliberately **non-plausible filler** (`Клуб А`, `Играч Б`, `Тренер А`) and
each mockup carries a disclaimer strip. This is intentional (D-2.02-15): a mockup must
never be mistakable for content, or get pasted into code as seed data. The only real
strings are the VERIFIED wordmark `ФК Беласица`, the footer line `неофицијална архива`,
and the route/nav labels from `src/lib/nav.ts`.

Photos are greybox frames — real assets are not published yet (OV-1 caveat / 2.09).

## Re-rendering

The PNGs are rendered from the `.html` + `mockup.css` in this folder. `mockup.css`
mirrors the `brand.md` tokens; it is a **mockup-only** stylesheet and is not shipped —
the real build reads tokens from `globals.css` / Tailwind.

```zsh
cd docs/design-handovers/Part-2-Phase-02-mockups
python3 -m http.server 8899 &
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# desktop — render at the page's exact content height
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --virtual-time-budget=8000 --screenshot=archive-desktop.png \
  --window-size=1200,2163 "http://localhost:8899/archive-desktop.html"
```

Heights used: archive-desktop 2163 · season-desktop 3832 · archive-empty-desktop 1574 ·
season-empty-desktop 1039 · archive-mobile 2280 · season-mobile 3253.

**Mobile gotcha:** headless Chrome enforces a minimum window width, so rendering a 375px
page directly lays it out wider and crops it. Render the mobile pages through a wrapper
page holding a fixed `width:375px` iframe (an iframe gets its own layout viewport), then
screenshot at `--window-size=375,<height>`.
