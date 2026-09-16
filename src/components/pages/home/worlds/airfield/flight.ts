import {
  CircleGeometry,
  Color,
  DirectionalLight,
  FogExp2,
  Group,
  HemisphereLight,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { buildOwnProp } from "./build";
import { sampleTable, type Track } from "./curve";
import { makeLensMaterial, makeSkyMaterial } from "./shaders";
import { LAP_END, LAP_SECONDS, LAP_START, PALETTE, VOLT_FULL } from "./track";

/**
 * The flight model from docs/worlds/airfield.md section 3 and everything it
 * drives each frame: camera, dusk, own props, OSD strings, the lens pass.
 * Plain three.js, no React. Built once per mount, stepped from useFrame,
 * disposed on unmount. Exponential smoothing only. No springs.
 */

const DEG = Math.PI / 180;
const SMOOTH_TAU = 0.12;
const SPEED_FULL = 0.35;
const SPEED_RISE_TAU = 0.25;
const SPEED_FALL_TAU = 0.6;
// The spec's camera mounts at +28, but its beat sheet wants 70 percent sky
// on the pad, and +28 with a 68 degree lens puts the horizon at 91 percent.
// The beat wins: +16 hovering, -8 flat out.
const PITCH_PAD = 16;
const PITCH_RANGE = 24;
const ROLL_GAIN = 22;
const ROLL_MAX = 14;
const PROP_RATE_LAP = 90;
const PROP_RATE_SPEED = 60;
const SKY_RADIUS = 390;
const SUN_DISTANCE = 385;
const SUN_AZIMUTH = 250 * DEG;
const SUN_LIGHT_ELEVATION = 8 * DEG;
// three r155+ lights are in physical units, a factor of pi dimmer than the
// legacy units the spec's intensities were written in.
const LIGHT_SCALE = Math.PI;
const SUN_INTENSITY: [number, number] = [1.4 * LIGHT_SCALE, 0.5 * LIGHT_SCALE];
const HEMI_INTENSITY: [number, number] = [0.7 * LIGHT_SCALE, 0.58 * LIGHT_SCALE];

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export const formatVoltage = (v: number) => `${v.toFixed(1)}V`;
export const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
};
export const formatGates = (n: number, total: number) => `GATE ${n}/${total}`;

/** Vertical fov for a 100 degree horizontal target, clamped so phones stay sane. */
const verticalFov = (aspect: number) =>
  clamp((2 * Math.atan(Math.tan(50 * DEG) / aspect)) / DEG, 60, 95);

const pair = (tokens: readonly [string, string]) =>
  [new Color(tokens[0]), new Color(tokens[1])] as const;

export interface OsdElements {
  voltage: HTMLElement | null;
  gates: HTMLElement | null;
  timer: HTMLElement | null;
}

export interface FrameContext {
  camera: PerspectiveCamera;
  scene: Scene;
  gl: WebGLRenderer;
  aspect: number;
  dpr: number;
  width: number;
  height: number;
}

export class Flight {
  readonly root = new Group();

  private readonly track: Track;
  private readonly sunLight: DirectionalLight;
  private readonly hemi: HemisphereLight;
  private readonly skyGroup = new Group();
  private readonly sun: Mesh;
  private readonly ground: Mesh;
  private readonly propSpinners: Group[] = [];
  private readonly propMount = new Group();
  private readonly fog: FogExp2;
  private readonly skyMaterial = makeSkyMaterial();
  private readonly groundMaterial: MeshLambertMaterial;
  private readonly bladeMaterial: MeshLambertMaterial;
  private readonly discMaterial: MeshBasicMaterial;
  private readonly lens: ReturnType<typeof makeLensMaterial> | null;
  private readonly quad: FullScreenQuad | null;
  private readonly target: WebGLRenderTarget | null;
  private readonly disposables: { dispose: () => void }[] = [];
  private readonly colors = {
    horizon: pair(PALETTE.skyHorizon),
    low: pair(PALETTE.skyLow),
    mid: pair(PALETTE.skyMid),
    zenith: pair(PALETTE.skyZenith),
    grass: pair(PALETTE.grass),
  };

  // Motion state
  private s = 0;
  private f = 0;
  private spin = 0;
  private last = 0;
  private first = true;
  private gateCount = -1;
  private voltage = "";
  private timer = "";
  private lastAspect = 0;
  private lastWidth = 0;
  private lastHeight = 0;

