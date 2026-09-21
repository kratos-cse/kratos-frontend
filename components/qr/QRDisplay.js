"use client";

import { useCallback, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Renders a scannable QR from the backend token string.
 */
export default function QRDisplay({
  token,
  name,
  registrationLabel,
  helperText,
  size = 220,
}) {
  const canvasWrapRef = useRef(null);

  const downloadPng = useCallback(() => {
    const canvas = canvasWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `kratos26-qr-${String(registrationLabel || "pass").replace(/\s+/g, "-")}.png`;
    a.click();
  }, [registrationLabel]);

  if (!token) {
    return <p className="muted">QR not available yet.</p>;
  }

  return (
    <div className="qr-panel">
      <div ref={canvasWrapRef}>
        <QRCodeCanvas value={String(token)} size={size} level="M" includeMargin />
      </div>
      {name ? <p className="qr-name">{name}</p> : null}
      {registrationLabel ? <p className="qr-id">{registrationLabel}</p> : null}
      {helperText ? <p className="muted">{helperText}</p> : null}
      <button type="button" className="btn btn-ghost" onClick={downloadPng}>
        Download QR
      </button>
    </div>
  );
}
