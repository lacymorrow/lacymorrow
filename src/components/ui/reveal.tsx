"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** vertical travel in px */
  y?: number;
  /** blur-in amount in px (0 to disable) */
  blur?: number;
  /** stagger delay in seconds */
  delay?: number;
  className?: string;
}

/**
 * Fade-and-flow reveal on scroll — the site's core "unfold" gesture.
 * Honors prefers-reduced-motion by rendering children unanimated.
 */
export function Reveal({ children, y = 24, blur = 8, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? `blur(${blur}px)` : undefined }}
      whileInView={{ opacity: 1, y: 0, filter: blur ? "blur(0px)" : undefined }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.0, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
