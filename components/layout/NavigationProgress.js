"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./NavigationProgress.module.css";

/**
 * Thin top-of-viewport indicator when internal routes change.
 * Not a blocking overlay.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    function onDocumentClick(e) {
      const anchor = e.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (href === pathname) return;
      setPhase("active");
    }
    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [pathname]);

  useEffect(() => {
    setPhase("complete");
    const done = window.setTimeout(() => setPhase("idle"), 280);
    return () => window.clearTimeout(done);
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      className={[styles.track, phase === "complete" ? styles.complete : ""].join(" ")}
      aria-hidden="true"
    >
      <div className={styles.bar} />
    </div>
  );
}
