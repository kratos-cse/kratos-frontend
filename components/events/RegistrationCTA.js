"use client";

import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatFee } from "@/lib/events/utils";
import { deriveEventUiState } from "@/lib/events/registrationUiState";
import styles from "./RegistrationCTA.module.css";

export function RegistrationCTA({ event, registration, sticky = false }) {
  const { isAuthenticated, loading, profile } = useAuth();
  const ui = deriveEventUiState(event, registration, { profileId: profile?.id });
  const loginNext = `/register/${event.id}`;

  let primary = null;
  let note = null;

  if (loading) {
    primary = (
      <Button disabled loading>
        Checking…
      </Button>
    );
  } else if (ui.cta === "view") {
    primary = (
      <Button href={`/registrations/${registration.id}`} size="lg">
        View registration
      </Button>
    );
  } else if (ui.cta === "pay") {
    primary = (
      <Button href={`/registrations/${registration.id}`} size="lg">
        Continue payment
      </Button>
    );
  } else if (ui.cta === "register") {
    if (!isAuthenticated) {
      primary = (
        <Button href={`/login?next=${encodeURIComponent(loginNext)}`} size="lg">
          Sign in to register
        </Button>
      );
      note = "You’ll return here after signing in with Google.";
    } else {
      primary = (
        <Button href={`/register/${event.id}`} size="lg">
          Register · {formatFee(event.fee)}
        </Button>
      );
    }
  } else {
    primary = (
      <Button disabled size="lg" variant="secondary">
        {ui.label}
      </Button>
    );
    note = "Registration isn’t available for this event right now.";
  }

  return (
    <aside className={[styles.wrap, sticky ? styles.sticky : ""].filter(Boolean).join(" ")}>
      <div className={styles.summary}>
        <div className={styles.status}>
          <Badge tone={ui.tone || "default"}>{ui.label}</Badge>
        </div>
        <p className={styles.feeLine}>
          <span className={styles.feeLabel}>Fee</span>
          <strong className={styles.feeValue}>{formatFee(event?.fee)}</strong>
        </p>
      </div>
      <div className={styles.actions}>{primary}</div>
      {note ? <p className={styles.note}>{note}</p> : null}
    </aside>
  );
}
