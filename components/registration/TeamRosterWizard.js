"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { StatusBanner } from "@/components/ui/ErrorState";
import { TeamSkeleton } from "@/components/ui/Skeleton";
import { ProgressBar } from "@/components/registration/ProgressBar";
import { addRosterMember, getTeam } from "@/lib/api/teams";
import { toUserMessage } from "@/lib/errors/userMessages";
import {
  countMandatory,
  countSubstitutes,
  getNextRosterSlot,
  getRosterLimits,
  remainingLeaderEntrySlots,
} from "@/lib/events/rosterPlan";
import styles from "./TeamRosterWizard.module.css";

const YEARS = ["1", "2", "3", "4", "PG", "Other"];
const EMPTY_FORM = { full_name: "", phone: "", contact_email: "", college_name: "", year_of_study: "" };

export function TeamRosterWizard({ teamId, event, onContinuePayment, onBack, busy: parentBusy }) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(Boolean(teamId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const refresh = useCallback(async () => {
    if (!teamId) return null;
    setLoading(true);
    setError(null);
    try {
      const fresh = await getTeam(teamId);
      setTeam(fresh);
      return fresh;
    } catch (err) {
      setError(toUserMessage(err));
      setTeam(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    refresh();
  }, [teamId]); // eslint-disable-line react-hooks/exhaustive-deps

  const slot = useMemo(() => (team && event ? getNextRosterSlot(event, team) : null), [team, event]);
  const limits = useMemo(() => getRosterLimits(event), [event]);
  const remaining = useMemo(() => (team ? remainingLeaderEntrySlots(event, team) : null), [event, team]);

  const mandatoryCount = team ? countMandatory(team) : 0;
  const substituteCount = team ? countSubstitutes(team) : 0;

  async function onSave(e) {
    e.preventDefault();
    if (!teamId || !slot) return;
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError("Full name and phone are required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await addRosterMember(teamId, {
        role: slot.role,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        contact_email: form.contact_email.trim() || undefined,
        college_name: form.college_name.trim() || undefined,
        year_of_study: form.year_of_study.trim() || undefined,
      });
      setForm(EMPTY_FORM);
      await refresh();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!teamId) return null;
  if (loading && !team) return <TeamSkeleton />;

  const isBusy = busy || parentBusy;

  return (
    <Card className={styles.wrap}>
      <header className={styles.head}>
        <h2 className={styles.title}>Team members</h2>
        <p className="meta">
          {limits.substitutes > 0
            ? `${limits.required} required · up to ${limits.substitutes} substitutes`
            : `${limits.required} members required`}
        </p>
      </header>

      <div className={styles.progressGroup}>
        <ProgressBar
          value={mandatoryCount}
          max={limits.required}
          label="Required members"
          sublabel={`${mandatoryCount} of ${limits.required}`}
        />
        {limits.substitutes > 0 ? (
          <ProgressBar
            value={substituteCount}
            max={limits.substitutes}
            label="Substitutes"
            sublabel={`${substituteCount} of ${limits.substitutes}`}
          />
        ) : null}
      </div>

      {error ? <StatusBanner tone="err">{error}</StatusBanner> : null}

      {slot ? (
        <form className={styles.form} onSubmit={onSave}>
          <p className={styles.stepMeta}>
            {slot.phase === "mandatory" ? "Required member" : "Substitute"} · {slot.label}
          </p>
          <Input
            label="Full name"
            required
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          />
          <Input
            label="Phone"
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          />
          <Input
            label="College"
            value={form.college_name}
            onChange={(e) => setForm((f) => ({ ...f, college_name: e.target.value }))}
          />
          <Select
            label="Year of study"
            value={form.year_of_study}
            onChange={(e) => setForm((f) => ({ ...f, year_of_study: e.target.value }))}
          >
            <option value="">Select year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
          <div className={styles.actions}>
            <Button type="submit" loading={isBusy}>
              Save &amp; Next
            </Button>
          </div>
        </form>
      ) : (
        <StatusBanner tone="ok">Roster slots filled. Continue to payment when you&apos;re ready.</StatusBanner>
      )}

      <div className={styles.footerActions}>
        <Button type="button" variant="ghost" onClick={onBack} disabled={isBusy}>
          Back
        </Button>
        <Button type="button" onClick={onContinuePayment} loading={isBusy}>
          Continue to Payment
        </Button>
      </div>

      {remaining?.totalRemaining ? (
        <p className="muted">{remaining.totalRemaining} slot(s) remaining — you can finish them after payment.</p>
      ) : null}
    </Card>
  );
}
