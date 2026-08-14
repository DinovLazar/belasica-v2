"use client";

import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { focusOnPaper } from "@/lib/focus";

/**
 * Error boundary — „Нешто тргна наопаку" (Phase 3.23, B4).
 *
 * Its job is narrow and real: **a Sanity read failing during an ISR
 * revalidation shows the archive's own page rather than a raw Next error
 * screen.** Every route here carries `revalidate = 60`, and `src/sanity/fetch.ts`
 * deliberately *throws* on the season and person templates after five bounded
 * attempts (D-3.02F-C-1) — that throw is correct at build time, where it stops a
 * deploy shipping a half-empty archive, but at request time it is what a visitor
 * would have seen.
 *
 * A client component, as Next requires for an error boundary. It lives inside
 * `(site)` so `(site)/layout.tsx` still wraps it — an error boundary replaces
 * the segment's page, not the layout above it, so the header, footer and
 * back-to-top survive without being re-mounted here. (The 404 next door had to
 * mount them itself for a different reason — see `src/app/not-found.tsx`.)
 *
 * `PageHeader` is a server-safe component with no server-only imports, so a
 * client component may render it; `LegendsBrowser` has done exactly that since
 * 3.10.
 *
 * **Nothing about the failure reaches the visitor** — no `error.message`, no
 * `error.digest`, no stack. The message could carry a GROQ fragment, a document
 * id or a slug-named internal failure from the read helper, none of which is a
 * reader's business. The digest is in the server log, which is where an operator
 * looks anyway.
 *
 * ⚠️ The three Macedonian strings were supplied by the orchestrator and have
 * **not** been read by a native speaker. Recorded as an owed item.
 */
export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <PageHeader
        title="Нешто тргна наопаку"
        crumbs={[
          { label: "Почетна", href: "/" },
          { label: "Нешто тргна наопаку" },
        ]}
        intro="Страницата не можеше да се вчита. Обидете се повторно за момент."
        // As on the 404: a real trail back, but no machine-readable claim that
        // this is a place in the archive.
        crumbStructuredData={false}
      />

      <Container className="py-section">
        {/* brand.md §Components („Buttons"): primary is an ORANGE FILL with
            NAVY INK — 5.81:1 — hover swaps the fill to paper. Orange is never
            the ink on a light surface (brand rule 3 / D-1.02-1). */}
        <button type="button" onClick={reset} className={retryButton}>
          Обиди се повторно
        </button>
      </Container>
    </>
  );
}

const retryButton = cn(
  "inline-flex min-h-11 items-center bg-orange px-6 py-3 font-display text-base font-semibold uppercase tracking-[0.06em] text-navy transition-colors hover:bg-paper",
  focusOnPaper,
);
