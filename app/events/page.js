"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { EventFilters } from "@/components/events/EventFilters";
import { EventGrid } from "@/components/events/EventGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { PageTransition } from "@/components/motion/Reveal";
import { useEvents } from "@/hooks/useEvents";
import { useMyRegistrations } from "@/hooks/useMyRegistrations";
import { EVENT_CATEGORIES } from "@/lib/events/categories";

function EventsExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialCategory = searchParams.get("category");
  const validInitial =
    initialCategory && EVENT_CATEGORIES.includes(initialCategory) ? initialCategory : "ALL";

  const [category, setCategory] = useState(validInitial);
  const [query, setQuery] = useState("");

  const { events, loading, error, errorMessage, refresh } = useEvents();
  const { registrations } = useMyRegistrations();

  const onCategoryChange = useCallback(
    (next) => {
      setCategory(next);
      const params = new URLSearchParams(searchParams.toString());
      if (!next || next === "ALL") params.delete("category");
      else params.set("category", next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const counts = useMemo(() => {
    const c = { ALL: events.length };
    for (const cat of EVENT_CATEGORIES) {
      c[cat] = events.filter((e) => e.category === cat).length;
    }
    return c;
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (category !== "ALL" && e.category !== category) return false;
      if (!q) return true;
      const hay = `${e.name || ""} ${e.tagline || ""} ${e.short_desc || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [events, category, query]);

  const registrationsByEventId = useMemo(() => {
    const map = {};
    for (const r of registrations) {
      if (r?.event_id && String(r.status).toUpperCase() !== "CANCELLED") {
        map[r.event_id] = r;
      }
    }
    return map;
  }, [registrations]);

  const gridKey = `${category}::${query.trim().toLowerCase()}`;

  return (
    <PageTransition>
      <header className="stack" style={{ marginBottom: "var(--space-5)" }}>
        <h1 className="page-title">Events</h1>
        <p className="page-lead">Browse every KRATOS&apos;26 event. Filter by category and register when ready.</p>
      </header>

      <EventFilters
        category={category}
        onCategoryChange={onCategoryChange}
        query={query}
        onQueryChange={setQuery}
        counts={counts}
      />

      <div style={{ marginTop: "var(--space-5)" }}>
        {error ? (
          <ErrorState title="Couldn’t load events" description={errorMessage} onRetry={refresh} />
        ) : (
          <EventGrid
            key={gridKey}
            events={filtered}
            registrationsByEventId={registrationsByEventId}
            loading={loading}
          />
        )}
      </div>
    </PageTransition>
  );
}

export default function EventsPage() {
  return (
    <PageShell>
      <Suspense fallback={<PageSkeleton />}>
        <EventsExplorer />
      </Suspense>
    </PageShell>
  );
}