  constructor(track: Track, quality: "low" | "high") {
    this.track = track;

    const sunDir = [
      Math.sin(SUN_AZIMUTH) * Math.cos(SUN_LIGHT_ELEVATION),
      Math.sin(SUN_LIGHT_ELEVATION),
      -Math.cos(SUN_AZIMUTH) * Math.cos(SUN_LIGHT_ELEVATION),
    ];
    this.sunLight = new DirectionalLight(PALETTE.sunLight, SUN_INTENSITY[0]);
    this.sunLight.position.set(sunDir[0] * 100, sunDir[1] * 100, sunDir[2] * 100);
    this.hemi = new HemisphereLight(PALETTE.hemiSky, PALETTE.grass[0], HEMI_INTENSITY[0]);
    this.root.add(this.sunLight, this.hemi);

    const skyGeometry =
      quality === "high"
        ? new SphereGeometry(SKY_RADIUS, 24, 12)
        : new SphereGeometry(SKY_RADIUS, 16, 8);
    const sky = new Mesh(skyGeometry, this.skyMaterial);
    sky.frustumCulled = false;
    sky.renderOrder = -2;
    const sunMaterial = new MeshBasicMaterial({ color: PALETTE.sun, fog: false });
    const sunGeometry = new CircleGeometry(14, 24);
    this.sun = new Mesh(sunGeometry, sunMaterial);
    this.sun.frustumCulled = false;
    this.sun.renderOrder = -1;
    this.skyGroup.add(sky, this.sun);
    this.root.add(this.skyGroup);

    this.groundMaterial = new MeshLambertMaterial({ color: PALETTE.grass[0], flatShading: true });
    const groundGeometry = new PlaneGeometry(400, 400);
    groundGeometry.rotateX(-Math.PI / 2);
    this.ground = new Mesh(groundGeometry, this.groundMaterial);
    this.root.add(this.ground);

    this.fog = new FogExp2(PALETTE.skyHorizon[0], 0.0075);

    // Own props, later parented to the camera, pitched back onto the quad's plane.
    const own = buildOwnProp();
    this.bladeMaterial = new MeshLambertMaterial({
      color: PALETTE.ink,
      flatShading: true,
      transparent: true,
    });
    this.discMaterial = new MeshBasicMaterial({
      color: PALETTE.cream,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    for (const x of [-0.5, 0.5]) {
      const arm = new Group();
      arm.position.set(x * 1.08, 0.34, -0.5);
      arm.rotation.x = -PITCH_PAD * DEG;
      const spinner = new Group();
      spinner.add(new Mesh(own.hub, this.bladeMaterial), new Mesh(own.blades, this.bladeMaterial));
      const disc = new Mesh(own.disc, this.discMaterial);
      disc.position.y = 0.004;
      arm.add(spinner, disc);
      this.propSpinners.push(spinner);
      this.propMount.add(arm);
    }

    if (quality === "high") {
      this.lens = makeLensMaterial();
      this.quad = new FullScreenQuad(this.lens);
      this.target = new WebGLRenderTarget(1, 1, {
        samples: 4,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      });
    } else {
      this.lens = null;
      this.quad = null;
      this.target = null;
    }

    this.disposables.push(
      skyGeometry,
      sunGeometry,
      groundGeometry,
      own.hub,
      own.blades,
      own.disc,
      this.skyMaterial,
      sunMaterial,
      this.groundMaterial,
      this.bladeMaterial,
      this.discMaterial,
    );
    if (this.lens) this.disposables.push(this.lens);
    if (this.quad) this.disposables.push(this.quad);
    if (this.target) this.disposables.push(this.target);
  }

  /** Called once the canvas exists: fog on the scene, props on the camera. */
  attach(scene: Scene, camera: PerspectiveCamera) {
    scene.fog = this.fog;
    camera.add(this.propMount);
    this.root.add(camera);
  }

  detach(scene: Scene, camera: PerspectiveCamera) {
    if (scene.fog === this.fog) scene.fog = null;
    camera.remove(this.propMount);
    this.root.remove(camera);
  }

  dispose() {
    for (const d of this.disposables) d.dispose();
    this.disposables.length = 0;
  }

  /** One frame. Returns true on the first frame rendered, for onReady. */
  step(ctx: FrameContext, progress: number, osd: OsdElements): boolean {
    const { camera, scene, gl } = ctx;
    const now = performance.now() / 1000;
    let dt = now - this.last;
    this.last = now;

    if (
      ctx.aspect !== this.lastAspect ||
      ctx.width !== this.lastWidth ||
      ctx.height !== this.lastHeight
    ) {
      this.lastAspect = ctx.aspect;
      this.lastWidth = ctx.width;
      this.lastHeight = ctx.height;
      camera.fov = verticalFov(ctx.aspect);
      camera.near = 0.05;
      camera.far = 400;
      camera.updateProjectionMatrix();
      this.target?.setSize(Math.round(ctx.width * ctx.dpr), Math.round(ctx.height * ctx.dpr));
      this.lens?.uniforms.uAspect.value.set(ctx.aspect, 1);
    }

    // Snap after a pause or on the first frame: nobody scrolls into a swoop.
    if (this.first || dt > 0.5) {
      this.s = progress;
      this.f = 0;
      dt = 1 / 60;
    }
    dt = Math.min(dt, 0.05);

    // 1. Smoothed progress and the speed factor.
    const prevS = this.s;
    this.s += (progress - this.s) * (1 - Math.exp(-dt / SMOOTH_TAU));
    const v = Math.abs(this.s - prevS) / dt;
    const targetF = clamp(v / SPEED_FULL, 0, 1);
    const tau = targetF > this.f ? SPEED_RISE_TAU : SPEED_FALL_TAU;
    this.f += (targetF - this.f) * (1 - Math.exp(-dt / tau));
    const s = this.s;
    const f = this.f;
    const u = clamp((s - LAP_START) / (LAP_END - LAP_START), 0, 1);

    // 2. Camera.
    const track = this.track;
    track.curve.getPointAt(u, camera.position);
    const yaw = sampleTable(track.heading, u);
    const k = sampleTable(track.curvature, u);
    const pitch = (PITCH_PAD - PITCH_RANGE * f) * DEG;
    // Level the wings on the pad and on the ground: the first and last
    // frames are stationary, and a stationary frame that is rolled over
    // reads as a crash, not a hover.
    const level = smoothstep(0, 0.04, u) * (1 - smoothstep(0.96, 1, u));
    const roll = clamp(k * ROLL_GAIN * (0.4 + 0.6 * f) * level, -ROLL_MAX, ROLL_MAX) * DEG;
    camera.rotation.set(pitch, yaw, roll, "YXZ");

    // 3. Dusk. Six lerps, no allocation.
    const c = this.colors;
    const sky = this.skyMaterial.uniforms;
    (sky.uHorizon.value as Color).lerpColors(c.horizon[0], c.horizon[1], s);
    (sky.uLow.value as Color).lerpColors(c.low[0], c.low[1], s);
    (sky.uMid.value as Color).lerpColors(c.mid[0], c.mid[1], s);
    (sky.uZenith.value as Color).lerpColors(c.zenith[0], c.zenith[1], s);
    this.fog.color.lerpColors(c.horizon[0], c.horizon[1], s);
    this.groundMaterial.color.lerpColors(c.grass[0], c.grass[1], s);
    this.sunLight.intensity = lerp(SUN_INTENSITY[0], SUN_INTENSITY[1], s);
    this.hemi.intensity = lerp(HEMI_INTENSITY[0], HEMI_INTENSITY[1], s);
    this.skyGroup.position.copy(camera.position);
    this.ground.position.set(camera.position.x, 0, camera.position.z);
    const el = lerp(5, -2, s) * DEG;
    this.sun.position.set(
      Math.sin(SUN_AZIMUTH) * Math.cos(el) * SUN_DISTANCE,
      Math.sin(el) * SUN_DISTANCE,
      -Math.cos(SUN_AZIMUTH) * Math.cos(el) * SUN_DISTANCE,
    );
    this.sun.lookAt(camera.position);

    // 4. Own props: spool up, race, spool down.
    let rate = 0;
    if (s < LAP_START) rate = PROP_RATE_LAP * smoothstep(0.02, 0.07, s);
    else if (s <= 0.94) rate = PROP_RATE_LAP + PROP_RATE_SPEED * f;
    else rate = PROP_RATE_LAP * (1 - smoothstep(0.94, 1.0, s));
    this.spin += rate * dt;
    const disc = smoothstep(30, 60, rate);
    this.discMaterial.opacity = disc * 0.18;
    this.bladeMaterial.opacity = 1 - disc;
    for (const spinner of this.propSpinners) spinner.rotation.y = this.spin;

    // 5. OSD, written only when a string changes.
    const voltage = formatVoltage(VOLT_FULL - 0.9 * u - 1.3 * f);
    if (voltage !== this.voltage && osd.voltage) {
      this.voltage = voltage;
      osd.voltage.textContent = voltage;
    }
    const lapU = Math.min(u, track.finishU) / track.finishU;
    const timer = formatTimer(s < LAP_START ? 0 : lapU * LAP_SECONDS);
    if (timer !== this.timer && osd.timer) {
      this.timer = timer;
      osd.timer.textContent = timer;
    }
    let count = 0;
    if (u > 0) for (const g of track.gates) if (g.u <= u) count++;
    if (count !== this.gateCount && osd.gates) {
      osd.gates.textContent = formatGates(count, track.gates.length);
      if (count > this.gateCount && this.gateCount >= 0) {
        osd.gates.classList.remove("is-pulsing");
        void osd.gates.offsetWidth;
        osd.gates.classList.add("is-pulsing");
      }
      this.gateCount = count;
    }

    // 6. Render: through the lens on high, straight on low.
    if (this.lens && this.quad && this.target) {
      gl.setRenderTarget(this.target);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      this.lens.uniforms.tDiffuse.value = this.target.texture;
      this.lens.uniforms.uTime.value = now % 100;
      this.quad.render(gl);
    } else {
      gl.render(scene, camera);
    }

    if (this.first) {
      this.first = false;
      return true;
    }
    return false;
  }
}

export const initialOsd = {
  voltage: formatVoltage(VOLT_FULL),
  gates: formatGates(0, 8),
  timer: formatTimer(0),
};
