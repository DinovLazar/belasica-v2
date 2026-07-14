import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { inter, sourceSerif } from "./fonts";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ФК Беласица — неофицијална архива",
    template: "%s · ФК Беласица",
  },
  description: "Неофицијална архива посветена на историјата на ФК Беласица.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mk"
      className={`${inter.variable} ${sourceSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
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
        <Analytics />
      </body>
    </html>
  );
}
