import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Canvas } from "@react-three/fiber";
import { Color } from "three";

import { Scene } from "./scene";
import { BACKGROUND, FOV } from "./layout";
import { captionCount, pieces } from "./pieces";
import type { WorldProps } from "../types";

/**
 * The live scene, plus the one HTML element this world is allowed: the caption
 * under the easel ledge. A list of art pieces without names is not a list.
 * docs/worlds/flash.md, 2.
 */

const STILL_MS = 400;

const FlashWorld = ({ progress, active, quality, pointer, onReady }: WorldProps) => {
  const router = useRouter();
  const captionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [still, setStill] = useState(false);
  const stillRef = useRef(false);

  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  // The tail appears once the frame at the gate has been still for 400 ms.
  useEffect(() => {
    let timer = 0;
    const settle = () => {
      if (stillRef.current) {
        stillRef.current = false;
        setStill(false);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        stillRef.current = true;
        setStill(true);
      }, STILL_MS);
    };
    settle();
    const unsubscribe = progress.on("change", settle);
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [progress]);

  const onOpen = useCallback(
    (index: number) => {
      const piece = pieces[index];
      if (piece) void router.push(piece.href);
    },
    [router],
  );

  const onPiece = useCallback((index: number) => setCurrent(index), []);

  const piece = pieces[current];

  return (
    <div className="size-full">
      <Canvas
        dpr={quality === "high" ? [1, 1.5] : 1}
        frameloop={active ? "always" : "never"}
        camera={{ fov: FOV, near: 0.1, far: 200, position: [0.4, 2.8, 15] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl, scene }) => {
          const color = new Color(BACKGROUND);
          gl.setClearColor(color, 1);
          scene.background = color;
        }}
      >
        <Scene
          progress={progress}
          active={active}
          quality={quality}
          pointer={pointer}
          onReady={onReady}
          captionRef={captionRef}
          onPiece={onPiece}
          onOpen={onOpen}
        />
      </Canvas>

      <div
        ref={captionRef}
        className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-mono text-[12px] tracking-[0.06em] text-[#a1a1aa]"
        style={{
          opacity: 0,
          transition: "opacity 300ms ease-out",
          willChange: "transform",
          // The caption can land over a bright piece, so it carries its own
          // ground rather than a plate behind it.
          textShadow: "0 1px 3px rgba(6, 7, 15, 0.95)",
        }}
      >
        {captionCount(current)}
        <span className="pl-4 text-[#fafafa]">{piece?.name}</span>
        <span
          className="pl-4"
          style={{ opacity: still ? 1 : 0, transition: "opacity 200ms ease-out" }}
        >
          {coarse ? "tap to open" : "click to open"}
        </span>
      </div>
    </div>
  );
};

export default FlashWorld;
