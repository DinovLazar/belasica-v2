import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";

/**
 * Направление А — the small shared pieces of the newsprint system.
 * Variant-local by design: none of these may be imported by the live site,
 * and none of them imports a live-site component.
 */

/** Placeholder chip — the only legal way to show a missing fact. */
export function Chip({
  label,
  onNavy = false,
}: {
  label: string;
  onNavy?: boolean;
}) {
  return (
    <span className={onNavy ? "pa-chip pa-chip--on-navy" : "pa-chip"}>
      [PLACEHOLDER: {label}]
    </span>
  );
}

/** Standing head — agate caps behind a small orange square. */
export function Kicker({
  children,
  onNavy = false,
}: {
  children: React.ReactNode;
  onNavy?: boolean;
}) {
  return (
    <p className={onNavy ? "pa-kicker pa-kicker--on-navy" : "pa-kicker"}>
      {children}
    </p>
  );
}

/**
 * A photograph as the press would run it: navy duotone (or straight black-and-
 * white for the small portrait cuts), a hairline navy frame, and a print
 * caption underneath rather than floating over the image.
 */
export function Cut({
  image,
  alt,
  ratio,
  sizes,
  width = 1400,
  priority = false,
  tone = "duotone",
  placeholder,
  className = "",
}: {
  image: SanityImageSource | null;
  alt: string;
  /** Tailwind aspect utility — static strings only, so the class survives. */
  ratio: string;
  sizes: string;
  width?: number;
  priority?: boolean;
  tone?: "duotone" | "bw";
  placeholder: string;
  className?: string;
}) {
  return (
    <div
      className={`${tone === "bw" ? "pa-bw" : "pa-duotone"} relative w-full ${ratio} ${className}`}
    >
      {image ? (
        <Image
          src={urlFor(image).width(width).auto("format").url()}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          style={{ objectPosition: "50% 28%" }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <Chip label={placeholder} onNavy />
        </span>
      )}
    </div>
  );
}

/**
 * A print caption block: orange rule marker, agate meta line, italic
 * description. The marker is decorative — the words carry the meaning.
 */
export function CutCaption({
  meta,
  children,
  className = "",
}: {
  meta?: string | null;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <figcaption className={`flex gap-3 ${className}`}>
      <span aria-hidden className="pa-marker" />
      <span className="min-w-0">
        {meta && <span className="pa-agate-caps block">{meta}</span>}
        {children && (
          <span className="pa-caption-text mt-1 block">{children}</span>
        )}
      </span>
    </figcaption>
  );
}
