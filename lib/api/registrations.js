import { apiFetch } from "./client";

export function createRegistration(eventId, payload) {
  return apiFetch(`/events/${eventId}/registrations`, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function getRegistration(registrationId) {
  return apiFetch(`/registrations/${registrationId}`, { auth: true });
}

export function listMyRegistrations() {
  return apiFetch("/users/me/registrations", { auth: true });
}

export function getRegistrationReceipt(registrationId) {
  return apiFetch(`/registrations/${registrationId}/receipt`, { auth: true });
}

export function getRegistrationReceiptAccess(registrationId) {
  return apiFetch(`/registrations/${registrationId}/receipt/access-token`, {
    method: "POST",
    auth: true,
  });
}

export function getRegistrationQr(registrationId) {
  return apiFetch(`/registrations/${registrationId}/qr`, { auth: true });
}

/**
 * Cancel unpaid registration — JWT required.
 * Backend: POST /registrations/{registration_id}/cancel → RegistrationOut
 */
export function cancelRegistration(registrationId) {
  return apiFetch(`/registrations/${registrationId}/cancel`, {
    method: "POST",
    auth: true,
  });
}
