# Content ingestion plan — Belasica-V2

> **Status:** decided at Phase 2.01 (content-model lock). This document decides
> and specifies the ingestion approach; it does **not** build or run it. The
> script is written and run in **Phase 2.09**. Nothing here loads content.
>
> **Sources of truth:** the locked schema (`src/sanity/schemaTypes/`), the P0.1
> Drive audit (D-0.1-1), `facts.md` (content-truth + the photo-rights gate), and
> the folder listing captured while writing this plan (2026-07-15, root folder
> **“Belasica 1922-2025”**, id `1Mdzu5BKAGsSU5Pg6aYT3UBJ3PjT6BU2y`, owner
> `ace.stojanov.mk@gmail.com`).

---

## 1. The reality this plans against (P0.1)

From the P0.1 Drive audit (D-0.1-1), confirmed against the live folder tree:

- **≈915 images**, **15 prose documents**, **≈0.4 GB total**, all owned by Ace.
- **≈74 season folders** (1922 → 2025-26) + **≈23 thematic folders**, under one
  root folder.
- **Sanity free tier** — no paid upgrade (confirmed P0.1). ≈915 photos + ≈74
  seasons + persons + `siteSettings` ≈ **~1,050 documents** and **~0.4 GB
  assets** — both comfortably under the free-tier ceilings (10k documents, 5 GB
  assets). The free-tier constraint is therefore **not** capacity but **mutation
  throughput** during bulk upload — so ingestion runs in resumable waves, not one
  transaction.

Three consequences drive every decision below:

1. **915 photos is far too many to place by hand** in Studio → bulk creation and
   asset upload must be **scriptable and folder-driven**.
2. **Only 15 prose documents exist in the whole archive**, and there is **no
   per-match source** → there is **no match dataset**; statistics come from
   season-level aggregates (`season.finalTable` + `season.squad`) and career
   totals from `person.careerStats`. (This is why `match` is deferred — D-2.01-2.)
3. **~All photos are third-party screenshots** (Facebook / Messenger /
   newspaper), not club-owned originals → **photo rights (P0.2 / OV-1) are a hard
   launch blocker**, independent of anything the 1.05 demo published. See §5.

---

## 2. Approach — hybrid (scripted shells + assets, manual editorial)

Ingestion is **hybrid**, because the two kinds of work have opposite economics:

| Track | What | How | Why |
|---|---|---|---|
| **Scripted** | The **74 season shells** (slug/title/decade) + upload of the **~915 photo assets** as `photo` documents, each with a folder-derived `relatedSeason` and a provisional `provenance` string. | A deterministic Node script using `@sanity/client` (write token, run locally — never committed; the public repo/site stays token-free per D-1.04-2). Folder → season mapping per §3. | 915 placements by hand is infeasible and error-prone; a folder is a clean, deterministic key. |
| **Manual (Studio)** | Everything that needs a human reading the 15 source docs: `season.story`, `season.finalTable`, `season.squad`, `season.trainers`, `person` docs + `bio` + `careerStats`, photo `caption`, and every `relatedPerson` link. | Editors curate in `/studio` after the shells + assets exist. | These are editorial judgements and factual claims (content-truth); they cannot be mechanically derived from folder names. |

The script **never invents facts**. It sets only what the folder name deterministically implies (slug, title, decade, `relatedSeason`) plus the fixed provisional provenance. Titles/stories/tables/stats are left empty for the manual pass, which renders as page placeholders until filled — never as invented filler.

---

## 3. Folder → season mapping convention (deterministic)

The script walks the children of the root archive folder and classifies **each
folder by name**. Rules are evaluated **top-down; first match wins**. Every rule
is derived from the real audited names (examples are actual folders).

### 3.0 Normalisation
Trim whitespace; collapse internal runs of spaces; keep Cyrillic as-is. All slug
output is **Latin/ASCII and URL-safe** (D-0.00-4) — no slashes, no spaces.

### 3.1 Skip: owner-exclude marker
- **Match:** name ends with `- не` (Ace’s own “no/skip” marker).
- **Examples:** `Листа на стрелци - не`, `Sostavi mkd sport - не`.
- **Action:** **SKIP entirely.** Do not create anything. Log as skipped.

