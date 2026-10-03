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

export function buildFieldResponses(fields, values) {
  return fields
    .filter((f) => values[f.id] !== undefined && values[f.id] !== "" && values[f.id] !== null)
    .map((f) => ({ field_id: f.id, value: values[f.id] }));
}

export function validateRequiredFields(fields, values) {
  const missing = visibleFields(fields).filter((f) => {
    if (!f.required) return false;
    const v = values[f.id];
    if (Array.isArray(v)) return v.length === 0;
    return v === undefined || v === null || String(v).trim() === "";
  });
  return missing.map((f) => f.label);
}
