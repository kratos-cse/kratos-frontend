const TOKEN_KEY = "kratos_access_token";

/**
 * Browser calls same-origin `/api/v1/*`, which Next rewrites to API_BASE_URL.
 * Do not use NEXT_PUBLIC_ for the backend host — that would expose it unnecessarily.
 */
export function getApiBase() {
  return "";
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

export class ApiError extends Error {
  constructor({ status, code, message, body }) {
    super(message || code || `Request failed (${status})`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

/**
 * @param {string} path - path under /api/v1 (e.g. `/events` or `events`)
 * @param {{ method?: string, body?: unknown, token?: string|null, auth?: boolean }} [options]
 */
export async function apiFetch(path, options = {}) {
  const { method = "GET", body, token, auth = false } = options;

  const url = path.startsWith("http")
    ? path
    : `/api/v1${path.startsWith("/") ? path : `/${path}`}`;

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const bearer = token !== undefined ? token : auth ? getStoredToken() : null;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: method === "GET" ? "no-store" : "default",
    });
  } catch (err) {
    throw new ApiError({
      status: 0,
      code: "NETWORK",
      message: err?.message || "Network request failed",
    });
  }

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const errObj = data?.error;
    const message =
      (typeof errObj === "object" && errObj?.message) ||
      (typeof data?.detail === "string" ? data.detail : null) ||
      (Array.isArray(data?.detail) ? data.detail.map((d) => d.msg || d).join(", ") : null) ||
      res.statusText ||
      "Request failed";
    const code = (typeof errObj === "object" && errObj?.code) || `HTTP_${res.status}`;
    throw new ApiError({ status: res.status, code, message, body: data });
  }

  return data;
}
