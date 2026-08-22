# Distinct legend ranks — completion report

**Branch:** `distinct-legend-ranks` · **Not a numbered phase.** No brief; the instruction was the
owner's, in chat: „there are 3 players with the rank 135 fix all those mistakes and make it so
every player 1-163 has a different rank."

---

## 1. What shipped

Every one of the **162 ranked players now carries a rank of his own.** 41 documents changed; 121
were not touched. **No player's position on the ladder moved** — the rendered sequence is identical
before and after, and only the printed number differs.

## 2. What the defect actually was

The report was right that something looked wrong and wrong about what it was.

- **Four** men sat at 135, not three: Атанас Малинов - Пата, Димитар Трендов - Цацко, Живко
  Јурчевски, Миле Боев — **all on 60 настапи**.
- They were not isolated. There were **29 tie groups covering 70 of the 162 ranked players**
  (55×2, 58×4, 113×3, 120×4, 131×4, 135×4, 141×3, 150×3, 154×3, and 20 more). **Every group was a
  set of men with identical appearance counts.**
- The numbering was **internally perfect.** Аце's list is competition-style („1224"): a group of
  four at 135 is followed by 139, a group of three at 150 by 153. `rank + group size == next rank`
  was checked at **all 121 rank values** and held everywhere, with one exception — the single
  1-place gap at **161**, which Phase 3.33 deliberately reserved for З. Ивановски (OV-81).

So there was **no data-entry mistake to fix.** It was Аце's own page, faithfully entered. The 3.33
completion report predicted this bug report verbatim: „Expect this to be reported as a bug by
anyone reading the ladder cold."

## 3. Decisions

- **D-RANKS-1** · Every ranked player carries a unique rank; the order within a former tie is
  **DERIVED** · logged in `decisions.md`: **yes.**

⚠️ **The recommendation was the opposite of what shipped.** Rendering the tie _as_ a tie („135–138."
on all four) fixes the thing that reads as broken and invents nothing. The owner was shown the full
tie inventory and the content-truth objection, and **chose distinct ranks.** That is his call and it
is recorded as his.

## 4. What is now derived rather than stated

⚠️ **The archive asserts an ordering Аце never gave.** Within each former tie the sequence is
alphabetical — a display convention promoted to stored data, the same class of figure as Коцев's
53rd place, which `facts.md` already flags.

**What is NOT derived:** the _set_ of numbers each group holds. Малинов, Трендов, Јурчевски and
Боев still occupy **135–138 between them**, exactly the span Аце's numbering already reserved for
them. Nothing was invented about who is faster than whom on the ladder; only about who prints
first inside a group he already tied.

On the record in `facts.md` → „Рангирање — прекинати изедначувања". **One message from Аце replaces
it with the real order.**

## 5. Method

- Ordering reproduced **exactly** from `compareByLegendRank`: `legendRank`, then
  `name.localeCompare(name, "mk")` — run in Node so the ICU collation is the same one the site uses.
- New rank = position in that sequence, **skipping 161** (still reserved for З. Ивановски).
- Two guards before the write: **0 draft ranked persons** (a draft would shadow the write), and all
  41 source ranks **re-confirmed live** against the plan immediately before committing.
- Dry run first; then one transaction, `LPc3Jmv1ULU5uXF5HNqryf`.
- **Zero moves into an occupied slot and zero backwards moves** — every target was already empty
  because Аце's numbering had reserved it. No transient duplicate could exist, and **write order was
  irrelevant**, unlike 3.33.
- Written with the `SANITY_API_WRITE_TOKEN` already in the gitignored `.env.local`, per D-3.33-5.
  Every script lived in the session scratchpad, **outside the repository**; `git diff` carries
  neither token nor script.

## 6. Verification

**Live, re-queried after the write (not read back from the plan):**

| check                        | result                                    |
| ---------------------------- | ----------------------------------------- |
| ranked people                | **162**                                   |
| distinct `legendRank` values | **162**                                   |
| duplicate ranks              | **NONE**                                  |
| min / max                    | **1 / 163**                               |
| empty slots in 1–163         | **[161]** — the reserved one, and only it |

**Built HTML, from a deleted `.next`** (a stale data cache renders months-old content on a green
build — see `belasica-stale-data-cache-build`):

- **162 rank labels rendered, 162 distinct, no duplicates.**
- **Ascending in DOM order** — the printed numbers and the visual order agree.
- **161 is the only gap.**
- The 135 group renders **135 · 136 · 137 · 138**, and the list resumes at **139**.

`lint` / `tsc` / `build` all green from a deleted `.next`. **350 pages** — unchanged from 3.33.

## 7. Also fixed in the same pass

- **Studio uniqueness rule** on `legendRank`, so the duplicate cannot be re-entered by hand.
  ⚠️ **It does not bind the HTTP mutate API** — schema validation does not run on scripted writes,
  so any future bulk write must re-check uniqueness itself. The comment says so.
- **Stale comment counts corrected.** `person.ts` and `people.ts` still described a list of
  **eighty** with **fifteen** (and elsewhere **nine**) range-valued counts. Live: **162** ranked,
  **23** ranges. Stale since 3.33 extended the ladder.
- **`docs/data-shapes.md` re-synced** — `legendRank` **138/210 → 162/231**, the Играчи band
  **138 → 162**, the heading **„210 личности" → „231 личности"**.

## 8. Not touched, deliberately

- **`/statistika`'s tables.** `AceTables.tsx` and `SourceTable.tsx` also speak of „shared ranks"
  (three players tied at 8, two at 22) — that is **Аце's scorer data, a different dataset**, hard
  coded, and outside both the request and this change.
- **Rank 161.** Still empty, still reserved. Filling it would only shuffle Хаџиосмановиќ and
  Николов down and open 163 instead — no gain, and it would destroy the slot OV-81 is waiting on.

## 9. Eyeball checklist for Lazar

1. `/legendi` → Играчи — scroll to **135** and confirm four consecutive numbers, four different men,
   all still showing **60 настапи**.
2. Confirm the **order** of those four is unchanged from what you remember — only the numbers moved.
3. Check **158 → 159 → 160 → 162** at the tail: **161 is skipped on purpose** and З. Ивановски goes
   there the day Аце gives his first name.
4. Spot-check any former tie you know by eye (e.g. **120–123**, four men on 68) — same men, same
   order, distinct numbers.
5. Read `facts.md` → „Рангирање — прекинати изедначувања" and decide whether to put the alphabetical
   ordering to Аце. **That is the one thing on the ladder that is now ours and not his.**

## 10. Open

- **OV-81** unchanged: З. Ивановски's first name. He belongs at **rank 161**, 48 настапи, 2019–2023.
- **New, owed to Аце:** the true order inside the 29 former tie groups, if he has one.
