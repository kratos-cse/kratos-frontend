"use client";

import { StatusMark } from "@/components/micro";
import styles from "./AsyncStatus.module.css";

/**
 * Compact, accessible status for in-flight async work (React Bits StatusMark + copy).
 */
export function AsyncStatus({ children, className = "" }) {
  if (!children) return null;
  return (
    <p
      className={[styles.status, className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
    >
      <StatusMark status="running" size={18} strokeWidth={2} spinDuration={900} className={styles.mark} />
      <span>{children}</span>
    </p>
  );
}
