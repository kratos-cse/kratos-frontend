/** Categories shown in filters and landing navigation (public catalogue). */
export const EVENT_CATEGORIES = ["TECHNICAL", "ONLINE", "TITLE_EVENT", "PROJECT_EXPO"];

/** All backend labels — includes legacy values still returned by the API. */
export const CATEGORY_LABELS = {
  TECHNICAL: "Technical",
  PLAYGROUND: "Playground",
  SPARK: "Spark",
  ONLINE: "Online",
  TITLE_EVENT: "Title Event",
  PROJECT_EXPO: "Project Expo",
};

export function formatCategory(category) {
  if (!category) return "General";
  // "CULTURAL" is the legacy name, kept so a backend that hasn't migrated yet still renders sensibly.
  const key = category === "CULTURAL" ? "TITLE_EVENT" : category;
  return CATEGORY_LABELS[key] || String(category);
}
