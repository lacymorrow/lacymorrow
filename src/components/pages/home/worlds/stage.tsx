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
  // A world that does not ask for a late fade gets its overlay from the
  // first frame of the cut: the range ends before progress 0, so the value
  // is already 1 there.
  const [t0, t1] = meta.overlay?.title ?? [-0.02, -0.01];
  const [b0, b1] = meta.overlay?.body ?? [t0, t1];
  const titleOpacity = useTransform(progress, [t0, t1, 0.94, 1], [0, 1, 1, 0]);
  const bodyOpacity = useTransform(progress, [b0, b1, 0.94, 1], [0, 1, 1, 0]);
  const atTop = meta.overlay?.position === "top";
  const runs = tier !== null && tier !== "off";

  return (
    <section
      ref={sectionRef}
      data-world={meta.id}
      style={{ height: `${meta.lengthVh}vh`, background: meta.background }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden supports-[height:100svh]:h-svh">
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
