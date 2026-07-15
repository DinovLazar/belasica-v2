# Ace demo — walkthrough script

> For **Lazar** to run the sit-down with Ace on the live site. Spoken lines are in
> Macedonian so you can say them as-is. Capture what Ace says into
> [`feedback.md`](./feedback.md) as you go (his words, not paraphrase).
> Filed for Phase 1.06 (Part 1 gate).

## Before you sit down (5 min)

- **Load the 5 legend portraits first** (Phase 1.06 · Task 2) so the Legends
  section isn't showing grey `[PLACEHOLDER: портрет]` frames during the demo.
  See [`../../src/_project-state/current-state.md`](../../src/_project-state/current-state.md)
  → "Remaining human steps" for the exact Studio steps. Reload `/`, wait ~a minute
  (ISR revalidates every 60s), confirm faces show.
- Open the site fresh in a normal browser (not incognito needed): **https://belasica-v2.vercel.app**
- Have this file and `feedback.md` open on the side to type into.

## The one line to open with

> „Ова е неофицијална архива за ФК Беласица — сè што гледаш е вистинска содржина
> што ние ја внесовме, не е официјалната страница на клубот. Сакам да ја поминеме
> заедно и да ми кажеш што мислиш."

## Walk the page top → bottom

Scroll slowly. At each stop, point at the thing in **bold** and ask the question.

1. **Hero (насловна фотографија + „ФК Беласица")**
   - Say: „Ова е првото што го гледа човек. Фотографијата е од архивата."
   - Ask: „Дали оваа фотографија ти се допаѓа како насловна, или би ставил друга?"

2. **Интро — „За архивата"** (описниот пасус за клубот)
   - Say: „Овој текст го опишува клубот — годината, лигите, титулата, стадионот."
   - Ask: „Дали нешто тука е погрешно или сакаш да се дополни?"
     *(Note anything factual he corrects → `feedback.md` → „Anything factually wrong".)*

3. **Издвоена сезона — „Сезона 1992/93"**
   - Say: „Вака ќе изгледа секоја сезона — фотографија, наслов, кратка приказна и
     линк до целата сезона."
   - Ask: „Која сезона би сакал да биде прва/издвоена? Која е најважната за тебе?"

4. **Легенди**
   - Say: „Овие се личностите — играчи, тренери. Секоја има своја картичка."
   - Ask: „Кого уште сакаш да го додадеме? Дали редоследот е во ред?"

5. **Галерија**
   - Say: „Фотографии од архивата, со опис и година."
   - Ask: „Дали имаш повеќе фотографии што сакаш да ги видиш тука? Кои?"

6. **Подножје (footer) — OV-3, ask explicitly**
   - Point at the footer line and read it out:
     > „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната
     > страница на клубот."
   - And the small label above it: **„неофицијална архива"**.
   - Ask: „Дали ова е точната формулација што сакаш да пишува? Ако не, кажи ми
     точно како треба да гласи."
   - **Record his exact answer** in `feedback.md` → „Footer wording (OV-3)". This
     is what resolves OV-3 — entering the current text into Studio does **not**
     count; only Ace confirming/correcting the wording does.

## Wrap-up questions (open-ended — let him talk)

- „Кога ќе ги правиме другите страници — Архива, Сезони, Легенди, За нас, Контакт
  — што е најважно за тебе да го има таму?"
  *(→ `feedback.md`: split into „Archive & Season pages" (2.02) and „Legends / About / Contact" (2.05).)*
- „Дали фали нешто што за тебе е важно, а го нема?"

## Opportunistic (only if Ace offers — optional, not required this phase)

These formally clear in Part 3, but if they come up naturally, jot them down:
- His **public name** + a short About text (PL-1).
- His **father's name + playing years** (PL-2).
- A **contact email** for the form (PL-3).

Don't push for these — they have their own phase. Just capture if volunteered.

## After the sit-down

- Make sure every heading in `feedback.md` has Ace's actual words (or „—" if he
  had nothing).
- Commit `feedback.md`. Phases **2.02** and **2.05** read it before they open.
