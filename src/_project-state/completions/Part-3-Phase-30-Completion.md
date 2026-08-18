# Part 3 · Phase 3.30 · Code — Completion Report

**Репрезентација наместо цела кариера, праг од 130 настапи, и табелата за 2025/26**

Date: 2026-08-18 · Executor: Claude Code (local) · Branch: `phase-3.30-representation-and-thresholds`

**Outcome (one line):** Three owner decisions that had been open for phases are executed — the internationals' section now promises only what the sources can back, the appearances table is a table rather than a list of 116, and the last season without a final table has one — at the cost of **eleven** authorised Sanity writes, every value supplied rather than derived.

---

## 1. What shipped (plain language)

**The internationals' numbers stopped promising a whole career.** The field was built to hold every club plus the national team. Those totals turned out to be unsourceable — Transfermarkt refuses automated reads and Wikipedia's totals are league-only, so the two standard sources disagree about _what they are counting_, not about the values. What both Ace's biographies and his book agree on is national-team caps. So the heading now says **„За репрезентацијата"** and the number under it is caps. Ten men have figures for the first time; before today the section rendered on no page at all.

**„Најмногу настапи" became a table.** It was cut at 46, which left 116 of 119 players — a list nobody scans. The owner picked 130 and it now holds **48**.

**Season 2025/26 has a final table row.** It is the only row in the archive not transcribed from Ace's book, because no table image exists for it. It was derived from the season's own 30 archived matches, and the season's own story text — Ace's writing — states the same 5th place, 58 points and 57:21 independently.

---

## 2. Definition of Done

### Verified here

- ✅ **`npm run build` passes from a clean tree.** `rm -rf .next` first, so no stale data cache (the failure mode where a green build renders months-old Sanity content). **Generating static pages (329/329)** — **identical to 3.29's measured baseline of 329.** Never compared to 659, which is an artefact count (D-3.29-3).
- ✅ **`tsc --noEmit` exit 0. ESLint clean. Prettier reported all five edited source paths `(unchanged)`** — formatting was already correct; only the paths this phase edited were passed, never `src/**`.
- ✅ **Zero new npm dependencies. No new `brand.md` token.** No colour, type, spacing or radius value introduced.
- ✅ **Exactly ELEVEN Sanity documents written.** Listed in §4.
- ✅ **No schema field added, removed, renamed or retyped.** `git diff src/sanity/` is **three titles and three descriptions**. ⚠️ Three descriptions, not the two the DoD anticipated — see §3 (D-3.30-5).
- ✅ **Schema deployed to workspace `belasica-v2`** and **read back with `workspaceName` passed explicitly** (the tool defaults to a stray `default` workspace carrying a two-parts-old model). All eleven person fields intact; `nationalStats` still `{appearances, goals, sourceNote}`.
- ✅ **„Цела кариера" appears nowhere in shipped code** — `grep` over `src/**/*.{ts,tsx,css}` returns **0**, and **0** pages of built HTML contain it. ⚠️ It survives in **5 files under `src/_project-state/`** — `decisions.md`, `current-state.md` and three completion reports. Those are append-only records of what was true; erasing them would destroy the audit trail the DoD's own decision log depends on. A literal "nowhere in `src/`" is therefore unachievable without breaking `CLAUDE.md`.
- ✅ **`/statistika` appearances table renders 48 rows** — 49 `<tr>` in the built HTML (1 header + 48) and 48 `tbody tr` in the live DOM.
- ✅ **Sorting works on all four columns**, each flipping `aria-sort` and reordering: Играч → Александар Коцев; Настапи → Петар Андреев; Голови → Љупчо Мафков; Години → Митко Џорлев. Row count stays 48 throughout.
- ⚠️ **Keyboard: proven by construction, not by a delivered keystroke.** All four controls are native `<button type="button">`, `tabIndex 0`, sitting **consecutively in the document tab order** (positions 49–52), with a **visible 3px solid `rgb(238,122,22)` focus ring**. A real `Return` press could not be delivered: the in-app browser reports `visibilityState: "hidden"`, a known harness limitation. Since a native button's Enter/Space activation is browser default and the click handlers are verified working, activation follows — but **the final keystroke is untested and a human should press it.**
- ✅ **The 2025/26 row renders** at `/arhiva/2025-26`: „Табела · Пласман **5** · Одиграни **30** · Победи **18** · Нерешени **4** · Порази **8** · Дадени голови **57** · Примени голови **21** · Бодови **58**".
- ✅ **All three pre-write verifications reported** — §5.
- ✅ **No other season's `finalTable` changed.** Count **92 → 93** (exactly one added); **1992/93 still reads `points: 34`**, confirmed _after_ the write.
- ✅ **All ten carry appearances, goals and `sourceNote`.** The recorded zeros are stored as real `0` and **render as 0**, verified on the live page: Роберт Попов reads „ЗА РЕПРЕЗЕНТАЦИЈАТА · НАСТАПИ 17 · **ГОЛОВИ 0**". Балдовалиев on the same build shows „ГОЛОВИ 1", so this is the `!= null` guard working, not a blanket zero.
- ✅ **No bio conflict was found, so nobody was skipped** — §5.
- ✅ **`careerStats` untouched** — counted before _and_ after: **132** people with `careerStats`, **119** with `careerStats.appearances`. Unchanged.
- ✅ **No `role` and no `legendRank` changed** — `legendRank` on **138**; roles player **152**, trainer **68**, president **29**; published persons **210**. All match `docs/data-shapes.md`.
- ✅ **Every new or changed Macedonian string listed verbatim** — §6.
- ✅ **Zero horizontal overflow on all 12 combinations** — `/statistika`, `/legendi`, `/arhiva/2025-26` × 375 / 768 / 1280 / 1408 px. `scrollWidth === clientWidth` at every one.
- ✅ **Record files updated** per `syncing-project-state` and `logging-project-decisions`; this report filed.
- ✅ **One PR from `phase-3.30-representation-and-thresholds` → `main`.** Never committed to `main`. No secrets — the repo is public and the dataset is public-read with no token.

