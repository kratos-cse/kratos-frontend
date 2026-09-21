"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { useAuth } from "@/context/AuthProvider";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { updateMyProfile } from "@/lib/api/profile";
import { getRegistrationQr, getRegistrationReceipt } from "@/lib/api/registrations";
import { isProfileComplete } from "@/lib/events/utils";

function DashboardInner() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile, user, setProfile, refresh } = useAuth();
  const { registrations, loading: regsLoading, error: regsError, reload } = useMyRegistrations();
  const [form, setForm] = useState({
    full_name: "",
    contact_email: "",
    phone: "",
    college_name: "",
    department: "",
    year_of_study: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?next=/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        contact_email: profile.contact_email || "",
        phone: profile.phone || "",
        college_name: profile.college_name || "",
        department: profile.department || "",
        year_of_study: profile.year_of_study || "",
      });
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    setActionError(null);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      setSaveMsg("Profile saved.");
      await refresh();
    } catch (err) {
      setActionError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleReceipt(regId) {
    setActionError(null);
    try {
      const receipt = await getRegistrationReceipt(regId);
      if (receipt?.pdf_url) window.open(receipt.pdf_url, "_blank", "noopener");
      else setActionError("Receipt URL not available yet");
    } catch (err) {
      setActionError(err.message || "Could not load receipt");
    }
  }

  async function handleQr(regId) {
    setActionError(null);
    try {
      const qr = await getRegistrationQr(regId);
      if (qr?.token) {
        alert(`QR token: ${qr.token}`);
      } else setActionError("QR not available yet");
    } catch (err) {
      setActionError(err.message || "Could not load QR");
    }
  }

  if (authLoading || !isAuthenticated) {
    return <p className="state-msg container">Loading dashboard…</p>;
  }

  return (
    <section>
      <div className="container dash-grid">
        <div className="dash-card">
          <h2 className="profile-title">Profile</h2>
          <p className="muted" style={{ marginBottom: 14 }}>
            Signed in as {user?.email}
            {!isProfileComplete(profile) && " — complete your profile before registering."}
          </p>
          <form className="profile-fields" onSubmit={handleSave}>
            {[
              ["full_name", "Full name"],
              ["contact_email", "Contact email"],
              ["phone", "Phone"],
              ["college_name", "College"],
              ["department", "Department"],
              ["year_of_study", "Year of study"],
            ].map(([key, label]) => (
              <div className="field" key={key}>
                <label htmlFor={`pf-${key}`}>{label}</label>
                <input
                  id={`pf-${key}`}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required={key !== "contact_email"}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
            {saveMsg && <p className="muted">{saveMsg}</p>}
          </form>
        </div>

        <div>
          <div className="dash-card" style={{ maxWidth: "none", marginBottom: 18 }}>
            <h2 className="profile-title">Registrations</h2>
            <button type="button" className="btn btn-ghost" onClick={reload} style={{ marginBottom: 14 }}>
              Refresh
            </button>
            {regsLoading && <p className="muted">Loading registrations…</p>}
            {regsError && (
              <p className="state-error" role="alert">
                {regsError.message}
              </p>
            )}
            {!regsLoading && registrations.length === 0 && (
              <p className="muted">
                No registrations yet. <Link href="/events">Browse events →</Link>
              </p>
            )}
            <div className="reg-list">
              {registrations.map((reg) => (
                <div key={reg.id} className="reg-item">
                  <h3>Registration</h3>
                  <p className="muted">
                    ID · {String(reg.id).slice(0, 8)}… · Status · {reg.status}
                    {reg.payment ? ` · Payment · ${reg.payment.status}` : ""}
                  </p>
                  {reg.team && (
                    <p className="muted">
                      Team · {reg.team.name} ({reg.team.status})
                    </p>
                  )}
                  <div className="reg-actions">
                    <Link href={`/events/${reg.event_id}`}>Event</Link>
                    <button type="button" onClick={() => handleReceipt(reg.id)}>
                      Receipt
                    </button>
                    <button type="button" onClick={() => handleQr(reg.id)}>
                      QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {actionError && (
              <p className="state-error" role="alert">
                {actionError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Participant Area</span>
            <h1>Dashboard</h1>
            <p>Profile, registrations, payment status, receipts, and QR — all from the backend.</p>
          </div>
        </section>
        <Suspense fallback={<p className="state-msg container">Loading…</p>}>
          <DashboardInner />
        </Suspense>
      </main>
      <KratosFooter />
    </div>
  );
}
