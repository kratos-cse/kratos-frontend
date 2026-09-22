"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { useAuth } from "@/context/AuthProvider";
import { formatCategory } from "@/lib/events/categories";
import { deriveEventUiState, formatFee, formatWhen, registrationModeLabel } from "@/lib/events/utils";
import styles from "./EventCard.module.css";

export function EventCard({ event, registration }) {
  const { profile } = useAuth();
  const ui = deriveEventUiState(event, registration, { profileId: profile?.id });
  const href = `/events/${event.id}`;
  const mode = registrationModeLabel(
    event.registration_mode,
    event.allow_individual,
    event.team_min_size,
    event.team_max_size
  );

  let cta = null;
  if (ui.cta === "view") {
    cta = (
      <Button href={`/registrations/${registration.id}`} size="sm" variant="secondary">
        View registration
      </Button>
    );
  } else if (ui.cta === "pay") {
    cta = (
      <Button href={`/registrations/${registration.id}`} size="sm">
        Continue payment
      </Button>
    );
  } else if (ui.cta === "register") {
    cta = (
      <Button href={`/register/${event.id}`} size="sm">
        Register
      </Button>
    );
  } else {
    cta = (
      <Button href={href} size="sm" variant="ghost">
        View details
      </Button>
    );
  }

  return (
    <SpotlightCard className={styles.card}>
      <div className={styles.top}>
        <Badge tone="brand">{formatCategory(event.category)}</Badge>
        <Badge tone={ui.tone || "default"}>{ui.label}</Badge>
      </div>
      <Link href={href} className={styles.titleLink}>
        <h3 className={styles.title}>{event.name}</h3>
      </Link>
      {event.tagline ? <p className={styles.tagline}>{event.tagline}</p> : null}
      {event.short_desc ? <p className={styles.desc}>{event.short_desc}</p> : null}
      <dl className={styles.meta}>
        <div>
          <dt>When</dt>
          <dd>{formatWhen(event.starts_at, event.ends_at, event.slot)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{event.venue || "TBA"}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd className={styles.fee}>{formatFee(event.fee)}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>{mode}</dd>
        </div>
      </dl>
      <div className={styles.actions}>{cta}</div>
    </SpotlightCard>
  );
}
