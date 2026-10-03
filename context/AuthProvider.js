"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginWithGoogle, logout as apiLogout } from "@/lib/api/auth";
import { getStoredToken, setStoredToken } from "@/lib/api/client";

const AuthContext = createContext(null);
const DEMO_SESSION_KEY = "kratos_frontend_demo_session";

function getDemoSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setDemoSession(session) {
  if (typeof window === "undefined") return;
  try {
    if (session) window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    /* private mode */
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const applySession = useCallback((payload, accessToken) => {
    if (accessToken) {
      setStoredToken(accessToken);
      setToken(accessToken);
    }
    setUser(payload?.user ?? null);
    setProfile(payload?.profile ?? null);
    setIsAdmin(Boolean(payload?.is_admin ?? payload?.user?.is_admin_flagged));
  }, []);

  const clearSession = useCallback(() => {
    setStoredToken(null);
    setDemoSession(null);
    setToken(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  const refresh = useCallback(async () => {
    const demo = getDemoSession();
    if (demo?.user) {
      setToken(`demo:${demo.user.email}`);
      setUser(demo.user);
      setProfile(demo.profile ?? null);
      setIsAdmin(false);
      setLoading(false);
      return demo;
    }

    const stored = getStoredToken();
    if (!stored) {
      clearSession();
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const me = await fetchMe(stored);
      setToken(stored);
      applySession(me, stored);
      return me;
    } catch (err) {
      clearSession();
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startDemoSession = useCallback((email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = getDemoSession();
    const session = {
      user: {
        id: existing?.user?.id || `demo-${normalizedEmail}`,
        email: normalizedEmail,
      },
      profile: existing?.profile ?? null,
    };
    setDemoSession(session);
    setToken(`demo:${normalizedEmail}`);
    setUser(session.user);
    setProfile(session.profile);
    setIsAdmin(false);
    setError(null);
    setLoading(false);
    return session;
  }, []);

  const saveDemoProfile = useCallback((nextProfile) => {
    const demo = getDemoSession();
    if (!demo?.user) return;
    const next = { ...demo, profile: nextProfile };
    setDemoSession(next);
    setProfile(nextProfile);
  }, []);

  const signInWithGoogleCredential = useCallback(
    async (idToken) => {
      setError(null);
      const data = await loginWithGoogle(idToken);
      applySession(data, data.access_token);
      setLoading(false);
      return data;
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    setError(null);
    const demo = getDemoSession();
    if (!demo) {
      try {
        await apiLogout();
      } catch {
        /* still clear local session */
      }
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      setProfile,
      saveDemoProfile,
      isAdmin,
      loading,
      error,
      isAuthenticated: Boolean(token && user),
      refresh,
      startDemoSession,
      signInWithGoogleCredential,
      signOut,
    }),
    [
      token,
      user,
      profile,
      saveDemoProfile,
      isAdmin,
      loading,
      error,
      refresh,
      startDemoSession,
      signInWithGoogleCredential,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
