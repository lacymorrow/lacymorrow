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
  /**
   * How much scroll the world holds the screen for, in viewport heights.
   * Scroll no longer scrubs the scene, so this is only how long the world
   * keeps the screen before the next one slides up. 180 to 220.
   */
  lengthVh: number;
  /**
   * How long the world's timeline takes to play, in seconds, once the world
   * takes the screen. The scene plays on its own clock whether or not anyone
   * is scrolling. Default 16.
   */
  playSeconds?: number;
  /**
   * Whether the timeline runs again after it ends. Default true: a world
   * holds its last frame, cuts through its own background colour, and starts
   * over, the way a reel or a lap does. Set false for a scene whose end
   * state is alive on its own.
   */
  loop?: boolean;
  /** How long the last frame holds before the world starts over. Default 3. */
  holdSeconds?: number;
  budget: { assetsKb: number; triangles: number };
  /**
   * The live world's DOM is real content, not a decorative canvas: it has
   * controls and links of its own, so the stage leaves it visible to screen
   * readers instead of marking it `aria-hidden`. Default false.
   */
  interactive?: boolean;
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
  /**
   * The world's own timeline, 0 to 1, driven by a clock and not by the
   * scrollbar: it starts when the world takes the screen, plays over
   * `meta.playSeconds`, and holds at 1. Read it in useFrame, never render
   * on it. A world that wants life after its timeline ends animates on
   * `state.clock` like any other idle motion.
   */
  progress: MotionValue<number>;
  /** The world has the screen. Stop the frame loop and the clock when false. */
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
  /**
   * Freeze the timeline while someone is using the scene, and let it go when
   * they are done. A scene that plays itself has to stop when a visitor
   * reaches into it, or the thing they are reaching for has already gone.
   * Held time is not counted, so releasing continues rather than skips.
   */
  hold: (held: boolean) => void;
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
