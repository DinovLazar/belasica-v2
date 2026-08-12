# facts.md — Belasica-V2

**The rule: nothing appears on the site unless it is VERIFIED here.** This file is the only legal source for factual claims rendered on the site. A fact missing or UNVERIFIED → the page ships a visible `[PLACEHOLDER: what's needed]`, logged in the placeholder register in `src/_project-state/current-state.md`.

Verification source format: (who, where, date).

## Naming & identity

- Club name as written on the site: **FK Belasica** — VERIFIED (owner, intake, 2026-07-14)
- Cyrillic rendering for on-page use: **ФК Беласица** — VERIFIED (owner, chat, 2026-07-15). Resolves OV-2; this is the exact on-page wordmark rendered site-wide (header, footer, hero).
- Site self-description: **unofficial archive** (неофицијална архива) — role + wording VERIFIED (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-3. Confirmed footer wording (exact, as rendered): label „неофицијална архива"; line „Ова е неофицијална архива посветена на ФК Беласица. Не е официјалната страница на клубот." Ace confirmed this current wording as correct — no change.
- Legal-page publication date (the „Последно ажурирање" line on `/pravni-informacii`): **16 август 2026** — VERIFIED (owner, chat, 2026-07-31). Rendered verbatim as supplied; it is the date the owner assigned to the legal text, not a computed or build-time value.
- Club founding year: UNVERIFIED — pull from Drive material, confirm with Ace
- ~~The site never mentions Ace's book~~ — **SUPERSEDED (owner, chat, 2026-08-08).** Original entry: „The site never mentions Ace's book — VERIFIED standing rule (owner, intake, 2026-07-14)". The „За нас" copy the owner supplied on 2026-08-08 **names the book in its first sentence** — „…и книгата „ФК Беласица - гордоста на Струмица" е Аце Стојанов." The later, more specific instruction from the same person wins; the original line is kept, marked and dated so the month in which the site said nothing about the book stays readable. The book is named on `/za-nas` and nowhere else. See D-3.15-8.
- Footer copy posture (exact, as rendered): „Текстовите и фотографиите објавени на оваа страница не смеат да се преземаат, копираат, објавуваат или користат на друго место без претходна дозвола од авторот." — **VERIFIED** (owner, chat, 2026-08-08). Rendered verbatim in the footer's bottom bar on every `(site)` route, from `CONTENT_PERMISSION_NOTICE` in `src/lib/facts.ts`. ⚠️ It asks for **permission**; it does **not** claim ownership — the archive publishes material whose rights sit elsewhere, and `/pravni-informacii` §5 promises an unconditional takedown on request. Do not rewrite it as a copyright claim (D-3.15-1). Still owed: a native-speaker read (OV-38).

## People (About us)

- Ace's public name: **Аце Стојанов** — **VERIFIED** (owner, chat, 2026-08-08). Author of this site's texts and its editor, of the Facebook profile *FK Belasica 1956-2006*, and of the book „ФК Беласица - гордоста на Струмица". Rendered on `/za-nas` from `ABOUT_AUTHOR_PARAGRAPH`. **Clears PL-1.** *(Prior status: UNVERIFIED — deferred by owner to the About-page phase (3.03).)*
- Ace's father: **Томе Стојанов (1953–2020)** — **VERIFIED** (owner, chat, 2026-08-08). Former ФК Беласица player, **328 првенствени натпревари, во 14 сезони**. Rendered on `/za-nas` from `ABOUT_DEDICATION_PARAGRAPH`, with his name linked to `/legendi/tome-stojanov`. **Clears PL-2.** ✔️ Cross-checked and consistent with the archive's own data: `person-tome-stojanov` carries `careerStats.appearances` = **328** and `playingYears` = **1976–1990** (14 seasons), and is ranked #5 in the book. *(Prior status: UNVERIFIED — deferred to 3.03.)*
- „За нас" body copy: supplied verbatim by the owner (chat, 2026-08-08), in Ace's own first person. **VERIFIED and rendered byte-for-byte** — no humanizer pass, no restructuring (the brief forbids it explicitly). Typography fixed at supply time: Macedonian quotes „…" around the book title (D-3.07-9), the **author's own hyphen** inside the title, en dash in „1953–2020", and „FK Belasica 1956-2006" kept as a Latin-script proper name. Held in `src/lib/facts.ts`, not in the page.
- Club history length as stated in the About copy: **104 години историја** — VERIFIED as the author's own wording (owner, chat, 2026-08-08). Consistent with a 1922 founding (2026 − 1922 = 104); the founding year itself is still UNVERIFIED as a separate fact below.

## Contact & links

- Contact email: **info@belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Renders as a `mailto:` on three surfaces (footer „Контакт" column, `/kontakt` direct-contact block, `/pravni-informacii` §10) from the single constant `CONTACT_EMAIL` in `src/lib/facts.ts`. Clears PL-3 and the email half of PL-9. *(Prior status: UNVERIFIED — deferred to 3.03.)* ⚠️ Not yet confirmed as the **form destination** — the Formspree endpoint (PL-14) is still unset and is a separate config step.
- Facebook: **https://www.facebook.com/share/1FK4bKq9wx/** — **VERIFIED** (owner, chat, 2026-08-08). The profile *FK Belasica 1956-2006*, **authored and edited by Аце Стојанов** — the same person who writes this site and the book. Rendered from `FACEBOOK_URL`. *(Prior status, 2026-08-02: recorded as a third-party **fan page**, labelled „Фејсбук страница на навивачите" and scoped to the footer only. The About copy the owner supplied on 2026-08-08 states the authorship outright, so that framing is retired — D-3.15-2, superseding D-3.12-6.)*
- Instagram: **https://www.instagram.com/belasica1956.2006** — **VERIFIED** (owner, chat, 2026-08-08). Same identity as the Facebook profile, also authored/edited by Аце Стојанов. Rendered from `INSTAGRAM_URL`. ⚠️ The address as supplied carried `?utm_source=qr&igsh=N2MxeWw4OHRocGxh`; that is a **QR-scan tracking payload, not part of the address**, and is stripped (D-3.15-3). The bare URL resolves to the same profile.
- Both profiles render as icon links under „Следете нѐ" on **two** surfaces — the footer and `/kontakt`'s direct-contact block — from the shared `SocialLinks` component. **Clears PL-15 completely, on both surfaces.** These are the site's only two external links.
- Domain: **www.belasicahistory.mk** — VERIFIED (owner, chat, 2026-07-31). Rendered as plain text in §1 of `/pravni-informacii`. ⚠️ **Recorded only — the cutover has NOT happened.** `metadataBase`, `robots.ts` and `sitemap.ts` all still hardcode `https://belasica-v2.vercel.app`; moving them is its own phase (3.07 scope explicitly excluded it). *(Prior status: UNVERIFIED — purchased at Phase 3.04.)*

## Social proof

- Reviews, awards, certifications, testimonials: none claimed at intake — the site makes no such claims. VERIFIED as "none" (owner, intake, 2026-07-14)

## Content provenance

- All historical content (texts, photos, stats) originates from Ace's Google Drive — VERIFIED (owner, intake, 2026-07-14)
- Photo publishing rights: VERIFIED — Ace confirmed he holds the right to use all photos in the Drive (Ace, sit-down via Lazar, 2026-07-16). Resolves OV-1. ⚠️ **Caveat on record:** the P0.1 Drive audit found most archive photos are third-party screenshots (Facebook / Messenger / newspaper); "right to use" for those is legally nuanced. The specifics (ideally a written confirmation) should be settled before the bulk 2.09 ingestion is published — `docs/content-ingestion-plan.md` §5 keeps ingested photos unpublished until publish is explicitly cleared. (The 8 already-published demo photos are Ace's own.)
- Photo publishing rights — public-exposure confirmation (closes OV-RIGHTS): VERIFIED — the **owner confirms the project holds the rights to all archive photos, and all 889 published photos may remain public** (owner, via Lazar / the Phase 2.08 orchestrator decision, 2026-07-21). This resolves the OV-RIGHTS item opened at 2.09-Run, where 881 mostly-third-party-screenshot photos had been published (D-2.09R-2) ahead of a written rights settlement. Rejected at this phase and recorded for the trail: un-publishing the 881 back to drafts, and restricting the homepage to the 8 Ace-owned demo photos — both declined by the owner. ⚠️ **Record lag on file:** every one of the 881 ingested photo documents still carries a `provenance` string reading „…Потекло и права за објавување НЕПОТВРДЕНИ…" (unconfirmed). That per-document text now **lags** this owner confirmation; a bulk `provenance` rewrite is a separate ingestion-tooling job (not Phase 2.08), so until it runs the document-level provenance understates the confirmed rights.

## Historical facts (seasons, players, matches, stats)

Populated during Part 2 ingestion. Rule for this category: a historical fact is VERIFIED when it is present in Ace's Drive material (source: "Drive, <file/folder>, <date checked>"). Facts found only on the open web and not in the Drive are UNVERIFIED until Ace confirms them.

### Настапи — три исправки (appearance corrections)

Three players' appearance totals were corrected by Ace — VERIFIED (Ace, chat via Lazar, 2026-08-11). These supersede the figures the book prints, and they move the men in the all-time ranking on `/legendi`:

- **Стефан Сулев** — **261** настапи (was 235). 7-мо место.
- **Александар Милушев** — **239** настапи (was 209). 11-то место.
- **Александар Коцев** — **130** настапи (was 115). Ace asked only for „понапред" and named no position; 130 places him **53rd**, directly behind Митко Џорлев, who also has 130 and keeps the earlier rank. That position is DERIVED from Ace's own figure and his own ordering rule, not stated by him — it is the one number on this page he has not personally confirmed.

Applying the first two shifts the ranks between them; 23 person records changed and the list is still 80 long. Ace's two stated positions are mutually consistent with a clean insert-and-shift, which is how they were applied.

### Репрезентативци и интернационалци

The membership of the fourth category on `/legendi` — VERIFIED (Ace: Drive folder `010. Репрезентативци на Македонија`, whose numbered file order is the category's order, cross-checked against his chat message via Lazar, 2026-08-11):

Горан Пандев, Ацо Стојков, Горан Попов, Роберт Попов, Игор Ѓузелов, Панче Стојанов, Дени Масев, Зоран Балдовалиев, Никола Танушев, Тони Бандулиев.

Being in this category does not remove a man from the Играчи ranking — Ace: „не е проблем и да се споменуваат и кај играчи и кај тренери".

**Four men Ace named have no person record yet** and are therefore absent from the category, not omitted from it: **Васил Рингов, Благој Георгиев, Сашко Пандев, Дејан Илиев**. Owed.

### Тренери по сезони (coaches by season)

Ace's own list of every Belasica coach he holds a record for, supplied verbatim — VERIFIED (Ace, chat via Lazar, 2026-08-11). 77 seasons, 121 coach-season entries, 59 distinct coaches. Rendered on the site through `season.trainer`, which also orders the Тренери band on `/legendi`.

Ace's own caveat, supplied with the list: after a coach was dismissed and a successor appointed, someone else sometimes led the team for 1–3 rounds; anyone omitted was left out unintentionally. Seasons he holds no record for are marked „—" and ship with no coach rather than a guess.

Multiple coaches in one season are listed in the order they held the job, and are stored comma-separated in that order.

- **1922** — Усни Бег
- **1950** — Чедо Хаџиски
- **1951** — [нема податок]
- **1952/53** — Јордан Николов
- **1953/54** — [нема податок]
- **1954/55** — [нема податок]
- **1955/56** — Чедо Хаџиски
- **1956/57** — Чедо Хаџиски
- **1957/58** — Коста Ефински
- **1958/59** — Томче Ефтимов, Јордан Николов
- **1959/60** — Јордан Николов
- **1960/61** — Богољуб Петровиќ
- **1961/62** — [нема податок]
- **1962/63** — Јордан Николов
- **1963/64** — [нема податок]
- **1964/65** — Никола Божиќ
- **1965/66** — Томе Ефтимов, Чедо Хаџиски
- **1966/67** — Момчило Илиќ
- **1967/68** — Момчило Илиќ, Јордан Николов
- **1968/69** — Јордан Николов
- **1969/70** — Јордан Николов, Томе Ефтимов
- **1970/71** — Митко Циев, Томе Ефтимов
- **1971/72** — Бранко Роксандиќ, Чедо Хаџиски
- **1972/73** — Ѓоко Георгиев, Славко Џорлев
- **1973/74** — Ѓоко Георгиев
- **1974/75** — Ѓоко Георгиев, Борис Јордановски
- **1975/76** — Борис Јордановски, Томе Ефтимов, Гоце Петровски
- **1976/77** — Гоце Петровски
- **1977/78** — Митко Џртев, Ламбо Поп Димитров
- **1978/79** — Митко Џртев
- **1979/80** — Љубиша Арсеновиќ
- **1980/81** — Ристо Божинов, Златко Илиевски, Благој Истатов
- **1981/82** — Василие Шијаковиќ, Никола Божиќ
- **1982/83** — Никола Божиќ, Благој Истатов
- **1983/84** — Благој Истатов
- **1984/85** — Благој Истатов
- **1985/86** — Благој Истатов
- **1986/87** — Благој Истатов
- **1987/88** — Благој Истатов
- **1988/89** — Благој Истатов
- **1989/90** — Ристо Божинов, Благој Истатов
- **1990/91** — Благој Ашиков
- **1991/92** — Благој Митев, Благој Истатов
- **1992/93** — Гоце Петровски, Илија Андреев
- **1993/94** — Никола Илиевски, Благој Истатов
- **1994/95** — Никола Секулов, Дервиш Хаџиосмановиќ, Дончо Василев, Панче Пантазиев
- **1995/96** — Панче Пантазиев, Благој Истатов
- **1996/97** — Благој Истатов
- **1997/98** — Ратко Јанушев, Благој Истатов
- **1998/99** — Благој Истатов, Ристо Панов
- **1999/00** — Ристо Панов, Илија Матеничаров
- **2000/01** — Илија Матеничаров, Никола Илиевски, Трајче Георгиев
- **2001/02** — Никола Секулов, Ристо Анчев, Драган Канатларовски
- **2002/03** — Ристо Анчев, Пане Блажевски
- **2003/04** — Пане Блажевски, Синиша Станиќ, Звонко Тодоров
- **2004/05** — Мирослав Јаковлевиќ
- **2005/06** — Мирослав Јаковлевиќ, Шефки Арифовски, Звонко Тодоров
- **2006/07** — Звонко Тодоров
- **2007/08** — Звонко Тодоров, Југослав Тренчовски
- **2008/09** — Југослав Тренчовски
- **2009/10** — Милко Ѓуровски, Југослав Тренчовски
- **2010/11** — Гордан Здравков
- **2011/12** — Ацо Стојанов, Шефки Арифовски
- **2012/13** — Тони Ефтимов
- **2013/14** — Тони Ефтимов
- **2014/15** — Александар Стојанов, Стево Петковски
- **2015/16** — Ацо Стојанов
- **2016/17** — Раде Цицмиловиќ, Васко Георгиев
- **2017/18** — Раде Цицмиловиќ
- **2018/19** — Марјан Живковиќ, Раде Цицмиловиќ, Ѓоко Хаџиевски, Александар Стојанов
- **2019/20** — Ване Милков
- **2020/21** — Ване Милков, Шефки Арифовски, Ѓоре Јовановски, Андреј Чернишов
- **2021/22** — Александар Стојанов
- **2022/23** — Шефки Арифовски, Благој Гуцев
- **2023/24** — Васе Беќаров, Александар Стојанов
- **2024/25** — Александар Стојанов, Панче Стојанов
- **2025/26** — Мартин Алаѓозовски

Four rows where the site does not simply mirror the list above. In each case the season page's own narrative text — also Ace's — was treated as the stronger source — VERIFIED (Lazar, chat, 2026-08-11):

- **2024/25** ships as `Александар Стојанов`. That season's story reads „Беласица оваа сезона ја стартува со Александар Стојанов како тренер" and records no change of coach.
- **2025/26** ships as `Александар Стојанов, Панче Стојанов`. That season's story reads „По поразот од Осогово, Александар Стојанов си даде оставка, а на негово место дојде Панче Стојанов", and its стручен штаб block reads „Стојанов Панче — главен тренер". Мартин Алаѓозовски is not named anywhere in it.
- **Мартин Алаѓозовски** is the **2026** coach — VERIFIED (Ace, chat via Lazar, 2026-08-11). This closes the question left open above: asked to order the coaches „од последниот па назад", Ace wrote „Martin Alagjozovski 2026 / Pance Stojanov 2025-2026 / Aleksandar Stojanov / Vase Bekarov". So he did NOT coach 2025/26; he is the coach of a season the archive holds no record for. No season document names him, so `/legendi` orders him from `COACH_YEAR_OVERRIDE` in `src/content/legendi.ts` — remove that entry the moment a 2026/27 season is published.
- **1958/59** ships as `Томе Ефтимов, Јордан Николов`. Ace's list spells the first name „Томче"; the season's own story reads „Беласица во првите две кола ја предводи Т. Ефтимов, а потоа на чело на тимот доаѓа Ј. Николов-Бокото", which confirms both men and the order.
