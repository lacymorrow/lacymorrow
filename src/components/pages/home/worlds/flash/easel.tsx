import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Mesh, ShaderMaterial, Texture } from "three";

import { TextureCache } from "./atlas";
import { GALLERY_START, GALLERY_STEP, type Layout } from "./layout";
import { makePanelMaterial } from "./materials";
import { RIBBON_COLS, RIBBON_ROWS, pieces, tileOf } from "./pieces";
import type { WorldProps } from "../types";

/**
 * The easel: furniture in two greys, and a panel that paints the piece at the
 * gate. The panel walks a four frame atlas of that piece as it scrolls, and
 * crossfades to the next piece over 150 ms. Until a piece's atlas is decoded
 * the panel shows its ribbon tile, soft and then sharp, which is the loading
 * state. docs/worlds/flash.md, 6.
 */

const PANEL_W = 5.33;
const PANEL_H = 4.0;
const FURNITURE = "#26262b";
const PANEL_EDGE = "#1a1a1f";
const CROSSFADE_S = 0.15;
const PHASE_HALF_LIFE_S = 0.09;

const clamp = (n: number, min: number, max: number): number => (n < min ? min : n > max ? max : n);
const smoothstep = (a: number, b: number, n: number): number => {
  const t = clamp((n - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

interface EaselProps extends Pick<WorldProps, "progress" | "active"> {
  layout: Layout;
  cache: TextureCache;
  ribbonTexture: { current: Texture | null };
  onOpen: (index: number) => void;
}

interface EaselState {
  material: ShaderMaterial;
  from: number;
  to: number;
  mix: number;
  phaseA: number;
  phaseB: number;
  dim: number;
  pressed: boolean;
}

export const Easel = ({ layout, cache, ribbonTexture, progress, active, onOpen }: EaselProps) => {
  const store = useRef<EaselState | null>(null);
  const panelRef = useRef<Mesh>(null);

  // The panel material is built and handed to the mesh here rather than in
  // render: it is mutated every frame, which is a job for a ref.
  useEffect(() => {
    const state: EaselState = {
      material: makePanelMaterial(),
      from: 0,
      to: 0,
      mix: 1,
      phaseA: 0,
      phaseB: 0,
      dim: 0,
      pressed: false,
    };
    store.current = state;
    const panel = panelRef.current;
    if (panel) panel.material = state.material;
    return () => {
      state.material.dispose();
      store.current = null;
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((_, delta) => {
    const state = store.current;
    if (!active || !state) return;
    const p = progress.get();
    const dt = Math.min(delta, 0.1);
    const k = (p - GALLERY_START) / GALLERY_STEP;
    const current = clamp(Math.round(k), 0, pieces.length - 1);

    if (current !== state.to) {
      state.from = state.to;
      state.to = current;
      state.mix = 0;
      state.phaseA = state.phaseB;
    }
    state.mix = Math.min(1, state.mix + dt / CROSSFADE_S);

    // The phase walks the four captured frames: the piece painting itself.
    const blend = 1 - Math.pow(2, -dt / PHASE_HALF_LIFE_S);
    state.phaseA += (clamp((k - (state.from - 0.5)) * 3, 0, 3) - state.phaseA) * blend;
    state.phaseB += (clamp((k - (state.to - 0.5)) * 3, 0, 3) - state.phaseB) * blend;
    state.dim += ((state.pressed ? 1 : 0) - state.dim) * (1 - Math.pow(2, -dt / 0.06));

    // Point each side of the panel at a piece: its own atlas if it is decoded,
    // its ribbon tile if it is not.
    const uniforms = state.material.uniforms;
    (["A", "B"] as const).forEach((side) => {
      const index = side === "A" ? state.from : state.to;
      const piece = pieces[index];
      const atlas = piece ? cache.get(piece.name) : undefined;
      const texture = uniforms[`uTex${side}`];
      const grid = uniforms[`uGrid${side}`];
      const tile = uniforms[`uTile${side}`];
      if (!texture || !grid || !tile) return;
      if (atlas) {
        texture.value = atlas;
        grid.value.set(2, 2);
        tile.value.set(0, 0);
      } else if (ribbonTexture.current) {
        const [col, row] = tileOf(index);
        texture.value = ribbonTexture.current;
        grid.value.set(RIBBON_COLS, RIBBON_ROWS);
        tile.value.set(col, row);
      }
    });

    if (uniforms.uPhaseA) uniforms.uPhaseA.value = state.phaseA;
    if (uniforms.uPhaseB) uniforms.uPhaseB.value = state.phaseB;
    if (uniforms.uMix) uniforms.uMix.value = state.mix;
    if (uniforms.uDim) uniforms.uDim.value = state.dim;
    if (uniforms.uOpacity) uniforms.uOpacity.value = 0.6 + 0.4 * smoothstep(0, 0.2, p);
  });

  const open = (event: ThreeEvent<MouseEvent>) => {
    const state = store.current;
    if (!state) return;
    event.stopPropagation();
    // Dim the panel on the way out, so the click answers before the route does.
    state.pressed = true;
    onOpen(state.to);
  };

  const scale = layout.easelScale;
  const legLength = PANEL_H * scale + 3.4;
  const panelBottom = -PANEL_H * scale * 0.5;

  return (
    <group position={layout.easel} rotation={[0, layout.easelYaw, 0]}>
      {/* The stand. It is furniture, it should disappear. */}
      <mesh position={[0, panelBottom - legLength * 0.32, -0.22]}>
        <cylinderGeometry args={[0.05, 0.05, legLength, 6]} />
        <meshBasicMaterial color={FURNITURE} toneMapped={false} />
      </mesh>
      <mesh position={[-PANEL_W * scale * 0.42, panelBottom - legLength * 0.28, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, legLength, 6]} />
        <meshBasicMaterial color={FURNITURE} toneMapped={false} />
      </mesh>
      <mesh position={[PANEL_W * scale * 0.42, panelBottom - legLength * 0.28, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.05, 0.05, legLength, 6]} />
        <meshBasicMaterial color={FURNITURE} toneMapped={false} />
      </mesh>
      <mesh position={[0, panelBottom - 0.22 * scale, 0.1]}>
        <boxGeometry args={[PANEL_W * scale + 0.5, 0.14, 0.34]} />
        <meshBasicMaterial color={FURNITURE} toneMapped={false} />
      </mesh>

      {/* The panel border, then the painting. */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[PANEL_W * scale + 0.3, PANEL_H * scale + 0.3]} />
        <meshBasicMaterial color={PANEL_EDGE} toneMapped={false} />
      </mesh>
      <mesh
        ref={panelRef}
        onClick={open}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <planeGeometry args={[PANEL_W * scale, PANEL_H * scale]} />
      </mesh>
    </group>
  );
};

export default Easel;