### Owed to Lazar / Ace

- **OV-74** — native read of the new „За репрезентацијата" strings and the `sourceNote`.
- **OV-75** — Ace confirms 48 rows where he asked for 47.
- **OV-77** — Ace confirms the derived 2025/26 record, the only row not from his book.
- **OV-78** — Ace decides on the four internationals with no person document.
- **OV-79** — Ace's list of players 135–161, which **blocks 3.31**.
- **OV-72, OV-73** — carried in from the Cowork report now that it is filed: the 2022/23 photo, and the 24 coaches with no span.
- **OV-76** — the book title is punctuated three ways across the project, two of them now shipped.
- **OV-80** — `file-map.md` is 10 completion reports behind the directory.

---

## 3. Decisions logged

`D-3.30-1` … `D-3.30-7`, plus the five **`D-3.25-*`** reserved IDs consumed by the Cowork report (see §7). Full text in `decisions.md`.

| ID       | In one line                                                                                         |
| -------- | --------------------------------------------------------------------------------------------------- |
| D-3.30-1 | The internationals' figures became national-team caps, because whole-career totals are unsourceable |
| D-3.30-2 | The cut is 130 (48 rows), and 47 is unreachable at any threshold                                    |
| D-3.30-3 | The 2025/26 row was derived, and the season's own story corroborates it to the point                |
| D-3.30-4 | Eleven documents written, values applied not derived, bound verified from both ends                 |
| D-3.30-5 | Two Studio descriptions beyond the three named fields were corrected                                |
| D-3.30-6 | The phase started with precondition 2 unmet, on Lazar's approval; the report then arrived           |
| D-3.30-7 | The book title is punctuated three ways; the new string follows the brief                           |

**The one deviation worth reading: D-3.30-5.** The DoD says `git diff src/sanity/` shows only the three titles and their descriptions. Two _other_ descriptions became false the instant `nationalStats` was relabelled — `careerStats` told the editor „За целата кариера постои полето подолу", pointing at a field that no longer holds a whole career; and `sourceNote`'s worked example was „Според Трансфермаркт, 2026“, the very source Phase 3.25-Cowork had rejected as unreachable. Shipping either would have published a Studio string that is knowably wrong to the one person it is written for. Both were corrected. **No field definition was touched.**

---

## 4. The eleven documents written

Every one patched then published (a patch alone writes only a draft).

| #   | Document ID                      | What changed                                 |
| --- | -------------------------------- | -------------------------------------------- |
| 1   | `season-2025-26`                 | `finalTable` — one row appended (was absent) |
| 2   | `person-goran-pandev`            | `nationalStats` 122 / 38                     |
| 3   | `person-aco-stojkov`             | `nationalStats` 42 / 5                       |
| 4   | `person-goran-popov`             | `nationalStats` 46 / 2                       |
| 5   | `person-igor-gjuzelov`           | `nationalStats` 18 / 1                       |
| 6   | `person-robert-popov`            | `nationalStats` 17 / **0**                   |
| 7   | `person-panche-stojanov`         | `nationalStats` 12 / **0**                   |
| 8   | `person-deni-masev-dancho-masev` | `nationalStats` 5 / **0**                    |
| 9   | `person-zoran-baldovaliev`       | `nationalStats` 4 / 1                        |
| 10  | `person-nikola-tanushev`         | `nationalStats` 4 / **0**                    |
| 11  | `person-toni-banduliev`          | `nationalStats` 4 / **0**                    |

