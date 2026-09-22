"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/context/AuthProvider";

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.23c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
      <path fill="#34A853" d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z" />
      <path fill="#FBBC05" d="M6.54 13.75a5.86 5.86 0 0 1 0-3.5V7.72H3.3a9.74 9.74 0 0 0 0 8.56l3.24-2.53Z" />
      <path fill="#EA4335" d="M12 6.22c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.3 14.63 2.33 12 2.33A9.74 9.74 0 0 0 3.3 7.72l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z" />
    </svg>
  );
}

function SignInInner() {
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
    <div className="signin-stage">
      <div className="signin-card">
        <img className="signin-lion" src="/assets/img/lion.png" alt="ACE lion mark" loading="lazy" />
        <h1>KRATOS&apos;26</h1>
        <p className="signin-subtitle">Sign in to your account</p>
        {loading ? (
          <p className="muted">Checking session...</p>
        ) : (
          <>
            <div className="signin-google">
              <GoogleMark />
              <GoogleSignInButton onCredential={onCredential} disabled={busy} />
            </div>
            {busy && <p className="muted">Verifying with KRATOS backend...</p>}
            {error && <p className="state-error" role="alert">{error}</p>}
          </>
        )}
        <p className="signin-terms">By signing in, you agree to the symposium terms.</p>
        <Link className="signin-back" href="/">Return home</Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="page-shell signin-shell">
      <KratosNav />
      <main>
        <img className="lion-watermark" src="/assets/img/lion.png" alt="" aria-hidden="true" />
        <Suspense fallback={<p className="state-msg">Loading...</p>}>
          <SignInInner />
        </Suspense>
      </main>
      <KratosFooter />
    </div>
  );
}
