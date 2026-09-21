"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { useEvent, useEvents } from "@/hooks/useEvents";
import { formatFee, formatWhen, shortCoord, uniqueCategories, categoryToSlug } from "@/lib/events/utils";

function formatCloses(at) {
  if (!at) return null;
  try {
    return new Date(at).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(at);
  }
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const { event, loading, error } = useEvent(eventId);
  const { events } = useEvents();
  const categories = useMemo(() => uniqueCategories(events), [events]);
  const closes = formatCloses(event?.registration_closes_at);

  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Event Detail</span>
            <p className="node-coord">EVT · {shortCoord(eventId)}</p>
          </div>
        </section>
        <section>
          <div className="container detail-layout">
            {loading && <p className="state-msg">Loading event…</p>}
            {error && (
              <p className="state-msg state-error" role="alert">
                {error.message || "Event not found"}
              </p>
            )}
            {event && (
              <>
                <div className="detail-main">
                  <h1>{event.name}</h1>
                  <p className="lede">{event.short_desc || "No short description provided."}</p>
                  {event.long_desc && event.long_desc !== event.short_desc ? (
                    <div className="detail-block">
                      <h2>About</h2>
                      <p>{event.long_desc}</p>
                    </div>
                  ) : null}
                  {event.category && (
                    <div className="detail-block">
                      <h2>Branch</h2>
                      <p>
                        <Link href={`/categories/${categoryToSlug(event.category)}`}>
                          {event.category}
                        </Link>
                      </p>
                    </div>
                  )}
                  {(event.coordinator || event.coord_contact) && (
                    <div className="detail-block">
                      <h2>Coordinators</h2>
                      <p>
                        {event.coordinator}
                        {event.coord_contact ? ` · ${event.coord_contact}` : ""}
                      </p>
                    </div>
                  )}
                </div>
                <aside className="detail-aside">
                  <div className="meta-row">
                    <span>When</span>
                    <strong>{formatWhen(event.starts_at, event.ends_at, event.slot)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Venue</span>
                    <strong>{event.venue || "TBA"}</strong>
                  </div>
                  {closes ? (
                    <div className="meta-row">
                      <span>Closes</span>
                      <strong>{closes}</strong>
                    </div>
                  ) : null}
                  <div className="meta-row">
                    <span>Fee</span>
                    <strong>{formatFee(event.fee)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Team</span>
                    <strong>
                      {event.allow_individual && (event.team_max_size ?? 1) <= 1
                        ? "Solo"
                        : `${event.team_min_size ?? "—"}–${event.team_max_size ?? "—"}`}
                    </strong>
                  </div>
                  <div className="meta-row">
                    <span>Spots</span>
                    <strong>{event.spots_remaining == null ? "—" : event.spots_remaining}</strong>
                  </div>
                  {event.registration_open ? (
                    <span className="status-pill open">Registration open</span>
                  ) : (
                    <span className="status-pill closed">Registration closed</span>
                  )}
                  {event.registration_open ? (
                    <Link href={`/register/${event.id}`} className="btn btn-primary">
                      Register now
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-primary" disabled>
                      Closed
                    </button>
                  )}
                  <Link href="/events" className="btn btn-ghost">
                    Back to events
                  </Link>
                </aside>
              </>
            )}
          </div>
        </section>
      </main>
      <KratosFooter categories={categories} />
    </div>
  );
}
