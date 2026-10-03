import { Skeleton } from "@/components/ui/Skeleton";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import styles from "./EventCard.module.css";

/** Loading placeholder matching EventCard v2 dimensions. */
export function EventCardSkeleton() {
  return (
    <SpotlightCard className={styles.card} aria-hidden="true">
      <Skeleton className={styles.skelCategory} />
      <Skeleton className={styles.skelTitle} />
      <Skeleton className={styles.skelTagline} />
      <div className={styles.schedule}>
        <Skeleton className={styles.skelWhen} />
        <Skeleton className={styles.skelVenue} />
      </div>
      <div className={styles.skelDivider} />
      <div className={styles.skelFacts}>
        <Skeleton className={styles.skelFee} />
        <Skeleton className={styles.skelFormat} />
      </div>
      <Skeleton className={styles.skelStatus} />
      <div className={styles.skelFooter}>
        <Skeleton className={styles.skelView} />
        <Skeleton className={styles.skelBtn} />
      </div>
    </SpotlightCard>
  );
}
