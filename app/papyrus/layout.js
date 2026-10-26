import { PAPYRUS_DESCRIPTION, PAPYRUS_EVENT_NAME, PAPYRUS_TAGLINE } from "@/data/papyrusContent";

export const metadata = {
  title: PAPYRUS_EVENT_NAME,
  description: `${PAPYRUS_TAGLINE} ${PAPYRUS_DESCRIPTION}`,
  alternates: { canonical: "/papyrus" },
  openGraph: {
    url: "/papyrus",
    title: PAPYRUS_EVENT_NAME,
    description: PAPYRUS_DESCRIPTION,
  },
};

export default function PapyrusLayout({ children }) {
  return children;
}
