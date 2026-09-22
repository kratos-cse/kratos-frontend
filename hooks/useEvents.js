"use client";

import { useCallback, useEffect, useState } from "react";
import { listEvents, getEvent } from "@/lib/api/events";
import { toUserMessage } from "@/lib/errors/userMessages";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
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
    refresh();
  }, [refresh]);

  return {
    events,
    loading,
    error,
    errorMessage: error ? toUserMessage(error) : null,
    refresh,
  };
}

export function useEvent(eventId) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(eventId));
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getEvent(eventId);
      setEvent(data);
    } catch (err) {
      setError(err);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    event,
    loading,
    error,
    errorMessage: error ? toUserMessage(error) : null,
    refresh,
  };
}
