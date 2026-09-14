import type { ComponentType } from "react";
import type { MotionValue } from "framer-motion";

/**
 * The contract every world below the letter has to fit.
 * Read docs/worlds/README.md before adding one.
 */
export interface WorldMeta {
  /** "flash", "airfield", ... Also the folder name. */
  id: string;
  /** Overlay title. Serif, short. */
  title: string;
  /** One sentence, first person. */
  line: string;
  /** The one link, on this domain. */
  href: string;
  /** Link text. */
  cta: string;
  /** Painted behind the stage before the world renders. The cut color. */
  background: string;
  /** Overlay text color, chosen for contrast against `background`. */
  foreground: string;
  /** How long the world pins, in viewport heights. 250 to 350. */
  lengthVh: number;
  budget: { assetsKb: number; triangles: number };
  /**
   * Where the overlay sits and when its parts arrive, as progress ranges.
   * Defaults: bottom, title and body present from the first frame.
   */
  overlay?: {
    position?: "top" | "bottom";
    /** [start, end] progress over which the title fades in. */
    title?: [number, number];
    /** [start, end] progress over which the line and link fade in. */
    body?: [number, number];
  };
}

export interface Pointer {
  x: number;
  y: number;
}

export interface WorldProps {
  /** 0 at the top edge of the section, 1 at the bottom. Read it in useFrame. */
  progress: MotionValue<number>;
  /** The stage is on screen. Stop the frame loop when false. */
  active: boolean;
  /** low: DPR 1, no post-processing, halve counts. */
  quality: "low" | "high";
  /** -1..1 in both axes. Parallax only. */
  pointer: MotionValue<Pointer>;
  /**
   * Call once, after the first frame with assets in place. The stage cross
   * fades the world in over the Poster. If it is never called the stage
   * fades in anyway after 1.5 s.
   */
  onReady: () => void;
}

export interface WorldModule {
  meta: WorldMeta;
  /**
   * The live scene. Wrap it in React.lazy(() => import("./world")) in the
   * world's index so nothing 3D lands in the letter's bundle.
   */
  World: ComponentType<WorldProps>;
  /** The still: server rendered, and the permanent fallback. */
  Poster: ComponentType;
}
