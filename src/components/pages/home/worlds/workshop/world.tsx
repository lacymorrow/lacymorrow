import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, HemisphereLight, SpotLight, Vector3 } from "three";

import type { WorldProps } from "../types";
import { FOV, monitorReticleScale, sampleCamera, smoothstep } from "./camera";
import { createCovers } from "./covers";
import data from "./data.json";
import { createField } from "./field";
import { FOG_FAR, FOG_NEAR, palette } from "./palette";
import { createProps, LAMP_SHADE, LAMP_TARGET } from "./props";

/**
 * 24 Million. One crosshair on a monitor pulls back into a field of
 * 24,593 lit screens, one per thousand downloads of CrossOver. The whole
 * timeline is a function of `progress`. docs/worlds/workshop.md.
 */

const SCREEN_COUNT = Math.round(data.crossoverDownloads / 1000);
const YAW = (1.5 * Math.PI) / 180;
const PITCH = (1 * Math.PI) / 180;

type SceneProps = Omit<WorldProps, "active">;

const Scene = ({ progress, quality, pointer, onReady }: SceneProps) => {
  const high = quality === "high";
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const built = useMemo(() => {
    const field = createField(SCREEN_COUNT, quality);
    const props = createProps();
    const covers = createCovers(data.albumArtMonths, quality);

    // Distance and decay keep the warm light a pool on the bench instead of
    // a wash across the floor.
    const lamp = new SpotLight(palette.lamp, 13, 5, 0.55, 0.5, 2);
    lamp.position.copy(LAMP_SHADE);
    lamp.target.position.copy(LAMP_TARGET);

    const root = new Group();
    root.add(field.mesh, props.mesh, covers.group, lamp, lamp.target);
    // Just enough sky to keep the lamp and the monitor from reading as holes.
    if (high) root.add(new HemisphereLight("#26262c", palette.background, 1.1));

    const dispose = () => {
      field.dispose();
      props.dispose();
      covers.dispose();
      lamp.dispose();
    };
    return { root, uniforms: field.uniforms, dispose };
  }, [quality, high]);

  useEffect(() => built.dispose, [built]);

  // Per-frame writes go through a ref so nothing memoized is mutated in place.
  const uniforms = useRef(built.uniforms);
  useEffect(() => {
    uniforms.current = built.uniforms;
  }, [built]);

  const pos = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const readyRef = useRef(false);

  // Aspect only changes on resize, so the reticle scale is set outside the
  // frame loop.
  useEffect(() => {
    uniforms.current.uMonoScale.value = monitorReticleScale(size.width / size.height);
  }, [size.width, size.height]);

  useFrame((state) => {
    const p = progress.get();
    uniforms.current.uProgress.value = p;
    if (high) uniforms.current.uTime.value = state.clock.elapsedTime;

    sampleCamera(p, size.width / size.height, pos, target);
    camera.position.copy(pos);
    camera.lookAt(target);
    if (high) {
      const weight = smoothstep(0.2, 0.5, p);
      const { x, y } = pointer.get();
      camera.rotateY(-x * weight * YAW);
      camera.rotateX(-y * weight * PITCH);
    }

    if (!readyRef.current) {
      readyRef.current = true;
      onReady();
    }
  });

  return (
    <>
      <fog attach="fog" args={[palette.background, FOG_NEAR, FOG_FAR]} />
      <primitive object={built.root} />
    </>
  );
};

export const WorkshopWorld = ({ progress, active, quality, pointer, onReady }: WorldProps) => (
  <div className="relative size-full">
    <Canvas
      flat
      dpr={quality === "high" ? [1, 1.5] : 1}
      frameloop={active ? "always" : "never"}
      camera={{ fov: FOV, near: 0.05, far: 200, position: [0, 1.15, -0.5] }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      style={{ background: palette.background }}
    >
      <Scene progress={progress} quality={quality} pointer={pointer} onReady={onReady} />
    </Canvas>
    {/* The overlay copy sits bottom left over a field of lights. This keeps it readable. */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(135% 85% at 4% 108%, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.66) 38%, rgba(9,9,11,0) 70%)",
      }}
    />
  </div>
);

export default WorkshopWorld;
