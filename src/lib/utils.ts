import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge does not read the custom @theme tokens in
 * src/app/globals.css, so every custom font-size utility (text-display,
 * text-h1, …) must be registered here under the 'font-size' class group.
 * Unregistered, tailwind-merge classifies them as text-COLOR classes and
 * silently drops the size whenever a real text color appears in the same
 * cn() pass (D-3.04-12). Same for custom letter-spacing utilities under
 * 'tracking'. If you add a type token to @theme, add it to this list.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body-l",
            "body",
            "small",
            "overline",
          ],
        },
      ],
      tracking: [{ tracking: ["overline"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
