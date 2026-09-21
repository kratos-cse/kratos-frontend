"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import ProfileConfirm, { getMissingProfileKeys } from "@/components/registration/ProfileConfirm";
import RegistrationPreview from "@/components/registration/RegistrationPreview";
import { useAuth } from "@/context/AuthProvider";
import { updateMyProfile } from "@/lib/api/profile";
import { getInvitation, joinInvitation } from "@/lib/api/teams";
import { listMyRegistrations } from "@/lib/api/registrations";
import { toUserMessage } from "@/lib/errors/userMessages";
import { isProfileComplete } from "@/lib/events/utils";

function JoinInner() {
  const params = useParams();
  const inviteCode = params?.inviteCode;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile, user, setProfile, refresh } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("invite"); // invite | profile | preview | done
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    college_name: "",
    department: "",
    year_of_study: "",
    contact_email: "",
  });

  const missingKeys = useMemo(() => getMissingProfileKeys(profile || form), [profile, form]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getInvitation(inviteCode);
        if (!cancelled) setInvite(data);
      } catch (err) {
        if (!cancelled) setError(toUserMessage(err, "Invitation not found"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

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
    }
  }, [profile]);

  async function beginJoin() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/join/${inviteCode}`)}`);
      return;
    }
    setError(null);
    if (!isProfileComplete(profile)) {
      setPhase("profile");
      return;
    }
    setPhase("preview");
  }

  async function saveProfile() {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateMyProfile(form);
      setProfile(updated);
      await refresh();
      setPhase("preview");
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirmJoin() {
    setBusy(true);
    setError(null);
    try {
      const data = await joinInvitation(inviteCode);
      let regId = data?.registration?.id || data?.registration_id || null;
      if (!regId && data?.team?.event_id) {
        try {
          const list = await listMyRegistrations();
          const match = (list || []).find((r) => String(r.event_id) === String(data.team.event_id));
          regId = match?.id || null;
        } catch {
          /* ignore */
        }
      }
      if (regId) {
        router.replace(`/registrations/${regId}`);
        return;
      }
      setPhase("done");
    } catch (err) {
      setError(toUserMessage(err, "Could not join team"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card" style={{ maxWidth: 560 }}>
      <h1>Team invite</h1>
      <p className="node-coord">INV · {inviteCode}</p>
      {loading && <p className="muted">Loading invitation…</p>}
      {authLoading && <p className="muted">Checking session…</p>}

      {invite && phase === "invite" && (
        <>
          <StatusBanner tone="info" title="You’ve been invited">
            {invite.leader_name || "A teammate"} invited you to join <strong>{invite.team_name}</strong>.
          </StatusBanner>
          <div className="confirm-list">
            <div className="row">
              <span>Event</span>
              <strong>{invite.event_name}</strong>
            </div>
            <div className="row">
              <span>Team</span>
              <strong>{invite.team_name}</strong>
            </div>
            <div className="row">
              <span>Leader</span>
              <strong>{invite.leader_name || "—"}</strong>
            </div>
            <div className="row">
              <span>Members</span>
              <strong>
                {invite.active_member_count}/{invite.team_max_size}
                {invite.is_full ? " · Full" : ""}
              </strong>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || invite.is_full || !invite.is_active}
            onClick={beginJoin}
          >
            {isAuthenticated ? "Continue" : "Sign in to join"}
          </button>
        </>
      )}

      {phase === "profile" && (
        <ProfileConfirm
          form={form}
          setForm={setForm}
          email={user?.email}
          missingKeys={missingKeys.length ? missingKeys : null}
          onSubmit={saveProfile}
          busy={busy}
          submitLabel="Continue"
        />
      )}

      {phase === "preview" && invite && (
        <RegistrationPreview
          rows={[
            ["Event", invite.event_name],
            ["Team", invite.team_name],
            ["Leader", invite.leader_name],
            ["Your name", profile?.full_name || form.full_name],
            ["Email", user?.email],
            ["College", profile?.college_name || form.college_name],
          ]}
          onEdit={() => setPhase("profile")}
          onConfirm={confirmJoin}
          busy={busy}
          confirmLabel="Join team"
        />
      )}

      {phase === "done" && (
        <StatusBanner tone="ok" title="You’re in">
          Joined {invite?.team_name}.{" "}
          <Link href="/dashboard">Go to My registrations →</Link>
        </StatusBanner>
      )}

      {error && (
        <StatusBanner tone="err" title="Couldn’t continue">
          {error}
        </StatusBanner>
      )}
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Teams</span>
            <h1>Accept invite</h1>
          </div>
        </section>
        <section>
          <div className="container">
            <Suspense fallback={<p className="state-msg">Loading…</p>}>
              <JoinInner />
            </Suspense>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
