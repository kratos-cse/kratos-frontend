"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBanner, ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { openRazorpayCheckout } from "@/components/registration/PaymentCheckout";
import { PaymentConfirmed } from "@/components/registration/PaymentConfirmed";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { createRegistration, getRegistration, listMyRegistrations } from "@/lib/api/registrations";
import { createOrder, verifyPayment, syncPayment } from "@/lib/api/payments";
import { toUserMessage, canRetryPayment, isRegistrationConfirmed } from "@/lib/errors/userMessages";
import { isProfileComplete, formatFee, findMyRegistrationForEvent } from "@/lib/events/utils";
import { allowedRegistrationTypes } from "@/lib/events/registrationTypes";
import styles from "./register.module.css";

function RegisterWizard() {
  const params = useParams();
  const eventId = params?.eventId;
  const router = useRouter();
  const { profile, user } = useAuth();
  const { event, loading: eventLoading, error: eventError, errorMessage, refresh } = useEvent(eventId);

  const [step, setStep] = useState("profile");
  const [regType, setRegType] = useState("SOLO");
  const [teamName, setTeamName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);

  const { types, configError } = useMemo(
    () => (event ? allowedRegistrationTypes(event) : { types: ["SOLO"], error: null }),
    [event]
  );

  useEffect(() => {
    if (!event) return;
    setRegType(types[0] || "SOLO");
  }, [event, types]);

  useEffect(() => {
    if (isProfileComplete(profile)) setStep("setup");
    else setStep("profile");
  }, [profile]);

  const recoverExisting = useCallback(async () => {
    const list = await listMyRegistrations();
    const existing = findMyRegistrationForEvent(list, eventId);
    if (existing) {
      setRegistration(existing);
      if (isRegistrationConfirmed(existing)) {
        router.replace(`/registrations/${existing.id}`);
        return existing;
      }
      setStep("payment");
      return existing;
    }
    return null;
  }, [eventId, router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await recoverExisting();
        if (!cancelled && existing) setRegistration(existing);
      } catch {
        /* ignore — user may not have regs yet */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [recoverExisting]);

  async function startPayment(reg) {
    const fee = Number(event?.fee || 0);
    if (!fee) {
      setStep("confirmed");
      setRegistration(reg);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const order = await createOrder({
        eventId,
        paymentType: reg.team ? "TEAM_REGISTRATION" : "SOLO_REGISTRATION",
        registrationId: reg.id,
      });
      await openRazorpayCheckout({
        keyId: order.razorpayKeyId,
        orderId: order.razorpayOrderId,
        amountPaise: order.amountPaise,
        currency: order.currency,
        description: event?.name || "Registration",
        prefill: {
          name: profile?.full_name || "",
          email: user?.email || profile?.contact_email || "",
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
          const fresh = await getRegistration(reg.id);
          setRegistration(fresh);
          setStep("confirmed");
        },
      });
    } catch (err) {
      if (String(err?.message || "").toLowerCase().includes("cancelled")) {
        setError("Payment was cancelled. You can continue when ready.");
        setStep("payment");
      } else {
        setError(toUserMessage(err));
        setStep("payment");
      }
    } finally {
      setBusy(false);
    }
  }

  async function createAndContinue() {
    setBusy(true);
    setError(null);
    try {
      const existing = await recoverExisting();
      if (existing) {
        if (!isRegistrationConfirmed(existing) && Number(event.fee) > 0 && canRetryPayment(existing)) {
          await startPayment(existing);
        } else {
          router.replace(`/registrations/${existing.id}`);
        }
        return;
      }

      const payload = {
        registration_type: regType,
        ...(regType === "TEAM" ? { team_name: teamName.trim() } : {}),
      };
      if (regType === "TEAM" && !teamName.trim()) {
        setError("Enter a team name.");
        setBusy(false);
        return;
      }

      const reg = await createRegistration(eventId, payload);
      setRegistration(reg);
      if (Number(event.fee) > 0) {
        setStep("payment");
        await startPayment(reg);
      } else {
        setRegistration(reg);
        setStep("confirmed");
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (eventLoading) return <PageSkeleton />;
  if (eventError || !event) {
    return (
      <ErrorState
        title="Event unavailable"
        description={errorMessage}
        onRetry={refresh}
        secondaryLabel="Back to events"
        secondaryHref="/events"
      />
    );
  }

  if (!event.registration_open) {
    return (
      <ErrorState
        title="Registration closed"
        description="This event is not accepting registrations right now."
        secondaryLabel="View event"
        secondaryHref={`/events/${eventId}`}
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className="meta">Register</p>
        <h1 className="page-title">{event.name}</h1>
        <p className="muted">Fee: {formatFee(event.fee)}</p>
      </header>

      {error ? <StatusBanner tone="err">{error}</StatusBanner> : null}
      {configError ? <StatusBanner tone="err">{configError}</StatusBanner> : null}

      {step === "profile" ? (
        <Card>
          <h2 className={styles.h2}>Your profile</h2>
          <p className="muted">Complete your profile before registering.</p>
          <ProfileForm
            submitLabel="Continue"
            onSaved={() => setStep("setup")}
          />
        </Card>
      ) : null}

      {step === "setup" && !configError ? (
        <Card className="stack">
          <h2 className={styles.h2}>Registration type</h2>
          <div className={styles.typeRow} role="radiogroup" aria-label="Registration type">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={regType === t}
                className={[styles.typeBtn, regType === t ? styles.typeActive : ""].join(" ")}
                onClick={() => setRegType(t)}
              >
                {t === "SOLO" ? "Individual" : "Team"}
              </button>
            ))}
          </div>
          {regType === "TEAM" ? (
            <>
              <Input
                label="Team name"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                hint={
                  event.required_member_count != null || event.team_min_size != null
                    ? (() => {
                        const req = Number(event.required_member_count ?? event.team_min_size ?? 1);
                        const subs = Number(
                          event.substitute_count ??
                            Math.max(0, Number(event.team_max_size ?? req) - req),
                        );
                        if (subs > 0) {
                          return `Roster: ${req} members + up to ${subs} substitutes (managed after payment)`;
                        }
                        return `Team of ${req} (managed after payment)`;
                      })()
                    : undefined
                }
              />
              <StatusBanner tone="info">
                You&apos;ll be the team leader. Members can join with your invite after payment succeeds.
              </StatusBanner>
            </>
          ) : null}
          <div className={styles.actions}>
            <Button type="button" variant="ghost" href={`/events/${eventId}`}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep("review")} disabled={regType === "TEAM" && !teamName.trim()}>
              Review
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "review" ? (
        <Card className="stack">
          <h2 className={styles.h2}>Review</h2>
          <dl className={styles.review}>
            <div>
              <dt>Event</dt>
              <dd>{event.name}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{regType === "TEAM" ? "Team" : "Individual"}</dd>
            </div>
            {regType === "TEAM" ? (
              <div>
                <dt>Team</dt>
                <dd>{teamName}</dd>
              </div>
            ) : null}
            <div>
              <dt>Fee</dt>
              <dd>{formatFee(event.fee)}</dd>
            </div>
            <div>
              <dt>Participant</dt>
              <dd>{profile?.full_name}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={() => setStep("setup")}>
              Back
            </Button>
            <Button type="button" loading={busy} onClick={createAndContinue}>
              {Number(event.fee) > 0 ? "Confirm & pay" : "Confirm registration"}
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "confirmed" && registration ? (
        <PaymentConfirmed
          title="Payment confirmed"
          message="Continue to your registration to manage your team and share invites."
          onContinue={() => router.push(`/registrations/${registration.id}`)}
        />
      ) : null}

      {step === "payment" && registration ? (
        <Card className="stack">
          <h2 className={styles.h2}>Payment</h2>
          <StatusBanner tone="warn">
            Complete payment to confirm your registration. Don&apos;t refresh mid-checkout — you can retry safely.
          </StatusBanner>
          <div className={styles.actions}>
            <Button
              type="button"
              loading={busy}
              disabled={!canRetryPayment(registration)}
              onClick={() => startPayment(registration)}
            >
              {canRetryPayment(registration) ? "Continue payment" : "Payment processing…"}
            </Button>
            <Button type="button" variant="ghost" href={`/registrations/${registration.id}`}>
              View registration
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PageShell>
      <RequireAuth>
        <RegisterWizard />
      </RequireAuth>
    </PageShell>
  );
}
