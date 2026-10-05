"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import styles from "./create.module.css";

const MEMBER_OPTIONS = ["Arjun", "Diya", "Kavin", "Meera"];

export default function TeamCreatePage() {
  const router = useRouter();
  const { loading, isAuthenticated, profile } = useAuth();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login?next=/team/create");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (profile?.full_name && !selectedMembers.length) setSelectedMembers([profile.full_name]);
  }, [profile, selectedMembers.length]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kratos_frontend_demo_team");
      if (saved) setCreated(JSON.parse(saved));
    } catch {
      /* ignore invalid demo data */
    }
  }, []);

  const label = useMemo(() => {
    if (!selectedMembers.length) return "Select 3–4 members";
    return `${selectedMembers.length} member${selectedMembers.length === 1 ? "" : "s"} selected`;
  }, [selectedMembers]);

  if (loading || !isAuthenticated) return null;

  function toggleMember(name) {
    setError("");
    const leaderName = profile?.full_name || "You";
    if (name === leaderName) return;
    setSelectedMembers((current) => {
      if (current.includes(name)) return current.filter((member) => member !== name);
      if (current.length >= 4) return current;
      return [...current, name];
    });
  }

  function createTeam() {
    if (selectedMembers.length < 3 || selectedMembers.length > 4) {
      setError("Select at least 3 and at most 4 team members.");
      return;
    }

    const leaderName = profile?.full_name || "You";
    const team = {
      members: selectedMembers.map((name) => ({ name, leader: name === leaderName })),
      inviteLink: "https://htf.example/join/DEMO-TEAM-2026",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("kratos_frontend_demo_team", JSON.stringify(team));
    setCreated(team);
    setOpen(false);
  }

  function deleteTeam() {
    if (!window.confirm("Are you sure you want to DELETE this team?")) return;
    localStorage.removeItem("kratos_frontend_demo_team");
    setCreated(null);
    setSelectedMembers([profile?.full_name || "You"]);
  }

  function removeMemberFromTeam(targetName) {
    if (!window.confirm(`Remove ${targetName} from the team?`)) return;
    const updatedMembers = created.members.filter((m) => (m.name || m) !== targetName);
    const nextTeam = { ...created, members: updatedMembers };
    localStorage.setItem("kratos_frontend_demo_team", JSON.stringify(nextTeam));
    setCreated(nextTeam);
    setSelectedMembers(updatedMembers.map((m) => m.name || m));
  }

  if (created) {
    return (
      <main className={styles.page}>
        <section className={styles.wrap}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Team Management</p>
            <h1>Your Team</h1>
            <p>Manage members or delete team setup.</p>
          </header>
          <div className={styles.card}>
            <div className={styles.memberHeader}>
              <div>
                <span className={styles.meta}>Members</span>
                <h2>{created.members.length} members</h2>
              </div>
              <span className={styles.badge}>{created.members.length >= 3 ? "Complete" : "Incomplete"}</span>
            </div>
            <div className={styles.members}>
              {created.members.map((member) => {
                const name = typeof member === "string" ? member : member.name;
                const isLeader = typeof member === "object" && member.leader;
                return (
                  <div className={styles.member} key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span>{name}</span>
                      {isLeader ? <span className={styles.leader} style={{ marginLeft: "8px" }}>Leader</span> : null}
                    </div>
                    {!isLeader ? (
                      <button
                        type="button"
                        onClick={() => removeMemberFromTeam(name)}
                        style={{
                          background: "rgba(255, 77, 109, 0.15)",
                          border: "1px solid rgba(255, 77, 109, 0.3)",
                          color: "#ff4d6d",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        ✕ Remove
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className={styles.linkBox}>
              <span className={styles.meta}>Dummy invite link</span>
              <code>{created.inviteLink}</code>
              <button type="button" className={styles.secondaryButton} onClick={() => navigator.clipboard?.writeText(created.inviteLink)}>Copy link</button>
            </div>
            
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <button
                type="button"
                onClick={deleteTeam}
                style={{
                  background: "rgba(255, 77, 109, 0.2)",
                  border: "1px solid rgba(255, 77, 109, 0.4)",
                  color: "#ff4d6d",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  fontFamily: "Orbitron, sans-serif",
                  cursor: "pointer",
                }}
              >
                Delete Team
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className={styles.primaryButton}
                style={{ width: "auto", padding: "10px 24px" }}
              >
                Back to Dashboard →
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const options = [profile?.full_name || "You", ...MEMBER_OPTIONS.filter((name) => name !== profile?.full_name)];

  return (
    <main className={styles.page}>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Step 3 of 3</p>
          <h1>Create Team</h1>
          <p>Select your team members. Your team must have 3–4 members.</p>
        </header>
        <div className={styles.card}>
          <div className={styles.field}>
            <label htmlFor="team-members">Team members</label>
            <div className={styles.dropdown}>
              <button id="team-members" type="button" className={styles.dropdownButton} onClick={() => setOpen((value) => !value)} aria-expanded={open}>
                <span>{label}</span>
                <span aria-hidden>⌄</span>
              </button>
              {open ? (
                <div className={styles.menu}>
                  {options.map((name) => (
                    <label className={styles.option} key={name}>
                      <input type="checkbox" checked={selectedMembers.includes(name)} onChange={() => toggleMember(name)} disabled={name === (profile?.full_name || "You")} />
                      <span>{name}</span>
                    </label>
                  ))}
                  <p>Your profile is the team leader. Choose 2–3 more members.</p>
                </div>
              ) : null}
            </div>
          </div>

          {selectedMembers.length ? <div className={styles.selected}>{selectedMembers.map((member) => <span key={member}>{member}</span>)}</div> : null}
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <button type="button" className={styles.primaryButton} onClick={createTeam} disabled={selectedMembers.length < 3}>Create Team</button>
        </div>
      </section>
    </main>
  );
}
