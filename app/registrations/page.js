"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { RegistrationSkeleton } from "@/components/ui/Skeleton";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { useEvents } from "@/hooks/useEvents";
import { ShareInviteButton } from "@/components/registration/ShareInviteButton";
import { deriveRegistrationJourneyState } from "@/lib/events/registrationUiState";
import { formatWhen } from "@/lib/events/utils";
import { useAuth } from "@/context/AuthProvider";
import styles from "./registrations.module.css";

function nextAction(reg) {
  const status = String(reg.status || "").toUpperCase();
  const pay = String(reg.payment?.status || "").toUpperCase();
  if (status === "CANCELLED") return { href: `/events/${reg.event_id}`, label: "View event", variant: "ghost" };
  if (status === "CONFIRMED" || pay === "PAID") {
    return { href: `/registrations/${reg.id}`, label: "View / QR", variant: "primary" };
  }
  if (pay === "CREATED" || pay === "FAILED" || status === "PENDING") {
    return { href: `/registrations/${reg.id}`, label: "Continue payment", variant: "primary" };
  }
  return { href: `/registrations/${reg.id}`, label: "View", variant: "secondary" };
}

function RegistrationsInner() {
  const { profile } = useAuth();
  const { registrations, loading, error, errorMessage, refresh } = useMyRegistrations();
  const { events } = useEvents();

  const eventMap = useMemo(() => {
    const map = {};
    for (const e of events) map[e.id] = e;
    return map;
  }, [events]);

  const sorted = useMemo(() => {
    return [...registrations].sort((a, b) => {
      const aT = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bT = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bT - aT;
    });
  }, [registrations]);

  if (loading) {
    return (
      <div className={styles.list}>
        <RegistrationSkeleton />
        <RegistrationSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Couldn’t load registrations" description={errorMessage} onRetry={refresh} />;
  }

  if (!sorted.length) {
    return (
      <EmptyState
        title="No registrations yet"
        description="Explore events and register when you’re ready."
        actionLabel="Explore Events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className={styles.list}>
      {sorted.map((reg) => {
        const event = eventMap[reg.event_id];
        const journey = deriveRegistrationJourneyState(reg, event, { profileId: profile?.id });
        const action = nextAction(reg);
        const status = String(reg.status || "").toUpperCase();
        const pay = String(reg.payment?.status || "").toUpperCase();
        return (
          <Card key={reg.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <Link href={`/events/${reg.event_id}`} className={styles.eventName}>
                  {event?.name || "Event"}
                </Link>
                <p className="meta">
                  {event ? formatWhen(event.starts_at, event.ends_at, event.slot) : null}
                  {event?.venue ? ` · ${event.venue}` : ""}
                </p>
              </div>
              <div className={styles.badges}>
                <Badge tone={status === "CONFIRMED" ? "ok" : status === "CANCELLED" ? "muted" : "warn"}>
                  {status}
                </Badge>
                {pay ? <Badge tone={pay === "PAID" ? "ok" : pay === "FAILED" ? "err" : "warn"}>{pay}</Badge> : null}
                {reg.team ? <Badge tone="info">TEAM</Badge> : <Badge tone="muted">SOLO</Badge>}
              </div>
            </div>
            {journey.rosterLine ? <p className="meta">{journey.rosterLine}</p> : null}
            <div className={styles.actions}>
              {journey.canShareInvite && reg.team?.id ? (
                <ShareInviteButton teamId={reg.team.id} size="sm" />
              ) : null}
              <Button href={action.href} variant={action.variant} size="sm">
                {action.label}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function RegistrationsPage() {
  return (
    <PageShell>
      <RequireAuth>
        <header style={{ marginBottom: "var(--space-5)" }}>
          <h1 className="page-title">My Registrations</h1>
          <p className="page-lead">Upcoming and past registrations, payments, QR, and team access.</p>
        </header>
        <RegistrationsInner />
      </RequireAuth>
    </PageShell>
  );
}
