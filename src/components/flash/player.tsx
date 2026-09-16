import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { loadRuffle, nudge, type RufflePlayerElement } from "@/lib/ruffle";

/**
 * One Flash piece, playing on its own.
 *
 * The art pages used to hand their `<object>` to Ruffle's polyfill, which
 * reads allowScriptAccess, flashvars, bgcolor and wmode off the tag but not
 * autoplay, so every drawing sat behind a click-to-play button. Ruffle's
 * global config can turn that on, but it is global: switching it on there
 * also puts an unmute badge over every silent drawing, because Ruffle shows
 * that whenever the audio context is suspended rather than when a movie has
 * sound.
 *
 * So these load through the JavaScript API instead, where the options belong
 * to the movie. The XSPF jukebox at /play/flash still uses the polyfill in
 * `ruffle.tsx`, and still waits for a click, which is the right default for
 * something that plays music.
 */

interface Props {
  src: string;
  /** The SWF's own stage size. These are 4:3. */
  width?: number;
  height?: number;
  className?: string;
}

export const FlashPlayer = ({ src, width = 533, height = 400, className }: Props) => {
  const host = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let player: RufflePlayerElement | null = null;
    let cancelled = false;

    void loadRuffle()
      .then((source) => {
        if (cancelled || !host.current) return undefined;
        player = source.createPlayer();
        player.style.width = "100%";
        player.style.height = "100%";
        player.style.display = "block";
        host.current.appendChild(player);
        // The mouse-reactive pieces need the stage poked once before they
        // draw anything. Wait for the movie to report itself first: there is
        // no stage to click until then.
        player.addEventListener(
          "loadedmetadata",
          () => {
            const el = player;
            if (el) window.setTimeout(() => nudge(el), 400);
          },
          { once: true },
        );
        return player.load({
          url: src,
          autoplay: "on",
          // The drawings are silent, so this badge would only ever be a
          // sticker over the art.
          unmuteOverlay: "hidden",
          contextMenu: "off",
          splashScreen: false,
          warnOnUnsupportedContent: false,
          logLevel: "error",
          letterbox: "on",
          scale: "showAll",
          wmode: "opaque",
          allowScriptAccess: false,
        });
      })
      .catch((error: unknown) => {
        console.error("[flash] that piece would not play", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      player?.remove();
    };
  }, [src]);

  return (
    <>
      <div
        ref={host}
        className={className}
        style={{ width: "100%", maxWidth: width, aspectRatio: `${width} / ${height}` }}
      />
      {failed && (
        <p>
          This piece needs WebAssembly to run,{" "}
          <Link href="https://ruffle.rs/">see the Ruffle documentation</Link>.
        </p>
      )}
      <noscript>
        <p>
          The Flash pieces need JavaScript to run. The file itself is at{" "}
          <a href={src}>{src}</a>.
        </p>
      </noscript>
    </>
  );
};

export default FlashPlayer;
