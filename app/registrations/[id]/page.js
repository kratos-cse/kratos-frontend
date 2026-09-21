"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import TeamInvitePanel from "@/components/teams/TeamInvitePanel";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { getRegistration, getRegistrationReceipt } from "@/lib/api/registrations";
import {
  canRetryPayment,
  isPaymentProcessing,
  isRegistrationConfirmed,
  toUserMessage,
} from "@/lib/errors/userMessages";
import { formatFee } from "@/lib/events/utils";

function RegistrationDetailInner() {
  const params = useParams();
  const regId = params?.id;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);

  const eventId = registration?.event_id;
  const { event } = useEvent(eventId);

  const load = useCallback(async () => {
    if (!regId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRegistration(regId);
      setRegistration(data);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, [regId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(`/registrations/${regId}`)}`);
      return;
    }
    load();
  }, [authLoading, isAuthenticated, regId, router, load]);

  const isLeader = useMemo(() => {
    if (!registration?.team || !profile?.id) return !registration?.team;
    return registration.team.leader_profile_id === profile.id;
  }, [registration, profile]);

  const confirmed = isRegistrationConfirmed(registration);
  const processing = isPaymentProcessing(registration);
  const retryPay = canRetryPayment(registration);

  async function handleReceipt() {
    setActionError(null);
    setBusy(true);
    try {
      const receipt = await getRegistrationReceipt(regId);
      if (receipt?.pdf_url) window.open(receipt.pdf_url, "_blank", "noopener");
      else setActionError("Receipt not available yet. Try again shortly.");
    } catch (err) {
      setActionError(toUserMessage(err, "Could not load receipt"));
    } finally {
      setBusy(false);
    }
  }

  async function checkStatus() {
    setBusy(true);
    setActionError(null);
    try {
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) {
    return <p className="state-msg">Loading registration…</p>;
  }

  if (error) {
    return (
      <StatusBanner tone="err" title="Couldn’t load registration">
        {error}
      </StatusBanner>
    );
  }

  if (!registration) return null;

  const statusLabel = confirmed
    ? "Registered"
    : processing
      ? "Payment confirming"
      : registration.status || "Pending";

  return (
    <div className="reg-detail-card">
      <p className="node-coord">REG · {String(registration.id).slice(0, 8).toUpperCase()}</p>
      <h1>{event?.name || "Registration"}</h1>
      <p className="muted" style={{ marginBottom: 14 }}>
        <span className={`status-pill ${confirmed ? "confirmed" : "pending"}`}>{statusLabel}</span>
        {registration.team ? ` · Team · ${registration.team.name}` : " · Solo"}
        {registration.team ? (isLeader ? " · Leader" : " · Member") : null}
      </p>

      {confirmed ? (
        <StatusBanner tone="ok" title="You’re registered">
          Keep your QR ready for the event.
          {isLeader && registration.team ? " Your QR represents your team." : null}
        </StatusBanner>
      ) : null}

      {processing ? (
        <div style={{ marginBottom: 16 }}>
          <StatusBanner tone="warn" title="We’re still confirming your payment">
            You don’t need to pay again.
          </StatusBanner>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={checkStatus}>
            {busy ? "Checking…" : "Check status"}
          </button>
        </div>
      ) : null}

      {!confirmed && !processing && retryPay && Number(event?.fee) > 0 ? (
        <div style={{ marginBottom: 16 }}>
          <StatusBanner tone="info" title="Payment still needed">
            Finish payment to confirm this registration.
          </StatusBanner>
          <Link href={`/register/${registration.event_id}`} className="btn btn-primary">
            Continue to payment
          </Link>
        </div>
      ) : null}

      <div className="confirm-list">
        <div className="row">
          <span>Registration ID</span>
          <strong>{String(registration.id).slice(0, 12).toUpperCase()}</strong>
        </div>
        {event?.fee != null ? (
          <div className="row">
            <span>Fee</span>
            <strong>{formatFee(event.fee)}</strong>
          </div>
        ) : null}
        {registration.payment ? (
          <div className="row">
            <span>Payment</span>
            <strong>{registration.payment.status}</strong>
          </div>
        ) : null}
      </div>

      <div className="action-stack">
        {confirmed ? (
          <Link href={`/registrations/${registration.id}/qr`} className="btn btn-primary">
            View QR
          </Link>
        ) : null}
        {confirmed ? (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={handleReceipt}>
            Download receipt
          </button>
        ) : null}
        {event?.whatsapp_group_link ? (
          <a
            href={event.whatsapp_group_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Join WhatsApp group
          </a>
        ) : null}
        <Link href={`/events/${registration.event_id}`} className="btn btn-ghost">
          Event details
        </Link>
        <Link href="/dashboard" className="btn btn-ghost">
          My registrations
        </Link>
      </div>

      {actionError ? (
        <StatusBanner tone="err" title="Action failed">
          {actionError}
        </StatusBanner>
      ) : null}

      {confirmed && isLeader && registration.team?.id ? (
        <div style={{ marginTop: 28 }}>
          <TeamInvitePanel teamId={registration.team.id} teamMaxSize={event?.team_max_size} />
        </div>
      ) : null}
    </div>
  );
}

export default function RegistrationDetailPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">My registrations</span>
            <h1>Registration</h1>
          </div>
        </section>
        <section>
          <div className="container" style={{ paddingBottom: 64 }}>
            <Suspense fallback={<p className="state-msg">Loading…</p>}>
              <RegistrationDetailInner />
            </Suspense>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
