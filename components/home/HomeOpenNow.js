"use client";

import { Button } from "@/components/ui/Button";
import { EventGrid } from "@/components/events/EventGrid";
import { Reveal } from "@/components/motion/Reveal";
import { useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import styles from "@/app/landing.module.css";

export function HomeOpenNow() {
  const { events, loading } = useEvents();
  const { registrations } = useMyRegistrations();

  const preview = events.slice(0, 6);

  const registrationsByEventId = {};
  for (const r of registrations) {
    if (r?.event_id) registrationsByEventId[r.event_id] = r;
  }

  return (
    <Reveal delay={0.04}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className="section-title">Open now</h2>
          <Button href="/events" variant="ghost" size="sm">
            View all
          </Button>
        </div>
        <EventGrid
          events={preview}
          registrationsByEventId={registrationsByEventId}
          loading={loading && !events.length}
        />
      </section>
    </Reveal>
  );
}
