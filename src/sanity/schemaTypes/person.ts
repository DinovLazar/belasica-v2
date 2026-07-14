import { defineType, defineField, defineArrayMember } from "sanity";

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
      options: { source: "name", maxLength: 96 },
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
    defineField({
      name: "bio",
      title: "Биографија",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "careerStats",
      title: "Кариерна статистика",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "appearances", title: "Настапи", type: "number" }),
        defineField({ name: "goals", title: "Голови", type: "number" }),
      ],
    }),
    defineField({
      name: "photos",
      title: "Фотографии",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "photo" }] })],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "playingYears" },
  },
});
