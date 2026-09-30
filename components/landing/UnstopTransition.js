"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./UnstopTransition.module.css";

const DURATION_MS = 1400;
const REDUCED_DURATION_MS = 300;

/**
 * Plays a full-screen "heading to Unstop" transition, then leaves the site.
 * Returns [overlay, go]: render `overlay` once, call `go(url)` to start.
 */
export function useUnstopTransition() {
  const [target, setTarget] = useState(null);

  // Coming back with the browser Back button restores the page from cache — clear the overlay.
  useEffect(() => {
    const reset = (e) => {
      if (e.persisted) setTarget(null);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => {
      window.location.href = target;
    }, reduced ? REDUCED_DURATION_MS : DURATION_MS);
    return () => clearTimeout(t);
  }, [target]);

  const go = useCallback((url) => setTarget(url), []);

  const overlay =
    target && typeof document !== "undefined"
      ? createPortal(
          <div className={styles.overlay} role="status" aria-live="assertive">
            <div className={styles.burst} aria-hidden />
            <div className={styles.content}>
              <Image src="/landing/hackathon.png" alt="" width={220} height={142} className={styles.art} priority />
              <p className={styles.kicker}>05 / INVENT</p>
              <p className={styles.title}>Entering the Hackathon</p>
              <p className={styles.sub}>Taking you to Unstop to register…</p>
              <div className={styles.bar} aria-hidden>
                <span style={{ animationDuration: `${DURATION_MS}ms` }} />
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return [overlay, go];
}

/** Anchor that plays the transition on a normal click; modified clicks (new tab etc.) behave natively. */
export function UnstopLink({ href, children, ...rest }) {
  const [overlay, go] = useUnstopTransition();

  function onClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(href);
  }

  return (
    <>
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
      {overlay}
    </>
  );
}
