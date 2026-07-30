import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import { UNOFFICIAL_ARCHIVE } from "../../_shared/copy";

/**
 * Направление А — the masthead.
 *
 * A newspaper front page identifies itself before it says anything: a thin
 * rule, the standing line, the nameplate, a double rule, then the section
 * strip. There is no sticky bar in this direction — a masthead that follows
 * you down the page is a website behaviour, not a print one, and the whole
 * point of A is that the page reads as a printed object.
 *
 * Content-truth: the standing line carries only the VERIFIED „Неофицијална
 * архива". No dateline, no edition number, no city, no founding year —
 * `facts.md` has the founding year UNVERIFIED and records no home town, and a
 * masthead is exactly where invented furniture would look most convincing
 * (D-3.05a-6).
 */
export function Masthead() {
  return (
    <header className="pa-divide border-b">
      <div className="pa-rule-thick" />

      <div className="pa-wrap">
        {/* Standing line */}
        <p className="pa-agate-caps py-2 text-center">{UNOFFICIAL_ARCHIVE}</p>

        <div className="pa-rule-hair" />

        {/* Nameplate */}
        <Link
          href="/predlog-a"
          className="pa-focus flex items-center justify-center gap-3 py-5 md:gap-5 md:py-7"
        >
          {/* The crest is the club's own artwork on a white ground; it is the
              one thing on this page that is not two-ink, and that is correct —
              a paper prints its own badge as supplied. Decorative: the
              nameplate beside it carries the accessible name. */}
          <Image
            src="/crest.png"
            alt=""
            width={64}
            height={91}
            priority
            className="h-11 w-auto md:h-16"
          />
          <span className="pa-masthead-name">ФК Беласица</span>
        </Link>
      </div>

      <div className="pa-rule-double" />

      {/* Section strip */}
      <nav aria-label="Главна навигација" className="pa-wrap">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-0 py-1 md:gap-x-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                // This page IS the homepage proposal, so „Почетна" is the
                // current section even though the URL is /predlog-a.
                aria-current={item.href === "/" ? "page" : undefined}
                className="pa-nav-link pa-focus"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pa-rule-hair" />
    </header>
  );
}
