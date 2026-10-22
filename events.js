import { apiFetch } from "./client";
import { dedupeRequest } from "./requestCache";
import { DEFAULT_EVENTS } from "@/data/defaultEvents";

export function listEvents() {
  return dedupeRequest("GET:/events:public", async () => {
    try {
      const data = await apiFetch("/events");
      if (Array.isArray(data) && data.length > 0) return data;
      return DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });
}

export function getEvent(eventId) {
  return dedupeRequest(`GET:/events/${eventId}:public`, async () => {
    try {
      return await apiFetch(`/events/${eventId}`);
    } catch {
      const found = DEFAULT_EVENTS.find((e) => String(e.id) === String(eventId));
      if (found) return found;
      throw new Error("Event not found");
    }
  });
}

/**
 * Entitled WhatsApp link — JWT required.
 * Backend: GET /events/{event_id}/whatsapp → { event_id, whatsapp_group_link }
 * Public event detail only exposes whatsapp_group_available (boolean).
 */
export function getEventWhatsapp(eventId) {
  return apiFetch(`/events/${eventId}/whatsapp`, { auth: true });
}

/** Public registration + team-member field config for an event. */
export function getRegistrationForm(eventId) {
  return apiFetch(`/events/${eventId}/registration-form`);
}
