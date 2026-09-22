"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SpotlightCard } from "@/components/effects/SpotlightCard";
import { useAuth } from "@/context/AuthProvider";
import {
  deriveEventCardActions,
  deriveEventCardStatus,
  deriveTeamLeaderSummary,
  formatCardWhen,
  formatCategoryEditorial,
  formatFeeCard,
  formatRegistrationModeShort,
  formatRosterCardLine,
} from "@/lib/events/eventCard";
import { deriveEventUiState } from "@/lib/events/registrationUiState";
import styles from "./EventCard.module.css";

export function EventCard({ event, registration }) {
  const { profile, isAuthenticated } = useAuth();
  const ui = deriveEventUiState(event, registration, { profileId: profile?.id });
  const status = deriveEventCardStatus(event, ui);
  const actions = deriveEventCardActions(event, registration, ui, { isAuthenticated });
  const leaderSummary = deriveTeamLeaderSummary(event, registration, profile?.id);
  const rosterLine = formatRosterCardLine(event);
  const regMode = formatRegistrationModeShort(event.registration_mode);
  const when = formatCardWhen(event.starts_at, event.ends_at, event.slot);
  const venue = event.venue?.trim() || "TBA";
  const fee = formatFeeCard(event.fee);
  const detailHref = actions.view.href;

  const showTeamMemberName =
    (ui.code === "TEAM_MEMBER" || ui.code === "TEAM_SUBSTITUTE") && registration?.team?.name;

  return (
    <SpotlightCard as="article" className={styles.card} aria-labelledby={`event-${event.id}-title`}>
      <p className={styles.category}>{formatCategoryEditorial(event.category)}</p>

      <h3 id={`event-${event.id}-title`} className={styles.title}>
        <Link href={detailHref} className={styles.titleLink}>
          {event.name}
        </Link>
      </h3>

      {event.tagline ? <p className={styles.tagline}>{event.tagline}</p> : null}

      <div className={styles.schedule}>
        <p className={styles.when}>{when}</p>
        <p className={styles.venue}>{venue}</p>
      </div>

      <div className={styles.divider} aria-hidden />

      <div className={styles.facts}>
        <span className={styles.fee}>{fee}</span>
        <div className={styles.format}>
          {regMode ? <span className={styles.regMode}>{regMode}</span> : null}
          {rosterLine ? <span className={styles.roster}>{rosterLine}</span> : null}
        </div>
      </div>

      {!leaderSummary ? (
        <p
          className={[styles.status, styles[`status_${status.tone}`]].filter(Boolean).join(" ")}
          data-status={ui.code}
        >
          {status.showDot ? <span className={styles.statusDot} aria-hidden>●</span> : null}
          <span>{status.text}</span>
        </p>
      ) : null}

      {leaderSummary ? (
        <div className={styles.teamSummary} aria-label="Your team roster summary">
          <p className={styles.teamKicker}>YOUR TEAM</p>
          <p className={styles.teamName}>{leaderSummary.teamName}</p>
          <div className={styles.teamCounts}>
            {leaderSummary.required != null ? (
              <div className={styles.teamCount}>
                <span className={styles.countLabel}>REQUIRED</span>
                <span className={styles.countValue}>
                  {leaderSummary.mandatory} / {leaderSummary.required}
                </span>
              </div>
            ) : null}
            {leaderSummary.maxSubs > 0 ? (
              <div className={styles.teamCount}>
                <span className={styles.countLabel}>SUBSTITUTES</span>
                <span className={styles.countValue}>
                  {leaderSummary.subs} / {leaderSummary.maxSubs}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showTeamMemberName ? (
        <p className={styles.teamMemberName}>{registration.team.name}</p>
      ) : null}

      <footer className={styles.footer}>
        <Link href={actions.view.href} className={styles.viewEvent}>
          {actions.view.label}
        </Link>
        {actions.primary ? (
          <Button href={actions.primary.href} size="sm" variant={actions.primary.variant} className={styles.primaryBtn}>
            {actions.primary.label}
          </Button>
        ) : null}
      </footer>
    </SpotlightCard>
  );
}
