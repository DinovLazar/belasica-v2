"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { focusOnNavy } from "@/lib/focus";
import {
  CATEGORY_ANCHOR,
  CATEGORY_TAB_LABEL,
  personCountLabel,
  type LegendCategory,
} from "@/lib/people";
import { matchesName } from "@/lib/translit";
import type { LegendCardData } from "./LegendCard";
import { CategoryGrid } from "./CategoryGrid";

export type LegendBand = { category: LegendCategory; people: LegendCardData[] };

/**
 * The whole of /legendi below the site header: the navy page-header block, the
 * category tabs, and the one category showing under them.
 *
 * **Tabs, since 3.22.** The four categories used to stack down one page behind a
 * jump rail, which is what the owner was objecting to on 11.08.2026 — „кога
 * завршуваат играчите, не сакам да продолжуваат тренерите. Туку нека се во 3
 * теми." A rail is a shortcut past content that is still there; a tab means the
 * players genuinely stop. Only one category renders at a time, so scrolling off
 * the end of Играчи now ends the page instead of arriving in Тренери.
 *
 * Every panel is still in the HTML, hidden rather than unmounted, so the page
 * ships whole to a crawler and switching tabs costs no request and no layout
 * work beyond a class change.
 *
 * The roster is small enough to ship whole (one Sanity read on the server), so
 * the filter runs in the browser against the already-rendered list: no request
 * per keystroke and no loading state.
 *
 * **The active tab is derived, never stored.** State holds only which tab the
 * user asked for; the tab actually shown is that one if it still has matches,
 * otherwise the first that does. So typing a coach's name while Играчи is open
 * moves you to Тренери on its own, and there is no effect to keep in sync and no
 * frame where the page shows an empty panel next to a non-zero result count.
 *
 * Matching is on **name only**, and accepts Latin spellings (`@/lib/translit`).
 * Role and years are visible on the card but are not searched: a query like
 * „играч" would otherwise return a whole category and read as a broken search.
 *
 * **Pressing a tab scrolls back up to it.** Swapping the panel on its own left
 * the reader's scroll where it was, so someone 100 cards down Играчи who pressed
 * Тренери arrived 100 cards down Тренери — the rail was the only thing on screen
 * that had changed. A press now lands the opened category's orange bar directly
 * under the rail, the same place the old jump links landed. Up only: someone
 * still reading the page header asked to change category, not to be sent past
 * the header and the search field.
 */
