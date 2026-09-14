import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  ShaderMaterial,
  Vector3,
  type CatmullRomCurve3,
} from "three";

import { BACKGROUND } from "./layout";

/**
 * A ribbon is a flat band sampled along a curve, drawn on from the head and
 * erased from the tail the way a masked motion tween looked in Flash 8. The
 * mesh never moves; the visible window travels. docs/worlds/flash.md, 6.
 */

export interface CurveSamples {
  /** segments + 1 points, evenly spaced in arc length. */
  points: Vector3[];
  /** The direction the band widens in, at each point. */
  sides: Vector3[];
  /** The band's face normal, roughly toward the camera. */
  normals: Vector3[];
  arcLength: number;
}

const FLAT = new Vector3(0, 0, 1);
const UP = new Vector3(0, 1, 0);

/**
 * Sample a curve into a flat band. The band widens across the screen plane
 * rather than along a Frenet frame: these are 2004 vector swooshes, and a
 * Frenet frame twists them out of the picture plane (and flips on straights).
 */
export const sampleCurve = (curve: CatmullRomCurve3, segments: number): CurveSamples => {
  const points = curve.getSpacedPoints(segments);
  const sides: Vector3[] = [];
  const normals: Vector3[] = [];
  const tangent = new Vector3();
  for (let i = 0; i <= segments; i += 1) {
    const prev = points[Math.max(0, i - 1)] as Vector3;
    const next = points[Math.min(segments, i + 1)] as Vector3;
    tangent.subVectors(next, prev).normalize();
    const side = new Vector3().crossVectors(tangent, FLAT);
    if (side.lengthSq() < 1e-6) side.crossVectors(tangent, UP);
    side.normalize();
    sides.push(side);
    normals.push(new Vector3().crossVectors(side, tangent).normalize());
  }
  return { points, sides, normals, arcLength: curve.getLength() };
};

/** Both ends taper, widest in the middle. */
const halfWidth = (u: number, width: number): number => width * Math.pow(Math.sin(u * Math.PI), 0.6);

export const buildRibbonGeometry = (samples: CurveSamples, width: number): BufferGeometry => {
  const segments = samples.points.length - 1;
  const position = new Float32Array((segments + 1) * 6);
  const uv = new Float32Array((segments + 1) * 4);
  const index = new Uint16Array(segments * 6);
  const edge = new Vector3();

  for (let i = 0; i <= segments; i += 1) {
    const u = i / segments;
    const p = samples.points[i] as Vector3;
    const hw = halfWidth(u, width);
    edge.copy(samples.sides[i] as Vector3).multiplyScalar(hw);
    position[i * 6 + 0] = p.x - edge.x;
    position[i * 6 + 1] = p.y - edge.y;
    position[i * 6 + 2] = p.z - edge.z;
    position[i * 6 + 3] = p.x + edge.x;
    position[i * 6 + 4] = p.y + edge.y;
    position[i * 6 + 5] = p.z + edge.z;
    uv[i * 4 + 0] = u;
    uv[i * 4 + 1] = 0;
    uv[i * 4 + 2] = u;
    uv[i * 4 + 3] = 1;
  }
  for (let i = 0; i < segments; i += 1) {
    const a = i * 2;
    index[i * 6 + 0] = a;
    index[i * 6 + 1] = a + 1;
    index[i * 6 + 2] = a + 2;
    index[i * 6 + 3] = a + 1;
    index[i * 6 + 4] = a + 3;
    index[i * 6 + 5] = a + 2;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex(Array.from(index));
  geometry.computeBoundingSphere();
  return geometry;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDist = length(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uFogColor;
  uniform float uAlpha;
  uniform float uHead;
  uniform float uTail;
  uniform float uTime;
  uniform float uShineOffset;
  uniform float uFlow;
  uniform float uStripes;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uNearFrom;
  uniform float uNearTo;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    float u = vUv.x;
    float v = vUv.y;

    // Feathered edges across the band.
    float edge = smoothstep(0.0, 0.08, v) * smoothstep(1.0, 0.92, v);

    // The 2004 fill: darker at the bottom edge, a gloss stripe near the top.
    vec3 color = mix(uColor * 0.55, uColor, v);
    float gloss = smoothstep(0.58, 0.64, v) * smoothstep(0.78, 0.72, v);
    color = mix(color, vec3(1.0), gloss * 0.45);

    // A white specular band sweeping tail to head.
    float head = fract(uTime / 3.5 + uShineOffset);
    float shine = exp(-pow((u - head) * 28.0, 2.0));
    color = mix(color, vec3(1.0), shine * 0.55);

    // Faint flow stripes, so the gallery ribbon itself reads as moving.
    color -= uStripes * 0.06 * (0.5 + 0.5 * sin(u * 220.0 - uFlow * 220.0));

    // Drawn on from the head, erased from the tail.
    float drawn = smoothstep(uHead, uHead - 0.03, u) * smoothstep(uTail, uTail + 0.03, u);

    float fog = smoothstep(uFogNear, uFogFar, vDist);
    color = mix(color, uFogColor, fog);

    // A band that reaches the lens would wash the whole screen. It fades out
    // short of it instead, which is what flying past looks like.
    float near = smoothstep(uNearFrom, uNearTo, vDist);

    float alpha = edge * drawn * uAlpha * near * (1.0 - fog * 0.85);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export const makeRibbonMaterial = (color: string, alpha: number, shine: number): ShaderMaterial =>
  new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
    uniforms: {
      uColor: { value: new Color(color) },
      uFogColor: { value: new Color(BACKGROUND) },
      uAlpha: { value: alpha },
      uHead: { value: 0 },
      uTail: { value: 0 },
      uTime: { value: 0 },
      uShineOffset: { value: shine },
      uFlow: { value: 0 },
      uStripes: { value: 0 },
      uFogNear: { value: 30 },
      uFogFar: { value: 110 },
      uNearFrom: { value: 4 },
      uNearTo: { value: 14 },
    },
  });
