import styles from "./Skeleton.module.css";

export function Skeleton({ className = "", style, ...rest }) {
  return <span className={[styles.skeleton, className].filter(Boolean).join(" ")} style={style} {...rest} />;
}

export function PageSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <Skeleton className={styles.title} />
      <Skeleton className={styles.lead} />
      <div className={styles.grid}>
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.chip} />
      <Skeleton className={styles.cardTitle} />
      <Skeleton className={styles.line} />
      <Skeleton className={styles.lineShort} />
      <Skeleton className={styles.cta} />
    </div>
  );
}

export function RegistrationSkeleton() {
  return (
    <div className={styles.card} aria-busy="true">
      <Skeleton className={styles.chip} />
      <Skeleton className={styles.cardTitle} />
      <Skeleton className={styles.line} />
      <Skeleton className={styles.cta} />
    </div>
  );
}

export function TeamSkeleton() {
  return (
    <div className={styles.card} aria-busy="true">
      <Skeleton className={styles.cardTitle} />
      <div className={styles.members}>
        <Skeleton className={styles.member} />
        <Skeleton className={styles.member} />
        <Skeleton className={styles.member} />
      </div>
    </div>
  );
}
