"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE_OUT = [0.23, 1, 0.32, 1];

/**
 * Section enter — opacity + translateY via transform string (GPU-friendly).
 * Skips movement when prefers-reduced-motion.
 */
export function Reveal({ children, className = "", delay = 0, y = 12 }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.18, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.22, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, ease: EASE_OUT }}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(8px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Decorative stagger for grids. Caps delay so large lists stay snappy.
 * Does not block interaction.
 */
export function StaggerItem({ children, index = 0, className = "" }) {
  const reduce = useReducedMotion();
  const delay = Math.min(index, 8) * 0.04;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(10px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.2, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
