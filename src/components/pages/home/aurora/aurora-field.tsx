"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

import { MOOD_PALETTE } from "@/config/mood";
import { useMood } from "@/context/mood-provider";

// R3F/three is heavy and must not SSR — load it only on the client.
const Silk = dynamic(() => import("@/components/ui/react-bits/silk"), { ssr: false });

/**
 * The living aurora field for the hero — the Silk WebGL shader, recolored by
 * the mood dial (a smooth lerp handled inside Silk). Under reduced motion it
 * renders nothing and defers to the static <AuroraBackdrop> wash.
 */
export function AuroraField({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const { mood } = useMood();
  const { colors, speed } = MOOD_PALETTE[mood];

  if (reduce) return null;

  return (
    <div aria-hidden className={className}>
      <Silk
        colors={colors}
        speed={speed}
        scale={1}
        colorMix={1.2}
        noiseIntensity={1.5}
        rotation={0}
        dpr={[1, 1.5]}
      />
    </div>
  );
}
