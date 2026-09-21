"use client";

import Link from "next/link";
import { formatFee, formatWhen, shortCoord } from "@/lib/events/utils";

export default function EventCard({ event }) {
  if (!event) return null;
  return (
    <Link href={`/events/${event.id}`} className="kx-event-card">
      <div className="kx-event-top">
        <span className="node-coord">EVT · {shortCoord(event.id)}</span>
        {event.category && <span className="kx-cat">{event.category}</span>}
      </div>
      <h3>{event.name}</h3>
      <p>{event.short_desc || "Open detail for rules, venue, and registration."}</p>
      <div className="kx-event-meta">
        <span>{formatWhen(event.starts_at, event.ends_at, event.slot)}</span>
        <span>{formatFee(event.fee)}</span>
      </div>
      <div className="kx-event-foot">
        {event.registration_open ? (
          <span className="status-pill open">Open</span>
        ) : (
          <span className="status-pill closed">Closed</span>
        )}
        <span className="kx-cta">
          Details <i>→</i>
        </span>
      </div>
    </Link>
  );
}
