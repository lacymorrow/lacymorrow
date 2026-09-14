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

const WorldSection = ({ module, tier, pointer }: SectionProps) => {
  const { meta, Poster, World } = module;
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  // Scroll math writes a MotionValue; React never re-renders on scroll.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? -rect.top / travel : 0;
      progress.set(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [progress]);

  // Mount one viewport early, unmount two viewports past. Active = on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || tier === null || tier === "off") return;
    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        setMounted(entry.isIntersecting);
        if (!entry.isIntersecting) setReady(false);
      },
      { rootMargin: "100% 0px 200% 0px" },
    );
    const activeObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "0px" },
    );
    mountObserver.observe(el);
    activeObserver.observe(el);
    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [tier]);

  // The world fades in after its first frame, or after a timeout so a world
  // that forgets to call onReady still appears.
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (!mounted) return;
    const t = window.setTimeout(() => setReady(true), READY_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [mounted]);

  const overlayOpacity = useTransform(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const runs = tier !== null && tier !== "off";

  return (
    <section
      ref={sectionRef}
      data-world={meta.id}
      style={{ height: `${meta.lengthVh}vh`, background: meta.background }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0" aria-hidden={runs ? true : undefined}>
          <Poster />
        </div>

        {runs && mounted && (
          <div
            className="absolute inset-0"
            aria-hidden="true"
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
                />
              </Suspense>
            </WorldBoundary>
          </div>
        )}

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-6 pb-12 sm:pb-16"
          style={{ opacity: overlayOpacity, color: meta.foreground }}
        >
          <div className="pointer-events-auto flex w-full max-w-[680px] flex-col gap-3">
            <h2 className="world-title m-0 text-4xl leading-none sm:text-5xl">
              {meta.title}
            </h2>
            <p className="m-0 max-w-[48ch] text-base leading-relaxed opacity-80">
              {meta.line}
            </p>
            <Link
              href={meta.href}
              className="decoration-current/40 mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              {meta.cta} &rarr;
            </Link>
          </div>
        </motion.div>
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
