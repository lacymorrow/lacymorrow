import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  Mesh,
  PointLight,
  MeshLambertMaterial,
  PlaneGeometry,
  Vector3,
} from "three";

import type { WorldProps } from "../types";
import {
  ceoCard,
  ceoCardTilt,
  ceoCardVisible,
  deskLamp,
  flapAngle,
  forcedCycle,
  heroCardVisible,
  heroCardY,
  heroSheet,
  heroSheetVisible,
  penVisible,
  refusal,
  signingSheet,
  strokeDrawn,
} from "./beats";
import { WORK_LIGHT_Z, createHall, createPaper, createPresses, paperTexture } from "./build";
import { FOV, sampleCamera, smoothstep } from "./camera";
import { cyclePeriod } from "./data";
import { createDesk } from "./desk";
import { FOUNDING, ROW_X, SHEET_H, SHEET_W, presses } from "./layout";
import { fogDensity, palette } from "./palette";

/**
 * Seventeen. A print shop running in the dark, a card that cannot cross a
 * plate, and one desk where a person signs. docs/worlds/fleet.md.
 */

const YAW = (2 * Math.PI) / 180;
const PITCH = (1 * Math.PI) / 180;
/** The one moment in the cycle when the platen is down. */
const THUNK_SECONDS = 0.35;

const thunk = (local: number): number => {
  if (local >= THUNK_SECONDS) return 0;
  const u = local / THUNK_SECONDS;
  // Slammed shut, let back up.
  return u < 0.4 ? (u / 0.4) ** 0.6 : 1 - ((u - 0.4) / 0.6) ** 1.6;
};

type SceneProps = Omit<WorldProps, "active" | "hold">;

