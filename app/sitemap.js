import { fetchPublicEvents, SITE_URL } from "@/lib/site";

export const revalidate = 900;

export default async function sitemap() {
  const now = new Date();

  const pages = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
  ].map((p) => ({ ...p, lastModified: now }));

  const events = await fetchPublicEvents();
  const eventPages = events
    .filter((ev) => ev?.id)
    .map((ev) => ({
      url: `${SITE_URL}/events/${ev.id}`,
      lastModified: ev.updated_at ? new Date(ev.updated_at) : now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [...pages, ...eventPages];
}
