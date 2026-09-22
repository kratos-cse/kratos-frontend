import { formatCategory } from "./categories";

export function formatFee(fee) {
  if (fee == null || fee === "") return "TBA";
  const n = Number(fee);
  if (Number.isNaN(n)) return String(fee);
  if (n === 0) return "Free";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatWhen(startsAt, endsAt, slot) {
  if (startsAt) {
    try {
      const d = new Date(startsAt);
      return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      /* fall through */
    }
  }
  if (slot) return String(slot).replace(/_/g, " ");
  return "Schedule TBA";
}

export function formatDateRange(startsAt, endsAt) {
  if (!startsAt && !endsAt) return null;
  try {
    const start = startsAt ? new Date(startsAt) : null;
    const end = endsAt ? new Date(endsAt) : null;
    if (start && end) {
      const sameDay = start.toDateString() === end.toDateString();
      if (sameDay) {
        return `${start.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })} · ${start.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })} – ${end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
      }
      return `${start.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })} – ${end.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
    if (start) {
      return start.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    return null;
  }
  return null;
}

export function isProfileComplete(profile) {
  if (!profile) return false;
  return Boolean(
    profile.full_name &&
      profile.phone &&
      profile.college_name &&
      profile.department &&
      profile.year_of_study
  );
}

export function registrationModeLabel(mode, allowIndividual, teamMin, teamMax) {
  const m = String(mode || "").toUpperCase();
  if (m === "INDIVIDUAL_ONLY") return "Individual";
  if (m === "TEAM_ONLY") {
    if (teamMin != null && teamMax != null) return `Team (${teamMin}–${teamMax})`;
    return "Team";
  }
  if (m === "TEAM_OR_INDIVIDUAL" || allowIndividual) {
    if (teamMin != null && teamMax != null) return `Individual or Team (${teamMin}–${teamMax})`;
    return "Individual or Team";
  }
  if (allowIndividual === false) return "Team";
  if (allowIndividual === true) return "Individual";
  return "Registration";
}

/**
 * Derive participant-facing card/detail CTA state from event + optional user registration.
 * Backend remains source of truth — this only maps known fields to UI labels.
 */
export function deriveEventUiState(event, myRegistration) {
  const eventStatus = String(event?.status || "").toUpperCase();
  const regStatus = String(myRegistration?.status || "").toUpperCase();
  const payStatus = String(myRegistration?.payment?.status || "").toUpperCase();
  const team = myRegistration?.team;
  const teamStatus = String(team?.status || "").toUpperCase();

  if (myRegistration) {
    if (regStatus === "CANCELLED") {
      return { code: "CANCELLED", label: "Cancelled", tone: "muted", cta: "register" };
    }
    if (regStatus === "CONFIRMED" || payStatus === "PAID") {
      const role = team?.members?.find?.(Boolean);
      return {
        code: "COMPLETE",
        label: "Registered",
        tone: "ok",
        cta: "view",
        teamStatus,
      };
    }
    if (payStatus === "CREATED" || payStatus === "FAILED" || (regStatus === "PENDING" && Number(event?.fee) > 0)) {
      return {
        code: payStatus === "FAILED" ? "PAYMENT_FAILED" : "PAYMENT_PENDING",
        label: payStatus === "FAILED" ? "Payment failed" : "Payment pending",
        tone: payStatus === "FAILED" ? "err" : "warn",
        cta: "pay",
      };
    }
    if (regStatus === "PENDING") {
      return { code: "PENDING", label: "Pending", tone: "warn", cta: "view" };
    }
    return { code: "REGISTERED", label: "Registered", tone: "ok", cta: "view" };
  }

  if (eventStatus === "CLOSED" || eventStatus === "CANCELLED" || eventStatus === "COMPLETED") {
    return { code: "CLOSED", label: "Closed", tone: "muted", cta: "none" };
  }
  if (event?.registration_open === false) {
    return { code: "REGISTRATION_CLOSED", label: "Registration closed", tone: "muted", cta: "none" };
  }
  if (event?.spots_remaining === 0) {
    return { code: "FULL", label: "Full", tone: "err", cta: "none" };
  }
  if (event?.registration_open === true) {
    return { code: "OPEN", label: "Open", tone: "ok", cta: "register" };
  }
  return { code: "UNKNOWN", label: formatCategory(event?.category), tone: "default", cta: "register" };
}

export function findMyRegistrationForEvent(registrations, eventId) {
  if (!Array.isArray(registrations) || !eventId) return null;
  return (
    registrations.find((r) => String(r.event_id) === String(eventId) && String(r.status).toUpperCase() !== "CANCELLED") ||
    null
  );
}
