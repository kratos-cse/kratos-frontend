"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import { useAuth } from "@/context/AuthProvider";
import { useEvent } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { updateMyProfile } from "@/lib/api/profile";
import {
  isPaymentProcessing,
  isRegistrationConfirmed,
  toUserMessage,
} from "@/lib/errors/userMessages";
import { isProfileComplete } from "@/lib/events/utils";

function RegListItem({ reg, profileId }) {
  const { event } = useEvent(reg.event_id);
  const confirmed = isRegistrationConfirmed(reg);
  const processing = isPaymentProcessing(reg);
  const isLeader = reg.team && profileId ? reg.team.leader_profile_id === profileId : !reg.team;
  const role = reg.team ? (isLeader ? "Team Leader" : "Member") : "Solo";
  const statusLabel = confirmed ? "Registered" : processing ? "Payment confirming" : reg.status || "Pending";

  return (
    <div className="reg-item">
      <h3>{event?.name || "Registration"}</h3>
      <p className="muted">
        <span className={`status-pill ${confirmed ? "confirmed" : "pending"}`}>{statusLabel}</span>
        {reg.team ? ` · Team · ${reg.team.name}` : null} · {role}
      </p>
      <div className="reg-actions">
        <Link href={`/registrations/${reg.id}`}>View</Link>
        {processing ? <Link href={`/register/${reg.event_id}`}>Check payment</Link> : null}
      </div>
    </div>
  );
}

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
      const updated = await updateMyProfile({
        full_name: form.full_name,
        phone: form.phone,
        college_name: form.college_name,
        department: form.department,
        year_of_study: form.year_of_study,
        contact_email: form.contact_email || undefined,
      });
      setProfile(updated);
      setSaveMsg("Profile saved.");
      await refresh();
    } catch (err) {
      setActionError(toUserMessage(err, "Failed to save profile"));
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !isAuthenticated) {
    return <p className="state-msg container">Loading…</p>;
  }

  return (
    <section>
      <div className="container dash-grid">
        <div className="dash-card" id="profile">
          <h2 className="profile-title">My profile</h2>
          <p className="muted" style={{ marginBottom: 14 }}>
            Signed in as {user?.email}
            {!isProfileComplete(profile) && " — complete your profile before registering."}
          </p>
          <form className="profile-fields" onSubmit={handleSave}>
            <p className="muted" style={{ margin: 0 }}>
              Personal
            </p>
            <div className="field">
              <label htmlFor="pf-full_name">Name</label>
              <input
                id="pf-full_name"
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pf-email">Email</label>
              <input id="pf-email" value={user?.email || ""} readOnly />
            </div>
            <div className="field">
              <label htmlFor="pf-phone">Phone</label>
              <input
                id="pf-phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              Academic
            </p>
            <div className="field">
              <label htmlFor="pf-college_name">College</label>
              <input
                id="pf-college_name"
                value={form.college_name}
                onChange={(e) => setForm((f) => ({ ...f, college_name: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pf-department">Department</label>
              <input
                id="pf-department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pf-year_of_study">Year</label>
              <input
                id="pf-year_of_study"
                value={form.year_of_study}
                onChange={(e) => setForm((f) => ({ ...f, year_of_study: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saveMsg && <p className="muted">{saveMsg}</p>}
          </form>
        </div>

        <div>
          <div className="dash-card" style={{ maxWidth: "none", marginBottom: 18 }}>
            <h2 className="profile-title">My registrations</h2>
            <p className="muted" style={{ marginBottom: 14 }}>
              Open a registration for QR, receipt, WhatsApp, and team invites.
            </p>
            <button type="button" className="btn btn-ghost" onClick={reload} style={{ marginBottom: 14 }}>
              Refresh
            </button>
            {regsLoading && <p className="muted">Loading registrations…</p>}
            {regsError && (
              <StatusBanner tone="err" title="Couldn’t load registrations">
                {toUserMessage(regsError)}
              </StatusBanner>
            )}
            {!regsLoading && registrations.length === 0 && (
              <p className="muted">
                No registrations yet. <Link href="/events">Browse events →</Link>
              </p>
            )}
            <div className="reg-list">
              {registrations.map((reg) => (
                <RegListItem key={reg.id} reg={reg} profileId={profile?.id} />
              ))}
            </div>
            {actionError && (
              <StatusBanner tone="err" title="Something went wrong">
                {actionError}
              </StatusBanner>
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
            <span className="eyebrow">Participant</span>
            <h1>My registrations</h1>
            <p>Overview of your profile and event registrations.</p>
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
