import { ApiError } from "@/lib/api/client";

/**
 * Normalize API, network, timeout, and checkout errors for toUserMessage().
 * @returns {{ status: number, code: string, message: string, body?: unknown }}
 */
export function normalizeApiError(err) {
  if (!err) {
    return { status: 0, code: "UNKNOWN", message: "" };
  }
  if (err instanceof ApiError) {
    return {
      status: err.status ?? 0,
      code: err.code || `HTTP_${err.status || 0}`,
      message: err.message || "Request failed",
      body: err.body,
    };
  }
  if (typeof err === "string") {
    return { status: 0, code: "UNKNOWN", message: err };
  }
  const code = err.code || err.name || "UNKNOWN";
  const message = err.message || String(err);
  const status = typeof err.status === "number" ? err.status : 0;
  return { status, code, message, body: err.body };
}