**No twelfth.** The four internationals with no document — Васил Рингов, Благој Георгиев, Сашко Пандев, Дејан Илиев — were **not created** (OV-78).

⚠️ **Measured correction to the brief.** It states seven of the ten carry a recorded zero for goals. It is **five** — Роберт Попов, Панче Стојанов, Дени Масев, Никола Танушев, Тони Бандулиев. The values themselves are exactly as the brief gave them; only the count of zeros differed.

---

## 5. The pre-write verifications

### Task 3 — the 2025/26 table

**1. `finalTable` was absent.** Queried immediately before the write: `finalTable` was `null` on `season-2025-26`, and 92 of 96 seasons carried one. Nothing was appended to an existing row. After the write: **93**.

**2. The story states it.** Verbatim, the closing sentence of `season.story`:

> „Беласица ја заврши сезоната на 5-то место, со 58 бода и гол-разлика 57:21."

**3. It is a 3-point era, and the text is what proves it.** `18×3 + 4 = 58` — the story's own figure. At two points it would be `18×2 + 4 = 40`. The older rows were **not** touched: 1992/93 still stores `points: 34` for `12 wins, 10 draws` (`12×2 + 10`), verified after the write.

**The derivation, independently.** All 30 archived matches parsed — 15 home, 15 away:

|                          | W      | D     | L     | GF     | GA     |
| ------------------------ | ------ | ----- | ----- | ------ | ------ |
| Есенска полусезона (15)  | 10     | 1     | 4     | 33     | 14     |
| Пролетна полусезона (15) | 8      | 3     | 4     | 24     | 7      |
| **Total (30)**           | **18** | **4** | **8** | **57** | **21** |

Every figure in the written row is reproduced by the matches, and the points and position are corroborated by Ace's own text.

### Task 4 — the ten biographies

Every bio was read for a stated cap figure before writing. **None conflicts, so nobody was skipped.**

| Person            | Written  | The bio says                                                                          |
| ----------------- | -------- | ------------------------------------------------------------------------------------- |
| Горан Пандев      | 122 / 38 | „рекордер по бројот на настапи за репрезентацијата (122) и постигнати голови (38)" ✅ |
| Ацо Стојков       | 42 / 5   | „за сениорската има 42 настапи и 5 голови" ✅                                         |
| Горан Попов       | 46 / 2   | „во периодот од 2004 до 2014 настапува на 46 натпревари и дава 2 голови" ✅           |
| Игор Ѓузелов      | 18 / 1   | „има одиграно 18 натпревари (период 1998-2003) и постигнато 1 гол" ✅                 |
| Роберт Попов      | 17 / 0   | „македонски репрезентативец на 17 натпревари (2001-2009)" ✅ _(goals not stated)_     |
| Панче Стојанов    | 12 / 0   | „Во следните 12 месеци ќе одигра 12 натпревари за Македонија" ✅ _(goals not stated)_ |
| Дени/Данчо Масев  | 5 / 0    | „поранешен репрезентативец на Македонија (5 натпревари)" ✅                           |
| Зоран Балдовалиев | 4 / 1    | „репрезентативец на Македонија (4 натпревари/1 гол)" ✅                               |
| Никола Танушев    | 4 / 0    | „Ќе одигра вкупно 4 натпревари против Финска, Албанија, Оман и Бахреин" ✅            |
| Тони Бандулиев    | 4 / 0    | „За сениорската репрезентација на Македонија има одиграно 4 натпревари" ✅            |

Six state the figure word for word; four are silent on the goals rather than contradicting them. This is the same set of numbers the Cowork report lists in its §7, reached from the same sources — an independent corroboration nobody planned.

---

## 6. Every new or changed Macedonian string (for Lazar's native read — OV-74)

**On the site**

| Where                        | Before                                                                    | After                                                                  |
| ---------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Person page, career group    | „Цела кариера"                                                            | **„За репрезентацијата"**                                              |
| Legend card, Репрезентативци | „Цела кариера: 122 настапи, 38 голови"                                    | **„За репрезентацијата: 122 настапи, 38 голови"**                      |
| `/statistika` coverage line  | „…играчите со **46** или повеќе внесени првенствени настапи за Беласица." | „…играчите со **130** или повеќе…" _(interpolated — moved on its own)_ |

**Written to all ten people, identical `sourceNote`:**

> Настапи и голови за македонската репрезентација, според биографиите и книгата „ФК Беласица — гордоста на Струмица“.

**In Studio**

