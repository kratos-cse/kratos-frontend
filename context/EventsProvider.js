"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { listEvents } from "@/lib/api/events";
import { toUserMessage } from "@/lib/errors/userMessages";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await listEvents();
      const list = Array.isArray(data) ? data : [];
      setEvents(list);
      setLoaded(true);
      return list;
    } catch (err) {
      setError(err);
      setEvents([]);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      events,
      loading: loading && !loaded,
      error,
      errorMessage: error ? toUserMessage(error) : null,
      refresh,
    }),
    [events, loading, loaded, error, refresh]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEventsContext() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEventsContext must be used within EventsProvider");
  }
  return ctx;
}
