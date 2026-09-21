"use client";

import { useCallback, useEffect, useState } from "react";
import { listMyRegistrations } from "@/lib/api/registrations";
import { useAuth } from "@/context/AuthProvider";

export function useMyRegistrations() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!isAuthenticated) {
      setRegistrations([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listMyRegistrations();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    reload();
  }, [authLoading, reload]);

  return { registrations, loading: authLoading || loading, error, reload };
}
