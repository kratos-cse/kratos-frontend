import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { EventsProvider } from "@/context/EventsProvider";
import SiteCursor from "@/components/effects/SiteCursor";
import {
  ORGANIZER,
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["500", "600", "700"],
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE} | Easwari Engineering College`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: ORGANIZER }],
  creator: ORGANIZER,
  publisher: "Easwari Engineering College",
  category: "education",
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "/",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050506",
  colorScheme: "dark",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#organization`,
      name: "Easwari Engineering College",
      department: { "@type": "Organization", name: "Department of Computer Science and Engineering" },
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512.png`,
      address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlex.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>
          <SiteCursor />
          <EventsProvider>{children}</EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
