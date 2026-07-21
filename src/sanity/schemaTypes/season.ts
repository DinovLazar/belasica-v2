import { defineType, defineField, defineArrayMember } from "sanity";
import { isUniqueSlugPerType } from "../lib/isUniqueSlug";

export const season = defineType({
  name: "season",
  title: "Сезона",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Наслов",
      type: "string",
      description: "На пр. „Сезона 1985/86“.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Слаг (URL)",
      type: "slug",
      description: "Латиница, на пр. 1985-86 — се користи во адресата.",
      // Unique per document type (D-2.01-6): the 2.09 ingestion derives one
      // season slug per Drive folder, so two seasons must never collide.
      options: { source: "title", maxLength: 96, isUnique: isUniqueSlugPerType },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "decade",
      title: "Деценија",
      type: "number",
      description:
        "Почетна година на деценијата за групирање во архивата, на пр. 1980.",
      // Required (D-2.01-6): the archive is grouped by decade, and the
      // ingestion derives it from every season folder — no season without one.
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "story",
      title: "Приказна за сезоната",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    // ── Part 3 photo-slot + text fields (additive, all OPTIONAL — D-3.01-1/-6).
    // Re-opens the 2.01-locked model for Part 3; re-locked after 3.06. The
    // league table is now shown as an IMAGE (`tablePhoto`), with the structured
    // `finalTable` kept as legacy (D-3.01-2). Team/table photos are REFERENCES
    // to existing `photo` docs (D-3.01-3), not a `role` tag on `photo`.
    defineField({
      name: "teamPhoto",
      title: "Тимска фотографија",
      type: "reference",
      to: [{ type: "photo" }],
      description:
        "Главната екипна фотографија за сезоната. Се користи и како водечка слика на картичката во архивата.",
      // Limit the picker to photos already linked to THIS season (D-3.01-7);
      // strip the `drafts.` prefix so the filter matches the published id the
      // ingestion set on `photo.relatedSeason`.
      options: {
        filter: ({ document }) => ({
          filter: '_type == "photo" && relatedSeason._ref == $id',
          params: { id: document._id.replace(/^drafts\./, "") },
        }),
      },
    }),
    defineField({
      name: "tablePhoto",
      title: "Фотографија од табелата",
      type: "reference",
      to: [{ type: "photo" }],
      description: "Слика (скриншот) од конечната табела на сезоната.",
      options: {
        filter: ({ document }) => ({
          filter: '_type == "photo" && relatedSeason._ref == $id',
          params: { id: document._id.replace(/^drafts\./, "") },
        }),
      },
    }),
    defineField({
      name: "trainer",
      title: "Тренер",
      type: "string",
      description:
        "Име на тренерот во сезоната (на пр. „Миодраг Јешиќ“). Ново примарно поле; постариот „Тренери“ (референци) останува за компатибилност.",
    }),
    defineField({
      name: "lineupAndStats",
      title: "Состав и статистика",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description:
        "Состав и статистика на играчите (настапи/голови), преземено од изворните документи.",
    }),
    defineField({
      name: "results",
      title: "Резултати",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description:
        "Резултати од натпреварите во сезоната. Секцијата се крие ако е празна.",
    }),
    // LEGACY (D-3.01-2): retained for back-compat; new seasons use `tablePhoto`
    // + „Состав и статистика“ instead of typing the table/squad by hand.
    defineField({
      name: "finalTable",
      title: "Конечна табела",
      type: "array",
      description:
        "Задржано за компатибилност — новите сезони ја користат сликата од табелата и „Состав и статистика“.",
      of: [
        defineArrayMember({
          type: "object",
          name: "tableRow",
          title: "Ред",
          fields: [
            defineField({ name: "position", title: "Позиција", type: "number" }),
            defineField({ name: "club", title: "Клуб", type: "string" }),
            defineField({ name: "played", title: "Одиграни", type: "number" }),
            defineField({ name: "wins", title: "Победи", type: "number" }),
            defineField({ name: "draws", title: "Нерешени", type: "number" }),
            defineField({ name: "losses", title: "Порази", type: "number" }),
            defineField({
              name: "goalsFor",
              title: "Дадени голови",
              type: "number",
            }),
            defineField({
              name: "goalsAgainst",
              title: "Примени голови",
              type: "number",
            }),
            defineField({ name: "points", title: "Бодови", type: "number" }),
          ],
          preview: {
            select: { position: "position", club: "club", points: "points" },
            prepare: ({ position, club, points }) => ({
              title: `${position ?? "?"}. ${club ?? "—"}`,
              subtitle: points != null ? `${points} бод.` : undefined,
            }),
          },
        }),
      ],
    }),
    // LEGACY (D-3.01-2): retained for back-compat; new seasons use „Состав и
    // статистика“ (`lineupAndStats`) instead of typing the squad by hand.
    defineField({
      name: "squad",
      title: "Состав",
      type: "array",
      description:
        "Задржано за компатибилност — новите сезони ја користат сликата од табелата и „Состав и статистика“.",
      of: [
        defineArrayMember({
          type: "object",
          name: "squadMember",
          title: "Играч",
          fields: [
            defineField({
              name: "player",
              title: "Личност",
              type: "reference",
              to: [{ type: "person" }],
            }),
            defineField({
              name: "appearances",
              title: "Настапи",
              type: "number",
            }),
            defineField({ name: "goals", title: "Голови", type: "number" }),
          ],
          preview: {
            select: {
              name: "player.name",
              appearances: "appearances",
              goals: "goals",
            },
            prepare: ({ name, appearances, goals }) => ({
              title: name ?? "Играч",
              subtitle:
                [
                  appearances != null ? `${appearances} наст.` : null,
                  goals != null ? `${goals} гол.` : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || undefined,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "trainers",
      title: "Тренери",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "person" }] })],
    }),
    // NB: the season→photos relationship is single-direction (D-2.01-1). A
    // photo attaches to its season via `photo.relatedSeason`; season photos are
    // read back with a GROQ back-reference (`*[_type=="photo" &&
    // relatedSeason._ref == ^._id]`, see HOME_QUERY). The former `photos`
    // forward array was removed here so the link is modelled once, not twice.
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
