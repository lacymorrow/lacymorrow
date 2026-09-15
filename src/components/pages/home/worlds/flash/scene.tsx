/* eslint-disable react-hooks/refs -- The geometry, materials and textures in
   this file are GPU objects that are mutated every frame and handed to the
   renderer once. They are not render values: this component renders when the
   viewport orientation or the quality tier changes, and never on scroll. A ref
   is where React says such values belong, and reading one to attach a mesh is
   the whole point of that. */
import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { type BufferAttribute, type InstancedMesh, type LineSegments, type Vector3 } from "three";

import { buildScene, disposeScene, type BuiltScene } from "./build";
import { Easel } from "./easel";
import { FRAME_SPACING, GALLERY_START, GALLERY_STEP, layoutFor } from "./layout";
import { RIBBON_ATLAS, RIBBON_KEY, pieces } from "./pieces";
import type { WorldProps } from "../types";

/**
 * The scene. One useFrame drives everything from `progress`: six ribbons, the
 * 21 frames riding the gallery ribbon, the easel, the camera and the caption.
 * docs/worlds/flash.md, 3 and 6.
 */

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOutCubic = (n: number): number => 1 - Math.pow(1 - n, 3);
const easeInOutSine = (n: number): number => -(Math.cos(Math.PI * n) - 1) / 2;
const smoothstep = (a: number, b: number, n: number): number => {
  const t = clamp01((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface SceneProps
  extends Pick<WorldProps, "progress" | "active" | "quality" | "pointer" | "onReady" | "hold"> {
  /** The caption, positioned under the easel ledge every frame. */
  captionRef: RefObject<HTMLDivElement>;
  /** Called when the piece the easel is painting changes. */
  onPiece: (index: number) => void;
  /** Called when a piece is picked out of the reel, or let go. */
  onPick: (index: number | null) => void;
  /** Called when the easel or a picked frame is clicked. */
  onOpen: (index: number) => void;
}

export const Scene = ({
  progress,
  active,
  quality,
  pointer,
  onReady,
  hold,
  captionRef,
  onPiece,
  onPick,
  onOpen,
}: SceneProps) => {
  const { size, gl } = useThree();
  const high = quality === "high";
  const portrait = size.height > size.width;

  // Geometry, materials and the texture cache live behind a ref, not a memo:
  // they are mutated every frame, and a ref is the sanctioned place for that.
  // They are rebuilt only when the orientation or the quality tier changes.
  const key = `${portrait ? "portrait" : "landscape"}-${quality}`;
  const store = useRef<BuiltScene | null>(null);
  if (store.current === null || store.current.key !== key) {
    store.current = buildScene(key, layoutFor(portrait ? 0.5 : 2), quality);
  }
  const built = store.current;

  useEffect(() => () => disposeScene(built), [built]);

  // The ribbon atlas is this world's one blocking asset: the frames and the
  // easel's loading state both sample it. The easel atlases arrive later.
  useEffect(() => {
    let live = true;
    void built.cache.load(RIBBON_KEY, RIBBON_ATLAS).then((texture) => {
      if (!live || !texture) return;
      built.ribbon.current = texture;
      const uniform = built.frames.material.uniforms.uAtlas;
      if (uniform) uniform.value = texture;
    });
    built.request(0);
    return () => {
      live = false;
    };
  }, [built]);

  const framesRef = useRef<InstancedMesh>(null);
  const linesRef = useRef<LineSegments>(null);
  const readyRef = useRef(false);
  const currentRef = useRef(-1);
  const swayRef = useRef(0);

  // The reel is a show until someone reaches into it. Pointing at a frame
  // stops the timeline and picks that piece, so choosing one is not a test of
  // reflexes. Letting go starts the reel again where it stopped.
  const pickedRef = useRef<number | null>(null);
  const coarse = useRef(false);
  useEffect(() => {
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  const pick = useCallback(
    (index: number | null) => {
      if (pickedRef.current === index) return;
      pickedRef.current = index;
      hold(index !== null);
      onPick(index);
      if (index !== null) built.request(index);
      document.body.style.cursor = index === null ? "" : "pointer";
    },
    [built, hold, onPick],
  );

  useEffect(
    () => () => {
      hold(false);
      document.body.style.cursor = "";
    },
    [hold],
  );

  const onFrameMove = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (coarse.current) return; // a finger picks on tap, not on move
      event.stopPropagation();
      if (typeof event.instanceId === "number") pick(event.instanceId);
    },
    [pick],
  );

  // Touching one frame holds the whole reel, and it stays held until the
  // pointer leaves the scene or Escape is pressed. Releasing when the pointer
  // left a single frame would be useless: the frame is what was moving.
  useEffect(() => {
    const canvas = gl.domElement;
    const release = () => pick(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") release();
    };
    canvas.addEventListener("pointerleave", release);
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("pointerleave", release);
      window.removeEventListener("keydown", onKey);
    };
  }, [gl, pick]);

  const onFrameDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (typeof event.instanceId !== "number") return;
      event.stopPropagation();
      // A finger picks the piece first and opens it on a second tap, so a
      // stray tap on the way past a frame never navigates.
      if (coarse.current && pickedRef.current !== event.instanceId) {
        pick(event.instanceId);
        return;
      }
      onOpen(event.instanceId);
    },
    [onOpen, pick],
  );

  useFrame((state) => {
    if (!active) return;
    const camera = state.camera;
    const p = progress.get();
    const time = state.clock.elapsedTime;
    const layout = built.layout;
    const s = built.scratch;

    // Intro swooshes: drawn on from the head, erased from the tail, which is
    // what a masked motion tween looked like.
    built.swooshes.forEach(({ spec, material, geometry, base }, i) => {
      const [s0, s1] = spec.span;
      const local = clamp01((p - s0) / (s1 - s0));
      const u = material.uniforms;
      if (u.uHead) {
        u.uHead.value =
          p < s0 ? spec.head0 : Math.max(spec.head0, easeOutCubic(Math.min(1, local / 0.45)));
      }
      if (u.uTail) u.uTail.value = Math.max(0, (local - 0.55) / 0.45);
      if (u.uTime) u.uTime.value = time;

      // Idle sway, only while the flight is on screen and only on high.
      if (high && p < 0.24 && swayRef.current % 3 === 0) {
        const attribute = geometry.getAttribute("position") as BufferAttribute;
        const array = attribute.array as Float32Array;
        const count = array.length / 3;
        for (let v = 0; v < count; v += 1) {
          const along = Math.floor(v / 2) / (count / 2 - 1);
          array[v * 3 + 1] = (base[v * 3 + 1] ?? 0) + 0.3 * Math.sin(time * 0.9 + i + along * 2.2);
        }
        attribute.needsUpdate = true;
      }
    });
    swayRef.current += 1;

    // The gallery ribbon draws on early and only leaves at the very end.
    const k = (p - GALLERY_START) / GALLERY_STEP;
    const spacing = FRAME_SPACING / built.gallery.samples.arcLength;
    const gu = built.gallery.material.uniforms;
    if (gu.uHead) gu.uHead.value = easeOutCubic(clamp01((p - 0.06) / 0.14));
    if (gu.uTail) gu.uTail.value = clamp01((p - 0.9) / 0.1);
    if (gu.uTime) gu.uTime.value = time;
    if (gu.uFlow) gu.uFlow.value = k * spacing;

    // Frames: piece i sits at the gate at progress 0.22 + i * 0.034.
    const mesh = framesRef.current;
    const segments = built.gallery.samples.points.length - 1;
    const head = gu.uHead ? (gu.uHead.value as number) : 1;
    const tail = gu.uTail ? (gu.uTail.value as number) : 0;
    if (mesh) {
      for (let i = 0; i < pieces.length; i += 1) {
        const t = built.gallery.gateAt - (i - k) * spacing;
        // A frame only exists on the drawn part of the ribbon.
        if (t < Math.max(0.02, tail) || t > Math.min(0.98, head)) {
          s.matrix.makeScale(0, 0, 0);
          mesh.setMatrixAt(i, s.matrix);
          continue;
        }
        const at = t * segments;
        const i0 = Math.floor(at);
        const f = at - i0;
        const i1 = Math.min(segments, i0 + 1);
        s.position
          .copy(built.gallery.samples.points[i0] as Vector3)
          .lerp(built.gallery.samples.points[i1] as Vector3, f);
        s.normal
          .copy(built.gallery.samples.normals[i0] as Vector3)
          .lerp(built.gallery.samples.normals[i1] as Vector3, f)
          .normalize();
        s.side
          .copy(built.gallery.samples.sides[i0] as Vector3)
          .lerp(built.gallery.samples.sides[i1] as Vector3, f)
          .normalize();
        s.tangent.crossVectors(s.normal, s.side).normalize();

        // Nearer the gate: lifts off the ribbon, grows, turns to the camera.
        // A picked frame does all of that at once, so it reads as the one in
        // your hand rather than one more going past.
        const w =
          pickedRef.current === i
            ? 1
            : 1 - smoothstep(0, 1, Math.abs(t - built.gallery.gateAt) / spacing);
        s.position.addScaledVector(s.normal, 0.35 + 0.5 * w);
        // Frames hang like a filmstrip: the picture's width runs along the
        // ribbon, its top across it.
        s.matrix.makeBasis(s.tangent, s.side.negate(), s.normal);
        s.quat.setFromRotationMatrix(s.matrix);
        s.dummy.position.copy(s.position);
        s.dummy.lookAt(camera.position);
        s.quat.slerp(s.dummy.quaternion, w);

        const scale = (1 + layout.frameGrow * w) * (layout.portrait ? 0.72 : 1);
        s.dummy.scale.set(scale, scale, scale);
        s.matrix.compose(s.position, s.quat, s.dummy.scale);
        mesh.setMatrixAt(i, s.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      // Every instance moves every frame, so the cached bounding sphere three
      // builds on the first raycast is stale by the next one, and pointing at
      // a frame would hit nothing. Clearing it costs nothing until a raycast
      // actually happens, and then it is 21 instances.
      mesh.boundingSphere = null;
    }

    // Speed lines, only during the flight, and never on low.
    const lines = linesRef.current;
    if (lines) {
      const visible = high ? 1 - smoothstep(0.16, 0.24, p) : 0;
      built.speedLines.material.opacity = visible * 0.55;
      lines.visible = visible > 0.01;
      if (lines.visible) {
        const attribute = built.speedLines.geometry.getAttribute("position") as BufferAttribute;
        const array = attribute.array as Float32Array;
        built.speedLines.seeds.forEach((seed, i) => {
          // They stay well behind the gate: a line that reaches the camera
          // projects as a wire across the whole screen.
          const z = -70 + 58 * ((p * 4 + seed.phase + time * 0.05) % 1);
          array[i * 6 + 0] = seed.x * layout.xScale;
          array[i * 6 + 1] = seed.y;
          array[i * 6 + 2] = z;
          array[i * 6 + 3] = seed.x * layout.xScale;
          array[i * 6 + 4] = seed.y;
          array[i * 6 + 5] = z + seed.length;
        });
        attribute.needsUpdate = true;
      }
    }

    // The piece the easel paints: the one picked out of the reel if there is
    // one, otherwise whichever is at the gate.
    const current =
      pickedRef.current ?? Math.min(pieces.length - 1, Math.max(0, Math.round(k)));
    if (current !== currentRef.current) {
      currentRef.current = current;
      onPiece(current);
      built.request(current);
    }

    // Camera: a slow dolly after the flight, plus a few degrees of parallax.
    const dolly = easeInOutSine(clamp01((p - 0.2) / 0.7));
    camera.position.lerpVectors(layout.cameraFrom, layout.cameraTo, dolly);
    camera.lookAt(layout.target);
    if (high) {
      const point = pointer.get();
      built.parallax.yaw += (point.x * 0.026 - built.parallax.yaw) * 0.08;
      built.parallax.pitch += (point.y * 0.017 - built.parallax.pitch) * 0.08;
      camera.rotation.y -= built.parallax.yaw;
      camera.rotation.x -= built.parallax.pitch;
    }

    // The caption hangs under the easel ledge, wherever that lands on screen.
    const caption = captionRef.current;
    if (caption) {
      s.projected
        .set(
          layout.easel.x,
          layout.easel.y - (4 * layout.easelScale) / 2 - 0.62 * layout.easelScale,
          layout.easel.z,
        )
        .project(camera);
      const x = Math.round((s.projected.x * 0.5 + 0.5) * state.size.width);
      const y = Math.round((-s.projected.y * 0.5 + 0.5) * state.size.height);
      caption.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px)`;
      caption.style.opacity = p > 0.16 ? "1" : "0";
    }

    if (!readyRef.current && built.ribbon.current) {
      readyRef.current = true;
      onReady();
    }
  });

  return (
    <>
      {built.swooshes.map(({ spec, geometry, material }, i) => (
        <mesh
          key={`${spec.color}-${i}`}
          geometry={geometry}
          material={material}
          frustumCulled={false}
        />
      ))}
      <mesh
        geometry={built.gallery.geometry}
        material={built.gallery.material}
        frustumCulled={false}
      />
      <instancedMesh
        ref={framesRef}
        args={[built.frames.geometry, built.frames.material, pieces.length]}
        frustumCulled={false}
        onPointerMove={onFrameMove}
        onPointerDown={onFrameDown}
        onPointerMissed={() => pick(null)}
      />
      <lineSegments
        ref={linesRef}
        args={[built.speedLines.geometry, built.speedLines.material]}
        frustumCulled={false}
      />
      <Easel
        layout={built.layout}
        cache={built.cache}
        ribbonTexture={built.ribbon}
        progress={progress}
        active={active}
        pickedRef={pickedRef}
        onOpen={onOpen}
      />
    </>
  );
};

export default Scene;
