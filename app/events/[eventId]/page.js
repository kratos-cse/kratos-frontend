"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { RegistrationCTA } from "@/components/events/RegistrationCTA";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { EventDetailSkeleton } from "@/components/events/EventDetailSkeleton";
import { PageTransition } from "@/components/motion/Reveal";
import { useEvent } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { formatCategory } from "@/lib/events/categories";
import { formatRosterParticipantLine } from "@/lib/events/utils";
import {
  findMyRegistrationForEvent,
  formatDateRange,
  formatFee,
  registrationAvailabilityLabel,
  registrationModeLabel,
} from "@/lib/events/utils";
import styles from "./detail.module.css";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const { event, loading, error, errorMessage, refresh } = useEvent(eventId);
  const { registrations } = useMyRegistrations();

  const registration = useMemo(
    () => findMyRegistrationForEvent(registrations, eventId),
    [registrations, eventId]
  );

  if (loading && !event) {
    return (
      <PageShell>
        <EventDetailSkeleton />
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
  const rosterLine = formatRosterParticipantLine(
    event.required_member_count,
    event.substitute_count,
    event.team_min_size,
    event.team_max_size,
  );
  const mode = registrationModeLabel(
    event.registration_mode,
    event.allow_individual,
    event.team_min_size,
    event.team_max_size,
    event.required_member_count,
    event.substitute_count
  );

  return (
    <PageShell>
      <PageTransition>
        <article className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.kicker}>
              <Badge tone="brand">{formatCategory(event.category)}</Badge>
              <Badge tone={event.registration_availability === "OPEN" ? "ok" : "muted"}>
                {registrationAvailabilityLabel(event.registration_availability)}
              </Badge>
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
              {rosterLine ? (
                <div>
                  <dt>Team roster</dt>
                  <dd>{rosterLine}</dd>
                </div>
              ) : null}
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

          </div>

          <aside className={styles.aside}>
            <RegistrationCTA event={event} registration={registration} sticky />
          </aside>
        </article>
      </PageTransition>
    </PageShell>
  );
}
