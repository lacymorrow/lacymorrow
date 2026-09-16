"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StaticLanding } from "./static-landing";

const Game = dynamic(() => import("./game").then((m) => m.Game), {
  ssr: false,
});

type FallbackReason = "reduced-motion" | "no-webgl";

interface GameConfig {
  autoStart?: boolean;
  spawn?: { x: number; z: number };
}

type ResolvedState =
  | { kind: "loading" }
  | { kind: "fallback"; reason: FallbackReason }
  | { kind: "ready"; config: GameConfig };

const detectWebGL = (): boolean => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const resolveState = (): ResolvedState => {
  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduced) return { kind: "fallback", reason: "reduced-motion" };
  if (!detectWebGL()) return { kind: "fallback", reason: "no-webgl" };

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
  return { kind: "ready", config: { autoStart, spawn } };
};

export const MorrowFieldClient = () => {
  const [state, setState] = useState<ResolvedState>({ kind: "loading" });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(resolveState());
  }, []);

  if (state.kind === "ready") {
    return (
      <>
        <StaticLanding reason="loading" />
        <Game autoStart={state.config.autoStart} spawn={state.config.spawn} />
      </>
    );
  }

  const reason = state.kind === "loading" ? "loading" : state.reason;
  return <StaticLanding reason={reason} />;
};
