import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  LineBasicMaterial,
  Matrix4,
  Object3D,
  PlaneGeometry,
  Quaternion,
  Vector3,
  type BufferGeometry as Geometry,
  type ShaderMaterial,
  type Texture,
} from "three";

import { TextureCache } from "./atlas";
import {
  GALLERY_COLOR,
  GALLERY_POINTS,
  GALLERY_WIDTH,
  SWOOSHES,
  curveThrough,
  type Layout,
  type SwooshSpec,
} from "./layout";
import { makeFramesMaterial } from "./materials";
import { RIBBON_KEY, atlasUrl, pieces } from "./pieces";
import { buildRibbonGeometry, makeRibbonMaterial, sampleCurve, type CurveSamples } from "./ribbon";

/**
 * Everything the scene builds once and then mutates every frame. It is kept
 * out of the component so the scene file reads as the timeline and nothing
 * else. Rebuilt only when the orientation or the quality tier changes.
 */

const SPEED_LINES = 24;

interface BuiltSwoosh {
  spec: SwooshSpec;
  geometry: Geometry;
  /** The un-swayed vertex positions, so the sway is never cumulative. */
  base: Float32Array;
  material: ShaderMaterial;
}

interface BuiltGallery {
  samples: CurveSamples;
  geometry: Geometry;
  material: ShaderMaterial;
  /** Where the gate sits along the curve, 0 to 1. */
  gateAt: number;
}

export interface BuiltScene {
  key: string;
  layout: Layout;
  swooshes: BuiltSwoosh[];
  gallery: BuiltGallery;
  frames: { geometry: Geometry; material: ShaderMaterial };
  speedLines: {
    geometry: Geometry;
    material: LineBasicMaterial;
    seeds: { x: number; y: number; phase: number; length: number }[];
  };
  cache: TextureCache;
  ribbon: { current: Texture | null };
  parallax: { yaw: number; pitch: number };
  scratch: {
    matrix: Matrix4;
    dummy: Object3D;
    position: Vector3;
    normal: Vector3;
    side: Vector3;
    tangent: Vector3;
    quat: Quaternion;
    projected: Vector3;
  };
  /** Ask for a piece's atlas, then its neighbours. */
  request: (index: number) => void;
}

export const buildScene = (key: string, layout: Layout, quality: "low" | "high"): BuiltScene => {
  const high = quality === "high";

  const swooshes = SWOOSHES.filter((spec) => high || !spec.optional).map((spec) => {
    const samples = sampleCurve(curveThrough(spec.points, layout), high ? 300 : 200);
    const geometry = buildRibbonGeometry(samples, spec.width);
    const positions = (geometry.getAttribute("position") as BufferAttribute).array as Float32Array;
    return {
      spec,
      geometry,
      base: positions.slice(),
      material: makeRibbonMaterial(spec.color, spec.alpha, spec.shine),
    };
  });

  const segments = high ? 600 : 300;
  const samples = sampleCurve(curveThrough(GALLERY_POINTS, layout), segments);
  const galleryMaterial = makeRibbonMaterial(GALLERY_COLOR, 1, 0.45);
  const stripes = galleryMaterial.uniforms.uStripes;
  if (stripes) stripes.value = 1;
  const nearFrom = galleryMaterial.uniforms.uNearFrom;
  const nearTo = galleryMaterial.uniforms.uNearTo;
  if (nearFrom) nearFrom.value = 1.5;
  if (nearTo) nearTo.value = 6;
  // The gate is one of the control points, so its parameter is the nearest sample.
  let gateAt = 0;
  let best = Infinity;
  samples.points.forEach((point, i) => {
    const d = point.distanceToSquared(layout.gate);
    if (d < best) {
      best = d;
      gateAt = i / segments;
    }
  });

  const framesGeometry = new PlaneGeometry(3.2, 2.4);
  const tiles = new Float32Array(pieces.length);
  pieces.forEach((_, i) => {
    tiles[i] = i;
  });
  framesGeometry.setAttribute("aTile", new InstancedBufferAttribute(tiles, 1));

  const linesGeometry = new BufferGeometry();
  linesGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(new Float32Array(SPEED_LINES * 6), 3),
  );

  const cache = new TextureCache(high ? 6 : 4, RIBBON_KEY);

  return {
    key,
    layout,
    swooshes,
    gallery: {
      samples,
      geometry: buildRibbonGeometry(samples, GALLERY_WIDTH),
      material: galleryMaterial,
      gateAt,
    },
    frames: { geometry: framesGeometry, material: makeFramesMaterial() },
    speedLines: {
      geometry: linesGeometry,
      material: new LineBasicMaterial({
        color: new Color("#ffffff"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      }),
      seeds: Array.from({ length: SPEED_LINES }, (_, i) => ({
        x: Math.sin(i * 12.9898) * 13,
        y: 1 + Math.sin(i * 78.233) * 7,
        phase: (Math.sin(i * 43.7585) * 0.5 + 0.5) % 1,
        length: 3 + ((i * 7) % 5),
      })),
    },
    cache,
    ribbon: { current: null },
    parallax: { yaw: 0, pitch: 0 },
    scratch: {
      matrix: new Matrix4(),
      dummy: new Object3D(),
      position: new Vector3(),
      normal: new Vector3(),
      side: new Vector3(),
      tangent: new Vector3(),
      quat: new Quaternion(),
      projected: new Vector3(),
    },
    request: (index: number) => {
      [index, index + 1, index + 2, index - 1].forEach((i) => {
        const piece = pieces[i];
        if (piece) void cache.load(piece.name, atlasUrl(piece.name, quality));
      });
    },
  };
};

export const disposeScene = (built: BuiltScene): void => {
  built.swooshes.forEach((swoosh) => {
    swoosh.geometry.dispose();
    swoosh.material.dispose();
  });
  built.gallery.geometry.dispose();
  built.gallery.material.dispose();
  built.frames.geometry.dispose();
  built.frames.material.dispose();
  built.speedLines.geometry.dispose();
  built.speedLines.material.dispose();
  built.cache.dispose();
  built.ribbon.current = null;
};
