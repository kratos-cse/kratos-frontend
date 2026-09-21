/** Slugify a category label for /categories/[slug] */
export function categoryToSlug(category) {
  if (!category) return "uncategorized";
  return String(category)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "uncategorized";
}

export function slugToCategoryLabel(slug, events = []) {
  const match = events.find((e) => categoryToSlug(e.category) === slug);
  return match?.category || slug.replace(/-/g, " ");
}

export function uniqueCategories(events = []) {
  const map = new Map();
  for (const e of events) {
    const label = e.category || "Uncategorized";
    const slug = categoryToSlug(label);
    if (!map.has(slug)) map.set(slug, { slug, label, count: 0 });
    map.get(slug).count += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

/** Deterministic Nexus ranking — only uses fields the API provides. */
export function rankNexusEvents(events = [], limit = 4) {
  const now = Date.now();
  return [...events]
    .sort((a, b) => {
      const openDiff = Number(!!b.registration_open) - Number(!!a.registration_open);
      if (openDiff) return openDiff;
      const aStart = a.starts_at ? new Date(a.starts_at).getTime() : Infinity;
      const bStart = b.starts_at ? new Date(b.starts_at).getTime() : Infinity;
      const aDelta = Math.abs(aStart - now);
      const bDelta = Math.abs(bStart - now);
      if (aDelta !== bDelta) return aDelta - bDelta;
      return String(a.name || "").localeCompare(String(b.name || ""));
    })
    .slice(0, limit);
}

export function shortCoord(id) {
  if (!id) return "----";
  return String(id).replace(/-/g, "").slice(0, 8).toUpperCase();
}

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
