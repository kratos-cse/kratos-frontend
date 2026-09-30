"use client";

import StatusMark from "@/components/micro/StatusMark/StatusMark";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./PaymentConfirmed.module.css";

/** Post-payment confirmation — explicit CONTINUE. StatusMark from React Bits. */
export function PaymentConfirmed({ title = "Payment confirmed", message, onContinue, continueLabel = "Continue" }) {
  return (
    <Card className={styles.wrap}>
      <div className={styles.head}>
        <StatusMark status="done" doneColor="#22c55e" size={28} />
        <div>
          <h2 className="page-title" style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h2>
          {message ? <p className="muted" style={{ margin: "0.35rem 0 0" }}>{message}</p> : null}
        </div>
      </div>
      <Button type="button" onClick={onContinue}>{continueLabel}</Button>
    </Card>
  );
}
