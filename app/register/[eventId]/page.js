"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { openRazorpayCheckout } from "@/components/kratos/PaymentCheckout";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import PaymentStatus from "@/components/registration/PaymentStatus";
import ProfileConfirm, { getMissingProfileKeys } from "@/components/registration/ProfileConfirm";
import RegistrationPreview from "@/components/registration/RegistrationPreview";
import TeamSizeStepper from "@/components/registration/TeamSizeStepper";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { createOrder, verifyPayment } from "@/lib/api/payments";
import { updateMyProfile } from "@/lib/api/profile";
import { createRegistration, getRegistration, getRegistrationReceipt, listMyRegistrations } from "@/lib/api/registrations";
import {
  canRetryPayment,
  isPaymentProcessing,
  isRegistrationConfirmed,
  toUserMessage,
} from "@/lib/errors/userMessages";
import { formatFee, isProfileComplete } from "@/lib/events/utils";

const STEP_LABELS = ["Profile", "Setup", "Preview", "Payment"];

function RegisterWizard() {
  const params = useParams();
  const eventId = params?.eventId;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile, user, setProfile, refresh } = useAuth();
  const { event, loading: eventLoading, error: eventError } = useEvent(eventId);

  const [step, setStep] = useState(0); // 0 profile, 1 setup, 2 preview, 3 payment
  const [regType, setRegType] = useState("SOLO");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [registration, setRegistration] = useState(null);
  const [payMode, setPayMode] = useState("ready"); // ready | verifying | pending | failed
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    college_name: "",
    department: "",
    year_of_study: "",
    contact_email: "",
  });

  const allowsSolo =
    event?.allow_individual !== false && event?.registration_mode !== "TEAM_ONLY";
  const allowsTeam =
    (event?.team_max_size ?? 1) > 1 ||
    event?.registration_mode === "TEAM_ONLY" ||
    event?.registration_mode === "TEAM_OR_INDIVIDUAL";

  const feeLabel = useMemo(() => formatFee(event?.fee), [event]);
  const needsPayment = event && Number(event.fee) > 0;
  const missingKeys = useMemo(() => getMissingProfileKeys(profile || form), [profile, form]);

  const goToDetail = useCallback(
    (reg) => {
      if (!reg?.id) return;
      router.replace(`/registrations/${reg.id}`);
    },
    [router]
  );

  const tryAutoReceipt = useCallback(async (regId) => {
    try {
      const receipt = await getRegistrationReceipt(regId);
      if (receipt?.pdf_url) window.open(receipt.pdf_url, "_blank", "noopener");
    } catch {
      /* optional */
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(`/register/${eventId}`)}`);
    }
  }, [authLoading, isAuthenticated, eventId, router]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        college_name: profile.college_name || "",
        department: profile.department || "",
        year_of_study: profile.year_of_study || "",
        contact_email: profile.contact_email || "",
      });
      if (isProfileComplete(profile)) setStep((s) => Math.max(s, 1));
    }
  }, [profile]);

  useEffect(() => {
    if (!event) return;
    if (allowsSolo && !allowsTeam) setRegType("SOLO");
    else if (!allowsSolo && allowsTeam) setRegType("TEAM");
    const min = event.team_min_size || 2;
    const max = event.team_max_size || min;
    setTeamSize((n) => Math.min(max, Math.max(min, n || min)));
  }, [event, allowsSolo, allowsTeam]);

  // Recover existing registration for this event (payment recovery)
  useEffect(() => {
    if (!isAuthenticated || !eventId || authLoading) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await listMyRegistrations();
        const existing = (list || []).find((r) => String(r.event_id) === String(eventId));
        if (!existing || cancelled) return;
        const fresh = await getRegistration(existing.id);
        if (cancelled) return;
        setRegistration(fresh);
        if (isRegistrationConfirmed(fresh)) {
          goToDetail(fresh);
          return;
        }
        if (needsPayment) {
          setStep(3);
          if (isPaymentProcessing(fresh)) setPayMode("pending");
          else if (canRetryPayment(fresh)) setPayMode("ready");
          else setPayMode("pending");
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, eventId, authLoading, needsPayment, goToDetail]);

  const saveProfile = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      await refresh();
      setStep(1);
    } catch (err) {
      setError(toUserMessage(err, "Profile update failed"));
    } finally {
      setBusy(false);
    }
  }, [form, refresh, setProfile]);

  const submitRegistration = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      let reg = registration;
      if (!reg) {
        const payload = {
          registration_type: regType,
          ...(regType === "TEAM" ? { team_name: teamName.trim() } : {}),
        };
        reg = await createRegistration(eventId, payload);
        setRegistration(reg);
      }
      if (needsPayment) {
        setStep(3);
        setPayMode(isPaymentProcessing(reg) ? "pending" : "ready");
      } else {
        const fresh = await getRegistration(reg.id);
        setRegistration(fresh);
        await tryAutoReceipt(fresh.id);
        goToDetail(fresh);
      }
    } catch (err) {
      const msg = toUserMessage(err);
      setError(msg);
      if (/already registered/i.test(err?.message || "")) {
        try {
          const list = await listMyRegistrations();
          const existing = (list || []).find((r) => String(r.event_id) === String(eventId));
          if (existing) goToDetail(existing);
        } catch {
          /* ignore */
        }
      }
    } finally {
      setBusy(false);
    }
  }, [
    registration,
    regType,
    teamName,
    eventId,
    needsPayment,
    tryAutoReceipt,
    goToDetail,
  ]);

  const startPayment = useCallback(async () => {
    if (!registration) return;
    setBusy(true);
    setError(null);
    setPayMode("verifying");
    try {
      const paymentType = regType === "TEAM" ? "TEAM_REGISTRATION" : "SOLO_REGISTRATION";
      const order = await createOrder({
        eventId,
        paymentType,
        registrationId: registration.id,
      });
      const response = await openRazorpayCheckout({
        keyId: order.razorpayKeyId,
        orderId: order.razorpayOrderId,
        amountPaise: order.amountPaise,
        currency: order.currency,
        description: event?.name || "KRATOS registration",
        prefill: {
          name: profile?.full_name,
          email: user?.email,
          contact: profile?.phone,
        },
        onSuccess: async () => {},
      });
      setPayMode("verifying");
      await verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
      const fresh = await getRegistration(registration.id);
      setRegistration(fresh);
      if (isRegistrationConfirmed(fresh)) {
        await tryAutoReceipt(fresh.id);
        goToDetail(fresh);
      } else {
        setPayMode("pending");
      }
    } catch (err) {
      if (err?.message === "Payment cancelled") {
        setPayMode("failed");
        setError(toUserMessage(err));
      } else {
        setPayMode("pending");
        setError(toUserMessage(err, "We’re confirming your payment. You don’t need to pay again."));
      }
    } finally {
      setBusy(false);
    }
  }, [
    registration,
    regType,
    eventId,
    event?.name,
    profile,
    user?.email,
    tryAutoReceipt,
    goToDetail,
  ]);

  const checkStatus = useCallback(async () => {
    if (!registration?.id) return;
    setBusy(true);
    setError(null);
    try {
      const fresh = await getRegistration(registration.id);
      setRegistration(fresh);
      if (isRegistrationConfirmed(fresh)) {
        await tryAutoReceipt(fresh.id);
        goToDetail(fresh);
      } else if (isPaymentProcessing(fresh)) {
        setPayMode("pending");
      } else if (canRetryPayment(fresh)) {
        setPayMode("failed");
      } else {
        setPayMode("pending");
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }, [registration, tryAutoReceipt, goToDetail]);

  if (eventLoading || authLoading) {
    return <p className="state-msg">Loading registration…</p>;
  }
  if (eventError) {
    return (
      <StatusBanner tone="err" title="Event unavailable">
        {toUserMessage(eventError)}
      </StatusBanner>
    );
  }
  if (!event) return null;

  const previewRows = [
    ["Event", event.name],
    ["Type", regType === "TEAM" ? "Team" : "Solo"],
    ...(regType === "TEAM"
      ? [
          ["Team name", teamName],
          ["Team size", String(teamSize)],
        ]
      : []),
    ["Name", form.full_name || profile?.full_name],
    ["Email", user?.email],
    ["College", form.college_name || profile?.college_name],
    ["Phone", form.phone || profile?.phone],
    ["Fee", feeLabel],
  ];

  return (
    <div className="wizard-card" style={{ maxWidth: 560 }}>
      <p className="node-coord">REG · {event.name}</p>
      <h1>Register</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Fee {feeLabel} · {event.registration_open ? "Open" : "Closed"}
      </p>

      <div className="wizard-steps" aria-label="Registration steps">
        {STEP_LABELS.map((label, i) => (
          <span key={label} className={i === step ? "active" : i < step ? "done" : ""}>
            {label}
          </span>
        ))}
      </div>

      {!event.registration_open && (
        <StatusBanner tone="err" title="Registration closed">
          This registration has closed.
        </StatusBanner>
      )}

      {step === 0 && (
        <ProfileConfirm
          form={form}
          setForm={setForm}
          email={user?.email}
          missingKeys={missingKeys.length ? missingKeys : null}
          onSubmit={saveProfile}
          busy={busy}
        />
      )}

      {step === 1 && event.registration_open && (
        <div className="profile-fields">
          <p className="muted">Choose how you want to register for this event.</p>
          <div className="explorer-filters" role="group" aria-label="Registration type">
            {allowsSolo && (
              <button
                type="button"
                className={regType === "SOLO" ? "active" : ""}
                onClick={() => setRegType("SOLO")}
              >
                Solo
              </button>
            )}
            {allowsTeam && (
              <button
                type="button"
                className={regType === "TEAM" ? "active" : ""}
                onClick={() => setRegType("TEAM")}
              >
                Team
              </button>
            )}
          </div>
          {regType === "TEAM" && (
            <>
              <TeamSizeStepper
                value={teamSize}
                min={event.team_min_size || 2}
                max={event.team_max_size || 10}
                onChange={setTeamSize}
              />
              <div className="field">
                <label htmlFor="team-name">Team name</label>
                <input
                  id="team-name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  minLength={1}
                />
              </div>
            </>
          )}
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || (regType === "TEAM" && !teamName.trim())}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && event.registration_open && (
        <RegistrationPreview
          rows={previewRows}
          onEdit={() => setStep(1)}
          onConfirm={submitRegistration}
          busy={busy}
          confirmLabel={needsPayment ? "Confirm & continue to pay" : "Confirm registration"}
        />
      )}

      {step === 3 && (
        <PaymentStatus
          mode={payMode}
          feeLabel={feeLabel}
          summaryRows={[
            ["Event", event.name],
            ["Type", regType === "TEAM" ? `Team · ${teamName || registration?.team?.name || ""}` : "Solo"],
            ...(regType === "TEAM" ? [["Team size", String(teamSize)]] : []),
            ["Leader", profile?.full_name || form.full_name],
          ]}
          onPay={startPayment}
          onCheckStatus={checkStatus}
          busy={busy}
        />
      )}

      {error && (
        <StatusBanner tone="err" title="Something went wrong">
          {error}
        </StatusBanner>
      )}

      <p className="muted" style={{ marginTop: 18 }}>
        <Link href={`/events/${eventId}`}>← Back to event</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Participation</span>
            <h1>Registration</h1>
          </div>
        </section>
        <section>
          <div className="container">
            <Suspense fallback={<p className="state-msg">Loading…</p>}>
              <RegisterWizard />
            </Suspense>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
