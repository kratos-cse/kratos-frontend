import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = ["/api/", "/login", "/profile", "/registrations", "/register/", "/join/"];

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
