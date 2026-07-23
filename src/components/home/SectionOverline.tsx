import { cn } from "@/lib/utils";

/**
 * Section overline. Brand rule D-1.02-1: orange only carries text where it
 * reaches AA. So the variant follows the surface:
 *  - onPaper  → short orange rule (marker) + navy overline text (13:1).
 *  - onNavy   → orange overline text on SOLID navy (4.6:1 passes AA), no rule.
 *  - onPhoto  → short orange rule (marker) + PAPER overline text, for overlays
 *    on a photo+navy-gradient (hero, moment band). Orange text there is NOT
 *    reliable — behind the overline can sit a light photo pixel, where even a
 *    heavy gradient leaves orange at ~3.7:1 (measured). Paper stays ≥ 6.8:1, so
 *    the text carries in paper and orange is kept purely as the marker.
 * See brand.md §Color / §Contrast and the Phase 1.05 handover §Layout.
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
  if (variant === "onNavy") {
    return (
      <p
        className={cn(
          "text-overline font-semibold uppercase tracking-overline text-orange",
          className,
        )}
      >
        {children}
      </p>
    );
  }

  const textColor = variant === "onPhoto" ? "text-paper" : "text-navy";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span aria-hidden className="h-0.5 w-8 shrink-0 bg-orange" />
      <p
        className={cn(
          "text-overline font-semibold uppercase tracking-overline",
          textColor,
        )}
      >
        {children}
      </p>
    </div>
  );
}
