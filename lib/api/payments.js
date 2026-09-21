import { apiFetch } from "./client";

export function createOrder({ eventId, paymentType, registrationId }) {
  return apiFetch("/payments/create-order", {
    method: "POST",
    auth: true,
    body: {
      event_id: eventId,
      payment_type: paymentType,
      ...(registrationId ? { registration_id: registrationId } : {}),
    },
  });
}

export function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  return apiFetch("/payments/verify", {
    method: "POST",
    auth: true,
    body: {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    },
  });
}

export function getPayment(paymentId) {
  return apiFetch(`/payments/${paymentId}`, { auth: true });
}
