import type { StructureResolver } from "sanity/structure";

// siteSettings is a singleton (one fixed document, id "siteSettings"); every
// other type is a normal document list. season/person/photo are auto-listed
// with their singular schema titles; clubRecord is listed explicitly so its
// desk entry reads the plural „Клупски рекорди" (its schema title is the
// singular „Клупски рекорд") — Part 3, D-3.01-5.
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
        (item) =>
          item.getId() !== "siteSettings" && item.getId() !== "clubRecord",
      ),
      S.documentTypeListItem("clubRecord").title("Клупски рекорди"),
    ]);