| Field                       | Before                                                                                                                                          | After                                                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `nationalStats` title       | „Статистика од целата кариера"                                                                                                                  | **„Статистика за репрезентацијата"**                                                                                                 |
| `nationalStats.appearances` | „Настапи (цела кариера)"                                                                                                                        | **„Настапи за репрезентацијата"**                                                                                                    |
| `nationalStats.goals`       | „Голови (цела кариера)"                                                                                                                         | **„Голови за репрезентацијата"**                                                                                                     |
| `nationalStats` description | „Настапи и голови од ЦЕЛАТА кариера — сите клубови и репрезентацијата заедно. Ова НЕ е статистиката за Беласица. Се пополнува од јавни извори." | **„Настапи и голови САМО за македонската репрезентација. Ова НЕ е клупска статистика — ниту за Беласица, ниту за другите клубови."** |
| `careerStats` description   | „…За целата кариера постои полето подолу."                                                                                                      | **„…За репрезентацијата постои полето подолу."**                                                                                     |
| `sourceNote` description    | „…на пр. „Според Трансфермаркт, 2026“…"                                                                                                         | **„…на пр. „Според биографиите и книгата на Аце Стојанов“…"**                                                                        |

⚠️ **OV-76:** the book's title is now spelled with an **em dash** in the ten `sourceNote`s (the brief's wording) and with an **en dash** in `src/content/razno.ts:98`, while `facts.md` uses a plain hyphen. Three spellings, two of them shipped. This phase followed the brief rather than silently normalising, and raised it instead.

---

## 7. Deviations, and the precondition

**Precondition 2 was false at session start.** The brief forbids starting until Phase 3.25-Cowork's report has landed and `D-3.25-1, -3, -4, -5, -6` are logged. Neither was true: the report existed nowhere (OV-69, D-3.29-1) and the five IDs stood reserved. **This was reported and the phase stopped for a decision; Lazar chose to proceed** (D-3.30-6). Nothing in the five tasks depended on the report — verified before continuing — and the brief's own instruction that this phase uses `D-3.30-*` already protected the reserved IDs.

**Partway through, Lazar supplied the report.** It is filed **verbatim** at `completions/Part-3-Phase-25-Cowork-Completion.md`, and its five reserved IDs are logged in `decisions.md` from its own §3. **OV-69 is RESOLVED.** The reservation note in the 3.25-Cowork section carries a dated resolution line appended beneath it rather than a rewrite, keeping the append-only rule.

⚠️ **The report independently corroborates two of this phase's tasks** — its §7 lists the same ten cap figures the brief supplies, and it recommends option (b) for the 2025/26 table, which is exactly the derivation D-3.30-3 performed. Its own open items are now on the register as **OV-72** and **OV-73**.

⚠️ **The only change made to the supplied text was Prettier normalising its list markers from `*` to `-`** (45 bullets), so the file passes the repo's format check. Every word, number, document ID and finding is as supplied.

⚠️ **Two artefacts in the supplied text were preserved rather than corrected**, since it was to be filed verbatim: „Пinda" appears with Latin characters where „Пинда" is meant, and one heading reads „Task 2 (Task):".

**Other deviations:** D-3.30-5 (two extra Studio descriptions); the „seven zeros" → **five** measurement correction; and „Цела кариера" surviving in five `_project-state` records, which are append-only history.

---

## 8. Verification evidence

| Check                              | Before                                         | After             |
| ---------------------------------- | ---------------------------------------------- | ----------------- |
| Build pages                        | 329                                            | **329**           |
| `careerStats` (people)             | 132                                            | **132**           |
| `careerStats.appearances`          | 119                                            | **119**           |
| Published persons                  | 210                                            | **210**           |
| `legendRank`                       | 138                                            | **138**           |
| Roles player / trainer / president | 152 / 68 / 29                                  | **152 / 68 / 29** |
| `nationalStats`                    | 0                                              | **10**            |
| Recorded `goals: 0`                | 0                                              | **5**             |
| Seasons with `finalTable`          | 92                                             | **93**            |
| 1992/93 `points`                   | 34                                             | **34**            |
| Appearances table rows             | 116                                            | **48**            |
| „Цела кариера" in shipped code     | 4 exact (9 with the lowercase Studio variants) | **0**             |

---

## 9. What is now possible that was not

Ten of the club's best-known names finally carry a number on the page that is _about them_ rather than about their two seasons in Strumica — and it is a number that says what it means. „Најмногу настапи" can be read at a glance. And 2025/26 has a final-table row built from the club's own results and checked against Ace's own sentence about it — taking the archive from 92 seasons with a table to **93 of 96**. ⚠️ Three seasons still have none, and this phase did not touch them.
