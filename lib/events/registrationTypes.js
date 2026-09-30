/**
 * Allowed registration types from backend registration_mode only.
 * Fail closed when registration_mode is missing (misconfigured event).
 */
export function allowedRegistrationTypes(event) {
  const mode = String(event?.registration_mode || "").toUpperCase();
  if (!mode) {
    return { types: [], error: "This event has no registration mode configured." };
  }
  if (mode === "INDIVIDUAL_ONLY") {
    return { types: ["SOLO"], error: null };
  }
  if (mode === "TEAM_ONLY") {
    return { types: ["TEAM"], error: null };
  }
  if (mode === "TEAM_OR_INDIVIDUAL") {
    return { types: ["SOLO", "TEAM"], error: null };
  }
  return { types: [], error: `Unknown registration mode: ${mode}` };
}
