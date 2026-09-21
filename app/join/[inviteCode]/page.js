"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { useAuth } from "@/context/AuthProvider";
import { getInvitation, joinInvitation } from "@/lib/api/teams";

function JoinInner() {
  const params = useParams();
  const inviteCode = params?.inviteCode;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getInvitation(inviteCode);
        if (!cancelled) setInvite(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Invitation not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inviteCode]);

  async function handleJoin() {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/join/${inviteCode}`)}`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const data = await joinInvitation(inviteCode);
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not join team");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Team invite</h1>
      <p className="node-coord">INV · {inviteCode}</p>
      {loading && <p className="muted">Loading invitation…</p>}
      {authLoading && <p className="muted">Checking session…</p>}
      {invite && !result && (
        <>
          <div className="detail-block">
            <h2>Team</h2>
            <p>
              <strong>{invite.team_name}</strong> — {invite.event_name}
            </p>
            <p className="muted">
              Leader · {invite.leader_name} · {invite.active_member_count}/{invite.team_max_size} members
              {invite.is_full ? " · Full" : ""}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || invite.is_full || !invite.is_active}
            onClick={handleJoin}
          >
            {busy ? "Joining…" : isAuthenticated ? "Join team" : "Sign in to join"}
          </button>
        </>
      )}
      {result && (
        <p className="muted">
          Joined <strong>{result.team?.name}</strong>. <Link href="/dashboard">Go to dashboard →</Link>
        </p>
      )}
      {error && (
        <p className="state-error" role="alert">
          {error}
        </p>
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
