import { Space_Grotesk } from "next/font/google";
import "@/components/htf/LiquidEther/LiquidEther.css";
import "./htf.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-htf-space",
});

export const metadata = {
  title: "Hack the Future 2.0",
  description:
    "A 24-hour national-level hackathon by Kratos'26 at Easwari Engineering College.",
  alternates: { canonical: "/htf" },
  openGraph: {
    url: "/htf",
    title: "Hack the Future 2.0 | KRATOS'26",
    description:
      "A 24-hour hackathon where bold ideas meet real code — 14–15 Oct 2026.",
  },
};

export default function HtfLayout({ children }) {
  return <div className={spaceGrotesk.className}>{children}</div>;
}