### 3.2 Thematic (not a season)
- **Match:** name begins with a **numeric section prefix** `^\d{2,3}[.\s]`
  (e.g. `000.`, `15.`, `25.`) **or** does **not** begin with a 4-digit year.
- **Examples:** `009. Фудбалски легенди`, `011. Treneri`, `012. Pretsedateli`,
  `010. Репрезентативци на Македонија`, `014. Прва македонска лига`,
  `15. Uefa natprevari`, `020. Партизан и Беласица`, `021. Стадион`,
  `024. Znamenca Belasica`, `25.Спонзори`, `000. Корица…`,
  `Куп на Македонија од 1992`, `СТАТИСТИКА`.
- **Action:** **No season shell.** These feed the **manual** track: photos of
  people (`009`/`010`/`011`/`012`) attach to `person` docs via `relatedPerson`;
  the rest are thematic galleries or book-production artifacts (`000.`) curated
  (or ignored) by hand. The script may still bulk-**upload** their photo assets
  with provisional provenance and **no** `relatedSeason`, flagged
  `needs-manual-linking`, if a later phase wants them staged — but it assigns no
  season.

### 3.3 Season — year span (the common case)
- **Match:** `^(\d{4})[-/](\d{2}|\d{4})(\s.*)?$`.
- **Derivation** (start = first 4 digits; end resolved to a 2-digit tail for the
  title, kept 4-digit when the folder is 4-digit):
  - **slug** = start + `-` + end, `/`→`-`, trailing label dropped.
  - **title** = `„Сезона {start}/{end2}"`.
  - **decade** = `floor(start / 10) * 10`.
- **Locked examples (from the brief + audit):**

  | Drive folder | slug | title | decade |
  |---|---|---|---|
  | `1985-86` | `1985-86` | `„Сезона 1985/86"` | `1980` |
  | `1992-93` | `1992-93` | `„Сезона 1992/93"` | `1990` |
  | `1950/51` (slash) | `1950-51` | `„Сезона 1950/51"` | `1950` |
  | `1930-31` | `1930-31` | `„Сезона 1930/31"` | `1930` |
  | `1999-2000` (century rollover) | `1999-2000` | `„Сезона 1999/2000"` | `1990` |
  | `2025-26` | `2025-26` | `„Сезона 2025/26"` | `2020` |

  Note the slug **drops the slash** (`1950/51` → `1950-51`) because slugs are
  URL-safe Latin (D-0.00-4), while the **title keeps the human `/` form**.

### 3.4 Season — single calendar year
- **Match:** `^(\d{4})(\s.*)?$` (a lone 4-digit year, no span).
- **Examples:** `1942`, `1943`, `1944`, `1950`, `1951`, `1952`.
- **Derivation:** slug = `{year}`; title = `„Сезона {year}"`; decade =
  `floor(year/10)*10`.
- **Flag `manual-title`:** a lone year may be a partial/uncertain season (war
  years, calendar-year summaries) and can **coexist** with a span folder
  (`1950` **and** `1950/51` both exist). The shell is created; the human confirms
  what it represents and corrects the title/story. Slugs stay distinct
  (`1950` vs `1950-51`), so there is no collision.

### 3.5 Season — multi-year era range
- **Match:** span rule (§3.3) where **end − start > 1**.
- **Examples:** `1922-26`, `1926-1930`, `1945-48 Илинден`.
- **Derivation:** slug = normalised range (`1922-26`, `1926-1930`, `1945-48`);
  decade = start decade. **Flag `manual-title`:** these group several
  early years (per-season granularity does not exist that far back) and may carry
  a label (`Илинден`). The shell is created with a provisional title
  `„Беласица {start}–{end}"`; the human sets the real title/story and folds in the
  label. The trailing label is **not** put in the slug.

### 3.6 Unmatched → fail loud
- Anything matching **none** of the above → **do not guess**. Add to a
  `manual-review` list in the script’s run report and continue. Silent invention
  is forbidden (content-truth).

### 3.7 Uniqueness is enforced by the schema
`season.slug` and `person.slug` are now unique-per-type (D-2.01-6). If the
mapping ever derives the same slug from two folders, the write **fails
validation** rather than overwriting — a deliberate fail-loud. The script must
surface such a collision to the operator, not swallow it.

---

