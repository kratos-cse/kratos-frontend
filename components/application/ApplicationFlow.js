"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import styles from "./ApplicationFlow.module.css";

const DOMAINS = [
  "AI & Machine Learning",
  "FinTech & Payments",
  "Web3 & Cybersecurity",
  "HealthTech",
  "Sustainability",
  "Open Innovation",
];

const STORAGE_DRAFT = "kratos_app_draft";
const STORAGE_SUBMITTED = "kratos_app_submitted";

export function ApplicationFlow({ onStatusChange }) {
  const [status, setStatus] = useState("NOT_STARTED"); // NOT_STARTED | IN_PROGRESS | REVIEW | SUBMITTED | ERROR
  const [step, setStep] = useState(1); // 1: Overview, 2: Solution & Stack, 3: Review
  const [form, setForm] = useState({
    projectTitle: "",
    domain: "",
    problemStatement: "",
    solutionOverview: "",
    techStack: "",
    githubRepo: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Load existing draft or submission state
  useEffect(() => {
    try {
      const savedSubmission = localStorage.getItem(STORAGE_SUBMITTED);
      if (savedSubmission) {
        const parsed = JSON.parse(savedSubmission);
        setSubmittedData(parsed);
        setStatus("SUBMITTED");
        onStatusChange?.("SUBMITTED");
        return;
      }

      const savedDraft = localStorage.getItem(STORAGE_DRAFT);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setForm(parsed.form || form);
        setStep(parsed.step || 1);
        setStatus("IN_PROGRESS");
        onStatusChange?.("IN_PROGRESS");
      }
    } catch {
      /* ignore storage parse errors */
    }
  }, []);

  function setField(key, value) {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setError(null);
    // Preserve form data automatically
    try {
      localStorage.setItem(STORAGE_DRAFT, JSON.stringify({ form: nextForm, step }));
    } catch {
      /* ignore */
    }
  }

  function handleStart() {
    setStatus("IN_PROGRESS");
    setStep(1);
    onStatusChange?.("IN_PROGRESS");
  }

  function handleNextStep(e) {
    e.preventDefault();
    if (step === 1) {
      if (!form.projectTitle.trim() || !form.domain || !form.problemStatement.trim()) {
        setError("Please fill out all required fields in Step 1.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.solutionOverview.trim() || !form.techStack.trim()) {
        setError("Please fill out all required fields in Step 2.");
        return;
      }
      setStep(3);
      setStatus("REVIEW");
    }
    setError(null);
  }

  function handlePrevStep() {
    setError(null);
    if (step === 3 || status === "REVIEW") {
      setStatus("IN_PROGRESS");
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  }

  async function handleSubmitApplication() {
    setSubmitting(true);
    setError(null);

    try {
      // Simulate network request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 95% success rate simulation
          if (Math.random() < 0.05) {
            reject(new Error("Network timeout while submitting application. Please try again."));
          } else {
            resolve();
          }
        }, 1200);
      });

      const submission = {
        ...form,
        submittedAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        applicationId: `HTF-APP-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      localStorage.setItem(STORAGE_SUBMITTED, JSON.stringify(submission));
      localStorage.removeItem(STORAGE_DRAFT);

      setSubmittedData(submission);
      setStatus("SUBMITTED");
      onStatusChange?.("SUBMITTED");
    } catch (err) {
      setError(err.message || "Failed to submit application");
      setStatus("ERROR");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Phase 1</span>
          <h2 className={styles.title}>Project Application</h2>
        </div>
        {status === "NOT_STARTED" ? (
          <Badge tone="muted">Not Started</Badge>
        ) : status === "IN_PROGRESS" ? (
          <Badge tone="warn">In Progress ({step}/2)</Badge>
        ) : status === "REVIEW" ? (
          <Badge tone="info">Review & Submit</Badge>
        ) : status === "SUBMITTED" ? (
          <Badge tone="ok">Submitted</Badge>
        ) : (
          <Badge tone="err">Submission Error</Badge>
        )}
      </div>

      {/* ERROR STATE */}
      {error ? (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorIcon}>⚠️</span>
          <div style={{ flex: 1 }}>
            <strong>Application Error</strong>
            <p>{error}</p>
          </div>
          {status === "ERROR" ? (
            <Button size="sm" variant="secondary" onClick={handleSubmitApplication} loading={submitting}>
              Retry Submit
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* 1. NOT STARTED STATE */}
      {status === "NOT_STARTED" ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>Application Not Started</h3>
          <p>Provide your project title, domain, problem statement, and technical architecture to apply for Hack the Future 2.0.</p>
          <Button variant="primary" onClick={handleStart} className={styles.actionBtn}>
            Start Application →
          </Button>
        </div>
      ) : null}

      {/* 2. IN PROGRESS STATE */}
      {status === "IN_PROGRESS" ? (
        <form onSubmit={handleNextStep} className={styles.formStack}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: step === 1 ? "50%" : "100%" }} />
          </div>
          <span className={styles.stepIndicator}>Step {step} of 2</span>

          {step === 1 ? (
            <>
              <label className={styles.label}>
                <span>Project Title *</span>
                <input
                  type="text"
                  value={form.projectTitle}
                  onChange={(e) => setField("projectTitle", e.target.value)}
                  placeholder="e.g. HealthPulse AI"
                  required
                />
              </label>

              <label className={styles.label}>
                <span>Domain Track *</span>
                <select
                  value={form.domain}
                  onChange={(e) => setField("domain", e.target.value)}
                  required
                >
                  <option value="">Select a domain</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>

              <label className={styles.label}>
                <span>Problem Statement *</span>
                <textarea
                  rows={4}
                  value={form.problemStatement}
                  onChange={(e) => setField("problemStatement", e.target.value)}
                  placeholder="Describe the problem your project solves..."
                  required
                />
              </label>
            </>
          ) : (
            <>
              <label className={styles.label}>
                <span>Proposed Solution & Key Features *</span>
                <textarea
                  rows={4}
                  value={form.solutionOverview}
                  onChange={(e) => setField("solutionOverview", e.target.value)}
                  placeholder="Describe your solution, core workflow, and innovation..."
                  required
                />
              </label>

              <label className={styles.label}>
                <span>Tech Stack & Libraries *</span>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setField("techStack", e.target.value)}
                  placeholder="e.g. Next.js, Node.js, Python, OpenCV, PostgreSQL"
                  required
                />
              </label>

              <label className={styles.label}>
                <span>GitHub Repository / Code Link (Optional)</span>
                <input
                  type="url"
                  value={form.githubRepo}
                  onChange={(e) => setField("githubRepo", e.target.value)}
                  placeholder="https://github.com/your-team/project"
                />
              </label>
            </>
          )}

          <div className={styles.buttonRow}>
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={handlePrevStep}>
                ← Back
              </Button>
            ) : <div />}
            <Button type="submit" variant="primary">
              {step === 1 ? "Next: Technical Details →" : "Review Application →"}
            </Button>
          </div>
        </form>
      ) : null}

      {/* 3. REVIEW STATE */}
      {status === "REVIEW" ? (
        <div className={styles.reviewBox}>
          <div className={styles.reviewHeader}>
            <h3>Review Your Application</h3>
            <p>Please double-check your entries before submitting.</p>
          </div>

          <div className={styles.reviewGrid}>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Project Title</span>
              <span className={styles.reviewValue}>{form.projectTitle}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Domain Track</span>
              <span className={styles.reviewValue}>{form.domain}</span>
            </div>
            <div className={styles.reviewItem} style={{ gridColumn: "1 / -1" }}>
              <span className={styles.reviewLabel}>Problem Statement</span>
              <span className={styles.reviewValue}>{form.problemStatement}</span>
            </div>
            <div className={styles.reviewItem} style={{ gridColumn: "1 / -1" }}>
              <span className={styles.reviewLabel}>Proposed Solution</span>
              <span className={styles.reviewValue}>{form.solutionOverview}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Tech Stack</span>
              <span className={styles.reviewValue}>{form.techStack}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Repository Link</span>
              <span className={styles.reviewValue}>{form.githubRepo || "Not provided"}</span>
            </div>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: "24px" }}>
            <Button variant="outline" onClick={handlePrevStep} disabled={submitting}>
              ← Edit Details
            </Button>
            <Button variant="primary" onClick={handleSubmitApplication} loading={submitting}>
              Submit Application ✓
            </Button>
          </div>
        </div>
      ) : null}

      {/* 4. SUBMITTED SUCCESS STATE */}
      {status === "SUBMITTED" && submittedData ? (
        <div className={styles.submittedBox}>
          <div className={styles.submittedBanner}>
            <span className={styles.submittedIcon}>✓</span>
            <div>
              <h3>Application Submitted</h3>
              <p>Submitted on {submittedData.submittedAt} · App ID: <strong>{submittedData.applicationId}</strong></p>
            </div>
          </div>

          <div className={styles.reviewGrid} style={{ marginTop: "16px" }}>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Project Title</span>
              <span className={styles.reviewValue}>{submittedData.projectTitle}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Domain</span>
              <span className={styles.reviewValue}>{submittedData.domain}</span>
            </div>
            <div className={styles.reviewItem} style={{ gridColumn: "1 / -1" }}>
              <span className={styles.reviewLabel}>Problem Statement</span>
              <span className={styles.reviewValue}>{submittedData.problemStatement}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
