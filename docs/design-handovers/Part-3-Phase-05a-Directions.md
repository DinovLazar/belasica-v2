# Part 3 · Phase 05a — Visual direction exploration: three homepages

**What this is.** Three complete homepages, built on the same live Sanity content, in three
divergent visual directions. They exist so the owner can point at one and say „that one". This
document records what each direction is, exactly which tokens it moves away from `brand.md`, and
what adopting it would cost site-wide.

**It carries no recommendation.** The pick is the owner's.

| | Route | Direction |
|---|---|---|
| **А** | `/predlog-a` | „Спортски весник" — newsprint chronicle |
| **Б** | `/predlog-b` | „Клупски музеј" — club museum |
| **В** | `/predlog-c` | „Трибина" — terrace modern |

All three are `noindex, nofollow`, absent from the sitemap, and reachable only by URL. Nothing on
the live site changed: no shared component, no shared token, `brand.md` untouched.

---

## What is identical across all three

So that the comparison is about design and nothing else:

- **The same content, from the same read.** One GROQ query (`src/app/(predlozi)/_shared/home.ts`),
  transcribed unchanged from the live homepage, with the same hero fallback chain, the same
  portraits-first legend sort and the same honours→appearances→scorers record order.
- **The same copy** (`_shared/copy.ts`) — every heading, kicker, CTA and quick-link label.
- **The same seven zones**, in the same order: hero → story → legends → records → decades →
  moment → quick links, plus header and footer.
