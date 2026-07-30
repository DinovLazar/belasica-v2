import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import {
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";
import { Chip, Label } from "./parts";

/**
 * Направление В — the footer.
 *
 * The last block: navy, closed by the same orange rule that opens the header,
 * so the page reads as one bounded object. Both statements come from
 * `src/lib/facts.ts` (VERIFIED, OV-3); the unresolved contact and social
 * details stay visible placeholder chips exactly as on the live site.
 */
export function TerraceFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="pc-block-navy">
      <div className="pc-topbar" />
      <div className="pc-wrap py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] md:gap-8">
          <div>
            <p className="pc-h2 pc-h2--on-navy">ФК Беласица</p>
            <p className="pc-small pc-small--on-navy mt-4 max-w-[44ch]">
              {UNOFFICIAL_ARCHIVE_STATEMENT}
            </p>
          </div>

          <nav aria-labelledby="pc-foot-nav" className="min-w-0">
            <h2 id="pc-foot-nav">
              <Label onNavy>Навигација</Label>
            </h2>
            <ul className="mt-5 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="pc-link pc-link--on-navy pc-focus pc-focus--on-navy"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2>
              <Label onNavy>Контакт</Label>
            </h2>
            <ul className="mt-5 flex flex-col items-start gap-3">
              <li>
                <Link
                  href="/kontakt"
                  className="pc-link pc-link--on-navy pc-focus pc-focus--on-navy"
                >
                  Формулар
                </Link>
              </li>
              <li>
                <Chip label="е-пошта за контакт" onNavy />
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h2>
              <Label onNavy>Следете нѐ</Label>
            </h2>
            <p className="mt-5">
              <Chip label="профили на социјални мрежи" onNavy />
            </p>
          </div>
        </div>

        <div className="pc-hairline mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 pt-6">
          <p className="pc-small pc-small--on-navy uppercase tracking-[0.16em]">
            {UNOFFICIAL_ARCHIVE_LABEL}
          </p>
          <p className="pc-small pc-small--on-navy">
            © {year} ФК Беласица
          </p>
        </div>
      </div>
    </footer>
  );
}
