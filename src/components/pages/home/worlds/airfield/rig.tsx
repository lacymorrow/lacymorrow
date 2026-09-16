import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import type { MotionValue } from "framer-motion";
import type { Track } from "./curve";
import { Flight } from "./flight";
import type { OsdRefs } from "./osd";

/**
 * The thin React side of the flight: mount the model's objects, attach the
 * fog and the props, and step it once per frame. All the motion lives in
 * flight.ts.
 */

interface RigProps {
  track: Track;
  progress: MotionValue<number>;
  active: boolean;
  quality: "low" | "high";
  osd: OsdRefs;
  onReady: () => void;
}

export const Rig = ({ track, progress, active, quality, osd, onReady }: RigProps) => {
  const get = useThree((s) => s.get);
  const advance = useThree((s) => s.advance);
  const flight = useMemo(() => new Flight(track, quality), [track, quality]);
  const readyRef = useRef(false);

  useEffect(() => {
    const { scene, camera } = get();
    flight.attach(scene, camera as PerspectiveCamera);
    return () => {
      flight.detach(scene, camera as PerspectiveCamera);
      flight.dispose();
    };
  }, [flight, get]);

  // Warm one frame while the stage has us mounted but off screen, so the
  // shaders compile and the cross-fade never lands on a blank canvas.
  useEffect(() => {
    if (!active) advance(performance.now());
  }, [active, advance]);

  useFrame((state) => {
    const first = flight.step(
      {
        camera: state.camera as PerspectiveCamera,
        scene: state.scene,
        gl: state.gl,
        aspect: state.size.width / state.size.height,
        dpr: state.viewport.dpr,
        width: state.size.width,
        height: state.size.height,
      },
      progress.get(),
      {
        voltage: osd.voltage.current,
        gates: osd.gates.current,
        timer: osd.timer.current,
      },
    );
    if (first && !readyRef.current) {
      readyRef.current = true;
      onReady();
    }
  }, 1);

  return <primitive object={flight.root} />;
};
