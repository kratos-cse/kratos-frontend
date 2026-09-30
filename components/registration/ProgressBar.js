import styles from "./ProgressBar.module.css";

/**
 * Roster progress — transform-based fill, respects reduced motion via CSS.
 */
export function ProgressBar({ value, max, label, sublabel }) {
  const safeMax = Math.max(1, max || 1);
  const pct = Math.min(100, Math.round((value / safeMax) * 100));

  return (
    <div className={styles.wrap} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={safeMax}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {sublabel ? <span className={styles.sub}>{sublabel}</span> : null}
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}
