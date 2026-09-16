import { Color, ShaderMaterial, Vector3, type IUniform } from "three";

import { FOG_FAR, FOG_NEAR, palette } from "./palette";

/**
 * One material for every screen in the field, the monitor included. The
 * crosshair is drawn in the fragment shader in world units on the quad, so
 * it stays square whatever the quad's aspect and falls to a bright speck
 * when the quad is a few pixels wide. docs/worlds/workshop.md section 6.
 */

const vertex = /* glsl */ `
attribute float aLitAt;
attribute float aTint;
attribute float aSeed;

varying vec2 vUv;
varying float vLitAt;
varying float vTint;
varying float vSeed;
varying float vDepth;

void main() {
  vUv = uv;
  vLitAt = aLitAt;
  vTint = aTint;
  vSeed = aSeed;
  vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform float uProgress;
uniform float uTime;
uniform float uBlink;
uniform float uMonoScale;
uniform vec3 uPalette[4];
uniform vec3 uSurface;
uniform vec3 uDisplay;
uniform vec3 uArm;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vUv;
varying float vLitAt;
varying float vTint;
varying float vSeed;
varying float vDepth;

float hash1(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

// Inside edge: 1 when x is below e. A zero-width aa is a hard step.
float below(float e, float aa, float x) {
  return 1.0 - smoothstep(e, e + aa, x);
}

// Outside edge: 1 when x is above e.
float above(float e, float aa, float x) {
  return smoothstep(e - aa, e, x);
}

void main() {
  vec2 p = vUv - 0.5;
  float bezel = max(step(0.44, abs(p.x)), step(0.40, abs(p.y)));

  // World units on the quad. The monitor (litAt below zero) is a real app
  // on a real screen, so its reticle is drawn small and thin the way
  // CrossOver draws it, at a scale the world keeps at a constant share of
  // the viewport. The audience screens draw theirs large enough to survive
  // being three pixels wide.
  float mono = step(vLitAt, -0.5);
  float scale = mix(1.0, uMonoScale, mono);
  float arm = mix(0.0065, 0.0035, mono);
  vec2 q = p * vec2(0.5, 0.3) * scale;

  // The monitor's reticle is hairline thin, so it antialiases on every
  // tier; on low the field falls back to hard edges, which is what the
  // quality table buys.
  #ifdef AA
    float aaWeight = 1.0;
  #else
    float aaWeight = mono;
  #endif
  float aa = max(fwidth(q.x) * 1.5 * aaWeight, 1e-6);

  float armH = below(arm, aa, abs(q.y)) * above(0.018, aa, abs(q.x)) * below(0.06, aa, abs(q.x));
  float armV = below(arm, aa, abs(q.x)) * above(0.018, aa, abs(q.y)) * below(0.06, aa, abs(q.y));
  float dot = below(mix(0.0095, 0.011, mono), aa, length(q));

  float blink = step(0.995, hash1(vSeed * 97.0 + floor(uTime * 0.5)));
  float lit = smoothstep(vLitAt - 0.015, vLitAt + 0.015, uProgress) * (1.0 - uBlink * blink);

  vec3 display = mix(uSurface, uDisplay, lit);
  vec3 col = mix(display, uArm * 0.85, max(armH, armV) * lit);
  int tint = int(clamp(vTint, 0.0, 3.0));
  vec3 dotColor = tint == 0 ? uPalette[0] : tint == 1 ? uPalette[1] : tint == 2 ? uPalette[2] : uPalette[3];
  col = mix(col, dotColor, dot * lit);
  col = mix(col, uSurface, bezel);
  col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDepth));

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

export interface ScreenUniforms {
  [uniform: string]: IUniform;
  uProgress: { value: number };
  uTime: { value: number };
  uBlink: { value: number };
  uMonoScale: { value: number };
  uPalette: { value: Vector3[] };
  uSurface: { value: Color };
  uDisplay: { value: Color };
  uArm: { value: Color };
  uFogColor: { value: Color };
  uFogNear: { value: number };
  uFogFar: { value: number };
}

const linear = (hex: string) => {
  const c = new Color(hex);
  return new Vector3(c.r, c.g, c.b);
};

export const createScreenMaterial = (quality: "low" | "high") => {
  const uniforms: ScreenUniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uBlink: { value: quality === "high" ? 1 : 0 },
    uMonoScale: { value: 9 },
    uPalette: { value: [palette.dot, ...palette.accents].map(linear) },
    uSurface: { value: new Color(palette.surface) },
    uDisplay: { value: new Color(palette.display) },
    uArm: { value: new Color(palette.arm) },
    uFogColor: { value: new Color(palette.background) },
    uFogNear: { value: FOG_NEAR },
    uFogFar: { value: FOG_FAR },
  };
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    defines: quality === "high" ? { AA: 1 } : {},
  });
  return { material, uniforms };
};
