import { Skeleton } from "@/components/ui/Skeleton";
import styles from "@/app/events/[eventId]/detail.module.css";
import skel from "./EventDetailSkeleton.module.css";

/** Ghost layout matching event detail page structure. */
export function EventDetailSkeleton() {
  return (
    <article className={styles.layout} aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading event</span>
      <div className={styles.main}>
        <div className={styles.kicker}>
          <Skeleton className={skel.badge} />
          <Skeleton className={skel.badge} />
        </div>
        <Skeleton className={skel.title} />
        <Skeleton className={skel.tagline} />
        <div className={styles.facts}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className={skel.factLabel} />
              <Skeleton className={skel.factValue} />
            </div>
          ))}
        </div>
        <section className={styles.block}>
          <Skeleton className={skel.h2} />
          <Skeleton className={skel.line} />
          <Skeleton className={skel.lineShort} />
        </section>
      </div>
      <aside className={styles.aside}>
        <div className={skel.ctaCard}>
          <Skeleton className={skel.ctaTitle} />
          <Skeleton className={skel.ctaFee} />
          <Skeleton className={skel.ctaBtn} />
        </div>
      </aside>
    </article>
  );
}
