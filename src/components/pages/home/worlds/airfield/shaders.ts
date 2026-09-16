import { Color, ShaderMaterial, BackSide, Texture, Vector2 } from "three";
import { PALETTE } from "./track";

/**
 * Two small shaders: the dusk sky dome and the lens pass. The sky is a
 * gradient by elevation with four stops as uniforms so the frame loop can
 * lerp the dusk without allocating. The lens pass is the whole "it is a
 * video feed" treatment: barrel, vignette, analog noise.
 */

export const makeSkyMaterial = () =>
  new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uHorizon: { value: new Color(PALETTE.skyHorizon[0]) },
      uLow: { value: new Color(PALETTE.skyLow[0]) },
      uMid: { value: new Color(PALETTE.skyMid[0]) },
      uZenith: { value: new Color(PALETTE.skyZenith[0]) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHorizon;
      uniform vec3 uLow;
      uniform vec3 uMid;
      uniform vec3 uZenith;
      varying vec3 vDir;
      void main() {
        // Elevation in degrees. Below the horizon the ground hides the dome.
        float e = degrees(asin(clamp(vDir.y, -1.0, 1.0)));
        vec3 c = uHorizon;
        c = mix(c, uLow, smoothstep(0.0, 10.0, e));
        c = mix(c, uMid, smoothstep(10.0, 35.0, e));
        c = mix(c, uZenith, smoothstep(35.0, 90.0, e));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });

/** Barrel distortion, vignette and noise in one full screen pass. */
export const makeLensMaterial = () =>
  new ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tDiffuse: { value: null as Texture | null },
      uTime: { value: 0 },
      uAspect: { value: new Vector2(1, 1) },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float uTime;
      uniform vec2 uAspect;
      varying vec2 vUv;
      const float K = 0.10;
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
      }
      void main() {
        vec2 c = (vUv - 0.5) * uAspect;
        float r2 = dot(c, c);
        // Barrel: push pixels outward by k * r^2, then sample where they came from.
        vec2 d = c * (1.0 + K * r2) / (1.0 + K * 0.85);
        vec2 uv = d / uAspect + 0.5;
        vec3 col = texture2D(tDiffuse, uv).rgb;
        float vig = 1.0 - 0.35 * smoothstep(0.35, 1.1, length(c));
        col *= vig;
        col += (hash(gl_FragCoord.xy) - 0.5) * 0.018;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
