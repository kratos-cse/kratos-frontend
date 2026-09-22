import { formatCategory } from "./categories";
import { deriveEventUiState, findMyRegistrationForEvent } from "./registrationUiState";

export { deriveEventUiState, findMyRegistrationForEvent };

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

/** @deprecated use deriveEventUiState from registrationUiState — kept for category helper consumers */
export function categoryFallbackLabel(category) {
  return formatCategory(category);
}
