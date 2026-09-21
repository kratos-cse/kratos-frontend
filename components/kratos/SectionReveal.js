"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Occasional section entrance — spatial consistency / prevent jarring change.
 * Strong ease-out; reduced-motion → opacity only.
 * Uses full transform string for compositor performance.
 */
export default function SectionReveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(16px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduce ? 0.2 : 0.45,
        delay: reduce ? 0 : delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
