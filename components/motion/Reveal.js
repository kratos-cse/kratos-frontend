"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DURATION_GRID_ENTER_S,
  DURATION_STEP_FADE_REDUCE_S,
  DURATION_STEP_FADE_S,
  DURATION_UI_S,
  EASE_OUT_BEZIER,
} from "@/lib/motion/tokens";

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
        transition={{ duration: 0.18, delay, ease: EASE_OUT_BEZIER }}
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
      transition={{ duration: DURATION_UI_S, delay, ease: EASE_OUT_BEZIER }}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: EASE_OUT_BEZIER }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(6px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: DURATION_GRID_ENTER_S, ease: EASE_OUT_BEZIER }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Event grid cards — animate once when scrolled into view (not on every filter remount).
 */
export function GridInViewItem({ children, index = 0, className = "" }) {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const delay = Math.min(index, 4) * 0.04;
  const opacityOnly = reduce || narrow;

  if (opacityOnly) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: reduce ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-24px" }}
        transition={{ duration: reduce ? 0 : DURATION_GRID_ENTER_S, delay: reduce ? 0 : delay, ease: EASE_OUT_BEZIER }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: "translateY(10px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: DURATION_GRID_ENTER_S, delay, ease: EASE_OUT_BEZIER }}
    >
      {children}
    </motion.div>
  );
}

/** @deprecated Use GridInViewItem for discovery grids. */
export function StaggerItem(props) {
  return <GridInViewItem {...props} />;
}

/**
 * Registration step content — opacity only, interruptible via AnimatePresence.
 */
export function StepFade({ stepKey, children, className = "" }) {
  const reduce = useReducedMotion();
  const duration = reduce ? DURATION_STEP_FADE_REDUCE_S : DURATION_STEP_FADE_S;

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={stepKey}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease: EASE_OUT_BEZIER }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
