"use client";

import { useMemo } from "react";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import EventExplorer from "@/components/kratos/EventExplorer";
import { useEvents } from "@/hooks/useEvents";
import { categoryToSlug, uniqueCategories } from "@/lib/events/utils";

export default function CategoryLanding({ slug, title, heading }) {
  const { events, loading, error } = useEvents();
  const categories = useMemo(() => uniqueCategories(events), [events]);
  const filtered = useMemo(
    () => events.filter((event) => categoryToSlug(event.category || "Uncategorized") === slug),
    [events, slug]
  );

  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <img className="lion-watermark" src="/assets/img/lion.png" alt="" aria-hidden="true" />
        <section className="page-banner category-banner">
          <div className="container">
            <span className="eyebrow">Event Branch</span>
            <h1>{heading || title}</h1>
            <p>{loading ? "Loading events..." : `${filtered.length} events published in this branch.`}</p>
          </div>
        </section>
        <EventExplorer
          events={filtered}
          loading={loading}
          error={error}
          title={`${title} Events`}
          eyebrow="Catalogue"
          initialCategory="all"
          showSearch
          emptyMessage="No events published yet."
        />
      </main>
      <KratosFooter categories={categories} />
    </div>
  );
}