const Scene = ({ progress, quality, pointer, onReady }: SceneProps) => {
  const high = quality === "high";
  const camera = useThree((s) => s.camera);

  const built = useMemo(() => {
    const tooth = high ? paperTexture() : null;
    const hall = createHall();
    const machines = createPresses(quality);
    const paper = createPaper(quality, tooth);
    const desk = createDesk(quality);

    // The three things the story happens to. Small enough to be their own
    // meshes, which keeps the instanced parts free of special cases.
    const sheetGeometry = new PlaneGeometry(SHEET_W, SHEET_H);
    sheetGeometry.rotateX(-Math.PI / 2);
    const paperMaterial = new MeshLambertMaterial({ color: palette.paper, side: DoubleSide });
    const cardMaterial = new MeshLambertMaterial({ color: palette.card, side: DoubleSide });
    const cardGeometry = new PlaneGeometry(0.17, 0.23);
    cardGeometry.rotateY(Math.PI / 2);

    const heroSheetMesh = new Mesh(sheetGeometry, paperMaterial);
    const heroCardMesh = new Mesh(cardGeometry, cardMaterial);
    const ceoCardMesh = new Mesh(cardGeometry, cardMaterial);
    [heroSheetMesh, heroCardMesh, ceoCardMesh].forEach((m) => {
      m.visible = false;
      m.frustumCulled = false;
    });

    // The spec's 0.35 and 0.6 were written for the old light units; three
    // switched to physical ones, where those numbers render a black room.
    // The ground colour is not black either: it is the only thing lighting
    // the faces that point away from the key, which is half of them.
    const sky = new HemisphereLight(palette.sky, "#101218", 2.2);
    // High and behind the way in, so every machine keeps a lit edge.
    const key = new DirectionalLight(palette.overhead, 3.0);
    key.position.set(-3, 9, -4);
    // Row B faces the other way, so one light left every second machine
    // unlit and cost the crane shot half its count.
    const fill = new DirectionalLight(palette.overhead, 1.3);
    fill.position.set(4, 6, 7);

    // The shades over the aisle, lit. Cold, so the desk lamp stays the only
    // warm thing in the world.
    const work = WORK_LIGHT_Z.map((z) => {
      const lamp = new PointLight(palette.overhead, 26, 7.5, 2);
      lamp.position.set(0, 3.0, z);
      return lamp;
    });

    const root = new Group();
    root.add(
      hall.group,
      machines.group,
      paper.group,
      desk.group,
      heroSheetMesh,
      heroCardMesh,
      ceoCardMesh,
      sky,
      key,
      fill,
      ...work,
    );

    const dispose = () => {
      hall.dispose();
      machines.dispose();
      paper.dispose();
      desk.dispose();
      sheetGeometry.dispose();
      cardGeometry.dispose();
      paperMaterial.dispose();
      cardMaterial.dispose();
      tooth?.dispose();
      sky.dispose();
      key.dispose();
      fill.dispose();
      work.forEach((l) => l.dispose());
    };

    return { root, machines, paper, desk, heroSheetMesh, heroCardMesh, ceoCardMesh, dispose };
  }, [quality, high]);

  useEffect(() => built.dispose, [built]);

  // Everything the frame loop writes into lives behind a ref. Mutating a
  // memoized value in place is a bug waiting for a re-render to happen.
  const scratch = useRef({
    pos: new Vector3(),
    target: new Vector3(),
    sheet: new Vector3(),
    point: new Vector3(),
    color: new Color(),
  }).current;
  const fogRef = useRef<FogExp2 | null>(null);
  const handles = useRef(built);
  useEffect(() => {
    handles.current = built;
  }, [built]);
  /** Only repaint a lamp when its state actually changes. */
  const lampState = useRef<string[]>(presses.map(() => ""));
  const readyRef = useRef(false);
  const periods = useMemo(() => presses.map((p) => cyclePeriod(p.role.runs)), []);

  useFrame((state) => {
    const p = progress.get();
    const t = state.clock.elapsedTime;
    const { machines, paper, desk, heroCardMesh, heroSheetMesh, ceoCardMesh } = handles.current;

    // The camera can want to look at the sheet, so the sheet moves first.
    heroSheet(p, scratch.sheet);
    sampleCamera(p, scratch.sheet, scratch.pos, scratch.target);
    camera.position.copy(scratch.pos);
    camera.lookAt(scratch.target);
    if (high) {
      const weight = smoothstep(0.1, 0.3, p);
      const { x, y } = pointer.get();
      camera.rotateY(-x * weight * YAW);
      camera.rotateX(-y * weight * PITCH);
    }
    if (fogRef.current) fogRef.current.density = fogDensity(p);

    const red = refusal(p);
    for (let i = 0; i < presses.length; i++) {
      const press = presses[i]!;
      const awake = p >= press.wakeAt;
      const period = periods[i]!;

      const timed = awake ? thunk((t + press.phase * period) % period) : 0;
      const closed = Math.max(timed, forcedCycle(i, p));
      machines.setPlaten(i, closed);
      if (awake) machines.setFlywheel(i, (t + press.phase * period) * ((Math.PI * 2.4) / period));

      const wants =
        i === FOUNDING.index && red > 0.5 ? "refused" : awake ? "running" : "waiting";
      if (lampState.current[i] !== wants) {
        lampState.current[i] = wants;
        machines.setLamp(i, scratch.color.set(palette[wants]));
      }
    }
    machines.flush();
    paper.advance(t);

    // An issue travels.
    heroCardMesh.visible = heroCardVisible(p);
    if (heroCardMesh.visible) {
      heroCardMesh.position.set(ROW_X - 0.9, heroCardY(p), FOUNDING.z + 0.1);
    }
    heroSheetMesh.visible = heroSheetVisible(p);
    if (heroSheetMesh.visible) heroSheetMesh.position.copy(scratch.sheet);

    // A boundary refuses.
    ceoCardMesh.visible = ceoCardVisible(p);
    if (ceoCardMesh.visible) {
      ceoCard(p, ceoCardMesh.position);
      ceoCardMesh.rotation.z = ceoCardTilt(p);
    }

    // Lacy signs.
    desk.light.intensity = deskLamp(p) * 18;
    signingSheet(p, desk.sheet.position);
    const drawn = strokeDrawn(p);
    desk.stroke.visible = drawn > 0;
    desk.stroke.geometry.setDrawRange(0, Math.ceil(drawn * desk.strokeIndexCount));
    desk.pen.visible = penVisible(p);
    if (desk.pen.visible) {
      desk.strokeAt(drawn, scratch.point);
      desk.pen.position.set(scratch.point.x, scratch.point.y + 0.004, scratch.point.z);
    }
    desk.flap.rotation.x = flapAngle(p);

    if (!readyRef.current) {
      readyRef.current = true;
      onReady();
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={[palette.background, 0.13]} />
      <primitive object={built.root} />
    </>
  );
};

export const FleetWorld = ({ progress, active, quality, pointer, onReady }: WorldProps) => (
  <div className="relative size-full">
    <Canvas
      dpr={quality === "high" ? [1, 1.5] : 1}
      frameloop={active ? "always" : "never"}
      shadows={quality === "high"}
      camera={{ fov: FOV, near: 0.05, far: 120, position: [0, 0.9, 0] }}
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      style={{ background: palette.background }}
    >
      <Scene progress={progress} quality={quality} pointer={pointer} onReady={onReady} />
    </Canvas>
    {/* The overlay sits bottom left over a dark floor. This keeps the hall
        from competing with it as the fog thins at the end. */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 6% 106%, rgba(11,11,13,0.92) 0%, rgba(11,11,13,0.6) 40%, rgba(11,11,13,0) 72%)",
      }}
    />
  </div>
);

export default FleetWorld;
