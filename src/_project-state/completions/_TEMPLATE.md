# Part X · Phase YY · <Role: Code / Design / Cowork> — Completion Report

> Save as: `src/_project-state/completions/Part-X-Phase-YY-Completion.md`. One phase = one report = one commit. Filing this report and syncing `current-state.md` is what closes the phase. Copy the Definition of Done from the phase brief and verify each item against the actual result — run the command, open the URL, load the page. Never write a checkmark from memory. Plain factual language; no marketing tone. Never paste secrets — say where they were placed.

**Date:** YYYY-MM-DD · **Executor:** <which Claude, which machine> · **Outcome (one line):** <what now exists that didn't>

## 1. What shipped (plain language)
2–3 sentences Lazar can read without opening the code. What is now possible.

## 2. Definition of Done — verified-here vs owed-to-Lazar
Restate every DoD item from the brief, split into the two lists the brief defines.

**Verifiable by executor:**
- ✅ <item> — evidence: <command output / file path / URL / screenshot ref>
- ⚠️ <item> — done except <gap>, because <reason>
- ❌ <item> — not done, because <reason>

**Owed to Lazar (goes on the owed-verification register):**
- <item> — how Lazar verifies it: <exact steps / URL / 5-item checklist>

## 3. Decisions I made during this phase
Anything the brief did NOT spell out: off-spec change, library pick, scope cut, workaround.
For each: ID `D-<phase>-<n>` · what I decided · why · alternative rejected · logged in `decisions.md`: yes/no.
If none, write "None." Never leave blank. (Silent decisions are the failure mode this section exists to prevent.)

## 4. Deviations from the brief
Anything not done, deferred, or changed vs the brief — and why. "None" if none.

## 5. Changed files / deliverables
- Code: files added/edited/deleted (short list) · branch `phase-X.YY-<slug>` · PR link.
- Design: handover path in `docs/design-handovers/` and what it contains.
- Cowork/manual: what was created or configured and WHERE it lives (accounts, dashboards, settings). Secrets: location only, never the value.

## 6. State updates done (mandatory for Code phases)
- [ ] `current-state.md` overwritten to match reality, incl. registers
- [ ] `NEXT:` line set to: `<value>`
- [ ] `file-map.md` synced (if files added/renamed/deleted)
- [ ] `00_stack-and-config.md` appended (if any dependency added/upgraded — exact pins)

## 7. Risks, surprises, what the next phase needs to know
New blockers, things that surprised you, anything the next executor must know.

## 8. What's now possible that wasn't before
One forward-looking line.
