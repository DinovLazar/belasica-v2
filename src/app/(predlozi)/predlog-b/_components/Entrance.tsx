import Image from "next/image";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/nav";
import { UNOFFICIAL_ARCHIVE } from "../../_shared/copy";

/**
 * Направление Б — the entrance.
 *
 * A museum's identity sits still above the door; it does not follow you from
 * room to room, so this header is deliberately NOT sticky (the live site's is).
 * Crest and wordmark centre on the wall, the rooms are listed beneath in
 * tracked caps, and a single brass hairline closes the frame.
 *
 * Content-truth: the standing line is the VERIFIED „Неофицијална архива" and
 * nothing else — no founding year, no city (both UNVERIFIED in `facts.md`).
 */
export function Entrance() {
  return (
    <header className="pb-hairline border-t-0">
      <div className="pb-wrap pb-6 pt-8 md:pb-8 md:pt-12">
        <Link
          href="/predlog-b"
          className="pb-focus mx-auto flex w-fit flex-col items-center gap-4"
        >
          {/* The crest is the club's own artwork on a white ground — mounted
              on its own small mat so it reads on the navy wall rather than
              floating. Decorative: the wordmark carries the accessible name. */}
          <span className="pb-mount inline-flex p-2">
            <Image
              src="/crest.png"
              alt=""
              width={64}
              height={91}
              priority
              className="h-12 w-auto md:h-14"
            />
          </span>
          <span className="pb-h3 text-center tracking-[0.14em] uppercase">
            ФК Беласица
          </span>
        </Link>

        <p className="pb-label pb-label--tight mt-3 justify-center">
          {UNOFFICIAL_ARCHIVE}
        </p>

        <nav aria-label="Главна навигација" className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-1 md:gap-x-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  // This page is the homepage proposal, so „Почетна" is the
                  // current room even though the URL is /predlog-b.
                  aria-current={item.href === "/" ? "page" : undefined}
                  className="pb-nav-link pb-focus"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="pb-hairline" />
    </header>
  );
}
