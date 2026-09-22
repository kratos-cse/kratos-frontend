"use client";

import { useMemo, useState } from "react";
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

export function TeamPanel({ registration, event, onUpdated }) {
  const { profile } = useAuth();
  const team = registration?.team;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

  const members = useMemo(
    () => (team?.members || []).filter((m) => !["LEFT", "REMOVED"].includes(String(m.status).toUpperCase())),
    [team]
  );

  const myMember = members.find((m) => String(m.profile_id) === String(profile?.id));
  const isLeader = String(team?.leader_profile_id) === String(profile?.id) || String(myMember?.role).toUpperCase() === "LEADER";
  const teamStatus = String(team?.status || "").toUpperCase();
  const maxSize = event?.team_max_size;
  const minSize = event?.team_min_size;
  const openSlots =
    typeof maxSize === "number" ? Math.max(0, maxSize - members.length) : null;

  if (!team) return null;

  async function refreshTeam() {
    const fresh = await getTeam(team.id);
    onUpdated?.(fresh);
    return fresh;
  }

  async function onCreateInvite() {
    setLoadingInvite(true);
    setError(null);
    try {
      const inv = await createInvitation(team.id);
      setInviteCode(inv.code);
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoadingInvite(false);
    }
  }

  async function onLeave() {
    if (!myMember) return;
    setBusy(true);
    setError(null);
    try {
      await leaveTeam(team.id, myMember.id);
      await refreshTeam();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(memberId) {
    setBusy(true);
    setError(null);
    try {
      await removeMember(team.id, memberId);
      await refreshTeam();
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
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
            {members.length}
            {maxSize != null ? ` / ${maxSize}` : ""} members
            {minSize != null ? ` · min ${minSize}` : ""}
          </p>
        </div>
        <Badge tone={teamStatus === "PAID" || teamStatus === "COMPLETE" ? "ok" : teamStatus === "CANCELLED" ? "err" : "warn"}>
          {teamStatus || "TEAM"}
        </Badge>
      </div>

      {error ? <StatusBanner tone="err">{error}</StatusBanner> : null}

      <ul className={styles.list}>
        {members.map((m) => {
          const you = String(m.profile_id) === String(profile?.id);
          const role = String(m.role || "MEMBER").toUpperCase();
          return (
            <li key={m.id} className={styles.member}>
              <div>
                <strong>
                  {you ? "YOU" : m.full_name || "Member"} — {role}
                </strong>
                <div>
                  <Badge tone={memberTone(m.status)}>{String(m.status || "").replace(/_/g, " ")}</Badge>
                </div>
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
