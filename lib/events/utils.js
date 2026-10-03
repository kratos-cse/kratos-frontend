import { formatCategory } from "./categories";
import { deriveEventUiState, findMyRegistrationForEvent } from "./registrationUiState";

export { deriveEventUiState, findMyRegistrationForEvent };

export function registrationAvailabilityLabel(availability) {
  switch (String(availability || "").toUpperCase()) {
    case "OPEN":
      return "Registration open";
    case "FULL":
      return "Event full";
    case "CLOSED":
      return "Registration closed";
    case "COMING_SOON":
      return "Coming soon";
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
  return `₹${n.toLocaleString("en-IN")}`;
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

/**
 * Team size model — keep in sync with Admin-Frontend `parseRosterStyle` / `rosterPayload`.
 * FIXED and RANGE never carry substitute slots; MEMBERS_SUBSTITUTES uses required + substitutes.
 */
export function resolveRosterStyle(rosterStyle, teamMin, teamMax, substituteCount) {
  const subs = Math.max(0, Number(substituteCount ?? 0));
  const s = String(rosterStyle || "").toUpperCase();
  if (s === "FIXED" || s === "RANGE" || s === "MEMBERS_SUBSTITUTES") {
    if ((s === "FIXED" || s === "RANGE") && subs > 0) return "MEMBERS_SUBSTITUTES";
    return s;
  }
  if (subs > 0) return "MEMBERS_SUBSTITUTES";
  const min = Number(teamMin ?? 1);
  const max = Number(teamMax ?? min);
  if (min === max) return "FIXED";
  return "RANGE";
}

/** Canonical team composition copy: "6 members + 1 substitute" */
export function formatMembersSubstitutesLine(requiredCount, substituteCount = 0) {
  const req = Number(requiredCount);
  if (!Number.isFinite(req) || req < 1) return null;
  const subs = Math.max(0, Number(substituteCount ?? 0));
  const memberWord = req === 1 ? "member" : "members";
  let line = `${req} ${memberWord}`;
  if (subs > 0) {
    const subWord = subs === 1 ? "substitute" : "substitutes";
    line += ` + ${subs} ${subWord}`;
  }
  return line;
}

export function registrationModeLabel(
  mode,
  allowIndividual,
  teamMin,
  teamMax,
  requiredCount,
  substituteCount,
  rosterStyle,
) {
  const m = String(mode || "").toUpperCase();
  const roster = formatRosterLabel(
    requiredCount,
    substituteCount,
    teamMin,
    teamMax,
    rosterStyle,
  );
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

/** e.g. "6 members + 1 substitute", "3–4 members", or "5 members" */
export function formatRosterLabel(requiredCount, substituteCount, teamMin, teamMax, rosterStyle) {
  const min =
    teamMin != null && teamMin !== ""
      ? Number(teamMin)
      : requiredCount != null && requiredCount !== ""
        ? Number(requiredCount)
        : null;
  const max =
    teamMax != null && teamMax !== ""
      ? Number(teamMax)
      : min;
  if (min == null || Number.isNaN(min)) return null;
  const mx = max != null && !Number.isNaN(max) ? max : min;
  const subsRaw = substituteCount != null && substituteCount !== "" ? Number(substituteCount) : 0;
  const style = resolveRosterStyle(rosterStyle, min, mx, subsRaw);
  const req =
    requiredCount != null && requiredCount !== ""
      ? Number(requiredCount)
      : min;
  const subs = style === "MEMBERS_SUBSTITUTES" ? Math.max(0, subsRaw) : 0;

  if (style === "MEMBERS_SUBSTITUTES") {
    if (req < 1 && subs < 1) return null;
    return formatMembersSubstitutesLine(Math.max(1, req), subs);
  }

  if (min <= 1 && mx <= 1) return null;
  if (style === "RANGE" && mx > min) return `${min}–${mx} members`;
  if (style === "FIXED" || mx === min) return mx > 1 ? `${mx} members` : null;
  if (mx > min) return `${min}–${mx} members`;
  return req > 1 ? `${req} members` : null;
}

/** @deprecated use deriveEventUiState from registrationUiState — kept for category helper consumers */
export function categoryFallbackLabel(category) {
  return formatCategory(category);
}
/** Participant-facing roster copy — e.g. "5 required members · up to 2 substitutes" */
export function formatRosterParticipantLine(
  requiredCount,
  substituteCount,
  teamMin,
  teamMax,
  rosterStyle,
) {
  const min =
    teamMin != null && teamMin !== ""
      ? Number(teamMin)
      : requiredCount != null && requiredCount !== ""
        ? Number(requiredCount)
        : null;
  const max =
    teamMax != null && teamMax !== ""
      ? Number(teamMax)
      : min;
  if (min == null || Number.isNaN(min)) return null;
  const mx = max != null && !Number.isNaN(max) ? max : min;
  const subsRaw = substituteCount != null && substituteCount !== "" ? Number(substituteCount) : 0;
  const style = resolveRosterStyle(rosterStyle, min, mx, subsRaw);
  const req =
    requiredCount != null && requiredCount !== ""
      ? Number(requiredCount)
      : min;
  const subs = style === "MEMBERS_SUBSTITUTES" ? Math.max(0, subsRaw) : 0;

  if (style === "MEMBERS_SUBSTITUTES") {
    const memberWord = req === 1 ? "member" : "members";
    if (subs > 0) {
      const subWord = subs === 1 ? "substitute" : "substitutes";
      return `${req} required ${memberWord} · up to ${subs} ${subWord}`;
    }
    if (req > 1) return `${req} required members`;
    return null;
  }
  if (style === "RANGE" && mx > min) {
    return `${min}–${mx} members per team`;
  }
  if (req > 1) return `${req} required members`;
  return null;
}
