import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { WorldProps } from "../types";

const Box = ({ progress, onReady }: Pick<WorldProps, "progress" | "onReady">) => {
  const ref = useRef<Mesh>(null);
  const readyRef = useRef(false);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y = progress.get() * Math.PI * 2;
    ref.current.rotation.x = progress.get() * Math.PI;
    if (!readyRef.current) {
      readyRef.current = true;
      onReady();
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff0080" flatShading />
    </mesh>
  );
};

const SmokeWorld = ({ progress, active, quality, onReady }: WorldProps) => {
  const frameloop = active ? "always" : "never";
  useEffect(() => {
    console.log("[smoke] mounted");
    return () => console.log("[smoke] unmounted");
  }, []);
  return (
    <Canvas dpr={quality === "high" ? [1, 1.5] : 1} frameloop={frameloop} camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <Box progress={progress} onReady={onReady} />
    </Canvas>
  );
};

export default SmokeWorld;
