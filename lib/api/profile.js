import { apiFetch } from "./client";

export function getMyProfile() {
  return apiFetch("/users/me/profile", { auth: true });
}

export function updateMyProfile(payload) {
  return apiFetch("/users/me/profile", { method: "PATCH", body: payload, auth: true });
}
