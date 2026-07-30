import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";

/**
 * Направление В — the small shared pieces of the terrace system.
 * Variant-local: nothing here is imported by, or imports from, the live site.
 */

export function Chip({
  label,
  onNavy = false,
}: {
  label: string;
  onNavy?: boolean;
}) {
  return (
    <span className={onNavy ? "pc-chip pc-chip--on-navy" : "pc-chip"}>
      [PLACEHOLDER: {label}]
    </span>
  );
}

/** Section label — a solid orange bar and tracked caps. */
export function Label({
  children,
  onNavy = false,
}: {
  children: React.ReactNode;
  onNavy?: boolean;
}) {
  return (
    <p className={onNavy ? "pc-label pc-label--on-navy" : "pc-label"}>
      <span>{children}</span>
    </p>
  );
}

/** A photograph as a hard-edged block: no frame, no radius, no mat. */
export function Block({
  image,
  alt,
  ratio,
  sizes,
  width = 1600,
  priority = false,
  placeholder,
  objectPosition = "50% 28%",
  className = "",
}: {
  image: SanityImageSource | null;
  alt: string;
  /** Static Tailwind aspect utility, or `h-full` when the parent sets height. */
  ratio: string;
  sizes: string;
  width?: number;
  priority?: boolean;
  placeholder: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={`pc-card-photo ${ratio} ${className}`}>
      {image ? (
        <Image
          src={urlFor(image).width(width).auto("format").url()}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <Chip label={placeholder} onNavy />
        </span>
      )}
    </div>
  );
}
