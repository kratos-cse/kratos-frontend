/** Razorpay modal dismissed — not a failed charge. */
export const PAYMENT_CANCELLED = "PAYMENT_CANCELLED";

export class PaymentCancelledError extends Error {
  constructor(message = "Payment was cancelled.") {
    super(message);
    this.name = "PaymentCancelledError";
    this.code = PAYMENT_CANCELLED;
  }
}

export function isPaymentCancelled(err) {
  const normalized = err?.code || err?.name;
  return normalized === PAYMENT_CANCELLED || normalized === "PaymentCancelledError";
}
