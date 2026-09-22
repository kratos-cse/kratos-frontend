"use client";

import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";

export default function useUserRegistrations() {
  const { user, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRegistrations([]);
      return;
    }

    setLoading(true);
    // TODO: Replace with actual API call.
    // fetch(`/api/registrations?userId=${user.id}`)
    //   .then((res) => res.json())
    //   .then((data) => setRegistrations(data))
    //   .finally(() => setLoading(false));
    setRegistrations([]);
    setLoading(false);
  }, [isAuthenticated, user]);

  const getStatus = (eventId) => {
    const registration = registrations.find((item) => (item.eventId ?? item.event_id) === eventId);
    return registration?.status || null;
  };

  return { registrations, loading, getStatus };
}
