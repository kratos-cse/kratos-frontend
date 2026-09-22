"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState, StatusBanner } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthProvider";
import { getInvitation, joinInvitation } from "@/lib/api/teams";
import { isProfileComplete } from "@/lib/events/utils";
import { toUserMessage } from "@/lib/errors/userMessages";
import styles from "./join.module.css";

function JoinInner() {
  const params = useParams();
  const code = params?.inviteCode;
  const router = useRouter();
  const { profile, isAuthenticated, loading: authLoading } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvitation(code);
      setInvite(data);
    } catch (err) {
      setError(err);
      setInvite(null);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  async function onJoin() {
    setBusy(true);
    setError(null);
    try {
      const result = await joinInvitation(code);
      const regId = result?.registration_id;
      if (regId) router.replace(`/registrations/${regId}`);
      else if (result?.team?.id) router.replace("/registrations");
      else router.replace("/registrations");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  if (loading || authLoading) return <PageSkeleton />;

  if (error && !invite) {
    return (
      <ErrorState
        title="Invitation unavailable"
        description={toUserMessage(error)}
        onRetry={load}
        secondaryLabel="Explore events"
        secondaryHref="/events"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="stack">
        <h1 className="page-title">Team invitation</h1>
        <p className="muted">Sign in to join this team. Members can join only after the leader has paid.</p>
        <Button href={`/login?next=${encodeURIComponent(`/join/${code}`)}`}>Sign in to join</Button>
      </Card>
    );
  }

  if (!isProfileComplete(profile)) {
    return (
      <Card className="stack">
        <h1 className="page-title">Complete your profile</h1>
        <p className="muted">Profile details are required before joining a team.</p>
        <ProfileForm submitLabel="Save & continue" onSaved={() => {}} />
      </Card>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className="page-title">Join team</h1>
      <Card className="stack">
        <p>
          You&apos;re invited to join <strong>{invite?.team_name || "a team"}</strong>
          {invite?.event_name ? (
            <>
              {" "}
              for <strong>{invite.event_name}</strong>
            </>
          ) : null}
          {invite?.leader_name ? <> · Leader: {invite.leader_name}</> : null}.
        </p>
        {invite?.is_full ? (
          <StatusBanner tone="err">This team is full.</StatusBanner>
        ) : (
          <StatusBanner tone="info">
            Join works only when the team status is PAID or COMPLETE (leader must finish payment first).
            {typeof invite?.active_member_count === "number"
              ? ` Members: ${invite.active_member_count}/${invite.team_max_size}.`
              : ""}
          </StatusBanner>
        )}
        {error ? <StatusBanner tone="err">{toUserMessage(error)}</StatusBanner> : null}
        <div className={styles.actions}>
          <Button loading={busy} onClick={onJoin} disabled={invite?.is_full || invite?.is_active === false}>
            Accept invitation
          </Button>
          <Button variant="ghost" href="/events">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    <PageShell>
      <JoinInner />
    </PageShell>
  );
}
