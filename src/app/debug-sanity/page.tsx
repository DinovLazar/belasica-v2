// ⚠️ TEMPORARY verification route (Phase 1.04) — remove or replace in Phase
// 1.05 when the real pages land. Its only job is to prove the Next.js ↔ Sanity
// read pipeline works against published content. Flagged for removal in
// file-map.md. Not linked from anywhere and not designed.
import Link from "next/link";
import { client } from "@/sanity/client";
import { projectId, dataset } from "@/sanity/env";

export const dynamic = "force-dynamic";

type SeasonRow = {
  _id: string;
  title: string | null;
  slug: string | null;
};

export default async function DebugSanityPage() {
  let seasons: SeasonRow[] = [];
  let error: string | null = null;

  try {
    seasons = await client.fetch<SeasonRow[]>(
      `*[_type == "season"] | order(title asc){ _id, title, "slug": slug.current }`,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "3rem 1.25rem", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#b45309" }}>
        Temporary debug route · Phase 1.04 · remove in 1.05
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0.25rem 0 0.5rem" }}>
        Sanity read-connection check
      </h1>
      <p style={{ color: "#555", margin: "0 0 1.5rem" }}>
        Project <code>{projectId}</code> · dataset <code>{dataset}</code> ·
        query: published <code>season</code> documents.
      </p>

      {error ? (
        <div style={{ padding: "1rem", border: "1px solid #dc2626", borderRadius: 8, background: "#fef2f2", color: "#991b1b" }}>
          <strong>Query failed.</strong>
          <pre style={{ whiteSpace: "pre-wrap", margin: "0.5rem 0 0", fontSize: 13 }}>{error}</pre>
        </div>
      ) : seasons.length === 0 ? (
        <div style={{ padding: "1rem", border: "1px solid #d4d4d4", borderRadius: 8, background: "#fafafa", color: "#555" }}>
          Connection works, but no published <code>season</code> documents were
          found yet. Add and <strong>publish</strong> a season in{" "}
          <Link href="/studio">/studio</Link>, then reload.
        </div>
      ) : (
        <>
          <p style={{ margin: "0 0 0.75rem", color: "#166534" }}>
            ✓ Read pipeline live — {seasons.length} published season
            {seasons.length === 1 ? "" : "s"}:
          </p>
          <ul style={{ paddingLeft: "1.25rem", lineHeight: 1.8 }}>
            {seasons.map((s) => (
              <li key={s._id}>
                <strong>{s.title ?? "(без наслов)"}</strong>{" "}
                <code style={{ color: "#666" }}>/{s.slug ?? "—"}</code>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
