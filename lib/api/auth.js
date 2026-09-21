import { apiFetch, setStoredToken } from "./client";

export async function loginWithGoogle(idToken) {
  const data = await apiFetch("/auth/google", {
    method: "POST",
    body: { id_token: idToken },
  });
  if (data?.access_token) setStoredToken(data.access_token);
  return data;
}

export async function fetchMe(token) {
  return apiFetch("/auth/me", { auth: true, token });
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST", auth: true });
  } finally {
    setStoredToken(null);
  }
}
