import { Button } from "./Button";
import styles from "./EmptyState.module.css";

export function EmptyState({ title, description, actionLabel, actionHref, onAction, icon }) {
  return (
    <div className={styles.wrap} role="status">
      {icon ? <div className={styles.icon} aria-hidden>{icon}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.desc}>{description}</p> : null}
      {actionLabel && (actionHref || onAction) ? (
        <div className={styles.actions}>
          <Button href={actionHref} onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
