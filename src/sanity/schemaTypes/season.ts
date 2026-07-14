import { defineType, defineField, defineArrayMember } from "sanity";

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
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "decade",
      title: "Деценија",
      type: "number",
      description:
        "Почетна година на деценијата за групирање во архивата, на пр. 1980.",
    }),
    defineField({
      name: "story",
      title: "Приказна за сезоната",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "finalTable",
      title: "Конечна табела",
      type: "array",
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
    defineField({
      name: "squad",
      title: "Состав",
      type: "array",
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
    defineField({
      name: "photos",
      title: "Фотографии",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "photo" }] })],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
