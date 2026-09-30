"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/motion/Reveal";
import { useEvents } from "@/hooks/useEvents";
import { EVENT_CATEGORIES, CATEGORY_LABELS } from "@/lib/events/categories";
import styles from "@/app/landing.module.css";

export function HomeCategories() {
  const { events, loading } = useEvents();

  const categoryCounts = EVENT_CATEGORIES.map((c) => ({
    key: c,
    label: CATEGORY_LABELS[c],
    count: events.filter((e) => e.category === c).length,
  }));

  return (
    <Reveal>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className="section-title">Categories</h2>
          <p className="muted">Five tracks. Find your arena.</p>
        </div>
        {loading && !events.length ? (
          <div className={styles.cats} aria-busy="true" aria-label="Loading categories">
            {EVENT_CATEGORIES.map((c) => (
              <div key={c} className={styles.catSkeleton} aria-hidden>
                <Skeleton style={{ height: "1.1rem", width: "60%" }} />
                <Skeleton style={{ height: "1.25rem", width: "2rem", borderRadius: "999px" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.cats}>
            {categoryCounts.map((c) => (
              <Link key={c.key} href={`/events?category=${c.key}`} className={styles.cat}>
                <span className={styles.catLabel}>{c.label}</span>
                <Badge tone="muted">{c.count || 0}</Badge>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Reveal>
  );
}
