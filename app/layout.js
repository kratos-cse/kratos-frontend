import { IBM_Plex_Sans, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { EventsProvider } from "@/context/EventsProvider";

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
  title: {
    default: "KRATOS'26",
    template: "%s · KRATOS'26",
  },
  description: "Discover events, register, and manage your KRATOS'26 experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlex.variable}`}>
      <body>
        <AuthProvider>
          <EventsProvider>{children}</EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
