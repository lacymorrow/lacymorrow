 
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { Color, Mesh, ShaderMaterial } from "three";
import { IUniform } from "three";

type NormalizedRGB = [number, number, number];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

interface UniformValue<T = number | Color> {
  value: T;
}

interface SilkUniforms {
  uSpeed: UniformValue<number>;
  uScale: UniformValue<number>;
  uNoiseIntensity: UniformValue<number>;
  uColor1: UniformValue<Color>;
  uColor2: UniformValue<Color>;
  uColor3: UniformValue<Color>;
  uColorMix: UniformValue<number>;
  uRotation: UniformValue<number>;
  uTime: UniformValue<number>;
  [uniform: string]: IUniform;
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform float uColorMix;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

vec3 mixColors(vec3 color1, vec3 color2, vec3 color3, float t, float s) {
  // Create a smooth gradient between the three colors
  vec3 mix1 = mix(color1, color2, smoothstep(0.0, 0.5, t));
  vec3 mix2 = mix(color2, color3, smoothstep(0.5, 1.0, t));
  vec3 finalMix = mix(mix1, mix2, step(0.5, t));

  // Add some variation based on position
  float variation = sin(s * 3.14159) * 0.5 + 0.5;
  return mix(finalMix, color2, variation * 0.3);
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  // Create color mixing based on UV coordinates and time
  float colorT = (vUv.x + sin(uTime * 0.5 + vUv.y * 2.0) * 0.3) * uColorMix;
  colorT = clamp(colorT, 0.0, 1.0);

  vec3 mixedColor = mixColors(uColor1, uColor2, uColor3, colorT, vUv.y);

  vec4 col = vec4(mixedColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

interface SilkPlaneProps {
  uniforms: SilkUniforms;
  colors: string[];
  speed: number;
}

const SilkPlane = forwardRef<Mesh, SilkPlaneProps>(function SilkPlane(
  { uniforms, colors, speed },
  ref
) {
  const { viewport } = useThree();

  // Targets the live uniforms lerp toward. Updating props (e.g. from the mood
  // dial) retargets these; the useFrame below eases the material to match, so a
  // palette change reads as weather rolling in rather than a hard cut.
  const targets = useRef({
    c1: new Color(),
    c2: new Color(),
    c3: new Color(),
    speed,
  });

  useEffect(() => {
    targets.current.c1.set(...hexToNormalizedRGB(colors[0] || "#7B7481"));
    targets.current.c2.set(...hexToNormalizedRGB(colors[1] || "#9B59B6"));
    targets.current.c3.set(...hexToNormalizedRGB(colors[2] || "#E74C3C"));
    targets.current.speed = speed;
  }, [colors, speed]);

  useLayoutEffect(() => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (mesh.current) {
      mesh.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_state: RootState, delta: number) => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (!mesh.current) return;
    const u = (mesh.current.material as ShaderMaterial & { uniforms: SilkUniforms })
      .uniforms;
    u.uTime.value += 0.1 * delta;
    u.uColor1.value.lerp(targets.current.c1, 0.06);
    u.uColor2.value.lerp(targets.current.c2, 0.06);
    u.uColor3.value.lerp(targets.current.c3, 0.06);
    u.uSpeed.value += (targets.current.speed - u.uSpeed.value) * 0.06;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
});
SilkPlane.displayName = "SilkPlane";

export interface SilkProps {
  speed?: number;
  scale?: number;
  colors?: string[];
  colorMix?: number;
  noiseIntensity?: number;
  rotation?: number;
  dpr?: [number, number];
  frameloop?: "always" | "demand" | "never";
}

const Silk: React.FC<SilkProps> = ({
  speed = 5,
  scale = 1,
  colors = ["#7B7481", "#9B59B6", "#E74C3C"],
  colorMix = 1.0,
  noiseIntensity = 1.5,
  rotation = 0,
  dpr = [1, 2],
  frameloop = "always",
}) => {
  const meshRef = useRef<Mesh>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Build uniforms exactly once (lazy state init) — subsequent color/speed
  // changes are eased in via SilkPlane's lerp rather than rebuilding the material.
  const [uniforms] = useState<SilkUniforms>(() => ({
    uSpeed: { value: speed },
    uScale: { value: scale },
    uNoiseIntensity: { value: noiseIntensity },
    uColor1: { value: new Color(...hexToNormalizedRGB(colors[0] || "#7B7481")) },
    uColor2: { value: new Color(...hexToNormalizedRGB(colors[1] || "#9B59B6")) },
    uColor3: { value: new Color(...hexToNormalizedRGB(colors[2] || "#E74C3C")) },
    uColorMix: { value: colorMix },
    uRotation: { value: rotation },
    uTime: { value: 0 },
  }));

  // Pause rendering when the tab is hidden or the field scrolls out of view.
  useEffect(() => {
    const update = (visible: boolean) =>
      setActive(document.visibilityState === "visible" && visible);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | undefined;
    if (wrapRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => update(entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(wrapRef.current);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas dpr={dpr} frameloop={active ? frameloop : "never"}>
        <SilkPlane ref={meshRef} uniforms={uniforms} colors={colors} speed={speed} />
      </Canvas>
    </div>
  );
};

export default Silk;
