"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./HoldButton.module.css";

const HOLD_KEYS = new Set([" ", "Enter"]);

/**
 * Destructive action that fires only after a sustained press.
 * Assistive tech activates buttons with a synthetic click (detail === 0) and cannot hold,
 * so that path confirms immediately.
 */
export function HoldButton({
  onConfirm,
  holdMs = 2000,
  hint = "Press and hold to confirm",
  variant = "danger",
  disabled = false,
  loading = false,
  className = "",
  style,
  children,
  ...rest
}) {
  const hintId = useId();
  const timer = useRef(null);
  const [holding, setHolding] = useState(false);

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }, []);

  const start = useCallback(() => {
    if (disabled || loading || timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm?.();
    }, holdMs);
  }, [disabled, loading, holdMs, onConfirm]);

  useEffect(() => cancel, [cancel]);

  return (
    <>
      <Button
        {...rest}
        variant={variant}
        disabled={disabled}
        loading={loading}
        className={[styles.hold, holding ? styles.holding : "", className].filter(Boolean).join(" ")}
        style={{ "--hold-ms": `${holdMs}ms`, ...style }}
        aria-describedby={hintId}
        onPointerDown={(e) => {
          if (e.button === 0) start();
        }}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (!HOLD_KEYS.has(e.key)) return;
          e.preventDefault();
          if (!e.repeat) start();
        }}
        onKeyUp={(e) => {
          if (!HOLD_KEYS.has(e.key)) return;
          e.preventDefault();
          cancel();
        }}
        onBlur={cancel}
        onClick={(e) => {
          if (e.detail === 0) onConfirm?.();
        }}
      >
        <span className={styles.fill} aria-hidden />
        {children}
      </Button>
      <span id={hintId} className={styles.hint}>
        {hint}
      </span>
    </>
  );
}
