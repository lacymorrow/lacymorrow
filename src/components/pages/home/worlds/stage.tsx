"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { detectTier, type Tier } from "./capabilities";
import type { Pointer, WorldModule, WorldProps } from "./types";

/**
 * The stage owns everything a world must not touch: the pin, the scroll
 * math, mounting and unmounting, the fallbacks, the overlay. Worlds only
 * read `progress` and draw. See docs/worlds/README.md.
 */

// ---------------------------------------------------------------------------
// Error boundary. A world that throws shows its Poster, never a blank stage.

interface BoundaryProps {
  id: string;
  children: ReactNode;
}
interface BoundaryState {
  failed: boolean;
}

class WorldBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Loud in the console, silent for the visitor.
    console.error(`[worlds] ${this.props.id} failed, showing poster`, error, info);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// ---------------------------------------------------------------------------
// One section per world.

interface SectionProps {
  module: WorldModule;
  tier: Tier | null; // null until the client has decided
  pointer: WorldProps["pointer"];
}

const READY_TIMEOUT_MS = 1500;
const FADE_MS = 300;
const DEFAULT_PLAY_SECONDS = 16;
const DEFAULT_HOLD_SECONDS = 3;
/** The cut between one run of a timeline and the next. */
const CUT_SECONDS = 0.45;

/**
 * Soften only the ends. A beat sheet is written at an even pace, so a strong
 * ease would crawl through the opening beats and race the middle ones; this
 * eases over the first and last tenth and runs linear between them.
 */
const EASE_EDGE = 0.1;
const EASE_RATE = 1 / (1 - EASE_EDGE); // so the eased ends still cover 0 to 1
const ease = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < EASE_EDGE) return (EASE_RATE * t * t) / (2 * EASE_EDGE);
  if (t > 1 - EASE_EDGE) return 1 - (EASE_RATE * (1 - t) ** 2) / (2 * EASE_EDGE);
  return EASE_RATE * (t - EASE_EDGE / 2);
};

