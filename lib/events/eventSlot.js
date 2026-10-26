/** Event time-of-day slot — mirrors backend derive_event_slot. */

export const EVENT_SLOT_LABELS = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
  FULL_DAY: "Full day",
  MULTI_DAY: "Multi-day",
};

/**
 * @param {string | null | undefined} startsAt ISO datetime
 * @param {string | null | undefined} endsAt ISO datetime
 * @returns {keyof typeof EVENT_SLOT_LABELS}
 */
export function deriveEventSlotFromSchedule(startsAt, endsAt) {
  if (!startsAt) return "FULL_DAY";

  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "FULL_DAY";

  if (endsAt) {
    const end = new Date(endsAt);
    if (!Number.isNaN(end.getTime())) {
      const startDay = start.toDateString();
      const endDay = end.toDateString();
      if (endDay !== startDay && end > start) return "MULTI_DAY";
    }
  }

  const hour = start.getHours();
  if (hour < 12) return "MORNING";
  if (hour < 17) return "AFTERNOON";
  return "EVENING";
}

/**
 * @param {{ slot?: string | null, starts_at?: string | null, ends_at?: string | null }} event
 * @returns {keyof typeof EVENT_SLOT_LABELS}
 */
export function resolveEventSlot(event) {
  const raw = event?.slot;
  if (raw && EVENT_SLOT_LABELS[String(raw).toUpperCase()]) {
    return String(raw).toUpperCase();
  }
  return deriveEventSlotFromSchedule(event?.starts_at, event?.ends_at);
}

/**
 * @param {{ slot?: string | null, starts_at?: string | null, ends_at?: string | null }} event
 * @returns {string}
 */
export function formatEventSlotLabel(event) {
  const key = resolveEventSlot(event);
  return EVENT_SLOT_LABELS[key] ?? key;
}
