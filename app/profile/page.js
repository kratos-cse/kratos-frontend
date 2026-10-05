"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { ParticipantDashboard } from "@/components/dashboard/ParticipantDashboard";
import { isProfileComplete } from "@/lib/events/utils";
import styles from "./profile.module.css";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG"];

export default function ProfilePage() {
  const router = useRouter();
  const { loading, isAuthenticated, user, profile, saveDemoProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [form, setForm] = useState({ name: "", year: "", degree: "", phone: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login?next=/profile");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    setForm({
      name: profile?.full_name || "",
      year: profile?.year_of_study || "",
      degree: profile?.degree || profile?.college_name || "",
      phone: profile?.phone || "",
      email: profile?.contact_email || user?.email || "",
    });

    if (!initialized && profile) {
      setInitialized(true);
      if (!isProfileComplete(profile)) {
        setEditing(true);
      }
    }
  }, [profile, user, initialized]);

  if (loading || !isAuthenticated) return null;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function submit(e) {
    e.preventDefault();
    const values = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!values.name || !values.year || !values.degree || !values.phone || !values.email) {
      setError("Please complete all profile fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setError("Enter a valid email address.");
      return;
    }
    saveDemoProfile({
      full_name: values.name,
      year_of_study: values.year,
      degree: values.degree,
      college_name: values.degree,
      department: values.degree,
      phone: values.phone,
      contact_email: values.email,
    });
    setEditing(false);
  }

  return (
    <main className={styles.page}>
      <section className={styles.wrap}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Participant Dashboard</p>
          <h1>Overview & Profile</h1>
          <p>Manage your participant profile, track team setup, and share invite links.</p>
        </header>

        {editing ? (
          <form onSubmit={submit} className={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "18px", color: "#fff", margin: 0, fontFamily: "Orbitron, sans-serif" }}>
                {isProfileComplete(profile) ? "Edit Profile Details" : "Complete Required Profile"}
              </h2>
              {isProfileComplete(profile) ? (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-dim)",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  ✕ Cancel
                </button>
              ) : null}
            </div>

            <label>
              <span>Name</span>
              <input value={form.name} onChange={(e) => setField("name", e.target.value)} autoComplete="name" required />
            </label>
            <label>
              <span>Year</span>
              <select value={form.year} onChange={(e) => setField("year", e.target.value)} required>
                <option value="">Select year</option>
                {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <label>
              <span>Degree / College</span>
              <input value={form.degree} onChange={(e) => setField("degree", e.target.value)} placeholder="e.g. B.E. Computer Science" required />
            </label>
            <label>
              <span>Phone number</span>
              <input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} autoComplete="tel" inputMode="tel" required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} autoComplete="email" required />
            </label>
            {error ? <p className={styles.error} role="alert">{error}</p> : null}
            <button type="submit" className={styles.primaryButton}>
              Save Profile Details
            </button>
          </form>
        ) : (
          <ParticipantDashboard onEditProfile={() => setEditing(true)} />
        )}
      </section>
    </main>
  );
}
