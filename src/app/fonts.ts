import { Inter, Source_Serif_4 } from "next/font/google";

// Body / UI. Cyrillic subset for Macedonian. Weights per brand.md.
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Display / headings. Cyrillic subset for Macedonian. Weights per brand.md.
export const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
  display: "swap",
});
