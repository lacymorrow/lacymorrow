import { useCallback, useEffect, useRef, useState } from "react";

import { Jukebox } from "./jukebox";
import { atlasUrl, pieces } from "./pieces";
import type { WorldProps } from "../types";

/**
 * The live player. The timeline walks the playlist; each piece draws itself
 * through its four captured frames and then holds. Pointing at a row previews
 * that piece and stops the walk, which is safe because nothing in here moves.
 * docs/worlds/flash.md.
 */

/** The four frames were captured at 0.5, 1.5, 3 and 6 seconds. */
const frameFor = (local: number): number => {
  if (local < 0.14) return 0;
  if (local < 0.3) return 1;
  if (local < 0.52) return 2;
  return 3;
};

const FlashWorld = ({ progress, active, quality, onReady, hold }: WorldProps) => {
  const [current, setCurrent] = useState(0);
  const [frame, setFrame] = useState(3);
  const [preview, setPreview] = useState<number | null>(null);
  const readyRef = useRef(false);

  // The timeline walks the playlist. React state changes at most once a piece
  // and once a frame, not once a tick.
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const at = progress.get() * pieces.length;
      const index = Math.min(pieces.length - 1, Math.max(0, Math.floor(at)));
      setCurrent((was) => (was === index ? was : index));
      const next = frameFor(at - Math.floor(at));
      setFrame((was) => (was === next ? was : next));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, progress]);

  const shown = preview ?? current;

  // The screen is a background image, so the browser has it before it paints.
  // The next piece is fetched during the current one, and the world only
  // declares itself ready once the first piece is actually decodable.
  useEffect(() => {
    const piece = pieces[shown];
    if (!piece) return;
    const image = new Image();
    image.src = atlasUrl(piece.name, quality);
    const done = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      onReady();
    };
    if (image.complete) done();
    else image.addEventListener("load", done, { once: true });
    const after = pieces[(shown + 1) % pieces.length];
    if (after) new Image().src = atlasUrl(after.name, quality);
  }, [shown, quality, onReady]);

  const onPreview = useCallback(
    (index: number | null) => {
      setPreview(index);
      hold(index !== null);
    },
    [hold],
  );

  useEffect(() => () => hold(false), [hold]);

  return (
    <div className="size-full" onMouseLeave={() => onPreview(null)}>
      <Jukebox
        current={shown}
        frame={preview === null ? frame : 3}
        quality={quality}
        onPreview={onPreview}
      />
    </div>
  );
};

export default FlashWorld;
