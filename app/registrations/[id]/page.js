"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { TeamPanel } from "@/components/team/TeamPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState, StatusBanner } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { openRazorpayCheckout } from "@/components/registration/PaymentCheckout";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import {
  cancelRegistration,
  getRegistration,
  getRegistrationReceipt,
} from "@/lib/api/registrations";
import { createOrder, verifyPayment, syncPayment } from "@/lib/api/payments";
import { getEventWhatsapp } from "@/lib/api/events";
import {
  toUserMessage,
  canRetryPayment,
  isRegistrationConfirmed,
  needsPaymentSync,
} from "@/lib/errors/userMessages";
import { formatFee } from "@/lib/events/utils";
import styles from "./detail.module.css";

function RegistrationDetailInner() {
  const params = useParams();
  const id = params?.id;
  const { profile, user } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [whatsapp, setWhatsapp] = useState(null);
  const [waNote, setWaNote] = useState(null);
  const autoSynced = useRef(false);

  const { event } = useEvent(registration?.event_id);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend getRegistration also syncs CREATED Razorpay payments when possible.
      const data = await getRegistration(id);
      setRegistration(data);
      return data;
    } catch (err) {
      setError(err);
      setRegistration(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    autoSynced.current = false;
    refresh();
  }, [refresh]);

  // Explicit reconcile: if payment still CREATED after load, call sync once.
  useEffect(() => {
    if (!registration || autoSynced.current) return;
    if (!needsPaymentSync(registration)) return;

    autoSynced.current = true;
    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        await syncPayment(registration.payment.id);
        if (!cancelled) await refresh();
      } catch {
        /* keep CREATED UI; user can Sync or Continue payment */
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [registration, refresh]);

  useEffect(() => {
    let cancelled = false;
    async function loadWa() {
      if (!registration?.event_id || !isRegistrationConfirmed(registration)) {
        setWhatsapp(null);
        setWaNote(event?.whatsapp_group_available ? "Available after registration" : null);
        return;
      }
      if (!event?.whatsapp_group_available) {
        setWaNote(null);
        setWhatsapp(null);
        return;
      }
      try {
        const data = await getEventWhatsapp(registration.event_id);
        if (!cancelled) {
          setWhatsapp(data?.whatsapp_group_link || null);
          setWaNote(null);
        }
      } catch (err) {
        if (!cancelled) {
          setWhatsapp(null);
          setWaNote(toUserMessage(err, "WhatsApp unavailable"));
        }
      }
    }
    loadWa();
    return () => {
      cancelled = true;
    };
  }, [registration, event]);

  async function onPay() {
    if (!registration || !event) return;
    setBusy(true);
    setError(null);
    try {
      if (needsPaymentSync(registration)) {
        try {
          await syncPayment(registration.payment.id);
          const after = await getRegistration(id);
          setRegistration(after);
          if (isRegistrationConfirmed(after)) return;
        } catch {
          /* proceed to create-order / checkout */
        }
      }

      const order = await createOrder({
        eventId: registration.event_id,
        paymentType: registration.team ? "TEAM_REGISTRATION" : "SOLO_REGISTRATION",
        registrationId: registration.id,
      });
      await openRazorpayCheckout({
        keyId: order.razorpayKeyId,
        orderId: order.razorpayOrderId,
        amountPaise: order.amountPaise,
        currency: order.currency,
        description: event.name,
        prefill: {
          name: profile?.full_name || "",
          email: user?.email || "",
          contact: profile?.phone || "",
        },
        onSuccess: async (response) => {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (order.paymentId) {
            try {
              await syncPayment(order.paymentId);
            } catch {
              /* verify already applied */
            }
          }
          await refresh();
        },
      });
    } catch (err) {
      if (!String(err?.message || "").toLowerCase().includes("cancelled")) {
        setError(err);
      } else {
        await refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function onSync() {
    if (!registration?.payment?.id) return;
    setBusy(true);
    setError(null);
    try {
      await syncPayment(registration.payment.id);
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onReceipt() {
    setBusy(true);
    try {
      const receipt = await getRegistrationReceipt(registration.id);
      if (receipt?.pdf_url) {
        window.open(receipt.pdf_url, "_blank", "noopener,noreferrer");
      } else if (receipt?.html_url) {
        window.open(receipt.html_url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  async function onCancel() {
    setBusy(true);
    try {
      await cancelRegistration(registration.id);
      await refresh();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  }

  if (loading && !registration) return <PageSkeleton />;
  if (error && !registration) {
    return (
      <ErrorState
        title="Registration not found"
        description={toUserMessage(error)}
        onRetry={refresh}
        secondaryLabel="My registrations"
        secondaryHref="/registrations"
      />
    );
  }

  const status = String(registration.status || "").toUpperCase();
  const pay = String(registration.payment?.status || "").toUpperCase();
  const confirmed = isRegistrationConfirmed(registration);
  const teamId = registration.team?.id;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className="meta">Registration</p>
        <h1 className="page-title">{event?.name || "Registration"}</h1>
        <div className={styles.badges}>
          <Badge tone={status === "CONFIRMED" ? "ok" : status === "CANCELLED" ? "muted" : "warn"}>{status}</Badge>
          {pay ? <Badge tone={pay === "PAID" ? "ok" : pay === "FAILED" ? "err" : "warn"}>{pay}</Badge> : null}
        </div>
        <p className="muted">
          Ref · <code>{registration.id}</code>
          {event ? ` · ${formatFee(event.fee)}` : ""}
        </p>
      </header>

      {error ? <StatusBanner tone="err">{toUserMessage(error)}</StatusBanner> : null}
      {syncing ? <StatusBanner tone="info">Checking payment status with the server…</StatusBanner> : null}

      {!confirmed && status === "PENDING" && Number(event?.fee) > 0 ? (
        <Card className="stack">
          <h2 className={styles.h2}>Payment required</h2>
          <p className="muted">
            Status comes from the backend. If you already paid, use Sync — don’t pay twice until Sync says
            it failed.
          </p>
          <div className={styles.actions}>
            <Button loading={busy} disabled={!canRetryPayment(registration)} onClick={onPay}>
              Continue payment
            </Button>
            {registration.payment?.id ? (
              <Button variant="secondary" loading={busy || syncing} onClick={onSync}>
                Sync payment status
              </Button>
            ) : null}
          </div>
        </Card>
      ) : null}

      {confirmed ? (
        <Card className="stack">
          <h2 className={styles.h2}>You’re registered</h2>
          <div className={styles.actions}>
            <Button href={`/registrations/${registration.id}/qr`}>View QR</Button>
            <Button variant="secondary" loading={busy} onClick={onReceipt}>
              View receipt
            </Button>
            <Button variant="ghost" href={`/events/${registration.event_id}`}>
              View event
            </Button>
          </div>
          {event?.whatsapp_group_available ? (
            whatsapp ? (
              <Button href={whatsapp} variant="secondary" as="a" target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group
              </Button>
            ) : (
              <StatusBanner tone="info">{waNote || "Available after registration"}</StatusBanner>
            )
          ) : null}
        </Card>
      ) : null}

      {status === "PENDING" && (!registration.payment || pay === "FAILED" || pay === "CREATED") ? (
        <div className={styles.actions}>
          <Button variant="danger" loading={busy} onClick={onCancel}>
            Cancel registration
          </Button>
        </div>
      ) : null}

      {teamId ? (
        <TeamPanel
          teamId={teamId}
          event={event}
          onChanged={async () => {
            try {
              const data = await getRegistration(id);
              setRegistration(data);
            } catch {
              /* team panel already shows its own errors */
            }
          }}
        />
      ) : null}
    </div>
  );
}

export default function RegistrationDetailPage() {
  return (
    <PageShell>
      <RequireAuth>
        <RegistrationDetailInner />
      </RequireAuth>
    </PageShell>
  );
}
