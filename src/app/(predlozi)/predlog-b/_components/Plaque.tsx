import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import {
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";
import { Chip, WallLabel } from "./parts";

/**
 * Направление Б — the closing plaque.
 *
 * The wall text every museum puts by the exit: what this collection is, who
 * keeps it, and — the line that matters here — what it is not. Both strings
 * come from `src/lib/facts.ts` (VERIFIED, OV-3), and the unresolved contact
 * and social details stay visible placeholder chips exactly as they are on the
 * live site.
 */
export function Plaque() {
  const year = new Date().getFullYear();

  return (
    <footer className="pb-hairline">
      <div className="pb-wrap py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,1fr))] md:gap-10">
          <div>
            <p className="pb-h3">ФК Беласица</p>
            <p className="pb-label pb-label--tight mt-4">
              {UNOFFICIAL_ARCHIVE_LABEL}
            </p>
            <p className="pb-small mt-4 max-w-[44ch]">
              {UNOFFICIAL_ARCHIVE_STATEMENT}
            </p>
          </div>

          <nav aria-labelledby="pb-foot-nav" className="min-w-0">
            <h2 id="pb-foot-nav">
              <WallLabel tight>Простории</WallLabel>
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="pb-link pb-focus">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2>
              <WallLabel tight>Контакт</WallLabel>
            </h2>
            <ul className="mt-4 flex flex-col items-start gap-3">
              <li>
                <Link href="/kontakt" className="pb-link pb-focus">
                  Контакт формулар
                </Link>
              </li>
              <li>
                <Chip label="е-пошта за контакт" />
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h2>
              <WallLabel tight>Следете нѐ</WallLabel>
            </h2>
            <p className="mt-4">
              <Chip label="профили на социјални мрежи" />
            </p>
          </div>
        </div>

        <div className="pb-hairline mt-14 pt-6">
          <p className="pb-small">
            © {year} ФК Беласица — {UNOFFICIAL_ARCHIVE_LABEL}
          </p>
        </div>
      </div>
    </footer>
  );
}
