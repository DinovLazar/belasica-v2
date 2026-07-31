import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { focusOnNavy } from "@/lib/focus";
import { cn } from "@/lib/utils";

// Public-site chrome: skip link + header + main + footer. Relocated verbatim
// from the root layout so the /studio route can escape it (D-1.04-3). Route
// groups don't affect URLs — pages under (site) still resolve at their paths.
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Pre-paint flag: marks JS as available so the reveal-on-scroll hidden
          state (globals.css `.js [data-reveal]`) applies only with JS. Without
          it, content renders visible — motion stays a pure enhancement. Runs
          before the content below it paints, so there is no flash. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      {/* `focusOnNavy` added at 3.09. This was the one interactive element on
          the site still falling back to Chrome's default `outline: 1px auto`
          (measured on a real Tab press) rather than the project's 3px ring —
          and it is the FIRST thing a keyboard user reaches. It lands on its own
          navy chip, so it takes the orange ring, like every other control on a
          navy surface (D-3.09-5).

          `focus:z-50` against the header's `z-40` is what keeps it clear of the
          sticky bar for SC 2.4.11: it paints OVER the header rather than under
          it. Verified by hit test, not by rectangle — `elementFromPoint` at the
          focused link's centre returns the link itself. */}
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-navy focus:px-4 focus:py-2 focus:text-small focus:font-bold focus:text-paper",
          focusOnNavy,
        )}
      >
        Прескокни на содржина
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
