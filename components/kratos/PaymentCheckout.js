"use client";

/**
 * Loads Razorpay Checkout and opens payment.
 * Near-zero decorative motion — payment is trust-critical.
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
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "1";
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

/**
 * @param {{
 *  keyId: string,
 *  orderId: string,
 *  amountPaise: number,
 *  currency?: string,
 *  name?: string,
 *  description?: string,
 *  prefill?: { name?: string, email?: string, contact?: string },
 *  onSuccess: (response: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }) => void,
 *  onDismiss?: () => void,
 * }} opts
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
      theme: { color: "#ff5a1f" },
      handler(response) {
        opts.onSuccess?.(response);
        resolve(response);
      },
      modal: {
        ondismiss() {
          opts.onDismiss?.();
          reject(new Error("Payment cancelled"));
        },
      },
    });
    rzp.open();
  });
}
