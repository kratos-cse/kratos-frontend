"use client";

import { useCallback, useEffect, useState } from "react";
import { listEvents, getEvent } from "@/lib/api/events";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { events, loading, error, reload };
}

export function useEvent(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvent(eventId);
        if (!cancelled) setEvent(data);
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setEvent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { event, loading, error };
}
