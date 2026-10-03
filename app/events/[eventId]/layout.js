import { formatCategory } from "@/lib/events/categories";
import { fetchPublicEvent, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

function eventDescription(event) {
  const parts = [event.tagline, event.short_description, event.description].filter(
    (v) => typeof v === "string" && v.trim(),
  );
  const base = parts[0]?.trim() || `${event.name} at ${SITE_NAME}.`;
  return base.length > 200 ? `${base.slice(0, 197)}...` : base;
}

export async function generateMetadata({ params }) {
  const event = await fetchPublicEvent(params.eventId);
  if (!event?.name) {
    return { title: "Event", robots: { index: false, follow: true } };
  }

  const description = eventDescription(event);
  const path = `/events/${params.eventId}`;
  const category = formatCategory(event.category);

  return {
    title: event.name,
    description,
    keywords: [event.name, category, SITE_NAME, "event registration"],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${event.name} · ${SITE_NAME}`,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} · ${SITE_NAME}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function EventLayout({ children, params }) {
  const event = await fetchPublicEvent(params.eventId);

  const jsonLd =
    event?.name && event.starts_at
      ? {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.name,
          description: eventDescription(event),
          startDate: event.starts_at,
          ...(event.ends_at ? { endDate: event.ends_at } : {}),
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          url: `${SITE_URL}/events/${params.eventId}`,
          image: [`${SITE_URL}${OG_IMAGE.url}`],
          location: {
            "@type": "Place",
            name: event.venue || "Easwari Engineering College",
            address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
          },
          organizer: { "@type": "Organization", name: "Easwari Engineering College", url: SITE_URL },
          ...(event.fee != null
            ? {
                offers: {
                  "@type": "Offer",
                  price: String(event.fee),
                  priceCurrency: "INR",
                  url: `${SITE_URL}/events/${params.eventId}`,
                },
              }
            : {}),
        }
      : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      {children}
    </>
  );
}
