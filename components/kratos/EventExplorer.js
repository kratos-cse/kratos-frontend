"use client";

import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import SectionReveal from "./SectionReveal";
import { uniqueCategories } from "@/lib/events/utils";

/**
 * Event universe explorer — filterable without relying on animation.
 */
export default function EventExplorer({
  events = [],
  loading,
  error,
  title = "Event Universe",
  eyebrow = "Discovery",
  showSearch = true,
  initialCategory = "all",
  limit,
  emptyMessage = "No events match this filter.",
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const categories = useMemo(() => uniqueCategories(events), [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = events;
    if (category !== "all") {
      list = list.filter((e) => {
        const label = e.category || "Uncategorized";
        return label.toLowerCase() === category.toLowerCase() || label === category;
      });
    }
    if (q) {
      list = list.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.short_desc?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }
    if (limit) list = list.slice(0, limit);
    return list;
  }, [events, query, category, limit]);

  return (
    <section id="universe" className="universe-sec">
      <div className="container">
        <SectionReveal className="sec-head">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>Filter by branch, search by name — every listing comes from the live catalogue.</p>
        </SectionReveal>

        <div className="explorer-controls">
          <div className="explorer-filters" role="tablist" aria-label="Category filter">
            <button
              type="button"
              role="tab"
              aria-selected={category === "all"}
              className={category === "all" ? "active" : ""}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={category === c.label}
                className={category === c.label ? "active" : ""}
                onClick={() => setCategory(c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {showSearch && (
            <label className="explorer-search">
              <span className="sr-only">Search events</span>
              <input
                type="search"
                placeholder="Search events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          )}
        </div>

        {loading && <p className="state-msg">Loading events…</p>}
        {error && (
          <p className="state-msg state-error" role="alert">
            {error.message || "Failed to load events"}
          </p>
        )}

        <div className="kx-events-grid">
          {filtered.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="state-msg">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
}
