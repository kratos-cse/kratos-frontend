import { createOrder, syncPayment, verifyPayment } from "@/lib/api/payments";
import { openRazorpayCheckout } from "@/components/registration/PaymentCheckout";

/** @typedef {'preparing' | 'confirming' | 'finalizing'} PaymentStage */

export function paymentStageLabel(stage) {
  switch (stage) {
    case "preparing":
      return "Preparing secure payment…";
    case "confirming":
      return "Confirming your payment…";
    case "finalizing":
      return "Finalizing your registration…";
    default:
      return null;
  }
}

/**
 * Create order → Razorpay → verify → optional sync.
 * @param {object} params
 * @param {() => void} params.onStage - (stage: PaymentStage | null) => void
 */
export async function executePaidCheckout({
  orderParams,
  razorpayOptions,
  onStage,
  onAfterVerify,
}) {
  onStage?.("preparing");
  const order = await createOrder(orderParams);
  onStage?.(null);

  let verifyInFlight = false;

  await openRazorpayCheckout({
    ...razorpayOptions,
    orderId: order.razorpayOrderId,
    keyId: order.razorpayKeyId,
    amountPaise: order.amountPaise,
    currency: order.currency,
    onSuccess: async (response) => {
      if (verifyInFlight) return;
      verifyInFlight = true;
      try {
        onStage?.("confirming");
        await verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        if (order.paymentId) {
          onStage?.("finalizing");
          try {
            await syncPayment(order.paymentId);
          } catch {
            /* verify may have already applied */
          }
        }
        await onAfterVerify?.({ order, response });
      } finally {
        verifyInFlight = false;
        onStage?.(null);
      }
    },
  });

  return order;
}
