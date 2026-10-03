"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import styles from "./ParticipantDashboard.module.css";

export function ParticipantPassCard({ teamName, profileName, qrCodeUrl }) {
  const [passId, setPassId] = useState("");

  useEffect(() => {
    setPassId(`HTF26-PASS-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  const qrUrl =
    qrCodeUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      passId
    )}`;

  // Framer Motion 3D Mouse Tilt & Holographic Physics
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring inertia physics return to center
  const mouseX = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);

  // Dynamic Holographic Foil Shift coordinates
  const foilPos = useTransform(mouseX, [-0.5, 0.5], ["0% 0%", "100% 100%"]);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["20%", "80%"]);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className={`${styles.card} ${styles.fullWidth}`} style={{ marginTop: "24px" }}>
      <div>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            <span className={styles.cardSubtitle}>Event Access</span>
            <h2 className={styles.cardTitle}>Official Participant Pass & QR</h2>
          </div>
          <Badge tone="ok">Pass Active</Badge>
        </div>

        {/* ANNOUNCEMENTS TICKER */}
        <div
          className={styles.statusSummary}
          style={{ marginBottom: "20px", background: "rgba(176, 38, 255, 0.12)" }}
        >
          <span className={styles.statusIcon}>Info:</span>
          <div>
            <strong>Announcements:</strong> Offline finals reporting begins at{" "}
            <strong>8:00 AM on Oct 14, 2026</strong>. Carry your college ID card and show this pass QR code at entry.
          </div>
        </div>

        {/* 3D SCENE CONTAINER */}
        <div
          style={{
            perspective: "1200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              width: "100%",
              maxWidth: "680px",
              cursor: "grab",
            }}
          >
            {/* UNIFIED CANVAS WITH SVG CUTOUT MASK FOR PERFORATED NOTCHES */}
            <div
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #070412 0%, #160829 100%)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(176, 38, 255, 0.3)",
                overflow: "hidden",
                padding: "28px 32px",
                /* Radial gradient mask for semicircular notches top & bottom at 75% */
                maskImage:
                  "radial-gradient(circle 14px at 75% 0px, transparent 100%, black 100%), radial-gradient(circle 14px at 75% 100%, transparent 100%, black 100%)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "radial-gradient(circle 14px at 75% 0px, transparent 99%, black 100%), radial-gradient(circle 14px at 75% 100%, transparent 99%, black 100%)",
                WebkitMaskComposite: "source-in",
              }}
            >
              {/* ORGANIC ELECTRIC PURPLE FLUID WAVE */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "radial-gradient(circle at 30% 50%, rgba(176, 38, 255, 0.35) 0%, rgba(122, 31, 217, 0.15) 50%, transparent 80%)",
                  filter: "blur(40px)",
                }}
              />

              {/* FINE PRINT NOISE / GRAIN OVERLAY */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.15,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                }}
              >
                <filter id="noiseFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
              </svg>

              {/* HOLOGRAPHIC FOIL LAYER */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  opacity: 0.4,
                  mixBlendMode: "color-dodge",
                  background:
                    "linear-gradient(115deg, transparent 20%, rgba(255, 0, 150, 0.25) 40%, rgba(0, 255, 255, 0.3) 50%, rgba(255, 220, 0, 0.25) 60%, transparent 80%)",
                  backgroundSize: "200% 200%",
                  backgroundPosition: foilPos,
                }}
              />

              {/* SPECULAR GLARE LIGHT SPOT */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  mixBlendMode: "color-dodge",
                  background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
                }}
              />

              {/* DASHED PERFORATED CUT-OFF STUB LINE AT 75% */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: "75%",
                  borderRight: "2px dashed rgba(255, 255, 255, 0.25)",
                  pointerEvents: "none",
                }}
              />

              {/* SINGLE UNIFIED CANVAS CONTENT */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transform: "translateZ(30px)",
                  zIndex: 10,
                }}
              >
                {/* LEFT MAIN TICKET BODY */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "68%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                        fontSize: "20px",
                        fontWeight: "900",
                        letterSpacing: "3px",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        textShadow: "0 0 12px rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      ADMIT ONE
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--neon-cyan)",
                        fontWeight: "700",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      HACK THE FUTURE 2.0
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "26px",
                      fontWeight: "700",
                      color: "#ffffff",
                      fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif",
                    }}
                  >
                    {profileName || "Participant"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "#e2d5f8" }}>
                    Team: <strong>{teamName || "Registered Team"}</strong>
                  </p>

                  <div className={styles.detailsList} style={{ marginTop: "10px" }}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>SERIAL NO.</span>
                      <span
                        className={styles.detailValue}
                        style={{ color: "var(--neon-cyan)", fontFamily: "monospace", fontWeight: "700" }}
                      >
                        {passId}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>EVENT DATES</span>
                      <span className={styles.detailValue}>14 – 15 Oct 2026 (24 Hrs)</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>VENUE</span>
                      <span className={styles.detailValue}>Easwari Engg. College, CSE Dept</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT TEAR-OFF STUB (QR CODE & SERIAL) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "22%",
                    gap: "8px",
                  }}
                >
                  <img
                    src={qrUrl}
                    alt="Participant Pass QR"
                    width={105}
                    height={105}
                    style={{
                      display: "block",
                      borderRadius: "8px",
                      background: "#ffffff",
                      padding: "5px",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: "var(--text-dim)",
                      letterSpacing: "1px",
                      textAlign: "center",
                    }}
                  >
                    ENTRY SCAN
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className={styles.cardFooter} style={{ justifyContent: "space-between", marginTop: "16px" }}>
        <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
          Easwari Engineering College · Dept of CSE
        </span>
        <Button variant="secondary" size="sm" onClick={() => window.print?.()}>
          Print Pass
        </Button>
      </div>
    </div>
  );
}
