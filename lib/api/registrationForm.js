import { apiFetch } from "./client";

export function getRegistrationForm(eventId) {
  return apiFetch(`/events/${eventId}/registration-form`);
}
