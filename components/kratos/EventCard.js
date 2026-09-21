"use client";

import Link from "next/link";
import { formatFee, formatWhen, shortCoord } from "@/lib/events/utils";

function teamLabel(event) {
  if (event.registration_mode === "INDIVIDUAL_ONLY" || (event.allow_individual && (event.team_max_size ?? 1) <= 1)) {
    return "Solo";
  }
  const min = event.team_min_size;
  const max = event.team_max_size;
  if (min && max) return `Team ${min}–${max}`;
  if (max > 1) return `Team up to ${max}`;
  return null;
}

export default function EventCard({ event }) {
  if (!event) return null;
  const team = teamLabel(event);
  return (
    <Link href={`/events/${event.id}`} className="kx-event-card">
      <div className="kx-event-top">
        <span className="node-coord">EVT · {shortCoord(event.id)}</span>
        {event.category && <span className="kx-cat">{event.category}</span>}
      </div>
      <h3>{event.name}</h3>
      <p>{event.short_desc || "Open detail for rules, venue, and registration."}</p>
      <div className="kx-event-meta">
        <span className="meta-chip">{formatWhen(event.starts_at, event.ends_at, event.slot)}</span>
        <span className="meta-chip">{event.venue || "Venue TBA"}</span>
        {team ? <span className="meta-chip">{team}</span> : null}
        <span className="meta-chip">{formatFee(event.fee)}</span>
      </div>
      <div className="kx-event-foot">
        {event.registration_open ? (
          <span className="status-pill open">Open</span>
        ) : (
          <span className="status-pill closed">Closed</span>
        )}
        <span className="kx-cta">
          View event <i>→</i>
        </span>
      </div>
    </Link>
  );
}
