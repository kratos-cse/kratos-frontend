"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import { useEvent, useEvents } from "@/hooks/useEvents";
import { formatFee, formatWhen, shortCoord, uniqueCategories, categoryToSlug } from "@/lib/events/utils";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const { event, loading, error } = useEvent(eventId);
  const { events } = useEvents();
  const categories = useMemo(() => uniqueCategories(events), [events]);

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
                  <p className="lede">{event.long_desc || event.short_desc || "No description provided."}</p>
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
                  {event.whatsapp_group_link && (
                    <div className="detail-block">
                      <h2>WhatsApp</h2>
                      <p>
                        <a href={event.whatsapp_group_link} target="_blank" rel="noopener noreferrer">
                          Join event group ↗
                        </a>
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
                  <div className="meta-row">
                    <span>Fee</span>
                    <strong>{formatFee(event.fee)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Team</span>
                    <strong>
                      {event.allow_individual && event.team_max_size <= 1
                        ? "Solo"
                        : `${event.team_min_size}–${event.team_max_size}`}
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
                      Register
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
