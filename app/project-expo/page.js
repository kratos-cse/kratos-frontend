"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { EventGrid } from "@/components/events/EventGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/motion/Reveal";
import { useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import {
  PROJECT_EXPO_CATEGORY,
  PROJECT_EXPO_HEADLINE,
  PROJECT_EXPO_INTRO,
  PROJECT_EXPO_PARTICIPATION_NOTES,
  PROJECT_EXPO_TAGLINE,
} from "@/data/projectExpoContent";
import styles from "./project-expo.module.css";

export default function ProjectExpoPage() {
  const { events, loading, error, errorMessage, refresh } = useEvents();
  const { registrations } = useMyRegistrations();

  const expoEvents = useMemo(
    () => events.filter((e) => e.category === PROJECT_EXPO_CATEGORY),
    [events],
  );

  const registrationsByEventId = useMemo(() => {
    const map = {};
    for (const r of registrations) {
      if (r?.event_id && String(r.status).toUpperCase() !== "CANCELLED") {
        map[r.event_id] = r;
      }
    }
    return map;
  }, [registrations]);

  if (error && !events.length) {
    return (
      <PageShell>
        <ErrorState
          title="Could not load events"
          description={errorMessage || "Try again in a moment."}
          onRetry={refresh}
          secondaryLabel="All events"
          secondaryHref="/events"
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTransition>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Category</p>
          <h1 className="page-title">{PROJECT_EXPO_HEADLINE}</h1>
          <p className="page-lead" style={{ marginBottom: 0 }}>{PROJECT_EXPO_TAGLINE}</p>
          <p className={styles.lead}>{PROJECT_EXPO_INTRO}</p>
          <ol className={styles.notes}>
            {PROJECT_EXPO_PARTICIPATION_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ol>
          <div className={styles.actions}>
            <Button as={Link} href={`/events?category=${PROJECT_EXPO_CATEGORY}`} variant="ghost">
              Filter in events catalogue
            </Button>
          </div>
        </header>

        <section aria-labelledby="expo-events-heading">
          <h2 id="expo-events-heading" className="section-title" style={{ marginBottom: "var(--space-3)" }}>
            Published Project Expo events
          </h2>
          {!loading && expoEvents.length === 0 ? (
            <div className="panel-box">
              <p className="page-lead" style={{ marginBottom: "var(--space-3)" }}>
                No Project Expo events are published yet. Check back after organisers publish listings in the
                admin dashboard.
              </p>
              <Button as={Link} href="/events">Browse all events</Button>
            </div>
          ) : (
            <EventGrid
              events={expoEvents}
              registrationsByEventId={registrationsByEventId}
              loading={loading}
            />
          )}
        </section>
      </PageTransition>
    </PageShell>
  );
}
