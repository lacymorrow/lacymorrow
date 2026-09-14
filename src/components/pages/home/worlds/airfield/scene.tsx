import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  InstancedMesh,
  Material,
  MeshBasicMaterial,
  MeshLambertMaterial,
  type BufferGeometry,
} from "three";
import {
  buildContactShadows,
  buildFlags,
  buildFoamPads,
  buildGateFrames,
  buildGateLegs,
  buildGateSpill,
  buildGoal,
  buildLaunchPad,
  buildQuadProps,
  buildQuads,
  buildTents,
  buildTrees,
  type Placed,
} from "./build";
import type { Track } from "./curve";
import { PALETTE, SCHOOL } from "./track";

/**
 * Everything static: gates, trees, the school, the pits with the 24 quads.
 * Built once, instanced, never moved. The rig owns the camera and the sky.
 */

interface InstancedProps {
  placed: Placed;
  material: Material;
  renderOrder?: number;
}

const Instanced = ({ placed, material, renderOrder }: InstancedProps) => {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    placed.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    if (placed.colors) {
      placed.colors.forEach((c, i) => mesh.setColorAt(i, c));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    mesh.computeBoundingSphere();
  }, [placed]);
  return (
    <instancedMesh
      ref={ref}
      args={[placed.geometry, material, placed.matrices.length]}
      frustumCulled={false}
      renderOrder={renderOrder}
    />
  );
};

interface SceneProps {
  track: Track;
  quality: "low" | "high";
  /** Registered so the world can dispose everything on unmount. */
  onBuilt: (disposables: { dispose: () => void }[]) => void;
}

export const Dressing = ({ track, quality, onBuilt }: SceneProps) => {
  const built = useMemo(() => {
    const flat = (color: string) => new MeshLambertMaterial({ color, flatShading: true });
    const materials = {
      vertex: new MeshLambertMaterial({ vertexColors: true, flatShading: true }),
      cream: flat(PALETTE.cream),
      ink: flat(PALETTE.ink),
      trunk: flat(PALETTE.trunk),
      brick: flat(PALETTE.brick),
      quad: new MeshLambertMaterial({ color: "#ffffff", flatShading: true }),
      led: new MeshBasicMaterial({ color: PALETTE.led }),
      window: new MeshBasicMaterial({ color: PALETTE.window }),
      spill: new MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: AdditiveBlending,
        fog: false,
        depthWrite: false,
      }),
      shadow: new MeshBasicMaterial({
        color: PALETTE.ink,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        side: DoubleSide,
      }),
    };
    const placed = {
      gateFrames: buildGateFrames(track.gates),
      gateLegs: buildGateLegs(track.gates),
      gateSpill: buildGateSpill(track.gates),
      trees: buildTrees(quality === "high" ? 140 : 70),
      quads: buildQuads(),
      quadProps: buildQuadProps(),
      foamPads: buildFoamPads(),
      tents: buildTents(),
      goal: buildGoal(),
      flags: buildFlags(),
      shadows: buildContactShadows(),
    };
    const launchPad = buildLaunchPad();
    const geometries: BufferGeometry[] = [
      launchPad,
      placed.trees.a.geometry,
      placed.trees.b.geometry,
      placed.trees.c.geometry,
      ...Object.values(placed)
        .filter((p): p is Placed => "geometry" in p)
        .map((p) => p.geometry),
    ];
    return { materials, placed, launchPad, geometries };
  }, [track, quality]);

  useEffect(() => {
    onBuilt([...built.geometries, ...Object.values(built.materials)]);
  }, [built, onBuilt]);

  const { materials: m, placed } = built;
  const [sx, sy, sz] = SCHOOL;

  return (
    <group>
      <Instanced placed={placed.gateFrames} material={m.led} />
      <Instanced placed={placed.gateLegs} material={m.trunk} />
      <Instanced placed={placed.gateSpill} material={m.spill} renderOrder={1} />
      <Instanced placed={placed.trees.a} material={m.vertex} />
      <Instanced placed={placed.trees.b} material={m.vertex} />
      <Instanced placed={placed.trees.c} material={m.vertex} />
      <Instanced placed={placed.quads} material={m.quad} />
      <Instanced placed={placed.quadProps} material={m.ink} />
      <Instanced placed={placed.foamPads} material={m.ink} />
      <Instanced placed={placed.tents} material={m.cream} />
      <Instanced placed={placed.goal} material={m.cream} />
      <Instanced placed={placed.flags} material={m.vertex} />
      <Instanced placed={placed.shadows} material={m.shadow} renderOrder={1} />
      <mesh geometry={built.launchPad} material={m.vertex} />
      <mesh position={[sx, sy, sz]} material={m.brick}>
        <boxGeometry args={[50, 5, 12]} />
      </mesh>
      <mesh position={[sx, 3.0, sz + 6.05]} material={m.window}>
        <boxGeometry args={[46, 0.9, 0.1]} />
      </mesh>
    </group>
  );
};
