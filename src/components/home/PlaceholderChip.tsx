import { cn } from "@/lib/utils";

/**
 * Placeholder chip — brand.md §Components: dashed border, hatched fill, mono
 * `[PLACEHOLDER: …]` text. The one legal way to show a missing required
 * display fact (facts.md / content-truth). Never invent content in its place.
 *
 * Two surfaces, because this direction puts real content inside navy blocks:
 * without `onNavy` a chip on a navy block would paint a paper rectangle into
 * the middle of it. Both states are contrast-checked against their own HATCH
 * STROKE — the worst case, where a hatch line crosses a glyph — since an
 * automated sweep skips anything drawn over a background image and would
 * otherwise never verify a chip at all (D-3.05a-8). Measured 4.73:1 / 5.84:1.
 */
export function PlaceholderChip({
  label,
  onNavy = false,
  className,
}: {
  label: string;
  onNavy?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center break-words border border-dashed px-2 py-1 font-mono text-small",
        onNavy
          ? "placeholder-hatch--on-navy border-paper/55 bg-navy text-paper/80"
          : "placeholder-hatch border-neutral-500/60 bg-paper text-neutral-500",
        className,
      )}
    >
      [PLACEHOLDER: {label}]
    </span>
  );
}