- **The same content-truth behaviour.** 4 placeholder chips render on each variant (two legends
  with no `playingYears`, the footer's e-mail and social slots). Nothing is invented anywhere.
- **The same accessibility floor**, verified per variant at 1280 and 375: one `<h1>`, no heading
  level skipped, every image `alt`-ed, no horizontal scroll, every text/background pair ≥ AA, every
  link and button ≥ 24×24.

## What is deliberately not identical

Header and footer are part of what is being compared, so each direction ships its own. Motion
differs per direction (a token, not an accident). Container width, gutters and vertical rhythm
differ. Photo treatment differs. All of it is listed per direction below.

---

## А — „Спортски весник" (newsprint chronicle)

### Intent

The archive as a digitised vintage sports newspaper. Paper is the whole page; navy is the only
structural ink; hairline rules do the work that whitespace does on the live site. The seven zones
are re-cut as front-page furniture — a masthead with a standing line and a double rule, a lead
story with its two-ink photograph, a column-set feature with a drop cap, a row of portrait cuts, a
box score, an index with dotted leaders, a full-measure picture, a section strip and a colophon.
It is the densest of the three and the only one that reads as a printed object rather than a
website: the masthead is deliberately **not sticky**, because a nameplate that follows you down the
page is a web behaviour. Orange never becomes a letterform here — it is an 8px square before each
standing head and a 2px rule before each caption, and nothing else.

### Token deltas vs `brand.md`

| Token | `brand.md` | Direction А | Why |
|---|---|---|---|
| Paper | `#F7F4EC` | `#F1EADA` | warmed and darkened toward aged newsprint |
| Second surface | `footer #EDEAE0` | `#E7DFCB` | the sunk band under box score / colophon |
| Navy | `#12294F` | `#0F2242` | deepened for print density |
| Ink | `#1B1B1A` | `#14140F` | a colder press black |
| Orange | `#E4741C` | `#D9600F` | darkened; **demoted to marker-only, never text** |
| Rule / divider | `mist #E4E1D8` | `#6E6959` | a mist hairline is invisible as a newspaper rule |
| Muted text | `neutral-500 #6B6A64` | `#57544A` | 6.3:1 on the warmer paper |
| Display face | Source Serif 4 | **Playfair Display** 700/900 | a Didone — the thick/thin of a sports front page |
| Body face | Inter | **PT Serif** 400/700 + italic | Cyrillic-native text face; real italic for decks/captions |
| Third face | — | **PT Sans Narrow** 400/700 | agate: box scores, standing heads, captions |
| Radius | photo 2 / card 4 / chip 4 | **0 everywhere** | print has no rounded corners |
| Content width | 1200 | 1160 | denser measure |
| Section rhythm | `py-16 md:py-24` | `clamp(2.5rem, 4.6vw, 4rem)` | tighter — this is a dense page |
| Motion | 500ms + translateY(10) | 320ms, **no translate** | ink appears; it does not slide |
| Header | sticky navy bar | static paper masthead | see intent |

Stricter than `brand.md`, not looser: **D-1.02-1 is tightened**, because orange carries no text on
any surface in this direction, navy included.

### What adopting it site-wide would touch

- `brand.md` §Color (6 values), §Typography (whole table, plus a third face), §Spacing (width,
  rhythm), §Corner radii (all three → 0), §Motion.
- `globals.css` `@theme`: the same colour and type tokens, plus registering three new font-size
  names in `src/lib/utils.ts` (the `cn()` type-scale rule from D-3.04d-1).
- `src/app/fonts.ts` + root layout: two faces swapped for three.
- `SiteHeader` — a rewrite, not a restyle (masthead structure, no sticky, no mobile burger); the
  `--spacing-header` token and every `top-header`/`scroll-mt-header` consumer (season anchor rail,
  archive decade rail) would need re-measuring or removing.
- `SiteFooter` — a rewrite (colophon).
- `PhotoFrame`, `MattedPhoto`, `SeasonCard`, `LegendCard` — a new duotone/black-and-white treatment
  and hairline frames replacing the mist mat.
- `StandingsTable` / `StatTable` / `SeasonRecordList` — re-set as agate box scores.
- The three archive/legends/statistics templates inherit the rest through tokens.
- **Cost note:** the highest of the three. It is the only direction that changes the header's
  structure and therefore the sticky/anchor arithmetic that 2.02–3.04d built.

---

## Б — „Клупски музеј" (club museum)

### Intent

The archive as a room you walk through. Deep navy walls carry the whole page and the paper the live
site is built on survives only as mat board around the photographs and as text on the wall.
Photographs are mounted, not framed: a wide board with a brass keyline scored into it and a soft
wash of light above. Records are cast as plaques — the record's own words small, its value large.
Decades hang as framed plates. The vertical rhythm is roughly double the live site's, and that air
*is* the direction. Two navies — a deep wall and the brand navy as the raised panel — give depth
without a shadow token, which the project does not have. Like А, the header is deliberately not
sticky: a museum's identity sits above the door, it does not follow you from room to room.

### Token deltas vs `brand.md`

| Token | `brand.md` | Direction Б | Why |
|---|---|---|---|
| Dominant surface | paper `#F7F4EC` | **wall `#0A182F`** | the direction's whole premise |
| Second surface | card `#FFFFFF` | **panel `#12294F`** (brand navy) | the raised plaque, and depth without a shadow |
| Mat board | `mist #E4E1D8` | `#EDE7D9` | a warmer board than a grey mat |
| Body text | `ink #1B1B1A` | `paper #F7F4EC` @ 78% | inverted — 10.1:1 on the wall |
| Brass | — | `#D2984C` | orange lifted toward gold; text-legal on navy (7.0:1) |
| Orange | `#E4741C` | unchanged | kept as the one true accent marker |
| Display face | Source Serif 4 | **Cormorant Garamond** 400/600 | an old-style that needs size and air, which this has |
| Body face | Inter | **Commissioner** 400/500/600 | a Cyrillic-first humanist sans for the label furniture |
| Type scale | display 60 / H1 44 | display up to 84 | grander |
| Label | overline 12 / .14em | 12 / **.24em** | museum wall-label tracking |
| Content width | 1200 | **1100** | narrower; more wall |
| Section rhythm | `py-16 md:py-24` | `clamp(4.5rem, 9vw, 8rem)` | roughly double |
| Photo mat | hairline mist mat | `clamp(1rem, 3.4vw, 2.75rem)` board + keyline | the matting motif, scaled up as briefed |
| Motion | 500ms | **900ms** | the slowest of the three |
| Theme | single light theme (D-1.03-4) | **effectively a dark theme** | see cost |

**One rule was re-proved here, not assumed.** The hero's wall label was drawn in brass; measured
against the worst case a photograph can present under the scrim (a pure-white pixel) it fell to
**1.99:1**. It is now paper (13.5:1 worst case) with brass kept as the rule only — the same finding
the live site recorded as D-3.03-5.

### What adopting it site-wide would touch

- `brand.md` — the largest rewrite of the three: it inverts the surface/text relationship the whole
  token table is written around, and **contradicts D-1.03-4 ("single light theme, no dark mode")**,
  which would have to be reversed as a decision, not just edited.
- `globals.css` — every semantic token (`--background`, `--foreground`, `--card`, `--border`, the
  shadcn map) flips.
- Every component that assumes „navy ink on a light surface": `SeasonCard`, `LegendCard`,
  `PersonHero`, `Breadcrumb`, `StatTable` (zebra + highlight rows are light-surface tokens and
  would need dark equivalents), `SeasonStory`'s Portable Text styles, `PlaceholderChip`,
  `ContactForm` (inputs, disabled fieldset, error banner).
- `PhotoFrame` / `MattedPhoto` — the mat grows from a hairline to a board; the mixed-quality rule
  in `brand.md` §Photo treatment still applies and still works.
- The contact form needs a full dark-surface state pass (four states, all re-measured).
- **Cost note:** the most invasive of the three, because it is a theme inversion, not a restyle.

---

## В — „Трибина" (terrace modern)

### Intent

A bold contemporary club identity. Oversized condensed Cyrillic caps, hard-edged navy/orange
blocking, a crest-forward hero where the badge is set at display scale on its own line, and a
scoreboard stat strip. The page alternates full-bleed navy and paper blocks that butt directly
against each other, so it reads as stacked panels rather than a scroll of sections. It is the
tightest rhythm and the loudest of the three, and the only one with a sticky header and a mobile
menu — it behaves like a contemporary club site.

Loud, but still an archive: there is no clock, no fixture, no ticker, and **no generated number
anywhere**. Every value on the scoreboard is a curated `clubRecord` string rendered exactly as the
editor wrote it.

### Token deltas vs `brand.md`

| Token | `brand.md` | Direction В | Why |
|---|---|---|---|
| Navy | `#12294F` | `#0D1F3C` + brand `#12294F` as the second block | two blocks, hard edges |
| Orange | `#E4741C` marker only | `#EE7A16`, **promoted to a block fill** | the real delta — see below |
| Ink | `#1B1B1A` | `#14161A` | on paper blocks |
| Muted | `neutral-500` | `#5E5C55` | 6.1:1 on paper |
| Display face | Source Serif 4 | **Oswald** 600/700, uppercase | condensed terrace caps with a real Cyrillic |
| Body face | Inter | **Golos Text** 400/700 | a modern Cyrillic-first grotesque |
| Display size | 60 | up to **112px**, line-height 0.86 | oversized as briefed |
| Radius | 2 / 4 / 4 | **0 everywhere** | hard blocks |
| Content width | 1200 | **1248** | wider; blocks want room |
| Section rhythm | `py-16 md:py-24` | `clamp(3rem, 5vw, 4.5rem)` | the tightest of the three |
| Focus ring | 2px | **3px** | a loud interface with a timid focus ring is not loud |
| Motion | 500ms | **260ms** | things arrive; they do not drift |
| Hover | 2px lift, no colour-only | full **fill swap** navy→orange | „pronounced states", as briefed |

**On the orange promotion.** `brand.md`'s D-1.02-1 says orange never carries text on a light
surface. That rule is **not broken here** — orange text on paper is still 2.6:1 and is never used.
What changes is the direction of the pair: the *block* goes orange and the text on it goes navy,
which measures **5.8:1**. Orange as a fill, navy as the ink.

The signature is a 6px orange bar: it opens the header, closes the footer, and caps every tile and
the moment caption. (It began life as a left-hand accent border on the tiles; the Impeccable
detector flagged that as the single most recognisable generated-UI tell, and rotating it to the top
edge turned a card decoration into a motif that bands the whole page.)

### What adopting it site-wide would touch

- `brand.md` §Color (orange's role is re-scoped from „marker" to „marker + block fill, with navy
  ink on it"), §Typography (both faces; a condensed uppercase display changes every heading's
  measure), §Corner radii (→ 0), §Motion (durations + the hover rule).
- `globals.css` `@theme` + `src/lib/utils.ts` type-token registration.
- `src/app/fonts.ts` + root layout.
- `SiteHeader` — restyle rather than rewrite: still sticky, still a burger, so `--spacing-header`
  and every `top-header` / `scroll-mt-header` consumer survive with a re-measure only.
- `SiteFooter` — restyle.
- Cards (`SeasonCard`, `LegendCard`, quick links, decade tiles) — new hover/focus model.
- `StatTable` — the zebra/highlight row tokens need re-deriving against the darker blocks.
- Long Macedonian headings must be re-checked in a condensed uppercase face: „БЕЛАСИЦА" already
  had to be capped at 112px to stay inside the hero column.
- **Cost note:** the cheapest of the three to adopt. It keeps the light/dark relationship, the
  sticky header and the header height token, so the 2.02–3.04d layout arithmetic survives.

---

## Verification recorded for all three

Measured per route at **1280 and 375** against the production build:

| | А | Б | В |
|---|---|---|---|
| One `<h1>` | ✓ | ✓ | ✓ |
| Heading order (no skips) | ✓ | ✓ | ✓ |
| Images with `alt` | 6/6 | 6/6 | 7/7 |
| Text/background pairs below AA | 0 | 0 | 0 |
| Links/buttons under 24×24 | 0 | 0 | 0 |
| Horizontal scroll | none | none | none |
| Placeholder chips | 4 | 4 | 4 |
| Fonts preloaded | 18 | 8 | 8 |

Contrast for text over a photograph cannot be read from computed styles, so the hero of Б — the
only place any variant sets text over an image — was computed analytically against the worst case a
photograph can present (a pure-white pixel under the scrim): label 13.5:1, `<h1>` 14.2:1, deck
9.5:1, link 15.8:1.

Placeholder-chip text was checked against its own hatch stroke rather than its surface, which is
the worst case where a hatch line crosses a glyph; all six chip states clear 4.5:1 at the shipped
hatch alpha.

Cyrillic coverage was verified per face by parsing the `cmap` out of each shipped `woff2` — the
Google `cyrillic` subset only says which file the browser should fetch, not which glyphs the
designer drew. All seven faces carry the full Macedonian alphabet including Ѓ ѓ Ѕ ѕ Ј ј Љ љ Њ њ Ќ ќ
Џ џ.
