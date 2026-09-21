"use client";

import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import EventExplorer from "@/components/kratos/EventExplorer";
import { useEvents } from "@/hooks/useEvents";
import { uniqueCategories } from "@/lib/events/utils";
import { useMemo } from "react";

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const categories = useMemo(() => uniqueCategories(events), [events]);

  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Event Universe</span>
            <h1>All Events</h1>
            <p>Every listing is loaded from the live KRATOS catalogue. Filter by branch or search by name.</p>
          </div>
        </section>
        <EventExplorer events={events} loading={loading} error={error} title="Catalogue" eyebrow="Timeline" />
      </main>
      <KratosFooter categories={categories} />
    </div>
  );
}
