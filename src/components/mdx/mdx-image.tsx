import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import React from "react";

interface MdxImageProps {
  src?: string | StaticImageData;
  alt?: string;
  title?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

// Nextra turns `![](/static/foo.png)` in markdown into a webpack import, which
// arrives here as an object carrying the intrinsic dimensions.
const isStaticImport = (src: MdxImageProps["src"]): src is StaticImageData =>
  typeof src === "object" && src !== null && typeof src.src === "string";

const isExternal = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");

const toWebpSrc = (src: string) => src.replace(/\.(jpe?g|png)$/i, ".webp");

// The prose column is max-w-4xl (896px). Without this the browser picks the
// widest entry in the srcset for every inline screenshot (LAC-4934).
const PROSE_SIZES = "(max-width: 768px) 100vw, 896px";

export function MdxImage({ src: rawSrc, alt = "", title, className, ...props }: MdxImageProps) {
  // Markdown images resolved by webpack can go through next/image and be served
  // resized and as WebP. Before this they rendered as a bare <img> pointing at
  // the original file, so a 3MB PNG screenshot shipped whole to every visitor.
  if (isStaticImport(rawSrc) && rawSrc.width && rawSrc.height) {
    return (
      <Image
        src={rawSrc}
        alt={alt}
        title={title}
        loading="lazy"
        sizes={PROSE_SIZES}
        className={cn("h-auto w-full rounded", className)}
      />
    );
  }

  const src = isStaticImport(rawSrc) ? rawSrc.src : (rawSrc ?? "");
  if (!src) return null;

  // Remote images, and anything webpack bundled without dimensions.
  if (isExternal(src) || src.includes("/_next/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        title={title}
        loading="lazy"
        className={cn("rounded", className)}
        {...props}
      />
    );
  }

  // Literal /public paths written as raw HTML in MDX: prefer a hand-made WebP
  // sibling when one exists, otherwise serve the file as-is.
  const webpSrc = toWebpSrc(src);
  if (webpSrc !== src) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          title={title}
          loading="lazy"
          className={cn("rounded", className)}
          {...props}
        />
      </picture>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      title={title}
      loading="lazy"
      className={cn("rounded", className)}
      {...props}
    />
  );
}

export default MdxImage;
