import { cn } from "@/lib/utils";
import React from "react";

interface MdxImageProps {
  src?: string;
  alt?: string;
  title?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const isExternal = (src: string) => src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");

const toWebpSrc = (src: string) => src.replace(/\.(jpe?g|png)$/i, ".webp");

export function MdxImage({ src, alt = "", title, className, ...props }: MdxImageProps) {
  if (!src) return null;

  if (isExternal(src)) {
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
