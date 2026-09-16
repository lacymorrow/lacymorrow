import {
  CanvasTexture,
  Color,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LinearFilter,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace,
} from "three";

import { FOG_FAR, FOG_NEAR, palette } from "./palette";
import { RACK_DEPTH, RACK_POSITION, RACK_YAW } from "./props";
import { hash } from "./seed";

/**
 * The wall of records: one small tile per month album-art has been on npm,
 * on the front of the rack, bottom row first, the last row still being
 * filled. Every tile is drawn into one canvas atlas at mount, so nothing is
 * downloaded and nothing is a real cover. docs/worlds/workshop.md section 5.
 */

export const COLUMNS = 12;
export const ROWS = 13;
const TILE = 0.115;
const GUTTER = 0.02;

const surfaces = [palette.surface, palette.frame, palette.benchTop];
// Three quiet marks to one bright one, so the wall stays a texture and
// does not out-shout the field.
const marks = [palette.mark, palette.mark, palette.mark, palette.arm];

type Marker = (ctx: CanvasRenderingContext2D, s: number) => void;

const shapes: Marker[] = [
  (ctx, s) => {
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
  },
  (ctx, s) => {
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.24, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
  },
  (ctx, s) => ctx.fillRect(s * 0.45, s * 0.24, s * 0.1, s * 0.52),
  (ctx, s) => ctx.fillRect(s * 0.38, s * 0.38, s * 0.24, s * 0.24),
  (ctx, s) => {
    ctx.lineWidth = s * 0.06;
    ctx.beginPath();
    ctx.arc(s / 2, s / 2, s * 0.21, 0, Math.PI * 2);
    ctx.stroke();
  },
  (ctx, s) => {
    ctx.fillRect(s * 0.24, s * 0.38, s * 0.52, s * 0.07);
    ctx.fillRect(s * 0.24, s * 0.55, s * 0.52, s * 0.07);
  },
];

const drawAtlas = (cell: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = COLUMNS * cell;
  canvas.height = ROWS * cell;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[workshop] no 2d context for the cover atlas");
  for (let i = 0; i < COLUMNS * ROWS; i += 1) {
    const x = (i % COLUMNS) * cell;
    const y = Math.floor(i / COLUMNS) * cell;
    const r = hash(i);
    ctx.fillStyle = surfaces[Math.floor(r * 3)];
    ctx.fillRect(x, y, cell, cell);
    // Scattered, not one bright column down the edge.
    const accent = hash(i + 4) < 1 / 12;
    const color = accent
      ? [...palette.accents, palette.dot][Math.floor(hash(i + 1) * 4)]
      : marks[Math.floor(hash(i + 2) * marks.length)];
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.save();
    ctx.translate(x, y);
    shapes[Math.floor(hash(i + 3) * shapes.length)](ctx, cell);
    ctx.restore();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;
  return texture;
};

const vertex = /* glsl */ `
attribute float aCell;
varying vec2 vUv;
varying float vDepth;
void main() {
  float col = mod(aCell, ${COLUMNS}.0);
  float row = floor(aCell / ${COLUMNS}.0);
  vUv = (uv + vec2(col, row)) / vec2(${COLUMNS}.0, ${ROWS}.0);
  vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform sampler2D uAtlas;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec2 vUv;
varying float vDepth;
void main() {
  // The atlas is painted in sRGB and a plain ShaderMaterial does not decode
  // it, so decode by hand into the linear working space the rest of the
  // world is in. The tiles are drawn, not lit, so they are dimmed to sit at
  // the level of the props the lamp barely reaches, then fogged.
  vec3 col = pow(texture2D(uAtlas, vUv).rgb, vec3(2.2)) * 0.55;
  col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDepth));
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

export const createCovers = (count: number, quality: "low" | "high") => {
  const texture = drawAtlas(quality === "high" ? 48 : 24);
  const geometry = new PlaneGeometry(TILE, TILE);
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uAtlas: { value: texture },
      uFogColor: { value: new Color(palette.background) },
      uFogNear: { value: FOG_NEAR },
      uFogFar: { value: FOG_FAR },
    },
  });
  const total = Math.min(count, COLUMNS * ROWS);
  const mesh = new InstancedMesh(geometry, material, total);
  mesh.frustumCulled = false;

  const x0 = -((COLUMNS - 1) * (TILE + GUTTER)) / 2;
  const y0 = -((ROWS - 1) * (TILE + GUTTER)) / 2;
  const cells = new Float32Array(total);
  const dummy = new Object3D();
  for (let i = 0; i < total; i += 1) {
    dummy.position.set(
      x0 + (i % COLUMNS) * (TILE + GUTTER),
      y0 + Math.floor(i / COLUMNS) * (TILE + GUTTER),
      RACK_DEPTH / 2 + 0.01,
    );
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    cells[i] = i;
  }
  mesh.instanceMatrix.needsUpdate = true;
  geometry.setAttribute("aCell", new InstancedBufferAttribute(cells, 1));

  // Same transform as the rack piece inside the merged props.
  const group = new Group();
  group.position.copy(RACK_POSITION);
  group.rotation.y = RACK_YAW;
  group.add(mesh);

  const dispose = () => {
    geometry.dispose();
    material.dispose();
    texture.dispose();
    mesh.dispose();
  };

  return { group, dispose };
};
