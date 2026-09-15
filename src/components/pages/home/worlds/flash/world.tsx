import { useCallback, useEffect, useRef, useState } from "react";

import { Jukebox, type PlayerMode } from "./jukebox";
import { atlasUrl, pieces } from "./pieces";
import { loadRuffle, swfUrl, PLAY_OPTIONS, type RufflePlayerElement } from "./ruffle";
import type { WorldProps } from "../types";

/**
 * The live player. Out of the box it walks the playlist through the captured
 * frames, which costs one 37 KB image at a time. Press play once and Ruffle
 * arrives; from then on every row loads its real SWF into the same instance.
 * docs/worlds/flash.md.
 */

/** The four frames were captured at 0.5, 1.5, 3 and 6 seconds. */
const frameFor = (local: number): number => {
  if (local < 0.14) return 0;
  if (local < 0.3) return 1;
  if (local < 0.52) return 2;
  return 3;
};

/** Long enough for 13 MB on a slow connection, short enough to admit defeat. */
const RUFFLE_TIMEOUT_MS = 45_000;

const FlashWorld = ({ progress, active, quality, onReady, hold }: WorldProps) => {
  const [current, setCurrent] = useState(0);
  const [frame, setFrame] = useState(3);
  const [preview, setPreview] = useState<number | null>(null);
  const [mode, setMode] = useState<PlayerMode>("still");
  const readyRef = useRef(false);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<RufflePlayerElement | null>(null);

  // The timeline walks the playlist, but only while the screen is showing the
  // captured frames. Once the real player is up, the person is driving.
  useEffect(() => {
    if (!active || mode !== "still") return;
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
  }, [active, mode, progress]);

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

  /** Put a piece in the live player. One instance serves all of them. */
  const loadInto = useCallback((player: RufflePlayerElement, index: number) => {
    const piece = pieces[index];
    if (!piece) return Promise.resolve();
    return player.load({
      ...PLAY_OPTIONS,
      url: swfUrl(piece.name),
      backgroundColor: piece.background,
    });
  }, []);

  // The one press. Everything after it is a row click.
  const start = useCallback(() => {
    if (playerRef.current) return;
    setPreview(null);
    setMode("loading");
    // The timeline stops for good here: a player nobody asked to move should
    // not move, and the walk would fight whoever is picking tracks.
    hold(true);

    const fail = (error: unknown) => {
      console.error("[worlds] flash: Ruffle would not start", error);
      playerRef.current?.remove();
      playerRef.current = null;
      setMode("failed");
      hold(false);
    };

    void loadRuffle()
      .then((source) => {
        const host = screenRef.current;
        if (!host) throw new Error("the screen went away before Ruffle arrived");
        const player = source.createPlayer();
        player.style.width = "100%";
        player.style.height = "100%";
        player.style.display = "block";
        player.addEventListener("loadedmetadata", () => setMode("live"));
        host.appendChild(player);
        playerRef.current = player;
        return loadInto(player, current);
      })
      .catch(fail);
  }, [current, hold, loadInto]);

  // A stuck spinner is a state nobody designed. If the player has not shown a
  // frame by now, hand the visitor back the picture and the link.
  useEffect(() => {
    if (mode !== "loading") return;
    const t = window.setTimeout(() => {
      console.error("[worlds] flash: Ruffle did not report a movie in time");
      playerRef.current?.remove();
      playerRef.current = null;
      setMode("failed");
      hold(false);
    }, RUFFLE_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [mode, hold]);

  const pick = useCallback(
    (index: number) => {
      setCurrent(index);
      setPreview(null);
      const player = playerRef.current;
      if (!player) return;
      void loadInto(player, index).catch((error: unknown) => {
        console.error("[worlds] flash: that piece would not load", error);
      });
    },
    [loadInto],
  );

  const stop = useCallback(() => {
    playerRef.current?.remove();
    playerRef.current = null;
    setMode("still");
    hold(false);
  }, [hold]);

  // Scrolling away stops the sound and the frames; scrolling back picks up
  // where it was. The stage clears its own hold when a world loses the
  // screen, so a live player has to ask for it again on the way back.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (active) {
      player.play();
      hold(true);
    } else {
      player.pause();
    }
  }, [active, mode, hold]);

  useEffect(
    () => () => {
      playerRef.current?.remove();
      playerRef.current = null;
      hold(false);
    },
    [hold],
  );

  return (
    <div className="size-full" onMouseLeave={() => mode === "still" && onPreview(null)}>
      <Jukebox
        current={shown}
        frame={preview === null ? frame : 3}
        quality={quality}
        onPreview={onPreview}
        mode={mode}
        screenRef={screenRef}
        onPlay={start}
        onPick={pick}
        onStop={stop}
      />
    </div>
  );
};

export default FlashWorld;
