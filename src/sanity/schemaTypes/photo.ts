import { defineType, defineField } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Фотографија",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Слика",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Опис", type: "string" }),
    defineField({
      name: "provenance",
      title: "Потекло / права",
      type: "string",
      description:
        "Од каде е фотографијата и основ за објавување. Задолжително (content-truth).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Датум",
      type: "string",
      description:
        "Слободен текст — на пр. „околу 1985“ ако точниот датум е непознат.",
    }),
    defineField({
      name: "relatedSeason",
      title: "Поврзана сезона",
      type: "reference",
      to: [{ type: "season" }],
    }),
    defineField({
      name: "relatedPerson",
      title: "Поврзана личност",
      type: "reference",
      to: [{ type: "person" }],
    }),
  ],
  preview: {
    select: { title: "caption", media: "image", subtitle: "provenance" },
    prepare: ({ title, media, subtitle }) => ({
      title: title || "Фотографија",
      subtitle,
      media,
    }),
  },
});
