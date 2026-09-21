"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginWithGoogle, logout as apiLogout } from "@/lib/api/auth";
import { getStoredToken, setStoredToken } from "@/lib/api/client";

const AuthContext = createContext(null);

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
    setToken(null);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  const refresh = useCallback(async () => {
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
    try {
      await apiLogout();
    } catch {
      /* still clear local session */
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      profile,
      setProfile,
      isAdmin,
      loading,
      error,
      isAuthenticated: Boolean(token && user),
      refresh,
      signInWithGoogleCredential,
      signOut,
    }),
    [token, user, profile, isAdmin, loading, error, refresh, signInWithGoogleCredential, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
