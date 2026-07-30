import { cn } from "@/lib/utils";

/**
 * Section label — brand.md §Typography (`u-label`) and §Components.
 *
 * A solid orange bar followed by tracked caps. The accent is the BAR, never a
 * letterform: orange ink on a light surface is 2.6:1 and fails AA at every
 * size (brand rule 3 / D-1.02-1). So the text follows its surface and the bar
 * stays constant — which is also why all three variants look the same shape,
 * unlike the pre-3.05 version where `onNavy` dropped the rule and turned the
 * text orange.
 *
 *  - onPaper → navy text on paper/white   (14.95:1)
 *  - onNavy  → paper text on a navy block (14.95:1)
 *  - onPhoto → paper text; kept as a distinct name because the caller is
 *    telling us it sits over an image. In this direction no label ever does —
 *    the hero's text sits on solid navy below the photograph (D-3.05a-10) —
 *    but the variant stays so a future overlay states its surface honestly.
 */
export function SectionOverline({
  children,
  variant = "onPaper",
  className,
}: {
  children: React.ReactNode;
  variant?: "onPaper" | "onNavy" | "onPhoto";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "u-label",
        variant === "onPaper" ? "text-navy" : "text-paper",
        className,
      )}
    >
      <span>{children}</span>
    </p>
  );
}
