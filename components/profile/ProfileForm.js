"use client";

import { useAuth } from "@/context/AuthProvider";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateMyProfile } from "@/lib/api/profile";
import { toUserMessage } from "@/lib/errors/userMessages";
import { useState } from "react";

const YEARS = ["1", "2", "3", "4", "PG", "Other"];

export function ProfileForm({ onSaved, submitLabel = "Save profile" }) {
  const { profile, user, setProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    college_name: profile?.college_name || "",
    department: profile?.department || "",
    year_of_study: profile?.year_of_study || "",
    contact_email: profile?.contact_email || user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMyProfile({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        college_name: form.college_name.trim(),
        department: form.department.trim(),
        year_of_study: form.year_of_study.trim(),
        contact_email: form.contact_email.trim() || null,
      });
      setProfile(updated);
      onSaved?.(updated);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack">
      <Input
        label="Full name"
        name="full_name"
        required
        value={form.full_name}
        onChange={(e) => setField("full_name", e.target.value)}
        autoComplete="name"
      />
      <Input
        label="Phone"
        name="phone"
        required
        value={form.phone}
        onChange={(e) => setField("phone", e.target.value)}
        autoComplete="tel"
        inputMode="tel"
      />
      <Input
        label="College"
        name="college_name"
        required
        value={form.college_name}
        onChange={(e) => setField("college_name", e.target.value)}
      />
      <Input
        label="Department"
        name="department"
        required
        value={form.department}
        onChange={(e) => setField("department", e.target.value)}
      />
      <Select
        label="Year of study"
        name="year_of_study"
        required
        value={form.year_of_study}
        onChange={(e) => setField("year_of_study", e.target.value)}
      >
        <option value="">Select year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
      <Input
        label="Contact email (optional)"
        name="contact_email"
        type="email"
        value={form.contact_email}
        onChange={(e) => setField("contact_email", e.target.value)}
        hint={user?.email ? `Signed in as ${user.email}` : undefined}
      />
      {error ? (
        <p role="alert" style={{ color: "var(--err)", margin: 0 }}>
          {error}
        </p>
      ) : null}
      <Button type="submit" loading={saving}>
        {submitLabel}
      </Button>
    </form>
  );
}
