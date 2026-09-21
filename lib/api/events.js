import { apiFetch } from "./client";

export function listEvents() {
  return apiFetch("/events");
}

export function getEvent(eventId) {
  return apiFetch(`/events/${eventId}`);
}
