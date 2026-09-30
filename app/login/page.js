"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/context/AuthProvider";
import { toUserMessage } from "@/lib/errors/userMessages";
import styles from "./login.module.css";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/events";
  const safeNext = next.startsWith("/") ? next : "/events";
  const { signInWithGoogleCredential, isAuthenticated, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(safeNext);
    }
  }, [loading, isAuthenticated, router, safeNext]);

  const onCredential = useCallback(
    async (idToken) => {
      await signInWithGoogleCredential(idToken);
      router.replace(safeNext);
    },
    [signInWithGoogleCredential, router, safeNext]
  );

  if (loading || isAuthenticated) {
    return <PageSkeleton />;
  }

  return (
    <div className={styles.wrap}>
      <Card className={styles.card}>
        <Image src="/kratos26.png" alt="KRATOS'26" width={220} height={56} className={styles.logo} />
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.lead}>Use your Google account to register for events and manage teams.</p>
        <GoogleSignInButton onCredential={onCredential} />
        {error ? <ErrorState title="Sign-in failed" description={toUserMessage(error)} /> : null}
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      <Suspense fallback={<PageSkeleton />}>
        <LoginInner />
      </Suspense>
    </PageShell>
  );
}
