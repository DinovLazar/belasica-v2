import type { StructureResolver } from "sanity/structure";

// siteSettings is a singleton (one fixed document, id "siteSettings"); every
// other type is a normal document list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Содржина")
    .items([
      S.listItem()
        .title("Поставки на сајтот")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "siteSettings",
      ),
    ]);
