"use client";

/**
 * Adapted from React Bits SpotlightCard (content/Components/SpotlightCard).
 * Pointer spotlight on cards — transform/opacity-friendly, fine-pointer only.
 */
import { useRef } from "react";
import styles from "./SpotlightCard.module.css";

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(229, 57, 53, 0.18)",
  as: Comp = "div",
  ...rest
}) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    el.style.setProperty("--spotlight-color", spotlightColor);
  }

  return (
    <Comp ref={ref} onMouseMove={onMove} className={[styles.card, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </Comp>
  );
}
