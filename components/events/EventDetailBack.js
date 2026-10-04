"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./EventDetailBack.module.css";

export function EventDetailBack() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/events");
    }
  }, [router]);

  return (
    <button type="button" className={styles.back} onClick={handleBack} aria-label="Back to previous page">
      <span className={styles.icon} aria-hidden="true">←</span>
      <span>Back</span>
    </button>
  );
}
