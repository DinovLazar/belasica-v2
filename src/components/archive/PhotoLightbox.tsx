"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { focusOnNavy, focusOnPaper } from "@/lib/focus";

/**
 * The season gallery's photo lightbox (Phase 3.05b).
 *
 * **Why it exists.** „Фотографии" renders every archival scan of a season in a
 * 3-up grid, matted at `3/2`. That is the right index, but it is not a way to
 * *look* at a photograph — a team photo from 1963 arrives about 380px wide,
 * and the faces in it are the substance of the archive. This opens the scan on
 * the navy ground at up to 92vw × 82vh, with its caption and date beside it.
 *
 * **Why a provider + a trigger, rather than one component.** `PhotoGrid` and
 * the season page stay **server** components: the Sanity image URLs are built
 * on the server and only plain serialisable data crosses into the client
 * (`id · url · width · height · caption · date`). Nothing here imports the
 * Sanity client or the image-URL builder. The grid's own markup — the frames,
 * the captions, the reveal — is server-rendered exactly as before and is
 * passed through this provider as `children`; only the button and the overlay
 * are client code.
 *
 * **Not a carousel.** No autoplay, no ticker, no transition between slides. The
 * overlay animates once on open (transform + opacity, 160ms ease-out — brand.md
 * §Motion) and is instant under `prefers-reduced-motion`, which `globals.css`
 * enforces globally.
 */
export type LightboxPhoto = {
  id: string;
  /** Built server-side with `urlFor(...)`; never derived in this file. */
  url: string;
  width: number;
  height: number;
  caption: string | null;
  date: string | null;
};

/** The accessible name for a scan the archive holds no caption for. It states
 *  what the image IS and claims nothing about it (content-truth). */
const UNCAPTIONED = "Архивска фотографија";

type LightboxContextValue = {
  open: (index: number, trigger: HTMLElement) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

/* ------------------------------------------------------------------ *
 * Provider — owns the open index, the overlay, and the page's scroll lock.
 * ------------------------------------------------------------------ */
export function PhotoLightboxProvider({
  photos,
  children,
}: {
  photos: LightboxPhoto[];
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  // The element that opened the overlay. Focus goes back to it on close, so a
  // keyboard user lands on the thumbnail they were on rather than at the top
  // of the document (WCAG 2.4.3).
  const triggerRef = useRef<HTMLElement | null>(null);

  const isOpen = index !== null;
  const count = photos.length;

  const open = useCallback((next: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIndex(next);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    setEntered(false);
    // Return focus after React has removed the dialog, or the browser moves it
    // to <body> on unmount and the restore is lost.
    const trigger = triggerRef.current;
    triggerRef.current = null;
    requestAnimationFrame(() => trigger?.focus());
  }, []);

  // Navigation WRAPS in both directions, so neither arrow is ever a dead end
  // and neither is ever disabled — a disabled control at the end of a set is a
  // worse answer than a set with no end.
  const step = useCallback(
    (delta: number) => {
      setIndex((current) =>
        current === null ? current : (current + delta + count) % count,
      );
    },
    [count],
  );

  /* Entry animation. Mount hidden, then flip on the next frame so the
     transition actually runs. Reduced motion is handled in globals.css, which
     zeroes every transition duration — the overlay simply appears. */
  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  /* Scroll lock.

     It goes on the SCROLLING ELEMENT — `<html>` here — not on `<body>`.
     `body { overflow: hidden }` is the more common recipe and it silently did
     nothing on this site: measured with the overlay open, `window.scrollTo`
     still moved the page (3000 → 3800), because `document.scrollingElement` is
     `<html>` and the body's overflow did not propagate to the viewport. The
     lock is only real if it is applied where the scrolling actually happens.

     `overflow: hidden` (rather than `position: fixed`) keeps the scroll offset
     intact, so there is nothing to restore and the page is exactly where it
     was on close. The padding compensates for the scrollbar the lock removes,
     so the page behind does not jump sideways — a no-op on overlay-scrollbar
     platforms, where the measured width is 0. */
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = root.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    return () => {
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
    };
  }, [isOpen]);

  /* Move focus into the dialog on open. */
  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen || !photos[index]) {
    return (
      <LightboxContext.Provider value={{ open }}>
        {children}
      </LightboxContext.Provider>
    );
  }

  const photo = photos[index];
  const single = count < 2;

  /* Focus trap. Tab cycles the dialog's own controls and never reaches the
     page behind it (WCAG 2.1.2). Queried live rather than held in a ref, so
     the single-photo case — where the arrows are not rendered at all — traps
     correctly with just the close button. */
  const trapTab = (event: React.KeyboardEvent) => {
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "ArrowLeft":
        if (!single) {
          event.preventDefault();
          step(-1);
        }
        break;
      case "ArrowRight":
        if (!single) {
          event.preventDefault();
          step(1);
        }
        break;
      case "Tab":
        trapTab(event);
        break;
    }
  };

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Фотографии од сезоната"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        // A click on the BACKDROP closes; a click on the photo or a control
        // does not, because those are not this element.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className={cn(
          // Radius 0 and no shadow (brand rules 6 and 7) — the overlay is a
          // navy block over the page, not a floating card.
          "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-navy/96 p-4",
          "transition-[opacity,transform] duration-[160ms] ease-out",
          entered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={close}
          className={cn(CONTROL, focusOnNavy, "absolute right-4 top-4")}
        >
          <span className="sr-only">Затвори</span>
          <X className="size-6" aria-hidden />
        </button>

        {/* Both arrows are absent — not merely hidden — for a season with one
            photograph, where „next" would only ever return the same scan. */}
        {!single && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className={cn(
                CONTROL,
                focusOnNavy,
                "absolute left-4 top-1/2 -translate-y-1/2",
              )}
            >
              <span className="sr-only">Претходна фотографија</span>
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className={cn(
                CONTROL,
                focusOnNavy,
                "absolute right-4 top-1/2 -translate-y-1/2",
              )}
            >
              <span className="sr-only">Следна фотографија</span>
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </>
        )}

        <figure className="flex min-h-0 flex-col items-center gap-5">
          {/* `object-contain` inside a 92vw × 82vh cap, so a tall portrait scan
              and a wide team photo both arrive whole. Keyed by id: without it
              React reuses the <img> across a step and the previous photo
              lingers until the next one decodes. */}
          <Image
            key={photo.id}
            src={photo.url}
            alt={photo.caption ?? UNCAPTIONED}
            width={photo.width}
            height={photo.height}
            sizes="92vw"
            className="h-auto max-h-[82vh] w-auto max-w-[92vw] object-contain"
          />

          <figcaption className="max-w-measure text-center">
            {photo.date && (
              <p className="text-overline font-bold uppercase tracking-overline text-paper/80">
                {photo.date}
              </p>
            )}
            {photo.caption && (
              <p className={cn("text-body text-paper", photo.date && "mt-2")}>
                {photo.caption}
              </p>
            )}
            {!single && (
              <p
                aria-live="polite"
                className={cn(
                  "text-overline font-bold uppercase tracking-overline text-paper/80",
                  (photo.date || photo.caption) && "mt-3",
                )}
              >
                {index + 1} / {count}
              </p>
            )}
          </figcaption>
        </figure>
      </div>
    </LightboxContext.Provider>
  );
}

