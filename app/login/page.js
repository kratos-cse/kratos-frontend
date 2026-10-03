"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import styles from "./login.module.css";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { isAuthenticated, loading, startDemoSession } = useAuth();
  const [mode, setMode] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/profile");
  }, [loading, isAuthenticated, router]);

  function submit(e) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    startDemoSession(cleanEmail);
    router.replace(next && next.startsWith("/") ? next : "/profile");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="auth-title">
        <Image src="/kratos26.png" alt="KRATOS'26" width={220} height={56} className={styles.logo} priority />

        <div>
          <p className={styles.eyebrow}>Participant Portal</p>
          <h1 id="auth-title">{mode === "login" ? "Sign in" : "Create account"}</h1>
          <p className={styles.lead}>
            {mode === "login" ? "Sign in to continue to your participant profile." : "Create your participant account to get started."}
          </p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Authentication">
          <button type="button" className={mode === "login" ? styles.tabActive : styles.tab} onClick={() => { setMode("login"); setError(""); }}>
            Sign in
          </button>
          <button type="button" className={mode === "register" ? styles.tabActive : styles.tab} onClick={() => { setMode("register"); setError(""); }}>
            Register
          </button>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
          </label>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <button className={styles.primaryButton} type="submit">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className={styles.note}>Frontend demo mode — no backend or real account is required.</p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
