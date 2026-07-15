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
      // Unique per document type (D-2.01-3): person pages are addressed by
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
      title: "Кариерна статистика",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "appearances", title: "Настапи", type: "number" }),
        defineField({ name: "goals", title: "Голови", type: "number" }),
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
