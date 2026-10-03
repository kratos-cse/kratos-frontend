import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StaggerItem } from "@/components/motion/Reveal";
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
        title="No events here yet."
        description="Try another category."
        actionLabel="View all events"
        actionHref="/events"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {events.map((event, index) => (
        <StaggerItem key={event.id} index={index} className={styles.item}>
          <EventCard event={event} registration={registrationsByEventId[event.id]} />
        </StaggerItem>
      ))}
    </div>
  );
}
