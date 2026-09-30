"use client";

import { EVENT_CATEGORIES, CATEGORY_LABELS } from "@/lib/events/categories";
import { Tabs } from "@/components/ui/Tabs";
import { Input } from "@/components/ui/Input";
import styles from "./EventFilters.module.css";

export function EventFilters({
  category,
  onCategoryChange,
  query,
  onQueryChange,
  counts = {},
}) {
  const items = [
    { value: "ALL", label: "All", count: counts.ALL },
    ...EVENT_CATEGORIES.map((c) => ({
      value: c,
      label: CATEGORY_LABELS[c],
      count: counts[c],
    })),
  ];

  return (
    <div className={styles.toolbar}>
      <Tabs
        ariaLabel="Event categories"
        items={items}
        value={category || "ALL"}
        onChange={onCategoryChange}
      />
      <div className={styles.search}>
        <Input
          id="event-search"
          label="Search events"
          type="search"
          placeholder="Name, tagline, or keyword"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
