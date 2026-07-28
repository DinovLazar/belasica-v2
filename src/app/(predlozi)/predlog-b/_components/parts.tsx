import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";

/**
 * Направление Б — the small shared pieces of the museum system.
 * Variant-local: nothing here is imported by, or imports from, the live site.
 */

export function Chip({
  label,
  onMat = false,
}: {
  label: string;
  onMat?: boolean;
}) {
  return (
    <span className={onMat ? "pb-chip pb-chip--on-mat" : "pb-chip"}>
      [PLACEHOLDER: {label}]
    </span>
  );
}

/** The wall label above every object in the room. */
export function WallLabel({
  children,
  onMat = false,
  onPhoto = false,
  tight = false,
}: {
  children: React.ReactNode;
  onMat?: boolean;
  /** Over the hero photograph, where brass text cannot hold AA (D-3.05a-5). */
  onPhoto?: boolean;
  tight?: boolean;
}) {
  return (
    <p
      className={[
        "pb-label",
        onMat ? "pb-label--on-mat" : "",
        onPhoto ? "pb-label--on-photo" : "",
        tight ? "pb-label--tight" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{children}</span>
    </p>
  );
}

/**
 * A photograph mounted the way the room mounts things: a wide mat board with a
 * brass keyline scored into it, lit from above. `ratio` is a static Tailwind
 * aspect utility so the class survives the build.
 */
export function Mounted({
  image,
  alt,
  ratio,
  sizes,
  width = 1600,
  priority = false,
  placeholder,
  spotlit = true,
  size = "feature",
  className = "",
}: {
  image: SanityImageSource | null;
  alt: string;
  ratio: string;
  sizes: string;
  width?: number;
  priority?: boolean;
  placeholder: string;
  spotlit?: boolean;
  /** `"gallery"` narrows the mount for the 5-up portrait row. */
  size?: "feature" | "gallery";
  className?: string;
}) {
  return (
    <div className={`${spotlit ? "pb-spot" : ""} ${className}`}>
      <div className={size === "gallery" ? "pb-mat pb-mat--gallery" : "pb-mat"}>
        <div className={`relative w-full overflow-hidden ${ratio}`}>
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
              <Chip label={placeholder} onMat />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The object label that hangs beside a mounted photograph: accession-style
 * meta line, then the caption. Text sits on the wall, not on the mat.
 */
export function ObjectLabel({
  meta,
  children,
  className = "",
}: {
  meta?: string | null;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <figcaption className={className}>
      <span aria-hidden className="pb-marker" />
      {/* No layout utility here: `.pb-label` is itself a flex container, and a
          Tailwind `block` next to it would race the cascade for `display`. */}
      {meta && (
        <span className="pb-label pb-label--tight mt-4">{meta}</span>
      )}
      {children && <p className="pb-small mt-2 max-w-[58ch]">{children}</p>}
    </figcaption>
  );
}
