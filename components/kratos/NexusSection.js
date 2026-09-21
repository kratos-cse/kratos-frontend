"use client";

import Link from "next/link";
import SectionReveal from "./SectionReveal";
import { formatFee, formatWhen, shortCoord } from "@/lib/events/utils";

/**
 * Nexus — surfaces open / soonest events using only API fields.
 */
export default function NexusSection({ events = [], loading }) {
  return (
    <section id="nexus" className="nexus-sec">
      <div className="container">
        <SectionReveal className="sec-head">
          <span className="eyebrow">Nexus Event</span>
          <h2>Where the timeline converges</h2>
          <p>Open registrations and nearest start times — ranked from live catalogue data.</p>
        </SectionReveal>

        {loading && <p className="state-msg">Calibrating nexus…</p>}

        <div className="nexus-grid">
          {events.map((ev, i) => (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className={`nexus-card${i === 0 ? " nexus-primary" : ""}`}
            >
              <div className="nexus-meta">
                <span className="node-coord">NX · {shortCoord(ev.id)}</span>
                {ev.registration_open ? (
                  <span className="status-pill open">Registration open</span>
                ) : (
                  <span className="status-pill closed">Closed</span>
                )}
              </div>
              <h3>{ev.name}</h3>
              <p>{ev.short_desc || ev.category || "Event"}</p>
              <div className="nexus-footer">
                <span>{formatWhen(ev.starts_at, ev.ends_at, ev.slot)}</span>
                <span>{formatFee(ev.fee)}</span>
              </div>
            </Link>
          ))}
        </div>

        {!loading && events.length === 0 && (
          <p className="state-msg">No nexus events available yet.</p>
        )}
      </div>
    </section>
  );
}
