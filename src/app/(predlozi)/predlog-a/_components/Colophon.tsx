import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import {
  UNOFFICIAL_ARCHIVE_LABEL,
  UNOFFICIAL_ARCHIVE_STATEMENT,
} from "@/lib/facts";
import { Chip } from "./parts";

/**
 * Направление А — the colophon.
 *
 * A newspaper closes with its imprint: who publishes it, where to write, what
 * it is not. Both strings come from `src/lib/facts.ts` (VERIFIED, OV-3), and
 * the contact and social slots stay visible placeholder chips exactly as the
 * live footer keeps them — this direction changes the typography, not the truth.
 */
export function Colophon() {
  const year = new Date().getFullYear();

  return (
    <footer className="pa-band-sunk mt-2">
      <div className="pa-rule-thick" />
      <div className="pa-wrap py-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] md:gap-12">
          <div>
            <p className="pa-headline pa-headline--sub">ФК Беласица</p>
            <p className="pa-agate-caps mt-3">{UNOFFICIAL_ARCHIVE_LABEL}</p>
            <p className="pa-agate mt-3 max-w-[46ch]">
              {UNOFFICIAL_ARCHIVE_STATEMENT}
            </p>
          </div>

          <nav aria-labelledby="pa-foot-nav" className="min-w-0">
            <h2 id="pa-foot-nav" className="pa-agate-caps">
              Рубрики
            </h2>
            <ul className="mt-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="pa-link pa-link--sm pa-focus inline-flex py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <h2 className="pa-agate-caps">Контакт</h2>
            <ul className="mt-3 flex flex-col items-start gap-2">
              <li>
                <Link
                  href="/kontakt"
                  className="pa-link pa-link--sm pa-focus inline-flex py-1"
                >
                  Контакт формулар
                </Link>
              </li>
              <li>
                <Chip label="е-пошта за контакт" />
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="pa-agate-caps">Следете нѐ</h2>
            <p className="mt-3">
              <Chip label="профили на социјални мрежи" />
            </p>
          </div>
        </div>

        <div className="pa-rule-hair mt-10 pt-5">
          <p className="pa-agate">
            © {year} ФК Беласица — {UNOFFICIAL_ARCHIVE_LABEL}
          </p>
        </div>
      </div>
    </footer>
  );
}
