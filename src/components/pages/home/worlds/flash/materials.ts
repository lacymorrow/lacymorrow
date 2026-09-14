import { Color, ShaderMaterial, Vector2 } from "three";

import { BACKGROUND } from "./layout";
import { RIBBON_COLS, RIBBON_ROWS } from "./pieces";

/**
 * The two textured materials: the frames riding the ribbon, and the easel
 * panel that paints the piece at the gate. Both are unlit, both sample atlases
 * whose uv origin is the bottom left. docs/worlds/flash.md, 6.
 */

// ---------------------------------------------------------------------------
// Frames on the ribbon: one InstancedMesh, one tile of ribbon.webp each.

const framesVertex = /* glsl */ `
  attribute float aTile;
  varying vec2 vUv;
  varying float vTile;
  varying float vDist;
  void main() {
    vUv = uv;
    vTile = aTile;
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vDist = length(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const framesFragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform vec2 uGrid;
  uniform vec3 uFogColor;
  uniform vec3 uBorder;
  uniform float uFogNear;
  uniform float uFogFar;
  varying vec2 vUv;
  varying float vTile;
  varying float vDist;

  void main() {
    vec2 size = 1.0 / uGrid;
    float col = mod(vTile, uGrid.x);
    float row = floor(vTile / uGrid.x);
    vec2 offset = vec2(col * size.x, 1.0 - (row + 1.0) * size.y);
    // Half a texel in, so mip levels never bleed the neighbouring tile.
    vec2 inset = size * 0.004;
    vec2 uvTile = offset + inset + clamp(vUv, 0.0, 1.0) * (size - inset * 2.0);
    vec3 color = texture2D(uAtlas, uvTile).rgb;

    // A hairline border, one thin line wide at any distance.
    vec2 d = min(vUv, 1.0 - vUv);
    float e = min(d.x, d.y);
    float w = fwidth(e);
    color = mix(color, uBorder, 1.0 - smoothstep(0.008, 0.008 + w, e));

    float fog = smoothstep(uFogNear, uFogFar, vDist);
    // The gate sits about 14 units out. Past it a frame dives at the lens, so
    // it dissolves on the way rather than covering the overlay copy, which is
    // the primary action of the screen.
    float near = smoothstep(8.5, 13.4, vDist);
    gl_FragColor = vec4(mix(color, uFogColor, fog), near * (1.0 - fog * 0.9));
  }
`;

export const makeFramesMaterial = (): ShaderMaterial =>
  new ShaderMaterial({
    vertexShader: framesVertex,
    fragmentShader: framesFragment,
    transparent: true,
    toneMapped: false,
    uniforms: {
      uAtlas: { value: null },
      uGrid: { value: new Vector2(RIBBON_COLS, RIBBON_ROWS) },
      uFogColor: { value: new Color(BACKGROUND) },
      uBorder: { value: new Color("#ffffff") },
      uFogNear: { value: 30 },
      uFogFar: { value: 110 },
    },
  });

// ---------------------------------------------------------------------------
// The easel panel. Two pieces at a time (A and B) so a change crossfades, and
// each piece is a 2 by 2 atlas of its 0.5 s, 1.5 s, 3 s and 6 s frames. The
// phase uniform walks that atlas, which is the piece painting itself.

const panelVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const panelFragment = /* glsl */ `
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform vec2 uGridA;
  uniform vec2 uGridB;
  uniform vec2 uTileA;
  uniform vec2 uTileB;
  uniform float uPhaseA;
  uniform float uPhaseB;
  uniform float uMix;
  uniform float uDim;
  uniform float uOpacity;
  varying vec2 vUv;

  // One cell of a grid atlas. Cell index counts left to right, top to bottom.
  vec3 cell(sampler2D tex, vec2 grid, vec2 tile, float index, vec2 uv) {
    vec2 size = 1.0 / grid;
    float col = tile.x + mod(index, 2.0);
    float row = tile.y + floor(index / 2.0);
    vec2 offset = vec2(col * size.x, 1.0 - (row + 1.0) * size.y);
    vec2 inset = size * 0.004;
    return texture2D(tex, offset + inset + clamp(uv, 0.0, 1.0) * (size - inset * 2.0)).rgb;
  }

  vec3 painted(sampler2D tex, vec2 grid, vec2 tile, float phase, vec2 uv) {
    // A single-cell source (the soft ribbon tile) has no phases to walk.
    float steps = grid.x > 2.5 ? 0.0 : 1.0;
    float p = clamp(phase, 0.0, 3.0) * steps;
    float i0 = floor(p);
    float i1 = min(i0 + 1.0, 3.0);
    return mix(cell(tex, grid, tile, i0, uv), cell(tex, grid, tile, i1, uv), fract(p));
  }

  void main() {
    vec3 a = painted(uTexA, uGridA, uTileA, uPhaseA, vUv);
    vec3 b = painted(uTexB, uGridB, uTileB, uPhaseB, vUv);
    vec3 color = mix(a, b, uMix) * (1.0 - 0.25 * uDim);
    gl_FragColor = vec4(color, uOpacity);
  }
`;

export const makePanelMaterial = (): ShaderMaterial =>
  new ShaderMaterial({
    vertexShader: panelVertex,
    fragmentShader: panelFragment,
    transparent: true,
    toneMapped: false,
    uniforms: {
      uTexA: { value: null },
      uTexB: { value: null },
      uGridA: { value: new Vector2(2, 2) },
      uGridB: { value: new Vector2(2, 2) },
      uTileA: { value: new Vector2(0, 0) },
      uTileB: { value: new Vector2(0, 0) },
      uPhaseA: { value: 0 },
      uPhaseB: { value: 0 },
      uMix: { value: 0 },
      uDim: { value: 0 },
      uOpacity: { value: 0.6 },
    },
  });
