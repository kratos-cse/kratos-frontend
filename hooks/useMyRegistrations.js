"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { listMyRegistrations } from "@/lib/api/registrations";
import { toUserMessage } from "@/lib/errors/userMessages";

export function useMyRegistrations() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setRegistrations([]);
      setLoading(false);
      setError(null);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listMyRegistrations();
      const list = Array.isArray(data) ? data : [];
      setRegistrations(list);
      return list;
    } catch (err) {
      setError(err);
      setRegistrations([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  return {
    registrations,
    loading: authLoading || loading,
    error,
    errorMessage: error ? toUserMessage(error) : null,
    refresh,
  };
}
