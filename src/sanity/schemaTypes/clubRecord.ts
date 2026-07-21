import { defineType, defineField } from "sanity";

// Curated club records for the Statistics page (Part 3, D-3.01-5). A small,
// hand-entered holder for all-time records ("best all-time scorer", trophy
// counts, …) that cannot be auto-aggregated once season tables are stored as
// images (D-3.01-2). Person `careerStats` still backs the ranking tables on
// /statistika; this type is only for the curated highlights alongside them.
// Additive and optional beyond the two required labels — no existing content
// is affected.
export const clubRecord = defineType({
  name: "clubRecord",
  title: "Клупски рекорд",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Опис",
      type: "string",
      description: "На пр. „Најдобар стрелец на сите времиња“.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Вредност",
      type: "string",
      description: "На пр. „Љупчо Мафков — 115 голови“.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категорија",
      type: "string",
      options: {
        list: [
          { title: "Стрелци", value: "scorers" },
          { title: "Настапи", value: "appearances" },
          { title: "Трофеи и признанија", value: "honours" },
          { title: "Друго", value: "other" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "order",
      title: "Редослед",
      type: "number",
      description: "Помал број се прикажува погоре.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
  },
});
