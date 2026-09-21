"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/context/AuthProvider";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const { isAuthenticated, loading, signInWithGoogleCredential } = useAuth();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace(next);
  }, [loading, isAuthenticated, next, router]);

  const onCredential = useCallback(
    async (idToken) => {
      setBusy(true);
      setError(null);
      try {
        await signInWithGoogleCredential(idToken);
        router.replace(next);
      } catch (err) {
        setError(err.message || "Sign-in failed");
      } finally {
        setBusy(false);
      }
    },
    [next, router, signInWithGoogleCredential]
  );

  return (
    <div className="auth-card">
      {loading ? (
        <p className="muted">Checking session…</p>
      ) : (
        <>
          <GoogleSignInButton onCredential={onCredential} disabled={busy} />
          {busy && <p className="muted">Verifying with KRATOS backend…</p>}
          {error && (
            <p className="state-error" role="alert">
              {error}
            </p>
          )}
          <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
            After sign-in you will return to <Link href={next}>{next}</Link>.
          </p>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Authentication</span>
            <h1>Sign in</h1>
            <p>Google Sign-In issues a KRATOS session via the backend. No fake success states.</p>
          </div>
        </section>
        <section>
          <div className="container">
            <Suspense fallback={<p className="state-msg">Loading…</p>}>
              <LoginInner />
            </Suspense>
          </div>
        </section>
      </main>
      <KratosFooter />
    </div>
  );
}
