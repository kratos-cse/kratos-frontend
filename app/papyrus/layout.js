import { PAPYRUS_EVENT_NAME, PAPYRUS_TAGLINE } from "@/data/papyrusContent";

export const metadata = {
  title: PAPYRUS_EVENT_NAME,
  description:
    `${PAPYRUS_TAGLINE} Paper presentation for UG and PG students: PDF submissions (max 8 pages), prescribed PPT slides, and the presentation round on 28 October 2026 at Easwari Engineering College.`,
  alternates: { canonical: "/papyrus" },
  openGraph: {
    url: "/papyrus",
    title: PAPYRUS_EVENT_NAME,
    description:
      "KRATOS '26 paper presentation round — research PDFs, presentation slides, and shortlisted talks with Q&A.",
  },
};

export default function PapyrusLayout({ children }) {
  return children;
}
