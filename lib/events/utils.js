import { formatCategory } from "./categories";
import { deriveEventUiState, findMyRegistrationForEvent } from "./registrationUiState";

export { deriveEventUiState, findMyRegistrationForEvent };

export function registrationAvailabilityLabel(availability) {
  switch (String(availability || "").toUpperCase()) {
    case "OPEN":
      return "Registration open";
    case "FULL":
      return "Event full";
    case "NOT_YET_OPEN":
      return "Registration opens soon";
    case "WINDOW_CLOSED":
      return "Registration closed";
    case "EVENT_CLOSED":
      return "Event closed";
    default:
      return "Status unavailable";
  }
}

export function canRegisterForEvent(event) {
  if (!event) return false;
  const availability = String(event.registration_availability || "").toUpperCase();
  if (availability) return availability === "OPEN";
  return event.registration_open === true;
}

export function formatFee(fee) {
  if (fee == null || fee === "") return "TBA";
  const n = Number(fee);
  if (Number.isNaN(n)) return String(fee);
  if (n === 0) return "Free";
  const hasFraction = Math.abs(n % 1) > 0;
  return `₹${n.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  })}`;
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

export function registrationModeLabel(mode, allowIndividual, teamMin, teamMax, requiredCount, substituteCount) {
  const m = String(mode || "").toUpperCase();
  const roster = formatRosterLabel(requiredCount, substituteCount, teamMin, teamMax);
  if (m === "INDIVIDUAL_ONLY") return "Individual";
  if (m === "TEAM_ONLY") {
    return roster ? `Team · ${roster}` : "Team";
  }
  if (m === "TEAM_OR_INDIVIDUAL" || allowIndividual) {
    return roster ? `Individual or Team · ${roster}` : "Individual or Team";
  }
  if (allowIndividual === false) return roster ? `Team · ${roster}` : "Team";
  if (allowIndividual === true) return "Individual";
  return "Registration";
}

function pluralWord(count, singular, plural) {
  return count === 1 ? singular : plural;
}

/** e.g. "5 required members · up to 2 substitutes" */
export function formatRosterLabel(requiredCount, substituteCount, teamMin, teamMax) {
  const req =
    requiredCount != null && requiredCount !== ""
      ? Number(requiredCount)
      : teamMin != null
        ? Number(teamMin)
        : null;
  let subs =
    substituteCount != null && substituteCount !== ""
      ? Number(substituteCount)
      : teamMax != null && teamMin != null
        ? Math.max(0, Number(teamMax) - Number(teamMin))
        : null;
  if (req == null || Number.isNaN(req)) return null;
  if (subs == null || Number.isNaN(subs)) subs = 0;
  if (req <= 1 && subs <= 0) return null;
  const memberWord = pluralWord(req, "member", "members");
  if (subs > 0) {
    const subWord = pluralWord(subs, "substitute", "substitutes");
    return `${req} required ${memberWord} · up to ${subs} ${subWord}`;
  }
  return `${req} required ${memberWord}`;
}

/** @deprecated use deriveEventUiState from registrationUiState — kept for category helper consumers */
export function categoryFallbackLabel(category) {
  return formatCategory(category);
}
/** Participant-facing roster copy — e.g. "5 required members · up to 2 substitutes" */
export function formatRosterParticipantLine(requiredCount, substituteCount, teamMin, teamMax) {
  const req =
    requiredCount != null && requiredCount !== ""
      ? Number(requiredCount)
      : teamMin != null
        ? Number(teamMin)
        : null;
  let subs =
    substituteCount != null && substituteCount !== ""
      ? Number(substituteCount)
      : teamMax != null && teamMin != null
        ? Math.max(0, Number(teamMax) - Number(teamMin))
        : 0;
  if (req == null || Number.isNaN(req)) return null;
  if (subs == null || Number.isNaN(subs)) subs = 0;
  if (subs > 0) return `${req} required members · up to ${subs} substitutes`;
  if (req > 1) return `${req} required members`;
  return null;
}
