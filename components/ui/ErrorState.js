import { Button } from "./Button";
import styles from "./ErrorState.module.css";

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  secondaryLabel,
  secondaryHref,
  onSecondary,
}) {
  return (
    <div className={styles.wrap} role="alert">
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.desc}>{description}</p> : null}
      <div className={styles.actions}>
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
        {secondaryLabel && (secondaryHref || onSecondary) ? (
          <Button variant="ghost" href={secondaryHref} onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function StatusBanner({ tone = "info", children }) {
  return <div className={[styles.banner, styles[tone] || styles.info].join(" ")} role="status">{children}</div>;
}
