/** Exact backend EventCategory values — do not invent others. */
export const EVENT_CATEGORIES = ["TECHNICAL", "PLAYGROUND", "SPARK", "ONLINE"];

export const CATEGORY_LABELS = {
  TECHNICAL: "Technical",
  PLAYGROUND: "Playground",
  SPARK: "Spark",
  ONLINE: "Online",
};

export function formatCategory(category) {
  if (!category) return "General";
  return CATEGORY_LABELS[category] || String(category);
}
