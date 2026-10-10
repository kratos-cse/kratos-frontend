export const SITE_NAME = "KRATOS'26";
export const SITE_TAGLINE = "National Level Technical Symposium";
export const ORGANIZER = "Department of Computer Science and Engineering, Easwari Engineering College";
export const SITE_DESCRIPTION =
  "KRATOS'26 is the National Level Technical Symposium of the Department of Computer Science and Engineering, Easwari Engineering College, Chennai. Explore technical, playground, spark, online and title events, then register your team.";
export const SITE_KEYWORDS = [
  "KRATOS'26",
  "KRATOS 2026",
  "technical symposium",
  "national level symposium",
  "college fest",
  "Easwari Engineering College",
  "EEC Chennai",
  "CSE department",
  "Association of Computer Engineers",
  "hackathon",
  "tech events",
  "event registration",
];

function normalise(url) {
  return url.replace(/\/+$/, "");
}

/**
 * Canonical origin used for canonical links, Open Graph URLs, robots and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-domain.com).
 */
export const SITE_URL = normalise(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000",
);

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "KRATOS'26 — National Level Technical Symposium",
};

/** Server-side fetch of the public events API (skips the browser rewrite). */
export async function fetchPublicEvents() {
  const base = normalise(process.env.API_BASE_URL || "http://localhost:8000");
  try {
    const res = await fetch(`${base}/api/v1/events`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function fetchPublicEvent(eventId) {
  const base = normalise(process.env.API_BASE_URL || "http://localhost:8000");
  try {
    const res = await fetch(`${base}/api/v1/events/${encodeURIComponent(eventId)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
