"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { RegistrationCTA } from "@/components/events/RegistrationCTA";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { PageTransition } from "@/components/motion/Reveal";
import { useEvent } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { formatCategory } from "@/lib/events/categories";
import {
  findMyRegistrationForEvent,
  formatDateRange,
  formatFee,
  registrationModeLabel,
} from "@/lib/events/utils";
import styles from "./detail.module.css";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const { event, loading, error, errorMessage, refresh } = useEvent(eventId);
  const { registrations, loading: regsLoading } = useMyRegistrations();

  const registration = useMemo(
    () => findMyRegistrationForEvent(registrations, eventId),
    [registrations, eventId]
  );

  if (loading || regsLoading) {
    return (
      <PageShell>
        <PageSkeleton />
      </PageShell>
    );
  }

  if (error || !event) {
    return (
      <PageShell>
        <ErrorState
          title="Event unavailable"
          description={errorMessage || "We couldn’t find that event."}
          onRetry={refresh}
          secondaryLabel="Back to events"
          secondaryHref="/events"
        />
      </PageShell>
    );
  }

  const when = formatDateRange(event.starts_at, event.ends_at);
  const mode = registrationModeLabel(
    event.registration_mode,
    event.allow_individual,
    event.team_min_size,
    event.team_max_size
  );

  return (
    <PageShell>
      <PageTransition>
        <article className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.kicker}>
              <Badge tone="brand">{formatCategory(event.category)}</Badge>
              {event.registration_open ? <Badge tone="ok">Registration open</Badge> : <Badge tone="muted">Registration closed</Badge>}
            </div>
            <h1 className="page-title">{event.name}</h1>
            {event.tagline ? <p className={styles.tagline}>{event.tagline}</p> : null}

            <dl className={styles.facts}>
              <div>
                <dt>Fee</dt>
                <dd>{formatFee(event.fee)}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{when || event.slot?.replace?.(/_/g, " ") || "TBA"}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{event.venue || "TBA"}</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{mode}</dd>
              </div>
              {event.spots_remaining != null ? (
                <div>
                  <dt>Spots left</dt>
                  <dd>{event.spots_remaining}</dd>
                </div>
              ) : null}
              {event.whatsapp_group_available ? (
                <div>
                  <dt>WhatsApp</dt>
                  <dd>Available after registration</dd>
                </div>
              ) : null}
            </dl>

            {event.long_desc || event.short_desc ? (
              <section className={styles.block}>
                <h2 className={styles.h2}>About</h2>
                <p className={styles.body}>{event.long_desc || event.short_desc}</p>
              </section>
            ) : null}

            {(event.registration_opens_at || event.registration_closes_at) && (
              <section className={styles.block}>
                <h2 className={styles.h2}>Registration window</h2>
                <p className={styles.body}>
                  {event.registration_opens_at
                    ? `Opens ${new Date(event.registration_opens_at).toLocaleString("en-IN")}`
                    : "Open"}
                  {event.registration_closes_at
                    ? ` · Closes ${new Date(event.registration_closes_at).toLocaleString("en-IN")}`
                    : ""}
                </p>
              </section>
            )}
          </div>

          <aside className={styles.aside}>
            <RegistrationCTA event={event} registration={registration} sticky />
          </aside>
        </article>
      </PageTransition>
    </PageShell>
  );
}
