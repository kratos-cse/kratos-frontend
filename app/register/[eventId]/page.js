"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageTransition } from "@/components/motion/Reveal";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBanner, ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { openRazorpayCheckout } from "@/components/registration/PaymentCheckout";
import { PaymentConfirmed } from "@/components/registration/PaymentConfirmed";
import { TeamMateChoice } from "@/components/registration/TeamMateChoice";
import { TeamRosterWizard } from "@/components/registration/TeamRosterWizard";
import { DynamicRegistrationForm } from "@/components/registration/DynamicRegistrationForm";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { getRegistrationForm } from "@/lib/api/events";
import { createRegistration, getRegistration, listMyRegistrations } from "@/lib/api/registrations";
import { createOrder, verifyPayment, syncPayment } from "@/lib/api/payments";
import { toUserMessage, canRetryPayment, isRegistrationConfirmed } from "@/lib/errors/userMessages";
import {
  canRegisterForEvent,
  isProfileComplete,
  formatFee,
  findMyRegistrationForEvent,
  registrationAvailabilityLabel,
} from "@/lib/events/utils";
import { allowedRegistrationTypes } from "@/lib/events/registrationTypes";
import {
  canLeaderEnterMembers,
  canInviteTeammatesLater,
  showTeammateChoice,
} from "@/lib/events/rosterPlan";
import {
  buildFieldResponses,
  validateRequiredFields,
  visibleFields,
} from "@/lib/registration/fieldUtils";
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
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({ registration_fields: [], team_member_fields: [] });
  const [fieldValues, setFieldValues] = useState({});

  const { types, configError } = useMemo(
    () => (event ? allowedRegistrationTypes(event) : { types: ["SOLO"], error: null }),
    [event]
  );

  const hasFee = Number(event?.fee || 0) > 0;

  const registrationFields = useMemo(
    () => visibleFields(registrationForm.registration_fields),
    [registrationForm.registration_fields]
  );
  const teamMemberFields = useMemo(
    () => visibleFields(registrationForm.team_member_fields),
    [registrationForm.team_member_fields]
  );

  useEffect(() => {
    if (!event) return;
    setRegType(types[0] || "SOLO");
  }, [event, types]);

  useEffect(() => {
    if (isProfileComplete(profile)) setStep("setup");
    else setStep("profile");
  }, [profile]);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    (async () => {
      try {
        const form = await getRegistrationForm(eventId);
        if (!cancelled) setRegistrationForm(form || { registration_fields: [], team_member_fields: [] });
      } catch {
        if (!cancelled) setRegistrationForm({ registration_fields: [], team_member_fields: [] });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const findExistingRegistration = useCallback(async () => {
    const list = await listMyRegistrations();
    return findMyRegistrationForEvent(list, eventId);
  }, [eventId]);

  const recoverExisting = useCallback(async () => {
    const existing = await findExistingRegistration();
    if (existing) {
      setRegistration(existing);
      if (isRegistrationConfirmed(existing) || !hasFee) {
        setAlreadyRegistered(existing);
        return existing;
      }
      setStep("payment");
      return existing;
    }
    return null;
  }, [findExistingRegistration, hasFee]);

  useEffect(() => {
    if (!event) return undefined;
    let cancelled = false;
    (async () => {
      try {
        await recoverExisting();
      } catch {
        /* ignore — user may not have regs yet */
      } finally {
        if (!cancelled) setCheckingExisting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event, recoverExisting]);

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

  async function goToPayment(reg) {
    setRegistration(reg);
    const fee = Number(event?.fee || 0);
    if (!fee) {
      setStep("confirmed");
      return;
    }
    setStep("payment");
    await startPayment(reg);
  }

  async function ensureTeamRegistration() {
    const existing = await findExistingRegistration();
    if (existing) {
      setRegistration(existing);
      return existing;
    }
    const reg = await createRegistration(eventId, {
      registration_type: "TEAM",
      team_name: teamName.trim(),
      field_responses: buildFieldResponses(registrationFields, fieldValues),
    });
    setRegistration(reg);
    return reg;
  }

  async function continueTeamSetup() {
    if (!teamName.trim()) {
      setError("Enter a team name.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const existing = await findExistingRegistration();
      if (existing) {
        if (isRegistrationConfirmed(existing)) {
          setAlreadyRegistered(existing);
          return;
        }
        setRegistration(existing);
        setStep("payment");
        return;
      }

      const reg = await ensureTeamRegistration();

      if (!showTeammateChoice(event)) {
        if (canLeaderEnterMembers(event)) {
          setStep("roster");
        } else {
          await goToPayment(reg);
        }
        return;
      }

      setStep("teammate-choice");
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSetupContinue() {
    if (regType === "SOLO") {
      setStep(registrationFields.length ? "custom-fields" : "review");
      return;
    }

    if (registrationFields.length) {
      setStep("custom-fields");
      return;
    }

    await continueTeamSetup();
  }

  async function onChooseAddNow() {
    setBusy(true);
    setError(null);
    try {
      const reg = registration || (await ensureTeamRegistration());
      setRegistration(reg);
      setStep("roster");
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onChooseInviteLater() {
    setBusy(true);
    setError(null);
    try {
      const reg = registration || (await ensureTeamRegistration());
      await goToPayment(reg);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function createAndContinue() {
    setBusy(true);
    setError(null);
    try {
      const existing = await findExistingRegistration();
      if (existing) {
        setRegistration(existing);
        if (isRegistrationConfirmed(existing)) {
          setAlreadyRegistered(existing);
          return;
        }
        if (Number(event.fee) > 0 && canRetryPayment(existing)) {
          setStep("payment");
          await startPayment(existing);
        } else {
          setAlreadyRegistered(existing);
        }
        return;
      }

      const reg = await createRegistration(eventId, {
        registration_type: "SOLO",
        field_responses: buildFieldResponses(registrationFields, fieldValues),
      });
      setRegistration(reg);
      if (Number(event.fee) > 0) {
        setStep("payment");
        await startPayment(reg);
      } else {
        setStep("confirmed");
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const teamId = registration?.team?.id;

  if (eventLoading || (event && checkingExisting)) return <PageSkeleton />;
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

  if (alreadyRegistered) {
    return (
      <div className={styles.wrap}>
        <header className={styles.head}>
          <p className="meta">Register</p>
          <h1 className="page-title">{event.name}</h1>
        </header>
        <Card className="stack">
          <StatusBanner tone="ok">You have already registered for this event.</StatusBanner>
          <p className="muted">
            Each participant can register for an event only once. Open your registration to see its
            details{alreadyRegistered.team ? " and manage your team" : ""}.
          </p>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" href="/events">
              Browse other events
            </Button>
            <Button type="button" href={`/registrations/${alreadyRegistered.id}`}>
              View registration
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!canRegisterForEvent(event)) {
    return (
      <ErrorState
        title="Registration unavailable"
        description={registrationAvailabilityLabel(event.registration_availability)}
        secondaryLabel="View event"
        secondaryHref={`/events/${eventId}`}
      />
    );
  }

  const rosterHint = (() => {
    const req = Number(event.required_member_count ?? event.team_min_size ?? 1);
    const subs = Number(
      event.substitute_count ?? Math.max(0, Number(event.team_max_size ?? req) - req)
    );
    if (subs > 0) return `Roster: ${req} members + up to ${subs} substitutes`;
    return `Team of ${req}`;
  })();

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <p className="meta">Register</p>
        <h1 className="page-title">{event.name}</h1>
        <p className="muted">Fee: {formatFee(event.fee)}</p>
      </header>

      {step === "payment" && registration ? (
        <StatusBanner tone="info">
          You have already started registering for this event — complete payment to confirm it.
        </StatusBanner>
      ) : null}
      {error ? <StatusBanner tone="err">{error}</StatusBanner> : null}
      {configError ? <StatusBanner tone="err">{configError}</StatusBanner> : null}

      <PageTransition key={step}>
      {step === "profile" ? (
        <Card>
          <h2 className={styles.h2}>Your profile</h2>
          <p className="muted">Complete your profile before registering.</p>
          <ProfileForm submitLabel="Continue" onSaved={() => setStep("setup")} />
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
                hint={rosterHint}
              />
              {canInviteTeammatesLater(event) ? (
                <StatusBanner tone="info">
                  You&apos;ll be the team leader. After payment you can invite teammates to complete their
                  own details.
                </StatusBanner>
              ) : null}
            </>
          ) : null}
          <div className={styles.actions}>
            <Button type="button" variant="ghost" href={`/events/${eventId}`}>
              Back
            </Button>
            <Button
              type="button"
              loading={busy}
              onClick={onSetupContinue}
              disabled={regType === "TEAM" && !teamName.trim()}
            >
              {regType === "TEAM" ? "Next" : registrationFields.length ? "Continue" : "Review"}
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "teammate-choice" && regType === "TEAM" ? (
        <TeamMateChoice
          event={event}
          busy={busy}
          onAddNow={onChooseAddNow}
          onInviteLater={onChooseInviteLater}
          onBack={() => setStep("setup")}
        />
      ) : null}

      {step === "roster" && regType === "TEAM" && teamId ? (
        <TeamRosterWizard
          teamId={teamId}
          event={event}
          teamMemberFields={teamMemberFields}
          busy={busy}
          onBack={() => setStep(showTeammateChoice(event) ? "teammate-choice" : "setup")}
          onContinuePayment={() => goToPayment(registration)}
        />
      ) : null}

      {step === "custom-fields" ? (
        <Card className="stack">
          <h2 className={styles.h2}>Additional details</h2>
          <DynamicRegistrationForm
            fields={registrationFields}
            values={fieldValues}
            disabled={busy}
            onChange={(fieldId, value) => setFieldValues((prev) => ({ ...prev, [fieldId]: value }))}
          />
          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={() => setStep("setup")}>
              Back
            </Button>
            <Button
              type="button"
              loading={busy && regType === "TEAM"}
              onClick={() => {
                const missing = validateRequiredFields(registrationFields, fieldValues);
                if (missing.length) {
                  setError(`Please complete: ${missing.join(", ")}`);
                  return;
                }
                setError(null);
                if (regType === "SOLO") setStep("review");
                else continueTeamSetup();
              }}
            >
              Continue
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "review" && regType === "SOLO" ? (
        <Card className="stack">
          <h2 className={styles.h2}>Review</h2>
          <dl className={styles.review}>
            <div>
              <dt>Event</dt>
              <dd>{event.name}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>Individual</dd>
            </div>
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(registrationFields.length ? "custom-fields" : "setup")}
            >
              Back
            </Button>
            <Button type="button" loading={busy} onClick={createAndContinue}>
              {Number(event.fee) > 0 ? "Confirm & pay" : "Confirm registration"}
            </Button>
          </div>
        </Card>
      ) : null}

      {step === "payment" && registration ? (
        <Card className="stack">
          <h2 className={styles.h2}>Payment</h2>
          <StatusBanner tone="warn">
            Complete payment to confirm your registration. Don&apos;t refresh mid-checkout — you can retry
            safely.
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
      </PageTransition>

      {step === "confirmed" && registration ? (
        <PaymentConfirmed
          title="Payment confirmed"
          message="Continue to your registration to manage your team and share invites."
          onContinue={() => router.push(`/registrations/${registration.id}`)}
        />
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
