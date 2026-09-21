"use client";

import { useEffect, useState } from "react";

/**
 * Loads Google Identity Services and renders a Sign in with Google button.
 * Near-zero motion — auth is high-frequency / trust-critical.
 */
export default function GoogleSignInButton({ onCredential, text = "signin_with", disabled }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setError("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
      return;
    }

    function init() {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) onCredential?.(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      const el = document.getElementById("google-signin-btn");
      if (el) {
        el.innerHTML = "";
        window.google.accounts.id.renderButton(el, {
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          width: 280,
        });
      }
      setReady(true);
    }

    if (window.google?.accounts?.id) {
      init();
      return;
    }

    const existing = document.querySelector('script[data-google-gsi="1"]');
    if (existing) {
      existing.addEventListener("load", init);
      return () => existing.removeEventListener("load", init);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "1";
    script.onload = init;
    script.onerror = () => setError("Failed to load Google Sign-In");
    document.head.appendChild(script);
  }, [clientId, onCredential, text]);

  if (error) {
    return (
      <p className="auth-config-error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className={`google-signin-wrap${disabled ? " is-disabled" : ""}`} aria-busy={!ready}>
      <div id="google-signin-btn" />
      {!ready && <p className="muted">Loading Google Sign-In…</p>}
    </div>
  );
}
