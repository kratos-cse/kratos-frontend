import { apiFetch } from "./client";

export function listEvents() {
  return apiFetch("/events");
}

export function getEvent(eventId) {
  return apiFetch(`/events/${eventId}`);
}

/**
 * Entitled WhatsApp link — JWT required.
 * Backend: GET /events/{event_id}/whatsapp → { event_id, whatsapp_group_link }
 * Public event detail only exposes whatsapp_group_available (boolean).
 */
export function getEventWhatsapp(eventId) {
  return apiFetch(`/events/${eventId}/whatsapp`, { auth: true });
}
