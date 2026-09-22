"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { PageShell } from "@/components/layout/PageShell";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { getRegistrationQr } from "@/lib/api/registrations";
import { toUserMessage } from "@/lib/errors/userMessages";
import styles from "./qr.module.css";

function QrInner() {
  const params = useParams();
  const id = params?.id;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRegistrationQr(id);
        if (!cancelled) setToken(data?.token || null);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function downloadPng() {
    const canvas = document.getElementById("kratos-qr-canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `kratos26-qr-${id}.png`;
    a.click();
  }

  if (loading) return <PageSkeleton />;
  if (error || !token) {
    return (
      <ErrorState
        title="QR not available"
        description={toUserMessage(error, "QR is issued after successful payment.")}
        secondaryLabel="Back to registration"
        secondaryHref={`/registrations/${id}`}
      />
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className="page-title">Check-in QR</h1>
      <p className="page-lead">Show this code at the venue. Keep it private.</p>
      <Card className={styles.card}>
        <div className={styles.qrFrame}>
          <QRCodeCanvas id="kratos-qr-canvas" value={token} size={240} includeMargin level="M" />
        </div>
        <div className={styles.actions}>
          <Button type="button" onClick={downloadPng}>
            Download PNG
          </Button>
          <Button variant="ghost" href={`/registrations/${id}`}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function RegistrationQrPage() {
  return (
    <PageShell>
      <RequireAuth>
        <QrInner />
      </RequireAuth>
    </PageShell>
  );
}
