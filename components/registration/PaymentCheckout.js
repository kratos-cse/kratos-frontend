"use client";

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
