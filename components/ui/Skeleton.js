import { EventCardSkeleton as EventCardSkeletonBlock } from "@/components/events/EventCardSkeleton";
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
  return <EventCardSkeletonBlock />;
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

export function ProfileSkeleton() {
  return (
    <div className={styles.profile} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading profile</span>
      <Skeleton className={styles.profileTitle} />
      <Skeleton className={styles.profileLead} />
      <div className={styles.card}>
        <Skeleton className={styles.chip} />
        <Skeleton className={styles.line} />
        <Skeleton className={styles.line} />
        <Skeleton className={styles.lineShort} />
        <Skeleton className={styles.cta} />
      </div>
    </div>
  );
}

export function RegistrationDetailSkeleton() {
  return (
    <div className={styles.regDetail} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading registration</span>
      <Skeleton className={styles.profileTitle} />
      <div className={styles.badgeRow}>
        <Skeleton className={styles.badge} />
        <Skeleton className={styles.badge} />
      </div>
      <Skeleton className={styles.lineShort} />
      <div className={styles.card}>
        <Skeleton className={styles.cardTitle} />
        <Skeleton className={styles.line} />
        <Skeleton className={styles.cta} />
      </div>
      <TeamSkeleton />
    </div>
  );
}
