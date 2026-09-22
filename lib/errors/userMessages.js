/**
 * Map API errors to participant-friendly copy.
 * Prefer backend `error.code` when present.
 */

const CODE_MESSAGES = {
  CAPACITY_FULL: "This event has reached capacity.",
  ALREADY_REGISTERED: "You are already registered for this event.",
  REGISTRATION_CLOSED: "Registration for this event has closed.",
  REGISTRATION_NOT_OPEN: "Registration is not open yet.",
  EVENT_NOT_FOUND: "We couldn’t find that event.",
  EVENT_CLOSED: "This event is closed.",
  TEAM_FULL: "This team is already full.",
  TEAM_NOT_FOUND: "We couldn’t find that team.",
  UNAUTHORIZED: "Please sign in to continue.",
  FORBIDDEN: "You don’t have access to do that.",
  NOT_FOUND: "We couldn’t find what you were looking for.",
  PAYMENT_FAILED: "Payment didn’t go through. You can try again.",
  PAYMENT_REQUIRED: "Payment is required to complete this registration.",
  WHATSAPP_UNAVAILABLE: "WhatsApp group is not available for this event.",
  VALIDATION_ERROR: "Please check your details and try again.",
  NETWORK: "Network issue. Check your connection and try again.",
  INVITE_REVOKED: "This invitation is no longer valid.",
  ALREADY_MEMBER: "You are already a member of this team.",
};

const MESSAGE_RULES = [
  {
    test: /registration is not open|has closed|registration closed/i,
    message: "This registration has closed.",
  },
  {
    test: /team is full|reached its maximum|team full/i,
    message: "This team is already full. Ask your leader for another invite or join a different team.",
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
    message: "This invitation is not valid.",
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
  if (!errOrMessage) return fallback;

  const code = typeof errOrMessage === "object" ? errOrMessage.code : null;
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  const raw =
    typeof errOrMessage === "string"
      ? errOrMessage
      : errOrMessage?.message || errOrMessage?.code || "";

  if (!raw) return fallback;
  for (const rule of MESSAGE_RULES) {
    if (rule.test.test(raw)) return rule.message;
  }
  // Avoid leaking raw stack-like or JSON payloads
  if (raw.length > 180 || /traceback|sqlalchemy|psycopg|exception/i.test(raw)) {
    return fallback;
  }
  return raw;
}

export function isPaymentProcessing(registration) {
  if (!registration?.payment) return false;
  const status = String(registration.payment.status || "").toUpperCase();
  return ["CREATED"].includes(status);
}

export function isRegistrationConfirmed(registration) {
  if (!registration) return false;
  if (String(registration.status || "").toUpperCase() === "CONFIRMED") return true;
  if (String(registration.payment?.status || "").toUpperCase() === "PAID") return true;
  return false;
}

export function canRetryPayment(registration) {
  if (!registration) return true;
  if (isRegistrationConfirmed(registration)) return false;
  if (isPaymentProcessing(registration)) return false;
  const pay = registration.payment;
  if (!pay) return true;
  const status = String(pay.status || "").toUpperCase();
  return status === "FAILED" || status === "";
}
