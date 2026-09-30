import { getRegistrationReceiptAccess } from "./api/registrations";

/**
 * Request a short-lived receipt-scoped token and open the receipt URL in a new tab.
 * Never appends the session JWT to receipt URLs.
 */
export async function openRegistrationReceipt(registrationId, preferPdf = true) {
  const access = await getRegistrationReceiptAccess(registrationId);
  const url = preferPdf && access?.pdf_url ? access.pdf_url : access?.html_url;
  if (!url) {
    throw new Error("Receipt URL unavailable");
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

/** @deprecated Use openRegistrationReceipt — kept for call-site migration. */
export function withAuthToken(url) {
  return url;
}
