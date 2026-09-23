"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBanner } from "@/components/ui/ErrorState";
import { TeamSkeleton } from "@/components/ui/Skeleton";
import {
  addRosterMember,
  createInvitation,
  getTeam,
  leaveTeam,
  removeMember,
} from "@/lib/api/teams";
import { toUserMessage } from "@/lib/errors/userMessages";
import CountUp from "@/components/micro/CountUp/CountUp";
import styles from "./TeamPanel.module.css";

function memberTone(status) {
  const s = String(status || "").toUpperCase();
  if (s === "ACTIVE") return "ok";
  if (s === "PENDING_PAYMENT") return "warn";
  if (s === "LEFT" || s === "REMOVED") return "muted";
  return "default";
}

function displayName(member, profileId) {
  if (member.profile_id && String(member.profile_id) === String(profileId)) return "YOU";
  if (member.full_name?.trim()) return member.full_name.trim();
  return "Member";
}

function roleLabel(role) {
  const r = String(role || "MEMBER").toUpperCase();
  if (r === "LEADER") return "Leader";
  if (r === "SUBSTITUTE") return "Substitute";
  return "Member";
}

const EMPTY_FORM = { full_name: "", phone: "", contact_email: "", college_name: "", year_of_study: "" };

/**
 * Authoritative team UI — loads GET /teams/{id}.
 * Shows mandatory vs substitute sections from backend roster fields.
 */
