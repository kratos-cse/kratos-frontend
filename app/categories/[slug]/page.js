"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import KratosNav from "@/components/kratos/KratosNav";
import KratosFooter from "@/components/kratos/KratosFooter";
import EventExplorer from "@/components/kratos/EventExplorer";
import { useEvents } from "@/hooks/useEvents";
import { categoryToSlug, slugToCategoryLabel, uniqueCategories } from "@/lib/events/utils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug;
  const { events, loading, error } = useEvents();
  const categories = useMemo(() => uniqueCategories(events), [events]);
  const label = useMemo(() => slugToCategoryLabel(slug, events), [slug, events]);
  const filtered = useMemo(
    () => events.filter((e) => categoryToSlug(e.category || "Uncategorized") === slug),
    [events, slug]
  );

  return (
    <div className="page-shell">
      <KratosNav />
      <main>
        <section className="page-banner">
          <div className="container">
            <span className="eyebrow">Timeline Branch</span>
            <h1>{label}</h1>
            <p>
              {loading
                ? "Loading branch…"
                : `${filtered.length} event${filtered.length === 1 ? "" : "s"} on this node.`}
            </p>
          </div>
        </section>
        <EventExplorer
          events={filtered}
          loading={loading}
          error={error}
          title={label}
          eyebrow="Category"
          initialCategory="all"
          showSearch
        />
      </main>
      <KratosFooter categories={categories} />
    </div>
  );
}
