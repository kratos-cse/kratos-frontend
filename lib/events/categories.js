/** Exact backend EventCategory values — do not invent others. */
export const EVENT_CATEGORIES = ["TECHNICAL", "PLAYGROUND", "SPARK", "ONLINE", "TITLE_EVENT"];

export const CATEGORY_LABELS = {
  TECHNICAL: "Technical",
  PLAYGROUND: "Playground",
  SPARK: "Spark",
  ONLINE: "Online",
  TITLE_EVENT: "Title Event",
};

export function formatCategory(category) {
  if (!category) return "General";
  // "CULTURAL" is the legacy name, kept so a backend that hasn't migrated yet still renders sensibly.
  const key = category === "CULTURAL" ? "TITLE_EVENT" : category;
  return CATEGORY_LABELS[key] || String(category);
}
