import styles from "./Badge.module.css";

const tones = {
  default: styles.default,
  brand: styles.brand,
  gold: styles.gold,
  ok: styles.ok,
  warn: styles.warn,
  err: styles.err,
  info: styles.info,
  muted: styles.muted,
};

export function Badge({ children, tone = "default", className = "" }) {
  return (
    <span className={[styles.badge, tones[tone] || tones.default, className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
