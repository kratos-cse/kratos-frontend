import { EventCard } from "./EventCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import styles from "./EventGrid.module.css";

export function EventGrid({ events, registrationsByEventId = {}, loading }) {
  if (loading) {
    return (
      <div className={styles.grid} aria-busy="true">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    );
  }

  if (!events?.length) {
    return (
      <EmptyState
        title="No events found"
        description="Try another category or clear your search."
        actionLabel="View all events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          registration={registrationsByEventId[event.id]}
        />
      ))}
    </div>
  );
}
