import Script from "next/script";
import Link from "next/link";

/**
 * The Flash player these pages run on, served from this domain.
 *
 * It used to come from the `react-ruffle` package, which hardcodes
 * `https://unpkg.com/@ruffle-rs/ruffle` in its build and cannot be pointed
 * anywhere else. That put 12.7 MB of WebAssembly, and whether any of the art
 * plays at all, on a CDN nobody here controls. The same player has been
 * sitting in `public/ruffle/` the whole time, so it serves from there now:
 * nothing to fall back to, because there is nothing left to go down.
 *
 * Ruffle's script replaces the `<object>` below with its own player element.
 * This is the polyfill path, used by the XSPF jukebox, which waits for a
 * click because it plays music. The art pages use `player.tsx` instead, so
 * they can autoplay without an unmute badge on every silent drawing.
 */

interface Props {
  src: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Ruffle = ({ src, width, height, className, style }: Props) => (
  <>
    <Script src="/ruffle/ruffle.js" strategy="lazyOnload" />
    <object
      data={src}
      width={width}
      height={height}
      className={className ?? "w-full"}
      style={style}
    >
      <param name="movie" value={src} />
      <p>
        Your browser does not support WebAssembly,{" "}
        <Link href="https://ruffle.rs/">see the Ruffle documentation</Link>.
      </p>
    </object>
  </>
);

export default Ruffle;
