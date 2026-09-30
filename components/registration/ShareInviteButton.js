"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createInvitation } from "@/lib/api/teams";
import { toUserMessage } from "@/lib/errors/userMessages";

export function ShareInviteButton({ teamId, variant = "primary", size }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  async function onShare() {
    if (!teamId) return;
    setBusy(true);
    setNote(null);
    try {
      const inv = await createInvitation(teamId);
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/join/${inv.code}`;
      if (navigator.share) {
        await navigator.share({ title: "Join my KRATOS team", url });
      } else {
        await navigator.clipboard?.writeText(url);
        setNote("Invite link copied");
      }
    } catch (err) {
      if (String(err?.name) !== "AbortError") setNote(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button type="button" variant={variant} size={size} loading={busy} onClick={onShare}>
        Share invite
      </Button>
      {note ? <span className="meta">{note}</span> : null}
    </>
  );
}