/**
 * The overlay's controls — brand.md §Components („Buttons"): an orange fill
 * carrying navy ink (5.81:1), swapping to a paper fill on hover so the state
 * is never carried by colour alone. 48×48 CSS px, well above the 24px floor,
 * because these are the overlay's only affordances and are often used on a
 * phone. `size-12` + `p-0` override `u-btn`'s text padding (utilities beat
 * `@layer components`).
 */
const CONTROL = "u-btn size-12 p-0";

/**
 * The grid thumbnail's button. Wraps the server-rendered frame, so the photo
 * itself never becomes client code.
 *
 * Hover follows brand.md §Components („Card"): the 6px orange bar wipes in
 * along the BOTTOM edge and the block lifts 4px. The bar is absolutely
 * positioned over the frame's lower edge rather than added as a border, so
 * hovering shifts nothing in the grid.
 */
export function PhotoLightboxTrigger({
  index,
  label,
  children,
}: {
  index: number;
  label: string | null;
  children: React.ReactNode;
}) {
  const context = useContext(LightboxContext);

  // No provider (or JS not yet hydrated) — render the frame exactly as the
  // grid always did. The gallery is fully usable without the lightbox.
  if (!context) return <>{children}</>;

  return (
    <button
      type="button"
      // The caption is the photo's own description, so it is the button's
      // name; „Отвори" states what activating it does.
      aria-label={`Отвори: ${label?.trim() || UNCAPTIONED}`}
      onClick={(event) => context.open(index, event.currentTarget)}
      className={cn(
        "group relative block w-full cursor-pointer",
        "transition-transform duration-[160ms] ease-out hover:-translate-y-1",
        // The gallery sits on a paper block, so the ring is navy (14.95:1);
        // the overlay's own controls sit on navy and take the orange one.
        focusOnPaper,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 bottom-0 h-1.5 origin-bottom scale-y-0 bg-orange",
          "transition-transform duration-[160ms] ease-out group-hover:scale-y-100",
        )}
      />
    </button>
  );
}