export function LegendsBrowser({
  bands,
  total,
}: {
  bands: LegendBand[];
  /**
   * DISTINCT people across the roster, counted on the server. It cannot be
   * summed from `bands`: since 3.22 a player-coach appears in two of them, and
   * adding the categories up would report 261 people where the archive holds
   * 211.
   */
  total: number;
}) {
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<LegendCategory | null>(null);
  /**
   * A tab press as a value: which category it opened, plus a counter so that
   * pressing the SAME tab twice reads as two presses. The scroll effect below is
   * keyed on this rather than on `active`, which is the whole point — `active`
   * also moves on its own when a search empties the open category, and being
   * thrown up the page mid-word is not what the typist asked for.
   */
  const [press, setPress] = useState<{
    category: LegendCategory;
    nth: number;
  } | null>(null);
  const inputId = useId();
  const tabsId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const needle = normalise(query);
  const searching = needle.length > 0;

  const visible = useMemo(() => {
    if (!needle) return bands;
    return bands.map((band) => ({
      category: band.category,
      people: band.people.filter((person) =>
        matchesName(person.name ?? "", needle),
      ),
    }));
  }, [bands, needle]);

  // DISTINCT people, not band memberships (3.23, A2/P2). Summing the bands
  // double-counts everyone who is cross-listed, which since 3.22 is 49 of the
  // 211 people — so a search matching a player-coach announced „2 резултати"
  // over a single card. This is the same trap the `total` prop's own doc
  // records twelve lines above; the live count had simply not been changed with
  // it (D-3.23-11). The per-tab `countOf` numbers stay memberships, which is
  // correct: those are scoped to one category.
  const matches = new Set(
    visible.flatMap((band) => band.people.map((person) => person.slug)),
  ).size;

  // A tab exists for every category that holds anyone at all; whether it can be
  // SELECTED depends on the current filter. Built from `bands`, not `visible`,
  // so the rail keeps its shape while typing instead of flickering between two
  // and four items.
  const tabs = bands.filter((band) => band.people.length > 0);
  const countOf = (category: LegendCategory) =>
    visible.find((band) => band.category === category)?.people.length ?? 0;

  const selectable = tabs
    .map((band) => band.category)
    .filter((category) => countOf(category) > 0);
  const active =
    requested !== null && selectable.includes(requested)
      ? requested
      : (selectable[0] ?? null);

  function openTab(category: LegendCategory) {
    setRequested(category);
    setPress((previous) => ({ category, nth: (previous?.nth ?? 0) + 1 }));
  }

  // Runs after the commit that un-hides the pressed panel — before then the
  // section is `display:none` and has no box to measure.
  useEffect(() => {
    if (press === null) return;

    const section = document.getElementById(CATEGORY_ANCHOR[press.category]);
    // `getClientRects()` is empty for anything not rendered. A disabled tab
    // cannot be pressed, so this should not happen; measuring a hidden element
    // would silently scroll to the wrong place if it ever did.
    if (!section || section.getClientRects().length === 0) return;

    // The clearance for the two sticky bars is read off the section's own
    // `scroll-mt-*` rather than restated here, so it stays right if the header
    // token or the rail's height ever change.
    const clearance = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const top = Math.max(
      0,
      section.getBoundingClientRect().top + window.scrollY - clearance,
    );

    if (window.scrollY <= top) return;

    // Read at press time, not at mount: the setting can change under a running
    // page, and this is the only moment its answer matters (`BackToTop`).
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";
    window.scrollTo({ top, behavior });
  }, [press]);

  // Arrow-key navigation across the rail, per the tabs pattern. Only selectable
  // tabs are reachable — stepping onto a tab with no matches and being unable to
  // open it would be a dead end.
  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();

    const reachable = tabs
      .map((band, i) => ({ category: band.category, i }))
      .filter(({ category }) => countOf(category) > 0);
    if (reachable.length === 0) return;

    const at = reachable.findIndex(({ i }) => i === index);
    const next = reachable[(at + step + reachable.length) % reachable.length];
    openTab(next.category);
    tabRefs.current[next.i]?.focus();
  }

  return (
    <>
      <PageHeader
        title="Легенди"
        crumbs={[{ label: "Почетна", href: "/" }, { label: "Легенди" }]}
        // Structural copy — describes the page, claims no fact about the club.
        intro="Играчите, тренерите и раководството што го обележале клубот низ годините."
        meta={personCountLabel(total)}
      >
        {/* Full width on a phone, where `max-w-md` would strand the field mid
            -row; capped from `sm` up so it stays a field rather than a banner. */}
        <div className="mt-8 w-full sm:max-w-md">
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-small font-bold text-paper"
          >
            Пребарај по име
          </label>

          <div className="relative">
            {/* Decorative — the label above names the field. */}
            <SearchGlyph />

            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Име или презиме"
              autoComplete="off"
              // The surface stays white so it still reads as an input against
              // the navy block; its own text and placeholder are therefore
              // measured against white, not against navy.
              //
              // The browser's own clear affordance is suppressed so there is one
              // clear button rather than two side by side.
              className={cn(
                "block w-full border border-mist bg-white py-2.5 pl-10 pr-10 text-body text-ink",
                "placeholder:text-neutral-500",
                "[&::-webkit-search-cancel-button]:appearance-none",
                focusOnNavy,
              )}
            />

            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className={cn(
                  "absolute inset-y-0 right-0 flex w-10 items-center justify-center",
                  "text-paper/80 hover:text-paper",
                  focusOnNavy,
                )}
              >
                <span className="sr-only">Исчисти го пребарувањето</span>
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            )}
          </div>

          {/* Announced on change, so a screen-reader user hears the list shrink
              instead of discovering it. Empty (but present) before the first
              keystroke — a region added later is not announced. */}
          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-small tabular-nums text-paper/80"
          >
            {searching ? resultLabel(matches) : null}
          </p>
        </div>
      </PageHeader>

      {/* The tab rail takes `JumpNav`'s exact surface — sticky beneath the site
          header at `top-header`, on the second navy so header and rail read as
          two bands of one block, horizontally scrollable rather than wrapping.
          No new token: the only thing a tab does that a jump link did not is
          hold the orange rule permanently when it is the open one. */}
      <div className="sticky top-header z-30 bg-navy-2">
        <div className="relative mx-auto w-full max-w-page overflow-x-auto px-5 py-1 md:px-8">
          <div
            role="tablist"
            aria-label="Теми"
            className="flex min-w-max items-center gap-5"
          >
            {tabs.map((band, i) => {
              const count = countOf(band.category);
              const isActive = band.category === active;
              const isSelectable = count > 0;

              return (
                <button
                  key={band.category}
                  ref={(node) => {
                    tabRefs.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${tabsId}-${band.category}`}
                  aria-selected={isActive}
                  aria-controls={`${tabsId}-panel-${band.category}`}
                  // Roving tabindex: one stop for the whole rail, then arrows.
                  tabIndex={isActive ? 0 : -1}
                  disabled={!isSelectable}
                  onClick={() => openTab(band.category)}
                  onKeyDown={(event) => onTabKeyDown(event, i)}
                  className={cn(
                    "block border-b-2 py-2 text-small font-bold uppercase tracking-[0.12em] tabular-nums transition-colors",
                    isActive
                      ? "border-orange text-paper"
                      : "border-transparent text-paper/80",
                    isSelectable
                      ? "hover:border-orange hover:text-paper"
                      : // A category the current search does not reach. Kept in
                        // the rail so it cannot look deleted, but it says so.
                        "cursor-not-allowed text-paper/40",
                    focusOnNavy,
                  )}
                >
                  {CATEGORY_TAB_LABEL[band.category]}
                  {/* The count rides in the tab while searching, so a user can
                      see where their matches are without opening each one. */}
                  {searching && (
                    <span className="ml-1.5 font-normal">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Container className="py-section">
        {searching && matches === 0 ? (
          <p className="border border-mist bg-white p-5 text-body text-neutral-700">
            Нема личност со такво име во архивата.
          </p>
        ) : (
          tabs.map((band) => (
            <div
              key={band.category}
              role="tabpanel"
              id={`${tabsId}-panel-${band.category}`}
              aria-labelledby={`${tabsId}-${band.category}`}
              // Hidden, not unmounted: the whole roster stays in the HTML for a
              // crawler and for the browser's own find-on-page after the tab is
              // opened, and switching costs a class rather than a re-render of
              // 100 cards.
              className={cn(band.category !== active && "hidden")}
            >
              <CategoryGrid
                category={band.category}
                people={
                  visible.find((v) => v.category === band.category)?.people ??
                  []
                }
                headingId={`band-${band.category}`}
                anchorId={CATEGORY_ANCHOR[band.category]}
                // Играчи opens the page, so its first card carries the LCP. The
                // other three are hidden on first paint and must not compete for
                // it, whichever tab the user later opens.
                leadsPage={band.category === "player"}
              />
            </div>
          ))
        )}
      </Container>
    </>
  );
}

/**
 * Case-folded for Macedonian — now only to answer „is the user searching at
 * all". The match itself lives in `@/lib/translit`, which folds both sides
 * again on its own terms, because a Latin query and a Cyrillic name cannot be
 * compared through a single normalised key.
 */
function normalise(value: string): string {
  return value.trim().toLocaleLowerCase("mk");
}

/** Same singular rule as the category counts (D-2.02-12): only 1 takes the
 *  singular. */
function resultLabel(count: number): string {
  return `${count} ${count === 1 ? "резултат" : "резултати"}`;
}

function SearchGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-neutral-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5L18 18" strokeLinecap="square" />
    </svg>
  );
}
