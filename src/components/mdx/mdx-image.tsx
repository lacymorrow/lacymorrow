import { cn } from "@/lib/utils";
import React from "react";

interface StaticImport {
  src: string;
  width?: number;
  height?: number;
}

interface MdxImageProps {
  src?: string | StaticImport;
  alt?: string;
  title?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

// webpack may resolve local images to StaticImport objects; normalize to a string
const resolveSrc = (src: string | StaticImport | undefined): string => {
  if (!src) return "";
  if (typeof src === "string") return src;
  return src.src ?? "";
};

const isExternal = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");

const isBundled = (src: string) => src.includes("/_next/");

const toWebpSrc = (src: string) => src.replace(/\.(jpe?g|png)$/i, ".webp");

export function MdxImage({ src: rawSrc, alt = "", title, className, ...props }: MdxImageProps) {
  const src = resolveSrc(rawSrc);
  if (!src) return null;

  // Webpack-bundled and external images: render as plain <img> — no WebP rewrite
  if (isExternal(src) || isBundled(src)) {
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

  const webpSrc = toWebpSrc(src);
  const hasWebp = webpSrc !== src;

  if (hasWebp) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
