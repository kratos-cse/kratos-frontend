"use client";

import { PaymentCancelledError } from "@/lib/errors/checkoutErrors";

/**
 * Razorpay Checkout helpers.
 * Amount and key come from backend create-order response — never invent amounts.
 */
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Razorpay requires a browser"));
      return;
    }
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const existing = document.querySelector('script[data-razorpay="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", () =>
        reject(Object.assign(new Error("Failed to load Razorpay"), { code: "PAYMENT_GATEWAY_UNAVAILABLE" })),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "1";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () =>
      reject(Object.assign(new Error("Failed to load Razorpay"), { code: "PAYMENT_GATEWAY_UNAVAILABLE" }));
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay and resolves only after onSuccess (verify/finalize) completes.
 * Rejects with PaymentCancelledError when the participant closes the modal.
 */
export async function openRazorpayCheckout(opts) {
  const Razorpay = await loadRazorpayScript();
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: opts.keyId,
      amount: opts.amountPaise,
      currency: opts.currency || "INR",
      name: opts.name || "KRATOS'26",
      description: opts.description || "Event registration",
      order_id: opts.orderId,
      prefill: opts.prefill || {},
      theme: { color: "#c62828" },
      handler(response) {
        const run = async () => {
          try {
            if (opts.onSuccess) {
              await opts.onSuccess(response);
            }
            resolve(response);
          } catch (err) {
            reject(err);
          }
        };
        void run();
      },
      modal: {
        ondismiss() {
          opts.onDismiss?.();
          reject(new PaymentCancelledError());
        },
      },
    });
    rzp.on("payment.failed", (response) => {
      const reason =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment did not complete.";
      reject(Object.assign(new Error(reason), { code: "PAYMENT_FAILED" }));
    });
    rzp.open();
  });
}
