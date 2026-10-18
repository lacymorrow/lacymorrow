import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    moreByLacy?: () => void;
  }
}

/** One quiet "Also by Lacy Morrow" line, rendered by /more.js (also served from this site). */
export const MoreByLacy = ({ className }: { className?: string }) => {
  useEffect(() => {
    window.moreByLacy?.();
  }, []);

  return (
    <>
      <div data-more-by-lacy className={className} />
      <Script src="/more.js" strategy="afterInteractive" />
    </>
  );
};

export default MoreByLacy;
