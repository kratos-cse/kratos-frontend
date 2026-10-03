"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import styles from "./ApplicationFlow.module.css";

const STORAGE_PPT = "kratos_ppt_submission";

export function PptUploadSection({ deadline = "14 Oct 2026, 11:59 PM", onStatusChange }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState("BEFORE_UPLOAD"); // BEFORE_UPLOAD | UPLOADING | SUCCESS | FAILURE
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [submittedPpt, setSubmittedPpt] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PPT);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSubmittedPpt(parsed);
        setStatus("SUCCESS");
        onStatusChange?.("SUCCESS");
      }
    } catch {
      /* ignore */
    }
  }, []);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file format (.pdf, .ppt, .pptx)
    const validExts = [".pdf", ".ppt", ".pptx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      setError("Invalid file type. Please upload a PDF, PPT, or PPTX presentation file.");
      setSelectedFile(null);
      return;
    }

    // Max 25MB check
    if (file.size > 25 * 1024 * 1024) {
      setError("File size exceeds 25MB limit. Please compress your presentation file.");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  }

  function triggerFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a presentation file to upload.");
      return;
    }

    setStatus("UPLOADING");
    setUploadProgress(10);
    setError(null);

    try {
      // Simulate progress over time
      for (let p = 25; p <= 90; p += 20) {
        await new Promise((r) => setTimeout(r, 250));
        setUploadProgress(p);
      }

      // 95% simulated success rate
      if (Math.random() < 0.05) {
        throw new Error("Upload connection interrupted. Please try uploading again.");
      }

      await new Promise((r) => setTimeout(r, 300));
      setUploadProgress(100);

      const pptData = {
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };

      localStorage.setItem(STORAGE_PPT, JSON.stringify(pptData));
      setSubmittedPpt(pptData);
      setStatus("SUCCESS");
      onStatusChange?.("SUCCESS");
    } catch (err) {
      setError(err.message || "Failed to upload PPT presentation.");
      setStatus("FAILURE");
      setUploadProgress(0);
    }
  }

  function handleResubmit() {
    if (window.confirm("Replace current PPT submission with a new presentation file?")) {
      setSelectedFile(null);
      setStatus("BEFORE_UPLOAD");
      setError(null);
    }
  }

  return (
    <div className={styles.container} style={{ marginTop: "24px" }}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.eyebrow}>Phase 2</span>
          <h2 className={styles.title}>PPT Presentation Submission</h2>
        </div>
        {status === "BEFORE_UPLOAD" ? (
          <Badge tone="muted">Pending Upload</Badge>
        ) : status === "UPLOADING" ? (
          <Badge tone="warn">Uploading {uploadProgress}%</Badge>
        ) : status === "SUCCESS" ? (
          <Badge tone="ok">PPT Submitted</Badge>
        ) : (
          <Badge tone="err">Upload Failed</Badge>
        )}
      </div>

      {/* Deadline display */}
      <div className={styles.deadlineStrip}>
        <span>⏳ Submission Deadline: <strong>{deadline}</strong></span>
      </div>

      {/* ERROR BANNER */}
      {error ? (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorIcon}>⚠️</span>
          <div style={{ flex: 1 }}>
            <strong>Upload Error</strong>
            <p>{error}</p>
          </div>
          {status === "FAILURE" ? (
            <Button size="sm" variant="secondary" onClick={handleUpload}>
              Retry Upload
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* BEFORE UPLOAD */}
      {status === "BEFORE_UPLOAD" ? (
        <div className={styles.uploadBox}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.ppt,.pptx"
            style={{ display: "none" }}
          />

          <div className={styles.dropZone} onClick={triggerFilePicker}>
            <span className={styles.uploadIcon}>📊</span>
            <h4>{selectedFile ? selectedFile.name : "Click to select PPT file"}</h4>
            <p>{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Supported formats: .pdf, .ppt, .pptx (Max 25MB)"}</p>
          </div>

          <div className={styles.buttonRow} style={{ marginTop: "16px" }}>
            <Button variant="secondary" onClick={triggerFilePicker}>
              {selectedFile ? "Change File" : "Select File"}
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
              Upload Presentation →
            </Button>
          </div>
        </div>
      ) : null}

      {/* UPLOADING */}
      {status === "UPLOADING" ? (
        <div className={styles.uploadingBox}>
          <p>Uploading <strong>{selectedFile?.name}</strong>...</p>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
          </div>
          <span className={styles.stepIndicator}>{uploadProgress}% complete</span>
        </div>
      ) : null}

      {/* SUCCESS / SUBMITTED */}
      {status === "SUCCESS" && submittedPpt ? (
        <div className={styles.submittedBox}>
          <div className={styles.submittedBanner}>
            <span className={styles.submittedIcon}>✓</span>
            <div style={{ flex: 1 }}>
              <h3>PPT Submitted Successfully</h3>
              <p>Uploaded on {submittedPpt.uploadedAt} · File: <strong>{submittedPpt.fileName}</strong> ({submittedPpt.fileSize})</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleResubmit}>
              Resubmit PPT
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
