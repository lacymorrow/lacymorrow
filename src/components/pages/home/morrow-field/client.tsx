"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Game = dynamic(() => import("./game").then((m) => m.Game), {
  ssr: false,
});

interface GameConfig {
  canRun: boolean;
  autoStart?: boolean;
  spawn?: { x: number; z: number };
}

const detectWebGL = (): boolean => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const resolveConfig = (): GameConfig => {
  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduced || !detectWebGL()) return { canRun: false };

  const params = new URLSearchParams(window.location.search);
  const autoStart = params.has("nointro");
  let spawn: { x: number; z: number } | undefined;
  if (params.has("spawn")) {
    const [sx, sz] = (params.get("spawn") || "")
      .split(",")
      .map((n) => Number(n));
    if (Number.isFinite(sx) && Number.isFinite(sz)) {
      spawn = { x: sx, z: sz };
    }
  }
  return { canRun: true, autoStart, spawn };
};

export const MorrowFieldClient = () => {
  const [config] = useState<GameConfig>(() =>
    typeof window === "undefined" ? { canRun: false } : resolveConfig(),
  );

  if (!config.canRun) return null;
  return <Game autoStart={config.autoStart} spawn={config.spawn} />;
};
