import { cn } from "@/lib/utils";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/facts";

const ICON = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
} as const;

/**
 * The archive's two social profiles, rendered identically on both surfaces that
 * carry them — the footer's „Следете нѐ" column and `/kontakt`'s direct-contact
 * block. One component rather than two copies of the markup: the hrefs and the
 * accessible names would otherwise drift the first time one of them changes,
 * and PL-15 was open on exactly these two surfaces for the same reason.
 *
 * **Hit box.** `min-h-11` is 44px, and with the icon, the gap and the label the
 * width clears 44 well before it. The footer's other links deliberately sit at
 * 29px (padding + negative margin) because they are a dense text column; an
 * icon link is a target you aim at, so it takes the full 44 (WCAG 2.5.5).
 *
 * **Accessible name.** The visible word is „Фејсбук"; the announced name is
 * „Беласица на Фејсбук", via an `sr-only` prefix. The visible text is a
 * substring of the accessible name, so WCAG 2.5.3 (Label in Name) holds and a
 * voice-control user saying „Фејсбук" still hits it.
 *
 * **Colour.** The icon inherits `currentColor`, so it never needs its own
 * value. On navy the pair sits at `paper/80` (9.90:1) and brightens to full
 * paper on hover; on paper it sits at `navy` (14.95:1). The orange stays a
 * *rule* under the label and never becomes the ink — orange text or an orange
 * glyph on a light surface is 2.57:1 and is the one thing D-1.02-1 forbids.
 */
export function SocialLinks({
  onNavy = false,
  className,
}: {
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col items-start gap-1", className)}>
      {SOCIAL_LINKS.map((social) => {
        const Icon = ICON[social.icon];
        return (
          <li key={social.href}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group inline-flex min-h-11 items-center gap-2.5 py-2 text-small transition-colors",
                onNavy
                  ? "text-paper/80 hover:text-paper"
                  : "text-navy hover:text-navy",
                onNavy ? focusOnNavy : focusOnPaper,
              )}
            >
              <Icon className="shrink-0" />
              <span className="border-b-2 border-transparent transition-colors group-hover:border-orange">
                <span className="sr-only">{social.accessiblePrefix}</span>
                {social.label}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
