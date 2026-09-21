"use client";

import { useEffect, useState } from "react";

/**
 * Loads Google Identity Services and renders a Sign in with Google button.
 * Client ID comes from server-only GOOGLE_CLIENT_ID via GET /api/config — no NEXT_PUBLIC_.
 */
export default function GoogleSignInButton({ onCredential, text = "signin_with", disabled }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let scriptEl = null;

    async function setup() {
      setError(null);
      setReady(false);

      let clientId;
      try {
        const res = await fetch("/api/config");
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error?.message || "GOOGLE_CLIENT_ID is not configured");
        }
        clientId = data.googleClientId;
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load auth config");
        return;
      }

      if (!clientId || cancelled) {
        if (!cancelled) setError("GOOGLE_CLIENT_ID is not configured");
        return;
      }

      function init() {
        if (cancelled || !window.google?.accounts?.id) return;
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
        if (!cancelled) setReady(true);
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

      scriptEl = document.createElement("script");
      scriptEl.src = "https://accounts.google.com/gsi/client";
      scriptEl.async = true;
      scriptEl.defer = true;
      scriptEl.dataset.googleGsi = "1";
      scriptEl.onload = init;
      scriptEl.onerror = () => {
        if (!cancelled) setError("Failed to load Google Sign-In");
      };
      document.head.appendChild(scriptEl);
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, [onCredential, text]);

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
