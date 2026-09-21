"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import QRDisplay from "@/components/qr/QRDisplay";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import { useAuth } from "@/context/AuthProvider";
import { getRegistration, getRegistrationQr } from "@/lib/api/registrations";
import { toUserMessage } from "@/lib/errors/userMessages";

function QrInner() {
  const params = useParams();
  const regId = params?.id;
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, profile } = useAuth();
  const [token, setToken] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(`/registrations/${regId}/qr`)}`);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [reg, qr] = await Promise.all([getRegistration(regId), getRegistrationQr(regId)]);
        if (cancelled) return;
        setRegistration(reg);
        setToken(qr?.token || null);
      } catch (err) {
        if (!cancelled) setError(toUserMessage(err, "QR not available yet"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, regId, router]);

  const isLeader =
    registration?.team && profile?.id
      ? registration.team.leader_profile_id === profile.id
      : !registration?.team;

  if (authLoading || loading) return <p className="state-msg">Loading QR…</p>;
  if (error) {
    return (
      <StatusBanner tone="err" title="Couldn’t load QR">
        {error}
      </StatusBanner>
    );
  }

  return (
    <div className="reg-detail-card" style={{ textAlign: "center" }}>
      <p className="node-coord">YOUR KRATOS&apos;26 QR</p>
      <QRDisplay
        token={token}
        name={profile?.full_name}
        registrationLabel={`Registration · ${String(regId).slice(0, 8).toUpperCase()}`}
        helperText={
          isLeader && registration?.team
            ? "Your QR represents your team. Keep it ready for the event."
            : "Your QR is your individual event QR. Keep it ready for the event."
        }
      />
      <div className="action-row" style={{ justifyContent: "center" }}>
        <Link href={`/registrations/${regId}`} className="btn btn-ghost">
          Back to registration
        </Link>
      </div>
    </div>
  );
}

export default function RegistrationQrPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Check-in</span>
            <h1>Event QR</h1>
          </div>
        </section>
        <section>
          <div className="container" style={{ paddingBottom: 64 }}>
            <Suspense fallback={<p className="state-msg">Loading…</p>}>
              <QrInner />
            </Suspense>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
