"use client";

/**
 * Adapted from React Bits GlareHover (content/Animations/GlareHover).
 * Decorative hover sheen for rare/hero CTAs only — not for every button.
 * Gated to fine pointers; disabled under reduced motion.
 */
import styles from "./GlareHover.module.css";

export function GlareHover({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.35)",
  durationMs = 550,
}) {
  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      style={{
        "--glare-color": glareColor,
        "--glare-duration": `${durationMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
