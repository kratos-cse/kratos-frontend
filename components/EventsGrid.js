"use client";

import { EVENTS } from "@/data/events";
import { useModal } from "@/context/ModalContext";

export default function EventsGrid({ category = "all", limit = 0 }) {
  const { openModal } = useModal();

  let list = EVENTS.filter((ev) => {
    if (category === "all") return true;
    if (category === "Technical") return ev.track === "Technical" || ev.track === "Non-Technical";
    return ev.track === category;
  });
  if (limit > 0) list = list.slice(0, limit);

  return (
    <div className="events-grid" id="eventsGrid">
      {list.length === 0 ? (
        <p style={{ color: "var(--ash-dim)" }}>No events published yet.</p>
      ) : (
        list.map((ev) => (
          <div className="event-card" key={ev.name} onClick={() => openModal(ev)}>
            <span className="etag">{ev.track}</span>
            <h3>{ev.name}</h3>
            <p>{ev.short}</p>
            <div className="emeta">
              <span>
                <strong>{ev.date}</strong>
              </span>
              <span className="fhint">View details →</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
