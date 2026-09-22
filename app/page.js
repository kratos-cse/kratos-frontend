"use client";

import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventGrid } from "@/components/events/EventGrid";
import { GlareHover } from "@/components/effects/GlareHover";
import { Reveal } from "@/components/motion/Reveal";
import { useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { EVENT_CATEGORIES, CATEGORY_LABELS } from "@/lib/events/categories";
import styles from "./landing.module.css";

export default function HomePage() {
  const { events, loading } = useEvents();
  const { registrations } = useMyRegistrations();

  const featured = [...events]
    .filter((e) => e.registration_open)
    .slice(0, 6);
  const preview = featured.length ? featured : events.slice(0, 6);

  const registrationsByEventId = {};
  for (const r of registrations) {
    if (r?.event_id) registrationsByEventId[r.event_id] = r;
  }

  const categoryCounts = EVENT_CATEGORIES.map((c) => ({
    key: c,
    label: CATEGORY_LABELS[c],
    count: events.filter((e) => e.category === c).length,
  }));

  return (
    <PageShell wide>
      <section className={styles.hero}>
        <Reveal className={styles.heroVisual} y={16}>
          <div aria-hidden>
            <Image src="/lion-mark.png" alt="" width={280} height={280} className={styles.lion} priority />
          </div>
        </Reveal>
        <Reveal className={styles.heroCopy} delay={0.05} y={12}>
          <Image
            src="/kratos26.png"
            alt="KRATOS'26"
            width={420}
            height={100}
            className={styles.wordmark}
            priority
          />
          <p className={styles.lead}>
            Discover events. Register in minutes. Manage your team and ticket in one place.
          </p>
          <div className={styles.ctas}>
            <GlareHover>
              <Button href="/events" size="lg">
                Explore Events
              </Button>
            </GlareHover>
            <Button href="/registrations" size="lg" variant="secondary">
              My Registrations
            </Button>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className="section-title">Categories</h2>
            <p className="muted">Five tracks. Find your arena.</p>
          </div>
          <div className={styles.cats}>
            {categoryCounts.map((c) => (
              <Link key={c.key} href={`/events?category=${c.key}`} className={styles.cat}>
                <span className={styles.catLabel}>{c.label}</span>
                <Badge tone="muted">{c.count || 0}</Badge>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.04}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className="section-title">Featured events</h2>
            <Button href="/events" variant="ghost" size="sm">
              View all
            </Button>
          </div>
          <EventGrid
            events={preview}
            registrationsByEventId={registrationsByEventId}
            loading={loading}
          />
        </section>
      </Reveal>

      <Reveal delay={0.06}>
        <section className={styles.finalCta}>
          <h2 className="section-title">Ready to compete?</h2>
          <p className="muted">Browse the full catalogue and register when you’re ready.</p>
          <div className={styles.ctas}>
            <Button href="/events" size="lg">
              Explore Events
            </Button>
            <Button href="/login?next=%2Fevents" size="lg" variant="secondary">
              Sign in
            </Button>
          </div>
          <div className={styles.instRow} aria-label="Presented by">
            <Image src="/eec-white.png" alt="Easwari Engineering College" width={200} height={48} />
            <Image src="/ACE-white.png" alt="ACE" width={72} height={72} />
          </div>
        </section>
      </Reveal>
    </PageShell>
  );
}
