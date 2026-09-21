"use client";

import StatusBanner from "@/components/kratos/ui/StatusBanner";

/**
 * Payment step with recovery: never show Pay while verifying/processing.
 */
export default function PaymentStatus({
  mode, // "ready" | "verifying" | "pending" | "failed"
  feeLabel,
  summaryRows = [],
  onPay,
  onCheckStatus,
  busy,
}) {
  if (mode === "verifying") {
    return (
      <StatusBanner tone="warn" title="Confirming your payment">
        Please don’t close this page. You don’t need to pay again.
      </StatusBanner>
    );
  }

  if (mode === "pending") {
    return (
      <div>
        <StatusBanner tone="warn" title="We’re still confirming your payment">
          You don’t need to pay again. Check status to refresh your registration.
        </StatusBanner>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={onCheckStatus}>
          {busy ? "Checking…" : "Check registration status"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="confirm-list">
        {summaryRows.map(([label, value]) => (
          <div className="row" key={label}>
            <span>{label}</span>
            <strong>{value || "—"}</strong>
          </div>
        ))}
        <div className="row">
          <span>Registration fee</span>
          <strong>{feeLabel}</strong>
        </div>
      </div>
      {mode === "failed" ? (
        <StatusBanner tone="err" title="Payment not completed">
          You can try paying again when you’re ready.
        </StatusBanner>
      ) : null}
      <button type="button" className="btn btn-primary" disabled={busy} onClick={onPay}>
        {busy ? "Opening Razorpay…" : `Pay with Razorpay · ${feeLabel}`}
      </button>
    </div>
  );
}
