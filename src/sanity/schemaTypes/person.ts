import { defineType, defineField, defineArrayMember } from "sanity";
import { isUniqueSlugPerType } from "../lib/isUniqueSlug";

export const person = defineType({
  name: "person",
  title: "Личност",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Име",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Слаг (URL)",
      type: "slug",
      description: "Латиница, на пр. petar-petrov.",
      // Unique per document type (D-2.01-6): person pages are addressed by
      // slug, so two people must never share one.
      options: { source: "name", maxLength: 96, isUnique: isUniqueSlugPerType },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Улога",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Играч", value: "player" },
          { title: "Тренер", value: "trainer" },
          { title: "Претседател", value: "president" },
        ],
      },
      description: "Едно лице може да има повеќе улоги.",
    }),
    defineField({
      name: "playingYears",
      title: "Години на играње",
      type: "string",
      description: "На пр. 1982–1990.",
    }),
    // The two role-scoped year spans (3.27). Until now `playingYears` was the
    // only span the model held, so a coach's card and a president's card could
    // show nothing else — or, worse, could show a PLAYING span under a heading
    // about coaching. One field per role means each page states the years that
    // belong on it.
    //
    // Both are plain strings, deliberately, exactly like `playingYears`: the
    // sources give spans („2024–2026"), open-ended terms („2015–") and single
    // years, and a date pair could hold none of those without inventing a
    // precision the archive does not have.
    //
    // NOT derived, and never to be. `buildTrainerYearIndex` and
    // `tenureSortYear` derive a coach's and an official's latest year at build
    // time, but those produce a SORT KEY that is never rendered (D-3.13-4).
    // These two fields are displayed facts and are typed by a human from a real
    // source. Leave empty until then: the card omits the line rather than
    // showing a guess.
    defineField({
      name: "trainerYears",
      title: "Години како тренер",
      type: "string",
      description:
        "Периодот во кој лицето било ТРЕНЕР на Беласица, на пр. 2024–2026. Тука не се пишуваат години на играње — за тоа е полето „Години на играње“. Остави празно ако не е познат периодот.",
    }),
    defineField({
      name: "officialYears",
      title: "Години во раководството",
      type: "string",
      description:
        "Периодот во кој лицето било претседател или функционер, на пр. 2015–2024 или 2015– ако мандатот трае. Тука не се пишуваат години на играње. Остави празно ако не е познат периодот.",
    }),
    // The club's all-time appearance ranking, transcribed from chapter 9 of Ace
    // Stojanov's book („50 играчи на Беласица со најмногу првенствени
    // натпревари", continued to 80). It is the ordering `/legendi` uses for the
    // Играчи band (D-3.12-2) and is NOT derived from `careerStats.appearances`:
    // 23 of the 162 are ranked on a count the list gives only as a range
    // („120–135"), so a sort on the number alone would drop them — Панче
    // Пантазиев (#9) and Васо Цветков (#20) among them — to the bottom of the
    // page.
    //
    // **Every ranked player carries a rank of his own** — the field is unique
    // across the whole ladder (D-RANKS-1). Аце's own list is competition-style
    // („1224"): where several men share an appearance count he gives them all
    // the first number of the span and leaves the rest of the span empty — four
    // men at 60 настапи were all „135", and the list resumed at 139. That is
    // faithful to his page but reads as a data fault on a card that prints one
    // number, so each man now takes his own number FROM WITHIN THE SPAN HIS
    // GROUP ALREADY OWNED, ordered by name — the order the ladder already
    // displayed them in. No player's position on the ladder changed; only the
    // printed number did. ⚠️ The order WITHIN a former tie is derived, not
    // stated by Аце — see `facts.md`.
    //
    // Leave empty for anyone the list does not rank.
    defineField({
      name: "legendRank",
      title: "Ранг по настапи (книга)",
      type: "number",
      description:
        "Место на ранг-листата од книгата (1–163). Секој играч има свој број — не се повторува. Остави празно ако лицето не е на листата.",
      // Uniqueness is enforced here so a rank cannot be duplicated by hand in
      // Studio, which is how the four-way tie at 135 would come back. This is a
      // STUDIO guard only — the HTTP mutate API does not run schema validation,
      // so a script can still write a duplicate. Re-check after any bulk write.
      validation: (rule) =>
        rule
          .integer()
          .positive()
          .custom(async (rank, context) => {
            if (rank == null) return true;
            const id = context.document?._id?.replace(/^drafts\./, "");
            const taken = await context
              .getClient({ apiVersion: "2026-07-15" })
              .fetch(
                `count(*[_type == "person" && legendRank == $rank && !(_id in [$id, "drafts." + $id])])`,
                { rank, id },
              );
            return taken === 0
              ? true
              : `Рангот ${rank} е веќе зафатен од друг играч. Секој ранг се доделува само еднаш.`;
          }),
    }),
    // The appearance count the rank is built on, printed beside the rank on the
    // legend cards.
    //
    // A **STRING, not a number** — and that is the whole point (D-3.15-4). The
    // list gives 23 of the 162 a RANGE rather than a figure („120–135"),
    // which is exactly why the ranking is `legendRank` and not a sort on
    // `careerStats.appearances` (D-3.12-2). A number field could not hold what
    // the book actually says, and rounding a range to one of its ends would
    // invent a statistic.
    //
    // Store the book's printed value verbatim, en dash for ranges. Leave empty
    // for anyone the book gives no count — the card then shows the rank and the
    // name and no count, never a zero and never a dash.
    defineField({
      name: "legendAppearances",
      title: "Настапи по книгата",
      type: "string",
      description:
        "Бројот на настапи како што е отпечатен во книгата, на пр. 555 или 120–135. Остави празно ако книгата не дава број.",
    }),
    defineField({
      name: "bio",
      title: "Биографија",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    // careerStats is the AUTHORITATIVE career total shown on the person and
    // statistics pages (D-2.01-3). Per-season appearances/goals detail lives in
    // `season.squad`; the career aggregate is NOT recomputed from squad rows —
    // it is entered here from the source docs. A missing total renders a
    // placeholder on the page, never an invented or summed number.
    defineField({
      name: "careerStats",
      // „(Беласица)" added to the TITLE at 3.27. The field's meaning has not
      // changed — it is the same Belasica-only authoritative total it has been
      // since 2.01 — but `nationalStats` now sits directly beneath it in the
      // same form, and two objects both labelled „статистика" is how a
      // whole-career figure ends up typed into the Belasica field. The label
      // states the scope so the person entering it cannot mix them up.
      title: "Кариерна статистика (Беласица)",
      type: "object",
      options: { collapsible: true, collapsed: false },
      description:
        "Само настапи и голови ЗА БЕЛАСИЦА. За репрезентацијата постои полето подолу.",
      fields: [
        defineField({ name: "appearances", title: "Настапи", type: "number" }),
        defineField({ name: "goals", title: "Голови", type: "number" }),
      ],
    }),
    // Whole-career figures — every club plus the national team (3.27).
    //
    // **Separate from `careerStats`, and it must stay separate.** `careerStats`
    // is Belasica-only and authoritative (D-2.01-3); these numbers are a
    // different scope from a different source (public records, compiled by
    // hand). Merging the two, or letting either fall back to the other, would
    // put a figure on the page whose provenance a reader cannot determine —
    // which is the defect already on the register as OV-47. So: never summed,
    // never substituted, and rendered under its own label everywhere.
    //
    // This is what the Репрезентативци tab shows. Until 3.27 that tab rendered
    // `careerStats` — a man's BELASICA appearances — under a heading about his
    // international career: Горан Пандев's card read „38" beside his name, his
    // Беласица count, on the one page about everything he did elsewhere.
    //
    // `sourceNote` is not decoration. It is the reason this field can carry a
    // number the club's own records do not back: the provenance travels with the
    // figure and is rendered beside it on the person page.
    defineField({
      name: "nationalStats",
      title: "Статистика за репрезентацијата",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description:
        "Настапи и голови САМО за македонската репрезентација. Ова НЕ е клупска статистика — ниту за Беласица, ниту за другите клубови.",
      fields: [
        defineField({
          name: "appearances",
          title: "Настапи за репрезентацијата",
          type: "number",
        }),
        defineField({
          name: "goals",
          title: "Голови за репрезентацијата",
          type: "number",
        }),
        defineField({
          name: "sourceNote",
          title: "Извор на бројките",
          type: "string",
          description:
            "Од каде се земени бројките, кратко — на пр. „Според биографиите и книгата на Аце Стојанов“. Се прикажува на страницата на личноста, до бројките, за да може читателот да провери од каде се.",
        }),
      ],
    }),
    // NB: the person→photos relationship is single-direction (D-2.01-1). A
    // portrait attaches via `photo.relatedPerson` and is read back with a GROQ
    // back-reference (`*[_type=="photo" && relatedPerson._ref == ^._id][0]`,
    // see HOME_QUERY). The former `photos` forward array was removed here so
    // the link is modelled once, not twice.
  ],
  preview: {
    select: { title: "name", subtitle: "playingYears" },
  },
});
