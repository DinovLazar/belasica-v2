/**
 * Phase 3.05a — the direction-exploration route group.
 *
 * It exists so `/predlog-a|b|c` escape the `(site)` chrome: each variant ships
 * its OWN header, `<main>` and footer, because the header and footer are part
 * of what is being compared. Nothing here styles anything — the variants own
 * every visual decision, and the live site's components are neither imported
 * nor touched.
 */
export default function PredloziLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Same pre-paint flag as the (site) layout: it marks JS as available so
          the reveal-on-scroll hidden state (globals.css `.js [data-reveal]`,
          re-timed per variant) only applies when JS can undo it. Duplicated
          rather than imported — this group must not depend on site chrome. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      {children}
    </>
  );
}
