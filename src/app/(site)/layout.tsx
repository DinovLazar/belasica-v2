import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-navy focus:px-4 focus:py-2 focus:text-small focus:font-medium focus:text-paper"
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
