import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { inter, sourceSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ФК Беласица — неофицијална архива",
    template: "%s · ФК Беласица",
  },
  description: "Неофицијална архива посветена на историјата на ФК Беласица.",
};

// Bare root layout: <html>/<body>, fonts, global styles, analytics. The site
// chrome (header/footer) lives in the (site) route group so the embedded Studio
// at /studio renders full-screen without it. See D-1.04-3.
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
