"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBanner } from "@/components/ui/ErrorState";
import { TeamSkeleton } from "@/components/ui/Skeleton";
import {
  createInvitation,
  getTeam,
  leaveTeam,
  removeMember,
} from "@/lib/api/teams";
import { toUserMessage } from "@/lib/errors/userMessages";
import styles from "./TeamPanel.module.css";

function memberTone(status) {
  const s = String(status || "").toUpperCase();
  if (s === "ACTIVE") return "ok";
  if (s === "PENDING_PAYMENT") return "warn";
  if (s === "LEFT" || s === "REMOVED") return "muted";
  return "default";
}

function displayName(member, profileId) {
  if (String(member.profile_id) === String(profileId)) return "YOU";
  if (member.full_name?.trim()) return member.full_name.trim();
  return "Member";
}

/**
 * Authoritative team UI — loads GET /teams/{id} (includes full_name).
 * Registration.team nest lacks full_name; do not rely on it for the roster.
 */
export function TeamPanel({ teamId, event, onChanged }) {
  const { profile } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(Boolean(teamId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

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
        const aLead = String(a.role).toUpperCase() === "LEADER" ? 0 : 1;
        const bLead = String(b.role).toUpperCase() === "LEADER" ? 0 : 1;
        if (aLead !== bLead) return aLead - bLead;
        return String(a.joined_at || "").localeCompare(String(b.joined_at || ""));
      });
  }, [team]);

  const myMember = members.find((m) => String(m.profile_id) === String(profile?.id));
  const isLeader =
    String(team?.leader_profile_id) === String(profile?.id) ||
    String(myMember?.role).toUpperCase() === "LEADER";
  const teamStatus = String(team?.status || "").toUpperCase();

  const maxSize =
    typeof team?.team_max_size === "number"
      ? team.team_max_size
      : typeof event?.team_max_size === "number"
        ? event.team_max_size
        : null;
  const minSize = typeof event?.team_min_size === "number" ? event.team_min_size : null;
  const activeCount =
    typeof team?.active_member_count === "number" ? team.active_member_count : members.length;
  const openSlots = typeof maxSize === "number" ? Math.max(0, maxSize - activeCount) : null;

  async function onCreateInvite() {
    if (!team?.id) return;
    setLoadingInvite(true);
    setError(null);
    try {
      const inv = await createInvitation(team.id);
      setInviteCode(inv.code);
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

  return (
    <Card className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>{team.name}</h2>
          <p className="meta">
            {activeCount}
            {maxSize != null ? ` / ${maxSize}` : ""} members
            {minSize != null ? ` · min ${minSize}` : ""}
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

      <ul className={styles.list}>
        {members.map((m) => {
          const you = String(m.profile_id) === String(profile?.id);
          const role = String(m.role || "MEMBER").toUpperCase();
          return (
            <li key={m.id} className={styles.member}>
              <div className={styles.memberInfo}>
                <strong className={styles.memberName}>
                  {displayName(m, profile?.id)} — {role}
                </strong>
                <Badge tone={memberTone(m.status)}>{String(m.status || "").replace(/_/g, " ")}</Badge>
              </div>
              {isLeader && !you && role !== "LEADER" ? (
                <Button size="sm" variant="danger" disabled={busy} onClick={() => onRemove(m.id)}>
                  Remove
                </Button>
              ) : null}
            </li>
          );
        })}
        {openSlots != null
          ? Array.from({ length: openSlots }).map((_, i) => (
              <li key={`open-${i}`} className={styles.openSlot}>
                OPEN SLOT
              </li>
            ))
          : null}
      </ul>

      <div className={styles.actions}>
        {isLeader && (teamStatus === "PAID" || teamStatus === "COMPLETE") ? (
          <Button type="button" loading={loadingInvite} onClick={onCreateInvite}>
            {inviteCode ? "Refresh invite" : "Create invite"}
          </Button>
        ) : null}
        {isLeader && teamStatus === "FORMING" ? (
          <StatusBanner tone="info">Finish payment before inviting members.</StatusBanner>
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
