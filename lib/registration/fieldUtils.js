export function fieldChoices(options) {
  if (!options) return [];
  if (Array.isArray(options)) return options.map(String);
  if (typeof options === "object" && options.choices) {
    return Array.isArray(options.choices) ? options.choices.map(String) : [];
  }
  return [];
}

export function visibleFields(fields) {
  return (fields || []).filter((f) => f.is_visible !== false).sort((a, b) => a.display_order - b.display_order);
}

/** Profile keys collected on leader-entered roster forms (maps to TeamMember columns). */
export const LEADER_ENTRY_PROFILE_KEYS = new Set([
  "full_name",
  "phone",
  "contact_email",
  "college_name",
  "department",
  "year_of_study",
]);

export function isCustomField(field) {
  return String(field?.source || "CUSTOM").toUpperCase() !== "PROFILE";
}

/** CUSTOM fields + PROFILE fields not covered by the standard leader-entry identity inputs. */
export function dynamicFieldsForLeaderEntry(fields) {
  return visibleFields(fields).filter((f) => {
    if (isCustomField(f)) return true;
    const key = f.profile_field_key || "";
    return key && !LEADER_ENTRY_PROFILE_KEYS.has(key);
  });
}

export function buildFieldResponses(fields, values) {
  return visibleFields(fields)
    .filter((f) => isCustomField(f))
    .filter((f) => values[f.id] !== undefined && values[f.id] !== "" && values[f.id] !== null)
    .map((f) => ({ field_id: f.id, value: values[f.id] }));
}

/**
 * @param {object} [leaderForm] — standard identity map (full_name, phone, department, …)
 */
export function validateRequiredFields(fields, values, leaderForm = null) {
  const missing = visibleFields(fields).filter((f) => {
    if (!f.required) return false;
    if (!isCustomField(f) && leaderForm) {
      const key = f.profile_field_key || "";
      if (LEADER_ENTRY_PROFILE_KEYS.has(key)) {
        const v = leaderForm[key];
        if (Array.isArray(v)) return v.length === 0;
        return v === undefined || v === null || String(v).trim() === "";
      }
    }
    const v = values[f.id];
    if (Array.isArray(v)) return v.length === 0;
    return v === undefined || v === null || String(v).trim() === "";
  });
  return missing.map((f) => f.label);
}
