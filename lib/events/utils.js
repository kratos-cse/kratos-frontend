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

/** e.g. "5 + 2 substitutes" or "5 members" */
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
  if (subs > 0) return `${req} + ${subs} substitutes`;
  return `${req} members`;
}

/** @deprecated use deriveEventUiState from registrationUiState — kept for category helper consumers */
export function categoryFallbackLabel(category) {
  return formatCategory(category);
}