## 4. Wave plan (resumable, by decade)

Waves exist for **operational safety** (resumable, per-wave verification, gentle
on free-tier mutation limits), not because any hard cap is near. Batch mutations
in transactions of ~50–100 with a short delay; ~0.4 GB of assets is trivial for
the 5 GB tier.

- **Wave 0 — shells.** Create all **~74 season documents** (slug/title/decade
  only) in one script pass. Cheap (~74 docs). **Verify:** published/draft season
  count == expected; every season has a `decade` (now required) and a unique
  slug; spot-check five titles against their folders (incl. one slash, one
  single-year, one era).
- **Waves 1–8 — photos by decade**, each wave = the photo assets of that
  decade’s season folders, uploaded as `photo` documents with a folder-derived
  `relatedSeason` and the provisional provenance (§5), created **unpublished**:
  1. 1920s–1940s (era + single-year folders) · 2. 1950s · 3. 1960s · 4. 1970s ·
  5. 1980s · 6. 1990s · 7. 2000s · 8. 2010s–2020s.
  **Per-wave verify:** uploaded photo count == source image count for that
  decade’s folders; every new `photo` has a non-empty `provenance` and a resolved
  `relatedSeason`; nothing from that wave is in the **published** perspective.
- **Thematic pass (manual/semi-scripted).** After `person` docs exist, attach the
  people-folder photos (`009`/`010`/`011`/`012`) via `relatedPerson`; handle the
  rest (`Стадион`, `Спонзори`, cup/UEFA, etc.) as curated galleries or leave
  staged. No season assigned.
- **Editorial pass (manual, ongoing).** `story`, `finalTable`, `squad`,
  `trainers`, `bio`, `careerStats`, captions, `relatedPerson` — read from the 15
  source docs; each factual claim goes to `facts.md` before it is published.

Waves are independently re-runnable: a folder already ingested is detected by its
derived slug / a stable per-asset key and skipped, so an interrupted run resumes
without duplicates.

---

## 5. Provenance & rights gate (hard launch blocker — P0.2 / OV-1)

Per P0.1, ~all source photos are third-party screenshots. `facts.md` is
explicit: **“No photo ships publicly while [publishing rights are] UNVERIFIED.”**
This governs ingestion mechanically:

1. **Every** ingested `photo` gets a **provisional `provenance`** string set by
   the script (the field is required — D-2.01 / content-truth), recording the
   source folder and the unconfirmed-rights status. Locked provisional value:

   > `„Извор: Google Drive архива на Ацо — папка „{folderName}". Потекло и права за објавување НЕПОТВРДЕНИ (P0.2/OV-1). Не за јавно прикажување до потврда."`

   (“Source: Ace’s Google Drive archive — folder ‘{folderName}’. Origin and
   publishing rights UNCONFIRMED (P0.2/OV-1). Not for public display until
   confirmed.”) A human replaces this with the real provenance as rights are
   cleared, per photo or per source.

2. **Ingested photos are created UNPUBLISHED (drafts).** The public site reads
   with `perspective: "published"` and no token (D-1.04-2), so **draft photos
   never render publicly** — this is the mechanical enforcement of the gate, not
   a convention. A photo becomes public only when a human **publishes** it, and
   only after **P0.2 / OV-1 is VERIFIED in `facts.md`**.

3. The 8 photos already **published** in the demo dataset are Ace’s own,
   permitted for the demo (`facts.md`); they are unaffected. **Note (2.01):**
   `current-state.md` records OV-1 as “Resolved (Ace holds the rights)”, but
   `facts.md` still lists photo rights **UNVERIFIED** — this contradiction must
   be resolved with Ace **before** any bulk-ingested photo is published. Until
   then, treat rights as UNVERIFIED (the stricter of the two).

---

## 6. What 2.09 must produce

- The ingestion script (local, token-based; token never committed).
- A run report: per-folder classification (season / thematic / skipped /
  manual-review), counts created, and any slug collisions or unmatched folders.
- All ingested photos unpublished, each with provisional provenance and (for
  season folders) a resolved `relatedSeason`.
- A hand-off list for the manual editorial pass (which seasons/persons still need
  story/stats/captions/links).

This plan is deterministic enough that 2.09 can be built and dry-run against the
folder tree before a single document is written.
