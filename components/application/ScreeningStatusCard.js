"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import styles from "./ApplicationFlow.module.css";

const STORAGE_SCREENING = "kratos_screening_status";

export function ScreeningStatusCard({ applicationStatus, pptStatus }) {
  const [screeningStatus, setScreeningStatus] = useState("UNDER_SCREENING"); // UNDER_SCREENING | SHORTLISTED | NOT_SHORTLISTED
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const previousPptStatus = useRef(pptStatus);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SCREENING);
      if (saved) {
        setScreeningStatus(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const wasPptSubmitted = previousPptStatus.current === "SUCCESS";
    if (!wasPptSubmitted && pptStatus === "SUCCESS") {
      try {
        const saved = localStorage.getItem(STORAGE_SCREENING);
        if (saved === "SHORTLISTED" || saved === "NOT_SHORTLISTED") {
          setShowOutcomeModal(true);
        }
      } catch {
        /* ignore */
      }
    }
    previousPptStatus.current = pptStatus;
  }, [pptStatus]);

  const appDone = applicationStatus === "SUBMITTED" || typeof window !== "undefined" && Boolean(localStorage.getItem("kratos_app_submitted"));
  const pptDone = pptStatus === "SUCCESS" || typeof window !== "undefined" && Boolean(localStorage.getItem("kratos_ppt_submission"));

  // Only display screening status if application or PPT submission process has started
  if (!appDone && !pptDone) {
    return (
      <div className={styles.container} style={{ marginTop: "24px" }}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.eyebrow}>Phase 3</span>
            <h2 className={styles.title}>Screening Status</h2>
          </div>
          <Badge tone="muted">Awaiting Submissions</Badge>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>STATUS</div>
          <h3>Screening Pending Submissions</h3>
          <p>Complete your Project Application and PPT Presentation Submission to enter the PPT screening process.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ marginTop: "24px" }}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Phase 3</span>
          <h2 className={styles.title}>Screening & Shortlist Status</h2>
        </div>
        {screeningStatus === "UNDER_SCREENING" ? (
          <Badge tone="warn">Under Screening</Badge>
        ) : screeningStatus === "SHORTLISTED" ? (
          <Badge tone="ok">Shortlisted</Badge>
        ) : (
          <Badge tone="muted">Not Shortlisted</Badge>
        )}
      </div>

      <div className={styles.screeningBox}>
        {screeningStatus === "UNDER_SCREENING" ? (
          <div className={styles.screeningContent}>
            <div className={styles.screeningIconGroup} style={{ background: "rgba(255, 184, 0, 0.12)", color: "#ffb800" }}>
              IN REVIEW
            </div>
            <div>
              <h3>Application Under Screening</h3>
              <p>
                Your application and PPT presentation are currently being evaluated by the Hack the Future 2.0 screening committee.
                Shortlisted teams will receive further instructions for the 24-hour offline finals.
              </p>
            </div>
          </div>
        ) : null}

        {screeningStatus === "SHORTLISTED" ? (
          <div className={styles.screeningContent}>
            <div className={styles.screeningIconGroup} style={{ background: "rgba(0, 229, 255, 0.15)", color: "#00e5ff" }}>
              PASS
            </div>
            <div>
              <h3 style={{ color: "#00e5ff" }}>Congratulations! Team Shortlisted</h3>
              <p>
                Your team has been selected for the finals at Easwari Engineering College. Scan the payment QR and pay ₹1,000 per team to confirm your participation.
              </p>
            </div>
          </div>
        ) : null}

        {screeningStatus === "NOT_SHORTLISTED" ? (
          <div className={styles.screeningContent}>
            <div className={styles.screeningIconGroup} style={{ background: "rgba(255, 255, 255, 0.08)", color: "var(--text-dim)" }}>
              INFO
            </div>
            <div>
              <h3>Not Shortlisted</h3>
              <p>
                You were not selected for the finals. Thanks for participating in Hack to the Future.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={showOutcomeModal}
        onClose={() => setShowOutcomeModal(false)}
        title={screeningStatus === "SHORTLISTED" ? "Congratulations, Team!" : "Screening Result"}
        footer={
          <Button variant="primary" onClick={() => setShowOutcomeModal(false)}>
            {screeningStatus === "SHORTLISTED" ? "Continue" : "Close"}
          </Button>
        }
      >
        {screeningStatus === "SHORTLISTED" ? (
          <div className={styles.outcomeModalContent}>
            <div className={styles.outcomeEmoji}>CONFIRMED</div>
            <h3 className={styles.outcomeTitle}>Your team has been selected for the finals!</h3>
            <p className={styles.outcomeText}>
              Congratulations on making it through the PPT screening round. The Hack to the Future finals will happen at <strong>Easwari Engineering College</strong>.
            </p>
            <div className={styles.qrPlaceholder} aria-label="Dummy payment QR placeholder">
              <span>QR</span>
              <small>PAYMENT QR</small>
            </div>
            <p className={styles.paymentInstruction}>
              Scan the QR and pay <strong>₹1,000 per team</strong> to confirm your participation in the finals.
            </p>
            <p className={styles.demoNote}>Payment QR shown here is a placeholder for the frontend demo.</p>
          </div>
        ) : (
          <div className={styles.outcomeModalContent}>
            <div className={styles.outcomeEmoji}>THANK YOU</div>
            <h3 className={styles.outcomeTitle}>Thank you for participating</h3>
            <p className={styles.outcomeText}>
              You were not selected for the finals. Thanks for participating in <strong>Hack to the Future</strong>.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
