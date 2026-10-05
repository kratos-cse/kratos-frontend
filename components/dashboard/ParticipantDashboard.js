"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { isProfileComplete } from "@/lib/events/utils";
import { getTeam, removeMember } from "@/lib/api/teams";
import { ApplicationFlow } from "@/components/application/ApplicationFlow";
import { PptUploadSection } from "@/components/application/PptUploadSection";
import { ScreeningStatusCard } from "@/components/application/ScreeningStatusCard";
import { JourneyTracker } from "@/components/dashboard/JourneyTracker";
import { ShortlistPaymentCard } from "@/components/dashboard/ShortlistPaymentCard";
import { ParticipantPassCard } from "@/components/dashboard/ParticipantPassCard";
import styles from "./ParticipantDashboard.module.css";

export function ParticipantDashboard({ onEditProfile }) {
  const { profile, user, loading: authLoading, error: authError, refresh: refreshAuth } = useAuth();

  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  // Application, PPT & Payment statuses
  const [appStatus, setAppStatus] = useState("NOT_STARTED");
  const [pptStatus, setPptStatus] = useState("BEFORE_UPLOAD");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Active step state (1 to 7) for step-by-step UI wizard
  const [activeStep, setActiveStep] = useState(1);

  // Load team data dynamically from localStorage or API
  const loadTeamData = useCallback(async () => {
    setTeamLoading(true);
    setTeamError(null);

    // 1. Check local storage demo team
    try {
      const saved = localStorage.getItem("kratos_frontend_demo_team");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeam(parsed);
        setTeamLoading(false);
        return;
      }
    } catch {
      /* ignore JSON parse errors */
    }

    // 2. Check if user profile has an active team_id to fetch from API
    if (profile?.team_id) {
      try {
        const teamData = await getTeam(profile.team_id);
        setTeam(teamData);
      } catch (err) {
        setTeamError(err.message || "Failed to load team data");
      } finally {
        setTeamLoading(false);
      }
      return;
    }

    setTeam(null);
    setTeamLoading(false);
  }, [profile?.team_id]);

  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  // Profile completion status checks
  const profileDone = isProfileComplete(profile);

  // Team status checks
  const memberList = team?.members || [];
  const minRequiredMembers = 3;
  const isTeamComplete = memberList.length >= minRequiredMembers;

  // Screening and payment status checks
  const isAppSubmitted = appStatus === "SUBMITTED" || (typeof window !== "undefined" && Boolean(localStorage.getItem("kratos_app_submitted")));
  const isPptUploaded = pptStatus === "SUCCESS" || (typeof window !== "undefined" && Boolean(localStorage.getItem("kratos_ppt_submission")));
  const savedScreening = typeof window !== "undefined" ? localStorage.getItem("kratos_screening_status") : null;
  const screeningStatus = savedScreening || (isAppSubmitted && isPptUploaded ? "UNDER_SCREENING" : "PENDING");

  // Calculate default recommended step dynamically based on completion state
  useEffect(() => {
    let rec = 1;
    if (!profileDone) rec = 1;
    else if (!team) rec = 2;
    else if (!isAppSubmitted) rec = 3;
    else if (!isPptUploaded) rec = 4;
    else if (screeningStatus === "PENDING" || screeningStatus === "UNDER_SCREENING") rec = 5;
    else if (screeningStatus === "SHORTLISTED" && !paymentConfirmed) rec = 6;
    else if (paymentConfirmed || screeningStatus === "SHORTLISTED") rec = 7;
    else rec = 5;
    
    setActiveStep(rec);
  }, [profileDone, team, isAppSubmitted, isPptUploaded, screeningStatus, paymentConfirmed]);

  // Copy invite link interaction
  function handleCopyInvite() {
    const link = team?.inviteLink || (team?.invite_code ? `https://htf.example/join/${team.invite_code}` : "");
    if (!link) return;
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Remove a single team member
  async function handleRemoveMember(target) {
    const targetName = typeof target === "string" ? target : target?.name || target?.full_name;
    const targetId = typeof target === "object" ? target?.id : null;

    if (!window.confirm(`Are you sure you want to remove ${targetName || "this member"} from the team?`)) {
      return;
    }

    setActionBusy(true);
    try {
      // Demo mode
      const saved = localStorage.getItem("kratos_frontend_demo_team");
      if (saved) {
        const parsed = JSON.parse(saved);
        const nextMembers = (parsed.members || []).filter((m) => {
          const mName = typeof m === "string" ? m : m.name || m.full_name;
          return mName !== targetName;
        });
        const updated = { ...parsed, members: nextMembers };
        localStorage.setItem("kratos_frontend_demo_team", JSON.stringify(updated));
        setTeam(updated);
        setActionBusy(false);
        return;
      }

      // API mode
      if (team?.id && targetId) {
        await removeMember(team.id, targetId);
        await loadTeamData();
      }
    } catch (err) {
      alert(err.message || "Failed to remove member");
    } finally {
      setActionBusy(false);
    }
  }

  // Delete / disband full team
  async function handleDeleteTeam() {
    if (!window.confirm("Are you sure you want to DELETE this team? All members will be removed and this cannot be undone.")) {
      return;
    }

    setActionBusy(true);
    try {
      // Demo mode
      localStorage.removeItem("kratos_frontend_demo_team");
      setTeam(null);
    } catch (err) {
      alert(err.message || "Failed to delete team");
    } finally {
      setActionBusy(false);
    }
  }

  const profileMissingFields = [];
  if (profile) {
    if (!profile.full_name) profileMissingFields.push("Full Name");
    if (!profile.phone) profileMissingFields.push("Phone");
    if (!profile.college_name && !profile.degree) profileMissingFields.push("College / Degree");
    if (!profile.year_of_study) profileMissingFields.push("Year of Study");
  } else {
    profileMissingFields.push("All details");
  }

  const isTeamIncomplete = memberList.length > 0 && memberList.length < minRequiredMembers;
  const inviteLink = team?.inviteLink || (team?.invite_code ? `https://htf.example/join/${team.invite_code}` : null);

  function handleJourneyAction(actionType) {
    if (actionType === "PROFILE") {
      setActiveStep(1);
    } else if (actionType === "TEAM") {
      setActiveStep(2);
    } else if (actionType === "APPLICATION") {
      setActiveStep(3);
    } else if (actionType === "PPT") {
      setActiveStep(4);
    } else if (actionType === "SCREENING") {
      setActiveStep(5);
    } else if (actionType === "PAYMENT") {
      setActiveStep(6);
    } else if (actionType === "PASS") {
      setActiveStep(7);
    }
  }

  return (
    <div className={styles.dashboardGrid}>
      {/* ================= GUIDED JOURNEY TRACKER & NEXT ACTION BANNER (ALWAYS AT TOP) ================= */}
      <JourneyTracker
        profileComplete={profileDone}
        teamCreated={Boolean(team)}
        appSubmitted={isAppSubmitted}
        pptSubmitted={isPptUploaded}
        screeningStatus={screeningStatus}
        paymentComplete={paymentConfirmed}
        onActionClick={handleJourneyAction}
        activeStep={activeStep}
        onSelectStep={(stepId) => setActiveStep(stepId)}
      />

      {/* ================= STEP 1: PROFILE STATUS CARD ================= */}
      {activeStep === 1 && (
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.cardSubtitle}>Step 1 of 7 • Participant Info</span>
                <h2 className={styles.cardTitle}>Profile Status</h2>
              </div>
              {authLoading ? (
                <Badge tone="muted">Loading</Badge>
              ) : authError ? (
                <Badge tone="err">Error</Badge>
              ) : profileDone ? (
                <Badge tone="ok">Complete</Badge>
              ) : (
                <Badge tone="warn">Incomplete</Badge>
              )}
            </div>

            <div className={styles.cardBody}>
              {authLoading ? (
                <div className={styles.loadingSkeleton}>
                  <div className={styles.skeletonBar} style={{ width: "60%" }} />
                  <div className={styles.skeletonBar} style={{ width: "80%" }} />
                </div>
              ) : authError ? (
                <div className={styles.statusSummary} style={{ borderColor: "rgba(255, 77, 109, 0.4)", color: "#ff8b9b" }}>
                  <span className={styles.statusIcon}>⚠️</span>
                  <span>Failed to load profile. Please try refreshing.</span>
                </div>
              ) : (
                <>
                  <div className={styles.statusSummary}>
                    <span className={styles.statusIcon}>{profileDone ? "✓" : "⚠️"}</span>
                    <span>
                      {profileDone
                        ? "All required profile details are complete."
                        : `Incomplete profile: Missing ${profileMissingFields.join(", ")}.`}
                    </span>
                  </div>

                  <div className={styles.detailsList}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Full Name</span>
                      <span className={styles.detailValue}>{profile?.full_name || user?.name || "Not provided"}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>{profile?.contact_email || user?.email || "Not provided"}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Phone</span>
                      <span className={styles.detailValue}>{profile?.phone || "Not provided"}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>College / Degree</span>
                      <span className={styles.detailValue}>{profile?.college_name || profile?.degree || "Not provided"}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Year of Study</span>
                      <span className={styles.detailValue}>{profile?.year_of_study || "Not provided"}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.cardFooter} style={{ justifyContent: "space-between" }}>
            {authError ? (
              <Button size="sm" variant="secondary" onClick={refreshAuth}>
                Retry Load
              </Button>
            ) : (
              <Button size="sm" variant={profileDone ? "outline" : "primary"} onClick={onEditProfile}>
                {profileDone ? "Edit Profile" : "Complete Profile →"}
              </Button>
            )}

            <Button size="sm" variant="primary" onClick={() => setActiveStep(2)}>
              Proceed to Step 2: Team Setup →
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: TEAM SETUP & ROSTER ================= */}
      {activeStep === 2 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                  <span className={styles.cardSubtitle}>Step 2 of 7 • Roster & Setup</span>
                  <h2 className={styles.cardTitle}>Team Status</h2>
                </div>
                {teamLoading ? (
                  <Badge tone="muted">Loading</Badge>
                ) : teamError ? (
                  <Badge tone="err">Error</Badge>
                ) : !team ? (
                  <Badge tone="muted">No Team Yet</Badge>
                ) : isTeamComplete ? (
                  <Badge tone="ok">Team Complete ({memberList.length}/4)</Badge>
                ) : (
                  <Badge tone="warn">Incomplete ({memberList.length}/3 Req)</Badge>
                )}
              </div>

              <div className={styles.cardBody}>
                {teamLoading ? (
                  <div className={styles.loadingSkeleton}>
                    <div className={styles.skeletonBar} style={{ width: "70%" }} />
                    <div className={styles.skeletonBar} style={{ width: "90%" }} />
                  </div>
                ) : teamError ? (
                  <div className={styles.statusSummary} style={{ borderColor: "rgba(255, 77, 109, 0.4)", color: "#ff8b9b" }}>
                    <span className={styles.statusIcon}>⚠️</span>
                    <span>{teamError}</span>
                  </div>
                ) : !team ? (
                  <div className={styles.emptyBox}>
                    <span className={styles.emptyTitle}>No Team Created</span>
                    <p className={styles.emptyDesc}>
                      You haven’t created or joined a team yet. Teams require at least 3–4 members to participate.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className={styles.statusSummary}>
                      <span className={styles.statusIcon}>{isTeamComplete ? "✓" : "ℹ️"}</span>
                      <span>
                        {isTeamComplete
                          ? `Team roster complete with ${memberList.length} members.`
                          : `Team incomplete: Need ${minRequiredMembers - memberList.length} more member(s) to reach minimum 3.`}
                      </span>
                    </div>

                    <div className={styles.memberList}>
                      {memberList.map((m, idx) => {
                        const name = typeof m === "string" ? m : m.name || m.full_name || "Member";
                        const isLeader = typeof m === "object" && (m.leader || m.role === "LEADER" || idx === 0);
                        const canRemove = !isLeader;
                        return (
                          <div key={name + idx} className={styles.memberItem}>
                            <div className={styles.memberNameGroup}>
                              <div className={styles.memberAvatar}>{name.charAt(0).toUpperCase()}</div>
                              <span className={styles.memberName}>{name}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {isLeader ? <Badge tone="brand">Leader</Badge> : <Badge tone="muted">Member</Badge>}
                              {canRemove ? (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(m)}
                                  disabled={actionBusy}
                                  title={`Remove ${name}`}
                                  style={{
                                    background: "rgba(255, 77, 109, 0.15)",
                                    border: "1px solid rgba(255, 77, 109, 0.3)",
                                    color: "#ff4d6d",
                                    borderRadius: "6px",
                                    padding: "4px 8px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                  }}
                                >
                                  ✕ Remove
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.cardFooter} style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                {team ? (
                  <Button size="sm" variant="danger" onClick={handleDeleteTeam} disabled={actionBusy}>
                    Delete Team
                  </Button>
                ) : null}
                {!team ? (
                  <Button size="sm" variant="primary" href="/team/create">
                    Create Team →
                  </Button>
                ) : isTeamIncomplete ? (
                  <Button size="sm" variant="primary" href="/team/create">
                    Add Teammates →
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" href="/team/create">
                    Manage Team
                  </Button>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Button size="sm" variant="secondary" onClick={() => setActiveStep(1)}>
                  ← Back
                </Button>
                <Button size="sm" variant="primary" onClick={() => setActiveStep(3)}>
                  Proceed to Step 3: Application →
                </Button>
              </div>
            </div>
          </div>

          {/* TEAM INVITE LINK CARD */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleGroup}>
                  <span className={styles.cardSubtitle}>Sharable URL</span>
                  <h2 className={styles.cardTitle}>Team Invite Link</h2>
                </div>
                {inviteLink ? <Badge tone="info">Active Link</Badge> : <Badge tone="muted">No Link</Badge>}
              </div>

              <div className={styles.cardBody}>
                {inviteLink ? (
                  <div className={styles.inviteBox}>
                    <div className={styles.copyRow}>
                      <span style={{ fontSize: "13px", color: "var(--text-dim)" }}>
                        Share this link with your teammates so they can join your team directly:
                      </span>
                      <Button size="sm" variant={copied ? "primary" : "secondary"} onClick={handleCopyInvite}>
                        {copied ? "✓ Copied!" : "Copy Link"}
                      </Button>
                    </div>
                    <code className={styles.inviteUrlCode}>{inviteLink}</code>
                  </div>
                ) : (
                  <div className={styles.emptyBox} style={{ padding: "16px" }}>
                    <span className={styles.emptyTitle}>No Invite Link Generated</span>
                    <p className={styles.emptyDesc}>
                      Create a team to generate a unique invite link for your teammates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: APPLICATION FLOW ================= */}
      {activeStep === 3 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div id="application-section" className={styles.fullWidth}>
            <ApplicationFlow onStatusChange={setAppStatus} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(18, 26, 43, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button size="sm" variant="secondary" onClick={() => setActiveStep(2)}>
              ← Back to Team
            </Button>
            <Button size="sm" variant="primary" onClick={() => setActiveStep(4)}>
              Proceed to Step 4: PPT Upload →
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: PPT UPLOAD ================= */}
      {activeStep === 4 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div id="ppt-section" className={styles.fullWidth}>
            <PptUploadSection deadline="14 Oct 2026, 11:59 PM" onStatusChange={setPptStatus} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(18, 26, 43, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button size="sm" variant="secondary" onClick={() => setActiveStep(3)}>
              ← Back to Application
            </Button>
            <Button size="sm" variant="primary" onClick={() => setActiveStep(5)}>
              Proceed to Step 5: Screening →
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: SCREENING STATUS ================= */}
      {activeStep === 5 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div id="screening-section" className={styles.fullWidth}>
            <ScreeningStatusCard applicationStatus={appStatus} pptStatus={pptStatus} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(18, 26, 43, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button size="sm" variant="secondary" onClick={() => setActiveStep(4)}>
              ← Back to PPT Upload
            </Button>
            <Button size="sm" variant="primary" onClick={() => setActiveStep(6)}>
              Proceed to Step 6: Payment →
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 6: SHORTLIST PAYMENT ================= */}
      {activeStep === 6 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div id="payment-section" className={styles.fullWidth}>
            <ShortlistPaymentCard onPaymentConfirmed={() => { setPaymentConfirmed(true); setActiveStep(7); }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(18, 26, 43, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button size="sm" variant="secondary" onClick={() => setActiveStep(5)}>
              ← Back to Screening
            </Button>
            <Button size="sm" variant="primary" onClick={() => setActiveStep(7)}>
              Proceed to Step 7: Pass & QR →
            </Button>
          </div>
        </div>
      )}

      {/* ================= STEP 7: PARTICIPANT PASS & QR DISPLAY ================= */}
      {activeStep === 7 && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div id="pass-section" className={styles.fullWidth}>
            <ParticipantPassCard
              teamName={typeof team?.members?.[0] === "string" ? "HTF Team" : "HTF Registered Team"}
              profileName={profile?.full_name || user?.name || "Participant"}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(18, 26, 43, 0.6)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button size="sm" variant="secondary" onClick={() => setActiveStep(6)}>
              ← Back to Payment
            </Button>
            <Badge tone="ok">Participant Journey Complete!</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
