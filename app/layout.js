import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import BackgroundCanvas from "@/components/BackgroundCanvas";
import EventModal from "@/components/EventModal";

export const metadata = {
  title: "Kratos'26 — ACE National Symposium",
  description:
    "Kratos'26 — the ACE National Symposium at SRM Easwari Engineering College. Technical, Spark, Online and Sports events.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Bebas+Neue&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ModalProvider>
          <BackgroundCanvas />
          <div className="grid-bg" />
          <div className="grain" />
          {children}
          <EventModal />
        </ModalProvider>
      </body>
    </html>
  );
}
