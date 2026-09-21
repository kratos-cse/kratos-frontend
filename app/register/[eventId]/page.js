"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { openRazorpayCheckout } from "@/components/kratos/PaymentCheckout";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { createRegistration, getRegistration } from "@/lib/api/registrations";
import { createInvitation } from "@/lib/api/teams";
import { createOrder, verifyPayment } from "@/lib/api/payments";
import { updateMyProfile } from "@/lib/api/profile";
import { formatFee, isProfileComplete } from "@/lib/events/utils";

const STEPS = ["Auth", "Profile", "Register", "Payment", "Done"];

function RegisterWizard() {
  const params = useParams();
  const eventId = params?.eventId;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile, user, setProfile, refresh } = useAuth();
  const { event, loading: eventLoading, error: eventError } = useEvent(eventId);

  const [step, setStep] = useState(0);
  const [regType, setRegType] = useState("SOLO");
  const [teamName, setTeamName] = useState("");
  const [registration, setRegistration] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
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

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(`/register/${eventId}`)}`);
      return;
    }
    setStep(1);
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
      if (isProfileComplete(profile)) setStep((s) => Math.max(s, 2));
    }
  }, [profile]);

  useEffect(() => {
    if (!event) return;
    if (allowsSolo && !allowsTeam) setRegType("SOLO");
    else if (!allowsSolo && allowsTeam) setRegType("TEAM");
  }, [event, allowsSolo, allowsTeam]);

  const feeLabel = useMemo(() => formatFee(event?.fee), [event]);
  const needsPayment = event && Number(event.fee) > 0;

  const saveProfile = useCallback(
    async (e) => {
      e.preventDefault();
      setBusy(true);
      setError(null);
      try {
        const updated = await updateMyProfile(form);
        setProfile(updated);
        await refresh();
        setStep(2);
      } catch (err) {
        setError(err.message || "Profile update failed");
      } finally {
        setBusy(false);
      }
    },
    [form, refresh, setProfile]
  );

  const submitRegistration = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        registration_type: regType,
        ...(regType === "TEAM" ? { team_name: teamName.trim() } : {}),
      };
      const reg = await createRegistration(eventId, payload);
      setRegistration(reg);
      if (reg.team?.id) {
        try {
          const inv = await createInvitation(reg.team.id);
          setInviteCode(inv?.code || null);
        } catch {
          /* invitation optional if create fails */
        }
      }
      if (needsPayment) setStep(3);
      else {
        const fresh = await getRegistration(reg.id);
        setRegistration(fresh);
        setStep(4);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }, [eventId, needsPayment, regType, teamName]);

  const startPayment = useCallback(async () => {
    if (!registration) return;
    setBusy(true);
    setError(null);
    try {
      const paymentType = regType === "TEAM" ? "TEAM_REGISTRATION" : "SOLO_REGISTRATION";
      const order = await createOrder({
        eventId,
        paymentType,
        registrationId: registration.id,
      });
      await openRazorpayCheckout({
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
      }).then(async (response) => {
        await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        const fresh = await getRegistration(registration.id);
        setRegistration(fresh);
        setStep(4);
      });
    } catch (err) {
      if (err?.message === "Payment cancelled") setError("Payment was cancelled. You can try again.");
      else setError(err.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  }, [event?.name, eventId, profile, registration, regType, user?.email]);

  if (eventLoading || authLoading) {
    return <p className="state-msg">Loading registration…</p>;
  }
  if (eventError) {
    return (
      <p className="state-error" role="alert">
        {eventError.message}
      </p>
    );
  }
  if (!event) return null;

  return (
    <div className="wizard-card" style={{ maxWidth: 560 }}>
      <p className="node-coord">REG · {event.name}</p>
      <h1>Register</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Fee {feeLabel} · {event.registration_open ? "Open" : "Closed"}
      </p>

      <div className="wizard-steps" aria-label="Registration steps">
        {STEPS.map((label, i) => (
          <span key={label} className={i === step ? "active" : i < step ? "done" : ""}>
            {label}
          </span>
        ))}
      </div>

      {!event.registration_open && (
        <p className="state-error" role="alert">
          Registration is closed for this event.
        </p>
      )}

      {step === 1 && (
        <form className="profile-fields" onSubmit={saveProfile}>
          <p className="muted">Complete your participant profile before continuing.</p>
          {[
            ["full_name", "Full name"],
            ["phone", "Phone"],
            ["college_name", "College"],
            ["department", "Department"],
            ["year_of_study", "Year of study"],
            ["contact_email", "Contact email"],
          ].map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={`reg-${key}`}>{label}</label>
              <input
                id={`reg-${key}`}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required={key !== "contact_email"}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Continue"}
          </button>
        </form>
      )}

      {step === 2 && event.registration_open && (
        <div className="profile-fields">
          <p className="muted">Choose registration type supported by this event.</p>
          <div className="explorer-filters" role="group" aria-label="Registration type">
            {allowsSolo && (
              <button type="button" className={regType === "SOLO" ? "active" : ""} onClick={() => setRegType("SOLO")}>
                Solo
              </button>
            )}
            {allowsTeam && (
              <button type="button" className={regType === "TEAM" ? "active" : ""} onClick={() => setRegType("TEAM")}>
                Team
              </button>
            )}
          </div>
          {regType === "TEAM" && (
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
          )}
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || (regType === "TEAM" && !teamName.trim())}
            onClick={submitRegistration}
          >
            {busy ? "Submitting…" : "Submit registration"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="muted" style={{ marginBottom: 14 }}>
            Backend will create a Razorpay order. Success only after verification.
          </p>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={startPayment}>
            {busy ? "Processing…" : `Pay ${feeLabel}`}
          </button>
        </div>
      )}

      {step === 4 && registration && (
        <div>
          <p className="muted">
            Registration status: <strong>{registration.status}</strong>
            {registration.payment ? ` · Payment: ${registration.payment.status}` : ""}
          </p>
          {inviteCode && (
            <p className="muted">
              Invite teammates: <Link href={`/join/${inviteCode}`}>{inviteCode}</Link>
            </p>
          )}
          <div className="hero-cta" style={{ justifyContent: "flex-start", marginTop: 16 }}>
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard
            </Link>
            <Link href={`/events/${eventId}`} className="btn btn-ghost">
              Event
            </Link>
          </div>
        </div>
      )}

      {error && (
        <p className="state-error" role="alert" style={{ marginTop: 14 }}>
          {error}
        </p>
      )}
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
