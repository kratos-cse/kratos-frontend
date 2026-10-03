"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import styles from "./JourneyTracker.module.css";

const JOURNEY_STEPS = [
  { id: 1, label: "Profile", stepKey: "PROFILE" },
  { id: 2, label: "Team", stepKey: "TEAM" },
  { id: 3, label: "Application", stepKey: "APPLICATION" },
  { id: 4, label: "PPT Upload", stepKey: "PPT" },
  { id: 5, label: "Screening", stepKey: "SCREENING" },
  { id: 6, label: "Payment", stepKey: "PAYMENT" },
  { id: 7, label: "Pass & QR", stepKey: "PASS" },
];

export function JourneyTracker({
  profileComplete,
  teamCreated,
  appSubmitted,
  pptSubmitted,
  screeningStatus, // 'UNDER_SCREENING' | 'SHORTLISTED' | 'NOT_SHORTLISTED'
  paymentComplete,
  activeStep,
  onSelectStep,
}) {
  // Determine highest completed/recommended step
  let recommendedStep = 1;
  let nextAction = {
    title: "Complete Your Profile",
    desc: "Fill in your participant details to unlock team creation.",
    label: "Complete Profile →",
    stepId: 1,
    icon: "",
  };

  if (!profileComplete) {
    recommendedStep = 1;
    nextAction = {
      title: "Complete Your Profile",
      desc: "Fill in your participant details to unlock team registration.",
      label: "Complete Profile →",
      stepId: 1,
      icon: "",
    };
  } else if (!teamCreated) {
    recommendedStep = 2;
    nextAction = {
      title: "Register Your Team",
      desc: "Create a team of 3–4 members to unlock project application.",
      label: "Register Team →",
      stepId: 2,
      icon: "",
    };
  } else if (!appSubmitted) {
    recommendedStep = 3;
    nextAction = {
      title: "Complete Project Application",
      desc: "Submit your project title, domain track, and technical architecture.",
      label: "Start Application →",
      stepId: 3,
      icon: "",
    };
  } else if (!pptSubmitted) {
    recommendedStep = 4;
    nextAction = {
      title: "Upload PPT Presentation",
      desc: "Upload your slide presentation (.pdf, .ppt, .pptx) before the deadline.",
      label: "Upload PPT →",
      stepId: 4,
      icon: "",
    };
  } else if (screeningStatus === "UNDER_SCREENING") {
    recommendedStep = 5;
    nextAction = {
      title: "Under Screening Review",
      desc: "Your application and PPT are being reviewed by the screening panel.",
      label: "View Screening Status",
      stepId: 5,
      icon: "",
    };
  } else if (screeningStatus === "SHORTLISTED" && !paymentComplete) {
    recommendedStep = 6;
    nextAction = {
      title: "Complete Registration Payment",
      desc: "Congratulations! Your team is shortlisted. Pay ₹1000 fee to confirm participation.",
      label: "Pay & Confirm →",
      stepId: 6,
      icon: "",
    };
  } else if (paymentComplete || (screeningStatus === "SHORTLISTED" && paymentComplete)) {
    recommendedStep = 7;
    nextAction = {
      title: "Participation Confirmed!",
      desc: "Your spot is secured! View your official HTF Participant Pass & QR Code.",
      label: "View Pass & QR →",
      stepId: 7,
      icon: "",
    };
  }

  const displayedStep = activeStep || recommendedStep;

  return (
    <div className={styles.journeyBanner}>
      <div className={styles.bannerTop}>
        <div className={styles.badgeGroup}>
          <Badge tone="brand">Participant Journey</Badge>
          <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
            Step {displayedStep} of {JOURNEY_STEPS.length}
          </span>
        </div>
        <h2 className={styles.journeyTitle}>Hack the Future 2.0 Control Center</h2>
      </div>

      {/* Stepper progress bar with interactive step buttons */}
      <div className={styles.stepperRow}>
        {JOURNEY_STEPS.map((step, idx) => {
          const isDone = step.id < recommendedStep;
          const isActive = step.id === displayedStep;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => onSelectStep?.(step.id)}
                className={`${styles.stepItem} ${isDone ? styles.stepDone : ""} ${
                  isActive ? styles.stepActive : ""
                }`}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div className={styles.stepCircle}>{isDone ? "✓" : step.id}</div>
                <span className={styles.stepLabel}>{step.label}</span>
              </button>
              {idx < JOURNEY_STEPS.length - 1 ? (
                <div className={`${styles.stepLine} ${isDone ? styles.stepDoneLine : ""}`} />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Guided Next Action Box */}
      <div className={styles.nextActionBox}>
        <div className={styles.nextActionText}>
          {nextAction.icon ? <span className={styles.nextActionIcon}>{nextAction.icon}</span> : null}
          <div>
            <h3 className={styles.nextActionTitle}>{nextAction.title}</h3>
            <p className={styles.nextActionDesc}>{nextAction.desc}</p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => onSelectStep?.(nextAction.stepId)}
        >
          {nextAction.label}
        </Button>
      </div>
    </div>
  );
}
