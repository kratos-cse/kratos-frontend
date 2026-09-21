"use client";

import { useCallback, useEffect, useState } from "react";
import { createInvitation, getTeam } from "@/lib/api/teams";
import { toUserMessage } from "@/lib/errors/userMessages";
import StatusBanner from "@/components/kratos/ui/StatusBanner";

export default function TeamInvitePanel({ teamId, teamMaxSize, poll = true }) {
  const [team, setTeam] = useState(null);
  const [inviteUrl, setInviteUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!teamId) return;
    try {
      const data = await getTeam(teamId);
      setTeam(data);
    } catch (err) {
      setError(toUserMessage(err));
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!poll || !teamId) return undefined;
    const max = teamMaxSize || team?.team_max_size;
    const count = team?.active_member_count ?? team?.members?.length ?? 0;
    if (max && count >= max) return undefined;
    const id = setInterval(load, 7000);
    return () => clearInterval(id);
  }, [poll, teamId, team, teamMaxSize, load]);

  async function generateInvite() {
    setBusy(true);
    setError(null);
    try {
      const inv = await createInvitation(teamId);
      const code = inv?.code;
      if (code) {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        setInviteUrl(`${origin}/join/${code}`);
      }
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy. Select the link and copy manually.");
    }
  }

  async function shareLink() {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join my KRATOS'26 team", url: inviteUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    copyLink();
  }

  const members = team?.members || [];
  const active = members.filter((m) => !["LEFT", "REMOVED"].includes(String(m.status || "").toUpperCase()));
  const max = teamMaxSize || team?.team_max_size;
  const count = team?.active_member_count ?? active.length;

  return (
    <div>
      <h2 className="profile-title" style={{ fontSize: "1.1rem", marginBottom: 8 }}>
        Your team
      </h2>
      {team?.name ? <p className="muted">{team.name}</p> : null}
      <p className="muted" style={{ marginBottom: 8 }}>
        {count}
        {max ? ` / ${max}` : ""} members
      </p>
      <ul className="member-list">
        {active.map((m) => (
          <li key={m.id || m.profile_id}>
            <span className="tick" aria-hidden>
              ✓
            </span>
            <span>
              {m.full_name || m.name || "Member"}
              {m.profile_id === team?.leader_profile_id ? " · Leader" : ""}
            </span>
          </li>
        ))}
        {max && count < max
          ? Array.from({ length: max - count }).map((_, i) => (
              <li key={`wait-${i}`}>
                <span className="wait" aria-hidden>
                  ○
                </span>
                <span className="wait">Waiting…</span>
              </li>
            ))
          : null}
      </ul>

      {!inviteUrl ? (
        <button type="button" className="btn btn-primary" disabled={busy} onClick={generateInvite}>
          {busy ? "Generating…" : "Generate invite link"}
        </button>
      ) : (
        <div>
          <p className="muted" style={{ marginBottom: 8 }}>
            Invite your teammates (link can be reused)
          </p>
          <div className="invite-box">
            <code>{inviteUrl}</code>
            <button type="button" className="btn btn-ghost" onClick={copyLink}>
              {copied ? "Copied" : "Copy link"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={shareLink}>
              Share
            </button>
          </div>
        </div>
      )}
      {error ? (
        <StatusBanner tone="err" title="Couldn’t update team">
          {error}
        </StatusBanner>
      ) : null}
    </div>
  );
}
