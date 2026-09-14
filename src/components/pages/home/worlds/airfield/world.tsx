import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { NoToneMapping } from "three";
import type { WorldProps } from "../types";
import { buildTrack } from "./curve";
import { Osd, useOsdRefs } from "./osd";
import { initialOsd } from "./flight";
import { Rig } from "./rig";
import { Dressing } from "./scene";

/**
 * The airfield world: one lap through eight lit gates, seen from the quad.
 * The stage owns the title, line and link. This owns the feed.
 */
const AirfieldWorld = ({ progress, active, quality, onReady }: WorldProps) => {
  const track = useMemo(() => buildTrack(), []);
  const osd = useOsdRefs();
  const disposables = useRef<{ dispose: () => void }[]>([]);
  const onBuilt = useCallback((items: { dispose: () => void }[]) => {
    disposables.current = items;
  }, []);

  useEffect(() => {
    const held = disposables;
    return () => {
      held.current.forEach((d) => d.dispose());
      held.current = [];
    };
  }, []);

  return (
    <div className="relative size-full">
      <Canvas
        dpr={quality === "high" ? [1, 1.5] : 1}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, toneMapping: NoToneMapping, powerPreference: "high-performance" }}
        camera={{ fov: 68, near: 0.05, far: 400, position: [0, 0.3, 12] }}
      >
        <Dressing track={track} quality={quality} onBuilt={onBuilt} />
        <Rig
          track={track}
          progress={progress}
          active={active}
          quality={quality}
          osd={osd}
          onReady={onReady}
        />
      </Canvas>
      <Osd
        voltageRef={osd.voltage}
        gatesRef={osd.gates}
        timerRef={osd.timer}
        quality={quality}
        initial={initialOsd}
      />
    </div>
  );
};

export default AirfieldWorld;
