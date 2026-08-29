"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds. Keep these small — this is not a showreel. */
  delay?: number;
  /**
   * `mount` plays immediately on hydration; `inView` waits for the element to
   * enter the viewport.
   *
   * Above-the-fold content must use `mount`. An IntersectionObserver-driven
   * reveal leaves the hero at opacity 0 until observation fires, which means a
   * slow hydration renders a blank first screen — the one screen that has to
   * work.
   */
  mode?: "mount" | "inView";
}

/**
 * Institutional restraint: a short rise and a fade, nothing else. No spring,
 * no scale, no blur. Motion here exists to sequence reading order, not to
 * decorate — and it disappears entirely under prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  mode = "inView",
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} data-reveal>
        {children}
      </div>
    );
  }

  const transition = {
    duration: 0.6,
    delay,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const hidden = { opacity: 0, y: 14 };
  const shown = { opacity: 1, y: 0 };

  if (mode === "mount") {
    return (
      <motion.div
        className={className}
        data-reveal
        initial={hidden}
        animate={shown}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      data-reveal
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