export function TeamPanel({ teamId, event, onChanged }) {
  const { profile } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(Boolean(teamId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [addRole, setAddRole] = useState(null); // MEMBER | SUBSTITUTE | null
  const [form, setForm] = useState(EMPTY_FORM);

  const refresh = useCallback(async ({ notify = false } = {}) => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const fresh = await getTeam(teamId);
      setTeam(fresh);
      if (notify) onChanged?.(fresh);
      return fresh;
    } catch (err) {
      setError(toUserMessage(err));
      setTeam(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [teamId, onChanged]);

  useEffect(() => {
    refresh({ notify: false });
  }, [teamId]); // eslint-disable-line react-hooks/exhaustive-deps -- load once per teamId

  const members = useMemo(() => {
    const list = Array.isArray(team?.members) ? team.members : [];
    return list
      .filter((m) => !["LEFT", "REMOVED"].includes(String(m.status).toUpperCase()))
      .slice()
      .sort((a, b) => {
        const order = { LEADER: 0, MEMBER: 1, SUBSTITUTE: 2 };
        const ar = order[String(a.role).toUpperCase()] ?? 1;
        const br = order[String(b.role).toUpperCase()] ?? 1;
        if (ar !== br) return ar - br;
        return String(a.joined_at || "").localeCompare(String(b.joined_at || ""));
      });
  }, [team]);

  const mandatory = members.filter((m) => {
    const r = String(m.role).toUpperCase();
    return r === "LEADER" || r === "MEMBER";
  });
  const substitutes = members.filter((m) => String(m.role).toUpperCase() === "SUBSTITUTE");

  const myMember = members.find((m) => m.profile_id && String(m.profile_id) === String(profile?.id));
  const isLeader =
    String(team?.leader_profile_id) === String(profile?.id) ||
    String(myMember?.role).toUpperCase() === "LEADER";
  const teamStatus = String(team?.status || "").toUpperCase();

  const required =
    typeof team?.required_member_count === "number"
      ? team.required_member_count
      : typeof event?.required_member_count === "number"
        ? event.required_member_count
        : typeof event?.team_min_size === "number"
          ? event.team_min_size
          : null;
  const maxSubs =
    typeof team?.substitute_count === "number"
      ? team.substitute_count
      : typeof event?.substitute_count === "number"
        ? event.substitute_count
        : typeof event?.team_max_size === "number" && typeof event?.team_min_size === "number"
          ? Math.max(0, event.team_max_size - event.team_min_size)
          : 0;
  const mandatoryFilled =
    typeof team?.mandatory_filled === "number" ? team.mandatory_filled : mandatory.length;
  const subsFilled =
    typeof team?.substitutes_filled === "number" ? team.substitutes_filled : substitutes.length;
  const mandatoryOpen =
    typeof required === "number" ? Math.max(0, required - mandatoryFilled) : 0;
  const subOpen = Math.max(0, maxSubs - subsFilled);

  const memberMode = String(event?.member_registration_mode || "").toUpperCase();
  const leaderCanEnter = memberMode === "LEADER_MANAGED";
  const allowInvite = event?.allow_team_invite_flow !== false;
  const canManageRoster =
    isLeader && (teamStatus === "PAID" || teamStatus === "COMPLETE" || teamStatus === "FORMING");

  async function onCreateInvite() {
    if (!team?.id) return;
    setLoadingInvite(true);
    setError(null);
    try {
      const inv = await createInvitation(team.id);
      setInviteCode(inv.code);
      const url =
        typeof window !== "undefined" && inv.code
          ? `${window.location.origin}/join/${inv.code}`
          : null;
      if (url && navigator.share) {
        try {
          await navigator.share({ title: "Join my KRATOS team", url });
        } catch (shareErr) {
          if (String(shareErr?.name) !== "AbortError") {
            await navigator.clipboard?.writeText(url);
          }
        }
      } else if (url) {
        await navigator.clipboard?.writeText(url);
      }
      await refresh({ notify: true });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoadingInvite(false);
    }
  }

  async function onLeave() {
    if (!team?.id || !myMember) return;
    setBusy(true);
    setError(null);
    try {
      await leaveTeam(team.id, myMember.id);
      await refresh({ notify: true });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(memberId) {
    if (!team?.id) return;
    setBusy(true);
    setError(null);
    try {
      await removeMember(team.id, memberId);
      await refresh({ notify: true });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onAddRoster(e) {
    e.preventDefault();
    if (!team?.id || !addRole) return;
    setBusy(true);
    setError(null);
    try {
      await addRosterMember(team.id, {
        role: addRole,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        contact_email: form.contact_email.trim() || undefined,
        college_name: form.college_name.trim() || undefined,
        year_of_study: form.year_of_study.trim() || undefined,
      });
      setForm(EMPTY_FORM);
      setAddRole(null);
      await refresh({ notify: true });
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (!teamId) return null;
  if (loading && !team) return <TeamSkeleton />;

  if (!team) {
    return (
      <Card className={styles.wrap}>
        <StatusBanner tone="err">{error || "Couldn’t load team."}</StatusBanner>
        <Button type="button" variant="secondary" onClick={() => refresh({ notify: false })}>
          Retry
        </Button>
      </Card>
    );
  }

  const inviteUrl =
    typeof window !== "undefined" && inviteCode
      ? `${window.location.origin}/join/${inviteCode}`
      : inviteCode
        ? `/join/${inviteCode}`
        : null;

  const rosterLine =
    typeof required === "number"
      ? maxSubs > 0
        ? `${required} members + up to ${maxSubs} substitutes`
        : `${required} members`
      : null;

  function renderMember(m) {
    const you = m.profile_id && String(m.profile_id) === String(profile?.id);
    const role = String(m.role || "MEMBER").toUpperCase();
    const entry = String(m.entry_source || "").toUpperCase();
    return (
      <li key={m.id} className={styles.member}>
        <div className={styles.memberInfo}>
          <strong className={styles.memberName}>
            {displayName(m, profile?.id)} — {roleLabel(role)}
          </strong>
          <div className={styles.metaRow}>
            <Badge tone={memberTone(m.status)}>{String(m.status || "").replace(/_/g, " ")}</Badge>
            {entry === "LEADER_ENTERED" ? <Badge tone="muted">Leader entered</Badge> : null}
          </div>
        </div>
        {isLeader && !you && role !== "LEADER" ? (
          <Button size="sm" variant="danger" disabled={busy} onClick={() => onRemove(m.id)}>
            Remove
          </Button>
        ) : null}
      </li>
    );
  }

  return (
    <Card className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{team.name}</h2>
          <p className="meta">
            {rosterLine || `${members.length} on roster`}
            {typeof required === "number" ? (
              <>
                {" · mandatory "}
                <CountUp to={mandatoryFilled} duration={0.35} />
                /{required}
              </>
            ) : null}
            {maxSubs > 0 ? (
              <>
                {" · substitutes "}
                <CountUp to={subsFilled} duration={0.35} />
                /{maxSubs}
              </>
            ) : null}
          </p>
        </div>
        <div className={styles.headActions}>
          <Badge
            tone={
              teamStatus === "PAID" || teamStatus === "COMPLETE"
                ? "ok"
                : teamStatus === "CANCELLED"
                  ? "err"
                  : "warn"
            }
          >
            {teamStatus || "TEAM"}
          </Badge>
          <Button type="button" size="sm" variant="ghost" onClick={() => refresh({ notify: false })} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? <StatusBanner tone="err">{error}</StatusBanner> : null}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Mandatory members</h3>
        <ul className={styles.list}>
          {mandatory.map(renderMember)}
          {Array.from({ length: mandatoryOpen }).map((_, i) => (
            <li key={`m-open-${i}`} className={styles.openSlot}>
              OPEN MANDATORY SLOT
            </li>
          ))}
        </ul>
      </section>

      {maxSubs > 0 ? (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Substitutes</h3>
          <ul className={styles.list}>
            {substitutes.map(renderMember)}
            {Array.from({ length: subOpen }).map((_, i) => (
              <li key={`s-open-${i}`} className={`${styles.openSlot} ${styles.subSlot}`}>
                OPEN SUBSTITUTE SLOT
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className={styles.actions}>
        {isLeader && teamStatus === "FORMING" && allowInvite ? (
          <StatusBanner tone="info">
            Finish payment before sharing invite links. You can still add members manually below.
          </StatusBanner>
        ) : null}

        {canManageRoster && leaderCanEnter ? (
          <div className={styles.addActions}>
            {mandatoryOpen > 0 ? (
              <Button
                type="button"
                variant={addRole === "MEMBER" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setAddRole(addRole === "MEMBER" ? null : "MEMBER")}
              >
                Add member
              </Button>
            ) : null}
            {subOpen > 0 ? (
              <Button
                type="button"
                variant={addRole === "SUBSTITUTE" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setAddRole(addRole === "SUBSTITUTE" ? null : "SUBSTITUTE")}
              >
                Add substitute
              </Button>
            ) : null}
          </div>
        ) : null}

        {addRole && leaderCanEnter ? (
          <form className={styles.addForm} onSubmit={onAddRoster}>
            <p className="meta">
              Adding {addRole === "SUBSTITUTE" ? "substitute" : "mandatory member"} (no account required)
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
            <Input
              label="Year of study"
              value={form.year_of_study}
              onChange={(e) => setForm((f) => ({ ...f, year_of_study: e.target.value }))}
            />
            <div className={styles.addFormActions}>
              <Button type="button" variant="ghost" size="sm" onClick={() => setAddRole(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" loading={busy}>
                Save to roster
              </Button>
            </div>
          </form>
        ) : null}

        {isLeader && allowInvite && (teamStatus === "PAID" || teamStatus === "COMPLETE") ? (
          <Button type="button" loading={loadingInvite} onClick={onCreateInvite}>
            {inviteCode ? "Refresh invite" : "Share invite"}
          </Button>
        ) : null}

        {!isLeader && myMember ? (
          <Button type="button" variant="ghost" loading={busy} onClick={onLeave}>
            Leave team
          </Button>
        ) : null}
      </div>

      {inviteUrl ? (
        <div className={styles.invite}>
          <p className="meta">Invite link</p>
          <code className={styles.code}>{inviteUrl}</code>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            onClick={() => navigator.clipboard?.writeText(inviteUrl)}
          >
            Copy link
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

export function TeamPanelLoading() {
  return <TeamSkeleton />;
}
