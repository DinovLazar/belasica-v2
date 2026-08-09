import { JumpNav } from "@/components/JumpNav";
import { decadeAnchor, decadeLabel } from "@/lib/archive";

/**
 * Decade jump-nav (D-2.02-13). With 96 seasons over 11 decades, scanning the
 * index needs it.
 *
 * Since 3.17 the rail itself is `JumpNav` and this is the thin mapping layer
 * that names /arhiva's items — the markup, the sticky offset and the vertical
 * rhythm all live there, unchanged, and /arhiva's rendered HTML is byte-
 * identical to what this component emitted on its own.
 *
 * Only decades that actually have a published season are listed — the index
 * never offers a jump to an empty decade. Mobile scrolls the rail inside its
 * own container, so the page body never scrolls sideways.
 */
export function DecadeJumpNav({ decades }: { decades: number[] }) {
  return (
    <JumpNav
      items={decades.map((decade) => ({
        id: decadeAnchor(decade),
        label: decadeLabel(decade),
      }))}
      ariaLabel="Скок по деценија"
    />
  );
}
