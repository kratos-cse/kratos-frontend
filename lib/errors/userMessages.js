/**
 * Map API / network messages to actionable participant copy.
 */
const RULES = [
  {
    test: /registration is not open|has closed|registration closed/i,
    message: "This registration has closed.",
  },
  {
    test: /team is full|reached its maximum|team full/i,
    message: "This team is already full. Please contact the team leader who sent you this invitation.",
  },
  {
    test: /already registered|already have a registration/i,
    message: "You are already registered for this event.",
  },
  {
    test: /already a member|already member/i,
    message: "You are already a member of this team.",
  },
  {
    test: /must be paid before|payment required|team must be paid/i,
    message: "This team isn’t ready for members yet. Ask your leader to finish payment first.",
  },
  {
    test: /invitation|invite.*(invalid|revoked|not found)/i,
    message: "This invitation is not valid for this event.",
  },
  {
    test: /capacity|reached capacity/i,
    message: "This event has reached capacity.",
  },
  {
    test: /payment.*(verif|confirm|pending)|still confirming/i,
    message: "Your payment is still being verified. You don’t need to pay again.",
  },
  {
    test: /payment cancelled|cancelled/i,
    message: "Payment was cancelled. You can try again when you’re ready.",
  },
  {
    test: /network|failed to fetch/i,
    message: "Network issue. Check your connection and try again.",
  },
];

export function toUserMessage(errOrMessage, fallback = "Something went wrong. Please try again.") {
  const raw =
    typeof errOrMessage === "string"
      ? errOrMessage
      : errOrMessage?.message || errOrMessage?.code || "";
  if (!raw) return fallback;
  for (const rule of RULES) {
    if (rule.test.test(raw)) return rule.message;
  }
  return raw || fallback;
}

/** Payment / registration status helpers for recovery UI */
export function isPaymentProcessing(registration) {
  if (!registration) return false;
  const pay = registration.payment;
  if (!pay) return false;
  const status = String(pay.status || "").toUpperCase();
  return ["CREATED", "PENDING", "AUTHORIZED", "PROCESSING"].includes(status);
}

export function isRegistrationConfirmed(registration) {
  if (!registration) return false;
  const status = String(registration.status || "").toUpperCase();
  if (status === "CONFIRMED") return true;
  const pay = registration.payment;
  if (pay && String(pay.status || "").toUpperCase() === "PAID") return true;
  return false;
}

export function canRetryPayment(registration) {
  if (!registration) return true;
  if (isRegistrationConfirmed(registration)) return false;
  if (isPaymentProcessing(registration)) return false;
  const pay = registration.payment;
  if (!pay) return true;
  const status = String(pay.status || "").toUpperCase();
  return ["FAILED", "CANCELLED", "EXPIRED"].includes(status) || status === "";
}