const WorldSection = ({ module, tier, pointer }: SectionProps) => {
  const { meta, Poster, World } = module;
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const progress = useMotionValue(0);
  const cut = useMotionValue(0);
  const held = useRef(false);
  const hold = useCallback((next: boolean) => {
    held.current = next;
  }, []);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  // The world plays on a clock, not on the scrollbar. Scroll decides which
  // world has the screen; the timeline runs whether or not anyone is moving.
  // React never re-renders on it: the value goes straight into a MotionValue
  // the world reads inside useFrame.
  //
  // Elapsed comes from wall time rather than by adding up frame deltas, so a
  // machine that renders at eight frames a second still plays the scene at
  // its real pace and simply drops frames, instead of running in slow motion.
  useEffect(() => {
    if (!active) return;
    const play = meta.playSeconds ?? DEFAULT_PLAY_SECONDS;
    const holdSeconds = meta.holdSeconds ?? DEFAULT_HOLD_SECONDS;
    const loops = meta.loop !== false;
    // play, hold the last frame, cut out through the world's own colour,
    // start over, cut back in.
    const cycle = play + holdSeconds + CUT_SECONDS * 2;
    let startedAt = performance.now();
    let heldAt = 0;
    let raf = 0;
    const tick = (now: number) => {
      // Time spent held is time the timeline never sees, so letting go
      // continues the scene rather than skipping it forward.
      if (held.current) {
        if (!heldAt) heldAt = now;
      } else if (heldAt) {
        startedAt += now - heldAt;
        heldAt = 0;
      }
      const t = ((heldAt || now) - startedAt) / 1000;
      if (!loops) {
        progress.set(ease(Math.min(t, play) / play));
      } else {
        const at = t % cycle;
        if (at < play) {
          progress.set(ease(at / play));
          cut.set(0);
        } else if (at < play + holdSeconds) {
          progress.set(1);
          cut.set(0);
        } else if (at < play + holdSeconds + CUT_SECONDS) {
          progress.set(1);
          cut.set((at - play - holdSeconds) / CUT_SECONDS);
        } else {
          progress.set(0);
          cut.set(1 - (at - play - holdSeconds - CUT_SECONDS) / CUT_SECONDS);
        }
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, meta.playSeconds, meta.holdSeconds, meta.loop, progress, cut]);

  // Mount one viewport early, unmount two viewports past. Active = on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || tier === null || tier === "off") return;
    // One viewport of warm-up on each side, no more: a wider margin mounts
    // the first world (and three) the moment the letter hydrates, which is
    // work nobody scrolling has asked for yet.
    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        setMounted(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    // A world "has the screen" once half of its panel is in view. This
    // watches the panel, not the section: a section three viewports tall can
    // never cover half a one viewport root. It is the moment the timeline
    // starts, and the moment the world before it stops, so two worlds never
    // run their clocks at once.
    const panel = panelRef.current;
    const activeObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    mountObserver.observe(el);
    if (panel) activeObserver.observe(panel);
    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [tier]);

  // The world fades in after its first frame, or after a timeout so a world
  // that forgets to call onReady still appears.
  const onReady = useCallback(() => setReady(true), []);

  // Once the world has faded in, the Poster underneath it goes away. A world
  // like the flash player has real links in its Poster, and links stacked
  // under a live copy stay in the tab order even when they cannot be seen.
  const [posterGone, setPosterGone] = useState(false);
  useEffect(() => {
    if (!ready) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosterGone(false);
      return;
    }
    const t = window.setTimeout(() => setPosterGone(true), FADE_MS + 50);
    return () => window.clearTimeout(t);
  }, [ready]);
  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => setReady(true), READY_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [mounted]);

  // Arriving at a world plays it from the top, the way opening a page does.
  // Leaving and coming back is a new arrival, not a resumed video.
  useEffect(() => {
    if (active) return;
    held.current = false;
    progress.set(0);
    cut.set(0);
  }, [active, progress, cut]);

  // Overlay fades. These are MotionValues, so with JavaScript off they would
  // serialize at their progress-0 value, which is 0 for any world that asks
  // for a late fade-in. That would cost the Poster its title, line and link,
  // and the contract says the page tells the whole story with JavaScript off.
  // So the styles only attach after hydration; the server renders them plain.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  // Overlay timings are points on the world's timeline, same as the scene's
  // beats. A world that does not ask for a late fade gets its overlay from
  // the first frame: the range ends before 0, so the value is already 1.
  const [t0, t1] = meta.overlay?.title ?? [-0.02, -0.01];
  const [b0, b1] = meta.overlay?.body ?? [t0, t1];
  // No fade out at the end of the timeline. The scene finishes while the
  // visitor is still standing in it, and the link has to still be there.
  // A world leaves when its panel scrolls away, not when its clock runs out.
  const titleOpacity = useTransform(progress, [t0, t1], [0, 1]);
  const bodyOpacity = useTransform(progress, [b0, b1], [0, 1]);
  const atTop = meta.overlay?.position === "top";
  const runs = tier !== null && tier !== "off";

  return (
    <section
      ref={sectionRef}
      data-world={meta.id}
      style={{ height: `${meta.lengthVh}vh`, background: meta.background }}
    >
      <div
        ref={panelRef}
        className="sticky top-0 h-screen w-full overflow-hidden supports-[height:100svh]:h-svh"
      >
        {!(runs && posterGone) && (
          <div
            className="absolute inset-0"
            aria-hidden={runs ? true : undefined}
            // The live world owns the interaction while it is up.
            {...(runs ? ({ inert: "" } as Record<string, string>) : {})}
          >
            <Poster />
          </div>
        )}

        {runs && mounted && (
          <div
            className="absolute inset-0"
            // A canvas has nothing in it to read, so it is hidden. A world
            // built out of buttons and links is the section itself, and
            // hiding it would leave those controls focusable but nameless.
            aria-hidden={meta.interactive ? undefined : "true"}
            style={{
              opacity: ready ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-out`,
            }}
          >
            <WorldBoundary id={meta.id}>
              <Suspense fallback={null}>
                <World
                  progress={progress}
                  active={active}
                  quality={tier === "high" ? "high" : "low"}
                  pointer={pointer}
                  onReady={onReady}
                  hold={hold}
                />
              </Suspense>
            </WorldBoundary>
          </div>
        )}

        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: meta.background, opacity: cut }}
          aria-hidden="true"
        />

        <div
          className={`pointer-events-none absolute inset-x-0 flex justify-center px-6 ${
            atTop ? "top-0 pt-10 sm:pt-14" : "bottom-0 pb-12 sm:pb-16"
          }`}
          style={{ color: meta.foreground }}
        >
          <div className="flex w-full max-w-[680px] flex-col gap-3">
            <motion.h2
              className="world-title m-0 text-4xl leading-none sm:text-5xl"
              style={hydrated ? { opacity: titleOpacity } : undefined}
            >
              {meta.title}
            </motion.h2>
            <motion.div
              className="flex flex-col gap-3"
              style={hydrated ? { opacity: bodyOpacity } : undefined}
            >
              <p className="m-0 max-w-[48ch] text-base leading-relaxed opacity-80">
                {meta.line}
              </p>
              <Link
                href={meta.href}
                className="decoration-current/40 pointer-events-auto mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {meta.cta} &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// The stage.

interface StageProps {
  worlds: WorldModule[];
}

export const WorldsStage = ({ worlds }: StageProps) => {
  const [tier, setTier] = useState<Tier | null>(null);
  const pointer = useMotionValue<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTier(detectTier());
  }, []);

  useEffect(() => {
    if (tier !== "high") return;
    const onMove = (e: PointerEvent) => {
      pointer.set({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [tier, pointer]);

  return (
    <div className="worlds">
      {worlds.map((w) => (
        <WorldSection key={w.meta.id} module={w} tier={tier} pointer={pointer} />
      ))}
    </div>
  );
};

export default WorldsStage;
