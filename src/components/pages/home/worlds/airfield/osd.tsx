import { useRef, type CSSProperties, type MutableRefObject } from "react";
import { PALETTE } from "./track";

/**
 * The on-screen display: four readouts and a crosshair, HTML over the
 * canvas. The frame loop writes into these refs' textContent when a string
 * changes. No React state, no re-render. Nothing here is clickable.
 */

export interface OsdRefs {
  voltage: MutableRefObject<HTMLSpanElement | null>;
  gates: MutableRefObject<HTMLSpanElement | null>;
  timer: MutableRefObject<HTMLSpanElement | null>;
}

export const useOsdRefs = (): OsdRefs => ({
  voltage: useRef<HTMLSpanElement | null>(null),
  gates: useRef<HTMLSpanElement | null>(null),
  timer: useRef<HTMLSpanElement | null>(null),
});

export const CRAFT_NAME = "CLUTZZ";

/** The readout type: the letter's mono, sized and tracked like real OSD glyphs. */
export const osdText: CSSProperties = {
  fontSize: 11,
  lineHeight: 1,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(250,243,226,0.85)",
  textShadow: `0 0 1px ${PALETTE.ink}, 1px 1px 0 ${PALETTE.ink}`,
  fontVariantNumeric: "tabular-nums",
};

const crosshair: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 10,
  height: 10,
  transform: "translate(-50%, -50%)",
  background: `
    linear-gradient(${PALETTE.cream}, ${PALETTE.cream}) center / 1px 10px no-repeat,
    linear-gradient(${PALETTE.cream}, ${PALETTE.cream}) center / 10px 1px no-repeat`,
  opacity: 0.7,
};

const lowVignette: CSSProperties = {
  background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
};

interface OsdProps {
  voltageRef?: OsdRefs["voltage"];
  gatesRef?: OsdRefs["gates"];
  timerRef?: OsdRefs["timer"];
  quality: "low" | "high";
  initial: { voltage: string; gates: string; timer: string };
}

export const Osd = ({ voltageRef, gatesRef, timerRef, quality, initial }: OsdProps) => (
  <div
    className="airfield-osd pointer-events-none absolute inset-0 select-none font-mono"
    style={quality === "low" ? lowVignette : undefined}
    aria-hidden="true"
  >
    <style>{`
      @keyframes airfield-osd-pulse {
        0% { transform: scale(1); }
        35% { transform: scale(1.35); }
        100% { transform: scale(1); }
      }
      .airfield-osd .is-pulsing {
        animation: airfield-osd-pulse 300ms ease-out;
      }
    `}</style>
    <span ref={voltageRef} className="absolute left-6 top-6" style={osdText}>
      {initial.voltage}
    </span>
    <span className="absolute left-1/2 top-6 -translate-x-1/2" style={osdText}>
      {CRAFT_NAME}
    </span>
    <span ref={gatesRef} className="absolute right-6 top-6 origin-right" style={osdText}>
      {initial.gates}
    </span>
    <span
      ref={timerRef}
      className="absolute bottom-6 right-6 max-sm:bottom-auto max-sm:top-11"
      style={osdText}
    >
      {initial.timer}
    </span>
    <span style={crosshair} />
  </div>
);
